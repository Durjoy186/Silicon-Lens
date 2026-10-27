import { create } from 'zustand';

export const useLensStore = create((set, get) => ({
  // Navigation View
  currentView: 'home', // 'home' | 'atlas'
  setCurrentView: (view) => set({
    currentView: view,
    hoveredPin: null,
    tooltipCoords: { x: -1000, y: -1000 }
  }),

  // Active Device
  activeDevice: 'arduino_uno', // 'arduino_uno' | 'intel_8086' | 'robotic_arm' | 'ic_74ls00'
  setActiveDevice: (device) => {
    let defaultPin = 'Pin_D13';
    if (device === 'intel_8086') defaultPin = 'Pin_ALE_31';
    if (device === 'robotic_arm') defaultPin = 'Servo_Base_Yaw';
    if (device === 'ic_74ls00') defaultPin = 'Pin_1Y_3';

    set({
      activeDevice: device,
      selectedPin: defaultPin,
      hoveredPin: null,
      tooltipCoords: { x: -1000, y: -1000 },
      activeFilterTag: null,
      currentView: 'atlas'
    });
  },

  // Mobile Instruction Tip State (Resets on every page reload!)
  isMobileTipDismissed: false,
  dismissMobileTip: () => set({ isMobileTipDismissed: true }),

  // Language
  language: 'en', // 'en' | 'bn'
  setLanguage: (lang) => set({ language: lang }),
  toggleLanguage: () => set((state) => ({ language: state.language === 'en' ? 'bn' : 'en' })),

  // Pin Selection & Hovering
  selectedPin: 'Pin_D13',
  setSelectedPin: (meshName) => set({ selectedPin: meshName }),
  hoveredPin: null,
  setHoveredPin: (meshName) => set({ hoveredPin: meshName }),
  tooltipCoords: { x: -1000, y: -1000 },
  setTooltipCoords: (coords) => set({ tooltipCoords: coords }),

  // Universal X-Ray Cutaway Value (0.0 to 1.0)
  xrayValue: 0.0,
  setXrayValue: (val) => set({ xrayValue: Math.max(0, Math.min(1, val)) }),

  // Syllabus Tag Filtering
  activeFilterTag: null,
  setActiveFilterTag: (tag) => set((state) => ({
    activeFilterTag: state.activeFilterTag === tag ? null : tag
  })),

  // Robotic Arm Interactive Servo Angles (Degrees 0 to 180)
  servoAngles: {
    base: 90,
    shoulder: 50,
    elbow: 65,
    gripper: 35
  },
  setServoAngle: (joint, angle) => {
    set((state) => ({
      servoAngles: {
        ...state.servoAngles,
        [joint]: Math.max(0, Math.min(180, angle))
      }
    }));
  },

  // 74LS00 Quad NAND Gate Live Logic Simulator State
  logicInputs: {
    g1A: 0, g1B: 1,
    g2A: 1, g2B: 1,
    g3A: 0, g3B: 0,
    g4A: 1, g4B: 0
  },
  toggleLogicInput: (key) => set((state) => ({
    logicInputs: {
      ...state.logicInputs,
      [key]: state.logicInputs[key] === 1 ? 0 : 1
    }
  })),
  setLogicInputs: (newInputs) => set((state) => ({
    logicInputs: {
      ...state.logicInputs,
      ...newInputs
    }
  })),
  resetLogicInputs: () => set({
    logicInputs: {
      g1A: 0, g1B: 0,
      g2A: 0, g2B: 0,
      g3A: 0, g3B: 0,
      g4A: 0, g4B: 0
    }
  }),

  // SR Latch Cross-Coupled NAND Simulation State (Active-Low Inputs)
  srLatch: {
    S_bar: 1,
    R_bar: 1,
    Q: 0,
    Q_bar: 1,
    status: 'LATCHED (Memory / No Change)'
  },
  setSRLatch: (s_bar, r_bar) => set((state) => {
    let Q = state.srLatch.Q;
    let Q_bar = state.srLatch.Q_bar;
    let status = 'LATCHED (Memory)';

    if (s_bar === 0 && r_bar === 1) {
      Q = 1;
      Q_bar = 0;
      status = 'SET (Q = 1)';
    } else if (s_bar === 1 && r_bar === 0) {
      Q = 0;
      Q_bar = 1;
      status = 'RESET (Q = 0)';
    } else if (s_bar === 0 && r_bar === 0) {
      Q = 1;
      Q_bar = 1;
      status = 'INVALID / FORBIDDEN (Race Hazard)';
    }

    // Sync Gate 1 & Gate 2 in logicInputs so 3D model lights up accordingly!
    const syncInputs = {
      g1A: s_bar,
      g1B: Q_bar,
      g2A: Q,
      g2B: r_bar
    };

    return {
      srLatch: { S_bar: s_bar, R_bar: r_bar, Q, Q_bar, status },
      logicInputs: { ...state.logicInputs, ...syncInputs }
    };
  }),

  // Modals & Panels
  isSpecDrawerOpen: true,
  toggleSpecDrawer: () => set((state) => ({ isSpecDrawerOpen: !state.isSpecDrawerOpen })),
  setSpecDrawerOpen: (open) => set({ isSpecDrawerOpen: open }),

  isProfileModalOpen: false,
  toggleProfileModal: () => set((state) => ({ isProfileModalOpen: !state.isProfileModalOpen })),

  // Authentication & Guest Mode
  // Default to null: no user logged in, clean guest experience
  currentUser: null,
  isAuthModalOpen: false,
  authModalTab: 'login', // 'login' | 'signup'

  openAuthModal: (tab = 'login') => set({ isAuthModalOpen: true, authModalTab: tab }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),

  loginUser: (userData) => {
    const user = {
      id: userData?.id || Date.now(),
      name: userData?.name || 'Durjoy Ghosh',
      studentId: userData?.studentId || '0692320005101027',
      university: userData?.university || 'Notre Dame University Bangladesh',
      department: userData?.department || 'Computer Science & Engineering',
      semester: userData?.semester || '4-1',
      email: userData?.email || 'durjoy.ghosh@ndub.edu.bd',
      enrolledCourses: userData?.enrolledCourses || ['CSE-411: Embedded Systems & Robotics', 'CSE-313: Microprocessors & Interfacing', 'CSE-311: Microcontrollers'],
      bookmarkedPins: userData?.bookmarkedPins || ['Pin_D13', 'Pin_ALE_31', 'Pin_NMI_17']
    };
    set({
      currentUser: user,
      studentProfile: user,
      bookmarkedPins: user.bookmarkedPins || [],
      isAuthModalOpen: false
    });
  },

  logoutUser: () => {
    set({
      currentUser: null,
      studentProfile: null,
      bookmarkedPins: [],
      isProfileModalOpen: false
    });
  },

  // Student Profile Data (backward compatibility)
  studentProfile: null,
  updateStudentProfile: (profile) => set((state) => {
    const updated = { ...(state.currentUser || {}), ...profile };
    return {
      currentUser: updated,
      studentProfile: updated
    };
  }),

  // Advantage #2: Printable Lab Cheat Sheet Bookmarks
  bookmarkedPins: [],
  toggleBookmarkPin: (meshName, deviceId) => set((state) => {
    const exists = state.bookmarkedPins.some((p) => typeof p === 'object' ? p.meshName === meshName : p === meshName);
    let updated;
    if (exists) {
      updated = state.bookmarkedPins.filter((p) => (typeof p === 'object' ? p.meshName !== meshName : p !== meshName));
    } else {
      updated = [...state.bookmarkedPins, { meshName, deviceId: deviceId || state.activeDevice, addedAt: new Date().toISOString() }];
    }
    // Also sync to currentUser if logged in
    if (state.currentUser) {
      return {
        bookmarkedPins: updated,
        currentUser: { ...state.currentUser, bookmarkedPins: updated }
      };
    }
    return { bookmarkedPins: updated };
  }),

  // Printable Lab Cheat Sheet Modal
  isCheatSheetModalOpen: false,
  toggleCheatSheetModal: (open) => set((state) => ({
    isCheatSheetModalOpen: open !== undefined ? open : !state.isCheatSheetModalOpen
  }))
}));

