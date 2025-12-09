import { useState, useEffect, useCallback } from 'react';

export interface OrientationData {
  beta: number; // Front-to-back tilt (-180 to 180) -> Y Axis
  gamma: number; // Left-to-right tilt (-90 to 90) -> X Axis
}

export const useOrientation = () => {
  const [orientation, setOrientation] = useState<OrientationData>({ beta: 0, gamma: 0 });
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const [needsPermission, setNeedsPermission] = useState<boolean>(false);

  // Check if we need to ask for permission (iOS 13+)
  useEffect(() => {
    // @ts-ignore - DeviceOrientationEvent is not fully typed in all TS envs for iOS specific methods
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      setNeedsPermission(true);
    } else {
      setPermissionGranted(true);
    }
  }, []);

  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    // Clamp values to avoid jumpiness at extremes, though raw data is usually fine
    // Beta is -180 to 180 (x-axis rotation / front-back tilt)
    // Gamma is -90 to 90 (y-axis rotation / left-right tilt)
    
    // We treat 'flat on table' as the neutral point.
    // Default browser behavior:
    // Flat: beta ~0, gamma ~0
    
    let { beta, gamma } = event;

    if (beta === null) beta = 0;
    if (gamma === null) gamma = 0;

    // Optional: Simple low-pass filter could be added here if too jittery, 
    // but CSS transition handles smoothing visually.
    
    setOrientation({ beta, gamma });
  }, []);

  const requestAccess = async () => {
    // @ts-ignore
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        // @ts-ignore
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === 'granted') {
          setPermissionGranted(true);
        } else {
          alert('Permiso denegado. La aplicación no puede funcionar sin acceso a los sensores.');
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      setPermissionGranted(true);
    }
  };

  useEffect(() => {
    if (permissionGranted) {
      window.addEventListener('deviceorientation', handleOrientation);
    }
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [permissionGranted, handleOrientation]);

  return { orientation, permissionGranted, needsPermission, requestAccess };
};