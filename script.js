 const themeToggleBtn = document.getElementById('themeToggle');
      const htmlEl = document.documentElement;  /* the <html> tag */

      /* Labels shown on the button for each theme */
      const ICONS = { light: '🌙', dark: '☀️' };

      /* On page load: restore saved theme preference */
      const savedTheme = localStorage.getItem('veloterra-theme') || 'light';
      applyTheme(savedTheme);

      /* Button click: flip between light and dark */
      themeToggleBtn.addEventListener('click', () => {
        const current = htmlEl.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        applyTheme(next);
        localStorage.setItem('veloterra-theme', next);   /* remember choice */
      });

      function applyTheme(theme) {
        htmlEl.setAttribute('data-theme', theme);
        themeToggleBtn.textContent = ICONS[theme];
      }


      /* ================================================================
         2. HERO CAROUSEL
      ================================================================ */
      const slides = document.querySelectorAll('.slide');
      const dots = document.querySelectorAll('.dot');
      const prevBtn = document.getElementById('prevSlide');
      const nextBtn = document.getElementById('nextSlide');

      let currentSlide = 0;
      let autoplayTimer = null;

      /* Go to a specific slide index */
      function goToSlide(index) {
        /* Wrap around: after last go to first, before first go to last */
        const total = slides.length;
        currentSlide = ((index % total) + total) % total;

        /* Toggle active class on slides and dots */
        slides.forEach((s, i) => s.classList.toggle('active', i === currentSlide));
        dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
      }

      /* Auto-advance every 4 seconds */
      function startAutoplay() {
        stopAutoplay();
        autoplayTimer = setInterval(() => goToSlide(currentSlide + 1), 4000);
      }
      function stopAutoplay() {
        if (autoplayTimer) clearInterval(autoplayTimer);
      }

      prevBtn.addEventListener('click', () => { stopAutoplay(); goToSlide(currentSlide - 1); startAutoplay(); });
      nextBtn.addEventListener('click', () => { stopAutoplay(); goToSlide(currentSlide + 1); startAutoplay(); });
      dots.forEach(dot => {
        dot.addEventListener('click', () => {
          stopAutoplay();
          goToSlide(Number(dot.dataset.index));
          startAutoplay();
        });
      });

      startAutoplay();


      /* ================================================================
         3. STAR RATING
      ================================================================ */
      const stars = document.querySelectorAll('.star');
      const starHint = document.getElementById('starHint');
      let selectedRating = 0;

      const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'];

      /* Hover: highlight up to hovered star */
      stars.forEach(star => {
        star.addEventListener('mouseenter', () => {
          const val = Number(star.dataset.value);
          stars.forEach(s => s.classList.toggle('hover', Number(s.dataset.value) <= val));
          starHint.textContent = ratingLabels[val];
        });

        star.addEventListener('mouseleave', () => {
          stars.forEach(s => s.classList.remove('hover'));
          /* Restore selected state hint */
          starHint.textContent = selectedRating
            ? ratingLabels[selectedRating]
            : 'Tap to rate your experience';
        });

        /* Click: lock in the rating */
        star.addEventListener('click', () => {
          selectedRating = Number(star.dataset.value);
          stars.forEach(s => {
            const active = Number(s.dataset.value) <= selectedRating;
            s.classList.toggle('active', active);
          });
          starHint.textContent = ratingLabels[selectedRating];
        });
      });


      /* ================================================================
         4. FEEDBACK FORM SUBMIT
      ================================================================ */
      document.getElementById('submitFeedback').addEventListener('click', () => {
        const text = document.getElementById('feedbackText').value.trim();
        const rating = selectedRating;

        if (!rating) {
          alert('Please select a star rating before submitting.');
          return;
        }
        if (!text) {
          alert('Please write some feedback before submitting.');
          return;
        }

        /*
          Here you'd send to your backend:
          fetch('/api/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rating, text })
          })
        */

        /* Demo success response */
        alert(`Thank you! You rated us ${rating}/5 ⭐\nFeedback: "${text}"`);

        /* Reset form */
        document.getElementById('feedbackText').value = '';
        selectedRating = 0;
        stars.forEach(s => s.classList.remove('active', 'hover'));
        starHint.textContent = 'Tap to rate your experience';
      });


      /* ================================================================
         5. BOTTOM NAV active state
      ================================================================ */
      document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
          document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
          item.classList.add('active');
        });
      });