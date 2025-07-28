// Admin Panel JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
});

function initializeAdmin() {
    // Check admin permissions
    if (!checkAdminAccess()) {
        window.location.href = 'login.html';
        return;
    }
    
    // Initialize sidebar navigation
    initializeSidebar();
    
    // Initialize dashboard updates
    initializeDashboard();
    
    // Initialize search functionality
    initializeSearch();
    
    // Initialize filters
    initializeFilters();
    
    // Initialize tabs
    initializeTabs();
    
    // Initialize real-time updates
    initializeRealTimeUpdates();
    
    console.log('Admin panel initialized successfully!');
}

// Sidebar Navigation
function initializeSidebar() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.admin-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.dataset.section;
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding section
            sections.forEach(section => section.classList.remove('active'));
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
                
                // Load section data if needed
                loadSectionData(sectionId);
            }
        });
    });
}

// Dashboard Functions
function initializeDashboard() {
    updateServerMetrics();
    loadRecentActivity();
    
    // Update metrics every 30 seconds
    setInterval(updateServerMetrics, 30000);
    
    // Update activity every 60 seconds
    setInterval(loadRecentActivity, 60000);
}

async function updateServerMetrics() {
    try {
        const metrics = await fetchServerMetrics();
        
        // Update progress bars
        updateProgressBar('cpu', metrics.cpu);
        updateProgressBar('ram', metrics.ram);
        updateProgressBar('tps', metrics.tps);
        
        // Update stats
        updateStatCard('online-players', metrics.onlinePlayers);
        updateStatCard('total-players', metrics.totalPlayers);
        updateStatCard('donations', metrics.donations);
        updateStatCard('forum-posts', metrics.forumPosts);
        
    } catch (error) {
        console.error('Failed to update server metrics:', error);
    }
}

function updateProgressBar(type, value) {
    const progressBar = document.querySelector(`.server-metric:has(.metric-label:contains("${type.toUpperCase()}")) .progress-fill`);
    const valueSpan = document.querySelector(`.server-metric:has(.metric-label:contains("${type.toUpperCase()}")) .metric-value`);
    
    if (progressBar) {
        progressBar.style.width = `${value.percentage}%`;
        
        // Update color based on value
        if (type === 'tps') {
            progressBar.className = `progress-fill ${value.percentage > 90 ? 'good' : ''}`;
        }
    }
    
    if (valueSpan) {
        valueSpan.textContent = value.display;
    }
}

function updateStatCard(type, value) {
    const statNumber = document.querySelector(`.stat-card:has(.stat-label:contains("${getStatLabel(type)}")) .stat-number`);
    const statChange = document.querySelector(`.stat-card:has(.stat-label:contains("${getStatLabel(type)}")) .stat-change`);
    
    if (statNumber) {
        animateNumber(statNumber, parseInt(statNumber.textContent.replace(/[^\d]/g, '')), value.current);
    }
    
    if (statChange && value.change) {
        statChange.textContent = value.change;
        statChange.className = `stat-change ${value.trend}`;
    }
}

function getStatLabel(type) {
    const labels = {
        'online-players': 'Онлайн сейчас',
        'total-players': 'Всего игроков',
        'donations': 'Донаты за месяц',
        'forum-posts': 'Сообщений на форуме'
    };
    return labels[type] || '';
}

function animateNumber(element, from, to) {
    const duration = 1000;
    const steps = 60;
    const stepValue = (to - from) / steps;
    let current = from;
    let step = 0;
    
    const timer = setInterval(() => {
        step++;
        current += stepValue;
        
        if (step >= steps) {
            current = to;
            clearInterval(timer);
        }
        
        const formattedValue = element.textContent.includes('₽') ? 
            `₽${Math.round(current).toLocaleString()}` : 
            Math.round(current).toLocaleString();
            
        element.textContent = formattedValue;
    }, duration / steps);
}

async function loadRecentActivity() {
    try {
        const activities = await fetchRecentActivity();
        const activityList = document.querySelector('.activity-list');
        
        if (activityList && activities.length > 0) {
            activityList.innerHTML = activities.map(activity => `
                <div class="activity-item">
                    <div class="activity-avatar">
                        <img src="${activity.avatar}" alt="${activity.user}">
                    </div>
                    <div class="activity-content">
                        <div class="activity-text">
                            <strong>${activity.user}</strong> ${activity.action}
                        </div>
                        <div class="activity-time">${activity.time}</div>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Failed to load recent activity:', error);
    }
}

window.refreshDashboard = async function() {
    const refreshBtn = document.querySelector('.section-header .btn-secondary');
    setButtonLoading(refreshBtn, true);
    
    try {
        await Promise.all([
            updateServerMetrics(),
            loadRecentActivity()
        ]);
        
        showNotification('Данные обновлены', 'success');
    } catch (error) {
        showNotification('Ошибка обновления данных', 'error');
    } finally {
        setButtonLoading(refreshBtn, false);
    }
};

// Search Functionality
function initializeSearch() {
    const searchInput = document.getElementById('user-search');
    
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim();
            
            searchTimeout = setTimeout(() => {
                if (query.length >= 2) {
                    searchUsers(query);
                } else {
                    loadUsers(); // Reset to all users
                }
            }, 300);
        });
    }
}

async function searchUsers(query) {
    try {
        const users = await fetchUsers({ search: query });
        updateUsersTable(users);
    } catch (error) {
        console.error('Search failed:', error);
        showNotification('Ошибка поиска', 'error');
    }
}

// Filters
function initializeFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active filter
            filterBtns.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            
            // Apply filter
            applyUserFilter(filter);
        });
    });
}

async function applyUserFilter(filter) {
    try {
        const users = await fetchUsers({ filter });
        updateUsersTable(users);
    } catch (error) {
        console.error('Filter failed:', error);
        showNotification('Ошибка фильтрации', 'error');
    }
}

// Tabs
function initializeTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // Update active tab
            tabBtns.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding content
            tabContents.forEach(content => content.classList.remove('active'));
            const targetContent = document.getElementById(`${tabId}-tab`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// User Management Functions
window.editUser = function(userId) {
    // Load user data and show edit modal
    loadUserData(userId).then(userData => {
        document.getElementById('edit-username').value = userData.username;
        document.getElementById('edit-email').value = userData.email;
        document.getElementById('edit-status').value = userData.status;
        
        const modal = document.getElementById('user-edit-modal');
        modal.style.display = 'flex';
        modal.dataset.userId = userId;
    });
};

window.closeUserEditModal = function() {
    const modal = document.getElementById('user-edit-modal');
    modal.style.display = 'none';
    delete modal.dataset.userId;
};

window.saveUserChanges = async function() {
    const modal = document.getElementById('user-edit-modal');
    const userId = modal.dataset.userId;
    
    const userData = {
        username: document.getElementById('edit-username').value,
        email: document.getElementById('edit-email').value,
        status: document.getElementById('edit-status').value
    };
    
    const saveBtn = modal.querySelector('.btn-primary');
    setButtonLoading(saveBtn, true);
    
    try {
        await updateUser(userId, userData);
        showNotification('Пользователь обновлен', 'success');
        closeUserEditModal();
        loadUsers(); // Refresh users table
    } catch (error) {
        showNotification('Ошибка обновления пользователя', 'error');
    } finally {
        setButtonLoading(saveBtn, false);
    }
};

window.banUser = async function(userId) {
    if (!confirm('Вы уверены, что хотите заблокировать этого пользователя?')) {
        return;
    }
    
    try {
        await banUserAPI(userId);
        showNotification('Пользователь заблокирован', 'success');
        loadUsers();
    } catch (error) {
        showNotification('Ошибка блокировки пользователя', 'error');
    }
};

window.unbanUser = async function(userId) {
    try {
        await unbanUserAPI(userId);
        showNotification('Пользователь разблокирован', 'success');
        loadUsers();
    } catch (error) {
        showNotification('Ошибка разблокировки пользователя', 'error');
    }
};

window.deleteUser = async function(userId) {
    if (!confirm('Вы уверены, что хотите удалить этого пользователя? Это действие нельзя отменить.')) {
        return;
    }
    
    try {
        await deleteUserAPI(userId);
        showNotification('Пользователь удален', 'success');
        loadUsers();
    } catch (error) {
        showNotification('Ошибка удаления пользователя', 'error');
    }
};

// Forum Management Functions
window.pinTopic = async function(topicId) {
    try {
        await pinTopicAPI(topicId);
        showNotification('Тема закреплена', 'success');
        loadForumTopics();
    } catch (error) {
        showNotification('Ошибка закрепления темы', 'error');
    }
};

window.lockTopic = async function(topicId) {
    try {
        await lockTopicAPI(topicId);
        showNotification('Тема закрыта', 'success');
        loadForumTopics();
    } catch (error) {
        showNotification('Ошибка закрытия темы', 'error');
    }
};

window.deleteTopic = async function(topicId) {
    if (!confirm('Вы уверены, что хотите удалить эту тему?')) {
        return;
    }
    
    try {
        await deleteTopicAPI(topicId);
        showNotification('Тема удалена', 'success');
        loadForumTopics();
    } catch (error) {
        showNotification('Ошибка удаления темы', 'error');
    }
};

// Donation Management Functions
window.processDonation = async function(donationId) {
    try {
        await processDonationAPI(donationId);
        showNotification('Донат обработан', 'success');
        loadDonations();
    } catch (error) {
        showNotification('Ошибка обработки доната', 'error');
    }
};

window.refundDonation = async function(donationId) {
    if (!confirm('Вы уверены, что хотите вернуть деньги за этот донат?')) {
        return;
    }
    
    try {
        await refundDonationAPI(donationId);
        showNotification('Возврат выполнен', 'success');
        loadDonations();
    } catch (error) {
        showNotification('Ошибка возврата', 'error');
    }
};

// Server Management Functions
window.restartServer = async function() {
    if (!confirm('Вы уверены, что хотите перезагрузить сервер? Все игроки будут отключены.')) {
        return;
    }
    
    const restartBtn = document.querySelector('.btn-danger');
    setButtonLoading(restartBtn, true);
    
    try {
        await restartServerAPI();
        showNotification('Сервер перезагружается...', 'info');
        
        // Monitor restart progress
        monitorServerRestart();
    } catch (error) {
        showNotification('Ошибка перезагрузки сервера', 'error');
        setButtonLoading(restartBtn, false);
    }
};

async function monitorServerRestart() {
    const checkInterval = setInterval(async () => {
        try {
            const status = await checkServerStatus();
            if (status.online) {
                clearInterval(checkInterval);
                showNotification('Сервер успешно перезагружен', 'success');
                
                const restartBtn = document.querySelector('.btn-danger');
                setButtonLoading(restartBtn, false);
                
                // Refresh dashboard
                updateServerMetrics();
            }
        } catch (error) {
            // Server still restarting
        }
    }, 5000);
    
    // Stop monitoring after 5 minutes
    setTimeout(() => {
        clearInterval(checkInterval);
        const restartBtn = document.querySelector('.btn-danger');
        setButtonLoading(restartBtn, false);
    }, 300000);
}

window.executeCommand = async function(command) {
    try {
        const result = await executeServerCommand(command);
        addConsoleOutput(`[ADMIN] Executed: ${command}`);
        
        if (result.output) {
            addConsoleOutput(result.output);
        }
        
        showNotification('Команда выполнена', 'success');
    } catch (error) {
        addConsoleOutput(`[ERROR] Failed to execute: ${command}`);
        showNotification('Ошибка выполнения команды', 'error');
    }
};

window.sendConsoleCommand = function() {
    const input = document.getElementById('console-command');
    const command = input.value.trim();
    
    if (command) {
        executeCommand(command);
        input.value = '';
    }
};

function addConsoleOutput(message) {
    const output = document.getElementById('console-output');
    const line = document.createElement('div');
    line.className = 'console-line';
    line.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
    
    // Keep only last 100 lines
    while (output.children.length > 100) {
        output.removeChild(output.firstChild);
    }
}

// Real-time Updates
function initializeRealTimeUpdates() {
    // Connect to WebSocket for real-time updates (simulate)
    simulateRealTimeUpdates();
}

function simulateRealTimeUpdates() {
    setInterval(() => {
        // Simulate random console messages
        const messages = [
            'Player joined the game',
            'Player left the game',
            'Saving chunks...',
            'Auto-save completed',
            'Player earned achievement'
        ];
        
        if (Math.random() < 0.3) { // 30% chance
            const message = messages[Math.floor(Math.random() * messages.length)];
            addConsoleOutput(message);
        }
    }, 10000);
}

// Data Loading Functions
async function loadSectionData(sectionId) {
    switch (sectionId) {
        case 'users':
            await loadUsers();
            break;
        case 'forum':
            await loadForumTopics();
            break;
        case 'donations':
            await loadDonations();
            break;
    }
}

async function loadUsers(options = {}) {
    try {
        const users = await fetchUsers(options);
        updateUsersTable(users);
    } catch (error) {
        console.error('Failed to load users:', error);
    }
}

function updateUsersTable(users) {
    const tbody = document.getElementById('users-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>
                <div class="user-cell">
                    <img src="${user.avatar}" alt="${user.username}" class="table-avatar">
                    <div class="user-details">
                        <div class="user-name">${user.username}</div>
                        <div class="user-nick">${user.minecraftNick}</div>
                    </div>
                </div>
            </td>
            <td>${user.email}</td>
            <td><span class="status-badge ${user.status}">${user.statusLabel}</span></td>
            <td>${user.registrationDate}</td>
            <td>${user.lastSeen}</td>
            <td>
                <div class="action-buttons">
                    ${user.status === 'banned' ? 
                        `<button class="btn-icon" onclick="unbanUser('${user.id}')" title="Разблокировать">✅</button>` :
                        `<button class="btn-icon" onclick="banUser('${user.id}')" title="Заблокировать">🚫</button>`
                    }
                    <button class="btn-icon" onclick="editUser('${user.id}')" title="Редактировать">✏️</button>
                    <button class="btn-icon" onclick="deleteUser('${user.id}')" title="Удалить">🗑️</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Utility Functions
function checkAdminAccess() {
    // Simulate admin access check
    const userRole = localStorage.getItem('user_role');
    return userRole === 'admin' || userRole === 'moderator';
}

window.logout = function() {
    if (confirm('Вы уверены, что хотите выйти?')) {
        localStorage.removeItem('user_token');
        localStorage.removeItem('user_role');
        window.location.href = 'index.html';
    }
};

// API Simulation Functions (replace with real API calls)
async function fetchServerMetrics() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                cpu: { percentage: 45 + Math.random() * 10, display: '45%' },
                ram: { percentage: 68 + Math.random() * 5, display: '6.8/10 GB' },
                tps: { percentage: 95 + Math.random() * 5, display: '19.2' },
                onlinePlayers: { current: 127 + Math.floor(Math.random() * 10), change: '+5 за час', trend: 'positive' },
                totalPlayers: { current: 1247, change: '+23 за неделю', trend: 'positive' },
                donations: { current: 45230, change: '+12%', trend: 'positive' },
                forumPosts: { current: 8532, change: '+156 за день', trend: 'positive' }
            });
        }, 1000);
    });
}

async function fetchRecentActivity() {
    return new Promise((resolve) => {
        setTimeout(() => {
            const activities = [
                {
                    user: 'NewPlayer',
                    action: 'зарегистрировался на сервере',
                    time: '5 минут назад',
                    avatar: 'images/avatars/user1.png'
                },
                {
                    user: 'BuilderPro',
                    action: 'купил VIP статус',
                    time: '15 минут назад',
                    avatar: 'images/avatars/user2.png'
                },
                {
                    user: 'CraftMaster',
                    action: 'создал тему на форуме',
                    time: '30 минут назад',
                    avatar: 'images/avatars/user3.png'
                }
            ];
            resolve(activities);
        }, 500);
    });
}

async function fetchUsers(options = {}) {
    return new Promise((resolve) => {
        setTimeout(() => {
            let users = [
                {
                    id: '1',
                    username: 'CraftMaster',
                    minecraftNick: 'craftmaster_pro',
                    email: 'craftmaster@example.com',
                    status: 'vip',
                    statusLabel: 'VIP',
                    registrationDate: '15.01.2024',
                    lastSeen: 'Сейчас онлайн',
                    avatar: 'images/avatars/user1.png'
                },
                {
                    id: '2',
                    username: 'BuilderPro',
                    minecraftNick: 'builder_pro_2024',
                    email: 'builder@example.com',
                    status: 'premium',
                    statusLabel: 'Premium',
                    registrationDate: '10.01.2024',
                    lastSeen: '2 часа назад',
                    avatar: 'images/avatars/user2.png'
                },
                {
                    id: '3',
                    username: 'NewPlayer',
                    minecraftNick: 'newplayer123',
                    email: 'newplayer@example.com',
                    status: 'banned',
                    statusLabel: 'Заблокирован',
                    registrationDate: '08.01.2024',
                    lastSeen: '1 день назад',
                    avatar: 'images/avatars/user3.png'
                }
            ];
            
            // Apply filters
            if (options.filter && options.filter !== 'all') {
                users = users.filter(user => {
                    switch (options.filter) {
                        case 'online':
                            return user.lastSeen.includes('онлайн');
                        case 'vip':
                            return user.status === 'vip' || user.status === 'premium';
                        case 'banned':
                            return user.status === 'banned';
                        default:
                            return true;
                    }
                });
            }
            
            // Apply search
            if (options.search) {
                const query = options.search.toLowerCase();
                users = users.filter(user => 
                    user.username.toLowerCase().includes(query) ||
                    user.email.toLowerCase().includes(query) ||
                    user.minecraftNick.toLowerCase().includes(query)
                );
            }
            
            resolve(users);
        }, 1000);
    });
}

// Initialize admin access simulation
document.addEventListener('DOMContentLoaded', function() {
    // Simulate admin login for demo
    if (!localStorage.getItem('user_role')) {
        localStorage.setItem('user_role', 'admin');
        localStorage.setItem('user_token', 'admin_token_123');
    }
});

console.log('Admin panel JavaScript loaded successfully!');