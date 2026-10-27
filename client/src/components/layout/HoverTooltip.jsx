import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowRight, Sparkles } from 'lucide-react';
import { useLensStore } from '../../store/useLensStore';
import arduinoData from '../../data/arduinoUnoData.json';
import intelData from '../../data/intel8086Data.json';
import roboticData from '../../data/roboticArmData.json';
import ic74ls00Data from '../../data/ic74ls00Data.json';

/**
 * Viewport-anchored, high-contrast floating tooltip.
 * - On desktop: Follows mouse coordinates smoothly.
 * - On mobile: Anchored at double-tap touch coordinates with viewport clamping.
 * - Fully interactive: Close '✕' button, 'Full Specs →' button,
 *   and tap-anywhere-outside dismissal.
 */
export function HoverTooltip() {
  const {
    activeDevice,
    hoveredPin,
    setHoveredPin,
    setSelectedPin,
    setSpecDrawerOpen,
    language,
    tooltipCoords
  } = useLensStore();

  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const tooltipRef = useRef(null);

  // Desktop mouse coordinates listener
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Global outside tap/click listener to dismiss floating tooltip
  useEffect(() => {
    if (!hoveredPin) return;

    const handleOutsideClick = (e) => {
      // If click/touch is inside tooltip, ignore
      if (tooltipRef.current && tooltipRef.current.contains(e.target)) {
        return;
      }
      setHoveredPin(null);
    };

    // Use capture phase so we capture the event even if OrbitControls or 3D canvas calls stopPropagation
    window.addEventListener('pointerdown', handleOutsideClick, true);
    return () => window.removeEventListener('pointerdown', handleOutsideClick, true);
  }, [hoveredPin, setHoveredPin]);

  if (!hoveredPin) return null;

  let dataset = arduinoData.items;
  if (activeDevice === 'intel_8086') dataset = intelData.items;
  if (activeDevice === 'robotic_arm') dataset = roboticData.items;
  if (activeDevice === 'ic_74ls00') dataset = ic74ls00Data.items;

  const item = dataset.find((i) => i.mesh_name === hoveredPin);
  if (!item) return null;

  // Coordinate resolution: use mobile double-tap touch coords if available, otherwise mouse coords
  const rawX = tooltipCoords.x > -500 ? tooltipCoords.x : mousePos.x;
  const rawY = tooltipCoords.y > -500 ? tooltipCoords.y : mousePos.y;

  // Viewport edge clamping for small mobile screens (320px - 480px)
  const isClient = typeof window !== 'undefined';
  const winWidth = isClient ? window.innerWidth : 380;
  const winHeight = isClient ? window.innerHeight : 600;

  // Keep tooltip strictly inside viewport
  const tooltipHalfWidth = Math.min(140, winWidth * 0.42);
  const clampedX = Math.max(tooltipHalfWidth + 10, Math.min(winWidth - tooltipHalfWidth - 10, rawX));
  const clampedY = Math.max(100, Math.min(winHeight - 90, rawY - 20));

  const handleOpenDrawer = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedPin(item.mesh_name);
    setSpecDrawerOpen(true);
    setHoveredPin(null);
  };

  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setHoveredPin(null);
  };

  return (
    <div
      ref={tooltipRef}
      className="viewport-tooltip shadow-2xl backdrop-blur-md bg-slate-950/95 border border-sky-400/70 rounded-xl p-3 min-w-[220px] max-w-[320px] transition-all z-50 select-none cursor-default"
      style={{
        left: `${clampedX}px`,
        top: `${clampedY}px`,
        pointerEvents: 'auto'
      }}
    >
      {/* Category, Status Line & Close Button */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
          </span>
          <span className="text-[9px] font-extrabold uppercase tracking-wider text-sky-400">
            {item.category?.replace(/_/g, ' ') || 'HARDWARE PIN'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {item.quick_spec && (
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-sky-900/60 text-sky-200 border border-sky-600/40">
              {item.quick_spec}
            </span>
          )}

          {/* Dismiss button for mobile touch and desktop users */}
          <button
            type="button"
            onClick={handleClose}
            onPointerDown={(e) => e.stopPropagation()}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
            title={language === 'bn' ? 'বন্ধ করুন' : 'Close'}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Name */}
      <div className="font-bold text-xs tracking-tight text-white line-clamp-1">
        {language === 'bn' ? item.name_bn : item.name_en}
      </div>

      {/* Subtitle / Key Function */}
      <div className="text-[11px] font-medium text-slate-300 line-clamp-2 mt-0.5">
        {language === 'bn' ? item.subtitle_bn : item.subtitle_en}
      </div>

      {/* Syllabus Tags & Open Spec Drawer Action */}
      <div className="flex items-center justify-between gap-1 mt-2.5 pt-2 border-t border-slate-800">
        <div className="flex flex-wrap gap-1">
          {item.syllabus_tags?.slice(0, 1).map((tag) => (
            <span
              key={tag}
              className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-800/90 text-sky-300 border border-slate-700"
            >
              #{tag}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={handleOpenDrawer}
          onPointerDown={(e) => e.stopPropagation()}
          className="flex items-center gap-1 text-[10px] font-bold text-sky-400 hover:text-white bg-sky-950/90 hover:bg-sky-900 px-2.5 py-1.5 rounded-lg border border-sky-600/50 transition-colors shrink-0 cursor-pointer shadow-sm"
        >
          <span>{language === 'bn' ? 'বিস্তারিত দেখুন' : 'Full Specs'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
