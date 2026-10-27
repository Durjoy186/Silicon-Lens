import React, { useState, useEffect } from 'react';
import {
  Info,
  Zap,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Plus,
  Trash2,
  Sliders,
  BookMarked,
  Printer,
  Lock,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  LogIn,
  ArrowRight,
  Cpu,
  Layers,
  Activity,
  Binary,
  ToggleLeft,
  ToggleRight,
  RotateCcw,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useLensStore } from '../../store/useLensStore';
import arduinoData from '../../data/arduinoUnoData.json';
import intelData from '../../data/intel8086Data.json';
import roboticData from '../../data/roboticArmData.json';
import ic74ls00Data from '../../data/ic74ls00Data.json';

export function SpecDrawer() {
  const {
    activeDevice,
    selectedPin,
    setSelectedPin,
    language,
    isSpecDrawerOpen,
    toggleSpecDrawer,
    setSpecDrawerOpen,
    servoAngles,
    setServoAngle,
    currentUser,
    openAuthModal,
    bookmarkedPins,
    toggleBookmarkPin,
    toggleCheatSheetModal,
    logicInputs,
    toggleLogicInput,
    setLogicInputs,
    resetLogicInputs,
    srLatch,
    setSRLatch
  } = useLensStore();

  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'notes' | 'servos' | 'architecture' | 'logic'
  const [logicSubTab, setLogicSubTab] = useState('quad_nand'); // 'quad_nand' | 'sr_latch' | 'universal'
  const [universalGateType, setUniversalGateType] = useState('NOT'); // 'NOT' | 'AND' | 'OR' | 'NOR' | 'XOR'
  const [pinNotes, setPinNotes] = useState([]);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [courseCode, setCourseCode] = useState('CSE-311: Embedded Lab');
  const [isAddingNote, setIsAddingNote] = useState(false);

  // Auto-switch to logic tab when opening 74LS00 if coming from hardware-specific tabs
  useEffect(() => {
    if (activeDevice === 'ic_74ls00' && (activeTab === 'architecture' || activeTab === 'servos')) {
      setActiveTab('logic');
    }
  }, [activeDevice]);

  // Retrieve matching item from current device dataset
  const currentItem = React.useMemo(() => {
    let dataset = arduinoData.items;
    if (activeDevice === 'intel_8086') dataset = intelData.items;
    if (activeDevice === 'robotic_arm') dataset = roboticData.items;
    if (activeDevice === 'ic_74ls00') dataset = ic74ls00Data.items;

    const found = dataset.find((i) => i.mesh_name === selectedPin);
    if (found) return found;
    return dataset[0];
  }, [activeDevice, selectedPin]);

  // Official documentation links for each device
  const officialDocs = {
    arduino_uno: {
      url: 'https://docs.arduino.cc/hardware/uno-rev3/',
      label_en: 'Official Arduino Uno R3 Documentation & Schematics',
      label_bn: 'অফিসিয়াল আর্ডুইনো ইউনো আর৩ ডকুমেন্টেশন ও স্কিম্যাটিক্স'
    },
    intel_8086: {
      url: 'https://datasheetspdf.com/pdf-file/544415/Intel/8086/1',
      label_en: 'Intel 8086 16-Bit Microprocessor Datasheet (PDF)',
      label_bn: 'ইন্টেল ৮০৮৬ মাইক্রোপ্রসেসর অফিশিয়াল ডেটাশিট (PDF)'
    },
    robotic_arm: {
      url: 'https://www.electronicoscaldas.com/datasheet/SG90_Tower-Pro.pdf',
      label_en: 'TowerPro SG90 9g Micro Servo Official Datasheet',
      label_bn: 'টাওয়ারপ্রো SG90 সার্ভো মোটর ডেটাশিট (PDF)'
    },
    ic_74ls00: {
      url: 'https://www.ti.com/lit/ds/symlink/sn74ls00.pdf',
      label_en: 'Texas Instruments SN74LS00 Datasheet (PDF)',
      label_bn: 'টেক্সাস ইন্সট্রুমেন্টস ৭৪এলএস০০ ডেটাশিট (PDF)'
    }
  };

  const currentDoc = officialDocs[activeDevice];

  // Fetch pin notes from backend SQLite database
  useEffect(() => {
    if (!currentItem) return;

    fetch(`/api/notes?deviceId=${activeDevice}&pinId=${currentItem.mesh_name}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPinNotes(data.notes || []);
        }
      })
      .catch((err) => console.error('Database connection error:', err));
  }, [activeDevice, currentItem]);

  // Save new note to SQLite database
  const handleSaveNote = async (e) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;

    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          device_id: activeDevice,
          pin_id: currentItem.mesh_name,
          title: newNoteTitle.trim(),
          content: newNoteContent.trim(),
          course_code: courseCode
        })
      });

      const data = await res.json();
      if (data.success) {
        setPinNotes([data.note, ...pinNotes]);
        setNewNoteTitle('');
        setNewNoteContent('');
        setIsAddingNote(false);
      }
    } catch (err) {
      console.error('Error saving note to database:', err);
    }
  };

  // Delete note from SQLite database
  const handleDeleteNote = async (id) => {
    try {
      const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setPinNotes(pinNotes.filter((n) => n.id !== id));
      }
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };

  if (!currentItem) return null;

  return (
    <>
      {/* Permanent Toggle Button (Visible when Spec Drawer is closed) */}
      {!isSpecDrawerOpen && (
        <button
          onClick={() => setSpecDrawerOpen(true)}
          className="fixed right-0 top-20 z-40 h-auto flex items-center gap-2 pl-3 pr-2.5 py-2.5 rounded-l-2xl bg-white/95 backdrop-blur-md border-y border-l border-sky-300 shadow-xl text-slate-800 hover:bg-sky-50 hover:border-sky-400 hover:pl-3.5 transition-all group cursor-pointer"
          title={language === 'bn' ? 'স্পেকস প্যানেল পুনরায় দেখুন' : 'Show Specs Panel'}
        >
          <ChevronLeft className="w-4 h-4 text-sky-600 group-hover:-translate-x-0.5 transition-transform" />
          <div className="flex flex-col text-left">
            <span className="text-xs font-extrabold tracking-tight text-slate-900 leading-tight">
              {language === 'bn' ? 'স্পেকস দেখুন' : 'Specs'}
            </span>
            <span className="text-[10px] font-semibold text-sky-600 line-clamp-1 max-w-[100px]">
              {language === 'bn' ? currentItem.name_bn : currentItem.name_en}
            </span>
          </div>
        </button>
      )}

      {/* Main Slide-out Spec Drawer: 50% height bottom sheet on mobile, right drawer on desktop */}
      <aside
        className={`fixed z-40 transition-transform duration-300 ease-in-out
          bottom-0 left-0 right-0 w-full h-[50vh] max-h-[50vh]
          ${isSpecDrawerOpen ? 'translate-y-0 pointer-events-auto' : 'translate-y-[105%] pointer-events-none'}
          sm:top-[68px] sm:bottom-4 sm:right-3 sm:left-auto sm:w-[380px] sm:h-auto sm:max-h-[calc(100vh-84px)]
          ${isSpecDrawerOpen ? 'sm:translate-x-0 sm:translate-y-0' : 'sm:translate-x-[420px] sm:translate-y-0'}
        `}
      >
        <div className="h-full glass-drawer rounded-t-2xl sm:rounded-2xl border-t sm:border border-slate-200/90 shadow-2xl flex flex-col overflow-hidden bg-white/95 relative">
          {/* Mobile Grab Handle Bar */}
          <div
            className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-1.5 sm:hidden shrink-0 cursor-pointer"
            onClick={() => setSpecDrawerOpen(false)}
            title={language === 'bn' ? 'নিচে স্লাইড করে লুকান' : 'Slide down to hide'}
          />

          {/* Drawer Header */}
          <div className="px-3.5 py-2.5 sm:p-3.5 border-b border-slate-200 bg-slate-50/80 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200">
                {currentItem.category || 'Hardware Pin'}
              </span>

              <div className="flex items-center gap-2">
                {/* External Datasheet Link */}
                {currentDoc && (
                  <a
                    href={currentDoc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[11px] font-bold text-sky-600 hover:text-sky-800 hover:underline"
                    title="View manufacturer datasheet"
                  >
                    <span>{language === 'bn' ? 'অফিসিয়াল ডেটাশিট' : 'Datasheet'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}

                {/* Hide Specs Button */}
                <button
                  onClick={() => setSpecDrawerOpen(false)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 border border-slate-200 transition-colors shadow-2xs cursor-pointer"
                  title={language === 'bn' ? 'স্পেকস লুকান' : 'Hide Specs'}
                >
                  <span>{language === 'bn' ? 'লুকান' : 'Hide'}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 sm:hidden" />
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 hidden sm:inline" />
                </button>
              </div>
            </div>

            <h2 className="text-base font-bold text-slate-900 mt-1.5 leading-snug">
              {language === 'bn' ? currentItem.name_bn : currentItem.name_en}
            </h2>

            <p className="text-[11px] font-semibold text-slate-500 line-clamp-1 mt-0.5">
              {language === 'bn' ? currentItem.subtitle_bn : currentItem.subtitle_en}
            </p>

            {/* Navigation Tabs (Horizontally scrollable with smooth touch momentum) */}
            <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-slate-200 overflow-x-auto no-scrollbar flex-nowrap py-1">
              <button
                onClick={() => setActiveTab('specs')}
                className={`shrink-0 whitespace-nowrap flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${activeTab === 'specs'
                    ? 'bg-sky-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-200'
                  }`}
              >
                <Info className="w-3 h-3" />
                <span>{language === 'bn' ? 'স্পেকস' : 'Pin Specs'}</span>
              </button>

              {activeDevice === 'arduino_uno' && (
                <button
                  onClick={() => setActiveTab('architecture')}
                  className={`shrink-0 whitespace-nowrap flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${activeTab === 'architecture'
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  <Cpu className="w-3 h-3" />
                  <span>{language === 'bn' ? 'আর৩ গাইড' : 'Uno R3 Guide'}</span>
                </button>
              )}

              <button
                onClick={() => setActiveTab('notes')}
                className={`shrink-0 whitespace-nowrap flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${activeTab === 'notes'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-200'
                  }`}
              >
                {currentUser ? (
                  <Printer className="w-3 h-3" />
                ) : (
                  <Lock className="w-3 h-3 text-amber-600" />
                )}
                <span>{language === 'bn' ? 'ল্যাব চিট শিট' : 'Lab Cheat Sheet'}</span>
                {currentUser && bookmarkedPins.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-900 text-[9px] font-extrabold">
                    {bookmarkedPins.length}
                  </span>
                )}
              </button>

              {activeDevice === 'robotic_arm' && (
                <button
                  onClick={() => setActiveTab('servos')}
                  className={`shrink-0 whitespace-nowrap flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${activeTab === 'servos'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  <Sliders className="w-3 h-3" />
                  <span>{language === 'bn' ? 'সার্ভো' : 'Servos'}</span>
                </button>
              )}

              {activeDevice === 'ic_74ls00' && (
                <button
                  onClick={() => setActiveTab('logic')}
                  className={`shrink-0 whitespace-nowrap flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${activeTab === 'logic'
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  <Binary className="w-3 h-3" />
                  <span>{language === 'bn' ? 'লজিক সিমুলেটর' : 'Logic Simulator'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
            {/* TAB 1: LEGIT HARDWARE SPECS ONLY */}
            {activeTab === 'specs' && (
              <>
                {/* Engineering Description */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-500" />
                    <span>{language === 'bn' ? 'কার্যপ্রণালী' : 'Function Overview'}</span>
                  </h3>
                  <p className="text-xs text-slate-800 leading-relaxed font-medium">
                    {language === 'bn' ? currentItem.function_bn : currentItem.function_en}
                  </p>
                </div>

                {/* Verified Electrical Ratings Grid */}
                {currentItem.electrical && (
                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                      {language === 'bn' ? 'বৈদ্যুতিক রেটিং ও লজিক লেভেল' : 'Verified Electrical Ratings'}
                    </h3>
                    <div className="divide-y divide-slate-100 text-xs">
                      {Object.entries(currentItem.electrical).map(([key, val]) => (
                        <div key={key} className="flex justify-between items-center py-1.5">
                          <span className="text-slate-500 capitalize">
                            {key.replace(/_/g, ' ')}:
                          </span>
                          <span className="font-bold spec-mono text-slate-900 text-right">
                            {Array.isArray(val) ? val.join(', ') : String(val)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Direct Link to Manufacturer Datasheet */}
                {currentDoc && (
                  <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-200">
                    <span className="text-[11px] font-bold text-sky-900 block mb-1">
                      {language === 'bn' ? 'প্রোডাক্ট রেফারেন্স ও ম্যানুয়াল:' : 'Official Product Reference:'}
                    </span>
                    <a
                      href={currentDoc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 hover:underline"
                    >
                      <span>{language === 'bn' ? currentDoc.label_bn : currentDoc.label_en}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

                {/* Related Pins Jump-To */}
                {currentItem.related_pins && currentItem.related_pins.length > 0 && (
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">
                      {language === 'bn' ? 'সম্পর্কিত পিন' : 'Related Pins (Click to Navigate)'}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {currentItem.related_pins.map((pinMesh) => (
                        <button
                          key={pinMesh}
                          onClick={() => setSelectedPin(pinMesh)}
                          className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-700 text-xs font-bold border border-slate-200 transition-colors"
                        >
                          <span>{pinMesh.replace('Pin_', '').replace('Comp_', '')}</span>
                          <ChevronRight className="w-3 h-3 text-slate-400" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* TAB: ARDUINO UNO R3 SUBSYSTEMS & HARDWARE ARCHITECTURE GUIDE */}
            {activeTab === 'architecture' && activeDevice === 'arduino_uno' && (
              <div className="space-y-3">
                {/* Architecture Intro Banner */}
                <div className="bg-gradient-to-br from-indigo-50 via-sky-50 to-white p-3.5 rounded-xl border border-indigo-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-indigo-900 font-extrabold text-xs">
                    <Cpu className="w-4 h-4 text-indigo-600" />
                    <span>
                      {language === 'bn'
                        ? 'আর্ডুইনো ইউনো আর৩ হার্ডওয়্যার আর্কিটেকচার'
                        : 'Arduino Uno R3 Hardware Architecture'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                    {language === 'bn'
                      ? 'পাওয়ার সাপ্লাই, মেমরি লেআউট, ডিজিটাল I/O রেটিং, পিন ফাংশন ও যোগাযোগ প্রোটোকলের বিশদ বিবরণ।'
                      : 'Verified technical specifications for power supply rails, ATmega328P memory layout, I/O ratings, and communication subsystems.'}
                  </p>
                </div>

                {/* 1. POWER SUPPLY */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span>1. Power Supply</span>
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                      6V - 20V Input
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    The power supply of the Arduino can be done with the help of an exterior power supply otherwise USB connection. The exterior power supply (6 to 20 volts) mainly includes a battery or an AC to DC adapter. The connection of an adapter can be done by plugging a center-positive plug (2.1mm) into the power jack on the board. The battery terminals can be placed in the pins of Vin as well as GND. The power pins of an Arduino board include the following:
                  </p>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 divide-y divide-slate-200 text-xs space-y-2">
                    <div className="pt-1 flex flex-col gap-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">Vin:</span>
                        <button
                          onClick={() => { setSelectedPin('Pin_VIN'); setActiveTab('specs'); }}
                          className="text-[10px] font-bold text-sky-600 hover:text-sky-800 hover:underline flex items-center gap-0.5"
                        >
                          <span>Focus Pin</span>
                          <ChevronRight className="w-2.5 h-2.5" />
                        </button>
                      </div>
                      <span className="text-slate-600 text-[11px]">
                        The input voltage or Vin to the Arduino while it is using an exterior power supply opposite to volts from the connection of USB or else RPS (regulated power supply). By using this pin, one can supply the voltage.
                      </span>
                    </div>
                    <div className="pt-2 flex flex-col gap-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">5Volts:</span>
                        <button
                          onClick={() => { setSelectedPin('Pin_5V'); setActiveTab('specs'); }}
                          className="text-[10px] font-bold text-sky-600 hover:text-sky-800 hover:underline flex items-center gap-0.5"
                        >
                          <span>Focus Pin</span>
                          <ChevronRight className="w-2.5 h-2.5" />
                        </button>
                      </div>
                      <span className="text-slate-600 text-[11px]">
                        The RPS can be used to give the power supply to the microcontroller as well as components which are used on the Arduino board. This can approach from the input voltage through a regulator.
                      </span>
                    </div>
                    <div className="pt-2 flex flex-col gap-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">3V3:</span>
                        <button
                          onClick={() => { setSelectedPin('Pin_3V3'); setActiveTab('specs'); }}
                          className="text-[10px] font-bold text-sky-600 hover:text-sky-800 hover:underline flex items-center gap-0.5"
                        >
                          <span>Focus Pin</span>
                          <ChevronRight className="w-2.5 h-2.5" />
                        </button>
                      </div>
                      <span className="text-slate-600 text-[11px]">
                        A 3.3 supply voltage can be generated with the onboard regulator, and the highest draw current will be <strong className="text-slate-800">50 mA</strong>.
                      </span>
                    </div>
                    <div className="pt-2 flex flex-col gap-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">GND:</span>
                        <button
                          onClick={() => { setSelectedPin('Pin_GND1'); setActiveTab('specs'); }}
                          className="text-[10px] font-bold text-sky-600 hover:text-sky-800 hover:underline flex items-center gap-0.5"
                        >
                          <span>Focus Pin</span>
                          <ChevronRight className="w-2.5 h-2.5" />
                        </button>
                      </div>
                      <span className="text-slate-600 text-[11px]">GND (ground) pins.</span>
                    </div>
                  </div>
                </div>

                {/* 2. MEMORY */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-indigo-500" />
                      <span>2. Memory</span>
                    </h4>
                    <button
                      onClick={() => { setSelectedPin('Chip_ATMEGA328P'); setActiveTab('specs'); }}
                      className="text-[10px] font-bold text-sky-600 hover:underline flex items-center gap-0.5"
                    >
                      <span>ATmega328P 3D</span>
                      <ChevronRight className="w-2.5 h-2.5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    The memory of an ATmega328 microcontroller includes 32 KB and 0.5 KB memory is utilized for the Boot loader), and also it includes SRAM-2 KB as well as EEPROM-1KB.
                  </p>
                  <div className="grid grid-cols-3 gap-1.5 text-center text-xs pt-1">
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-400 block font-bold">Flash Memory</span>
                      <span className="font-extrabold text-slate-900">32 KB</span>
                      <span className="text-[9px] text-slate-500 block">0.5 KB Bootloader</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-400 block font-bold">SRAM</span>
                      <span className="font-extrabold text-slate-900">2 KB</span>
                      <span className="text-[9px] text-slate-500 block">Data Memory</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-400 block font-bold">EEPROM</span>
                      <span className="font-extrabold text-slate-900">1 KB</span>
                      <span className="text-[9px] text-slate-500 block">Non-volatile</span>
                    </div>
                  </div>
                </div>

                {/* 3. INPUT AND OUTPUT */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-emerald-500" />
                      <span>3. Input and Output</span>
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      14 Digital Pins (5V)
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    We know that an Arduino Uno R3 includes 14-digital pins which can be used as an input otherwise output by using the functions like <code className="font-mono bg-slate-100 px-1 py-0.2 rounded text-sky-700 font-bold">pinMode()</code>, <code className="font-mono bg-slate-100 px-1 py-0.2 rounded text-sky-700 font-bold">digitalRead()</code>, and <code className="font-mono bg-slate-100 px-1 py-0.2 rounded text-sky-700 font-bold">digitalWrite()</code>. These pins can operate with 5V, and every digital pin can give or receive 20mA, & includes a 20k to 50k ohm pull up resistor. The maximum current on any pin is 40mA which cannot surpass for avoiding the microcontroller from the damage. Additionally, some of the pins of an Arduino include specific functions.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <span className="font-bold text-slate-700 block">Operating Logic:</span>
                      <span className="text-slate-900 font-semibold">5V DC • 20mA nominal</span>
                    </div>
                    <div className="bg-rose-50 p-2 rounded-lg border border-rose-200">
                      <span className="font-bold text-rose-800 block">Max Current Limit:</span>
                      <span className="text-rose-900 font-bold">40mA max per pin</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <span className="font-bold text-slate-700 block">Internal Pull-up:</span>
                      <span className="text-slate-900 font-semibold">20kΩ to 50kΩ</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <span className="font-bold text-slate-700 block">Count:</span>
                      <span className="text-slate-900 font-semibold">14 Digital I/O (Pins 0-13)</span>
                    </div>
                  </div>
                </div>

                {/* 4. SERIAL PINS */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-sky-500" />
                      <span>4. Serial Pins</span>
                    </h4>
                    <div className="flex gap-1">
                      <button onClick={() => { setSelectedPin('Pin_D0'); setActiveTab('specs'); }} className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 hover:bg-sky-200">RX (0)</button>
                      <button onClick={() => { setSelectedPin('Pin_D1'); setActiveTab('specs'); }} className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 hover:bg-sky-200">TX (1)</button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    The serial pins of an Arduino board are TX (1) and RX (0) pins and these pins can be used to transfer the TTL serial data. The connection of these pins can be done with the equivalent pins of the ATmega8 U2 USB to TTL chip.
                  </p>
                </div>

                {/* 5. EXTERNAL INTERRUPT PINS */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span>5. External Interrupt Pins</span>
                    </h4>
                    <div className="flex gap-1">
                      <button onClick={() => { setSelectedPin('Pin_D2'); setActiveTab('specs'); }} className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 hover:bg-amber-200">Pin 2 (INT0)</button>
                      <button onClick={() => { setSelectedPin('Pin_D3'); setActiveTab('specs'); }} className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 hover:bg-amber-200">Pin 3 (INT1)</button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    The external interrupt pins of the board are 2 & 3, and these pins can be arranged to activate an interrupt on a rising otherwise falling edge, a low-value otherwise a modify in value.
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {['rising edge', 'falling edge', 'low-value', 'modify in value (CHANGE)'].map((m) => (
                      <span key={m} className="text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 6. PWM PINS */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-blue-500" />
                      <span>6. PWM Pins</span>
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 font-mono">
                      analogWrite()
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    The PWM pins of an Arduino are 3, 5, 6, 9, 10, & 11, and gives an output of an 8-bit PWM with the function analog Write ().
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[3, 5, 6, 9, 10, 11].map((p) => (
                      <button
                        key={p}
                        onClick={() => { setSelectedPin(`Pin_D${p}`); setActiveTab('specs'); }}
                        className="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 transition-colors"
                      >
                        ~Pin {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 7. SPI PINS */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-indigo-500" />
                      <span>7. SPI (Serial Peripheral Interface) Pins</span>
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200">
                      SPI Library
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    The SPI pins are 10, 11, 12, 13 namely SS, MOSI, MISO, SCK, and these will maintain the SPI communication with the help of the SPI library.
                  </p>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 divide-y divide-slate-200 text-xs space-y-2">
                    <div className="pt-1 flex flex-col gap-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">MOSI (Pin 11):</span>
                        <button onClick={() => { setSelectedPin('Pin_D11'); setActiveTab('specs'); }} className="text-[10px] font-bold text-sky-600 hover:underline">Focus 3D</button>
                      </div>
                      <span className="text-slate-600 text-[11px]">This is the master out slave in the pin, used to transmit the data to the devices.</span>
                    </div>
                    <div className="pt-2 flex flex-col gap-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">MISO (Pin 12):</span>
                        <button onClick={() => { setSelectedPin('Pin_D12'); setActiveTab('specs'); }} className="text-[10px] font-bold text-sky-600 hover:underline">Focus 3D</button>
                      </div>
                      <span className="text-slate-600 text-[11px]">This pin is a serial CLK, and the CLK pulse will synchronize the transmission of which is produced by the master.</span>
                    </div>
                    <div className="pt-2 flex flex-col gap-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">SCK (Pin 13):</span>
                        <button onClick={() => { setSelectedPin('Pin_D13'); setActiveTab('specs'); }} className="text-[10px] font-bold text-sky-600 hover:underline">Focus 3D</button>
                      </div>
                      <span className="text-slate-600 text-[11px]">The CLK pulse synchronizes data transmission that is generated by the master. Equivalent pins with the SPI library is employed for the communication of SPI.</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 italic bg-white p-2 rounded border border-slate-100">
                    ICSP (in-circuit serial programming) headers can be utilized for programming ATmega microcontroller directly with the boot loader.
                  </p>
                </div>

                {/* 8. LED PIN */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>8. LED Pin</span>
                    </h4>
                    <button
                      onClick={() => { setSelectedPin('Pin_D13'); setActiveTab('specs'); }}
                      className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 hover:bg-amber-200"
                    >
                      Pin 13 3D
                    </button>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    An arguing board is inbuilt with a LED using digital pin-13. Whenever the digital pin is high, the LED will glow otherwise it will not glow.
                  </p>
                </div>

                {/* 9. TWI PINS */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-emerald-500" />
                      <span>9. TWI (2-Wire Interface) Pins</span>
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Wire Library
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    The TWI pins are SDA or A4, & SCL or A5, which can support the communication of TWI with the help of Wire library. In this, both the SCL and SDA are CLK signal and data signal.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <button
                      onClick={() => { setSelectedPin('Pin_A4'); setActiveTab('specs'); }}
                      className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-200 text-left hover:bg-emerald-100 transition-colors"
                    >
                      <span className="font-bold text-emerald-900 block">SDA: Pin A4</span>
                      <span className="text-[10px] text-emerald-700">Data Signal</span>
                    </button>
                    <button
                      onClick={() => { setSelectedPin('Pin_A5'); setActiveTab('specs'); }}
                      className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-200 text-left hover:bg-emerald-100 transition-colors"
                    >
                      <span className="font-bold text-emerald-900 block">SCL: Pin A5</span>
                      <span className="text-[10px] text-emerald-700">CLK Clock Signal</span>
                    </button>
                  </div>
                </div>

                {/* 10. AREF PIN */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-sky-500" />
                      <span>10. AREF (Analog Reference) Pin</span>
                    </h4>
                    <button
                      onClick={() => { setSelectedPin('Pin_AREF'); setActiveTab('specs'); }}
                      className="text-[10px] font-bold text-sky-600 hover:underline"
                    >
                      Focus Pin
                    </button>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    An analog reference pin is the reference voltage to the inputs of an analog i/ps using the function like <code className="font-mono bg-slate-100 px-1 py-0.2 rounded text-sky-700 font-bold">analogReference()</code>.
                  </p>
                </div>

                {/* 11. RESET PIN */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-rose-500" />
                      <span>11. Reset (RST) Pin</span>
                    </h4>
                    <button
                      onClick={() => { setSelectedPin('Pin_RESET'); setActiveTab('specs'); }}
                      className="text-[10px] font-bold text-sky-600 hover:underline"
                    >
                      Focus Pin
                    </button>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    This pin brings a low line for resetting the microcontroller, and it is very useful for using an RST button toward shields which can block the one over the Arduino R3 board.
                  </p>
                </div>

                {/* 12. COMMUNICATION */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-indigo-500" />
                      <span>12. Communication</span>
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200">
                      UART • I2C • SPI
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    The communication protocols of an Arduino Uno include SPI, I2C, and UART serial communication.
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <span className="font-bold text-slate-900 block">UART:</span>
                      <span className="text-slate-600 text-[11px]">
                        An Arduino Uno uses the two functions like the transmitter digital pin1 and the receiver digital pin0. These pins are mainly used in UART TTL serial communication.
                      </span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <span className="font-bold text-slate-900 block">I2C:</span>
                      <span className="text-slate-600 text-[11px]">
                        An Arduino UNO board employs SDA pin otherwise A4 pin & A5 pin otherwise SCL pin is used for I2C communication with wire library. In this, both the SCL and SDA are CLK signal and data signal.
                      </span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <span className="font-bold text-slate-900 block">SPI:</span>
                      <span className="text-slate-600 text-[11px]">
                        The SPI communication includes MOSI, MISO, and SCK. MOSI (Pin11): Master out slave in, used to transmit data to devices. MISO (Pin12): Serial CLK synchronizes transmission produced by master. SCK (Pin13): CLK pulse synchronizes data transmission generated by master. Equivalent pins with the SPI library is employed for SPI communication. ICSP headers can program ATmega directly.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: LAB CHEAT SHEET & VIVA PREP (Advantage #2) */}
            {activeTab === 'notes' && (
              <div className="space-y-3">
                {!currentUser ? (
                  /* --- GUEST MODE: Clear Personal Usage Advantage Notice --- */
                  <div className="bg-gradient-to-br from-amber-50/70 via-white to-sky-50/70 rounded-2xl p-4 border border-amber-200 shadow-sm space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center border border-amber-400/40 shrink-0 mt-0.5">
                        <Printer className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.2 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                            {language === 'bn' ? 'স্টুডেন্ট মেম্বার সুবিধা' : 'Student Account Advantage'}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 mt-1">
                          {language === 'bn' ? '১-ক্লিক প্রিন্ট উপযোগী ল্যাব চিট শিট' : '1-Click Printable Lab Cheat Sheet & Viva Voce PDF'}
                        </h4>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                      {language === 'bn'
                        ? 'গেস্ট হিসেবে আপনি বিনামূল্যে যেকোনো ৩ডি পিন ও স্পেকস দেখতে পারছেন। তবে সেমিস্টার ফাইনাল ল্যাব পরীক্ষা ও ভাইভা প্রস্তুতির জন্য প্রয়োজনীয় পিন বুকমার্ক করে প্রিন্ট উপযোগী A4 চিট শিট তৈরি করতে একটি ফ্রি অ্যাকাউন্ট প্রয়োজন।'
                        : 'You are viewing Silicon Lens in Guest Mode. To bookmark key exam pins across boards and generate an official, formatted A4 printable cheat sheet for your university lab exams, please log in or create a student account.'}
                    </p>

                    <div className="space-y-1.5 bg-white/90 p-2.5 rounded-xl border border-slate-200 text-[11px] text-slate-700 font-medium">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                        <span>{language === 'bn' ? 'পিন বুকমার্ক ও কাস্টম রিভিশন তালিকা' : 'Pin bookmarks across Arduino, 8086 & Robotics'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                        <span>{language === 'bn' ? 'ল্যাব পরীক্ষার জন্য A4 প্রিন্ট উপযোগী টেবিল ও সতর্কতা' : 'A4 ready formatted tables, voltage ratings & cautions'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                        <span>{language === 'bn' ? 'ব্যক্তিগত ল্যাব নোট ও ভাইভা প্রস্তুতি' : 'Personal SQLite lab notes & exam tips'}</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-1">
                      <button
                        onClick={() => openAuthModal('signup')}
                        className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>{language === 'bn' ? 'অ্যাকাউন্ট তৈরি করুন বা লগইন' : 'Create Free Account / Sign In'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => toggleCheatSheetModal(true)}
                        className="w-full py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 border border-slate-200"
                      >
                        <Printer className="w-3 h-3 text-amber-600" />
                        <span>{language === 'bn' ? 'চিট শিট প্রিভিউ দেখুন (নমুনা)' : 'Preview Sample Lab Cheat Sheet'}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* --- LOGGED IN: Bookmark Pin, Print Cheat Sheet & SQLite Notes --- */
                  <div className="space-y-3">
                    {/* Bookmark & Print Bar */}
                    <div className="bg-amber-50/60 rounded-xl p-3 border border-amber-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                          <span>{language === 'bn' ? 'ল্যাব চিট শিট প্রস্তুতি' : 'Lab Cheat Sheet Actions'}</span>
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-amber-200 text-amber-900">
                          {bookmarkedPins.length} {language === 'bn' ? 'টি পিন যুক্ত' : 'Bookmarked'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {/* Bookmark Toggle */}
                        {(() => {
                          const isCurrentBookmarked = bookmarkedPins.some(
                            (p) => (typeof p === 'object' ? p.meshName === currentItem.mesh_name : p === currentItem.mesh_name)
                          );
                          return (
                            <button
                              onClick={() => toggleBookmarkPin(currentItem.mesh_name, activeDevice)}
                              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs border ${isCurrentBookmarked
                                  ? 'bg-amber-200 text-amber-900 border-amber-300 hover:bg-amber-300'
                                  : 'bg-white text-slate-700 border-slate-300 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-300'
                                }`}
                            >
                              {isCurrentBookmarked ? (
                                <>
                                  <BookmarkCheck className="w-3.5 h-3.5 text-amber-800" />
                                  <span>{language === 'bn' ? 'বুকমার্ক করা আছে' : 'Pin Bookmarked'}</span>
                                </>
                              ) : (
                                <>
                                  <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{language === 'bn' ? 'চিট শিটে যুক্ত করুন' : 'Bookmark Pin'}</span>
                                </>
                              )}
                            </button>
                          );
                        })()}

                        {/* Launch Print Modal */}
                        <button
                          onClick={() => toggleCheatSheetModal(true)}
                          className="py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-95"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'A4 চিট শিট প্রিন্ট' : 'Print A4 Cheat Sheet'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Personal SQLite Notes Section */}
                    <div className="pt-2 border-t border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-700">
                          {language === 'bn' ? 'এই পিনের ব্যক্তিগত নোট' : 'Personal Lab Notes'}
                        </span>
                        <button
                          onClick={() => setIsAddingNote(!isAddingNote)}
                          className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-sky-600 text-white hover:bg-sky-700 shadow-2xs transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                          <span>{language === 'bn' ? 'নতুন নোট' : 'Add Note'}</span>
                        </button>
                      </div>

                      {isAddingNote && (
                        <form onSubmit={handleSaveNote} className="bg-white p-3 rounded-xl border border-sky-300 shadow-sm space-y-2 mb-3">
                          <input
                            type="text"
                            placeholder="Title (e.g. Lab Viva Tip)"
                            value={newNoteTitle}
                            onChange={(e) => setNewNoteTitle(e.target.value)}
                            required
                            className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 outline-none focus:border-sky-500"
                          />
                          <input
                            type="text"
                            placeholder="Course Code"
                            value={courseCode}
                            onChange={(e) => setCourseCode(e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 outline-none focus:border-sky-500"
                          />
                          <textarea
                            placeholder="Type note content to store in database..."
                            value={newNoteContent}
                            onChange={(e) => setNewNoteContent(e.target.value)}
                            required
                            rows={2}
                            className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 outline-none focus:border-sky-500"
                          />
                          <div className="flex justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setIsAddingNote(false)}
                              className="px-2.5 py-1 text-xs text-slate-500 hover:bg-slate-100 rounded-lg"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-3 py-1 text-xs font-bold bg-sky-600 text-white rounded-lg hover:bg-sky-700"
                            >
                              Save Note
                            </button>
                          </div>
                        </form>
                      )}

                      {pinNotes.length === 0 ? (
                        <div className="text-center py-5 px-3 bg-slate-50 rounded-xl border border-slate-200">
                          <BookMarked className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                          <p className="text-xs font-medium text-slate-500">
                            {language === 'bn' ? 'এই পিনে কোনো নোট সেভ করা নেই।' : 'No personal notes for this pin yet.'}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {pinNotes.map((note) => (
                            <div key={note.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 relative">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-900">{note.title}</span>
                                <button
                                  onClick={() => handleDeleteNote(note.id)}
                                  className="text-slate-400 hover:text-rose-600 p-1"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                              <span className="text-[10px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.2 rounded-full border border-sky-100">
                                {note.course_code}
                              </span>
                              <p className="text-xs text-slate-700 leading-relaxed font-medium">{note.content}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: ROBOTIC ARM SERVO ANGLE SLIDERS */}
            {activeTab === 'servos' && (
              <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Kinematic Servo Joints</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    50 Hz PWM
                  </span>
                </div>

                {/* Base Yaw */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">1. Base Yaw (D3):</span>
                    <span className="spec-mono text-sky-600">{servoAngles.base}° ({Math.round(1000 + (servoAngles.base / 180) * 1000)} µs)</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="180"
                    value={servoAngles.base}
                    onChange={(e) => setServoAngle('base', Number(e.target.value))}
                    className="w-full accent-sky-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Shoulder Pitch */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">2. Shoulder Pitch (D5):</span>
                    <span className="spec-mono text-emerald-600">{servoAngles.shoulder}° ({Math.round(1000 + (servoAngles.shoulder / 180) * 1000)} µs)</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="180"
                    value={servoAngles.shoulder}
                    onChange={(e) => setServoAngle('shoulder', Number(e.target.value))}
                    className="w-full accent-emerald-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Elbow Pitch */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">3. Elbow Pitch (D6):</span>
                    <span className="spec-mono text-blue-600">{servoAngles.elbow}° ({Math.round(1000 + (servoAngles.elbow / 180) * 1000)} µs)</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="180"
                    value={servoAngles.elbow}
                    onChange={(e) => setServoAngle('elbow', Number(e.target.value))}
                    className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Gripper Claw */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">4. Gripper Claw (D9):</span>
                    <span className="spec-mono text-pink-600">{servoAngles.gripper}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="180"
                    value={servoAngles.gripper}
                    onChange={(e) => setServoAngle('gripper', Number(e.target.value))}
                    className="w-full accent-pink-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* TAB 4: 74LS00 QUAD 2-INPUT NAND LIVE LOGIC SIMULATOR */}
            {activeTab === 'logic' && (
              <div className="space-y-3.5">
                {/* Simulator Sub-Mode Tabs */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1 text-xs border border-slate-200">
                  <button
                    onClick={() => setLogicSubTab('quad_nand')}
                    className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition-all text-center ${logicSubTab === 'quad_nand'
                        ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80'
                        : 'text-slate-600 hover:text-slate-900'
                      }`}
                  >
                    {language === 'bn' ? 'কোয়াড ন্যান্ড' : '4-NAND Gates'}
                  </button>
                  <button
                    onClick={() => setLogicSubTab('sr_latch')}
                    className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition-all text-center ${logicSubTab === 'sr_latch'
                        ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80'
                        : 'text-slate-600 hover:text-slate-900'
                      }`}
                  >
                    {language === 'bn' ? 'এস-আর ল্যাচ (মেমরি)' : 'SR Latch (Mem)'}
                  </button>
                  <button
                    onClick={() => setLogicSubTab('universal')}
                    className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition-all text-center ${logicSubTab === 'universal'
                        ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80'
                        : 'text-slate-600 hover:text-slate-900'
                      }`}
                  >
                    {language === 'bn' ? 'ইউনিভার্সাল লজিক' : 'Universal Logic'}
                  </button>
                </div>

                {/* SUB-TAB 1: 4-NAND GATES LIVE SIMULATOR */}
                {logicSubTab === 'quad_nand' && (
                  <div className="space-y-3">
                    {/* Top Bar with Description & Quick Controls */}
                    <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-100 flex items-center justify-between gap-2">
                      <div>
                        <div className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{language === 'bn' ? 'রিয়েল-টাইম ন্যান্ড গেট সিমুলেটর' : 'Live 4-NAND Logic Engine'}</span>
                        </div>
                        <div className="text-[11px] text-indigo-700 font-medium mt-0.5">
                          {language === 'bn'
                            ? 'ইনপুট টগল করুন; ৩ডি মডেলে সিলিকন গেট ও পিনের গ্লো পর্যবেক্ষণ করুন'
                            : 'Toggle inputs; watch 3D silicon gates & output pins react'}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={resetLogicInputs}
                          className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-[10px] font-bold border border-slate-200 shadow-2xs transition-all"
                          title="Set all inputs to 0"
                        >
                          {language === 'bn' ? 'সব ০' : 'All 0'}
                        </button>
                        <button
                          onClick={() => setLogicInputs({ g1A: 1, g1B: 1, g2A: 1, g2B: 1, g3A: 1, g3B: 1, g4A: 1, g4B: 1 })}
                          className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold shadow-2xs transition-all"
                          title="Set all inputs to 1"
                        >
                          {language === 'bn' ? 'সব ১' : 'All 1'}
                        </button>
                      </div>
                    </div>

                    {/* 4 Independent Gate Cards */}
                    {[
                      { gate: 1, aKey: 'g1A', bKey: 'g1B', aPin: '1A (Pin 1)', bPin: '1B (Pin 2)', yPin: '1Y (Pin 3)' },
                      { gate: 2, aKey: 'g2A', bKey: 'g2B', aPin: '2A (Pin 4)', bPin: '2B (Pin 5)', yPin: '2Y (Pin 6)' },
                      { gate: 3, aKey: 'g3A', bKey: 'g3B', aPin: '3A (Pin 9)', bPin: '3B (Pin 10)', yPin: '3Y (Pin 8)' },
                      { gate: 4, aKey: 'g4A', bKey: 'g4B', aPin: '4A (Pin 12)', bPin: '4B (Pin 13)', yPin: '4Y (Pin 11)' }
                    ].map(({ gate, aKey, bKey, aPin, bPin, yPin }) => {
                      const valA = logicInputs[aKey] || 0;
                      const valB = logicInputs[bKey] || 0;
                      const valY = (valA && valB) ? 0 : 1;
                      const isHigh = valY === 1;

                      return (
                        <div
                          key={gate}
                          className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs hover:border-indigo-300 transition-all space-y-2.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                              <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-extrabold text-slate-700">
                                G{gate}
                              </span>
                              <span>Gate #{gate}: {yPin}</span>
                            </span>

                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold border ${isHigh
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                              }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${isHigh ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                              {isHigh ? 'HIGH (3.4V)' : 'LOW (0.35V)'}
                            </span>
                          </div>

                          {/* Interactive Toggle Buttons for Inputs A and B */}
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => toggleLogicInput(aKey)}
                              className={`p-2 rounded-xl text-left border transition-all flex items-center justify-between ${valA === 1
                                  ? 'bg-sky-50 border-sky-300 text-sky-900 shadow-2xs'
                                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                              <div>
                                <div className="text-[10px] font-semibold text-slate-400 uppercase">{aPin}</div>
                                <div className="text-xs font-bold">Input A</div>
                              </div>
                              <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-extrabold ${valA === 1 ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-700'
                                }`}>
                                {valA}
                              </span>
                            </button>

                            <button
                              onClick={() => toggleLogicInput(bKey)}
                              className={`p-2 rounded-xl text-left border transition-all flex items-center justify-between ${valB === 1
                                  ? 'bg-sky-50 border-sky-300 text-sky-900 shadow-2xs'
                                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                              <div>
                                <div className="text-[10px] font-semibold text-slate-400 uppercase">{bPin}</div>
                                <div className="text-xs font-bold">Input B</div>
                              </div>
                              <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-extrabold ${valB === 1 ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-700'
                                }`}>
                                {valB}
                              </span>
                            </button>
                          </div>

                          {/* Output Equation Bar */}
                          <div className="bg-slate-50 rounded-lg p-2 border border-slate-100 flex items-center justify-between text-xs">
                            <span className="text-slate-500 font-mono">
                              Y = ~({valA} · {valB})
                            </span>
                            <span className="font-mono font-bold text-slate-900">
                              Output = <span className={isHigh ? 'text-emerald-600 font-black' : 'text-rose-600 font-black'}>{valY}</span>
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    {/* Real-time Dynamic Truth Table */}
                    <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">
                          {language === 'bn' ? 'ন্যান্ড গেট সত্যক সারণী (Truth Table)' : 'NAND Truth Table (Gate 1 Live Tracking)'}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">Y = ~(A · B)</span>
                      </div>

                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                            <th className="py-1 px-2">Input A</th>
                            <th className="py-1 px-2">Input B</th>
                            <th className="py-1 px-2 text-right">Output Y</th>
                            <th className="py-1 px-2 text-right">State</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-mono">
                          {[
                            { a: 0, b: 0, y: 1, desc: 'HIGH' },
                            { a: 0, b: 1, y: 1, desc: 'HIGH' },
                            { a: 1, b: 0, y: 1, desc: 'HIGH' },
                            { a: 1, b: 1, y: 0, desc: 'LOW' }
                          ].map((row, idx) => {
                            const isActive = logicInputs.g1A === row.a && logicInputs.g1B === row.b;
                            return (
                              <tr
                                key={idx}
                                className={`transition-colors ${isActive
                                    ? 'bg-emerald-50 text-emerald-900 font-bold'
                                    : 'text-slate-700 hover:bg-slate-50'
                                  }`}
                              >
                                <td className="py-1.5 px-2">{row.a}</td>
                                <td className="py-1.5 px-2">{row.b}</td>
                                <td className="py-1.5 px-2 text-right font-black">
                                  <span className={row.y === 1 ? 'text-emerald-600' : 'text-rose-600'}>{row.y}</span>
                                </td>
                                <td className="py-1.5 px-2 text-right">
                                  {isActive && (
                                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-ping" />
                                  )}
                                  <span className="text-[10px] font-sans font-bold">{row.desc}</span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* SUB-TAB 2: SR LATCH & FLIP-FLOP MEMORY CELL */}
                {logicSubTab === 'sr_latch' && (
                  <div className="space-y-3">
                    <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 space-y-1">
                      <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>{language === 'bn' ? 'ক্রস-কাপল্ড ন্যান্ড এস-আর ল্যাচ (মেমরি সেল)' : 'Active-Low NAND SR Latch'}</span>
                      </div>
                      <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                        {language === 'bn'
                          ? 'গেট ১ ও গেট ২ এর ক্রস-কাপল্ড ফিডব্যাকের মাধ্যমে তৈরি ১-বিট মেমরি সেল। এটি ডিজিটাল রেজিস্টার ও এসআর ফ্লিপ-ফ্লপের ভিত্তি।'
                          : 'Gate 1 and Gate 2 cross-coupled to form a bistable multivibrator that stores 1 bit of memory—the foundation of modern SRAM and flip-flops.'}
                      </p>
                    </div>

                    {/* Latch Status Card */}
                    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">Memory Output State</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${srLatch.status.includes('SET')
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : srLatch.status.includes('RESET')
                              ? 'bg-sky-50 text-sky-700 border-sky-300'
                              : srLatch.status.includes('INVALID')
                                ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                                : 'bg-amber-50 text-amber-800 border-amber-300'
                          }`}>
                          {srLatch.status}
                        </span>
                      </div>

                      {/* Large Glowing Output Display */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                          <div className="text-[10px] font-bold uppercase text-slate-400">Primary Output Q (Pin 3)</div>
                          <div className={`text-2xl font-black font-mono mt-1 ${srLatch.Q === 1 ? 'text-emerald-600' : 'text-slate-500'}`}>
                            {srLatch.Q}
                          </div>
                          <div className="text-[10px] font-semibold text-slate-500">{srLatch.Q === 1 ? 'Logic 1 (HIGH)' : 'Logic 0 (LOW)'}</div>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                          <div className="text-[10px] font-bold uppercase text-slate-400">Complement Q̄ (Pin 6)</div>
                          <div className={`text-2xl font-black font-mono mt-1 ${srLatch.Q_bar === 1 ? 'text-emerald-600' : 'text-slate-500'}`}>
                            {srLatch.Q_bar}
                          </div>
                          <div className="text-[10px] font-semibold text-slate-500">{srLatch.Q_bar === 1 ? 'Logic 1 (HIGH)' : 'Logic 0 (LOW)'}</div>
                        </div>
                      </div>

                      {/* Interactive Trigger Buttons */}
                      <div className="space-y-1.5 pt-1">
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          {language === 'bn' ? 'ল্যাচ কন্ট্রোল পালস পাঠান' : 'Apply Latch Pulse:'}
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setSRLatch(0, 1)}
                            className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs transition-all flex items-center justify-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Pulse SET (S̄=0, R̄=1)</span>
                          </button>

                          <button
                            onClick={() => setSRLatch(1, 0)}
                            className="py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-2xs transition-all flex items-center justify-center gap-1.5"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Pulse RESET (S̄=1, R̄=0)</span>
                          </button>

                          <button
                            onClick={() => setSRLatch(1, 1)}
                            className="py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-2xs transition-all flex items-center justify-center gap-1.5"
                          >
                            <span>HOLD MEMORY (S̄=1, R̄=1)</span>
                          </button>

                          <button
                            onClick={() => setSRLatch(0, 0)}
                            className="py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-2xs transition-all flex items-center justify-center gap-1.5"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>HAZARD (S̄=0, R̄=0)</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* DLD Viva Revision Note */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs text-slate-700">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-sky-600" />
                        <span>{language === 'bn' ? 'ভাইভা প্রশ্ন: কেন (০,০) নিষিদ্ধ?' : 'DLD Viva: Why is (0,0) Forbidden?'}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                        {language === 'bn'
                          ? 'অ্যাক্টিভ-লো ন্যান্ড ল্যাচে উভয় ইনপুট ০ হলে Q ও Q̄ উভয়ই ১ হয়ে যায়, যা কমপ্লিমেন্টারি নীতির পরিপন্থী। পরবর্তীতে দুটি ইনপুটই একসাথে ১ হলে কোন গেট আগে সুইচ করবে তা নিয়ে রেস কন্ডিশন (Race Hazard) তৈরি হয়।'
                          : 'In an active-low NAND latch, S̄=0 and R̄=0 forces both Q and Q̄ to 1, violating complementary logic. Transitioning simultaneously back to (1,1) triggers a race condition where output is unpredictable.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* SUB-TAB 3: UNIVERSAL GATE SYNTHESIS */}
                {logicSubTab === 'universal' && (
                  <div className="space-y-3">
                    <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-100 space-y-1">
                      <div className="text-xs font-bold text-indigo-950">
                        {language === 'bn' ? 'ইউনিভার্সাল ন্যান্ড গেট সংশ্লেষণ' : 'Universal Gate Synthesis with 74LS00'}
                      </div>
                      <p className="text-[11px] text-indigo-800 leading-relaxed font-medium">
                        {language === 'bn'
                          ? 'সিলেক্ট করে দেখুন কীভাবে একটিমাত্র ৭৪এলএস০০ আইসি ব্যবহার করে যেকোনো মৌলিক গেট বাস্তবায়ন করা যায়।'
                          : 'Select any target logic gate to see how 74LS00 NAND gates combine to synthesize it.'}
                      </p>
                    </div>

                    {/* Gate Selector Pills */}
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs border border-slate-200">
                      {['NOT', 'AND', 'OR', 'NOR', 'XOR'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setUniversalGateType(type)}
                          className={`flex-1 py-1.5 rounded-lg font-bold transition-all text-center ${universalGateType === type
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>

                    {/* Active Gate Breakdown Card */}
                    <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs space-y-2.5">
                      {universalGateType === 'NOT' && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900">NOT Gate (Inverter)</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                              1 NAND Gate
                            </span>
                          </div>
                          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 font-mono text-xs text-slate-800 space-y-1">
                            <div><strong>Formula:</strong> Y = ~(A · A) = Ā</div>
                            <div className="text-slate-500 text-[11px]">Pinout: Tie Pin 1 (1A) and Pin 2 (1B) together. Input to Pin 1+2, Output from Pin 3.</div>
                          </div>
                        </>
                      )}

                      {universalGateType === 'AND' && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900">AND Gate</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                              2 NAND Gates
                            </span>
                          </div>
                          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 font-mono text-xs text-slate-800 space-y-1">
                            <div><strong>Formula:</strong> Y = ~( ~(A · B) ) = A · B</div>
                            <div className="text-slate-500 text-[11px]">Gate 1 computes ~(A·B). Output (Pin 3) connects to Gate 2 inputs (Pins 4 & 5) acting as inverter.</div>
                          </div>
                        </>
                      )}

                      {universalGateType === 'OR' && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900">OR Gate (De Morgan's Theorem)</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                              3 NAND Gates
                            </span>
                          </div>
                          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 font-mono text-xs text-slate-800 space-y-1">
                            <div><strong>Formula:</strong> Y = ~(Ā · B̄) = Ā̄ + B̄̄ = A + B</div>
                            <div className="text-slate-500 text-[11px]">Gate 1 inverts A, Gate 2 inverts B. Outputs feed into Gate 3 inputs.</div>
                          </div>
                        </>
                      )}

                      {universalGateType === 'NOR' && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900">NOR Gate</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                              4 NAND Gates
                            </span>
                          </div>
                          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 font-mono text-xs text-slate-800 space-y-1">
                            <div><strong>Formula:</strong> Y = ~(A + B)</div>
                            <div className="text-slate-500 text-[11px]">Build OR gate with 3 NANDs, then invert output with Gate 4. Exactly consumes 1x 74LS00 IC.</div>
                          </div>
                        </>
                      )}

                      {universalGateType === 'XOR' && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900">Exclusive-OR (XOR) Gate</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                              4 NAND Gates (Full 74LS00)
                            </span>
                          </div>
                          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 font-mono text-xs text-slate-800 space-y-1">
                            <div><strong>Formula:</strong> Y = A ⊕ B = A·B̄ + Ā·B</div>
                            <div className="text-slate-500 text-[11px]">Gate 1: ~(A·B). Gate 2: ~(A · Out1). Gate 3: ~(B · Out1). Gate 4: ~(Out2 · Out3). Classic exam problem!</div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
