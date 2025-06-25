
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
    <div className="fixed bottom-4 right-4 z-40 flex items-center space-x-2">
      <div className={`w-4 h-4 rounded-full ${lightColor} ${glowColor} shadow-lg ${animationClass}`}></div>
      <div className="bg-black/80 backdrop-blur-sm px-2 py-1 rounded-md border border-white/20">
        <div className="flex items-center space-x-1">
          {isSuccess ? (
            <Heart className="h-3 w-3 text-green-400" />
          ) : (
            <AlertTriangle className="h-3 w-3 text-red-400" />
          )}
          <span className={`text-xs font-bold ${isSuccess ? 'text-green-400' : 'text-red-400'}`}>
            {isSuccess ? 'SAVED!' : 'EMERGENCY'}
          </span>
          <span className="text-white text-xs">{patientStatus}%</span>
        </div>
      </div>
    </div>
  );
};

export default EmergencyLight;
