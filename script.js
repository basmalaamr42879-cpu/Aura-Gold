// تبديل الثيم وحفظ حالة المستخدم
function toggleTheme() {
    const body = document.body;
    const icon = document.getElementById('theme-icon');
    
    if (body.classList.contains('light-theme')) {
        body.classList.remove('light-theme');
        icon.className = 'fa-solid fa-sun';
        localStorage.setItem('site-theme', 'dark');
    } else {
        body.classList.add('light-theme');
        icon.className = 'fa-solid fa-moon';
        localStorage.setItem('site-theme', 'light');
    }
}

// مزامنة الثيم وحالة تسجيل الدخول فور تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('site-theme') === 'light') {
        document.body.classList.add('light-theme');
        document.getElementById('theme-icon').className = 'fa-solid fa-moon';
    }

    // التحقق من وجود جلسة تسجيل دخول نشطة
    const savedUser = localStorage.getItem('logged-username');
    if (savedUser) {
        applyLoginUI(savedUser);
    }
});

// التحكم في المودال (النافذة المنبثقة)
function openModal() {
    document.getElementById('auth-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('auth-modal').classList.add('hidden');
}

// معالجة تسجيل الدخول وعرض البيانات
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username-field').value;
    localStorage.setItem('logged-username', username);
    applyLoginUI(username);
    closeModal();
}

function applyLoginUI(username) {
    document.getElementById('auth-nav-btn').innerText = 'خروج';
    document.getElementById('auth-nav-btn').setAttribute('onclick', 'handleLogout()');
    
    document.getElementById('widget-username').innerText = username;
    document.getElementById('user-widget').classList.remove('hidden');
}

function handleLogout() {
    localStorage.removeItem('logged-username');
    document.getElementById('auth-nav-btn').innerText = 'تسجيل الدخول';
    document.getElementById('auth-nav-btn').setAttribute('onclick', 'openModal()');
    document.getElementById('user-widget').classList.add('hidden');
    document.getElementById('username-field').value = '';
}

// ميزة المشاركة الذكية عبر الهواتف والكمبيوتر
function shareSite() {
    if (navigator.share) {
        navigator.share({
            title: 'إيجبت غولد لأسعار الذهب',
            text: 'تابع أسعار عيارات الذهب في مصر والوطن العربي مباشرة مقابل الدولار',
            url: window.location.href
        }).catch(() => {});
    } else {
        // بديل في حال كان المتصفح لا يدعم الخاصية تلقائياً
        const dummy = document.createElement('input');
        document.body.appendChild(dummy);
        dummy.value = window.location.href;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
        alert('تم نسخ رابط الصفحة الحالية بنجاح، يمكنك مشاركته الآن!');
    }
}
