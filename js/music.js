/* =========================================================
   MÚSICA: intenta reproducir assets/music/cancion.mp3.
   Si no existe, genera una melodía tipo cajita musical
   con Web Audio (original, sin archivos).
   ========================================================= */
const Music = (() => {
  const audio = document.getElementById("song");
  audio.src = CONFIG.musica;

  let mode = null;      // "file" | "synth"
  let playing = false;
  let actx, master, timer, nextTime = 0, step = 0;

  // ---------- Archivo mp3 ----------
  function fadeAudio(to, ms) {
    const from = audio.volume;
    const t0 = performance.now();
    function tick(now) {
      const p = Math.min(1, (now - t0) / ms);
      audio.volume = from + (to - from) * p;
      if (p < 1) requestAnimationFrame(tick);
      else if (to === 0) audio.pause();
    }
    requestAnimationFrame(tick);
  }

  // ---------- Sintetizador de respaldo ----------
  const midi = n => 440 * Math.pow(2, (n - 69) / 12);
  // Do maj7 · La m7 · Fa maj7 · Sol (sus)
  const chords = [
    [60, 64, 67, 71],
    [57, 60, 64, 67],
    [53, 57, 60, 64],
    [55, 59, 62, 67]
  ];
  const pattern = [0, 1, 2, 3, 2, 1, 2, 3];
  const melody = [76, null, 74, null, 72, null, 71, 72, 72, null, 71, null, 69, null, 67, null,
                  69, null, 72, null, 76, null, 74, null, 74, null, 72, null, 71, null, null, null];
  const EIGHTH = 0.42;

  function makeReverb() {
    const len = actx.sampleRate * 3;
    const buf = actx.createBuffer(2, len, actx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const data = buf.getChannelData(c);
      for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
    const conv = actx.createConvolver();
    conv.buffer = buf;
    return conv;
  }

  function bell(freq, time, vol, dur = 2.2) {
    const o1 = actx.createOscillator();
    const o2 = actx.createOscillator();
    const g = actx.createGain();
    o1.type = "sine";
    o2.type = "sine";
    o1.frequency.value = freq;
    o2.frequency.value = freq * 2.01;
    const g2 = actx.createGain();
    g2.gain.value = 0.25;
    o1.connect(g);
    o2.connect(g2).connect(g);
    g.connect(master);
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(vol, time + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    o1.start(time); o2.start(time);
    o1.stop(time + dur); o2.stop(time + dur);
  }

  function pad(freq, time, dur) {
    const o = actx.createOscillator();
    const g = actx.createGain();
    o.type = "triangle";
    o.frequency.value = freq;
    o.connect(g).connect(master);
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(0.05, time + 1.2);
    g.gain.linearRampToValueAtTime(0, time + dur);
    o.start(time);
    o.stop(time + dur + 0.1);
  }

  function scheduler() {
    while (nextTime < actx.currentTime + 0.6) {
      const bar = Math.floor(step / 8) % 4;
      const chord = chords[bar];
      const i = step % 8;
      if (i === 0) {
        pad(midi(chord[0] - 12), nextTime, EIGHTH * 8);
        pad(midi(chord[2] - 12), nextTime, EIGHTH * 8);
      }
      bell(midi(chord[pattern[i]]), nextTime, 0.06);
      const m = melody[step % melody.length];
      if (m) bell(midi(m), nextTime, 0.1, 2.8);
      nextTime += EIGHTH;
      step++;
    }
  }

  function startSynth() {
    if (!actx) {
      actx = new (window.AudioContext || window.webkitAudioContext)();
      master = actx.createGain();
      master.gain.value = 0;
      const verb = makeReverb();
      const wet = actx.createGain();
      wet.gain.value = 0.45;
      master.connect(actx.destination);
      master.connect(verb).connect(wet).connect(actx.destination);
    }
    actx.resume();
    nextTime = actx.currentTime + 0.1;
    master.gain.cancelScheduledValues(actx.currentTime);
    master.gain.setValueAtTime(master.gain.value, actx.currentTime);
    master.gain.linearRampToValueAtTime(0.9, actx.currentTime + 2.5);
    clearInterval(timer);
    timer = setInterval(scheduler, 120);
    scheduler();
  }

  function stopSynth() {
    master.gain.linearRampToValueAtTime(0, actx.currentTime + 0.8);
    setTimeout(() => { clearInterval(timer); actx.suspend(); }, 900);
  }

  // ---------- YouTube ----------
  // Saca el id del video de cualquier tipo de link (watch, youtu.be, shorts, embed)
  function youtubeId(url) {
    if (!url) return null;
    const s = url.trim();
    if (/^[\w-]{11}$/.test(s)) return s;
    const m = s.match(/(?:v=|youtu\.be\/|embed\/|shorts\/|live\/)([\w-]{11})/);
    return m ? m[1] : null;
  }

  const ytId = youtubeId(CONFIG.youtube);
  let yt = null;          // reproductor
  let ytReady = false;
  let ytFailed = !ytId;
  let ytWantsPlay = false;
  let ytWatchdog;

  function ytFadeIn() {
    const target = CONFIG.youtubeVolumen ?? 70;
    let v = 0;
    yt.setVolume(0);
    const iv = setInterval(() => {
      v = Math.min(target, v + 4);
      try { yt.setVolume(v); } catch (e) {}
      if (v >= target) clearInterval(iv);
    }, 100);
  }

  function ytFallback() {
    if (mode === "fallback-done") return;
    ytFailed = true;
    clearTimeout(ytWatchdog);
    if (playing) { mode = null; play(); }
  }

  function ytPlayNow() {
    yt.seekTo(CONFIG.youtubeInicio || 0, true);
    yt.playVideo();
    // Si en 6 segundos no está sonando (bloqueado, sin internet…), usamos el respaldo
    clearTimeout(ytWatchdog);
    ytWatchdog = setTimeout(() => {
      if (yt.getPlayerState() !== YT.PlayerState.PLAYING) ytFallback();
    }, 6000);
  }

  // El reproductor se prepara apenas carga la página, oculto,
  // para que al tocar el sobre empiece al instante
  function prepareYouTube() {
    if (!ytId) return;
    const holder = document.createElement("div");
    holder.id = "ytPlayer";
    holder.setAttribute("aria-hidden", "true");
    holder.style.cssText =
      "position:fixed;width:200px;height:200px;left:-9999px;top:0;opacity:0;pointer-events:none;";
    document.body.appendChild(holder);

    window.onYouTubeIframeAPIReady = () => {
      yt = new YT.Player("ytPlayer", {
        videoId: ytId,
        width: 200,
        height: 200,
        playerVars: {
          autoplay: 0, controls: 0, disablekb: 1, fs: 0, playsinline: 1,
          rel: 0, start: CONFIG.youtubeInicio || 0,
          loop: 1, playlist: ytId // así se repite en bucle
        },
        events: {
          onReady: () => {
            ytReady = true;
            if (ytWantsPlay && playing) ytPlayNow();
          },
          onStateChange: e => {
            if (e.data === YT.PlayerState.PLAYING) {
              clearTimeout(ytWatchdog);
              if (mode !== "youtube") { mode = "youtube"; ytFadeIn(); }
            }
            if (e.data === YT.PlayerState.ENDED && playing) ytPlayNow();
          },
          // Video privado, borrado o que no permite incrustarse
          onError: ytFallback
        }
      });
    };

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    tag.onerror = () => { ytFailed = true; };
    document.head.appendChild(tag);
  }
  prepareYouTube();

  // ---------- API ----------
  async function play() {
    if (!ytFailed) {
      playing = true;
      if (mode === "youtube" && yt) { yt.playVideo(); ytFadeIn(); return; }
      if (ytReady) ytPlayNow();
      else {
        ytWantsPlay = true;
        // Si la API ni siquiera carga en 8 s, respaldo
        clearTimeout(ytWatchdog);
        ytWatchdog = setTimeout(() => { if (!ytReady) ytFallback(); }, 8000);
      }
      return;
    }
    if (mode !== "synth") {
      try {
        audio.volume = 0;
        await audio.play();
        mode = "file";
        fadeAudio(0.7, 2500);
        playing = true;
        return;
      } catch (e) {
        mode = "synth";
      }
    }
    startSynth();
    playing = true;
  }

  function pause() {
    if (mode === "youtube" && yt) yt.pauseVideo();
    else if (mode === "file") fadeAudio(0, 700);
    else if (mode === "synth") stopSynth();
    playing = false;
  }

  return {
    play,
    toggle() { playing ? pause() : play(); return !playing; },
    get playing() { return playing; }
  };
})();
