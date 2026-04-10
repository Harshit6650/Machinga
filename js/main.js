'use strict';

// ══════════════════════════════════════════════════════════════════════════════
//  Machinga — main.js
//  Canvas image-sequence (1078 WebP @ 24fps) + state-machine scroll.
//
//  FIXES:
//  • Animation does NOT auto-play — waits for user's first scroll
//  • Green dot / progress activates only on first scroll
//  • Canvas uses contain-scaling so it looks correct on any screen size
// ══════════════════════════════════════════════════════════════════════════════

const FPS         = 24;
const FRAME_COUNT = 1079;

function t2f(sec) {
    return Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(sec * FPS) - 1));
}

// ── State Machine definition ──────────────────────────────────────────────────
const STATES = [
    { type: 'play-once', startF: t2f(0.0),  endF: t2f(5.4),   triggerPx: 70,  greenPulse: false, label: null },
    { type: 'transition',startF: t2f(5.4),  endF: t2f(10.5),  fps: Math.round(FPS * 1.6), label: 'Expanding' },
    { type: 'loop',      startF: t2f(10.5), endF: t2f(13.93), triggerPx: 200, greenPulse: true,  label: 'Think' },
    { type: 'transition',startF: t2f(13.93),endF: t2f(17.0),  fps: Math.round(FPS * 1.6), label: '' },
    { type: 'loop',      startF: t2f(17.0), endF: t2f(19.30), triggerPx: 200, greenPulse: true,  label: 'Make' },
    { type: 'transition',startF: t2f(19.30),endF: t2f(24.88), fps: Math.round(FPS * 1.6), label: '' },
    { type: 'loop',      startF: t2f(24.88),endF: t2f(26.93), triggerPx: 200, greenPulse: true,  label: 'Run' },
    { type: 'transition',startF: t2f(26.93),endF: t2f(29.5),  fps: Math.round(FPS * 1.6), label: '' },
    { type: 'pause',     holdF:  t2f(30.0), triggerPx: 350,   greenPulse: false, label: 'Think · Make · Run' },
    { type: 'transition',startF: t2f(30.0), endF: t2f(43.0),  fps: Math.round(FPS * 1.6), label: 'The Machinga Method' },
    { type: 'pause',     holdF:  t2f(43.0), triggerPx: 400,   greenPulse: false, label: 'The Machinga Method' },
    { type: 'exit' },
];

const VIDEO_DURATION_F = FRAME_COUNT - 1;

// ── DOM ───────────────────────────────────────────────────────────────────────
const canvas       = document.getElementById('hero-canvas');
const ctx          = canvas.getContext('2d');
const videoSection = document.getElementById('video-section');
const railEl       = document.getElementById('progress-rail');
const chapterLabel = document.getElementById('chapter-label');
const dwellEl      = document.getElementById('dwell-indicator');
const contWrap     = document.getElementById('continue-wrap');
const contFill     = document.getElementById('continue-fill');
const contLabelEl  = document.getElementById('continue-label');
const transLabelEl = document.getElementById('transition-label');
const progressFill = document.getElementById('progress-bar-fill');
const loaderScreen = document.getElementById('loader-screen');
const loaderBar    = document.getElementById('loader-progress');
const loaderPct    = document.getElementById('loader-percentage');
const siteHeader   = document.querySelector('.site-header');

// Explicitly force loader video to play for harsh mobile browsers
const loaderVideo  = document.querySelector('.loader-video');
if (loaderVideo) {
    loaderVideo.play().catch(e => console.warn('Autoplay blocked:', e));
}

// ══════════════════════════════════════════════════════════════════════════════
//  RESPONSIVE CANVAS — contain-scale to any screen
// ══════════════════════════════════════════════════════════════════════════════
function resizeCanvas() {
    canvas.width  = videoSection.clientWidth  || window.innerWidth;
    canvas.height = videoSection.clientHeight || window.innerHeight;
    // Re-render whatever frame we're on
    if (typeof currentDisplayFrame === 'number') renderFrame(currentDisplayFrame);
}

window.addEventListener('resize', resizeCanvas);
// Size is set after images load (so we know natural dimensions)

// ── Canvas render  (contain-scaling — letterboxes on any aspect ratio) ────────
let currentDisplayFrame = 0;

function renderFrame(idx) {
    idx = Math.max(0, Math.min(FRAME_COUNT - 1, Math.floor(idx)));
    currentDisplayFrame = idx;

    const img = images[idx];
    if (!img || !img.complete || !img.naturalWidth) return;

    const cw = canvas.width,  ch = canvas.height;
    const iw = img.naturalWidth, ih = img.naturalHeight;

    // We have an 80px fixed header. We want to draw the image in the safe area below it
    const headerHeight = 80;
    const safeAreaHeight = ch - headerHeight;

    // Contain scaling (letterbox) against the safe area so the full frame is visible
    const scale = Math.min(cw / iw, safeAreaHeight / ih);
    const sw    = iw * scale;
    const sh    = ih * scale;
    const sx    = (cw - sw) / 2;
    // Center it vertically inside the safe area, offset by the header height
    const sy    = headerHeight + (safeAreaHeight - sh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, sx, sy, sw, sh);
}

// ══════════════════════════════════════════════════════════════════════════════
//  IMAGE PRELOADER
// ══════════════════════════════════════════════════════════════════════════════
const images = new Array(FRAME_COUNT);
let loadedCount = 0;
let allLoaded   = false;

function setLoaderProgress(pct) {
    const p = Math.min(100, Math.round(pct));
    if (loaderBar) loaderBar.style.width = p + '%';
    if (loaderPct) loaderPct.textContent  = p + '%';
}

function onAllLoaded() {
    allLoaded = true;
    setLoaderProgress(100);

    // Set canvas to viewport size before first render
    resizeCanvas();

    // Render first frame (frame 0 — static hold before user scrolls)
    renderFrame(0);

    // Hide loader
    setTimeout(() => {
        if (!loaderScreen) return;
        loaderScreen.style.opacity       = '0';
        loaderScreen.style.pointerEvents = 'none';
        setTimeout(() => {
            loaderScreen.style.display = 'none';
            // Lock page scroll and show "scroll to begin" — but DON'T start animation yet
            showScrollToBegin();
        }, 580);
    }, 200);
}

for (let i = 0; i < FRAME_COUNT; i++) {
    const img  = new Image();
    const name = String(i + 1).padStart(5, '0');
    // Important: GitHub Pages is Case-Sensitive! The folder on disk is PencilBombFrames
    img.onload = img.onerror = () => {
        loadedCount++;
        setLoaderProgress((loadedCount / FRAME_COUNT) * 100);
        if (loadedCount === FRAME_COUNT) onAllLoaded();
    };
    img.src   = `./assets/PencilBombFrames/${name}.webp`;
    images[i] = img;
}

// ══════════════════════════════════════════════════════════════════════════════
//  PROGRESS RAIL — clickable dots
// ══════════════════════════════════════════════════════════════════════════════
const railDotEls = [];
const railSegEls = [];

for (let i = 0; i < STATES.length; i++) {
    const s = STATES[i];
    if (s.type === 'exit') break;

    const dur = Math.max(4, Math.round(
        ((s.holdF ?? s.endF ?? 0) - (s.holdF ?? s.startF ?? 0)) / FPS * 14
    ));

    const seg = document.createElement('div');
    seg.className = 'rail-seg';
    seg.style.flex = String(Math.max(4, dur));
    seg.dataset.stateIdx = i;
    railEl.appendChild(seg);
    railSegEls.push({ el: seg, stateIdx: i });

    if (s.type === 'loop' || s.type === 'pause' || s.type === 'play-once') {
        const dot = document.createElement('div');
        dot.className = 'rail-dot';
        dot.title = s.label || '';
        dot.dataset.stateIdx = i;

        dot.addEventListener('click', () => {
            if (!allLoaded) return;
            if (!videoModeActive) {
                videoSection.scrollIntoView({ behavior: 'instant' });
                requestAnimationFrame(() => {
                    waitingForFirstScroll = false;
                    enterVideoMode();
                    jumpToState(i);
                });
            } else {
                jumpToState(i);
            }
        });

        railEl.appendChild(dot);
        railDotEls.push({ el: dot, stateIdx: i });
    }
}
const trail = document.createElement('div');
trail.className = 'rail-seg';
trail.style.flex = '16';
railEl.appendChild(trail);

// ══════════════════════════════════════════════════════════════════════════════
//  STATE
// ══════════════════════════════════════════════════════════════════════════════
let stateIdx             = 0;
let scrollAccum          = 0;
let videoModeActive      = false;
let playOnceDone         = false;
let waitingForFirstScroll = true;   // ← NEW: hold until user scrolls

let transInterval  = null;
let loopInterval   = null;
let loopCurrentF   = 0;
let transCurrentF  = 0;
let isReversing    = false;   // ← NEW: flag to block input while reversing

// ══════════════════════════════════════════════════════════════════════════════
//  PRE-ENTRY: show the section locked, prompt user to scroll
// ══════════════════════════════════════════════════════════════════════════════
function showScrollToBegin() {
    videoModeActive = true;
    waitingForFirstScroll = true;
    isReversing = false;

    // Lock body scroll
    document.body.style.overflow = 'hidden';
    videoSection.scrollIntoView({ behavior: 'instant' });

    // Show "Scroll to begin" hint in the bottom bar
    if (contLabelEl) contLabelEl.textContent = 'Scroll to begin';
    contFill.style.width = '0%';
    contWrap.classList.add('visible');

    // Rail dots: none active yet
    railDotEls.forEach(({ el }) => { el.classList.remove('active', 'done'); });
    railSegEls.forEach(({ el }) => { el.classList.remove('done', 'current'); });
}

// ══════════════════════════════════════════════════════════════════════════════
//  PLAYBACK HELPERS
// ══════════════════════════════════════════════════════════════════════════════
function clearPlayback() {
    if (transInterval) { clearInterval(transInterval); transInterval = null; }
    if (loopInterval)  { clearInterval(loopInterval);  loopInterval  = null; }
}

function startTransition(s) {
    clearPlayback();
    isReversing = false;
    transCurrentF = s.startF;
    renderFrame(transCurrentF);
    const ms = 1000 / (s.fps || FPS);
    transInterval = setInterval(() => {
        transCurrentF++;
        renderFrame(transCurrentF);
        if (transCurrentF >= s.endF) {
            clearInterval(transInterval);
            transInterval = null;
            advanceState();
        }
    }, ms);
}

function startLoop(s) {
    clearPlayback();
    loopCurrentF = s.startF;
    renderFrame(loopCurrentF);
    const ms = 1000 / FPS;
    loopInterval = setInterval(() => {
        loopCurrentF++;
        if (loopCurrentF > s.endF) loopCurrentF = s.startF;
        renderFrame(loopCurrentF);
    }, ms);
}

function startPlayOnce(s) {
    clearPlayback();
    playOnceDone = false;
    loopCurrentF = s.startF;
    renderFrame(loopCurrentF);
    const ms = 1000 / FPS;
    loopInterval = setInterval(() => {
        loopCurrentF++;
        if (loopCurrentF >= s.endF) {
            clearInterval(loopInterval);
            loopInterval = null;
            loopCurrentF = s.endF;
            renderFrame(loopCurrentF);
            playOnceDone = true;
        } else {
            renderFrame(loopCurrentF);
        }
    }, ms);
}

// ══════════════════════════════════════════════════════════════════════════════
//  STATE MACHINE
// ══════════════════════════════════════════════════════════════════════════════
function loadState(idx) {
    const s = STATES[idx];
    scrollAccum  = 0;
    playOnceDone = false;
    isReversing  = false;
    clearPlayback();
    updateUI(idx);

    if      (s.type === 'play-once')   startPlayOnce(s);
    else if (s.type === 'loop')        startLoop(s);
    else if (s.type === 'transition')  startTransition(s);
    else if (s.type === 'pause') {
        renderFrame(s.holdF);
        playOnceDone = true;
    }
}

function jumpToState(idx) {
    stateIdx = idx;
    loadState(idx);
}

function advanceState() {
    const nextIdx = stateIdx + 1;
    const next    = STATES[nextIdx];
    if (!next || next.type === 'exit') { exitVideoMode(); return; }
    stateIdx = nextIdx;
    loadState(stateIdx);
}

function retreatState() {
    const prevIdx = stateIdx - 2;
    if (prevIdx < 0) return; // Cannot go back further than 0

    const transState = STATES[stateIdx - 1]; // The transition linking the previous state to the current one
    stateIdx = prevIdx; // Target the previous interactive state
    isReversing = true; // Block inputs during rewind

    clearPlayback();
    updateUI(stateIdx); // Pre-update UI to show we are going backward
    
    // Hide continue prompt temporarily
    contWrap.classList.remove('visible');

    transCurrentF = transState.endF;
    renderFrame(transCurrentF);
    
    const ms = 1000 / (transState.fps || FPS);
    transInterval = setInterval(() => {
        transCurrentF--; // Play backwards
        renderFrame(transCurrentF);
        if (transCurrentF <= transState.startF) {
            clearInterval(transInterval);
            transInterval = null;
            isReversing = false;
            loadState(stateIdx);
        }
    }, ms);
}

function enterVideoMode(fromBottom = false) {
    if (videoModeActive) return;
    if (!allLoaded) return;
    
    if (fromBottom) {
        videoModeActive = true;
        waitingForFirstScroll = false;
        isReversing = false;

        document.body.style.overflow = 'hidden';
        videoSection.scrollIntoView({ behavior: 'instant' });

        // Target the last valid interactive state before exit (the final pause or loop)
        stateIdx = STATES.length - 2;
        loadState(stateIdx);
    } else {
        showScrollToBegin();
    }
}

function exitVideoMode() {
    videoModeActive      = false;
    waitingForFirstScroll = true;
    isReversing          = false;
    clearPlayback();
    document.body.style.overflow = '';
    const marquee = document.querySelector('.marquee-section');
    if (marquee) marquee.scrollIntoView({ behavior: 'smooth' });
}

// ══════════════════════════════════════════════════════════════════════════════
//  UI UPDATE
// ══════════════════════════════════════════════════════════════════════════════
function updateUI(idx) {
    const s = STATES[idx];
    if (!s || s.type === 'exit') return;

    const isInteractive = s.type !== 'transition';
    chapterLabel.textContent = s.label || '';

    s.greenPulse ? dwellEl.classList.add('visible') : dwellEl.classList.remove('visible');
    isInteractive && !isReversing ? contWrap.classList.add('visible') : contWrap.classList.remove('visible');
    contFill.style.width = '0%';

    // Restore normal "scroll to continue" label
    if (contLabelEl) contLabelEl.textContent = 'Scroll to continue';

    if (s.type === 'transition' && s.label) {
        transLabelEl.textContent = s.label;
        transLabelEl.classList.add('visible');
    } else {
        transLabelEl.classList.remove('visible');
    }

    railDotEls.forEach(({ el, stateIdx: si }) => {
        el.classList.toggle('active', si === idx);
        el.classList.toggle('done',   si < idx);
    });
    railSegEls.forEach(({ el, stateIdx: si }) => {
        el.classList.toggle('done',    si < idx);
        el.classList.toggle('current', si === idx);
    });

    const refF = s.holdF ?? s.startF ?? 0;
    progressFill.style.width = ((refF / VIDEO_DURATION_F) * 100).toFixed(1) + '%';
}

// rAF: update continue-fill smoothly
function rafLoop() {
    requestAnimationFrame(rafLoop);
    if (!videoModeActive || waitingForFirstScroll || isReversing) return;
    const s = STATES[stateIdx];
    if (!s || s.type === 'exit' || s.type === 'transition') return;
    if (s.type === 'play-once' && !playOnceDone) return;
    contFill.style.width = (Math.min(1, scrollAccum / s.triggerPx) * 100).toFixed(1) + '%';
}
rafLoop();

// ══════════════════════════════════════════════════════════════════════════════
//  SCROLL / INPUT HANDLING
// ══════════════════════════════════════════════════════════════════════════════
function handleScrollDelta(dy) {
    if (!videoModeActive) return;
    if (isReversing) return;

    // ── FIRST SCROLL: start the animation ────────────────────────────────────
    if (waitingForFirstScroll) {
        if (dy <= 0) return;            // ignore reverse scroll before start
        waitingForFirstScroll = false;
        stateIdx = 0;
        loadState(0);                   // NOW start play-once + activate dot
        return;
    }

    const s = STATES[stateIdx];
    if (!s || s.type === 'transition') return;
    if (s.type === 'play-once' && !playOnceDone) return;

    // ── BACKWARDS SCROLL
    if (dy < 0) { 
        scrollAccum += dy;
        // Require a slight threshold (-80px) backwards scroll before triggering rewind
        if (scrollAccum < -80 && stateIdx >= 2) {
            scrollAccum = 0;
            retreatState();
        } else if (scrollAccum < 0) {
            scrollAccum = 0; // Cap at 0 if haven't passed the threshold
        }
        return; 
    }

    // ── FORWARDS SCROLL
    scrollAccum += dy;
    if (scrollAccum >= s.triggerPx) advanceState();
}

window.addEventListener('wheel', (e) => {
    if (!videoModeActive) return;
    e.preventDefault();
    handleScrollDelta(e.deltaY);
}, { passive: false });

let lastTouchY = 0;
window.addEventListener('touchstart', (e) => {
    if (videoModeActive) lastTouchY = e.touches[0].clientY;
}, { passive: true });
window.addEventListener('touchmove', (e) => {
    if (!videoModeActive) return;
    e.preventDefault();
    handleScrollDelta(lastTouchY - e.touches[0].clientY);
    lastTouchY = e.touches[0].clientY;
}, { passive: false });

window.addEventListener('keydown', (e) => {
    if (!videoModeActive) return;
    const STEP = 55;
    if (['ArrowDown','ArrowRight',' '].includes(e.key)) { e.preventDefault(); handleScrollDelta(STEP); }
    else if (['ArrowUp','ArrowLeft'].includes(e.key))   { e.preventDefault(); handleScrollDelta(-STEP); }
});

// ══════════════════════════════════════════════════════════════════════════════
//  INTERSECTION OBSERVER — enter when section scrolls into view
// ══════════════════════════════════════════════════════════════════════════════
const videoObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.45 && !videoModeActive && allLoaded) {
            // Check if top of section is above the viewport (meaning we scrolled up from below it)
            const fromBottom = entry.boundingClientRect.top < 0;
            enterVideoMode(fromBottom);
        }
    }
}, { threshold: 0.45 });
videoObserver.observe(videoSection);

// ══════════════════════════════════════════════════════════════════════════════
//  HEADER HIDE ON SCROLL (post-video sections)
// ══════════════════════════════════════════════════════════════════════════════
let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
    if (videoModeActive) return;
    if (!siteHeader) return;
    const cur = window.scrollY;
    if (cur > 80 && cur > lastScrollY) siteHeader.classList.add('header-hidden');
    else if (cur < lastScrollY)        siteHeader.classList.remove('header-hidden');
    lastScrollY = cur;
});

// ══════════════════════════════════════════════════════════════════════════════
//  FADE-IN — content sections
// ══════════════════════════════════════════════════════════════════════════════
const fadeObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity   = 1;
            entry.target.style.transform = 'translateY(0)';
            obs.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.statement-section h2, .pricing-card, .belief-item').forEach(el => {
    el.style.opacity    = 0;
    el.style.transform  = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    fadeObserver.observe(el);
});

// ══════════════════════════════════════════════════════════════════════════════
//  WIND OVERLAY
// ══════════════════════════════════════════════════════════════════════════════
(function initWind() {
    const WIND = {
        width: 3840, height: 2160, fps: 24, seed: 42,
        nStreaksBg: 52,   streakSpdLo: 140, streakSpdHi: 290,
        streakLenLo: 120, streakLenHi: 380, streakAlpLo: 28, streakAlpHi: 72,
        streakColor: [155, 165, 172],
        nStreaksFg: 10, fgAlpLo: 7,  fgAlpHi: 16,
        nParticles: 65, partSpdLo: 210, partSpdHi: 430,
        partWLo: 4, partWHi: 10, partHLo: 22, partHHi: 58,
        partAlpLo: 20, partAlpHi: 58, partGrayLo: 142, partGrayHi: 172,
        nShimmerArcs: 4, shimmerBaseA: 42, noseFracX: 0.500, noseFracY: 0.905,
    };

    function makePRNG(seed) {
        let s = seed >>> 0;
        return {
            next() {
                s = (s + 0x6D2B79F5) >>> 0;
                let t = Math.imul(s ^ (s >>> 15), 1 | s);
                t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
                return ((t ^ (t >>> 14)) >>> 0) / 0x100000000;
            },
            int(lo, hi)   { return (lo + Math.floor(this.next() * (hi - lo))) | 0; },
            float(lo, hi) { return lo + this.next() * (hi - lo); },
        };
    }

    function buildParticles(cfg) {
        const { width: W, height: H } = cfg;
        const rng = makePRNG(cfg.seed), ss = H / 2160;
        const xl=(W*.02)|0, xr=(W*.98)|0, xl5=(W*.05)|0, xr5=(W*.95)|0;
        const bgStreaks = Array.from({ length: cfg.nStreaksBg }, () => ({
            x: rng.int(xl,xr), y0: rng.int(0,H),
            spd: rng.float(cfg.streakSpdLo,cfg.streakSpdHi)*ss,
            len: rng.int((cfg.streakLenLo*ss)|0,(cfg.streakLenHi*ss)|0),
            alp: rng.int(cfg.streakAlpLo,cfg.streakAlpHi), drift: rng.int(-8,8),
        }));
        const fgStreaks = Array.from({ length: cfg.nStreaksFg }, () => ({
            x: rng.int(xl5,xr5), y0: rng.int(0,H),
            spd: rng.float(cfg.streakSpdLo,cfg.streakSpdHi*1.2)*ss,
            len: rng.int((cfg.streakLenLo*ss)|0,(cfg.streakLenHi*ss)|0),
            alp: rng.int(cfg.fgAlpLo,cfg.fgAlpHi), drift: rng.int(-6,6),
        }));
        const particles = Array.from({ length: cfg.nParticles }, () => ({
            x: rng.int(xl,xr), y0: rng.int(0,H),
            spd: rng.float(cfg.partSpdLo,cfg.partSpdHi)*ss,
            rw: rng.int(cfg.partWLo,cfg.partWHi)/2, rh: rng.int(cfg.partHLo,cfg.partHHi)/2,
            alp: rng.int(cfg.partAlpLo,cfg.partAlpHi)/255, gray: rng.int(cfg.partGrayLo,cfg.partGrayHi),
        }));
        return { bgStreaks, fgStreaks, particles };
    }

    function ds(c,s,fi,H,rgb) {
        const [r,g,b]=rgb,yT=((s.y0-fi*s.spd)%H+H)%H,yB=Math.min(yT+s.len,H);
        c.strokeStyle=`rgba(${r},${g},${b},${s.alp/255})`;c.lineWidth=2;c.lineCap='round';
        c.beginPath();c.moveTo(s.x,yT);c.lineTo(s.x+s.drift,yB);c.stroke();
        const w=yT+s.len-H;if(w>0){c.beginPath();c.moveTo(s.x,0);c.lineTo(s.x+s.drift,w);c.stroke();}
    }
    function dp(c,p,fi,H) {
        const cy=((p.y0-fi*p.spd)%H+H)%H,g=p.gray;
        const grd=c.createLinearGradient(p.x,cy-p.rh,p.x,cy+p.rh);
        grd.addColorStop(0,`rgba(${g+12},${g+16},${g+12},0)`);
        grd.addColorStop(.3,`rgba(${g},${g+4},${g+2},${p.alp})`);
        grd.addColorStop(.7,`rgba(${g},${g+4},${g+2},${p.alp})`);
        grd.addColorStop(1,`rgba(${g+8},${g+12},${g+8},0)`);
        c.beginPath();c.ellipse(p.x,cy,p.rw,p.rh,0,0,Math.PI*2);c.fillStyle=grd;c.fill();
    }
    function dsh(c,nx,ny,cfg) {
        for(let j=0;j<cfg.nShimmerArcs;j++){
            const sp=55+j*70,dp2=30+j*40,yo=30+j*48,al=Math.max(8,cfg.shimmerBaseA-j*9)/255,lw=Math.max(1,3-j);
            c.strokeStyle=`rgba(215,220,212,${al})`;c.lineWidth=lw;c.lineCap='round';
            c.beginPath();c.moveTo(nx,ny+yo);c.lineTo(nx-sp,ny+yo+dp2);c.stroke();
            c.beginPath();c.moveTo(nx,ny+yo);c.lineTo(nx+sp,ny+yo+dp2);c.stroke();
            c.beginPath();c.arc(nx,ny+yo,18+j*6,Math.PI*.17,Math.PI*.83);c.stroke();
        }
    }

    const wc = document.getElementById('wind-canvas');
    if (!wc) return;
    wc.width = WIND.width; wc.height = WIND.height;
    const wCtx = wc.getContext('2d', { alpha: true });
    const sys  = buildParticles(WIND);
    let fi = 0, wLast = 0;
    const wInt = 1000 / WIND.fps;

    function windFrame(ts) {
        if (ts - wLast < wInt * 0.9) { requestAnimationFrame(windFrame); return; }
        wLast = ts;
        wCtx.clearRect(0, 0, WIND.width, WIND.height);
        for (const s of sys.bgStreaks) ds(wCtx,s,fi,WIND.height,WIND.streakColor);
        for (const p of sys.particles) dp(wCtx,p,fi,WIND.height);
        dsh(wCtx, WIND.noseFracX*WIND.width, WIND.noseFracY*WIND.height, WIND);
        for (const s of sys.fgStreaks) ds(wCtx,s,fi,WIND.height,WIND.streakColor);
        fi++;
        requestAnimationFrame(windFrame);
    }
    requestAnimationFrame(windFrame);
})();
