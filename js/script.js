// SafeNest Security - Main JavaScript File

'use strict';

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeAnimations();
    initializeCounters();
    initializeFormValidation();
    initializeScrollEffects();
    initializeAccessibility();
    initializeImageGallery();
    initializeContactForm();
});

// Navigation Management
function initializeNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.header');
    
    if (navToggle && navMenu) {
        // Mobile menu toggle
        navToggle.addEventListener('click', function() {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            
            navToggle.setAttribute('aria-expanded', !isOpen);
            navMenu.classList.toggle('nav-open');
            
            // Trap focus in mobile menu when open
            if (!isOpen) {
                navLinks[0]?.focus();
            }
        });
        
        // Close mobile menu when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('nav-open');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('nav-open');
            }
        });
        
        // Handle escape key for mobile menu
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && navMenu.classList.contains('nav-open')) {
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('nav-open');
                navToggle.focus();
            }
        });
    }
    
    // Header scroll effect
    if (header) {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', function() {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.05)';
            }
            
            // Hide/show header on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 500) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        });
    }
}

// Animation Management
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Add stagger animation for grid items
                if (entry.target.classList.contains('features-grid') || 
                    entry.target.classList.contains('stats-grid')) {
                    const children = entry.target.children;
                    Array.from(children).forEach((child, index) => {
                        setTimeout(() => {
                            child.style.opacity = '1';
                            child.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .stat-item, .cta-content, .section-title');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
    
    // Observe grid containers
    const gridContainers = document.querySelectorAll('.features-grid, .stats-grid');
    gridContainers.forEach(grid => {
        const children = grid.children;
        Array.from(children).forEach(child => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(30px)';
            child.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        });
        observer.observe(grid);
    });
}

// Counter Animation
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
                // Add "+" for certain counters
                if (target === 5000) {
                    counter.textContent = '5,000+';
                } else if (target === 99) {
                    counter.textContent = '99.9%';
                } else if (target === 15) {
                    counter.textContent = '15+';
                } else if (target === 24) {
                    counter.textContent = '24/7';
                }
            }
        };
        
        updateCounter();
    };
    
    // Intersection Observer for counters
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Form Validation
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Real-time validation
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
        
    });
}

function initializeScrollEffects() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translate3d(0, ${rate}px, 0)`;
        });
    }
}

function initializeAccessibility() {
    const skipNav = document.createElement('a');
    skipNav.href = '#main';
    skipNav.className = 'skip-nav';
    skipNav.textContent = 'Skip to main content';
    document.body.insertBefore(skipNav, document.body.firstChild);
    
    let main = document.querySelector('main');
    if (!main) {
        main = document.createElement('main');
        main.id = 'main';
        const content = document.querySelector('.hero');
        if (content) {
            content.parentNode.insertBefore(main, content);
            main.appendChild(content);
        }
    } else {
        main.id = 'main';
    }
    
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const openModal = document.querySelector('.modal.open');
            const openDropdown = document.querySelector('.dropdown.open');
            
            if (openModal) {
                closeModal(openModal);
            } else if (openDropdown) {
                closeDropdown(openDropdown);
            }
        }
    });
    
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.id = 'announcer';
    document.body.appendChild(announcer);
    
    if (window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches) {
        document.body.classList.add('high-contrast');
    }
    
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.body.classList.add('reduced-motion');
    }
}

function initializeImageGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const closeModal = document.querySelector('.modal-close');
    const prevBtn = document.querySelector('.modal-prev');
    const nextBtn = document.querySelector('.modal-next');
    
    let currentImageIndex = 0;
    let images = [];
    
    if (thumbnails.length > 0) {
        thumbnails.forEach((thumb, index) => {
            images.push({
                src: thumb.getAttribute('data-full'),
                alt: thumb.querySelector('img').alt,
                caption: thumb.getAttribute('data-caption') || ''
            });
            
            thumb.addEventListener('click', function(e) {
                e.preventDefault();
                currentImageIndex = index;
                openImageModal();
            });
            
            thumb.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    currentImageIndex = index;
                    openImageModal();
                }
            });
        });
    }
    
    function openImageModal() {
        if (modal && images[currentImageIndex]) {
            modal.classList.add('open');
            modalImage.src = images[currentImageIndex].src;
            modalImage.alt = images[currentImageIndex].alt;
            
            const caption = modal.querySelector('.modal-caption');
            if (caption) {
                caption.textContent = images[currentImageIndex].caption;
            }
            
            modal.focus();
            document.body.style.overflow = 'hidden';
            
            announce(`Opened image ${currentImageIndex + 1} of ${images.length}: ${images[currentImageIndex].alt}`);
        }
    }
    
    function closeImageModal() {
        if (modal) {
            modal.classList.remove('open');
            document.body.style.overflow = '';
            
            if (thumbnails[currentImageIndex]) {
                thumbnails[currentImageIndex].focus();
            }
        }
    }
    
    function showPreviousImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        openImageModal();
    }
    
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        openImageModal();
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', closeImageModal);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', showPreviousImage);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', showNextImage);
    }
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeImageModal();
            }
        });
        
        modal.addEventListener('keydown', function(e) {
            switch (e.key) {
                case 'Escape':
                    closeImageModal();
                    break;
                case 'ArrowLeft':
                    showPreviousImage();
                    break;
                case 'ArrowRight':
                    showNextImage();
                    break;
            }
        });
    }
}

function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    const serviceSelect = contactForm.querySelector('select[name="service"]');
    const messageTextarea = contactForm.querySelector('textarea[name="message"]');
    
    if (serviceSelect && messageTextarea) {
        serviceSelect.addEventListener('change', function() {
            const selectedService = this.value;
            let messageTemplate = '';
            
            switch (selectedService) {
                case 'smart-locks':
                    messageTemplate = 'Hi, I\'m interested in learning more about your smart lock solutions. Please provide information about installation, pricing, and features.';
                    break;
                case 'surveillance':
                    messageTemplate = 'Hello, I\'d like to know more about your surveillance systems. Can you provide details about camera options, monitoring services, and pricing?';
                    break;
                case 'consultation':
                    messageTemplate = 'Hi, I\'m interested in scheduling a home security consultation. Please let me know your availability and what the assessment includes.';
                    break;
                case 'monitoring':
                    messageTemplate = 'Hello, I\'d like information about your 24/7 monitoring services. What does this include and what are the monthly costs?';
                    break;
            }
            
            if (messageTemplate && !messageTextarea.value) {
                messageTextarea.value = messageTemplate;
            }
        });
    }
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        setTimeout(() => {
            submitButton.textContent = 'Message Sent!';
            submitButton.style.background = 'var(--success-color)';
            
            showSuccessMessage(this);
            
            setTimeout(() => {
                this.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                submitButton.style.background = '';
            }, 3000);
        }, 1500);
    });
}

function announce(message) {
    const announcer = document.getElementById('announcer');
    if (announcer) {
        announcer.textContent = message;
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

const optimizedScrollHandler = throttle(function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-background');
    
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translate3d(0, ${scrolled * 0.5}px, 0)`;
    }
}, 16);

window.addEventListener('scroll', optimizedScrollHandler);

function initializeLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

document.addEventListener('DOMContentLoaded', initializeLazyLoading);

// Cookie consent (if needed)
function initializeCookieConsent() {
    const cookieConsent = localStorage.getItem('cookieConsent');
    
    if (!cookieConsent) {
        const consentBanner = document.createElement('div');
        consentBanner.className = 'cookie-consent';
        consentBanner.innerHTML = `
            <div class="cookie-content">
                <p>We use cookies to enhance your browsing experience. By continuing to use this site, you agree to our use of cookies.</p>
                <div class="cookie-actions">
                    <button class="btn btn-primary accept-cookies">Accept</button>
                    <button class="btn btn-secondary decline-cookies">Decline</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(consentBanner);
        
        consentBanner.querySelector('.accept-cookies').addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'accepted');
            consentBanner.remove();
        });
        
        consentBanner.querySelector('.decline-cookies').addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'declined');
            consentBanner.remove();
        });
    }
}

function initializeDarkMode() {
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    if (darkModeToggle) {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        const systemTheme = prefersDark.matches ? 'dark' : 'light';
        const currentTheme = savedTheme || systemTheme;
        
        document.documentElement.setAttribute('data-theme', currentTheme);
        
        darkModeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
        
        prefersDark.addEventListener('change', function(e) {
            if (!localStorage.getItem('theme')) {
                document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initializeCookieConsent();
    initializeDarkMode();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateField,
        announce,
        debounce,
        throttle
    };
}