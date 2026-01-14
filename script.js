// Enhanced Liquid Effects & Animations with fixed navbar
class LiquidPortfolio {
    constructor() {
        this.init();
    }
    
    init() {
        this.createLiquidBackground();
        this.initSmoothScroll();
        this.initScrollAnimations();
        this.initNavigation();
        this.initParallax();
        this.initInteractiveEffects();
        this.initDownloadResume();
    }
    
    // Create dynamic liquid blobs
    createLiquidBackground() {
        const container = document.querySelector('.liquid-container');
        const colors = [
            'rgba(14, 165, 233, 0.4)',
            'rgba(129, 140, 248, 0.4)',
            'rgba(30, 58, 138, 0.4)',
            'rgba(88, 28, 135, 0.4)'
        ];
        
        // Add more blobs for richer effect
        for (let i = 0; i < 6; i++) {
            const blob = document.createElement('div');
            blob.className = 'liquid-blob';
            blob.style.background = colors[Math.floor(Math.random() * colors.length)];
            blob.style.width = `${Math.random() * 400 + 200}px`;
            blob.style.height = blob.style.width;
            blob.style.left = `${Math.random() * 100}%`;
            blob.style.top = `${Math.random() * 100}%`;
            blob.style.animationDuration = `${Math.random() * 20 + 15}s`;
            blob.style.animationDelay = `${Math.random() * 10}s`;
            container.appendChild(blob);
        }
    }
    
    // Enhanced smooth scroll with easing
    initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (!targetElement) return;
                
                // Calculate position with navbar offset (navbar is always visible)
                const headerHeight = document.querySelector('.liquid-nav').offsetHeight + 40; // 40px extra padding
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                this.updateActiveLink(link);
            });
        });
    }
    
    // Update active navigation link
    updateActiveLink(clickedLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        clickedLink.classList.add('active');
        
        // Move nav indicator
        const indicator = document.querySelector('.nav-indicator');
        const rect = clickedLink.getBoundingClientRect();
        const navRect = document.querySelector('.nav-menu').getBoundingClientRect();
        
        if (indicator && rect && navRect) {
            indicator.style.width = `${rect.width}px`;
            indicator.style.left = `${rect.left - navRect.left}px`;
        }
    }
    
    // Scroll animations with Intersection Observer
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Stagger children animations
                    const children = entry.target.querySelectorAll('[data-animate]');
                    children.forEach((child, index) => {
                        child.style.animationDelay = `${index * 0.1}s`;
                        child.classList.add('animate-in');
                    });
                }
            });
        }, observerOptions);
        
        // Observe all sections and cards
        document.querySelectorAll('section, .card, .project-card, .timeline-item, .leadership-card').forEach(el => {
            observer.observe(el);
        });
    }
    
    // Navigation - Update active section on scroll (navbar stays visible)
    initNavigation() {
        // Update active section based on scroll
        const updateActiveSection = () => {
            const sections = document.querySelectorAll('section[id]');
            const scrollPosition = window.scrollY + 150; // Adjusted for fixed navbar
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                    if (correspondingLink && !correspondingLink.classList.contains('active')) {
                        this.updateActiveLink(correspondingLink);
                    }
                }
            });
        };
        
        // Update on scroll
        window.addEventListener('scroll', updateActiveSection);
        
        // Initialize on load
        updateActiveSection();
    }
    
    // Interactive hover effects
    initInteractiveEffects() {
        const interactiveElements = document.querySelectorAll('.btn-liquid, .project-card, .craft-card, .leadership-card');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.transform = 'translateY(-5px) scale(1.02)';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translateY(0) scale(1)';
            });
        });
        
        // Button liquid effect
        const liquidButtons = document.querySelectorAll('.btn-liquid');
        liquidButtons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                const effect = button.querySelector('.btn-liquid-effect');
                if (effect) {
                    effect.style.transform = 'rotate(30deg) translateX(100%)';
                }
            });
            
            button.addEventListener('mouseleave', () => {
                const effect = button.querySelector('.btn-liquid-effect');
                if (effect) {
                    effect.style.transform = 'rotate(30deg) translateX(-100%)';
                }
            });
        });
    }
    
    // Parallax effects
    initParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            // Blob parallax
            const blobs = document.querySelectorAll('.liquid-blob');
            blobs.forEach((blob, index) => {
                const speed = 0.1 + (index * 0.05);
                blob.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }
    
    // Download Resume functionality
    initDownloadResume() {
        // Add event listeners to all download buttons
        const downloadButtons = document.querySelectorAll('.download-resume');
        downloadButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.downloadResume();
            });
        });
    }
    
    // Download resume function
    downloadResume() {
        // Create a simple PDF download simulation
        // In production, replace with actual resume file
        const resumeContent = `
            CHANDAN MISHRA
            System Analyst
            
            Contact:
            Kolkata, India
            +91 7679236432
            ichandanmsr@gmail.com
            linkedin.com/in/chandanmsr
            
            PROFESSIONAL SUMMARY
            Analytical and results-driven professional with experience in system analysis and product development for SaaS HRMS platforms.
            
            EXPERIENCE
            System Analyst, Inner Eye Consultancy Services LLP
            • Spearheaded the streamlining of flagship HRMS software
            • Authored comprehensive SRS and Process Flow diagrams
            • Managed project timelines via Zoho Projects
            
            Technical Content Intern, Unstop
            • Designed 1000+ coding assessments and technical content modules
            
            EDUCATION
            Amity University Kolkata - MCA (8.17 CGPA)
            University of North Bengal - B.Sc CS (8.53 CGPA)
            
            SKILLS
            Python, SQL, Java, PySpark, Git, Jira, Agile, Product Analytics
            
            Download full resume from: https://www.linkedin.com/in/chandanmsr/
        `;
        
        // Create a blob and download link
        const blob = new Blob([resumeContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Chandan_Mishra_Resume.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        // Show a toast notification
        this.showToast('Resume download started! In production, this would be your actual PDF resume.');
    }
    
    // Show toast notification
    showToast(message) {
        // Remove existing toast
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) existingToast.remove();
        
        // Create toast
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Hide toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const portfolio = new LiquidPortfolio();
    
    // Add CSS for animations and toast
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            animation: fadeInUp 0.8s ease-out forwards;
            opacity: 0;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* Liquid button effect */
        .btn-liquid:hover .btn-liquid-effect {
            animation: liquidFlow 0.8s ease-out;
        }
        
        @keyframes liquidFlow {
            0% {
                transform: rotate(30deg) translateX(-100%);
            }
            100% {
                transform: rotate(30deg) translateX(100%);
            }
        }
        
        /* Interactive card hover */
        .project-card, .craft-card, .timeline-content, .leadership-card {
            transition: transform 0.3s ease, border-color 0.3s ease;
        }
        
        /* Toast notification */
        .toast-notification {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: var(--glass-light);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: 12px;
            padding: 1rem 1.5rem;
            color: var(--text-primary);
            font-size: 0.9rem;
            z-index: 9999;
            opacity: 0;
            transition: all 0.3s ease;
            box-shadow: var(--shadow-heavy);
        }
        
        .toast-notification.show {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        
        /* Ensure navbar doesn't hide on mobile */
        @media (max-width: 768px) {
            .liquid-main {
                padding-top: 140px; /* Extra padding for fixed navbar on mobile */
            }
        }
    `;
    document.head.appendChild(style);
});