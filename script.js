/**
 * MIŁOŚĆ365.PL - Premium Landing Page
 * Konwersja zoptymalizowana pod link partnerski
 * Mobile & Desktop ready
 */

// ====== GLOBAL CONFIG ======
const CONFIG = {
    // Link partnerski - WSZYSTKIE przyciski prowadzą tutaj
    PARTNER_LINK: 'https://radarkobiet.pl/link/2821/19099102',
    
    // Odliczanie oferty (5 minut)
    COUNTDOWN_TIME: 5 * 60, // w sekundach
    
    // Live counter start value
    START_USER_COUNT: 284721,
    
    // Quiz results configuration
    QUIZ_RESULTS: {
        // Format: odpowiedzi (3 litery) -> wynik
        'aaa': { 
            type: 'Romantyczny Marzyciel', 
            desc: 'Jesteś wrażliwą osobą, która ceni głębokie więzi emocjonalne i autentyczność. Twój idealny partner to ktoś, z kim możesz rozmawiać godzinami i budować bezpieczną przestrzeń zaufania.',
            match: 92
        },
        'aab': { 
            type: 'Przygodowy Poszukiwacz', 
            desc: 'Kochasz spontaniczność i nowe doświadczenia. Najlepiej czujesz się z osobą, która podziela Twoją energię i jest gotowa na wspólne przygody.',
            match: 87
        },
        'abb': { 
            type: 'Wierny Opiekun', 
            desc: 'Stabilność i bezpieczeństwo są dla Ciebie najważniejsze. Szukasz partnera, na którym możesz polegać i z którym zbudujesz trwały, szczęśliwy związek.',
            match: 89
        },
        'abc': { 
            type: 'Intelektualny Partner', 
            desc: 'Cenisz mądre rozmowy i rozwój osobisty. Twój idealny match to osoba ambitna, z którą możesz wspólnie odkrywać świat i rozwijać pasje.',
            match: 85
        },
        // Domyślny wynik dla innych kombinacji
        'default': { 
            type: 'Zrównoważony Poszukiwacz', 
            desc: 'Jesteś osobą otwartą, która ceni zarówno głębokie rozmowy, jak i dobrą zabawę. Twój idealny partner to ktoś, kto potrafi znaleźć równowagę między emocjami a praktycznością.',
            match: 88
        }
    }
};

// ====== DOM ELEMENTS ======
const DOM = {
    // Preloader
    preloader: null,
    
    // Navigation
    mobileToggle: null,
    mobileOverlay: null,
    mobileClose: null,
    
    // Hero section
    countdownTimer: null,
    liveCounter: null,
    
    // Quiz section
    quizContainer: null,
    quizSteps: null,
    quizOptions: null,
    quizProgress: null,
    quizResult: null,
    profileType: null,
    profileDesc: null,
    
    // Sticky CTA
    stickyCTA: null,
    
    // Stat counters
    statNumbers: null
};

// ====== STATE VARIABLES ======
let state = {
    countdownTime: CONFIG.COUNTDOWN_TIME,
    countdownInterval: null,
    userAnswers: [],
    quizCompleted: false,
    userCount: CONFIG.START_USER_COUNT,
    userCounterInterval: null
};

// ====== INITIALIZATION ======
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Miłość365.pl - Initializing...');
    
    initializeElements();
    initializePreloader();
    initializeNavigation();
    initializeCountdown();
    initializeUserCounter();
    initializeQuiz();
    initializeStickyCTA();
    initializeAnimations();
    initializeEventListeners();
    
    console.log('✅ Initialization complete!');
});

// ====== INITIALIZATION FUNCTIONS ======
function initializeElements() {
    DOM.preloader = document.querySelector('.preloader');
    DOM.mobileToggle = document.querySelector('.mobile-toggle');
    DOM.mobileOverlay = document.querySelector('.mobile-overlay');
    DOM.mobileClose = document.querySelector('.mobile-close');
    DOM.countdownTimer = document.getElementById('timer');
    DOM.liveCounter = document.getElementById('liveUsers');
    DOM.quizContainer = document.getElementById('loveQuiz');
    DOM.quizSteps = document.querySelectorAll('.quiz-step');
    DOM.quizOptions = document.querySelectorAll('.quiz-option');
    DOM.quizProgress = document.getElementById('quizProgress');
    DOM.quizResult = document.getElementById('quizResult');
    DOM.profileType = document.getElementById('profileType');
    DOM.profileDesc = document.getElementById('profileDescription');
    DOM.stickyCTA = document.querySelector('.sticky-mobile-cta');
    DOM.statNumbers = document.querySelectorAll('[data-count]');
}

function initializePreloader() {
    if (!DOM.preloader) return;
    
    // Hide preloader after 1.5 seconds
    setTimeout(() => {
        DOM.preloader.classList.add('fade-out');
        
        setTimeout(() => {
            DOM.preloader.style.display = 'none';
        }, 600);
    }, 1500);
}

function initializeNavigation() {
    if (!DOM.mobileToggle || !DOM.mobileOverlay || !DOM.mobileClose) return;
    
    // Mobile menu toggle
    DOM.mobileToggle.addEventListener('click', () => {
        DOM.mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Mobile menu close
    DOM.mobileClose.addEventListener('click', closeMobileMenu);
    
    // Close mobile menu when clicking on links
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Close mobile menu when clicking outside
    DOM.mobileOverlay.addEventListener('click', (e) => {
        if (e.target === DOM.mobileOverlay) {
            closeMobileMenu();
        }
    });
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initializeCountdown() {
    if (!DOM.countdownTimer) return;
    
    // Format time to MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    
    // Update timer immediately
    DOM.countdownTimer.textContent = formatTime(state.countdownTime);
    
    // Start countdown
    state.countdownInterval = setInterval(() => {
        state.countdownTime--;
        
        // Update timer display
        DOM.countdownTimer.textContent = formatTime(state.countdownTime);
        
        // Change color when less than 1 minute
        if (state.countdownTime <= 60) {
            DOM.countdownTimer.style.color = 'var(--primary)';
            DOM.countdownTimer.classList.add('pulse-glow');
        }
        
        // Stop at 0
        if (state.countdownTime <= 0) {
            clearInterval(state.countdownInterval);
            DOM.countdownTimer.textContent = '00:00';
            DOM.countdownTimer.style.color = 'var(--primary)';
            
            // Show warning/notification
            showNotification('⏰ Czas oferty wygasł! Spróbuj jeszcze raz.');
        }
    }, 1000);
}

function initializeUserCounter() {
    if (!DOM.liveCounter) return;
    
    // Format number with spaces
    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
    
    // Initial display
    DOM.liveCounter.textContent = formatNumber(state.userCount);
    
    // Increment counter randomly (simulate live growth)
    state.userCounterInterval = setInterval(() => {
        // Random increment between 3 and 8
        const increment = Math.floor(Math.random() * 6) + 3;
        state.userCount += increment;
        
        // Update display
        DOM.liveCounter.textContent = formatNumber(state.userCount);
        
        // Occasionally add a pulse effect
        if (Math.random() > 0.7) {
            DOM.liveCounter.style.transform = 'scale(1.1)';
            setTimeout(() => {
                DOM.liveCounter.style.transform = 'scale(1)';
            }, 300);
        }
    }, 3000); // Update every 3 seconds
}

function initializeQuiz() {
    if (!DOM.quizContainer || DOM.quizOptions.length === 0) return;
    
    // Initialize first step
    showQuizStep(1);
    
    // Add click handlers to all options
    DOM.quizOptions.forEach(option => {
        option.addEventListener('click', handleQuizOptionClick);
    });
}

function initializeStickyCTA() {
    if (!DOM.stickyCTA) return;
    
    // Show sticky CTA after scrolling past hero
    window.addEventListener('scroll', () => {
        const heroHeight = document.querySelector('.hero-section').offsetHeight;
        const scrollPos = window.pageYOffset;
        
        if (scrollPos > heroHeight * 0.7) {
            DOM.stickyCTA.classList.add('show');
        } else {
            DOM.stickyCTA.classList.remove('show');
        }
    });
}

function initializeAnimations() {
    // Animate stat counters on scroll
    if (DOM.statNumbers.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        });
        
        DOM.statNumbers.forEach(stat => {
            observer.observe(stat);
        });
    }
    
    // Initialize GSAP animations if available
    if (typeof gsap !== 'undefined') {
        initializeGSAPAnimations();
    }
}

function initializeEventListeners() {
    // Track all CTA clicks (for analytics)
    document.querySelectorAll(`a[href="${CONFIG.PARTNER_LINK}"]`).forEach(link => {
        link.addEventListener('click', trackCTAClick);
    });
    
    // Prevent form submission (we don't have forms, but just in case)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => e.preventDefault());
    });
    
    // Window resize handling
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Recalculate anything if needed
        }, 250);
    });
    
    // Page visibility handling
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            console.log('📱 Page hidden');
        } else {
            console.log('📱 Page visible again');
        }
    });
}

// ====== QUIZ FUNCTIONS ======
function showQuizStep(stepNumber) {
    // Hide all steps
    DOM.quizSteps.forEach(step => {
        step.classList.remove('active');
    });
    
    // Show requested step
    const stepToShow = document.querySelector(`.quiz-step[data-step="${stepNumber}"]`);
    if (stepToShow) {
        stepToShow.classList.add('active');
        
        // Update progress bar
        if (DOM.quizProgress) {
            const progressPercentage = (stepNumber / 3) * 100;
            DOM.quizProgress.style.width = `${progressPercentage}%`;
        }
        
        // Update progress text
        const currentStepEl = document.querySelector('.current-step');
        if (currentStepEl) {
            currentStepEl.textContent = stepNumber;
        }
    }
}

function handleQuizOptionClick(e) {
    const option = e.currentTarget;
    const value = option.getAttribute('data-value');
    
    // Store answer
    state.userAnswers.push(value);
    
    // Visual feedback
    option.classList.add('active');
    option.style.pointerEvents = 'none';
    
    // Disable other options in this step
    const currentStep = document.querySelector('.quiz-step.active');
    const otherOptions = currentStep.querySelectorAll('.quiz-option');
    otherOptions.forEach(opt => {
        if (opt !== option) {
            opt.style.opacity = '0.5';
            opt.style.pointerEvents = 'none';
        }
    });
    
    // Move to next step or show results
    setTimeout(() => {
        const currentStepNum = parseInt(currentStep.getAttribute('data-step'));
        
        if (currentStepNum < 3) {
            showQuizStep(currentStepNum + 1);
        } else {
            showQuizResults();
        }
    }, 500);
}

function showQuizResults() {
    // Hide quiz steps
    DOM.quizSteps.forEach(step => {
        step.style.display = 'none';
    });
    
    // Hide progress bar
    const progressContainer = document.querySelector('.quiz-progress');
    if (progressContainer) {
        progressContainer.style.display = 'none';
    }
    
    // Determine result based on answers
    const answerKey = state.userAnswers.slice(0, 3).join('');
    const result = CONFIG.QUIZ_RESULTS[answerKey] || CONFIG.QUIZ_RESULTS.default;
    
    // Update result display
    if (DOM.profileType) {
        DOM.profileType.textContent = result.type;
    }
    
    if (DOM.profileDesc) {
        DOM.profileDesc.textContent = result.desc;
    }
    
    // Update match percentage in result stats
    const matchPercentEl = document.querySelector('.result-stat:first-child .stat-value span');
    if (matchPercentEl) {
        matchPercentEl.textContent = `${result.match}%`;
    }
    
    // Show result section
    if (DOM.quizResult) {
        DOM.quizResult.style.display = 'block';
        
        // Scroll to result
        setTimeout(() => {
            DOM.quizResult.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 300);
    }
    
    // Mark quiz as completed
    state.quizCompleted = true;
    
    // Track quiz completion (for analytics)
    trackQuizCompletion(result.type, result.match);
}

// ====== ANIMATION FUNCTIONS ======
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const suffix = element.textContent.replace(/\d/g, '') || '';
    const duration = 1500; // ms
    const steps = 60;
    const stepValue = target / steps;
    let current = 0;
    
    const timer = setInterval(() => {
        current += stepValue;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Format number based on type
        if (suffix.includes('%')) {
            element.textContent = Math.round(current) + suffix;
        } else {
            element.textContent = Math.round(current).toLocaleString('pl-PL') + suffix;
        }
    }, duration / steps);
}

function initializeGSAPAnimations() {
    // Animate hero elements on load
    gsap.from('.hero-title', {
        duration: 1,
        y: 30,
        opacity: 0,
        ease: 'power3.out',
        delay: 0.5
    });
    
    gsap.from('.hero-subtitle', {
        duration: 1,
        y: 20,
        opacity: 0,
        ease: 'power3.out',
        delay: 0.8
    });
    
    gsap.from('.stat-card', {
        duration: 0.8,
        y: 20,
        opacity: 0,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 1.2
    });
    
    gsap.from('.hero-cta', {
        duration: 1,
        y: 30,
        opacity: 0,
        ease: 'power3.out',
        delay: 1.5
    });
    
    // Animate quiz section on scroll
    gsap.from('.quiz-section', {
        scrollTrigger: {
            trigger: '.quiz-section',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        duration: 1,
        y: 50,
        opacity: 0,
        ease: 'power3.out'
    });
    
    // Animate stats section
    gsap.from('.stat-card-large', {
        scrollTrigger: {
            trigger: '.stats-section',
            start: 'top 85%',
            end: 'bottom 15%',
            toggleActions: 'play none none reverse'
        },
        duration: 1,
        y: 50,
        opacity: 0,
        stagger: 0.2,
        ease: 'power3.out'
    });
}

// ====== UTILITY FUNCTIONS ======
function closeMobileMenu() {
    if (DOM.mobileOverlay) {
        DOM.mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-info-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--dark-3);
        color: var(--light);
        padding: 1rem 1.5rem;
        border-radius: var(--radius-md);
        border-left: 4px solid var(--primary);
        box-shadow: var(--shadow-lg);
        z-index: 9999;
        transform: translateX(120%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// ====== ANALYTICS / TRACKING FUNCTIONS ======
function trackCTAClick(e) {
    const buttonText = e.currentTarget.textContent.trim().substring(0, 50);
    const buttonType = e.currentTarget.classList.contains('hero-cta-btn') ? 'hero' :
                      e.currentTarget.classList.contains('nav-cta-btn') ? 'nav' :
                      e.currentTarget.classList.contains('result-cta-btn') ? 'quiz_result' :
                      e.currentTarget.classList.contains('sticky-mobile-cta') ? 'sticky' : 'other';
    
    console.log('📊 CTA Click:', {
        type: buttonType,
        text: buttonText,
        timestamp: new Date().toISOString(),
        quizCompleted: state.quizCompleted
    });
    
    // Google Analytics (if gtag is available)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
            'event_category': 'CTA',
            'event_label': `${buttonType}: ${buttonText}`,
            'value': state.quizCompleted ? 2 : 1
        });
    }
    
    // You can add more tracking here (Facebook Pixel, etc.)
}

function trackQuizCompletion(profileType, matchScore) {
    console.log('📊 Quiz Completed:', {
        profileType: profileType,
        matchScore: matchScore,
        answers: state.userAnswers.join(''),
        timestamp: new Date().toISOString()
    });
    
    // Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'quiz_complete', {
            'event_category': 'Engagement',
            'event_label': profileType,
            'value': matchScore
        });
    }
}

// ====== PERFORMANCE OPTIMIZATIONS ======
// Lazy load images
document.addEventListener('DOMContentLoaded', function() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
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
    } else {
        // Fallback for older browsers
        lazyImages.forEach(img => {
            img.src = img.getAttribute('data-src');
        });
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (state.countdownInterval) {
        clearInterval(state.countdownInterval);
    }
    
    if (state.userCounterInterval) {
        clearInterval(state.userCounterInterval);
    }
    
    console.log('🧹 Cleaning up intervals...');
});

// ====== ERROR HANDLING ======
window.addEventListener('error', function(e) {
    console.error('❌ JavaScript Error:', e.message, e.filename, e.lineno);
    
    // You can send errors to your error tracking service here
    // Example: Sentry, LogRocket, etc.
});

// ====== EXPORT FOR DEBUGGING (optional) ======
if (typeof window !== 'undefined') {
    window.__MIŁOŚĆ365_DEBUG__ = {
        state: state,
        config: CONFIG,
        resetQuiz: () => {
            state.userAnswers = [];
            state.quizCompleted = false;
            
            // Reset quiz UI
            DOM.quizSteps.forEach(step => {
                step.style.display = 'block';
                step.classList.remove('active');
            });
            
            // Reset options
            DOM.quizOptions.forEach(option => {
                option.classList.remove('active');
                option.style.opacity = '1';
                option.style.pointerEvents = 'auto';
            });
            
            // Hide result
            if (DOM.quizResult) {
                DOM.quizResult.style.display = 'none';
            }
            
            // Show first step
            showQuizStep(1);
            
            // Show progress bar
            const progressContainer = document.querySelector('.quiz-progress');
            if (progressContainer) {
                progressContainer.style.display = 'block';
            }
            
            console.log('🔄 Quiz reset complete!');
        }
    };
}

console.log('🎉 script.js loaded successfully!');
