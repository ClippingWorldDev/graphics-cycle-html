(function () {
    "use strict";

    function softroThemeInit($) {

    function getThemeAsset(path) {
        var base = (window.localize_params && window.localize_params.theme_assets_uri) || "assets";
        var cleaned = String(path || "").replace(/^assets\//, "");

        return base.replace(/\/$/, "") + "/" + cleaned;
    }

    function initSwiper(selector, options) {
        if (typeof Swiper === "undefined" || !document.querySelector(selector)) {
            return null;
        }

        return new Swiper(selector, options);
    }

    function initVenoBoxLightbox() {
        if (typeof VenoBox === "undefined" || !document.querySelector(".video-popup, .img-popup")) {
            return;
        }

        new VenoBox({
            selector: ".video-popup, .img-popup",
            bgcolor: "transparent",
            numeration: true,
            infinigall: true,
            spinner: "plane",
        });
    }

    function initMeanMenu(selector, options) {
        if (!$.fn.meanmenu || !document.querySelector(selector)) {
            return;
        }

        $(selector).meanmenu(options);
    }

    function initNiceSelect() {
        if (!$.fn.niceSelect) {
            return;
        }

        $("select").not(".gc-native-select").niceSelect();
    }

    function initCarouselTicker() {
        if (!$.fn.carouselTicker) {
            return;
        }

        if ($(".carouselTicker-nav").length) {
            $(".carouselTicker-nav").carouselTicker({});
        }

        if ($(".carouselTicker-start").length) {
            $(".carouselTicker-start").carouselTicker({
                direction: "next",
            });
        }
    }

    // Get Device width
    var device_width = window.innerWidth;
    var textAnimationTimelines = [];
    var preloaderFinished = false;

    function finishPreloader() {
        if (preloaderFinished) {
            return;
        }

        preloaderFinished = true;
        window.__gcPreloaderDone = true;
        document.dispatchEvent(new CustomEvent("gc:preloader-done"));
    }

    function revealInViewAnimations() {
        if (typeof gsap === "undefined") {
            return;
        }

        textAnimationTimelines.forEach(function (item) {
            if (!item.element || !item.timeline || item.timeline.progress() > 0) {
                return;
            }

            var rect = item.element.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.85 && rect.bottom > 0) {
                item.timeline.play();
            }
        });

        document.querySelectorAll(".fade-top").forEach(function (element) {
            if (gsap.getProperty(element, "opacity") !== 0) {
                return;
            }

            var rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                gsap.to(element, {
                    opacity: 1,
                    y: 0,
                    duration: 0.85,
                    ease: "power3.out",
                });
            }
        });
    }

    function initFadeTopAnimations() {
        if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
            return;
        }

        document.querySelectorAll(".fade-wrapper").forEach(function (section) {
            if (section.dataset.fadeWrapperInit === "true") {
                return;
            }

            section.dataset.fadeWrapperInit = "true";

            var fadeItems = section.querySelectorAll(".fade-top:not([data-fade-top-bound])");

            fadeItems.forEach(function (element, index) {
                element.dataset.fadeTopBound = "true";
                var delay = index * 0.08;

                gsap.set(element, {
                    opacity: 0,
                    y: 50,
                });

                ScrollTrigger.create({
                    trigger: element,
                    start: "top 88%",
                    onEnter: function () {
                        gsap.to(element, {
                            opacity: 1,
                            y: 0,
                            duration: 0.85,
                            delay: delay,
                            ease: "power3.out",
                        });
                    },
                    once: true,
                });
            });
        });
    }

    function getTextAnimationTargets(animation, split) {
        var targets = animation.querySelectorAll("." + split);

        if (targets.length) {
            return targets;
        }

        targets = animation.querySelectorAll(".line, .word, .char");

        if (targets.length) {
            return targets;
        }

        return [animation];
    }

    //Toggle Js
    $('.rr-checkout-login-form-reveal-btn').on('click', function () {
        $('#rrReturnCustomerLoginForm').slideToggle(400);
    });

    $('.rr-checkout-coupon-form-reveal-btn').on('click', function () {
        $('#rrCheckoutCouponForm').slideToggle(400);
    });

    // Color Scheme Swithcer
    const storageKey = 'theme-preference';

    const onClick = () => {
        theme.value = theme.value === 'light' ? 'dark' : 'light';
        setPreference();
    }

    const getColorPreference = () => {
        if (localStorage.getItem(storageKey)) {
            return localStorage.getItem(storageKey);
        }

        return 'dark';
    }

    const setPreference = () => {
        localStorage.setItem(storageKey, theme.value);
        reflectPreference();
    }

    const reflectPreference = () => {
        document.firstElementChild.setAttribute('data-theme', theme.value);
        const toggle = document.querySelector('#theme-toogle');
        if (toggle) {
            toggle.setAttribute('aria-label', theme.value === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
            toggle.setAttribute('data-mode', theme.value);
        }
    }

    const theme = {
        value: getColorPreference(),
    }

    // set early so no page flashes / CSS is made aware
    reflectPreference();

    $(window).on("load", function () {
        reflectPreference();

        var themeToggle = document.querySelector("#theme-toogle");
        if (themeToggle) {
            themeToggle.addEventListener("click", onClick);
        }
    });

    /*======================================
        Preloader activation
    ========================================*/
    function hidePreloader() {
        var $preloader = $("#preloader");

        if (!$preloader.length) {
            finishPreloader();
            return;
        }

        $preloader.stop(true).delay(300).fadeOut(500, finishPreloader);
    }

    function setupPreloader() {
        window.setTimeout(finishPreloader, 3500);

        if (document.readyState === "complete") {
            window.setTimeout(hidePreloader, 300);
        } else {
            $(window).on("load.preloader", function () {
                window.setTimeout(hidePreloader, 300);
            });
        }
    }

    setupPreloader();

    $(".preloader-close").on("click", function () {
        $("#preloader").stop(true).fadeOut(500, finishPreloader);
    });

    $(window).on("load", function () {
        // Text Animation
        setTimeout(function () {
            if (typeof SplitType === "undefined") {
                return;
            }

            var hasAnim = $(".anim-text");
            hasAnim.each(function () {
                var $this = $(this);
                var splitto = new SplitType($this, {
                    types: "lines, chars",
                    className: "char",
                });
                var chars = $this.find(".char");
                gsap.fromTo(
                    chars,
                    { y: "100%" },
                    {
                        y: "0%",
                        duration: 0.9,
                        stagger: 0.03,
                        ease: "power2.out",
                    }
                );
            });
        }, 1000);
    });

    // RTL Switcher
    $(".switcher-input").on("click", function () {
        $(this).toggleClass("rtl-mode");
        $("body").toggleClass("rtl");
        // rtlMode = true;
    });

    $(document).ready(function () {

        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
            $('body').addClass('firefox');
        }

        var header = $(".header"),
            stickyHeader = $(".primary-header");

        function menuSticky(w) {
            if (w.matches) {

                $(window).on("scroll", function () {
                    var scroll = $(window).scrollTop();
                    if (scroll >= 10) {
                        header.addClass("fixed");
                    } else {
                        header.removeClass("fixed");
                    }
                });
            }
        }

        var minWidth = window.matchMedia("(min-width: 992px)");
        if (header.hasClass("sticky-active")) {
            menuSticky(minWidth);
        }

        //Mobile Menu Js
        initMeanMenu(".mobile-menu-items", {
            meanMenuContainer: ".side-menu-wrap",
            meanScreenWidth: "992",
            meanMenuCloseSize: "30px",
            meanRemoveAttrs: true,
            meanExpand: ['<i class="fa-solid fa-caret-down"></i>'],
        });
        initMeanMenu(".mobile-menu-items-16", {
            meanMenuContainer: ".side-menu-wrap",
            meanScreenWidth: "1200",
            meanMenuCloseSize: "30px",
            meanRemoveAttrs: true,
            meanExpand: ['<i class="fa-solid fa-caret-down"></i>'],
        });

        // Mobile Sidemenu
        $(".mobile-side-menu-toggle").on("click", function () {
            $(".mobile-side-menu, .mobile-side-menu-overlay").toggleClass("is-open");
        });

        $(".mobile-side-menu-close, .mobile-side-menu-overlay").on("click", function () {
            $(".mobile-side-menu, .mobile-side-menu-overlay").removeClass("is-open");
        });

        // Popup Search Box
        $(function () {
            $("#popup-search-box").removeClass("toggled");

            $(".dl-search-icon").on("click", function (e) {
                e.stopPropagation();
                $("#popup-search-box").toggleClass("toggled");
                $("#popup-search").focus();
            });

            $("#popup-search-box input").on("click", function (e) {
                e.stopPropagation();
            });

            $("#popup-search-box, body").on("click", function () {
                $("#popup-search-box").removeClass("toggled");
            });
        });

        // Popup Sidebox
        function sideBox() {
            $("body").removeClass("open-sidebar");
            $(document).on("click", ".sidebar-trigger", function (e) {
                e.preventDefault();
                $("body").toggleClass("open-sidebar");
            });
            $(document).on("click", ".sidebar-trigger.close, #sidebar-overlay", function (e) {
                e.preventDefault();
                $("body.open-sidebar").removeClass("open-sidebar");
            });
        }

        sideBox();

        // Venobox Video
        initVenoBoxLightbox();

        // Data Background
        $("[data-background").each(function () {
            $(this).css("background-image", "url( " + $(this).attr("data-background") + "  )");
        });

        // Custom Cursor
        $("body").append('<div class="mt-cursor"></div>');
        var cursor = $(".mt-cursor"),
            linksCursor = $("a, .swiper-nav, button, .cursor-effect"),
            crossCursor = $(".cross-cursor");

        $(window).on("mousemove", function (e) {
            cursor.css({
                transform: "translate(" + (e.clientX - 15) + "px," + (e.clientY - 15) + "px)",
                visibility: "inherit",
            });
        });

        /* Odometer */
        $(".odometer").not(".process-counter .odometer").waypoint(
            function () {
                var odo = $(".odometer").not(".process-counter .odometer");
                odo.each(function () {
                    var countNumber = $(this).attr("data-count");
                    $(this).html(countNumber);
                });
            },
            {
                offset: "80%",
                triggerOnce: true,
            }
        );

        function initProcessCounterRepeat() {
            var counterSection = document.querySelector(".process-counter");
            if (!counterSection) {
                return;
            }

            var odometers = counterSection.querySelectorAll(".odometer");
            if (!odometers.length) {
                return;
            }

            var animated = false;

            var animateCounters = function () {
                if (animated) {
                    return;
                }

                animated = true;
                odometers.forEach(function (el) {
                    el.innerHTML = el.getAttribute("data-count");
                });
            };

            if (!("IntersectionObserver" in window)) {
                animateCounters();
                return;
            }

            var observer = new IntersectionObserver(
                function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            animateCounters();
                            observer.disconnect();
                        }
                    });
                },
                {
                    threshold: 0.15,
                    rootMargin: "0px 0px -8% 0px",
                }
            );

            observer.observe(counterSection);

            window.addEventListener("load", function () {
                window.setTimeout(function () {
                    if (animated) {
                        return;
                    }

                    var rect = counterSection.getBoundingClientRect();
                    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
                        animateCounters();
                        observer.disconnect();
                    }
                }, 500);
            });
        }

        initProcessCounterRepeat();

        // Nice Select Js
        initNiceSelect();

        // Isotop
        $(".filter-items").imagesLoaded(function () {
            // Add isotope click function
            $(".project-filter li").on("click", function () {
                $(".project-filter li").removeClass("active");
                $(this).addClass("active");

                var selector = $(this).attr("data-filter");
                $(".filter-items").isotope({
                    filter: selector,
                    animationOptions: {
                        duration: 750,
                        easing: "linear",
                        queue: false,
                    },
                });
                return false;
            });

            $(".filter-items").isotope({
                itemSelector: ".single-item",
                layoutMode: "fitRows",
                fitRows: {
                    gutter: 0,
                },
            });
        });

        // Sponsor Carousel
        var swiperSponsor = new Swiper(".sponsor-carousel", {
            slidesPerView: 5,
            spaceBetween: 50,
            slidesPerGroup: 1,
            loop: true,
            autoplay: true,
            grabcursor: true,
            speed: 600,
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                    spaceBetween: 25,
                },
                767: {
                    slidesPerView: 3,
                    slidesPerGroup: 1,
                    spaceBetween: 30,
                },
                1024: {
                    slidesPerView: 5,
                    slidesPerGroup: 1,
                },
            },
        });

        // Testimonial Carousel
        var swiperTesti = new Swiper(".testi-carousel", {
            slidesPerView: 3,
            spaceBetween: 24,
            slidesPerGroup: 1,
            loop: true,
            autoplay: true,
            grabcursor: true,
            speed: 600,
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                    spaceBetween: 25,
                },
                767: {
                    slidesPerView: 2,
                    slidesPerGroup: 1,
                    spaceBetween: 30,
                },
                1024: {
                    slidesPerView: 3,
                    slidesPerGroup: 1,
                },
            },
        });

        // Testimonial Carousel 2
        var swiperTesti = new Swiper(".testi-carousel-2", {
            slidesPerView: 1,
            spaceBetween: 24,
            slidesPerGroup: 1,
            loop: true,
            autoplay: true,
            grabcursor: true,
            speed: 600,
            navigation: {
                nextEl: ".testimonial-section-4 .swiper-prev",
                prevEl: ".testimonial-section-4 .swiper-next",
            },
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                    spaceBetween: 25,
                },
                767: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                    spaceBetween: 30,
                },
                1024: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                },
            },
        });

        // Testimonial Carousel 3
        var testimonialThumb = new Swiper(".thumb-carousel", {
            slidesPerView: 3,
            slidesPerGroup: 1,
            spaceBetween: 0,
            loop: false,
            autoplay: true,
            centerSlides: true,
            speed: 600,
        });
        var testimonials = new Swiper(".content-carousel", {
            slidesPerView: 1,
            slidesPerGroup: 1,
            spaceBetween: 0,
            loop: true,
            autoplay: true,
            speed: 600,
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            thumbs: {
                swiper: testimonialThumb,
            },
        });

        // Testimonial Carousel 4
        var swiperTesti = new Swiper(".testi-carousel-4", {
            slidesPerView: 1,
            spaceBetween: 40,
            slidesPerGroup: 1,
            loop: true,
            autoplay: true,
            grabcursor: true,
            speed: 700,
            direction: 'vertical',
            pagination: {
                el: ".testi-carousel-wrap-2 .swiper-pagination",
                clickable: true,
                renderBullet: function (index, className) {
                    return '<span class="' + className + '">' + (index + 1) + "</span>";
                },
            },
        });

        // Testimonial Carousel 5
        var swiperTesti = new Swiper(".testi-carousel-5", {
            slidesPerView: 1,
            spaceBetween: 24,
            slidesPerGroup: 1,
            loop: true,
            autoplay: true,
            grabcursor: true,
            speed: 600,
            navigation: {
                nextEl: ".testi-top .swiper-prev",
                prevEl: ".testi-top .swiper-next",
            },
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                    spaceBetween: 25,
                },
                767: {
                    slidesPerView: 2,
                    slidesPerGroup: 1,
                    spaceBetween: 30,
                },
                1024: {
                    slidesPerView: 3,
                    slidesPerGroup: 1,
                },
            },
        });

        // Testimonial Carousel 6
        var swiperTesti = new Swiper(".testi-carousel-6", {
            slidesPerView: 2,
            spaceBetween: 24,
            slidesPerGroup: 1,
            loop: true,
            autoplay: true,
            grabcursor: true,
            speed: 600,
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                    spaceBetween: 25,
                },
                767: {
                    slidesPerView: 2,
                    slidesPerGroup: 1,
                    spaceBetween: 30,
                },
                1024: {
                    slidesPerView: 2,
                    slidesPerGroup: 1,
                },
            },
        });

        // Project Carousel
        var swiperProject = new Swiper(".project-carousel", {
            slidesPerView: 1,
            spaceBetween: 30,
            slidesPerGroup: 1,
            loop: true,
            autoplay: false,
            grabcursor: true,
            initialSlide: -1,
            speed: 600,
            navigation: {
                nextEl: ".project-section .swiper-prev",
                prevEl: ".project-section .swiper-next",
            },
            pagination: {
                el: ".swiper-pagination",
                type: "fraction",
            },
        });

        // Service Carousel
        var swiperService = new Swiper(".service-carousel", {
            slidesPerView: 4,
            spaceBetween: 24,
            slidesPerGroup: 1,
            loop: true,
            autoplay: true,
            grabcursor: true,
            speed: 600,
            navigation: {
                nextEl: ".service-section .swiper-prev",
                prevEl: ".service-section .swiper-next",
            },
            pagination: {
                el: ".swiper-pagination",
                type: "fraction",
            },
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                    spaceBetween: 25,
                },
                767: {
                    slidesPerView: 2,
                    slidesPerGroup: 1,
                    spaceBetween: 30,
                },
                1024: {
                    slidesPerView: 4,
                    slidesPerGroup: 1,
                },
            },
        });

        // Service Carousel
        var swiperService = new Swiper(".service-carousel-2", {
            slidesPerView: 2,
            spaceBetween: 24,
            slidesPerGroup: 1,
            loop: true,
            autoplay: true,
            grabcursor: true,
            speed: 600,
            navigation: {
                nextEl: ".service-section-8 .swiper-prev",
                prevEl: ".service-section-8 .swiper-next",
            },
            pagination: {
                el: ".service-top .swiper-pagination",
                type: "fraction",
            },
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                    spaceBetween: 25,
                },
                767: {
                    slidesPerView: 2,
                    slidesPerGroup: 1,
                    spaceBetween: 30,
                },
                1024: {
                    slidesPerView: 2,
                    slidesPerGroup: 1,
                },
            },
        });


        // Sponsor Carousel
        var swiperBlog = new Swiper(".sponsor-carousel-2", {
            slidesPerView: 6,
            spaceBetween: 24,
            slidesPerGroup: 1,
            loop: true,
            autoplay: true,
            grabcursor: true,
            speed: 600,
            breakpoints: {
                320: {
                    slidesPerView: 2,
                    slidesPerGroup: 1,
                    spaceBetween: 25,
                },
                767: {
                    slidesPerView: 4,
                    slidesPerGroup: 1,
                    spaceBetween: 30,
                },
                1024: {
                    slidesPerView: 6,
                    slidesPerGroup: 1,
                },
            },
        });

        // Project Carousel
        var swiperProject = new Swiper(".project-carousel-2", {
            slidesPerView: 1,
            spaceBetween: 24,
            slidesPerGroup: 1,
            loop: true,
            autoplay: true,
            grabcursor: true,
            speed: 600,
            centerSlides: true,
            navigation: {
                nextEl: ".project-carousel-2 .swiper-prev",
                prevEl: ".project-carousel-2 .swiper-next",
            },
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                    spaceBetween: 25,
                },
                767: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                    spaceBetween: 30,
                },
                1024: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                },
            },
        });

        // Project Carousel
        var swiperProject = new Swiper(".project-carousel-3", {
            slidesPerView: 1,
            spaceBetween: 24,
            slidesPerGroup: 1,
            loop: true,
            autoplay: false,
            grabcursor: true,
            initialSlide: -1,
            speed: 600,
            navigation: {
                nextEl: ".project-carousel-3 .swiper-prev",
                prevEl: ".project-carousel-23 .swiper-next",
            },
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                    spaceBetween: 25,
                },
                767: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                    spaceBetween: 30,
                },
                1024: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                },
            },
        });

        // Sponsor Carousel
        var swiperSponsor = new Swiper(".sponsor-carousel-3", {
            slidesPerView: 6,
            spaceBetween: 40,
            slidesPerGroup: 1,
            loop: true,
            autoplay: true,
            grabcursor: true,
            speed: 600,
            breakpoints: {
                320: {
                    slidesPerView: 2,
                    slidesPerGroup: 1,
                },
                767: {
                    slidesPerView: 4,
                    slidesPerGroup: 1,
                },
                1024: {
                    slidesPerView: 6,
                    slidesPerGroup: 1,
                },
            },
        });

        // Sponsor Carousel
        var swiperSponsor = new Swiper(".sponsor-carousel-4", {
            slidesPerView: 5,
            spaceBetween: 40,
            slidesPerGroup: 1,
            loop: true,
            autoplay: true,
            grabcursor: true,
            speed: 600,
            breakpoints: {
                320: {
                    slidesPerView: 2,
                    slidesPerGroup: 1,
                },
                767: {
                    slidesPerView: 4,
                    slidesPerGroup: 1,
                },
                1024: {
                    slidesPerView: 5,
                    slidesPerGroup: 1,
                },
            },
        });

        //Swiper Slider For Shop
        var swiper = new Swiper(".product-gallary-thumb", {
            spaceBetween: 10,
            slidesPerView: 3,
            freeMode: true,
            watchSlidesProgress: true,
        });
        var swiper2 = new Swiper(".product-gallary", {
            spaceBetween: 10,
            loop: true,
            navigation: {
                nextEl: ".swiper-nav-next",
                prevEl: ".swiper-nav-prev",
            },
            thumbs: {
                swiper: swiper,
            },
        });

        // Pin Active
        var pin_fixed = document.querySelector('.pin-element');
        if (pin_fixed && device_width > 991) {

            gsap.to(".pin-element", {
                scrollTrigger: {
                    trigger: ".pin-area",
                    pin: ".pin-element",
                    start: "top top",
                    end: "bottom bottom",
                    pinSpacing: false,
                }
            });
        }

        // hover reveal start
        const hoverItem = document.querySelectorAll(".service-hover-reveal-item");
        function moveImage(e, hoverItem, index) {
            const item = hoverItem.getBoundingClientRect();
            const x = e.clientX - item.x;
            const y = e.clientY - item.y;
            if (hoverItem.children[index]) {
                hoverItem.children[index].style.transform = `translate(${x}px, ${y}px)`;
            }
        }
        hoverItem.forEach((item, i) => {
            item.addEventListener("mousemove", (e) => {
                setInterval(moveImage(e, item, 1), 50);
            });
        });
        // hover reveal end

        // carouselTicker initail
        initCarouselTicker();

        // Stroke Text

        $(function () {
            let container_svg = $('.container-svg');
            let that, svg, text, bbox, width, height, calc_ratio, stroke_dasharray, new_value_stroke;
            let is_safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
            let is_retina = false;
            if (matchMedia("(-webkit-min-device-pixel-ratio: 2), (min-device-pixel-ratio: 2), (min-resolution: 192dpi)").matches) {
                is_retina = true;
            }
            container_svg.each(function () {
                that = $(this);
                // Set viewBox size
                svg = $('svg', that);
                text = $('text', that);
                bbox = text[0].getBBox();
                width = that.width();
                height = bbox.height;
                svg.attr('viewBox', '0 0 ' + width + ' ' + height);
                // Set container height with ratio
                calc_ratio = (height * 100 / width);
                that.css('padding-bottom', calc_ratio + '%');
                if (is_safari) { // Safari fix
                    text.attr('y', '1em');
                }
                if (is_retina) {
                    stroke_dasharray = text.css('stroke-dasharray');
                    new_value_stroke = retina_stroke_dasharray(stroke_dasharray);
                    text.css('stroke-dasharray', new_value_stroke);
                }
            })
        })

        function retina_stroke_dasharray(value) {
            let array = value.split(",");
            for (let i = 0; i < array.length; i++) {
                array[i] = (parseInt(array[i]) * 2) + 'px';
            }
            return array.join(', ');
        }

        //Running Animated Text
        const scrollers = document.querySelectorAll(".scroller");

        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            addAnimation();
        }

        function addAnimation() {
            scrollers.forEach((scroller) => {
                scroller.setAttribute("data-animated", true);

                const scrollerInner = scroller.querySelector(".scroller__inner");
                const scrollerContent = Array.from(scrollerInner.children);

                scrollerContent.forEach((item) => {
                    const duplicatedItem = item.cloneNode(true);
                    duplicatedItem.setAttribute("aria-hidden", true);
                    scrollerInner.appendChild(duplicatedItem);
                });
            });
        }


        // Animation

        gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
        ScrollTrigger.normalizeScroll(true);

        let revealContainers = document.querySelectorAll(".reveal");

        revealContainers.forEach((container) => {
            let image = container.querySelector("img");
            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    toggleActions: "restart none none reset"
                }
            });

            tl.set(container, { autoAlpha: 1 });
            tl.from(container, 1.5, {
                xPercent: -100,
                ease: Power2.out
            });
            tl.from(image, 1.5, {
                xPercent: 100,
                scale: 1.3,
                delay: -1.5,
                ease: Power2.out
            });
        });

        // Scroll Animation
        textAnimationTimelines = [];

        if (typeof SplitType !== "undefined" && document.querySelector("[data-text-animation]")) {
            new SplitType("[data-text-animation]", {
                types: "lines,words, chars",
                className: "line",
            });
        }

        var text_animations = document.querySelectorAll("[data-text-animation]");

        function createScrollTrigger(triggerElement, timeline) {
            ScrollTrigger.create({
                trigger: triggerElement,
                start: "top 80%",
                onEnter: function () {
                    timeline.play();
                },
                toggleClass: { targets: triggerElement, className: "active" },
            });

            textAnimationTimelines.push({
                element: triggerElement,
                timeline: timeline,
            });
        }

        text_animations.forEach(function (animation) {
            var type = "slide-up";
            var duration = 0.75;
            var offset = 80;
            var stagger = 0.6;
            var delay = 0;
            var scroll = 1;
            var split = "line";
            var ease = "power2.out";
            var targets;

            if (animation.getAttribute("data-stagger")) {
                stagger = animation.getAttribute("data-stagger");
            }
            if (animation.getAttribute("data-duration")) {
                duration = animation.getAttribute("data-duration");
            }
            if (animation.getAttribute("data-text-animation")) {
                type = animation.getAttribute("data-text-animation");
            }
            if (animation.getAttribute("data-delay")) {
                delay = animation.getAttribute("data-delay");
            }
            if (animation.getAttribute("data-ease")) {
                ease = animation.getAttribute("data-ease");
            }
            if (animation.getAttribute("data-scroll")) {
                scroll = animation.getAttribute("data-scroll");
            }
            if (animation.getAttribute("data-offset")) {
                offset = animation.getAttribute("data-offset");
            }
            if (animation.getAttribute("data-split")) {
                split = animation.getAttribute("data-split");
            }

            targets = getTextAnimationTargets(animation, split);

            if (scroll == 1) {
                if (type == "slide-up") {
                    var tl = gsap.timeline({ paused: true });
                    tl.from(targets, {
                        yPercent: offset,
                        duration: duration,
                        ease: ease,
                        opacity: 0,
                        stagger: { amount: stagger },
                    });
                    createScrollTrigger(animation, tl);
                }
                if (type == "slide-down") {
                    tl = gsap.timeline({ paused: true });
                    tl.from(targets, {
                        yPercent: -offset,
                        duration: duration,
                        ease: ease,
                        opacity: 0,
                        stagger: { amount: stagger },
                    });
                    createScrollTrigger(animation, tl);
                }
                if (type == "rotate-in") {
                    tl = gsap.timeline({ paused: true });
                    tl.set(targets, { transformPerspective: 400 });
                    tl.from(targets, {
                        rotationX: -offset,
                        duration: duration,
                        ease: ease,
                        force3D: true,
                        opacity: 0,
                        transformOrigin: "top center -50",
                        stagger: { amount: stagger },
                    });
                    createScrollTrigger(animation, tl);
                }
                if (type == "slide-from-left") {
                    tl = gsap.timeline({ paused: true });
                    tl.from(targets, {
                        opacity: 0,
                        xPercent: -offset,
                        duration: duration,
                        ease: ease,
                        stagger: { amount: stagger },
                    });
                    createScrollTrigger(animation, tl);
                }
                if (type == "slide-from-right") {
                    tl = gsap.timeline({ paused: true });
                    tl.from(targets, {
                        opacity: 0,
                        xPercent: offset,
                        duration: duration,
                        ease: ease,
                        stagger: { amount: stagger },
                    });
                    createScrollTrigger(animation, tl);
                }
                if (type == "fade-in") {
                    tl = gsap.timeline({ paused: true });
                    tl.from(targets, {
                        opacity: 0,
                        duration: duration,
                        ease: ease,
                        stagger: { amount: stagger },
                    });
                    createScrollTrigger(animation, tl);
                }
                if (type == "fade-in-right") {
                    tl = gsap.timeline({ paused: true });
                    tl.from(targets, {
                        x: 100,
                        autoAlpha: 0,
                        duration: duration,
                        stagger: stagger,
                    });
                    createScrollTrigger(animation, tl);
                }
                if (type == "fade-in-random") {
                    tl = gsap.timeline({ paused: true });
                    tl.from(targets, {
                        opacity: 0,
                        duration: duration,
                        ease: ease,
                        stagger: { amount: stagger, from: "random" },
                    });
                    createScrollTrigger(animation, tl);
                }
                if (type == "scrub") {
                    tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: animation,
                            start: "top 90%",
                            end: "top center",
                            scrub: true,
                        },
                    });
                    tl.from(targets, {
                        opacity: 0.2,
                        duration: duration,
                        ease: ease,
                        stagger: { amount: stagger },
                    });
                }

                gsap.set("[data-text-animation]", { opacity: 1 });
            }
        });

        function textAnimationEffect() {
            if (typeof SplitType === "undefined" || !document.querySelector(".text-animation-effect")) {
                return;
            }

            let TextAnim = gsap.timeline();
            let splitText = new SplitType(".text-animation-effect", { types: 'chars' });
            if ($('.text-animation-effect .char').length) {
                TextAnim.from(".text-animation-effect .char", { duration: 1, x: 100, autoAlpha: 0, stagger: 0.1 }, "-=1");
            }
        }

        window.addEventListener("load", (event) => {
            textAnimationEffect();
        });

        // Page Scroll Percentage
        function scrollTopPercentage() {
            const scrollPercentage = () => {
                const scrollTopPos = document.documentElement.scrollTop;
                const calcHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrollValue = Math.round((scrollTopPos / calcHeight) * 100);
                const scrollElementWrap = $("#scroll-percentage");

                scrollElementWrap.css("background", `conic-gradient( var(--rr-color-theme-primary) ${scrollValue}%, var(--rr-color-common-white) ${scrollValue}%)`);

                // ScrollProgress
                if (scrollTopPos > 100) {
                    scrollElementWrap.addClass("active");
                } else {
                    scrollElementWrap.removeClass("active");
                }

                if (scrollValue < 96) {
                    $("#scroll-percentage-value").text(`${scrollValue}%`);
                } else {
                    $("#scroll-percentage-value").html('<i class="fa-sharp fa-regular fa-arrow-up-long"></i>');
                }
            }
            window.onscroll = scrollPercentage;
            window.onload = scrollPercentage;

            // Back to Top
            function scrollToTop() {
                document.documentElement.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }

            $("#scroll-percentage").on("click", scrollToTop);
        }

        scrollTopPercentage();
    });

    document.querySelectorAll(".scroll-btn").forEach((btn, index) => {
        btn.addEventListener("click", () => {
            var sectionTarget = btn.getAttribute("data-target");
            gsap.to(window, { duration: 1, scrollTo: { y: sectionTarget, offsetY: 70 } });
        });
    });


    // One Page Nav GSPA href issue fixing way
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const offset = 150; // Adjust this to your header height
                const elementPosition = targetElement.offsetTop;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth',
                });
            }
        });
    });

    // create the smooth scroller FIRST!
    let smoother = ScrollSmoother.create({
        smooth: 2,
        effects: device_width < 1025 ? false : true,
        smoothTouch: false,
        normalizeScroll: true,
        ignoreMobileResize: true,
    });

    initFadeTopAnimations();
    ScrollTrigger.refresh();
    revealInViewAnimations();

    window.addEventListener("load", function () {
        initFadeTopAnimations();
        ScrollTrigger.refresh();
        revealInViewAnimations();
    });




    // S-work js new update 2

    if (document.querySelector(".team-slide-14")) {
        var testimonial = new Swiper(".team-slide-14", {
            slidesPerView: 4,
            spaceBetween: 30,
            loop: true,
            centeredSlides: false,
            autoplay: true,
            centerMode: true,
            speed: 1000,
            navigation: {
                nextEl: ".team-slide-14-button .swiper-prev",
                prevEl: ".team-slide-14-button .swiper-next",
            },
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                    spaceBetween: 20,
                },
                767: {
                    slidesPerView: 2.5,
                    slidesPerGroup: 1,
                    spaceBetween: 25,
                },
                992: {
                    slidesPerView: 3,
                    slidesPerGroup: 1,
                },
                1200: {
                    slidesPerView: 3.5,
                    slidesPerGroup: 1,
                },
                1400: {
                    slidesPerView: 4,
                    slidesPerGroup: 1,
                },
            },
        });
    }

    if (document.querySelector(".testi-slide-14")) {
        var testimonial = new Swiper(".testi-slide-14", {
            slidesPerView: 2,
            spaceBetween: 24,
            loop: true,
            centeredSlides: false,
            autoplay: true,
            centerMode: true,
            speed: 1000,
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                    spaceBetween: 20,
                },
                767: {
                    slidesPerView: 1.5,
                    slidesPerGroup: 1,
                    spaceBetween: 25,
                },
                992: {
                    slidesPerView: 2,
                    slidesPerGroup: 1,
                },
            },
        });
    }

    if (document.querySelector(".project-slide-14")) {
        var testimonial = new Swiper(".project-slide-14", {
            slidesPerView: 4,
            spaceBetween: 30,
            loop: true,
            centeredSlides: false,
            autoplay: true,
            centerMode: true,
            speed: 1000,
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                    spaceBetween: 20,
                },
                767: {
                    slidesPerView: 1.5,
                    slidesPerGroup: 1,
                    spaceBetween: 25,
                },
                992: {
                    slidesPerView: 2,
                    slidesPerGroup: 1,
                },
                1200: {
                    slidesPerView: 3,
                    slidesPerGroup: 1,
                },
                1400: {
                    slidesPerView: 3.5,
                    slidesPerGroup: 1,
                },
                1600: {
                    slidesPerView: 4,
                },
            },
        });
    }

    if (document.querySelector(".service-slide-14")) {
        var testimonial = new Swiper(".service-slide-14", {
            slidesPerView: 4,
            spaceBetween: 30,
            loop: true,
            centeredSlides: false,
            autoplay: true,
            centerMode: true,
            speed: 1000,
            navigation: {
                nextEl: ".service-slide-14-button .swiper-prev",
                prevEl: ".service-slide-14-button .swiper-next",
            },
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                    spaceBetween: 20,
                },
                767: {
                    slidesPerView: 2,
                    slidesPerGroup: 1,
                    spaceBetween: 25,
                },
                992: {
                    slidesPerView: 2.5,
                    slidesPerGroup: 1,
                },
                1200: {
                    slidesPerView: 3,
                    slidesPerGroup: 1,
                },
                1400: {
                    slidesPerView: 4,
                    slidesPerGroup: 1,
                },
                1600: {
                    slidesPerView: 4,
                },
            },
        });
    }

    if (document.querySelector(".testi-slide-15")) {
        var testimonial = new Swiper(".testi-slide-15", {
            slidesPerView: 3,
            spaceBetween: 30,
            loop: true,
            centeredSlides: true,
            autoplay: true,
            centerMode: true,
            speed: 1000,
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                    spaceBetween: 20,
                },
                767: {
                    slidesPerView: 1.7,
                    slidesPerGroup: 1,
                    spaceBetween: 25,
                },
                992: {
                    slidesPerView: 2,
                    slidesPerGroup: 1,
                },
                1200: {
                    slidesPerView: 2.5,
                    slidesPerGroup: 1,
                },
                1600: {
                    slidesPerView: 3,
                    slidesPerGroup: 1,
                },
            },
        });
    }

    if (document.querySelector(".brand-slide-15-active")) {
        document.addEventListener("DOMContentLoaded", function () {
            var swiper = new Swiper(".brand-slide-15-active", {
                slidesPerView: 'auto',
                spaceBetween: 160,
                centeredSlides: true,
                speed: 5000,
                loop: true,
                freeMode: false,
                allowTouchMove: false,
                autoplay: {
                    delay: 1,
                },
                breakpoints: {
                    320: {
                        spaceBetween: 40,
                    },
                    767: {
                        spaceBetween: 70,
                    },
                    992: {
                        spaceBetween: 160,
                    },
                },
            });
        });
    }
    // brand slider
    var swiper = new Swiper(".h1-brand__slider", {
        slidesPerView: "auto",
        spaceBetween: 30,
        centeredSlides: true,
        freemode: true,
        centeredSlides: true,
        loop: true,
        speed: 8000,
        allowTouchMove: false,
        autoplay: {
            delay: 1,
            disableOnInteraction: true,
        }
    });


    if (document.querySelector(".project-16-active")) {
        var swiperTesti = new Swiper(".project-16-active", {
            slidesPerView: 3,
            centeredSlides: true,
            spaceBetween: 40,
            loop: true,

            grabCursor: true,
            speed: 300,
            navigation: {
                nextEl: ".rr-swiper-button-next",
                prevEl: ".rr-swiper-button-prev",
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            breakpoints: {
                300: {
                    slidesPerView: 1,
                },
                576: {
                    slidesPerView: 1,
                },
                768: {
                    slidesPerView: 2,
                },
                993: {
                    slidesPerView: 3,
                },
                1200: {
                    slidesPerView: 2.8,
                },
            }
        });
    }

    // 20. panel pin section //
    let pr = gsap.matchMedia();
    pr.add("(min-width: 1199px)", () => {
        let tl = gsap.timeline();
        let panels = document.querySelectorAll('.rr-panel-pin')
        panels.forEach((section, index) => {
            tl.to(section, {
                scrollTrigger: {
                    trigger: section,
                    pin: section,
                    scrub: 1,
                    start: 'top 12%',
                    end: "bottom 99%",
                    endTrigger: '.rr-panel-pin-area',
                    pinSpacing: false,
                    markers: false,
                },
            })
        })
    });

    // Testimonial carousel 16 — cards slider with fast auto slide
    (function () {
        var AUTOPLAY_DELAY = 2200;
        var TRANSITION_SPEED = 450;

        function clearTestimonialSlideTimer(carouselEl) {
            if (carouselEl && carouselEl._gcSlideTimer) {
                clearInterval(carouselEl._gcSlideTimer);
                carouselEl._gcSlideTimer = null;
            }
        }

        function startTestimonialSlideTimer(carouselEl, swiper) {
            clearTestimonialSlideTimer(carouselEl);

            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                return;
            }

            carouselEl._gcSlideTimer = setInterval(function () {
                if (!swiper || swiper.destroyed) {
                    clearTestimonialSlideTimer(carouselEl);
                    return;
                }

                swiper.slideNext();
            }, AUTOPLAY_DELAY);
        }

        function bindTestimonialHover(carouselEl) {
            if (carouselEl.dataset.gcHoverBound === "1") {
                return;
            }

            carouselEl.dataset.gcHoverBound = "1";

            carouselEl.addEventListener("mouseenter", function () {
                clearTestimonialSlideTimer(carouselEl);
            });

            carouselEl.addEventListener("mouseleave", function () {
                if (carouselEl._gcSwiper) {
                    startTestimonialSlideTimer(carouselEl, carouselEl._gcSwiper);
                }
            });
        }

        function initTestimonialCarousel16() {
            if (typeof Swiper === "undefined") {
                return null;
            }

            var carousels = document.querySelectorAll(".testimonial-carousel-16");
            if (!carousels.length) {
                return null;
            }

            var instances = [];

            carousels.forEach(function (carouselEl) {
                clearTestimonialSlideTimer(carouselEl);

                if (carouselEl.swiper) {
                    carouselEl.swiper.destroy(true, true);
                }

                var sectionEl = carouselEl.closest(".testimonial-section-16-area")
                    || carouselEl.closest(".gc-social-testimonial")
                    || document;
                var paginationEl = sectionEl.querySelector(".swiper-pagination");
                var nextEl = sectionEl.querySelector(".swiper-next");
                var prevEl = sectionEl.querySelector(".swiper-prev");

                var swiper = new Swiper(carouselEl, {
                    slidesPerView: 1,
                    spaceBetween: 24,
                    loop: true,
                    loopAdditionalSlides: 3,
                    speed: TRANSITION_SPEED,
                    grabCursor: true,
                    effect: "cards",
                    cardsEffect: {
                        slideShadows: false,
                        rotate: false,
                        perSlideOffset: 8,
                    },
                    observer: true,
                    observeParents: true,
                    watchOverflow: false,
                    navigation: nextEl && prevEl ? {
                        nextEl: nextEl,
                        prevEl: prevEl,
                    } : undefined,
                    pagination: paginationEl ? {
                        el: paginationEl,
                        clickable: true,
                    } : undefined,
                });

                carouselEl._gcSwiper = swiper;
                bindTestimonialHover(carouselEl);

                requestAnimationFrame(function () {
                    swiper.update();
                    startTestimonialSlideTimer(carouselEl, swiper);
                });
                instances.push(swiper);
            });

            return instances.length === 1 ? instances[0] : instances;
        }

        function bootTestimonialCarousel16() {
            initTestimonialCarousel16();
        }

        document.addEventListener("gc:preloader-done", function () {
            setTimeout(bootTestimonialCarousel16, 350);
        });

        $(window).on("load", function () {
            setTimeout(bootTestimonialCarousel16, 1500);
        });

        if (!document.getElementById("preloader")) {
            setTimeout(bootTestimonialCarousel16, 200);
        }
    })();

    // team-17-active
    var swiperTesti = new Swiper(".team-17-active", {
        slidesPerView: 3,
        centeredSlides: true,
        spaceBetween: 30,
        loop: true,
        grabCursor: true,
        speed: 600,
        navigation: {
            nextEl: ".rr-swiper-button-next",
            prevEl: ".rr-swiper-button-prev",
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        breakpoints: {
            300: {
                slidesPerView: 1,
            },
            576: {
                slidesPerView: 2,
            },
            768: {
                slidesPerView: 3,
            },
            1024: {
                slidesPerView: 3,
                slidesPerGroup: 1,
            },
            1400: {
                slidesPerView: 4,
                slidesPerGroup: 1,
            },
            1650: {
                slidesPerView: 5,
                slidesPerGroup: 1,
            },
        }
    });

    // testimonial-17-active

    var swiperTesti = new Swiper(".testimonial-17-active", {
        slidesPerView: 2,
        spaceBetween: 30,
        slidesPerGroup: 1,
        loop: true,
        // autoplay: true,
        grabcursor: true,
        speed: 600,
        navigation: {
            nextEl: ".rr-swiper-next",
            prevEl: ".rr-swiper-prev",
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        breakpoints: {
            300: {
                slidesPerView: 1,
            },
            576: {
                slidesPerView: 1,
                spaceBetween: 15,
            },
            768: {
                slidesPerView: 1,
            },
            992: {
                slidesPerView: 2,
            },
            1200: {
                slidesPerView: 2,
            },
            1600: {
                slidesPerView: 2,
            },
        }

    });


    if (document.querySelector(".project-section-17__item")) {
        const items = document.querySelectorAll(".project-section-17__item");
        let activeItem = items[0];
        activeItem.classList.add("active");

        items.forEach((item) => {
            item.addEventListener("mouseenter", () => {
                items.forEach((el) => el.classList.remove("active"));
                item.classList.add("active");
                activeItem = item;
            });

            item.addEventListener("mouseleave", () => {
                items.forEach((el) => el.classList.remove("active"));
                activeItem.classList.add("active");
            });
        });
    }

    $(function () {
        if ($('.st-award-wrapper').length > 0) {
            $('.st-award-wrapper .ar-award-item').on("mouseenter", function () {
                let thumbClass = $(this).attr('rel');
                $('#st-award-thumb').removeClass().addClass(thumbClass);
                $(this).addClass('active').siblings().removeClass('active');
                $('.st-award-thumb-shape').removeClass('current');
                let shapeNumber = thumbClass.split('-').pop();
                $('.st-award-thumb-shape.shape-' + shapeNumber).addClass('current');
            });
        }
    });

    // service-section-19
    const numberBox = document.querySelector(".service-section-19 .number h3");
    const serviceItems = document.querySelectorAll(".service-section-19-content-box .content");

    serviceItems.forEach(item => {
        item.addEventListener("mouseenter", () => {
            const num = item.getAttribute("data-number");
            numberBox.textContent = num;
        });

        item.addEventListener("mouseleave", () => {
            numberBox.textContent = "01";
        });
    });

    // text-slider-active
    var swiper = new Swiper(".text-slider-active", {
        slidesPerView: 'auto',
        freemode: true,
        centeredSlidea: true,
        loop: true,
        speed: 8000,
        allowTouchMove: false,
        autoplay: {
            delay: 1,
            disableOnInteraction: true,
        },

    });

    //  testimonial-18-active

    var swiperTesti = new Swiper(".testimonial-18-active", {
        slidesPerView: 2,
        spaceBetween: 30,
        slidesPerGroup: 2,
        loop: true,
        autoplay: true,
        grabcursor: true,
        speed: 600,
        navigation: {
            nextEl: ".rr-swiper-button-next",
            prevEl: ".rr-swiper-button-prev",
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
                slidesPerGroup: 1,
                spaceBetween: 25,
            },
            767: {
                slidesPerView: 1,
                slidesPerGroup: 1,
                spaceBetween: 30,
            },
            1024: {
                slidesPerView: 1,
                slidesPerGroup: 1,
            },
        },

    });

    // testimonial-19-slider
    var slider = new Swiper('.testimonial-19-slider__active', {
        slidesPerView: 1,
        centeredSlides: true,
        loop: true,
        speed: 1000,
        loopedSlides: 6,
        spaceBetween: 20,
        autoplay: true,
        pagination: {
            el: ".banner-slider__pagination",
            clickable: true,
        },
    });

    var thumbs = new Swiper('.testimonial-19-slider__gallery', {
        slidesPerView: "3",
        spaceBetween: 9,
        centeredSlides: true,
        loop: true,
        slideToClickedSlide: true,
    });

    slider.controller.control = thumbs;
    thumbs.controller.control = slider;

    // Rotation animation
    if (document.querySelectorAll(".service-section-18__item").length > 0) {
        const steps = gsap.utils.toArray(".service-section-18__item .step");
        const centerTitle = document.querySelector(".service-section-18__center-content .title");
        const centerDesc = document.querySelector(".service-section-18__center-content .decs");

        ScrollTrigger.matchMedia({
            // For screens larger than 576px
            "(min-width: 768px)": function () {
                gsap.to(".service-section-18__item", {
                    rotation: 360,
                    ease: "none",
                    scrollTrigger: {
                        trigger: ".service-section-18__area",
                        start: "top top",
                        end: "+=1000",
                        scrub: true,
                        pin: true,
                        onUpdate: (self) => {
                            const progress = self.progress; // 0 - 1
                            const totalSteps = steps.length;
                            const activeIndex = Math.floor(progress * totalSteps);
                            const step = steps[activeIndex % totalSteps];

                            if (step) {
                                centerTitle.textContent = step.dataset.title;
                                centerDesc.textContent = step.dataset.desc;
                            }
                        }
                    }
                });
            },

            // For screens 576px or smaller
            "(max-width: 767px)": function () {
                gsap.set(".service-section-18__item", { rotation: 0 });
                centerTitle.textContent = steps[0]?.dataset.title || "";
                centerDesc.textContent = steps[0]?.dataset.desc || "";
            }
        });
    }


    // portfolio-slide-19 + pin effect
    if (document.querySelectorAll(".portfolio-19").length > 0) {
        // Swiper init
        let portfolio19_activ = new Swiper(".portfolio-19-activ", {
            modules: [EffectSlicer],
            effect: 'slicer',
            clickable: true,
            slicerEffect: {
                split: 5,
            },
            direction: 'vertical',
            speed: 800,
            mousewheel: {
                releaseOnEdges: true,
            },

            on: {
                slideChangeTransitionStart: function () {
                    this.allowSlideNext = false;
                    this.allowSlidePrev = false;
                    this.mousewheel.disable();

                    let totalDuration = 500 + 500;
                    setTimeout(() => {
                        this.allowSlideNext = true;
                        this.allowSlidePrev = true;
                        this.mousewheel.enable();
                    }, totalDuration);
                },

                slideChange: function () {
                    var bullets = document.querySelectorAll(".swiper-pagination-bullet");
                    bullets.forEach((bullet, index) => {
                        if (index <= this.realIndex) {
                            bullet.classList.add("swiper-pagination-bullet-active");
                        }
                    });
                }
            }
        });

        // GSAP ScrollTrigger Pin (dynamic based on slides count)
        gsap.registerPlugin(ScrollTrigger);

        function createPinTrigger() {
            let totalSlides = portfolio19_activ.slides.length;

            let pinDuration = totalSlides * window.innerHeight;

            console.log("Total Slides:", totalSlides);
            console.log("Pin Duration:", pinDuration);

            ScrollTrigger.getAll().forEach(st => st.kill());

            ScrollTrigger.create({
                trigger: ".portfolio-section-19__wrap",
                start: "top top",
                end: "+=" + pinDuration,
                pin: true,
                scrub: true,
                markers: false
            });
        }

        createPinTrigger();

        // resize এ recalculation
        window.addEventListener("resize", () => {
            createPinTrigger();
        });
    }

    function createPinTrigger() {
        let totalSlides = portfolio19_activ.slides.length;
        let swiperHeight = document.querySelector(".portfolio-19-activ").offsetHeight;
        let pinDuration = totalSlides * swiperHeight;
        ScrollTrigger.getAll().forEach(st => st.kill());
        ScrollTrigger.create({
            trigger: ".portfolio-section-19__wrap",
            start: "top top",
            end: "+=" + pinDuration,
            pin: true,
            scrub: true,
            markers: false
        });
        let next = document.querySelector(".next-section");
        if (next) {
            next.style.marginTop = pinDuration + "px";
        }
    }

    // Hero Section 11 - 3D tilt on service cards
    const heroServiceCards = document.querySelectorAll(".hero-section-11 .hero-service-card");
    if (heroServiceCards.length) {
        heroServiceCards.forEach(function (card) {
            const inner = card.querySelector(".service-card-3d");
            if (!inner) return;

            card.addEventListener("mousemove", function (e) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -12;
                const rotateY = ((x - centerX) / centerX) * 12;
                inner.style.transform = "rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) translateZ(12px)";
            });

            card.addEventListener("mouseleave", function () {
                inner.style.transform = "";
            });
        });
    }

    /*======================================
        Contact form AJAX
    ========================================*/
    var $contactForm = $('#ajax_contact');
    if ($contactForm.length) {
        var $formMessages = $('#form-messages');

        $contactForm.on('submit', function (event) {
            event.preventDefault();

            $.ajax({
                type: 'POST',
                url: $contactForm.attr('action'),
                data: $contactForm.serialize()
            })
                .done(function (response) {
                    $formMessages.removeClass('alert-danger').addClass('alert-success').text(response);
                    $('#fullname').val('');
                    $('#email').val('');
                    $('#phone').val('');
                    $('#message').val('');
                })
                .fail(function (data) {
                    $formMessages.removeClass('alert-success').addClass('alert-danger');
                    if (data.responseText !== '') {
                        $formMessages.text(data.responseText);
                    } else {
                        $formMessages.text('Oops! An error occured and your message could not be sent.');
                    }
                });
        });
    }

    /*======================================
        Graphics Solutions — price calculator
    ========================================*/
    var gcCalculatorServices = {
        "photo-retouching": {
            name: "Photo Retouching",
            unit: "image",
            basePrice: 1.2,
            preview: [
                getThemeAsset("assets/img/service/service-1.jpg"),
                getThemeAsset("assets/img/new-update/hero-img-1.png")
            ]
        },
        "background-removal": {
            name: "Background Removal",
            unit: "image",
            basePrice: 0.85,
            preview: [
                getThemeAsset("assets/img/new-update/hero-img-2.png"),
                getThemeAsset("assets/img/service/service-2.jpg")
            ]
        },
        "image-masking": {
            name: "Image Masking",
            unit: "image",
            basePrice: 1.5,
            preview: [
                getThemeAsset("assets/img/new-update/hero-img-3.png"),
                getThemeAsset("assets/img/service/service-3.jpg")
            ]
        },
        "clipping-path": {
            name: "Clipping Path",
            unit: "image",
            basePrice: 0.75,
            preview: [
                getThemeAsset("assets/img/new-update/hero-img-4.png"),
                getThemeAsset("assets/img/service/service-1.jpg")
            ]
        },
        "color-correction": {
            name: "Color Correction",
            unit: "image",
            basePrice: 1.0,
            preview: [
                getThemeAsset("assets/img/new-update/service-img-1.png"),
                getThemeAsset("assets/img/new-update/project-img-2.png")
            ]
        },
        "shadow-creation": {
            name: "Shadow Creation",
            unit: "image",
            basePrice: 0.95,
            preview: [
                getThemeAsset("assets/img/new-update/project-img-1.png"),
                getThemeAsset("assets/img/new-update/project-img-2.png")
            ]
        }
    };

    function gcGetDiscountRate(quantity) {
        if (quantity >= 500) return 0.15;
        if (quantity >= 100) return 0.1;
        if (quantity >= 25) return 0.05;
        return 0;
    }

    function gcFormatMoney(value) {
        return "$" + value.toFixed(2);
    }

    function gcFormatUnitPrice(value) {
        return "$ " + value.toFixed(2);
    }

    function initGraphicsPriceCalculator() {
        var calculator = document.querySelector(".gc-price-calculator-section");
        if (!calculator || calculator.dataset.gcCalculatorReady === "true") {
            return;
        }

        calculator.dataset.gcCalculatorReady = "true";

        var serviceSelect = document.getElementById("gc-service-select");
        var quantityInput = document.getElementById("gc-quantity-input");
        var completeBtn = document.getElementById("gc-complete-quote-btn");
        var previewImage1 = document.getElementById("gc-preview-image-1");
        var previewImage2 = document.getElementById("gc-preview-image-2");
        var resultPanel = calculator.querySelector(".gc-price-calculator-result");
        var unitPriceEl = calculator.querySelector(".gc-unit-price");
        var quantityLabelEl = calculator.querySelector(".gc-quantity-label");
        var serviceLabelEl = calculator.querySelector(".gc-service-label");
        var discountRowEl = calculator.querySelector(".gc-discount-row");
        var discountLabelEl = calculator.querySelector(".gc-discount-label");
        var subtotalRowEl = calculator.querySelector(".gc-subtotal-row");
        var subtotalPriceEl = calculator.querySelector(".gc-subtotal-price");
        var estimatedPriceEl = document.getElementById("gc-estimated-price");

        function getQuantity() {
            var quantity = parseInt(quantityInput.value, 10);
            if (isNaN(quantity) || quantity < 1) {
                quantity = 1;
            }
            if (quantity > 99999) {
                quantity = 99999;
            }
            quantityInput.value = quantity;
            return quantity;
        }

        function getSelectedService() {
            return gcCalculatorServices[serviceSelect.value] || gcCalculatorServices["photo-retouching"];
        }

        function toggleRow(row, visible) {
            if (!row) return;
            row.classList.toggle("is-hidden", !visible);
        }

        function setPreviewImage(imgEl, src, alt) {
            if (!imgEl || imgEl.getAttribute("src") === src) {
                if (imgEl) imgEl.alt = alt;
                return;
            }

            imgEl.classList.add("is-swapping");
            imgEl.onload = function () {
                imgEl.classList.remove("is-swapping");
            };
            imgEl.onerror = function () {
                imgEl.classList.remove("is-swapping");
            };
            imgEl.src = src;
            imgEl.alt = alt;
        }

        function updateCalculator() {
            var service = getSelectedService();
            var quantity = getQuantity();
            var discountRate = gcGetDiscountRate(quantity);
            var subtotal = service.basePrice * quantity;
            var discountAmount = subtotal * discountRate;
            var estimated = subtotal - discountAmount;
            var unitLabel = quantity === 1 ? service.unit : service.unit + "s";

            setPreviewImage(previewImage1, service.preview[0], service.name + " preview 1");
            setPreviewImage(previewImage2, service.preview[1], service.name + " preview 2");

            unitPriceEl.textContent = gcFormatUnitPrice(service.basePrice);
            quantityLabelEl.textContent = quantity + " " + unitLabel;
            serviceLabelEl.textContent = service.name;

            if (discountRate > 0) {
                toggleRow(discountRowEl, true);
                toggleRow(subtotalRowEl, true);
                discountLabelEl.textContent = Math.round(discountRate * 100) + "% (-" + gcFormatMoney(discountAmount) + ")";
                subtotalPriceEl.textContent = gcFormatMoney(subtotal);
            } else {
                toggleRow(discountRowEl, false);
                toggleRow(subtotalRowEl, false);
            }

            estimatedPriceEl.textContent = gcFormatMoney(estimated);
            resultPanel.classList.add("is-updated");
            window.setTimeout(function () {
                resultPanel.classList.remove("is-updated");
            }, 350);
        }

        serviceSelect.addEventListener("change", updateCalculator);
        quantityInput.addEventListener("input", updateCalculator);
        quantityInput.addEventListener("change", updateCalculator);

        completeBtn.addEventListener("click", function () {
            updateCalculator();
            resultPanel.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });
        });

        updateCalculator();
    }

    /*======================================
        Graphics Solutions — free quote form
    ========================================*/
    var gcQuoteMaxFiles = 2;
    var gcQuoteMaxBytes = 256 * 1024 * 1024;

    function gcQuoteFormatSize(bytes) {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    }

    function initQuoteForm() {
        var $form = $("#gc-free-quote-form");
        var $zone = $("#gc-upload-zone");
        var $input = $("#gc-quote-files");
        var $browse = $("#gc-upload-browse");
        var $list = $("#gc-upload-file-list");

        if (!$form.length) return;

        var files = [];

        function syncInput() {
            if (!window.DataTransfer) return;
            var dt = new DataTransfer();
            files.forEach(function (file) {
                dt.items.add(file);
            });
            $input[0].files = dt.files;
        }

        function renderFiles() {
            $list.empty();
            if (!files.length) {
                $zone.removeClass("has-files");
                return;
            }

            $zone.addClass("has-files");
            files.forEach(function (file, index) {
                var $item = $("<li/>").addClass("gc-upload-file-item");
                $item.append($("<span/>").addClass("gc-upload-file-name").text(file.name));
                $item.append($("<span/>").addClass("gc-upload-file-size").text(gcQuoteFormatSize(file.size)));
                $item.append(
                    $("<button/>", {
                        type: "button",
                        class: "gc-upload-file-remove",
                        "aria-label": "Remove " + file.name,
                        html: '<i class="fa-regular fa-xmark"></i>'
                    }).on("click", function () {
                        files.splice(index, 1);
                        syncInput();
                        renderFiles();
                    })
                );
                $list.append($item);
            });
        }

        function addFiles(fileList) {
            Array.prototype.forEach.call(fileList, function (file) {
                if (files.length >= gcQuoteMaxFiles) return;
                if (file.size > gcQuoteMaxBytes) {
                    window.alert(file.name + " exceeds the 256 MB limit.");
                    return;
                }
                var duplicate = files.some(function (existing) {
                    return existing.name === file.name && existing.size === file.size;
                });
                if (!duplicate) files.push(file);
            });
            syncInput();
            renderFiles();
        }

        $browse.on("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            $input.trigger("click");
        });

        $input.on("change", function () {
            addFiles(this.files);
        });

        $zone.on("click", function (e) {
            if ($(e.target).closest(".gc-upload-browse, .gc-upload-file-remove").length) return;
            $input.trigger("click");
        });

        $zone.on("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                $input.trigger("click");
            }
        });

        $zone.on("dragover dragenter", function (e) {
            e.preventDefault();
            e.stopPropagation();
            $zone.addClass("is-dragover");
        });

        $zone.on("dragleave dragend drop", function (e) {
            e.preventDefault();
            e.stopPropagation();
            $zone.removeClass("is-dragover");
        });

        $zone.on("drop", function (e) {
            var dt = e.originalEvent.dataTransfer;
            if (dt && dt.files) addFiles(dt.files);
        });

        $form.on("submit", function (e) {
            e.preventDefault();
            if (!$form[0].checkValidity()) {
                $form[0].reportValidity();
                return;
            }
            var $btn = $form.find(".gc-free-quote-submit");
            var originalText = $btn.text();
            $btn.prop("disabled", true).text("Sending...");
            window.setTimeout(function () {
                $btn.prop("disabled", false).text(originalText);
                window.alert("Thank you! Your quote request has been received. We will get back to you shortly.");
                $form[0].reset();
                files = [];
                renderFiles();
                syncInput();
            }, 900);
        });
    }

    /*======================================
        Graphics Solutions — portfolio gallery
    ========================================*/
    function initPortfolioGallery() {
        var section = document.querySelector(".gc-portfolio-gallery-section");
        if (!section || section.dataset.gcGalleryReady === "true") {
            return;
        }

        section.dataset.gcGalleryReady = "true";

        var gridEl = section.querySelector(".gc-portfolio-grid");
        var gridWrap = section.querySelector(".gc-portfolio-grid-wrap");
        var items = section.querySelectorAll(".gc-portfolio-grid-item");
        var tabs = section.querySelectorAll(".gc-portfolio-tab");
        var cardTimers = [];
        var filterTimers = [];
        var filterToken = 0;

        function clearFilterTimers() {
            filterTimers.forEach(function (timerId) {
                window.clearTimeout(timerId);
            });
            filterTimers = [];
        }

        function resetFilterAnimationState() {
            gridEl.classList.remove("is-filtering-out", "is-filtering-in");
            gridWrap.classList.remove("is-tab-switching");
            items.forEach(function (item) {
                item.classList.remove("is-filter-in");
                item.style.removeProperty("--gc-filter-delay");
            });
        }

        function scheduleFilterStep(callback, delay) {
            var timerId = window.setTimeout(callback, delay);
            filterTimers.push(timerId);
            return timerId;
        }

        function setCardActiveImage(card, index, persistState) {
            var imgs = card.querySelectorAll(".gc-portfolio-card-img");
            var dots = card.querySelectorAll(".gc-portfolio-card-dots span");
            imgs.forEach(function (img, i) {
                img.classList.toggle("is-active", i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("is-active", i === index);
            });
            if (persistState !== false) {
                card.dataset.activeIndex = String(index);
            }
        }

        function getCardActiveIndex(card) {
            return Number(card.dataset.activeIndex || 0);
        }

        function initDualImageCards() {
            cardTimers.forEach(clearInterval);
            cardTimers = [];

            section.querySelectorAll(".gc-portfolio-card").forEach(function (card, index) {
                var imgs = card.querySelectorAll(".gc-portfolio-card-img");
                if (imgs.length < 2 || card.dataset.gcDualReady === "true") {
                    return;
                }

                card.dataset.gcDualReady = "true";
                setCardActiveImage(card, 0);

                var timer = window.setInterval(function () {
                    if (card.classList.contains("is-hover-preview")) {
                        return;
                    }
                    var nextIndex = getCardActiveIndex(card) === 0 ? 1 : 0;
                    setCardActiveImage(card, nextIndex);
                }, 3000 + (index % 4) * 400);

                cardTimers.push(timer);

                card.addEventListener("mouseenter", function () {
                    card.classList.add("is-hover-preview");
                    var activeIndex = getCardActiveIndex(card);
                    var previewIndex = activeIndex === 0 ? 1 : 0;
                    setCardActiveImage(card, previewIndex, false);
                });

                card.addEventListener("mouseleave", function () {
                    card.classList.remove("is-hover-preview");
                    setCardActiveImage(card, getCardActiveIndex(card), false);
                });
            });
        }

        function applyFilter(filter) {
            filterToken += 1;
            var token = filterToken;

            clearFilterTimers();
            resetFilterAnimationState();

            items.forEach(function (item) {
                var category = item.getAttribute("data-category");
                var show = filter === "all" || category === filter;
                item.classList.toggle("is-hidden", !show);
                item.classList.remove("is-filter-in");
            });

            gridWrap.classList.add("is-tab-switching");
            gridEl.classList.add("is-filtering-in");

            var visibleItems = section.querySelectorAll(".gc-portfolio-grid-item:not(.is-hidden)");
            visibleItems.forEach(function (item, i) {
                item.style.setProperty("--gc-filter-delay", (i * 0.07) + "s");
                item.classList.add("is-filter-in");
            });

            scheduleFilterStep(function () {
                if (token !== filterToken) {
                    return;
                }

                gridEl.classList.remove("is-filtering-in");
                items.forEach(function (item) {
                    item.classList.remove("is-filter-in");
                    item.style.removeProperty("--gc-filter-delay");
                });
                gridWrap.classList.remove("is-tab-switching");
            }, 720);
        }

        initDualImageCards();

        tabs.forEach(function (tab) {
            tab.addEventListener("click", function () {
                var filter = tab.getAttribute("data-filter");

                tabs.forEach(function (item) {
                    var isActive = item === tab;
                    item.classList.toggle("active", isActive);
                    item.setAttribute("aria-selected", isActive ? "true" : "false");
                });

                applyFilter(filter);
            });
        });
    }

    function initGcServiceCardCompare() {
        var cards = document.querySelectorAll(".gc-service-card[data-compare]");
        if (!cards.length) {
            return;
        }

        var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        cards.forEach(function (card) {
            if (card.dataset.gcCompareReady === "true") {
                return;
            }

            var compare = card.querySelector(".gc-service-card-compare");
            var view = card.querySelector(".gc-service-card-compare-view");
            if (!compare || !view) {
                return;
            }

            card.dataset.gcCompareReady = "true";

            function setPosition(percent) {
                var clamped = Math.max(0, Math.min(100, percent));
                view.style.setProperty("--compare-x", clamped + "%");
            }

            function updateFromPointer(clientX) {
                var rect = view.getBoundingClientRect();
                if (!rect.width) {
                    return;
                }

                var x = ((clientX - rect.left) / rect.width) * 100;
                setPosition(x);
            }

            function activateCompare(clientX) {
                card.classList.add("is-compare-active");
                view.classList.add("is-comparing");
                compare.setAttribute("aria-hidden", "false");

                if (typeof clientX === "number") {
                    updateFromPointer(clientX);
                } else {
                    setPosition(50);
                }
            }

            function deactivateCompare() {
                card.classList.remove("is-compare-active");
                view.classList.remove("is-comparing");
                compare.setAttribute("aria-hidden", "true");
                setPosition(50);
            }

            card.addEventListener("mouseenter", function (e) {
                activateCompare(e.clientX);
            });

            card.addEventListener("mousemove", function (e) {
                if (!card.classList.contains("is-compare-active")) {
                    return;
                }

                updateFromPointer(e.clientX);
            });

            card.addEventListener("mouseleave", deactivateCompare);

            view.addEventListener("pointerdown", function (e) {
                if (e.target.closest(".gc-compare-details-btn")) {
                    return;
                }

                activateCompare(e.clientX);
                updateFromPointer(e.clientX);
                view.setPointerCapture(e.pointerId);
            });

            view.addEventListener("pointermove", function (e) {
                if (!card.classList.contains("is-compare-active")) {
                    return;
                }

                updateFromPointer(e.clientX);
            });

            view.addEventListener("pointerup", function (e) {
                if (view.hasPointerCapture(e.pointerId)) {
                    view.releasePointerCapture(e.pointerId);
                }
            });

            compare.addEventListener("touchstart", function (e) {
                if (!e.touches.length) {
                    return;
                }

                activateCompare(e.touches[0].clientX);
                updateFromPointer(e.touches[0].clientX);
            }, { passive: true });

            compare.addEventListener("touchmove", function (e) {
                if (!e.touches.length) {
                    return;
                }

                updateFromPointer(e.touches[0].clientX);
            }, { passive: true });

            compare.addEventListener("touchend", function (e) {
                if (e.target.closest(".gc-compare-details-btn")) {
                    return;
                }

                deactivateCompare();
            });

            if (reducedMotion) {
                setPosition(50);
            }
        });
    }

    function initPpcDashboardHero() {
        var card = document.querySelector(".gc-ppc-roi-section [data-ppc-dashboard], [data-ppc-dashboard]");
        if (!card || card.dataset.ppcDashboardReady === "true") {
            return;
        }

        card.dataset.ppcDashboardReady = "true";

        var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        var bars = card.querySelectorAll(".gc-ppc-metric-bar span[data-width]");
        var animated = false;

        function setBarScales(active) {
            bars.forEach(function (bar) {
                var scale = active
                    ? (parseFloat(bar.getAttribute("data-width")) || 0) / 100
                    : 0;
                bar.style.setProperty("--bar-scale", String(scale));
            });
        }

        function runBarAnimation() {
            if (animated || reducedMotion) {
                return;
            }

            animated = true;
            card.classList.add("is-live");

            requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                    setBarScales(true);
                });
            });
        }

        function startAfterPreloader() {
            window.setTimeout(runBarAnimation, 80);
        }

        setBarScales(reducedMotion);
        if (reducedMotion) {
            card.classList.add("is-live");
            animated = true;
            return;
        }

        setBarScales(false);

        if (window.__gcPreloaderDone) {
            startAfterPreloader();
            return;
        }

        document.addEventListener("gc:preloader-done", startAfterPreloader, { once: true });

        if (!document.getElementById("preloader")) {
            startAfterPreloader();
            return;
        }

        window.setTimeout(function () {
            if (!animated) {
                startAfterPreloader();
            }
        }, 3200);
    }

    function initGcFaqTabs() {
        var section = document.querySelector(".gc-faq-tabs-section");
        if (!section) {
            return;
        }

        var tabs = section.querySelectorAll(".gc-faq-tabs-btn");
        var items = section.querySelectorAll(".gc-faq-tabs-item");
        var emptyState = section.querySelector(".gc-faq-tabs-empty");

        function collapseOpenItems(hiddenItems) {
            hiddenItems.forEach(function (item) {
                var collapse = item.querySelector(".accordion-collapse.show");
                if (!collapse) {
                    return;
                }
                var btn = item.querySelector(".accordion-button");
                if (btn && !btn.classList.contains("collapsed")) {
                    btn.click();
                }
            });
        }

        function applyFilter(filter) {
            var visibleCount = 0;
            var hiddenItems = [];

            items.forEach(function (item) {
                var category = item.getAttribute("data-category");
                var show = filter === "all" || category === filter;
                item.classList.toggle("is-hidden", !show);
                if (show) {
                    visibleCount += 1;
                } else {
                    hiddenItems.push(item);
                }
            });

            collapseOpenItems(hiddenItems);

            if (emptyState) {
                emptyState.hidden = visibleCount > 0;
            }
        }

        tabs.forEach(function (tab) {
            tab.addEventListener("click", function () {
                var filter = tab.getAttribute("data-filter") || "all";

                tabs.forEach(function (btn) {
                    btn.classList.remove("is-active");
                    btn.setAttribute("aria-selected", "false");
                });

                tab.classList.add("is-active");
                tab.setAttribute("aria-selected", "true");
                applyFilter(filter);
            });
        });

        applyFilter("all");
    }

    function initFixedSideNavActive() {
        var nav = document.querySelector(".gc-fixed-side-nav");
        if (!nav) {
            return;
        }

        var page = window.location.pathname.split("/").pop() || "index.html";
        var sectionByPage = {
            "graphics-solutions.html": 1,
            "background-removal.html": 1,
            "photo-retouching.html": 1,
            "color-correction.html": 1,
            "ghost-effect.html": 1,
            "image-masking.html": 1,
            "vectorization.html": 1,
            "shadow-effect.html": 1,
            "restoration.html": 1,
            "graphics-solutions-inner.html": 1,
            "marketing-solutions.html": 3,
            "ppc-marketing-services.html": 3,
            "social-media-marketing.html": 3,
            "search-engine-optimization.html": 3,
            "email-marketing-solution.html": 3,
            "video-and-3d-solution.html": 4,
            "3d-animation-service.html": 4,
            "title-animation.html": 4,
            "3d-rendaring.html": 4,
        };

        var activeSection = sectionByPage[page];

        if (!activeSection) {
            return;
        }

        var item = nav.querySelector(".gc-fixed-side-nav-item--" + activeSection);
        if (!item) {
            return;
        }

        item.classList.add("is-active");
        var listItem = item.closest("li");
        if (listItem) {
            listItem.classList.add("is-active");
        }
    }

    function initGraphicsHeroSlider() {
        var sliderEl = document.querySelector(".gc-hero-service-slider");
        if (!sliderEl || typeof Swiper === "undefined") {
            return;
        }

        new Swiper(".gc-hero-service-slider", {
            slidesPerView: 1,
            spaceBetween: 24,
            loop: true,
            speed: 850,
            effect: "fade",
            fadeEffect: {
                crossFade: true,
            },
            autoplay: {
                delay: 4200,
                disableOnInteraction: false,
            },
            grabCursor: true,
            pagination: {
                el: ".gc-hero-slider-pagination",
                clickable: true,
            },
            navigation: {
                nextEl: ".gc-hero-slider-next",
                prevEl: ".gc-hero-slider-prev",
            },
        });
    }

    function initBgRemovalServiceCompare() {
        var cards = document.querySelectorAll(".gc-bg-removal-service-card[data-bg-removal-service-compare]");
        if (!cards.length) {
            return;
        }

        cards.forEach(function (card) {
            if (card.dataset.bgRemovalServiceCompareReady === "true") {
                return;
            }

            var compare = card.querySelector(".gc-bg-removal-service-compare");
            var view = card.querySelector(".gc-bg-removal-service-compare-view");
            if (!compare || !view) {
                return;
            }

            card.dataset.bgRemovalServiceCompareReady = "true";

            var rafId = null;
            var pendingClientX = null;
            var resetTimer = null;

            function setPosition(percent) {
                var clamped = Math.max(0, Math.min(100, percent));
                view.style.setProperty("--compare-x", clamped + "%");
            }

            function updateFromPointer(clientX) {
                var rect = view.getBoundingClientRect();
                if (!rect.width) {
                    return;
                }

                var x = ((clientX - rect.left) / rect.width) * 100;
                setPosition(x);
            }

            function schedulePointerUpdate(clientX) {
                pendingClientX = clientX;

                if (rafId !== null) {
                    return;
                }

                rafId = window.requestAnimationFrame(function () {
                    rafId = null;

                    if (pendingClientX === null) {
                        return;
                    }

                    updateFromPointer(pendingClientX);
                    pendingClientX = null;
                });
            }

            function startDragging() {
                if (resetTimer) {
                    window.clearTimeout(resetTimer);
                    resetTimer = null;
                }

                view.classList.remove("is-compare-resetting");
                view.classList.add("is-compare-dragging");
            }

            function resetPosition() {
                view.classList.remove("is-compare-dragging");
                view.classList.add("is-compare-resetting");
                setPosition(50);

                resetTimer = window.setTimeout(function () {
                    view.classList.remove("is-compare-resetting");
                    resetTimer = null;
                }, 340);
            }

            setPosition(50);

            compare.addEventListener("mouseenter", function (e) {
                startDragging();
                schedulePointerUpdate(e.clientX);
            });

            compare.addEventListener("mousemove", function (e) {
                schedulePointerUpdate(e.clientX);
            });

            view.addEventListener("pointerdown", function (e) {
                startDragging();
                schedulePointerUpdate(e.clientX);
                if (view.setPointerCapture) {
                    view.setPointerCapture(e.pointerId);
                }
            });

            view.addEventListener("pointermove", function (e) {
                if (!view.classList.contains("is-compare-dragging")) {
                    return;
                }

                schedulePointerUpdate(e.clientX);
            });

            view.addEventListener("pointerup", function (e) {
                if (view.hasPointerCapture && view.hasPointerCapture(e.pointerId)) {
                    view.releasePointerCapture(e.pointerId);
                }
            });

            compare.addEventListener("mouseleave", function () {
                if (rafId !== null) {
                    window.cancelAnimationFrame(rafId);
                    rafId = null;
                }

                pendingClientX = null;
                resetPosition();
            });

            compare.addEventListener("touchstart", function (e) {
                if (!e.touches.length) {
                    return;
                }

                startDragging();
                schedulePointerUpdate(e.touches[0].clientX);
            }, { passive: true });

            compare.addEventListener("touchmove", function (e) {
                if (!e.touches.length) {
                    return;
                }

                schedulePointerUpdate(e.touches[0].clientX);
            }, { passive: true });

            compare.addEventListener("touchend", function () {
                if (rafId !== null) {
                    window.cancelAnimationFrame(rafId);
                    rafId = null;
                }

                pendingClientX = null;
                resetPosition();
            });
        });
    }

    function initColorAccuracyShowcase() {
        var roots = document.querySelectorAll("[data-color-accuracy-showcase]");
        if (!roots.length) {
            return;
        }

        roots.forEach(function (root) {
            if (root.dataset.colorAccuracyReady === "true") {
                return;
            }

            var stage = root.querySelector("[data-color-stage]");
            var image = root.querySelector("[data-color-image]");
            var swatches = root.querySelectorAll(".gc-color-accuracy-swatch");

            if (!stage || !image || !swatches.length) {
                return;
            }

            root.dataset.colorAccuracyReady = "true";

            function setActiveSwatch(swatch) {
                swatches.forEach(function (item) {
                    var isActive = item === swatch;
                    item.classList.toggle("active", isActive);
                    item.setAttribute("aria-selected", isActive ? "true" : "false");
                });
            }

            function switchVariant(swatch) {
                var bg = swatch.getAttribute("data-bg");
                var img = swatch.getAttribute("data-image");
                var label = swatch.getAttribute("aria-label") || "Color corrected product";

                if (!bg || !img) {
                    return;
                }

                setActiveSwatch(swatch);
                root.classList.add("is-switching");

                stage.style.setProperty("--stage-bg", bg);
                image.src = img;
                image.alt = label;

                window.setTimeout(function () {
                    root.classList.remove("is-switching");
                }, 320);
            }

            swatches.forEach(function (swatch) {
                swatch.addEventListener("click", function () {
                    if (swatch.classList.contains("active")) {
                        return;
                    }

                    switchVariant(swatch);
                });
            });
        });
    }

    function initBgRemovalHeroCompare() {
        var root = document.querySelector("[data-bg-removal-compare]");
        if (!root || root.dataset.bgRemovalCompareReady === "true") {
            return;
        }

        var beforeImg = root.querySelector("[data-compare-before]");
        var afterImg = root.querySelector("[data-compare-after]");
        var tabs = root.querySelectorAll(".gc-bg-removal-tab");

        if (!beforeImg || !afterImg || !tabs.length) {
            return;
        }

        root.dataset.bgRemovalCompareReady = "true";

        function setActiveTab(tab) {
            tabs.forEach(function (item) {
                var isActive = item === tab;
                item.classList.toggle("active", isActive);
                item.setAttribute("aria-selected", isActive ? "true" : "false");
            });
        }

        function switchExample(tab) {
            var before = tab.getAttribute("data-before");
            var after = tab.getAttribute("data-after");
            var label = tab.getAttribute("data-label") || "Product";

            if (!before || !after) {
                return;
            }

            setActiveTab(tab);
            root.classList.add("is-switching");

            beforeImg.src = before;
            afterImg.src = after;
            beforeImg.alt = label + " before background removal";
            afterImg.alt = label + " after background removal";

            window.setTimeout(function () {
                root.classList.remove("is-switching");
            }, 320);
        }

        tabs.forEach(function (tab) {
            tab.addEventListener("click", function () {
                switchExample(tab);
            });
        });
    }

    function init3dAnimationHeroVideo() {
        var modal = document.getElementById("gc3dAnimVideoModal");
        if (!modal || modal.dataset.initialized === "true") {
            return;
        }

        modal.dataset.initialized = "true";

        var triggers = document.querySelectorAll(".gc-3d-anim-hero-visual, .gc-title-anim-hero-preview");
        var closeBtn = modal.querySelector(".gc-3d-anim-video-modal-close");
        var overlay = modal.querySelector("[data-close-modal]");
        var playBtn = modal.querySelector(".gc-3d-anim-video-play-btn");
        var poster = modal.querySelector(".gc-3d-anim-video-poster");
        var iframe = modal.querySelector(".gc-3d-anim-video-iframe");
        var videoId = "";

        function setPosterForVideo(id) {
            if (poster && id) {
                poster.style.backgroundImage = 'url("https://img.youtube.com/vi/' + id + '/hqdefault.jpg")';
            }
        }

        if (triggers.length && triggers[0].getAttribute("data-video")) {
            setPosterForVideo(triggers[0].getAttribute("data-video"));
        }

        function buildEmbedUrl(autoplay) {
            if (!videoId) {
                return "";
            }

            var url = "https://www.youtube.com/embed/" + videoId + "?rel=0&modestbranding=1&playsinline=1";
            if (autoplay) {
                url += "&autoplay=1";
            }
            return url;
        }

        function showPoster() {
            if (poster) {
                poster.classList.remove("is-hidden");
            }
        }

        function hidePoster() {
            if (poster) {
                poster.classList.add("is-hidden");
            }
        }

        function playVideo() {
            if (!iframe || !videoId) {
                return;
            }

            iframe.src = buildEmbedUrl(true);
            iframe.classList.add("is-visible");
            hidePoster();
        }

        function stopVideo() {
            if (iframe) {
                iframe.src = "";
                iframe.classList.remove("is-visible");
            }
            showPoster();
        }

        function openModal(id) {
            videoId = id || videoId;
            setPosterForVideo(videoId);
            modal.classList.add("is-open");
            modal.setAttribute("aria-hidden", "false");
            document.body.classList.add("gc-3d-anim-video-open");
            playVideo();
        }

        function closeModal() {
            modal.classList.remove("is-open");
            modal.setAttribute("aria-hidden", "true");
            document.body.classList.remove("gc-3d-anim-video-open");
            stopVideo();
        }

        triggers.forEach(function (triggerEl) {
            triggerEl.addEventListener("click", function () {
                openModal(triggerEl.getAttribute("data-video") || "");
            });
        });

        if (playBtn) {
            playBtn.addEventListener("click", function (event) {
                event.stopPropagation();
                playVideo();
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener("click", function (event) {
                event.stopPropagation();
                closeModal();
            });
        }

        if (overlay) {
            overlay.addEventListener("click", closeModal);
        }

        if (iframe) {
            iframe.addEventListener("load", hidePoster);
        }

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && modal.classList.contains("is-open")) {
                closeModal();
            }
        });
    }

    $(document).ready(function () {
        initGraphicsPriceCalculator();
        initQuoteForm();
        initPortfolioGallery();
        initGraphicsHeroSlider();
        initGcServiceCardCompare();
        initBgRemovalHeroCompare();
        initBgRemovalServiceCompare();
        initColorAccuracyShowcase();
        initFixedSideNavActive();
        initPpcDashboardHero();
        initGcFaqTabs();
        init3dAnimationHeroVideo();
    });

    $(window).on("load", function () {
        initGraphicsPriceCalculator();
        initPortfolioGallery();
        initGraphicsHeroSlider();
        initGcServiceCardCompare();
        initBgRemovalHeroCompare();
        initBgRemovalServiceCompare();
        initColorAccuracyShowcase();
    });

    $(document).ready(function () {
        function sliderAnimations(elements) {
            var animationEndEvents = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";
            elements.each(function () {
                var $this = $(this);
                var $animationDelay = $this.data("delay");
                var $animationDuration = $this.data("duration");
                var $animationType = "runok-animation " + $this.data("animation");
                $this.css({
                    "animation-delay": $animationDelay,
                    "-webkit-animation-delay": $animationDelay,
                    "animation-duration": $animationDuration,
                });
                $this.addClass($animationType).one(animationEndEvents, function () {
                    $this.removeClass($animationType);
                });
            });
        }
        var sliderOptions = {
            speed: 1500,
            autoplay: {
                delay: 7000,
            },
            disableOnInteraction: false,
            initialSlide: 0,
            parallax: false,
            mousewheel: false,
            loop: true,
            grabCursor: true,
            effect: "fade",
            navigation: {
                nextEl: ".slider-arrow .slider-next",
                prevEl: ".slider-arrow .slider-prev",
            },
            pagination: {
                el: ".runok-swiper-pagination",
                clickable: true,
            },
        };
        sliderOptions.on = {
            slideChangeTransitionStart: function () {
                var swiper = this;
                var animatingElements = $(swiper.slides[swiper.activeIndex]).find("[data-animation]");
                sliderAnimations(animatingElements);
            },

            resize: function () {
                this.update();
            },
        };

        var swiper = new Swiper(".runok-slider-2", sliderOptions);


        // Slider 1

        // Sliderthumb
        var sliderThumb = new Swiper(".slider-tab", {
            spaceBetween: 20,
            slidesPerView: 3,
        });
        var slider2Options = {
            speed: 1500,
            autoplay: {
                delay: 7000,
            },
            disableOnInteraction: false,
            initialSlide: 0,
            parallax: false,
            mousewheel: false,
            loop: true,
            grabCursor: true,
            effect: "fade",
            navigation: {
                nextEl: ".slider-arrow .slider-next",
                prevEl: ".slider-arrow .slider-prev",
            },
            thumbs: {
                swiper: sliderThumb,
            },
        };
        slider2Options.on = {
            slideChangeTransitionStart: function () {
                var swiper = this;
                var animatingElements = $(swiper.slides[swiper.activeIndex]).find("[data-animation]");
                sliderAnimations(animatingElements);
            },

            resize: function () {
                this.update();
            },
        };

        var swiper2 = new Swiper(".runok-slider", slider2Options);

        // Slider 3

        var sliderOptionsTwo = {
            speed: 1500,
            autoplay: {
                delay: 7000,
            },
            disableOnInteraction: false,
            initialSlide: 0,
            parallax: false,
            mousewheel: false,
            loop: true,
            grabCursor: true,
            navigation: {
                nextEl: ".slider-arrow .slider-next",
                prevEl: ".slider-arrow .slider-prev",
            },
            pagination: {
                el: ".runok-swiper-pagination-2",
                clickable: true,
                renderBullet: function (index, className) {
                    return '<span class="' + className + '">' + (index + 1) + "</span>";
                },
            },
        };
        sliderOptionsTwo.on = {
            slideChangeTransitionStart: function () {
                var swiper = this;
                var animatingElements = $(swiper.slides[swiper.activeIndex]).find("[data-animation]");
                sliderAnimations(animatingElements);
            },

            resize: function () {
                this.update();
            },
        };

        var swiperThree = new Swiper(".runok-slider-3", sliderOptionsTwo);

    });

    }

    function bootSoftroMain() {
        if (typeof window.jQuery === "undefined") {
            return false;
        }

        softroThemeInit(window.jQuery);
        return true;
    }

    if (!bootSoftroMain()) {
        let mainAttempts = 0;
        const mainTimer = setInterval(function () {
            mainAttempts += 1;

            if (bootSoftroMain() || mainAttempts >= 100) {
                clearInterval(mainTimer);
            }
        }, 50);
    }
})();
