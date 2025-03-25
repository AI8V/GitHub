/**
 * Article Enhancements - Lightweight JavaScript for improving Bootstrap-based educational articles
 * Features: Smooth scrolling, Back-to-top button, Image lightbox, Animations
 * Compatible with Bootstrap 5
 */

(function() {
  'use strict';

  // Wait for DOM to be fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    const mainElement = document.querySelector('main');

    if (!mainElement) return;

    // Initialize all components
    initSmoothScrolling();
    initBackToTopButton();
    initImageLightbox();
    initAnimations();
    ensureAccordionAccessibility();

    /**
     * Initialize smooth scrolling for table of contents links
     */
    function initSmoothScrolling() {
      // Get all links that point to an ID within the main element
      const links = mainElement.querySelectorAll('a[href^="#"]');

      links.forEach(link => {
        link.addEventListener('click', function(e) {
          // Get the target element
          const targetId = this.getAttribute('href');
          if (targetId === '#') return; // Skip empty links

          const targetElement = document.querySelector(targetId);
          if (!targetElement) return;

          e.preventDefault();

          // Calculate offset (accounting for fixed headers if present)
          const offset = 20; // Adjust if you have fixed headers

          // Scroll smoothly to the target
          window.scrollTo({
            top: targetElement.offsetTop - offset,
            behavior: 'smooth'
          });

          // Update URL without causing a jump (for bookmarking)
          history.pushState(null, null, targetId);

          // Set focus to the target for better accessibility
          targetElement.setAttribute('tabindex', '-1');
          targetElement.focus({ preventScroll: true });
        });
      });
    }

    /**
     * Initialize back-to-top button
     */
    function initBackToTopButton() {
      // Create the button element
      const backToTopBtn = document.createElement('button');
      backToTopBtn.innerHTML = '<i class="bi bi-arrow-up"></i>';
      backToTopBtn.className = 'back-to-top btn btn-primary rounded-circle';
      backToTopBtn.setAttribute('aria-label', 'العودة إلى أعلى الصفحة');
      backToTopBtn.setAttribute('title', 'العودة إلى أعلى الصفحة');

      // Add button styles via JavaScript to avoid requiring a separate CSS file
      backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 25px;
        right: 25px;
        width: 45px;
        height: 45px;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s, visibility 0.3s;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      `;

      // Append button to main
      mainElement.appendChild(backToTopBtn);

      // Show/hide button based on scroll position
      window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
          backToTopBtn.style.opacity = '1';
          backToTopBtn.style.visibility = 'visible';
        } else {
          backToTopBtn.style.opacity = '0';
          backToTopBtn.style.visibility = 'hidden';
        }
      });

      // Scroll to top when clicked
      backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }

    /**
     * Initialize lightbox for images
     */
    function initImageLightbox() {
      // Get all images inside figures within main
      const images = mainElement.querySelectorAll('figure img.img-fluid');

      // Early return if no images found
      if (images.length === 0) return;

      // Create modal elements if images are present
      const modalHtml = `
        <div class="modal fade" id="imageLightbox" tabindex="-1" aria-labelledby="imageLightboxLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="imageLightboxLabel"></h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="إغلاق"></button>
              </div>
              <div class="modal-body text-center">
                <img src="" class="img-fluid lightbox-img" alt="">
                <p class="mt-2 lightbox-caption text-muted"></p>
              </div>
            </div>
          </div>
        </div>
      `;

      // Insert modal HTML
      mainElement.insertAdjacentHTML('beforeend', modalHtml);

      // Get the modal elements
      const lightboxModal = document.getElementById('imageLightbox');
      const lightboxImg = lightboxModal.querySelector('.lightbox-img');
      const lightboxCaption = lightboxModal.querySelector('.lightbox-caption');
      const lightboxTitle = lightboxModal.querySelector('.modal-title');

      // Initialize Bootstrap modal
      let lightboxInstance = null;

      // If Bootstrap 5 is available, initialize the modal
      if (typeof bootstrap !== 'undefined') {
        lightboxInstance = new bootstrap.Modal(lightboxModal);
      }

      // Add click event to each image
      images.forEach(img => {
        img.style.cursor = 'pointer';

        // Add visual indication and accessibility attributes
        img.setAttribute('data-bs-toggle', 'modal');
        img.setAttribute('data-bs-target', '#imageLightbox');
        img.setAttribute('role', 'button');
        img.setAttribute('aria-label', 'تكبير الصورة');
        img.setAttribute('tabindex', '0');

        // Add keyboard support
        img.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
          }
        });

        // Handle click event
        img.addEventListener('click', function() {
          // Get image details
          const imgSrc = this.src;
          const figCaption = this.closest('figure').querySelector('figcaption');
          const imgAlt = this.alt;

          // Update modal content
          lightboxImg.src = imgSrc;
          lightboxImg.alt = imgAlt;
          lightboxTitle.textContent = imgAlt;

          if (figCaption) {
            lightboxCaption.textContent = figCaption.textContent;
          } else {
            lightboxCaption.textContent = '';
          }

          // Show modal if Bootstrap is not available
          if (!lightboxInstance) {
            lightboxModal.style.display = 'block';
          }
        });
      });
    }

    /**
     * Initialize animations for content visibility
     * Uses Intersection Observer for performance
     */
    function initAnimations() {
      // Get major sections to animate
      const sections = mainElement.querySelectorAll('section, .card, .alert');

      // Skip if no sections or if IntersectionObserver is not available
      if (sections.length === 0 || !('IntersectionObserver' in window)) return;

      // Helper function to add animation styles
      const addAnimationStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
          .fade-in-up {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
          }
          .fade-in-up.visible {
            opacity: 1;
            transform: translateY(0);
          }
        `;
        document.head.appendChild(style);
      };

      // Add animation styles once
      addAnimationStyles();

      // Add initial class to elements
      sections.forEach(section => {
        section.classList.add('fade-in-up');
      });

      // Create observer for animation
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Stop observing after animation
            observer.unobserve(entry.target);
          }
        });
      }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
      });

      // Observe each section
      sections.forEach(section => {
        observer.observe(section);
      });
    }

    /**
     * Ensure accordion accessibility
     * Enhances Bootstrap's built-in accordion component
     */
    function ensureAccordionAccessibility() {
      const accordions = mainElement.querySelectorAll('.accordion');

      if (accordions.length === 0) return;

      accordions.forEach(accordion => {
        const buttons = accordion.querySelectorAll('.accordion-button');
        const items = accordion.querySelectorAll('.accordion-item');

        // Add keyboard navigation between accordion items
        buttons.forEach((button, index) => {
          button.addEventListener('keydown', function(e) {
            let targetButton = null;

            // Handle arrow key navigation
            if (e.key === 'ArrowDown' && index < buttons.length - 1) {
              targetButton = buttons[index + 1];
            } else if (e.key === 'ArrowUp' && index > 0) {
              targetButton = buttons[index - 1];
            } else if (e.key === 'Home') {
              targetButton = buttons[0];
            } else if (e.key === 'End') {
              targetButton = buttons[buttons.length - 1];
            }

            // Focus the target button if set
            if (targetButton) {
              e.preventDefault();
              targetButton.focus();
            }
          });
        });

        // Add extra ARIA attributes if needed
        items.forEach((item, index) => {
          const button = item.querySelector('.accordion-button');
          const collapse = item.querySelector('.accordion-collapse');

          if (button && collapse && !button.hasAttribute('aria-controls')) {
            const collapseId = collapse.id || `accordion-collapse-${index}`;
            collapse.id = collapseId;
            button.setAttribute('aria-controls', collapseId);
          }
        });
      });
    }
  });
})();
