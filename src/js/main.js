/**
 * Local Agenda - Client-side JavaScript
 * Handles interactivity for the 11ty site
 */

// Mobile menu toggle (if not using Alpine.js)
// Note: We're using Alpine.js in the header, so this is a fallback

// Newsletter form submission (native mode)
document.addEventListener('DOMContentLoaded', () => {
  // Handle all newsletter forms on the page
  const newsletterForms = document.querySelectorAll('.newsletter-form');

  newsletterForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const emailInput = form.querySelector('input[type="email"]');
      const submitButton = form.querySelector('button[type="submit"]');
      const messageDiv = form.parentElement.querySelector('.newsletter-message');

      if (!emailInput || !submitButton) return;

      const email = emailInput.value;
      const publicationId = form.dataset.publicationId;
      const apiKey = form.dataset.apiKey;

      // Disable form
      submitButton.disabled = true;
      submitButton.textContent = 'Subscribing...';

      try {
        const response = await fetch('/.netlify/functions/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            publicationId,
            apiKey,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Subscription failed');
        }

        // Success
        form.style.display = 'none';
        if (messageDiv) {
          messageDiv.classList.remove('hidden');
          messageDiv.className = 'newsletter-message mt-3 flex items-center gap-2 rounded-lg bg-primary/10 p-4 text-primary';
          messageDiv.innerHTML = `
            <svg class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p class="font-semibold">You're subscribed!</p>
              <p class="text-sm opacity-80">Check your inbox for a welcome email.</p>
            </div>
          `;
        }

        // Clear form
        emailInput.value = '';
      } catch (error) {
        // Error
        if (messageDiv) {
          messageDiv.classList.remove('hidden');
          messageDiv.className = 'newsletter-message mt-3 flex items-center gap-2 text-sm text-destructive';
          messageDiv.innerHTML = `
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>${error.message || 'An error occurred'}</span>
          `;
        }
      } finally {
        // Re-enable form
        submitButton.disabled = false;
        submitButton.textContent = 'Subscribe';
      }
    });
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Note: Beehiiv embed script is now loaded once in base layout
  // No need for client-side script execution - everything is static at build time
});

// Log that JS loaded successfully
console.log('[Local Agenda] Client-side JavaScript loaded');
