// Enhanced Portfolio App with Coffee-to-Code Animation
class PortfolioApp {
    constructor() {
        this.init();
    }
    
    init() {
        this.startCoffeeAnimation();
        this.setupNavigation();
        this.setupMobileMenu();
        this.setupScrollProgress();
        this.setupSkillBars();
        this.setupScrollEffects();
        this.setupProjectDetails();
        this.setupCTAButtons();
        this.setupMicroAnimations();
        console.log('Enhanced portfolio app with coffee animation initialized successfully');
    }
    
    startCoffeeAnimation() {
        // Play coffee sip sound if available
        this.playCoffeeSound();
        
        // Hide the animation after completion (extended timing)
        setTimeout(() => {
            const coffeeAnimation = document.getElementById('coffeeAnimation');
            if (coffeeAnimation) {
                coffeeAnimation.style.display = 'none';
            }
        }, 13000); // Extended from 9000 to 13000 (13 seconds)
        
        // Add typing sound effects
        this.addTypingSounds();
    }
    
    playCoffeeSound() {
        // Simulate coffee sip sound (would be actual audio in production)
        console.log('☕ *sip* - Coffee sound effect');
        
        // Add keyboard typing sounds during code formation
        setTimeout(() => {
            console.log('⌨️ *typing sounds* - Code being written');
        }, 5500);
    }
    
    addTypingSounds() {
        const codeLines = document.querySelectorAll('.code-line');
        codeLines.forEach((line, index) => {
            setTimeout(() => {
                // Simulate typing sound for each line
                console.log(`⌨️ Typing line ${index + 1}: ${line.textContent}`);
                
                // Add visual typing effect
                line.style.borderRight = '2px solid var(--accent-cyan)';
                setTimeout(() => {
                    line.style.borderRight = 'none';
                }, 500);
            }, 5500 + (index * 500));
        });
    }
    
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                
                // Add active class to clicked link
                link.classList.add('active');
                
                // Close mobile menu if open
                this.closeMobileMenu();
                
                // Handle external blog link
                if (link.getAttribute('href') === '#blog') {
                    // For blog, scroll to section first, then user can click the blog buttons
                    const targetSection = document.querySelector('#blog');
                    if (targetSection) {
                        targetSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                } else {
                    // Smooth scroll to section for other links
                    const targetId = link.getAttribute('href');
                    const targetSection = document.querySelector(targetId);
                    
                    if (targetSection) {
                        targetSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
        
        // Update active nav on scroll
        window.addEventListener('scroll', () => {
            this.updateActiveNav();
            this.updateScrollProgress();
        });
    }
    
    setupMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => {
                mobileToggle.classList.toggle('active');
                navLinks.classList.toggle('active');
            });
        }
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar')) {
                this.closeMobileMenu();
            }
        });
    }
    
    closeMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (mobileToggle && navLinks) {
            mobileToggle.classList.remove('active');
            navLinks.classList.remove('active');
        }
    }
    
    setupScrollProgress() {
        const progressBar = document.querySelector('.progress-bar');
        
        if (progressBar) {
            this.updateScrollProgress();
        }
    }
    
    updateScrollProgress() {
        const progressBar = document.querySelector('.progress-bar');
        if (!progressBar) return;
        
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    }
    
    updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    setupSkillBars() {
        const skillCards = document.querySelectorAll('.skill-card');
        
        const animateSkillBars = () => {
            skillCards.forEach(card => {
                const skillBar = card.querySelector('.skill-bar');
                if (!skillBar) return;
                
                const level = skillBar.getAttribute('data-level');
                const rect = card.getBoundingClientRect();
                
                // Check if skill card is in viewport
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    if (!card.classList.contains('animate')) {
                        card.classList.add('animate');
                        skillBar.style.setProperty('--skill-level', level + '%');
                        skillBar.style.width = level + '%';
                    }
                }
            });
        };
        
        // Initial check (after coffee animation - extended timing)
        setTimeout(animateSkillBars, 13000); // Extended from 9000 to 13000
        
        // Check on scroll
        window.addEventListener('scroll', animateSkillBars);
    }
    
    setupScrollEffects() {
        // Add scroll-based animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe cards and sections (after coffee animation - extended timing)
        setTimeout(() => {
            const animatedElements = document.querySelectorAll('.skill-card, .project-card, .contact-item, .timeline-content');
            animatedElements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(el);
            });
        }, 13000); // Extended from 9000 to 13000
    }
    
    setupProjectDetails() {
        const detailsToggles = document.querySelectorAll('.details-toggle');
        
        detailsToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const projectCard = toggle.closest('.project-card');
                const details = projectCard.querySelector('.project-architecture, .project-code');
                
                if (details) {
                    details.classList.toggle('hidden');
                    toggle.textContent = details.classList.contains('hidden') 
                        ? toggle.textContent.replace('Hide', 'View')
                        : toggle.textContent.replace('View', 'Hide');
                }
            });
        });
    }
    
    setupCTAButtons() {
        const resumeButton = document.querySelector('.cta-button.primary');
        const githubButton = document.querySelector('.cta-button.secondary');
        
        if (resumeButton) {
            resumeButton.addEventListener('click', () => {
                // Simulate resume download
                this.showNotification('Resume download started! 📄');
                // In real implementation, this would trigger actual download
            });
        }
        
        if (githubButton) {
            githubButton.addEventListener('click', () => {
                // Open GitHub profile
                window.open('https://github.com/simi-ops', '_blank');
            });
        }
    }
    
    setupMicroAnimations() {
        // Add particle interaction
        this.setupParticleInteraction();
        
        // Add 3D node tooltips
        this.setup3DTooltips();
        
        // Update GitHub stats periodically
        this.updateGitHubStats();
        
        // Add coffee cup click interaction
        this.setupCoffeeInteraction();
    }
    
    setupCoffeeInteraction() {
        // Add a small coffee cup that can be clicked to replay animation
        setTimeout(() => {
            const coffeeIcon = document.createElement('div');
            coffeeIcon.innerHTML = '☕';
            coffeeIcon.className = 'floating-coffee-icon';
            coffeeIcon.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                font-size: 2rem;
                cursor: pointer;
                z-index: 1000;
                animation: bounce 2s infinite;
                opacity: 0.7;
                transition: opacity 0.3s ease;
            `;
            
            coffeeIcon.addEventListener('click', () => {
                this.showNotification('☕ Coffee power activated! More coding energy incoming...');
                // Trigger coffee bean explosion (reduced)
                if (window.coffeePhysics) {
                    window.coffeePhysics.triggerCoffeeExplosion(undefined, undefined, 6); // Reduced from 10 to 6
                }
            });
            
            coffeeIcon.addEventListener('mouseenter', () => {
                coffeeIcon.style.opacity = '1';
            });
            
            coffeeIcon.addEventListener('mouseleave', () => {
                coffeeIcon.style.opacity = '0.7';
            });
            
            document.body.appendChild(coffeeIcon);
        }, 14000); // Extended from 10000 to 14000
    }
    
    setupParticleInteraction() {
        let mouseX = 0;
        let mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX / window.innerWidth;
            mouseY = e.clientY / window.innerHeight;
            
            // This would interact with particles.js if we had access to the instance
            // For now, we'll add a subtle effect to the particles container
            const particlesContainer = document.getElementById('particles-js');
            if (particlesContainer) {
                particlesContainer.style.transform = `translate(${mouseX * 10}px, ${mouseY * 10}px)`;
            }
        });
    }
    
    setup3DTooltips() {
        // This would integrate with the Three.js scene
        // For now, we'll add a placeholder
        console.log('3D tooltips ready for Three.js integration');
    }
    
    updateGitHubStats() {
        // Simulate dynamic GitHub stats
        const statNumbers = document.querySelectorAll('.stat-number');
        
        setInterval(() => {
            statNumbers.forEach(stat => {
                if (stat.textContent !== '7') { // Don't change streak
                    const currentValue = parseInt(stat.textContent);
                    const newValue = currentValue + Math.floor(Math.random() * 3);
                    stat.textContent = newValue;
                }
            });
        }, 30000); // Update every 30 seconds
    }
    
    showNotification(message) {
        // Create a simple notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--accent-cyan);
            color: var(--bg-primary);
            padding: 1rem 2rem;
            border-radius: 0.5rem;
            z-index: 1000;
            animation: slideInRight 0.3s ease;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(0, 217, 255, 0.3);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new PortfolioApp();
});
