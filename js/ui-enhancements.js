// Back to Top Button Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Create back to top button
    const backToTopButton = document.createElement('button');
    backToTopButton.id = 'back-to-top';
    backToTopButton.innerHTML = '↑';
    backToTopButton.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTopButton);

    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    // Scroll to top when clicked
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

// Form Validation Enhancement
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        
        inputs.forEach(input => {
            // Add real-time validation
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
        
        // Form submission handling
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });
            
            if (isValid) {
                // Show loading state
                const submitButton = form.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                submitButton.textContent = 'Sending...';
                submitButton.disabled = true;
                
                // Get form data
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                
                // Send to Formspree
                fetch(form.action, {
                    method: form.method,
                    body: JSON.stringify(data),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                }).then(response => {
                    if (response.ok) {
                        alert('Thank you! Your inquiry has been submitted. We will get back to you soon.');
                        form.reset();
                        // If it's the multi-step form, reset it to step 0
                        if (typeof updateUI === 'function') {
                            currentStep = 0;
                            updateUI(0);
                        }
                    } else {
                        response.json().then(data => {
                            if (Object.hasOwn(data, 'errors')) {
                                alert(data["errors"].map(error => error["message"]).join(", "));
                            } else {
                                alert('Oops! There was a problem submitting your form. Please try again.');
                            }
                        });
                    }
                }).catch(error => {
                    alert('Oops! There was a problem submitting your form. Please try again.');
                }).finally(() => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                });
            }
        });
    });
});

function validateField(field) {
    const value = field.value.trim();
    const fieldGroup = field.closest('.form-group') || field.closest('.filter-group');
    
    // Remove existing error message
    const existingError = fieldGroup?.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    field.classList.remove('error');
    
    // Check if field is required and empty
    if (field.hasAttribute('required') && value === '') {
        showError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Phone validation (basic)
    if (field.type === 'tel' && value !== '') {
        const phoneRegex = /^[\d\s\+\-\(\)]+$/;
        if (!phoneRegex.test(value)) {
            showError(field, 'Please enter a valid phone number');
            return false;
        }
    }
    
    return true;
}

function showError(field, message) {
    field.classList.add('error');
    const fieldGroup = field.closest('.form-group') || field.closest('.filter-group');
    
    if (fieldGroup) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = '#d32f2f';
        errorDiv.style.fontSize = '0.875em';
        errorDiv.style.marginTop = '5px';
        fieldGroup.appendChild(errorDiv);
    }
}

// Add smooth scrolling to all anchor links
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Button Interaction Effects
    const buttons = document.querySelectorAll('.cta-button, .primary-cta-button, .secondary-cta-button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
});

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('header nav');
    
    let overlay = document.querySelector('.menu-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        document.body.appendChild(overlay);
    }

    function toggleMenu() {
        hamburger.classList.toggle('open');
        nav.classList.toggle('open');
        overlay.classList.toggle('active');
        const isOpen = hamburger.classList.contains('open');
        hamburger.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    if (hamburger && nav) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        overlay.addEventListener('click', toggleMenu);

        const navLinks = nav.querySelectorAll('ul li a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const parentLi = link.parentElement;
                if (parentLi.classList.contains('has-dropdown') && window.innerWidth <= 768) {
                    e.preventDefault();
                    parentLi.classList.toggle('active');
                } else if (nav.classList.contains('open')) {
                    toggleMenu();
                }
            });
        });
    }
});

// WhatsApp Widget Injection
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('whatsapp-widget')) {
        const whatsappWidget = document.createElement('a');
        whatsappWidget.id = 'whatsapp-widget';
        whatsappWidget.href = 'https://wa.me/263714448210';
        whatsappWidget.target = '_blank';
        whatsappWidget.setAttribute('aria-label', 'Contact us on WhatsApp');
        whatsappWidget.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9" />
                <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1" />
            </svg>
        `;
        document.body.appendChild(whatsappWidget);
    }
});

// FAQ Accordion Functionality
document.addEventListener('DOMContentLoaded', () => {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const isOpen = faqItem.classList.contains('active');
            
            // Close all other FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Toggle current item
            if (!isOpen) {
                faqItem.classList.add('active');
            }
        });
    });
});

// Testimonial Carousel Functionality
document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.testimonials-track');
    if (!track) return;

    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.carousel-button.next');
    const prevButton = document.querySelector('.carousel-button.prev');
    const dotsNav = document.querySelector('.carousel-nav');
    if (!dotsNav) return;
    const dots = Array.from(dotsNav.children);

    const slideWidth = slides[0].getBoundingClientRect().width;

    // Arrange the slides next to each other
    const setSlidePosition = (slide, index) => {
        slide.style.left = slideWidth * index + 'px';
    };
    slides.forEach(setSlidePosition);

    const moveToSlide = (track, currentSlide, targetSlide) => {
        track.style.transform = 'translateX(-' + (targetSlide.style.left || '0px') + ')';
        currentSlide.classList.remove('current-slide');
        targetSlide.classList.add('current-slide');
    };

    const updateDots = (currentDot, targetDot) => {
        currentDot.classList.remove('active');
        targetDot.classList.add('active');
    };

    const hideShowArrows = (slides, prevButton, nextButton, targetIndex) => {
        if (!prevButton || !nextButton) return;
        if (targetIndex === 0) {
            prevButton.style.display = 'none';
            nextButton.style.display = 'block';
        } else if (targetIndex === slides.length - 1) {
            prevButton.style.display = 'block';
            nextButton.style.display = 'none';
        } else {
            prevButton.style.display = 'block';
            nextButton.style.display = 'block';
        }
    };

    // Click Prev, move left
    prevButton?.addEventListener('click', e => {
        const currentSlide = track.querySelector('.current-slide') || slides[0];
        const prevSlide = currentSlide.previousElementSibling;
        const currentDot = dotsNav.querySelector('.active');
        const prevDot = currentDot.previousElementSibling;
        const prevIndex = slides.findIndex(slide => slide === prevSlide);

        if (prevSlide) {
            moveToSlide(track, currentSlide, prevSlide);
            updateDots(currentDot, prevDot);
            hideShowArrows(slides, prevButton, nextButton, prevIndex);
        }
    });

    // Click Next, move right
    nextButton?.addEventListener('click', e => {
        const currentSlide = track.querySelector('.current-slide') || slides[0];
        const nextSlide = currentSlide.nextElementSibling;
        const currentDot = dotsNav.querySelector('.active');
        const nextDot = currentDot.nextElementSibling;
        const nextIndex = slides.findIndex(slide => slide === nextSlide);

        if (nextSlide) {
            moveToSlide(track, currentSlide, nextSlide);
            updateDots(currentDot, nextDot);
            hideShowArrows(slides, prevButton, nextButton, nextIndex);
        }
    });

    // Click indicators, move to that slide
    dotsNav.addEventListener('click', e => {
        const targetDot = e.target.closest('button');
        if (!targetDot) return;

        const currentSlide = track.querySelector('.current-slide') || slides[0];
        const currentDot = dotsNav.querySelector('.active');
        const targetIndex = dots.findIndex(dot => dot === targetDot);
        const targetSlide = slides[targetIndex];

        moveToSlide(track, currentSlide, targetSlide);
        updateDots(currentDot, targetDot);
        hideShowArrows(slides, prevButton, nextButton, targetIndex);
    });

    // Auto-play
    let autoPlayInterval = setInterval(() => {
        const currentSlide = track.querySelector('.current-slide') || slides[0];
        const nextSlide = currentSlide.nextElementSibling;
        
        if (nextSlide) {
            nextButton?.click();
        } else {
            // Reset to beginning if at the end
            dots[0].click();
        }
    }, 6000);

    // Pause auto-play on interaction
    const stopAutoPlay = () => clearInterval(autoPlayInterval);
    track.addEventListener('mouseenter', stopAutoPlay);
    nextButton?.addEventListener('click', stopAutoPlay);
    prevButton?.addEventListener('click', stopAutoPlay);
    dotsNav.addEventListener('click', stopAutoPlay);
});

// Multi-step Form Functionality (Contact Page)
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.multi-step-form');
    if (!form) return;

    const steps = Array.from(form.querySelectorAll('.form-step'));
    const progressBar = document.getElementById('form-progress-bar');
    const indicators = Array.from(document.querySelectorAll('.step-indicator'));
    const nextButtons = form.querySelectorAll('.next-step');
    const prevButtons = form.querySelectorAll('.prev-step');

    const updateUI = (currentStepIndex) => {
        // Update Progress Bar
        const progress = (currentStepIndex / (steps.length - 1)) * 100;
        if (progressBar) {
            progressBar.style.setProperty('--progress-width', `${progress}%`);
            // We need to update the style to actually use the variable if we used inline or CSS
            // Since I used ::before in CSS, I'll update the style property or use a class
            progressBar.style.width = '100%'; // Base width
            document.documentElement.style.setProperty('--form-progress', `${progress}%`);
        }

        // Update indicators
        indicators.forEach((indicator, index) => {
            if (index <= currentStepIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });

        // Show/Hide Steps
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === currentStepIndex);
        });
    };

    let currentStep = 0;

    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Basic validation for the current step
            const currentStepEl = steps[currentStep];
            const inputs = Array.from(currentStepEl.querySelectorAll('input, select, textarea'));
            const isValid = inputs.every(input => {
                if (input.hasAttribute('required')) {
                    if (typeof validateField === 'function') {
                        return validateField(input);
                    }
                    return input.value.trim() !== '';
                }
                return true;
            });

            if (isValid) {
                currentStep++;
                updateUI(currentStep);
            }
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentStep--;
            updateUI(currentStep);
        });
    });

    // Initialize UI
    updateUI(currentStep);
});

// Adding support for the progress variable in CSS via JS
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.innerHTML = `
        .progress-bar::before {
            width: var(--form-progress, 0%) !important;
        }
    `;
    document.head.appendChild(style);
});

// Reveal Animations (Intersection Observer)
document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.reveal');
    
    // Add reveal class to some sections if they don't have it
    const sectionsToReveal = document.querySelectorAll('section:not(.search-hero):not(.contact-hero):not(.resources-hero)');
    sectionsToReveal.forEach(section => section.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
});

// Download Resource Modal logic
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('download-modal');
    if (!modal) return;

    const downloadTriggers = document.querySelectorAll('.download-trigger');
    const closeBtn = document.querySelector('.close-modal');
    const modalGuideName = document.getElementById('modal-guide-name');
    const emailGateForm = document.getElementById('email-gate-form');

    downloadTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const guideName = trigger.getAttribute('data-guide');
            modalGuideName.textContent = guideName;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scroll
        });
    });

    const closeModal = () => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    };

    closeBtn?.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    emailGateForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('gate-email').value;
        const guide = modalGuideName.textContent;
        
        // Simulate sending and downloading
        const submitBtn = emailGateForm.querySelector('button');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Preparing your guide...';
        submitBtn.disabled = true;

        setTimeout(() => {
            alert(`Success! A download link for the "${guide}" has been sent to ${email}.\n\n(Simulating PDF download...)`);
            closeModal();
            emailGateForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
});

// Counter Animation for Key Stats
document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;

    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const inc = Math.max(1, target / speed);

        if (count < target) {
            counter.innerText = Math.ceil(count + inc);
            setTimeout(() => animateCounter(counter), 20);
        } else {
            counter.innerText = target;
        }
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
});
