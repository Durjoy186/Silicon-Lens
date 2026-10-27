import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useLensStore } from '../../store/useLensStore';
import arduinoData from '../../data/arduinoUnoData.json';
import intelData from '../../data/intel8086Data.json';
import roboticData from '../../data/roboticArmData.json';
import ic74ls00Data from '../../data/ic74ls00Data.json';

/**
 * Camera Handler that smoothly lerps the camera towards selected pins
 * or tour steps, without interfering with user orbit/pan.
 */
export function CameraHandler() {
  const { camera } = useThree();
  const { activeDevice, selectedPin, activeTour, tourStepIndex } = useLensStore();

  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const targetCamPos = useRef(new THREE.Vector3(0, 7, 7));
  const isTransitioning = useRef(false);

  // When selectedPin, device, or tour changes, compute target camera position
  useEffect(() => {
    let dataset = arduinoData.items;
    if (activeDevice === 'intel_8086') dataset = intelData.items;
    if (activeDevice === 'robotic_arm') dataset = roboticData.items;
    if (activeDevice === 'ic_74ls00') dataset = ic74ls00Data.items;

    // Check if tour step overrides target
    if (activeTour && activeTour.steps[tourStepIndex]) {
      const step = activeTour.steps[tourStepIndex];
      targetCamPos.current.set(...step.camera_pos);
      targetLookAt.current.set(...step.camera_look);
      isTransitioning.current = true;
      return;
    }

    // Otherwise check selected pin in dataset
    const found = dataset.find((item) => item.mesh_name === selectedPin);
    if (found && found.camera_target) {
      const [tx, ty, tz] = found.camera_target;
      targetLookAt.current.set(tx, ty, tz);
      // Position camera slightly above and offset
      targetCamPos.current.set(tx * 0.7, ty + 4.5, tz + 4.5);
      isTransitioning.current = true;
    } else {
      // Default view for device
      if (activeDevice === 'arduino_uno') {
        targetCamPos.current.set(0, 6.5, 6.0);
        targetLookAt.current.set(0, 0, 0);
      } else if (activeDevice === 'intel_8086') {
        targetCamPos.current.set(0, 5.5, 5.0);
        targetLookAt.current.set(0, 0, 0);
      } else if (activeDevice === 'robotic_arm') {
        targetCamPos.current.set(0, 3.5, 5.5);
        targetLookAt.current.set(0, 0.8, 0);
      } else if (activeDevice === 'ic_74ls00') {
        targetCamPos.current.set(0, 4.5, 4.0);
        targetLookAt.current.set(0, 0.1, 0);
      }
      isTransitioning.current = true;
    }
  }, [activeDevice, selectedPin, activeTour, tourStepIndex]);

  useFrame(() => {
    if (isTransitioning.current) {
      camera.position.lerp(targetCamPos.current, 0.05);
      currentLookAt.current.lerp(targetLookAt.current, 0.05);
      camera.lookAt(currentLookAt.current);

      if (camera.position.distanceTo(targetCamPos.current) < 0.05) {
        isTransitioning.current = false;
      }
    }
  });

  return null;
}
