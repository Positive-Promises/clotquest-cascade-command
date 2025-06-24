
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Volume2, VolumeX, Music, Settings } from 'lucide-react';

interface AudioSystemProps {
  gameState: 'menu' | 'playing' | 'emergency' | 'success' | 'failure';
  level: number;
}

const AudioSystem: React.FC<AudioSystemProps> = ({ gameState, level }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [musicVolume, setMusicVolume] = useState(50);
  const [sfxVolume, setSfxVolume] = useState(70);
  const [showControls, setShowControls] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentTrackRef = useRef<AudioBufferSourceNode | null>(null);

  // Initialize Web Audio API
  useEffect(() => {
    const initAudio = async () => {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        console.log('Web Audio API not supported');
      }
    };
    
    initAudio();
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Create synthetic audio for demonstration (since we can't load external files)
  const playTone = (frequency: number, duration: number, volume: number = 0.1) => {
    if (!audioContextRef.current || isMuted) return;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume * (musicVolume / 100), audioContextRef.current.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + duration);
    
    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + duration);
  };

  // Sound effects for different game events
  const playSuccessSound = () => {
    playTone(523.25, 0.2, 0.3); // C5
    setTimeout(() => playTone(659.25, 0.2, 0.3), 100); // E5
    setTimeout(() => playTone(783.99, 0.4, 0.3), 200); // G5
  };

  const playErrorSound = () => {
    playTone(220, 0.5, 0.2); // A3
  };

  const playEmergencyAlert = () => {
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        playTone(880, 0.1, 0.4); // A5
        setTimeout(() => playTone(440, 0.1, 0.4), 150); // A4
      }, i * 300);
    }
  };

  const playClickSound = () => {
    playTone(800, 0.1, 0.1);
  };

  // Background music simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameState === 'emergency') {
      // Fast-paced emergency music
      interval = setInterval(() => {
        if (!isMuted) {
          playTone(330, 0.1, 0.05); // E4
          setTimeout(() => playTone(370, 0.1, 0.05), 200); // F#4
        }
      }, 400);
    } else if (gameState === 'playing') {
      // Ambient background tones
      interval = setInterval(() => {
        if (!isMuted) {
          playTone(196, 0.3, 0.02); // G3
          setTimeout(() => playTone(246.94, 0.3, 0.02), 500); // B3
        }
      }, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState, isMuted, musicVolume]);

  // Event-based sound effects
  useEffect(() => {
    if (gameState === 'success') {
      playSuccessSound();
    } else if (gameState === 'failure') {
      playErrorSound();
    } else if (gameState === 'emergency') {
      playEmergencyAlert();
    }
  }, [gameState]);

  return (
    <div className="fixed top-4 right-4 z-40">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMuted(!isMuted)}
          className="bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white border border-white/20"
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowControls(!showControls)}
          className="bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white border border-white/20"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      {showControls && (
        <Card className="absolute top-12 right-0 w-64 bg-black/80 backdrop-blur-lg border border-white/20">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center space-x-2">
              <Music className="h-4 w-4 text-blue-400" />
              <span className="text-white text-sm">Music</span>
            </div>
            <Slider
              value={[musicVolume]}
              onValueChange={(value) => setMusicVolume(value[0])}
              max={100}
              step={1}
              className="w-full"
            />
            
            <div className="flex items-center space-x-2">
              <Volume2 className="h-4 w-4 text-green-400" />
              <span className="text-white text-sm">Sound Effects</span>
            </div>
            <Slider
              value={[sfxVolume]}
              onValueChange={(value) => setSfxVolume(value[0])}
              max={100}
              step={1}
              className="w-full"
            />
            
            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={playSuccessSound}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Test Success
              </Button>
              <Button
                size="sm"
                onClick={playClickSound}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Test Click
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AudioSystem;
