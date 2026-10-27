import React, { useState, useEffect } from 'react';
import { FolderGit2, X, CheckCircle, ArrowRight, Zap } from 'lucide-react';
import { useLensStore } from '../../store/useLensStore';

export function ProjectsModal() {
  const {
    isProjectsModalOpen,
    toggleProjectsModal,
    setActiveDevice,
    setSelectedPin,
    language
  } = useLensStore();

  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);

  useEffect(() => {
    if (isProjectsModalOpen) {
      fetch('/api/projects')
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setProjects(data.projects || []);
            if (data.projects.length > 0 && !activeProject) {
              setActiveProject(data.projects[0]);
            }
          }
        })
        .catch((err) => console.error(err));
    }
  }, [isProjectsModalOpen]);

  if (!isProjectsModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <FolderGit2 className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold">
                {language === 'bn' ? 'একাডেমিক হার্ডওয়্যার প্রজেক্ট ওয়্যারিং স্কিম' : 'Academic Hardware Projects & Wiring Schemes'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {language === 'bn'
                  ? 'জনপ্রিয় ল্যাব প্রজেক্টের পিন ম্যাপিং ও ইন্টারফেসিং গাইড'
                  : 'Pre-configured laboratory circuit schemes and pinout mappings'}
              </p>
            </div>
          </div>
          <button onClick={toggleProjectsModal} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body (Split Left List & Right Wiring Details) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left: Project List */}
          <div className="w-full md:w-64 border-r border-slate-200 bg-slate-50 p-3 space-y-2 overflow-y-auto">
            {projects.map((p) => (
              <button
                key={p.id}
                onClick={() => setActiveProject(p)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  activeProject?.id === p.id
                    ? 'bg-white border-emerald-500 shadow-sm ring-1 ring-emerald-500/30'
                    : 'bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    {language === 'bn' ? p.title_bn : p.title_en}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">
                    {p.difficulty}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 line-clamp-1 mt-1">
                  Device: {p.device_id.replace('_', ' ')}
                </span>
              </button>
            ))}
          </div>

          {/* Right: Active Project Wiring Scheme */}
          {activeProject && (
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-slate-900">
                    {language === 'bn' ? activeProject.title_bn : activeProject.title_en}
                  </h4>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {activeProject.difficulty}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {language === 'bn' ? activeProject.description_bn : activeProject.description_en}
                </p>
              </div>

              {/* Pin Wiring Table */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 font-bold text-xs text-slate-700 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>{language === 'bn' ? 'সার্কিট পিন সংযোগ চার্ট' : 'Circuit Pin Interfacing Table'}</span>
                </div>

                <div className="divide-y divide-slate-200">
                  {activeProject.wiring?.map((wire, idx) => (
                    <div
                      key={idx}
                      className="p-3 flex items-center justify-between hover:bg-white transition-colors text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: wire.color || '#0284c7' }}
                        />
                        <span className="font-bold text-slate-800">{wire.component}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="spec-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                          {wire.signalPin?.replace('Pin_', '')}
                        </span>

                        <button
                          onClick={() => {
                            setActiveDevice(activeProject.device_id);
                            setSelectedPin(wire.signalPin);
                            toggleProjectsModal();
                          }}
                          className="px-2.5 py-1 text-[11px] font-bold text-sky-600 hover:text-white hover:bg-sky-600 rounded-lg border border-sky-200 transition-colors"
                        >
                          {language === 'bn' ? '৩ডি-তে দেখুন' : 'Inspect 3D'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Load Device Button */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    setActiveDevice(activeProject.device_id);
                    toggleProjectsModal();
                  }}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <span>{language === 'bn' ? 'এই প্রজেক্টের ৩ডি মডেলে যান' : 'Load Project into 3D Workspace'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
