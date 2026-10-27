import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { useLensStore } from '../../store/useLensStore';
import { ArduinoUnoModel } from './ArduinoUnoModel';
import { Intel8086Model } from './Intel8086Model';
import { RoboticArmModel } from './RoboticArmModel';
import { IC74LS00Model } from './IC74LS00Model';
import { CameraHandler } from './CameraHandler';

/**
 * Main 3D Canvas Scene Container with studio lighting, shadow maps,
 * OrbitControls, and dynamic model switching.
 */
export function SceneContainer() {
  const { activeDevice, setHoveredPin } = useLensStore();

  return (
    <div className="w-full h-full relative workbench-grid-bg touch-none">
      <Canvas
        shadows
        onPointerMissed={() => setHoveredPin(null)}
        camera={{ position: [0, 6.5, 6.0], fov: 45, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
        style={{ width: '100%', height: '100%', cursor: 'grab', touchAction: 'none' }}
      >
        <Suspense fallback={null}>
          {/* Smooth Camera Lerp Controller */}
          <CameraHandler />

          {/* Studio Lighting Setup for High Metallic Sheen & Crisp Shadows */}
          <ambientLight intensity={0.8} />

          {/* Key Sun/Studio Overhead Light */}
          <directionalLight
            position={[5, 12, 6]}
            intensity={1.5}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-left={-6}
            shadow-camera-right={6}
            shadow-camera-top={6}
            shadow-camera-bottom={-6}
            shadow-bias={-0.0001}
          />

          {/* Secondary Fill Light */}
          <directionalLight position={[-6, 6, -4]} intensity={0.6} color="#e0f2fe" />

          {/* Soft Ground Bounce Light */}
          <hemisphereLight skyColor="#ffffff" groundColor="#cbd5e1" intensity={0.4} />

          {/* Point Light for Specular Metallic Pin Highlights */}
          <pointLight position={[0, 4, 2]} intensity={0.8} color="#f8fafc" />

          {/* RENDER ACTIVE HARDWARE MODEL */}
          {activeDevice === 'arduino_uno' && <ArduinoUnoModel />}
          {activeDevice === 'intel_8086' && <Intel8086Model />}
          {activeDevice === 'robotic_arm' && <RoboticArmModel />}
          {activeDevice === 'ic_74ls00' && <IC74LS00Model />}

          {/* Realistic Contact Shadow on Workbench Surface */}
          <ContactShadows
            position={[0, activeDevice === 'robotic_arm' ? -1.0 : -0.1, 0]}
            opacity={0.5}
            scale={12}
            blur={1.8}
            far={4}
          />

          {/* User Orbit, Pan, and Zoom Controls */}
          <OrbitControls
            makeDefault
            enableDamping
            dampingFactor={0.06}
            minDistance={2.5}
            maxDistance={20.0}
            maxPolarAngle={Math.PI / 2 - 0.05} // Prevent camera going below workbench plane
            onStart={() => setHoveredPin(null)}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
