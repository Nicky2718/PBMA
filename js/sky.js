/* =========================================================
   CIELO: calcula la posición real de las estrellas para una
   fecha, hora y lugar, y las dibuja en el canvas.
   ========================================================= */
const Sky = (() => {
  const canvas = document.getElementById("sky");
  const ctx = canvas.getContext("2d");
  const RAD = Math.PI / 180;

  let w = 0, h = 0, dpr = 1, cx = 0, cy = 0, R = 0;
  let mode = "idle";       // "idle" (antes de la fecha) | "date"
  let baseMs = 0;          // instante UTC de la fecha elegida
  let startReal = 0;       // cuándo empezó a mostrarse
  const shooting = [];

  // Generador aleatorio con semilla: el fondo de estrellas
  // tenues siempre es el mismo y gira junto al cielo real
  function seeded(seed) {
    return () => {
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const rnd = seeded(140219);
  const faint = [];
  for (let i = 0; i < 900; i++) {
    faint.push({
      ra: rnd() * 24,
      dec: Math.asin(2 * rnd() - 1) / RAD,
      mag: 3.8 + rnd() * 2.6,
      phase: rnd() * Math.PI * 2,
      speed: 0.6 + rnd() * 2.2,
      pink: rnd() < 0.18
    });
  }

  // --- Astronomía básica ---
  function localSiderealDeg(ms) {
    const jd = ms / 86400000 + 2440587.5;
    const gmst = 280.46061837 + 360.98564736629 * (jd - 2451545);
    return (((gmst + CONFIG.lugar.lon) % 360) + 360) % 360;
  }

  function toAltAz(raH, decD, lstDeg, latD) {
    const H = (lstDeg - raH * 15) * RAD;
    const d = decD * RAD, p = latD * RAD;
    const alt = Math.asin(Math.sin(d) * Math.sin(p) + Math.cos(d) * Math.cos(p) * Math.cos(H));
    const az = Math.atan2(
      -Math.cos(d) * Math.sin(H),
      Math.sin(d) * Math.cos(p) - Math.cos(d) * Math.cos(H) * Math.sin(p)
    );
    return [alt, az];
  }

  // Proyección estereográfica mirando hacia arriba (norte arriba, este a la izquierda)
  function project(alt, az) {
    const r = R * Math.tan((Math.PI / 2 - alt) / 2);
    return [cx - r * Math.sin(az), cy - r * Math.cos(az)];
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx = w / 2;
    cy = h / 2;
    R = Math.hypot(w, h) / 2;
  }

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const ease = t => 1 - Math.pow(1 - t, 3);

  function drawBackground() {
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.05);
    g.addColorStop(0, "#130d18");
    g.addColorStop(0.65, "#0a0810");
    g.addColorStop(1, "#241019");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  function horizonFade(alt) {
    return clamp(alt / (10 * RAD), 0, 1);
  }

  function drawFaint(lst, t, dim) {
    const lat = CONFIG.lugar.lat;
    for (const s of faint) {
      const [alt, az] = toAltAz(s.ra, s.dec, lst, lat);
      if (alt < 0) continue;
      const [x, y] = project(alt, az);
      if (x < -5 || y < -5 || x > w + 5 || y > h + 5) continue;
      const tw = 0.55 + 0.45 * Math.sin(t * 0.001 * s.speed + s.phase);
      const a = tw * horizonFade(alt) * (6.6 - s.mag) / 3 * dim;
      const size = Math.max(0.4, (6.6 - s.mag) * 0.38);
      ctx.fillStyle = s.pink ? `rgba(255,200,220,${a})` : `rgba(255,255,255,${a})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawConstellations(lst, t, reveal) {
    const lat = CONFIG.lugar.lat;
    const pos = {};
    for (const id in STARS) {
      const [ra, dec, mag] = STARS[id];
      const [alt, az] = toAltAz(ra, dec, lst, lat);
      const [x, y] = project(alt, az);
      pos[id] = { x, y, alt, mag };
    }

    // Líneas: se dibujan poco a poco
    const lineP = ease(clamp((reveal - 1200) / 4000, 0, 1));
    ctx.lineWidth = 1;
    ctx.lineCap = "round";
    for (const c of CONSTELLATIONS) {
      for (const [a, b] of c.lines) {
        const A = pos[a], B = pos[b];
        if (!A || !B || A.alt < 0 || B.alt < 0) continue;
        const fade = Math.min(horizonFade(A.alt), horizonFade(B.alt));
        ctx.strokeStyle = `rgba(244,182,200,${0.42 * fade * lineP})`;
        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(A.x + (B.x - A.x) * lineP, A.y + (B.y - A.y) * lineP);
        ctx.stroke();
      }
    }

    // Estrellas brillantes con brillo suave
    const starP = ease(clamp(reveal / 1500, 0, 1));
    for (const id in pos) {
      const s = pos[id];
      if (s.alt < 0) continue;
      const tw = 0.85 + 0.15 * Math.sin(t * 0.002 + s.x * 0.05);
      const size = Math.max(1, 3.4 - s.mag * 0.62);
      const a = horizonFade(s.alt) * starP * tw;
      const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, size * 5);
      glow.addColorStop(0, `rgba(255,230,240,${0.55 * a})`);
      glow.addColorStop(1, "rgba(255,180,205,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(s.x, s.y, size * 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Nombres de las constelaciones
    const labelP = ease(clamp((reveal - 3500) / 2500, 0, 1));
    if (labelP <= 0) return;
    ctx.font = "italic 15px 'Cormorant Garamond', serif";
    ctx.textAlign = "center";
    for (const c of CONSTELLATIONS) {
      const ids = [...new Set(c.lines.flat())].filter(id => pos[id].alt > 5 * RAD);
      if (ids.length < 2) continue;
      let sx = 0, sy = 0, maxY = -Infinity;
      for (const id of ids) { sx += pos[id].x; sy += pos[id].y; maxY = Math.max(maxY, pos[id].y); }
      const x = sx / ids.length;
      const y = Math.min(maxY + 22, sy / ids.length + 40);
      if (x < 20 || x > w - 20 || y < 20 || y > h - 20) continue;
      ctx.fillStyle = `rgba(244,182,200,${0.7 * labelP})`;
      ctx.fillText(c.name, x, y);
    }
  }

  function drawShooting(t) {
    if (mode === "date" && Math.random() < 0.006 && shooting.length < 2) {
      const dir = Math.random() < 0.5 ? -1 : 1;
      shooting.push({
        x: w * (0.2 + Math.random() * 0.6), y: Math.random() * h * 0.45,
        vx: dir * (6 + Math.random() * 4), vy: 3 + Math.random() * 2.5,
        life: 0, max: 45 + Math.random() * 30
      });
    }
    for (let i = shooting.length - 1; i >= 0; i--) {
      const s = shooting[i];
      s.life++;
      s.x += s.vx; s.y += s.vy;
      const a = Math.sin((s.life / s.max) * Math.PI);
      const tail = 14;
      const g = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * tail, s.y - s.vy * tail);
      g.addColorStop(0, `rgba(255,255,255,${a})`);
      g.addColorStop(1, "rgba(244,182,200,0)");
      ctx.strokeStyle = g;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - s.vx * tail, s.y - s.vy * tail);
      ctx.stroke();
      if (s.life >= s.max) shooting.splice(i, 1);
    }
  }

  function frame(t) {
    const now = performance.now();
    let simMs, reveal = 0;
    if (mode === "date") {
      reveal = now - startReal;
      simMs = baseMs + reveal * CONFIG.velocidadCielo;
    } else {
      simMs = Date.now();
    }
    const lst = localSiderealDeg(simMs);

    drawBackground();
    drawFaint(lst, now, mode === "date" ? 1 : 0.55);
    if (mode === "date") drawConstellations(lst, now, reveal);
    drawShooting(now);

    requestAnimationFrame(frame);
  }

  return {
    start() {
      resize();
      window.addEventListener("resize", resize);
      requestAnimationFrame(frame);
    },
    // y, m, d de la fecha elegida → cielo de esa noche
    showDate(y, m, d) {
      baseMs = Date.UTC(y, m - 1, d, CONFIG.hora - CONFIG.lugar.utcOffset, 0, 0);
      startReal = performance.now();
      mode = "date";
    }
  };
})();
