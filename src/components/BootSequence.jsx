"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const STEPS = ["LOADING EXPERIENCE", "SYNCING PROJECTS", "ACTIVATING PORTFOLIO"];
const START = [4, 34, 64], END = [34, 64, 96];

export default function BootSequence({ onComplete }) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const t0 = performance.now(), D = window.innerWidth < 768 ? 1800 : 2900;
    let raf, to, done = false;
    const finish = () => { if (done) return; done = true; cancelAnimationFrame(raf); setPct(100); to = setTimeout(onComplete, 750); };
    const tick = (t) => {
      const k = Math.min((t - t0) / D, 1);
      setPct(Math.round((k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2) * 100));
      k < 1 ? (raf = requestAnimationFrame(tick)) : finish();
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("keydown", finish); window.addEventListener("pointerdown", finish);
    return () => {
      cancelAnimationFrame(raf); clearTimeout(to);
      window.removeEventListener("keydown", finish); window.removeEventListener("pointerdown", finish);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <motion.div className="fixed inset-0 z-[200] bg-os-bg flex items-center justify-center overflow-hidden font-sans"
      exit={{ opacity: 0, scale: 1.06, filter: "blur(10px)" }} transition={{ duration: 0.7, ease: "easeInOut" }}>
      <div className="aurora" /><div className="grid-bg" />
      <div className="absolute top-5 inset-x-6 flex justify-between label"><span>RIAZ.OS / BOOT SEQUENCE</span><span>V 10.26</span></div>

      <div className="relative flex flex-col items-center w-[min(88vw,26rem)]">
        <div className="relative w-28 h-28 mb-10 flex items-center justify-center">
          <motion.span className="absolute inset-0 rounded-full border border-os-accent/20 border-t-os-accent" animate={{ rotate: 360 }} transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }} />
          <motion.span className="absolute inset-3 rounded-full border border-dashed border-os-accent/30" animate={{ rotate: -360 }} transition={{ duration: 7, repeat: Infinity, ease: "linear" }} />
          <span className="text-3xl font-bold text-gradient">RI</span>
        </div>

        <h1 className="text-xl md:text-2xl font-bold tracking-[0.3em] text-white text-center">INITIALIZING SYSTEM</h1>

        <div className="w-full h-[3px] bg-os-border rounded mt-8 overflow-hidden">
          <div className="h-full bg-os-accent shadow-[0_0_14px_#00f0ff]" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex justify-between w-full mt-2 label text-[10px]!">
          <span>{pct < 100 ? "BOOTING" : "READY"}</span><span>{String(pct).padStart(3, "0")}%</span>
        </div>

        <ul className="mt-8 w-full flex flex-col gap-3 text-xs tracking-widest">
          {STEPS.map((s, i) => {
            const state = pct >= END[i] ? "done" : pct >= START[i] ? "run" : "wait";
            return (
              <li key={s} className={`flex items-center gap-3 transition-opacity duration-300 ${state === "wait" ? "opacity-25" : "opacity-100"}`}>
                <span className="w-4 h-4 flex items-center justify-center">
                  {state === "done" && <span className="text-os-accent">✓</span>}
                  {state === "run" && <motion.span className="w-3 h-3 rounded-full border border-os-accent border-t-transparent" animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }} />}
                  {state === "wait" && <span className="w-1 h-1 rounded-full bg-os-textMuted" />}
                </span>
                <span className={state === "done" ? "text-os-textMuted" : "text-white"}>{s}</span>
              </li>
            );
          })}
        </ul>

        <div className="h-8 mt-8">
          {pct >= 100 && (
            <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-os-accent font-bold tracking-[0.35em] text-sm">SYSTEM ONLINE</motion.p>
          )}
        </div>
      </div>
      <p className="absolute bottom-6 label text-[10px]!">Press any key to skip</p>
    </motion.div>
  );
}