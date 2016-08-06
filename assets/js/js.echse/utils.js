/*
 * @section DESCRIPTION
 * 
 * This is a set of general purpose utility functions, which I
 * considered to small to put them into their own classes. Read the
 * comments for each function for the individual descriptions.
 *
 * Requires jQuery.
 *
 * @version 1.1.0
 * @date: 2016-07-29
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

//jquery "plugins":
(function ( $ ) {

    // center elements within their parent using css margins
    $.fn.center = function(options)
    {
	var settings = $.extend(
	    {
		horizontally: true,
		vertically: true,
	    },options);

        this.each(function(index)
                  {
		      if(settings.vertically)
			  $(this).css("margin-top",($(this).parent().height()-$(this).height())/2);
		      if(settings.horizontally)
			  $(this).css("margin-left",($(this).parent().width()-$(this).width())/2);
                  });
    };

}( jQuery ));


var UTILS={};

(function(){

    var default_max_age_s = 60 * 60 * 24 * 30.5 * 6; // 6 month

    /*
      Hide all elements with a large data-age attribute.

      options:
      max_age_s            [default_max_age_s[6 month]] threshhold in seconds
      additional_filters   [*] jquery selector string. Only hide matches.
     */
    UTILS.hide_old = function(options)
    {
	if(options == undefined){options = {};}
	if(options.max_age_s == undefined){options.max_age_s = default_max_age_s;}
	if(options.additional_filters == undefined){options.additional_filters = "*";}

	$("[data-age]").filter(options.additional_filters).each(function(index){
	
            if($(this).data("age") > options.max_age_s)
	    {
                $(this).hide();
            }
        });
    }

    
    /*
      reveal all elements with a data-age attribute matching the filters.

      options:
      additional_filters   [*] jquery selector string. Only show matches.
    */
    UTILS.show_old = function(options)
    {
	if(options == undefined){options = {};}
	if(options.additional_filters == undefined){options.additional_filters = "*";}

	$("[data-age]").filter(options.additional_filters).each(function(index)
	{
	    $(this).show();
	});
    }

    
}());

