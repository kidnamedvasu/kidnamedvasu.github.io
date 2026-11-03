// =====================================================
//  PORTFOLIO v2 — YourName Edits
//  JavaScript: All interactions & animations
// =====================================================

'use strict';

/* ─────────────────────────────────────────────────────
   LOADER — resilient: doesn't depend on CDN fonts/icons
   Uses DOMContentLoaded (fires as soon as HTML+local CSS
   are parsed, WITHOUT waiting for Google Fonts / FA CDN)
   Plus a hard 4s fallback so it ALWAYS dismisses.
   ───────────────────────────────────────────────────── */
let _loaderDone = false;

function dismissLoader() {
  if (_loaderDone) return;
  _loaderDone = true;
  const loader = document.getElementById('loader');
  if (loader) loader.classList.add('out');
  initCounters();
  initVideoAutoplay();
}

// Primary: 1.2s after DOM is parsed (does NOT wait for CDN)
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(dismissLoader, 1200);
});

// Secondary: also try when everything loads (in case DOMContentLoaded already fired)
window.addEventListener('load', () => {
  setTimeout(dismissLoader, 1200);
});

// Hard fallback: dismiss after 2.2s NO MATTER WHAT
setTimeout(dismissLoader, 2200);

/* ─────────────────────────────────────────────────────
   CUSTOM CURSOR
   ───────────────────────────────────────────────────── */
const cursorDot   = document.getElementById('cursorDot');
const cursorRing  = document.getElementById('cursorRing');
const cursorWatch = document.getElementById('cursorWatch');

let mx = 0, my = 0, rx = 0, ry = 0, wx = 0, wy = 0;

window.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  // Dot follows instantly
  cursorDot.style.left  = mx + 'px';
  cursorDot.style.top   = my + 'px';
});

// Ring & watch cursor smoothly lag behind
(function followCursors() {
  rx += (mx - rx) * 0.14;
  ry += (my - ry) * 0.14;
  cursorRing.style.left = rx + 'px';
  cursorRing.style.top  = ry + 'px';

  wx += (mx - wx) * 0.12;
  wy += (my - wy) * 0.12;
  cursorWatch.style.left = wx + 'px';
  cursorWatch.style.top  = wy + 'px';

  requestAnimationFrame(followCursors);
})();

// Ring hover state (regular interactive elements)
document.querySelectorAll('a, button, .cat-item, .svc-card, .f-btn').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
});

// WATCH cursor on video cards (Selected Work only — client work is pure view-only)
const videoCards = document.querySelectorAll('.portfolio .video-card');
videoCards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    cursorWatch.classList.add('visible');
    cursorRing.classList.add('expanding-watch');
    cursorDot.style.opacity  = '0';
  });
  card.addEventListener('mouseleave', () => {
    cursorWatch.classList.remove('visible');
    cursorRing.classList.remove('expanding-watch');
    cursorDot.style.opacity  = '1';
  });
});

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
  cursorDot.style.opacity   = '0';
  cursorRing.style.opacity  = '0';
  cursorWatch.classList.remove('visible');
});
document.addEventListener('mouseenter', () => {
  cursorDot.style.opacity  = '1';
  cursorRing.style.opacity = '1';
});

/* ─────────────────────────────────────────────────────
   NAVBAR — scroll + active link
   ───────────────────────────────────────────────────── */
/* ─────────────────────────────────────────────────────
   GLOBAL ELEMENT REFERENCES
   ───────────────────────────────────────────────────── */
const navbar            = document.getElementById('navbar');
const navLinks          = document.querySelectorAll('.nav-link');
const navScrollProgress = document.getElementById('navScrollProgress');
const sections          = ['hero', 'about', 'cubeSection', 'clientWorkSection', 'brands', 'contact'];

const heroSection       = document.getElementById('hero');
const nleTimeline       = document.getElementById('nleTimeline');
const nlePlayhead       = document.getElementById('nlePlayhead');
const nleTimecode       = document.getElementById('nleTimecode');

const clientSection        = document.getElementById('clientWorkSection');
const clientTrackContainer = document.getElementById('clientTrackContainer');
const clientTrack          = document.getElementById('clientReelTrack');
const clientCards          = document.querySelectorAll('.client-reel-card');

window.addEventListener('scroll', handleScroll, { passive: true });

function handleScroll() {
  const sy = window.scrollY;

  // Sticky style
  if (navbar) navbar.classList.toggle('scrolled', sy > 60);

  // Active link
  let current = '';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && sy >= el.offsetTop - 140) current = id;
  });
  navLinks.forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === '#' + current);
  });

  // Brutalist navbar scroll loading line (0% -> 100%)
  if (navScrollProgress) {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (sy / docHeight) * 100 : 0;
    navScrollProgress.style.width = Math.min(100, Math.max(0, progress)) + '%';
  }

  // NLE timeline playhead
  if (typeof updateTimeline === 'function') updateTimeline(sy);

  // Client work horizontal scroll
  if (typeof updateClientHorizontalScroll === 'function') updateClientHorizontalScroll(sy);
}

/* ─────────────────────────────────────────────────────
   HAMBURGER MOBILE MENU
   ───────────────────────────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  const [s0,s1,s2] = hamburger.querySelectorAll('span');
  if (open) {
    s0.style.transform = 'translateY(6.5px) rotate(45deg)';
    s1.style.opacity   = '0';
    s2.style.transform = 'translateY(-6.5px) rotate(-45deg)';
  } else {
    s0.style.transform = s1.style.opacity = s2.style.transform = '';
  }
});

document.querySelectorAll('.mob-link').forEach(l => {
  l.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    const [s0,s1,s2] = hamburger.querySelectorAll('span');
    s0.style.transform = s1.style.opacity = s2.style.transform = '';
  });
});

/* ─────────────────────────────────────────────────────
   SMOOTH SCROLL
   ───────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    try {
      const target = document.querySelector(href);
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    } catch (_) {}
  });
});

/* ─────────────────────────────────────────────────────
   SCROLL REVEAL (IntersectionObserver)
   ───────────────────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.02, rootMargin: '100px 0px 100px 0px' });

revealEls.forEach(el => revealObs.observe(el));

// Immediate safety check: reveal elements already in view
function checkInitialReveals() {
  const vh = window.innerHeight;
  revealEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < vh + 150) {
      el.classList.add('in');
    }
  });
}
checkInitialReveals();
window.addEventListener('load', checkInitialReveals);
setTimeout(checkInitialReveals, 300);

/* ─────────────────────────────────────────────────────
   COUNTER ANIMATION
   ───────────────────────────────────────────────────── */
function initCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const step     = target / (duration / 16);
    let cur = 0;
    const t = setInterval(() => {
      cur += step;
      if (cur >= target) { cur = target; clearInterval(t); }
      el.textContent = Math.floor(cur);
    }, 16);
  });
}

/* ─────────────────────────────────────────────────────
   NLE TIMELINE — playhead moves with scroll
   ───────────────────────────────────────────────────── */

// Build ruler tick marks
(function buildRuler() {
  const ruler = document.getElementById('rulerMarks');
  if (!ruler) return;
  for (let i = 0; i <= 100; i++) {
    const tick = document.createElement('div');
    tick.style.cssText = `
      position:absolute; bottom:0; left:${i}%;
      width:1px; height:${i % 10 === 0 ? '10px' : (i % 5 === 0 ? '6px' : '3px')};
      background:rgba(255,255,255,${i % 10 === 0 ? '0.3' : '0.12'});
    `;
    ruler.appendChild(tick);
    if (i % 10 === 0) {
      const label = document.createElement('span');
      label.textContent = (i / 10).toString().padStart(2,'0') + 's';
      label.style.cssText = `
        position:absolute; left:${i}%; bottom:10px;
        font-family:'Montserrat',sans-serif; font-size:0.42rem;
        color:rgba(255,255,255,0.2); transform:translateX(-50%);
        letter-spacing:1px;
      `;
      ruler.appendChild(label);
    }
  }
})();

function updateTimeline(scrollY) {
  if (!heroSection || !nlePlayhead) return;
  const heroH = heroSection.offsetHeight;
  const prog  = Math.min(1, Math.max(0, scrollY / heroH));

  // Move playhead
  nlePlayhead.style.transform = `translateX(calc(${prog * 100}% - 1px))`;

  // Update timecode (simulate 30 fps, total ~30 seconds)
  const totalSec = 30;
  const elapsed  = prog * totalSec;
  const ss  = Math.floor(elapsed);
  const ff  = Math.floor((elapsed - ss) * 30);
  const mm  = Math.floor(ss / 60);
  const s   = ss % 60;
  nleTimecode.textContent =
    '00:' +
    String(mm).padStart(2,'0') + ':' +
    String(s).padStart(2,'0')  + ':' +
    String(ff).padStart(2,'0');

  // Fade out timeline as hero scrolls away
  const fade = 1 - Math.max(0, prog - 0.7) / 0.3;
  document.getElementById('nleTimeline').style.opacity = fade;
}

/* ─────────────────────────────────────────────────────
   CLIENT WORK — HORIZONTAL SCROLL REELS
   Moves linearly as the user scrolls through the section.
   The card closest to viewport center resizes larger (focus).
   ───────────────────────────────────────────────────── */

let clientAudioActive = false;
let currentFocusedVideo = null;

const btnClientAudio   = document.getElementById('btnClientAudio');
const clientAudioIcon  = document.getElementById('clientAudioIcon');
const clientAudioLabel = document.getElementById('clientAudioLabel');

if (btnClientAudio) {
  btnClientAudio.addEventListener('click', () => {
    clientAudioActive = !clientAudioActive;
    btnClientAudio.classList.toggle('is-unmuted', clientAudioActive);

    if (clientAudioActive) {
      if (clientAudioIcon) clientAudioIcon.className = 'fa-solid fa-volume-high';
      if (clientAudioLabel) clientAudioLabel.textContent = 'SOUND: ON [TAP TO MUTE]';
      // Unmute currently focused reel
      if (currentFocusedVideo) {
        currentFocusedVideo.muted = false;
        currentFocusedVideo.play().catch(() => {});
      }
    } else {
      if (clientAudioIcon) clientAudioIcon.className = 'fa-solid fa-volume-xmark';
      if (clientAudioLabel) clientAudioLabel.textContent = 'SOUND: OFF [CLICK TO UNMUTE]';
      // Mute all client reels
      clientCards.forEach(c => {
        const v = c.querySelector('video');
        if (v) v.muted = true;
      });
    }
  });

  btnClientAudio.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
  btnClientAudio.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
}

/* ─────────────────────────────────────────────────────
   CLIENT REELS CAROUSEL: TOUCH SWIPE, DRAG & ARROW NAV
   ───────────────────────────────────────────────────── */
const btnClientPrev = document.getElementById('btnClientPrev');
const btnClientNext = document.getElementById('btnClientNext');

if (btnClientPrev && clientTrackContainer) {
  btnClientPrev.addEventListener('click', () => {
    const card = clientCards[0];
    const shift = card ? card.offsetWidth + 25 : 280;
    clientTrackContainer.scrollBy({ left: -shift, behavior: 'smooth' });
  });
  if (typeof cursorRing !== 'undefined') {
    btnClientPrev.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
    btnClientPrev.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
  }
}

if (btnClientNext && clientTrackContainer) {
  btnClientNext.addEventListener('click', () => {
    const card = clientCards[0];
    const shift = card ? card.offsetWidth + 25 : 280;
    clientTrackContainer.scrollBy({ left: shift, behavior: 'smooth' });
  });
  if (typeof cursorRing !== 'undefined') {
    btnClientNext.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
    btnClientNext.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
  }
}

// Mouse drag-to-scroll for desktop users
let isClientDragging = false;
let clientStartX = 0;
let clientScrollLeft = 0;

if (clientTrackContainer) {
  clientTrackContainer.addEventListener('mousedown', (e) => {
    isClientDragging = true;
    clientTrackContainer.style.scrollBehavior = 'auto';
    clientStartX = e.pageX - clientTrackContainer.offsetLeft;
    clientScrollLeft = clientTrackContainer.scrollLeft;
  });

  window.addEventListener('mouseup', () => {
    if (isClientDragging) {
      isClientDragging = false;
      if (clientTrackContainer) clientTrackContainer.style.scrollBehavior = 'smooth';
    }
  });

  clientTrackContainer.addEventListener('mouseleave', () => {
    isClientDragging = false;
    clientTrackContainer.style.scrollBehavior = 'smooth';
  });

  clientTrackContainer.addEventListener('mousemove', (e) => {
    if (!isClientDragging) return;
    e.preventDefault();
    const x = e.pageX - clientTrackContainer.offsetLeft;
    const walk = (x - clientStartX) * 1.5;
    clientTrackContainer.scrollLeft = clientScrollLeft - walk;
  });

  // Reel focus and audio update on scroll
  clientTrackContainer.addEventListener('scroll', updateFocusedReelCard, { passive: true });
}

function updateFocusedReelCard() {
  if (!clientTrackContainer || !clientCards.length) return;

  const containerRect = clientTrackContainer.getBoundingClientRect();
  const screenCenter = containerRect.left + containerRect.width / 2;

  let closestCard = null;
  let minDistance = Infinity;

  clientCards.forEach(card => {
    const cRect = card.getBoundingClientRect();
    const cardCenter = cRect.left + cRect.width / 2;
    const dist = Math.abs(cardCenter - screenCenter);

    if (dist < minDistance) {
      minDistance = dist;
      closestCard = card;
    }
  });

  clientCards.forEach(card => {
    const vid = card.querySelector('video');
    if (card === closestCard && minDistance < card.offsetWidth * 0.9) {
      card.classList.add('is-focused');
      currentFocusedVideo = vid;
      if (clientAudioActive && vid) {
        vid.muted = false;
      }
    } else {
      card.classList.remove('is-focused');
      if (vid && vid !== currentFocusedVideo) {
        vid.muted = true;
      }
    }
  });
}

function updateClientHorizontalScroll(scrollY) {
  // Kept for backward compatibility with window scroll listener
  updateFocusedReelCard();
}

// Initial calculation on load
setTimeout(updateFocusedReelCard, 150);

/* ─────────────────────────────────────────────────────
   PARALLAX ORBS (hero mouse move)
   ───────────────────────────────────────────────────── */
const orbs = document.querySelectorAll('.orb');

if (heroSection) {
  heroSection.addEventListener('mousemove', e => {
    const rect = heroSection.getBoundingClientRect();
    const xp   = (e.clientX - rect.left) / rect.width  - 0.5;
    const yp   = (e.clientY - rect.top)  / rect.height - 0.5;
    orbs.forEach((orb, i) => {
      const f = (i + 1) * 22;
      orb.style.transform = `translate(${xp * f}px, ${yp * f}px)`;
    });
  });
}

/* ─────────────────────────────────────────────────────
   PARTICLE TRAIL & AMBIENT SOUL MOTES (Hollow Knight Atmosphere)
   ───────────────────────────────────────────────────── */
const canvas = document.createElement('canvas');
canvas.style.cssText =
  'position:fixed;inset:0;pointer-events:none;z-index:9996;opacity:0.65;';
document.body.appendChild(canvas);
const pCtx = canvas.getContext('2d');
let particles = [];

// Continuous ambient soul motes floating in Hallownest atmosphere
const ambientMotes = [];
for (let i = 0; i < 40; i++) {
  ambientMotes.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 2.2 + 0.6,
    alpha: Math.random() * 0.5 + 0.2,
    baseAlpha: Math.random() * 0.5 + 0.2,
    speedY: Math.random() * 0.45 + 0.15,
    driftX: (Math.random() - 0.5) * 0.25,
    pulse: Math.random() * Math.PI * 2
  });
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

window.addEventListener('mousemove', e => {
  if (Math.random() > 0.5) {
    particles.push({
      x: e.clientX, y: e.clientY,
      r: Math.random() * 2.8 + 0.8,
      alpha: 0.75,
      vx: (Math.random() - 0.5) * 1.6,
      vy: (Math.random() - 0.5) * 1.6 - 0.5,
      color: Math.random() > 0.35 ? '103,232,249' : '224,242,254' // Soul cyan & pale white
    });
  }
  if (particles.length > 90) particles.shift();
});

(function drawParticles() {
  pCtx.clearRect(0, 0, canvas.width, canvas.height);

  // 1. Draw ambient soul motes
  ambientMotes.forEach(m => {
    m.pulse += 0.02;
    m.alpha = m.baseAlpha + Math.sin(m.pulse) * 0.18;
    pCtx.beginPath();
    pCtx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
    pCtx.fillStyle = `rgba(103,232,249,${Math.max(0.08, m.alpha)})`;
    pCtx.shadowBlur = 8;
    pCtx.shadowColor = 'rgba(103,232,249,0.7)';
    pCtx.fill();
    pCtx.shadowBlur = 0;

    m.y -= m.speedY;
    m.x += m.driftX;
    if (m.y < -10) { m.y = canvas.height + 10; m.x = Math.random() * canvas.width; }
    if (m.x < -10) m.x = canvas.width + 10;
    if (m.x > canvas.width + 10) m.x = -10;
  });

  // 2. Draw cursor sparkle particles
  particles = particles.filter(p => p.alpha > 0.02);
  particles.forEach(p => {
    pCtx.beginPath();
    pCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    pCtx.fillStyle = `rgba(${p.color},${p.alpha})`;
    pCtx.shadowBlur = 10;
    pCtx.shadowColor = `rgba(${p.color},0.8)`;
    pCtx.fill();
    pCtx.shadowBlur = 0;
    p.x += p.vx; p.y += p.vy;
    p.alpha *= 0.92; p.r *= 0.96;
  });

  requestAnimationFrame(drawParticles);
})();

/* ─────────────────────────────────────────────────────
   3D CUBE — Stationary by default, moves ONLY on user interaction
   ───────────────────────────────────────────────────── */
const cubeStage = document.getElementById('cubeStage');
const cube3d    = document.getElementById('cube3d');
const catItems  = document.querySelectorAll('.cat-item');

// Face rotations (rotateX, rotateY) to bring each face forward
const faceAngles = [
  { rx: -18, ry:   0 },   // 0: front (Simple Reels)
  { rx: -18, ry: 180 },   // 1: back (Motion Graphics)
  { rx: -18, ry:  90 },   // 2: right (UGC)
  { rx: -18, ry: -90 },   // 3: left (3D Camera)
  { rx: -90, ry:   0 },   // 4: top (Personal Projs)
  { rx:  90, ry:   0 },   // 5: bottom (Short-Form)
];

let isDragging = false;
let dragDistance = 0;
let startX = 0, startY = 0;
// Stays stationary at default angles
let currentRX = -18, currentRY = 25;
let targetRX  = -18, targetRY  = 25;

// Render loop: smoothly lerps ONLY to user drag or selection (no auto-spinning)
(function animateCube() {
  currentRX += (targetRX - currentRX) * 0.12;
  currentRY += (targetRY - currentRY) * 0.12;
  if (cube3d) {
    cube3d.style.transform = `rotateX(${currentRX}deg) rotateY(${currentRY}deg)`;
  }
  requestAnimationFrame(animateCube);
})();

// Mouse drag
if (cubeStage) {
  cubeStage.addEventListener('mousedown', e => {
    isDragging = true;
    dragDistance = 0;
    startX = e.clientX;
    startY = e.clientY;
    cubeStage.style.cursor = 'grabbing';
  });

  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    dragDistance += Math.abs(dx) + Math.abs(dy);
    targetRY += dx * 0.45;
    targetRX = Math.max(-80, Math.min(80, targetRX - dy * 0.35));
    startX = e.clientX;
    startY = e.clientY;
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    cubeStage.style.cursor = 'grab';
  });

  // Touch drag for mobile
  cubeStage.addEventListener('touchstart', e => {
    isDragging = true;
    dragDistance = 0;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  cubeStage.addEventListener('touchmove', e => {
    if (!isDragging) return;
    const dx = e.touches[0].clientX - startX;
    const dy = e.touches[0].clientY - startY;
    dragDistance += Math.abs(dx) + Math.abs(dy);
    targetRY += dx * 0.45;
    targetRX = Math.max(-80, Math.min(80, targetRX - dy * 0.35));
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  cubeStage.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Subtle 1-time tilt sway on initial scroll into view (never auto-spins)
  let cubeIntroTriggered = false;
  const cubeSectionEl = document.getElementById('cubeSection');
  if (cubeSectionEl) {
    const cubeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !cubeIntroTriggered && dragDistance === 0) {
          cubeIntroTriggered = true;
          targetRY += 30; // subtle hint tilt
          setTimeout(() => {
            if (dragDistance === 0) targetRY -= 30; // restore position
          }, 950);
          cubeObserver.unobserve(cubeSectionEl);
        }
      });
    }, { threshold: 0.25 });
    cubeObserver.observe(cubeSectionEl);
  }
}

/* ─────────────────────────────────────────────────────
   CATEGORY SHOWCASE FULLSCREEN MODAL
   ───────────────────────────────────────────────────── */
const categoryModal    = document.getElementById('categoryModal');
const catModalBackdrop = document.getElementById('catModalBackdrop');
const btnBackPortfolio = document.getElementById('btnBackPortfolio');
const catModalBadge    = document.getElementById('catModalBadge');
const catModalTitle    = document.getElementById('catModalTitle');
const catModalDesc     = document.getElementById('catModalDesc');
const catModalGrid     = document.getElementById('catModalGrid');

// Curated collections for each editing style (Exact aspect ratios & Click-to-play with sound)
const categoryData = {
  simple: {
    badge: 'STYLE ARCHIVE / 01',
    title: 'Simple Reels',
    desc: 'Clean, retention-focused edits built with precise jump-cuts, narrative hooks, and natural pacing.',
    reels: [
      {
        src: 'videos/simple-reels/Mcg R5 E10.mp4',
        aspect: '9 / 16',
        tag: 'HOOK & RETENTION',
        title: 'Talking Head Cut',
        desc: 'Punchy jump cuts, subtle zooms, and crisp pacing that keeps viewers glued.'
      },
      {
        src: 'videos/simple-reels/Neety Podcast Teaser Final.mp4',
        aspect: '9 / 16',
        tag: 'PODCAST HOOK',
        title: 'Neety Podcast Teaser',
        desc: 'Dynamic teaser cut with dialogue highlights and cinematic background rhythm.'
      },
      {
        src: 'videos/simple-reels/Video-8560.mp4',
        aspect: '9 / 16',
        tag: 'RETENTION CUT',
        title: 'Viral Reel Flow',
        desc: 'Pattern interrupts and sound accents designed to stop the scroll.'
      }
    ]
  },
  motion: {
    badge: 'STYLE ARCHIVE / 02',
    title: 'Motion Graphics',
    desc: 'High-energy typography, animated kinetic callouts, dynamic HUD overlays, and graphic assets.',
    reels: [
      {
        src: 'videos/motion-graphics/brain2.mp4',
        aspect: '9 / 16',
        tag: 'KINETIC MOTION',
        title: 'Brain Motion Graphic',
        desc: 'Custom animated graphics, kinetic speed ramps, and bold visual branding.'
      },
      {
        src: 'videos/motion-graphics/gayrev.mp4',
        aspect: '9 / 16',
        tag: 'EXPLAINER MOTION',
        title: 'Visual Identity Motion',
        desc: 'Vector asset animations, timeline callouts, and smooth graphic transitions.'
      },
      {
        src: 'videos/motion-graphics/R_sample_e2.mp4',
        aspect: '9 / 16',
        tag: 'BRAND MOTION',
        title: 'Kinetic Energy Reel',
        desc: 'Sleek motion identity pieces designed for high short-form impact.'
      }
    ]
  },
  ugc: {
    badge: 'STYLE ARCHIVE / 03',
    title: 'UGC Content',
    desc: 'Authentic User Generated Content edits built for e-commerce, brands, and high conversion social ads.',
    reels: [
      {
        src: 'videos/ugc/Ayushi_atlas_e2.mp4',
        aspect: '9 / 16',
        tag: 'CONVERSION UGC',
        title: 'Ayushi Atlas Brand UGC',
        desc: 'High-converting UGC hook, problem/solution demonstration, and strong CTA.'
      },
      {
        src: 'videos/ugc/Video-2406.mp4',
        aspect: '9 / 16',
        tag: 'PRODUCT UNBOXING',
        title: 'Product UGC Demo',
        desc: 'Native social feel, organic cuts, and authentic demonstration flow.'
      },
      {
        src: 'videos/ugc/Video-64047.mp4',
        aspect: '9 / 16',
        tag: 'CREATOR UGC',
        title: 'Social UGC Testimonial',
        desc: 'Split screens, genuine creator delivery, and relatable pacing.'
      }
    ]
  },
  '3d': {
    badge: 'STYLE ARCHIVE / 04',
    title: '3D Camera',
    desc: 'Multi-plane spatial depth, parallax camera tracking, and dimensional motion.',
    reels: [
      {
        src: 'videos/3d-camera/lame timpala4.mp4',
        aspect: '1080 / 1430',
        tag: '3D CAMERA',
        title: 'Tame Impala 3D',
        desc: 'Multi-plane spatial depth, custom perspective passes, and dimensional camera movement.'
      },
      {
        src: 'videos/3d-camera/flashing lights.mp4',
        aspect: '1 / 1',
        tag: 'PARALLAX 2.5D',
        title: 'Flashing Lights',
        desc: 'Layer separation, simulated depth of field, and floating perspective tracking.'
      },
      {
        src: 'videos/3d-camera/jb.mp4',
        aspect: '1 / 1',
        tag: 'SPATIAL DEPTH',
        title: 'JB 3D Camera',
        desc: 'Simulated multi-angle camera orbit and floating dimensional elements.'
      }
    ]
  },
  personal: {
    badge: 'STYLE ARCHIVE / 05',
    title: 'Personal Projs',
    desc: 'Creative sandbox edits, mood boards, experimental color grades, and personal cinematic crafts.',
    reels: [
      {
        src: 'videos/personal-projs/lame timpala4.mp4',
        aspect: '1080 / 1430',
        tag: 'PERSONAL PROJ',
        title: 'Tame Impala Edit',
        desc: 'Rhythmic audio cuts, atmospheric grade, and mood-driven editorial flow.'
      },
      {
        src: 'videos/personal-projs/see you again.mp4',
        aspect: '1 / 1',
        tag: 'CREATIVE STUDY',
        title: 'See You Again',
        desc: 'Film grain textures, analog pacing, and evocative mood.'
      },
      {
        src: 'videos/personal-projs/attention watermarked.mov',
        aspect: '1440 / 1080',
        tag: 'CINEMATIC',
        title: 'Attention Visual',
        desc: 'High-impact narrative visual with soundscape synchronization.'
      }
    ]
  },
  shortform: {
    badge: 'STYLE ARCHIVE / 06',
    title: 'Short-Form',
    desc: 'Engineered for Instagram Reels, YouTube Shorts, and TikTok algorithms with maximum watch time.',
    reels: [
      {
        src: 'videos/short-form/Copy of vb_r10_e4.mp4',
        aspect: '9 / 16',
        tag: 'RETENTION SPIKE',
        title: 'Fast Short-Form Cut',
        desc: 'Pattern interrupts and high retention pacing designed for maximum completion rate.'
      },
      {
        src: 'videos/short-form/Copy Of Vb R9 E82.mp4',
        aspect: '9 / 16',
        tag: 'SEAMLESS LOOP',
        title: 'Viral Loop Short',
        desc: 'End-to-beginning audio and visual loop designed for repetitive replays.'
      },
      {
        src: 'videos/short-form/Copy of VB_V5_E6.mp4',
        aspect: '9 / 16',
        tag: 'SHORT-FORM EDIT',
        title: 'High Watchtime Reel',
        desc: 'Dynamic pacing, punch-ins, and retention hooks for vertical feeds.'
      }
    ]
  }
};

function openCategoryModal(catKey) {
  const data = categoryData[catKey] || categoryData.simple;
  if (!catModalBadge || !catModalTitle || !catModalDesc || !catModalGrid) return;

  catModalBadge.textContent = data.badge;
  catModalTitle.textContent = data.title;
  catModalDesc.textContent  = data.desc;

  catModalGrid.innerHTML = data.reels.map((reel, idx) => `
    <div class="cat-reel-card" data-idx="${idx}">
      <div class="cat-reel-video-wrap" style="aspect-ratio: ${reel.aspect || '9 / 16'};">
        <video playsinline webkit-playsinline disablepictureinpicture controlslist="nodownload noplaybackrate nofullscreen" loop preload="metadata" src="${reel.src}"></video>
        <div class="cat-reel-playing-indicator">
          <span class="pulse-dot"></span> NOW PLAYING
        </div>
        <div class="cat-reel-play-overlay">
          <div class="cat-play-bubble">
            <i class="fa-solid fa-play"></i>
          </div>
          <span class="cat-play-hint"><i class="fa-solid fa-volume-high"></i> TAP TO PLAY</span>
        </div>
      </div>
      <div class="cat-reel-info">
        <span class="cat-reel-tag">${reel.tag}</span>
        <h4 class="cat-reel-name">${reel.title}</h4>
        <p class="cat-reel-desc">${reel.desc}</p>
      </div>
    </div>
  `).join('');

  categoryModal.classList.add('is-open');
  categoryModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  // Ensure custom cursor stays on and reacts to modal interactive cards
  cursorDot.style.opacity  = '1';
  cursorRing.style.opacity = '1';

  // Attach Click-to-Play WITH SOUND handlers
  const cards = catModalGrid.querySelectorAll('.cat-reel-card');
  cards.forEach(card => {
    const video = card.querySelector('video');
    if (!video) return;

    card.addEventListener('click', () => {
      if (video.paused) {
        // Pause all other modal videos first so audio doesn't overlap
        catModalGrid.querySelectorAll('video').forEach(v => {
          if (v !== video) {
            v.pause();
            v.closest('.cat-reel-card').classList.remove('is-playing');
          }
        });
        video.muted = false; // PLAY WITH SOUND
        video.play().then(() => {
          card.classList.add('is-playing');
        }).catch(() => {
          video.muted = true;
          video.play();
          card.classList.add('is-playing');
        });
      } else {
        video.pause();
        card.classList.remove('is-playing');
      }
    });

    card.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
    card.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
  });
}

function closeCategoryModal() {
  if (!categoryModal) return;
  // Pause all videos and reset audio when closing modal
  catModalGrid.querySelectorAll('video').forEach(v => {
    v.pause();
    v.currentTime = 0;
  });
  catModalGrid.querySelectorAll('.cat-reel-card').forEach(c => c.classList.remove('is-playing'));
  categoryModal.classList.remove('is-open');
  categoryModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  cursorRing.classList.remove('hovering');
}

if (btnBackPortfolio) {
  btnBackPortfolio.addEventListener('click', closeCategoryModal);
  btnBackPortfolio.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
  btnBackPortfolio.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
}

const modalHireBtn = document.getElementById('modalHireBtn');
if (modalHireBtn) {
  modalHireBtn.addEventListener('click', e => {
    e.preventDefault();
    closeCategoryModal();
    const contactSec = document.getElementById('contact');
    if (contactSec) {
      setTimeout(() => {
        contactSec.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  });
  modalHireBtn.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
  modalHireBtn.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
}
if (catModalBackdrop) catModalBackdrop.addEventListener('click', closeCategoryModal);
window.addEventListener('keydown', e => {
  if (e.key === 'Escape' && categoryModal && categoryModal.classList.contains('is-open')) {
    closeCategoryModal();
  }
});

// Cube face click -> opens modal (only if not dragging)
const cubeFaces = document.querySelectorAll('.face');
cubeFaces.forEach(face => {
  face.addEventListener('click', () => {
    if (dragDistance > 12) return; // Ignore drag release
    const cat = face.dataset.category || 'simple';
    openCategoryModal(cat);
  });
});

// Category list — click to rotate cube AND open category modal
catItems.forEach(item => {
  item.addEventListener('click', () => {
    catItems.forEach(c => c.classList.remove('active'));
    item.classList.add('active');

    const faceIndex = parseInt(item.dataset.targetFace, 10);
    const angle     = faceAngles[faceIndex];

    targetRX = angle.rx;
    targetRY = angle.ry;

    const cat = item.dataset.category || 'simple';
    openCategoryModal(cat);
  });

  item.addEventListener('mouseenter', () => {
    const faceIndex = parseInt(item.dataset.targetFace, 10);
    const angle     = faceAngles[faceIndex];
    if (!isDragging) {
      targetRX = angle.rx;
      targetRY = angle.ry;
    }
  });
});

/* ─────────────────────────────────────────────────────
   PORTFOLIO FILTER
   ───────────────────────────────────────────────────── */
const fBtns   = document.querySelectorAll('.f-btn');
const portItems = document.querySelectorAll('.port-item');

fBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    fBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    portItems.forEach(item => {
      const cat = item.dataset.cat;
      const show = filter === 'all' || cat === filter;
      item.style.display = show ? '' : 'none';
      if (show) {
        item.classList.remove('in');
        requestAnimationFrame(() => requestAnimationFrame(() => item.classList.add('in')));
      }
    });
  });
});

/* ─────────────────────────────────────────────────────
   VIDEO AUTOPLAY (muted loop via IntersectionObserver)
   Handles <video> elements inside .video-wrap & .client-reel-wrap
   ───────────────────────────────────────────────────── */
function initVideoAutoplay() {
  const videos = document.querySelectorAll('.video-wrap video, .client-reel-wrap video');
  if (!videos.length) return;

  const vidObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.play().catch(() => {});  // catch autoplay policy errors gracefully
      } else {
        e.target.pause();
      }
    });
  }, { threshold: 0.25 });

  videos.forEach(v => {
    v.muted   = true;
    v.loop    = true;
    v.playsInline = true;
    vidObs.observe(v);
  });
}

/* ─────────────────────────────────────────────────────
   3D CARD TILT on portfolio cards
   ───────────────────────────────────────────────────── */
document.querySelectorAll('.port-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x    = (e.clientX - rect.left) / rect.width  - 0.5;
    const y    = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${-y*8}deg) rotateY(${x*8}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ─────────────────────────────────────────────────────
   SERVICE CARD hover spotlight
   ───────────────────────────────────────────────────── */
document.querySelectorAll('.svc-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const x  = e.clientX - r.left;
    const y  = e.clientY - r.top;
    card.style.background =
      `radial-gradient(circle at ${x}px ${y}px, rgba(56,189,248,0.07) 0%, rgba(255,255,255,0.025) 60%)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
});

/* ─────────────────────────────────────────────────────
   BRANDS GRID PROXIMITY INTERACTION
   Smoothly sizes up and highlights the nearest brand to the cursor
   while gently dimming the others at a calm, controlled pace.
   ───────────────────────────────────────────────────── */
const brandsGrid = document.getElementById('brandsGrid');
const brandBoxes = document.querySelectorAll('.brand-box');

if (brandsGrid && brandBoxes.length) {
  let proxThrottle = false;
  brandsGrid.addEventListener('mousemove', e => {
    if (proxThrottle) return;
    proxThrottle = true;
    requestAnimationFrame(() => { proxThrottle = false; });

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    let closestItem = null;
    let minDistance = Infinity;

    brandBoxes.forEach(item => {
      const rect = item.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dist = Math.hypot(mouseX - centerX, mouseY - centerY);

      if (dist < minDistance) {
        minDistance = dist;
        closestItem = item;
      }
    });

    // If cursor is within 190px of the closest item, smoothly activate it
    brandBoxes.forEach(item => {
      if (item === closestItem && minDistance < 190) {
        item.classList.add('is-proximate');
      } else {
        item.classList.remove('is-proximate');
      }
    });
  });

  brandsGrid.addEventListener('mouseleave', () => {
    brandBoxes.forEach(item => item.classList.remove('is-proximate'));
  });

  // Attach hover cursor state
  brandBoxes.forEach(item => {
    item.addEventListener('mouseenter', () => {
      if (cursorRing) cursorRing.classList.add('hovering');
    });
    item.addEventListener('mouseleave', () => {
      if (cursorRing) cursorRing.classList.remove('hovering');
    });
  });
}

/* ─────────────────────────────────────────────────────
   WINDOW RESIZE — recalculate things
   ───────────────────────────────────────────────────── */
window.addEventListener('resize', () => {
  resizeCanvas();
  updateClientHorizontalScroll(window.scrollY);
  updateTimeline(window.scrollY);
});

// Back to Top button
const btnBackToTop = document.getElementById('btnBackToTop');
if (btnBackToTop) {
  btnBackToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  btnBackToTop.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
  btnBackToTop.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
}

// Email copy & Write Mail buttons
const btnCopyEmail  = document.getElementById('btnCopyEmail');
const btnWriteMail  = document.getElementById('btnWriteMail');
const copyEmailText = document.getElementById('copyEmailText');
const brutalToast   = document.getElementById('brutalToast');

function showCopyToast() {
  if (!brutalToast) return;
  brutalToast.classList.add('show');
  setTimeout(() => {
    brutalToast.classList.remove('show');
  }, 2400);
}

if (btnCopyEmail) {
  btnCopyEmail.addEventListener('click', () => {
    const email = 'svasudevs98@gmail.com';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(() => {
        if (copyEmailText) copyEmailText.textContent = 'COPIED!';
        showCopyToast();
        setTimeout(() => {
          if (copyEmailText) copyEmailText.textContent = 'COPY';
        }, 2000);
      }).catch(() => fallbackCopyEmail(email));
    } else {
      fallbackCopyEmail(email);
    }
  });

  btnCopyEmail.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
  btnCopyEmail.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
}

function fallbackCopyEmail(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    if (copyEmailText) copyEmailText.textContent = 'COPIED!';
    showCopyToast();
    setTimeout(() => {
      if (copyEmailText) copyEmailText.textContent = 'COPY';
    }, 2000);
  } catch (_) {}
  document.body.removeChild(ta);
}

if (btnWriteMail) {
  btnWriteMail.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
  btnWriteMail.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
}

// Run initial calculations after all elements & functions are loaded
handleScroll();
checkInitialReveals();

// ─── DEV LOG ────────────────────────────────────────
console.log(
  '%c[ YE ] Portfolio v2 loaded 🎬',
  'color:#38bdf8;font-family:Montserrat,monospace;font-size:13px;font-weight:700;'
);

/*
  ═══════════════════════════════════════════════════════
  HOW TO ADD YOUR REAL VIDEOS
  ═══════════════════════════════════════════════════════

  OPTION A — Self-hosted (upload your .mp4 to GitHub repo)
  ─────────────────────────────────────────────────────────
  Create a /videos folder in your repo and upload your files.
  Then in index.html, inside the .video-wrap div, add:

    <video autoplay muted loop playsinline src="videos/your-file.mp4"></video>

  OPTION B — Google Drive
  ─────────────────────────────────────────────────────────
  1. Upload your video to Drive
  2. Right-click > Share > Anyone with the link can view
  3. Copy the file ID from the URL:
     https://drive.google.com/file/d/[FILE_ID_HERE]/view
  4. In index.html, replace the <video> with:

    <iframe src="https://drive.google.com/file/d/FILE_ID_HERE/preview"
            allow="autoplay" allowfullscreen></iframe>

  OPTION C — Instagram Videos
  ─────────────────────────────────────────────────────────
  Instagram embeds don't support autoplay/muted/loop.
  Best approach for portfolio:
  1. Download your video from Instagram (Settings > Your activity > Download your information)
  2. Upload to your GitHub repo or Google Drive
  3. Use Option A or B above

  ═══════════════════════════════════════════════════════
*/
