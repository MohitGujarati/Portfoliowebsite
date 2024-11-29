document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('hidden');
    });

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Experience and Project Toggle Functionality
    function setupToggleButtons(prefix) {
        const shortIds = document.querySelectorAll(`[id$="${prefix}-short"]`);
        const fullIds = document.querySelectorAll(`[id$="${prefix}-full"]`);

        shortIds.forEach((shortElement, index) => {
            const toggleButton = shortElement.querySelector('button');
            const fullElement = fullIds[index];

            toggleButton.addEventListener('click', () => {
                shortElement.classList.add('hidden');
                fullElement.classList.remove('hidden');
            });
        });

        fullIds.forEach((fullElement, index) => {
            const toggleButton = fullElement.querySelector('button');
            const shortElement = shortIds[index];

            toggleButton.addEventListener('click', () => {
                fullElement.classList.add('hidden');
                shortElement.classList.remove('hidden');
            });
        });
    }

    setupToggleButtons('experience');
    setupToggleButtons('project');
});