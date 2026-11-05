"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

/** Load the video once the box is this close to the viewport. */
const LOAD_MARGIN = "400px 0px";
/** If playback hasn't started this long after play(), give up and use the fallback. */
const START_TIMEOUT_MS = 1500;

/**
 * Lazy, in-view playback for a decorative muted video, with a failure signal.
 *
 * - `near` turns true once the box is within LOAD_MARGIN (mount the <video> then).
 * - Each time the box is actually in view, play() is called; it pauses when out of view.
 * - `failed` turns true (and stays true) if play() rejects or the video hasn't started
 *   playing within START_TIMEOUT_MS, e.g. iPhone Low Power Mode, which blocks autoplay.
 *   Callers then unmount the <video> and show an animated image fallback instead.
 *
 * Wire `onPlaying` to the <video>'s onPlaying event.
 */
export function useAutoplayVideo(boxRef: RefObject<HTMLElement | null>) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const started = useRef(false);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const nearIo = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: LOAD_MARGIN });
    const visibleIo = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    nearIo.observe(box);
    visibleIo.observe(box);
    return () => {
      nearIo.disconnect();
      visibleIo.disconnect();
    };
  }, [boxRef]);

  useEffect(() => {
    const video = videoRef.current;
    if (!near || failed || !video) return;
    if (!visible) {
      video.pause();
      return;
    }
    const timer = window.setTimeout(() => {
      if (!started.current) setFailed(true);
    }, START_TIMEOUT_MS);
    video.play().catch((err: unknown) => {
      // AbortError: play() was interrupted by our own pause() (scrolled away). Not a failure.
      if (err instanceof DOMException && err.name === "AbortError") return;
      setFailed(true);
    });
    return () => window.clearTimeout(timer);
  }, [near, visible, failed]);

  const onPlaying = useCallback(() => {
    started.current = true;
    setPlaying(true);
  }, []);

  return { videoRef, near, playing, failed, onPlaying };
}
