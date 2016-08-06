/*
 * @section DESCRIPTION
 *
 * This is a jquery plugin which implements a simple slider.
 *
 * @version 1.1.1
 * @date: 2016-07-28
 *
 * @author: Sebastian Schmittner <sebastian@schmittner.pw>
 * @copyright: 2016 Sebastian Schmittner
 *
 * @section LICENSE
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public License
 * as published by the Free Software Foundation; either version 3 of
 * the License, or (at your option) any later version.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License and a copy of the GNU General Public License along with
 * this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

"use strict";

(function ( $ ) {

    var ROLLON = {};//namespace
    ROLLON.settings_data_attribute_name = "rollon_settings";

    /* Typically a slider contains an outer container ("view" with
     * overflow = hidden), an inner container ("container", very large
     * => mostly off screen) and the actual slidign items inside the
     * inner container (maybe float=left). None of these styles is of
     * concern to this script, you should set up your DOM and
     * stylesheets and then call 
     * $("your_container_class").rollon();
     * on the container. 
     *
     * If the set of sliding items is not identical to the set of
     * children of the container, you should specify an 
     ** item_selector []
     * (e.g. ".my_item_class"). 
     * 
     * The default mode is animated left sliding an currently no
     * other animations are implemented. So if you e.g. want to slide
     * a <ul> with default (horizontal) styling, you should set
     ** animate [true]
     * to false.
     *
     * Events for previous/next buttons will be registered for elemets
     * with the classes
     ** prev_selector [".rollon_prev"]
     ** next_selector [".rollon_next"]
     *
     ** interval [5000][[ms]]
     * sets the speed of the slider.
     *
     *
     * rollon() is chainable. 
     *
     * rollon() is implicitly iterating. Each element will be
     * considered a rollon container if called on a set.
     *
     */
    $.fn.rollon = function(options){
	
	var settings = $.extend({
	    item_selector: "",
	    prev_selector: ".rollon_prev",
	    next_selector: ".rollon_next",
	    animate: true,
	    interval: 5000,
        }, options );

	
	return this.each(function(){
	    //notice scope change of 'this' ;)
	    var container = $(this);
	    
            //init buttons
            container.find(settings.prev_selector).on('click', function(){
		ROLLON.stop({"container": container});
		ROLLON.shift(
		    {
			"container": container,
			forward: false
		    });
            });
	    container.find(settings.next_selector).on('click', function(){
		ROLLON.stop({"container": container});
		ROLLON.shift({"container": container});
            });

	    //remember settings
	    container.data(ROLLON.settings_data_attribute_name, JSON.stringify(settings));

	    if( settings.interval > 0 )
	    {
		setTimeout(function(){
		    ROLLON.keep_rolling({"container": container});
		}, settings.interval);
            }
	    
	});

    }

    ROLLON.get_items = function(options)
    {
	if(options == undefined || options.container == undefined)
	{
	    console.log("Error: ROLLON.get_items called without container");
	    console.log(options);
	    return;
	}
	
	var container_settings = JSON.parse(options.container.data(ROLLON.settings_data_attribute_name));

	var items = options.container.children();
	if(container_settings.item_selector != "")
	    items = options.container.find(container_settings.item_selector);
	
	return items.finish();
    }
    
    ROLLON.get_container_settings = function(options)
    {
	if(options == undefined || options.container == undefined)
	{
	    console.log("Error: ROLLON.get_container_settings called without container");
	    console.log(options);
	    return;
	}

	var container_settings = JSON.parse(options.container.data(ROLLON.settings_data_attribute_name));
	
	return container_settings;
    }


    ROLLON.animate = function(options)
    {

	var settings = $.extend({
	    forward: true,
	    duration: 1000,
        }, options );
	
	var items = ROLLON.get_items(settings);

        if(settings.forward){
            var first = items.eq(0);
            var width = first.width();
            var mleft = first.css('margin-left');
            first.animate({'margin-left': "-="+width}, settings.duration, function(){
                ROLLON.move_item(settings);
                first.css('margin-left',mleft);
            });
        }else{
            var last = items.filter(":last");
            var width = last.width();
            var mleft = last.css('margin-left');
            last.css('margin-left', -width);
            ROLLON.move_item(settings);
            last.animate({'margin-left': mleft}, settings.duration);
        }
    }

    ROLLON.move_item = function (options)
    {
	if(options == undefined || options.container == undefined)
	{
	    console.log("Error: ROLLON.move_item called without container");
	    console.log(options);
	    return;
	}

	var settings = $.extend({
	    forward: true,
        }, options );

	var items = ROLLON.get_items(settings);

        if(settings.forward)
        {
            var first_item = items.eq(0).detach();
            settings.container.append(first_item);
        }else{
            var last_item = items.filter(":last").detach();
            settings.container.prepend(last_item);
        }
    }

    ROLLON.keep_rolling = function(options){
	if(options == undefined || options.container == undefined)
	{
	    console.log("Error: ROLLON.keep_rolling called without container");
	    console.log(options);
	    return;
	}

	var interval= ROLLON.get_container_settings(options).interval;
        if( interval > 0 ){
            ROLLON.shift(options);
            setTimeout(function(){
		ROLLON.keep_rolling(options);
	    },interval);
        }
    }

    ROLLON.shift = function(options)
    {
	var settings = $.extend({}, options );
	settings.animate = ROLLON.get_container_settings(options).animate;
	
        if(settings.animate){
            ROLLON.animate(settings);
        }else{
            ROLLON.move_item(settings);
        }
    }

    ROLLON.stop = function(options)
    {
	if(options.container == undefined)
	{
	    console.log("Error: ROLLON.stop called without container");
	    console.log(options);
	    return;
	}

	var container_settings = JSON.parse(options.container.data(ROLLON.settings_data_attribute_name));
	
	container_settings.interval = 0;
	
	options.container.data(ROLLON.settings_data_attribute_name, JSON.stringify(container_settings));

    }
    

}( jQuery ));
