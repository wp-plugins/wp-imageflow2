/**
 *	ImageFlow 0.9 modified to work with Lightbox 
 *
 *    This is a combination of the ImageFlow gallery with Lightbox pop-ups when linking to an image.
 *    Copyright Bev Stofko 
 *
 *    Original ImageFlow 0.9 Comments-----------------------------:
 *	This code is based on Michael L. Perrys Cover flow in Javascript.
 *	For he wrote that "You can take this code and use it as your own" [1]
 *	this is my attempt to improve some things. Feel free to use it! If
 *	you have any questions on it leave me a message in my shoutbox [2].
 *
 *	The reflection is generated server-sided by a slightly hacked  
 *	version of Richard Daveys easyreflections [3] written in PHP.
 *	
 *	The mouse wheel support is an implementation of Adomas Paltanavicius
 *	JavaScript mouse wheel code [4].
 *
 *	Thanks to Stephan Droste ImageFlow is now compatible with Safari 1.x.
 *    --------------------------------------------------------------
 *
 *
 *	[1] http://www.adventuresinsoftware.com/blog/?p=104#comment-1981
 *	[2] http://shoutbox.finnrudolph.de/
 *	[3] http://reflection.corephp.co.uk/v2.php
 *	[4] http://adomas.org/javascript-mouse-wheel/
 */

var imageflow2 = {

/* Configuration variables */
conf_reflection_p: 	0.5,		// Sets the height of the reflection in % of the source image 
conf_focus: 		4,          // Sets the numbers of images on each side of the focussed one
conf_ib_slider_width:	14,         // Sets the px width of the slider div
conf_ib_images_cursor:	'pointer',  // Sets the cursor type for all images default is 'default'
conf_ib_slider_cursor:	'default',  // Sets the slider cursor type: try "e-resize" default is 'default'

/* HTML div ids that we manipulate here */
ib_imageflow2div:		'wpif2_imageflow',
ib_loadingdiv:		'wpif2_loading',
ib_imagesdiv:		'wpif2_images',
ib_captionsdiv:		'wpif2_captions',
ib_sliderdiv:		'wpif2_slider',
ib_scrollbardiv:		'wpif2_scrollbar',
ib_overlaydiv:		'wpif2_overlay',
ib_overlayclosediv:	'wpif2_overlayclose',
ib_topboxdiv:		'wpif2_topbox',
ib_topboximgdiv:		'wpif2_topboximg',
ib_topboxcaptiondiv:	'wpif2_topboxcaption',
ib_topboxclosediv:	'wpif2_topboxclose',

/* Define global variables */
caption_id:		0,
new_caption_id:	0,
current:		0,
target:		0,
mem_target:		0,
timer:		0,
array_images:	[],
new_slider_pos:	0,
dragging:		false,
dragobject:		null,
dragx:		0,
posx:			0,
new_posx:		0,
xstep:		150,

step:function() {
	switch (imageflow2.target < imageflow2.current-1 || imageflow2.target > imageflow2.current+1) 
	{
		case true:
			imageflow2.moveTo(imageflow2.current + (imageflow2.target-imageflow2.current)/3);
			window.setTimeout(imageflow2.step, 50);
			imageflow2.timer = 1;
			break;

		default:
			imageflow2.timer = 0;
			break;
	}
},

glideTo:function(x, new_caption_id) {	
	/* Animate gliding to new x position */
	this.target = x;
	this.mem_target = x;
	if (this.timer == 0)
	{
		window.setTimeout(this.step, 50);
		this.timer = 1;
	}
	
	/* Display new caption */
	this.caption_id = new_caption_id;
	caption = img_div.childNodes.item(this.array_images[this.caption_id]).getAttribute('alt');
	if (caption == '') caption = '&nbsp;';
	caption_div.innerHTML = caption;

	/* Set scrollbar slider to new position */
	if (this.dragging == false)
	{
		this.new_slider_pos = (scrollbar_width * (-(x*100/((max-1)*this.xstep))) / 100) - this.new_posx;
		slider_div.style.marginLeft = (this.new_slider_pos - this.conf_ib_slider_width) + 'px';
	}
},

moveTo:function(x)
{
	this.current = x;
	var zIndex = max;
	
	/* Main loop */
	for (var index = 0; index < max; index++)
	{
		var image = img_div.childNodes.item(this.array_images[index]);
		var current_image = index * -this.xstep;

		/* Don't display images that are not this.conf_focussed */
		if ((current_image+this.max_conf_focus) < this.mem_target || (current_image-this.max_conf_focus) > this.mem_target)
		{
			image.style.visibility = 'hidden';
			image.style.display = 'none';
		}
		else 
		{
			var z = Math.sqrt(10000 + x * x) + 100;
			var xs = x / z * size + size;

			/* Still hide images until they are processed, but set display style to block */
			image.style.display = 'block';
		
			/* Process new image height and image width */
			var new_img_h = (image.h / image.w * image.pc) / z * size;
			switch ( new_img_h > max_height )
			{
				case false:
					var new_img_w = image.pc / z * size;
					break;

				default:
					new_img_h = max_height;
					var new_img_w = image.w * new_img_h / image.h;
					break;
			}
			var new_img_top = (images_width * 0.34 - new_img_h) + images_top + ((new_img_h / (this.conf_reflection_p + 1)) * this.conf_reflection_p);

			/* Set new image properties */
			image.style.left = xs - (image.pc / 2) / z * size + images_left + 'px';
			if(new_img_w && new_img_h)
			{ 
				image.style.height = new_img_h + 'px'; 
				image.style.width = new_img_w + 'px'; 
				image.style.top = new_img_top + 'px';
			}
			image.style.visibility = 'visible';

			/* Set image layer through zIndex */
			switch ( x < 0 )
			{
				case true:
					zIndex++;
					break;

				default:
					zIndex = zIndex - 1;
					break;
			}
			
			/* Change zIndex and onclick function of the focussed image */
			switch ( image.i == this.caption_id )
			{
				case false:
					image.onclick = function() { imageflow2.glideTo(this.x_pos, this.i); }
					break;

				default:
					zIndex = zIndex + 1;
  					if (image.getAttribute("rel") && (image.getAttribute("rel") == 'wpif2_lightbox')) {
						image.setAttribute("title",image.getAttribute('alt'));
						image.onclick = function () { imageflow2.showTop(this);return false; }
					} else {
						image.onclick = function() { window.open (this.url); }
					}
					break;
			}
			image.style.zIndex = zIndex;
		}
		x += this.xstep;
	}
},

/* Main function */
refresh:function(onload)
{
	/* Cache document objects in global variables */
	imageflow2_div = document.getElementById(this.ib_imageflow2div);
	img_div = document.getElementById(this.ib_imagesdiv);
	scrollbar_div = document.getElementById(this.ib_scrollbardiv);
	slider_div = document.getElementById(this.ib_sliderdiv);
	caption_div = document.getElementById(this.ib_captionsdiv);

	/* Cache global variables, that only change on refresh */
	images_width = img_div.offsetWidth;
	images_top = imageflow2_div.offsetTop;
	images_left = imageflow2_div.offsetLeft;

	this.max_conf_focus = this.conf_focus * this.xstep;
	size = images_width * 0.5;
	scrollbar_width = images_width * 0.6;
	this.conf_ib_slider_width = this.conf_ib_slider_width * 0.5;
	max_height = images_width * 0.51;

	/* Change imageflow2 div properties */
	imageflow2_div.style.height = max_height + 'px';

	/* Change images div properties */
	img_div.style.height = images_width * 0.338 + 'px';

	/* Change captions div properties */
	caption_div.style.width = images_width + 'px';
	caption_div.style.marginTop = images_width * 0.03 + 'px';

	/* Change scrollbar div properties */
	scrollbar_div.style.marginTop = images_width * 0.02 + 'px';
	scrollbar_div.style.marginLeft = images_width * 0.2 + 'px';
	scrollbar_div.style.width = scrollbar_width + 'px';
	
	/* Set slider attributes */
	slider_div.onmousedown = function () { imageflow2.dragstart(this); };
	slider_div.style.cursor = this.conf_ib_slider_cursor;

	/* Cache EVERYTHING! */
	max = img_div.childNodes.length;
	var i = 0;
	for (var index = 0; index < max; index++)
	{ 
		var image = img_div.childNodes.item(index);
		if ((image.nodeType == 1) && (image.nodeName != "NOSCRIPT"))
		{
			this.array_images[i] = index;
			
			/* Set image onclick by adding i and x_pos as attributes! */
			image.onclick = function() { imageflow2.glideTo(this.x_pos, this.i); }
			image.x_pos = (-i * this.xstep);
			image.i = i;
			
			/* Add width and height as attributes ONLY once onload */
			if(onload == true)
			{
				image.w = image.width;
				image.h = image.height;
			}

			/* Check source image format. Get image height minus reflection height! */
			switch ((image.w + 1) > (image.h / (this.conf_reflection_p + 1))) 
			{
				/* Landscape format */
				case true:
					image.pc = 118;
					break;

				/* Portrait and square format */
				default:
					image.pc = 100;
					break;
			}

			/* Set ondblclick event */
			image.url = image.getAttribute('longdesc');
			if (image.getAttribute("rel") && (image.getAttribute("rel") == 'wpif2_lightbox')) {
				image.setAttribute("title",image.getAttribute('alt'));
				image.ondblclick = function () { imageflow2.showTop(this);return false; }
			} else {
				image.ondblclick = function() { window.open (this.url); }
			}
			/* Set image cursor type */
			image.style.cursor = this.conf_ib_images_cursor;

			i++;
		}
	}
	max = this.array_images.length;

	/* Display images in this.current order */
	this.moveTo(this.current);
	this.glideTo(this.current, this.caption_id);
},

/* Show/hide element functions */
show:function(id)
{
	var element = document.getElementById(id);
	element.style.visibility = 'visible';
},
hide:function(id)
{
	var element = document.getElementById(id);
	element.style.visibility = 'hidden';
	element.style.display = 'none';
},

setup:function()
{
	if(document.getElementById(imageflow2.ib_imageflow2div) == null) return;

	/* Show loading bar while page is loading */
	this.show(this.ib_loadingdiv);

	if(typeof window.onunload === "function")
	  {
		var oldonunload = window.onunload;
		window.onunload = function()
		{
			this.unloaded();
			oldonunload();
		};
	} else window.onunload = this.unloaded;

	if(typeof window.onload === "function")
	  {
		var oldonload = window.onload;
		window.onload = function()
		{
			this.loaded();
			oldonload();
		};
	} else {
		window.onload = this.loaded;
	}

	/* Refresh Imageflow2 on window resize */
	window.onresize = function()
	{
		if(document.getElementById(this.ib_imageflow2div)) refresh(false);
	}

	document.onkeydown = function(event)
	{
		var charCode  = getKeyCode(event);
		switch (charCode)
		{
			/* Right arrow key */
			case 39:
				handle(-1);
				break;
		
			/* Left arrow key */
			case 37:
				handle(1);
				break;
		}
	}
},

loaded:function ()
{
	if(document.getElementById(imageflow2.ib_imageflow2div))
	{
		/* Append overlay divs to the page */
		var objBody = document.getElementsByTagName("body").item(0);

		/* -- overlay div */
		var objOverlay = document.createElement('div');
		objOverlay.setAttribute('id',imageflow2.ib_overlaydiv);
		objOverlay.onclick = function() { imageflow2.closeTop(); }
		objBody.appendChild(objOverlay);
	
		/* -- top box div */
		var objLightbox = document.createElement('div');
		objLightbox.setAttribute('id',imageflow2.ib_topboxdiv);
		objLightbox.onclick = function() { imageflow2.closeTop(); }
		objBody.appendChild(objLightbox);

		/* ---- image div */
		var objLightboxImage = document.createElement("img");
		objLightboxImage.setAttribute('id',imageflow2.ib_topboximgdiv);
		objLightbox.appendChild(objLightboxImage);

		/* ---- caption div */
		var objCaption = document.createElement("div");
		objCaption.setAttribute('id',imageflow2.ib_topboxcaptiondiv);
		objLightbox.appendChild(objCaption);

		/* ---- close link */
		var objClose = document.createElement("a");
		objClose.setAttribute('id',imageflow2.ib_topboxclosediv);
		objClose.setAttribute('href','#');
		objLightbox.appendChild(objClose);

		objClose.onclick = function () { imageflow2.closeTop(); return false; };
		objClose.innerHTML = "Close";
		
		/* Hide loading bar, show content and initialize mouse event listening after loading */
		imageflow2.hide(imageflow2.ib_loadingdiv);
		imageflow2.refresh(true);
		imageflow2.show(imageflow2.ib_imagesdiv);
		imageflow2.show(imageflow2.ib_scrollbardiv);
		imageflow2.initMouseWheel();
		imageflow2.initMouseDrag();
	}
},

unloaded:function ()
{
	/* Fixes the back button issue */
	document = null;
},

/* Handle the wheel angle change (delta) of the mouse wheel */
handle:function(delta)
{
	var change = false;
	switch (delta > 0)
	{
		case true:
			if(this.caption_id >= 1)
			{
				this.target = this.target + this.xstep;
				this.new_caption_id = this.caption_id - 1;
				change = true;
			}
			break;

		default:
			if(this.caption_id < (max-1))
			{
				this.target = this.target - this.xstep;
				this.new_caption_id = this.caption_id + 1;
				change = true;
			}
			break;
	}

	/* Glide to next (mouse wheel down) / previous (mouse wheel up) image */
	if (change == true)
	{
		this.glideTo(this.target, this.new_caption_id);
	}
},

/* Event handler for mouse wheel event */
wheel:function(event)
{
	var delta = 0;
	if (!event) event = window.event;
	if (event.wheelDelta)
	{
		delta = event.wheelDelta / 120;
	}
	else if (event.detail)
	{
		delta = -event.detail / 3;
	}
	if (delta) imageflow2.handle(delta);
	if (event.preventDefault) event.preventDefault();
	event.returnValue = false;
},

/* Initialize mouse wheel event listener */
initMouseWheel:function()
{
	if(window.addEventListener) {
		imageflow2_div.addEventListener('DOMMouseScroll', this.wheel, false);
	}
	imageflow2_div.onmousewheel = this.wheel;
},

/* This function is called to drag an object (= slider div) */
dragstart:function(element)
{
	imageflow2.dragobject = element;
	imageflow2.dragx = imageflow2.posx - imageflow2.dragobject.offsetLeft + imageflow2.new_slider_pos;
},

/* This function is called to stop this.dragging an object */
dragstop:function()
{
	imageflow2.dragobject = null;
	imageflow2.dragging = false;
},

/* This function is called on mouse movement and moves an object (= slider div) on user action */
drag:function(e)
{
	imageflow2.posx = document.all ? window.event.clientX : e.pageX;
	if(imageflow2.dragobject != null)
	{
		imageflow2.dragging = true;
		imageflow2.new_posx = (imageflow2.posx - imageflow2.dragx) + imageflow2.conf_ib_slider_width;

		/* Make sure, that the slider is moved in proper relation to previous movements by the glideTo function */
		if(imageflow2.new_posx < ( - imageflow2.new_slider_pos)) imageflow2.new_posx = - imageflow2.new_slider_pos;
		if(imageflow2.new_posx > (scrollbar_width - imageflow2.new_slider_pos)) imageflow2.new_posx = scrollbar_width - imageflow2.new_slider_pos;
		
		var slider_pos = (imageflow2.new_posx + imageflow2.new_slider_pos);
		var step_width = slider_pos / ((scrollbar_width) / (max-1));
		var image_number = Math.round(step_width);
		var new_target = (image_number) * -imageflow2.xstep;
		var new_caption_id = image_number;

		imageflow2.dragobject.style.left = imageflow2.new_posx + 'px';
		imageflow2.glideTo(new_target, new_caption_id);
	}
},

/* Initialize mouse event listener */
initMouseDrag:function()
{
	document.onmousemove = imageflow2.drag;
	document.onmouseup = imageflow2.dragstop;

	/* Avoid text and image selection while dragging  */
	document.onselectstart = function () 
	{
		if (imageflow2.dragging == true)
		{
			return false;
		}
		else
		{
			return true;
		}
	}
},

getKeyCode:function(event)
{
	event = event || window.event;
	return event.keyCode;
},


getPageScroll:function(){
	var xScroll, yScroll;
	if (self.pageYOffset) {
		yScroll = self.pageYOffset;
		xScroll = self.pageXOffset;
	} else if (document.documentElement && document.documentElement.scrollTop){	 // Explorer 6 Strict
		yScroll = document.documentElement.scrollTop;
		xScroll = document.documentElement.scrollLeft;
	} else if (document.body) {// all other Explorers
		yScroll = document.body.scrollTop;
		xScroll = document.body.scrollLeft;	
	}
	arrayPageScroll = new Array(xScroll,yScroll) 
	return arrayPageScroll;
},

getPageSize:function(){
	var xScroll, yScroll;
	if (window.innerHeight && window.scrollMaxY) {	
		xScroll = window.innerWidth + window.scrollMaxX;
		yScroll = window.innerHeight + window.scrollMaxY;
	} else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
		xScroll = document.body.scrollWidth;
		yScroll = document.body.scrollHeight;
	} else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
		xScroll = document.body.offsetWidth;
		yScroll = document.body.offsetHeight;
	}
	var windowWidth, windowHeight;
	if (self.innerHeight) {	// all except Explorer
		if(document.documentElement.clientWidth){
			windowWidth = document.documentElement.clientWidth; 
		} else {
			windowWidth = self.innerWidth;
		}
		windowHeight = self.innerHeight;
	} else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
		windowWidth = document.documentElement.clientWidth;
		windowHeight = document.documentElement.clientHeight;
	} else if (document.body) { // other Explorers
		windowWidth = document.body.clientWidth;
		windowHeight = document.body.clientHeight;
	}
	// for small pages with total height less then height of the viewport
	if(yScroll < windowHeight){
		pageHeight = windowHeight;
	} else { 
		pageHeight = yScroll;
	}
	// for small pages with total width less then width of the viewport
	if(xScroll < windowWidth){	
		pageWidth = xScroll;		
	} else {
		pageWidth = windowWidth;
	}
	arrayPageSize = new Array(pageWidth,pageHeight,windowWidth,windowHeight) 
	return arrayPageSize;
},

showFlash:function(){
	var flashObjects = document.getElementsByTagName("object");
	for (i = 0; i < flashObjects.length; i++) {
		flashObjects[i].style.visibility = "visible";
	}
	var flashEmbeds = document.getElementsByTagName("embed");
	for (i = 0; i < flashEmbeds.length; i++) {
		flashEmbeds[i].style.visibility = "visible";
	}
},

hideFlash:function(){
	var flashObjects = document.getElementsByTagName("object");
	for (i = 0; i < flashObjects.length; i++) {
		flashObjects[i].style.visibility = "hidden";
	}
	var flashEmbeds = document.getElementsByTagName("embed");
	for (i = 0; i < flashEmbeds.length; i++) {
		flashEmbeds[i].style.visibility = "hidden";
	}
},

showTop:function(image)
{
	topbox_div = document.getElementById(imageflow2.ib_topboxdiv);
	overlay_div = document.getElementById(imageflow2.ib_overlaydiv);
	topboximg_div = document.getElementById(imageflow2.ib_topboximgdiv);

	// Hide flash objects
	imageflow2.hideFlash();

	// Show the background overlay ...
	var arrayPageSize = imageflow2.getPageSize();
	overlay_div.style.width = arrayPageSize[0] + "px";
	overlay_div.style.height = arrayPageSize[1] + "px";
	overlay_div.style.display = 'none';
	overlay_div.style.visibility = 'visible';
	new Effect.Appear(overlay_div, { from: 0.0, to: .75, duration: .2 });

	// Get the top box data set up first
	topboximg_div.src = image.url;
	document.getElementById(imageflow2.ib_topboxcaptiondiv).innerHTML = image.getAttribute('title');

	// get the image actual size by preloading into 't'
	var t = new Image();
      t.onload = (function(){	imageflow2.showImg(image, t.width, t.height); });
	t.src = image.url;

	// Now wait until 't' is loaded
},


showImg:function(image, img_width, img_height) 
{	
	// Do nothing if the overlay was closed in the meantime
	if (document.getElementById(imageflow2.ib_overlaydiv).style.visibility == 'hidden') return;
	
	// Go ahead with the fade up
	topbox_div = document.getElementById(imageflow2.ib_topboxdiv);
	overlay_div = document.getElementById(imageflow2.ib_overlaydiv);
	topboximg_div = document.getElementById(imageflow2.ib_topboximgdiv);

	// Size the box a bit taller than the image
	boxWidth = img_width;
	boxHeight = img_height + 30;

	// Set the image width property
	topboximg_div.width = boxWidth;

	var arrayPageSize = imageflow2.getPageSize();
	var screenWidth = arrayPageSize[2];
	var screenHeight = arrayPageSize[3];

	var arrayPageScroll = imageflow2.getPageScroll();

	// scale the box if the image is larger than the screen
	if (boxWidth > screenWidth) {
		boxHeight = Math.floor(boxHeight * screenWidth / boxWidth);
		boxWidth = screenWidth - 100;
		topboximg_div.width = boxWidth;
	}
	if (boxHeight > screenHeight) {
		boxWidth = Math.floor(boxWidth * screenHeight / boxHeight);
		boxHeight = screenHeight - 100;
		topboximg_div.width = boxWidth;
	}

	xPos = Math.floor((screenWidth - boxWidth) * 0.5) + arrayPageScroll[0];
	yPos = Math.floor((screenHeight - boxHeight) * 0.5) + arrayPageScroll[1];

	topbox_div.style.left = xPos + 'px';
	topbox_div.style.top = yPos + 'px';
	topbox_div.style.width = boxWidth + 'px';

	// Finally show the topbox...
	topbox_div.style.display = 'none';
	topbox_div.style.visibility = 'visible';
	new Effect.Appear(topbox_div, { from: 0.0, to: 1.0, duration: .4 });

},

closeTop:function()
{
	//Hide the overlay and tobox...
	document.getElementById(this.ib_overlaydiv).style.visibility='hidden';
	document.getElementById(this.ib_topboxdiv).style.visibility='hidden';

	// Show hidden objects
	this.showFlash();
}

}
jQuery(document).ready(function() {
	imageflow2.setup();
});
