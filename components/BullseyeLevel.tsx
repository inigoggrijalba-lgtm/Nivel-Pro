import React from 'react';

interface BullseyeLevelProps {
  x: number; // Represents Gamma (-90 to 90)
  y: number; // Represents Beta (-180 to 180)
}

const MAX_TILT = 90; // Sensitivity: Edge is now 90 degrees
const MAX_RADIUS = 44; // Max percentage from center (keeps bubble inside circular border)

export const BullseyeLevel: React.FC<BullseyeLevelProps> = ({ x, y }) => {
  // Determine if perfectly level (within 1 degree)
  const isLevel = Math.abs(x) < 1 && Math.abs(y) < 1;

  // Normalize tilt values (-1 to 1 range relative to MAX_TILT)
  let normX = x / MAX_TILT;
  let normY = y / MAX_TILT;

  // Calculate distance from center
  const distance = Math.sqrt(normX * normX + normY * normY);

  // Radial Clamp: If distance > 1, scale vector down to length 1
  // This ensures the bubble moves in a circle, not a square box, preventing corner overflow.
  if (distance > 1) {
    normX /= distance;
    normY /= distance;
  }

  // Calculate final percentage offsets
  const xOffset = normX * MAX_RADIUS;
  const yOffset = normY * MAX_RADIUS;

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Outer Ring (90 degrees) */}
      <div className="relative w-64 h-64 rounded-full border-4 border-level-accent bg-level-bg shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] overflow-hidden">
        
        {/* Inner Target Rings (Centered via absolute inset) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Middle Ring: Represents 45 degrees (halfway to 90) */}
            <div className="w-32 h-32 rounded-full border border-level-accent/50"></div>
            
            {/* Center Deadzone/Target */}
            <div className={`absolute w-12 h-12 rounded-full border-2 transition-colors ${isLevel ? 'border-green-500/50 bg-green-500/10' : 'border-level-accent/80'}`}></div>
            
            {/* Crosshairs */}
            <div className="absolute w-full h-0.5 bg-level-accent/30"></div>
            <div className="absolute h-full w-0.5 bg-level-accent/30"></div>
        </div>

        {/* The Bubble */}
        <div
          className={`absolute w-10 h-10 rounded-full shadow-lg transition-all duration-100 ease-out will-change-[top,left] ${
            isLevel ? 'bg-level-success shadow-green-500/50' : 'bg-level-bubble shadow-yellow-500/20'
          }`}
          style={{
            // Use top/left for positioning relative to the container size
            left: `${50 + xOffset}%`,
            top: `${50 + yOffset}%`,
            transform: 'translate(-50%, -50%)',
            // Visual gloss effect
            backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(255,255,255,0) 20%)'
          }}
        ></div>
      </div>
      
      {/* Readout */}
      <div className="mt-4 font-mono text-sm text-level-text opacity-70">
        X: {x.toFixed(1)}° &nbsp; Y: {y.toFixed(1)}°
      </div>
    </div>
  );
};