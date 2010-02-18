=== WP-ImageFlow2 ===
Author: Bev Stofko
Contributors: Bev Stofko
Donate link: http://stofko.ca/wp-imageflow2-wordpress-plugin/
Tested up to: 2.9.1
Version: 1.2.1
Requires at least: 2.8.4
Tags: picture, pictures, gallery, galleries, imageflow, coverflow, flow, image, images, flow, lightbox

WordPress implementation of the picture gallery ImageFlow with Lightbox effect. Uses either the built-in Wordpress gallery or an uploaded directory 
of images. Displays simple thumbnail list if Javascript is disabled.


== Description ==

With WP-ImageFlow2 you can display nice looking ImageFlow galleries within posts and pages. With version 1.2 you now have pretty Lightbox previews of 
images.

There are two ways to insert such a gallery.

1. Use the built-in Wordpress gallery.
2. Upload your pictures to a subfolder and use the shortcode [wp-imageflow2=SUBFOLDER]

You can configure the background color, text color, container width and choose black or white for the scrollbar.

When using the built in Wordpress gallery, the photo title will be displayed below each image. When using a subfolder gallery, the image name will 
be displayed below each image.

For a built-in gallery, the image may link to either the large size image or an external url.

[Demo](http://www.stofko.ca/wp-imageflow2-wordpress-plugin/)

= Notes =

One gallery per page/post is supported.

WP-ImageFlow2 is based on the discontinued WP-ImageFlow by Sven Kubiak, which is an implementation of the CoverFlow-like Picture Gallery ImageFlow 
from Finn Rudolph. 

== Installation ==

1. Unzip to the /wp-content/plugins/ directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Configure the gallery in Settings -> WP-ImageFlow2.

For a built-in Wordpress gallery:

1. Use the shortcode [gallery] anywhere in a post or page
2. If you want the image to link to an external url, enter the url in the description field of the image (as http://www.website.com) and enable the 
checkbox in the options. If the description field is left blank the link will go to the full size image.

For galleries based on a subfolder:

1. Create a folder for your galleries within your WordPress installation, wherever you want (has to be accessible from the internet).
2. Set the "Path to galleries from homepage root path" in the configuration options 
3. Upload your image galleries to a subfolder of this folder
4. Insert a gallery on a page by specifying [wp-imageflow2=SUBFOLDER].

== Frequently Asked Questions ==

= How do I make a built-in gallery display as ImageFlow? =

Use the Wordpress gallery shortcode [gallery]. 

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

Upload your images to your post or page gallery. Enter a title to display, and optionally enter a description that may be used as an external link.

= How do I make a gallery without using the built-in gallery? =

1. Create a directory on your server to contain the galleries
2. Configure the url to the galleries in the settings
3. Create a sub-directory below the galleries directory
4. Upload your images to that directory
5. Insert the shortcode [wp-imageflow2=sub-directory] in a post or page

If you have entered the gallery path correctly you will see a list of the sub-directories on the settings page of the administration panel.

This gallery style will display the image names as the captions, and will link to the full size image. 

* If you installed Wordpress at the root level, your galleries path might be wp-content/galleries/
* If you installed Wordpress under blog, your galleries path might be blog/wp-content/galleries/

= Why can't I see any text or slider bar? =

If you have configured a light colored background for your gallery you should choose black for the slider bar color and a dark color for the text.

= How many galleries may I place on one page? =

At this time only one WP_ImageFlow2 gallery may be placed on a page or post.

== Screenshots ==

1. WP-ImageFlow 2
2. Choose the options you need. 

== Changelog ==

Version 1.2.1 ()

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
