/* ===================================================================
   GC App Hero + Counter + Corporate Hero — main-new.js
   Title animation, orbit interactions, counter scroll reveal,
   corporate hero browser mockup interactions
   =================================================================== */
(function () {
    'use strict';

    /* ── Corporate Hero ── */
    function initCorpHero() {
        var hero = document.querySelector('.gc-corp-hero');
        if (!hero) return;

        var browser = hero.querySelector('.gc-corp-hero__browser');
        var dots = hero.querySelectorAll('.gc-corp-hero__dot');
        var wireCards = hero.querySelectorAll('.gc-corp-hero__wire-card');

        /* Dot hover ripple effect */
        dots.forEach(function (dot) {
            dot.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
            dot.style.cursor = 'pointer';

            dot.addEventListener('mouseenter', function () {
                dot.style.transform = 'scale(1.3)';
                dot.style.boxShadow = '0 0 8px ' + getComputedStyle(dot).backgroundColor;
            });

            dot.addEventListener('mouseleave', function () {
                dot.style.transform = 'scale(1)';
                dot.style.boxShadow = 'none';
            });
        });

        /* Wire card hover lift */
        wireCards.forEach(function (card) {
            card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
            card.style.cursor = 'default';

            card.addEventListener('mouseenter', function () {
                card.style.transform = 'translateY(-3px)';
                card.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)';
            });

            card.addEventListener('mouseleave', function () {
                card.style.transform = '';
                card.style.boxShadow = '';
            });
        });

        /* Parallax tilt on browser mockup (desktop) */
        if (browser && window.innerWidth > 991) {
            hero.addEventListener('mousemove', function (e) {
                var rect = hero.getBoundingClientRect();
                var x = (e.clientX - rect.left) / rect.width - 0.5;
                var y = (e.clientY - rect.top) / rect.height - 0.5;
                browser.style.animationPlayState = 'paused';
                browser.style.transform = 'translateY(-6px) rotateX(' + (y * -3) + 'deg) rotateY(' + (x * 3) + 'deg)';
            });

            hero.addEventListener('mouseleave', function () {
                browser.style.transform = '';
                browser.style.animationPlayState = 'running';
                browser.style.transition = 'transform 0.5s ease';
            });

            hero.addEventListener('mouseenter', function () {
                browser.style.transition = 'transform 0.1s ease-out';
            });
        }

        /* GSAP scroll-triggered reveal */
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);

            var tags = hero.querySelectorAll('.gc-corp-hero__tag');
            var title = hero.querySelector('.gc-corp-hero__title');
            var desc = hero.querySelector('.gc-corp-hero__desc');
            var actions = hero.querySelector('.gc-corp-hero__actions');
            var trust = hero.querySelector('.gc-corp-hero__trust');
            var visual = hero.querySelector('.gc-corp-hero__visual');

            /* Override CSS animations with GSAP if available */
            var animElements = [tags, title, desc, actions, trust, visual].filter(Boolean);
            animElements.forEach(function (el) {
                if (el.length) {
                    el.forEach(function (item) {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(25px)';
                        item.style.animation = 'none';
                    });
                } else {
                    el.style.opacity = '0';
                    el.style.transform = el === visual ? 'scale(0.95)' : 'translateY(25px)';
                    el.style.animation = 'none';
                }
            });

            var tl = gsap.timeline({
                scrollTrigger: {
                    trigger: hero,
                    start: 'top 80%',
                    once: true
                }
            });

            tl.to(tags, {
                opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out'
            })
            .to(title, {
                opacity: 1, y: 0, duration: 0.6, ease: 'power3.out'
            }, '-=0.2')
            .to(desc, {
                opacity: 1, y: 0, duration: 0.5, ease: 'power2.out'
            }, '-=0.3')
            .to(actions, {
                opacity: 1, y: 0, duration: 0.5, ease: 'power2.out'
            }, '-=0.2')
            .to(trust, {
                opacity: 1, y: 0, duration: 0.4, ease: 'power2.out'
            }, '-=0.1')
            .to(visual, {
                opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.2)'
            }, '-=0.4');
        }
    }

    /* ── App Hero ── */
    function initAppHero() {
        var hero = document.querySelector('.gc-app-hero');
        if (!hero) return;

        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);

            var titleLines = hero.querySelectorAll('.gc-app-hero__title-line');
            if (titleLines.length) {
                titleLines.forEach(function (line) {
                    line.style.opacity = '0';
                    line.style.transform = 'translateY(40px)';
                });

                var tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: hero,
                        start: 'top 85%',
                        once: true
                    }
                });

                tl.to('.gc-app-hero__eyebrow', {
                    opacity: 1, y: 0, duration: 0.5, ease: 'power2.out'
                })
                .to('.gc-app-hero__title-line', {
                    opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out'
                }, '-=0.2')
                .to('.gc-app-hero__desc', {
                    opacity: 1, y: 0, duration: 0.5, ease: 'power2.out'
                }, '-=0.3')
                .to('.gc-app-hero__list', {
                    opacity: 1, y: 0, duration: 0.5, ease: 'power2.out'
                }, '-=0.2')
                .to('.gc-app-hero__btns', {
                    opacity: 1, y: 0, duration: 0.5, ease: 'power2.out'
                }, '-=0.2')
                .to('.gc-app-hero__orbit-wrap', {
                    opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.4)'
                }, '-=0.5');
            }
        }

        var orbitWrap = hero.querySelector('.gc-app-hero__orbit-wrap');
        if (orbitWrap && window.innerWidth > 991) {
            hero.addEventListener('mousemove', function (e) {
                var rect = hero.getBoundingClientRect();
                var x = (e.clientX - rect.left) / rect.width - 0.5;
                var y = (e.clientY - rect.top) / rect.height - 0.5;
                orbitWrap.style.transform = 'translate(' + (x * 12) + 'px, ' + (y * 12) + 'px)';
                orbitWrap.style.transition = 'transform 0.1s ease-out';
            });

            hero.addEventListener('mouseleave', function () {
                orbitWrap.style.transform = 'translate(0, 0)';
                orbitWrap.style.transition = 'transform 0.5s ease';
            });
        }
    }

    function initProcessCounter() {
        /* Process counter is always visible - no scroll animation */
    }

    function initPortfolio() {
        var section = document.querySelector('.gc-app-portfolio');
        if (!section) return;

        if (window.innerWidth > 991) {
            var cards = section.querySelectorAll('.gc-app-portfolio__card');
            cards.forEach(function (card) {
                card.addEventListener('mousemove', function (e) {
                    var rect = card.getBoundingClientRect();
                    var x = (e.clientX - rect.left) / rect.width - 0.5;
                    var y = (e.clientY - rect.top) / rect.height - 0.5;
                    card.style.transform = 'translateY(-8px) rotateX(' + (y * -4) + 'deg) rotateY(' + (x * 4) + 'deg)';
                });

                card.addEventListener('mouseleave', function () {
                    card.style.transform = '';
                });
            });
        }
    }

    function initFadeWrapper() {
        var wrappers = document.querySelectorAll('.fade-wrapper');
        if (!wrappers.length) return;

        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);

            wrappers.forEach(function (wrapper) {
                var items = wrapper.querySelectorAll('.fade-top');
                if (items.length) {
                    items.forEach(function (item) {
                        gsap.to(item, {
                            opacity: 1,
                            y: 0,
                            duration: 0.7,
                            ease: 'power2.out',
                            scrollTrigger: {
                                trigger: item,
                                start: 'top 85%',
                                once: true
                            }
                        });
                    });
                }
            });
        } else {
            wrappers.forEach(function (wrapper) {
                var observer = new IntersectionObserver(function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            wrapper.classList.add('appear');
                        }
                    });
                }, { threshold: 0.1 });

                wrapper.querySelectorAll('.fade-top').forEach(function (item) {
                    observer.observe(item);
                });
            });
        }
    }

    function initWeddingVideoPopup() {
        var modal = document.getElementById('weddingVideoModal');
        if (!modal || modal.dataset.initialized === 'true') {
            return;
        }

        modal.dataset.initialized = 'true';

        var triggers = document.querySelectorAll('.gc-wedding-hero__play');
        var closeBtn = modal.querySelector('.gc-3d-anim-video-modal-close');
        var overlay = modal.querySelector('[data-close-modal]');
        var playBtn = modal.querySelector('.gc-3d-anim-video-play-btn');
        var poster = modal.querySelector('.gc-3d-anim-video-poster');
        var iframe = modal.querySelector('.gc-3d-anim-video-iframe');
        var savedSrc = iframe ? iframe.getAttribute('src') : '';

        function showPoster() {
            if (poster) {
                poster.classList.remove('is-hidden');
            }
        }

        function hidePoster() {
            if (poster) {
                poster.classList.add('is-hidden');
            }
        }

        function playVideo() {
            if (!iframe || !savedSrc) {
                return;
            }

            iframe.src = savedSrc;
            iframe.classList.add('is-visible');
            hidePoster();
        }

        function stopVideo() {
            if (iframe) {
                iframe.removeAttribute('src');
                iframe.classList.remove('is-visible');
            }
            showPoster();
        }

        function openModal() {
            modal.classList.add('is-open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('gc-3d-anim-video-open');
            playVideo();
        }

        function closeModal() {
            modal.classList.remove('is-open');
            modal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('gc-3d-anim-video-open');
            stopVideo();
        }

        triggers.forEach(function (triggerEl) {
            triggerEl.addEventListener('click', function () {
                openModal();
            });
        });

        if (playBtn) {
            playBtn.addEventListener('click', function (event) {
                event.stopPropagation();
                playVideo();
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', function (event) {
                event.stopPropagation();
                closeModal();
            });
        }

        if (overlay) {
            overlay.addEventListener('click', closeModal);
        }

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && modal.classList.contains('is-open')) {
                closeModal();
            }
        });
    }

    function initCorporateVideoPopup() {
        var modal = document.getElementById('corporateVideoModal');
        if (!modal || modal.dataset.initialized === 'true') {
            return;
        }

        modal.dataset.initialized = 'true';

        var triggers = document.querySelectorAll('.gc-corp-hero__play-btn');
        var closeBtn = modal.querySelector('.gc-3d-anim-video-modal-close');
        var overlay = modal.querySelector('[data-close-modal]');
        var playBtn = modal.querySelector('.gc-3d-anim-video-play-btn');
        var poster = modal.querySelector('.gc-3d-anim-video-poster');
        var iframe = modal.querySelector('.gc-3d-anim-video-iframe');
        var savedSrc = iframe ? iframe.getAttribute('src') : '';

        function showPoster() {
            if (poster) {
                poster.classList.remove('is-hidden');
            }
        }

        function hidePoster() {
            if (poster) {
                poster.classList.add('is-hidden');
            }
        }

        function playVideo() {
            if (!iframe || !savedSrc) {
                return;
            }

            iframe.src = savedSrc;
            iframe.classList.add('is-visible');
            hidePoster();
        }

        function stopVideo() {
            if (iframe) {
                iframe.removeAttribute('src');
                iframe.classList.remove('is-visible');
            }
            showPoster();
        }

        function openModal() {
            modal.classList.add('is-open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('gc-3d-anim-video-open');
            playVideo();
        }

        function closeModal() {
            modal.classList.remove('is-open');
            modal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('gc-3d-anim-video-open');
            stopVideo();
        }

        triggers.forEach(function (triggerEl) {
            triggerEl.addEventListener('click', function () {
                openModal();
            });
        });

        if (playBtn) {
            playBtn.addEventListener('click', function (event) {
                event.stopPropagation();
                playVideo();
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', function (event) {
                event.stopPropagation();
                closeModal();
            });
        }

        if (overlay) {
            overlay.addEventListener('click', closeModal);
        }

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && modal.classList.contains('is-open')) {
                closeModal();
            }
        });
    }

    function init() {
        initCorpHero();
        initAppHero();
        initProcessCounter();
        initPortfolio();
        initFadeWrapper();
        initWeddingVideoPopup();
        initCorporateVideoPopup();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
