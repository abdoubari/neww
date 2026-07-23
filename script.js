document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. THEME TOGGLE LOGIC
  // ==========================================
  const themeToggleBtn = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme) {
    if (savedTheme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  } else {
    // Default time check: 9 AM to 6 PM = Light Theme
    const currentHour = new Date().getHours();
    if (currentHour >= 9 && currentHour < 18) {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      const isLight = document.body.classList.contains('light-theme');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
  }

  // ==========================================
  // 2. POPUP MODAL LOGIC
  // ==========================================
  const modal = document.getElementById('leadModal');
  const form = document.getElementById('leadForm');
  const scriptURL = 'https://script.google.com/macros/s/AKfycbwOY0x3vOCKvI4uIRlc1VsYGq-sN5t90U1p_7jOiELewGNeesXOqEfnFbJcZBrnFJk-QQ/exec'; 

  // Make openModal and closeModal globally accessible for inline onclick handlers
  window.openModal = function() {
    if (modal) modal.classList.add('active');
  };

  window.closeModal = function() {
    if (modal) modal.classList.remove('active');
  };

  // Close modal when clicking outside the card
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) window.closeModal();
    });
  }

  // Handle Form Submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerText = 'جاري التحويل...';

      const searchParams = new URLSearchParams(new FormData(form));

      fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors',
        body: searchParams
      })
      .then(() => {
        window.location.href = 'https://www.bariabder.com/explainer';
      })
      .catch(error => {
        console.error('Error submitting form:', error);
        alert('حدث خطأ أثناء إرسال البيانات، يرجى إعادة المحاولة.');
        submitBtn.disabled = false;
        submitBtn.innerText = 'شاهد الفيديو الآن';
      });
    });
  }
});