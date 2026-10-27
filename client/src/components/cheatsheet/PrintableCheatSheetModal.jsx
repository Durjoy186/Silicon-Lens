import React, { useState } from 'react';
import {
  X,
  Printer,
  FileText,
  Download,
  Trash2,
  Cpu,
  Layers,
  Bot,
  ExternalLink,
  GraduationCap,
  Sparkles,
  Check,
  Binary
} from 'lucide-react';
import { useLensStore } from '../../store/useLensStore';
import arduinoData from '../../data/arduinoUnoData.json';
import intelData from '../../data/intel8086Data.json';
import roboticData from '../../data/roboticArmData.json';
import ic74ls00Data from '../../data/ic74ls00Data.json';

export function PrintableCheatSheetModal() {
  const {
    isCheatSheetModalOpen,
    toggleCheatSheetModal,
    bookmarkedPins,
    toggleBookmarkPin,
    currentUser,
    language
  } = useLensStore();

  const [activeFilter, setActiveFilter] = useState('ALL');

  if (!isCheatSheetModalOpen) return null;

  // Compile full pin details for all bookmarked pins
  const compiledPins = bookmarkedPins.map((bookmark) => {
    const meshName = typeof bookmark === 'object' ? bookmark.meshName : bookmark;
    const deviceId = typeof bookmark === 'object' ? bookmark.deviceId : 'arduino_uno';

    let item = null;
    let deviceName = 'Arduino Uno R3';
    let icon = Cpu;

    if (deviceId === 'intel_8086') {
      item = intelData.items.find((p) => p.mesh_name === meshName);
      deviceName = 'Intel 8086 Microprocessor';
      icon = Layers;
    } else if (deviceId === 'robotic_arm') {
      item = roboticData.items.find((p) => p.mesh_name === meshName);
      deviceName = '4-DOF Robotic Arm';
      icon = Bot;
    } else if (deviceId === 'ic_74ls00') {
      item = ic74ls00Data.items.find((p) => p.mesh_name === meshName);
      deviceName = '74LS00 Quad NAND Gate IC';
      icon = Binary;
    } else {
      item = arduinoData.items.find((p) => p.mesh_name === meshName);
      deviceName = 'Arduino Uno R3';
      icon = Cpu;
    }

    // Fallback if not found in current device, search all
    if (!item) {
      item = arduinoData.items.find((p) => p.mesh_name === meshName) ||
             intelData.items.find((p) => p.mesh_name === meshName) ||
             roboticData.items.find((p) => p.mesh_name === meshName) ||
             ic74ls00Data.items.find((p) => p.mesh_name === meshName);
    }

    return {
      meshName,
      deviceId,
      deviceName,
      icon,
      data: item || {
        name_en: meshName,
        name_bn: meshName,
        function_en: 'General Pin Function',
        function_bn: 'সাধারণ পিন কার্যকারিতা',
        voltage: '5V DC',
        specs: {}
      }
    };
  });

  const filteredPins = activeFilter === 'ALL'
    ? compiledPins
    : compiledPins.filter((p) => p.deviceId === activeFilter);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Top Controls Bar (Hidden during print) */}
        <div className="bg-slate-900 text-white px-3 sm:px-6 py-3 sm:py-3.5 border-b border-slate-800 print:hidden shrink-0 space-y-2.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40 shrink-0">
                <Printer className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h3 className="text-xs sm:text-sm font-bold line-clamp-1">
                    {language === 'bn' ? '১-ক্লিক ল্যাব চিট শিট' : '1-Click Printable Lab Cheat Sheet'}
                  </h3>
                  <span className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.2 rounded-full bg-amber-500/30 text-amber-300 border border-amber-400/30 shrink-0">
                    A4 Ready
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-400 line-clamp-1">
                  {currentUser?.name || 'Student Member'} • {compiledPins.length} Bookmarked Pins
                </p>
              </div>
            </div>

            <button
              onClick={() => toggleCheatSheetModal(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors shrink-0"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 pt-1 border-t border-slate-800">
            {/* Filter by Hardware Model (Horizontally scrollable on mobile) */}
            <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700/60 text-xs overflow-x-auto no-scrollbar max-w-full">
              {['ALL', 'arduino_uno', 'intel_8086', 'robotic_arm', 'ic_74ls00'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`shrink-0 px-2 sm:px-2.5 py-1 rounded-md font-bold text-[11px] transition-colors ${
                    activeFilter === cat ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat === 'ALL' ? 'All' : cat === 'arduino_uno' ? 'Arduino' : cat === 'intel_8086' ? '8086' : cat === 'robotic_arm' ? 'Robotics' : '74LS00'}
                </button>
              ))}
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all shadow-md active:scale-95 shrink-0 ml-auto"
            >
              <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{language === 'bn' ? 'প্রিন্ট / PDF' : 'Print / Save PDF'}</span>
            </button>
          </div>
        </div>

        {/* Printable Paper Area */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-8 bg-slate-100 print:bg-white print:p-0 print:m-0">
          <div className="max-w-[210mm] mx-auto bg-white rounded-xl shadow-lg print:shadow-none border border-slate-200 print:border-none p-6 sm:p-10 space-y-6 text-slate-900">
            {/* Header for Document */}
            <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
              <div>
                <div className="text-[11px] font-bold text-sky-700 uppercase tracking-widest">
                  SILICON LENS • HARDWARE REFERENCE & ATLAS
                </div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 mt-1">
                  University Microprocessor & Embedded Systems Lab Cheat Sheet
                </h1>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Pre-compiled for Semester Lab Examinations, Practical Viva Voce & Breadboard Prototyping
                </p>
              </div>

              <div className="text-right text-xs space-y-0.5 shrink-0 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <div className="font-bold text-slate-900">{currentUser?.name || 'Durjoy Ghosh'}</div>
                <div className="text-slate-500 text-[11px]">ID: {currentUser?.studentId || '0692320005101027'}</div>
                <div className="text-slate-500 text-[11px]">{currentUser?.university || 'Notre Dame University Bangladesh'}</div>
                {currentUser?.department && (
                  <div className="text-slate-400 text-[10px]">{currentUser.department} • Sem {currentUser.semester || '4-1'}</div>
                )}
                <div className="text-slate-400 text-[10px]">{new Date().toLocaleDateString()}</div>
              </div>
            </div>

            {/* Quick Summary Stats */}
            <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Bookmarks</span>
                <span className="text-base font-extrabold text-slate-900">{compiledPins.length} Pins</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Course Alignment</span>
                <span className="text-xs font-bold text-sky-700">CSE-313 / EEE-401</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Exam Readiness</span>
                <span className="text-xs font-bold text-emerald-700">Verified Pinout Specs</span>
              </div>
            </div>

            {/* Bookmarked Pins Table */}
            {filteredPins.length === 0 ? (
              <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-xl">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-700">No Pins in this Cheat Sheet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Click on any pin in the 3D Atlas and press the "Bookmark for Cheat Sheet" button to add it here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPins.map((item, idx) => {
                  const data = item.data;
                  return (
                    <div
                      key={idx}
                      className="border border-slate-200 rounded-xl p-4 bg-white hover:border-slate-300 transition-all space-y-2 relative print:break-inside-avoid"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-extrabold text-slate-900">
                                {data.name_en || item.meshName}
                              </h3>
                              {data.name_bn && (
                                <span className="text-xs text-slate-500 font-medium">
                                  ({data.name_bn})
                                </span>
                              )}
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                                {item.deviceName}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 font-mono">
                              Mesh Identifier: {item.meshName}
                            </p>
                          </div>
                        </div>

                        {/* Unbookmark action (hidden in print) */}
                        <button
                          onClick={() => toggleBookmarkPin(item.meshName, item.deviceId)}
                          className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors print:hidden"
                          title="Remove pin from cheat sheet"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Specs / Ratings Badges */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {data.voltage && (
                          <span className="text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md">
                            ⚡ {data.voltage}
                          </span>
                        )}
                        {data.specs?.max_current && (
                          <span className="text-[11px] font-bold bg-sky-50 text-sky-800 border border-sky-200 px-2 py-0.5 rounded-md">
                            Current: {data.specs.max_current}
                          </span>
                        )}
                        {data.specs?.logic_level && (
                          <span className="text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md">
                            Logic: {data.specs.logic_level}
                          </span>
                        )}
                        {data.specs?.frequency && (
                          <span className="text-[11px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200 px-2 py-0.5 rounded-md">
                            Clock: {data.specs.frequency}
                          </span>
                        )}
                      </div>

                      {/* Technical Description & Viva Voce Tip */}
                      <div className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50/80 p-2.5 rounded-lg border border-slate-100">
                        <div className="font-bold text-slate-800 text-[11px] mb-0.5">
                          Functional Specification & Lab Exam Notes:
                        </div>
                        <p>{data.function_en || data.function_bn}</p>
                      </div>

                      {/* Alternate Pinout Functions if any */}
                      {data.alternate_functions && data.alternate_functions.length > 0 && (
                        <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
                          <span className="font-bold text-slate-700">Multiplexed Functions:</span>
                          <span className="font-mono text-slate-800">
                            {data.alternate_functions.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Arduino Uno R3 Subsystems & Hardware Reference for Lab Examinations */}
            {(activeFilter === 'ALL' || activeFilter === 'arduino_uno') && (
              <div className="border-t-2 border-slate-900 pt-5 space-y-4 print:break-inside-avoid">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                      R3
                    </span>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                        Arduino Uno R3 • Microcontroller Architecture & Subsystems Reference
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Essential Subsystem Notes & Ratings for Practical Viva Voce & Lab Final
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200">
                    ATmega328P Core
                  </span>
                </div>

                {/* Subsystems 2-Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* Power Supply */}
                  <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/70 space-y-1.5">
                    <div className="font-bold text-slate-900 flex items-center justify-between border-b border-slate-200 pb-1">
                      <span>⚡ Power Supply Subsystem</span>
                      <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">6V - 20V Input</span>
                    </div>
                    <p className="text-[11px] text-slate-700 leading-relaxed">
                      Powered via exterior power supply (battery or AC/DC adapter with 2.1mm center-positive plug) or USB connection. Battery terminals connect to Vin & GND.
                    </p>
                    <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px]">
                      <div className="bg-white p-1.5 rounded border border-slate-200">
                        <strong className="text-slate-900">Vin:</strong> Input voltage to Arduino when using exterior power supply vs USB/RPS.
                      </div>
                      <div className="bg-white p-1.5 rounded border border-slate-200">
                        <strong className="text-slate-900">5Volts:</strong> RPS powering microcontroller & components via regulator.
                      </div>
                      <div className="bg-white p-1.5 rounded border border-slate-200">
                        <strong className="text-slate-900">3V3:</strong> 3.3V from onboard regulator; max current draw <strong className="text-amber-800">50 mA</strong>.
                      </div>
                      <div className="bg-white p-1.5 rounded border border-slate-200">
                        <strong className="text-slate-900">GND:</strong> Ground reference pins.
                      </div>
                    </div>
                  </div>

                  {/* Memory */}
                  <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/70 space-y-1.5">
                    <div className="font-bold text-slate-900 flex items-center justify-between border-b border-slate-200 pb-1">
                      <span>💾 Memory Layout</span>
                      <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">ATmega328P</span>
                    </div>
                    <p className="text-[11px] text-slate-700 leading-relaxed">
                      Microcontroller memory includes 32 KB Flash (0.5 KB utilized for the Optiboot bootloader), 2 KB SRAM (volatile data), and 1 KB EEPROM (non-volatile storage).
                    </p>
                    <div className="grid grid-cols-3 gap-1 pt-1 text-center text-[10px]">
                      <div className="bg-white p-1.5 rounded border border-slate-200">
                        <span className="text-slate-500 block">Flash</span>
                        <strong className="text-slate-900 text-xs">32 KB</strong>
                        <span className="text-slate-400 block text-[9px]">0.5K Boot</span>
                      </div>
                      <div className="bg-white p-1.5 rounded border border-slate-200">
                        <span className="text-slate-500 block">SRAM</span>
                        <strong className="text-slate-900 text-xs">2 KB</strong>
                        <span className="text-slate-400 block text-[9px]">Variables</span>
                      </div>
                      <div className="bg-white p-1.5 rounded border border-slate-200">
                        <span className="text-slate-500 block">EEPROM</span>
                        <strong className="text-slate-900 text-xs">1 KB</strong>
                        <span className="text-slate-400 block text-[9px]">Persistent</span>
                      </div>
                    </div>
                  </div>

                  {/* Input and Output */}
                  <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/70 space-y-1.5">
                    <div className="font-bold text-slate-900 flex items-center justify-between border-b border-slate-200 pb-1">
                      <span>🔌 Digital I/O (14 Pins)</span>
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">5V Logic</span>
                    </div>
                    <p className="text-[11px] text-slate-700 leading-relaxed">
                      14 digital pins used as input or output via <code className="font-mono bg-white px-1 py-0.2 rounded text-sky-700 font-bold">pinMode()</code>, <code className="font-mono bg-white px-1 py-0.2 rounded text-sky-700 font-bold">digitalRead()</code>, and <code className="font-mono bg-white px-1 py-0.2 rounded text-sky-700 font-bold">digitalWrite()</code>. Operating voltage 5V, nominal current 20mA give/receive, internal 20kΩ - 50kΩ pull-up.
                    </p>
                    <div className="bg-rose-50 border border-rose-200 p-1.5 rounded text-[10px] text-rose-900 font-semibold">
                      ⚠️ Caution: Maximum current on any pin is <strong>40mA</strong>; must not be exceeded to prevent microcontroller damage.
                    </div>
                  </div>

                  {/* Specialized Pin Subsystems */}
                  <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/70 space-y-1.5">
                    <div className="font-bold text-slate-900 flex items-center justify-between border-b border-slate-200 pb-1">
                      <span>🎯 Dedicated Function Pins</span>
                      <span className="text-[10px] font-mono text-sky-700 bg-sky-50 px-1.5 py-0.2 rounded border border-sky-200">Interrupt / PWM / LED</span>
                    </div>
                    <div className="space-y-1 text-[10px]">
                      <div>
                        <strong className="text-slate-900">Serial Pins:</strong> TX (Pin 1) & RX (Pin 0) for TTL serial data, linked to ATmega8U2 USB chip.
                      </div>
                      <div>
                        <strong className="text-slate-900">External Interrupts:</strong> Pins 2 (INT0) & 3 (INT1) trigger on rising/falling edge, low value, or change.
                      </div>
                      <div>
                        <strong className="text-slate-900">PWM Pins:</strong> Pins 3, 5, 6, 9, 10, 11 output 8-bit PWM with <code className="font-mono text-sky-700 font-bold">analogWrite()</code>.
                      </div>
                      <div>
                        <strong className="text-slate-900">LED Pin:</strong> Pin 13 built-in LED (HIGH = glow, LOW = off).
                      </div>
                      <div>
                        <strong className="text-slate-900">AREF Pin:</strong> Reference voltage for analog inputs using <code className="font-mono text-sky-700 font-bold">analogReference()</code>.
                      </div>
                      <div>
                        <strong className="text-slate-900">Reset (RST):</strong> Active LOW line to reset MCU; enables RST button on shields.
                      </div>
                    </div>
                  </div>

                  {/* Communication Protocols (Spans 2 columns) */}
                  <div className="md:col-span-2 border border-slate-200 rounded-lg p-3 bg-slate-50/70 space-y-1.5">
                    <div className="font-bold text-slate-900 flex items-center justify-between border-b border-slate-200 pb-1">
                      <span>📡 Communication Protocols (UART, I2C, SPI)</span>
                      <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">Hardware Buses</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-0.5 text-[10px]">
                      <div className="bg-white p-2 rounded border border-slate-200 space-y-0.5">
                        <span className="font-bold text-slate-900 block">UART TTL Serial</span>
                        <p className="text-slate-600">Digital Pin 1 (TX) and Pin 0 (RX) handle asynchronous TTL serial communication via ATmega8U2 USB bridge.</p>
                      </div>
                      <div className="bg-white p-2 rounded border border-slate-200 space-y-0.5">
                        <span className="font-bold text-slate-900 block">I2C / TWI (Wire Library)</span>
                        <p className="text-slate-600">SDA (Pin A4) and SCL (Pin A5). SCL carries the clock signal and SDA carries the bidirectional data signal.</p>
                      </div>
                      <div className="bg-white p-2 rounded border border-slate-200 space-y-0.5">
                        <span className="font-bold text-slate-900 block">SPI (SPI Library)</span>
                        <p className="text-slate-600">Pins 10 (SS), 11 (MOSI: master out slave in), 12 (MISO: serial clock synchronized by master), 13 (SCK: clock pulse). ICSP headers program MCU directly.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Notice */}
            <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
              <span>Silicon Lens 3D Hardware Atlas • Generated for University Academic Use</span>
              <span>www.siliconlens.edu.bd • Page 1 of 1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
