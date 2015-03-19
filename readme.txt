=== WP Flow Plus ===
Contributors: wp-flow-plus
Requires at least: 3.0.1
Tested up to: 4.1
Stable tag: trunk
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Tags: picture, pictures, gallery, galleries, imageflow, coverflow, flow, image, images, flow, lightbox, carousel, autorotate, automatic, rotate, media, tags

Flow style gallery with Lightbox popups. Uses images from the Wordpress Media Library or an uploaded directory of images. 

== Description ==

= WP Flow Plus =

Display attractive flow style carousel galleries with or without reflections.  Each image links to either a Lightbox preview or to a URL. The Lightbox pop-up supports cycling through all the photos - left/right arrows appear when hovering over the photos. 

This is a light script that uses the basic JQuery library. It will display a simple thumbnail list if Javascript is disabled in the browser.

[Demo and Documentation](http://www.wpflowplus.com)

= Features =

* CSS reflections
* Configure carousel image size
* Configure carousel aspect ratio
* Multiple galleries per page
* Configure the background color, text color, container width and choose black or white for the scrollbar. 
* Auto-rotation of the images
* Configure the starting slide number
* Touch control of the scrollbar
* Optional link field in the image editor to link an image to an URL instead of the lightbox
* Option to open links in the same window or a new window
* Enable/disable automatic rotation for each instance of a gallery
* Supports full text description in the popup window of a gallery from the media library
* Two versions of the PHP reflection script to support more browser configurations (CSS reflections is the recommended method)
* Display with or without reflections
* Gallery based on images from the Media Library or a simple folder of images

**BONUS FEATURES AVAILABLE WITH MINIMUM $10 DONATION**

* Lightbox arrow options (NEW)
* Featured post support
* Shortcode generator
* NextGen gallery support

[Learn more about bonus add-ons](http://www.wpflowplus.com/plugins/wp-flow-plus/bonus-add-ons/)

== Installation ==

1. Unzip to the /wp-content/plugins/ directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Configure the gallery in Settings -> WP Flow Plus.

= Shortcode =

`[wp-flowplus]`

= The following basic options are supported: =

**orderby**

Specify how to sort the display thumbnails. The default is "menu_order". This supports the standard WordPress options: menu_order, title, post_date, rand, ID

**order**

Specify the sort order used to display thumbnails. ASC or DESC. For example, to sort by ID, DESC:

`[wp-flowplus order="DESC" orderby="ID"]`

**id**

Specify the post ID. The gallery will display images which are attached to that post. The default behavior, if no ID is specified, is to display images attached to the current post. For example, to display images attached to post 123:

`[wp-flowplus id="123"]`

**include**

Comma separated attachment IDs to show only the images from these attachments.

`[wp-flowplus include="23,39,45"]`

**exclude**

Comma separated attachment IDs excludes the images from these attachments. Please note that include and exclude cannot be used together.

`[wp-flowplus exclude="21,32,43"]`

**dir**

Specify a subdirectory name. The path to the subdirectory must be configured on the settings page.

**mediatag**

Works with the Media Tags plugin by Paul Menard. This option will pull matching media out of your media library and include it in the gallery. Specify the media slug to select. Example use:  mediatag=mymedia

**startimg**

Gives the starting slide number to center in the gallery, the default is 1.

**rotate**

Turns on/off auto-rotation for this instance (overrides the setting from the admin panel). Values are 'on' or 'off'.

**samewindow**

Specifies if links open in the same window or a new window. Set true or false, overrides the default value from the settings page.

= The following options are available with the bonus add-ons =

**category**

Select featured posts by category. The featured image of each post will be placed in the carousel, and each image will link to the post. If a post has no featured image, the first image found attached to the post will be used instead, if there is no attached image a default image will be used.

**ngg_id**

Create carousel from a NextGen gallery. With the NextGen plugin you can perform bulk image resizing, and regenerate thumbnails in any size. The WP Flow Plus carousel will use the thumbnail size for the carousel images, and the full size for the Lightbox images.

== FAQ ==

[Please visit the plugin website for complete documentation and Knowledge Base articles] (http://www.sunnythemes.com/plugins/wp-flow-plus/)

As a quick test, perform the following steps:

1. Install the plugin
2. Open up a post/page edit window
3. Upload some images into the post
4. Insert the [wp-flowplus] shortcode
5. Preview the post

== Screenshots ==

1. WP Flow Plus
2. General options
3. Format options
4. Add an image link

== Changelog ==

Version 2.2.1 (March 18, 2015)

* Remove potential XSS vulnerability

Version 2.2.0 (March 18, 2015)

* Improve admin area layout
* Swedish translation courtesy of Kenneth Andersson

Version 2.1.0 (July 2, 2014)

* Language support added
* Spanish and Serbian translation courtesy of [Ogi Djuraskovic](http://FirstSiteGuide.com)

Version 2.0.2 (April 22, 2014)

* Bug fix - Fix links to URL from device touchscreen taps

Version 2.0.1 (March 30, 2014)

* Bug fix - WPMU support corrected

Version 2.0.0 (March 26, 2014)

* Rename to WP Flow Plus
* Drop support for PHP 4
* NEW FEATURE - CSS reflections
* NEW FEATURE - configure carousel image size
* NEW FEATURE - WPMU support

Version 1.8.3 (March 25, 2013)

* Support newlines, quotes and other html special characters embedded in media description

Version 1.8.2 (March 11, 2013)

* Changes made the V2 reflection script in version 1.7.4 may have caused the script to stop working on some servers. This revision fixes that issue.

Version 1.8.1 (February 28, 2013)

* Fix external links from carousel, broken in 1.8.0

Version 1.8.0 (February 27, 2013)

* NEW FEATURE - add options to disable the captions and/or slider
* Internal code reorganization and cleanup
* Fix JS error when image gallery is empty
* Replace references to deprecated "longdesc" with "data-" attributes

Version 1.7.4 (January 20, 2013)

* Remove potential exploitations

Version 1.7.3 (January 19, 2013)

* Correction to the fix in 1.7.2

Version 1.7.2 (January 18, 2013)

* Update PHP code that was deprecated in 5.3

Version 1.7.1 (December 17, 2012)

* Remove newlines after image tags because some servers inserted breaks

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
