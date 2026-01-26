/* ========================================
   aShell You - Website JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initNavigation();
    initTypingAnimation();
    initScrollAnimations();
    initCarousel();
    initSmoothScroll();
});

/* ========================================
   Navigation
   ======================================== */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

/* ========================================
   Typing Animation
   ======================================== */
function initTypingAnimation() {
    const typingElement = document.querySelector('.typing-text');
    const phrases = [
        'Execute ADB Commands on Your Device',
        'No PC Required',
        'Material You Design',
        'Powered by Shizuku',
        'Control Devices via OTG',
        'Wireless Debugging Support'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isPaused) {
            setTimeout(type, 100);
            return;
        }

        if (isDeleting) {
            typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 30 : 50;

        if (!isDeleting && charIndex === currentPhrase.length) {
            isPaused = true;
            setTimeout(() => {
                isPaused = false;
                isDeleting = true;
            }, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
        }

        setTimeout(type, typeSpeed);
    }

    // Start typing animation
    setTimeout(type, 1000);
}

/* ========================================
   Scroll Animations
   ======================================== */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Animate stat numbers if in hero section
                if (entry.target.classList.contains('hero-stats')) {
                    animateStats();
                }
            }
        });
    }, observerOptions);

    // Observe feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        observer.observe(card);
    });

    // Observe other animated elements
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // Observe sections for header animations
    document.querySelectorAll('.section-header').forEach(header => {
        header.classList.add('fade-in');
        observer.observe(header);
    });

    // Observe requirement cards
    document.querySelectorAll('.requirement-card').forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.transitionDelay = `${index * 100}ms`;
        observer.observe(card);
    });

    // Observe download cards
    document.querySelectorAll('.download-card').forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.transitionDelay = `${index * 100}ms`;
        observer.observe(card);
    });

    // Observe community cards
    document.querySelectorAll('.community-card').forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.transitionDelay = `${index * 100}ms`;
        observer.observe(card);
    });
}

function animateStats() {
    const stats = document.querySelectorAll('.stat-number');

    stats.forEach(stat => {
        const text = stat.textContent;
        const hasPlus = text.includes('+');
        const hasK = text.includes('k');
        let target = parseFloat(text.replace(/[^0-9.]/g, ''));

        if (hasK) {
            target = target * 1000;
        }

        let current = 0;
        const increment = target / 50;
        const duration = 1500;
        const stepTime = duration / 50;

        const counter = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(counter);
            }

            let displayValue;
            if (hasK) {
                displayValue = (current / 1000).toFixed(1) + 'k';
            } else {
                displayValue = Math.floor(current).toString();
            }

            if (hasPlus) {
                displayValue += '+';
            }

            stat.textContent = displayValue;
        }, stepTime);
    });
}

/* ========================================
   Screenshot Carousel
   ======================================== */
function initCarousel() {
    const track = document.getElementById('carousel-track');
    const slides = track.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dotsContainer = document.getElementById('carousel-dots');

    let currentIndex = 0;
    let slidesPerView = getSlidesPerView();
    let autoplayInterval;
    let isHovered = false;

    // Create dots
    function createDots() {
        dotsContainer.innerHTML = '';
        const totalDots = Math.ceil(slides.length / slidesPerView);

        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i * slidesPerView));
            dotsContainer.appendChild(dot);
        }
    }

    function getSlidesPerView() {
        if (window.innerWidth < 480) return 1;
        if (window.innerWidth < 768) return 2;
        if (window.innerWidth < 1024) return 3;
        return 4;
    }

    function getSlideWidth() {
        const slide = slides[0];
        const style = window.getComputedStyle(slide);
        const marginRight = parseFloat(style.marginRight) || 0;
        return slide.offsetWidth + 24; // 24px is the gap
    }

    function updateCarousel() {
        const slideWidth = getSlideWidth();
        const maxIndex = slides.length - slidesPerView;

        if (currentIndex > maxIndex) {
            currentIndex = maxIndex;
        }
        if (currentIndex < 0) {
            currentIndex = 0;
        }

        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

        // Update dots
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === Math.floor(currentIndex / slidesPerView));
        });
    }

    function nextSlide() {
        const maxIndex = slides.length - slidesPerView;
        currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
        updateCarousel();
    }

    function prevSlide() {
        const maxIndex = slides.length - slidesPerView;
        currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
        updateCarousel();
    }

    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }

    function startAutoplay() {
        stopAutoplay();
        autoplayInterval = setInterval(() => {
            if (!isHovered) {
                nextSlide();
            }
        }, 3000);
    }

    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
    }

    // Event listeners
    prevBtn.addEventListener('click', () => {
        prevSlide();
        startAutoplay();
    });

    nextBtn.addEventListener('click', () => {
        nextSlide();
        startAutoplay();
    });

    track.addEventListener('mouseenter', () => {
        isHovered = true;
    });

    track.addEventListener('mouseleave', () => {
        isHovered = false;
    });

    // Handle resize
    window.addEventListener('resize', () => {
        slidesPerView = getSlidesPerView();
        createDots();
        updateCarousel();
    });

    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            startAutoplay();
        }
    }

    // Initialize
    createDots();
    startAutoplay();
}

/* ========================================
   Smooth Scroll
   ======================================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ========================================
   Parallax Effects (Optional Enhancement)
   ======================================== */
function initParallax() {
    const orbs = document.querySelectorAll('.gradient-orb');

    window.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;

        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 20;
            const x = mouseX * speed;
            const y = mouseY * speed;

            orb.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}

/* ========================================
   Hero Screenshot Rotation
   ======================================== */
function initHeroScreenshotRotation() {
    const heroScreenshot = document.getElementById('hero-screenshot');
    const screenshots = [
        'https://raw.githubusercontent.com/DP-Hridayan/aShellYou/master/fastlane/metadata/android/en-US/images/phoneScreenshots/01.jpeg',
        'https://raw.githubusercontent.com/DP-Hridayan/aShellYou/master/fastlane/metadata/android/en-US/images/phoneScreenshots/02.jpeg',
        'https://raw.githubusercontent.com/DP-Hridayan/aShellYou/master/fastlane/metadata/android/en-US/images/phoneScreenshots/03.jpeg',
        'https://raw.githubusercontent.com/DP-Hridayan/aShellYou/master/fastlane/metadata/android/en-US/images/phoneScreenshots/04.jpeg',
        'https://raw.githubusercontent.com/DP-Hridayan/aShellYou/master/fastlane/metadata/android/en-US/images/phoneScreenshots/05.jpeg'
    ];

    let currentIndex = 0;

    setInterval(() => {
        currentIndex = (currentIndex + 1) % screenshots.length;
        heroScreenshot.style.opacity = '0';

        setTimeout(() => {
            heroScreenshot.src = screenshots[currentIndex];
            heroScreenshot.style.opacity = '1';
        }, 300);
    }, 4000);

    // Add transition for fade effect
    heroScreenshot.style.transition = 'opacity 0.3s ease';
}

// Initialize hero screenshot rotation after page load
window.addEventListener('load', () => {
    initHeroScreenshotRotation();
    initParallax();
});
