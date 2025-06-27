
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, LogOut } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

interface GameHeaderProps {
  score: number;
  timeElapsed: number;
  placedFactorsCount: number;
  totalFactorsCount: number;
  emergencyMode: boolean;
  patientStatus: number;
  onExitGame: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  score,
  timeElapsed,
  placedFactorsCount,
  totalFactorsCount,
  emergencyMode,
  patientStatus,
  onExitGame
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto mb-6 px-4 relative z-10 animate-in slide-in-from-top-4 duration-1000">
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl dark:bg-white/5 light:bg-black/5 light:border-black/10 transform hover:scale-[1.02] transition-transform duration-300">
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-4">
            {/* Title Section */}
            <div className="text-center">
              <h1 className="text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                Level 1: Coagulation Cascade Commander
              </h1>
              <p className="text-blue-200 dark:text-blue-200 light:text-blue-800 text-base lg:text-lg">Master the intricate dance of hemostasis through interactive learning</p>
              {emergencyMode && (
                <div className="mt-2 flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 mr-2 text-red-400 animate-bounce" />
                  <span className="text-red-400 font-bold text-sm">Emergency Mode Active - Patient Status: {patientStatus}%</span>
                </div>
              )}
            </div>

            {/* Exit Button - Centered */}
            <Button
              onClick={onExitGame}
              className="bg-red-600/80 hover:bg-red-700 backdrop-blur-sm border border-red-400/30 text-white font-bold px-6 py-2 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <LogOut className="h-4 w-4 mr-2" />
              EXIT GAME
            </Button>

            {/* Stats Section */}
            <div className="flex items-center space-x-4 lg:space-x-8">
              <ThemeToggle />
              <div className="text-center transform hover:scale-110 transition-transform">
                <div className="text-2xl lg:text-3xl font-bold text-yellow-400 animate-pulse">{score}</div>
                <div className="text-xs lg:text-sm text-gray-300 dark:text-gray-300 light:text-gray-700">Score</div>
              </div>
              <div className="text-center transform hover:scale-110 transition-transform">
                <div className="text-2xl lg:text-3xl font-bold text-green-400">{formatTime(timeElapsed)}</div>
                <div className="text-xs lg:text-sm text-gray-300 dark:text-gray-300 light:text-gray-700">Time</div>
              </div>
              <div className="text-center transform hover:scale-110 transition-transform">
                <div className="text-2xl lg:text-3xl font-bold text-blue-400">{placedFactorsCount}/{totalFactorsCount}</div>
                <div className="text-xs lg:text-sm text-gray-300 dark:text-gray-300 light:text-gray-700">Placed</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameHeader;
