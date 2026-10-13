"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";

const Block = ({ n, title, children }) => (
  <div className="border-t border-os-border pt-5">
    <p className="text-xs text-os-accent mb-2">{n} / {title}</p>
    {children}
  </div>
);

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", esc); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <motion.div className="fixed inset-0 z-[150] bg-os-bg/95 backdrop-blur overflow-y-auto"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="max-w-3xl mx-auto px-6 py-16 flex flex-col gap-8">
        <div className="flex justify-between text-xs text-os-textMuted uppercase tracking-widest">
          <span>PROJECT DOSSIER // {project.id}</span>
          <button onClick={onClose} className="text-os-accent hover:text-white">ESC · CLOSE ×</button>
        </div>
        <div>
          <p className="text-xs text-os-accent mb-2">{project.category}</p>
          <h2 className="text-4xl md:text-5xl font-sans font-bold text-white">{project.title}</h2>
          <p className="mt-3 text-os-textMuted">{project.summary}</p>
        </div>
        <Block n="01" title="MY ROLE"><p>{project.role}</p></Block>
        <Block n="02" title="THE CHALLENGE"><p>{project.challenge}</p></Block>
        <Block n="03" title="DELIVERED SCOPE">
          <ul className="flex flex-col gap-1 text-sm">
            {project.highlights.map((h) => <li key={h}><span className="text-os-accent mr-2">&gt;</span>{h}</li>)}
          </ul>
        </Block>
        <Block n="04" title="TECHNOLOGY MATRIX">
          <div className="flex flex-wrap gap-2">
            {project.tags.map((t) => <span key={t} className="text-xs border border-os-border px-2 py-1">{t}</span>)}
          </div>
        </Block>
      </div>
    </motion.div>
  );
}
