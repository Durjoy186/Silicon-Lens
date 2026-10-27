import React from 'react';
import { Eye, RotateCcw, ChevronRight, ChevronLeft } from 'lucide-react';
import { useLensStore } from '../../store/useLensStore';

/**
 * Bottom controls bar with camera reset, universal X-Ray slider,
 * and spec drawer toggle, optimized for viewports down to 320px.
 */
export function BottomControls() {
  const {
    activeDevice,
    xrayValue,
    setXrayValue,
    setSelectedPin,
    language,
    isSpecDrawerOpen,
    toggleSpecDrawer
  } = useLensStore();

  const handleResetCamera = () => {
    setSelectedPin(null);
  };

  const xrayLabels = {
    arduino_uno: { en: 'X-Ray PCB & Silicon Die:', bn: 'এক্স-রে পিসিবি ও ডাই:' },
    intel_8086: { en: 'X-Ray Microarchitecture:', bn: 'এক্স-রে আর্কিটেকচার:' },
    robotic_arm: { en: 'X-Ray Servo Internals:', bn: 'এক্স-রে সার্ভো মেকানিক্স:' },
    ic_74ls00: { en: 'X-Ray Silicon Logic Gates:', bn: 'এক্স-রে সিলিকন লজিক গেট:' }
  };

  const currentXrayLabel = xrayLabels[activeDevice] || xrayLabels.arduino_uno;

  return (
    <div className="fixed bottom-2.5 left-2 right-2 sm:left-6 sm:right-6 z-35 pointer-events-none flex items-center justify-between gap-1.5 sm:gap-3">
      {/* Left: Reset View Button */}
      <div className="pointer-events-auto flex items-center gap-1.5 glass-panel p-1 sm:p-1.5 rounded-xl border border-slate-200/90 shadow-md">
        <button
          onClick={handleResetCamera}
          className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-all shadow-2xs"
          title={language === 'bn' ? 'ক্যামেরা রিসেট করুন' : 'Reset Camera View'}
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
          <span className="hidden sm:inline">{language === 'bn' ? 'রিসেট ভিউ' : 'Reset View'}</span>
        </button>
      </div>

      {/* Center: UNIVERSAL X-RAY CUTAWAY SLIDER (Enabled on ALL models) */}
      <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2.5 glass-panel px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-sky-300 shadow-md bg-white/95">
        <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-600 shrink-0 animate-pulse" />
        <span className="hidden sm:inline text-xs font-bold text-slate-800 shrink-0">
          {language === 'bn' ? currentXrayLabel.bn : currentXrayLabel.en}
        </span>
        <span className="sm:hidden text-[11px] font-bold text-slate-800 shrink-0">
          X-Ray:
        </span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={xrayValue}
          onChange={(e) => setXrayValue(parseFloat(e.target.value))}
          className="w-14 xs:w-20 sm:w-36 accent-sky-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
        />
        <span className="text-[11px] sm:text-xs font-bold spec-mono text-sky-700 shrink-0">
          {Math.round(xrayValue * 100)}%
        </span>
      </div>

      {/* Right: Toggle Spec Drawer */}
      <div className="pointer-events-auto">
        <button
          onClick={toggleSpecDrawer}
          className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl glass-panel text-slate-800 hover:text-sky-700 text-xs font-bold border border-slate-200/90 shadow-md bg-white transition-all"
        >
          <span className="hidden sm:inline">
            {isSpecDrawerOpen
              ? (language === 'bn' ? 'স্পেকস লুকান' : 'Hide Specs')
              : (language === 'bn' ? 'স্পেকস দেখুন' : 'Show Specs')}
          </span>
          <span className="sm:hidden text-[11px] font-bold">
            {isSpecDrawerOpen
              ? (language === 'bn' ? 'লুকান' : 'Hide')
              : (language === 'bn' ? 'স্পেকস' : 'Specs')}
          </span>
          {isSpecDrawerOpen ? <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
        </button>
      </div>
    </div>
  );
}
