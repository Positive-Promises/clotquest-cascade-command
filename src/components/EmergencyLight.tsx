
import React from 'react';
import { AlertTriangle, Heart } from 'lucide-react';

interface EmergencyLightProps {
  isEmergency: boolean;
  isSuccess: boolean;
  patientStatus: number;
}

const EmergencyLight: React.FC<EmergencyLightProps> = ({ 
  isEmergency, 
  isSuccess, 
  patientStatus 
}) => {
  if (!isEmergency) return null;

  const lightColor = isSuccess ? 'bg-green-500' : 'bg-red-500';
  const glowColor = isSuccess ? 'shadow-green-500/50' : 'shadow-red-500/50';
  const animationClass = isSuccess ? 'animate-pulse' : 'animate-ping';

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center space-x-2">
      <div className={`w-6 h-6 rounded-full ${lightColor} ${glowColor} shadow-2xl ${animationClass}`}></div>
      <div className="bg-black/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/20">
        <div className="flex items-center space-x-2">
          {isSuccess ? (
            <Heart className="h-4 w-4 text-green-400" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-red-400" />
          )}
          <span className={`text-sm font-bold ${isSuccess ? 'text-green-400' : 'text-red-400'}`}>
            {isSuccess ? 'PATIENT SAVED!' : 'EMERGENCY'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EmergencyLight;
