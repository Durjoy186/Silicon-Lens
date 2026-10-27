import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useLensStore } from '../../store/useLensStore';
import { use3DInteraction } from '../../utils/use3DInteraction';

/**
 * Photorealistic 3D Model of Texas Instruments SN74LS00 Quad 2-Input NAND Gate IC (DIP-14).
 * Features:
 * - Authentic 14-pin dual-in-line package with index notch and Pin 1 dimple marker
 * - Realistic silkscreen laser etching with TI branding and pinout markings
 * - Dynamic metallic leadframe with bent solder legs and pin highlighting
 * - Interactive X-Ray view revealing silicon substrate die, gold bond wires, and
 *   4 internal NAND gate silicon blocks with LIVE signal glowing tied to the logic simulator.
 */
export function IC74LS00Model() {
  const {
    selectedPin,
    hoveredPin,
    xrayValue,
    logicInputs
  } = useLensStore();

  const {
    handlePointerOver,
    handlePointerOut,
    handleClick
  } = use3DInteraction();

  // Safe logic input access with fallback defaults
  const inputs = logicInputs || {
    g1A: 1, g1B: 1,
    g2A: 1, g2B: 0,
    g3A: 0, g3B: 1,
    g4A: 0, g4B: 0
  };

  // Compute live NAND logic outputs: Y = ~(A & B)
  const g1Out = inputs.g1A && inputs.g1B ? 0 : 1;
  const g2Out = inputs.g2A && inputs.g2B ? 0 : 1;
  const g3Out = inputs.g3A && inputs.g3B ? 0 : 1;
  const g4Out = inputs.g4A && inputs.g4B ? 0 : 1;

  // Bottom Pin Row (Pins 1 to 7, left to right)
  const bottomPins = useMemo(() => [
    { pinNum: 1, name: 'Pin_1A_1', label: '1A (In)', x: -1.5, z: 0.75, type: 'in', gate: 1, val: inputs.g1A },
    { pinNum: 2, name: 'Pin_1B_2', label: '1B (In)', x: -1.0, z: 0.75, type: 'in', gate: 1, val: inputs.g1B },
    { pinNum: 3, name: 'Pin_1Y_3', label: '1Y (Out)', x: -0.5, z: 0.75, type: 'out', gate: 1, val: g1Out },
    { pinNum: 4, name: 'Pin_2A_4', label: '2A (In)', x: 0.0, z: 0.75, type: 'in', gate: 2, val: inputs.g2A },
    { pinNum: 5, name: 'Pin_2B_5', label: '2B (In)', x: 0.5, z: 0.75, type: 'in', gate: 2, val: inputs.g2B },
    { pinNum: 6, name: 'Pin_2Y_6', label: '2Y (Out)', x: 1.0, z: 0.75, type: 'out', gate: 2, val: g2Out },
    { pinNum: 7, name: 'Pin_GND_7', label: 'GND (0V)', x: 1.5, z: 0.75, type: 'pwr' }
  ], [inputs.g1A, inputs.g1B, inputs.g2A, inputs.g2B, g1Out, g2Out]);

  // Top Pin Row (Pins 8 to 14, right to left in standard DIP counter-clockwise pinout)
  const topPins = useMemo(() => [
    { pinNum: 8, name: 'Pin_3Y_8', label: '3Y (Out)', x: 1.5, z: -0.75, type: 'out', gate: 3, val: g3Out },
    { pinNum: 9, name: 'Pin_3A_9', label: '3A (In)', x: 1.0, z: -0.75, type: 'in', gate: 3, val: inputs.g3A },
    { pinNum: 10, name: 'Pin_3B_10', label: '3B (In)', x: 0.5, z: -0.75, type: 'in', gate: 3, val: inputs.g3B },
    { pinNum: 11, name: 'Pin_4Y_11', label: '4Y (Out)', x: 0.0, z: -0.75, type: 'out', gate: 4, val: g4Out },
    { pinNum: 12, name: 'Pin_4A_12', label: '4A (In)', x: -0.5, z: -0.75, type: 'in', gate: 4, val: inputs.g4A },
    { pinNum: 13, name: 'Pin_4B_13', label: '4B (In)', x: -1.0, z: -0.75, type: 'in', gate: 4, val: inputs.g4B },
    { pinNum: 14, name: 'Pin_VCC_14', label: 'VCC (+5V)', x: -1.5, z: -0.75, type: 'pwr' }
  ], [inputs.g3A, inputs.g3B, inputs.g4A, inputs.g4B, g3Out, g4Out]);

  const packageOpacity = Math.max(0.04, 1.0 - xrayValue * 0.92);
  const packageLiftY = xrayValue * 1.4;

  // Silkscreen Canvas Texture with Transparent Background
  const silkscreenTexture = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 384;
    const ctx = c.getContext('2d');

    // Transparent background so internal die is not blocked
    ctx.clearRect(0, 0, 1024, 384);

    // Laser-etched TI style silkscreen
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 52px Outfit, sans-serif';
    ctx.fillText('ti  SN74LS00N', 120, 130);

    ctx.font = '600 32px JetBrains Mono, monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('QUAD 2-INPUT NAND GATE', 120, 195);

    ctx.font = '500 28px JetBrains Mono, monospace';
    ctx.fillStyle = '#64748b';
    ctx.fillText('MALAYSIA  2412   (TTL 5V)', 120, 255);

    // Index Pin 1 dot marker
    ctx.beginPath();
    ctx.arc(80, 270, 14, 0, Math.PI * 2);
    ctx.fillStyle = '#cbd5e1';
    ctx.fill();

    return new THREE.CanvasTexture(c);
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* 1. MOLDED EPOXY DIP-14 CASING (Lifts & fades with X-Ray slider) */}
      <group position={[0, 0.22 + packageLiftY, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3.8, 0.36, 1.25]} />
          <meshStandardMaterial
            color="#1e293b"
            roughness={0.45}
            metalness={0.25}
            transparent={xrayValue > 0.04}
            opacity={packageOpacity}
            depthWrite={xrayValue < 0.05}
          />
        </mesh>

        {/* Pin 1 Index Orientation Notch (Left End) */}
        <mesh position={[-1.9, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.38, 16, 1, false, 0, Math.PI]} />
          <meshStandardMaterial
            color="#090d16"
            transparent={xrayValue > 0.04}
            opacity={packageOpacity}
            depthWrite={xrayValue < 0.05}
          />
        </mesh>

        {/* Pin 1 Top Dimple Marker */}
        <mesh position={[-1.45, 0.185, 0.38]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial
            color="#0f172a"
            roughness={0.7}
            transparent={xrayValue > 0.04}
            opacity={packageOpacity}
            depthWrite={xrayValue < 0.05}
          />
        </mesh>

        {/* Laser Etch Silkscreen Plane */}
        {xrayValue < 0.45 && (
          <group position={[0, 0.182, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh>
              <planeGeometry args={[3.4, 1.05]} />
              <meshBasicMaterial
                map={silkscreenTexture}
                transparent
                opacity={Math.max(0, packageOpacity - 0.2)}
                depthWrite={false}
              />
            </mesh>
          </group>
        )}
      </group>

      {/* 2. DUAL IN-LINE 14 METALLIC LEADS (Pins 1 - 14) */}
      {[...bottomPins, ...topPins].map((pin) => {
        const isSelected = selectedPin === pin.name;
        const isHovered = hoveredPin === pin.name;
        const isTop = pin.z < 0;

        // Dynamic pin color based on logic state or selection
        let pinHighlightColor = '#e2e8f0';
        let pinEmissive = '#000000';
        let pinEmissiveIntensity = 0;

        if (isSelected) {
          pinHighlightColor = '#38bdf8';
          pinEmissive = '#0284c7';
          pinEmissiveIntensity = 0.8;
        } else if (isHovered) {
          pinHighlightColor = '#67e8f9';
          pinEmissive = '#06b6d4';
          pinEmissiveIntensity = 0.5;
        } else if (pin.type === 'out') {
          // Output pin reflects live logic state
          if (pin.val === 1) {
            pinHighlightColor = '#86efac';
            pinEmissive = '#10b981';
            pinEmissiveIntensity = 0.35;
          } else {
            pinHighlightColor = '#94a3b8';
          }
        } else if (pin.type === 'in' && pin.val === 1) {
          pinEmissive = '#38bdf8';
          pinEmissiveIntensity = 0.2;
        }

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
              <boxGeometry args={[0.09, 0.05, 0.26]} />
              <meshStandardMaterial
                color={pinHighlightColor}
                metalness={0.95}
                roughness={0.15}
                emissive={pinEmissive}
                emissiveIntensity={pinEmissiveIntensity}
              />
            </mesh>

            {/* Vertical Downward Bent Leg */}
            <mesh position={[0, -0.25, 0]}>
              <boxGeometry args={[0.09, 0.55, 0.05]} />
              <meshStandardMaterial
                color={pinHighlightColor}
                metalness={0.95}
                roughness={0.15}
                emissive={pinEmissive}
                emissiveIntensity={pinEmissiveIntensity}
              />
            </mesh>

            {/* Live Logic Output Micro-LED Indicator at Pin Base */}
            {pin.type === 'out' && (
              <mesh position={[0, 0.04, isTop ? 0.02 : -0.02]}>
                <sphereGeometry args={[0.04, 12, 12]} />
                <meshStandardMaterial
                  color={pin.val === 1 ? '#10b981' : '#475569'}
                  emissive={pin.val === 1 ? '#10b981' : '#000000'}
                  emissiveIntensity={pin.val === 1 ? 1.5 : 0}
                  roughness={0.2}
                />
              </mesh>
            )}
          </group>
        );
      })}

      {/* 3. X-RAY INTERNAL SILICON DIE & 4 LIVE NAND GATE BLOCKS */}
      {xrayValue > 0.03 && (
        <group position={[0, 0.1, 0]}>
          {/* Silicon Die Substrate Paddle */}
          <mesh receiveShadow position={[0, 0, 0]}>
            <boxGeometry args={[3.2, 0.04, 0.95]} />
            <meshStandardMaterial
              color="#090d16"
              roughness={0.2}
              metalness={0.88}
            />
          </mesh>

          {/* Die Attach Central Silicon Chip (Mirror micro-reflective finish) */}
          <mesh position={[0, 0.025, 0]}>
            <boxGeometry args={[2.7, 0.02, 0.75]} />
            <meshStandardMaterial
              color="#1e1b4b"
              roughness={0.15}
              metalness={0.92}
            />
          </mesh>

          {/* Microscopic Gold Wire Bonds connecting Leadframe to Silicon Die */}
          {Array.from({ length: 14 }).map((_, i) => {
            const isTop = i >= 7;
            const xOffset = -1.5 + (i % 7) * 0.5;
            const zDir = isTop ? -1 : 1;
            return (
              <mesh
                key={i}
                position={[xOffset, 0.04, zDir * 0.38]}
                rotation={[zDir * 0.35, 0, 0]}
              >
                <cylinderGeometry args={[0.007, 0.007, 0.16, 8]} />
                <meshStandardMaterial
                  color="#fbbf24"
                  metalness={0.98}
                  roughness={0.06}
                  emissive="#f59e0b"
                  emissiveIntensity={0.2}
                />
              </mesh>
            );
          })}

          {/* GATE 1: NAND GATE #1 (Lower Left - Pins 1A, 1B -> 1Y) */}
          <group
            position={[-0.7, 0.04, 0.2]}
            onClick={(e) => handleClick(e, 'Block_Gate1')}
            onPointerOver={(e) => handlePointerOver(e, 'Block_Gate1')}
            onPointerOut={handlePointerOut}
          >
            {/* Gate Silicon Cell Base */}
            <mesh castShadow>
              <boxGeometry args={[1.1, 0.03, 0.28]} />
              <meshStandardMaterial
                color={selectedPin === 'Block_Gate1' ? '#0284c7' : '#1e293b'}
                emissive={selectedPin === 'Block_Gate1' ? '#0284c7' : g1Out === 1 ? '#065f46' : '#1e293b'}
                emissiveIntensity={selectedPin === 'Block_Gate1' ? 0.8 : 0.3}
                roughness={0.3}
              />
            </mesh>

            {/* Input A Track */}
            <mesh position={[-0.35, 0.02, 0.07]}>
              <boxGeometry args={[0.3, 0.015, 0.03]} />
              <meshStandardMaterial
                color={inputs.g1A === 1 ? '#38bdf8' : '#334155'}
                emissive={inputs.g1A === 1 ? '#38bdf8' : '#000000'}
                emissiveIntensity={inputs.g1A === 1 ? 1.0 : 0}
              />
            </mesh>

            {/* Input B Track */}
            <mesh position={[-0.35, 0.02, -0.07]}>
              <boxGeometry args={[0.3, 0.015, 0.03]} />
              <meshStandardMaterial
                color={inputs.g1B === 1 ? '#38bdf8' : '#334155'}
                emissive={inputs.g1B === 1 ? '#38bdf8' : '#000000'}
                emissiveIntensity={inputs.g1B === 1 ? 1.0 : 0}
              />
            </mesh>

            {/* Central NAND Logic Symbol Plate */}
            <mesh position={[0, 0.025, 0]}>
              <cylinderGeometry args={[0.09, 0.09, 0.02, 16]} />
              <meshStandardMaterial
                color={g1Out === 1 ? '#10b981' : '#ef4444'}
                emissive={g1Out === 1 ? '#10b981' : '#b91c1c'}
                emissiveIntensity={0.9}
              />
            </mesh>

            {/* Output Y Track */}
            <mesh position={[0.35, 0.02, 0]}>
              <boxGeometry args={[0.3, 0.015, 0.04]} />
              <meshStandardMaterial
                color={g1Out === 1 ? '#10b981' : '#334155'}
                emissive={g1Out === 1 ? '#10b981' : '#000000'}
                emissiveIntensity={g1Out === 1 ? 1.2 : 0}
              />
            </mesh>
          </group>

          {/* GATE 2: NAND GATE #2 (Lower Right - Pins 2A, 2B -> 2Y) */}
          <group
            position={[0.7, 0.04, 0.2]}
            onClick={(e) => handleClick(e, 'Block_Gate2')}
            onPointerOver={(e) => handlePointerOver(e, 'Block_Gate2')}
            onPointerOut={handlePointerOut}
          >
            <mesh castShadow>
              <boxGeometry args={[1.1, 0.03, 0.28]} />
              <meshStandardMaterial
                color={selectedPin === 'Block_Gate2' ? '#0284c7' : '#1e293b'}
                emissive={selectedPin === 'Block_Gate2' ? '#0284c7' : g2Out === 1 ? '#065f46' : '#1e293b'}
                emissiveIntensity={selectedPin === 'Block_Gate2' ? 0.8 : 0.3}
                roughness={0.3}
              />
            </mesh>

            {/* Input 2A Track */}
            <mesh position={[-0.35, 0.02, 0.07]}>
              <boxGeometry args={[0.3, 0.015, 0.03]} />
              <meshStandardMaterial
                color={inputs.g2A === 1 ? '#38bdf8' : '#334155'}
                emissive={inputs.g2A === 1 ? '#38bdf8' : '#000000'}
                emissiveIntensity={inputs.g2A === 1 ? 1.0 : 0}
              />
            </mesh>

            {/* Input 2B Track */}
            <mesh position={[-0.35, 0.02, -0.07]}>
              <boxGeometry args={[0.3, 0.015, 0.03]} />
              <meshStandardMaterial
                color={inputs.g2B === 1 ? '#38bdf8' : '#334155'}
                emissive={inputs.g2B === 1 ? '#38bdf8' : '#000000'}
                emissiveIntensity={inputs.g2B === 1 ? 1.0 : 0}
              />
            </mesh>

            {/* Central NAND Symbol Plate */}
            <mesh position={[0, 0.025, 0]}>
              <cylinderGeometry args={[0.09, 0.09, 0.02, 16]} />
              <meshStandardMaterial
                color={g2Out === 1 ? '#10b981' : '#ef4444'}
                emissive={g2Out === 1 ? '#10b981' : '#b91c1c'}
                emissiveIntensity={0.9}
              />
            </mesh>

            {/* Output 2Y Track */}
            <mesh position={[0.35, 0.02, 0]}>
              <boxGeometry args={[0.3, 0.015, 0.04]} />
              <meshStandardMaterial
                color={g2Out === 1 ? '#10b981' : '#334155'}
                emissive={g2Out === 1 ? '#10b981' : '#000000'}
                emissiveIntensity={g2Out === 1 ? 1.2 : 0}
              />
            </mesh>
          </group>

          {/* GATE 3: NAND GATE #3 (Upper Right - Pins 3A, 3B -> 3Y) */}
          <group
            position={[0.7, 0.04, -0.2]}
            onClick={(e) => handleClick(e, 'Block_Gate3')}
            onPointerOver={(e) => handlePointerOver(e, 'Block_Gate3')}
            onPointerOut={handlePointerOut}
          >
            <mesh castShadow>
              <boxGeometry args={[1.1, 0.03, 0.28]} />
              <meshStandardMaterial
                color={selectedPin === 'Block_Gate3' ? '#0284c7' : '#1e293b'}
                emissive={selectedPin === 'Block_Gate3' ? '#0284c7' : g3Out === 1 ? '#065f46' : '#1e293b'}
                emissiveIntensity={selectedPin === 'Block_Gate3' ? 0.8 : 0.3}
                roughness={0.3}
              />
            </mesh>

            {/* Input 3A Track */}
            <mesh position={[0.35, 0.02, 0.07]}>
              <boxGeometry args={[0.3, 0.015, 0.03]} />
              <meshStandardMaterial
                color={inputs.g3A === 1 ? '#38bdf8' : '#334155'}
                emissive={inputs.g3A === 1 ? '#38bdf8' : '#000000'}
                emissiveIntensity={inputs.g3A === 1 ? 1.0 : 0}
              />
            </mesh>

            {/* Input 3B Track */}
            <mesh position={[0.35, 0.02, -0.07]}>
              <boxGeometry args={[0.3, 0.015, 0.03]} />
              <meshStandardMaterial
                color={inputs.g3B === 1 ? '#38bdf8' : '#334155'}
                emissive={inputs.g3B === 1 ? '#38bdf8' : '#000000'}
                emissiveIntensity={inputs.g3B === 1 ? 1.0 : 0}
              />
            </mesh>

            {/* Central NAND Symbol Plate */}
            <mesh position={[0, 0.025, 0]}>
              <cylinderGeometry args={[0.09, 0.09, 0.02, 16]} />
              <meshStandardMaterial
                color={g3Out === 1 ? '#10b981' : '#ef4444'}
                emissive={g3Out === 1 ? '#10b981' : '#b91c1c'}
                emissiveIntensity={0.9}
              />
            </mesh>

            {/* Output 3Y Track */}
            <mesh position={[-0.35, 0.02, 0]}>
              <boxGeometry args={[0.3, 0.015, 0.04]} />
              <meshStandardMaterial
                color={g3Out === 1 ? '#10b981' : '#334155'}
                emissive={g3Out === 1 ? '#10b981' : '#000000'}
                emissiveIntensity={g3Out === 1 ? 1.2 : 0}
              />
            </mesh>
          </group>

          {/* GATE 4: NAND GATE #4 (Upper Left - Pins 4A, 4B -> 4Y) */}
          <group
            position={[-0.7, 0.04, -0.2]}
            onClick={(e) => handleClick(e, 'Block_Gate4')}
            onPointerOver={(e) => handlePointerOver(e, 'Block_Gate4')}
            onPointerOut={handlePointerOut}
          >
            <mesh castShadow>
              <boxGeometry args={[1.1, 0.03, 0.28]} />
              <meshStandardMaterial
                color={selectedPin === 'Block_Gate4' ? '#0284c7' : '#1e293b'}
                emissive={selectedPin === 'Block_Gate4' ? '#0284c7' : g4Out === 1 ? '#065f46' : '#1e293b'}
                emissiveIntensity={selectedPin === 'Block_Gate4' ? 0.8 : 0.3}
                roughness={0.3}
              />
            </mesh>

            {/* Input 4A Track */}
            <mesh position={[0.35, 0.02, 0.07]}>
              <boxGeometry args={[0.3, 0.015, 0.03]} />
              <meshStandardMaterial
                color={inputs.g4A === 1 ? '#38bdf8' : '#334155'}
                emissive={inputs.g4A === 1 ? '#38bdf8' : '#000000'}
                emissiveIntensity={inputs.g4A === 1 ? 1.0 : 0}
              />
            </mesh>

            {/* Input 4B Track */}
            <mesh position={[0.35, 0.02, -0.07]}>
              <boxGeometry args={[0.3, 0.015, 0.03]} />
              <meshStandardMaterial
                color={inputs.g4B === 1 ? '#38bdf8' : '#334155'}
                emissive={inputs.g4B === 1 ? '#38bdf8' : '#000000'}
                emissiveIntensity={inputs.g4B === 1 ? 1.0 : 0}
              />
            </mesh>

            {/* Central NAND Symbol Plate */}
            <mesh position={[0, 0.025, 0]}>
              <cylinderGeometry args={[0.09, 0.09, 0.02, 16]} />
              <meshStandardMaterial
                color={g4Out === 1 ? '#10b981' : '#ef4444'}
                emissive={g4Out === 1 ? '#10b981' : '#b91c1c'}
                emissiveIntensity={0.9}
              />
            </mesh>

            {/* Output 4Y Track */}
            <mesh position={[-0.35, 0.02, 0]}>
              <boxGeometry args={[0.3, 0.015, 0.04]} />
              <meshStandardMaterial
                color={g4Out === 1 ? '#10b981' : '#334155'}
                emissive={g4Out === 1 ? '#10b981' : '#000000'}
                emissiveIntensity={g4Out === 1 ? 1.2 : 0}
              />
            </mesh>
          </group>

          {/* Central Ground and VCC Internal Power Bus Backbone */}
          <mesh position={[0, 0.035, 0]}>
            <boxGeometry args={[0.08, 0.02, 0.7]} />
            <meshStandardMaterial
              color="#fbbf24"
              metalness={0.95}
              roughness={0.1}
              emissive="#f59e0b"
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}
