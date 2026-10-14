"use client";
import { useState, useEffect, useRef, Fragment } from "react";
import { motion, AnimatePresence, useInView, animate, useScroll, useSpring, useMotionValue, useMotionTemplate, useTransform, useVelocity, useReducedMotion } from "framer-motion";
import { Download, ArrowUpRight } from "lucide-react";
import { createPortal } from "react-dom";
import { developerProfile as p } from "./data/portfolioData";
import BootSequence from "../components/BootSequence";
import Hud, { SECTIONS } from "../components/Hud";
import ProjectModal from "../components/ProjectModal";

// "Lite" = phones, touch devices and weaker hardware: heavy effects are skipped
const isLite = () => typeof window !== "undefined" && (window.matchMedia("(max-width: 767px), (pointer: coarse)").matches || (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4);
const useLite = () => useState(isLite)[0];

const Counter = ({ to, suffix = "", dec = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.6, onUpdate: (v) => setN(v) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>{n.toFixed(dec)}{suffix}</span>;
};

// Glass panel with a spotlight that follows the cursor
const Panel = ({ children, className = "", onClick }) => (
  <div
    role={onClick ? "button" : undefined} tabIndex={onClick ? 0 : undefined}
    onClick={onClick} onKeyDown={(e) => onClick && e.key === "Enter" && onClick()}
    onMouseMove={(e) => {
      const r = e.currentTarget.getBoundingClientRect();
      e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
      e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
    }}
    className={`glass spot corners ${className}`}
  >{children}</div>
);

const Reveal = ({ children, className = "" }) => (
  <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.7, ease: "easeOut" }} className={className}>{children}</motion.div>
);

const Wipe = ({ children, delay = 0 }) => {
  const lite = useLite();
  if (lite) return <div>{children}</div>;
  return (
    <motion.div initial={{ clipPath: "inset(-30% 100% -30% -10%)" }} whileInView={{ clipPath: "inset(-30% -10% -30% -10%)" }}
      viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.9, delay, ease: [0.7, 0, 0.2, 1] }}>{children}</motion.div>
  );
};

const Heading = ({ n, label, a, b }) => (
  <div className="relative mb-10 md:mb-14">
    <span className="absolute -top-8 right-0 text-[6rem] md:text-[9rem] font-bold leading-none outline-text opacity-[.12] select-none pointer-events-none" aria-hidden="true">{n}</span>
    <p className="label text-os-accent! mb-4"><Scramble text={`${n} / ${label}`.toUpperCase()} /></p>
    <Wipe><h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] text-gradient">{a}</h2></Wipe>
    <Wipe delay={0.15}><h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] text-os-textMuted">{b}</h2></Wipe>
  </div>
);

const Section = ({ id, children }) => (
  <section id={id} className="md:min-h-screen py-14 md:py-28 flex flex-col justify-center">{children}</section>
);

const CIRCUIT = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' fill='none' stroke='%2300f0ff' stroke-width='1'%3E%3Cpath d='M0 30h40l10 10h30M60 0v50l10 10h50M20 120V80l10-10h40M90 120V90l10-10h20'/%3E%3Ccircle cx='40' cy='30' r='3'/%3E%3Ccircle cx='80' cy='40' r='3'/%3E%3Ccircle cx='70' cy='60' r='3'/%3E%3Ccircle cx='30' cy='70' r='3'/%3E%3Ccircle cx='100' cy='80' r='3'/%3E%3C/svg%3E")`;

function NeuralField() {
  const ref = useRef(null);
  useEffect(() => {
    const small = isLite();
    if (small || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = ref.current, ctx = c.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const N = 42, L = 150 * dpr;
    const pts = Array.from({ length: N }, () => ({ x: Math.random(), y: Math.random(), vx: (Math.random() - 0.5) * 0.0003, vy: (Math.random() - 0.5) * 0.0003 }));
    let w, h, raf, last = 0, on = true, m = { x: -999, y: -999 };
    const resize = () => { w = c.width = window.innerWidth * dpr; h = c.height = window.innerHeight * dpr; };
    const mv = (e) => { m = { x: e.clientX * dpr, y: e.clientY * dpr }; };
    const draw = (t) => {
      if (!on) return;
      raf = requestAnimationFrame(draw);
      if (t - last < 33) return; // ~30 fps is plenty for a background
      last = t;
      ctx.clearRect(0, 0, w, h);
      pts.forEach((q) => { q.x += q.vx * 2; q.y += q.vy * 2; if (q.x < 0 || q.x > 1) q.vx *= -1; if (q.y < 0 || q.y > 1) q.vy *= -1; });
      for (let i = 0; i < N; i++) {
        const a = pts[i], ax = a.x * w, ay = a.y * h;
        ctx.fillStyle = "rgba(0,240,255,.6)"; ctx.fillRect(ax - dpr, ay - dpr, 2 * dpr, 2 * dpr);
        for (let j = i + 1; j < N; j++) {
          const bx = pts[j].x * w, by = pts[j].y * h, d = Math.hypot(ax - bx, ay - by);
          if (d < L) { ctx.strokeStyle = `rgba(0,240,255,${(1 - d / L) * 0.18})`; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke(); }
        }
        const dm = Math.hypot(ax - m.x, ay - m.y);
        if (dm < 200 * dpr) { ctx.strokeStyle = `rgba(0,240,255,${(1 - dm / (200 * dpr)) * 0.5})`; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(m.x, m.y); ctx.stroke(); }
      }
    };
    const vis = () => { on = !document.hidden; cancelAnimationFrame(raf); if (on) raf = requestAnimationFrame(draw); };
    resize(); raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize); window.addEventListener("mousemove", mv); document.addEventListener("visibilitychange", vis);
    return () => { on = false; cancelAnimationFrame(raf); window.removeEventListener("resize", resize); window.removeEventListener("mousemove", mv); document.removeEventListener("visibilitychange", vis); };
  }, []);
  return <canvas ref={ref} className="fixed inset-0 w-full h-full -z-10 pointer-events-none" aria-hidden="true" />;
}

function Scramble({ text }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (!inView) return;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#<>/";
    let i = 0;
    const id = setInterval(() => {
      setOut(text.split("").map((ch, k) => (ch === " " || ch === "/" || k < i ? ch : chars[Math.floor(Math.random() * chars.length)])).join(""));
      i += 0.5;
      if (i > text.length) { clearInterval(id); setOut(text); }
    }, 40);
    return () => clearInterval(id);
  }, [text, inView]);
  return <span ref={ref}>{out}</span>;
}

// Robotic face plating: every coordinate derives from p.face so it can be calibrated
function RobotFace({ f }) {
  const { cx, eyeY: ey, eyeGap: g, top, chin } = f;
  const lx = cx - g, rx = cx + g, w = g * 1.75, mouth = ey + (chin - ey) * 0.5, jaw = chin - 3;
  const S = { stroke: "#00f0ff", strokeWidth: 0.35, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  const eye = (x) => (
    <g key={x}>
      <circle cx={x} cy={ey} r="3.2" fill="rgba(0,240,255,.15)" stroke="#00f0ff" strokeWidth=".4" />
      <circle cx={x} cy={ey} r="1.5" fill="#c8fbff" style={{ filter: "drop-shadow(0 0 1.5px #00f0ff)" }}>
        <animate attributeName="r" values="1.3;1.9;1.3" dur="2.2s" repeatCount="indefinite" />
      </circle>
    </g>
  );
  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" aria-hidden="true">
      <defs>
        <radialGradient id="metal" cx="50%" cy="45%" r="55%">
          <stop offset="0" stopColor="#dbe6ea" stopOpacity=".7" /><stop offset=".65" stopColor="#8fa0a8" stopOpacity=".55" /><stop offset="1" stopColor="#4b5a60" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sweep" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#00f0ff" stopOpacity="0" /><stop offset="1" stopColor="#00f0ff" stopOpacity=".55" /></linearGradient>
      </defs>
      <ellipse cx={cx} cy={(top + chin) / 2} rx={w} ry={(chin - top) / 2 + 3} fill="url(#metal)" />
      <g {...S}>
        <path d={`M${cx - w + 2} ${top + 2} H${cx + w - 2}`} />
        <path d={`M${cx} ${top - 2} V${top + 6}`} />
        <path d={`M${lx - 4} ${ey + 4} l6 6 h${g - 2}`} /><path d={`M${rx + 4} ${ey + 4} l-6 6 h-${g - 2}`} />
        <path d={`M${cx} ${ey + 2} V${ey + (chin - ey) * 0.4}`} />
        <path d={`M${lx - 2} ${jaw} L${cx} ${chin} L${rx + 2} ${jaw}`} />
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M${cx - 5} ${mouth + i * 1.6} H${cx + 5}`} />)}
        <circle cx={rx} cy={ey} r="4.4" strokeDasharray="1.2 1.2" strokeWidth=".3">
          <animateTransform attributeName="transform" type="rotate" from={`0 ${rx} ${ey}`} to={`360 ${rx} ${ey}`} dur="6s" repeatCount="indefinite" />
        </circle>
        <path d={`M${rx - 6.5} ${ey}H${rx - 4.8}M${rx + 4.8} ${ey}H${rx + 6.5}M${rx} ${ey - 6.5}V${ey - 4.8}M${rx} ${ey + 4.8}V${ey + 6.5}`} />
      </g>
      <g fill="#00f0ff">{[[lx - 4, ey + 4], [rx + 4, ey + 4], [cx - w + 2, top + 2], [cx + w - 2, top + 2], [cx - w - 1, ey - 2], [cx + w + 1, ey - 2]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r=".55" />)}</g>
      {eye(lx)}{eye(rx)}
      <rect x={cx - w} y={top} width={w * 2} height="6" fill="url(#sweep)"><animate attributeName="y" values={`${top};${chin - 4};${top}`} dur="3.4s" repeatCount="indefinite" /></rect>
      <g fontFamily="monospace" fontSize="1.9" fill="#00f0ff">
        <path d={`M${cx + w - 2} ${top + 2} L${cx + w + 4} ${top - 4} H${cx + w + 18}`} {...S} />
        <text x={cx + w + 5} y={top - 5.2}>IDENT // R.IJAZ</text><text x={cx + w + 5} y={top - 2} fillOpacity=".6">LINK 98.7%</text>
      </g>
    </svg>
  );
}

// Section jump: seven shutter panels drop in, the page jumps underneath, then they lift away (transforms only)
function Warp() {
  const [w, setW] = useState(null);
  const busy = useRef(false);
  useEffect(() => {
    const jump = (id) => {
      const el = document.getElementById(id);
      if (!el || busy.current) return;
      busy.current = true;
      const idx = SECTIONS.findIndex(([i]) => i === id);
      setW({ id, n: idx + 1, label: (SECTIONS[idx]?.[1] || id).toUpperCase() });
      setTimeout(() => el.scrollIntoView({ behavior: "instant", block: "start" }), 430);
      setTimeout(() => { setW(null); busy.current = false; }, 1250);
    };
    const click = (e) => {
      const a = e.target.closest?.('a[href^="#"]'); if (!a) return;
      const id = a.getAttribute("href").slice(1);
      if (id && document.getElementById(id)) { e.preventDefault(); jump(id); }
    };
    const ev = (e) => jump(e.detail);
    document.addEventListener("click", click); window.addEventListener("warp", ev);
    return () => { document.removeEventListener("click", click); window.removeEventListener("warp", ev); };
  }, []);
  return (
    <AnimatePresence>
      {w && (
        <motion.div key={w.id} className="fixed inset-0 z-[180] pointer-events-none flex" exit={{ opacity: 0 }} transition={{ duration: 0.1 }}>
          {Array.from({ length: 7 }, (_, i) => (
            <motion.div key={i} className="flex-1 bg-os-bg border-b-2 border-os-accent will-change-transform" initial={{ y: "-101%" }}
              animate={{ y: ["-101%", "0%", "0%", "101%"] }} transition={{ duration: 0.95, times: [0, 0.35, 0.62, 1], delay: i * 0.04, ease: "easeInOut" }} />
          ))}
          <motion.div className="absolute inset-0 flex flex-col items-center justify-center gap-2" initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }} transition={{ duration: 0.95, times: [0, 0.4, 0.62, 1], delay: 0.1 }}>
            <p className="label text-os-accent!">SECTOR {String(w.n).padStart(2, "0")}</p>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-gradient">{w.label}</h2>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Scanner line between sections
const Divider = ({ n, label }) => (
  <div className="relative h-16 md:h-24 flex items-center justify-center overflow-hidden" aria-hidden="true">
    <motion.span className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-os-accent/60 to-transparent origin-center" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, margin: "-20%" }} transition={{ duration: 1.1, ease: "easeOut" }} />
    <span className="comet absolute left-0 h-px w-24 bg-gradient-to-r from-transparent to-white" />
    <motion.div initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-20%" }} transition={{ delay: 0.5 }}
      className="relative border border-os-accent/30 bg-os-bg rounded-full px-5 py-2 label flex items-center gap-3">
      <i className="w-1.5 h-1.5 rounded-full bg-os-accent animate-pulse" />SECTOR {n} <b className="font-normal text-white">{label}</b><span className="text-os-accent">▼</span>
    </motion.div>
  </div>
);

function Cyborg() {
  const R = 125;
  const lite = useLite();
  const [live, setLive] = useState(false);
  const [locked, setLocked] = useState(false);
  const [ok, setOk] = useState(true);
  const [wet, setWet] = useState(false);
  const [rip, setRip] = useState(0);
  const mx = useMotionValue(180), my = useMotionValue(150);
  const x = useSpring(mx, { stiffness: 260, damping: 30 }), y = useSpring(my, { stiffness: 260, damping: 30 });
  const r = useMotionValue(0);
  const r2 = useTransform(r, (v) => v * 0.94);
  const mask = useMotionTemplate`radial-gradient(circle ${r}px at ${x}px ${y}px, #000 62%, transparent 100%)`;
  const mask2 = useMotionTemplate`radial-gradient(circle ${r2}px at ${x}px ${y}px, #000 62%, transparent 100%)`;
  const ringO = useTransform(r, [0, 90, 140, 400], [0, 1, 1, 0]);
  const ringX = useTransform(x, (v) => v - R), ringY = useTransform(y, (v) => v - R);
  const grow = (t) => animate(r, t, { duration: 0.55, ease: "easeOut", onComplete: () => { if (t === 0) { setWet(false); setLive(false); } } });
  const move = (e) => { const b = e.currentTarget.getBoundingClientRect(); mx.set(e.clientX - b.left); my.set(e.clientY - b.top); };
  const toggle = () => { setLive(true); setWet(true); setRip((n) => n + 1); setLocked(!locked); grow(locked ? (lite ? 0 : R) : 700); };
  const sil = { WebkitMaskImage: `url(${p.portrait})`, maskImage: `url(${p.portrait})`, WebkitMaskSize: "contain", maskSize: "contain",
    WebkitMaskPosition: "center", maskPosition: "center", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat" };
  const fadeImg = "linear-gradient(to bottom,#000 66%,transparent 100%),linear-gradient(to right,transparent 0,#000 18%,#000 82%,transparent 100%)";
  const fadeLite = "linear-gradient(to bottom,#000 66%,transparent 100%)";
  const fade = lite ? { WebkitMaskImage: fadeLite, maskImage: fadeLite } : { WebkitMaskImage: fadeImg, maskImage: fadeImg, WebkitMaskComposite: "source-in", maskComposite: "intersect" };
  const imgCls = "absolute inset-0 w-full h-full object-contain object-center select-none pointer-events-none";
  const grid = "linear-gradient(rgba(0,240,255,.14) 1px,transparent 1px),linear-gradient(90deg,rgba(0,240,255,.14) 1px,transparent 1px)";

  return (
    <div className="relative w-full h-full">
      {/* Liquid filter: applied ONLY to the grey background disc, never to the face */}
      {wet && !lite && <svg width="0" height="0" className="absolute" aria-hidden="true"><defs>
        <filter id="water" x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="2" seed="3" result="n">
            <animate attributeName="baseFrequency" dur="8s" values="0.012 0.02;0.022 0.012;0.012 0.02" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="38" xChannelSelector="R" yChannelSelector="G" />
        </filter></defs></svg>}

      <div className="absolute inset-0" onMouseMove={move} onMouseEnter={() => { setLive(true); setWet(true); !locked && grow(R); }} onMouseLeave={() => !locked && grow(0)} onClick={toggle}>
        {/* Three rings, concentric with the portrait */}
        <div className="absolute inset-0 pointer-events-none">
          {[0, 1, 2].map((k) => (
            <div key={k} className={`absolute rounded-full border border-os-accent/25 ${k === 1 ? "border-dashed" : ""} ${k % 2 ? "spin-b" : "spin-a"}`} style={{ inset: `${k * 9}%`, "--d": `${28 + k * 14}s` }}>
              <i className="absolute -top-1 left-1/2 w-2 h-2 rounded-full bg-os-accent shadow-[0_0_14px_#00f0ff]" />
            </div>
          ))}
        </div>
        {ok ? (
          <>
            <div className="absolute inset-0" style={fade}>
              <img src={p.portrait} alt={`Portrait of ${p.firstName} ${p.lastName}`} className={imgCls} decoding="async" onError={() => setOk(false)} />
              {live && (<>
              {/* 1. grey, liquid-edged background disc */}
              <div className="absolute inset-0 pointer-events-none" style={{ filter: wet && !lite ? "url(#water)" : "none" }}>
                <motion.div className="absolute inset-0" style={{ WebkitMaskImage: mask, maskImage: mask, backgroundColor: "rgba(118,128,134,.6)", backgroundImage: grid, backgroundSize: "24px 24px" }} />
              </div>
              {/* 2. robotic version of the person (crisp, undistorted) */}
              <motion.div className="absolute inset-0 pointer-events-none" style={{ WebkitMaskImage: mask2, maskImage: mask2 }}>
                <img src={p.portrait} alt="" aria-hidden className={imgCls} style={{ filter: "grayscale(1) contrast(1.25) brightness(.92) drop-shadow(0 0 8px rgba(0,240,255,.7))" }} />
                <div className="absolute inset-0 mix-blend-overlay" style={{ ...sil, backgroundColor: "rgba(0,240,255,.6)" }} />
                <div className="absolute inset-0 mix-blend-screen opacity-90"
                  style={{ ...sil, backgroundSize: "120px 120px, auto", backgroundImage: `${CIRCUIT}, repeating-linear-gradient(0deg, rgba(0,240,255,.3) 0 1px, transparent 1px 4px)` }} />
              <RobotFace f={p.face} />
              </motion.div>
              </>)}
            </div>
            {live && (<>
            <motion.div className="absolute top-0 left-0 rounded-full border border-os-accent/60 pointer-events-none" style={{ width: R * 2, height: R * 2, x: ringX, y: ringY, opacity: ringO }}>
              <i className="absolute left-1/2 top-0 h-3 w-px bg-os-accent" /><i className="absolute left-1/2 bottom-0 h-3 w-px bg-os-accent" />
              <i className="absolute top-1/2 left-0 w-3 h-px bg-os-accent" /><i className="absolute top-1/2 right-0 w-3 h-px bg-os-accent" />
            </motion.div>
            <motion.div className="absolute top-0 left-0 pointer-events-none" style={{ width: R * 2, height: R * 2, x: ringX, y: ringY }}>
              {rip > 0 && <motion.span key={rip} className="absolute inset-0 rounded-full border-2 border-os-accent" initial={{ scale: 0.3, opacity: 0.9 }} animate={{ scale: 2.2, opacity: 0 }} transition={{ duration: 1, ease: "easeOut" }} />}
            </motion.div>
            </>)}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-7xl font-bold text-gradient">RI</div>
        )}
      </div>
      <p className="label absolute -bottom-8 inset-x-0 text-center">Move to reveal · Click to {locked ? "unlock" : "lock"} circuit view</p>
    </div>
  );
}

function HeroVisual() {
  const W = 640, H = 560, cx = 185.6, cy = 280, ring = 152, bx = 450;
  const angles = [-52, -26, 0, 26, 52], ys = [105, 192, 280, 368, 455];
  const lines = angles.map((a, k) => {
    const t = (a * Math.PI) / 180, ax = cx + ring * Math.cos(t), ay = cy + ring * Math.sin(t), by = ys[k];
    return { ax, ay, by, d: `M${ax} ${ay} C${ax + 95} ${ay} ${bx - 95} ${by} ${bx} ${by}` };
  });
  return (
    <div className="relative w-full max-w-[40rem] mx-auto md:aspect-[640/560] mb-10">
      <div className="relative mx-auto w-[78%] aspect-square md:absolute md:w-[58%] md:left-0 md:top-[16.9%] md:mx-0"><Cyborg /></div>
      <div className="md:hidden no-scrollbar flex overflow-x-auto snap-x snap-mandatory gap-3 -mx-6 px-6 mt-14 pb-2">
        {p.modules.map(([code, name, sub]) => (
          <div key={code} className="glass rounded-lg px-4 py-3 min-w-[58%] snap-center shrink-0">
            <span className="label text-os-accent! text-[9px]!">{code}</span>
            <b className="block text-white text-[13px] leading-tight">{name}</b>
            <span className="block text-[10px] text-os-textMuted">{sub}</span>
          </div>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="hidden md:block absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
        <defs><linearGradient id="ln" x1="0" x2="1"><stop offset="0" stopColor="#00f0ff" stopOpacity=".2" /><stop offset="1" stopColor="#00f0ff" stopOpacity=".85" /></linearGradient></defs>
        {lines.map((l, k) => (
          <g key={k}>
            <motion.path d={l.d} fill="none" stroke="url(#ln)" strokeWidth="1.3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 0.5 + k * 0.12 }} />
            <circle cx={l.ax} cy={l.ay} r="3.5" fill="#00f0ff" style={{ filter: "drop-shadow(0 0 5px #00f0ff)" }} />
            <circle cx={bx} cy={l.by} r="3" fill="#00f0ff" />
            <circle r="2.6" fill="#fff" style={{ filter: "drop-shadow(0 0 4px #00f0ff)" }}>
              <animateMotion dur="2.8s" begin={`${k * 0.5}s`} repeatCount="indefinite" path={l.d} />
            </circle>
          </g>
        ))}
      </svg>
      {p.modules.map(([code, name, sub], k) => (
        <div key={code} className="hidden md:block absolute right-0 w-[29.7%] -translate-y-1/2" style={{ top: `${(ys[k] / H) * 100}%` }}>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + k * 0.12, duration: 0.6 }} className="glass rounded-md px-3 py-2">
            <span className="label text-os-accent! text-[9px]!">{code}</span>
            <b className="block text-white text-[13px] leading-tight">{name}</b>
            <span className="block text-[10px] text-os-textMuted">{sub}</span>
          </motion.div>
        </div>
      ))}
    </div>
  );
}

function Hero() {
  const rings = [0, 1, 2];
  return (
    <Section id="home">
      <div className="grid lg:grid-cols-[0.9fr_1.3fr] gap-10 items-center">
        <div>
          <span className="label inline-flex items-center gap-2 border border-os-border rounded-full px-3 py-1.5 mb-6 md:mb-8">
            <i className="w-1.5 h-1.5 rounded-full bg-os-accent animate-pulse" />{p.availability}
          </span>
          <p className="text-os-textMuted text-lg mb-2">Hi, I'm</p>
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[clamp(4.5rem,8.5vw,8rem)] font-bold tracking-tighter leading-[0.85] text-gradient">
            {p.firstName}<br />{p.lastName}
          </h1>
          <h2 className="mt-8 text-xl md:text-2xl text-white">{p.title}</h2>
          <p className="label mt-2 text-os-accent!"><Scramble text={p.tagline} /></p>
          <p className="mt-6 max-w-md text-os-textMuted leading-relaxed">{p.intro}</p>
          <div className="grid grid-cols-2 gap-3 md:flex md:flex-wrap md:gap-4 mt-8 md:mt-10 text-sm font-medium">
            <a href="#contact" className="text-center bg-os-accent text-os-bg px-4 py-2.5 md:px-7 md:py-3.5 text-[13px] md:text-sm rounded-full hover:shadow-[0_0_30px_rgba(0,240,255,.5)] transition-shadow">Hire me</a>
            <a href="#portfolio" className="text-center border border-os-border px-4 py-2.5 md:px-7 md:py-3.5 text-[13px] md:text-sm rounded-full hover:border-os-accent transition-colors">View my work ↓</a>
          </div>
          <div className="grid grid-cols-3 divide-x divide-os-border md:divide-x-0 border border-os-border/70 bg-os-panel/40 rounded-xl py-4 md:border-0 md:bg-transparent md:rounded-none md:py-0 md:gap-6 xl:gap-10 mt-10 md:mt-14">
            {p.stats.map((s) => (
              <div key={s.label} className="text-center md:text-left px-2 md:px-0">
                <div className="text-3xl font-bold text-white"><Counter to={s.to} suffix={s.suffix} dec={s.dec} /></div>
                <div className="text-[11px] md:text-xs text-os-textMuted mt-1 max-w-[110px] mx-auto md:mx-0">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <HeroVisual />
      </div>
    </Section>
  );
}

function About() {
  const rows = [["Location", p.location], ["Email", p.email], ["Education", "BS CS · UET Taxila"], ["CGPA", "3.66 / 4.0"]];
  return (
    <Section id="about">
      <Heading n="02" label="Profile" a="Built for the space" b="between idea and impact." />
      <div className="grid md:grid-cols-2 gap-12">
        <Reveal className="flex flex-col gap-5 text-os-textMuted leading-relaxed max-w-lg">
          {p.about.map((t, i) => <p key={i}>{t}</p>)}
          <a href={p.cv} download className="inline-flex items-center gap-2 text-os-accent text-sm mt-2 hover:text-white transition-colors"><Download size={16} /> Download CV</a>
        </Reveal>
        <Reveal>
          <Panel className="p-5 md:p-8 grid grid-cols-2 gap-5 md:gap-8">
            {rows.map(([k, v]) => (
              <div key={k}><p className="label mb-1">{k}</p><p className="text-white text-sm break-all">{v}</p></div>
            ))}
            <div className="col-span-2 flex flex-wrap gap-2 pt-6 border-t border-os-border">
              {p.specialties.map((s) => <span key={s} className="text-xs border border-os-border rounded-full px-3 py-1">{s}</span>)}
            </div>
          </Panel>
        </Reveal>
      </div>
    </Section>
  );
}

function Arsenal() {
  const layers = p.layers, n = layers.length, gap = 46;
  const lite = useLite();
  const [a, setA] = useState(0);
  const all = [...new Set(layers.flatMap((l) => l.items))];
  const grid = "linear-gradient(rgba(0,240,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(0,240,255,.12) 1px,transparent 1px)";
  const edge = "linear-gradient(to right,transparent,#000 12%,#000 88%,transparent)";

  return (
    <Section id="skills">
      <Heading n="03" label="Technology stack" a="A full stack," b="layer by layer." />
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        {/* 3D exploded stack */}
        <div className="relative h-[17rem] md:h-[30rem] flex items-center justify-center" style={{ perspective: "1400px" }} aria-hidden="true">
          <motion.div className="relative w-40 h-40 md:w-64 md:h-64" style={{ transformStyle: "preserve-3d" }}
            initial={{ rotateX: 58, rotateZ: -40 }} animate={{ rotateX: 58, rotateZ: lite ? -40 : [-40, -32, -40] }} transition={lite ? { duration: 0 } : { duration: 14, repeat: Infinity, ease: "easeInOut" }}>
            {layers.map((l, k) => {
              const on = k === a, lift = k < a ? 46 : on ? 14 : 0;
              const z = (n - 1 - k) * gap - ((n - 1) * gap) / 2 + lift;
              return (
                <button key={l.name} tabIndex={-1} onClick={() => setA(k)} onMouseEnter={() => setA(k)}
                  className={`absolute inset-0 rounded-2xl border transition-[transform,background-color,border-color,box-shadow] duration-500 ${on ? "border-os-accent bg-os-accent/15 shadow-[0_0_50px_rgba(0,240,255,.4)] max-md:shadow-none" : "border-os-accent/25 bg-os-panel/80 hover:border-os-accent/60"}`}
                  style={{ transform: `translateZ(${z}px)` }}>
                  <span className="absolute inset-0 rounded-2xl opacity-40" style={{ backgroundImage: grid, backgroundSize: "22px 22px" }} />
                  <span className="absolute inset-5 grid grid-cols-4 gap-3 content-start">
                    {l.items.slice(0, 8).map((_, j) => (
                      <i key={j} className={`h-3 rounded-sm transition-all duration-500 ${on ? "bg-os-accent shadow-[0_0_10px_#00f0ff]" : "bg-os-accent/25"}`} style={{ transitionDelay: `${j * 30}ms` }} />
                    ))}
                  </span>
                  <span className="absolute left-4 bottom-3 label text-[9px]! text-os-accent!">0{k + 1} · {l.name}</span>
                </button>
              );
            })}
          </motion.div>
        </div>

        {/* Layer list */}
        <div className="flex flex-col gap-3" role="tablist">
          {layers.map((l, k) => (
            <div key={l.name}>
              <button role="tab" aria-selected={k === a} onClick={() => setA(k)}
                className={`w-full flex items-center gap-4 text-left px-5 py-4 rounded-lg border transition-all ${k === a ? "border-os-accent bg-os-accent/10 shadow-[0_0_24px_rgba(0,240,255,.15)]" : "border-os-border hover:border-os-accent/50"}`}>
                <span className="label text-os-accent! text-[10px]!">0{k + 1}</span>
                <span className="flex-1"><b className="block text-white">{l.name}</b><span className="text-xs text-os-textMuted">{l.blurb}</span></span>
                <span className="label text-[10px]!">{String(l.items.length).padStart(2, "0")}</span>
              </button>
              <AnimatePresence initial={false}>
                {k === a && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                    <div className="flex flex-wrap gap-2 px-2 pt-4 pb-1">
                      {l.items.map((it, j) => (
                        <motion.span key={it} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: j * 0.04 }}
                          className="text-xs border border-os-accent/40 bg-os-accent/5 rounded-full px-3 py-1 text-white">{it}</motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 md:mt-16 flex flex-col gap-3 overflow-hidden edge-fade">
        {[0, 1].map((r) => (
          <div key={r} className={`marquee-track flex ${r ? "[animation-direction:reverse] max-md:hidden" : ""}`}>
            {[...all, ...all].map((s, k) => <span key={k} className="shrink-0 mr-3 text-xs border border-os-border rounded-full px-4 py-1.5 text-os-textMuted">{s}</span>)}
          </div>
        ))}
      </div>
    </Section>
  );
}

function Services() {
  return (
    <Section id="services">
      <Heading n="05" label="Services" a="What I can" b="build for you." />
      <div className="grid sm:grid-cols-2 gap-5">
        {p.services.map((s) => (
          <Reveal key={s.code}>
            <Panel className="p-5 md:p-7 h-full">
              <span className="absolute right-5 top-3 text-6xl font-bold outline-text opacity-20 select-none">{s.code}</span>
              <h3 className="text-xl font-bold text-white pr-16">{s.title}</h3>
              <p className="text-sm text-os-textMuted mt-3 leading-relaxed">{s.text}</p>
              <p className="label text-[10px]! mt-6 mb-2">Proof</p>
              <div className="flex flex-wrap gap-2">{s.proof.map((x) => <span key={x} className="text-xs border border-os-accent/40 bg-os-accent/5 rounded-full px-3 py-1 text-white">{x}</span>)}</div>
            </Panel>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-10">
        <a href="#contact" className="inline-flex items-center gap-2 bg-os-accent text-os-bg font-medium rounded-full px-7 py-3.5 hover:shadow-[0_0_30px_rgba(0,240,255,.5)] transition-shadow">Start a project <ArrowUpRight size={16} /></a>
      </Reveal>
    </Section>
  );
}

function TerminalSection() {
  const ed = p.education;
  const [lines, setLines] = useState([{ t: "out", s: "RIAZ.OS v10.26  ·  type 'help' to list commands" }]);
  const [v, setV] = useState("");
  const box = useRef(null), inp = useRef(null);
  const cmds = {
    help: () => ["Commands: whoami · about · skills · projects · education · certs · contact · cv · ai · clear"],
    whoami: () => [`${p.firstName} ${p.lastName} · ${p.title}`, p.intro],
    about: () => p.about,
    skills: () => p.layers.map((l) => `${l.name.padEnd(13)}${l.items.join(", ")}`),
    projects: () => p.projects.map((x) => `${x.id}  ${x.title}: ${x.summary}`),
    education: () => [`${ed.degree}, ${ed.school}`, `${ed.period} · CGPA ${ed.cgpa}`, ...ed.earlier.map(([a, , m]) => `${a}: ${m}`)],
    certs: () => p.certificates.map((c) => `${c.date}  ${c.title} (${c.issuer})`),
    contact: () => [`email     ${p.email}`, `github    ${p.links.github}`, `linkedin  ${p.links.linkedin}`],
    cv: () => { const a = document.createElement("a"); a.href = p.cv; a.download = ""; a.click(); return ["Downloading CV…"]; },
    ai: () => { window.dispatchEvent(new Event("openchat")); return ["Opening RIAZ.AI…"]; },
  };
  useEffect(() => { if (box.current) box.current.scrollTop = box.current.scrollHeight; }, [lines]);
  const run = (raw) => {
    const c = raw.trim().toLowerCase(); setV("");
    if (!c) return;
    if (c === "clear") return setLines([]);
    const out = cmds[c] ? cmds[c]() : [`command not found: ${c}. Try 'help'.`];
    setLines((l) => [...l, { t: "in", s: raw }, ...out.map((s) => ({ t: "out", s }))]);
  };
  return (
    <Section id="terminal">
      <Heading n="08" label="Access terminal" a="Prefer a command line?" b="Type to explore." />
      <Reveal>
        <Panel className="overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-os-border">
            <i className="w-2.5 h-2.5 rounded-full bg-os-accent/80" /><i className="w-2.5 h-2.5 rounded-full bg-os-accent/40" /><i className="w-2.5 h-2.5 rounded-full bg-os-accent/20" />
            <span className="label text-[10px]! ml-3">riaz@portfolio: ~</span>
          </div>
          <div ref={box} onClick={() => inp.current?.focus()} className="h-72 overflow-y-auto p-5 text-xs md:text-sm leading-relaxed whitespace-pre-wrap break-words">
            {lines.map((l, i) => (
              <div key={i} className={l.t === "in" ? "text-white" : "text-os-textMuted"}>{l.t === "in" && <span className="text-os-accent">riaz@portfolio:~$ </span>}{l.s}</div>
            ))}
          </div>
          <div className="flex items-center gap-2 px-5 py-3 border-t border-os-border text-xs md:text-sm">
            <span className="text-os-accent shrink-0">riaz@portfolio:~$</span>
            <input ref={inp} value={v} onChange={(ev) => setV(ev.target.value)} onKeyDown={(ev) => ev.key === "Enter" && run(v)} placeholder="type a command"
              autoCapitalize="off" autoCorrect="off" spellCheck={false} aria-label="Terminal command"
              className="flex-1 min-w-0 bg-transparent outline-none text-white text-base md:text-sm placeholder:text-os-textMuted" />
          </div>
          <div className="flex flex-wrap gap-2 px-5 pb-5">
            {["help", "skills", "projects", "education", "certs", "contact", "cv", "ai"].map((c) => (
              <button key={c} onClick={() => run(c)} className="text-xs border border-os-border rounded-full px-3 py-1.5 text-os-textMuted hover:border-os-accent hover:text-white transition-colors">{c}</button>
            ))}
          </div>
        </Panel>
      </Reveal>
    </Section>
  );
}

function Ticker() {
  const items = [...p.stats.map((s) => `${s.to}${s.suffix} ${s.label}`.toUpperCase()), `CGPA ${p.education.cgpa}`, "REACT · FASTAPI · TENSORFLOW · UNITY", p.availability.toUpperCase()];
  return (
    <div className="overflow-hidden border-y border-os-border py-3 -mx-6 md:mx-0" aria-hidden="true">
      <div className="marquee-track flex label whitespace-nowrap">
        {[...items, ...items].map((t, k) => <span key={k} className="mr-10 flex items-center gap-10">{t}<i className="w-1 h-1 rounded-full bg-os-accent" /></span>)}
      </div>
    </div>
  );
}

function CaseStudy() {
  const c = p.caseStudy;
  return (
    <div className="mt-16 md:mt-20">
      <p className="label text-os-accent! mb-4">{c.kicker}</p>
      <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-gradient max-w-3xl">{c.title}</h3>
      <p className="text-os-textMuted mt-4 max-w-2xl leading-relaxed">{c.lead}</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-10">
        {c.steps.map(([code, title, text]) => (
          <Reveal key={code}>
            <Panel className="p-4 md:p-5 h-full">
              <span className="label text-os-accent! text-[10px]!">{code}</span>
              <h4 className="text-white font-semibold mt-1 text-sm md:text-base">{title}</h4>
              <p className="text-[11px] md:text-xs text-os-textMuted mt-2 leading-relaxed">{text}</p>
            </Panel>
          </Reveal>
        ))}
      </div>
      <Panel className="p-6 md:p-8 mt-4 md:mt-6">
        <p className="label mb-5">The accuracy paradox</p>
        <div className="flex flex-col gap-5">
          {c.bars.map(([label, v, hot], k) => (
            <div key={label}>
              <div className="flex justify-between gap-4 text-xs md:text-sm mb-2"><span className="text-os-textMain">{label}</span><span className={hot ? "text-os-accent font-bold" : "text-white"}>{v}%</span></div>
              <div className="h-2 rounded-full bg-os-border overflow-hidden">
                <motion.div className={`h-full rounded-full ${hot ? "bg-os-accent shadow-[0_0_12px_#00f0ff]" : "bg-os-textMuted"}`} initial={{ width: 0 }} whileInView={{ width: `${v}%` }}
                  viewport={{ once: true }} transition={{ duration: 1, delay: k * 0.15, ease: "easeOut" }} />
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs md:text-sm text-os-textMuted mt-6 max-w-2xl leading-relaxed">{c.note}</p>
      </Panel>
    </div>
  );
}

function Work({ onOpen }) {
  const [i, setI] = useState(0);
  const pr = p.projects[i];
  const nodes = ["INPUT", ...pr.tags.slice(0, 4), "OUTPUT"];
  const metrics = pr.metrics || [[String(pr.tags.length), "Core technologies"]];
  return (
    <Section id="portfolio">
      <Heading n="04" label="Project matrix" a="Selected systems." b="Real product territory." />
      <div className="grid lg:grid-cols-[320px_1fr] gap-6">
        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2" role="tablist">
          {p.projects.map((q, k) => (
            <button key={q.id} role="tab" aria-selected={k === i} onClick={() => setI(k)} onMouseEnter={() => setI(k)}
              className={`text-left shrink-0 w-60 lg:w-auto rounded-lg border px-4 py-3 transition-all ${k === i ? "border-os-accent bg-os-accent/10 shadow-[0_0_24px_rgba(0,240,255,.15)] lg:translate-x-2" : "border-os-border hover:border-os-accent/50"}`}>
              <span className="label text-[10px]! text-os-accent!">{q.id}</span>
              <span className="block text-white font-semibold leading-snug">{q.title}</span>
              <span className="block text-[11px] text-os-textMuted">{q.category}</span>
            </button>
          ))}
        </div>

        <Panel className="min-h-[440px] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-os-border label text-[10px]!">
            <span>PROJECT // {pr.id}</span>
            <span className="text-os-accent flex items-center gap-2"><i className="w-1.5 h-1.5 rounded-full bg-os-accent animate-pulse" />{String(i + 1).padStart(2, "0")} / {String(p.projects.length).padStart(2, "0")}</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={pr.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}
              className="relative p-5 md:p-10 flex flex-col gap-6 md:gap-7">
              <span className="absolute right-6 top-2 text-[6rem] md:text-[9rem] font-bold leading-none text-os-accent/[0.06] select-none pointer-events-none">{pr.id.replace(/\D/g, "")}</span>
              {pr.award && <span className="self-start bg-os-accent text-os-bg text-[11px] font-bold px-3 py-1 rounded-full">{pr.award}</span>}
              <div className="relative max-w-xl">
                <p className="label text-os-accent! mb-2">{pr.category}</p>
                <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-gradient">{pr.title}</h3>
                <p className="text-os-textMuted mt-3 leading-relaxed">{pr.summary}</p>
              </div>

              <div>
                <p className="label mb-3 text-[10px]!">Data flow</p>
                <div className="flex flex-wrap items-center gap-y-3">
                  {nodes.map((n, k) => (
                    <Fragment key={n + k}>
                      <span className={`text-[11px] rounded px-2.5 py-1.5 border ${k === 0 || k === nodes.length - 1 ? "border-os-border text-os-textMuted" : "border-os-accent/50 bg-os-accent/5 text-white"}`}>{n}</span>
                      {k < nodes.length - 1 && (
                        <span className="relative w-8 h-px bg-os-accent/25 overflow-hidden mx-1">
                          <i className="pulse-x absolute top-0 left-0 h-px w-3 bg-os-accent" style={{ animationDelay: `${k * 0.25}s` }} />
                        </span>
                      )}
                    </Fragment>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-x-10 gap-y-4 pt-6 border-t border-os-border">
                {metrics.map(([v, l]) => (
                  <div key={l}><div className="text-3xl font-bold text-white">{v}</div><div className="text-xs text-os-textMuted">{l}</div></div>
                ))}
              </div>

              <button onClick={() => onOpen(pr)} className="self-start inline-flex items-center gap-2 text-sm font-medium bg-os-accent text-os-bg rounded-full px-6 py-3 hover:shadow-[0_0_30px_rgba(0,240,255,.5)] transition-shadow">
                Open case study <ArrowUpRight size={16} />
              </button>
              {pr.repo && <a href={pr.repo} target="_blank" rel="noreferrer" className="self-start text-sm text-os-accent hover:text-white">View source ↗</a>}
            </motion.div>
          </AnimatePresence>
        </Panel>
      </div>
      <CaseStudy />
    </Section>
  );
}

function Journey() {
  return (
    <Section id="experience">
      <Heading n="06" label="Career constellation" a="Growth measured" b="in shipped systems." />
      <div className="relative ml-3 pl-10 flex flex-col gap-14">
        <span className="absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-os-accent via-os-accent/30 to-transparent" />
        {p.journey.map((e) => (
          <Reveal key={e.title + e.period} className="relative">
            <span className="absolute -left-[46px] top-1.5 w-3 h-3 rounded-full bg-os-accent shadow-[0_0_16px_#00f0ff]" />
            <p className="label text-os-accent!">{e.period} <span className="text-os-textMuted">· {e.type}</span></p>
            <h3 className="text-2xl md:text-3xl font-bold text-white mt-2">{e.title}</h3>
            <p className="text-os-textMuted mb-4">{e.org}</p>
            <ul className="flex flex-col gap-2 text-sm text-os-textMuted max-w-2xl leading-relaxed">
              {e.points.map((a) => <li key={a} className="flex gap-3"><span className="text-os-accent">›</span>{a}</li>)}
            </ul>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function Lightbox({ doc, onClose }) {
  useEffect(() => {
    const k = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k); document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [onClose]);
  const src = encodeURI(p.certPath + doc.file), pdf = doc.file.endsWith(".pdf");
  return (
    <motion.div className="fixed inset-0 z-[150] bg-os-bg/95 flex flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <div className="flex items-center justify-between gap-4 px-6 py-4 label" onClick={(e) => e.stopPropagation()}>
        <span className="truncate">{doc.issuer} // {doc.title}</span>
        <span className="flex gap-6 shrink-0"><a href={src} target="_blank" rel="noreferrer" className="text-os-accent!">Open in new tab ↗</a><button onClick={onClose}>ESC · CLOSE ×</button></span>
      </div>
      <div className="flex-1 min-h-0 p-4 flex justify-center" onClick={(e) => e.stopPropagation()}>
        {pdf ? <iframe src={src} title={doc.title} className="w-full max-w-4xl h-full rounded-lg bg-white" />
             : <img src={src} alt={doc.title} className="max-h-full object-contain rounded-lg" />}
      </div>
    </motion.div>
  );
}

function Credentials() {
  const e = p.education;
  const [view, setView] = useState(null);
  return (
    <Section id="credentials">
      <Heading n="07" label="Credentials" a="Proof of work," b="learning and results." />
      <Reveal className="mb-6">
        <Panel className="p-5 md:p-10 flex flex-col md:flex-row gap-6 md:items-center justify-between">
          <div className="max-w-2xl">
            <p className="label text-os-accent! mb-3">Reference · Haashes</p>
            <p className="text-xl md:text-2xl text-white leading-snug">“…demonstrated exceptional skills in designing and developing visually appealing and user-friendly web applications.”</p>
            <p className="text-sm text-os-textMuted mt-4">Hassan Khan, Co-Founder, Haashes · from the signed experience letter</p>
          </div>
          <button onClick={() => setView(p.experienceLetter)} className="shrink-0 border border-os-accent text-os-accent rounded-full px-6 py-3 text-sm hover:bg-os-accent hover:text-os-bg transition-colors">Read the letter</button>
        </Panel>
      </Reveal>
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Reveal><Panel className="p-5 md:p-8 h-full">
          <p className="label mb-1">{e.degree}</p>
          <p className="text-white text-xl font-semibold">{e.school}</p>
          <p className="text-sm text-os-textMuted">{e.period} · CGPA {e.cgpa}</p>
          <p className="label mt-8 mb-3">Semester GPA</p>
          <div className="flex gap-2">
            {e.sgpa.map((g, i) => (
              <div key={i} className="flex-1 text-center">
                <span className="text-[10px] text-os-textMuted">{g}</span>
                <div className="h-20 flex items-end mt-1">
                  <motion.div initial={{ height: 0 }} whileInView={{ height: `${(g - 3) * 100}%` }} viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.06 }} className="w-full rounded-t bg-gradient-to-t from-os-accent/20 to-os-accent" />
                </div>
                <span className="label text-[9px]! tracking-normal!">S{i + 1}</span>
              </div>
            ))}
          </div>
        </Panel></Reveal>
        <Reveal><Panel className="p-5 md:p-8 h-full flex flex-col gap-6">
          {e.earlier.map(([t, s, m]) => (
            <div key={t} className="flex justify-between gap-4 border-b border-os-border pb-4">
              <div><p className="text-white">{t}</p><p className="text-xs text-os-textMuted">{s}</p></div>
              <p className="text-os-accent text-sm whitespace-nowrap">{m}</p>
            </div>
          ))}
          <div>
            <p className="label mb-3">Coursework</p>
            <div className="flex flex-wrap gap-2">
              {e.coursework.map((c) => <span key={c} className="text-[11px] border border-os-border rounded-full px-2.5 py-1">{c}</span>)}
            </div>
          </div>
        </Panel></Reveal>
      </div>

      <div className="no-scrollbar flex sm:grid overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 -mx-6 px-6 sm:mx-0 sm:px-0 pb-2">
        {[...p.certificates, p.experienceLetter].map((c) => (
          <Reveal key={c.file} className="min-w-[78%] sm:min-w-0 snap-center">
            <Panel onClick={() => setView(c)} className="h-full overflow-hidden group">
              <div className="h-44 overflow-hidden bg-os-panel">
                <img src={encodeURI(p.thumbPath + c.thumb)} alt={`${c.title} certificate`} loading="lazy" onError={(e) => { if (!e.currentTarget.dataset.fb) { e.currentTarget.dataset.fb = "1"; e.currentTarget.src = encodeURI(p.certPath + c.file); } }}
                  className="w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 group-hover:scale-105 transition duration-700" />
              </div>
              <div className="p-5 flex flex-col gap-1">
                <p className="label text-os-accent!">{c.issuer}</p>
                <h4 className="text-white font-semibold leading-snug">{c.title}</h4>
                <p className="text-xs text-os-textMuted">{c.date} · {c.id}</p>
                <span className="text-xs text-os-accent mt-2 flex items-center gap-1">View document <ArrowUpRight size={14} /></span>
              </div>
            </Panel>
          </Reveal>
        ))}
      </div>
      {typeof document !== "undefined" && createPortal(<AnimatePresence>{view && <Lightbox doc={view} onClose={() => setView(null)} />}</AnimatePresence>, document.body)}
    </Section>
  );
}

function Contact() {
  const [f, setF] = useState({ name: "", email: "", msg: "" });
  const [copied, setCopied] = useState(false);
  const href = `mailto:${p.email}?subject=${encodeURIComponent("Project inquiry from " + f.name)}&body=${encodeURIComponent(f.msg + "\n\n" + f.name + " (" + f.email + ")")}`;
  const field = "bg-transparent border border-os-border rounded-lg p-3.5 text-base md:text-sm text-white placeholder:text-os-textMuted focus:outline-none focus:border-os-accent transition-colors";
  const items = [...p.tech, ...p.tech];
  return (
    <Section id="contact">
      <Reveal>
        <p className="label text-os-accent! mb-4">09 / Final transmission</p>
        <h2 className="text-[clamp(2.4rem,11.5vw,3.5rem)] md:text-8xl font-bold tracking-tighter leading-none text-gradient">Let's build<br />together.</h2>
      </Reveal>
      <div className="overflow-hidden my-14 py-4 border-y border-os-border">
        <div className="marquee-track flex gap-12 label">{items.map(([n], k) => <span key={k}>{n}</span>)}</div>
      </div>
      <div className="grid md:grid-cols-2 gap-12">
        <div className="flex flex-col gap-4 text-sm">
          <div className="flex items-center gap-3">
            <a href={`mailto:${p.email}`} className="hover:text-os-accent transition-colors">{p.email}</a>
            <button onClick={() => { navigator.clipboard?.writeText(p.email); setCopied(true); setTimeout(() => setCopied(false), 1500); }} className="label text-[10px]! border border-os-border rounded-full px-2.5 py-1 hover:border-os-accent">{copied ? "Copied ✓" : "Copy"}</button>
          </div>
          <a href={p.links.linkedin} target="_blank" rel="noreferrer" className="hover:text-os-accent transition-colors">LinkedIn ↗</a>
          <a href={p.links.github} target="_blank" rel="noreferrer" className="hover:text-os-accent transition-colors">GitHub ↗</a>
        </div>
        <Panel className="p-5 md:p-7 flex flex-col gap-3">
          <p className="label">Quick transmission · opens your email app</p>
          <input className={field} placeholder="Your name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          <input className={field} type="email" placeholder="Email address" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
          <textarea className={`${field} resize-none`} rows={4} placeholder="Project brief" value={f.msg} onChange={(e) => setF({ ...f, msg: e.target.value })} />
          <a href={href} className="bg-os-accent text-os-bg font-medium text-center rounded-full py-3.5 hover:shadow-[0_0_30px_rgba(0,240,255,.5)] transition-shadow">Prepare email</a>
        </Panel>
      </div>
      <p className="text-center label mt-20">© {new Date().getFullYear()} Riaz Ijaz</p>
    </Section>
  );
}

const HINTS = ["What projects has Riaz built?", "Tell me about his final year project", "Is Riaz open to work?", "Explain what a transformer is"];

function Chat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ role: "assistant", content: "Hi, I'm RIAZ.AI. Ask me about Riaz's projects, skills, education or experience, or ask me anything else." }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const box = useRef(null);
  useEffect(() => {
    const o = () => setOpen(true), k = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("openchat", o); window.addEventListener("keydown", k);
    return () => { window.removeEventListener("openchat", o); window.removeEventListener("keydown", k); };
  }, []);
  useEffect(() => { if (box.current) box.current.scrollTop = box.current.scrollHeight; }, [msgs, open]);

  const send = async (text) => {
    const q = text.trim();
    if (!q || busy) return;
    const next = [...msgs, { role: "user", content: q }];
    setMsgs([...next, { role: "assistant", content: "" }]); setInput(""); setBusy(true);
    const put = (content) => setMsgs((m) => [...m.slice(0, -1), { role: "assistant", content }]);
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next.slice(-10) }) });
      if (!res.ok || !res.body) { const j = await res.json().catch(() => ({})); throw new Error(j.error || "Request failed."); }
      const reader = res.body.getReader(), dec = new TextDecoder();
      let acc = "";
      for (;;) { const { done, value } = await reader.read(); if (done) break; acc += dec.decode(value, { stream: true }); put(acc); }
      if (!acc) put("I didn't get a reply. Please try again.");
    } catch (e) { put(e.message || "Sorry, I couldn't reach the assistant. Please try again."); }
    setBusy(false);
  };

  return (
    <>
      <button onClick={() => setOpen((o) => !o)} aria-label={open ? "Close AI assistant" : "Open AI assistant"}
        className="fixed bottom-24 right-5 z-[140] w-12 h-12 md:w-14 md:h-14 rounded-full border border-os-accent/50 bg-os-bg flex items-center justify-center text-os-accent text-sm font-bold hover:shadow-[0_0_30px_rgba(0,240,255,.5)] transition-shadow">
        {!open && <span className="absolute inset-0 rounded-full border border-os-accent/60 animate-ping" />}
        <span className="relative">{open ? "×" : "AI"}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div role="dialog" aria-label="RIAZ.AI assistant" initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.96 }} transition={{ duration: 0.25 }}
            className="fixed bottom-40 right-3 md:right-5 z-[140] w-[min(94vw,24rem)] h-[min(70dvh,34rem)] flex flex-col rounded-xl border border-os-accent/30 bg-os-bg/95 overflow-hidden shadow-[0_0_60px_rgba(0,240,255,.15)] font-sans">
            <div className="flex items-center justify-between px-4 py-3 border-b border-os-border">
              <span className="label text-os-accent! flex items-center gap-2"><i className="w-1.5 h-1.5 rounded-full bg-os-accent animate-pulse" />RIAZ.AI // Assistant</span>
              <button onClick={() => setOpen(false)} className="label hover:text-white" aria-label="Close">ESC ×</button>
            </div>
            <div ref={box} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 text-sm">
              {msgs.map((m, i) => (
                <div key={i} className={`max-w-[88%] rounded-lg px-3.5 py-2.5 leading-relaxed whitespace-pre-wrap ${m.role === "user" ? "self-end bg-os-accent text-os-bg" : "self-start border border-os-border text-os-textMain"}`}>
                  {m.content || <span className="inline-flex gap-1">{[0, 1, 2].map((d) => <motion.i key={d} className="w-1.5 h-1.5 rounded-full bg-os-accent" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: d * 0.2 }} />)}</span>}
                </div>
              ))}
              {msgs.length === 1 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {HINTS.map((h) => <button key={h} onClick={() => send(h)} className="text-xs border border-os-border rounded-full px-3 py-1.5 text-os-textMuted hover:border-os-accent hover:text-white transition-colors">{h}</button>)}
                </div>
              )}
            </div>
            <div className="p-3 border-t border-os-border flex gap-2">
              <input value={input} maxLength={500} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send(input)} placeholder="Ask anything…"
                className="flex-1 bg-transparent border border-os-border rounded-lg px-3 py-2 text-base md:text-sm text-white placeholder:text-os-textMuted focus:outline-none focus:border-os-accent" />
              <button onClick={() => send(input)} disabled={busy || !input.trim()} className="bg-os-accent text-os-bg rounded-lg px-4 text-sm font-medium disabled:opacity-40">Send</button>
            </div>
            <p className="label text-[9px]! text-center pb-2 normal-case! tracking-wide!">AI can make mistakes. Answers about Riaz come from his portfolio data.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Palette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  useEffect(() => {
    const k = (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen((o) => !o); } if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, []);
  const go = (id) => window.dispatchEvent(new CustomEvent("warp", { detail: id }));
  const items = [
    ...SECTIONS.map(([id, l]) => ({ label: `Go to ${l}`, run: () => go(id) })),
    { label: "Ask the AI assistant", run: () => window.dispatchEvent(new Event("openchat")) },
    { label: "Download CV", run: () => { const a = document.createElement("a"); a.href = p.cv; a.download = ""; a.click(); } },
    { label: "Copy email", run: () => navigator.clipboard?.writeText(p.email) },
    { label: "Open GitHub", run: () => window.open(p.links.github, "_blank") },
    { label: "Open LinkedIn", run: () => window.open(p.links.linkedin, "_blank") },
  ].filter((i) => i.label.toLowerCase().includes(q.toLowerCase()));
  const run = (i) => { i.run(); setOpen(false); setQ(""); };
  return (
    <>
      <button onClick={() => setOpen(true)} className="hidden lg:block fixed bottom-12 right-5 z-40 label border border-os-border rounded-full px-3 py-1.5 bg-os-bg/80 hover:border-os-accent">⌘K · Command</button>
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[160] bg-os-bg/80 flex items-start justify-center pt-[18vh]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
            <div className="glass w-[min(92vw,32rem)] rounded-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && items[0] && run(items[0])}
                placeholder="Type a command…" className="w-full bg-transparent px-5 py-4 text-white text-base md:text-sm outline-none border-b border-os-border" />
              <ul className="max-h-72 overflow-y-auto">
                {items.map((i) => <li key={i.label}><button onClick={() => run(i)} className="w-full text-left px-5 py-3 text-sm text-os-textMuted hover:bg-os-accent/10 hover:text-white">{i.label}</button></li>)}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Home() {
  const [booting, setBooting] = useState(true);
  const [open, setOpen] = useState(null);
  const { scrollYProgress } = useScroll();
  const sx = scrollYProgress;
  useEffect(() => { if (isLite()) document.documentElement.dataset.lite = "1"; }, []);
  return (
    <>
      <AnimatePresence>{booting && <BootSequence onComplete={() => setBooting(false)} />}</AnimatePresence>
      {!booting && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="font-sans">
          <div className="aurora" /><div className="grid-bg" /><NeuralField />
          <motion.div style={{ scaleX: sx }} className="fixed top-0 inset-x-0 h-[2px] origin-left bg-os-accent shadow-[0_0_10px_#00f0ff] z-[60]" />
          <Hud /><Palette /><Chat /><Warp />
          <Hero /><Ticker /><About /><Divider n="03" label="Stack" /><Arsenal /><Divider n="04" label="Work" /><Work onOpen={setOpen} /><Divider n="05" label="Services" /><Services /><Divider n="06" label="Journey" /><Journey /><Divider n="07" label="Credentials" /><Credentials /><Divider n="08" label="Terminal" /><TerminalSection /><Divider n="09" label="Contact" /><Contact /><div className="h-24 lg:hidden" />
          <AnimatePresence>{open && <ProjectModal project={open} onClose={() => setOpen(null)} />}</AnimatePresence>
        </motion.div>
      )}
    </>
  );
}