"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    window.addEventListener("mousemove", updateMousePosition);
    
    // Hide cursor when it leaves the window
    window.addEventListener("mouseout", () => setIsVisible(false));
    window.addEventListener("mouseover", () => setIsVisible(true));

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, [isVisible]);

  // Don't render anything on mobile devices (touch screens)
  if (typeof window !== 'undefined' && window.innerWidth < 768) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[300] flex items-center justify-center mix-blend-difference"
      animate={{
        x: mousePosition.x - 16, // offset by half the width to center it
        y: mousePosition.y - 16,
        opacity: isVisible ? 1 : 0
      }}
      transition={{ type: "spring", stiffness: 800, damping: 35, mass: 0.5 }}
    >
      {/* Outer spinning ring */}
      <motion.div 
        className="absolute w-full h-full border border-os-accent rounded-full opacity-50"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      {/* Inner dot */}
      <div className="w-1.5 h-1.5 bg-os-accent rounded-full" />
    </motion.div>
  );
}