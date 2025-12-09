import React from 'react';
import { useOrientation } from './hooks/useOrientation';
import { BullseyeLevel } from './components/BullseyeLevel';
import { BarLevel } from './components/BarLevel';

const App: React.FC = () => {
  const { orientation, permissionGranted, needsPermission, requestAccess } = useOrientation();

  // On mobile devices in portrait mode:
  // Beta corresponds to the Y-axis (Top/Bottom tilt)
  // Gamma corresponds to the X-axis (Left/Right tilt)
  const { beta, gamma } = orientation;

  if (!permissionGranted && needsPermission) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl max-w-sm w-full border border-slate-700">
          <h1 className="text-3xl font-bold text-white mb-4">Nivel Pro</h1>
          <p className="text-slate-400 mb-8">
            Para utilizar el nivel, necesitamos acceso a los giroscopios de tu dispositivo.
          </p>
          <button
            onClick={requestAccess}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-6 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-500/20"
          >
            Iniciar Nivel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="py-4 px-6 flex justify-between items-center z-10">
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
          Nivel Pro
        </h1>
        <div className="text-xs font-mono text-slate-500">v1.4</div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 gap-8 max-w-2xl mx-auto w-full">
        
        {/* Top Section: X-Axis Bar */}
        <div className="w-full">
          <BarLevel value={gamma} orientation="horizontal" label="Eje X (Horizontal)" />
        </div>

        {/* Middle Section: Split Y-Axis and Bullseye */}
        {/* Using a grid with fixed first column to prevent layout shifts when numbers change */}
        <div className="w-full grid grid-cols-[80px_1fr] gap-4 h-full min-h-[300px] flex-1">
          
          {/* Left: Y-Axis Bar (Fixed width container via grid) */}
          <div className="flex flex-col items-center justify-center h-full">
             <BarLevel value={beta} orientation="vertical" label="Eje Y" />
          </div>

          {/* Center: Bullseye Level */}
          <div className="flex flex-col items-center justify-center relative">
            <BullseyeLevel x={gamma} y={beta} />
          </div>

        </div>

        {/* Instructions / Footer */}
        <div className="text-center text-slate-500 text-xs max-w-xs opacity-50">
          Pon el dispositivo sobre una superficie plana. La burbuja se pondrá <span className="text-green-500 font-bold">verde</span> cuando esté nivelado (0°).
        </div>

      </main>
    </div>
  );
};

export default App;