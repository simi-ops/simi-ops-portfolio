// Coffee Bean Physics System
class CoffeePhysics {
    constructor() {
        this.beans = [];
        this.container = document.getElementById('coffee-beans-container');
        this.beanCount = 0;
        this.caffeineLevel = 0;
        this.maxBeans = 20; // Reduced from 50 to 20
        this.gravity = 0.5;
        this.bounce = 0.7;
        this.friction = 0.99;
        this.mouseX = 0;
        this.mouseY = 0;
        this.isRunning = false;
        
        this.kenyanCoffeeFacts = [
            "Kenya produces some of the world's finest coffee! ☕",
            "Kenyan coffee is grown at high altitudes (1,400-2,000m)",
            "The coffee harvest season is October-December",
            "Kenya's coffee is known for its bright acidity",
            "Coffee was introduced to Kenya in 1893",
            "Kenyan coffee is processed using the wet method",
            "The best Kenyan coffee comes from Central Province"
        ];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.startPhysicsLoop();
        this.scheduleRandomBeans();
        console.log('☕ Coffee Bean Physics System initialized!');
    }
    
    setupEventListeners() {
        // Mouse tracking for bean attraction
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        
        // Click to spawn beans (reduced)
        document.addEventListener('click', (e) => {
            this.spawnBeanExplosion(e.clientX, e.clientY, 3); // Reduced from 5 to 3
        });
        
        // Scroll spawning (reduced frequency)
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                if (Math.random() < 0.3) { // Only 30% chance on scroll
                    this.spawnBean(Math.random() * window.innerWidth, 0);
                }
            }, 200); // Increased delay from 100ms to 200ms
        });
        
        // Mobile tilt physics (if supported)
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', (e) => {
                this.handleTilt(e.gamma); // Left-right tilt
            });
        }
        
        // Page load bean shower
        setTimeout(() => {
            this.spawnBeanShower();
        }, 14000); // After coffee animation
    }
    
    spawnBean(x, y, type = 'normal') {
        if (this.beans.length >= this.maxBeans) {
            this.removeOldestBean();
        }
        
        const bean = {
            id: Date.now() + Math.random(),
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 4,
            vy: Math.random() * 2,
            type: type,
            element: this.createBeanElement(type),
            bounces: 0,
            age: 0
        };
        
        bean.element.style.left = x + 'px';
        bean.element.style.top = y + 'px';
        
        this.container.appendChild(bean.element);
        this.beans.push(bean);
        this.updateCaffeineLevel();
    }
    
    createBeanElement(type) {
        const element = document.createElement('div');
        element.className = `coffee-bean ${type}`;
        
        switch(type) {
            case 'premium':
                element.textContent = '✨';
                element.title = 'Premium Kenyan Coffee Bean!';
                break;
            case 'raw':
                element.textContent = '🫘';
                element.title = 'Raw coffee bean from Kiambu County';
                break;
            case 'roasted':
                element.textContent = '🟤';
                element.title = 'Perfectly roasted Kenyan bean';
                break;
            default:
                element.textContent = '☕';
                element.title = 'Kenyan coffee bean - click for trivia!';
        }
        
        // Add click handler for trivia
        element.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showCoffeeTrivia(e.target);
        });
        
        return element;
    }
    
    spawnBeanExplosion(x, y, count) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const beanX = x + (Math.random() - 0.5) * 100;
                const beanY = y + (Math.random() - 0.5) * 50;
                const type = Math.random() < 0.1 ? 'premium' : 'normal';
                this.spawnBean(beanX, beanY, type);
            }, i * 50);
        }
        
        // Play explosion sound effect (visual)
        this.createSteamPuff(x, y);
    }
    
    spawnBeanShower() {
        const count = 8; // Reduced from 15 to 8
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const x = Math.random() * window.innerWidth;
                const type = Math.random() < 0.05 ? 'premium' : 
                           Math.random() < 0.3 ? 'roasted' : 'normal';
                this.spawnBean(x, -20, type);
            }, i * 300); // Increased delay from 200ms to 300ms
        }
    }
    
    scheduleRandomBeans() {
        const spawnRandomBean = () => {
            if (Math.random() < 0.15) { // Reduced from 30% to 15% chance
                const x = Math.random() * window.innerWidth;
                const type = Math.random() < 0.02 ? 'premium' : 'normal';
                this.spawnBean(x, -20, type);
            }
            
            // Schedule next random bean
            setTimeout(spawnRandomBean, Math.random() * 15000 + 10000); // Increased from 5-15s to 10-25s
        };
        
        setTimeout(spawnRandomBean, 8000); // Increased initial delay from 5s to 8s
    }
    
    updatePhysics() {
        this.beans.forEach((bean, index) => {
            // Age the bean
            bean.age++;
            
            // Mouse attraction (subtle)
            const dx = this.mouseX - bean.x;
            const dy = this.mouseY - bean.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 1000;
                bean.vx += (dx / distance) * force;
                bean.vy += (dy / distance) * force;
            }
            
            // Apply gravity
            bean.vy += this.gravity;
            
            // Apply velocity
            bean.x += bean.vx;
            bean.y += bean.vy;
            
            // Apply friction
            bean.vx *= this.friction;
            bean.vy *= this.friction;
            
            // Boundary collisions
            if (bean.x <= 0 || bean.x >= window.innerWidth - 20) {
                bean.vx *= -this.bounce;
                bean.x = Math.max(0, Math.min(window.innerWidth - 20, bean.x));
                this.handleBounce(bean);
            }
            
            if (bean.y >= window.innerHeight - 20) {
                bean.vy *= -this.bounce;
                bean.y = window.innerHeight - 20;
                this.handleLanding(bean);
            }
            
            // Update DOM position
            bean.element.style.left = bean.x + 'px';
            bean.element.style.top = bean.y + 'px';
            
            // Remove old beans
            if (bean.age > 1000 || bean.y > window.innerHeight + 100) {
                this.removeBean(index);
            }
        });
    }
    
    handleBounce(bean) {
        bean.bounces++;
        bean.element.classList.add('bouncing');
        setTimeout(() => {
            bean.element.classList.remove('bouncing');
        }, 300);
        
        // Create steam puff on energetic bounces
        if (bean.bounces === 1 && Math.abs(bean.vy) > 3) {
            this.createSteamPuff(bean.x, bean.y);
        }
    }
    
    handleLanding(bean) {
        bean.element.classList.add('landing');
        setTimeout(() => {
            bean.element.classList.remove('landing');
        }, 500);
        
        // Create steam puff on hard landings
        if (Math.abs(bean.vy) > 5) {
            this.createSteamPuff(bean.x, bean.y);
        }
    }
    
    createSteamPuff(x, y) {
        const steam = document.createElement('div');
        steam.className = 'steam-puff';
        steam.textContent = '💨';
        steam.style.left = x + 'px';
        steam.style.top = y + 'px';
        
        this.container.appendChild(steam);
        
        setTimeout(() => {
            if (steam.parentNode) {
                steam.parentNode.removeChild(steam);
            }
        }, 1000);
    }
    
    showCoffeeTrivia(beanElement) {
        const trivia = document.createElement('div');
        trivia.className = 'coffee-trivia';
        trivia.textContent = this.kenyanCoffeeFacts[Math.floor(Math.random() * this.kenyanCoffeeFacts.length)];
        
        const rect = beanElement.getBoundingClientRect();
        trivia.style.left = (rect.left - 100) + 'px';
        trivia.style.top = (rect.top - 60) + 'px';
        
        document.body.appendChild(trivia);
        
        setTimeout(() => {
            if (trivia.parentNode) {
                trivia.parentNode.removeChild(trivia);
            }
        }, 3000);
    }
    
    removeBean(index) {
        const bean = this.beans[index];
        if (bean && bean.element && bean.element.parentNode) {
            bean.element.parentNode.removeChild(bean.element);
        }
        this.beans.splice(index, 1);
        this.updateCaffeineLevel();
    }
    
    removeOldestBean() {
        if (this.beans.length > 0) {
            this.removeBean(0);
        }
    }
    
    updateCaffeineLevel() {
        this.beanCount = this.beans.length;
        this.caffeineLevel = Math.min((this.beanCount / this.maxBeans) * 100, 100);
        
        const fillElement = document.getElementById('caffeineFill');
        const countElement = document.getElementById('beanCount');
        
        if (fillElement) {
            fillElement.style.width = this.caffeineLevel + '%';
            fillElement.textContent = Math.round(this.caffeineLevel) + '%';
        }
        
        if (countElement) {
            countElement.textContent = this.beanCount + ' beans';
        }
    }
    
    handleTilt(gamma) {
        // Adjust gravity based on device tilt
        this.gravity = 0.5 + (gamma / 90) * 0.3; // Tilt affects gravity direction
    }
    
    startPhysicsLoop() {
        if (this.isRunning) return;
        this.isRunning = true;
        
        const loop = () => {
            this.updatePhysics();
            if (this.isRunning) {
                requestAnimationFrame(loop);
            }
        };
        
        requestAnimationFrame(loop);
    }
    
    stopPhysics() {
        this.isRunning = false;
    }
    
    // Public methods for external triggers
    triggerCoffeeBreak() {
        this.spawnBeanShower();
    }
    
    triggerCoffeeExplosion(x = window.innerWidth / 2, y = window.innerHeight / 2, count = 6) {
        this.spawnBeanExplosion(x, y, count); // Now accepts custom count
    }
}

// Initialize coffee physics after page load
document.addEventListener('DOMContentLoaded', function() {
    // Wait for coffee animation to finish
    setTimeout(() => {
        window.coffeePhysics = new CoffeePhysics();
    }, 15000);
});
