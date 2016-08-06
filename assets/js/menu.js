"use strict";

var Menu = Menu || {};

    Menu.init = function(){
	var level1 = $("nav").find(".level1");

	level1.hover(function(){
	    //mouse in
	    $(this).addClass("highlight");
	    $(this).find("ul").slideDown();
	}, function(){
	    //mouse out
	    $(this).removeClass("highlight");
	    $(this).find("ul").slideUp();
	});
    };




var Carousel = Carousel || {};

Carousel.init = function() {
    $('.jcarousel').jcarousel({
	    wrap: 'circular'
    }).jcarouselAutoscroll({
            interval: 5000,
            target: '+=1',
            autostart: true
        });

        $('.jcarousel-control-prev')
            .on('jcarouselcontrol:active', function() {
                $(this).removeClass('inactive');
            })
            .on('jcarouselcontrol:inactive', function() {
                $(this).addClass('inactive');
            })
            .jcarouselControl({
                target: '-=1'
            });

        $('.jcarousel-control-next')
            .on('jcarouselcontrol:active', function() {
                $(this).removeClass('inactive');
            })
            .on('jcarouselcontrol:inactive', function() {
                $(this).addClass('inactive');
            })
            .jcarouselControl({
                target: '+=1'
            });

        $('.jcarousel-pagination')
            .on('jcarouselpagination:active', 'a', function() {
                $(this).addClass('active');
            })
            .on('jcarouselpagination:inactive', 'a', function() {
                $(this).removeClass('active');
            })
            .jcarouselPagination();
};


$(function() {
    Menu.init();
    Carousel.init();
});
