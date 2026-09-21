// Web Audio API Synthesizer for Terminal Sound Effects
// Zero external audio files required. All synthesized with Web Audio Oscillators.

class TerminalSoundSynthesizer {
  constructor() {
    this.ctx = null;
    this.isEnabled = true;
    this.isDroneActive = false;
    this.droneGain = null;
    this.droneOscs = [];
    this.analyser = null;
    this.dataArray = null;
  }

  // Safely initialize or resume AudioContext on user interaction
  init() {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 64;
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  getFrequencyData() {
    if (!this.analyser || !this.dataArray) return 0;
    this.analyser.getByteFrequencyData(this.dataArray);
    // Get average of the lowest frequencies to use as "bass"
    const sum = this.dataArray.slice(0, 4).reduce((a, b) => a + b, 0);
    return (sum / 4) / 255.0; // Normalized 0.0 to 1.0
  }

  toggleSound(forceState) {
    if (typeof forceState === 'boolean') {
      this.isEnabled = forceState;
    } else {
      this.isEnabled = !this.isEnabled;
    }

    if (this.isEnabled) {
      this.playBootBleep(2);
      this.startAmbientDrone();
    } else {
      this.stopAmbientDrone();
    }
    return this.isEnabled;
  }

  // --- Cybernetic Ambient Drone (Space Hum) ---
  startAmbientDrone() {
    if (!this.isEnabled || this.isDroneActive) return;
    const ctx = this.init();
    if (!ctx) return;

    try {
      this.isDroneActive = true;
      const now = ctx.currentTime;

      // Master Gain for Drone with gentle fade in
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.0001, now);
      masterGain.gain.exponentialRampToValueAtTime(0.025, now + 2.0);

      // Low-pass filter to keep it deep, warm, and unobtrusive
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(110, now);
      filter.Q.setValueAtTime(2.0, now);

      // Dual detuned oscillators for gentle binaural beating (55Hz & 55.4Hz)
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(55, now); // A1 note

      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(55.45, now); // Detuned for slow beating

      // LFO for subtle breathing pulse
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.2, now); // 0.2 Hz slow wave
      lfoGain.gain.setValueAtTime(15, now); // Modulate filter cutoff by ±15Hz

      lfo.connect(filter.frequency);
      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(this.analyser);

      osc1.start(now);
      osc2.start(now);
      lfo.start(now);

      this.droneGain = masterGain;
      this.droneOscs = [osc1, osc2, lfo];
    } catch (e) {
      this.isDroneActive = false;
    }
  }

  stopAmbientDrone() {
    if (!this.isDroneActive || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      if (this.droneGain) {
        this.droneGain.gain.setValueAtTime(this.droneGain.gain.value || 0.025, now);
        this.droneGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      }
      setTimeout(() => {
        this.droneOscs.forEach(osc => {
          try { osc.stop(); osc.disconnect(); } catch (err) {}
        });
        this.droneOscs = [];
        this.droneGain = null;
        this.isDroneActive = false;
      }, 1300);
    } catch (e) {
      this.isDroneActive = false;
    }
  }

  // --- Quantum Particle Shockwave Audio Burst ---
  playShockwaveBurst() {
    if (!this.isEnabled) return;
    const ctx = this.init();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      
      // 1. Sub-bass pulse
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(160, now);
      subOsc.frequency.exponentialRampToValueAtTime(38, now + 0.35);

      subGain.gain.setValueAtTime(0.06, now);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);

      subOsc.connect(subGain);
      subGain.connect(this.analyser);
      subOsc.start(now);
      subOsc.stop(now + 0.4);

      // 2. High-frequency holographic dispersion shimmer
      const shimmer = ctx.createOscillator();
      const shimmerGain = ctx.createGain();
      shimmer.type = 'triangle';
      shimmer.frequency.setValueAtTime(800, now);
      shimmer.frequency.exponentialRampToValueAtTime(2400, now + 0.15);

      shimmerGain.gain.setValueAtTime(0.02, now);
      shimmerGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

      shimmer.connect(shimmerGain);
      shimmerGain.connect(this.analyser);
      shimmer.start(now);
      shimmer.stop(now + 0.22);
    } catch (e) {}
  }

  // --- Subtle UI Hover Tick ---
  playHoverTick() {
    if (!this.isEnabled) return;
    const ctx = this.init();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, now);
      gain.gain.setValueAtTime(0.008, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);

      osc.connect(gain);
      gain.connect(this.analyser);
      osc.start(now);
      osc.stop(now + 0.02);
    } catch (e) {}
  }

  // 1. Mechanical Sci-Fi Key Click
  playKeyClick() {
    if (!this.isEnabled) return;
    const ctx = this.init();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      // Slight random pitch variation for authentic mechanical keyboard feel
      const baseFreq = 800 + Math.random() * 400;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.025);

      gain.gain.setValueAtTime(0.025, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

      osc.connect(gain);
      gain.connect(this.analyser);

      osc.start(now);
      osc.stop(now + 0.03);
    } catch (e) {}
  }

  // 2. Quantum Boot Sequence Bleeps
  playBootBleep(step = 0) {
    if (!this.isEnabled) return;
    const ctx = this.init();
    if (!ctx) return;

    try {
      const freqs = [440, 587.33, 739.99, 880, 1174.66];
      const freq = freqs[step % freqs.length] || 600;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.2, now + 0.06);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.analyser);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {}
  }

  // 3. Command Execution Affirmation Chirp
  playCommandEnter() {
    if (!this.isEnabled) return;
    const ctx = this.init();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);

      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.analyser);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch (e) {}
  }

  // 4. Success Chime (Message Sent)
  playSuccessChime() {
    if (!this.isEnabled) return;
    const ctx = this.init();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const now = ctx.currentTime + i * 0.08;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

        osc.connect(gain);
        gain.connect(this.analyser);

        osc.start(now);
        osc.stop(now + 0.4);
      });
    } catch (e) {}
  }

  // 5. Access Denied Buzzer (sudo error)
  playAccessDeniedBuzzer() {
    if (!this.isEnabled) return;
    const ctx = this.init();
    if (!ctx) return;

    try {
      [0, 0.15].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const now = ctx.currentTime + delay;

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.linearRampToValueAtTime(80, now + 0.1);

        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

        osc.connect(gain);
        gain.connect(this.analyser);

        osc.start(now);
        osc.stop(now + 0.13);
      });
    } catch (e) {}
  }

  // 6. Data Packet Uplink Stream Sound
  playTransmissionBeep() {
    if (!this.isEnabled) return;
    const ctx = this.init();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      for (let i = 0; i < 4; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const t = now + i * 0.05;

        osc.type = 'square';
        osc.frequency.setValueAtTime(1200 + Math.random() * 600, t);

        gain.gain.setValueAtTime(0.015, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);

        osc.connect(gain);
        gain.connect(this.analyser);

        osc.start(t);
        osc.stop(t + 0.035);
      }
    } catch (e) {}
  }
}

export const terminalSound = new TerminalSoundSynthesizer();
