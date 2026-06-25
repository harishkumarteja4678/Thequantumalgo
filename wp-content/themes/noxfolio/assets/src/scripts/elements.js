;(function ($) {
    'use strict';

    // Preloader
    function preloader() {
        const $preloader = $('#preloader');
        $preloader.find(".animation-preloader").fadeOut('slow');

        if ($preloader.length > 0) {
            $('.preloader-layer .overly').animate({
                'left': '100%'
            }, {
                step: function (now, fx) {
                    $(this).css({"transform": "translate3d(0px, 0px, 0px)"});
                },
                duration: 650,
                easing: 'linear',
                queue: false,
                complete: function () {
                    $preloader.fadeOut('slow');
                }
            }, 'linear');
        }
    }

    // Nav menu
    function navMenu() {
        $('.noxfolio-nav-menu').each(function () {
            const selector = $(this),
                navMenu = selector.find('.primary-menu'),
                navToggler = selector.find('.navbar-toggler'),
                slidePanel = selector.find('.slide-panel-wrapper'),
                slideOverly = selector.find('.slide-panel-overly'),
                panelClose = selector.find('.slide-panel-close'),
                panelMenu = selector.find('.slide-panel-menu'),
                showPanel = 'show-panel';

            const toggleMobileMenu = () => {
                navToggler.on('click', function (e) {
                    slidePanel.addClass(showPanel);
                    e.preventDefault();
                });
                panelClose.on('click', function (e) {
                    e.preventDefault();
                    slidePanel.removeClass(showPanel);
                });
                slideOverly.on('click', function (e) {
                    e.preventDefault();
                    slidePanel.removeClass(showPanel);
                });
                panelMenu.find('a').on('click', function (e) {
                    if ($(e.target).hasClass('submenu-toggler')) {
                        return;
                    }

                    if ($(this).attr('href').startsWith('#')) {
                        slidePanel.removeClass(showPanel);
                    }
                });
            }

            const showSubmenu = () => {
                const submenuActive = 'submenu-active',
                    submenuShow = 'show-submenu';

                slidePanel.find('.submenu-toggler').on('click', function (e) {
                    e.preventDefault();

                    let item = jQuery(this).parents('li');

                    if (!$(this).hasClass(submenuActive)) {
                        const menuItemHasChildren = $('.slide-panel-menu .menu-item-has-children');
                        menuItemHasChildren.not(item).find('.sub-menu').stop(true).slideUp(450).removeClass('show-submenu');
                        menuItemHasChildren.not(item).find('.submenu-toggler').removeClass(submenuActive);

                        $(this).parent().prev('.sub-menu').stop(true).slideDown(450).addClass(submenuShow);
                        $(this).parent().next('.sub-menu').stop(true).slideDown(450).addClass(submenuShow);
                    } else {
                        $(this).parent().prev('.sub-menu').stop(true).slideUp(450).removeClass(submenuShow);
                        $(this).parent().next('.sub-menu').stop(true).slideUp(450).removeClass(submenuShow);
                    }

                    $(this).toggleClass(submenuActive);
                });
            }

            // Init
            toggleMobileMenu();
            showSubmenu();
        });
    }

    // Back to Top
    function backToTop() {
        const options = {
            scrollTop: $(window).height(),
            scrollSpeed: 400,
        };
        const scroll_up = $('#backToTop');

        $(window).on('scroll', function () {
            if ($(window).scrollTop() > options.scrollTop) {
                scroll_up.addClass('active');
            } else {
                scroll_up.removeClass('active');
            }
        });

        scroll_up.on('click', function (e) {
            e.preventDefault();

            $('html,body').animate(
                {
                    scrollTop: 0,
                },
                options.scrollSpeed
            );
        });
    }

    // Site Popup
    function popup() {
        const popupWrap = $(".noxfolio-popup-wrapper"),
            popupDelay = popupWrap.data('delay') * 3000,
            delay = (popupDelay) ? popupDelay : 3000;

        if (popupWrap.length > 0) {
            setTimeout(function () {
                $(".noxfolio-popup-wrapper").addClass("show-popup");
                document.body.setAttribute("style", "overflow:hidden;");
            }, delay);


            $('.noxfolio-popup-wrapper .popup-close, .noxfolio-popup-wrapper .popup-overly').on('click', function () {
                if (!popupWrap.hasClass('editing')) {
                    popupWrap.removeClass('show-popup');
                }
                document.body.setAttribute("style", "overflow:auto;");
            })
        }
    }

    $(document).on('ready', function (e) {
        navMenu();
        backToTop();
        popup();
    })

    $(window).on('load', function () {
        preloader();
    });

    $(window).on("elementor/frontend/init", function () {
        elementorFrontend.hooks.addAction("frontend/element_ready/noxfolio-nav-menu.default", function () {
            if (window.elementorFrontend.isEditMode()) {
                navMenu();
            }
        });
    });
})(jQuery);