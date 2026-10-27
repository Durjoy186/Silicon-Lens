import React, { useState, useEffect } from 'react';
import { X, ZoomIn, Touchpad, Rotate3D, Check, Sparkles } from 'lucide-react';
import { useLensStore } from '../../store/useLensStore';

/**
 * Mobile-only instruction modal explaining touch gestures:
 * - 👆 Double-Tap to inspect floating pin details
 * - ✌️ Pinch to Zoom
 * - 🔄 One-finger drag to rotate 360°
 *
 * Appears after every page reload for mobile users.
 * When dismissed via cross '✕' or 'Got it', it stays hidden for the
 * current session until the user reloads the website!
 */
export function MobileInstructionModal() {
  const { language, isMobileTipDismissed, dismissMobileTip, currentView } = useLensStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile =
        typeof window !== 'undefined' &&
        (window.innerWidth < 768 ||
          'ontouchstart' in window ||
          navigator.maxTouchPoints > 0);
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Show only if mobile viewport, in 3D Atlas view, and not yet dismissed in current page load
  if (!isMobile || isMobileTipDismissed || currentView !== 'atlas') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-sky-300 p-5 flex flex-col relative animate-in zoom-in-95 duration-200">
        {/* Close Cross Button */}
        <button
          onClick={dismissMobileTip}
          className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title={language === 'bn' ? 'বন্ধ করুন' : 'Close instruction'}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Badge & Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-sky-700">
            {language === 'bn' ? 'মোবাইল ৩ডি টিপস' : 'Mobile 3D Gestures'}
          </span>
        </div>

        <h3 className="text-base font-extrabold text-slate-900 leading-snug">
          {language === 'bn'
            ? 'মোবাইলে সহজে ৩ডি মডেল এক্সপ্লোর করুন'
            : 'Interactive Touch Controls'}
        </h3>
        <p className="text-xs text-slate-500 mt-0.5 mb-4">
          {language === 'bn'
            ? 'যেকোনো পার্টসের স্পেকস দেখতে এবং জুম করতে এই সহজ জেসচারগুলো ব্যবহার করুন:'
            : 'Use these intuitive touch gestures to navigate and inspect hardware:'}
        </p>

        {/* Gestures List */}
        <div className="space-y-3">
          {/* Double Tap */}
          <div className="flex items-start gap-3 p-2.5 rounded-xl bg-sky-50/80 border border-sky-100">
            <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
              <Touchpad className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">
                {language === 'bn' ? '👆 ডাবল ট্যাপ (Double-Tap)' : '👆 Double-Tap for Details'}
              </div>
              <div className="text-[11px] text-slate-600 font-medium leading-relaxed">
                {language === 'bn'
                  ? 'যেকোনো পিন বা চিপের ওপর দুইবার দ্রুত ট্যাপ করে তার ফ্লোটিং বিবরণ ও রেটিং দেখুন।'
                  : 'Tap twice on any pin, chip, or part to reveal its floating specifications.'}
              </div>
            </div>
          </div>

          {/* Pinch to Zoom */}
          <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
              <ZoomIn className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">
                {language === 'bn' ? '✌️ পিঞ্চ করে জুম (Pinch to Zoom)' : '✌️ Pinch to Zoom'}
              </div>
              <div className="text-[11px] text-slate-600 font-medium leading-relaxed">
                {language === 'bn'
                  ? 'দুই আঙুল দিয়ে স্ক্রিনে পিঞ্চ করে সিলিকন ডাই ও পিন মাইক্রো-লেভেলে জুম করুন।'
                  : 'Use two fingers to pinch in/out and examine microscopic silicon dies.'}
              </div>
            </div>
          </div>

          {/* 1-Finger Orbit */}
          <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
              <Rotate3D className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">
                {language === 'bn' ? '🔄 ৩৬০° ভিউ (1-Finger Drag)' : '🔄 1-Finger Orbit'}
              </div>
              <div className="text-[11px] text-slate-600 font-medium leading-relaxed">
                {language === 'bn'
                  ? 'এক আঙুল টেনে যেকোনো দিক থেকে মডেলটি ৩৬০° ঘুরিয়ে দেখুন।'
                  : 'Drag with one finger to rotate and inspect from any angle.'}
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={dismissMobileTip}
          className="mt-4 w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Check className="w-4 h-4" />
          <span>{language === 'bn' ? 'বুঝেছি, শুরু করুন' : 'Got It, Start Exploring'}</span>
        </button>
      </div>
    </div>
  );
}
