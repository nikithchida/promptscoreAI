"use client";

import React from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
  hoverEffect?: boolean;
  onClick?: () => void;
  delay?: number;
}

export function GlassCard({
  children,
  className,
  animate = true,
  hoverEffect = true,
  onClick,
  delay = 0,
}: GlassCardProps) {
  const baseClasses = clsx(
    "glass-panel rounded-2xl p-6 transition-all duration-300 relative overflow-hidden",
    hoverEffect && "glass-panel-hover cursor-default",
    onClick && "cursor-pointer"
  );
  const classes = twMerge(baseClasses, className);

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: delay, ease: "easeOut" }}
        className={classes}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
}
