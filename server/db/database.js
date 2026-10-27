import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'silicon_lens.db');

export const db = new DatabaseSync(dbPath);

// Initialize Tables
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS pin_notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      device_id TEXT NOT NULL,
      pin_id TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      course_code TEXT DEFAULT 'CSE-311',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS pin_bookmarks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      device_id TEXT NOT NULL,
      pin_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(device_id, pin_id)
    );

    CREATE TABLE IF NOT EXISTS hardware_projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title_en TEXT NOT NULL,
      title_bn TEXT NOT NULL,
      description_en TEXT NOT NULL,
      description_bn TEXT NOT NULL,
      device_id TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      wiring_json TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS quiz_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_name TEXT NOT NULL,
      device_id TEXT NOT NULL,
      score INTEGER NOT NULL,
      total_questions INTEGER NOT NULL,
      time_taken_seconds INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed default academic project configurations if empty
  const projectCount = db.prepare('SELECT COUNT(*) as count FROM hardware_projects').get().count;
  if (projectCount === 0) {
    const insertProject = db.prepare(`
      INSERT INTO hardware_projects (slug, title_en, title_bn, description_en, description_bn, device_id, difficulty, wiring_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertProject.run(
      'robotic_arm_4dof',
      '4-DOF Robotic Arm with SG90 Servos',
      '৪-ডিএফ রোবোটিক আর্ম ইন্টারফেসিং (SG90 সার্ভো)',
      'A multi-joint articulated arm controlled via PWM signals from Arduino pins D3, D5, D6, and D9. Common semester project in Embedded Robotics.',
      'আর্ডুইনোর D3, D5, D6 এবং D9 পিডব্লিউএম পিনের মাধ্যমে নিয়ন্ত্রিত ৪-অক্ষের আর্টিকুলেটেড রোবোটিক আর্ম। ইমবেডেড রোবোটিক্স কোর্সের অন্যতম সেরা প্রজেক্ট।',
      'arduino_uno',
      'Intermediate',
      JSON.stringify([
        { component: 'Base Yaw Servo', signalPin: 'Pin_D3', powerPin: 'Pin_5V', groundPin: 'Pin_GND1', color: '#f59e0b' },
        { component: 'Shoulder Pitch Servo', signalPin: 'Pin_D5', powerPin: 'Pin_5V', groundPin: 'Pin_GND1', color: '#10b981' },
        { component: 'Elbow Pitch Servo', signalPin: 'Pin_D6', powerPin: 'Pin_5V', groundPin: 'Pin_GND2', color: '#3b82f6' },
        { component: 'Gripper Claw Servo', signalPin: 'Pin_D9', powerPin: 'Pin_5V', groundPin: 'Pin_GND2', color: '#ec4899' }
      ])
    );

    insertProject.run(
      'sonar_radar_station',
      'Ultrasonic Sonar Radar Display',
      'আল্ট্রাসনিক সোনার রাডার এবং ডিসপ্লে স্টেশন',
      'HC-SR04 sonar sensor mounted on a 180-degree sweep servo for mapping obstacles on an I2C OLED display.',
      'HC-SR04 আল্ট্রাসনিক সেন্সর এবং ১৮০-ডিগ্রি সুইপ সার্ভো সমন্বিত রাডার সিস্টেম, যা আইটুসি ওএলইডি ডিসপ্লেতে রিয়েল-টাইম বাধা প্রদর্শন করে।',
      'arduino_uno',
      'Beginner',
      JSON.stringify([
        { component: 'HC-SR04 Trigger', signalPin: 'Pin_D12', powerPin: 'Pin_5V', groundPin: 'Pin_GND1', color: '#eab308' },
        { component: 'HC-SR04 Echo', signalPin: 'Pin_D11', powerPin: 'Pin_5V', groundPin: 'Pin_GND1', color: '#06b6d4' },
        { component: 'Radar Sweep Servo', signalPin: 'Pin_D10', powerPin: 'Pin_5V', groundPin: 'Pin_GND2', color: '#8b5cf6' },
        { component: 'OLED Display (SDA)', signalPin: 'Pin_A4', powerPin: 'Pin_5V', groundPin: 'Pin_GND2', color: '#10b981' },
        { component: 'OLED Display (SCL)', signalPin: 'Pin_A5', powerPin: 'Pin_5V', groundPin: 'Pin_GND2', color: '#3b82f6' }
      ])
    );

    insertProject.run(
      'intel_8086_minmode_ram',
      '8086 Minimum Mode with 64KB SRAM Demux',
      '৮০৮৬ মিনিমাম মোড মেমরি ও বাফারিং সার্কিট',
      'Interfacing 8086 with 74LS373 Octal Latches for address demultiplexing (ALE) and 8286 bus transceivers for data direction control.',
      '৭৪এলএস৩৭৩ ল্যাচ দিয়ে অ্যাড্রেস ডিমাল্টিপ্লেক্সিং (ALE সিগন্যাল) এবং ৮২৮৬ বাস ট্রান্সিভার দিয়ে ডেটা ট্রাফিকের দিক নিয়ন্ত্রণ করে ৬৪কেবি এস-র‌্যাম কানেকশন।',
      'intel_8086',
      'Advanced',
      JSON.stringify([
        { component: 'Address Latch Enable (ALE)', signalPin: 'Pin_ALE_31', role: 'Latches AD0-AD15 to separate Address bus', color: '#ef4444' },
        { component: 'Data Enable (DEN)', signalPin: 'Pin_DEN_32', role: 'Enables 8286 bidirectional transceivers', color: '#f59e0b' },
        { component: 'Data Transmit/Receive (DT/R)', signalPin: 'Pin_DTR_27', role: 'Sets 8286 data direction', color: '#3b82f6' },
        { component: 'Memory / IO select (M/IO)', signalPin: 'Pin_MIO_28', role: 'Decodes memory space vs peripheral port', color: '#10b981' }
      ])
    );
  }

  // Seed sample lab notes if empty
  const notesCount = db.prepare('SELECT COUNT(*) as count FROM pin_notes').get().count;
  if (notesCount === 0) {
    const insertNote = db.prepare(`
      INSERT INTO pin_notes (device_id, pin_id, title, content, course_code)
      VALUES (?, ?, ?, ?, ?)
    `);

    insertNote.run(
      'arduino_uno',
      'Pin_D13',
      'Built-in LED & SCK Line',
      'Remember for lab quiz: Pin 13 has a built-in SCK (Serial Clock) line for SPI and is connected to the onboard amber SMD LED through an LM358 op-amp buffer.',
      'CSE-311: Microcontroller Lab'
    );

    insertNote.run(
      'arduino_uno',
      'Pin_D2',
      'External Interrupt INT0',
      'Pin 2 is linked to hardware Interrupt 0. Essential for reading rotary encoders and emergency stop switches with attachInterrupt(0, isr, RISING).',
      'CSE-311: Microcontroller Lab'
    );

    insertNote.run(
      'intel_8086',
      'Pin_NMI_17',
      'Non-Maskable Interrupt (Type 2)',
      'NMI is edge-triggered (LOW-to-HIGH) and cannot be disabled by the IF flag. Vector table address is 00008H (Type 2 interrupt). Usually tied to power-failure detectors.',
      'CSE-313: Microprocessor Systems'
    );
  }
}
