import { useRef } from 'react';
import { useLensStore } from '../store/useLensStore';

/**
 * Custom hook to unify 3D pointer and touch interactions across all models.
 * - Desktop: Smooth hover shows floating tooltip, click selects component.
 * - Mobile: One-finger drag orbits 360°, two-finger pinch zooms,
 *           and DOUBLE-TAP on any pin/chip reveals the floating details!
 */
export function use3DInteraction() {
  const { setSelectedPin, setHoveredPin, setTooltipCoords } = useLensStore();
  const lastTapRef = useRef({ time: 0, meshName: null });

  // Detect mobile or touch capability
  const isTouchDevice = () => {
    return (
      typeof window !== 'undefined' &&
      ('ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.innerWidth < 768)
    );
  };

  // Pointer Over (Desktop Hover)
  const handlePointerOver = (e, meshName) => {
    e.stopPropagation();
    // On mobile touch devices, suppress hover to prevent tooltip flickering during camera orbit
    if (e.pointerType === 'touch' || isTouchDevice()) return;
    setHoveredPin(meshName);
  };

  // Pointer Out (Desktop Mouse Leave)
  const handlePointerOut = (e) => {
    e.stopPropagation();
    if (e.pointerType === 'touch' || isTouchDevice()) return;
    setHoveredPin(null);
  };

  // Click & Mobile Double-Tap Handler
  const handleClick = (e, meshName) => {
    e.stopPropagation();
    const touch = e.pointerType === 'touch' || isTouchDevice();

    // Calculate tap screen coordinates
    const clientX =
      e.clientX ??
      e.nativeEvent?.clientX ??
      (e.nativeEvent?.touches && e.nativeEvent.touches[0]?.clientX) ??
      (typeof window !== 'undefined' ? window.innerWidth / 2 : 200);

    const clientY =
      e.clientY ??
      e.nativeEvent?.clientY ??
      (e.nativeEvent?.touches && e.nativeEvent.touches[0]?.clientY) ??
      (typeof window !== 'undefined' ? window.innerHeight / 2 : 300);

    const now = Date.now();
    const last = lastTapRef.current;
    const isDoubleTap =
      last.meshName === meshName && now - last.time < 550;

    if (isDoubleTap) {
      // DOUBLE-TAP CONFIRMED!
      setSelectedPin(meshName);
      setHoveredPin(meshName);
      setTooltipCoords({ x: clientX, y: clientY });
      lastTapRef.current = { time: 0, meshName: null };
    } else {
      if (!touch) {
        // Desktop: Single click selects pin for the Spec Drawer
        setSelectedPin(meshName);
      }
      // First tap: Record tap time and mesh target
      lastTapRef.current = { time: now, meshName };
    }
  };

  // Direct Double-Click / Double-Tap Fallback
  const handleDoubleClick = (e, meshName) => {
    e.stopPropagation();
    const clientX =
      e.clientX ??
      e.nativeEvent?.clientX ??
      (typeof window !== 'undefined' ? window.innerWidth / 2 : 200);

    const clientY =
      e.clientY ??
      e.nativeEvent?.clientY ??
      (typeof window !== 'undefined' ? window.innerHeight / 2 : 300);

    setSelectedPin(meshName);
    setHoveredPin(meshName);
    setTooltipCoords({ x: clientX, y: clientY });
  };

  return {
    handlePointerOver,
    handlePointerOut,
    handleClick,
    handleDoubleClick,
    isTouchDevice
  };
}
