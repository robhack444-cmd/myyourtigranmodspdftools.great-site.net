// script.js - Общие функции для сайта

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initAnimations();
    initFormSubmissions();
    initCopyButtons();
    updateLiveStats();
    checkDarkMode();
});

// Анимации при скролле
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-visible');
            }
        });
    }, observerOptions);
    
    // Наблюдаем за элементами с классами анимации
    document.querySelectorAll('.fade-in, .slide-up').forEach(el => {
        observer.observe(el);
    });
}

// Обработка форм
function initFormSubmissions() {
    const forms = document.querySelectorAll('form[data-submit]');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Показываем загрузку
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            submitBtn.disabled = true;
            
            // Имитация отправки (в реальном сайте здесь будет fetch)
            setTimeout(() => {
                // Показываем успешное сообщение
                const successDiv = document.createElement('div');
                successDiv.className = 'alert alert-success';
                successDiv.innerHTML = '<i class="fas fa-check-circle"></i> Form submitted successfully!';
                
                form.appendChild(successDiv);
                
                // Восстанавливаем кнопку
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Очищаем форму
                form.reset();
                
                // Удаляем сообщение через 5 секунд
                setTimeout(() => {
                    successDiv.remove();
                }, 5000);
            }, 1500);
        });
    });
}

// Кнопки копирования
function initCopyButtons() {
    document.querySelectorAll('[data-copy]').forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-copy');
            const target = document.getElementById(targetId);
            
            if (target) {
                const text = target.textContent || target.value;
                
                navigator.clipboard.writeText(text).then(() => {
                    const originalHTML = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    this.classList.add('copied');
                    
                    setTimeout(() => {
                        this.innerHTML = originalHTML;
                        this.classList.remove('copied');
                    }, 2000);
                });
            }
        });
    });
}

// Обновление статистики
function updateLiveStats() {
    const stats = document.querySelectorAll('[data-stat]');
    
    if (stats.length > 0) {
        setInterval(() => {
            stats.forEach(stat => {
                const current = parseInt(stat.textContent.replace(/,/g, ''));
                const change = Math.floor(Math.random() * 10) - 2; // -2 to +7
                const newValue = Math.max(100, current + change);
                
                stat.textContent = newValue.toLocaleString();
            });
        }, 30000);
    }
}

// Проверка темной темы
function checkDarkMode() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
}

// Генерация случайного ключа
function generateKey(format = 'XXXX-XXXX-XXXX-XXXX') {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let key = '';
    
    for (let i = 0; i < format.length; i++) {
        if (format[i] === 'X') {
            key += chars.charAt(Math.floor(Math.random() * chars.length));
        } else {
            key += format[i];
        }
    }
    
    return key;
}

// Загрузка файла
function downloadFile(filename, content, type = 'text/plain') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Проверка онлайн статуса
function checkOnlineStatus() {
    if (!navigator.onLine) {
        showOfflineNotification();
    }
}

function showOfflineNotification() {
    const notification = document.createElement('div');
    notification.className = 'alert alert-warning';
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.innerHTML = '<i class="fas fa-wifi-slash"></i> You are offline. Some features may not work.';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Инициализация проверки онлайн статуса
window.addEventListener('online', () => {
    console.log('Back online');
});

window.addEventListener('offline', () => {
    console.log('Went offline');
    showOfflineNotification();
});

// Установка темы
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

// Загрузка темы из localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    setTheme(savedTheme);
}

// Добавление CSS для темы
const themeStyles = `
    [data-theme="light"] {
        --dark: #f0f0f0;
        --darker: #e0e0e0;
        --card-bg: rgba(255, 255, 255, 0.9);
        color: #333;
    }
`;

const styleSheet = document.createElement("style");
styleSheet.textContent = themeStyles;
document.head.appendChild(styleSheet);
