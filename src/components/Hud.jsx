"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Terminal, Cpu, FolderGit2, Network, Mail } from "lucide-react";

export const SECTIONS = [
  ["home", "Home"], ["about", "Profile"], ["skills", "Stack"], ["portfolio", "Work"], ["services", "Services"],
  ["experience", "Journey"], ["credentials", "Credentials"], ["terminal", "Terminal"], ["contact", "Contact"],
];
const DOCK = [["home", "Home", Terminal], ["skills", "Stack", Cpu], ["portfolio", "Work", FolderGit2], ["experience", "Journey", Network], ["contact", "Contact", Mail]];
const DOCK_OF = { about: "home", services: "portfolio", credentials: "experience", terminal: "contact" };

export default function Hud() {
  const [active, setActive] = useState("home");
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [now, setNow] = useState("");
  const [menu, setMenu] = useState(false);
  useEffect(() => { document.body.style.overflow = menu ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [menu]);
  useEffect(() => {
    const tick = () => setNow(new Date().toLocaleTimeString("en-GB"));
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    SECTIONS.forEach(([id]) => { const el = document.getElementById(id); el && io.observe(el); });
    const mv = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", mv);
    return () => { io.disconnect(); window.removeEventListener("mousemove", mv); };
  }, []);

  const pad = (n) => String(n).padStart(3, "0");

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-5 py-3 border-b border-os-border bg-os-bg/85 text-xs">
        <a href="#home" className="font-bold tracking-widest text-white">RI<span className="text-os-accent">.</span></a>
        <nav className="hidden xl:flex gap-6 uppercase tracking-widest text-os-textMuted">
          {SECTIONS.map(([id, label]) => (
            <a key={id} href={`#${id}`} className={active === id ? "text-os-accent" : "hover:text-white transition-colors"}>{label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a href="#contact" className="border border-os-accent text-os-accent px-3 py-1.5 uppercase tracking-widest hover:bg-os-accent hover:text-os-bg transition-colors">Let's connect</a>
          <button onClick={() => setMenu((m) => !m)} aria-label={menu ? "Close menu" : "Open menu"} aria-expanded={menu} className="xl:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 border border-os-border rounded">
            <i className={`block w-4 h-px bg-white transition-transform ${menu ? "translate-y-[3.5px] rotate-45" : ""}`} />
            <i className={`block w-4 h-px bg-white transition-transform ${menu ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
          </button>
        </div>
      </header>
      {menu && (
        <div className="xl:hidden fixed inset-0 z-[49] bg-os-bg/95 pt-24 px-8 flex flex-col">
          {SECTIONS.map(([id, label], i) => (
            <a key={id} href={`#${id}`} onClick={() => setMenu(false)} className={`flex items-baseline gap-4 py-4 border-b border-os-border text-2xl font-semibold ${active === id ? "text-os-accent" : "text-white"}`}>
              <span className="text-[10px] tracking-widest text-os-textMuted">0{i + 1}</span>{label}
            </a>
          ))}
        </div>
      )}

            {/* Mobile app-style dock */}
      <nav aria-label="Quick navigation" className="lg:hidden fixed inset-x-3 z-[48] flex items-center justify-between p-1.5 rounded-2xl border border-os-accent/25 bg-os-bg/85 shadow-[0_0_40px_rgba(0,240,255,.12)]" style={{ bottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
        {DOCK.map(([id, label, Icon]) => {
          const on = (DOCK_OF[active] || active) === id;
          return (
            <a key={id} href={`#${id}`} className="relative flex-1 flex flex-col items-center gap-1 py-2 text-[9px] tracking-widest uppercase">
              {on && <motion.span layoutId="dock-pill" className="absolute inset-0 rounded-xl bg-os-accent/15 border border-os-accent/40 shadow-[0_0_20px_rgba(0,240,255,.25)]" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
              <Icon size={18} className={`relative ${on ? "text-os-accent" : "text-os-textMuted"}`} />
              <span className={`relative ${on ? "text-os-accent" : "text-os-textMuted"}`}>{label}</span>
            </a>
          );
        })}
      </nav>

      {/* Side sequence tracker */}
      <aside className="hidden lg:flex fixed left-5 top-1/2 -translate-y-1/2 z-40 flex-col gap-3 text-[10px] text-os-textMuted">
        <span className="tracking-widest mb-1">SEQ</span>
        {SECTIONS.map(([id], i) => (
          <a key={id} href={`#${id}`} className={`transition-colors ${active === id ? "text-os-accent" : "hover:text-white"}`}>
            {active === id ? "▸ " : ""}0{i + 1}
          </a>
        ))}
      </aside>

      {/* Bottom status bar */}
      <footer className="hidden lg:flex fixed bottom-0 inset-x-0 z-40 justify-between px-5 py-2 text-[10px] uppercase tracking-widest text-os-textMuted bg-os-bg/70 border-t border-os-border pointer-events-none">
        <span>PORTFOLIO.OSV / 10.26</span>
        <span>X {pad(pos.x)} / Y {pad(pos.y)} · LOCAL {now}</span>
        <span className="text-os-accent flex items-center gap-2"><i className="w-1.5 h-1.5 rounded-full bg-os-accent animate-pulse" />BUILD STATUS: ACTIVE</span>
      </footer>
    </>
  );
}