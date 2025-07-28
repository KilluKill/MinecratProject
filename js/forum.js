// Forum JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeForum();
});

function initializeForum() {
    // Initialize search functionality
    initializeSearch();
    
    // Initialize animations
    initializeAnimations();
    
    // Initialize category cards interactions
    initializeCategoryCards();
    
    // Initialize activity updates
    initializeActivityUpdates();
    
    console.log('Forum initialized successfully!');
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('forum-search');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim();
            
            if (query.length >= 2) {
                searchTimeout = setTimeout(() => {
                    performSearch(query);
                }, 300);
            } else {
                hideSearchResults();
            }
        });
        
        searchInput.addEventListener('blur', function() {
            // Hide results after a delay to allow clicking
            setTimeout(hideSearchResults, 200);
        });
        
        searchInput.addEventListener('focus', function() {
            const query = this.value.trim();
            if (query.length >= 2) {
                performSearch(query);
            }
        });
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const query = searchInput.value.trim();
            if (query) {
                performFullSearch(query);
            }
        });
    }
}

async function performSearch(query) {
    try {
        const results = await searchForumContent(query);
        displaySearchResults(results);
    } catch (error) {
        console.error('Search error:', error);
    }
}

function displaySearchResults(results) {
    const searchContainer = document.querySelector('.forum-search');
    let resultsContainer = searchContainer.querySelector('.search-results');
    
    if (!resultsContainer) {
        resultsContainer = document.createElement('div');
        resultsContainer.className = 'search-results';
        searchContainer.style.position = 'relative';
        searchContainer.appendChild(resultsContainer);
    }
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<div class="search-result-item">Ничего не найдено</div>';
    } else {
        resultsContainer.innerHTML = results.map(result => `
            <div class="search-result-item" onclick="openTopic('${result.id}')">
                <div class="search-result-title">${highlightSearchTerm(result.title, result.searchTerm)}</div>
                <div class="search-result-meta">${result.category} • ${result.author} • ${result.date}</div>
            </div>
        `).join('');
    }
    
    resultsContainer.style.display = 'block';
}

function hideSearchResults() {
    const resultsContainer = document.querySelector('.search-results');
    if (resultsContainer) {
        resultsContainer.style.display = 'none';
    }
}

function highlightSearchTerm(text, term) {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<strong>$1</strong>');
}

function performFullSearch(query) {
    // Redirect to full search results page
    window.location.href = `forum-search.html?q=${encodeURIComponent(query)}`;
}

// New Topic Modal Functions
window.showNewTopicModal = function() {
    // Check if user is logged in (simulate)
    if (!isUserLoggedIn()) {
        showNotification('Войдите в аккаунт, чтобы создать тему', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
    const modal = document.getElementById('new-topic-modal');
    if (modal) {
        modal.style.display = 'flex';
        
        // Focus on category select
        const categorySelect = document.getElementById('topic-category');
        if (categorySelect) {
            categorySelect.focus();
        }
    }
};

window.closeNewTopicModal = function() {
    const modal = document.getElementById('new-topic-modal');
    if (modal) {
        modal.style.display = 'none';
        
        // Clear form
        const form = document.getElementById('new-topic-form');
        if (form) {
            form.reset();
        }
    }
};

window.createTopic = async function() {
    const form = document.getElementById('new-topic-form');
    const formData = new FormData(form);
    
    const topicData = {
        category: formData.get('category'),
        title: formData.get('title'),
        content: formData.get('content'),
        notify: formData.get('notify') === 'on'
    };
    
    // Validate form
    if (!validateTopicForm(topicData)) {
        return;
    }
    
    const createButton = document.querySelector('#new-topic-modal .btn-primary');
    setButtonLoading(createButton, true);
    
    try {
        await submitNewTopic(topicData);
        
        showNotification('Тема успешно создана!', 'success');
        closeNewTopicModal();
        
        // Refresh page or redirect to new topic
        setTimeout(() => {
            window.location.reload();
        }, 1500);
        
    } catch (error) {
        showNotification('Ошибка при создании темы. Попробуйте позже.', 'error');
    } finally {
        setButtonLoading(createButton, false);
    }
};

function validateTopicForm(data) {
    if (!data.category) {
        showNotification('Выберите категорию', 'error');
        document.getElementById('topic-category').focus();
        return false;
    }
    
    if (!data.title.trim()) {
        showNotification('Введите заголовок темы', 'error');
        document.getElementById('topic-title').focus();
        return false;
    }
    
    if (data.title.length > 100) {
        showNotification('Заголовок слишком длинный (максимум 100 символов)', 'error');
        document.getElementById('topic-title').focus();
        return false;
    }
    
    if (!data.content.trim()) {
        showNotification('Введите содержание темы', 'error');
        document.getElementById('topic-content').focus();
        return false;
    }
    
    if (data.content.length < 10) {
        showNotification('Содержание темы слишком короткое (минимум 10 символов)', 'error');
        document.getElementById('topic-content').focus();
        return false;
    }
    
    return true;
}

// Text Editor Functions
window.formatText = function(command) {
    const textarea = document.getElementById('topic-content');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    let formattedText = '';
    
    switch(command) {
        case 'bold':
            formattedText = `**${selectedText}**`;
            break;
        case 'italic':
            formattedText = `*${selectedText}*`;
            break;
        case 'underline':
            formattedText = `__${selectedText}__`;
            break;
        default:
            return;
    }
    
    textarea.value = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
    textarea.focus();
    textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);
};

window.insertLink = function() {
    const textarea = document.getElementById('topic-content');
    const url = prompt('Введите URL:');
    
    if (url) {
        const linkText = prompt('Введите текст ссылки:') || url;
        const markdown = `[${linkText}](${url})`;
        
        insertAtCursor(textarea, markdown);
    }
};

window.insertImage = function() {
    const textarea = document.getElementById('topic-content');
    const url = prompt('Введите URL изображения:');
    
    if (url) {
        const altText = prompt('Введите описание изображения:') || 'Изображение';
        const markdown = `![${altText}](${url})`;
        
        insertAtCursor(textarea, markdown);
    }
};

window.insertCode = function() {
    const textarea = document.getElementById('topic-content');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    let codeBlock;
    if (selectedText.includes('\n')) {
        // Multi-line code block
        codeBlock = `\`\`\`\n${selectedText}\n\`\`\``;
    } else {
        // Inline code
        codeBlock = `\`${selectedText}\``;
    }
    
    textarea.value = textarea.value.substring(0, start) + codeBlock + textarea.value.substring(end);
    textarea.focus();
};

function insertAtCursor(textarea, text) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    textarea.value = textarea.value.substring(0, start) + text + textarea.value.substring(end);
    textarea.focus();
    textarea.setSelectionRange(start + text.length, start + text.length);
}

// Category Cards Interactions
function initializeCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't navigate if clicking on a topic link
            if (e.target.closest('.topic-title')) {
                return;
            }
            
            // Navigate to category page
            const categoryTitle = this.querySelector('.category-info h3').textContent;
            const categorySlug = categoryTitle.toLowerCase().replace(/\s+/g, '-');
            window.location.href = `forum-category.html?category=${categorySlug}`;
        });
        
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.cursor = 'pointer';
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
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.category-card, .activity-item');
    animatedElements.forEach((element, index) => {
        element.classList.add('fade-in-up');
        element.style.animationDelay = `${index * 0.1}s`;
        observer.observe(element);
    });
}

// Activity Updates
function initializeActivityUpdates() {
    // Update activity every 30 seconds
    setInterval(updateRecentActivity, 30000);
    
    // Update online users count
    setInterval(updateOnlineUsers, 15000);
}

async function updateRecentActivity() {
    try {
        const activities = await fetchRecentActivity();
        updateActivityDisplay(activities);
    } catch (error) {
        console.error('Failed to update activity:', error);
    }
}

function updateActivityDisplay(activities) {
    const activityList = document.querySelector('.activity-list');
    if (!activityList || activities.length === 0) return;
    
    // Add new activities to the top
    activities.forEach(activity => {
        const existingActivity = activityList.querySelector(`[data-activity-id="${activity.id}"]`);
        if (!existingActivity) {
            const activityElement = createActivityElement(activity);
            activityList.insertBefore(activityElement, activityList.firstChild);
        }
    });
    
    // Remove old activities (keep max 10)
    const activityItems = activityList.querySelectorAll('.activity-item');
    if (activityItems.length > 10) {
        for (let i = 10; i < activityItems.length; i++) {
            activityItems[i].remove();
        }
    }
}

function createActivityElement(activity) {
    const div = document.createElement('div');
    div.className = 'activity-item fade-in-up';
    div.setAttribute('data-activity-id', activity.id);
    div.innerHTML = `
        <div class="activity-avatar">
            <img src="${activity.avatar}" alt="${activity.user}">
        </div>
        <div class="activity-content">
            <div class="activity-header">
                <span class="activity-user">${activity.user}</span>
                <span class="activity-action">${activity.action}</span>
                <a href="#" class="activity-topic">"${activity.topic}"</a>
            </div>
            <div class="activity-meta">
                <span class="activity-category">${activity.category}</span>
                <span class="activity-time">${activity.time}</span>
            </div>
        </div>
    `;
    
    // Trigger animation
    setTimeout(() => {
        div.classList.add('visible');
    }, 100);
    
    return div;
}

async function updateOnlineUsers() {
    try {
        const count = await fetchOnlineUsersCount();
        const onlineTitle = document.querySelector('.online-users h3');
        if (onlineTitle) {
            onlineTitle.textContent = `Сейчас на форуме (${count})`;
        }
        
        // Update forum stats
        const onlineStatNumber = document.querySelector('.forum-stats .stat:last-child .stat-number');
        if (onlineStatNumber) {
            onlineStatNumber.textContent = count;
        }
    } catch (error) {
        console.error('Failed to update online users:', error);
    }
}

// Topic functions
function openTopic(topicId) {
    window.location.href = `forum-topic.html?id=${topicId}`;
}

// Utility functions
function isUserLoggedIn() {
    // Simulate user login check
    return localStorage.getItem('user_token') !== null;
}

// API simulation functions (replace with real API calls)
async function searchForumContent(query) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const mockResults = [
                {
                    id: '1',
                    title: 'Новые возможности сервера в 2024',
                    category: 'Общее обсуждение',
                    author: 'CraftMaster',
                    date: '2 часа назад',
                    searchTerm: query
                },
                {
                    id: '2',
                    title: 'Гайд по командам сервера',
                    category: 'Помощь новичкам',
                    author: 'AdminBot',
                    date: '3 часа назад',
                    searchTerm: query
                },
                {
                    id: '3',
                    title: 'Мой средневековый замок',
                    category: 'Постройки',
                    author: 'ArchitectX',
                    date: '30 минут назад',
                    searchTerm: query
                }
            ].filter(result => 
                result.title.toLowerCase().includes(query.toLowerCase()) ||
                result.category.toLowerCase().includes(query.toLowerCase())
            );
            
            resolve(mockResults);
        }, 500);
    });
}

async function submitNewTopic(topicData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate success/failure
            if (Math.random() > 0.1) { // 90% success rate
                resolve({ id: Date.now(), message: 'Topic created successfully' });
            } else {
                reject(new Error('Failed to create topic'));
            }
        }, 2000);
    });
}

async function fetchRecentActivity() {
    return new Promise((resolve) => {
        setTimeout(() => {
            const activities = [
                {
                    id: Date.now(),
                    user: 'NewPlayer',
                    action: 'создал новую тему',
                    topic: 'Помогите с настройкой',
                    category: 'Помощь новичкам',
                    time: 'только что',
                    avatar: 'images/avatars/user6.png'
                }
            ];
            resolve(activities);
        }, 1000);
    });
}

async function fetchOnlineUsersCount() {
    return new Promise((resolve) => {
        setTimeout(() => {
            const baseCount = 47;
            const variation = Math.floor(Math.random() * 10) - 5; // ±5 users
            resolve(Math.max(1, baseCount + variation));
        }, 500);
    });
}

// Show more activity
document.addEventListener('DOMContentLoaded', function() {
    const showMoreBtn = document.querySelector('.activity-more .btn');
    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', async function() {
            setButtonLoading(this, true);
            
            try {
                // Simulate loading more activities
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                const activityList = document.querySelector('.activity-list');
                const newActivities = [
                    {
                        user: 'OldPlayer',
                        action: 'ответил в теме',
                        topic: 'Старые добрые времена',
                        category: 'Общее обсуждение',
                        time: '6 часов назад',
                        avatar: 'images/avatars/user7.png'
                    },
                    {
                        user: 'BuilderMaster',
                        action: 'поделился постройкой',
                        topic: 'Космическая станция',
                        category: 'Постройки',
                        time: '8 часов назад',
                        avatar: 'images/avatars/user8.png'
                    }
                ];
                
                newActivities.forEach(activity => {
                    const activityElement = createActivityElement({
                        id: Date.now() + Math.random(),
                        ...activity
                    });
                    activityList.appendChild(activityElement);
                });
                
                showNotification('Загружено больше активности', 'success');
                
            } catch (error) {
                showNotification('Ошибка загрузки', 'error');
            } finally {
                setButtonLoading(this, false);
            }
        });
    }
});

console.log('Forum JavaScript loaded successfully!');