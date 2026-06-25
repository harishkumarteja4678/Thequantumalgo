;(function ($) {
    'use strict';

    $(window).on("elementor/frontend/init", function () {

        // Sticky scripts
        const stickyHandler = function ($scope) {
            $.each($scope, function (index) {
                const $sticky = $(this),
                    $stickyH = $sticky.height(),
                    $stickyID = $sticky.data('id'),
                    $stickyPos = $sticky.position(),
                    $currStickyPos = $stickyPos.top + $stickyH,
                    $stickyAfter = '<div class="noxfolio-sticky-gap sticky-gap-' + $stickyID + '" style="height: ' + $stickyH + 'px"></div>';
                if ($sticky.hasClass('noxfolio-sticky')) {
                    $sticky.after($stickyAfter);
                    const $stickyGap = $('.sticky-gap-' + $stickyID + '');
                    $(window).on("scroll", function () {
                        if ($(this).scrollTop() < $currStickyPos) {
                            $sticky.removeClass('noxfolio-sticky-active');
                            $stickyGap.removeClass('active-sticky-gap');
                        } else {
                            $sticky.addClass('noxfolio-sticky-active');
                            $stickyGap.addClass('active-sticky-gap');
                        }
                    });
                }
            });
        };

        // Mini Search
        const miniSearchHandler = function ($scope, $) {
            $scope.find('.noxfolio-search-wrapper').each(function () {
                const selector = $(this),
                    searchIcon = selector.find('.search-icon'),
                    searchOverly = selector.find('.noxfolio-search-overly'),
                    searchClose = selector.find('.search-close');

                searchIcon.on('click', function (e) {
                    e.preventDefault();
                    console.log('hello');
                    selector.toggleClass('show-search-canvas');
                });

                searchOverly.on('click', function (e) {
                    e.preventDefault();
                    selector.removeClass('show-search-canvas');
                });

                searchClose.on('click', function (e) {
                    e.preventDefault();
                    selector.removeClass('show-search-canvas');
                });

            });
        };

        // Counter
        const counterHandler = function ($scope, $) {
            observeElement('.elementor-counter-number', function (element) {
                const $number = $(element),
                    data = $number.data();

                const decimalDigits = data.toValue.toString().match(/\.(.*)/);
                if (decimalDigits) {
                    data.rounding = decimalDigits[1].length;
                }

                $number.numerator(data);
            });
        };

        // Accordion
        const accordionHandler = function ($scope, $) {
            $scope.find(".noxfolio-accordion .accordion-item .accordion-header").on("click", function (e) {
                e.preventDefault();
                const target = $(this).data("target"),
                    parent = $(this).parents(".noxfolio-accordion"),
                    active_header = parent.find(".accordion-header.active-header");
                $.each(active_header, function (index, item) {
                    const item_target = $(item).data("target"),
                        active_content = parent.find(".accordion-content.active-content");

                    if (item_target != target) {
                        $(item).removeClass("active-header");
                        active_content.removeClass("active-content");
                        $(this).parent().removeClass("active-accordion");
                        $(item_target).slideUp(500);
                    }
                });
                $(this).parent().toggleClass("active-accordion");
                $(this).toggleClass("active-header");
                parent.find(".accordion-content").toggleClass('active-content');
                $(target).slideToggle(500);
            });
        };

        // Video box
        const videoBoxHandler = function () {
            $('.noxfolio-video-popup').each(function () {
                const selector = $(this),
                    videoBtn = selector.find('.popup-video');

                videoBtn.magnificPopup({
                    disableOn: 700,
                    type: 'iframe',
                    mainClass: 'mfp-fade',
                    removalDelay: 160,
                    preloader: false,
                    fixedContentPos: false
                });
            });
        };

        // OffCanvas
        const offCanvasHandler = function ($scope, $) {
            $scope.find('.noxfolio-offcanvas').each(function () {
                const selector = $(this),
                    toggle = selector.find('.offcanvas-toggle'),
                    overly = selector.find('.offcanvas-overly'),
                    close = selector.find('.offcanvas-close'),
                    wrapper = selector.find('.noxfolio-offcanvas-wrapper');

                toggle.on('click', function (e) {
                    wrapper.toggleClass('show-offcanvas');
                });
                overly.on('click', function (e) {
                    wrapper.removeClass('show-offcanvas');
                });
                close.on('click', function (e) {
                    wrapper.removeClass('show-offcanvas');
                });
            });
        };

        // Content Switcher
        const contentSwitcherHandler = function ($scope, $) {
            $scope.find('.noxfolio-content-switcher').each(function () {
                const selector = $(this),
                    toggleSwitch = selector.find('.switcher-input-label'),
                    input = selector.find('input.switcher-checkbox'),
                    primarySwitcher = selector.find('.primary-switch'),
                    secondarySwitcher = selector.find('.secondary-switch'),
                    primaryContent = selector.find('.primary-switch-content'),
                    secondaryContent = selector.find('.secondary-switch-content');

                toggleSwitch.on('click', function (e) {
                    if (input.is(':checked')) {
                        primarySwitcher.removeClass('active');
                        primaryContent.removeClass('active');
                        secondarySwitcher.addClass('active');
                        secondaryContent.addClass('active');
                    } else {
                        secondarySwitcher.removeClass('active');
                        secondaryContent.removeClass('active');
                        primarySwitcher.addClass('active');
                        primaryContent.addClass('active');
                    }
                });
            });
        };

        // Image Gallery
        const imageGalleryHandler = function ($scope, $) {
            $('.noxfolio-image-gallery').each(function () {
                const selector = $(this),
                    galleryImages = selector.find('.gallery-image-link').not('.slick-cloned .gallery-image-link');

                galleryImages.magnificPopup({
                    type: 'image',
                    gallery: {
                        enabled: true,
                    },
                    mainClass: 'mfp-fade'
                });
            });
        }

        // Common Observe.
        function observeElement(targetSelector, callback, options = {threshold: 0.5}) {
            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            // Call the provided callback when the element is visible
                            callback(entry.target);

                            // Stop observing if it's a one-time trigger
                            observer.unobserve(entry.target);
                        }
                    });
                }, options);

                // Observe all elements that match the selector
                document.querySelectorAll(targetSelector).forEach(el => observer.observe(el));
            } else {
                // Fallback for browsers that don't support IntersectionObserver
                document.querySelectorAll(targetSelector).forEach(el => callback(el));
            }
        }

        // Widget Handlers
        const widgetHandlers = {
            'noxfolio-mini-search.default': miniSearchHandler,
            'noxfolio-counter.default': counterHandler,
            'noxfolio-accordion.default': accordionHandler,
            'noxfolio-video-popup.default': videoBoxHandler,
            'noxfolio-offcanvas.default': offCanvasHandler,
            'noxfolio-content-switcher.default': contentSwitcherHandler,
            'noxfolio-image-gallery.default': imageGalleryHandler,
        };

        $.each(widgetHandlers, function (widgetName, handlerFn) {
            elementorFrontend.hooks.addAction('frontend/element_ready/' + widgetName, handlerFn);
        });

        elementorFrontend.hooks.addAction("frontend/element_ready/section", stickyHandler);
        elementorFrontend.hooks.addAction("frontend/element_ready/container", stickyHandler);
    });
})(jQuery);