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
});
