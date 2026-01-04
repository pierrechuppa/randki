// Premium JavaScript for SamotniPolska.pl

document.addEventListener('DOMContentLoaded', function() {
    
    // ====== PRELOADER ======
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 600);
        }, 1000);
    }

    // ====== MOBILE MENU ======
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileMenuLinks = document.querySelectorAll('.mobile-nav-link');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuOverlay.style.display = 'block';
            setTimeout(() => {
                mobileMenuOverlay.style.opacity = '1';
            }, 10);
            document.body.style.overflow = 'hidden';
        });
    }

    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMobileMenu);
    }

    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', (e) => {
            if (e.target === mobileMenuOverlay) {
                closeMobileMenu();
            }
        });
    }

    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    function closeMobileMenu() {
        mobileMenuOverlay.style.opacity = '0';
        setTimeout(() => {
            mobileMenuOverlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }

    // ====== COUNTDOWN TIMER ======
    function initCountdown() {
        const timerElement = document.getElementById('timer');
        if (!timerElement) return;

        let time = 5 * 60; // 5 minut
        const countdown = setInterval(() => {
            const minutes = Math.floor(time / 60);
            const seconds = time % 60;
            
            timerElement.textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            if (time <= 0) {
                clearInterval(countdown);
                timerElement.textContent = "00:00";
                timerElement.style.color = '#FF2E63';
                timerElement.classList.add('animate__pulse');
            }
            
            time--;
        }, 1000);
    }

    // ====== ANIMATED COUNTERS ======
    function initAnimatedCounters() {
        const counters = document.querySelectorAll('[data-count]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const suffix = counter.textContent.replace(/\d/g, '');
            let current = 0;
            const increment = target / 100;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = Math.floor(current) + suffix;
            }, 20);
        });
    }

    // ====== FORM HANDLING ======
    const signupForm = document.getElementById('quickSignupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                gender: document.getElementById('gender').value,
                lookingFor: document.getElementById('lookingFor').value
            };

            // Simulate form submission
            const submitBtn = signupForm.querySelector('.form-submit-btn');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Przetwarzanie...';
            submitBtn.disabled = true;

            // Redirect after 1.5 seconds
            setTimeout(() => {
                window.open('https://radarkobiet.pl/link/2821/19099102', '_blank');
                
                // Reset form after redirect
                setTimeout(() => {
                    signupForm.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 1000);
            }, 1500);
        });
    }

    // ====== BACK TO TOP ======
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ====== ANIMATE ON SCROLL ======
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate__animated');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const animationClass = entry.target.getAttribute('data-animate') || 'animate__fadeInUp';
                    entry.target.classList.add(animationClass);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });

        animatedElements.forEach(element => {
            if (!element.classList.contains('animate__animated')) {
                element.classList.add('animate__animated');
            }
            observer.observe(element);
        });
    }

    // ====== CTA BUTTON TRACKING ======
    document.querySelectorAll('a[href*="radarkobiet.pl"]').forEach(link => {
        link.addEventListener('click', function(e) {
            // You can add analytics tracking here
            console.log('CTA Clicked:', this.textContent.trim());
            
            // Add a small delay for visual feedback
            if (!this.classList.contains('no-feedback')) {
                e.preventDefault();
                const originalHref = this.href;
                
                // Add click animation
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                    window.open(originalHref, '_blank');
                }, 150);
            }
        });
    });

    // ====== FLOATING HEARTS ANIMATION ======
    function createFloatingHearts() {
        const container = document.querySelector('.bg-elements');
        if (!container) return;

        for (let i = 0; i < 10; i++) {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            
            // Random properties
            const size = Math.random() * 20 + 10;
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            const delay = Math.random() * 10;
            const duration = Math.random() * 10 + 10;
            
            heart.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${left}%;
                top: ${top}%;
                animation-delay: ${delay}s;
                animation-duration: ${duration}s;
                background: ${i % 2 === 0 ? 'var(--primary-light)' : 'var(--secondary)'};
                opacity: ${Math.random() * 0.1 + 0.05};
            `;
            
            container.appendChild(heart);
        }
    }

    // ====== INITIALIZE EVERYTHING ======
    initCountdown();
    initAnimatedCounters();
    initScrollAnimations();
    createFloatingHearts();

    // ====== GSAP ANIMATIONS ======
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        // Animate hero elements
        gsap.from('.hero-main-title', {
            duration: 1,
            y: 50,
            opacity: 0,
            ease: 'power3.out',
            delay: 0.5
        });

        gsap.from('.hero-subtitle', {
            duration: 1,
            y: 30,
            opacity: 0,
            ease: 'power3.out',
            delay: 0.8
        });

        gsap.from('.stats-grid .stat-card', {
            duration: 0.8,
            y: 30,
            opacity: 0,
            stagger: 0.1,
            ease: 'power3.out',
            delay: 1.2
        });

        // Feature cards animation on scroll
        gsap.utils.toArray('.feature-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                },
                duration: 0.8,
                y: 50,
                opacity: 0,
                delay: i * 0.1,
                ease: 'power3.out'
            });
        });

        // Story cards animation
        gsap.utils.toArray('.story-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    end: 'bottom 15%',
                    toggleActions: 'play none none reverse'
                },
                duration: 1,
                x: i % 2 === 0 ? -50 : 50,
                opacity: 0,
                delay: i * 0.2,
                ease: 'power3.out'
            });
        });
    }

    // ====== PERFORMANCE OPTIMIZATION ======
    // Lazy load images
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));

    // ====== BROWSER SUPPORT CHECK ======
    function checkBrowserSupport() {
        const isIE = !!document.documentMode;
        if (isIE) {
            alert('Ta strona wymaga nowoczesnej przeglądarki. Zalecamy Chrome, Firefox lub Edge.');
        }
    }

    checkBrowserSupport();

    // ====== COOKIE CONSENT (Placeholder) ======
    function initCookieConsent() {
        if (!localStorage.getItem('cookiesAccepted')) {
            // You can add a cookie consent banner here
            console.log('Cookie consent needed');
        }
    }

    initCookieConsent();

    // ====== SOCIAL SHARE ======
    function initSocialShare() {
        // Add social sharing functionality if needed
        console.log('Social share initialized');
    }

    initSocialShare();

    // ====== PWA FEATURES (Placeholder) ======
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            // You can register a service worker here for PWA
            // navigator.serviceWorker.register('/sw.js');
        });
    }

    // ====== OFFLINE DETECTION ======
    window.addEventListener('offline', () => {
        console.log('You are offline');
        // You can show an offline message here
    });

    window.addEventListener('online', () => {
        console.log('You are back online');
    });

    // ====== PERFORMANCE METRICS ======
    window.addEventListener('load', () => {
        const loadTime = window.performance.timing.domContentLoadedEventEnd - 
                       window.performance.timing.navigationStart;
        console.log(`Page loaded in ${loadTime}ms`);
        
        // Send to analytics if needed
        // gtag('event', 'timing_complete', {
        //     'name': 'load',
        //     'value': loadTime,
        //     'event_category': 'Performance'
        // });
    });

});

// ====== GLOBAL FUNCTIONS ======
function trackEvent(category, action, label) {
    // Google Analytics event tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', action, {
            content_category: category,
            content_name: label
        });
    }
    
    console.log(`Event: ${category} - ${action} - ${label}`);
}

// ====== ERROR HANDLING ======
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.message);
    // You can send errors to your error tracking service here
});

// ====== RESIZE HANDLER ======
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Handle resize events
        console.log('Window resized');
    }, 250);
});

// ====== PAGE VISIBILITY ======
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page hidden');
    } else {
        console.log('Page visible');
    }
});
