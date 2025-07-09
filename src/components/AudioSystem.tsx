
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Volume2, VolumeX, Music, Settings, Headphones } from 'lucide-react';

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
    createEnhancedTone(220, 0.2, 0.3, 'sawtooth'); // A3
    setTimeout(() => createEnhancedTone(196, 0.3, 0.2, 'sawtooth'), 200); // G3
    setTimeout(() => createEnhancedTone(174.61, 0.4, 0.15, 'sawtooth'), 400); // F3
  };

  // Enhanced click sound
  const playClickSound = () => {
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
  };

  // Background music with game state awareness
  useEffect(() => {
    if (gameState === 'playing' || gameState === 'emergency') {
      const cleanup = startBackgroundMusic();
      return cleanup;
    } else {
      stopBackgroundMusic();
    }
  }, [gameState, isMuted, musicVolume]);

  // Update background music volume
  useEffect(() => {
    if (backgroundGainRef.current) {
      backgroundGainRef.current.gain.value = (musicVolume / 100) * 0.03;
    }
  }, [musicVolume]);

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setIsMuted(!isMuted);
            playClickSound();
          }}
          className="glass-card bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white border border-white/20 transform hover:scale-105 transition-all duration-200"
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setShowControls(!showControls);
            playClickSound();
          }}
          className="glass-card bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white border border-white/20 transform hover:scale-105 transition-all duration-200"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      {showControls && (
        <Card className="absolute top-12 left-1/2 transform -translate-x-1/2 w-64 glass-card bg-black/90 backdrop-blur-lg border border-white/20 shadow-2xl animate-in slide-in-from-top-2 duration-300">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center space-x-2">
              <Music className="h-4 w-4 text-blue-400" />
              <span className="text-white text-sm">Ambient Music</span>
              <Headphones className="h-3 w-3 text-gray-400" />
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
                className="flex-1 bg-green-600 hover:bg-green-700 transform hover:scale-105 transition-all duration-200"
              >
                🎉 Success
              </Button>
              <Button
                size="sm"
                onClick={playClickSound}
                className="flex-1 bg-blue-600 hover:bg-blue-700 transform hover:scale-105 transition-all duration-200"
              >
                🔊 Click
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AudioSystem;
