import * as THREE from 'three';

/**
 * Ultra-Photorealistic Procedural Silkscreen & Solder Mask Texture Generator
 * for Arduino Uno R3 (ATmega328P), matched 1:1 to official Italian production boards
 * and Nick Gammon's reference photograph.
 */
export function createArduinoSilkscreenTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 4096;
  canvas.height = 3000;
  const ctx = canvas.getContext('2d');

  // 1. PCB BASE SOLDER MASK (Deep Italian Arduino Teal)
  ctx.fillStyle = '#016477';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle solder mask weave / micro-texture
  ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
  for (let y = 0; y < canvas.height; y += 4) {
    ctx.fillRect(0, y, canvas.width, 2);
  }

  // 2. GROUND PLANE COPPER POURS & ISOLATION CHANNELS
  ctx.strokeStyle = '#02788e';
  ctx.lineWidth = 4;
  for (let x = 80; x < canvas.width - 80; x += 36) {
    ctx.beginPath();
    ctx.moveTo(x, 120);
    ctx.lineTo(x + 40, canvas.height - 120);
    ctx.stroke();
  }

  // Realistic Copper Routing Traces (Angled 45° chamfers)
  ctx.strokeStyle = '#028ea7';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const copperTraces = [
    // Top headers to MCU
    [[1242, 380], [1242, 600], [1500, 850], [1500, 1600], [1800, 1600]],
    [[1391, 380], [1391, 650], [1600, 900], [1600, 1650], [1800, 1650]],
    [[1541, 380], [1541, 700], [1700, 950], [1700, 1700], [1800, 1700]],
    [[1690, 380], [1690, 750], [1750, 1000], [1750, 1750], [1800, 1750]],
    [[1839, 380], [1839, 800], [1839, 1500], [1950, 1600]],
    [[1989, 380], [1989, 850], [2050, 1100], [2050, 1600]],
    [[2198, 380], [2198, 700], [2150, 1000], [2150, 1600]],
    [[2347, 380], [2347, 750], [2250, 1100], [2250, 1600]],
    [[2497, 380], [2497, 800], [2350, 1150], [2350, 1600]],
    [[2646, 380], [2646, 850], [2450, 1200], [2450, 1600]],
    [[2795, 380], [2795, 900], [2550, 1250], [2550, 1600]],
    [[2945, 380], [2945, 950], [2650, 1300], [2650, 1600]],
    [[3094, 380], [3094, 1000], [2750, 1350], [2750, 1600]],
    [[3244, 380], [3244, 1050], [2850, 1400], [2850, 1600]],
    // USB to 16U2 D+ / D-
    [[615, 770], [800, 770], [1000, 950], [1200, 950]],
    [[615, 820], [800, 820], [1000, 1000], [1200, 1000]],
    // Crystal XTAL1/XTAL2 traces
    [[1810, 1612], [1900, 1612], [1980, 1750]],
    [[1810, 1650], [1900, 1650], [1980, 1820]],
    // Bottom Power Traces
    [[884, 2600], [884, 2400], [1100, 2200], [1100, 2000]],
    [[1033, 2600], [1033, 2350], [1200, 2150], [1200, 1950]],
    [[1182, 2600], [1182, 2300], [1300, 2100], [1300, 1900]],
    [[1332, 2600], [1332, 2250], [1400, 2050], [1400, 1850]],
    [[1481, 2600], [1481, 2200], [1500, 2000], [1500, 1800]],
    [[1630, 2600], [1630, 2150], [1600, 1950], [1600, 1800]],
    [[1780, 2600], [1780, 2100], [1700, 1900], [1700, 1800]],
    // Analog A0-A5 Traces to ADC
    [[2317, 2600], [2317, 2350], [2400, 2150], [2400, 2000]],
    [[2467, 2600], [2467, 2300], [2480, 2150], [2480, 2000]],
    [[2616, 2600], [2616, 2250], [2560, 2150], [2560, 2000]],
    [[2765, 2600], [2765, 2200], [2640, 2150], [2640, 2000]],
    [[2915, 2600], [2915, 2150], [2720, 2150], [2720, 2000]],
    [[3064, 2600], [3064, 2100], [2800, 2150], [2800, 2000]]
  ];

  copperTraces.forEach((pts) => {
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i][0], pts[i][1]);
    }
    ctx.stroke();
  });

  // Micro Vias (Scattered Ground/Power stitch vias)
  ctx.fillStyle = '#ca8a04';
  ctx.strokeStyle = '#025261';
  ctx.lineWidth = 2;
  const stitchVias = [
    [500, 500], [520, 560], [480, 620], [680, 480], [720, 540],
    [900, 1200], [940, 1260], [880, 1320], [1100, 1400], [1150, 1450],
    [1700, 600], [1750, 650], [2100, 550], [2150, 600], [2500, 600],
    [3100, 700], [3150, 760], [3400, 800], [3500, 900], [3600, 1100],
    [3400, 1700], [3450, 1760], [3500, 1850], [3300, 2100], [3350, 2180],
    [2200, 2300], [2250, 2360], [1900, 2200], [1950, 2260], [1850, 2350]
  ];
  stitchVias.forEach(([vx, vy]) => {
    ctx.beginPath();
    ctx.arc(vx, vy, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#0a0f1d';
    ctx.beginPath();
    ctx.arc(vx, vy, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ca8a04';
  });

  // 3. THROUGH-HOLE HEADER SOLDER PADS (Gold Annular Rings with Dark Drill Holes)
  ctx.fillStyle = '#fef08a';
  ctx.strokeStyle = '#ca8a04';
  ctx.lineWidth = 4;

  const drawPad = (x, y, radius = 32, hole = 16) => {
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Center Drill hole
    ctx.fillStyle = '#0a0f1d';
    ctx.beginPath();
    ctx.arc(x, y, hole, 0, Math.PI * 2);
    ctx.fill();
  };

  // Top Pin Header Pads (10-pin + 8-pin)
  const topXCoords = [645, 794, 943, 1093, 1242, 1391, 1541, 1690, 1839, 1989, 2198, 2347, 2497, 2646, 2795, 2945, 3094, 3244];
  topXCoords.forEach((tx) => drawPad(tx, 292, 34, 18));

  // Bottom Power Header Pads (7 pins)
  const pwrXCoords = [884, 1033, 1182, 1332, 1481, 1630, 1780];
  pwrXCoords.forEach((px) => drawPad(px, 2707, 34, 18));

  // Bottom Analog Header Pads (6 pins)
  const anaXCoords = [2317, 2467, 2616, 2765, 2915, 3064];
  anaXCoords.forEach((ax) => drawPad(ax, 2707, 34, 18));

  // ICSP Header 1 (ATmega328P Right Edge, 2x3 male pins)
  for (let col = 0; col < 2; col++) {
    for (let row = 0; row < 3; row++) {
      const px = 3530 + col * 144;
      const py = 1360 + row * 144;
      drawPad(px, py, 26, 12);
    }
  }

  // ICSP Header 2 (ATmega16U2 USB DFU, 3x2 male pins)
  for (let col = 0; col < 3; col++) {
    for (let row = 0; row < 2; row++) {
      const px = 1210 + col * 120;
      const py = 540 + row * 120;
      drawPad(px, py, 26, 12);
    }
  }

  // JP2 Solder Jumper Pads (below USB ICSP)
  drawPad(1330, 750, 22, 10);
  drawPad(1410, 750, 22, 10);

  // 4. PHOTOREALISTIC WHITE SILKSCREEN LAYER (Identical to Gammon Reference Photo)
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 5;

  // Outer PCB Edge Outline with Authentic Corner Fillets
  ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

  // ==================== ARDUINO LOGO & BRANDING ====================
  // Infinity / Glasses Symbol
  ctx.lineWidth = 16;
  ctx.beginPath();
  ctx.arc(2050, 1180, 85, 0, Math.PI * 2);
  ctx.arc(2250, 1180, 85, 0, Math.PI * 2);
  ctx.stroke();

  // Minus and Plus inside loops
  ctx.font = 'bold 80px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('-', 2050, 1180);
  ctx.fillText('+', 2250, 1180);

  // ARDUINO Typography
  ctx.font = 'bold 110px Outfit, sans-serif';
  ctx.fillText('ARDUINO', 2150, 1340);

  // Rounded UNO Emblem Box
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.roundRect(2520, 1100, 360, 160, 40);
  ctx.stroke();
  ctx.font = 'bold 130px Outfit, sans-serif';
  ctx.fillText('UNO', 2700, 1185);

  // WWW.ARDUINO.CC - MADE IN ITALY
  ctx.font = 'bold 44px JetBrains Mono, monospace';
  ctx.fillText('WWW.ARDUINO.CC - MADE IN ITALY', 2420, 1720);

  // Silhouetted Italian Boot Map Graphic
  ctx.beginPath();
  ctx.moveTo(1960, 1690);
  ctx.lineTo(1980, 1710);
  ctx.lineTo(1995, 1740);
  ctx.lineTo(1985, 1760);
  ctx.lineTo(1960, 1750);
  ctx.lineTo(1950, 1720);
  ctx.closePath();
  ctx.fill();

  // ==================== TOP DIGITAL PIN LABELS ====================
  ctx.font = 'bold 50px JetBrains Mono, monospace';
  ctx.textAlign = 'center';

  const topPinLabels = [
    'SCL', 'SDA', 'AREF', 'GND', '13', '12', '~11', '~10', '~9', '8',
    '7', '~6', '~5', '4', '~3', '2', 'TX→1', 'RX←0'
  ];

  topPinLabels.forEach((lbl, idx) => {
    ctx.fillText(lbl, topXCoords[idx], 200);
  });

  // Section Header: DIGITAL (PWM~)
  ctx.font = 'bold 64px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('DIGITAL (PWM ~)', 2550, 110);

  // Extended Pin Function Annotations (from Gammon Pinout)
  ctx.font = 'bold 36px JetBrains Mono, monospace';
  ctx.fillText('(I2C) SCL', 645, 80);
  ctx.fillText('(I2C) SDA', 794, 80);
  ctx.fillText('(SPI) SCK', 1242, 80);
  ctx.fillText('(SPI) MISO', 1391, 80);
  ctx.fillText('(SPI) MOSI', 1541, 80);
  ctx.fillText('(SPI) SS', 1690, 80);
  ctx.fillText('Interrupt 1', 2795, 80);
  ctx.fillText('Interrupt 0', 2945, 80);

  // ==================== BOTTOM POWER SECTION ====================
  ctx.lineWidth = 4;
  ctx.strokeRect(740, 2790, 1180, 130);
  ctx.font = 'bold 56px Outfit, sans-serif';
  ctx.fillText('POWER', 1330, 2870);

  ctx.font = 'bold 48px JetBrains Mono, monospace';
  const powerLabels = ['IOREF', 'RESET', '3.3V', '5V', 'GND', 'GND', 'Vin'];
  powerLabels.forEach((lbl, idx) => {
    ctx.fillText(lbl, pwrXCoords[idx], 2610);
  });

  // ==================== BOTTOM ANALOG IN SECTION ====================
  ctx.strokeRect(2180, 2790, 1020, 130);
  ctx.font = 'bold 56px Outfit, sans-serif';
  ctx.fillText('ANALOG IN', 2690, 2870);

  ctx.font = 'bold 48px JetBrains Mono, monospace';
  const analogLabels = ['A0', 'A1', 'A2', 'A3', 'A4', 'A5'];
  analogLabels.forEach((lbl, idx) => {
    ctx.fillText(lbl, anaXCoords[idx], 2610);
  });

  // (I2C) SDA / (I2C) SCL Annotations under A4/A5
  ctx.font = 'bold 34px JetBrains Mono, monospace';
  ctx.fillText('(I2C) SDA', 2915, 2960);
  ctx.fillText('(I2C) SCL', 3064, 2960);

  // ==================== ICSP HEADER LABELS ====================
  // ICSP for ATmega328P (Right side)
  ctx.lineWidth = 5;
  ctx.strokeRect(3470, 1270, 280, 410);
  ctx.font = 'bold 44px JetBrains Mono, monospace';
  ctx.fillText('ICSP', 3610, 1240);
  ctx.fillText('(1)', 3430, 1360);

  // Pinout annotations near ICSP
  ctx.font = 'bold 30px JetBrains Mono, monospace';
  ctx.textAlign = 'right';
  ctx.fillText('(1) MISO', 3450, 1360);
  ctx.fillText('SCK', 3450, 1500);
  ctx.fillText('/RESET', 3450, 1640);
  ctx.textAlign = 'left';
  ctx.fillText('VCC', 3770, 1360);
  ctx.fillText('MOSI', 3770, 1500);
  ctx.fillText('GND', 3770, 1640);
  ctx.textAlign = 'center';

  // ICSP for USB Interface (ATmega16U2 near USB/Reset)
  ctx.strokeRect(1150, 480, 420, 240);
  ctx.font = 'bold 38px JetBrains Mono, monospace';
  ctx.fillText('(1)', 1110, 540);
  ctx.font = 'bold 32px JetBrains Mono, monospace';
  ctx.fillText('JP2', 1370, 800);

  // RESET-EN Solder Trace Cut Bridge
  ctx.strokeRect(1650, 950, 160, 90);
  ctx.font = 'bold 28px JetBrains Mono, monospace';
  ctx.fillText('RESET', 1730, 980);
  ctx.fillText('EN', 1730, 1020);

  // ==================== COMPONENT SILKSCREEN OUTLINES ====================
  // ATmega328P DIP-28 Socket Outline & Pin 1 Notch
  ctx.lineWidth = 5;
  ctx.strokeRect(1750, 1530, 1440, 460);
  ctx.beginPath();
  ctx.arc(1750, 1760, 45, Math.PI * 1.5, Math.PI * 0.5, false);
  ctx.stroke();

  // ATmega16U2 Square Outline & Pin 1 Dot
  ctx.strokeRect(1140, 840, 260, 260);
  ctx.beginPath();
  ctx.arc(1165, 865, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = 'bold 26px JetBrains Mono, monospace';
  ctx.fillText('MEGA16U2', 1270, 975);

  // SPK16.000G Quartz Crystal Outline
  ctx.beginPath();
  ctx.roundRect(1560, 1510, 480, 200, 90);
  ctx.stroke();
  ctx.font = 'bold 36px JetBrains Mono, monospace';
  ctx.fillText('SPK16.000G', 1800, 1615);

  // Tactile Reset Pushbutton
  ctx.beginPath();
  ctx.arc(436, 320, 85, 0, Math.PI * 2);
  ctx.stroke();
  ctx.font = 'bold 36px JetBrains Mono, monospace';
  ctx.fillText('RESET', 436, 450);

  // Polyfuse 501K Outline
  ctx.strokeRect(840, 890, 220, 160);
  ctx.font = 'bold 32px JetBrains Mono, monospace';
  ctx.fillText('501K', 950, 975);

  // NCP1117-5.0 / SOT-223 Voltage Regulator Outline & Heatsink Tab
  ctx.strokeRect(1250, 1780, 240, 200);
  ctx.strokeRect(1210, 1720, 320, 70); // Heatsink copper solder tab
  ctx.font = 'bold 28px JetBrains Mono, monospace';
  ctx.fillText('NCP1117-5', 1370, 1890);

  // Dual Aluminum Electrolytic Capacitors Circular Outlines with '+' Marks
  ctx.beginPath();
  ctx.arc(1152, 2202, 140, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillText('+', 980, 2205);
  ctx.font = 'bold 30px JetBrains Mono, monospace';
  ctx.fillText('47 16V', 1152, 2205);

  ctx.beginPath();
  ctx.arc(1660, 2202, 140, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillText('+', 1830, 2205);
  ctx.fillText('47 16V', 1660, 2205);

  // Reverse Protection Diode M7 Outline
  ctx.strokeRect(910, 2510, 120, 70);
  ctx.font = 'bold 26px JetBrains Mono, monospace';
  ctx.fillText('M7', 970, 2550);

  // DC Barrel Jack White Polarity '+' Marking & Spec
  ctx.font = 'bold 60px JetBrains Mono, monospace';
  ctx.fillText('+', 730, 2280);
  ctx.font = 'bold 32px JetBrains Mono, monospace';
  ctx.fillText('7 to 12V DC', 615, 2520);

  // USB Connector Placement Guide
  ctx.font = 'bold 30px JetBrains Mono, monospace';
  ctx.fillText('USB B', 615, 620);

  // SMT LEDs (ON, L, TX, RX) Silkscreen
  ctx.font = 'bold 36px JetBrains Mono, monospace';
  ctx.fillText('ON', 3150, 1380);
  ctx.fillText('L', 1980, 830);
  ctx.fillText('TX', 1650, 700);
  ctx.fillText('RX', 1650, 810);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  texture.generateMipmaps = true;
  return texture;
}

/**
 * Top disc texture for 47µF 16V SMT Aluminum Electrolytic Capacitors.
 * Authentic brushed aluminum with black negative-stripe half-crescent and stamped text:
 *   10
 *   47
 *   16V
 */
export function createCapacitorTopTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Brushed aluminum radial gradient background
  const grad = ctx.createRadialGradient(256, 256, 20, 256, 256, 256);
  grad.addColorStop(0, '#f1f5f9');
  grad.addColorStop(0.7, '#cbd5e1');
  grad.addColorStop(1, '#94a3b8');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(256, 256, 250, 0, Math.PI * 2);
  ctx.fill();

  // Outer chamfer border
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 10;
  ctx.stroke();

  // Negative terminal black crescent / semi-circle on right side
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(256, 256, 245, -Math.PI * 0.45, Math.PI * 0.45, false);
  ctx.lineTo(256, 256);
  ctx.closePath();
  ctx.fill();

  // White negative polarity dashes inside the black crescent
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.moveTo(360, 200);
  ctx.lineTo(430, 200);
  ctx.moveTo(380, 256);
  ctx.lineTo(450, 256);
  ctx.moveTo(360, 312);
  ctx.lineTo(430, 312);
  ctx.stroke();

  // Stamped Black Markings on the left aluminum surface:
  // "10" / "47" / "16V"
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 64px JetBrains Mono, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('10', 165, 170);
  ctx.font = 'bold 72px JetBrains Mono, monospace';
  ctx.fillText('47', 165, 256);
  ctx.font = 'bold 60px JetBrains Mono, monospace';
  ctx.fillText('16V', 165, 340);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  return texture;
}

/**
 * Top face texture for ATmega328P-PU DIP-28 Microcontroller.
 * Features dark epoxy package grain, pin 1 dot, and laser-etched:
 *   ATMEL
 *   ATMEGA328P-PU
 *   1121
 */
export function createAtmega328pTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 320;
  const ctx = canvas.getContext('2d');

  // Dark matte epoxy surface
  ctx.fillStyle = '#171d26';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle epoxy texture noise
  ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
  for (let i = 0; i < 4000; i++) {
    const rx = Math.random() * canvas.width;
    const ry = Math.random() * canvas.height;
    ctx.fillRect(rx, ry, 2, 2);
  }

  // Pin 1 circular depression
  ctx.fillStyle = '#0a0d14';
  ctx.beginPath();
  ctx.arc(80, 80, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#2d3748';
  ctx.lineWidth = 4;
  ctx.stroke();

  // White/silver laser etched text
  ctx.fillStyle = '#cbd5e1';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Stylized ATMEL Logo text
  ctx.font = 'bold 58px Outfit, sans-serif';
  ctx.fillText('AIMEL', 520, 95);

  // ATMEGA328P-PU Part Number
  ctx.font = 'bold 64px JetBrains Mono, monospace';
  ctx.fillText('ATMEGA328P-PU', 520, 175);

  // Date code / lot number
  ctx.font = 'bold 44px JetBrains Mono, monospace';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('1121   THAI', 520, 245);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  return texture;
}

/**
 * Metal stamped top texture for 16.000 MHz Quartz Crystal.
 * Labeled: SPK16.000G
 */
export function createCrystalTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Brushed steel gradient
  const grad = ctx.createLinearGradient(0, 0, 512, 256);
  grad.addColorStop(0, '#f8fafc');
  grad.addColorStop(0.5, '#cbd5e1');
  grad.addColorStop(1, '#94a3b8');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Dark stamped text
  ctx.fillStyle = '#334155';
  ctx.font = 'bold 62px JetBrains Mono, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SPK16.000G', 256, 128);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  return texture;
}

/**
 * Top texture for 500mA Gold PTC Polyfuse.
 * Labeled: 501K
 */
export function createPolyfuseTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Gold polymer base
  ctx.fillStyle = '#d97706';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Top highlight
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(10, 10, canvas.width - 20, canvas.height - 20);

  // Black laser marking
  ctx.fillStyle = '#451a03';
  ctx.font = 'bold 54px JetBrains Mono, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('501K', 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  return texture;
}

/**
 * Generates an internal PCB multi-layer copper plane texture for X-Ray cutaway mode.
 */
export function createArduinoInternalCopperTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1500;
  const ctx = canvas.getContext('2d');

  // Dark FR4 fiberglass substrate core
  ctx.fillStyle = '#1c1917';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Glowing Copper Power/Ground Planes
  ctx.strokeStyle = '#d97706';
  ctx.fillStyle = '#b45309';
  ctx.lineWidth = 10;

  // Power Distribution Bus lines
  ctx.strokeRect(80, 80, canvas.width - 160, canvas.height - 160);

  ctx.lineWidth = 6;
  for (let y = 150; y < canvas.height - 150; y += 80) {
    ctx.beginPath();
    ctx.moveTo(100, y);
    ctx.lineTo(canvas.width - 100, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  return texture;
}
