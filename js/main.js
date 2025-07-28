// Main JavaScript for CraftWorld Minecraft Server Website

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navAuth = document.querySelector('.nav-auth');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navAuth.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-link');

    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinksAll.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);

    // Copy server IP functionality
    window.copyIP = function() {
        const serverIP = 'play.craftworld.ru';
        
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(serverIP).then(() => {
                showNotification('IP адрес скопирован в буфер обмена!', 'success');
            }).catch(() => {
                fallbackCopyIP(serverIP);
            });
        } else {
            fallbackCopyIP(serverIP);
        }
    };

    function fallbackCopyIP(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            showNotification('IP адрес скопирован в буфер обмена!', 'success');
        } catch (err) {
            showNotification('Не удалось скопировать IP адрес', 'error');
        }
        
        document.body.removeChild(textArea);
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        `;

        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : '#2196F3'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 1rem;
            animation: slideInRight 0.3s ease-out;
            max-width: 300px;
        `;

        document.body.appendChild(notification);

        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            line-height: 1;
        `;

        closeBtn.addEventListener('click', () => {
            notification.remove();
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // Add slide in animation CSS
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
    `;
    document.head.appendChild(style);

    // Server status simulation (replace with real API call)
    function updateServerStatus() {
        const onlinePlayersElements = document.querySelectorAll('#online-players, #current-players');
        const baseCount = 127;
        const variation = Math.floor(Math.random() * 20) - 10; // ±10 players
        const currentPlayers = Math.max(0, baseCount + variation);
        
        onlinePlayersElements.forEach(element => {
            if (element) {
                element.textContent = currentPlayers;
            }
        });
    }

    // Update server status every 30 seconds
    updateServerStatus();
    setInterval(updateServerStatus, 30000);

    // Intersection Observer for animations
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
    const animatedElements = document.querySelectorAll('.about-card, .news-card, .server-status, .discord-widget');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroVideo = document.querySelector('.hero-video');
        
        if (heroVideo) {
            const rate = scrolled * -0.5;
            heroVideo.style.transform = `translateY(${rate}px)`;
        }
    });

    // Form validation helper
    window.validateForm = function(formElement) {
        const inputs = formElement.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            const value = input.value.trim();
            const errorElement = input.parentNode.querySelector('.error-message');

            // Remove existing error
            if (errorElement) {
                errorElement.remove();
            }

            input.classList.remove('error');

            // Validate based on input type
            if (!value) {
                showInputError(input, 'Это поле обязательно для заполнения');
                isValid = false;
            } else if (input.type === 'email' && !isValidEmail(value)) {
                showInputError(input, 'Введите корректный email адрес');
                isValid = false;
            } else if (input.type === 'password' && value.length < 6) {
                showInputError(input, 'Пароль должен содержать минимум 6 символов');
                isValid = false;
            }
        });

        return isValid;
    };

    function showInputError(input, message) {
        input.classList.add('error');
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #F44336;
            font-size: 0.9rem;
            margin-top: 0.25rem;
        `;
        input.parentNode.appendChild(errorElement);
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Add error styles for form inputs
    const formStyles = document.createElement('style');
    formStyles.textContent = `
        .form-input.error {
            border-color: #F44336 !important;
            box-shadow: 0 0 0 2px rgba(244, 67, 54, 0.2) !important;
        }
        .form-input {
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
    `;
    document.head.appendChild(formStyles);

    // Loading states for buttons
    window.setButtonLoading = function(button, isLoading = true) {
        if (isLoading) {
            button.disabled = true;
            button.dataset.originalText = button.textContent;
            button.innerHTML = `
                <span style="display: inline-flex; align-items: center; gap: 0.5rem;">
                    <span style="width: 16px; height: 16px; border: 2px solid transparent; border-top: 2px solid currentColor; border-radius: 50%; animation: spin 1s linear infinite;"></span>
                    Загрузка...
                </span>
            `;
        } else {
            button.disabled = false;
            button.textContent = button.dataset.originalText || button.textContent;
        }
    };

    // Add spin animation for loading
    const spinStyles = document.createElement('style');
    spinStyles.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(spinStyles);

    console.log('CraftWorld website initialized successfully!');
});

// Global utility functions
window.CraftWorld = {
    showNotification: function(message, type = 'info') {
        // This function is available globally
        const event = new CustomEvent('showNotification', {
            detail: { message, type }
        });
        document.dispatchEvent(event);
    },
    
    copyToClipboard: function(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        } else {
            return new Promise((resolve, reject) => {
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                
                try {
                    document.execCommand('copy');
                    resolve();
                } catch (err) {
                    reject(err);
                }
                
                document.body.removeChild(textArea);
            });
        }
    }
};