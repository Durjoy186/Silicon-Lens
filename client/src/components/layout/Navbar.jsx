import React, { useState, useRef, useEffect } from 'react';
import {
  Cpu,
  Layers,
  Bot,
  Globe,
  Search,
  User,
  ChevronDown,
  X,
  Home,
  Box,
  LogIn,
  LogOut,
  Printer,
  Sparkles,
  Binary
} from 'lucide-react';
import { useLensStore } from '../../store/useLensStore';
import arduinoData from '../../data/arduinoUnoData.json';
import intelData from '../../data/intel8086Data.json';
import roboticData from '../../data/roboticArmData.json';
import ic74ls00Data from '../../data/ic74ls00Data.json';

export function Navbar() {
  const {
    currentView,
    setCurrentView,
    activeDevice,
    setActiveDevice,
    language,
    toggleLanguage,
    setSelectedPin,
    toggleProfileModal,
    currentUser,
    openAuthModal,
    logoutUser,
    bookmarkedPins,
    toggleCheatSheetModal
  } = useLensStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const models = [
    { id: 'arduino_uno', name_en: 'Arduino Uno R3', name_bn: 'আর্ডুইনো ইউনো আর৩', icon: Cpu },
    { id: 'intel_8086', name_en: 'Intel 8086 (X-Ray)', name_bn: 'ইন্টেল ৮০৮৬ (X-Ray)', icon: Layers },
    { id: 'robotic_arm', name_en: '4-DOF Robotic Arm', name_bn: '৪-ডিএফ রোবোটিক আর্ম', icon: Bot },
    { id: 'ic_74ls00', name_en: '74LS00 Quad NAND', name_bn: '৭৪এলএস০০ কোয়াড ন্যান্ড', icon: Binary }
  ];

  const currentModel = models.find((m) => m.id === activeDevice) || models[0];
  const otherModels = models.filter((m) => m.id !== activeDevice);

  // Combined search results
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const matches = [];

    // Check models
    models.forEach((m) => {
      if (m.name_en.toLowerCase().includes(q) || m.name_bn.toLowerCase().includes(q)) {
        matches.push({ type: 'model', device: m.id, name: language === 'bn' ? m.name_bn : m.name_en });
      }
    });

    // Check active device pins
    let dataset = arduinoData.items;
    if (activeDevice === 'intel_8086') dataset = intelData.items;
    if (activeDevice === 'robotic_arm') dataset = roboticData.items;
    if (activeDevice === 'ic_74ls00') dataset = ic74ls00Data.items;

    dataset.forEach((item) => {
      if (
        item.name_en?.toLowerCase().includes(q) ||
        item.name_bn?.toLowerCase().includes(q) ||
        item.syllabus_tags?.some((t) => t.toLowerCase().includes(q))
      ) {
        matches.push({
          type: 'pin',
          device: activeDevice,
          meshName: item.mesh_name,
          name: language === 'bn' ? item.name_bn : item.name_en
        });
      }
    });

    return matches.slice(0, 6);
  }, [searchQuery, activeDevice, language]);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-2 sm:px-4 py-2 sm:py-2.5 glass-panel border-b border-slate-200/90 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-4">
        {/* Left: Brand Logo & Navigation Links */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2 text-left group"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900 p-1.5 shadow-md flex items-center justify-center group-hover:bg-sky-600 transition-colors shrink-0">
              <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400 group-hover:text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs sm:text-base font-extrabold tracking-tight text-slate-900">
                  SILICON LENS
                </span>
                <span className="hidden sm:inline text-[10px] font-bold px-1.5 py-0.2 rounded bg-sky-100 text-sky-700">
                  v2.0
                </span>
              </div>
              <p className="hidden md:block text-[10px] font-medium text-slate-400">
                {language === 'bn' ? '৩ডি হার্ডওয়্যার অ্যাটলাস' : '3D Hardware Atlas'}
              </p>
            </div>
          </button>

          {/* Home & 3D Atlas View Switchers (Accessible on both Mobile & Desktop) */}
          <nav className="flex items-center gap-0.5 sm:gap-1 pl-1 sm:pl-2 border-l border-slate-200">
            <button
              onClick={() => setCurrentView('home')}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                currentView === 'home'
                  ? 'bg-sky-100 text-sky-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title={language === 'bn' ? 'হোম' : 'Home'}
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'bn' ? 'হোম' : 'Home'}</span>
            </button>

            <button
              onClick={() => setCurrentView('atlas')}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                currentView === 'atlas'
                  ? 'bg-sky-100 text-sky-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title={language === 'bn' ? '৩ডি অ্যাটলাস' : '3D Atlas'}
            >
              <Box className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'bn' ? '৩ডি অ্যাটলাস' : '3D Atlas'}</span>
            </button>
          </nav>
        </div>

        {/* Center: Compact Icon-based Model Switcher Dropdown (in Atlas view) */}
        {currentView === 'atlas' && (
          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 shadow-2xs text-xs font-bold transition-all"
              title="Switch hardware model"
            >
              <currentModel.icon className="w-4 h-4 text-sky-600 shrink-0" />
              <span className="hidden md:inline">
                {language === 'bn' ? currentModel.name_bn : currentModel.name_en}
              </span>
              <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
            </button>

            {/* Clean Dropdown of Remaining Models */}
            {isDropdownOpen && (
              <div className="absolute top-full mt-1.5 left-0 w-52 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                  {language === 'bn' ? 'অন্যান্য মডেলসমূহ' : 'Switch Hardware Model'}
                </div>
                {otherModels.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setActiveDevice(m.id);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-sky-50 text-slate-800 hover:text-sky-700 transition-colors flex items-center gap-2 text-xs font-bold"
                  >
                    <m.icon className="w-3.5 h-3.5 text-slate-500" />
                    <span>{language === 'bn' ? m.name_bn : m.name_en}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Right: Search, Student Profile & Language Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Quick Search */}
          <div className="relative">
            <div className="flex items-center bg-white rounded-xl border border-slate-300 px-2 sm:px-3 py-1.5 text-xs text-slate-700 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-100 transition-all">
              <Search className="w-3.5 h-3.5 text-slate-400 mr-1 sm:mr-2 shrink-0" />
              <input
                type="text"
                placeholder={language === 'bn' ? 'খুঁজুন...' : 'Search...'}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="w-14 xs:w-20 sm:w-36 focus:w-24 xs:focus:w-32 sm:focus:w-44 outline-none bg-transparent placeholder-slate-400 font-medium transition-all text-xs"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600 ml-1">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Dropdown Results */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute top-full mt-1.5 right-0 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50">
                {searchResults.map((res, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (res.type === 'model') {
                        setActiveDevice(res.device);
                      } else {
                        setActiveDevice(res.device);
                        setSelectedPin(res.meshName);
                      }
                      setSearchQuery('');
                      setIsSearchOpen(false);
                      setCurrentView('atlas');
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-sky-50 transition-colors flex items-center justify-between"
                  >
                    <span className="text-xs font-bold text-slate-900">{res.name}</span>
                    <span className="text-[10px] font-semibold text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded">
                      {res.type === 'model' ? 'Model' : 'Pin'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Guest Mode vs Logged In Account Section */}
          {!currentUser ? (
            /* GUEST MODE: Clear Log In / Sign Up Button */
            <button
              onClick={() => openAuthModal('login')}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-sky-600 text-white text-xs font-bold transition-all shadow-sm active:scale-95 group shrink-0"
              title={language === 'bn' ? 'লগইন বা একাউন্ট তৈরি করুন' : 'Sign in or create account'}
            >
              <LogIn className="w-3.5 h-3.5 text-sky-400 group-hover:text-white transition-colors" />
              <span className="hidden sm:inline">{language === 'bn' ? 'লগইন / সাইন আপ' : 'Log In / Sign Up'}</span>
              <span className="sm:hidden">{language === 'bn' ? 'লগইন' : 'Log In'}</span>
            </button>
          ) : (
            /* ACCOUNT HOLDER: User badge, Cheat sheet button, & Profile dropdown */
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              {/* Quick 1-Click Printable Cheat Sheet Trigger */}
              <button
                onClick={() => toggleCheatSheetModal(true)}
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-all shadow-2xs"
                title={language === 'bn' ? '১-ক্লিক প্রিন্ট উপযোগী ল্যাব চিট শিট' : 'Printable Lab Cheat Sheet'}
              >
                <Printer className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden lg:inline">{language === 'bn' ? 'চিট শিট' : 'Cheat Sheet'}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-900 text-[10px] font-extrabold">
                  {bookmarkedPins.length}
                </span>
              </button>

              {/* User Dropdown */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-bold transition-all shadow-2xs"
                  title="Account Settings"
                >
                  <div className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px] font-bold">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden md:inline">{currentUser.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3 h-3 text-sky-600" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <div className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{currentUser.university}</div>
                      <div className="text-[10px] font-semibold text-sky-600 mt-0.5">ID: {currentUser.studentId}</div>
                    </div>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        toggleCheatSheetModal(true);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-amber-50 text-slate-700 hover:text-amber-800 transition-colors flex items-center gap-2 text-xs font-semibold"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-600" />
                      <span>{language === 'bn' ? 'ল্যাব চিট শিট প্রিন্ট' : 'Print Lab Cheat Sheet'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        toggleProfileModal();
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-sky-50 text-slate-700 hover:text-sky-800 transition-colors flex items-center gap-2 text-xs font-semibold"
                    >
                      <User className="w-3.5 h-3.5 text-sky-600" />
                      <span>{language === 'bn' ? 'প্রোফাইল ও ল্যাব ডায়েরি' : 'Profile & Lab Notes'}</span>
                    </button>

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logoutUser();
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors flex items-center gap-2 text-xs font-semibold"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      <span>{language === 'bn' ? 'লগআউট' : 'Log Out'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm shrink-0"
            title="Toggle English / বাংলা"
          >
            <Globe className="w-3.5 h-3.5 text-sky-400" />
            <span>{language === 'en' ? 'বাংলা' : 'EN'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
