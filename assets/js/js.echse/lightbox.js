/*
 * @section DESCRIPTION
 *
 * This is a jquery plugin which implements a simple "lightbox"
 * functionality. I.e. an element becomes clickable and a click
 * toggles the element to be centered and "maximised" (max
 * width/height = window width/height). Another click will return the
 * element to its original state.
 *
 * @version 1.1.2
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

    var LIGHTBOX={};//namespace

    /*
      The lighbox functionality is activated via e.g.
      $(".your_class_name").lightbox();
      which adds a click handler for max/minimising.

      lightbox() is chainable.

      options[defaults] are:

      modal [true]
      * gray out the rest of the screen when maximising the lightbox
      * and catch all clicks. If false, the user needs to click on the
      * maximised box in order to return it to its original state.

      */
    $.fn.lightbox = function(options) {
        var settings = $.extend({
            modal: true
        }, options );

        return this.on('click', function(event){
            LIGHTBOX.min_max($(this), settings);
        });
    };


    /* Calling this on some element will raise maximise it
       ("lightbox") or, if allready maximised, resize it to its
       original size and position (minimise). Options are expected to
       be parsed through $.extend before, i.e. here all options are
       mandatory, see $.fn.lightbox.
    */
    LIGHTBOX.min_max = function(element, options){

        var toggle_class_name = "lightbox_maximised";
        var animation_running_class_name = "lightbox_animation_running";
        var data_attr_name = "lightbox_old_state";

        if(element.hasClass(animation_running_class_name))
            return;

        if(element.hasClass(toggle_class_name))
        {
            //minimise:

            var old = JSON.parse(element.data(data_attr_name));

            element.addClass(animation_running_class_name);
            element.animate({
                "max-width":old.max_width,
                "max-height":old.max_height
            }, 400, function(){
                element.css('position',old.pos)
                    .css('left',old.left)
                    .css('top',old.top)
                    .css("z-index",old.z);
                $("#lightbox_gray_out").remove();
                element.removeClass(toggle_class_name);
                element.removeClass(animation_running_class_name);
            });

            return;
        }

        //maximise:

        element.addClass(animation_running_class_name);
        element.addClass(toggle_class_name);

        //save elements original state to restore it later
        var old={
            pos : element.css('position'),
            max_width : element.css('max-width'),
            max_height : element.css('max-height'),
            left : element.css('left'),
            top : element.css('top'),
            display : element.css('display'),
            z : element.css('z-index'),
        };
        var json_str = JSON.stringify(old);
        element.data(data_attr_name, json_str);

        if(options.modal)
        {
            var gray_out = $("<div id='lightbox_gray_out'></div>");
            gray_out.css({
                "position":"fixed",
                "top":"0",
                "left":"0",
                "width":"100vw",
                "height":"100vh",
                "z-index":"99",
                "background-color": "white",
                "opacity": "0.7"
            });

            gray_out.click(function(){
                element.trigger("click");
            });

            $("body").append(gray_out);
        }

        //raise:
        element.css({
            "position":"fixed",
            "z-index":"100"
        });

        //zoom large
        element.animate({
            "max-width":"100vw",
            "max-height":"100vh",
            "top":"0"
        }, 400, function(){
            var centering_left = ($(window).width() - element.width())/2.0;
            var centering_top = ($(window).height() - element.height())/2.0;

            //move to center
            element.animate({
                left:centering_left,
                top:centering_top
            },400, function(){
                element.removeClass(animation_running_class_name);
            });
        });
    }

}( jQuery ));
