document.addEventListener('DOMContentLoaded', function () {

    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme');
    

    const sections = {
        home: document.getElementById('home'),
        history: document.getElementById('history'),
        sights: document.getElementById('sights'),
        offers: document.getElementById('offers'),
        reviews: document.getElementById('reviews'),
        contact: document.getElementById('contact'),
        mapSection: document.getElementById('mapSection')
    };
    
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const overlay = document.getElementById('menuOverlay');
    
    const reviewTrack = document.getElementById('reviewTrack');
    const form = document.getElementById('feedbackForm');
    
    const animElements = document.querySelectorAll('.animate-on-scroll');


    if (savedTheme === 'light') {
        document.body.classList.add('light');
        themeToggle.textContent = 'Светлая';
    } else {
        themeToggle.textContent = 'Тёмная';
    }
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light');
        const isLight = document.body.classList.contains('light');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        themeToggle.textContent = isLight ? 'Светлая' : 'Тёмная';
    });


    document.querySelectorAll('[data-link]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('data-link');
            if (target && sections[target]) {
                sections[target].scrollIntoView({ behavior: 'smooth', block: 'start' });
                closeMenu();
            }
        });
    });
    
    document.getElementById('exploreBtn')?.addEventListener('click', () => {
        sections['offers']?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });


    function openMenu() {
        navMenu.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeMenu() {
        navMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    hamburger?.addEventListener('click', () => {
        navMenu.classList.contains('active') ? closeMenu() : openMenu();
    });
    
    overlay?.addEventListener('click', closeMenu);
    
    document.querySelectorAll('.nav-menu a, .nav-menu button').forEach(el => {
        el.addEventListener('click', closeMenu);
    });


    if (reviewTrack) {
        let originalSlides = Array.from(document.querySelectorAll('.review-item'));
        const realSlidesCount = originalSlides.length;
        let currentIndex = realSlidesCount;
        let autoInterval;
        let isTransitioning = false;
        let touchStartX = 0;
        let touchEndX = 0;


        reviewTrack.innerHTML = '';
        for (let i = realSlidesCount - 1; i >= 0; i--) {
            reviewTrack.appendChild(originalSlides[i].cloneNode(true));
        }
        originalSlides.forEach(slide => {
            reviewTrack.appendChild(slide.cloneNode(true));
        });
        for (let i = 0; i < realSlidesCount; i++) {
            reviewTrack.appendChild(originalSlides[i].cloneNode(true));
        }

        const allSlides = document.querySelectorAll('.review-item');
        const totalSlides = allSlides.length;

        function updateSlider(animate = true) {
            if (isTransitioning && animate) return;
            if (animate) isTransitioning = true;
            reviewTrack.style.transition = animate ? 'transform 0.5s cubic-bezier(0.25, 0.9, 0.4, 1)' : 'none';
            reviewTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
            if (animate) {
                setTimeout(() => {
                    isTransitioning = false;
                    checkAndResetIndex();
                }, 500);
            } else {
                checkAndResetIndex();
            }
            updateDots();
        }

        function checkAndResetIndex() {
            if (currentIndex >= totalSlides - realSlidesCount) {
                reviewTrack.style.transition = 'none';
                currentIndex = realSlidesCount;
                reviewTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
                void reviewTrack.offsetHeight;
            }
            if (currentIndex < realSlidesCount) {
                reviewTrack.style.transition = 'none';
                currentIndex = totalSlides - realSlidesCount * 2;
                reviewTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
                void reviewTrack.offsetHeight;
            }
        }

        function nextSlide() {
            if (isTransitioning) return;
            currentIndex++;
            updateSlider(true);
            resetAuto();
        }

        function prevSlide() {
            if (isTransitioning) return;
            currentIndex--;
            updateSlider(true);
            resetAuto();
        }

        function updateDots() {
            const activeIndex = currentIndex % realSlidesCount;
            document.querySelectorAll('.review-dot').forEach((dot, i) => {
                dot.classList.toggle('active-dot', i === activeIndex);
            });
        }

        function startAuto() {
            if (autoInterval) clearInterval(autoInterval);
            autoInterval = setInterval(() => {
                if (!isTransitioning) nextSlide();
            }, 5000);
        }

        function resetAuto() {
            clearInterval(autoInterval);
            startAuto();
        }


        const prevBtn = document.getElementById('prevReviewBtn');
        const nextBtn = document.getElementById('nextReviewBtn');
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);


        const sliderContainer = document.querySelector('.testimonial-carousel');
        if (sliderContainer) {
            sliderContainer.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            });
            sliderContainer.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                if (touchEndX < touchStartX - 50) nextSlide();
                if (touchEndX > touchStartX + 50) prevSlide();
            });
        }


        function buildDots() {
            const container = document.getElementById('reviewDots');
            if (!container) return;
            container.innerHTML = '';
            for (let i = 0; i < realSlidesCount; i++) {
                let dot = document.createElement('div');
                dot.classList.add('review-dot');
                dot.addEventListener('click', () => {
                    if (isTransitioning) return;
                    currentIndex = realSlidesCount + i;
                    updateSlider(true);
                    resetAuto();
                });
                container.appendChild(dot);
            }
            updateDots();
        }

        buildDots();
        updateSlider(false);
        startAuto();


        const carouselContainer = document.querySelector('.testimonial-carousel');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => clearInterval(autoInterval));
            carouselContainer.addEventListener('mouseleave', startAuto);
        }
    }


    if (form) {
        const nameInp = document.getElementById('userName');
        const emailInp = document.getElementById('userEmail');
        const msgInp = document.getElementById('userMessage');
        const nameErr = document.getElementById('nameError');
        const emailErr = document.getElementById('emailError');
        const msgErr = document.getElementById('messageError');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let valid = true;

            if (!nameInp.value.trim() || nameInp.value.trim().length < 2) {
                nameErr.classList.add('show');
                valid = false;
            } else {
                nameErr.classList.remove('show');
            }

            const email = emailInp.value.trim();
            const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
            if (!email || !emailRegex.test(email)) {
                emailErr.classList.add('show');
                valid = false;
            } else {
                emailErr.classList.remove('show');
            }

            if (!msgInp.value.trim()) {
                msgErr.classList.add('show');
                valid = false;
            } else {
                msgErr.classList.remove('show');
            }

            if (valid) {
                alert('Спасибо! Ваше сообщение отправлено.');
                form.reset();
            }
        });
    }


    if (typeof ymaps !== 'undefined') {
        ymaps.ready(initMap);
    }

    function initMap() {
        const targetCoords = [46.349418, 48.033844];
        const mapElement = document.getElementById('yandexMap');
        if (!mapElement) return;

        const map = new ymaps.Map("yandexMap", {
            center: targetCoords,
            zoom: 17,
            controls: ['zoomControl', 'fullscreenControl']
        });

        const placemark = new ymaps.Placemark(targetCoords, {
            balloonContent: '<strong>Улица Василия Тредиаковского</strong><br>Центральный район Астрахани, историческая часть'
        }, {
            preset: 'islands#blueCircleIcon',
            iconColor: '#1e6a9f'
        });

        map.geoObjects.add(placemark);
        map.setCenter(targetCoords, 17);
    }


    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -10px 0px' });

    animElements.forEach(el => observer.observe(el));

    setTimeout(() => {
        animElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                el.classList.add('visible');
            }
        });
    }, 100);
});
