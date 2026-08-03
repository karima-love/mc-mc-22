/* =========================================================
   CONFIG & UTILS
========================================================= */
const CORRECT_DATE = "2023-11-22"; // The required romantic date
const START_DATE = new Date(2023, 10, 22, 0, 0, 0); // 22/11/2023

function vibrate(pattern) {
  if (navigator.vibrate) navigator.vibrate(pattern);
}

/* =========================================================
   PARTICLES (Optimized Generator)
========================================================= */
function spawnParticles(container, count, opts = {}) {
  const emojis = opts.emojis || null;
  const frag = document.createDocumentFragment();
  
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "particle";
    const size = Math.random() * (opts.maxSize || 8) + (opts.minSize || 3);
    el.style.left = Math.random() * 100 + "%";
    el.style.bottom = "-5%";
    el.style.width = size + "px";
    el.style.height = size + "px";
    el.style.animationDuration = (Math.random() * 12 + 10) + "s";
    el.style.animationDelay = (Math.random() * 10) + "s";
    
    if (emojis) {
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.background = "none";
      el.style.fontSize = size * 2 + "px";
      el.style.width = "auto"; el.style.height = "auto";
    } else {
      const colors = ["#FFFFFF", "#DCEFF7", "#F7D9DE", "#F4C4CE"];
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
    }
    frag.appendChild(el);
  }
  container.appendChild(frag);
}

spawnParticles(document.getElementById("lockParticles"), 20, { emojis: ["✨", "❤️", "🌸"] });

/* =========================================================
   LOCK SCREEN LOGIC (Date Picker Integration)
========================================================= */
const lockScreen = document.getElementById("lock-screen");
const site = document.getElementById("site");
const dateInput = document.getElementById("datePassword");
const pinError = document.getElementById("pinError");
const lockCard = document.querySelector(".lock-card");
const lockIcon = document.getElementById("lockIcon");
const unlockFlash = document.getElementById("unlockFlash");

dateInput.addEventListener("change", (e) => {
  const enteredDate = e.target.value;
  if (!enteredDate) return;

  if (enteredDate === CORRECT_DATE) {
    unlockSuccess();
  } else {
    pinError.classList.add("show");
    lockCard.classList.add("shake");
    vibrate([40, 30, 40]);
    
    setTimeout(() => {
      lockCard.classList.remove("shake");
      dateInput.value = "";
      setTimeout(() => pinError.classList.remove("show"), 1500);
    }, 450);
  }
});

function unlockSuccess() {
  lockIcon.textContent = "❤️";
  vibrate([30, 20, 30, 20, 60]);
  unlockFlash.classList.add("show");
  dateInput.blur(); // dismiss keyboard/picker on mobile
  
  setTimeout(() => {
    lockScreen.classList.add("unlocked");
    site.hidden = false;
    document.body.style.overflow = "auto";
    initSite();
  }, 700);
  
  setTimeout(() => {
    lockScreen.style.display = "none";
    unlockFlash.classList.remove("show");
  }, 2600);
}

/* =========================================================
   MAIN SITE INIT
========================================================= */
let siteInitialized = false;

function initSite() {
  if (siteInitialized) return;
  siteInitialized = true;

  spawnParticles(document.getElementById("siteParticles"), 30, { emojis: ["✨", "❤️", "🌸", "🦋"], maxSize: 10 });

  initCursorGlow();
  initMusic();
  initGSAP();
  initCounter();
  initGallery();
  initHugButton();
  initFutureCard();
  initFinalHeart();
  initThree();
}

/* =========================================================
   CURSOR GLOW (Smooth Lerp Optimization)
========================================================= */
function initCursorGlow() {
  const glow = document.getElementById("cursorGlow");
  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  let currentX = mouseX, currentY = mouseY;
  
  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  function animateCursor() {
    currentX += (mouseX - currentX) * 0.15;
    currentY += (mouseY - currentY) * 0.15;
    glow.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%,-50%)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
}

/* =========================================================
   MUSIC PLAYER
========================================================= */
function initMusic() {
  const audio = document.getElementById("bgMusic");
  const toggle = document.getElementById("musicToggle");
  const slider = document.getElementById("volumeSlider");
  audio.volume = parseFloat(slider.value);

  const tryPlay = () => {
    audio.play().then(() => { toggle.textContent = "🎵"; })
      .catch(() => { toggle.textContent = "🔈"; });
  };
  tryPlay();

  let playing = true;
  toggle.addEventListener("click", () => {
    if (playing) { audio.pause(); toggle.textContent = "🔈"; }
    else { audio.play(); toggle.textContent = "🎵"; }
    playing = !playing;
  });

  slider.addEventListener("input", () => { audio.volume = parseFloat(slider.value); });

  window.softenMusic = (soft) => {
    gsap.to(audio, { volume: soft ? Math.min(0.15, audio.volume) : parseFloat(slider.value), duration: 1.5, ease: "power2.out" });
  };
}

/* =========================================================
   GSAP SCROLL ANIMATIONS (Performance & Arabic Text Tuned)
========================================================= */
function initGSAP() {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll(".reveal").forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1.2, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 85%" }
    });
  });

  document.querySelectorAll(".quiet-moment").forEach((section) => {
    const lines = section.querySelectorAll(".reveal-line");
    ScrollTrigger.create({
      trigger: section,
      start: "top 60%",
      onEnter: () => {
        if (window.softenMusic) window.softenMusic(true);
        const tl = gsap.timeline();
        lines.forEach((line, i) => {
          tl.to(line, { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" }, i * 1.8)
            .to(line, { opacity: i === lines.length - 1 ? 1 : 0.2, duration: 1.2 }, i * 1.8 + 1.5);
        });
      },
      onLeave: () => { if (window.softenMusic) window.softenMusic(false); },
      onEnterBack: () => { if (window.softenMusic) window.softenMusic(true); },
      onLeaveBack: () => { if (window.softenMusic) window.softenMusic(false); }
    });
  });

  document.querySelectorAll(".for-her .reveal-line, .ending-section .reveal-line").forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1.2, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%" }
    });
  });

  const h1 = document.querySelector(".split-text");
  if (h1) {
    const text = h1.dataset.text;
    h1.innerHTML = "";
    
    // FIX: Split by words instead of characters to preserve Arabic cursive joining
    text.split(" ").forEach((word) => {
      const span = document.createElement("span");
      span.textContent = word + "\u00A0"; 
      span.style.opacity = 0;
      span.style.display = "inline-block";
      h1.appendChild(span);
    });
    
    gsap.to(h1.querySelectorAll("span"), {
      opacity: 1, 
      y: 0, 
      duration: 0.8, 
      stagger: 0.15, 
      delay: 0.3, 
      ease: "back.out(1.2)",
      from: { y: 20 }
    });
  }

  gsap.utils.toArray(".fade-in").forEach((el) => {
    gsap.fromTo(el, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 1.4, delay: 1.5, ease: "power2.out" });
  });
}

/* =========================================================
   LOVE COUNTER
========================================================= */
function initCounter() {
  const els = {
    years: document.getElementById("cYears"),
    months: document.getElementById("cMonths"),
    days: document.getElementById("cDays"),
    hours: document.getElementById("cHours"),
    mins: document.getElementById("cMins"),
    secs: document.getElementById("cSecs"),
  };

  function update() {
    const now = new Date();
    let years = now.getFullYear() - START_DATE.getFullYear();
    let months = now.getMonth() - START_DATE.getMonth();
    let days = now.getDate() - START_DATE.getDate();
    let hours = now.getHours() - START_DATE.getHours();
    let mins = now.getMinutes() - START_DATE.getMinutes();
    let secs = now.getSeconds() - START_DATE.getSeconds();

    if (secs < 0) { secs += 60; mins--; }
    if (mins < 0) { mins += 60; hours--; }
    if (hours < 0) { hours += 24; days--; }
    if (days < 0) {
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
      days += prevMonth; months--;
    }
    if (months < 0) { months += 12; years--; }

    els.years.textContent = years;
    els.months.textContent = months;
    els.days.textContent = days;
    els.hours.textContent = hours;
    els.mins.textContent = mins;
    els.secs.textContent = secs;
  }
  update();
  setInterval(update, 1000);
}

/* =========================================================
   GALLERY LIGHTBOX
========================================================= */
function initGallery() {
  const cards = document.querySelectorAll(".photo-card:not(.future-card)");
  const lightbox = document.createElement("div");
  lightbox.className = "overlay-message";
  lightbox.style.cursor = "pointer";
  lightbox.innerHTML = '<div id="lightboxContent" style="max-width:85vw;"></div>';
  document.body.appendChild(lightbox);

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const img = card.querySelector("img").src;
      const cap = card.dataset.caption;
      document.getElementById("lightboxContent").innerHTML =
        `<img src="${img}" style="max-width:100%;max-height:65vh;border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,0.15);">
         <p style="margin-top:20px;font-family:'Aref Ruqaa',serif;font-size:1.4rem;">${cap}</p>`;
      lightbox.classList.add("show");
    });
  });
  lightbox.addEventListener("click", () => lightbox.classList.remove("show"));
}

/* =========================================================
   FUTURE MEMORY CARD
========================================================= */
function initFutureCard() {
  const btn = document.getElementById("makeMemoryBtn");
  const overlay = document.getElementById("futureOverlay");
  btn.addEventListener("click", () => {
    launchHearts(60);
    document.getElementById("bgScene").style.filter = "saturate(1.2) brightness(1.05)";
    overlay.innerHTML = `<div>عشان أحلى صورنا لسه متصورتش...<br>وأحلى أيامنا لسه مستنيانا قدام.</div>`;
    overlay.classList.add("show");
    setTimeout(() => {
      overlay.classList.remove("show");
      document.getElementById("bgScene").style.filter = "";
    }, 4000);
  });
}

/* =========================================================
   HUG BUTTON
========================================================= */
function initHugButton() {
  const btn = document.getElementById("hugBtn");
  const overlay = document.getElementById("hugOverlay");
  btn.addEventListener("click", () => {
    vibrate([50, 30, 50, 30, 80]);
    launchHearts(100);
    document.getElementById("bgScene").style.filter = "saturate(1.3) brightness(1.1)";
    overlay.innerHTML = `<div>حضنك بالدنيا عندي دلوقتي...<br>خدي وقتك، أنا هنا جنبك ومش رايح في أي حتة ❤️</div>`;
    overlay.classList.add("show");
    setTimeout(() => {
      overlay.classList.remove("show");
      document.getElementById("bgScene").style.filter = "";
    }, 4500);
  });
}

/* =========================================================
   FINAL HEART EXPLOSION
========================================================= */
function initFinalHeart() {
  const heart = document.getElementById("finalHeart");
  heart.addEventListener("click", () => {
    vibrate([60, 40, 60, 40, 100]);
    launchHearts(180, true);
  });
}

/* =========================================================
   PARTICLE EXPLOSION (Ultra-Optimized Canvas for High DPI)
========================================================= */
const fxCanvas = document.getElementById("fxCanvas");
const fxCtx = fxCanvas.getContext("2d");
let isCanvasAnimating = false;
let globalParticles = []; 

function resizeFx() { 
  const dpr = window.devicePixelRatio || 1;
  fxCanvas.width = window.innerWidth * dpr; 
  fxCanvas.height = window.innerHeight * dpr;
  fxCtx.scale(dpr, dpr);
  fxCanvas.style.width = window.innerWidth + 'px';
  fxCanvas.style.height = window.innerHeight + 'px';
}
window.addEventListener("resize", resizeFx);
resizeFx();

// PERFORMANCE FIX: Pre-render emojis once, then use drawImage (10x faster than fillText)
const emojiCache = {};
function getEmojiImage(symbol, size) {
  const key = `${symbol}-${Math.round(size)}`;
  if (emojiCache[key]) return emojiCache[key];

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = size * 2.5; 
  canvas.height = size * 2.5;
  ctx.font = `${size}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(symbol, canvas.width / 2, canvas.height / 2);

  emojiCache[key] = canvas;
  return canvas;
}

function launchHearts(count, epic = false) {
  const symbols = epic ? ["❤️", "🦋", "🌸", "⭐", "🤍"] : ["❤️", "🌸", "✨"];
  const newParticles = [];
  
  for (let i = 0; i < count; i++) {
    newParticles.push({
      x: Math.random() * window.innerWidth,
      y: window.innerHeight + Math.random() * 100,
      vy: -(Math.random() * 4 + 3),
      vx: (Math.random() - 0.5) * 3,
      size: Math.random() * 22 + 16,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      life: 0,
      maxLife: Math.random() * 180 + 120
    });
  }

  globalParticles.push(...newParticles);

  if (!isCanvasAnimating) {
    isCanvasAnimating = true;
    requestAnimationFrame(animateHearts);
  }
}

function animateHearts() {
  fxCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  let activeParticles = [];
  
  globalParticles.forEach((p) => {
    if (p.life < p.maxLife) {
      p.x += p.vx; 
      p.y += p.vy; 
      p.life++;
      
      const opacity = 1 - (p.life / p.maxLife);
      fxCtx.globalAlpha = Math.max(opacity, 0);
      
      const img = getEmojiImage(p.symbol, p.size);
      fxCtx.drawImage(img, p.x - (img.width / 2), p.y - (img.height / 2));
      
      activeParticles.push(p); 
    }
  });
  
  globalParticles = activeParticles; 
  fxCtx.globalAlpha = 1;
  
  if (globalParticles.length > 0) {
    requestAnimationFrame(animateHearts);
  } else {
    fxCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    isCanvasAnimating = false;
  }
}

/* =========================================================
   THREE.JS (IntersectionObserver for Performance)
========================================================= */
function initThree() {
  const canvas = document.getElementById("threeCanvas");
  if (!window.THREE) return;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 12;

  const colors = [0xFFFFFF, 0xDCEFF7, 0xF7D9DE, 0xF4C4CE];
  const orbs = [];
  
  for (let i = 0; i < 15; i++) {
    const geo = new THREE.SphereGeometry(Math.random() * 0.4 + 0.15, 16, 16);
    const mat = new THREE.MeshBasicMaterial({
      color: colors[Math.floor(Math.random() * colors.length)],
      transparent: true, opacity: 0.35
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set((Math.random() - 0.5) * 16, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 8);
    scene.add(mesh);
    orbs.push({ mesh, speed: Math.random() * 0.002 + 0.001, offset: Math.random() * Math.PI * 2 });
  }

  let animationId;
  function animate() {
    animationId = requestAnimationFrame(animate);
    const t = Date.now() * 0.001;
    orbs.forEach((o) => {
      o.mesh.position.y += Math.sin(t * o.speed * 50 + o.offset) * 0.0015;
      o.mesh.position.x += Math.cos(t * o.speed * 40 + o.offset) * 0.001;
    });
    renderer.render(scene, camera);
  }

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      if (!animationId) animate();
    } else {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  });
  observer.observe(document.body);

  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }, { passive: true });
}