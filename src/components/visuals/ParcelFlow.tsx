"use client";

import { animate, motion } from "framer-motion";
import { useEffect, useRef, useState, type RefObject } from "react";

/*
 * Hero beam traffic: "damaged goes in, money comes out."
 *
 * Parcels ride the five input beams into Blend, staggered, 2–4 in flight (1–2 on
 * phones). The mix is drawn from a shuffled bag so it stays at 60/25/15:
 *   normal  → slips behind Blend and fades out. Nothing to claim.
 *   damaged → Blend pulses and sends a $ coin down the output beam.
 *   lost    → fades out halfway; a moment later Blend still sends a coin
 *             (we find those from tracking).
 * A coin landing pulses the "$" node lightly.
 *
 * Paths use the same quadratic as AnimatedBeam (curvature 0), so the parcels sit on
 * the drawn lines. Motion is x/y transforms + opacity only, sampled at even arc
 * length. Everything stops and unmounts while the diagram is off screen or the tab
 * is hidden, and starts fresh when it comes back.
 *
 * Artwork: parcel, damaged parcel and coin from the parcel asset sheet (beam demo).
 */

type Kind = "normal" | "damaged" | "lost";
type Path = { xs: number[]; ys: number[] };
type Trip = { id: number; kind: Kind; path: Path };
type Coin = { id: number; path: Path };

/** Seconds per parcel trip (a lost parcel stops at the halfway mark). */
const TRIP = 2.5;
const COIN_TRIP = 1.4;
/** Delay between a lost parcel vanishing and Blend sending its coin. */
const LOST_COIN_DELAY_MS = 550;
/** Points sampled along each path for the x/y keyframes. */
const SAMPLES = 32;
/** 60% normal, 25% damaged, 15% lost. */
const BAG: Kind[] = [
  ...Array<Kind>(12).fill("normal"),
  ...Array<Kind>(5).fill("damaged"),
  ...Array<Kind>(3).fill("lost"),
];
/** Parcels in flight (floor tops up immediately, cap skips a launch) and ms between launches. Phones get fewer. */
const DESKTOP = { floor: 2, cap: 4, gap: [600, 850] };
const MOBILE = { floor: 1, cap: 2, gap: [1100, 1400] };
const MOBILE_QUERY = "(max-width: 639px)";

const HUB_PULSE = 1.06;
const MONEY_PULSE = 1.035;

/* ------------------------------------------------------------------------------------------
 * Geometry
 * ---------------------------------------------------------------------------------------- */

function center(el: HTMLElement, box: DOMRect) {
  const r = el.getBoundingClientRect();
  return { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 };
}

/** AnimatedBeam's curve (M a Q mid,a.y b), resampled at even arc length. */
function beamPath(a: { x: number; y: number }, b: { x: number; y: number }): Path {
  const cx = (a.x + b.x) / 2;
  const cy = a.y;
  const at = (t: number) => {
    const u = 1 - t;
    return { x: u * u * a.x + 2 * u * t * cx + t * t * b.x, y: u * u * a.y + 2 * u * t * cy + t * t * b.y };
  };

  const DENSE = 120;
  const pts = Array.from({ length: DENSE + 1 }, (_, i) => at(i / DENSE));
  const len = [0];
  for (let i = 1; i < pts.length; i++) {
    len.push(len[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  }
  const total = len[DENSE];

  const xs: number[] = [];
  const ys: number[] = [];
  let j = 1;
  for (let i = 0; i < SAMPLES; i++) {
    const target = (total * i) / (SAMPLES - 1);
    while (j < DENSE && len[j] < target) j++;
    const span = len[j] - len[j - 1] || 1;
    const f = Math.min(1, Math.max(0, (target - len[j - 1]) / span));
    xs.push(pts[j - 1].x + (pts[j].x - pts[j - 1].x) * f);
    ys.push(pts[j - 1].y + (pts[j].y - pts[j - 1].y) * f);
  }
  return { xs, ys };
}

const evenTimes = (n: number) => Array.from({ length: n }, (_, i) => i / (n - 1));
const rand = (min: number, max: number) => min + Math.random() * (max - min);

function shuffled<T>(items: readonly T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const k = Math.floor(Math.random() * (i + 1));
    [a[i], a[k]] = [a[k], a[i]];
  }
  return a;
}

/* ------------------------------------------------------------------------------------------
 * Artwork (parcel asset sheet, beam demo: parcel, damaged parcel, coin)
 * ---------------------------------------------------------------------------------------- */

function ParcelArt({ damaged }: { damaged: boolean }) {
  return (
    <svg viewBox="-10 -10 20 20" className="size-full overflow-visible">
      <path d="M0-9 9-4.5v9L0 9-9 4.5v-9z" fill="#C49F6E" />
      <path d="M0-9 9-4.5 0 0-9-4.5z" fill="#D9B98C" />
      <path d="M0 0v9L-9 4.5v-9z" fill="#B88F5C" />
      <path d="M-4.5-6.75 4.5-2.25v2.2L-4.5-4.6z" fill="#EFE6D2" />
      {damaged && (
        <path d="M2 1l2 2-1.5 1.5 2 2" fill="none" stroke="#D1495B" strokeWidth={1.3} strokeLinecap="round" />
      )}
    </svg>
  );
}

/** Theme colors so the coin matches the "$" node (brand fill, ink "$"). */
function CoinArt() {
  return (
    <svg viewBox="-10 -10 20 20" className="size-full overflow-visible">
      <circle r="8" style={{ fill: "var(--brand)" }} />
      <circle
        r="6.25"
        fill="none"
        strokeWidth={0.75}
        style={{ stroke: "color-mix(in srgb, var(--brand), var(--ink) 15%)" }}
      />
      <text
        y="3.6"
        textAnchor="middle"
        fontFamily="system-ui, sans-serif"
        fontWeight={800}
        fontSize={10}
        style={{ fill: "var(--ink)" }}
      >
        $
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------------------------------
 * Movers
 * ---------------------------------------------------------------------------------------- */

/** Zero-size anchor moved by x/y; the art is centered on it. */
const ANCHOR = "absolute left-0 top-0";
const ART = "-translate-x-1/2 -translate-y-1/2";

function Parcel({ trip, onDone }: { trip: Trip; onDone: (trip: Trip) => void }) {
  const lost = trip.kind === "lost";
  // A lost parcel only covers the first half of its beam, fading out from ~30% to 50%.
  const n = lost ? Math.ceil(SAMPLES / 2) : SAMPLES;
  const xs = trip.path.xs.slice(0, n);
  const ys = trip.path.ys.slice(0, n);
  const duration = lost ? TRIP / 2 : TRIP;
  const times = evenTimes(n);

  return (
    <motion.div
      className={ANCHOR}
      initial={{ x: xs[0], y: ys[0], opacity: 0 }}
      animate={{ x: xs, y: ys, opacity: [0, 1, 1, 0] }}
      transition={{
        x: { duration, times, ease: "linear" },
        y: { duration, times, ease: "linear" },
        opacity: { duration, times: lost ? [0, 0.16, 0.6, 1] : [0, 0.08, 0.84, 1], ease: "linear" },
      }}
      onAnimationComplete={() => onDone(trip)}
    >
      <div className={`${ART} size-[22px] sm:size-6 lg:size-[26px] xl:size-7`}>
        <ParcelArt damaged={trip.kind === "damaged"} />
      </div>
    </motion.div>
  );
}

function CoinMover({ coin, onDone }: { coin: Coin; onDone: (coin: Coin) => void }) {
  const { xs, ys } = coin.path;
  const times = evenTimes(xs.length);
  return (
    <motion.div
      className={ANCHOR}
      initial={{ x: xs[0], y: ys[0], opacity: 0, scale: 0.6 }}
      animate={{ x: xs, y: ys, opacity: [0, 1, 1, 0], scale: [0.6, 1, 1, 0.9] }}
      transition={{
        x: { duration: COIN_TRIP, times, ease: "linear" },
        y: { duration: COIN_TRIP, times, ease: "linear" },
        opacity: { duration: COIN_TRIP, times: [0, 0.2, 0.88, 1], ease: "linear" },
        scale: { duration: COIN_TRIP, times: [0, 0.3, 0.88, 1], ease: "easeOut" },
      }}
      onAnimationComplete={() => onDone(coin)}
    >
      <div className={`${ART} size-[22px] sm:size-6 lg:size-[26px] xl:size-7`}>
        <CoinArt />
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------------------------------
 * Flow
 * ---------------------------------------------------------------------------------------- */

function pulse(el: HTMLElement | null, peak: number) {
  if (el) animate(el, { scale: [1, peak, 1] }, { duration: 0.5, ease: "easeOut" });
}

export function ParcelFlow({
  containerRef,
  laneRefs,
  hubRef,
  moneyRef,
}: {
  containerRef: RefObject<HTMLElement | null>;
  /** Input nodes, one beam each. */
  laneRefs: RefObject<HTMLElement | null>[];
  /** Blend. */
  hubRef: RefObject<HTMLElement | null>;
  /** "$". */
  moneyRef: RefObject<HTMLElement | null>;
}) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [coins, setCoins] = useState<Coin[]>([]);
  // Completion handlers live in the effect (they need its timers and counters).
  const handlers = useRef<{ parcel: (t: Trip) => void; coin: (c: Coin) => void }>({
    parcel: () => {},
    coin: () => {},
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let lanes: Path[] = [];
    let out: Path | null = null;
    const measure = () => {
      const hub = hubRef.current;
      const money = moneyRef.current;
      if (!hub || !money) return;
      const box = container.getBoundingClientRect();
      const h = center(hub, box);
      lanes = laneRefs.flatMap((r) => (r.current ? [beamPath(center(r.current, box), h)] : []));
      out = beamPath(h, center(money, box));
    };
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    measure();

    const mobile = window.matchMedia(MOBILE_QUERY);
    const timers = new Set<number>();
    const later = (fn: () => void, ms: number) => {
      const t = window.setTimeout(() => {
        timers.delete(t);
        fn();
      }, ms);
      timers.add(t);
    };

    let running = false;
    let inView = false;
    let active = 0;
    let nextId = 0;
    let bag: Kind[] = [];
    let lastLane = -1;
    const lastStart: number[] = [];

    const pickLane = () => {
      const now = performance.now();
      const all = lanes.map((_, i) => i).filter((i) => i !== lastLane);
      // Prefer beams nobody has started down recently, so parcels don't stack up.
      const clear = all.filter((i) => now - (lastStart[i] ?? -Infinity) > (TRIP * 1000) / 2);
      const pool = clear.length ? clear : all;
      const lane = pool[Math.floor(Math.random() * pool.length)];
      lastLane = lane;
      lastStart[lane] = now;
      return lane;
    };

    const config = () => (mobile.matches ? MOBILE : DESKTOP);
    const send = () => {
      if (!running || !lanes.length || active >= config().cap) return;
      if (!bag.length) bag = shuffled(BAG);
      const kind = bag.pop()!;
      active++;
      setTrips((t) => [...t, { id: nextId++, kind, path: lanes[pickLane()] }]);
    };
    const launch = () => {
      if (!running) return;
      send();
      const { gap } = config();
      later(launch, rand(gap[0], gap[1]));
    };

    const emitCoin = () => {
      if (!running || !out) return;
      pulse(hubRef.current, HUB_PULSE);
      const path = out;
      setCoins((c) => [...c, { id: nextId++, path }]);
    };

    handlers.current = {
      parcel: (trip) => {
        active = Math.max(0, active - 1);
        setTrips((t) => t.filter((x) => x.id !== trip.id));
        if (active < config().floor) send();
        if (trip.kind === "damaged") emitCoin();
        else if (trip.kind === "lost") later(emitCoin, LOST_COIN_DELAY_MS);
      },
      coin: (coin) => {
        setCoins((c) => c.filter((x) => x.id !== coin.id));
        if (running) pulse(moneyRef.current, MONEY_PULSE);
      },
    };

    const start = () => {
      running = true;
      launch();
    };
    const stop = () => {
      running = false;
      timers.forEach((t) => window.clearTimeout(t));
      timers.clear();
      active = 0;
      setTrips([]);
      setCoins([]);
    };
    const sync = () => {
      const want = inView && document.visibilityState === "visible";
      if (want && !running) start();
      else if (!want && running) stop();
    };

    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      sync();
    });
    io.observe(container);
    document.addEventListener("visibilitychange", sync);

    return () => {
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", sync);
      running = false;
      timers.forEach((t) => window.clearTimeout(t));
      handlers.current = { parcel: () => {}, coin: () => {} };
    };
  }, [containerRef, laneRefs, hubRef, moneyRef]);

  return (
    // Below the nodes (z-10): parcels slip out from under their icon tile and behind Blend,
    // coins out from behind Blend and under "$".
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5]">
      {trips.map((t) => (
        <Parcel key={t.id} trip={t} onDone={(trip) => handlers.current.parcel(trip)} />
      ))}
      {coins.map((c) => (
        <CoinMover key={c.id} coin={c} onDone={(coin) => handlers.current.coin(coin)} />
      ))}
    </div>
  );
}
