import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useLensStore } from '../../store/useLensStore';
import { use3DInteraction } from '../../utils/use3DInteraction';

/**
 * Photorealistic 3D Model of Intel 8086 Microprocessor (DIP-40).
 * Features authentic ceramic package with 40 shiny metallic bent lead pins,
 * silkscreen branding, and an interactive X-Ray cutaway revealing the
 * silicon die, BIU (Bus Interface Unit), and EU (Execution Unit).
 */
export function Intel8086Model() {
  const {
    selectedPin,
    hoveredPin,
    xrayValue
  } = useLensStore();

  const {
    handlePointerOver,
    handlePointerOut,
    handleClick
  } = use3DInteraction();

  // Top Pin Row (Pins 21 - 40, from right to left in standard DIP pinout)
  const topPins = useMemo(() => [
    { pinNum: 40, name: 'Pin_VCC_40', label: 'VCC (+5V)', x: -2.375, z: -1.0 },
    { pinNum: 39, name: 'Pin_AD15_39', label: 'AD15', x: -2.125, z: -1.0 },
    { pinNum: 38, name: 'Pin_AD14_38', label: 'AD14', x: -1.875, z: -1.0 },
    { pinNum: 37, name: 'Pin_AD13_37', label: 'AD13', x: -1.625, z: -1.0 },
    { pinNum: 36, name: 'Pin_AD12_36', label: 'AD12', x: -1.375, z: -1.0 },
    { pinNum: 35, name: 'Pin_AD11_35', label: 'AD11', x: -1.125, z: -1.0 },
    { pinNum: 34, name: 'Pin_BHE_34', label: 'BHE#/S7', x: -0.875, z: -1.0 },
    { pinNum: 33, name: 'Pin_MNMX_33', label: 'MN/MX#', x: -0.625, z: -1.0 },
    { pinNum: 32, name: 'Pin_RD_32', label: 'RD#', x: -0.375, z: -1.0 },
    { pinNum: 31, name: 'Pin_ALE_31', label: 'ALE', x: -0.125, z: -1.0 },
    { pinNum: 30, name: 'Pin_DEN_30', label: 'DEN#', x: 0.125, z: -1.0 },
    { pinNum: 29, name: 'Pin_DTR_29', label: 'DT/R#', x: 0.375, z: -1.0 },
    { pinNum: 28, name: 'Pin_MIO_28', label: 'M/IO#', x: 0.625, z: -1.0 },
    { pinNum: 27, name: 'Pin_WR_27', label: 'WR#', x: 0.875, z: -1.0 },
    { pinNum: 26, name: 'Pin_HLDA_26', label: 'HLDA', x: 1.125, z: -1.0 },
    { pinNum: 25, name: 'Pin_HOLD_25', label: 'HOLD', x: 1.375, z: -1.0 },
    { pinNum: 24, name: 'Pin_INTA_24', label: 'INTA#', x: 1.625, z: -1.0 },
    { pinNum: 23, name: 'Pin_TEST_23', label: 'TEST#', x: 1.875, z: -1.0 },
    { pinNum: 22, name: 'Pin_READY_22', label: 'READY', x: 2.125, z: -1.0 },
    { pinNum: 21, name: 'Pin_RESET_21', label: 'RESET', x: 2.375, z: -1.0 }
  ], []);

  // Bottom Pin Row (Pins 1 - 20, from left to right)
  const bottomPins = useMemo(() => [
    { pinNum: 1, name: 'Pin_GND_1', label: 'GND', x: -2.375, z: 1.0 },
    { pinNum: 2, name: 'Pin_AD14_2', label: 'AD14', x: -2.125, z: 1.0 },
    { pinNum: 3, name: 'Pin_AD13_3', label: 'AD13', x: -1.875, z: 1.0 },
    { pinNum: 4, name: 'Pin_AD12_4', label: 'AD12', x: -1.625, z: 1.0 },
    { pinNum: 5, name: 'Pin_AD11_5', label: 'AD11', x: -1.375, z: 1.0 },
    { pinNum: 6, name: 'Pin_AD10_6', label: 'AD10', x: -1.125, z: 1.0 },
    { pinNum: 7, name: 'Pin_AD9_7', label: 'AD9', x: -0.875, z: 1.0 },
    { pinNum: 8, name: 'Pin_AD8_8', label: 'AD8', x: -0.625, z: 1.0 },
    { pinNum: 9, name: 'Pin_AD7_9', label: 'AD7', x: -0.375, z: 1.0 },
    { pinNum: 10, name: 'Pin_AD6_10', label: 'AD6', x: -0.125, z: 1.0 },
    { pinNum: 11, name: 'Pin_AD5_11', label: 'AD5', x: 0.125, z: 1.0 },
    { pinNum: 12, name: 'Pin_AD4_12', label: 'AD4', x: 0.375, z: 1.0 },
    { pinNum: 13, name: 'Pin_AD3_13', label: 'AD3', x: 0.625, z: 1.0 },
    { pinNum: 14, name: 'Pin_AD2_14', label: 'AD2', x: 0.875, z: 1.0 },
    { pinNum: 15, name: 'Pin_AD1_15', label: 'AD1', x: 1.125, z: 1.0 },
    { pinNum: 16, name: 'Pin_AD0_16', label: 'AD0', x: 1.375, z: 1.0 },
    { pinNum: 17, name: 'Pin_NMI_17', label: 'NMI', x: 1.625, z: 1.0 },
    { pinNum: 18, name: 'Pin_INTR_18', label: 'INTR', x: 1.875, z: 1.0 },
    { pinNum: 19, name: 'Pin_CLK_19', label: 'CLK', x: 2.125, z: 1.0 },
    { pinNum: 20, name: 'Pin_GND_20', label: 'GND', x: 2.375, z: 1.0 }
  ], []);

  const packageOpacity = 1.0 - xrayValue * 0.75;
  const packageLiftY = xrayValue * 0.65;

  return (
    <group position={[0, 0, 0]}>
      {/* 1. CERAMIC DIP-40 HOUSING */}
      <group position={[0, 0.2 + packageLiftY, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[5.2, 0.36, 1.55]} />
          <meshStandardMaterial
            color="#1e293b"
            roughness={0.5}
            metalness={0.2}
            transparent={xrayValue > 0.05}
            opacity={packageOpacity}
          />
        </mesh>

        {/* Pin-1 Notch */}
        <mesh position={[-2.6, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.4, 16, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#090d16" transparent={xrayValue > 0.05} opacity={packageOpacity} />
        </mesh>

        {/* Laser Silkscreen Branding */}
        {xrayValue < 0.8 && (
          <group position={[0, 0.182, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh>
              <planeGeometry args={[3.8, 0.9]} />
              <meshBasicMaterial transparent opacity={packageOpacity}>
                <canvasTexture
                  attach="map"
                  image={(() => {
                    const c = document.createElement('canvas');
                    c.width = 1024;
                    c.height = 256;
                    const ctx = c.getContext('2d');
                    ctx.fillStyle = '#1e293b';
                    ctx.fillRect(0, 0, 1024, 256);
                    ctx.fillStyle = '#f8fafc';
                    ctx.font = 'bold 54px Outfit, sans-serif';
                    ctx.fillText('intel®', 120, 80);
                    ctx.font = 'bold 68px JetBrains Mono, monospace';
                    ctx.fillText('D8086-2', 120, 165);
                    ctx.font = '400 32px JetBrains Mono, monospace';
                    ctx.fillText("©'78 '81 PHILIPPINES / MALAYSIA", 120, 220);
                    return c;
                  })()}
                />
              </meshBasicMaterial>
            </mesh>
          </group>
        )}
      </group>

      {/* 2. DUAL IN-LINE 40 METALLIC LEADS (Pins 1 - 40) */}
      {[...topPins, ...bottomPins].map((pin) => {
        const isSelected = selectedPin === pin.name;
        const isHovered = hoveredPin === pin.name;
        const isTop = pin.z < 0;

        return (
          <group
            key={pin.name}
            position={[pin.x, 0.15, pin.z]}
            onClick={(e) => handleClick(e, pin.name)}
            onPointerOver={(e) => handlePointerOver(e, pin.name)}
            onPointerOut={handlePointerOut}
          >
            {/* Horizontal Stamped Lead Shoulder */}
            <mesh position={[0, 0, isTop ? 0.12 : -0.12]}>
              <boxGeometry args={[0.08, 0.05, 0.25]} />
              <meshStandardMaterial
                color={isSelected ? '#38bdf8' : '#e2e8f0'}
                metalness={0.96}
                roughness={0.15}
                emissive={isSelected ? '#0284c7' : isHovered ? '#38bdf8' : '#000000'}
                emissiveIntensity={isSelected ? 0.6 : isHovered ? 0.4 : 0}
              />
            </mesh>

            {/* Vertical Downward Bent Leg */}
            <mesh position={[0, -0.25, 0]}>
              <boxGeometry args={[0.08, 0.55, 0.05]} />
              <meshStandardMaterial
                color={isSelected ? '#38bdf8' : '#e2e8f0'}
                metalness={0.96}
                roughness={0.15}
                emissive={isSelected ? '#0284c7' : isHovered ? '#38bdf8' : '#000000'}
                emissiveIntensity={isSelected ? 0.6 : isHovered ? 0.4 : 0}
              />
            </mesh>
          </group>
        );
      })}

      {/* 3. X-RAY INTERNAL MICROARCHITECTURE DIE & FUNCTIONAL BLOCKS */}
      {xrayValue > 0.05 && (
        <group position={[0, 0.1, 0]}>
          {/* Silicon Die Substrate */}
          <mesh receiveShadow position={[0, 0, 0]}>
            <boxGeometry args={[4.4, 0.04, 1.2]} />
            <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.85} />
          </mesh>

          {/* Gold Wire Bonds */}
          {Array.from({ length: 20 }).map((_, i) => (
            <mesh key={i} position={[-2.0 + i * 0.21, 0.03, 0.55]} rotation={[0.4, 0, 0]}>
              <cylinderGeometry args={[0.008, 0.008, 0.22, 8]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.98} roughness={0.08} />
            </mesh>
          ))}

          {/* BLOCK A: BUS INTERFACE UNIT (BIU) - Left Section (Cyan) */}
          <group
            position={[-1.1, 0.06, 0]}
            onClick={(e) => handleClick(e, 'Block_BIU')}
            onPointerOver={(e) => handlePointerOver(e, 'Block_BIU')}
            onPointerOut={handlePointerOut}
          >
            <mesh castShadow>
              <boxGeometry args={[1.9, 0.08, 1.0]} />
              <meshStandardMaterial
                color={selectedPin === 'Block_BIU' ? '#0284c7' : '#0369a1'}
                emissive="#0284c7"
                emissiveIntensity={selectedPin === 'Block_BIU' ? 0.7 : 0.3}
                roughness={0.3}
              />
            </mesh>

            {/* 6-Byte Instruction FIFO Queue Graphic */}
            <mesh position={[0, 0.05, 0.3]}>
              <boxGeometry args={[1.6, 0.03, 0.22]} />
              <meshStandardMaterial color="#38bdf8" roughness={0.2} />
            </mesh>

            {/* Segment Registers (CS, DS, SS, ES) & IP */}
            <mesh position={[0, 0.05, -0.2]}>
              <boxGeometry args={[1.6, 0.03, 0.35]} />
              <meshStandardMaterial color="#0284c7" roughness={0.2} />
            </mesh>
          </group>

          {/* BLOCK B: EXECUTION UNIT (EU) - Right Section (Amber) */}
          <group
            position={[1.1, 0.06, 0]}
            onClick={(e) => handleClick(e, 'Block_EU')}
            onPointerOver={(e) => handlePointerOver(e, 'Block_EU')}
            onPointerOut={handlePointerOut}
          >
            <mesh castShadow>
              <boxGeometry args={[1.9, 0.08, 1.0]} />
              <meshStandardMaterial
                color={selectedPin === 'Block_EU' ? '#d97706' : '#b45309'}
                emissive="#d97706"
                emissiveIntensity={selectedPin === 'Block_EU' ? 0.7 : 0.3}
                roughness={0.3}
              />
            </mesh>

            {/* 16-Bit ALU */}
            <mesh position={[0.2, 0.05, 0.2]}>
              <boxGeometry args={[1.2, 0.03, 0.4]} />
              <meshStandardMaterial color="#fbbf24" roughness={0.2} />
            </mesh>

            {/* General Purpose Registers (AX, BX, CX, DX) */}
            <mesh position={[0.2, 0.05, -0.25]}>
              <boxGeometry args={[1.2, 0.03, 0.35]} />
              <meshStandardMaterial color="#f59e0b" roughness={0.2} />
            </mesh>
          </group>

          {/* Internal 16-bit System Bus Highway */}
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[0.22, 0.04, 0.9]} />
            <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.85} />
          </mesh>
        </group>
      )}
    </group>
  );
}
