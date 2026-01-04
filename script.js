/**
 * SAMOTNIPOLSKA.PL - Premium Landing Page
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
    console.log('🚀 SamotniPolska.pl - Initializing...');
    
    initializeElements();
    initializePreloader();
    initializeNavigation();
    initializeCountdown();
    initializeUserCounter();
    initializeQuiz();
    initializeHotProfiles();
    initializeStickyCTA();
    initializeAnimations();
    initializeEventListeners();
    
    console.log('✅ Initialization complete!');
});

// ====== INITIALIZATION FUNCTIONS ======
function initializeElements() {
    // Preloader
    state.preloader = document.querySelector('.preloader');
    
    // Navigation
    state.mobileToggle = document.querySelector('.mobile-toggle');
    state.mobileOverlay = document.querySelector('.mobile-overlay');
    state.mobileClose = document.querySelector('.mobile-close');
    
    // Hero section
    state.countdownTimer = document.getElementById('timer');
    state.liveCounter = document.getElementById('liveUsers');
    
    // Quiz section
    state.quizSteps = document.querySelectorAll('.quiz-step');
    state.quizOptions = document.querySelectorAll('.quiz-option');
    state.quizProgress = document.getElementById('quizProgress');
    state.quizResult = document.getElementById('quizResult');
    state.profileType = document.getElementById('profileType');
    state.profileDesc = document.getElementById('profileDescription');
    
    // Sticky CTA
    state.stickyCTA = document.querySelector('.sticky-mobile-cta');
    
    // Stat counters
    state.statNumbers = document.querySelectorAll('[data-count]');
}

function initializePreloader() {
    if (!state.preloader) return;
    
    // Hide preloader after 1.5 seconds
    setTimeout(() => {
        state.preloader.classList.add('fade-out');
        
        setTimeout(() => {
            state.preloader.style.display = 'none';
        }, 600);
    }, 1500);
}

function initializeNavigation() {
    if (!state.mobileToggle || !state.mobileOverlay || !state.mobileClose) return;
    
    // Mobile menu toggle
    state.mobileToggle.addEventListener('click', () => {
        state.mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Mobile menu close
    state.mobileClose.addEventListener('click', closeMobileMenu);
    
    // Close mobile menu when clicking on links
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Close mobile menu when clicking outside
    state.mobileOverlay.addEventListener('click', (e) => {
        if (e.target === state.mobileOverlay) {
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
    if (!state.countdownTimer) return;
    
    // Format time to MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    
    // Update timer immediately
    state.countdownTimer.textContent = formatTime(state.countdownTime);
    
    // Start countdown
    state.countdownInterval = setInterval(() => {
        state.countdownTime--;
        
        // Update timer display
        state.countdownTimer.textContent = formatTime(state.countdownTime);
        
        // Change color when less than 1 minute
        if (state.countdownTime <= 60) {
            state.countdownTimer.style.color = 'var(--primary)';
            state.countdownTimer.classList.add('pulse-glow');
        }
        
        // Stop at 0
        if (state.countdownTime <= 0) {
            clearInterval(state.countdownInterval);
            state.countdownTimer.textContent = '00:00';
            state.countdownTimer.style.color = 'var(--primary)';
        }
    }, 1000);
}

function initializeUserCounter() {
    if (!state.liveCounter) return;
    
    // Format number with spaces
    const formatNumber = (num) => {
        return num.toLocaleString('pl-PL');
    };
    
    // Initial display
    state.liveCounter.textContent = formatNumber(state.userCount);
    
    // Increment counter randomly (simulate live growth)
    state.userCounterInterval = setInterval(() => {
        // Random increment between 3 and 8
        const increment = Math.floor(Math.random() * 6) + 3;
        state.userCount += increment;
        
        // Update display
        state.liveCounter.textContent = formatNumber(state.userCount);
        
        // Occasionally add a pulse effect
        if (Math.random() > 0.7) {
            state.liveCounter.style.transform = 'scale(1.1)';
            setTimeout(() => {
                state.liveCounter.style.transform = 'scale(1)';
            }, 300);
        }
    }, 3000); // Update every 3 seconds
}

function initializeQuiz() {
    if (state.quizOptions.length === 0) return;
    
    // Initialize first step
    showQuizStep(1);
    
    // Add click handlers to all options
    state.quizOptions.forEach(option => {
        option.addEventListener('click', handleQuizOptionClick);
    });
}

function initializeHotProfiles() {
    // Click on "View Profile" = opens partner link
    document.querySelectorAll('.view-profile-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            window.open(CONFIG.PARTNER_LINK, '_blank');
            trackCTAClick('Hot Profile Click');
        });
    });
    
    // Click on profile card = also opens link
    document.querySelectorAll('.profile-card-hot').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.view-profile-btn')) {
                window.open(CONFIG.PARTNER_LINK, '_blank');
                trackCTAClick('Profile Card Click');
            }
        });
    });
    
    // Every 30 seconds update "km from you" (randomization)
    setInterval(() => {
        document.querySelectorAll('.profile-distance').forEach(el => {
            const currentText = el.textContent;
            const newDistance = Math.floor(Math.random() * 10) + 1;
            el.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${newDistance} km od Ciebie`;
            
            // After 2 seconds return to original
            setTimeout(() => {
                el.innerHTML = currentText;
            }, 2000);
        });
    }, 30000);
}

function initializeStickyCTA() {
    if (!state.stickyCTA) return;
    
    // Show sticky CTA after scrolling past hero
    window.addEventListener('scroll', () => {
        const heroHeight = document.querySelector('.hero-section').offsetHeight;
        const scrollPos = window.pageYOffset;
        
        if (scrollPos > heroHeight * 0.7) {
            state.stickyCTA.classList.add('show');
        } else {
            state.stickyCTA.classList.remove('show');
        }
    });
}

function initializeAnimations() {
    // Animate stat counters on scroll
    if (state.statNumbers.length > 0) {
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
        
        state.statNumbers.forEach(stat => {
            observer.observe(stat);
        });
    }
}

function initializeEventListeners() {
    // Track all CTA clicks (for analytics)
    document.querySelectorAll(`a[href="${CONFIG.PARTNER_LINK}"]`).forEach(link => {
        link.addEventListener('click', (e) => trackCTAClick('CTA Link Click'));
    });
    
    // Window resize handling
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Handle mobile/desktop changes
            if (window.innerWidth >= 768) {
                if (state.stickyCTA) {
                    state.stickyCTA.style.display = 'block';
                }
            } else {
                if (state.stickyCTA) {
                    state.stickyCTA.style.display = 'none';
                }
            }
        }, 250);
    });
}

// ====== QUIZ FUNCTIONS ======
function showQuizStep(stepNumber) {
    // Hide all steps
    state.quizSteps.forEach(step => {
        step.classList.remove('active');
    });
    
    // Show requested step
    const stepToShow = document.querySelector(`.quiz-step[data-step="${stepNumber}"]`);
    if (stepToShow) {
        stepToShow.classList.add('active');
        
        // Update progress bar
        if (state.quizProgress) {
            const progressPercentage = (stepNumber / 3) * 100;
            state.quizProgress.style.width = `${progressPercentage}%`;
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
    
    // Get current step
    const currentStep = document.querySelector('.quiz-step.active');
    const currentStepNum = parseInt(currentStep.getAttribute('data-step'));
    
    // Disable all options in current step
    const currentOptions = currentStep.querySelectorAll('.quiz-option');
    currentOptions.forEach(opt => {
        opt.style.pointerEvents = 'none';
        if (opt !== option) {
            opt.style.opacity = '0.5';
        }
    });
    
    // Move to next step or show results
    setTimeout(() => {
        if (currentStepNum < 3) {
            showQuizStep(currentStepNum + 1);
        } else {
            showQuizResults();
        }
    }, 600);
}

function showQuizResults() {
    // Hide quiz steps
    state.quizSteps.forEach(step => {
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
    if (state.profileType) {
        state.profileType.textContent = result.type;
    }
    
    if (state.profileDesc) {
        state.profileDesc.textContent = result.desc;
    }
    
    // Update match percentage in result stats
    const matchPercentEl = document.querySelector('.result-stat:first-child .stat-value span');
    if (matchPercentEl) {
        matchPercentEl.textContent = `${result.match}%`;
    }
    
    // Show result section
    if (state.quizResult) {
        state.quizResult.style.display = 'block';
        
        // Scroll to result
        setTimeout(() => {
            state.quizResult.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 300);
    }
    
    // Mark quiz as completed
    state.quizCompleted = true;
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

// ====== UTILITY FUNCTIONS ======
function closeMobileMenu() {
    if (state.mobileOverlay) {
        state.mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ====== ANALYTICS / TRACKING FUNCTIONS ======
function trackCTAClick(source) {
    console.log('📊 CTA Click:', {
        source: source,
        timestamp: new Date().toISOString(),
        quizCompleted: state.quizCompleted
    });
    
    // Google Analytics (if gtag is available)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
            'event_category': 'CTA',
            'event_label': source,
            'value': state.quizCompleted ? 2 : 1
        });
    }
}

// ====== PERFORMANCE OPTIMIZATIONS ======
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

// ====== DEBUGGING HELPERS ======
if (typeof window !== 'undefined') {
    window.__SAMOTNIPOLSKA_DEBUG__ = {
        state: state,
        config: CONFIG,
        resetQuiz: () => {
            state.userAnswers = [];
            state.quizCompleted = false;
            
            // Reset quiz UI
            state.quizSteps.forEach(step => {
                step.style.display = 'block';
                step.classList.remove('active');
            });
            
            // Reset options
            state.quizOptions.forEach(option => {
                option.classList.remove('active');
                option.style.opacity = '1';
                option.style.pointerEvents = 'auto';
            });
            
            // Hide result
            if (state.quizResult) {
                state.quizResult.style.display = 'none';
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

console.log('🎉 SamotniPolska.pl script loaded successfully!');
