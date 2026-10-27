import React from 'react';
import { Navbar } from './components/layout/Navbar';
import { HomePage } from './components/home/HomePage';
import { SceneContainer } from './components/3d/SceneContainer';
import { SpecDrawer } from './components/layout/SpecDrawer';
import { BottomControls } from './components/layout/BottomControls';
import { ProfileModal } from './components/layout/ProfileModal';
import { AuthModal } from './components/auth/AuthModal';
import { PrintableCheatSheetModal } from './components/cheatsheet/PrintableCheatSheetModal';
import { HoverTooltip } from './components/layout/HoverTooltip';
import { MobileInstructionModal } from './components/layout/MobileInstructionModal';
import { useLensStore } from './store/useLensStore';

export default function App() {
  const { currentView } = useLensStore();

  return (
    <main className="w-screen h-screen overflow-hidden flex flex-col relative bg-slate-50 select-none">
      {/* 1. CLEAN TOP NAVIGATION BAR */}
      <Navbar />

      {/* 2. DYNAMIC VIEW: HOMEPAGE vs 3D ATLAS */}
      {currentView === 'home' ? (
        <HomePage />
      ) : (
        <div className="flex-1 w-full h-full pt-[58px] relative">
          {/* 3D WebGL Canvas */}
          <SceneContainer />

          {/* High-Contrast Viewport Hover Tooltip (Zero Flicker) */}
          <HoverTooltip />

          {/* Mobile Gestures Instruction Modal (Shows once until reload) */}
          <MobileInstructionModal />

          {/* Right Spec Drawer (Clean specs, no navbar cutoff) */}
          <SpecDrawer />

          {/* Bottom Controls with Universal X-Ray Slider */}
          <BottomControls />
        </div>
      )}

      {/* 3. STUDENT PROFILE & SQLITE LAB NOTES MODAL */}
      <ProfileModal />

      {/* 4. STUDENT LOGIN & SIGN UP MODAL */}
      <AuthModal />

      {/* 5. 1-CLICK PRINTABLE LAB CHEAT SHEET MODAL (Advantage #2) */}
      <PrintableCheatSheetModal />
    </main>
  );
}
