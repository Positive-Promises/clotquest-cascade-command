
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, RotateCcw, ArrowRight, Sparkles, Heart } from 'lucide-react';

interface CompletionCongratulationsProps {
  isOpen: boolean;
  onRestart: () => void;
  onNextLevel: () => void;
  score: number;
  timeElapsed: number;
}

const CompletionCongratulations: React.FC<CompletionCongratulationsProps> = ({
  isOpen,
  onRestart,
  onNextLevel,
  score,
  timeElapsed
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-500">
      <Card className="max-w-2xl w-full mx-4 glassmorphic-card bg-gradient-to-br from-emerald-900/95 via-blue-900/95 to-purple-900/95 border-2 border-emerald-400/50 shadow-2xl animate-in scale-in duration-700">
        <CardContent className="p-8 text-center relative overflow-hidden">
          {/* Celebration Background Effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-bounce opacity-60"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random() * 2}s`
                }}
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </div>
            ))}
          </div>

          <div className="relative z-10">
            {/* Trophy Animation */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <Trophy className="w-20 h-20 text-yellow-400 animate-pulse" />
                <div className="absolute inset-0 w-20 h-20 bg-yellow-400/30 rounded-full animate-ping"></div>
              </div>
            </div>

            {/* Main Message */}
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-in slide-in-from-top-4 duration-1000">
              🩸 Congratulations! 🩸
            </h2>
            
            <div className="glassmorphic-card bg-emerald-500/20 p-6 rounded-xl border border-emerald-400/30 mb-6 animate-in slide-in-from-bottom-4 duration-1000 delay-300">
              <Heart className="w-8 h-8 text-red-400 mx-auto mb-3 animate-pulse" />
              <p className="text-xl text-white font-semibold leading-relaxed">
                You have saved the patient from bleeding to death!
              </p>
              <p className="text-lg text-emerald-200 mt-2">
                Well done! 🎉
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="glassmorphic-card bg-blue-500/20 p-4 rounded-lg border border-blue-400/30">
                <div className="text-3xl font-bold text-blue-300">{score}</div>
                <div className="text-sm text-blue-200">Final Score</div>
              </div>
              <div className="glassmorphic-card bg-green-500/20 p-4 rounded-lg border border-green-400/30">
                <div className="text-3xl font-bold text-green-300">{formatTime(timeElapsed)}</div>
                <div className="text-sm text-green-200">Completion Time</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={onRestart}
                className="glassmorphic-card bg-blue-600/80 hover:bg-blue-700 backdrop-blur-sm border border-blue-400/30 transform hover:scale-105 transition-all duration-200 shadow-xl px-8 py-3 text-lg font-semibold"
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                RESTART LEVEL
              </Button>
              
              <div className="text-white font-bold text-xl">|</div>
              
              <Button
                onClick={onNextLevel}
                className="glassmorphic-card bg-emerald-600/80 hover:bg-emerald-700 backdrop-blur-sm border border-emerald-400/30 transform hover:scale-105 transition-all duration-200 shadow-xl px-8 py-3 text-lg font-semibold"
              >
                <ArrowRight className="h-5 w-5 mr-2" />
                GO TO LEVEL 2
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompletionCongratulations;
