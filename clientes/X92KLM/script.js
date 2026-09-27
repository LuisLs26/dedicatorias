/**
 * ============================================================================
 * NUESTRA HISTORIA - SCRIPT AUTÓNOMO
 * ============================================================================
 */

class HistoriaAudioEngine {
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
    // Iniciar audio suavemente en la primera interacción de scroll o clic
    const startOnInteraction = () => {
      this.start();
      window.removeEventListener('click', startOnInteraction);
      window.removeEventListener('scroll', startOnInteraction);
    };
    window.addEventListener('click', startOnInteraction, { once: true });
    window.addEventListener('scroll', startOnInteraction, { once: true });
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
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [220.00, 261.63, 329.63, 392.00], // Am7
        [174.61, 220.00, 261.63, 329.63]  // Fmaj7
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
              gain.gain.exponentialRampToValueAtTime(0.05, now + 0.15);
              gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.0);
              osc.connect(gain);
              gain.connect(this.audioCtx.destination);
              osc.start(now);
              osc.stop(now + 4.1);
            } catch (e) {}
          }, i * 200);
        });
      };
      play();
      this.synthInterval = setInterval(play, 5000);
    } catch (e) {}
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.audioElement) this.audioElement.muted = this.isMuted;
    return this.isMuted;
  }
}

class HistoriaApp {
  constructor() {
    this.cfg = window.REGALO || {};
    this.audio = new HistoriaAudioEngine();
  }

  init() {
    this.checkDemoMode();
    this.render();
    this.initObserver();
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
    document.title = `${this.cfg.destinatario || 'Para ti'} • Nuestra Historia`;

    const subEl = document.getElementById('headerSub');
    if (subEl) subEl.textContent = this.cfg.subtitulo || `${this.cfg.destinatario || ''} & ${this.cfg.remitente || ''}`;

    const titleEl = document.getElementById('headerTitle');
    if (titleEl) titleEl.textContent = this.cfg.titulo || 'Nuestra Historia';

    const introEl = document.getElementById('headerIntro');
    if (introEl) introEl.textContent = this.cfg.introduccion || '';

    const listContainer = document.getElementById('momentsList');
    if (listContainer && Array.isArray(this.cfg.momentos)) {
      listContainer.innerHTML = '';
      this.cfg.momentos.forEach((m) => {
        const article = document.createElement('article');
        article.className = 'moment-chapter';

        let inner = `
          ${m.fecha ? `<span class="moment-date-tag">${m.fecha}</span>` : ''}
          <h2 class="moment-title">${m.titulo || ''}</h2>
        `;

        if (m.foto) {
          inner += `
            <div class="moment-photo-wrap">
              <img src="${m.foto}" alt="${m.titulo || 'Momento'}" loading="lazy" />
            </div>
          `;
        }

        if (m.descripcion) {
          inner += `<p class="moment-desc">${m.descripcion}</p>`;
        }

        article.innerHTML = inner;
        listContainer.appendChild(article);
      });
    }

    const msgEl = document.getElementById('finalMessage');
    if (msgEl) msgEl.textContent = this.cfg.mensajeFinal || '';

    const sigEl = document.getElementById('finalSignature');
    if (sigEl) sigEl.textContent = `Con amor, ${this.cfg.remitente || ''}`;

    const dateEl = document.getElementById('finalDate');
    if (dateEl) dateEl.textContent = this.cfg.fecha || '';
  }

  initObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.moment-chapter').forEach(el => observer.observe(el));
  }

  bindEvents() {
    const audioBtn = document.getElementById('audioToggle');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        const isMuted = this.audio.toggleMute();
        audioBtn.classList.toggle('muted', isMuted);
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new HistoriaApp().init();
});
