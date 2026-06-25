;(function ($) {
    'use strict';

    $(window).on("elementor/frontend/init", function () {
        const moduleHandler = elementorModules.frontend.handlers.Base;

        // Noxfolio Carousel
        const noxfolioCarousel = moduleHandler.extend({
            onInit: function onInit() {
                elementorModules.frontend.handlers.Base.prototype.onInit.apply(this, arguments);
                this.run();
            },
            getDefaultSettings: function getDefaultSettings() {
                const dotsWrap = this.findElement('.noxfolio-carousel-dots'),
                    prevButton = this.findElement('.noxfolio-prev-arrow'),
                    nextButton = this.findElement('.noxfolio-next-arrow');

                return {
                    autoplay: true,
                    arrows: false,
                    container: '.noxfolio-carousel-active',
                    dots: false,
                    infinite: true,
                    rows: 0,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    centerMode: true,
                    centerPadding: 0,
                    appendDots: dotsWrap,
                    prevArrow: prevButton,
                    nextArrow: nextButton,
                    vertical: false,
                    verticalSwiping: false,
                    fade: false,
                    adaptiveHeight: false
                };
            },
            getDefaultElements: function getDefaultElements() {
                return {
                    $container: this.findElement(this.getSettings('container'))
                };
            },
            getCarouselSettings: function getCarouselSettings() {
                let settings = {
                    infinite: !!this.getElementSettings('loop'),
                    autoplay: !!this.getElementSettings('autoplay'),
                    autoplaySpeed: this.getElementSettings('autoplay_speed'),
                    speed: this.getElementSettings('speed'),
                    arrows: !!this.getElementSettings('show_arrows'),
                    dots: !!this.getElementSettings('show_dots'),
                    pauseOnHover: !!this.getElementSettings('pause_on_hover'),
                    centerMode: !!this.getElementSettings('center_mode'),
                    slidesToShow: parseInt(this.getElementSettings('slides_per_view')) || 1,
                    slidesToScroll: parseInt(this.getElementSettings('slides_to_scroll')) || 1,
                    adaptiveHeight: !!this.getElementSettings('adaptive_height'),
                };

                if (!!this.getElementSettings('center_mode')) {
                    settings.centerPadding = this.getElementSettings('center_padding').size + this.getElementSettings('center_padding').unit;
                }

                let responsiveSettings = [];
                const breakpoints = elementorFrontend.config.responsive.activeBreakpoints;

                $.each(breakpoints, breakpointName => {
                    const slidesPerViewKey = 'slides_per_view' + ('desktop' === breakpointName ? '' : '_' + breakpointName),
                        slidesPerScrollKey = 'slides_to_scroll' + ('desktop' === breakpointName ? '' : '_' + breakpointName),
                        centerPaddingKew = 'center_padding' + ('desktop' === breakpointName ? '' : '_' + breakpointName);

                    const breakpoint_data = {
                        breakpoint: breakpoints[breakpointName].value + 1,
                        settings: {
                            slidesToShow: parseInt(this.getElementSettings(slidesPerViewKey)),
                            slidesToScroll: parseInt(this.getElementSettings(slidesPerScrollKey)),
                        }
                    }

                    if (!!this.getElementSettings('center_mode')) {
                        breakpoint_data.settings.centerPadding = this.getElementSettings(centerPaddingKew).size + this.getElementSettings(centerPaddingKew).unit;
                    }

                    responsiveSettings.push(breakpoint_data);
                });

                settings.responsive = responsiveSettings;

                if (!!this.getElementSettings('prev_arrow_id')) {
                    settings.prevArrow = '#' + this.getElementSettings('prev_arrow_id');
                }
                if (!!this.getElementSettings('next_arrow_id')) {
                    settings.nextArrow = '#' + this.getElementSettings('next_arrow_id');
                }

                const $carouselDirection = this.getElementSettings('carousel_direction');

                if ('vertical' === $carouselDirection) {
                    settings.vertical = true;
                    settings.verticalSwiping = true;
                }

                if ( noxfolioLocalize.is_rtl ) {
                    settings.rtl = true;
                }

                return $.extend({}, this.getSettings(), settings);
            },
            run: function run() {
                const $container = this.elements.$container;
                $container.slick(this.getCarouselSettings());

                if ($container.hasClass('has-animation-events')) {
                    $container.on("afterChange", function (event, slick, currentSlide) {
                        $container.find(".slick-active .elementor-invisible").each(function (index, elem) {
                            const dataSettings = $(elem).data("settings");

                            if (!dataSettings) {
                                return;
                            }
                            if (!dataSettings._animation && !settings.animation) {
                                return;
                            }

                            const delay = dataSettings._animation_delay ? dataSettings._animation_delay : 0,
                                animation = dataSettings._animation || dataSettings.animation;

                            setTimeout(function () {
                                $(elem).removeClass("elementor-invisible").addClass(animation + ' animated');
                            }, delay);
                        });
                    });

                    $container.on("beforeChange", function (event, slick, currentSlide) {
                        let $slides = $container.find(".slick-slide");

                        if ("init" === event) {
                            $slides = $slides.not(".slick-current");
                        }

                        $slides.find(".animated").each(function (index, elem) {
                            const dataSettings = $(elem).data("settings");

                            if (!dataSettings) {
                                return;
                            }
                            if (!dataSettings._animation && !dataSettings.animation) {
                                return;
                            }

                            const animation = dataSettings._animation || dataSettings.animation;
                            $(elem).removeClass("animated " + animation).addClass("elementor-invisible");
                        });
                    });
                }
            },
        });

        // Carousel Handlers
        const carouselHandlers = {
            'noxfolio-testimonials.default': noxfolioCarousel,
            'noxfolio-recent-posts.default': noxfolioCarousel,
            'noxfolio-client-logos.default': noxfolioCarousel,
        };

        $.each(carouselHandlers, function (widgetName, handlerClass) {
            elementorFrontend.hooks.addAction('frontend/element_ready/' + widgetName, function ($scope) {
                elementorFrontend.elementsHandler.addHandler(handlerClass, {
                    $element: $scope
                });
            });
        });
    });
})(jQuery);