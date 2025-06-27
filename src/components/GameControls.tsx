
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Target, BookOpen, Play, AlertTriangle, RotateCcw } from 'lucide-react';

interface GameControlsProps {
  gameStarted: boolean;
  onShowTutorial: () => void;
  onStartGame: () => void;
  onStartEmergencyMode: () => void;
  onResetLevel: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  gameStarted,
  onShowTutorial,
  onStartGame,
  onStartEmergencyMode,
  onResetLevel
}) => {
  return (
    <Card className="bg-white/5 backdrop-blur-xl border border-white/10 h-fit shadow-xl dark:bg-white/5 light:bg-black/5 light:border-black/10 transform hover:scale-[1.02] transition-all duration-300">
      <CardContent className="p-6">
        <h3 className="text-xl lg:text-2xl font-bold text-white dark:text-white light:text-black mb-4 flex items-center">
          <Target className="h-5 w-5 lg:h-6 lg:w-6 mr-2 text-yellow-400 animate-spin" />
          Game Controls
        </h3>

        <div className="space-y-3">
          {!gameStarted && (
            <>
              <Button 
                onClick={onShowTutorial} 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Start Tutorial
              </Button>
              <Button 
                onClick={onStartGame} 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Normal Mode
              </Button>
              <Button 
                onClick={onStartEmergencyMode} 
                className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 shadow-lg transform hover:scale-105 transition-all duration-200 animate-pulse"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Emergency Mode
              </Button>
            </>
          )}

          {gameStarted && (
            <Button 
              onClick={onResetLevel} 
              variant="outline" 
              className="w-full border-white/20 text-white hover:bg-white/10 backdrop-blur-sm transform hover:scale-105 transition-all duration-200"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Challenge
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GameControls;
