"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Decorative rotating 3D parcel, pure CSS (styles: src/app/parcel3d.css).
 * Pauses while off screen.
 */
export function SpinningParcel({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className={cn("parcel3d", !visible && "parcel3d-paused", className)}>
      <div className="parcel3d-float">
        <div className="parcel3d-box">
          <div className="parcel3d-face parcel3d-front">
            <div className="parcel3d-label">
              <i />
              <i />
              <i />
            </div>
          </div>
          <div className="parcel3d-face parcel3d-back" />
          <div className="parcel3d-face parcel3d-right" />
          <div className="parcel3d-face parcel3d-left" />
          <div className="parcel3d-face parcel3d-top" />
          <div className="parcel3d-face parcel3d-bottom" />
        </div>
        <div className="parcel3d-shadow" />
      </div>
    </div>
  );
}
