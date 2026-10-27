import React, { useState } from 'react';
import {
  Search,
  Cpu,
  Layers,
  Bot,
  ArrowRight,
  Sparkles,
  BookOpen,
  Eye,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Printer,
  LogIn,
  Bookmark,
  Binary
} from 'lucide-react';
import { useLensStore } from '../../store/useLensStore';
import arduinoData from '../../data/arduinoUnoData.json';
import intelData from '../../data/intel8086Data.json';
import roboticData from '../../data/roboticArmData.json';
import ic74ls00Data from '../../data/ic74ls00Data.json';

export function HomePage() {
  const {
    setActiveDevice,
    setSelectedPin,
    setCurrentView,
    language,
    currentUser,
    openAuthModal,
    bookmarkedPins,
    toggleCheatSheetModal
  } = useLensStore();

  const [searchQuery, setSearchQuery] = useState('');

  // Combined search across all 4 models and their individual pins/components
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const matches = [];

    // Check Arduino
    if ('arduino uno r3 atmega328p'.includes(q) || 'arduino'.includes(q)) {
      matches.push({ type: 'model', device: 'arduino_uno', name: 'Arduino Uno R3 (ATmega328P)', desc: '14 Digital I/O, 6 ADC, 16MHz' });
    }
    // Check 8086
    if ('intel 8086 microprocessor dip-40'.includes(q) || '8086'.includes(q) || 'intel'.includes(q)) {
      matches.push({ type: 'model', device: 'intel_8086', name: 'Intel 8086 Microprocessor', desc: '16-bit CISC, 1MB memory, BIU/EU Architecture' });
    }
    // Check Robotic Arm
    if ('robotic arm sg90 servo kinematics 4-dof'.includes(q) || 'robot'.includes(q) || 'servo'.includes(q)) {
      matches.push({ type: 'model', device: 'robotic_arm', name: '4-DOF SG90 Robotic Arm', desc: 'Articulated arm, PWM servo joints, Gripper claw' });
    }
    // Check 74LS00
    if ('74ls00 7400 nand gate logic ic dip-14 universal flip flop'.includes(q) || 'nand'.includes(q) || 'logic'.includes(q) || 'gate'.includes(q)) {
      matches.push({ type: 'model', device: 'ic_74ls00', name: 'SN74LS00N Quad 2-Input NAND Gate', desc: 'DIP-14, Universal Gate, Live Logic Simulator & SR Latch' });
    }

    // Check pins across all devices
    const allPins = [
      ...arduinoData.items.map((i) => ({ ...i, device: 'arduino_uno', deviceName: 'Arduino Uno' })),
      ...intelData.items.map((i) => ({ ...i, device: 'intel_8086', deviceName: 'Intel 8086' })),
      ...roboticData.items.map((i) => ({ ...i, device: 'robotic_arm', deviceName: 'Robotic Arm' })),
      ...ic74ls00Data.items.map((i) => ({ ...i, device: 'ic_74ls00', deviceName: '74LS00 IC' }))
    ];

    allPins.forEach((item) => {
      if (
        item.name_en?.toLowerCase().includes(q) ||
        item.name_bn?.toLowerCase().includes(q) ||
        item.syllabus_tags?.some((t) => t.toLowerCase().includes(q))
      ) {
        matches.push({
          type: 'pin',
          device: item.device,
          meshName: item.mesh_name,
          name: language === 'bn' ? item.name_bn : item.name_en,
          desc: `${item.deviceName} • ${item.subtitle_en || ''}`
        });
      }
    });

    return matches.slice(0, 8);
  }, [searchQuery, language]);

  const handleSelectResult = (res) => {
    setActiveDevice(res.device);
    if (res.meshName) {
      setSelectedPin(res.meshName);
    }
    setCurrentView('atlas');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-y-auto pt-16 sm:pt-24 pb-16 workbench-grid-bg">
      {/* 1. HERO SECTION */}
      <section className="max-w-5xl mx-auto px-4 text-center space-y-6 pt-4 sm:pt-10">
        {/* Glowing Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold border border-sky-200 shadow-2xs">
          <Sparkles className="w-4 h-4 text-sky-600 animate-pulse" />
          <span>
            {language === 'bn'
              ? 'বাংলাদেশি সিএসই ও ট্রিপল-ই শিক্ষার্থীদের জন্য ৩ডি হার্ডওয়্যার প্ল্যাটফর্ম'
              : 'Interactive 3D Hardware Atlas for Bangladeshi CSE & EEE Students'}
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
          {language === 'bn' ? (
            <>
              ত্রিমাত্রিক স্পেসে জানুন <span className="text-sky-600">মাইক্রোপ্রসেসর ও রোবোটিক্স</span> হার্ডওয়্যার
            </>
          ) : (
            <>
              Explore Microprocessor & Embedded <span className="text-sky-600">Hardware in 3D</span>
            </>
          )}
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
          {language === 'bn'
            ? 'ল্যাব কিট শারীরিকভাবে স্পর্শ না করেও যেকোনো পিন, চিপ ও ইন্টারফেসের কাজ সরাসরি ৩ডি মডেলে এক্সপ্লোর করুন। সাথে পাচ্ছেন বাংলা ও ইংরেজির সমন্বয় এবং এক্স-রে কাটওয়ে আর্কিটেকচার।'
            : 'Inspect, rotate, and master hardware you rarely get to touch physically. Explore genuine silkscreen markings, electrical ratings, X-Ray silicon micro-dies, and curriculum-aligned pinouts.'}
        </p>

        {/* Prominent Search Bar */}
        <div className="max-w-xl mx-auto relative mt-4">
          <div className="flex items-center bg-white rounded-2xl border-2 border-slate-300/80 shadow-lg px-4 py-3 focus-within:border-sky-500 focus-within:ring-4 focus-within:ring-sky-100 transition-all">
            <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
            <input
              type="text"
              placeholder={
                language === 'bn'
                  ? 'হার্ডওয়্যার মডেল বা পিন খুঁজুন (যেমন: Arduino, 8086, PWM, INT0, NMI)...'
                  : 'Search models (Arduino, 8086, Robotic Arm) or pins (PWM, INT0, ALE)...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-sm outline-none text-slate-800 placeholder-slate-400 font-medium bg-transparent"
            />
          </div>

          {/* Live Search Autocomplete Dropdown */}
          {searchQuery && searchResults.length > 0 && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 text-left">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5">
                {language === 'bn' ? 'অনুসন্ধানের ফলাফল' : 'Quick Jump Results'}
              </div>
              {searchResults.map((res, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectResult(res)}
                  className="w-full px-3 py-2 rounded-xl hover:bg-sky-50 text-left transition-colors flex items-center justify-between group"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-sky-700">
                      {res.name}
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">{res.desc}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-sky-600 shrink-0 ml-2" />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 2. THREE FEATURED HARDWARE SHOWCASE CARDS */}
      <section className="max-w-7xl mx-auto px-4 mt-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {language === 'bn' ? 'উপলব্ধ হার্ডওয়্যার মডেলসমূহ' : 'Available 3D Hardware Atlas Models'}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {language === 'bn' ? 'সরাসরি ৩ডি ভিউয়ারে ওপেন করতে ক্লিক করুন' : 'Click any board or chip to launch the interactive 3D explorer'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Arduino Uno R3 */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-xl hover:border-sky-400 transition-all duration-300 flex flex-col overflow-hidden group">
            <div className="h-44 bg-gradient-to-br from-teal-700 via-teal-800 to-cyan-900 p-5 flex flex-col justify-between text-white relative">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                  AVR 8-Bit • ATmega328P
                </span>
                <Cpu className="w-6 h-6 text-teal-300" />
              </div>

              <div>
                <div className="text-lg font-extrabold tracking-tight">Arduino Uno R3</div>
                <div className="text-xs text-teal-200 font-medium">Italian Solder Mask & Authentic Pinout</div>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {language === 'bn'
                  ? 'বিশ্ববিদ্যালয়ের মাইক্রোকন্ট্রোলার ল্যাবের সবচেয়ে জনপ্রিয় ডেভেলপমেন্ট বোর্ড। এতে রয়েছে ১৪টি ডিজিটাল পিন (৬টি পিডব্লিউএম), ৬টি অ্যানালগ এডিসি পিন এবং ১৬ মেগাহার্টজ ক্রিস্টাল।'
                  : 'The gold-standard 8-bit AVR board used in university labs. Features 14 digital I/O pins (6 PWM), 6 analog inputs, ATmega328P DIP socket, and full power regulation.'}
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Operating Voltage:</span>
                  <span className="font-bold text-slate-900 spec-mono">5V DC (7-12V Input)</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Clock Speed:</span>
                  <span className="font-bold text-slate-900 spec-mono">16.000 MHz</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveDevice('arduino_uno');
                  setCurrentView('atlas');
                }}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-sky-600 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>{language === 'bn' ? '৩ডি মডেলে দেখুন' : 'Explore Arduino in 3D'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 2: Intel 8086 Microprocessor */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-xl hover:border-amber-400 transition-all duration-300 flex flex-col overflow-hidden group">
            <div className="h-44 bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900 p-5 flex flex-col justify-between text-white relative">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/30 text-amber-300 border border-amber-500/40">
                  16-Bit CISC • X-Ray Mode
                </span>
                <Layers className="w-6 h-6 text-amber-400" />
              </div>

              <div>
                <div className="text-lg font-extrabold tracking-tight">Intel 8086 (DIP-40)</div>
                <div className="text-xs text-amber-200/80 font-medium">BIU & EU Pipelining Architecture</div>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {language === 'bn'
                  ? 'আধুনিক কম্পিউটিংয়ের ভিত্তিপ্রস্তর স্থাপনকারী ১৬-বিট মাইক্রোপ্রসেসর। ২০-বিট মাল্টিপ্লেক্সড অ্যাড্রেস/ডেটা বাস এবং অভ্যন্তরীণ BIU/EU সিলিকন ডাই এক্স-রে কাটওয়েতে দেখুন।'
                  : 'The historic 16-bit microprocessor studied in BUET/RUET computer architecture courses. Features a 1MB address bus, multiplexed AD0-AD15, and X-Ray internal die cutaway.'}
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Address Space:</span>
                  <span className="font-bold text-slate-900 spec-mono">1 MB (20-bit Bus)</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Instruction Queue:</span>
                  <span className="font-bold text-slate-900 spec-mono">6-Byte FIFO (BIU)</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveDevice('intel_8086');
                  setCurrentView('atlas');
                }}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-amber-600 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>{language === 'bn' ? '৮০৮৬ এক্স-রে আর্কিটেকচার দেখুন' : 'Inspect 8086 Architecture'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 3: 4-DOF Robotic Arm */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-xl hover:border-emerald-400 transition-all duration-300 flex flex-col overflow-hidden group">
            <div className="h-44 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 p-5 flex flex-col justify-between text-white relative">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-500/40">
                  Mechatronics • SG90 Servos
                </span>
                <Bot className="w-6 h-6 text-emerald-400" />
              </div>

              <div>
                <div className="text-lg font-extrabold tracking-tight">4-DOF Robotic Arm</div>
                <div className="text-xs text-emerald-200/80 font-medium">Kinematic Joints & Servo Internals</div>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {language === 'bn'
                  ? '৪টি মাইক্রো-সার্ভো (বেস, শোল্ডার, কনুই, গ্রিপার ক্ল) দ্বারা গঠিত অ্যাক্রিলিক রোবট আর্ম। আর্ডুইনোর পিডব্লিউএম পালসের মাধ্যমে জয়েন্ট অ্যাঙ্গেল নিয়ন্ত্রণ ও গিয়ার ট্রেন পর্যবেক্ষণ করুন।'
                  : 'The quintessential semester project in Embedded Robotics. Features 4 articulated SG90 servos, interactive joint sliders, and X-Ray cutaway of internal servo reduction gears.'}
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Actuators:</span>
                  <span className="font-bold text-slate-900 spec-mono">4x TowerPro SG90</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Control Interface:</span>
                  <span className="font-bold text-slate-900 spec-mono">50 Hz PWM (D3,D5,D6,D9)</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveDevice('robotic_arm');
                  setCurrentView('atlas');
                }}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>{language === 'bn' ? 'রোবট আর্ম কাইনেম্যাটিক্স দেখুন' : 'Explore Robotic Arm in 3D'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 4: 74LS00 Quad 2-Input NAND Gate IC */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-xl hover:border-indigo-400 transition-all duration-300 flex flex-col overflow-hidden group">
            <div className="h-44 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-5 flex flex-col justify-between text-white relative">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-500/40">
                  DLD • Universal Gate
                </span>
                <Binary className="w-6 h-6 text-indigo-400" />
              </div>

              <div>
                <div className="text-lg font-extrabold tracking-tight">74LS00 Quad NAND</div>
                <div className="text-xs text-indigo-200/80 font-medium">Internal Logic Gates & Flip-Flop</div>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {language === 'bn'
                  ? 'ডিজিটাল লজিক ডিজাইনের (DLD) ইউনিভার্সাল গেট আইসি। এতে রয়েছে ৪টি স্বাধীন ন্যান্ড গেট, রিয়েল-টাইম লজিক সুইচ সিমুলেশন, মেমরি এস-আর ল্যাচ এবং ইন্টারঅ্যাক্টিভ সিলিকন গ্লো।'
                  : 'The cornerstone IC of Digital Logic Design. Features 4 independent 2-input NAND gates, live logic gate simulator, SR Latch memory builder, and glowing silicon reaction.'}
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Logic Family:</span>
                  <span className="font-bold text-slate-900 spec-mono">TTL Low-Power Schottky</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Speed / Delay:</span>
                  <span className="font-bold text-slate-900 spec-mono">9.0 ns (5V VCC)</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveDevice('ic_74ls00');
                  setCurrentView('atlas');
                }}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>{language === 'bn' ? '৭৪এলএস০০ লজিক সিমুলেট করুন' : 'Simulate 74LS00 Gates'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2.5 ADVANTAGE #2 SHOWCASE: 1-CLICK PRINTABLE LAB CHEAT SHEET */}
      <section className="max-w-6xl mx-auto px-4 mt-16">
        <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-sky-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold">
                <Printer className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {language === 'bn' ? 'স্টুডেন্ট মেম্বার সুবিধা • ১-ক্লিক প্রিন্ট' : 'Student Account Advantage • 1-Click Print'}
                </span>
              </div>

              <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                {language === 'bn' ? (
                  <>
                    ৩ডি অ্যাটলাস থেকে সরাসরি তৈরি করুন <span className="text-amber-400">A4 ল্যাব চিট শিট</span>
                  </>
                ) : (
                  <>
                    Turn Your 3D Study into a <span className="text-amber-400">Printable A4 Lab Cheat Sheet</span>
                  </>
                )}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                {language === 'bn'
                  ? 'গেস্ট হিসেবে ৩ডি মডেল এক্সপ্লোর করা সবার জন্য উন্মুক্ত। তবে সেমিস্টার ফাইনাল ল্যাব পরীক্ষা ও ভাইভা প্রস্তুতির জন্য প্রয়োজনীয় পিন বুকমার্ক করে প্রিন্ট উপযোগী A4 চিট শিট তৈরি করতে একটি ফ্রি অ্যাকাউন্ট তৈরি করুন।'
                  : '3D exploration is free for everyone. Create a free student account to bookmark key pins across Arduino Uno, Intel 8086, and Robotics to instantly export high-resolution A4 cheat sheets for your university lab exams.'}
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-[11px] font-semibold bg-white/10 px-2.5 py-1 rounded-lg text-slate-200 border border-white/10">
                  ✓ {language === 'bn' ? 'A4 পেজ ফরম্যাটে রেডি' : 'A4 Ready PDF Layout'}
                </span>
                <span className="text-[11px] font-semibold bg-white/10 px-2.5 py-1 rounded-lg text-slate-200 border border-white/10">
                  ✓ {language === 'bn' ? 'ভোল্টেজ ও বাস সাইকেল সতর্কতা' : 'Voltage Limits & Bus Cycle Warnings'}
                </span>
                <span className="text-[11px] font-semibold bg-white/10 px-2.5 py-1 rounded-lg text-slate-200 border border-white/10">
                  ✓ {language === 'bn' ? 'ভাইভা রিভিশন ম্যানুয়াল' : 'Practical Viva Voce Exam Tips'}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full sm:w-auto">
              {!currentUser ? (
                <>
                  <button
                    onClick={() => openAuthModal('signup')}
                    className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{language === 'bn' ? 'ফ্রি অ্যাকাউন্ট তৈরি করুন' : 'Create Free Account & Unlock'}</span>
                  </button>

                  <button
                    onClick={() => toggleCheatSheetModal(true)}
                    className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Printer className="w-4 h-4 text-amber-400" />
                    <span>{language === 'bn' ? 'নমুনা চিট শিট দেখুন' : 'Preview Sample Cheat Sheet'}</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => toggleCheatSheetModal(true)}
                  className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Printer className="w-4 h-4" />
                  <span>
                    {language === 'bn'
                      ? `আমার ল্যাব চিট শিট প্রিন্ট করুন (${bookmarkedPins.length})`
                      : `Open My A4 Lab Cheat Sheet (${bookmarkedPins.length} Pins)`}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. ACADEMIC CURRICULUM HIGHLIGHTS */}
      <section className="max-w-5xl mx-auto px-4 mt-16">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-lg font-bold text-slate-900">
              {language === 'bn' ? 'কেন সিলিকন লেন্স?' : 'Why Silicon Lens for University Laboratories?'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              {language === 'bn'
                ? 'বাংলাদেশের বিভিন্ন পাবলিক ও প্রাইভেট বিশ্ববিদ্যালয়ের ল্যাব সরঞ্জাম সীমাবদ্ধতার কারণে অনেক শিক্ষার্থী বাস্তব হার্ডওয়্যার সূক্ষ্মভাবে দেখার সুযোগ পায় না। সিলিকন লেন্স সেই দূরত্বের সমাধান করে।'
                : 'Overcomes laboratory kit shortages by granting every student instant, tactile 3D spatial literacy, authentic silkscreen markings, official datasheets, and personal SQLite lab notebooks.'}
            </p>
          </div>

          <button
            onClick={() => {
              setActiveDevice('arduino_uno');
              setCurrentView('atlas');
            }}
            className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md transition-all shrink-0 flex items-center gap-2"
          >
            <span>{language === 'bn' ? 'সম্পূর্ণ ৩ডি ল্যাবে প্রবেশ করুন' : 'Enter Full 3D Workspace'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
