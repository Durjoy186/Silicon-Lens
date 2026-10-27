import React from 'react';
import * as THREE from 'three';
import { useLensStore } from '../../store/useLensStore';
import { use3DInteraction } from '../../utils/use3DInteraction';

/**
 * Procedural SG90 Micro-Servo Component with Universal X-Ray Cutaway.
 * When X-Ray is engaged, reveals internal DC motor, reduction gear train, and potentiometer.
 */
function SG90ServoMesh({ label = 'SG90 9g', isSelected = false, isHovered = false, xrayValue = 0 }) {
  const caseOpacity = 1.0 - xrayValue * 0.75;

  return (
    <group>
      {/* Translucent Blue Casing */}
      <mesh castShadow>
        <boxGeometry args={[0.45, 0.7, 0.85]} />
        <meshStandardMaterial
          color={isSelected ? '#38bdf8' : isHovered ? '#7dd3fc' : '#0284c7'}
          roughness={0.25}
          metalness={0.1}
          transparent={xrayValue > 0.05}
          opacity={caseOpacity}
          emissive={isSelected ? '#0284c7' : isHovered ? '#38bdf8' : '#000000'}
          emissiveIntensity={isSelected ? 0.6 : isHovered ? 0.35 : 0}
        />
      </mesh>

      {/* Top Output Gear Spline */}
      <mesh position={[0, 0.4, 0.22]}>
        <cylinderGeometry args={[0.14, 0.14, 0.16, 16]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} />
      </mesh>

      {/* White Label Plate (Hides when X-Ray is full) */}
      {xrayValue < 0.7 && (
        <mesh position={[0.23, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.5, 0.3]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={caseOpacity} />
        </mesh>
      )}

      {/* X-RAY INTERNAL COMPONENTS (DC Motor, Reduction Gears, Potentiometer) */}
      {xrayValue > 0.05 && (
        <group>
          {/* DC Coreless Motor Cylinder (Silver Metal) */}
          <mesh position={[0, 0.05, -0.18]}>
            <cylinderGeometry args={[0.13, 0.13, 0.48, 16]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.15} />
          </mesh>

          {/* Copper Motor Coil Windings */}
          <mesh position={[0, 0.05, -0.18]}>
            <cylinderGeometry args={[0.11, 0.11, 0.25, 16]} />
            <meshStandardMaterial color="#d97706" metalness={0.8} />
          </mesh>

          {/* Brass Multi-Stage Reduction Gears */}
          <mesh position={[0, 0.26, 0.05]}>
            <cylinderGeometry args={[0.12, 0.12, 0.08, 16]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.32, 0.18]}>
            <cylinderGeometry args={[0.15, 0.15, 0.08, 16]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Feedback Rotary Potentiometer (Green PCB / Metal) */}
          <mesh position={[0, -0.22, 0.18]}>
            <cylinderGeometry args={[0.12, 0.12, 0.12, 16]} />
            <meshStandardMaterial color="#10b981" roughness={0.5} />
          </mesh>
        </group>
      )}

      {/* 3-Wire Ribbon (Brown GND, Red 5V, Orange PWM Signal) */}
      <group position={[0, -0.32, -0.4]}>
        <mesh position={[-0.05, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.4, 8]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.4, 8]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
        <mesh position={[0.05, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.4, 8]} />
          <meshStandardMaterial color="#f97316" />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Photorealistic 3D Model of 4-DOF SG90 Servo Robotic Arm with Universal X-Ray.
 */
export function RoboticArmModel() {
  const {
    selectedPin,
    hoveredPin,
    servoAngles,
    xrayValue
  } = useLensStore();

  const {
    handlePointerOver,
    handlePointerOut,
    handleClick
  } = use3DInteraction();

  const baseRad = ((servoAngles.base - 90) * Math.PI) / 180;
  const shoulderRad = -((servoAngles.shoulder - 45) * Math.PI) / 180;
  const elbowRad = ((servoAngles.elbow - 60) * Math.PI) / 180;
  const gripperWidth = (servoAngles.gripper / 180) * 0.35;

  return (
    <group position={[0, -1.0, 0]}>
      {/* 1. MOUNTING BASE */}
      <mesh receiveShadow position={[0, 0.08, 0]}>
        <cylinderGeometry args={[1.8, 1.9, 0.16, 32]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.2} />
      </mesh>

      {/* 4 Corner Aluminum Stand-off Spacers */}
      {[
        [-1.2, -1.2],
        [1.2, -1.2],
        [-1.2, 1.2],
        [1.2, 1.2]
      ].map(([px, pz], idx) => (
        <mesh key={idx} position={[px, 0.22, pz]}>
          <cylinderGeometry args={[0.08, 0.08, 0.24, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.15} />
        </mesh>
      ))}

      {/* 2. BASE ROTATION (YAW AXIS) */}
      <group position={[0, 0.24, 0]} rotation={[0, baseRad, 0]}>
        {/* Turntable Disc */}
        <mesh position={[0, 0.08, 0]} castShadow>
          <cylinderGeometry args={[1.5, 1.5, 0.12, 32]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} />
        </mesh>

        {/* Base Yaw Servo */}
        <group
          position={[0, 0.45, 0]}
          onClick={(e) => handleClick(e, 'Servo_Base_Yaw')}
          onPointerOver={(e) => handlePointerOver(e, 'Servo_Base_Yaw')}
          onPointerOut={handlePointerOut}
        >
          <SG90ServoMesh
            isSelected={selectedPin === 'Servo_Base_Yaw'}
            isHovered={hoveredPin === 'Servo_Base_Yaw'}
            xrayValue={xrayValue}
          />
        </group>

        {/* Dual Vertical Acrylic Shoulder Brackets */}
        {[-0.5, 0.5].map((bx, bidx) => (
          <mesh key={bidx} position={[bx, 0.95, 0]} castShadow>
            <boxGeometry args={[0.1, 1.0, 0.7]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} />
          </mesh>
        ))}

        {/* 3. SHOULDER PITCH JOINT */}
        <group position={[0, 1.35, 0]} rotation={[shoulderRad, 0, 0]}>
          {/* Shoulder Servo */}
          <group
            position={[0.55, 0, 0]}
            rotation={[0, 0, Math.PI / 2]}
            onClick={(e) => handleClick(e, 'Servo_Shoulder_Pitch')}
            onPointerOver={(e) => handlePointerOver(e, 'Servo_Shoulder_Pitch')}
            onPointerOut={handlePointerOut}
          >
            <SG90ServoMesh
              isSelected={selectedPin === 'Servo_Shoulder_Pitch'}
              isHovered={hoveredPin === 'Servo_Shoulder_Pitch'}
              xrayValue={xrayValue}
            />
          </group>

          {/* Dual Bicep Linkage Beams */}
          {[-0.35, 0.35].map((lx, lidx) => (
            <mesh key={lidx} position={[lx, 0.75, 0]} castShadow>
              <boxGeometry args={[0.08, 1.6, 0.35]} />
              <meshStandardMaterial color="#1e293b" roughness={0.3} />
            </mesh>
          ))}

          {/* 4. ELBOW PITCH JOINT */}
          <group position={[0, 1.55, 0]} rotation={[elbowRad, 0, 0]}>
            {/* Elbow Servo */}
            <group
              position={[-0.55, 0, 0]}
              rotation={[0, 0, -Math.PI / 2]}
              onClick={(e) => handleClick(e, 'Servo_Elbow_Pitch')}
              onPointerOver={(e) => handlePointerOver(e, 'Servo_Elbow_Pitch')}
              onPointerOut={handlePointerOut}
            >
              <SG90ServoMesh
                isSelected={selectedPin === 'Servo_Elbow_Pitch'}
                isHovered={hoveredPin === 'Servo_Elbow_Pitch'}
                xrayValue={xrayValue}
              />
            </group>

            {/* Forearm Linkage Beam */}
            <mesh position={[0, 0.65, 0]} castShadow>
              <boxGeometry args={[0.25, 1.3, 0.28]} />
              <meshStandardMaterial color="#0f172a" roughness={0.3} />
            </mesh>

            {/* 5. GRIPPER CLAW END-EFFECTOR */}
            <group position={[0, 1.3, 0]}>
              {/* Gripper Actuator Servo */}
              <group
                position={[0, 0.2, 0]}
                onClick={(e) => handleClick(e, 'Servo_Gripper_Claw')}
                onPointerOver={(e) => handlePointerOver(e, 'Servo_Gripper_Claw')}
                onPointerOut={handlePointerOut}
              >
                <SG90ServoMesh
                  isSelected={selectedPin === 'Servo_Gripper_Claw'}
                  isHovered={hoveredPin === 'Servo_Gripper_Claw'}
                  xrayValue={xrayValue}
                />
              </group>

              {/* Claw Mounting Crossbar */}
              <mesh position={[0, 0.5, 0]}>
                <boxGeometry args={[0.9, 0.1, 0.2]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
              </mesh>

              {/* Left Claw Jaw */}
              <mesh position={[-0.25 - gripperWidth, 0.8, 0]} rotation={[0, 0, -0.2]}>
                <boxGeometry args={[0.08, 0.65, 0.2]} />
                <meshStandardMaterial color="#0f172a" roughness={0.3} />
              </mesh>
              <mesh position={[-0.15 - gripperWidth, 1.1, 0]}>
                <boxGeometry args={[0.2, 0.08, 0.2]} />
                <meshStandardMaterial color="#ef4444" />
              </mesh>

              {/* Right Claw Jaw */}
              <mesh position={[0.25 + gripperWidth, 0.8, 0]} rotation={[0, 0, 0.2]}>
                <boxGeometry args={[0.08, 0.65, 0.2]} />
                <meshStandardMaterial color="#0f172a" roughness={0.3} />
              </mesh>
              <mesh position={[0.15 + gripperWidth, 1.1, 0]}>
                <boxGeometry args={[0.2, 0.08, 0.2]} />
                <meshStandardMaterial color="#ef4444" />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}
