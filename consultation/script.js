// ============================================
// AUTO DARK MODE & TOGGLE LOGIC
// ============================================
const themeToggleBtn = document.getElementById('themeToggle');

// Helper to determine if current local time is between 6 PM (18) and 9 AM (9)
function isNightTime() {
  const currentHour = new Date().getHours();
  return currentHour >= 18 || currentHour < 9;
}

// Function to apply the theme
function initTheme() {
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else if (savedTheme === 'light') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    // If user hasn't explicitly set a preference, use time-based logic (6 PM to 9 AM)
    if (isNightTime()) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }
}

// Initialize theme on page load
initTheme();

// Manual toggle listener
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  });
}

// ============================================
// NEWSLETTER & APPS SCRIPT INTEGRATION
// ============================================
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxhc3psXzu4QZI4b975I31HGEMbbCgnB_3vZ0W_AHB2AKTPdSKt_jX3xpLZ-JviZD3D/exec';

const newsletterForm = document.getElementById('newsletterForm');
const toastPopup = document.getElementById('toastPopup');

// Toast Notification Handler (3-second duration)
function showToast() {
  if (!toastPopup) return;
  
  // Reset active classes to re-trigger animation cleanly
  toastPopup.classList.remove('show');
  void toastPopup.offsetWidth; // Force CSS reflow
  
  toastPopup.classList.add('show');
  
  // Automatically slide back down after 3 seconds
  setTimeout(() => {
    toastPopup.classList.remove('show');
  }, 3000);
}

// Form Submission Event
if (newsletterForm) {
  newsletterForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const emailInput = this.querySelector('.newsletter-input');
    const submitBtn = this.querySelector('.btn-submit');
    const email = emailInput.value;

    // UI Loading state
    submitBtn.disabled = true;
    submitBtn.innerText = 'جاري الإرسال...';

    // Build URL parameter payload for Google Apps Script e.parameter
    const formData = new URLSearchParams();
    formData.append('email', email);

    fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    })
    .then(() => {
      showToast();
      this.reset();
    })
    .catch((error) => {
      console.error('Submission Error:', error);
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.innerText = 'اشترك ←';
    });
  });
}