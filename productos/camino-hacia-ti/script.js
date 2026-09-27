/**
 * ============================================================================
 * CAMINO HACIA TI - MOTOR DE EXPERIENCIA AUTÓNOMO
 * ============================================================================
 */

class StandaloneAudioEngine {
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
        [293.66, 349.23, 440.00],
        [261.63, 329.63, 392.00],
        [220.00, 261.63, 329.63]
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
              gain.gain.exponentialRampToValueAtTime(0.06, now + 0.1);
              gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);
              osc.connect(gain);
              gain.connect(this.audioCtx.destination);
              osc.start(now);
              osc.stop(now + 3.6);
            } catch (e) {}
          }, i * 220);
        });
      };
      play();
      this.synthInterval = setInterval(play, 4800);
    } catch (e) {}
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.audioElement) this.audioElement.muted = this.isMuted;
    return this.isMuted;
  }
}

class CaminoApp {
  constructor() {
    this.cfg = window.REGALO || {};
    this.audio = new StandaloneAudioEngine();
    this.canvas = null;
    this.ctx = null;
    this.petals = [];
  }

  init() {
    this.checkDemoMode();
    this.render();
    this.initCanvas();
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
    document.title = `${this.cfg.destinatario || 'Para ti'} • Camino hacia ti`;
    
    const recEl = document.getElementById('introRecipient');
    if (recEl) recEl.textContent = `${this.cfg.destinatario || 'Para ti'}...`;

    const tagEl = document.getElementById('introTagline');
    if (tagEl) tagEl.textContent = this.cfg.mensajeInicial || 'Tengo algo especial para ti.';

    const container = document.getElementById('milestonesContainer');
    const list = this.cfg.mensajes || [];
    if (container) {
      container.innerHTML = '';
      list.forEach((m) => {
        const div = document.createElement('div');
        div.className = 'camino-milestone';
        let inner = `
          <div class="milestone-dot"></div>
          <div class="milestone-content">
            <h3 class="milestone-title">${m.titulo || ''}</h3>
            ${m.texto ? `<p class="milestone-text">${m.texto}</p>` : ''}
        `;
        if (m.foto) {
          inner += `
            <div class="milestone-media">
              <img src="${m.foto}" alt="Recuerdo" loading="lazy" />
            </div>
            ${m.pieFoto ? `<p class="milestone-caption">${m.pieFoto}</p>` : ''}
          `;
        }
        inner += `</div>`;
        div.innerHTML = inner;
        container.appendChild(div);
      });
    }

    const secEl = document.getElementById('secretFlowerText');
    if (secEl) secEl.textContent = this.cfg.secretoFlor || '';

    const finalBody = document.getElementById('finalBody');
    if (finalBody) finalBody.textContent = this.cfg.mensajeFinal || '';

    const finalSig = document.getElementById('finalSignature');
    if (finalSig) finalSig.textContent = `Con amor, ${this.cfg.remitente || 'Yo'}`;

    const finalDate = document.getElementById('finalDate');
    if (finalDate) finalDate.textContent = this.cfg.fecha || '';
  }

  bindEvents() {
    const btnStart = document.getElementById('btnStart');
    const curtain = document.getElementById('introCurtain');
    const audioToggle = document.getElementById('audioToggle');

    if (btnStart) {
      btnStart.addEventListener('click', () => {
        if (curtain) curtain.classList.add('hidden');
        if (audioToggle) audioToggle.classList.add('visible');
        this.audio.start();
      });
    }

    if (audioToggle) {
      audioToggle.addEventListener('click', () => {
        const isMuted = this.audio.toggleMute();
        audioToggle.classList.toggle('muted', isMuted);
      });
    }

    const flowerBtn = document.getElementById('flowerBtn');
    const flowerBox = document.getElementById('flowerBox');
    if (flowerBtn && flowerBox) {
      flowerBtn.addEventListener('click', () => {
        flowerBox.classList.add('active');
        flowerBtn.style.transform = 'scale(1.1)';
        setTimeout(() => { flowerBtn.style.transform = ''; }, 300);
      });
    }

    const btnDiscover = document.getElementById('btnDiscover');
    const finalCard = document.getElementById('finalCard');
    if (btnDiscover && finalCard) {
      btnDiscover.addEventListener('click', () => {
        btnDiscover.style.display = 'none';
        finalCard.classList.add('active');
        finalCard.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }

  initObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.camino-milestone').forEach(el => observer.observe(el));
  }

  initCanvas() {
    this.canvas = document.getElementById('petalsCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    });

    for (let i = 0; i < 15; i++) {
      this.petals.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        r: Math.random() * 5 + 3,
        dx: (Math.random() - 0.5) * 0.6,
        dy: Math.random() * 0.8 + 0.3,
        alpha: Math.random() * 0.5 + 0.2
      });
    }
    this.renderCanvas();
  }

  renderCanvas() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.petals.forEach(p => {
      p.x += p.dx;
      p.y += p.dy;
      if (p.y > this.canvas.height + 10) {
        p.y = -10;
        p.x = Math.random() * this.canvas.width;
      }
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 180, 195, ${p.alpha})`;
      this.ctx.fill();
    });
    requestAnimationFrame(() => this.renderCanvas());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new CaminoApp().init();
});
