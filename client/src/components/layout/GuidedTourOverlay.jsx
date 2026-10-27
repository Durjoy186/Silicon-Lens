import React from 'react';
import { ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';
import { useLensStore } from '../../store/useLensStore';

export function GuidedTourOverlay() {
  const {
    activeTour,
    tourStepIndex,
    nextTourStep,
    prevTourStep,
    endTour,
    language
  } = useLensStore();

  if (!activeTour) return null;

  const currentStep = activeTour.steps[tourStepIndex];
  if (!currentStep) return null;

  const isFirst = tourStepIndex === 0;
  const isLast = tourStepIndex === activeTour.steps.length - 1;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-lg">
      <div className="bg-slate-900/95 text-white p-4 sm:p-5 rounded-2xl shadow-2xl border border-sky-500/60 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4">
        {/* Header with Tour Title & Exit */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-700/80 pb-2.5 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold text-sky-400">
              {language === 'bn' ? activeTour.title_bn : activeTour.title_en}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400">
              {tourStepIndex + 1} / {activeTour.steps.length}
            </span>
            <button
              onClick={endTour}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              title="Exit Tour"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Content */}
        <div>
          <h3 className="text-sm font-bold text-white mb-1">
            {language === 'bn' ? currentStep.title_bn : currentStep.title_en}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            {language === 'bn' ? currentStep.description_bn : currentStep.description_en}
          </p>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-800">
          <button
            onClick={prevTourStep}
            disabled={isFirst}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              isFirst
                ? 'opacity-40 cursor-not-allowed text-slate-500'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{language === 'bn' ? 'পূর্ববর্তী' : 'Previous'}</span>
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5">
            {activeTour.steps.map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === tourStepIndex ? 'bg-sky-400 w-4' : 'bg-slate-600'
                }`}
              />
            ))}
          </div>

          {isLast ? (
            <button
              onClick={endTour}
              className="flex items-center gap-1 px-4 py-1.5 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 transition-colors shadow-sm"
            >
              <span>{language === 'bn' ? 'সম্পূর্ণ' : 'Finish'}</span>
            </button>
          ) : (
            <button
              onClick={nextTourStep}
              className="flex items-center gap-1 px-4 py-1.5 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 transition-colors shadow-sm"
            >
              <span>{language === 'bn' ? 'পরবর্তী' : 'Next'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
