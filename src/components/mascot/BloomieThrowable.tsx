"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Flower2 } from "lucide-react";
import { BloomieMascot } from "@/components/mascot/BloomieMascot";

interface BloomieThrowableProps {
  onThrow?: () => void;
  className?: string;
}

export function BloomieThrowable({ onThrow, className = "" }: BloomieThrowableProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Position offset relative to home origin (0, 0)
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isFlying, setIsFlying] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [speech, setSpeech] = useState("Tarik dan lempar aku!");
  const [squish, setSquish] = useState({ scaleX: 1, scaleY: 1 });

  // Refs for smooth animation loop without re-renders
  const animFrameRef = useRef<number | null>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const velRef = useRef({ x: 0, y: 0 });
  const lastPointerRef = useRef({ x: 0, y: 0, time: 0 });
  const isDraggingRef = useRef(false);

  // Update refs when state changes
  useEffect(() => {
    posRef.current = pos;
  }, [pos]);

  const FUN_PHRASES_DRAG = [
    "Wah, aku diangkat!",
    "Siap-siap terbang!",
    "Ayo lempar aku ke atas!",
    "Wheee!",
  ];

  const FUN_PHRASES_LAND = [
    "Mendarat dengan mulus!",
    "Seru sekali!",
    "Lagi dong, lempar lagi!",
    "Magnetik! Selalu kembali padamu.",
    "Ayo mulai simulasi karir!",
  ];

  // Physics animation loop for throwing & magnetic return
  const runPhysics = useCallback(() => {
    if (isDraggingRef.current) return;

    // Apply inertia velocity
    posRef.current.x += velRef.current.x;
    posRef.current.y += velRef.current.y;

    // Apply air friction
    velRef.current.x *= 0.88;
    velRef.current.y *= 0.88;

    // Rotational decay towards neutral
    const currentRot = velRef.current.x * 2.5;
    setRotation(Math.max(-30, Math.min(30, currentRot)));

    // Bounding box limits (keep within interactive arena)
    const bounds = 140;
    if (posRef.current.x > bounds) {
      posRef.current.x = bounds;
      velRef.current.x = -velRef.current.x * 0.6;
    } else if (posRef.current.x < -bounds) {
      posRef.current.x = -bounds;
      velRef.current.x = -velRef.current.x * 0.6;
    }

    if (posRef.current.y > bounds) {
      posRef.current.y = bounds;
      velRef.current.y = -velRef.current.y * 0.6;
    } else if (posRef.current.y < -bounds) {
      posRef.current.y = -bounds;
      velRef.current.y = -velRef.current.y * 0.6;
    }

    // Magnetic spring force pulling Bloomie back to origin (0, 0)
    const springStrength = 0.045;
    const dx = 0 - posRef.current.x;
    const dy = 0 - posRef.current.y;

    velRef.current.x += dx * springStrength;
    velRef.current.y += dy * springStrength;

    // Update state position
    setPos({ x: posRef.current.x, y: posRef.current.y });

    // Check if settled back near home
    const distanceToOrigin = Math.hypot(posRef.current.x, posRef.current.y);
    const speed = Math.hypot(velRef.current.x, velRef.current.y);

    if (distanceToOrigin < 1.5 && speed < 0.2) {
      posRef.current = { x: 0, y: 0 };
      velRef.current = { x: 0, y: 0 };
      setPos({ x: 0, y: 0 });
      setRotation(0);
      setIsFlying(false);

      // Squish bounce on landing
      setSquish({ scaleX: 1.15, scaleY: 0.85 });
      setTimeout(() => setSquish({ scaleX: 1, scaleY: 1 }), 180);

      const randomLand =
        FUN_PHRASES_LAND[Math.floor(Math.random() * FUN_PHRASES_LAND.length)];
      setSpeech(randomLand);
      return;
    }

    animFrameRef.current = requestAnimationFrame(runPhysics);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    isDraggingRef.current = true;
    setIsDragging(true);
    setIsFlying(false);

    lastPointerRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: performance.now(),
    };
    velRef.current = { x: 0, y: 0 };

    const randomDrag =
      FUN_PHRASES_DRAG[Math.floor(Math.random() * FUN_PHRASES_DRAG.length)];
    setSpeech(randomDrag);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;

    const now = performance.now();
    const dt = Math.max(1, now - lastPointerRef.current.time);
    const deltaX = e.clientX - lastPointerRef.current.x;
    const deltaY = e.clientY - lastPointerRef.current.y;

    // Calculate instantaneous velocity for throwing
    velRef.current = {
      x: (deltaX / dt) * 16,
      y: (deltaY / dt) * 16,
    };

    lastPointerRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: now,
    };

    // Constrain drag range
    const maxDrag = 150;
    const newX = Math.max(-maxDrag, Math.min(maxDrag, posRef.current.x + deltaX));
    const newY = Math.max(-maxDrag, Math.min(maxDrag, posRef.current.y + deltaY));

    posRef.current = { x: newX, y: newY };
    setPos({ x: newX, y: newY });

    // Dynamic tilt based on dragging
    const tilt = Math.max(-28, Math.min(28, deltaX * 2.2));
    setRotation(tilt);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;

    isDraggingRef.current = false;
    setIsDragging(false);
    setIsFlying(true);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Fallback if pointer capture was already lost
    }

    const throwSpeed = Math.hypot(velRef.current.x, velRef.current.y);
    if (throwSpeed > 3 && onThrow) {
      onThrow();
    }

    // Launch physics simulation
    animFrameRef.current = requestAnimationFrame(runPhysics);
  };

  // Reset to origin manually
  const resetToHome = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    isDraggingRef.current = false;
    setIsDragging(false);
    setIsFlying(false);
    posRef.current = { x: 0, y: 0 };
    velRef.current = { x: 0, y: 0 };
    setPos({ x: 0, y: 0 });
    setRotation(0);
    setSpeech("Tarik dan lempar aku!");
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
      style={{ touchAction: "none" }}
    >
      {/* Speech Bubble */}
      <div
        className="mb-3 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-[#1E281F]/90 backdrop-blur-md border border-[#DEE7D0] dark:border-[#2C3E2E] shadow-sm text-[11px] font-bold text-[#354B26] dark:text-[#C5D8B4] transition-all duration-150 animate-in fade-in flex items-center gap-1.5"
      >
        <Flower2 size={12} className="text-[#788B4E] dark:text-[#9BC358] shrink-0" />
        <span>{speech}</span>
      </div>

      {/* Interactive Draggable & Throwable Arena */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
        {/* Arena Magnetic Aura Rings */}
        <div className="absolute inset-0 rounded-full border border-dashed border-[#BED0A4]/40 dark:border-[#2C3E2E]/50 animate-pulse pointer-events-none" />
        <div className="absolute inset-4 rounded-full bg-[#EEF3E2]/20 dark:bg-[#151D16]/40 pointer-events-none" />

        {/* Throwable Mascot Container */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`relative z-10 cursor-grab active:cursor-grabbing transition-transform ${
            isDragging ? "scale-105" : ""
          }`}
          style={{
            transform: `translate3d(${pos.x}px, ${pos.y}px, 0px) rotate(${rotation}deg) scale(${squish.scaleX}, ${squish.scaleY})`,
            transition: isDragging ? "none" : undefined,
          }}
          title="Tarik dan lempar Bloomie!"
        >
          {/* Subtle Shadow under Bloomie */}
          <div
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-3 rounded-full bg-black/15 dark:bg-black/40 blur-xs transition-opacity"
            style={{
              opacity: Math.max(0.2, 1 - Math.hypot(pos.x, pos.y) / 120),
            }}
          />

          <BloomieMascot
            size="lg"
            interactive={false}
            showBubble={false}
            mood={isDragging ? "surprised" : isFlying ? "happy" : "auto"}
          />
        </div>
      </div>

      {/* Control Hint & Reset */}
      <div className="mt-2 flex items-center gap-3 text-[11px] text-[#616D64] dark:text-[#9DAEA0]">
        <span className="font-medium">Tarik lalu lepaskan untuk melempar</span>
        {(pos.x !== 0 || pos.y !== 0) && (
          <button
            onClick={resetToHome}
            className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-[#556832] dark:text-[#9BC358] cursor-pointer"
            title="Kembalikan Bloomie ke sarang"
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
