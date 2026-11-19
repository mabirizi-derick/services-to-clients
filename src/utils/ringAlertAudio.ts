// Web Audio API Ring Alert Sound Generator for Service Provider Incoming Dispatch
class RingAlertAudioManager {
  private audioCtx: AudioContext | null = null;
  private isCurrentlyRinging: boolean = false;
  private intervalId: any = null;
  private vibrationIntervalId: any = null;
  private muted: boolean = false;

  private initContext() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
  }

  // Play a single ring burst (two-tone standard dispatch ring: 480Hz + 440Hz with modulation)
  private playRingBurst() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const duration = 1.6; // 1.6 seconds ring burst

      const gainNode = this.audioCtx.createGain();
      gainNode.gain.setValueAtTime(0, now);
      // Fade in quickly
      gainNode.gain.linearRampToValueAtTime(0.35, now + 0.05);
      // Tremolo ring effect
      gainNode.gain.setValueAtTime(0.35, now + duration - 0.1);
      gainNode.gain.linearRampToValueAtTime(0, now + duration);
      gainNode.connect(this.audioCtx.destination);

      // Primary oscillator (480 Hz)
      const osc1 = this.audioCtx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(480, now);
      osc1.connect(gainNode);

      // Secondary oscillator (440 Hz standard phone cadence)
      const osc2 = this.audioCtx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(440, now);
      osc2.connect(gainNode);

      // High harmonic for distinct salon alert presence (880 Hz subtle)
      const osc3 = this.audioCtx.createOscillator();
      osc3.type = 'triangle';
      osc3.frequency.setValueAtTime(880, now);
      const gain3 = this.audioCtx.createGain();
      gain3.gain.setValueAtTime(0.08, now);
      osc3.connect(gain3);
      gain3.connect(this.audioCtx.destination);

      osc1.start(now);
      osc2.start(now);
      osc3.start(now);

      osc1.stop(now + duration);
      osc2.stop(now + duration);
      osc3.stop(now + duration);
    } catch (e) {
      console.warn('Audio ring alert fallback:', e);
    }
  }

  public startRing() {
    if (this.isCurrentlyRinging) return;
    this.isCurrentlyRinging = true;

    this.initContext();

    // Play first ring immediately
    this.playRingBurst();

    // Repeat every 3 seconds (1.6s ring + 1.4s pause cadence)
    this.intervalId = setInterval(() => {
      if (this.isCurrentlyRinging) {
        this.playRingBurst();
      }
    }, 3000);

    // Vibration pattern for mobile devices if supported
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([400, 200, 400, 200, 800]);
        this.vibrationIntervalId = setInterval(() => {
          if (this.isCurrentlyRinging && 'vibrate' in navigator) {
            navigator.vibrate([400, 200, 400, 200, 800]);
          }
        }, 3000);
      } catch {
        // Ignore vibration errors
      }
    }
  }

  public stopRing() {
    this.isCurrentlyRinging = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.vibrationIntervalId) {
      clearInterval(this.vibrationIntervalId);
      this.vibrationIntervalId = null;
    }
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(0); // Stop vibration immediately
      } catch {
        // ignore
      }
    }
  }

  public isRinging(): boolean {
    return this.isCurrentlyRinging;
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    return this.muted;
  }

  public isMuted(): boolean {
    return this.muted;
  }
}

export const ringAlertAudio = new RingAlertAudioManager();
