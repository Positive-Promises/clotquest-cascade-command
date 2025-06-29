
import { AudioConfiguration } from '@/types/enhancedTypes';

export class AudioManager {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private effectsGain: GainNode | null = null;
  private narrationGain: GainNode | null = null;
  private spatialPanner: PannerNode | null = null;
  
  private loadedSounds: Map<string, AudioBuffer> = new Map();
  private activeSources: Set<AudioBufferSourceNode> = new Set();
  
  private config: AudioConfiguration = {
    masterVolume: 0.7,
    musicVolume: 0.5,
    effectsVolume: 0.8,
    narrationVolume: 0.9,
    spatialAudioEnabled: true,
    accessibilityAudioEnabled: false,
    currentSoundscape: 'laboratory'
  };

  constructor() {
    this.initializeAudioContext();
  }

  private async initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.setupAudioNodes();
      await this.loadSoundLibrary();
      console.log('🔊 Audio Manager initialized successfully');
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  }

  private setupAudioNodes() {
    if (!this.audioContext) return;

    // Create gain nodes for different audio categories
    this.masterGain = this.audioContext.createGain();
    this.musicGain = this.audioContext.createGain();
    this.effectsGain = this.audioContext.createGain();
    this.narrationGain = this.audioContext.createGain();

    // Create spatial audio panner
    this.spatialPanner = this.audioContext.createPanner();
    this.spatialPanner.panningModel = 'HRTF';
    this.spatialPanner.distanceModel = 'inverse';

    // Connect audio graph
    this.musicGain.connect(this.masterGain);
    this.effectsGain.connect(this.masterGain);
    this.narrationGain.connect(this.masterGain);
    this.masterGain.connect(this.audioContext.destination);

    // Set initial volumes
    this.updateVolumes();
  }

  private async loadSoundLibrary() {
    const soundLibrary = {
      // UI Feedback Sounds
      'success': '/audio/success.mp3',
      'error': '/audio/error.mp3',
      'click': '/audio/click.mp3',
      'hover': '/audio/hover.mp3',
      'completion': '/audio/completion.mp3',
      
      // Medical Ambience
      'laboratory_ambient': '/audio/laboratory_ambient.mp3',
      'hospital_ambient': '/audio/hospital_ambient.mp3',
      'heartbeat': '/audio/heartbeat.mp3',
      'blood_flow': '/audio/blood_flow.mp3',
      
      // Educational Audio
      'factor_placement': '/audio/factor_placement.mp3',
      'cascade_activation': '/audio/cascade_activation.mp3',
      'clot_formation': '/audio/clot_formation.mp3',
      
      // Background Music
      'menu_music': '/audio/menu_music.mp3',
      'gameplay_music': '/audio/gameplay_music.mp3',
      'emergency_music': '/audio/emergency_music.mp3'
    };

    // In a real implementation, these would be actual audio files
    // For now, we'll simulate loading
    for (const [key, path] of Object.entries(soundLibrary)) {
      try {
        // Simulate audio loading
        console.log(`Loading audio: ${key} from ${path}`);
        // this.loadedSounds.set(key, audioBuffer);
      } catch (error) {
        console.warn(`Failed to load audio: ${key}`);
      }
    }
  }

  playSound(soundId: string, options: {
    volume?: number;
    position?: { x: number; y: number; z: number };
    loop?: boolean;
    category?: 'music' | 'effects' | 'narration';
  } = {}) {
    if (!this.audioContext || !this.loadedSounds.has(soundId)) {
      console.warn(`Sound not available: ${soundId}`);
      return;
    }

    const {
      volume = 1,
      position,
      loop = false,
      category = 'effects'
    } = options;

    try {
      const buffer = this.loadedSounds.get(soundId)!;
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();

      source.buffer = buffer;
      source.loop = loop;
      gainNode.gain.value = volume;

      // Connect to appropriate category
      let categoryGain: GainNode;
      switch (category) {
        case 'music':
          categoryGain = this.musicGain!;
          break;
        case 'narration':
          categoryGain = this.narrationGain!;
          break;
        default:
          categoryGain = this.effectsGain!;
      }

      // Apply spatial audio if position provided
      if (position && this.spatialPanner && this.config.spatialAudioEnabled) {
        this.spatialPanner.setPosition(position.x, position.y, position.z);
        source.connect(gainNode).connect(this.spatialPanner).connect(categoryGain);
      } else {
        source.connect(gainNode).connect(categoryGain);
      }

      source.start();
      this.activeSources.add(source);

      source.onended = () => {
        this.activeSources.delete(source);
      };

      return source;
    } catch (error) {
      console.error(`Error playing sound ${soundId}:`, error);
    }
  }

  playSoundscape(scenarioType: AudioConfiguration['currentSoundscape']) {
    this.stopCurrentSoundscape();
    
    const soundscapeMapping = {
      'laboratory': ['laboratory_ambient', 'equipment_hum'],
      'hospital': ['hospital_ambient', 'heartbeat'],
      'classroom': ['classroom_ambient'],
      'ambient': ['gentle_ambient']
    };

    const sounds = soundscapeMapping[scenarioType] || [];
    sounds.forEach(soundId => {
      this.playSound(soundId, {
        category: 'music',
        loop: true,
        volume: 0.3
      });
    });

    this.config.currentSoundscape = scenarioType;
  }

  stopCurrentSoundscape() {
    this.activeSources.forEach(source => {
      try {
        source.stop();
      } catch (error) {
        // Source might already be stopped
      }
    });
    this.activeSources.clear();
  }

  updateConfiguration(newConfig: Partial<AudioConfiguration>) {
    this.config = { ...this.config, ...newConfig };
    this.updateVolumes();
  }

  private updateVolumes() {
    if (!this.masterGain || !this.musicGain || !this.effectsGain || !this.narrationGain) return;

    this.masterGain.gain.value = this.config.masterVolume;
    this.musicGain.gain.value = this.config.musicVolume;
    this.effectsGain.gain.value = this.config.effectsVolume;
    this.narrationGain.gain.value = this.config.narrationVolume;
  }

  // Accessibility features
  provideAudioDescription(text: string) {
    if (!this.config.accessibilityAudioEnabled) return;
    
    // Use Web Speech API for text-to-speech
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = this.config.narrationVolume;
      speechSynthesis.speak(utterance);
    }
  }

  // Game-specific audio methods
  playFactorPlacementFeedback(correct: boolean, factorName: string) {
    if (correct) {
      this.playSound('success', { category: 'effects' });
      this.provideAudioDescription(`Correct! ${factorName} placed successfully.`);
    } else {
      this.playSound('error', { category: 'effects' });
      this.provideAudioDescription(`Incorrect placement. ${factorName} needs to be positioned elsewhere.`);
    }
  }

  playEmergencyModeAudio() {
    this.playSoundscape('hospital');
    this.playSound('emergency_music', { category: 'music', loop: true, volume: 0.6 });
    this.provideAudioDescription('Emergency mode activated. Patient is bleeding and needs immediate coagulation cascade activation.');
  }

  playLevelCompletionAudio() {
    this.playSound('completion', { category: 'effects' });
    this.provideAudioDescription('Congratulations! Level completed successfully. The coagulation cascade is now fully assembled.');
  }
}

export const audioManager = new AudioManager();
