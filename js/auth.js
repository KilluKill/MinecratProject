// Authentication JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize authentication functionality
    initializeAuth();
});

function initializeAuth() {
    // Login form handler
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Registration form handler
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegistration);
        
        // Password strength checker
        const passwordInput = document.getElementById('reg-password');
        if (passwordInput) {
            passwordInput.addEventListener('input', checkPasswordStrength);
        }

        // Confirm password validation
        const confirmPasswordInput = document.getElementById('confirm-password');
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', validatePasswordConfirmation);
        }
    }

    // Forgot password form handler
    const forgotForm = document.getElementById('forgot-form');
    if (forgotForm) {
        forgotForm.addEventListener('submit', handleForgotPassword);
    }

    // Add input animations
    addInputAnimations();
}

// Login handler
async function handleLogin(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitButton = form.querySelector('.auth-submit');
    const formData = new FormData(form);
    
    const loginData = {
        login: formData.get('login'),
        password: formData.get('password'),
        remember: formData.get('remember') === 'on'
    };

    // Validate form
    if (!validateLoginForm(loginData)) {
        return;
    }

    // Show loading state
    setButtonLoading(submitButton, true);

    try {
        // Simulate API call
        await simulateLogin(loginData);
        
        // Success - redirect or show success message
        showNotification('Вход выполнен успешно!', 'success');
        
        // Simulate redirect to dashboard or previous page
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
        
    } catch (error) {
        // Handle different types of errors
        if (error.type === '2fa_required') {
            show2FAModal();
        } else if (error.type === 'invalid_credentials') {
            showNotification('Неверный логин или пароль', 'error');
            highlightInvalidFields(['login', 'password']);
        } else if (error.type === 'account_locked') {
            showNotification('Аккаунт заблокирован. Обратитесь к администрации.', 'error');
        } else {
            showNotification('Произошла ошибка при входе. Попробуйте позже.', 'error');
        }
    } finally {
        setButtonLoading(submitButton, false);
    }
}

// Registration handler
async function handleRegistration(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitButton = form.querySelector('.auth-submit');
    const formData = new FormData(form);
    
    const registrationData = {
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirm-password'),
        minecraftNick: formData.get('minecraft-nick'),
        agreeTerms: formData.get('agree-terms') === 'on'
    };

    // Validate form
    if (!validateRegistrationForm(registrationData)) {
        return;
    }

    // Show loading state
    setButtonLoading(submitButton, true);

    try {
        // Simulate API call
        await simulateRegistration(registrationData);
        
        // Success
        showNotification('Регистрация прошла успешно! Проверьте email для подтверждения.', 'success');
        
        // Clear form
        form.reset();
        
        // Redirect to login
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        
    } catch (error) {
        if (error.type === 'email_exists') {
            showNotification('Пользователь с таким email уже существует', 'error');
            highlightInvalidFields(['email']);
        } else if (error.type === 'username_exists') {
            showNotification('Пользователь с таким именем уже существует', 'error');
            highlightInvalidFields(['username']);
        } else if (error.type === 'minecraft_nick_exists') {
            showNotification('Minecraft ник уже используется', 'error');
            highlightInvalidFields(['minecraft-nick']);
        } else {
            showNotification('Произошла ошибка при регистрации. Попробуйте позже.', 'error');
        }
    } finally {
        setButtonLoading(submitButton, false);
    }
}

// Forgot password handler
async function handleForgotPassword(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitButton = form.querySelector('.auth-submit');
    const formData = new FormData(form);
    
    const email = formData.get('email');

    if (!email || !isValidEmail(email)) {
        showNotification('Введите корректный email адрес', 'error');
        highlightInvalidFields(['email']);
        return;
    }

    setButtonLoading(submitButton, true);

    try {
        // Simulate API call
        await simulateForgotPassword(email);
        
        showNotification('Инструкции по восстановлению пароля отправлены на ваш email', 'success');
        form.reset();
        
    } catch (error) {
        if (error.type === 'email_not_found') {
            showNotification('Пользователь с таким email не найден', 'error');
            highlightInvalidFields(['email']);
        } else {
            showNotification('Произошла ошибка. Попробуйте позже.', 'error');
        }
    } finally {
        setButtonLoading(submitButton, false);
    }
}

// Form validation functions
function validateLoginForm(data) {
    let isValid = true;
    const errors = [];

    if (!data.login.trim()) {
        errors.push('login');
        isValid = false;
    }

    if (!data.password.trim()) {
        errors.push('password');
        isValid = false;
    }

    if (!isValid) {
        showNotification('Заполните все обязательные поля', 'error');
        highlightInvalidFields(errors);
    }

    return isValid;
}

function validateRegistrationForm(data) {
    let isValid = true;
    const errors = [];

    // Username validation
    if (!data.username.trim() || data.username.length < 3) {
        errors.push('username');
        isValid = false;
    }

    // Email validation
    if (!data.email.trim() || !isValidEmail(data.email)) {
        errors.push('email');
        isValid = false;
    }

    // Password validation
    if (!data.password.trim() || data.password.length < 6) {
        errors.push('password');
        isValid = false;
    }

    // Password confirmation
    if (data.password !== data.confirmPassword) {
        errors.push('confirm-password');
        isValid = false;
    }

    // Minecraft nick validation
    if (!data.minecraftNick.trim() || data.minecraftNick.length < 3) {
        errors.push('minecraft-nick');
        isValid = false;
    }

    // Terms agreement
    if (!data.agreeTerms) {
        showNotification('Необходимо согласиться с условиями использования', 'error');
        isValid = false;
    }

    if (!isValid && errors.length > 0) {
        showNotification('Исправьте ошибки в форме', 'error');
        highlightInvalidFields(errors);
    }

    return isValid;
}

// Password strength checker
function checkPasswordStrength(e) {
    const password = e.target.value;
    const strengthContainer = document.querySelector('.password-strength');
    
    if (!strengthContainer) return;

    const strength = calculatePasswordStrength(password);
    const strengthBar = strengthContainer.querySelector('.strength-fill');
    const strengthText = strengthContainer.querySelector('.strength-text');

    // Remove all strength classes
    strengthBar.className = 'strength-fill';
    strengthText.className = 'strength-text';

    if (password.length === 0) {
        strengthBar.style.width = '0%';
        strengthText.textContent = '';
        return;
    }

    // Add appropriate strength class
    strengthBar.classList.add(`strength-${strength.level}`);
    strengthText.classList.add(`strength-${strength.level}-text`);
    strengthText.textContent = strength.text;
}

function calculatePasswordStrength(password) {
    let score = 0;
    
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score < 3) {
        return { level: 'weak', text: 'Слабый пароль' };
    } else if (score < 5) {
        return { level: 'fair', text: 'Средний пароль' };
    } else if (score < 6) {
        return { level: 'good', text: 'Хороший пароль' };
    } else {
        return { level: 'strong', text: 'Надежный пароль' };
    }
}

// Password confirmation validation
function validatePasswordConfirmation(e) {
    const confirmPassword = e.target.value;
    const password = document.getElementById('reg-password')?.value;
    
    if (confirmPassword && password !== confirmPassword) {
        e.target.classList.add('error');
        showFieldError(e.target, 'Пароли не совпадают');
    } else {
        e.target.classList.remove('error');
        clearFieldError(e.target);
        if (confirmPassword && password === confirmPassword) {
            e.target.classList.add('success');
        }
    }
}

// Password toggle functionality
window.togglePassword = function(inputId) {
    const input = document.getElementById(inputId);
    const toggle = input.parentNode.querySelector('.password-toggle');
    
    if (input.type === 'password') {
        input.type = 'text';
        toggle.textContent = '🙈';
    } else {
        input.type = 'password';
        toggle.textContent = '👁️';
    }
};

// Social login handler
window.socialLogin = function(provider) {
    showNotification(`Перенаправление на ${provider.toUpperCase()}...`, 'info');
    
    // In real application, this would redirect to OAuth provider
    setTimeout(() => {
        showNotification('Социальная авторизация временно недоступна', 'error');
    }, 1500);
};

// 2FA Modal functions
function show2FAModal() {
    const modal = document.getElementById('2fa-modal');
    if (modal) {
        modal.style.display = 'flex';
        // Focus first input
        const firstInput = modal.querySelector('.code-input');
        if (firstInput) {
            firstInput.focus();
        }
    }
}

window.close2FAModal = function() {
    const modal = document.getElementById('2fa-modal');
    if (modal) {
        modal.style.display = 'none';
        // Clear inputs
        modal.querySelectorAll('.code-input').forEach(input => {
            input.value = '';
        });
    }
};

window.moveToNext = function(current, index) {
    const inputs = document.querySelectorAll('.code-input');
    
    if (current.value.length === 1 && index < inputs.length - 1) {
        inputs[index + 1].focus();
    }
    
    // Auto-submit if all fields are filled
    const allFilled = Array.from(inputs).every(input => input.value.length === 1);
    if (allFilled) {
        verify2FA();
    }
};

window.verify2FA = function() {
    const inputs = document.querySelectorAll('.code-input');
    const code = Array.from(inputs).map(input => input.value).join('');
    
    if (code.length !== 6) {
        showNotification('Введите полный код', 'error');
        return;
    }

    // Simulate 2FA verification
    showNotification('Проверка кода...', 'info');
    
    setTimeout(() => {
        if (code === '123456') { // Demo code
            showNotification('Код подтвержден!', 'success');
            close2FAModal();
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            showNotification('Неверный код', 'error');
            inputs.forEach(input => {
                input.value = '';
                input.classList.add('error');
            });
            inputs[0].focus();
            
            setTimeout(() => {
                inputs.forEach(input => input.classList.remove('error'));
            }, 2000);
        }
    }, 1500);
};

window.resend2FACode = function() {
    showNotification('Код отправлен повторно', 'success');
};

// Utility functions
function highlightInvalidFields(fieldNames) {
    // Clear previous errors
    document.querySelectorAll('.form-input.error').forEach(input => {
        input.classList.remove('error');
        clearFieldError(input);
    });

    // Highlight invalid fields
    fieldNames.forEach(fieldName => {
        const field = document.getElementById(fieldName) || 
                     document.querySelector(`[name="${fieldName}"]`);
        if (field) {
            field.classList.add('error');
            field.focus();
        }
    });
}

function showFieldError(input, message) {
    clearFieldError(input);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    input.parentNode.appendChild(errorDiv);
}

function clearFieldError(input) {
    const existingError = input.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Input animations
function addInputAnimations() {
    const inputs = document.querySelectorAll('.form-input');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentNode.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentNode.classList.remove('focused');
            
            // Validate on blur
            if (this.value.trim()) {
                this.classList.remove('error');
                clearFieldError(this);
                
                // Add success state for valid inputs
                if (this.type === 'email' && isValidEmail(this.value)) {
                    this.classList.add('success');
                } else if (this.type === 'text' && this.value.length >= 3) {
                    this.classList.add('success');
                }
            }
        });
        
        // Clear success/error states on input
        input.addEventListener('input', function() {
            this.classList.remove('success', 'error');
            clearFieldError(this);
        });
    });
}

// Simulation functions (replace with real API calls)
async function simulateLogin(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate different scenarios
            if (data.login === 'admin' && data.password === 'admin') {
                reject({ type: '2fa_required' });
            } else if (data.login === 'test@example.com' && data.password === 'password') {
                resolve({ token: 'mock-jwt-token', user: { id: 1, username: 'test' } });
            } else if (data.login === 'banned@example.com') {
                reject({ type: 'account_locked' });
            } else {
                reject({ type: 'invalid_credentials' });
            }
        }, 2000);
    });
}

async function simulateRegistration(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (data.email === 'existing@example.com') {
                reject({ type: 'email_exists' });
            } else if (data.username === 'admin') {
                reject({ type: 'username_exists' });
            } else if (data.minecraftNick === 'Notch') {
                reject({ type: 'minecraft_nick_exists' });
            } else {
                resolve({ message: 'Registration successful' });
            }
        }, 2000);
    });
}

async function simulateForgotPassword(email) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (email === 'notfound@example.com') {
                reject({ type: 'email_not_found' });
            } else {
                resolve({ message: 'Reset email sent' });
            }
        }, 1500);
    });
}

console.log('Auth system initialized successfully!');