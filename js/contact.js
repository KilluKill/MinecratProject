// Contact Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeContactPage();
});

function initializeContactPage() {
    initializeContactForm();
    initializeFAQ();
    initializeFileUpload();
    initializeCharacterCounter();
    initializeFormValidation();
    initializeAnimations();
    
    console.log('Contact page initialized successfully!');
}

// Contact Form Initialization
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    
    if (form) {
        form.addEventListener('submit', handleFormSubmission);
        form.addEventListener('reset', handleFormReset);
    }
    
    // Initialize subject-based form behavior
    const subjectSelect = document.getElementById('subject');
    if (subjectSelect) {
        subjectSelect.addEventListener('change', handleSubjectChange);
    }
}

async function handleFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    
    // Validate form
    if (!validateContactForm(form)) {
        return;
    }
    
    // Set loading state
    Server17yotk.setButtonLoading(submitButton, true);
    
    try {
        // Simulate form submission
        await simulateFormSubmission(formData);
        
        // Show success message
        Server17yotk.showNotification('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.', 'success', 6000);
        
        // Reset form
        form.reset();
        handleFormReset();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
    } catch (error) {
        Server17yotk.showNotification('Произошла ошибка при отправке сообщения. Попробуйте позже.', 'error');
        console.error('Form submission error:', error);
    } finally {
        Server17yotk.setButtonLoading(submitButton, false);
    }
}

function handleFormReset() {
    // Reset character counter
    const charCount = document.getElementById('char-count');
    if (charCount) {
        charCount.textContent = '0';
    }
    
    // Clear uploaded files
    const uploadedFiles = document.getElementById('uploaded-files');
    if (uploadedFiles) {
        uploadedFiles.innerHTML = '';
    }
    
    // Reset form validation states
    const form = document.getElementById('contact-form');
    const inputs = form.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.classList.remove('error', 'success');
    });
    
    Server17yotk.showNotification('Форма очищена', 'info', 2000);
}

function handleSubjectChange(e) {
    const subject = e.target.value;
    const messageTextarea = document.getElementById('message');
    
    if (messageTextarea && !messageTextarea.value.trim()) {
        const templates = {
            'support': 'Здравствуйте! У меня возникла проблема с...',
            'bug': 'Обнаружил ошибку на сервере:\n\nОписание проблемы:\n\nШаги для воспроизведения:\n1. \n2. \n3. \n\nОжидаемый результат:\n\nФактический результат:',
            'suggestion': 'Здравствуйте! Хотел бы предложить улучшение для сервера:\n\nОписание предложения:\n\nПреимущества:\n\nВозможная реализация:',
            'complaint': 'Здравствуйте! Хочу подать жалобу на игрока:\n\nНик нарушителя:\nДата и время нарушения:\nОписание нарушения:\n\n(Приложите скриншоты в качестве доказательств)',
            'unban': 'Здравствуйте! Прошу рассмотреть мою заявку на разбан:\n\nМой игровой ник:\nПричина бана:\nДата бана:\n\nПочему считаю бан несправедливым:\n\nОбещаю соблюдать правила сервера.',
            'donation': 'Здравствуйте! У меня вопрос по донату:\n\nID транзакции (если есть):\nОписание проблемы:',
            'partnership': 'Здравствуйте! Хотел бы обсудить возможность сотрудничества:\n\nТип сотрудничества:\nМои предложения:\nКонтактная информация:'
        };
        
        if (templates[subject]) {
            messageTextarea.value = templates[subject];
            updateCharacterCounter();
        }
    }
    
    // Auto-set priority based on subject
    const priorityInputs = document.querySelectorAll('input[name="priority"]');
    const priorityMap = {
        'support': 'medium',
        'bug': 'high',
        'complaint': 'medium',
        'unban': 'low',
        'donation': 'high',
        'partnership': 'low'
    };
    
    if (priorityMap[subject]) {
        priorityInputs.forEach(input => {
            input.checked = input.value === priorityMap[subject];
        });
    }
}

// Form Validation
function validateContactForm(form) {
    const requiredFields = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    const errors = [];
    
    requiredFields.forEach(field => {
        const value = field.value.trim();
        field.classList.remove('error', 'success');
        
        if (!value) {
            field.classList.add('error');
            errors.push(`Поле "${field.labels[0]?.textContent || field.name}" обязательно для заполнения`);
            isValid = false;
        } else {
            // Additional validation
            if (field.type === 'email' && !isValidEmail(value)) {
                field.classList.add('error');
                errors.push('Введите корректный email адрес');
                isValid = false;
            } else {
                field.classList.add('success');
            }
        }
    });
    
    // Check agreement checkbox
    const agreeCheckbox = document.getElementById('agree');
    if (agreeCheckbox && !agreeCheckbox.checked) {
        errors.push('Необходимо согласиться с политикой конфиденциальности');
        isValid = false;
    }
    
    // Message length validation
    const messageField = document.getElementById('message');
    if (messageField && messageField.value.length > 2000) {
        messageField.classList.add('error');
        errors.push('Сообщение не должно превышать 2000 символов');
        isValid = false;
    }
    
    if (!isValid) {
        const errorMessage = errors.length > 1 ? 
            `Исправьте следующие ошибки:\n• ${errors.join('\n• ')}` : 
            errors[0];
        Server17yotk.showNotification(errorMessage, 'error', 8000);
        
        // Focus on first error field
        const firstError = form.querySelector('.form-input.error');
        if (firstError) {
            firstError.focus();
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Character Counter
function initializeCharacterCounter() {
    const messageTextarea = document.getElementById('message');
    const charCount = document.getElementById('char-count');
    
    if (messageTextarea && charCount) {
        messageTextarea.addEventListener('input', updateCharacterCounter);
        messageTextarea.addEventListener('paste', () => {
            setTimeout(updateCharacterCounter, 10);
        });
    }
}

function updateCharacterCounter() {
    const messageTextarea = document.getElementById('message');
    const charCount = document.getElementById('char-count');
    
    if (messageTextarea && charCount) {
        const currentLength = messageTextarea.value.length;
        const maxLength = 2000;
        
        charCount.textContent = currentLength;
        
        // Update color based on length
        const counter = charCount.parentElement;
        counter.style.color = currentLength > maxLength ? 'var(--danger)' : 
                             currentLength > maxLength * 0.8 ? 'var(--warning)' : 
                             'var(--text-secondary)';
        
        // Add warning class if over limit
        if (currentLength > maxLength) {
            messageTextarea.classList.add('error');
        } else {
            messageTextarea.classList.remove('error');
        }
    }
}

// File Upload
function initializeFileUpload() {
    const fileInput = document.getElementById('attachments');
    const uploadArea = document.querySelector('.file-upload-area');
    const uploadedFiles = document.getElementById('uploaded-files');
    
    if (!fileInput || !uploadArea || !uploadedFiles) return;
    
    // Click to upload
    uploadArea.addEventListener('click', () => fileInput.click());
    
    // File selection
    fileInput.addEventListener('change', handleFileSelection);
    
    // Drag and drop
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleFileDrop);
}

function handleFileSelection(e) {
    const files = Array.from(e.target.files);
    processFiles(files);
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
}

function handleFileDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
}

function processFiles(files) {
    const uploadedFiles = document.getElementById('uploaded-files');
    const maxFiles = 5;
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
    
    // Check current file count
    const currentFiles = uploadedFiles.querySelectorAll('.uploaded-file').length;
    
    if (currentFiles + files.length > maxFiles) {
        Server17yotk.showNotification(`Можно загрузить максимум ${maxFiles} файлов`, 'error');
        return;
    }
    
    files.forEach(file => {
        // Validate file size
        if (file.size > maxSize) {
            Server17yotk.showNotification(`Файл "${file.name}" слишком большой (максимум 10 МБ)`, 'error');
            return;
        }
        
        // Validate file type
        if (!allowedTypes.includes(file.type)) {
            Server17yotk.showNotification(`Тип файла "${file.name}" не поддерживается`, 'error');
            return;
        }
        
        addFileToList(file);
    });
}

function addFileToList(file) {
    const uploadedFiles = document.getElementById('uploaded-files');
    const fileElement = document.createElement('div');
    fileElement.className = 'uploaded-file';
    
    const fileSize = formatFileSize(file.size);
    const fileIcon = getFileIcon(file.type);
    
    fileElement.innerHTML = `
        <div class="file-info">
            <span class="file-icon">${fileIcon}</span>
            <div>
                <div class="file-name">${file.name}</div>
                <div class="file-size">${fileSize}</div>
            </div>
        </div>
        <button type="button" class="file-remove" onclick="removeFile(this)">×</button>
    `;
    
    // Store file reference
    fileElement.fileData = file;
    
    uploadedFiles.appendChild(fileElement);
    
    // Add animation
    fileElement.style.opacity = '0';
    fileElement.style.transform = 'translateY(10px)';
    setTimeout(() => {
        fileElement.style.transition = 'all 0.3s ease';
        fileElement.style.opacity = '1';
        fileElement.style.transform = 'translateY(0)';
    }, 10);
}

window.removeFile = function(button) {
    const fileElement = button.parentElement;
    fileElement.style.transition = 'all 0.3s ease';
    fileElement.style.opacity = '0';
    fileElement.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
        fileElement.remove();
    }, 300);
};

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Б';
    const k = 1024;
    const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function getFileIcon(type) {
    const icons = {
        'image/jpeg': '🖼️',
        'image/png': '🖼️',
        'image/gif': '🖼️',
        'application/pdf': '📄',
        'text/plain': '📝'
    };
    return icons[type] || '📎';
}

// FAQ Functionality
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => toggleFAQ(question));
        }
    });
}

window.toggleFAQ = function(questionElement) {
    const faqItem = questionElement.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Close all other FAQ items
    document.querySelectorAll('.faq-item.active').forEach(item => {
        if (item !== faqItem) {
            item.classList.remove('active');
        }
    });
    
    // Toggle current item
    faqItem.classList.toggle('active');
    
    // Smooth scroll to question if opening
    if (!isActive) {
        setTimeout(() => {
            questionElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
        }, 100);
    }
};

// External Links
window.joinDiscord = function() {
    Server17yotk.showNotification('Переход в Discord...', 'info');
    // In real implementation, this would open Discord invite
    setTimeout(() => {
        window.open('https://discord.gg/17yotk', '_blank');
    }, 1000);
};

window.joinTelegram = function() {
    Server17yotk.showNotification('Переход в Telegram...', 'info');
    // In real implementation, this would open Telegram channel
    setTimeout(() => {
        window.open('https://t.me/server17yotk', '_blank');
    }, 1000);
};

// Animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.method-card, .faq-category, .team-member, .contact-feature'
    );
    
    animatedElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
        observer.observe(element);
    });
}

// Form Submission Simulation
async function simulateFormSubmission(formData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate random success/failure
            if (Math.random() > 0.1) { // 90% success rate
                resolve({
                    success: true,
                    message: 'Message sent successfully',
                    ticketId: 'TKT-' + Math.random().toString(36).substr(2, 9).toUpperCase()
                });
            } else {
                reject(new Error('Server error'));
            }
        }, 2000);
    });
}

// Add CSS for drag and drop
const style = document.createElement('style');
style.textContent = `
    .file-upload-area.drag-over {
        border-color: var(--primary-solid);
        background: rgba(102, 126, 234, 0.1);
        transform: scale(1.02);
    }
    
    .form-input.error {
        border-color: var(--danger);
        animation: shake 0.3s ease-in-out;
    }
    
    .form-input.success {
        border-color: var(--success);
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    .uploaded-file {
        animation: slideInUp 0.3s ease-out;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .char-counter.warning {
        color: var(--warning);
        font-weight: 600;
    }
    
    .char-counter.danger {
        color: var(--danger);
        font-weight: 600;
        animation: pulse 1s infinite;
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
    }
`;
document.head.appendChild(style);

console.log('Contact page JavaScript loaded successfully!');