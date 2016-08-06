"use strict";

$(function(){
$("#main-content article.teaser").click(function(){
    $("#main-content article.teaser").hide();
    $("#main-content img.bg").hide();
    $("#main-content article.full-text").show();
    if(ROLLON != undefined){
	ROLLON.center_images_vertically();
    }
});
});

  

