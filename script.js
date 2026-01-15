// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navActions = document.querySelector('.nav-actions');
    const sections = document.querySelectorAll('section');
    const navIndicator = document.querySelector('.nav-indicator');
    const nav = document.querySelector('.liquid-nav');
    
    // Toast notification system
    let toastTimeout;
    
    // Initialize mobile menu
    function initMobileMenu() {
        if (!navToggle || !navMenu) return;
        
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMobileMenu();
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                !navToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });
        
        // Close menu when clicking a nav link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeMobileMenu();
            });
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }
    
    // Toggle mobile menu
    function toggleMobileMenu() {
        const isActive = navMenu.classList.toggle('active');
        const icon = navToggle.querySelector('i');
        
        if (isActive) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
            document.body.style.overflow = 'hidden';
            
            // Add mobile contact button
            if (navActions && !document.querySelector('.nav-actions.mobile-visible')) {
                const mobileActions = navActions.cloneNode(true);
                mobileActions.classList.add('mobile-visible');
                navMenu.appendChild(mobileActions);
            }
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            document.body.style.overflow = '';
            
            // Remove mobile contact button
            const mobileActions = document.querySelector('.nav-actions.mobile-visible');
            if (mobileActions) {
                mobileActions.remove();
            }
        }
        
        // Toggle nav transparency on mobile
        if (window.innerWidth <= 768) {
            if (isActive) {
                nav.style.background = 'rgba(10, 17, 35, 0.95)';
            } else {
                setTimeout(() => {
                    nav.style.background = '';
                }, 300);
            }
        }
    }
    
    // Close mobile menu
    function closeMobileMenu() {
        navMenu.classList.remove('active');
        const icon = navToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
        document.body.style.overflow = '';
        
        // Remove mobile contact button
        const mobileActions = document.querySelector('.nav-actions.mobile-visible');
        if (mobileActions) {
            mobileActions.remove();
        }
    }
    
    // Update nav indicator position
    function updateNavIndicator() {
        const activeLink = document.querySelector('.nav-link.active');
        
        if (activeLink && navIndicator && window.innerWidth > 768) {
            const linkRect = activeLink.getBoundingClientRect();
            const navRect = activeLink.closest('.nav-menu').getBoundingClientRect();
            
            navIndicator.style.width = `${linkRect.width}px`;
            navIndicator.style.left = `${linkRect.left - navRect.left}px`;
            navIndicator.style.opacity = '1';
        } else if (navIndicator) {
            navIndicator.style.opacity = '0';
        }
    }
    
    // Update active nav link on scroll
    function updateActiveNavLink() {
        let current = '';
        const navHeight = nav ? nav.offsetHeight : 70;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - navHeight - 100)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
        
        updateNavIndicator();
    }
    
    // Smooth scrolling for anchor links
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                if (href === '#' || !href.startsWith('#')) return;
                
                e.preventDefault();
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    const navHeight = nav ? nav.offsetHeight : 70;
                    const targetPosition = targetElement.offsetTop - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL without jumping
                    history.pushState(null, null, href);
                }
            });
        });
    }
    
    // Intersection Observer for animations
    function initScrollAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // For timeline items, add staggered animation
                    if (entry.target.classList.contains('timeline-item')) {
                        const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
                        entry.target.style.transitionDelay = `${index * 0.1}s`;
                    }
                }
            });
        }, observerOptions);
        
        // Observe elements to animate
        const animatedElements = document.querySelectorAll(
            '.timeline-item, .project-card, .craft-card, .leadership-card, .hero-visual, .connect-card'
        );
        
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }
    
    // Toast notification function
    function showToast(message, type = 'info') {
        // Clear existing toast
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
            clearTimeout(toastTimeout);
        }
        
        // Create new toast
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        
        // Add type class for different styles
        if (type === 'success') {
            toast.style.borderColor = 'rgba(34, 197, 94, 0.3)';
            toast.style.background = 'rgba(34, 197, 94, 0.1)';
        } else if (type === 'error') {
            toast.style.borderColor = 'rgba(239, 68, 68, 0.3)';
            toast.style.background = 'rgba(239, 68, 68, 0.1)';
        }
        
        document.body.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Auto remove after 3 seconds
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
        
        // Click to dismiss
        toast.addEventListener('click', () => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        });
    }
    
    // Copy to clipboard functionality
    function initCopyToClipboard() {
        // Email copy
        const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
        emailLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                if (this.classList.contains('no-copy')) return;
                
                const email = this.href.replace('mailto:', '');
                copyToClipboard(email, 'Email copied to clipboard!');
            });
        });
        
        // Phone copy
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        phoneLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                if (this.classList.contains('no-copy')) return;
                
                const phone = this.href.replace('tel:', '');
                copyToClipboard(phone, 'Phone number copied to clipboard!');
            });
        });
    }
    
    // Generic copy to clipboard function
    async function copyToClipboard(text, successMessage) {
        try {
            await navigator.clipboard.writeText(text);
            showToast(successMessage, 'success');
        } catch (err) {
            console.error('Failed to copy: ', err);
            showToast('Failed to copy to clipboard', 'error');
        }
    }
    
    // Handle window resize
    let resizeTimer;
    function handleResize() {
        document.body.classList.add('resizing');
        clearTimeout(resizeTimer);
        
        resizeTimer = setTimeout(() => {
            document.body.classList.remove('resizing');
            
            // Close mobile menu if resizing to desktop
            if (window.innerWidth > 768 && navMenu && navMenu.classList.contains('active')) {
                closeMobileMenu();
            }
            
            // Update nav indicator
            updateNavIndicator();
        }, 250);
    }
    
    // Add parallax effect to background
    function initParallax() {
        const liquidContainer = document.querySelector('.liquid-container');
        if (!liquidContainer) return;
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            liquidContainer.style.transform = `translate3d(0, ${rate}px, 0)`;
        });
    }
    
    // Handle form submissions (if any forms are added later)
    function handleFormSubmissions() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn ? submitBtn.innerHTML : 'Send';
                
                // Show loading state
                if (submitBtn) {
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                    submitBtn.disabled = true;
                }
                
                try {
                    // Simulate API call - replace with actual form submission
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    
                    showToast('Message sent successfully!', 'success');
                    this.reset();
                } catch (error) {
                    showToast('Failed to send message. Please try again.', 'error');
                } finally {
                    // Restore button state
                    if (submitBtn) {
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    }
                }
            });
        });
    }
    
    // Initialize scroll-based nav background
    function initNavScrollEffect() {
        if (!nav) return;
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.style.background = 'rgba(10, 17, 35, 0.95)';
                nav.style.backdropFilter = 'blur(25px) saturate(180%)';
                nav.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
            } else {
                nav.style.background = '';
                nav.style.backdropFilter = '';
                nav.style.boxShadow = '';
            }
        });
    }
    
    // Prevent zoom on double-tap on mobile
    function preventDoubleTapZoom() {
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(event) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }
    
    // Initialize typing effect for hero section (optional)
    function initTypingEffect() {
        const heroHeadline = document.querySelector('.hero-headline');
        if (!heroHeadline) return;
        
        // Add a subtle typing animation to the code window
        const codeElement = document.querySelector('.code-content code');
        if (codeElement) {
            const originalCode = codeElement.textContent;
            codeElement.textContent = '';
            
            let i = 0;
            function typeWriter() {
                if (i < originalCode.length) {
                    codeElement.textContent += originalCode.charAt(i);
                    i++;
                    setTimeout(typeWriter, 30);
                }
            }
            
            // Start typing when code is in view
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    setTimeout(typeWriter, 500);
                    observer.disconnect();
                }
            }, { threshold: 0.5 });
            
            observer.observe(codeElement);
        }
    }
    
    // Initialize everything
    function init() {
        // Initialize all features
        initMobileMenu();
        initSmoothScroll();
        initScrollAnimations();
        initCopyToClipboard();
        initParallax();
        handleFormSubmissions();
        initNavScrollEffect();
        preventDoubleTapZoom();
        initTypingEffect();
        
        // Set up event listeners
        window.addEventListener('scroll', updateActiveNavLink);
        window.addEventListener('resize', handleResize);
        window.addEventListener('load', () => {
            updateActiveNavLink();
            updateNavIndicator();
            
            // Add loaded class for fade-in effect
            setTimeout(() => {
                document.body.classList.add('loaded');
            }, 100);
        });
        
        // Initial updates
        updateActiveNavLink();
        updateNavIndicator();
        
        // Add keyboard navigation for menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && navMenu.classList.contains('active')) {
                const focusableElements = navMenu.querySelectorAll(
                    'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
                );
                
                if (focusableElements.length === 0) return;
                
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }
    
    // Start initialization
    init();
    
    // Expose some functions globally for debugging (optional)
    window.debug = {
        showToast,
        updateNavIndicator,
        closeMobileMenu
    };
});

// Handle service worker for PWA (optional - uncomment if needed)
/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('ServiceWorker registration successful');
        }).catch(err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}
*/

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfEntries = performance.getEntriesByType('navigation');
            if (perfEntries.length > 0) {
                const navTiming = perfEntries[0];
                console.log('Page load time:', navTiming.loadEventEnd - navTiming.startTime);
            }
        }, 0);
    });
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('Global error caught:', e.error);
    // You could send this to an error tracking service
});

// Handle offline/online status
window.addEventListener('online', () => {
    const toast = document.createElement('div');
    toast.textContent = 'You are back online!';
    toast.className = 'toast-notification';
    toast.style.background = 'rgba(34, 197, 94, 0.1)';
    toast.style.borderColor = 'rgba(34, 197, 94, 0.3)';
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
});

window.addEventListener('offline', () => {
    const toast = document.createElement('div');
    toast.textContent = 'You are offline. Some features may not work.';
    toast.className = 'toast-notification';
    toast.style.background = 'rgba(239, 68, 68, 0.1)';
    toast.style.borderColor = 'rgba(239, 68, 68, 0.3)';
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
});

// Add CSS for any dynamically created elements
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    .nav-actions.mobile-visible {
        display: flex !important;
        margin-top: 1.5rem;
        justify-content: center;
        width: 100%;
    }
    
    .nav-actions.mobile-visible .btn-contact {
        width: 100%;
        justify-content: center;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .fa-spin {
        animation: spin 1s linear infinite;
    }
    
    /* Focus styles for accessibility */
    *:focus {
        outline: 2px solid var(--accent-primary);
        outline-offset: 2px;
    }
    
    /* Reduced motion preferences */
    @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
`;

document.head.appendChild(dynamicStyles);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        // Already handled by main function
    });
} else {
    // DOM already loaded
    document.body.classList.add('loaded');
}
