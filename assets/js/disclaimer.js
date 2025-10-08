/**
 * Disclaimer Popup Module
 * Handles the display and behavior of the disclaimer popup
 */

class DisclaimerPopup {
    constructor(options = {}) {
        // Default options
        this.options = {
            popupId: 'disclaimerPopup',
            agreeBtnId: 'agreeButton',
            closeBtnClass: 'close-popup',
            contentClass: 'popup-content',
            storageKey: 'disclaimerAgreed',
            animationSpeed: 300,
            onAgree: null,
            onClose: null,
            ...options
        };

        // Initialize the popup
        this.init();
    }

    init() {
        // Cache DOM elements
        this.popup = document.getElementById(this.options.popupId);
        this.content = this.popup ? this.popup.querySelector(`.${this.options.contentClass}`) : null;
        
        // If popup doesn't exist, exit
        if (!this.popup) {
            console.warn(`Disclaimer popup element with ID '${this.options.popupId}' not found.`);
            return;
        }

        // Set initial state
        this.popup.style.display = 'none';

        // Bind event listeners
        this.bindEvents();

        // Show popup if user hasn't agreed yet
        if (!this.hasAgreed()) {
            this.show();
        }
    }

    bindEvents() {
        // Close button
        const closeBtn = this.popup.querySelector(`.${this.options.closeBtnClass}`);
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        // Agree button
        const agreeBtn = document.getElementById(this.options.agreeBtnId);
        if (agreeBtn) {
            agreeBtn.addEventListener('click', () => this.handleAgree());
        }

        // Close when clicking outside content
        this.popup.addEventListener('click', (e) => {
            if (e.target === this.popup) {
                this.close();
            }
        });

        // Prevent closing when clicking inside content
        if (this.content) {
            this.content.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }

    hasAgreed() {
        return localStorage.getItem(this.options.storageKey) === 'true';
    }

    show() {
        this.popup.style.display = 'flex';
        setTimeout(() => {
            this.popup.style.opacity = '1';
            this.popup.querySelector('.popup-content').style.transform = 'translateY(0)';
        }, 10);
    }

    close() {
        this.popup.style.opacity = '0';
        this.popup.querySelector('.popup-content').style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            this.popup.style.display = 'none';
            if (typeof this.options.onClose === 'function') {
                this.options.onClose();
            }
        }, this.options.animationSpeed);
    }

    handleAgree() {
        localStorage.setItem(this.options.storageKey, 'true');
        if (typeof this.options.onAgree === 'function') {
            this.options.onAgree();
        }
        this.close();
    }
}

// Auto-initialize if data-disclaimer attribute is present
document.addEventListener('DOMContentLoaded', () => {
    const disclaimerEl = document.querySelector('[data-disclaimer]');
    if (disclaimerEl) {
        window.disclaimer = new DisclaimerPopup({
            // You can pass custom options here
            onAgree: () => {
                console.log('User agreed to the disclaimer');
                // Add any additional logic when user agrees
            },
            onClose: () => {
                console.log('Disclaimer was closed');
                // Add any additional logic when popup is closed
            }
        });
    }
});
