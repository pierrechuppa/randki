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

// REDIRECT Z FORMULARZA
function redirectToSignup() {
    const gender = document.getElementById('gender').value;
    const lookingFor = document.getElementById('looking-for').value;
    const age = document.getElementById('age').value;
    
    // Zapisz dane w localStorage
    localStorage.setItem('preferences', JSON.stringify({ gender, lookingFor, age }));
    
    // Redirect do linku partnerskiego
    window.open('https://radarkobiet.pl/link/3082/19099102', '_blank');
    
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
    
    testimonials[index].classList.add('active');
    dots[index].classList.add('active');
    currentTestimonial = index;
}

// Auto-slide co 5 sekund
setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % 2;
    showTestimonial(currentTestimonial);
}, 5000);

// EXIT INTENT - gdy użytkownik chce zamknąć stronę
document.addEventListener('mouseout', (e) => {
    if (e.clientY < 0) {
        // Pokazuje popup z ofertą
        if (!localStorage.getItem('exit_popup_shown')) {
            setTimeout(() => {
                if (confirm("Czekaj! Otrzymaj 50% zniżki na pierwszy miesiąc!")) {
                    window.open('https://radarkobiet.pl/link/3082/19099102', '_blank');
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
        // Pokazuje floating CTA
        document.querySelector('.floating-cta').style.display = 'block';
        localStorage.setItem('scroll_popup_shown', 'true');
    }
});

// Start timer po załadowaniu strony
document.addEventListener('DOMContentLoaded', () => {
    startCountdown();
    showTestimonial(0);
    
    // Pobierz zapisane preferencje
    const savedPrefs = localStorage.getItem('preferences');
    if (savedPrefs) {
        const prefs = JSON.parse(savedPrefs);
        document.getElementById('gender').value = prefs.gender;
        document.getElementById('looking-for').value = prefs.lookingFor;
        document.getElementById('age').value = prefs.age;
    }
});
