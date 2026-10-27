import React, { useState } from 'react';
import {
  X,
  User,
  LogIn,
  UserPlus,
  Lock,
  Mail,
  GraduationCap,
  Building2,
  FileText,
  Sparkles,
  CheckCircle2,
  Printer,
  ArrowRight
} from 'lucide-react';
import { useLensStore } from '../../store/useLensStore';

export function AuthModal() {
  const {
    isAuthModalOpen,
    authModalTab,
    openAuthModal,
    closeAuthModal,
    loginUser,
    language
  } = useLensStore();

  // Sign In state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign Up state
  const [signupName, setSignupName] = useState('');
  const [signupId, setSignupId] = useState('');
  const [signupUniversity, setSignupUniversity] = useState('BUET / RUET / Public Eng');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const displayName = loginIdentifier.includes('@')
      ? loginIdentifier.split('@')[0]
      : loginIdentifier || 'Engineering Student';
    loginUser({
      name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
      studentId: loginIdentifier.length <= 8 ? loginIdentifier : '2024-CSE-042',
      email: loginIdentifier.includes('@') ? loginIdentifier : `${loginIdentifier}@campus.edu`,
      university: 'Engineering Faculty',
      enrolledCourses: ['CSE-311: Microcontrollers', 'CSE-313: Microprocessors', 'EEE-401: Embedded Systems']
    });
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (!signupName.trim()) return;
    loginUser({
      name: signupName.trim(),
      studentId: signupId.trim() || '2024-STU',
      university: signupUniversity.trim() || 'Engineering Faculty',
      email: signupEmail.trim() || `${signupName.toLowerCase().replace(/\s+/g, '')}@student.edu`,
      enrolledCourses: ['CSE-311: Microcontrollers', 'CSE-313: Microprocessors', 'EEE-401: Embedded Systems']
    });
  };

  const handleQuickDemoLogin = () => {
    loginUser({
      name: 'Durjoy Ghosh',
      studentId: '0692320005101027',
      university: 'Notre Dame University Bangladesh',
      department: 'Computer Science & Engineering',
      semester: '4-1',
      email: 'durjoy.ghosh@ndub.edu.bd',
      enrolledCourses: [
        'CSE-411: Embedded Systems & Robotics',
        'CSE-313: Microprocessors & Interfacing',
        'CSE-311: Microcontrollers'
      ],
      bookmarkedPins: [
        { meshName: 'Pin_D13', deviceId: 'arduino_uno', addedAt: new Date().toISOString() },
        { meshName: 'Pin_ALE_31', deviceId: 'intel_8086', addedAt: new Date().toISOString() },
        { meshName: 'Pin_NMI_17', deviceId: 'intel_8086', addedAt: new Date().toISOString() },
        { meshName: 'Servo_Base_Yaw', deviceId: 'robotic_arm', addedAt: new Date().toISOString() }
      ]
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto">
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30 shrink-0">
              <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xs sm:text-sm font-extrabold tracking-tight text-white">
                  SILICON LENS
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-sky-500/30 text-sky-300 border border-sky-400/30">
                  Student Portal
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 line-clamp-1">
                {language === 'bn' ? 'ল্যাব পরীক্ষার প্রস্তুতি ও চিট শিট প্ল্যাটফর্ম' : 'Engineering Lab Exam Prep & Atlas'}
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Advantage #2 Highlight Banner: Printable Lab Cheat Sheet & Viva Prep */}
        <div className="bg-gradient-to-r from-amber-50 via-sky-50 to-blue-50 border-b border-sky-200/80 p-3 sm:p-3.5 px-4 sm:px-6 shrink-0">
          <div className="flex items-start gap-2 sm:gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 shrink-0 mt-0.5">
              <Printer className="w-4 h-4 text-amber-600" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900">
                  {language === 'bn' ? 'অ্যাকাউন্টধারীদের বিশেষ সুবিধা:' : 'Student Member Advantage:'}
                </span>
                <span className="text-[10px] font-bold text-sky-700 bg-white/90 border border-sky-200 px-1.5 py-0.2 rounded-full shadow-2xs">
                  {language === 'bn' ? '১-ক্লিক প্রিন্ট' : '1-Click Print'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug font-medium line-clamp-2">
                {language === 'bn'
                  ? 'গুরুত্বপূর্ণ পিনগুলো বুকমার্ক করুন এবং পরীক্ষার জন্য সম্পূর্ণ A4 প্রিন্ট উপযোগী ল্যাব চিট শিট ও ভাইভা রিভিশন শিট তৈরি করুন।'
                  : 'Bookmark pins to generate high-resolution, printable A4 Lab Cheat Sheets & Viva Voce revision manuals ready for your exams.'}
              </p>
            </div>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 p-1.5 gap-1.5 shrink-0">
          <button
            onClick={() => openAuthModal('login')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              authModalTab === 'login'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/90'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LogIn className="w-3.5 h-3.5 text-sky-600" />
            <span>{language === 'bn' ? 'লগইন করুন' : 'Sign In'}</span>
          </button>
          <button
            onClick={() => openAuthModal('signup')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              authModalTab === 'signup'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/90'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5 text-sky-600" />
            <span>{language === 'bn' ? 'অ্যাকাউন্ট তৈরি করুন' : 'Create Free Account'}</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {authModalTab === 'login' ? (
            /* --- SIGN IN FORM --- */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {language === 'bn' ? 'স্টুডেন্ট আইডি অথবা ইমেইল' : 'Student ID or Email'}
                </label>
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder={language === 'bn' ? 'যেমন: 2004055 বা sakib@cse.buet.ac.bd' : 'e.g. 2004055 or student@university.edu'}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all font-medium text-slate-800 placeholder-slate-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all font-medium text-slate-800 placeholder-slate-400"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" defaultChecked className="rounded text-sky-600 focus:ring-sky-500 w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'আমাকে মনে রাখুন' : 'Remember this session'}</span>
                </label>
                <span className="text-sky-600 font-semibold cursor-pointer hover:underline">
                  {language === 'bn' ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot password?'}
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>{language === 'bn' ? 'লগইন করুন ও চিট শিট খুলুন' : 'Sign In & Unlock Lab Cheat Sheet'}</span>
              </button>

              {/* Quick Demo Button for Instant Testing */}
              <div className="pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-sky-500/10 to-blue-500/10 hover:from-amber-500/20 hover:to-sky-500/20 text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-2 border border-sky-300/80 shadow-2xs group"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 group-hover:rotate-12 transition-transform" />
                  <span>
                    {language === 'bn'
                      ? '১-ক্লিক ডেমো অ্যাকাউন্ট (Durjoy Ghosh • NDUB CSE)'
                      : '1-Click Demo Account (Durjoy Ghosh • NDUB CSE)'}
                  </span>
                </button>
              </div>
            </form>
          ) : (
            /* --- SIGN UP FORM --- */
            <form onSubmit={handleSignupSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    {language === 'bn' ? 'পূর্ণ নাম' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="e.g. Rafiqul Islam"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-sky-500 outline-none text-slate-800 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    {language === 'bn' ? 'স্টুডেন্ট আইডি / রোল' : 'Student ID / Roll'}
                  </label>
                  <input
                    type="text"
                    value={signupId}
                    onChange={(e) => setSignupId(e.target.value)}
                    placeholder="e.g. 2004055"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-sky-500 outline-none text-slate-800 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {language === 'bn' ? 'বিশ্ববিদ্যালয় / প্রতিষ্ঠান' : 'University / Department'}
                </label>
                <input
                  type="text"
                  value={signupUniversity}
                  onChange={(e) => setSignupUniversity(e.target.value)}
                  placeholder="e.g. BUET / RUET / KUET / DU / BRACU / UIU"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-sky-500 outline-none text-slate-800 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {language === 'bn' ? 'ইমেইল অ্যাড্রেস' : 'Email Address'}
                </label>
                <input
                  type="email"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="e.g. student@university.edu"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-sky-500 outline-none text-slate-800 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
                </label>
                <input
                  type="password"
                  required
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-sky-500 outline-none text-slate-800 font-medium"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-100 flex items-center gap-2 text-xs text-sky-800 font-medium">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                <span>
                  {language === 'bn'
                    ? 'অ্যাকাউন্ট তৈরি করলেই সাথে সাথে ১-ক্লিক প্রিন্ট উপযোগী চিট শিট সুবিধা আনলক হবে।'
                    : 'Instant access to bookmark pins and export printable A4 Lab Cheat Sheets.'}
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>{language === 'bn' ? 'অ্যাকাউন্ট তৈরি সম্পন্ন করুন' : 'Create Free Account & Start'}</span>
              </button>

              <div className="pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-sky-500/10 to-blue-500/10 hover:from-amber-500/20 hover:to-sky-500/20 text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-2 border border-sky-300/80 shadow-2xs group"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 group-hover:rotate-12 transition-transform" />
                  <span>
                    {language === 'bn'
                      ? '১-ক্লিক ডেমো অ্যাকাউন্ট (Durjoy Ghosh • NDUB CSE)'
                      : '1-Click Demo Account (Durjoy Ghosh • NDUB CSE)'}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
