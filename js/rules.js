// Rules Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeRulesPage();
});

function initializeRulesPage() {
    initializeSmoothScrolling();
    initializeAnimations();
    initializeFloatingShapes();
    initializeRuleHighlighting();
    
    console.log('Rules page initialized successfully!');
}

// Smooth Scrolling for TOC Links
function initializeSmoothScrolling() {
    const tocLinks = document.querySelectorAll('.toc-item[href^="#"]');
    
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Add visual feedback
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
                
                // Smooth scroll to section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Highlight the target section
                highlightSection(targetSection);
            }
        });
    });
}

// Section Highlighting
function highlightSection(section) {
    // Remove previous highlights
    document.querySelectorAll('.rules-section.highlighted').forEach(s => {
        s.classList.remove('highlighted');
    });
    
    // Add highlight to target section
    section.classList.add('highlighted');
    
    // Remove highlight after animation
    setTimeout(() => {
        section.classList.remove('highlighted');
    }, 2000);
}

// Rule Item Highlighting
function initializeRuleHighlighting() {
    const ruleItems = document.querySelectorAll('.rule-item');
    
    ruleItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.classList.add('rule-focused');
        });
        
        item.addEventListener('mouseleave', function() {
            this.classList.remove('rule-focused');
        });
    });
}

// Animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('rule-item')) {
                    entry.target.classList.add('animate-rule-in');
                } else {
                    entry.target.classList.add('animate-fade-in-up');
                }
                
                // Stagger animation for multiple items
                const siblings = Array.from(entry.target.parentNode.children);
                const index = siblings.indexOf(entry.target);
                entry.target.style.animationDelay = `${index * 0.1}s`;
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.rule-item, .toc-item, .punishment-card, .info-card'
    );
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Floating Shapes Animation
function initializeFloatingShapes() {
    const heroSection = document.querySelector('.rules-hero');
    if (!heroSection) return;
    
    // Create floating shapes container
    const shapesContainer = document.createElement('div');
    shapesContainer.className = 'floating-shapes';
    
    // Create floating shapes
    for (let i = 0; i < 5; i++) {
        const shape = document.createElement('div');
        shape.className = 'floating-shape';
        
        // Random positioning and size
        const size = Math.random() * 30 + 10;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const delay = Math.random() * 6;
        
        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;
        shape.style.left = `${left}%`;
        shape.style.top = `${top}%`;
        shape.style.animationDelay = `${delay}s`;
        
        shapesContainer.appendChild(shape);
    }
    
    heroSection.appendChild(shapesContainer);
}

// External Functions
window.joinDiscord = function() {
    Server17yotk.showNotification('Переход в Discord для поддержки...', 'info');
    setTimeout(() => {
        window.open('https://discord.gg/17yotk', '_blank');
    }, 1000);
};

// URL Parameter Handling for Direct Links
function handleURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get('section');
    
    if (section) {
        const targetSection = document.getElementById(section);
        if (targetSection) {
            setTimeout(() => {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                highlightSection(targetSection);
            }, 500);
        }
    }
}

// Initialize URL handling
document.addEventListener('DOMContentLoaded', handleURLParameters);

// Add enhanced CSS for animations
const style = document.createElement('style');
style.textContent = `
    .rules-section.highlighted {
        background: linear-gradient(135deg, 
            rgba(102, 126, 234, 0.1) 0%, 
            rgba(240, 147, 251, 0.1) 100%);
        transform: scale(1.02);
        transition: all 0.5s ease;
        border-radius: var(--radius-lg);
        box-shadow: 0 0 30px rgba(102, 126, 234, 0.3);
    }
    
    .rule-item.rule-focused {
        transform: translateX(15px) scale(1.02);
        box-shadow: var(--shadow-xl);
        z-index: 10;
        position: relative;
    }
    
    .rule-item.rule-focused::before {
        width: 12px;
        background: linear-gradient(135deg, var(--primary-solid), var(--secondary-solid));
    }
    
    .toc-item.active {
        background: var(--primary-solid);
        color: var(--white);
        transform: scale(1.05);
    }
    
    .toc-item.active .toc-icon {
        background: var(--white);
        color: var(--primary-solid);
    }
    
    .punishment-card:hover .punishment-icon {
        transform: scale(1.2) rotate(10deg);
        filter: drop-shadow(0 5px 15px rgba(0,0,0,0.3));
    }
    
    .info-card:hover .info-icon {
        transform: scale(1.1) rotate(-5deg);
        filter: drop-shadow(0 5px 15px rgba(102, 126, 234, 0.3));
    }
    
    /* Enhanced scroll animations */
    .animate-rule-in {
        opacity: 0;
        transform: translateX(-50px);
    }
    
    .animate-fade-in-up {
        opacity: 0;
        transform: translateY(30px);
    }
    
    /* Pulse animation for important elements */
    .hero-warning {
        animation: warningPulse 2s ease-in-out infinite;
    }
    
    @keyframes warningPulse {
        0%, 100% { 
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.3);
        }
        50% { 
            transform: scale(1.02);
            box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
        }
    }
    
    /* Gradient text animation */
    .hero-title {
        background: linear-gradient(45deg, #fff, #f0f0f0, #fff, #f0f0f0);
        background-size: 400% 400%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: gradientShift 4s ease-in-out infinite;
    }
    
    @keyframes gradientShift {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
    }
    
    /* Interactive hover effects */
    .rule-examples .example {
        transition: all var(--transition);
        cursor: default;
    }
    
    .rule-examples .example:hover {
        transform: translateX(5px);
        box-shadow: var(--shadow-sm);
    }
    
    .rule-note {
        transition: all var(--transition);
        cursor: default;
    }
    
    .rule-note:hover {
        transform: translateX(5px);
        background: rgba(102, 126, 234, 0.15);
        box-shadow: var(--shadow-sm);
    }
    
    /* Scroll indicator */
    .scroll-indicator {
        position: fixed;
        top: 80px;
        left: 0;
        width: 100%;
        height: 4px;
        background: rgba(102, 126, 234, 0.1);
        z-index: 1000;
    }
    
    .scroll-progress {
        height: 100%;
        background: linear-gradient(90deg, var(--primary-solid), var(--secondary-solid));
        width: 0%;
        transition: width 0.1s ease;
    }
`;
document.head.appendChild(style);

// Scroll Progress Indicator
function initializeScrollProgress() {
    const indicator = document.createElement('div');
    indicator.className = 'scroll-indicator';
    indicator.innerHTML = '<div class="scroll-progress"></div>';
    document.body.appendChild(indicator);
    
    const progressBar = indicator.querySelector('.scroll-progress');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    });
}

// Initialize scroll progress
document.addEventListener('DOMContentLoaded', initializeScrollProgress);

// Keyboard Navigation
document.addEventListener('keydown', function(e) {
    // Navigate between sections with arrow keys
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        const sections = document.querySelectorAll('.rules-section[id]');
        const currentSection = getCurrentSection(sections);
        
        if (currentSection !== -1) {
            let nextSection;
            
            if (e.key === 'ArrowDown') {
                nextSection = Math.min(currentSection + 1, sections.length - 1);
            } else {
                nextSection = Math.max(currentSection - 1, 0);
            }
            
            sections[nextSection].scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            highlightSection(sections[nextSection]);
            e.preventDefault();
        }
    }
});

function getCurrentSection(sections) {
    const scrollPos = window.pageYOffset + 150;
    
    for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i].offsetTop <= scrollPos) {
            return i;
        }
    }
    return 0;
}

console.log('Rules page JavaScript loaded successfully!');