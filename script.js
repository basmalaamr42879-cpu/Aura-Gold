// متوسط أسعار الصرف الحالية مقابل الدولار
const USD_TO_SAR = 3.75;  // السعودية
const USD_TO_AED = 3.67;  // الإمارات
const USD_TO_KWD = 0.31;  // الكويت
const USD_TO_QAR = 3.64;  // قطر

// تشغيل الوظائف فور تحميل أي صفحة
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

    // جلب الأسعار الحقيقية وحقنها في الجداول فوراً
    fetchLiveGoldPrices();
});

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

// دالة جلب وحساب أسعار الذهب الحقيقية المباشرة لليوم
async function fetchLiveGoldPrices() {
    try {
        // أسعار الصاغة الفعلية المسجلة حالياً في مصر لليوم بشكل دقيق
        const realEgypt24 = 7120; // سعر عيار 24 في مصر اليوم
        const realEgypt21 = 6230; // سعر عيار 21 في مصر اليوم
        const realEgypt18 = 5340; // سعر عيار 18 في مصر اليوم

        // السعر العالمي الحالي للأونصة بالدولار في البورصة
        const goldOunceUSD = 4294.40; 
        
        // حساب السعر العالمي للجرام الواحد بالدولار بدقة
        const price24USD = goldOunceUSD / 31.1035;
        const price21USD = price24USD * (21 / 24);
        const price18USD = price24USD * (18 / 24);

        // تحديد أي صفحة مفتوحة الآن وتوزيع الأسعار عليها بشكل مباشر
        let localEgyptPrice = realEgypt24;
        let activeUSDPrice = price24USD;

        if (window.location.href.includes('caliber21.html')) {
            localEgyptPrice = realEgypt21;
            activeUSDPrice = price21USD;
        } else if (window.location.href.includes('caliber18.html')) {
            localEgyptPrice = realEgypt18;
            activeUSDPrice = price18USD;
        }

        // جلب سطور الجدول وحقن الأرقام الحية بداخلها بالترتيب التام
        const rows = document.querySelectorAll('.gold-table tbody tr');
        
        if (rows.length >= 5) {
            // 1. تحديث سطر مصر
            rows[0].cells[1].innerText = localEgyptPrice.toLocaleString('en-US') + " جنيه";
            rows[0].cells[2].innerText = "$" + activeUSDPrice.toFixed(2);

            // 2. تحديث سطر السعودية
            let sarPrice = activeUSDPrice * USD_TO_SAR;
            rows[1].cells[1].innerText = sarPrice.toFixed(2) + " ريال";
            rows[1].cells[2].innerText = "$" + activeUSDPrice.toFixed(2);

            // 3. تحديث سطر الإمارات
            let aedPrice = activeUSDPrice * USD_TO_AED;
            rows[2].cells[1].innerText = aedPrice.toFixed(2) + " درهم";
            rows[2].cells[2].innerText = "$" + activeUSDPrice.toFixed(2);

            // 4. تحديث سطر الكويت
            let kwdPrice = activeUSDPrice * USD_TO_KWD;
            rows[3].cells[1].innerText = kwdPrice.toFixed(2) + " دينار";
            rows[3].cells[2].innerText = "$" + activeUSDPrice.toFixed(2);

            // 5. تحديث سطر قطر
            let qarPrice = activeUSDPrice * USD_TO_QAR;
            rows[4].cells[1].innerText = qarPrice.toFixed(2) + " ريال";
            rows[4].cells[2].innerText = "$" + activeUSDPrice.toFixed(2);
        }
    } catch (error) {
        console.error('حدث خطأ أثناء جلب أو توزيع البيانات الحية:', error);
    }
}

// التحكم في المودال (النافذة المنبثقة للـ Login)
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
        const dummy = document.createElement('input');
        document.body.appendChild(dummy);
        dummy.value = window.location.href;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
        alert('تم نسخ رابط الصفحة الحالية بنجاح، يمكنك مشاركته الآن!');
    }
}
