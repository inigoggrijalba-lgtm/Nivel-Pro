import React from 'react';

interface BarLevelProps {
  value: number;
  orientation: 'horizontal' | 'vertical';
  label?: string;
}

const MAX_TILT = 90; // Degrees for full range

export const BarLevel: React.FC<BarLevelProps> = ({ value, orientation, label }) => {
  const isHorizontal = orientation === 'horizontal';
  const isLevel = Math.abs(value) < 1;

  // Calculate percentage offset from center (-50 to 50).
  // We clamp it slightly (e.g. +/- 45%) so the bubble doesn't completely overflow the track edges visually.
  const offset = Math.max(-45, Math.min(45, (value / MAX_TILT) * 50));

  return (
    <div className={`flex items-center justify-center ${isHorizontal ? 'flex-col w-full' : 'flex-row h-full'}`}>
      
      {/* Label */}
      {label && <span className="mb-2 font-bold text-xs text-level-text opacity-50 uppercase tracking-wider">{label}</span>}

      {/* Track */}
      <div 
        className={`
          relative bg-level-bg border-2 border-level-accent rounded-full shadow-[inset_0_2px_5px_rgba(0,0,0,0.3)]
          ${isHorizontal ? 'w-full h-12' : 'w-12 h-64'}
        `}
      >
        {/* Center Marker */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <div className={`bg-white/20 ${isHorizontal ? 'w-0.5 h-full' : 'h-0.5 w-full'}`}></div>
           {/* Threshold Markers for 45 degrees */}
           <div className={`absolute bg-white/5 ${isHorizontal ? 'w-1/2 h-full border-x border-white/10' : 'h-1/2 w-full border-y border-white/10'}`}></div>
        </div>

        {/* Bubble */}
        <div 
            className="absolute flex items-center justify-center transition-all duration-100 ease-out will-change-[top,left]"
            style={{
                // Start from center (50%) and add the offset.
                // transform handles centering the bubble on its own anchor point.
                left: isHorizontal ? `${50 + offset}%` : '50%',
                top: isHorizontal ? '50%' : `${50 + offset}%`,
                transform: 'translate(-50%, -50%)' 
            }}
        >
            <div 
                className={`
                    rounded-full shadow-md relative
                    ${isHorizontal ? 'w-10 h-8' : 'w-8 h-10'}
                    ${isLevel ? 'bg-level-success shadow-green-500/40' : 'bg-level-bubble shadow-yellow-500/20'}
                `}
            >
               {/* Reflection/Gloss */}
               <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 to-transparent"></div>
            </div>
        </div>
      </div>

       {/* Numeric Readout */}
       <div className={`font-mono text-xs text-level-text opacity-70 ${isHorizontal ? 'mt-2' : 'ml-2 w-10 text-center'}`}>
        {value.toFixed(1)}°
      </div>
    </div>
  );
};