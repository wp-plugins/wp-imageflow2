=== WP-ImageFlow2 ===
Author: Bev Stofko
Contributors: Bev Stofko
Donate link: http://stofko.ca/wp-imageflow2-wordpress-plugin/
Tested up to: 2.9.1
Version: 1.4.3
Requires at least: 2.8.4
Tags: picture, pictures, gallery, galleries, imageflow, coverflow, flow, image, images, flow, lightbox

ImageFlow style picture gallery with Lightbox popups. Uses either the built-in Wordpress gallery or an uploaded directory 
of images. Displays simple thumbnail list if Javascript is disabled.


== Description ==

** Version 1.4.x contains significant changes and should be considered beta at this time. **

Display nice looking ImageFlow galleries within posts and pages.  Link each image to either a Lightbox preview or an external URL. The Lightbox pop-up supports
cycling through all the photos - left/right arrows appear when hovering over the photos. Supports multiple instances of the galleries on a single page.

There are two ways to insert a WP-ImageFlow2 gallery:

1. Use the built-in Wordpress gallery use the shortcode [wp-imageflow2]
2. Upload your pictures to a subfolder and use the shortcode [wp-imageflow2 dir=SUBFOLDER]

You can configure the background color, text color, container width and choose black or white for the scrollbar.

When using the built in Wordpress gallery, the photo title will be displayed below each image. When using a subfolder gallery, the image name will 
be displayed below each image.

For a built-in gallery, the image may link to either the large size image or an external url.


[Demo](http://www.stofko.ca/wp-imageflow2-wordpress-plugin/)

= Notes =

IF YOU ARE UPGRADING FROM 1.3.1 OR PRIOR AND YOU USED CUSTOM STYLING ON YOUR WP-IMAGEFLOW2 DIVS, YOU MUST UPDATE YOUR CUSTOM STYLES:

* The main WP-ImageFlow2 divs are now CLASSes instead of IDs in order to support multiple instances, so any custom styling must be changed from #wpif2... to .wpif2...

IF YOU ARE UPGRADING FROM 1.2.6 OR PRIOR, YOU MUST EDIT YOUR GALLERY SHORTCODES:

* Use [wp-imageflow2] instead of [gallery]
* Use [wp-imageflow2 dir=SUBFOLDER] instead of [wp-imageflow2=SUBFOLDER]

== Installation ==

1. Unzip to the /wp-content/plugins/ directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Configure the gallery in Settings -> WP-ImageFlow2.

= For a built-in Wordpress gallery: =

1. Create a standard Wordpress gallery on your post or page. Enter a title to display, and optionally enter a description that may be used as an external link.
2. Use the shortcode [wp-imageflow2] anywhere in the post or page
3. If you want the image to link to an external url, enter the url in the description field of the image (as http://www.website.com) and enable the 
checkbox in the options. If the description field is left blank the link will go to the full size image.

These gallery options may be used:

* id
* order (default is ASC)
* orderby (default is menu_order ID)
* include
* exclude
* size (applies to RSS feed only)

These gallery options will be ignored:

* columns
* itemtag 
* icontag 
* captiontag
* link

= For galleries based on a subfolder: =

1. Create a folder for your galleries within your WordPress installation, wherever you want (has to be accessible from the internet - ie wp-content/galleries).
2. Set the "Path to galleries from homepage root path" in the configuration options  (ie wp-content/galleries/)
3. Upload your image galleries to a subfolder of this folder (ie wp-content/galleries/gallery1)
4. Insert a gallery on a page by specifying [wp-imageflow2 dir=SUBFOLDER] (ie [wp-imageflow2 dir=gallery1])

If you have entered the gallery path correctly you will see a list of the sub-directories on the settings page of the administration panel.

This gallery style will display the image names as the captions, and will link to the full size image. 

* If you installed Wordpress at the root level, your galleries path might be wp-content/galleries/
* If you installed Wordpress under blog, your galleries path might be blog/wp-content/galleries/

= Notes =

IF YOU ARE UPGRADING FROM 1.3.1 OR PRIOR AND YOU USED CUSTOM STYLING ON YOUR WP-IMAGEFLOW2 DIVS, YOU MUST UPDATE YOUR CUSTOM STYLES:

* The main WP-ImageFlow2 divs are now CLASSes instead of IDs in order to support multiple instances, so any custom styling must be changed from #wpif2... to .wpif2...

IF YOU ARE UPGRADING FROM 1.2.6 OR PRIOR, YOU MUST EDIT YOUR GALLERY SHORTCODES:

* Use [wp-imageflow2] instead of [gallery]
* Use [wp-imageflow2 dir=SUBFOLDER] instead of [wp-imageflow2=SUBFOLDER]

== Screenshots ==

1. WP-ImageFlow 2
2. Choose the options you need. 

== Changelog ==

Version 1.4.3 (April 11, 2010)

* Fix class on outer div

Version 1.4.2 (April 9, 2010)

* Improve image path construction for galleries based on a subdirectory, to hopefully work on all servers

Version 1.4.1 (April 8, 2010)

* Fix captions when cycling through the Lightbox view 

Version 1.4 (April 8, 2010)

* Support multiple instances of wp-imageflow2 galleries on a single page. You must update your custom styles when updating from a previous version (see Installation notes).
* Lightbox pop-up now supports cycling through the images directly with left/right arrows appearing when hovering over the photos.
* Fix color-code check in settings page (broken on version 1.2)
* Style changes in the method used to display the flow gallery - should be compatible with more themes

Version 1.3.1 (March 26, 2010)

* Fix potential loading issue in IE

Version 1.3.0 (March 25, 2010)

* New shortcode method: [wp-imageflow2] for the built-in gallery and [wp-imageflow2 dir=subdir] for a subdirectory. YOU MUST UPDATE YOUR SHORTCODES WHEN UPGRADING FROM A PREVIOUS VERSION.
* Dropped support for prior shortcode method
* Organize code into a class to prevent potential collisions with other plugins
* General code clean-up

Version 1.2.6 (March 10, 2010)

* Fix issues on legacy version of Internet explorer

Version 1.2.5 (March 7, 2010)

* Fix overlay size and position on scrolled screens

Version 1.2.4 (March 5, 2010)

* Fix problem with include/exclude built-in gallery options

Version 1.2.3 (March 4, 2010)

* Use a different method to extract image info so it works on servers with url access disabled

Version 1.2.2 (March 2, 2010)

* Remove the need for PHP 5
* Add option to turn off reflections (if your server doesn't support GD or you just don't want them)

Version 1.2.1 (February 18, 2010)

* Add a "close" link to the overlay div of the image Lightbox in case the full size image never loads

Version 1.2 (February 16, 2010)

* Use a Lightbox effect for the large size image display rather than opening a new window
* Don't load scripts on admin pages
* Trim spaces from the galleries url entered on the settings page
* Display simple thumbnail gallery on browsers with Javascript disabled

Version 1.1 (February 8, 2010)

* Fix problem with image paths on some servers

Version 1.0.1 (February 3, 2010)

* Fix typo in readme.txt

Version 1.0 (January 29, 2010)

* Initial version
