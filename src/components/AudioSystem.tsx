
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Volume2, VolumeX, Music, Settings, Headphones, Play, Pause } from 'lucide-react';

interface AudioSystemProps {
  gameState: 'menu' | 'playing' | 'emergency' | 'success' | 'failure';
  level: number;
}

const AudioSystem: React.FC<AudioSystemProps> = ({ gameState, level }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [musicVolume, setMusicVolume] = useState(50);
  const [sfxVolume, setSfxVolume] = useState(70);
  const [showControls, setShowControls] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentTrackRef = useRef<AudioBufferSourceNode | null>(null);
  const backgroundMusicRef = useRef<OscillatorNode | null>(null);
  const backgroundGainRef = useRef<GainNode | null>(null);

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

  // Enhanced sound creation with reverb and effects
  const createEnhancedTone = (frequency: number, duration: number, volume: number = 0.1, waveType: OscillatorType = 'sine') => {
    if (!audioContextRef.current || isMuted) return;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    const filter = audioContextRef.current.createBiquadFilter();
    
    // Create a simple reverb effect
    const convolver = audioContextRef.current.createConvolver();
    const impulseBuffer = audioContextRef.current.createBuffer(2, audioContextRef.current.sampleRate * 0.5, audioContextRef.current.sampleRate);
    for (let channel = 0; channel < impulseBuffer.numberOfChannels; channel++) {
      const channelData = impulseBuffer.getChannelData(channel);
      for (let i = 0; i < channelData.length; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / channelData.length, 2);
      }
    }
    convolver.buffer = impulseBuffer;
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(convolver);
    convolver.connect(audioContextRef.current.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = waveType;
    filter.frequency.value = frequency * 2;
    filter.Q.value = 1;
    
    gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume * (sfxVolume / 100), audioContextRef.current.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + duration);
    
    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + duration);
  };

  // Enhanced success sound with multiple tones and effects
  const playSuccessSound = () => {
    if (isMuted) return;
    createEnhancedTone(523.25, 0.2, 0.3, 'triangle'); // C5
    setTimeout(() => createEnhancedTone(659.25, 0.2, 0.3, 'triangle'), 100); // E5
    setTimeout(() => createEnhancedTone(783.99, 0.4, 0.3, 'triangle'), 200); // G5
    setTimeout(() => createEnhancedTone(1046.5, 0.6, 0.2, 'sine'), 300); // C6
    
    // Add some sparkle effects
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        createEnhancedTone(1500 + Math.random() * 500, 0.1, 0.1, 'square');
      }, 400 + i * 50);
    }
  };

  // Enhanced error sound
  const playErrorSound = () => {
    if (isMuted) return;
    createEnhancedTone(220, 0.2, 0.3, 'sawtooth'); // A3
    setTimeout(() => createEnhancedTone(196, 0.3, 0.2, 'sawtooth'), 200); // G3
    setTimeout(() => createEnhancedTone(174.61, 0.4, 0.15, 'sawtooth'), 400); // F3
  };

  // Enhanced click sound
  const playClickSound = () => {
    if (isMuted) return;
    createEnhancedTone(800 + Math.random() * 200, 0.1, 0.15, 'square');
    setTimeout(() => createEnhancedTone(1200 + Math.random() * 300, 0.05, 0.1, 'sine'), 50);
  };

  // Complex background music generation
  const startBackgroundMusic = (): (() => void) => {
    if (!audioContextRef.current || isMuted) return () => {};

    const ctx = audioContextRef.current;
    backgroundGainRef.current = ctx.createGain();
    backgroundGainRef.current.connect(ctx.destination);
    backgroundGainRef.current.gain.value = (musicVolume / 100) * 0.03;

    // Create ambient music layer
    const createMusicLayer = (baseFreq: number, type: OscillatorType, detune: number = 0) => {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      
      osc.type = type;
      osc.frequency.value = baseFreq;
      osc.detune.value = detune;
      
      filter.type = 'lowpass';
      filter.frequency.value = baseFreq * 4;
      filter.Q.value = 0.5;
      
      osc.connect(filter);
      filter.connect(backgroundGainRef.current!);
      
      return osc;
    };

    // Create layered ambient music
    const bassOsc = createMusicLayer(55, 'sine'); // Bass A
    const harmonyOsc = createMusicLayer(220, 'triangle', -10); // Harmony A
    const atmosphereOsc = createMusicLayer(440, 'sine', 5); // Atmosphere A

    // Start all oscillators
    [bassOsc, harmonyOsc, atmosphereOsc].forEach(osc => {
      osc.start();
    });

    backgroundMusicRef.current = bassOsc;
    setIsPlaying(true);

    // Return cleanup function
    return () => {
      [bassOsc, harmonyOsc, atmosphereOsc].forEach(osc => {
        try {
          osc.stop();
        } catch (e) {
          // Already stopped
        }
      });
      if (backgroundGainRef.current) {
        backgroundGainRef.current.disconnect();
        backgroundGainRef.current = null;
      }
      setIsPlaying(false);
    };
  };

  const stopBackgroundMusic = () => {
    if (backgroundMusicRef.current) {
      try {
        backgroundMusicRef.current.stop();
      } catch (e) {
        // Already stopped
      }
      backgroundMusicRef.current = null;
    }
    if (backgroundGainRef.current) {
      backgroundGainRef.current.disconnect();
      backgroundGainRef.current = null;
    }
    setIsPlaying(false);
  };

  // Background music with game state awareness
  useEffect(() => {
    if ((gameState === 'playing' || gameState === 'emergency') && !isMuted) {
      const cleanup = startBackgroundMusic();
      return cleanup;
    } else {
      stopBackgroundMusic();
    }
  }, [gameState, isMuted, musicVolume]);

  // Update background music volume
  useEffect(() => {
    if (backgroundGainRef.current) {
      backgroundGainRef.current.gain.value = isMuted ? 0 : (musicVolume / 100) * 0.03;
    }
  }, [musicVolume, isMuted]);

  // Export sound functions for external use
  useEffect(() => {
    (window as any).gameAudio = {
      playSuccess: playSuccessSound,
      playError: playErrorSound,
      playClick: playClickSound
    };
  }, [isMuted]);

  // Handle mute toggle
  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    playClickSound();
    if (!isMuted) {
      stopBackgroundMusic();
    } else if (gameState === 'playing' || gameState === 'emergency') {
      startBackgroundMusic();
    }
  };

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex items-center space-x-3">
        {/* Main Audio Control Panel */}
        <Card className="glassmorphic-card bg-black/30 backdrop-blur-xl border border-white/20 shadow-2xl">
          <CardContent className="p-3">
            <div className="flex items-center space-x-3">
              {/* Mute/Unmute Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMuteToggle}
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20 transform hover:scale-105 transition-all duration-200 rounded-xl"
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>

              {/* Music Play/Pause */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (isPlaying) {
                    stopBackgroundMusic();
                  } else if (!isMuted) {
                    startBackgroundMusic();
                  }
                  playClickSound();
                }}
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20 transform hover:scale-105 transition-all duration-200 rounded-xl"
                disabled={isMuted}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>

              {/* Volume Level Display */}
              <div className="flex items-center space-x-2 px-3 py-1 bg-white/10 rounded-lg border border-white/20">
                <Music className="h-4 w-4 text-blue-400" />
                <span className="text-white text-sm font-medium min-w-[2rem]">{isMuted ? 0 : musicVolume}%</span>
              </div>

              {/* Settings Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowControls(!showControls);
                  playClickSound();
                }}
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20 transform hover:scale-105 transition-all duration-200 rounded-xl"
              >
                <Settings className={`h-5 w-5 transition-transform duration-300 ${showControls ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expanded Audio Controls */}
      {showControls && (
        <Card className="absolute top-16 left-1/2 transform -translate-x-1/2 w-80 glassmorphic-card bg-black/90 backdrop-blur-2xl border border-white/20 shadow-2xl animate-in slide-in-from-top-2 duration-300">
          <CardContent className="p-6 space-y-6">
            <div className="text-center">
              <h3 className="text-white font-bold text-lg mb-2 flex items-center justify-center">
                <Headphones className="h-5 w-5 mr-2 text-purple-400" />
                Audio Controls
              </h3>
              <div className="text-gray-400 text-sm">Level {level} • Coagulation Cascade</div>
            </div>

            {/* Ambient Music Control */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Music className="h-4 w-4 text-blue-400" />
                  <span className="text-white text-sm font-medium">Ambient Music</span>
                </div>
                <span className="text-blue-300 text-sm">{isMuted ? 0 : musicVolume}%</span>
              </div>
              <Slider
                value={[musicVolume]}
                onValueChange={(value) => setMusicVolume(value[0])}
                max={100}
                step={1}
                className="w-full"
                disabled={isMuted}
              />
            </div>
            
            {/* Sound Effects Control */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Volume2 className="h-4 w-4 text-green-400" />
                  <span className="text-white text-sm font-medium">Sound Effects</span>
                </div>
                <span className="text-green-300 text-sm">{isMuted ? 0 : sfxVolume}%</span>
              </div>
              <Slider
                value={[sfxVolume]}
                onValueChange={(value) => setSfxVolume(value[0])}
                max={100}
                step={1}
                className="w-full"
                disabled={isMuted}
              />
            </div>
            
            {/* Audio Test Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                size="sm"
                onClick={playSuccessSound}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 text-white shadow-lg"
                disabled={isMuted}
              >
                🎉 Success
              </Button>
              <Button
                size="sm"
                onClick={playClickSound}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 text-white shadow-lg"
                disabled={isMuted}
              >
                🔊 Click
              </Button>
            </div>

            {/* Audio Status */}
            <div className="pt-3 border-t border-white/20">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Status:</span>
                <span className={`font-medium ${isPlaying && !isMuted ? 'text-green-400' : 'text-gray-400'}`}>
                  {isPlaying && !isMuted ? '🎵 Playing' : '⏸️ Paused'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-gray-400">Audio:</span>
                <span className={`font-medium ${isMuted ? 'text-red-400' : 'text-green-400'}`}>
                  {isMuted ? '🔇 Muted' : '🔊 Active'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AudioSystem;
