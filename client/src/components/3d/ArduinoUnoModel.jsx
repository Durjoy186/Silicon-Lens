import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useLensStore } from '../../store/useLensStore';
import { use3DInteraction } from '../../utils/use3DInteraction';
import {
  createArduinoSilkscreenTexture,
  createArduinoInternalCopperTexture,
  createCapacitorTopTexture,
  createAtmega328pTexture,
  createCrystalTexture,
  createPolyfuseTexture
} from '../../utils/textureGenerator';

/**
 * Ultra-Photorealistic 3D Model of Arduino Uno R3 (ATmega328P).
 * Matched 1:1 with physical Italian production boards and Nick Gammon's forum reference.
 * 
 * Interactive Components with Hover Tooltips & Spec Drawer Data:
 * - Dual 47µF 16V SMT Aluminum Electrolytic Capacitors (Input rail & 5V rail)
 * - Stamped Chrome USB Type-B Female Receptacle (with internal gold contacts)
 * - 2.1mm DC Power Barrel Jack (Center Positive, 7-12V Input)
 * - Main ICSP Header for ATmega328P (2x3 gold male pins, SPI programming)
 * - USB ICSP Header for ATmega16U2 (2x3 gold male pins, DFU USB interface)
 * - 500mA PTC Resettable Gold Polyfuse (501K)
 * - 16.000 MHz Quartz Crystal Resonator (SPK16.000G HC-49)
 * - SOT-223 5V Voltage Regulator (NCP1117ST50) with large heatsink tab
 * - M7 Reverse Polarity Protection Diode (SMA)
 * - LM358 Dual Op-Amp (SOIC-8 auto-power comparator & D13 LED buffer)
 * - ATmega16U2 USB-to-Serial MCU (QFN-32) with ceramic resonator
 * - Tactile Reset Pushbutton (Active-Low SPST momentary switch)
 * - ATmega328P-PU in DIP-28 Socket (with dynamic X-Ray Silicon Die cutaway)
 * - 32 Discrete Female Header Pins (Digital PWM, Analog ADC, Power, I2C, SPI)
 */
export function ArduinoUnoModel() {
  const {
    selectedPin,
    hoveredPin,
    activeFilterTag,
    xrayValue
  } = useLensStore();

  const {
    handlePointerOver,
    handlePointerOut,
    handleClick
  } = use3DInteraction();

  // Procedural Textures
  const silkscreenTexture = useMemo(() => createArduinoSilkscreenTexture(), []);
  const internalCopperTexture = useMemo(() => createArduinoInternalCopperTexture(), []);
  const capacitorTopTexture = useMemo(() => createCapacitorTopTexture(), []);
  const atmegaTexture = useMemo(() => createAtmega328pTexture(), []);
  const crystalTexture = useMemo(() => createCrystalTexture(), []);
  const polyfuseTexture = useMemo(() => createPolyfuseTexture(), []);

  // Top Digital Headers (D0 - D13, GND, AREF, SDA, SCL)
  const digitalPins = useMemo(() => [
    { name: 'Pin_SCL', x: -2.35, z: -2.15, label: 'SCL', tag: 'I2C (Two-Wire)' },
    { name: 'Pin_SDA', x: -2.10, z: -2.15, label: 'SDA', tag: 'I2C (Two-Wire)' },
    { name: 'Pin_AREF', x: -1.85, z: -2.15, label: 'AREF', tag: 'Analog ADC' },
    { name: 'Pin_GND_D', x: -1.60, z: -2.15, label: 'GND', tag: 'Grounding' },
    { name: 'Pin_D13', x: -1.35, z: -2.15, label: '13', tag: 'Digital I/O' },
    { name: 'Pin_D12', x: -1.10, z: -2.15, label: '12', tag: 'Digital I/O' },
    { name: 'Pin_D11', x: -0.85, z: -2.15, label: '~11', tag: 'PWM' },
    { name: 'Pin_D10', x: -0.60, z: -2.15, label: '~10', tag: 'PWM' },
    { name: 'Pin_D9', x: -0.35, z: -2.15, label: '~9', tag: 'PWM' },
    { name: 'Pin_D8', x: -0.10, z: -2.15, label: '8', tag: 'Digital I/O' },
    // 8-pin second header
    { name: 'Pin_D7', x: 0.25, z: -2.15, label: '7', tag: 'Digital I/O' },
    { name: 'Pin_D6', x: 0.50, z: -2.15, label: '~6', tag: 'PWM' },
    { name: 'Pin_D5', x: 0.75, z: -2.15, label: '~5', tag: 'PWM' },
    { name: 'Pin_D4', x: 1.00, z: -2.15, label: '4', tag: 'Digital I/O' },
    { name: 'Pin_D3', x: 1.25, z: -2.15, label: '~3', tag: 'PWM' },
    { name: 'Pin_D2', x: 1.50, z: -2.15, label: '2', tag: 'External Interrupts' },
    { name: 'Pin_D1', x: 1.75, z: -2.15, label: 'TX>1', tag: 'UART / Serial' },
    { name: 'Pin_D0', x: 2.00, z: -2.15, label: 'RX<0', tag: 'UART / Serial' }
  ], []);

  // Bottom Power Headers
  const powerPins = useMemo(() => [
    { name: 'Pin_IOREF', x: -1.95, z: 2.15, label: 'IOREF', tag: 'Power Regulation' },
    { name: 'Pin_RESET_P', x: -1.70, z: 2.15, label: 'RESET', tag: 'Reset Logic' },
    { name: 'Pin_3V3', x: -1.45, z: 2.15, label: '3.3V', tag: 'Power Regulation' },
    { name: 'Pin_5V', x: -1.20, z: 2.15, label: '5V', tag: 'Power Regulation' },
    { name: 'Pin_GND1', x: -0.95, z: 2.15, label: 'GND', tag: 'Grounding' },
    { name: 'Pin_GND2', x: -0.70, z: 2.15, label: 'GND', tag: 'Grounding' },
    { name: 'Pin_VIN', x: -0.45, z: 2.15, label: 'VIN', tag: 'Power Regulation' }
  ], []);

  // Bottom Analog Headers
  const analogPins = useMemo(() => [
    { name: 'Pin_A0', x: 0.45, z: 2.15, label: 'A0', tag: 'Analog ADC' },
    { name: 'Pin_A1', x: 0.70, z: 2.15, label: 'A1', tag: 'Analog ADC' },
    { name: 'Pin_A2', x: 0.95, z: 2.15, label: 'A2', tag: 'Analog ADC' },
    { name: 'Pin_A3', x: 1.20, z: 2.15, label: 'A3', tag: 'Analog ADC' },
    { name: 'Pin_A4', x: 1.45, z: 2.15, label: 'A4', tag: 'I2C (Two-Wire)' },
    { name: 'Pin_A5', x: 1.70, z: 2.15, label: 'A5', tag: 'I2C (Two-Wire)' }
  ], []);

  const pcbOpacity = 1.0 - xrayValue * 0.7;
  const chipLidLift = xrayValue * 0.45;
  const chipLidOpacity = 1.0 - xrayValue * 0.8;

  return (
    <group position={[0, 0, 0]}>
      {/* ========================================================================= */}
      {/* 1. PCB SUBSTRATE WITH VECTOR SILKSCREEN & X-RAY TRANSPARENCY               */}
      {/* ========================================================================= */}
      <mesh position={[0, 0, 0]} receiveShadow castShadow>
        <boxGeometry args={[6.86, 0.16, 5.34]} />
        <meshStandardMaterial
          map={silkscreenTexture}
          roughness={0.36}
          metalness={0.15}
          transparent={xrayValue > 0.05}
          opacity={pcbOpacity}
        />
      </mesh>

      {/* Internal Multi-Layer Copper Traces (Revealed during X-Ray) */}
      {xrayValue > 0.05 && (
        <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[6.8, 5.28]} />
          <meshBasicMaterial
            map={internalCopperTexture}
            transparent
            opacity={xrayValue * 0.9}
          />
        </mesh>
      )}

      {/* 4 Silver Corner Mounting Hole Annular Solder Rings with Pass-Through Holes */}
      {[
        [-3.0, 1.7],
        [-3.0, -1.7],
        [2.7, 1.9],
        [2.7, -1.9]
      ].map(([mx, mz], idx) => (
        <group key={idx} position={[mx, 0.082, mz]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.16, 0.28, 32]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.92} roughness={0.18} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.16, 32]} />
            <meshBasicMaterial color="#0a0f1d" />
          </mesh>
        </group>
      ))}

      {/* ========================================================================= */}
      {/* 2. STAMPED CHROME METALLIC USB TYPE-B RECEPTACLE                           */}
      {/* ========================================================================= */}
      <group
        position={[-2.85, 0.65, -1.3]}
        onClick={(e) => handleClick(e, 'Comp_USB_TypeB')}
        onPointerOver={(e) => handlePointerOver(e, 'Comp_USB_TypeB')}
        onPointerOut={handlePointerOut}
      >
        {/* Chrome Outer Housing */}
        <mesh castShadow>
          <boxGeometry args={[1.5, 1.15, 1.25]} />
          <meshStandardMaterial
            color={
              selectedPin === 'Comp_USB_TypeB'
                ? '#38bdf8'
                : hoveredPin === 'Comp_USB_TypeB'
                ? '#7dd3fc'
                : '#f8fafc'
            }
            metalness={0.98}
            roughness={0.12}
            emissive={
              selectedPin === 'Comp_USB_TypeB'
                ? '#0284c7'
                : hoveredPin === 'Comp_USB_TypeB'
                ? '#38bdf8'
                : '#000000'
            }
            emissiveIntensity={selectedPin === 'Comp_USB_TypeB' ? 0.45 : hoveredPin === 'Comp_USB_TypeB' ? 0.25 : 0}
          />
        </mesh>

        {/* Front Rectangular Cable Entry Cavity */}
        <mesh position={[-0.76, 0, 0]}>
          <boxGeometry args={[0.04, 0.82, 0.92]} />
          <meshBasicMaterial color="#0a0f1d" />
        </mesh>

        {/* Inner White Plastic Insulator Tongue */}
        <mesh position={[-0.48, -0.14, 0]}>
          <boxGeometry args={[0.5, 0.14, 0.62]} />
          <meshStandardMaterial color="#ffffff" roughness={0.25} />
        </mesh>

        {/* 4 Gold Internal Leaf Contacts */}
        {[-0.18, -0.06, 0.06, 0.18].map((pz, pi) => (
          <mesh key={pi} position={[-0.48, -0.06, pz]}>
            <boxGeometry args={[0.38, 0.03, 0.05]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.95} roughness={0.1} />
          </mesh>
        ))}

        {/* Top Stamped Fold Seam & Indentations */}
        <mesh position={[0, 0.585, 0]}>
          <boxGeometry args={[0.45, 0.03, 0.55]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.2} />
        </mesh>

        {/* Lateral Ground Solder Tabs */}
        {[-0.64, 0.64].map((sz, si) => (
          <mesh key={si} position={[0, -0.4, sz]}>
            <boxGeometry args={[0.2, 0.3, 0.06]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
          </mesh>
        ))}
      </group>

      {/* ========================================================================= */}
      {/* 3. 2.1mm DC POWER BARREL JACK (7V - 12V External Input)                   */}
      {/* ========================================================================= */}
      <group
        position={[-2.85, 0.65, 1.4]}
        onClick={(e) => handleClick(e, 'Comp_DC_BarrelJack')}
        onPointerOver={(e) => handlePointerOver(e, 'Comp_DC_BarrelJack')}
        onPointerOut={handlePointerOut}
      >
        {/* Stepped Black Plastic Outer Casing */}
        <mesh castShadow>
          <boxGeometry args={[1.45, 1.15, 1.05]} />
          <meshStandardMaterial
            color={
              selectedPin === 'Comp_DC_BarrelJack'
                ? '#0284c7'
                : hoveredPin === 'Comp_DC_BarrelJack'
                ? '#38bdf8'
                : '#1e293b'
            }
            roughness={0.55}
            emissive={
              selectedPin === 'Comp_DC_BarrelJack'
                ? '#0284c7'
                : hoveredPin === 'Comp_DC_BarrelJack'
                ? '#38bdf8'
                : '#000000'
            }
            emissiveIntensity={selectedPin === 'Comp_DC_BarrelJack' ? 0.35 : hoveredPin === 'Comp_DC_BarrelJack' ? 0.2 : 0}
          />
        </mesh>

        {/* Front Circular Barrel Opening */}
        <mesh position={[-0.73, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.4, 0.4, 0.05, 32]} />
          <meshStandardMaterial color="#090d16" roughness={0.9} />
        </mesh>

        {/* 2.1mm Center Nickel Positive Pin */}
        <mesh position={[-0.74, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 0.52, 24]} />
          <meshStandardMaterial color="#f1f5f9" metalness={0.95} roughness={0.12} />
        </mesh>

        {/* Ground Spring Contact Tab */}
        <mesh position={[0, 0, 0.54]}>
          <boxGeometry args={[0.65, 0.45, 0.04]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* 4. DUAL 47µF 16V SMT ALUMINUM ELECTROLYTIC CAPACITORS                     */}
      {/* ========================================================================= */}
      {/* Capacitor 1: Input Rail (Across Barrel Jack / VIN) */}
      <group
        position={[-1.5, 0.44, 1.25]}
        onClick={(e) => handleClick(e, 'Comp_Capacitor_Power1')}
        onPointerOver={(e) => handlePointerOver(e, 'Comp_Capacitor_Power1')}
        onPointerOut={handlePointerOut}
      >
        {/* Black Molded SMT Plastic Pedestal with Beveled Corners */}
        <mesh position={[0, -0.32, 0]}>
          <boxGeometry args={[0.65, 0.08, 0.65]} />
          <meshStandardMaterial color="#0f172a" roughness={0.7} />
        </mesh>

        {/* Solder Tabs (Connecting base to PCB) */}
        {[-0.32, 0.32].map((tx, ti) => (
          <mesh key={ti} position={[tx, -0.34, 0]}>
            <boxGeometry args={[0.12, 0.03, 0.3]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.95} />
          </mesh>
        ))}

        {/* Cylindrical Aluminum Can */}
        <mesh castShadow>
          <cylinderGeometry args={[0.28, 0.28, 0.58, 32]} />
          <meshStandardMaterial
            color={
              selectedPin === 'Comp_Capacitor_Power1'
                ? '#38bdf8'
                : hoveredPin === 'Comp_Capacitor_Power1'
                ? '#7dd3fc'
                : '#f1f5f9'
            }
            metalness={0.95}
            roughness={0.15}
            emissive={
              selectedPin === 'Comp_Capacitor_Power1'
                ? '#0284c7'
                : hoveredPin === 'Comp_Capacitor_Power1'
                ? '#38bdf8'
                : '#000000'
            }
            emissiveIntensity={0.35}
          />
        </mesh>

        {/* Top Disc with 10 / 47 / 16V Silkscreen & Negative Polarity Crescent */}
        <mesh position={[0, 0.291, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
          <circleGeometry args={[0.278, 32]} />
          <meshStandardMaterial map={capacitorTopTexture} roughness={0.25} metalness={0.5} />
        </mesh>
      </group>

      {/* Capacitor 2: 5V Regulated Rail (Output of Linear Regulator) */}
      <group
        position={[-0.65, 0.44, 1.25]}
        onClick={(e) => handleClick(e, 'Comp_Capacitor_Power2')}
        onPointerOver={(e) => handlePointerOver(e, 'Comp_Capacitor_Power2')}
        onPointerOut={handlePointerOut}
      >
        {/* Black Molded SMT Plastic Pedestal */}
        <mesh position={[0, -0.32, 0]}>
          <boxGeometry args={[0.65, 0.08, 0.65]} />
          <meshStandardMaterial color="#0f172a" roughness={0.7} />
        </mesh>

        {/* Solder Tabs */}
        {[-0.32, 0.32].map((tx, ti) => (
          <mesh key={ti} position={[tx, -0.34, 0]}>
            <boxGeometry args={[0.12, 0.03, 0.3]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.95} />
          </mesh>
        ))}

        {/* Cylindrical Aluminum Can */}
        <mesh castShadow>
          <cylinderGeometry args={[0.28, 0.28, 0.58, 32]} />
          <meshStandardMaterial
            color={
              selectedPin === 'Comp_Capacitor_Power2'
                ? '#38bdf8'
                : hoveredPin === 'Comp_Capacitor_Power2'
                ? '#7dd3fc'
                : '#f1f5f9'
            }
            metalness={0.95}
            roughness={0.15}
            emissive={
              selectedPin === 'Comp_Capacitor_Power2'
                ? '#0284c7'
                : hoveredPin === 'Comp_Capacitor_Power2'
                ? '#38bdf8'
                : '#000000'
            }
            emissiveIntensity={0.35}
          />
        </mesh>

        {/* Top Disc with Silkscreen */}
        <mesh position={[0, 0.291, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
          <circleGeometry args={[0.278, 32]} />
          <meshStandardMaterial map={capacitorTopTexture} roughness={0.25} metalness={0.5} />
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* 5. 500mA PTC RESETTABLE GOLD POLYFUSE (Beside USB connector)              */}
      {/* ========================================================================= */}
      <group
        position={[-1.8, 0.2, -0.9]}
        onClick={(e) => handleClick(e, 'Comp_Polyfuse')}
        onPointerOver={(e) => handlePointerOver(e, 'Comp_Polyfuse')}
        onPointerOut={handlePointerOut}
      >
        {/* Gold Rectangular Body (501K) */}
        <mesh castShadow position={[0, 0, 0]}>
          <boxGeometry args={[0.38, 0.12, 0.5]} />
          <meshStandardMaterial
            color={
              selectedPin === 'Comp_Polyfuse'
                ? '#f59e0b'
                : hoveredPin === 'Comp_Polyfuse'
                ? '#fbbf24'
                : '#d97706'
            }
            metalness={0.7}
            roughness={0.3}
            emissive={
              selectedPin === 'Comp_Polyfuse'
                ? '#d97706'
                : hoveredPin === 'Comp_Polyfuse'
                ? '#f59e0b'
                : '#000000'
            }
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Top Silkscreen with "501K" */}
        <mesh position={[0, 0.062, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.34, 0.44]} />
          <meshBasicMaterial map={polyfuseTexture} transparent />
        </mesh>

        {/* Silver Solder End Terminals */}
        {[-0.23, 0.23].map((tz, ti) => (
          <mesh key={ti} position={[0, 0, tz]}>
            <boxGeometry args={[0.4, 0.13, 0.08]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.92} />
          </mesh>
        ))}
      </group>

      {/* ========================================================================= */}
      {/* 6. ATMEGA16U2 USB-TO-SERIAL BRIDGE CHIP (QFN-32)                          */}
      {/* ========================================================================= */}
      <group
        position={[-1.2, 0.18, -0.85]}
        onClick={(e) => handleClick(e, 'Comp_Chip_16U2')}
        onPointerOver={(e) => handlePointerOver(e, 'Comp_Chip_16U2')}
        onPointerOut={handlePointerOut}
      >
        {/* QFN-32 Square SMT IC Body */}
        <mesh castShadow>
          <boxGeometry args={[0.72, 0.1, 0.72]} />
          <meshStandardMaterial
            color={
              selectedPin === 'Comp_Chip_16U2'
                ? '#0284c7'
                : hoveredPin === 'Comp_Chip_16U2'
                ? '#38bdf8'
                : '#0f172a'
            }
            roughness={0.4}
            emissive={
              selectedPin === 'Comp_Chip_16U2'
                ? '#0284c7'
                : hoveredPin === 'Comp_Chip_16U2'
                ? '#38bdf8'
                : '#000000'
            }
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Pin 1 Index Dot */}
        <mesh position={[-0.26, 0.052, -0.26]}>
          <circleGeometry args={[0.035, 16]} />
          <meshBasicMaterial color="#334155" />
        </mesh>

        {/* 32 Silver Solder Leads along 4 perimeter edges */}
        <mesh position={[0, -0.02, 0]}>
          <boxGeometry args={[0.86, 0.03, 0.86]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} />
        </mesh>

        {/* Mini 16 MHz Ceramic Resonator (for 16U2 clock) */}
        <mesh position={[0.55, -0.01, 0]}>
          <boxGeometry args={[0.22, 0.07, 0.35]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.8} />
        </mesh>

        {/* 4-Resistor Pack Array (22 Ohm USB series damping) */}
        <mesh position={[-0.55, -0.01, 0]}>
          <boxGeometry args={[0.18, 0.06, 0.35]} />
          <meshStandardMaterial color="#0f172a" roughness={0.6} />
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* 7. ICSP HEADER FOR USB INTERFACE (ATmega16U2 DFU Header, 2x3 male pins)   */}
      {/* ========================================================================= */}
      <group
        position={[-1.2, 0.35, -1.60]}
        onClick={(e) => handleClick(e, 'Comp_ICSP_USB')}
        onPointerOver={(e) => handlePointerOver(e, 'Comp_ICSP_USB')}
        onPointerOut={handlePointerOut}
      >
        {/* Black Plastic Spacer Base */}
        <mesh position={[0, -0.15, 0]}>
          <boxGeometry args={[0.72, 0.22, 0.46]} />
          <meshStandardMaterial
            color={
              selectedPin === 'Comp_ICSP_USB'
                ? '#0284c7'
                : hoveredPin === 'Comp_ICSP_USB'
                ? '#38bdf8'
                : '#1e293b'
            }
            roughness={0.8}
            emissive={selectedPin === 'Comp_ICSP_USB' ? '#0284c7' : hoveredPin === 'Comp_ICSP_USB' ? '#38bdf8' : '#000000'}
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* 6 Gold Pins (3 columns x 2 rows) */}
        {[-0.22, 0, 0.22].map((gx, xi) =>
          [-0.12, 0.12].map((gz, zi) => (
            <mesh key={`${xi}-${zi}`} position={[gx, 0.16, gz]}>
              <boxGeometry args={[0.06, 0.48, 0.06]} />
              <meshStandardMaterial color="#fef08a" metalness={0.96} roughness={0.1} />
            </mesh>
          ))
        )}
      </group>

      {/* ========================================================================= */}
      {/* 8. ICSP HEADER FOR ATMEGA328P (Main SPI Header on Right Edge, 2x3 pins)   */}
      {/* ========================================================================= */}
      <group
        position={[2.6, 0.35, 0.0]}
        onClick={(e) => handleClick(e, 'Comp_ICSP_Main')}
        onPointerOver={(e) => handlePointerOver(e, 'Comp_ICSP_Main')}
        onPointerOut={handlePointerOut}
      >
        {/* Black Plastic Spacer Base */}
        <mesh position={[0, -0.15, 0]}>
          <boxGeometry args={[0.5, 0.22, 0.72]} />
          <meshStandardMaterial
            color={
              selectedPin === 'Comp_ICSP_Main'
                ? '#0284c7'
                : hoveredPin === 'Comp_ICSP_Main'
                ? '#38bdf8'
                : '#1e293b'
            }
            roughness={0.8}
            emissive={selectedPin === 'Comp_ICSP_Main' ? '#0284c7' : hoveredPin === 'Comp_ICSP_Main' ? '#38bdf8' : '#000000'}
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* 6 Gold Pins (2 columns x 3 rows: MISO, VCC, SCK, MOSI, RESET, GND) */}
        {[-0.12, 0.12].map((gx, xi) =>
          [-0.22, 0, 0.22].map((gz, zi) => (
            <mesh key={`${xi}-${zi}`} position={[gx, 0.16, gz]}>
              <boxGeometry args={[0.06, 0.48, 0.06]} />
              <meshStandardMaterial color="#fef08a" metalness={0.96} roughness={0.1} />
            </mesh>
          ))
        )}
      </group>

      {/* ========================================================================= */}
      {/* 9. ATMEGA328P-PU IN DIP-28 SOCKET (With X-Ray Silicon Die)               */}
      {/* ========================================================================= */}
      <group position={[0.7, 0.22, 0.4]}>
        {/* DIP-28 Socket Base */}
        <mesh
          position={[0, 0, 0]}
          castShadow
          onClick={(e) => handleClick(e, 'Chip_ATMEGA328P')}
          onPointerOver={(e) => handlePointerOver(e, 'Chip_ATMEGA328P')}
          onPointerOut={handlePointerOut}
        >
          <boxGeometry args={[3.25, 0.16, 1.15]} />
          <meshStandardMaterial color="#0f172a" roughness={0.7} />
        </mesh>

        {/* 28 Metallic Dual-In-Line Bent Legs */}
        {Array.from({ length: 14 }).map((_, i) => {
          const pinX = -1.35 + i * 0.21;
          return (
            <group key={i}>
              <mesh position={[pinX, 0.05, 0.56]}>
                <boxGeometry args={[0.06, 0.18, 0.14]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.92} roughness={0.18} />
              </mesh>
              <mesh position={[pinX, 0.05, -0.56]}>
                <boxGeometry args={[0.06, 0.18, 0.14]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.92} roughness={0.18} />
              </mesh>
            </group>
          );
        })}

        {/* The ATmega328P Epoxy Body Lid (Lifts / dissolves during X-Ray) */}
        <group position={[0, 0.14 + chipLidLift, 0]}>
          <mesh
            castShadow
            onClick={xrayValue < 0.2 ? (e) => handleClick(e, 'Chip_ATMEGA328P') : undefined}
            onPointerOver={xrayValue < 0.2 ? (e) => handlePointerOver(e, 'Chip_ATMEGA328P') : undefined}
            onPointerOut={handlePointerOut}
            raycast={xrayValue > 0.2 ? () => null : undefined}
          >
            <boxGeometry args={[3.12, 0.18, 0.98]} />
            <meshStandardMaterial
              color={
                selectedPin === 'Chip_ATMEGA328P'
                  ? '#0369a1'
                  : hoveredPin === 'Chip_ATMEGA328P'
                  ? '#0284c7'
                  : '#1e293b'
              }
              roughness={0.45}
              transparent={xrayValue > 0.05}
              opacity={chipLidOpacity}
              emissive={
                selectedPin === 'Chip_ATMEGA328P'
                  ? '#0284c7'
                  : hoveredPin === 'Chip_ATMEGA328P'
                  ? '#38bdf8'
                  : '#000000'
              }
              emissiveIntensity={0.3}
            />
          </mesh>

          {/* Top Silkscreen Laser Etch: ATMEL ATMEGA328P-PU 1121 */}
          <mesh position={[0, 0.092, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2.95, 0.9]} />
            <meshBasicMaterial
              map={atmegaTexture}
              transparent={xrayValue > 0.05}
              opacity={chipLidOpacity}
            />
          </mesh>

          {/* Pin 1 Index Notch at Left */}
          <mesh position={[-1.53, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.2, 16, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color="#090d16" transparent={xrayValue > 0.05} opacity={chipLidOpacity} />
          </mesh>
        </group>

        {/* X-RAY INTERNAL SILICON MICRO-DIE OF ATMEGA328P (Individually Interactive) */}
        {xrayValue > 0.05 && (
          <group position={[0, 0.1, 0]}>
            {/* Silicon Die Substrate Base */}
            <mesh
              position={[0, 0, 0]}
              onClick={(e) => handleClick(e, 'Chip_ATMEGA328P')}
              onPointerOver={(e) => handlePointerOver(e, 'Chip_ATMEGA328P')}
              onPointerOut={handlePointerOut}
            >
              <boxGeometry args={[2.5, 0.04, 0.7]} />
              <meshStandardMaterial
                color={selectedPin === 'Chip_ATMEGA328P' ? '#1e293b' : '#0f172a'}
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>

            {/* 32KB Flash Storage Block */}
            <mesh
              position={[-0.7, 0.04, 0]}
              onClick={(e) => handleClick(e, 'Die_Flash_32KB')}
              onPointerOver={(e) => handlePointerOver(e, 'Die_Flash_32KB')}
              onPointerOut={handlePointerOut}
            >
              <boxGeometry args={[0.8, 0.03, 0.55]} />
              <meshStandardMaterial
                color={
                  selectedPin === 'Die_Flash_32KB'
                    ? '#38bdf8'
                    : hoveredPin === 'Die_Flash_32KB'
                    ? '#60a5fa'
                    : '#0284c7'
                }
                emissive="#0284c7"
                emissiveIntensity={
                  selectedPin === 'Die_Flash_32KB' ? 0.95 : hoveredPin === 'Die_Flash_32KB' ? 0.75 : 0.45
                }
              />
            </mesh>

            {/* 8-bit AVR RISC ALU & Core */}
            <mesh
              position={[0.2, 0.04, -0.15]}
              onClick={(e) => handleClick(e, 'Die_ALU_Core')}
              onPointerOver={(e) => handlePointerOver(e, 'Die_ALU_Core')}
              onPointerOut={handlePointerOut}
            >
              <boxGeometry args={[0.8, 0.03, 0.25]} />
              <meshStandardMaterial
                color={
                  selectedPin === 'Die_ALU_Core'
                    ? '#fbbf24'
                    : hoveredPin === 'Die_ALU_Core'
                    ? '#f59e0b'
                    : '#d97706'
                }
                emissive="#d97706"
                emissiveIntensity={
                  selectedPin === 'Die_ALU_Core' ? 0.95 : hoveredPin === 'Die_ALU_Core' ? 0.75 : 0.45
                }
              />
            </mesh>

            {/* 2KB SRAM Working Memory */}
            <mesh
              position={[0.2, 0.04, 0.15]}
              onClick={(e) => handleClick(e, 'Die_SRAM_2KB')}
              onPointerOver={(e) => handlePointerOver(e, 'Die_SRAM_2KB')}
              onPointerOut={handlePointerOut}
            >
              <boxGeometry args={[0.8, 0.03, 0.22]} />
              <meshStandardMaterial
                color={
                  selectedPin === 'Die_SRAM_2KB'
                    ? '#34d399'
                    : hoveredPin === 'Die_SRAM_2KB'
                    ? '#10b981'
                    : '#059669'
                }
                emissive="#10b981"
                emissiveIntensity={
                  selectedPin === 'Die_SRAM_2KB' ? 0.95 : hoveredPin === 'Die_SRAM_2KB' ? 0.75 : 0.45
                }
              />
            </mesh>

            {/* Peripheral Bus & Timers */}
            <mesh
              position={[0.9, 0.04, 0]}
              onClick={(e) => handleClick(e, 'Die_Peripherals')}
              onPointerOver={(e) => handlePointerOver(e, 'Die_Peripherals')}
              onPointerOut={handlePointerOut}
            >
              <boxGeometry args={[0.4, 0.03, 0.55]} />
              <meshStandardMaterial
                color={
                  selectedPin === 'Die_Peripherals'
                    ? '#c084fc'
                    : hoveredPin === 'Die_Peripherals'
                    ? '#a855f7'
                    : '#8b5cf6'
                }
                emissive="#8b5cf6"
                emissiveIntensity={
                  selectedPin === 'Die_Peripherals' ? 0.95 : hoveredPin === 'Die_Peripherals' ? 0.75 : 0.45
                }
              />
            </mesh>
          </group>
        )}
      </group>

      {/* ========================================================================= */}
      {/* 10. SPK 16.000 MHz MAIN QUARTZ CRYSTAL (HC-49 Silver Can)                */}
      {/* ========================================================================= */}
      <group
        position={[-0.4, 0.3, 0.2]}
        onClick={(e) => handleClick(e, 'Comp_Crystal16MHz')}
        onPointerOver={(e) => handlePointerOver(e, 'Comp_Crystal16MHz')}
        onPointerOut={handlePointerOut}
      >
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <capsuleGeometry args={[0.16, 0.58, 20, 20]} />
          <meshStandardMaterial
            color={
              selectedPin === 'Comp_Crystal16MHz'
                ? '#38bdf8'
                : hoveredPin === 'Comp_Crystal16MHz'
                ? '#7dd3fc'
                : '#f8fafc'
            }
            metalness={0.96}
            roughness={0.12}
            emissive={
              selectedPin === 'Comp_Crystal16MHz'
                ? '#0284c7'
                : hoveredPin === 'Comp_Crystal16MHz'
                ? '#38bdf8'
                : '#000000'
            }
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Top Text "SPK16.000G" */}
        <mesh position={[0, 0.17, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.65, 0.24]} />
          <meshBasicMaterial map={crystalTexture} transparent />
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* 11. 5V VOLTAGE REGULATOR (NCP1117 / AMS1117 SOT-223)                      */}
      {/* ========================================================================= */}
      <group
        position={[-1.1, 0.22, 0.8]}
        onClick={(e) => handleClick(e, 'Comp_Regulator5V')}
        onPointerOver={(e) => handlePointerOver(e, 'Comp_Regulator5V')}
        onPointerOut={handlePointerOut}
      >
        <mesh castShadow>
          <boxGeometry args={[0.6, 0.18, 0.48]} />
          <meshStandardMaterial
            color={
              selectedPin === 'Comp_Regulator5V'
                ? '#0284c7'
                : hoveredPin === 'Comp_Regulator5V'
                ? '#38bdf8'
                : '#0f172a'
            }
            roughness={0.5}
            emissive={
              selectedPin === 'Comp_Regulator5V'
                ? '#0284c7'
                : hoveredPin === 'Comp_Regulator5V'
                ? '#38bdf8'
                : '#000000'
            }
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Top Heavy Copper/Nickel Solder Heatsink Tab */}
        <mesh position={[0, 0.05, -0.28]}>
          <boxGeometry args={[0.38, 0.08, 0.18]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.92} roughness={0.18} />
        </mesh>

        {/* 3 Bottom Solder Leads */}
        {[-0.18, 0, 0.18].map((lx, li) => (
          <mesh key={li} position={[lx, -0.05, 0.28]}>
            <boxGeometry args={[0.08, 0.05, 0.12]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.92} />
          </mesh>
        ))}
      </group>

      {/* ========================================================================= */}
      {/* 12. M7 REVERSE POLARITY PROTECTION DIODE (SMA Package)                    */}
      {/* ========================================================================= */}
      <group
        position={[-1.9, 0.2, 1.8]}
        onClick={(e) => handleClick(e, 'Comp_Diode_M7')}
        onPointerOver={(e) => handlePointerOver(e, 'Comp_Diode_M7')}
        onPointerOut={handlePointerOut}
      >
        <mesh castShadow>
          <boxGeometry args={[0.26, 0.12, 0.44]} />
          <meshStandardMaterial
            color={
              selectedPin === 'Comp_Diode_M7'
                ? '#0284c7'
                : hoveredPin === 'Comp_Diode_M7'
                ? '#38bdf8'
                : '#0f172a'
            }
            roughness={0.5}
            emissive={selectedPin === 'Comp_Diode_M7' ? '#0284c7' : hoveredPin === 'Comp_Diode_M7' ? '#38bdf8' : '#000000'}
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* White Cathode Polarity Stripe */}
        <mesh position={[0, 0.065, -0.12]}>
          <boxGeometry args={[0.22, 0.01, 0.06]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* 13. LM358 DUAL OP-AMP IC (SOIC-8, Comparator & Pin 13 Buffer)            */}
      {/* ========================================================================= */}
      <group
        position={[-0.6, 0.18, -0.4]}
        onClick={(e) => handleClick(e, 'Comp_OpAmp_LM358')}
        onPointerOver={(e) => handlePointerOver(e, 'Comp_OpAmp_LM358')}
        onPointerOut={handlePointerOut}
      >
        <mesh castShadow>
          <boxGeometry args={[0.42, 0.1, 0.52]} />
          <meshStandardMaterial
            color={
              selectedPin === 'Comp_OpAmp_LM358'
                ? '#0284c7'
                : hoveredPin === 'Comp_OpAmp_LM358'
                ? '#38bdf8'
                : '#0f172a'
            }
            roughness={0.4}
            emissive={selectedPin === 'Comp_OpAmp_LM358' ? '#0284c7' : hoveredPin === 'Comp_OpAmp_LM358' ? '#38bdf8' : '#000000'}
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* 8 Silver Gull-wing Pins */}
        {[-0.24, 0.24].map((px, pi) =>
          [-0.18, -0.06, 0.06, 0.18].map((pz, pzi) => (
            <mesh key={`${pi}-${pzi}`} position={[px, -0.02, pz]}>
              <boxGeometry args={[0.1, 0.03, 0.06]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.92} />
            </mesh>
          ))
        )}
      </group>

      {/* ========================================================================= */}
      {/* 14. TACTILE RESET PUSHBUTTON                                              */}
      {/* ========================================================================= */}
      <group
        position={[-2.7, 0.35, -2.1]}
        onClick={(e) => handleClick(e, 'Comp_ResetButton')}
        onPointerOver={(e) => handlePointerOver(e, 'Comp_ResetButton')}
        onPointerOut={handlePointerOut}
      >
        {/* Metal Bracket Frame */}
        <mesh castShadow>
          <boxGeometry args={[0.56, 0.3, 0.56]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.25} />
        </mesh>

        {/* Red Tactile Push Plunger */}
        <mesh position={[0, 0.18, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.14, 24]} />
          <meshStandardMaterial
            color={
              selectedPin === 'Comp_ResetButton'
                ? '#f87171'
                : hoveredPin === 'Comp_ResetButton'
                ? '#fca5a5'
                : '#ef4444'
            }
            roughness={0.35}
            emissive={selectedPin === 'Comp_ResetButton' ? '#ef4444' : hoveredPin === 'Comp_ResetButton' ? '#f87171' : '#000000'}
            emissiveIntensity={0.4}
          />
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* 15. SMT LED CLUSTER (ON green, L amber, TX/RX yellow)                     */}
      {/* ========================================================================= */}
      {/* Power LED ON (Green) */}
      <mesh position={[1.4, 0.14, -0.7]}>
        <boxGeometry args={[0.12, 0.08, 0.08]} />
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.95} />
      </mesh>

      {/* Pin 13 LED L (Amber) */}
      <mesh
        position={[-0.4, 0.14, -1.0]}
        onClick={(e) => handleClick(e, 'Pin_D13')}
        onPointerOver={(e) => handlePointerOver(e, 'Pin_D13')}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[0.12, 0.08, 0.08]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#f59e0b"
          emissiveIntensity={selectedPin === 'Pin_D13' ? 1.0 : 0.65}
        />
      </mesh>

      {/* TX & RX LEDs (Yellow) */}
      <mesh position={[-0.6, 0.14, -0.7]}>
        <boxGeometry args={[0.08, 0.06, 0.06]} />
        <meshStandardMaterial color="#eab308" emissive="#eab308" emissiveIntensity={0.65} />
      </mesh>
      <mesh position={[-0.6, 0.14, -0.85]}>
        <boxGeometry args={[0.08, 0.06, 0.06]} />
        <meshStandardMaterial color="#eab308" emissive="#eab308" emissiveIntensity={0.65} />
      </mesh>

      {/* Distributed 0805 Decoupling Ceramic Capacitors & Resistors */}
      {[
        [-1.6, 0.12, -0.4],
        [-0.9, 0.12, -0.4],
        [0.1, 0.12, -0.4],
        [1.8, 0.12, -0.4],
        [-1.6, 0.12, 1.8],
        [-0.4, 0.12, 1.8]
      ].map(([rx, ry, rz], ri) => (
        <group key={ri} position={[rx, ry, rz]}>
          <mesh>
            <boxGeometry args={[0.12, 0.06, 0.22]} />
            <meshStandardMaterial color={ri % 2 === 0 ? '#b45309' : '#1e293b'} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, -0.11]}>
            <boxGeometry args={[0.13, 0.07, 0.04]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
          </mesh>
          <mesh position={[0, 0, 0.11]}>
            <boxGeometry args={[0.13, 0.07, 0.04]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
          </mesh>
        </group>
      ))}

      {/* ========================================================================= */}
      {/* 16. DISCRETE FEMALE PIN HEADERS (Digital, Power, Analog)                  */}
      {/* ========================================================================= */}
      <mesh position={[-1.225, 0.42, -2.15]} castShadow>
        <boxGeometry args={[2.55, 0.65, 0.35]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>
      <mesh position={[1.125, 0.42, -2.15]} castShadow>
        <boxGeometry args={[2.05, 0.65, 0.35]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>
      <mesh position={[-1.2, 0.42, 2.15]} castShadow>
        <boxGeometry args={[2.05, 0.65, 0.35]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>
      <mesh position={[1.075, 0.42, 2.15]} castShadow>
        <boxGeometry args={[1.55, 0.65, 0.35]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>

      {/* CLICKABLE HEADER PIN RECEPTACLES */}
      {[...digitalPins, ...powerPins, ...analogPins].map((pin) => {
        const isSelected = selectedPin === pin.name;
        const isHovered = hoveredPin === pin.name;
        const isTagMatch = activeFilterTag && pin.tag.includes(activeFilterTag);

        return (
          <group
            key={pin.name}
            position={[pin.x, 0.75, pin.z]}
            onClick={(e) => handleClick(e, pin.name)}
            onPointerOver={(e) => handlePointerOver(e, pin.name)}
            onPointerOut={handlePointerOut}
          >
            {/* Socket Rim */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.19, 0.04, 0.19]} />
              <meshBasicMaterial
                color={
                  isSelected
                    ? '#0284c7'
                    : isTagMatch
                    ? '#d97706'
                    : isHovered
                    ? '#38bdf8'
                    : '#090d16'
                }
              />
            </mesh>

            {/* Gold Spring Contact Inside */}
            <mesh position={[0, -0.1, 0]}>
              <boxGeometry args={[0.1, 0.22, 0.1]} />
              <meshStandardMaterial
                color={
                  isSelected
                    ? '#38bdf8'
                    : isTagMatch
                    ? '#fbbf24'
                    : isHovered
                    ? '#7dd3fc'
                    : '#fef08a'
                }
                metalness={0.95}
                roughness={0.1}
                emissive={
                  isSelected
                    ? '#0284c7'
                    : isTagMatch
                    ? '#d97706'
                    : isHovered
                    ? '#38bdf8'
                    : '#000000'
                }
                emissiveIntensity={isSelected ? 0.6 : isHovered ? 0.4 : 0}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
