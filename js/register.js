// Registration specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeRegistration();
});

function initializeRegistration() {
    // Add field hints styling
    addFieldHints();
    
    // Minecraft nick validation
    const minecraftNickInput = document.getElementById('minecraft-nick');
    if (minecraftNickInput) {
        minecraftNickInput.addEventListener('input', validateMinecraftNick);
        minecraftNickInput.addEventListener('blur', checkMinecraftNickAvailability);
    }

    // Username validation
    const usernameInput = document.getElementById('username');
    if (usernameInput) {
        usernameInput.addEventListener('input', validateUsername);
        usernameInput.addEventListener('blur', checkUsernameAvailability);
    }

    // Email validation
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', checkEmailAvailability);
    }

    // Referral code validation
    const referralInput = document.getElementById('referral-code');
    if (referralInput) {
        referralInput.addEventListener('blur', validateReferralCode);
    }

    // Terms checkbox handler
    const termsCheckbox = document.getElementById('agree-terms');
    if (termsCheckbox) {
        termsCheckbox.addEventListener('change', updateSubmitButton);
    }
}

// Field hints styling
function addFieldHints() {
    const style = document.createElement('style');
    style.textContent = `
        .field-hint {
            font-size: 0.8rem;
            color: var(--text-light);
            margin-top: 0.25rem;
            line-height: 1.4;
        }
        
        .verification-success {
            text-align: center;
        }
        
        .success-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        
        .verification-success h4 {
            color: var(--primary-color);
            margin-bottom: 1rem;
        }
        
        .email-tips {
            background: var(--light-color);
            padding: 1rem;
            border-radius: 8px;
            margin-top: 1.5rem;
            text-align: left;
        }
        
        .email-tips h5 {
            margin-bottom: 0.5rem;
            color: var(--dark-color);
        }
        
        .email-tips ul {
            margin: 0;
            padding-left: 1.2rem;
        }
        
        .email-tips li {
            margin-bottom: 0.25rem;
            font-size: 0.9rem;
            color: var(--text-light);
        }
        
        .availability-check {
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
            font-size: 0.8rem;
            margin-top: 0.25rem;
        }
        
        .availability-check.checking {
            color: var(--text-light);
        }
        
        .availability-check.available {
            color: #2ed573;
        }
        
        .availability-check.unavailable {
            color: var(--danger-color);
        }
        
        .spinner {
            width: 12px;
            height: 12px;
            border: 2px solid transparent;
            border-top: 2px solid currentColor;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
    `;
    document.head.appendChild(style);
}

// Minecraft nick validation
function validateMinecraftNick(e) {
    const nick = e.target.value;
    const validNickRegex = /^[a-zA-Z0-9_]{3,16}$/;
    
    clearFieldError(e.target);
    
    if (nick.length === 0) return;
    
    if (!validNickRegex.test(nick)) {
        showFieldError(e.target, 'Ник может содержать только буквы, цифры и символ _');
        e.target.classList.add('error');
        return false;
    }
    
    e.target.classList.remove('error');
    return true;
}

async function checkMinecraftNickAvailability(e) {
    const nick = e.target.value.trim();
    
    if (!nick || !validateMinecraftNick(e) || e.target.classList.contains('error')) {
        return;
    }

    const availabilityDiv = getOrCreateAvailabilityDiv(e.target);
    availabilityDiv.className = 'availability-check checking';
    availabilityDiv.innerHTML = '<span class="spinner"></span> Проверка доступности...';

    try {
        const isAvailable = await checkNickAvailabilityAPI(nick);
        
        if (isAvailable) {
            availabilityDiv.className = 'availability-check available';
            availabilityDiv.innerHTML = '✅ Ник доступен';
            e.target.classList.add('success');
        } else {
            availabilityDiv.className = 'availability-check unavailable';
            availabilityDiv.innerHTML = '❌ Ник уже занят';
            e.target.classList.add('error');
        }
    } catch (error) {
        availabilityDiv.className = 'availability-check checking';
        availabilityDiv.innerHTML = '⚠️ Ошибка проверки';
    }
}

// Username validation
function validateUsername(e) {
    const username = e.target.value;
    const validUsernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    
    clearFieldError(e.target);
    
    if (username.length === 0) return;
    
    if (!validUsernameRegex.test(username)) {
        showFieldError(e.target, 'Имя пользователя может содержать только буквы, цифры и символ _');
        e.target.classList.add('error');
        return false;
    }
    
    e.target.classList.remove('error');
    return true;
}

async function checkUsernameAvailability(e) {
    const username = e.target.value.trim();
    
    if (!username || !validateUsername(e) || e.target.classList.contains('error')) {
        return;
    }

    const availabilityDiv = getOrCreateAvailabilityDiv(e.target);
    availabilityDiv.className = 'availability-check checking';
    availabilityDiv.innerHTML = '<span class="spinner"></span> Проверка доступности...';

    try {
        const isAvailable = await checkUsernameAvailabilityAPI(username);
        
        if (isAvailable) {
            availabilityDiv.className = 'availability-check available';
            availabilityDiv.innerHTML = '✅ Имя доступно';
            e.target.classList.add('success');
        } else {
            availabilityDiv.className = 'availability-check unavailable';
            availabilityDiv.innerHTML = '❌ Имя уже занято';
            e.target.classList.add('error');
        }
    } catch (error) {
        availabilityDiv.className = 'availability-check checking';
        availabilityDiv.innerHTML = '⚠️ Ошибка проверки';
    }
}

// Email availability check
async function checkEmailAvailability(e) {
    const email = e.target.value.trim();
    
    if (!email || !isValidEmail(email)) {
        return;
    }

    const availabilityDiv = getOrCreateAvailabilityDiv(e.target);
    availabilityDiv.className = 'availability-check checking';
    availabilityDiv.innerHTML = '<span class="spinner"></span> Проверка email...';

    try {
        const isAvailable = await checkEmailAvailabilityAPI(email);
        
        if (isAvailable) {
            availabilityDiv.className = 'availability-check available';
            availabilityDiv.innerHTML = '✅ Email доступен';
            e.target.classList.add('success');
        } else {
            availabilityDiv.className = 'availability-check unavailable';
            availabilityDiv.innerHTML = '❌ Email уже зарегистрирован';
            e.target.classList.add('error');
        }
    } catch (error) {
        availabilityDiv.className = 'availability-check checking';
        availabilityDiv.innerHTML = '⚠️ Ошибка проверки';
    }
}

// Referral code validation
async function validateReferralCode(e) {
    const code = e.target.value.trim();
    
    if (!code) {
        removeAvailabilityDiv(e.target);
        return;
    }

    const availabilityDiv = getOrCreateAvailabilityDiv(e.target);
    availabilityDiv.className = 'availability-check checking';
    availabilityDiv.innerHTML = '<span class="spinner"></span> Проверка кода...';

    try {
        const codeInfo = await validateReferralCodeAPI(code);
        
        if (codeInfo.valid) {
            availabilityDiv.className = 'availability-check available';
            availabilityDiv.innerHTML = `✅ Код действителен (бонус: ${codeInfo.bonus})`;
            e.target.classList.add('success');
        } else {
            availabilityDiv.className = 'availability-check unavailable';
            availabilityDiv.innerHTML = '❌ Недействительный код';
            e.target.classList.add('error');
        }
    } catch (error) {
        availabilityDiv.className = 'availability-check checking';
        availabilityDiv.innerHTML = '⚠️ Ошибка проверки';
    }
}

// Helper functions
function getOrCreateAvailabilityDiv(input) {
    let availabilityDiv = input.parentNode.querySelector('.availability-check');
    
    if (!availabilityDiv) {
        availabilityDiv = document.createElement('div');
        availabilityDiv.className = 'availability-check';
        input.parentNode.appendChild(availabilityDiv);
    }
    
    return availabilityDiv;
}

function removeAvailabilityDiv(input) {
    const availabilityDiv = input.parentNode.querySelector('.availability-check');
    if (availabilityDiv) {
        availabilityDiv.remove();
    }
}

// Update submit button state
function updateSubmitButton() {
    const submitButton = document.querySelector('.auth-submit');
    const termsCheckbox = document.getElementById('agree-terms');
    
    if (termsCheckbox && submitButton) {
        if (termsCheckbox.checked) {
            submitButton.disabled = false;
            submitButton.style.opacity = '1';
        } else {
            submitButton.disabled = true;
            submitButton.style.opacity = '0.6';
        }
    }
}

// Email verification modal functions
function showEmailVerificationModal(email) {
    const modal = document.getElementById('email-verification-modal');
    if (modal) {
        // Update email in modal if needed
        const emailText = modal.querySelector('.modal-body p');
        if (emailText && email) {
            emailText.innerHTML = emailText.innerHTML.replace(/на ваш email адрес/, `на <strong>${email}</strong>`);
        }
        
        modal.style.display = 'flex';
    }
}

window.closeEmailModal = function() {
    const modal = document.getElementById('email-verification-modal');
    if (modal) {
        modal.style.display = 'none';
    }
};

window.resendEmail = function() {
    showNotification('Письмо отправлено повторно', 'success');
};

// API simulation functions (replace with real API calls)
async function checkNickAvailabilityAPI(nick) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulate some taken nicks
            const takenNicks = ['Notch', 'Herobrine', 'admin', 'moderator', 'test'];
            resolve(!takenNicks.includes(nick.toLowerCase()));
        }, 1500);
    });
}

async function checkUsernameAvailabilityAPI(username) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulate some taken usernames
            const takenUsernames = ['admin', 'administrator', 'moderator', 'user', 'test'];
            resolve(!takenUsernames.includes(username.toLowerCase()));
        }, 1200);
    });
}

async function checkEmailAvailabilityAPI(email) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulate some taken emails
            const takenEmails = ['admin@craftworld.ru', 'test@example.com', 'existing@example.com'];
            resolve(!takenEmails.includes(email.toLowerCase()));
        }, 1000);
    });
}

async function validateReferralCodeAPI(code) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulate valid referral codes
            const validCodes = {
                'FRIEND10': { valid: true, bonus: '100 монет' },
                'WELCOME': { valid: true, bonus: '50 монет' },
                'NEWBIE': { valid: true, bonus: '25 монет' }
            };
            
            const codeInfo = validCodes[code.toUpperCase()];
            resolve(codeInfo || { valid: false });
        }, 800);
    });
}

// Enhanced registration form submission
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('.auth-submit');
            const formData = new FormData(this);
            
            // Enhanced validation
            const registrationData = {
                username: formData.get('username'),
                email: formData.get('email'),
                password: formData.get('password'),
                confirmPassword: formData.get('confirm-password'),
                minecraftNick: formData.get('minecraft-nick'),
                referralCode: formData.get('referral-code'),
                agreeTerms: formData.get('agree-terms') === 'on',
                newsletter: formData.get('newsletter') === 'on'
            };

            // Validate all fields
            if (!validateAllRegistrationFields(registrationData)) {
                return;
            }

            setButtonLoading(submitButton, true);

            try {
                await simulateRegistration(registrationData);
                
                // Show email verification modal instead of redirect
                showEmailVerificationModal(registrationData.email);
                
                // Clear form
                this.reset();
                updateSubmitButton();
                
                // Clear all availability checks
                document.querySelectorAll('.availability-check').forEach(div => div.remove());
                document.querySelectorAll('.form-input').forEach(input => {
                    input.classList.remove('success', 'error');
                });
                
            } catch (error) {
                // Handle registration errors
                handleRegistrationError(error);
            } finally {
                setButtonLoading(submitButton, false);
            }
        });
    }
});

function validateAllRegistrationFields(data) {
    let isValid = true;
    const errors = [];

    // Check for errors in form inputs
    const errorInputs = document.querySelectorAll('.form-input.error');
    if (errorInputs.length > 0) {
        showNotification('Исправьте ошибки в форме', 'error');
        errorInputs[0].focus();
        return false;
    }

    // Additional validations
    if (!data.agreeTerms) {
        showNotification('Необходимо согласиться с условиями использования', 'error');
        document.getElementById('agree-terms').focus();
        return false;
    }

    return isValid;
}

function handleRegistrationError(error) {
    switch (error.type) {
        case 'email_exists':
            showNotification('Пользователь с таким email уже существует', 'error');
            highlightInvalidFields(['email']);
            break;
        case 'username_exists':
            showNotification('Пользователь с таким именем уже существует', 'error');
            highlightInvalidFields(['username']);
            break;
        case 'minecraft_nick_exists':
            showNotification('Minecraft ник уже используется', 'error');
            highlightInvalidFields(['minecraft-nick']);
            break;
        case 'invalid_referral':
            showNotification('Недействительный реферальный код', 'error');
            highlightInvalidFields(['referral-code']);
            break;
        default:
            showNotification('Произошла ошибка при регистрации. Попробуйте позже.', 'error');
    }
}

// Initialize submit button state on page load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(updateSubmitButton, 100);
});

console.log('Registration enhancement loaded successfully!');