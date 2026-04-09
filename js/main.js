document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------------
    // 1. Image Sequence Loader & Canvas Logic
    // --------------------------------------------------------
    const loaderScreen = document.getElementById('loader-screen');
    const loaderProgress = document.getElementById('loader-progress');
    const loaderPercentage = document.getElementById('loader-percentage');
    
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const context = canvas.getContext('2d');
        const heroSection = document.getElementById('hero-scroll');
        
        const frameCount = 1078;
        const images = [];
        let loadedCount = 0;
        
        // Dynamically adjust scroll height so the sequence scales properly to 1078 frames.
        // Approx 18px of scroll duration per frame, making it super smooth.
        heroSection.style.height = `${frameCount * 18}px`;

        const renderFrame = (index) => {
            if (images[index] && images[index].complete && images[index].naturalWidth !== 0) {
                // Dynamically sync canvas logic to the true native image format
                if (canvas.width !== images[index].naturalWidth) {
                    canvas.width = images[index].naturalWidth;
                    canvas.height = images[index].naturalHeight;
                }
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(images[index], 0, 0, canvas.width, canvas.height);
            }
        };

        const updateLoader = () => {
            const percentage = Math.floor((loadedCount / frameCount) * 100);
            if (loaderProgress) loaderProgress.style.width = percentage + '%';
            if (loaderPercentage) loaderPercentage.textContent = percentage + '%';
            
            if (loadedCount === frameCount) {
                 setTimeout(() => {
                     if (loaderScreen) loaderScreen.style.opacity = '0';
                     setTimeout(() => {
                         if (loaderScreen) loaderScreen.style.display = 'none';
                         renderFrame(0);
                     }, 500);
                 }, 300); // small visual buffer
            }
        };

        // Preload Images
        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            const frameIndex = i.toString().padStart(5, '0');
            
            img.onload = () => {
                loadedCount++;
                updateLoader();
            };
            img.onerror = () => {
                loadedCount++;
                updateLoader();
            };
            
            img.src = `./assets/toWEBP/${frameIndex}.webp`;
            images.push(img);
        }

        // Handle Scroll to scrub frames smoothly
        let targetFrameIndex = 0;
        let currentFrameIndex = 0;
        
        const progressBar = document.getElementById('video-progress-bar');
        const dots = document.querySelectorAll('#video-dots .dot');

        function lerpLoop() {
            // Physics calculation for gliding momentum (0.04 represents smooth friction)
            currentFrameIndex += (targetFrameIndex - currentFrameIndex) * 0.04;
            
            let displayFrame = Math.floor(currentFrameIndex);
            
            // Safety bounds clamping
            displayFrame = Math.max(0, Math.min(frameCount - 1, displayFrame));
            
            renderFrame(displayFrame);

            // Calculate exact visual progress to update UI accurately
            let progress = currentFrameIndex / (frameCount - 1);
            progress = Math.max(0, Math.min(1, progress));
            
            // Apply green bar progress
            if (progressBar) progressBar.style.width = (progress * 100) + '%';
            
            // Apply green dot highlight mechanism
            if (dots && dots.length > 0) {
                const activeDotIndex = Math.floor(progress * dots.length);
                dots.forEach((dot, idx) => {
                    // Slight buffer so the first dot stays lit or dots trigger precisely
                    if (idx < activeDotIndex || (progress === 1 && idx === dots.length - 1)) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }

            requestAnimationFrame(lerpLoop);
        }
        
        // Boot up the continuous physics loop
        requestAnimationFrame(lerpLoop);

        let lastScrollY = window.scrollY;
        const siteHeader = document.querySelector('.site-header');

        window.addEventListener('scroll', () => {
            updateScrollFrame();
            
            // Auto-hide responsive header interaction
            if (siteHeader) {
                const currentScrollY = window.scrollY;
                if (currentScrollY > 80 && currentScrollY > lastScrollY) {
                    siteHeader.classList.add('header-hidden');
                } else if (currentScrollY < lastScrollY) {
                    siteHeader.classList.remove('header-hidden');
                }
                lastScrollY = currentScrollY;
            }

            // Show custom green UI overlays only when User is actively inside the scrolling track
            if (heroSection) {
                const videoWindowStart = heroSection.offsetTop; 
                const videoWindowEnd = videoWindowStart + heroSection.offsetHeight - window.innerHeight;
                
                if (window.scrollY >= videoWindowStart && window.scrollY <= videoWindowEnd) {
                    document.body.classList.add('video-ui-active');
                } else {
                    document.body.classList.remove('video-ui-active');
                }
            }
        });

        function updateScrollFrame() {
            if (!heroSection) return;
            
            const scrollPosition = window.scrollY;
            const sectionTop = heroSection.offsetTop;
            const maxScroll = heroSection.offsetHeight - window.innerHeight;
            
            let scrollFraction = (scrollPosition - sectionTop) / maxScroll;
            scrollFraction = Math.max(0, Math.min(1, scrollFraction)); // clamp [0, 1]
            
            // Hand off precisely where the user WANTS to be; the lerp loop carries the actual drawing rendering over 1-2s
            targetFrameIndex = scrollFraction * (frameCount - 1);
        }
    } else {
        // If no canvas exists (failsafe), just finish loading instantly
        if (loaderScreen) {
            loaderScreen.style.opacity = '0';
            setTimeout(() => loaderScreen.style.display = 'none', 500);
        }
    }

    // --------------------------------------------------------
    // 2. Intersection Observers for Fade-In Content
    // --------------------------------------------------------
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll('.statement-section h2, .pricing-card, .belief-item');
    elementsToAnimate.forEach(el => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // --------------------------------------------------------
    // 3. Machinga Wind Overlay Logic
    // --------------------------------------------------------
    (function initWindOverlay() {
        const CONFIG = {
            width:  3840,
            height: 2160,
            fps: 24,
            seed: 42,
            nStreaksBg:   52,
            streakSpdLo: 140,  streakSpdHi: 290,
            streakLenLo: 120,  streakLenHi: 380,
            streakAlpLo:  28,  streakAlpHi:  72,
            streakColor: [155, 165, 172],
            nStreaksFg:   10,
            fgAlpLo:       7,  fgAlpHi:      16,
            nParticles:   65,
            partSpdLo:   210,  partSpdHi:   430,
            partWLo:       4,  partWHi:      10,
            partHLo:      22,  partHHi:      58,
            partAlpLo:    20,  partAlpHi:    58,
            partGrayLo:  142,  partGrayHi:  172,
            nShimmerArcs:  4,
            shimmerBaseA: 42,
            noseFracX: 0.500,
            noseFracY: 0.905,
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
            const rng       = makePRNG(cfg.seed);
            const spdScale  = H / 2160;
            const lenScale  = spdScale;
            const xl = (W * 0.02) | 0,  xr = (W * 0.98) | 0;
            const xl5 = (W * 0.05) | 0, xr5 = (W * 0.95) | 0;

            const bgStreaks = Array.from({ length: cfg.nStreaksBg }, () => ({
                x:     rng.int(xl, xr),
                y0:    rng.int(0, H),
                spd:   rng.float(cfg.streakSpdLo, cfg.streakSpdHi) * spdScale,
                len:   rng.int((cfg.streakLenLo * lenScale) | 0, (cfg.streakLenHi * lenScale) | 0),
                alp:   rng.int(cfg.streakAlpLo, cfg.streakAlpHi),
                drift: rng.int(-8, 8),
            }));

            const fgStreaks = Array.from({ length: cfg.nStreaksFg }, () => ({
                x:     rng.int(xl5, xr5),
                y0:    rng.int(0, H),
                spd:   rng.float(cfg.streakSpdLo, cfg.streakSpdHi * 1.2) * spdScale,
                len:   rng.int((cfg.streakLenLo * lenScale) | 0, (cfg.streakLenHi * lenScale) | 0),
                alp:   rng.int(cfg.fgAlpLo, cfg.fgAlpHi),
                drift: rng.int(-6, 6),
            }));

            const particles = Array.from({ length: cfg.nParticles }, () => ({
                x:    rng.int(xl, xr),
                y0:   rng.int(0, H),
                spd:  rng.float(cfg.partSpdLo, cfg.partSpdHi) * spdScale,
                rw:   rng.int(cfg.partWLo, cfg.partWHi) / 2,
                rh:   rng.int(cfg.partHLo, cfg.partHHi) / 2,
                alp:  rng.int(cfg.partAlpLo, cfg.partAlpHi) / 255,
                gray: rng.int(cfg.partGrayLo, cfg.partGrayHi),
            }));

            return { bgStreaks, fgStreaks, particles };
        }

        function drawStreak(ctx, s, fi, H, rgb) {
            const [r, g, b] = rgb;
            const yTop = ((s.y0 - fi * s.spd) % H + H) % H;
            const yBot = Math.min(yTop + s.len, H);

            ctx.strokeStyle = `rgba(${r},${g},${b},${s.alp / 255})`;
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';

            ctx.beginPath();
            ctx.moveTo(s.x,           yTop);
            ctx.lineTo(s.x + s.drift, yBot);
            ctx.stroke();

            const wrap = yTop + s.len - H;
            if (wrap > 0) {
                ctx.beginPath();
                ctx.moveTo(s.x,           0);
                ctx.lineTo(s.x + s.drift, wrap);
                ctx.stroke();
            }
        }

        function drawParticle(ctx, p, fi, H) {
            const cy = ((p.y0 - fi * p.spd) % H + H) % H;
            const g  = p.gray;

            const grd = ctx.createLinearGradient(p.x, cy - p.rh, p.x, cy + p.rh);
            grd.addColorStop(0.0, `rgba(${g+12},${g+16},${g+12},0)`);
            grd.addColorStop(0.3, `rgba(${g},${g+4},${g+2},${p.alp})`);
            grd.addColorStop(0.7, `rgba(${g},${g+4},${g+2},${p.alp})`);
            grd.addColorStop(1.0, `rgba(${g+8},${g+12},${g+8},0)`);

            ctx.beginPath();
            ctx.ellipse(p.x, cy, p.rw, p.rh, 0, 0, Math.PI * 2);
            ctx.fillStyle = grd;
            ctx.fill();
        }

        function drawShimmer(ctx, nx, ny, cfg) {
            for (let j = 0; j < cfg.nShimmerArcs; j++) {
                const spread = 55 + j * 70;
                const depth  = 30 + j * 40;
                const yOff   = 30 + j * 48;
                const alpha  = Math.max(8, cfg.shimmerBaseA - j * 9) / 255;
                const lw     = Math.max(1, 3 - j);

                ctx.strokeStyle = `rgba(215,220,212,${alpha})`;
                ctx.lineWidth   = lw;
                ctx.lineCap     = 'round';

                ctx.beginPath();
                ctx.moveTo(nx,           ny + yOff);
                ctx.lineTo(nx - spread,  ny + yOff + depth);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(nx,           ny + yOff);
                ctx.lineTo(nx + spread,  ny + yOff + depth);
                ctx.stroke();

                const arcR = 18 + j * 6;
                ctx.beginPath();
                ctx.arc(nx, ny + yOff, arcR, Math.PI * 0.17, Math.PI * 0.83);
                ctx.stroke();
            }
        }

        const cfg    = CONFIG;
        const canvas = document.getElementById('wind-overlay');
        if (!canvas) return;
        
        canvas.width  = cfg.width;
        canvas.height = cfg.height;

        const ctx  = canvas.getContext('2d', { alpha: true });
        const sys  = buildParticles(cfg);

        let noseFracX = cfg.noseFracX;
        let noseFracY = cfg.noseFracY;
        window.setNose = (xf, yf) => { noseFracX = xf; noseFracY = yf; };

        let   fi       = 0;
        const interval = 1000 / cfg.fps;
        let   lastTs   = 0;

        function frame(ts) {
            if (ts - lastTs < interval * 0.9) { requestAnimationFrame(frame); return; }
            lastTs = ts;

            ctx.clearRect(0, 0, cfg.width, cfg.height);

            for (const s of sys.bgStreaks) drawStreak(ctx, s, fi, cfg.height, cfg.streakColor);
            for (const p of sys.particles) drawParticle(ctx, p, fi, cfg.height);
            drawShimmer(ctx, noseFracX * cfg.width, noseFracY * cfg.height, cfg);
            for (const s of sys.fgStreaks) drawStreak(ctx, s, fi, cfg.height, cfg.streakColor);

            fi++;
            requestAnimationFrame(frame);
        }

        requestAnimationFrame(frame);
    })();
});
