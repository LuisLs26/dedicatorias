/**
 * ============================================================================
 * CARTA ESPECIAL - SCRIPT AUTÓNOMO
 * ============================================================================
 */

class CartaAudioEngine {
  constructor() {
    this.audioElement = null;
    this.audioCtx = null;
    this.isPlaying = false;
    this.isMuted = false;
    this.synthInterval = null;
  }

  init(customTrackUrl = null) {
    if (customTrackUrl) {
      this.audioElement = new Audio(customTrackUrl);
      this.audioElement.loop = true;
    }
  }

  start() {
    if (this.isPlaying) return;
    if (this.audioElement) {
      this.audioElement.play().catch(() => this.startSynth());
    } else {
      this.startSynth();
    }
    this.isPlaying = true;
  }

  startSynth() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.audioCtx = new AudioCtx();
      const chords = [
        [220.00, 261.63, 329.63], // Am
        [174.61, 220.00, 261.63], // F
        [196.00, 246.94, 293.66]  // G
      ];
      let idx = 0;
      const play = () => {
        if (!this.isPlaying || this.isMuted || !this.audioCtx) return;
        const chord = chords[idx % chords.length];
        idx++;
        chord.forEach((freq, i) => {
          setTimeout(() => {
            if (!this.isPlaying || this.isMuted) return;
            try {
              const now = this.audioCtx.currentTime;
              const osc = this.audioCtx.createOscillator();
              const gain = this.audioCtx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(freq, now);
              gain.gain.setValueAtTime(0.001, now);
              gain.gain.exponentialRampToValueAtTime(0.04, now + 0.2);
              gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);
              osc.connect(gain);
              gain.connect(this.audioCtx.destination);
              osc.start(now);
              osc.stop(now + 4.6);
            } catch (e) {}
          }, i * 250);
        });
      };
      play();
      this.synthInterval = setInterval(play, 5200);
    } catch (e) {}
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.audioElement) this.audioElement.muted = this.isMuted;
    return this.isMuted;
  }
}

class CartaApp {
  constructor() {
    this.cfg = window.REGALO || {};
    this.audio = new CartaAudioEngine();
  }

  init() {
    this.checkDemoMode();
    this.render();
    this.bindEvents();
    this.audio.init(this.cfg.musica);
  }

  checkDemoMode() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("demo") === "1") {
      const backBtn = document.getElementById("backToStore");
      if (backBtn) backBtn.style.display = "inline-flex";
    }
  }

  render() {
    document.title = `${this.cfg.destinatario || 'Para ti'} • Una Carta Especial`;

    const envRecEl = document.getElementById('envelopeRecipient');
    if (envRecEl) envRecEl.textContent = `${this.cfg.destinatario || 'Para ti'}...`;

    const dateEl = document.getElementById('letterDate');
    if (dateEl) dateEl.textContent = this.cfg.fecha || '';

    const greetingEl = document.getElementById('letterGreeting');
    if (greetingEl) greetingEl.textContent = this.cfg.saludo || `Querida ${this.cfg.destinatario || ''},`;

    const pContainer = document.getElementById('paragraphsContainer');
    if (pContainer && Array.isArray(this.cfg.parrafos)) {
      pContainer.innerHTML = '';
      this.cfg.parrafos.forEach(txt => {
        const p = document.createElement('p');
        p.textContent = txt;
        pContainer.appendChild(p);
      });
    }

    if (this.cfg.foto) {
      const photoFrame = document.getElementById('letterPhotoFrame');
      const photoImg = document.getElementById('letterPhotoImg');
      const photoCaption = document.getElementById('letterPhotoCaption');
      if (photoFrame && photoImg) {
        photoImg.src = this.cfg.foto;
        if (photoCaption) photoCaption.textContent = this.cfg.pieFoto || '';
        photoFrame.style.display = 'block';
      }
    }

    const closingEl = document.getElementById('letterClosing');
    if (closingEl) closingEl.textContent = this.cfg.despedida || 'Con cariño,';

    const sigEl = document.getElementById('letterSignature');
    if (sigEl) sigEl.textContent = this.cfg.firma || this.cfg.remitente || '';
  }

  bindEvents() {
    const btnOpen = document.getElementById('btnOpenLetter');
    const envScreen = document.getElementById('envelopeScreen');
    if (btnOpen && envScreen) {
      btnOpen.addEventListener('click', () => {
        envScreen.classList.add('hidden');
        this.audio.start();
      });
    }

    const audioToggle = document.getElementById('audioToggle');
    if (audioToggle) {
      audioToggle.addEventListener('click', () => {
        const isMuted = this.audio.toggleMute();
        audioToggle.classList.toggle('muted', isMuted);
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new CartaApp().init();
});
