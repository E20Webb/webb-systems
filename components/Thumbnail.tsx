"use client";

import React, { useState } from "react";

type ThumbnailProps = {
  image: string;
  video?: string;
  alt: string;
  caption?: string;
};

export default function Thumbnail({ image, video, alt, caption }: ThumbnailProps) {
  const hasVideo = Boolean(video);

  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [magnetic, setMagnetic] = useState({ x: 0, y: 0 });

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();

    // Parallax (video + overlays)
    const px = ((e.clientX - rect.left) / rect.width - 0.5) * 4;
    const py = ((e.clientY - rect.top) / rect.height - 0.5) * 4;
    setParallax({ x: px, y: py });

    // Magnetic hover (container)
    const mx = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
    const my = ((e.clientY - rect.top) / rect.height - 0.5) * 6;
    setMagnetic({ x: mx, y: my });
  }

  function resetEffects() {
    setParallax({ x: 0, y: 0 });
    setMagnetic({ x: 0, y: 0 });
  }

  return (
    <div
      onMouseMove={handleMove}
      onMouseLeave={resetEffects}
      style={{
        transform: `translate(${magnetic.x}px, ${magnetic.y}px)`
      }}
      className="
        relative group w-full h-full overflow-hidden rounded-md border border-neutral-800
        transition-transform duration-300 ease-out
        group-hover:rotate-[0.0deg]
        group-hover:scale-[1.05]
        group-hover:ring-1
        group-hover:ring-neutral-700
        group-hover:shadow-[0_0_25px_rgba(255,255,255,0.08)]
      "
    >

      {/* Static Image */}
      <img
        src={image}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 
          ${hasVideo ? "group-hover:opacity-0" : ""}`}
      />

      {/* Motion Video */}
      {hasVideo && (
        <video
          src={video}
          muted
          loop
          playsInline
          autoPlay
          style={{
            transform: `translate(${parallax.x}px, ${parallax.y}px) scale(1.12)`
          }}
          className="
            absolute inset-0 w-full h-full object-cover 
            opacity-0 
            transition-all duration-500 delay-100 ease-out
            group-hover:opacity-100 
            group-hover:shadow-[0_8px_20px_rgba(0,0,0,0.35)]
            group-hover:contrast-125
            group-hover:saturate-125
            group-hover:brightness-105
          "
        />
      )}

      {/* Gradient Overlay */}
      <div
        style={{
          transform: `translate(${parallax.x}px, ${parallax.y}px)`
        }}
        className="
          pointer-events-none
          absolute inset-0 
          opacity-0 
          transition-all duration-500 delay-150 ease-out
          group-hover:opacity-60
          bg-gradient-to-b from-transparent to-[rgba(0,0,0,0.25)]
        "
      />

      {/* Soft Vignette */}
      <div
        className="
          pointer-events-none
          absolute inset-0
          opacity-0
          transition-opacity duration-500 delay-250 ease-out
          group-hover:opacity-30
          bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.15)_100%)]
        "
      />

      {/* Hover Caption */}
      {caption && (
        <div
          className="
            absolute bottom-0 left-0 right-0
            px-4 py-3
            text-sm text-neutral-300
            opacity-0
            transition-opacity duration-300 delay-200
            group-hover:opacity-100
            pointer-events-none
          "
        >
          {caption}
        </div>
      )}
    </div>
  );
}