class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeAnimations();
        this.setupNavbar();
        this.setupScrollEffects();
        this.setupFormValidation();
        this.setupModals();
        this.setupSkillBars();
        this.setupCounters();
        this.setupTypewriter();
        this.setupParticles();
    }

    setupEventListeners() {
      
        document.addEventListener('DOMContentLoaded', () => {
            this.startAnimations();
        });

        
        window.addEventListener('scroll', this.handleScroll.bind(this));
        window.addEventListener('resize', this.handleResize.bind(this));
        window.addEventListener('load', () => {
            this.hideLoader();
        });

        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyboard.bind(this));
    }

    
    setupNavbar() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        
        hamburger?.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                this.scrollToSection(targetId);
              
                hamburger?.classList.remove('active');
                navMenu?.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });

  
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-container')) {
                hamburger?.classList.remove('active');
                navMenu?.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }

    // ===== SCROLL EFFECTS =====
    setupScrollEffects() {
        const navbar = document.getElementById('navbar');
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');

        // Intersection Observer for section highlighting
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-70px 0px -70px 0px'
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    this.updateActiveNavLink(id);
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            sectionObserver.observe(section);
        });

        // Parallax effect for hero section
        this.setupParallax();
    }

    handleScroll() {
        const navbar = document.getElementById('navbar');
        const scrollTop = window.pageYOffset;

        // Navbar background on scroll
        if (scrollTop > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }

        // Parallax effect
        this.updateParallax(scrollTop);

        // Reveal animations
        this.revealOnScroll();
    }

    setupParallax() {
        this.parallaxElements = document.querySelectorAll('.hero-image, .profile-card');
    }

    updateParallax(scrollTop) {
        this.parallaxElements?.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrollTop * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    revealOnScroll() {
        const reveals = document.querySelectorAll('.skill-category, .project-card, .timeline-item');
        
        reveals.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('revealed');
            }
        });
    }

    updateActiveNavLink(activeId) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activeId}`) {
                link.classList.add('active');
            }
        });
    }

    // ===== SMOOTH SCROLLING =====
    scrollToSection(targetId) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 70; // Account for fixed navbar
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    // ===== FORM VALIDATION =====
    setupFormValidation() {
        const form = document.getElementById('contact-form');
        const inputs = form?.querySelectorAll('input, textarea');

        inputs?.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });

        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit(form);
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        let isValid = true;
        let errorMessage = '';

        // Clear previous styling
        field.classList.remove('error', 'success');

        switch (fieldName) {
            case 'name':
                if (!value) {
                    errorMessage = 'Name is required';
                    isValid = false;
                } else if (value.length < 2) {
                    errorMessage = 'Name must be at least 2 characters';
                    isValid = false;
                }
                break;

            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    errorMessage = 'Email is required';
                    isValid = false;
                } else if (!emailRegex.test(value)) {
                    errorMessage = 'Please enter a valid email address';
                    isValid = false;
                }
                break;

            case 'subject':
                if (!value) {
                    errorMessage = 'Subject is required';
                    isValid = false;
                } else if (value.length < 5) {
                    errorMessage = 'Subject must be at least 5 characters';
                    isValid = false;
                }
                break;

            case 'message':
                if (!value) {
                    errorMessage = 'Message is required';
                    isValid = false;
                } else if (value.length < 10) {
                    errorMessage = 'Message must be at least 10 characters';
                    isValid = false;
                }
                break;
        }

        if (errorElement) {
            errorElement.textContent = errorMessage;
            errorElement.style.display = errorMessage ? 'block' : 'none';
        }

        field.classList.add(isValid ? 'success' : 'error');
        return isValid;
    }

    clearError(field) {
        const errorElement = document.getElementById(`${field.name}-error`);
        if (errorElement) {
            errorElement.style.display = 'none';
        }
        field.classList.remove('error');
    }

    async handleFormSubmit(form) {
        const inputs = form.querySelectorAll('input, textarea');
        let isFormValid = true;

        // Validate all fields
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showNotification('Please fix the errors below', 'error');
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            // Simulate form submission
            await this.simulateFormSubmission(form);
            
            this.showNotification('Message sent successfully!', 'success');
            form.reset();
            
            // Clear success styling
            inputs.forEach(input => {
                input.classList.remove('success', 'error');
            });

        } catch (error) {
            this.showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    simulateFormSubmission(form) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form submitted:', new FormData(form));
                resolve();
            }, 2000);
        });
    }

  
    setupModals() {
        const modalOverlay = document.getElementById('modal-overlay');
        const modalClose = document.querySelector('.modal-close');

        // Close modal events
        modalClose?.addEventListener('click', () => this.closeModal());
        modalOverlay?.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                this.closeModal();
            }
        });


        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalOverlay?.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    openModal(projectId) {
        const modal = document.getElementById('modal-overlay');
        const modalContent = document.getElementById('modal-content');
        
        const projectData = this.getProjectData(projectId);
        
        modalContent.innerHTML = `
            <div class="modal-header">
                <h2>${projectData.title}</h2>
                <div class="modal-tech">
                    ${projectData.technologies.map(tech => 
                        `<span class="tech-tag">${tech}</span>`
                    ).join('')}
                </div>
            </div>
            <div class="modal-body">
                <img src="${projectData.image}" alt="${projectData.title}" class="modal-image">
                <div class="modal-description">
                    <h3>Project Overview</h3>
                    <p>${projectData.description}</p>
                    
                    <h3>Key Features</h3>
                    <ul>
                        ${projectData.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                    
                    <h3>Challenges & Solutions</h3>
                    <p>${projectData.challenges}</p>
                    
                    <div class="modal-links">
                        <a href="${projectData.liveUrl}" class="btn btn-primary" target="_blank">
                            <i class="fas fa-external-link-alt"></i> Live Demo
                        </a>
                        <a href="${projectData.githubUrl}" class="btn btn-secondary" target="_blank">
                            <i class="fab fa-github"></i> View Code
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.getElementById('modal-overlay');
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    getProjectData(projectId) {
        const projects = {
            project1: {
                title: "E-commerce Platform",
                image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
                technologies: ["React", "Node.js", "MongoDB"],
                description: "A full-featured e-commerce platform with user authentication, product management, shopping cart, and secure payment processing. Built with modern web technologies for optimal performance and user experience.",
                features: [
                    "User registration and authentication",
                    "Product catalog with search and filtering",
                    "Shopping cart and wishlist functionality",
                    "Secure payment processing with Stripe",
                    "Admin dashboard for product management",
                    "Order tracking and history",
                    "Responsive design for all devices"
                ],
                challenges: "The main challenge was implementing real-time inventory management and ensuring secure payment processing. I solved this by implementing WebSocket connections for real-time updates and following PCI compliance standards for payment security.",
                liveUrl: "https://botiga-clone.vercel.app/",
                githubUrl: "https://github.com/Diane-ingabire/botiga-clone"
            },
            project2: {
                title: "Task Management App",
                image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop",
                technologies: ["React Native", "Postgressql", "Typescript", "Node.js"],
                description: "A cross-platform mobile application for team collaboration and project management. Features real-time synchronization, task assignment, and progress tracking.",
                features: [
                    "Cross-platform mobile app (iOS & Android)",
                    "Real-time task synchronization",
                    "Team collaboration tools",
                    "File sharing and comments",
                    "Progress tracking and analytics",
                    "Push notifications",
                    "Offline functionality"
                ],
                challenges: "Implementing offline functionality while maintaining data consistency was challenging. I used Redux Persist and implemented a sync mechanism that queues actions when offline and syncs when connection is restored.",
                liveUrl: "https://app-store-link.com",
                githubUrl: "https://github.com/username/task-management-app"
            },
            project3: {
                title: "Analytics Dashboard",
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
                technologies: [ "mySQL", "Python"],
                description: "A comprehensive analytics dashboard with real-time data visualization, interactive charts, and customizable reports for business intelligence.",
                features: [
                    "Real-time data visualization",
                    "Interactive charts and graphs",
                    "Customizable dashboard layouts",
                    "Data export functionality",
                    "User role management",
                    "Automated report generation",
                    "Mobile-responsive design"
                ],
                challenges: "Handling large datasets and ensuring smooth real-time updates was complex. I optimized performance using data virtualization, implemented WebSocket connections for real-time updates, and used efficient D3.js rendering techniques.",
                liveUrl: "https://analytics-dashboard.com",
                githubUrl: "https://github.com/username/analytics-dashboard"
            }
        };

        return projects[projectId] || projects.project1;
    }

 
    setupSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillBar = entry.target;
                    const width = skillBar.dataset.width;
                    
                    setTimeout(() => {
                        skillBar.style.width = width;
                    }, 300);
                    
                    skillObserver.unobserve(skillBar);
                }
            });
        }, { threshold: 0.5 });

        skillBars.forEach(bar => {
            skillObserver.observe(bar);
        });
    }


    setupCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.dataset.target);
                    this.animateCounter(counter, target);
                    counterObserver.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    animateCounter(element, target) {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 40);
    }

 
    setupTypewriter() {
        const typewriterElement = document.querySelector('.hero-subtitle');
        if (!typewriterElement) return;

        const texts = [
            "Full Stack Developer & UI/UX Designer",
            "Creative Problem Solver",
            "Digital Innovation Enthusiast",
            "User Experience Advocate"
        ];

        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        const typeWriter = () => {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                typewriterElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typewriterElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 50 : 100;

            if (!isDeleting && charIndex === currentText.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typeSpeed = 500;
            }

            setTimeout(typeWriter, typeSpeed);
        };

  
        setTimeout(typeWriter, 1000);
    }

  
    setupParticles() {
        const canvas = document.createElement('canvas');
        canvas.id = 'particles-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '-1';
        canvas.style.opacity = '0.1';
        
        document.body.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const particles = [];
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        const createParticle = () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 2 + 1
        });
        
        const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach((particle, index) => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
                
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = '#ff6b35';
                ctx.fill();
                
                
                particles.forEach((otherParticle, otherIndex) => {
                    if (index !== otherIndex) {
                        const dx = particle.x - otherParticle.x;
                        const dy = particle.y - otherParticle.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        if (distance < 100) {
                            ctx.beginPath();
                            ctx.moveTo(particle.x, particle.y);
                            ctx.lineTo(otherParticle.x, otherParticle.y);
                            ctx.strokeStyle = `rgba(255, 107, 53, ${0.1 - distance / 1000})`;
                            ctx.stroke();
                        }
                    }
                });
            });
            
            requestAnimationFrame(animateParticles);
        };
        
        resizeCanvas();
        
       
        for (let i = 0; i < 50; i++) {
            particles.push(createParticle());
        }
        
        animateParticles();
        
        window.addEventListener('resize', resizeCanvas);
    }

  
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    handleKeyboard(e) {
        // Handle keyboard navigation
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    }

    handleResize() {
        // Handle window resize
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.updateParallax(window.pageYOffset);
        }, 100);
    }

    initializeAnimations() {
        // Add reveal animation class to elements
        const animatedElements = document.querySelectorAll('.skill-category, .project-card, .timeline-item');
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(50px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
    }

    startAnimations() {
        // Trigger initial animations
        setTimeout(() => {
            this.revealOnScroll();
        }, 100);
    }

    hideLoader() {
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
    }
}

// Global functions for HTML onclick events
function scrollToSection(sectionId) {
    const app = window.portfolioApp;
    if (app) {
        app.scrollToSection(sectionId);
    }
}

function openModal(projectId) {
    const app = window.portfolioApp;
    if (app) {
        app.openModal(projectId);
    }
}

function closeModal() {
    const app = window.portfolioApp;
    if (app) {
        app.closeModal();
    }
}


window.portfolioApp = new PortfolioApp();
// css for additional styles on notifications
const additionalStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--dark-bg);
        color: var(--text-light);
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-dark);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-success {
        border-left: 4px solid #4ecdc4;
    }
    
    .notification-error {
        border-left: 4px solid #ff4757;
    }
    
    .form-group input.error,
    .form-group textarea.error {
        border-color: #ff4757;
        background: rgba(255, 71, 87, 0.1);
    }
    
    .form-group input.success,
    .form-group textarea.success {
        border-color: #4ecdc4;
        background: rgba(78, 205, 196, 0.1);
    }
    
    .revealed {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .modal-image {
        width: 100%;
        height: 300px;
        object-fit: cover;
        border-radius: var(--border-radius);
        margin-bottom: 1.5rem;
    }
    
    .modal-header {
        margin-bottom: 1.5rem;
    }
    
    .modal-tech {
        margin-top: 1rem;
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
    
    .modal-description h3 {
        color: var(--primary-color);
        margin: 1.5rem 0 0.5rem 0;
    }
    
    .modal-description ul {
        margin: 0.5rem 0 1rem 1.5rem;
        color: var(--text-gray);
    }
    
    .modal-description li {
        margin-bottom: 0.5rem;
    }
    
    .modal-links {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
    }
    
    .modal-links .btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .keyboard-nav *:focus {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
    }
    
    @media (max-width: 768px) {
        .modal-links {
            flex-direction: column;
        }
        
        .notification {
            right: 10px;
            left: 10px;
            transform: translateY(-100%);
        }
        
        .notification.show {
            transform: translateY(0);
        }
    }
`;


const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);