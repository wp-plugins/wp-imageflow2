=== WP-ImageFlow Plus ===
Author: Bev Stofko
Contributors: Bev Stofko
Donate link: http://stofko.ca/wp-imageflow2-wordpress-plugin/
Requires at least: 3.0.1
Tested up to: 3.4.2
Stable tag: 1.7.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Tags: picture, pictures, gallery, galleries, imageflow, coverflow, flow, image, images, flow, lightbox, carousel, autorotate, automatic, rotate, media, tages

ImageFlow style picture gallery with Lightbox popups. Uses either the Wordpress media library or an uploaded directory of images. 

== Description ==

Now available, version 1.7.0:

* NEW FEATURE - Support touch screen on the scroll bar to slide the images left/right
* NEW FEATURE - Provide option to open image links in the same window
* NEW FEATURE - Provide image link field in the image editor window rather than using the image description

= WP-Imageflow2 =

Display nice looking ImageFlow galleries within posts and pages.  Link each image to either a Lightbox preview or an external URL. The Lightbox pop-up supports cycling through all the photos - left/right arrows appear when hovering over the photos. 

This is a light script that uses the basic JQuery library. It will display a simple thumbnail list if Javascript is disabled in the browser.

There are three ways to insert a WP-ImageFlow Plus gallery:

1. Select the built-in Wordpress media library attached images with the shortcode [wp-imageflow2]
2. Upload your pictures to a subfolder and use the shortcode [wp-imageflow2 dir=SUBFOLDER]
3. Tag images in your media library using the Media Tags plugin by Paul Menard and use the shortcode [wp-imageflow2 mediatag=tagslug]

Features:

* Multiple galleries per page
* Configure the background color, text color, container width and choose black or white for the scrollbar. 
* Auto-rotation of the images
* Configure the starting slide number
* Touch control of the scrollbar
* Optional link field in the image editor to link an image to an URL instead of the lightbox
* Option to open links in the same window or a new window
* Enable/disable automatic rotation for each instance of a gallery
* Supports full text description in the popup window of a gallery from the media library
* Two versions of the reflection script to support more browser configurations
* Display with or without reflections

Two versions of the reflection script are provided. The default, V2, works on most servers. V3 provides PNG reflections but requires a higher version of GD that many servers don't support. You can choose which version to use (or none at all) on the settings page.

When using the built in Wordpress library, the photo title will be displayed below each image. When using a subfolder gallery, the image name will be displayed below each image.

For a built-in gallery, the image may link to either the large size image or an external url.

= Auto Rotation =

When auto rotation is enabled, the images will automatically rotate through the carousel. You may configure the pause time between rotations. Once the end
of the gallery is reached it flows back to the beginning and starts again. The rotation will pause when the mouse hovers over the bounding div. Once an image is clicked and expanded into the Lightbox display the auto rotation is suspended.

[Demo](http://www.stofko.ca/wp-imageflow2-wordpress-plugin/)

== Installation ==

1. Unzip to the /wp-content/plugins/ directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Configure the gallery in Settings -> WP-ImageFlow Plus.

= Using the built-in Wordpress library: =

1. Upload images using the Wordpress image uploader on your post or page or into the media library. Enter a title to display, and optionally enter a description that may be used as an external link.
2. Use the shortcode [wp-imageflow2] anywhere in the post or page
3. If you want the image to link to an external URL, enter the address in the WP-Imageflow Plus link field in the image editor (ie: http://www.website.com). If the link field does not contain a URL, the image will link to the full size popup image with the description (if any) displayed as text below the image.

These standard gallery options may be used:

* id
* order (default is ASC)
* orderby (default is menu_order ID)
* include
* exclude
* size (applies to RSS feed only)

These additional WP-Imageflow Plus specific options may be used:

* mediatag   - Corresponds to Media Tags plugin by Paul Menard. This option will pull matching media out of your media library and include it in the gallery.
* startimg   - Gives the starting slide number to center in the gallery, the default is 1.
* rotate     - Turns on/off auto-rotation for this instance (overrides the setting from the admin panel). Values are 'on' or 'off'.
* samewindow - Set true or false, overrides the default value from the settings page.

= For galleries based on a subfolder: =

1. Create a folder for your galleries within your WordPress installation, wherever you want. The location has to be accessible from the internet - for example you could use wp-content/galleries.
2. Upload your image galleries to a subfolder of this folder, for example you might upload your images under "wp-content/galleries/subfolder".
3. Set the "Path to galleries from homepage root path" in the settings admin page for WP-ImageFlow Plus. Enter the path with trailing slash like: "wp-content/galleries/". NEW - alternatively you may also enter the full path like "http://www.mywebsite.com/wp-content/galleries/". Note that the gallery must reside on the same server as the blog. If you have entered the gallery path correctly you will see a list of the sub-directories on the settings page.
4. Insert a gallery on a page by specifying the shortcode [wp-imageflow2 dir=subfolder] on your post or page.

This gallery style will display the image names as the captions, and will link to the full size image.

These additional WP-Imageflow Plus specific options may be used:

* startimg   - Gives the starting slide number to center in the gallery, the default is 1.
* rotate     - Turns on/off auto-rotation for this instance (overrides the setting from the admin panel). Values are 'on' or 'off'.
* samewindow - Set true or false, overrides the default value from the settings page.


== FAQ ==

= My carousel contains broken images. What can I do? =

If your reflected images don't show up, you might have a server that generates 404 errors on the reflected images. In this case select the option in the settings for strict servers.

= Is there a way for me to place a tag in my template so that the gallery would be part of it? =

You can insert any shortcode into a template using this enclosed in standard PHP tags:

echo do_shortcode('[shortcode option1="value1" option2="value2"]');

So for WP-Imageflow Plus, just insert something like this:

echo do_shortcode('[wp-imageflow2 dir="value"]');

= How can I help support this plugin? =

A donation to support this plugin would be greatly appreciated. I also appreciate a rating on the WordPress plugin directory.

== Screenshots ==

1. WP-ImageFlow Plus
2. Choose the options you need. 
3. Add an image link

== Changelog ==

Version 1.7.0 (December 4, 2012)

* NEW FEATURE - Support touch screen on the scroll bar to slide the images left/right
* NEW FEATURE - Provide option to open image links in the same window
* NEW FEATURE - Provide image link field in the image editor window rather than using the image description
* Support secure links for the image link URL
* Fix debug message when reflect scripts disabled

NOTES - 
- Image links given in the image description are now deprecated and support will be dropped in the future. 

Version 1.6.6 (October 31, 2012)

* Fix slider width calculation (was slightly off in IE7)
* Improve Lightbox prev/next image preloads (problem was notable when clicking rapidly through the lightbox on slow-responding servers using IE7 & 8)

Version 1.6.5 (March 6, 2012)

* Default to old reflect script and provide an option to select the new reflect script since the old script works on more servers
* Fix warning in debug mode

Version 1.6.4 (February 14, 2012)

* Move to newer V3 reflect script to support PNG reflections
* Update deprecated code, fix loadingdiv reference
* Fix html validation errors on noscript images
* Fix "&" html validation errors

Version 1.6.3 (September 9, 2010)

* Fix display of caption for galleries based on a directory

Version 1.6.2 (May 17, 2010)

* Fix bug when gallery has only one image

Version 1.6.1 (May 14, 2010)

* Support directory paths specified as URLs to provide support to more server configurations

Version 1.6.0 (May 13, 2010)

* NEW FEATURE - Provide an option to start at a specific slide number
* NEW FEATURE - Provide an option to turn on/off rotate for each instance of a gallery
* NEW FEATURE - Support full text description in the popup window of a built-in gallery
* Handle files with special characters in the name

Version 1.5.4 (May 7, 2010)

* Fix potential conflict 

Version 1.5.3 (May 7, 2010)

* Fix dragging the scrollbar on galleries beyond the first on a page
* Update overlay div creation

Version 1.5.2 (May 4, 2010)

* Fix potential rotation problem with IE

Version 1.5.1 (May 4, 2010)

* Fix black slider on built-in galleries

Version 1.5.0 (May 3, 2010)

* Support gallery based on Media Tags (plugin by Paul Menard)
* Support auto-rotation (default is disabled, enable using the settings page)

Version 1.4.9 (April 17, 2010)

* Fix the slider styling added in 1.4.8 - it caused other problems. 

Version 1.4.8 (April 16, 2010)

* Use stronger styling on slider to override some theme styles
* New option - to be used on servers with more secure settings to prevent reflected images generating 404 errors
* Fix Lightbox when last image in gallery has an external link

Version 1.4.7 (April 14, 2010)

* Drop Scriptaculous library since it clashes with MooTools, now only uses the basic jquery library
* Support transparency as a background colour. In this case the image reflections will be black over a transparent div.

Version 1.4.6 (April 13, 2010)

* Define PHP_EOL if not found
* Fix black scrollbar

Version 1.4.5 (April 13, 2010)

* Fix dragging scroll bar (don't know how I missed that one!)
* Hide dashed outline of prev/next links in Lightbox on Firefox

Version 1.4.4 (April 11, 2010)

* Admin menu - fix possible missing text

Version 1.4.3 (April 11, 2010)

* Fix class on outer div (this matters to those who use custom styling)

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
