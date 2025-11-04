// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger) {
        // accessibility attrs
        hamburger.setAttribute('role', 'button');
        hamburger.setAttribute('aria-label', '메뉴 열기/닫기');
        hamburger.setAttribute('tabindex', '0');

        const toggleMenu = () => {
            hamburger.classList.toggle('active');
            if (navMenu) navMenu.classList.toggle('active');
            const expanded = hamburger.classList.contains('active');
            hamburger.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        };

        hamburger.addEventListener('click', toggleMenu);
        hamburger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
            }
        });
    }

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        if (hamburger) hamburger.classList.remove('active');
        if (navMenu) navMenu.classList.remove('active');
    }));

    // Smooth scrolling for navigation links (header height calculated dynamically)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            const headerEl = document.querySelector('.header');
            const headerOffset = headerEl ? headerEl.offsetHeight + 10 : 80; // safe fallback
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            // Use smooth scroll if available, otherwise fallback
            if ('scrollBehavior' in document.documentElement.style) {
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            } else {
                window.scrollTo(0, offsetPosition);
            }
            // Close mobile nav if open
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (hamburger) hamburger.classList.remove('active');
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }

        lastScrollTop = scrollTop;
    });

    // Contact form handling (only if form exists on the page)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Basic form validation
            if (!validateForm(data)) {
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn ? submitBtn.textContent : '';
            if (submitBtn) {
                submitBtn.textContent = '전송 중...';
                submitBtn.disabled = true;
            }
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                showNotification('문의가 성공적으로 전송되었습니다!', 'success');
                contactForm.reset();
                if (submitBtn) {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            }, 2000);
        });
    }

    // Form validation
    function validateForm(data) {
        const { name, phone, email, service, message } = data;
        
        if (!name.trim()) {
            showNotification('이름을 입력해주세요.', 'error');
            return false;
        }
        
        if (!phone.trim()) {
            showNotification('연락처를 입력해주세요.', 'error');
            return false;
        }
        
        if (!email.trim() || !isValidEmail(email)) {
            showNotification('올바른 이메일 주소를 입력해주세요.', 'error');
            return false;
        }
        
        if (!service) {
            showNotification('관심 서비스를 선택해주세요.', 'error');
            return false;
        }
        
        if (!message.trim()) {
            showNotification('문의 내용을 입력해주세요.', 'error');
            return false;
        }
        
        return true;
    }

    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 400px;
        `;
        
        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            .notification-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 1rem;
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                opacity: 0.8;
                transition: opacity 0.3s ease;
            }
            .notification-close:hover {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
        
        // Add to page
        document.body.appendChild(notification);
        
        // Close button functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.service-card, .feature-list li, .contact-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Counter animation for stats (if needed)
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        
        updateCounter();
    }

    // Utility function for debouncing
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

    // Performance optimization for scroll events
    const debouncedScrollHandler = debounce(() => {
        // Handle scroll events here if needed
    }, 100);

    window.addEventListener('scroll', debouncedScrollHandler);

    // Loading screen (optional)
    window.addEventListener('load', function() {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.remove();
            }, 500);
        }
    });

    // FAQ Accordion (keyboard accessible)
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (!question) return;
        question.setAttribute('tabindex', '0');
        question.setAttribute('role', 'button');
        question.setAttribute('aria-expanded', 'false');

        const toggleFaq = () => {
            // Close other open FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherQ = otherItem.querySelector('.faq-question');
                    if (otherQ) otherQ.setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current FAQ item
            const isActive = item.classList.toggle('active');
            question.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        };

        question.addEventListener('click', toggleFaq);
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFaq();
            }
        });
    });

    // Console log for debugging
    console.log('비즈니스 웹사이트가 성공적으로 로드되었습니다.');

    // Hero slider (accessible, autoplay, touch-enabled)
    const slider = document.querySelector('.hero-visual .slider');
    if (slider) {
        const slidesWrap = slider.querySelector('.slides');
        const slides = Array.from(slidesWrap.querySelectorAll('.slide'));
        const prevBtn = slider.querySelector('.slider-control.prev');
        const nextBtn = slider.querySelector('.slider-control.next');
        const dotsWrap = slider.querySelector('.slider-dots');

        let index = 0;
        let autoTimer = null;
        const interval = 5000;
        const total = slides.length;

        // Build dots
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', `${i + 1}번 슬라이드`);
            dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
            dot.addEventListener('click', () => goTo(i));
            dotsWrap.appendChild(dot);
        });

        const dots = Array.from(dotsWrap.querySelectorAll('button'));

        function update() {
            slidesWrap.style.transform = `translateX(-${index * 100}%)`;
            slides.forEach((s, i) => {
                const active = i === index;
                s.classList.toggle('is-active', active);
                s.setAttribute('aria-hidden', active ? 'false' : 'true');
            });
            dots.forEach((d, i) => d.setAttribute('aria-selected', i === index ? 'true' : 'false'));
        }

        function goTo(i) {
            index = (i + total) % total;
            update();
            restartAuto();
        }

        function next() { goTo(index + 1); }
        function prev() { goTo(index - 1); }

        // Controls
        if (prevBtn) prevBtn.addEventListener('click', prev);
        if (nextBtn) nextBtn.addEventListener('click', next);

        // Keyboard access
        slider.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
            if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
        });

        // Autoplay with pause on hover/focus
        function startAuto() {
            if (autoTimer) return;
            autoTimer = setInterval(next, interval);
        }
        function stopAuto() {
            if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
        }
        function restartAuto() { stopAuto(); startAuto(); }

        slider.addEventListener('mouseenter', stopAuto);
        slider.addEventListener('mouseleave', startAuto);
        slider.addEventListener('focusin', stopAuto);
        slider.addEventListener('focusout', startAuto);

        // Touch swipe support
        let startX = 0; let deltaX = 0; let isTouching = false;
        slider.addEventListener('touchstart', (e) => {
            isTouching = true;
            startX = e.touches[0].clientX;
            deltaX = 0;
            stopAuto();
        }, { passive: true });
        slider.addEventListener('touchmove', (e) => {
            if (!isTouching) return;
            deltaX = e.touches[0].clientX - startX;
        }, { passive: true });
        slider.addEventListener('touchend', () => {
            if (!isTouching) return;
            if (Math.abs(deltaX) > 50) {
                if (deltaX < 0) next(); else prev();
            } else {
                startAuto();
            }
            isTouching = false;
        });

        // Init
        update();
        startAuto();
    }

    // In-page TOC: sticky highlight (scrollspy)
    const toc = document.querySelector('.toc');
    if (toc) {
        const tocLinks = Array.from(toc.querySelectorAll('a[href^="#"]'));
        const sectionMap = new Map();
        tocLinks.forEach(link => {
            const id = link.getAttribute('href');
            if (!id || id === '#') return;
            const section = document.querySelector(id);
            if (section) sectionMap.set(section, link);
        });

        function setActive(link) {
            tocLinks.forEach(a => {
                a.classList.remove('is-active');
                a.removeAttribute('aria-current');
            });
            if (link) {
                link.classList.add('is-active');
                link.setAttribute('aria-current', 'true');
            }
        }

        // Highlight on click immediately
        tocLinks.forEach(link => {
            link.addEventListener('click', () => setActive(link));
        });

        // Observe sections in viewport
        const headerEl = document.querySelector('.header');
        const headerOffset = headerEl ? headerEl.offsetHeight + 20 : 90;
        const tocHeight = toc.offsetHeight || 0;
        const topOffset = headerOffset + tocHeight; // reserve space for sticky header + toc

        let currentActive = null;
        const io = new IntersectionObserver((entries) => {
            // Find the most visible intersecting section near top
            let candidate = null;
            let maxRatio = 0;
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.intersectionRatio > maxRatio) {
                        maxRatio = entry.intersectionRatio;
                        candidate = entry.target;
                    }
                } else {
                    // If section leaves from top, and it's the current, we'll update on next intersecting one
                }
            });
            if (candidate) {
                const link = sectionMap.get(candidate);
                if (link && link !== currentActive) {
                    currentActive = link;
                    setActive(link);
                }
            } else {
                // Fallback: find the section whose top is closest above the offset
                let best = null; let bestDelta = Infinity;
                sectionMap.forEach((link, section) => {
                    const rect = section.getBoundingClientRect();
                    const delta = Math.abs(rect.top - topOffset);
                    if (rect.top <= topOffset && delta < bestDelta) { best = section; bestDelta = delta; }
                });
                if (best) {
                    const link = sectionMap.get(best);
                    if (link && link !== currentActive) {
                        currentActive = link; setActive(link);
                    }
                }
            }
        }, { threshold: [0.25, 0.5, 0.75], root: null, rootMargin: `-${topOffset}px 0px -55% 0px` });

        sectionMap.forEach((_, section) => io.observe(section));

        // Initialize active state based on current hash or first section
        const initHash = window.location.hash && toc.querySelector(`a[href='${window.location.hash}']`);
        setActive(initHash || tocLinks[0] || null);

        // Update on hashchange (e.g., back/forward)
        window.addEventListener('hashchange', () => {
            const h = window.location.hash;
            const link = h ? toc.querySelector(`a[href='${h}']`) : null;
            setActive(link);
        });
    }
});