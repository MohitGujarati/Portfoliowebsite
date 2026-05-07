document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Logic
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const icon = mobileMenuBtn.querySelector('i');

    function toggleMenu() {
        const isHidden = mobileMenu.classList.contains('translate-x-full');
        if (isHidden) {
            mobileMenu.classList.remove('translate-x-full');
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
            document.body.style.overflow = 'hidden';
        } else {
            mobileMenu.classList.add('translate-x-full');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            document.body.style.overflow = '';
        }
    }

    mobileMenuBtn.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu();
        });
    });

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('shadow-sm');
            navbar.classList.add('bg-white/90');
        } else {
            navbar.classList.remove('shadow-sm');
            navbar.classList.remove('bg-white/90');
        }
    });

    // Spotlight Hover Effect Logic
    const spotlightCards = document.querySelectorAll('.spotlight-card');

    spotlightCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Scroll progress bar
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            scrollProgress.style.width = (window.scrollY / docHeight * 100) + '%';
        }, { passive: true });
    }

    // Hero scroll-down hint
    const scrollHint = document.getElementById('scroll-hint');
    if (scrollHint) {
        window.addEventListener('scroll', () => {
            scrollHint.classList.toggle('hidden', window.scrollY > 80);
        }, { passive: true });
        scrollHint.addEventListener('click', () => {
            document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Magnetic CTA buttons in hero
    document.querySelectorAll('#home .btn-primary, #home .btn-outline, #home a[id="resume-btn"]').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const rect = btn.getBoundingClientRect();
            const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.22;
            const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.22;
            btn.style.transform = `translate(${dx}px, ${dy}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    // Scroll Reveal Animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // stagger bullet points inside this card
                entry.target.querySelectorAll('li').forEach((li, i) => {
                    li.style.animationDelay = `${0.15 + i * 0.08}s`;
                    li.classList.add('li-stagger');
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });

    // Active Link Highlighting
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // Back to top button
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Drag-to-scroll for certifications row
    const certTrack = document.querySelector('.cert-scroll-track');
    if (certTrack) {
        let isDown = false;
        let startX;
        let scrollLeft;

        certTrack.addEventListener('mousedown', e => {
            isDown = true;
            startX = e.pageX - certTrack.offsetLeft;
            scrollLeft = certTrack.scrollLeft;
        });
        certTrack.addEventListener('mouseleave', () => { isDown = false; });
        certTrack.addEventListener('mouseup',    () => { isDown = false; });
        certTrack.addEventListener('mousemove',  e => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - certTrack.offsetLeft;
            certTrack.scrollLeft = scrollLeft - (x - startX) * 1.2;
        });
    }
});