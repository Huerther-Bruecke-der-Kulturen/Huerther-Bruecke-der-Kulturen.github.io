/*
 * @section DESCRIPTION
 *
 * Hide old posts in slider.
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

UTILS.hide_old(
    {
	max_age_s: 60 * 60 * 24 * 30.5 * 4, // 4 month
	additional_filters: "li.rollon_item"
    });
