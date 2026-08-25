// Web Audio API Synthesizer for Terminal Sound Effects
// Zero external audio files required. All synthesized with Web Audio Oscillators.

class TerminalSoundSynthesizer {
  constructor() {
    this.ctx = null;
    this.isEnabled = true;
  }

  // Safely initialize or resume AudioContext on user interaction
  init() {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  toggleSound(forceState) {
    if (typeof forceState === 'boolean') {
      this.isEnabled = forceState;
    } else {
      this.isEnabled = !this.isEnabled;
    }
    if (this.isEnabled) {
      this.playBootBleep(2);
    }
    return this.isEnabled;
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
      gain.connect(ctx.destination);

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
      gain.connect(ctx.destination);

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
      gain.connect(ctx.destination);

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
        gain.connect(ctx.destination);

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
      // Two harsh low frequency bursts
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
        gain.connect(ctx.destination);

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
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + 0.035);
      }
    } catch (e) {}
  }
}

export const terminalSound = new TerminalSoundSynthesizer();
