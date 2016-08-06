---
layout: "empty"
---

/*
 * @section DESCRIPTION
 *
 * Init all modules.
 *
 * @author: Sebastian Schmittner <webmaster@huerther-bruecke-der-kulturen.de>
 * @copyright: 2016 Hürther Brücke der Kulturen e.V.
 *
 * @section LICENSE
 * 
 * CC0
 * 
 * This file of negligible size is released to the public domain. It
 * is free software; you can redistribute it and/or modify in any way
 * you want. More precisely, to the extent possible under law, Hürther
 * Brücke der Kulturen e.V. has waived all copyright and related or
 * neighboring rights to this file. It is published from Germany. See
 * http://creativecommons.org/publicdomain/zero/1.0/ for the details.
 *
 */

"use strict";

$(function(){
    
    
    //register lightbox event hanlders
    $(".lightbox").lightbox();

    //start sliders
    $(".rollon_container").rollon({
	item_selector: ".rollon_item:visible"
    });
    
    moment.locale('de');

    ICAL_PARSER.render("{{ site.url }}assets/basic.ics", $("#calendar"));

    $(".small-img").center();
        
});
