"use client";

import React, { useState, useEffect } from "react";
import { Clock, Flame } from "lucide-react";

interface OfferCountdownProps {
  endsAt: string | Date | null | undefined;
  label?: string | null;
  compact?: boolean;
  className?: string;
}

export function OfferCountdown({
  endsAt,
  label,
  compact = false,
  className = "",
}: OfferCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  } | null>(null);

  useEffect(() => {
    if (!endsAt) return;

    const targetTime = new Date(endsAt).getTime();

    const calculate = () => {
      const now = new Date().getTime();
      const diff = targetTime - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [endsAt]);

  if (!endsAt || !timeLeft || timeLeft.isExpired) {
    return null;
  }

  const { days, hours, minutes, seconds } = timeLeft;
  const pad = (n: number) => String(n).padStart(2, "0");

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1 text-[10px] font-mono text-amber-600 font-semibold uppercase tracking-wider ${className}`}
      >
        <Clock size={11} className="animate-pulse" />
        {days > 0 ? `${days}d ${pad(hours)}h` : `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`}
      </span>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-800 text-[11px] font-mono ${className}`}
    >
      <div className="flex items-center gap-1 font-bold text-amber-700">
        <Flame size={13} className="text-amber-600 animate-pulse" />
        <span>{label || "OFERTA POR TIEMPO LIMITADO"}</span>
      </div>
      <span className="text-neutral-400 font-mono">•</span>
      <div className="flex items-center gap-1 font-semibold tracking-wider">
        <Clock size={12} className="text-amber-600" />
        <span>
          {days > 0 && `${days}d `}
          {pad(hours)}h {pad(minutes)}m {pad(seconds)}s
        </span>
      </div>
    </div>
  );
}
