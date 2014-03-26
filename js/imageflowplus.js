/**
 *	ImageFlowPlus 2.0
 *
 *    This provides an Flow style gallery plus the following great features:
 *    - Lightbox pop-ups when linking to an image
 *    - Optional linking to an external url rather than an image
 *	- Supports multiple instances and avoid collisions with other scripts by using object-oriented code
 *
 *    Copyright Bev Stofko http://www.stofko.ca
 *
 *	Version 1.1 adds auto-rotation option (May 3, 2010)
 *	Version 1.2 adds startimg option, longdesc may be link or text description (May 13, 2010)
 *	Version 1.3 fixes bug when gallery has only one image
 *	Version 1.4 don't display top box caption if it is the same as the top box title
 *	Version 1.5 fix image load in lightbox and slider width calculations
 *	Version 1.6 adds support for touch screen, sameWindow option, add class to centered image (Nov. 2012)
 *	Version 1.7 improves support when no images are included, change longdesc to data-link and rel to data-style
 *	Version 1.8 use data-description for passing description
 *	Version 2.0 move to image block format, swipe on image support
 *
 *    Resources ----------------------------------------------------
 *	[1] http://www.adventuresinsoftware.com/blog/?p=104#comment-1981, Michael L. Perry's Cover Flow
 *	[2] http://www.finnrudolph.de/, Finn Rudolph's imageflow, version 0.9 
 *	[3] http://reflection.corephp.co.uk/v2.php, Richard Davey's easyreflections in PHP
 *	[4] http://adomas.org/javascript-mouse-wheel, Adomas Paltanavicius JavaScript mouse wheel code
 *	[5] Touch screen control derived from scripts courtesy of PADILICIOUS.COM and MACOSXAUTOMATION.COM
 *    --------------------------------------------------------------
 */

function flowplus(instance) {

	/* Options */
	this.defaults =
	{
		aspectRatio:		1.9,		// Gallery div width / height
		autoRotate:			'off',		// Sets auto-rotate option 'on' or 'off', default is 'off'
		autoRotatepause: 	3000,		// Set the pause delay in the auto-rotation
		focus:				4,			// Sets the numbers of images on each side of the focused one
		imagesCursor:		'pointer',  // Sets the cursor type for all images default is 'default'
		reflectPC:			1,			// Percentage of image height in reflection, 0 = no reflection, 1 = full reflection
		sameWindow:			false,		// Open links in same window vs the default of opening in new window
		sliderWidth:		14,         // Sets the px width of the slider div
		startImg:			1,			// Starting focused image
		sliderCursor:		'default'  // Sets the slider cursor type: try "e-resize" default is 'default'
	};


	/* HTML div ids that we manipulate here */
	this.ifp_flowplusdiv =	'wpif2_flowplus_' + instance;
	this.ifp_loadingdiv =		'wpif2_loading_' + instance;
	this.ifp_imagesdiv =		'wpif2_images_' + instance;
	this.ifp_captionsdiv =		'wpif2_captions_' + instance;
	this.ifp_sliderdiv =		'wpif2_slider_' + instance;
	this.ifp_scrollbardiv =		'wpif2_scrollbar_' + instance;
	/* The overlay is shared among all instances */
	this.ifp_overlaydiv =		'wpif2_overlay';
	this.ifp_overlayclosediv =	'wpif2_overlayclose';
	this.ifp_topboxdiv =		'wpif2_topbox';
	this.ifp_topboximgdiv =		'wpif2_topboximg';
	this.ifp_topboxcaptiondiv =	'wpif2_topboxcaption';
	this.ifp_topboxprevdiv =	'wpif2_topboxprev';
	this.ifp_topboxclosediv =	'wpif2_topboxclose';
	this.ifp_topboxnextdiv =	'wpif2_topboxnext';

	/* Define global variables */
	this.image_id =		0;
	this.new_image_id =	0;
	this.current =		0;
	this.target =		0;
	this.mem_target =		0;
	this.timer =		0;
	this.array_images =	[];
	this.ifp_slider_width =	0;
	this.new_slider_pos =	0;
	this.dragging =		false;
	this.dragobject =		null;
	this.dragx =		0;
	this.posx =			0;
	this.new_posx =		0;
	this.xstep =		150;
	this.autorotate = 	'off';
	this.rotatestarted = 	'false';

	var thisObject = this;

	/* initialize */
	this.init = function(options)
	{
		/* Evaluate options */
		for (var name in thisObject.defaults) 
		{
			this[name] = (options !== undefined && options[name] !== undefined) ? options[name] : thisObject.defaults[name];
		}
	};

	/* show/hide element functions */
	this.show = function(id)
	{
		var element = document.getElementById(id);
		element.style.visibility = 'visible';
	};
	this.hide = function(id)
	{
		var element = document.getElementById(id);
		element.style.visibility = 'hidden';
		element.style.display = 'none';
	};

	this.step = function() {
		if (thisObject.target < thisObject.current-1 || thisObject.target > thisObject.current+1) 
		{
			thisObject.moveTo(thisObject.current + (thisObject.target-thisObject.current)/3);
			setTimeout(thisObject.step, 50);
			thisObject.timer = 1;
		} else {
			thisObject.timer = 0;
		}
	};

	this.glideTo = function(new_image_id) {
		if (this.max <= 1) return;
		var x = (-new_image_id * this.xstep);
		/* Animate gliding to new image */
		this.target = x;
		this.mem_target = x;
		if (this.timer == 0)
		{
			window.setTimeout(thisObject.step, 50);
			this.timer = 1;
		}
		
		/* Display new caption */
		this.image_id = new_image_id;
		var caption = this.imgs_div.childNodes.item(this.array_images[this.image_id]).childNodes.item(0).getAttribute('alt');
		if (caption == '') { caption = '&nbsp;'; }
		this.caption_div.innerHTML = caption;

		/* Set scrollbar slider to new position */
		if (this.dragging === false)
		{
			this.new_slider_pos = (this.scrollbar_width * (-(x*100/((this.max-1)*this.xstep))) / 100) - this.new_posx;
			this.slider_div.style.marginLeft = (this.new_slider_pos - this.ifp_slider_width) + 'px';
		}
	};

	this.rotate = function()
	{
		/* Do nothing if autorotate has been turned off */
		if (thisObject.autorotate == "on") {
			if (thisObject.image_id >= thisObject.max-1) {
				thisObject.glideTo(0);
			} else {
				thisObject.glideTo(thisObject.image_id+1);
			}
		}

		if (thisObject.autoRotate == 'on') {
			/* Set up next auto-glide */
			window.setTimeout (thisObject.rotate, thisObject.autoRotatepause);
		}
	}

	this.moveTo = function(x)
	{
		this.current = x;
		var zIndex = this.max;
		
		/* Main loop */
		for (var index = 0; index < this.max; index++)
		{
			var image_block = this.imgs_div.childNodes.item(this.array_images[index]);
			var image = image_block.childNodes.item(0);
			var current_image = index * -this.xstep;

			/* Don't display images that are not focused */
			if ((current_image+this.max_focus) < this.mem_target || (current_image-this.max_focus) > this.mem_target)
			{
				image_block.style.visibility = 'hidden';
				image_block.style.display = 'none';
			}
			else 
			{
				var z = Math.sqrt(10000 + x * x) + 100;
				var xs = x / z * this.size + this.size;

				/* Still hide images until they are processed, but set display style to block */
				image_block.style.display = 'block';
			
				/* Process new image height and image width */
				var current_pc = image_block.pc;
				if (image_block.i == thisObject.image_id) {
					current_pc = 120;
				}
				var new_img_h = Math.round((image_block.h / image_block.w * current_pc) / z * this.size);
				
				var new_img_w;
				var new_img_top;
				//if ( new_img_h <= this.max_height )
				{
					new_img_w = Math.round(current_pc / z * this.size);
				} //else {
					//console.log( 'too tall:'+new_img_h);
					//new_img_h = this.max_height;
					//new_img_w = Math.round(image_block.w * new_img_h / image_block.h);
					//new_img_top = 0;
					//console.log('reduced to:'+new_img_w+','+new_img_h);
				//}

				//var new_img_top = Math.round(this.images_width * 0.34 - new_img_h); // orig from imageflow .9
				//var new_img_top = Math.round((this.images_height - new_img_h)/2); // use if images div is full height
				var new_img_top = Math.round(this.images_height - new_img_h/(1 + this.reflectPC)); // use if images div is half height

				/* Set new image properties */
				image_block.style.left = Math.round(xs - (current_pc / 2) / z * this.size) + 'px';
				if (new_img_w && new_img_h)
				{ 
					image_block.style.height = new_img_h + 'px'; 
					image_block.style.width = new_img_w + 'px'; 
					image_block.style.top = new_img_top + 'px';

					/* this is needed to make IE8 behave */
					//image.style.height = new_img_h + 'px';
					image.style.width = new_img_w + 'px';
					image.style.height = 'auto';
				}
				image_block.style.visibility = 'visible';

				/* Set image layer through zIndex */
				if ( x < 0 )
				{
					zIndex++;
				} else {
					zIndex = zIndex - 1;
				}
				
				/* Change zIndex, class and onclick function of the focused image */
				switch ( image_block.i == thisObject.image_id )
				{
					case false:
						image_block.onclick = function() { thisObject.autorotate = "off"; thisObject.glideTo(this.i); return false; };
						//image_block.className = image_block.className.replace( / wpif2-centered/g , '' );
						jQuery(image_block).removeClass("wpif2-centered");
						break;

					default:
						zIndex = zIndex + 1;

						//var pattern = new RegExp("(^| )" + "wpif2-centered" + "( |$)");
						//if (!pattern.test(image_block.className)) image_block.className += " wpif2-centered";
						jQuery(image_block).addClass("wpif2-centered");

						if (image.getAttribute("data-style") && (image.getAttribute("data-style") == 'wpif2_lightbox')) {
							image.setAttribute("title",image.getAttribute('alt'));
							image_block.onclick = function () { thisObject.autoRotate = "off"; thisObject.showTop(this); return false; };
						} else if (this.sameWindow) {
							image_block.onclick = function() { window.location = this.url; return false; };
						} else {
							image_block.onclick = function() { window.open (this.url); return false; };
						}
						break;
				}
				image_block.style.zIndex = zIndex;
			}
			x += this.xstep;
		}
	};

	/* Main function */
	this.refresh = function(onload)
	{
		/* Cache document objects in global variables */
		this.flowplus_div = document.getElementById(this.ifp_flowplusdiv);
		this.imgs_div = document.getElementById(this.ifp_imagesdiv);
		this.scrollbar_div = document.getElementById(this.ifp_scrollbardiv);
		this.slider_div = document.getElementById(this.ifp_sliderdiv);
		this.caption_div = document.getElementById(this.ifp_captionsdiv);

		/* Cache global variables, that only change on refresh */
		this.images_width = this.imgs_div.offsetWidth;
		this.images_top = this.flowplus_div.offsetTop;
		this.images_left = this.flowplus_div.offsetLeft;

		this.max_focus = this.focus * this.xstep;
		this.size = this.images_width * 0.5;
		this.scrollbar_width = Math.round(this.images_width * 0.6);
		this.ifp_slider_width = this.sliderWidth * 0.5;
		//this.max_height = Math.round(this.images_width * 0.51);
		this.max_height = Math.round(thisObject.images_width / thisObject.aspectRatio);

		/* Change flowplus div properties */
		this.flowplus_div.onmouseover = function () { thisObject.autorotate = 'off'; return false; };
		this.flowplus_div.onmouseout = function () { thisObject.autorotate = thisObject.autoRotate; return false; };
		this.flowplus_div.style.height = this.max_height + 'px';

		/* Change images div properties */
		//this.imgs_div.style.height = this.images_width * 0.338 + 'px';
		this.images_height = Math.round(thisObject.max_height * .67);
		this.imgs_div.style.height = this.images_height + 'px';

		/* Change captions div properties */
		this.caption_div.style.width = this.images_width + 'px';
		this.caption_div.style.marginTop = this.images_width * 0.03 + 'px';

		/* Change and record scrollbar div properties */
		this.scrollbar_div.style.marginTop = this.images_width * 0.02 + 'px';
		this.scrollbar_div.style.marginLeft = this.images_width * 0.2 + 'px';
		this.scrollbar_div.style.width = this.scrollbar_width + 'px';
		
		this.scrollbar_left = this.scrollbar_div.offsetLeft;
		this.scrollbar_right = this.scrollbar_div.offsetLeft + this.scrollbar_div.offsetWidth;

		/* Set slider attributes */
		this.slider_div.onmousedown = function () { thisObject.dragstart(this); return false; };
		this.slider_div.style.cursor = this.sliderCursor;

		/* Cache EVERYTHING! */
		this.max = this.imgs_div.childNodes.length;
		var i = 0;
		for (var index = 0; index < this.max; index++)
		{ 
			var image_block = this.imgs_div.childNodes.item(index);
			if ((image_block.nodeType == 1) && (image_block.nodeName != "NOSCRIPT"))
			{
				this.array_images[i] = index;
				
				/* First child of image block is the image */
				var image = image_block.childNodes.item(0);
				
				/* Set image block onclick to glide to this image */
				image_block.onclick = function() { thisObject.autoRotate = "off"; thisObject.glideTo(this.i); return false; };
				image_block.x_pos = (-i * this.xstep);
				image_block.i = i;
				
				/* Add width and height as attributes ONLY once onload */
				if (onload === true)
				{
					//image_block.w = image.width;
					//image_block.h = image.height;
					image_block.w = image_block.clientWidth;
					image_block.h = image_block.clientHeight;
				}

				/* Check source image format. */
				if ((image_block.w + 1) > (image_block.h)) 
				{
					/* Landscape format */
					image_block.pc = 118;
				} else {
					/* Portrait and square format */
					image_block.pc = 100;
				}

				/* Set ondblclick event */
				image_block.url = image.getAttribute('data-link');
				if (image.getAttribute("data-style") && (image.getAttribute("data-style") == 'wpif2_lightbox')) {
					image_block.setAttribute("title",image.getAttribute('alt'));

					image_block.ondblclick = function () { thisObject.autoRotate = 'off'; thisObject.showTop(this);return false; }
				} else if (this.sameWindow) {
					image_block.ondblclick = function() { window.location = this.url; }
				} else { 
					image_block.ondblclick = function() { window.open (this.url); }
				}
				/* Set image cursor type */
				image_block.style.cursor = this.imagesCursor;

				i++;
			}
		}
		this.max = this.array_images.length;

		/* Display images in current order */
		if ((this.startImg > 0) && (this.startImg <= this.max))	{
			this.image_id = this.startImg - 1;
			this.mem_target = (-this.image_id * this.xstep);
			this.current = this.mem_target;
		}
		this.moveTo(this.current);
		this.glideTo(this.image_id);

		/* If autorotate on, set up next glide */
		this.autorotate = this.autoRotate;
		if ((this.autorotate == "on") && (this.rotatestarted == "false")) {
			window.setTimeout (thisObject.rotate, thisObject.autoRotatepause);
			this.rotatestarted = 'true';
		}
	};

	this.loaded = function()
	{
		if(document.getElementById(thisObject.ifp_flowplusdiv))
		{
			if (document.getElementById(thisObject.ifp_overlaydiv) === null) {
				/* Append overlay divs to the page - the overlay is shared by all instances */
				var objBody = document.getElementsByTagName("body").item(0);

				/* -- overlay div */
				var objOverlay = document.createElement('div');
				objOverlay.setAttribute('id',thisObject.ifp_overlaydiv);
				objOverlay.onclick = function() { thisObject.closeTop(); return false; };
				objBody.appendChild(objOverlay);
				jQuery("#"+thisObject.ifp_overlaydiv).fadeTo("fast", .7);
		
				/* -- top box div */
				var objLightbox = document.createElement('div');
				objLightbox.setAttribute('id',thisObject.ifp_topboxdiv);
				objBody.appendChild(objLightbox);

				/* ---- image div */
				var objLightboxImage = document.createElement("img");
				//objLightboxImage.onclick = function() { thisObject.closeTop(); return false; };
				objLightboxImage.setAttribute('id',thisObject.ifp_topboximgdiv);
				objLightbox.appendChild(objLightboxImage);

				/* ---- prev link */
				var objPrev = document.createElement("a");
				objPrev.setAttribute('id',thisObject.ifp_topboxprevdiv);
				objPrev.setAttribute('href','#');
				objLightbox.appendChild(objPrev);

				/* ---- next link */
				var objNext = document.createElement("a");
				objNext.setAttribute('id',thisObject.ifp_topboxnextdiv);
				objNext.setAttribute('href','#');
				objLightbox.appendChild(objNext);

				/* ---- caption div */
				var objCaption = document.createElement("div");
				objCaption.setAttribute('id',thisObject.ifp_topboxcaptiondiv);
				objLightbox.appendChild(objCaption);

				/* ---- close link */
				var objClose = document.createElement("a");
				objClose.setAttribute('id',thisObject.ifp_topboxclosediv);
				objClose.setAttribute('href','#');
				objLightbox.appendChild(objClose);

				objClose.onclick = function () { thisObject.closeTop(); return false; };
				objClose.innerHTML = "Close";
			}

			/* hide loading bar, show content and initialize mouse event listening after loading */
			thisObject.hide(thisObject.ifp_loadingdiv);
			thisObject.refresh(true);
			thisObject.show(thisObject.ifp_imagesdiv);
			thisObject.show(thisObject.ifp_scrollbardiv);
			thisObject.initMouseWheel();
			thisObject.initMouseDrag();
			thisObject.Touch.touch_init();
		}
	};

	this.unloaded = function()
	{
		/* Fixes the back button issue */
		document = null;
	};

	/* Handle the wheel angle change (delta) of the mouse wheel */
	this.handle = function(delta)
	{
		var change = false;
		if (delta > 0)
		{
			if(this.image_id >= 1)
			{
				this.target = this.target + this.xstep;
				this.new_image_id = this.image_id - 1;
				change = true;
			}
		} else {
			if(this.image_id < (this.max-1))
			{
				this.target = this.target - this.xstep;
				this.new_image_id = this.image_id + 1;
				change = true;
			}
		}

		/* Glide to next (mouse wheel down) / previous (mouse wheel up) image */
		if (change === true)
		{
			this.glideTo(this.new_image_id);
			this.autorotate = "off";
		}
	};

	/* Event handler for mouse wheel event */
	this.wheel = function(event)
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
		if (delta) thisObject.handle(delta);
		if (event.preventDefault) event.preventDefault();
		event.returnValue = false;
	};

	/* Initialize mouse wheel event listener */
	this.initMouseWheel = function()
	{
		if(window.addEventListener) {
			this.flowplus_div.addEventListener('DOMMouseScroll', this.wheel, false);
		}
		this.flowplus_div.onmousewheel = this.wheel;
	};

	/* This function is called to drag an object (= slider div) */
	this.dragstart = function(element)
	{
		thisObject.dragobject = element;
		thisObject.dragx = thisObject.posx - thisObject.dragobject.offsetLeft + thisObject.new_slider_pos;

		thisObject.autorotate = "off";
	};

	/* This function is called to stop dragging an object */
	this.dragstop = function()
	{
		thisObject.dragobject = null;
		thisObject.dragging = false;
	};

	/* This function is called on mouse movement and moves an object (= slider div) on user action */
	this.drag = function(e)
	{
		thisObject.posx = document.all ? window.event.clientX : e.pageX;
		if(thisObject.dragobject != null)
		{
			thisObject.dragging = true;
			thisObject.new_posx = (thisObject.posx - thisObject.dragx) + thisObject.ifp_slider_width;

			/* Make sure, that the slider is moved in proper relation to previous movements by the glideTo function */
			if(thisObject.new_posx < ( - thisObject.new_slider_pos)) thisObject.new_posx = - thisObject.new_slider_pos;
			if(thisObject.new_posx > (thisObject.scrollbar_width - thisObject.new_slider_pos)) thisObject.new_posx = thisObject.scrollbar_width - thisObject.new_slider_pos;
			
			var slider_pos = (thisObject.new_posx + thisObject.new_slider_pos);
			var step_width = slider_pos / ((thisObject.scrollbar_width) / (thisObject.max-1));
			var image_number = Math.round(step_width);
			var new_target = (image_number) * -thisObject.xstep;
			var new_image_id = image_number;

			thisObject.dragobject.style.left = thisObject.new_posx + 'px';
			thisObject.glideTo(new_image_id);
		}
	};

	/* Initialize mouse event listener */
	this.initMouseDrag = function()
	{
		thisObject.flowplus_div.onmousemove = thisObject.drag;
		thisObject.flowplus_div.onmouseup = thisObject.dragstop;

		/* Avoid text and image selection while this.dragging  */
		document.onselectstart = function () 
		{
			if (thisObject.dragging === true)
			{
				return false;
			}
			else
			{
				return true;
			}
		}
	};

	this.getKeyCode = function(event)
	{
		event = event || window.event;
		return event.keyCode;
	};


	this.Touch = {
		// TOUCH-EVENTS SINGLE-FINGER SWIPE-SENSING JAVASCRIPT
		// Courtesy of PADILICIOUS.COM and MACOSXAUTOMATION.COM
		
		// this script can be used with one or more page elements to perform actions based on them being swiped with a single finger

		triggerElementID : null, // this variable is used to identity the triggering element
		fingerCount : 0,
		startX : 0,
		startY : 0,
		curX : 0,
		curY : 0,
		deltaX : 0,
		deltaY : 0,
		horzDiff : 0,
		vertDiff : 0,
		minLength : 10, // the shortest distance the user may swipe
		swipeLength : 0,
		swipeAngle : null,
		swipeDirection : null,
		
		// The 4 Touch Event Handlers
		
		// NOTE: the touch_start handler should also receive the ID of the triggering element
		// make sure its ID is passed in the event call placed in the element declaration, like:
		// <div id="picture-frame" ontouchstart="touch_start(event,'picture-frame');"  
		//	ontouchend="touch_end(event);" ontouchmove="touch_move(event);" ontouchcancel="touch_cancel(event);">

		touch_init : function() { 
			thisObject.slider_div.ontouchstart = function(event) { thisObject.Touch.touch_start(event,thisObject.ifp_sliderdiv); return false; };
			thisObject.slider_div.ontouchend = function(event) { thisObject.Touch.touch_end(event); return false; };
			thisObject.slider_div.ontouchmove = function(event) { thisObject.Touch.touch_move(event); return false; };
			thisObject.slider_div.ontouchcancel = function(event) { thisObject.Touch.touch_cancel(event); return false; };
			
			thisObject.imgs_div.ontouchstart = function(event) { thisObject.Touch.touch_start(event,thisObject.ifp_imagesdiv); return false; };
			thisObject.imgs_div.ontouchend = function(event) { thisObject.Touch.touch_end(event); return false; };
			thisObject.imgs_div.ontouchmove = function(event) { thisObject.Touch.touch_move(event); return false; };
			thisObject.imgs_div.ontouchcancel = function(event) { thisObject.Touch.touch_cancel(event); return false; };

			topbox_div = document.getElementById(thisObject.ifp_topboxdiv);
			topbox_div.ontouchstart = function(event) { thisObject.Touch.touch_start(event,thisObject.ifp_topboxdiv); return false; };
			topbox_div.ontouchend = function(event) { thisObject.Touch.touch_end(event); return false; };
			//topbox_div.ontouchmove = function(event) { thisObject.Touch.touch_move(event); return false; };
			topbox_div.ontouchcancel = function(event) { thisObject.Touch.touch_cancel(event); return false; };
		},

		touch_start : function (event,passedName) { 
			this.touch_reset(event);
	 
			// disable the standard ability to select the touched object
			event.preventDefault();
			// get the total number of fingers touching the screen
			this.fingerCount = event.touches.length;
			// since we're looking for a swipe (single finger) and not a gesture (multiple fingers),
			// check that only one finger was used
			if ( this.fingerCount == 1 ) {
				// get the coordinates of the touch
				this.startX = event.touches[0].pageX;
				this.startY = event.touches[0].pageY;
				// store the triggering element ID
				this.triggerElementID = passedName;
			} else {
				// more than one finger touched so cancel
				//this.touch_cancel(event);
			}
		},

		touch_move : function (event) { 
			event.preventDefault();
			if ( event.touches.length == 1 ) {
				this.curX = event.touches[0].pageX;
				this.curY = event.touches[0].pageY;
				
				// glide during move only if this is the scrollbar
				if ( jQuery(document.getElementById(this.triggerElementID)).hasClass('wpif2_slider') ) {
					this.touch_glide(event);
				}
			} else { 
				//this.touch_cancel(event);
			}
		},	
		
		touch_end : function (event) { 
			// clean up at end of swipe
			event.preventDefault(); 
			//alert(this.triggerElementID);
			this.touch_glide(event);
			//this.touch_cancel(event);
			return false;
		},

		touch_glide : function (event) { 
			// check to see if more than one finger was used and that there is an ending coordinate
			if ( this.fingerCount == 1 && this.curX != 0 ) {
				// use the Distance Formula to determine the length of the swipe
				this.swipeLength = Math.round(Math.sqrt(Math.pow(this.curX - this.startX,2) + Math.pow(this.curY - this.startY,2)));
				// if the user swiped more than the minimum length, perform the appropriate action
				if ( this.swipeLength >= this.minLength ) { 
					this.calculate_angle();
					this.determine_swipe_direction();
					this.processing_routine();
					//this.touch_cancel(event); // reset the variables (nope - process while swiping)
				} else { 
					//this.touch_cancel(event); // nope - process while swiping
					// perform the click action related to the focussed image
					this.tap();
				}	
			} else { 
				this.tap();
			}
		},

		touch_reset : function (event) {
			// reset the variables back to default values
			this.fingerCount = 0;
			this.startX = 0;
			this.startY = 0;
			this.curX = 0;
			this.curY = 0;
			this.deltaX = 0;
			this.deltaY = 0;
			this.horzDiff = 0;
			this.vertDiff = 0;
			this.swipeLength = 0;
			this.swipeAngle = null;
			this.swipeDirection = null;
			this.triggerElementID = null;
		},
		
		calculate_angle : function () {
			var X = this.startX-this.curX;
			var Y = this.curY-this.startY;
			var Z = Math.round(Math.sqrt(Math.pow(X,2)+Math.pow(Y,2))); //the distance - rounded - in pixels
			var r = Math.atan2(Y,X); //angle in radians (Cartesian system)
			this.swipeAngle = Math.round(r*180/Math.PI); //angle in degrees
			if ( this.swipeAngle < 0 ) { this.swipeAngle =  360 - Math.abs(this.swipeAngle); }
		},
		
		determine_swipe_direction : function () {
			if ( (this.swipeAngle <= 45) && (this.swipeAngle >= 0) ) {
				this.swipeDirection = 'left';
			} else if ( (this.swipeAngle <= 360) && (this.swipeAngle >= 315) ) {
				this.swipeDirection = 'left';
			} else if ( (this.swipeAngle >= 135) && (this.swipeAngle <= 225) ) {
				this.swipeDirection = 'right';
			} else if ( (this.swipeAngle > 45) && (this.swipeAngle < 135) ) {
				this.swipeDirection = 'down';
			} else {
				this.swipeDirection = 'up';
			}
		},
		
		processing_routine : function () {
			var swipedElement = document.getElementById(this.triggerElementID);
			if (( this.swipeDirection == 'left' ) || ( this.swipeDirection == 'right' )) {
				var X;
				if ( this.triggerElementID == thisObject.ifp_topboxdiv) {
					// move one lightbox image at a time on swipe
					if (this.swipeDirection == 'left') {
						var element = document.getElementById(thisObject.ifp_topboxnextdiv);
						jQuery(element).click();
					} else if (this.swipeDirection == 'right') {
						var element = document.getElementById(thisObject.ifp_topboxprevdiv);
						jQuery(element).click();
					}
				} else if ( jQuery(swipedElement).hasClass('wpif2_images') ) {
					// move one carousel image at a time on swipe
					if (this.swipeDirection == 'left') X = thisObject.image_id + 1;
					if (this.swipeDirection == 'right') X = thisObject.image_id - 1;
					if (X < 0) X = 0;
					if (X >= thisObject.max) X = thisObject.max - 1;
					thisObject.glideTo(X); 
				} else { 
					// drag images according to the scrollbar position
					X = Math.round(thisObject.max * (this.curX - thisObject.scrollbar_left)/(thisObject.scrollbar_right - thisObject.scrollbar_left));
					if (X < 0) X = 0;
					if (X >= thisObject.max) X = thisObject.max - 1;
					thisObject.glideTo(X); 
				} 
			} else {
				//this.tap();
			}
		},
		
		tap : function () {
			var swipedElement = document.getElementById(this.triggerElementID);
			
			// taps in the carousel open the lightbox
			if ( jQuery(swipedElement).hasClass('wpif2_images') ) {
				var image_block = thisObject.imgs_div.childNodes.item(thisObject.array_images[thisObject.image_id]);
				var image = image_block.childNodes.item(0);
				
				if (image.getAttribute("data-style") && (image.getAttribute("data-style") == 'wpif2_lightbox')) {
					thisObject.autoRotate = "off"; 
					thisObject.showTop(image_block);
				} else if (thisObject.sameWindow) {
					window.location = image.url;
				} else {
					window.open (image.url);
				}
			}
			
			// taps in the lightbox move to prev/next image or close the lightbox
			if (  this.triggerElementID == thisObject.ifp_topboxdiv ) {
				var image_div = document.getElementById(thisObject.ifp_topboximgdiv);
				if (this.startY >= (jQuery(image_div)).offset().top + jQuery(image_div).height()) {
					// taps below the image close the lightbox
					thisObject.closeTop();
				} else if (this.startX >= (jQuery(swipedElement).offset().left + jQuery(swipedElement).width()/2)) {
					// taps on the right go to the next slide
					var element = document.getElementById(thisObject.ifp_topboxnextdiv);
					jQuery(element).click();
				} else {
					// otherwise go to the previous slide
					var element = document.getElementById(thisObject.ifp_topboxprevdiv);
					jQuery(element).click();
				}			
				//alert( this.startX >= (jQuery(swipedElement).offset().left + jQuery(swipedElement).width()/2) ? 'clicked right' : 'clicked left');
			}
			
		}
	};

	this.getPageScroll = function(){
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
	};

	this.getPageSize = function(){
		var xScroll, yScroll;
		if (window.innerHeight && window.scrollMaxY) {	
			xScroll = window.innerWidth + window.scrollMaxX;
			yScroll = window.innerHeight + window.scrollMaxY;
		} else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
			xScroll = document.body.scrollWidth;
			yScroll = document.body.scrollHeight;
		} else if (document.documentElement.scrollHeight > document.body.offsetHeight){ // IE7, 6 standards compliant mode
			xScroll = document.documentElement.scrollWidth;
			yScroll = document.documentElement.scrollHeight;
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
	};

	this.showFlash = function(){
		var flashObjects = document.getElementsByTagName("object");
		for (i = 0; i < flashObjects.length; i++) {
			flashObjects[i].style.visibility = "visible";
		}
		var flashEmbeds = document.getElementsByTagName("embed");
		for (i = 0; i < flashEmbeds.length; i++) {
			flashEmbeds[i].style.visibility = "visible";
		}
	};

	this.hideFlash = function(){
		var flashObjects = document.getElementsByTagName("object");
		for (i = 0; i < flashObjects.length; i++) {
			flashObjects[i].style.visibility = "hidden";
		}
		var flashEmbeds = document.getElementsByTagName("embed");
		for (i = 0; i < flashEmbeds.length; i++) {
			flashEmbeds[i].style.visibility = "hidden";
		}
	};

	this.showTop = function(image_block)
	{
		var topbox_div = document.getElementById(this.ifp_topboxdiv);
		var overlay_div = document.getElementById(this.ifp_overlaydiv);
		var topboximgs_div = document.getElementById(this.ifp_topboximgdiv);

		// this.hide flash objects
		this.hideFlash();

		// this.show the background overlay ...
		var arrayPageSize = this.getPageSize();
		overlay_div.style.width = arrayPageSize[0] + "px";
		overlay_div.style.height = arrayPageSize[1] + "px";
		overlay_div.style.display = 'none';
		overlay_div.style.visibility = 'visible';
		jQuery("#"+this.ifp_overlaydiv).show();

		// Get the top box data set up first
		topboximgs_div.src = image_block.url;
		document.getElementById(this.ifp_topboxcaptiondiv).innerHTML = image_block.getAttribute('title');

		// get the image actual size by preloading into 't'
		var t = new Image();
		  t.onload = (function(){	thisObject.showImg(image_block, t, t.width, t.height); });
		t.src = image_block.url;

		// Now wait until 't' is loaded
	};


	this.showImg = function(image_block, img, img_width, img_height) 
	{	
		// Wait for image to preload
		if (img_width == 0 || img_height == 0) {
			img.onload = (function(){ thisObject.showImg(image_block, img, img.width, img.height); });
			return;
		}

		// Do nothing if the overlay was closed in the meantime
		if (document.getElementById(this.ifp_overlaydiv).style.visibility == 'hidden') return;

		var topbox_div = document.getElementById(this.ifp_topboxdiv);
		var overlay_div = document.getElementById(this.ifp_overlaydiv);
		var topboximgs_div = document.getElementById(this.ifp_topboximgdiv);
		var prev_div = document.getElementById(this.ifp_topboxprevdiv);
		var next_div = document.getElementById(this.ifp_topboxnextdiv);
		var caption_div = document.getElementById(this.ifp_topboxcaptiondiv);

		// The image should be preloaded at this point
		topboximgs_div.src = image_block.url;

		// Find previous image that doesn't link to an url
		prev_div.style.visibility = 'hidden';
		if (image_block.i > 0) {
			for (index = image_block.i-1; index >= 0; index--) {
				prev_image_block = this.imgs_div.childNodes.item(this.array_images[index]);
				prev_image = prev_image_block.childNodes.item(0);
				if (prev_image.getAttribute("data-style") && (prev_image.getAttribute("data-style") == 'wpif2_lightbox')) {
					// Found one - preload and set the previous link
					var p = new Image();
					p.src = prev_image_block.url;
					prev_div.onclick = (function(){ thisObject.showImg(prev_image_block, p, p.width, p.height); return false;});
					prev_div.style.visibility = 'visible';
					break;
				}
			} 
		}

		// Find next image that doesn't link to an url
		next_div.style.visibility = 'hidden';
		if (image_block.i < this.max-1) {
			for (index = image_block.i+1; index < this.max; index++) {
				next_image_block = this.imgs_div.childNodes.item(this.array_images[index]);
				next_image = next_image_block.childNodes.item(0);
				if (next_image.getAttribute("data-style") && (next_image.getAttribute("data-style") == 'wpif2_lightbox')) {
					// Found one - preload and set the next link
					var n = new Image();
					n.src = next_image_block.url;
					next_div.onclick = (function(){ thisObject.showImg(next_image_block, n, n.width, n.height); return false;});
					next_div.style.visibility = 'visible';
					break;
				} 
			}
		}

		// Size the box to fit the image plus estimate caption height plus some space
		var boxWidth = img_width;
		var boxHeight = img_height + 30;

		topboximgs_div.width = boxWidth;	

		// Add description and include its height in the calculations
		var description = '';
		image = image_block.childNodes.item(0);
		if (image.getAttribute('data-description')) description = image.getAttribute('data-description');
		if (description == image.getAttribute('title')) description = '';
		if (description != '') { description = '<p>' + description + '</p>'; }
		caption_div.innerHTML = image_block.getAttribute('title') + description;
		if (description != '') {
			jQuery('#'+this.ifp_topboxcaptiondiv).width(boxWidth);	// do this now to estimate the description height
			boxHeight += jQuery('#'+this.ifp_topboxcaptiondiv).height();
		}

		// scale the box if the image is larger than the screen
		var arrayPageSize = this.getPageSize();
		var screenWidth = arrayPageSize[2];
		var screenHeight = arrayPageSize[3];

		var arrayPageScroll = this.getPageScroll();

		if (boxWidth > screenWidth) {
			boxHeight = Math.floor(boxHeight * (screenWidth-100) / boxWidth);
			boxWidth = screenWidth - 100;
			topboximgs_div.width = boxWidth;
		}
		if (boxHeight > screenHeight) {
			boxWidth = Math.floor(boxWidth * (screenHeight-100) / boxHeight);
			boxHeight = screenHeight - 100;
			topboximgs_div.width = boxWidth;
		}
		jQuery('#'+this.ifp_topboxcaptiondiv).width(boxWidth);

		var xPos = Math.floor((screenWidth - boxWidth) * 0.5) + arrayPageScroll[0];
		var yPos = Math.floor((screenHeight - boxHeight) * 0.5) + arrayPageScroll[1];

		topbox_div.style.left = xPos + 'px';
		topbox_div.style.top = yPos + 'px';
		topbox_div.style.width = boxWidth + 'px';

		prev_div.style.height = boxHeight + 'px';
		next_div.style.height = boxHeight + 'px';


		// Finally show the topbox...
		topbox_div.style.display = 'none';
		topbox_div.style.visibility = 'visible';
		jQuery("#"+this.ifp_topboxdiv).fadeIn("slow");

	};

	this.closeTop = function()
	{
		//hide the overlay and topbox...
		document.getElementById(this.ifp_overlaydiv).style.visibility='hidden';
		document.getElementById(this.ifp_topboxdiv).style.visibility='hidden';
		document.getElementById(this.ifp_topboxnextdiv).style.visibility='hidden';
		document.getElementById(this.ifp_topboxprevdiv).style.visibility='hidden';

		// this.show hidden objects
		this.showFlash();
	};

	// Setup
	if (document.getElementById(thisObject.ifp_flowplusdiv) === null) { return; }

	/* show loading bar while page is loading */
	thisObject.show (thisObject.ifp_loadingdiv);

	if (typeof window.onunload === "function")
	  {
		var oldonunload = window.onunload;
		window.onunload = function()
		{
			thisObject.unloaded();
			oldonunload();
		};
	} else { 
		window.onunload = this.unloaded; 
	}

	if (typeof window.onload === "function")
	  {
		var oldonload = window.onload;
		window.onload = function()
		{
			thisObject.loaded();
			oldonload();
		};
	} else {
		window.onload = thisObject.loaded;
	}

	/* refresh on window resize */
	window.onresize = function()
	{
		if (document.getElementById(thisObject.ifp_flowplusdiv)) { thisObject.refresh(false); }
	};

	document.onkeydown = function(event)
	{
		var charCode  = thisObject.getKeyCode(event);
		switch (charCode)
		{
			/* Right arrow key */
			case 39:
				thisObject.handle(-1);
				break;
		
			/* Left arrow key */
			case 37:
				thisObject.handle(1);
				break;
		}
	};

}