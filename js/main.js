/* =========================================================
   FLUJO PRINCIPAL: sobre → carta → fecha → cielo
   ========================================================= */
(() => {
  const $ = id => document.getElementById(id);
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  const envelope = $("envelope");
  const letterText = $("letterText");
  const letterSign = $("letterSign");
  const letterAsk = $("letterAsk");
  const musicBtn = $("musicBtn");

  let opened = false;
  let skipTyping = false;
  let letterDone = false;

  function show(id) {
    document.querySelectorAll(".scene").forEach(s => s.classList.toggle("active", s.id === id));
    document.body.dataset.scene = id;
  }

  // Corazones que suben lentamente
  function spawnHearts() {
    const box = $("hearts");
    const glyphs = ["♥", "♡", "✦"];
    for (let i = 0; i < 18; i++) {
      const s = document.createElement("span");
      s.textContent = glyphs[i % glyphs.length];
      s.style.left = Math.random() * 100 + "vw";
      s.style.fontSize = 10 + Math.random() * 16 + "px";
      s.style.animationDuration = 9 + Math.random() * 10 + "s";
      s.style.animationDelay = -Math.random() * 18 + "s";
      s.style.opacity = 0.25 + Math.random() * 0.45;
      box.appendChild(s);
    }
  }

  async function typeWriter(el, text, speed) {
    el.classList.add("typing");
    for (let i = 0; i < text.length; i++) {
      if (skipTyping) { el.textContent = text; break; }
      el.textContent = text.slice(0, i + 1);
      const ch = text[i];
      await sleep(ch === "," ? speed * 6 : ch === "." ? speed * 10 : speed);
    }
    el.classList.remove("typing");
  }

  async function writeLetter() {
    await sleep(900);
    await typeWriter(letterText, CONFIG.frase, 42);
    await sleep(skipTyping ? 200 : 700);
    letterSign.textContent = CONFIG.firma;
    letterSign.classList.add("show");
    await sleep(skipTyping ? 400 : 1600);
    $("askText").textContent = CONFIG.pregunta;
    letterAsk.classList.add("show");
    letterDone = true;
  }

  function openEnvelope() {
    if (opened) return;
    opened = true;
    Music.play();
    musicBtn.hidden = false;
    envelope.classList.add("open");
    setTimeout(() => {
      show("scene-letter");
      writeLetter();
    }, 1700);
  }

  envelope.addEventListener("click", openEnvelope);
  envelope.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openEnvelope(); }
  });

  // Tocar la carta mientras se escribe la completa de golpe
  $("letter").addEventListener("click", e => {
    if (!letterDone && !e.target.closest("form")) skipTyping = true;
  });

  musicBtn.addEventListener("click", () => {
    const willPlay = Music.toggle();
    musicBtn.classList.toggle("paused", !willPlay);
  });

  // Fecha → cielo
  $("dateForm").addEventListener("submit", async e => {
    e.preventDefault();
    const val = $("dateInput").value;
    const err = $("dateError");
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(val);
    if (!m) { err.textContent = "Esa fecha no la entiendo, ¿la revisas?"; return; }
    const [y, mo, d] = [+m[1], +m[2], +m[3]];
    if (y < 1900 || y > 2100) { err.textContent = "Elige una fecha entre 1900 y 2100."; return; }
    err.textContent = "";

    $("letter").classList.add("leaving");
    await sleep(900);

    const fecha = new Intl.DateTimeFormat("es", {
      day: "numeric", month: "long", year: "numeric", timeZone: "UTC"
    }).format(new Date(Date.UTC(y, mo - 1, d)));

    $("skyDate").textContent = fecha;
    $("skyMsg").textContent = CONFIG.mensajeCielo;
    $("skyPlace").textContent = `${CONFIG.lugar.nombre} · ${String(CONFIG.hora).padStart(2, "0")}:00`;

    Sky.showDate(y, mo, d);
    show("scene-sky");
  });

  $("againBtn").addEventListener("click", () => {
    $("letter").classList.remove("leaving");
    show("scene-letter");
  });

  document.body.dataset.scene = "scene-envelope";
  spawnHearts();
  Sky.start();
})();
