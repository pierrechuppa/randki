// COUNTDOWN TIMER
function startCountdown() {
    let time = 5 * 60; // 5 minut
    const timerElement = document.getElementById('timer');
    
    const countdown = setInterval(() => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (time <= 0) {
            clearInterval(countdown);
            document.querySelector('.countdown-bar').innerHTML = 
                '<div class="container">⏰ OFERTA WYGASŁA! <a href="#" onclick="resetCountdown()">Kliknij tutaj aby przywrócić</a></div>';
        }
        
        time--;
    }, 1000);
}

// Funkcja resetująca countdown (dla linku w wiadomości o wygaśnięciu)
function resetCountdown() {
    document.querySelector('.countdown-bar').innerHTML = 
        `<div class="container">
            <i class="fas fa-bolt"></i>
            <span>Oferta specjalna kończy się za: <span id="timer">05:00</span></span>
            <i class="fas fa-bolt"></i>
        </div>`;
    startCountdown();
    return false; // Zapobiega domyślnej akcji linku
}

// REDIRECT Z FORMULARZA
function redirectToSignup() {
    const gender = document.getElementById('gender').value;
    const lookingFor = document.getElementById('looking-for').value;
    const age = document.getElementById('age').value;
    
    // Zapisz dane w localStorage
    localStorage.setItem('preferences', JSON.stringify({ gender, lookingFor, age }));
    
    // Redirect do linku partnerskiego
    window.open('https://radarkobiet.pl/link/2821/19099102', '_blank');
    
    // Track conversion
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
            gender: gender,
            looking_for: lookingFor,
            age_range: age
        });
    }
}

// TESTIMONIAL SLIDER
let currentTestimonial = 0;
function showTestimonial(index) {
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    
    testimonials.forEach(t => t.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    
    if (testimonials[index]) {
        testimonials[index].classList.add('active');
        dots[index].classList.add('active');
        currentTestimonial = index;
    }
}

// Auto-slide co 5 sekund
let slideInterval = setInterval(() => {
    const totalSlides = document.querySelectorAll('.testimonial').length;
    if (totalSlides > 0) {
        currentTestimonial = (currentTestimonial + 1) % totalSlides;
        showTestimonial(currentTestimonial);
    }
}, 5000);

// EXIT INTENT - gdy użytkownik chce zamknąć stronę
document.addEventListener('mouseout', (e) => {
    if (e.clientY < 0) {
        // Pokazuje popup z ofertą
        if (!localStorage.getItem('exit_popup_shown')) {
            setTimeout(() => {
                if (confirm("Czekaj! Otrzymaj 50% zniżki na pierwszy miesiąc!")) {
                    window.open('https://radarkobiet.pl/link/2821/19099102', '_blank');
                }
                localStorage.setItem('exit_popup_shown', 'true');
            }, 500);
        }
    }
});

// SCROLL TRIGGERED CTA - gdy użytkownik scrolluje 70%
window.addEventListener('scroll', () => {
    const scrollPercentage = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    
    if (scrollPercentage > 70 && !localStorage.getItem('scroll_popup_shown')) {
        // Pokazuje floating CTA (jest już domyślnie widoczny, ale można dodać animację)
        const floatingCta = document.querySelector('.floating-cta');
        if (floatingCta) {
            floatingCta.style.animation = 'pulse 1.5s 3';
        }
        localStorage.setItem('scroll_popup_shown', 'true');
    }
});

// Inicjalizacja po załadowaniu strony
document.addEventListener('DOMContentLoaded', () => {
    startCountdown();
    showTestimonial(0);
    
    // Pobierz zapisane preferencje
    const savedPrefs = localStorage.getItem('preferences');
    if (savedPrefs) {
        try {
            const prefs = JSON.parse(savedPrefs);
            if (document.getElementById('gender')) document.getElementById('gender').value = prefs.gender || 'Mężczyzną';
            if (document.getElementById('looking-for')) document.getElementById('looking-for').value = prefs.lookingFor || 'Kobiety';
            if (document.getElementById('age')) document.getElementById('age').value = prefs.age || '26-35';
        } catch(e) {
            console.log("Błąd ładowania preferencji:", e);
        }
    }
    
    // Płynne przewijanie dla anchor linków
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(href);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Obsługa błędów ładowania obrazków
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG' && e.target.src.includes('pravatar.cc')) {
        e.target.style.display = 'none';
    }
}, true);
