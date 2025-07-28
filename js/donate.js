// Donate Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    let selectedItem = null;
    let selectedPrice = 0;
    let discountAmount = 0;
    
    // Promo codes database (in real app, this would be server-side)
    const promoCodes = {
        'NEWBIE10': { discount: 10, type: 'percentage' },
        'SAVE20': { discount: 20, type: 'percentage' },
        'WINTER50': { discount: 50, type: 'fixed' },
        'VIP15': { discount: 15, type: 'percentage' }
    };

    // Plan benefits data
    const planBenefits = {
        'vip': [
            'Цветной ник в чате',
            'Доступ к VIP зонам',
            '5 дополнительных точек дома',
            'Приоритет входа на сервер',
            'Команда /fly в лобби',
            'Уникальные эмоции',
            'Скидка 10% в магазине'
        ],
        'premium': [
            'Все возможности VIP',
            'Золотой ник в чате',
            '10 дополнительных точек дома',
            'Команда /fly везде',
            'Доступ к Premium зонам',
            'Уникальные питомцы',
            'Скидка 20% в магазине',
            'Приватные сообщения'
        ],
        'elite': [
            'Все возможности Premium',
            'Радужный ник в чате',
            '20 дополнительных точек дома',
            'Команды модерации',
            'Доступ к Elite зонам',
            'Эксклюзивные скины',
            'Скидка 30% в магазине',
            'Персональная поддержка'
        ]
    };

    const itemBenefits = {
        'coins_1000': ['1,000 игровых монет', 'Мгновенное зачисление'],
        'coins_5000': ['5,000 игровых монет', 'Мгновенное зачисление', 'Бонус +500 монет'],
        'coins_10000': ['10,000 игровых монет', 'Мгновенное зачисление', 'Бонус +1000 монет'],
        'slots_9': ['+9 слотов в инвентаре', 'Постоянное улучшение'],
        'slots_18': ['+18 слотов в инвентаре', 'Постоянное улучшение'],
        'slots_27': ['+27 слотов в инвентаре', 'Постоянное улучшение'],
        'homes_5': ['+5 точек дома', 'Быстрое перемещение'],
        'homes_10': ['+10 точек дома', 'Быстрое перемещение'],
        'homes_20': ['+20 точек дома', 'Быстрое перемещение'],
        'protect_1000': ['1,000 блоков защиты', 'Защита от гриферов'],
        'protect_5000': ['5,000 блоков защиты', 'Защита от гриферов'],
        'protect_10000': ['10,000 блоков защиты', 'Защита от гриферов']
    };

    // Global functions for plan and item selection
    window.selectPlan = function(planType, price) {
        // Remove previous selections
        document.querySelectorAll('.plan-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelectorAll('.item-option').forEach(option => {
            option.classList.remove('selected');
        });

        // Select current plan
        event.target.closest('.plan-card').classList.add('selected');
        
        selectedItem = planType;
        selectedPrice = price;
        
        updateOrderSummary();
        showPaymentSection();
        
        // Smooth scroll to payment section
        document.getElementById('payment-section').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    window.selectItem = function(itemType, price) {
        // Remove previous selections
        document.querySelectorAll('.plan-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelectorAll('.item-option').forEach(option => {
            option.classList.remove('selected');
        });

        // Select current item
        event.target.classList.add('selected');
        
        selectedItem = itemType;
        selectedPrice = price;
        
        updateOrderSummary();
        showPaymentSection();
        
        // Smooth scroll to payment section
        document.getElementById('payment-section').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    function updateOrderSummary() {
        const itemNameElement = document.querySelector('#selected-item .item-name');
        const itemPriceElement = document.querySelector('#selected-item .item-price');
        const finalTotalElement = document.getElementById('final-total');
        const totalPriceElement = document.getElementById('total-price');
        const benefitsList = document.getElementById('benefits-list');

        // Update item name and price
        let itemName = '';
        if (selectedItem) {
            if (selectedItem.startsWith('coins_')) {
                const amount = selectedItem.split('_')[1];
                itemName = `${amount} игровых монет`;
            } else if (selectedItem.startsWith('slots_')) {
                const amount = selectedItem.split('_')[1];
                itemName = `+${amount} слотов инвентаря`;
            } else if (selectedItem.startsWith('homes_')) {
                const amount = selectedItem.split('_')[1];
                itemName = `+${amount} точек дома`;
            } else if (selectedItem.startsWith('protect_')) {
                const amount = selectedItem.split('_')[1];
                itemName = `${amount} блоков защиты`;
            } else {
                itemName = selectedItem.charAt(0).toUpperCase() + selectedItem.slice(1) + ' привилегия';
            }
        }

        itemNameElement.textContent = itemName || 'Выберите товар';
        itemPriceElement.textContent = selectedPrice ? `₽${selectedPrice}` : '₽0';

        // Calculate final price with discount
        const finalPrice = Math.max(0, selectedPrice - discountAmount);
        finalTotalElement.textContent = `₽${finalPrice}`;
        totalPriceElement.textContent = `₽${finalPrice}`;

        // Update benefits list
        benefitsList.innerHTML = '';
        if (selectedItem) {
            const benefits = planBenefits[selectedItem] || itemBenefits[selectedItem] || [];
            if (benefits.length > 0) {
                benefits.forEach(benefit => {
                    const li = document.createElement('li');
                    li.textContent = `✅ ${benefit}`;
                    benefitsList.appendChild(li);
                });
            } else {
                const li = document.createElement('li');
                li.textContent = 'Информация о преимуществах будет добавлена';
                benefitsList.appendChild(li);
            }
        } else {
            const li = document.createElement('li');
            li.textContent = 'Выберите привилегию для просмотра преимуществ';
            benefitsList.appendChild(li);
        }
    }

    function showPaymentSection() {
        const paymentSection = document.getElementById('payment-section');
        paymentSection.style.display = 'block';
        
        // Add fade-in animation
        setTimeout(() => {
            paymentSection.classList.add('fade-in', 'visible');
        }, 100);
    }

    // Promo code functionality
    window.applyPromoCode = function() {
        const promoInput = document.getElementById('promo-code');
        const promoCode = promoInput.value.trim().toUpperCase();
        const discountInfo = document.getElementById('discount-info');
        const discountAmount = document.querySelector('#discount-info .discount-amount');

        if (!promoCode) {
            showNotification('Введите промокод', 'error');
            return;
        }

        if (!selectedItem || selectedPrice === 0) {
            showNotification('Сначала выберите товар', 'error');
            return;
        }

        if (promoCodes[promoCode]) {
            const promo = promoCodes[promoCode];
            
            if (promo.type === 'percentage') {
                window.discountAmount = Math.floor(selectedPrice * promo.discount / 100);
            } else {
                window.discountAmount = Math.min(promo.discount, selectedPrice);
            }

            discountAmount.textContent = `-₽${window.discountAmount}`;
            discountInfo.style.display = 'flex';
            
            updateOrderSummary();
            showNotification(`Промокод применен! Скидка ₽${window.discountAmount}`, 'success');
            
            // Disable the input and button
            promoInput.disabled = true;
            event.target.disabled = true;
            event.target.textContent = 'Применен';
            event.target.classList.remove('btn-secondary');
            event.target.classList.add('btn-primary');
        } else {
            showNotification('Неверный промокод', 'error');
        }
    };

    // Form submission
    const donationForm = document.getElementById('donation-form');
    if (donationForm) {
        donationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!selectedItem || selectedPrice === 0) {
                showNotification('Выберите товар для покупки', 'error');
                return;
            }

            if (!validateForm(this)) {
                return;
            }

            const formData = new FormData(this);
            const minecraftNick = formData.get('minecraft-nick');
            const email = formData.get('email');
            const paymentMethod = formData.get('payment-method');
            const promoCode = formData.get('promo-code');

            // Simulate payment processing
            const submitButton = this.querySelector('button[type="submit"]');
            setButtonLoading(submitButton, true);

            // Simulate API call
            setTimeout(() => {
                setButtonLoading(submitButton, false);
                
                // In real application, this would redirect to payment gateway
                showPaymentModal({
                    item: selectedItem,
                    price: selectedPrice - (window.discountAmount || 0),
                    nick: minecraftNick,
                    email: email,
                    paymentMethod: paymentMethod,
                    promoCode: promoCode
                });
            }, 2000);
        });
    }

    function showPaymentModal(orderData) {
        const modal = document.createElement('div');
        modal.className = 'payment-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="closePaymentModal()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Подтверждение покупки</h3>
                    <button class="modal-close" onclick="closePaymentModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="order-summary-modal">
                        <p><strong>Товар:</strong> ${getItemDisplayName(orderData.item)}</p>
                        <p><strong>Цена:</strong> ₽${orderData.price}</p>
                        <p><strong>Ник:</strong> ${orderData.nick}</p>
                        <p><strong>Email:</strong> ${orderData.email}</p>
                        <p><strong>Способ оплаты:</strong> ${getPaymentMethodName(orderData.paymentMethod)}</p>
                        ${orderData.promoCode ? `<p><strong>Промокод:</strong> ${orderData.promoCode}</p>` : ''}
                    </div>
                    <div class="payment-info">
                        <p>После нажатия кнопки "Оплатить" вы будете перенаправлены на страницу оплаты.</p>
                        <p>Привилегии будут выданы автоматически в течение 5-10 минут после успешной оплаты.</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closePaymentModal()">Отмена</button>
                    <button class="btn btn-primary" onclick="processPayment()">Оплатить ₽${orderData.price}</button>
                </div>
            </div>
        `;

        // Add modal styles
        const modalStyles = document.createElement('style');
        modalStyles.textContent = `
            .payment-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease;
            }
            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.7);
                backdrop-filter: blur(5px);
            }
            .modal-content {
                background: white;
                border-radius: 10px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                position: relative;
                z-index: 1;
                animation: slideUp 0.3s ease;
            }
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem;
                border-bottom: 1px solid #e0e0e0;
            }
            .modal-header h3 {
                margin: 0;
                color: var(--dark-color);
            }
            .modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: var(--text-light);
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background 0.3s ease;
            }
            .modal-close:hover {
                background: #f0f0f0;
            }
            .modal-body {
                padding: 1.5rem;
            }
            .order-summary-modal p {
                margin: 0.5rem 0;
                color: var(--text-color);
            }
            .payment-info {
                margin-top: 1.5rem;
                padding: 1rem;
                background: var(--light-color);
                border-radius: 5px;
                border-left: 4px solid var(--primary-color);
            }
            .payment-info p {
                margin: 0.5rem 0;
                color: var(--text-light);
                font-size: 0.9rem;
            }
            .modal-footer {
                display: flex;
                justify-content: flex-end;
                gap: 1rem;
                padding: 1.5rem;
                border-top: 1px solid #e0e0e0;
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideUp {
                from { transform: translateY(50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(modalStyles);
        document.body.appendChild(modal);
        
        // Store order data for payment processing
        window.currentOrder = orderData;
    }

    window.closePaymentModal = function() {
        const modal = document.querySelector('.payment-modal');
        if (modal) {
            modal.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    };

    window.processPayment = function() {
        // In real application, this would integrate with payment gateway
        showNotification('Перенаправление на страницу оплаты...', 'info');
        
        setTimeout(() => {
            closePaymentModal();
            showNotification('Платеж обрабатывается. Вы получите уведомление на email.', 'success');
            
            // Reset form
            document.getElementById('donation-form').reset();
            document.getElementById('payment-section').style.display = 'none';
            selectedItem = null;
            selectedPrice = 0;
            window.discountAmount = 0;
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 2000);
    };

    function getItemDisplayName(item) {
        if (item.startsWith('coins_')) {
            const amount = item.split('_')[1];
            return `${amount} игровых монет`;
        } else if (item.startsWith('slots_')) {
            const amount = item.split('_')[1];
            return `+${amount} слотов инвентаря`;
        } else if (item.startsWith('homes_')) {
            const amount = item.split('_')[1];
            return `+${amount} точек дома`;
        } else if (item.startsWith('protect_')) {
            const amount = item.split('_')[1];
            return `${amount} блоков защиты`;
        } else {
            return item.charAt(0).toUpperCase() + item.slice(1) + ' привилегия';
        }
    }

    function getPaymentMethodName(method) {
        const methods = {
            'card': 'Банковская карта',
            'qiwi': 'QIWI',
            'yandex': 'ЮMoney',
            'webmoney': 'WebMoney'
        };
        return methods[method] || method;
    }

    // Animation on scroll
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
    document.querySelectorAll('.plan-card, .item-card, .faq-item').forEach(element => {
        element.classList.add('fade-in');
        observer.observe(element);
    });

    // Initialize tooltips for plan features
    document.querySelectorAll('.plan-features li').forEach(item => {
        item.addEventListener('mouseenter', function() {
            // Could add tooltips with more detailed descriptions
        });
    });

    console.log('Donate page initialized successfully!');
});

// Add fadeOut animation
const fadeOutStyle = document.createElement('style');
fadeOutStyle.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(fadeOutStyle);