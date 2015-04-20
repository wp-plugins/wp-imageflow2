<?php
/*
Plugin Name: WP Flow Plus
Plugin URI: http://www.wpflowplus.com
Description: Flow style carousel with Lightbox popups
Version: 2.2.2
Author: WP Flow Plus
Author URI: http://www.wpflowplus.com

Originally based on the discontinued plugin by Sven Kubiak

Copyright 2015 

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
*/
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

global $wp_version;
define('WPFLOWPLUSVERSION', version_compare($wp_version, '2.8.4', '>='));
define ('WPIF2_PLUGIN_URL', plugin_dir_url( __FILE__ ));
define ('WPIF2_PLUGIN_DIR', plugin_dir_path( __FILE__ ));

if(!defined("PHP_EOL")){define("PHP_EOL", strtoupper(substr(PHP_OS,0,3) == "WIN") ? "\r\n" : "\n");}

if (!class_exists("WPFlowPlus")) {
Class WPFlowPlus
{
	var $adminOptionsName = 'wpimageflow2_options';

	/* html div ids */
	var $flowplusdiv = 'wpif2_flowplus';
	var $loadingdiv   = 'wpif2_loading';
	var $imagesdiv    = 'wpif2_images';
	var $captionsdiv  = 'wpif2_captions';
	var $sliderdiv    = 'wpif2_slider';
	var $scrollbardiv = 'wpif2_scrollbar';
	var $noscriptdiv  = 'wpif2_flowplus_noscript';

	var $wpif2_instance = 0;
	
	public function __construct() {
		if (!WPFLOWPLUSVERSION)
		{
			add_action ('admin_notices', array($this, 'version_error') );
			return;
		}	
		
		add_action('init', array($this, 'action_on_init'));
		register_activation_hook( __FILE__, array($this, 'activate'));
		register_deactivation_hook( __FILE__, array($this, 'deactivate'));
		add_action('wp_enqueue_scripts', array($this, 'addScripts'));	
		add_action('admin_enqueue_scripts', array($this, 'addAdminScripts'));	
		
		add_action('admin_menu', array($this, 'settings_page_add'));
		add_filter('wpflowplus_settings_tabs_array', array($this, 'settings_tabs_array_default'));
		add_action('wpfp_settings_tab_general', array($this, 'settings_tab_general'));
		add_action('wpfp_settings_update_general', array($this, 'settings_update_general'));
		add_action('wpfp_settings_tab_format', array($this, 'settings_tab_format'));
		add_action('wpfp_settings_update_format', array($this, 'settings_update_format'));
		add_action('wpfp_settings_tab_help', array($this, 'settings_tab_help'));
		add_action('wpfp_settings_update_help', array($this, 'settings_update_help'));
		
		add_shortcode('wp-imageflow2', array($this, 'flow_func'));
		add_shortcode('wp-flowplus', array($this, 'flow_func'));	

		add_filter("attachment_fields_to_edit", array($this, 'image_links'), null, 2);
		add_filter("attachment_fields_to_save", array($this, 'image_links_save'), null , 2);

		add_filter("plugin_action_links_".plugin_basename(__FILE__), array($this, 'plugin_settings_link' ) );
	}
	
	function activate() {
		/*
		** Nothing needs to be done for now
		*/
	}
	
	function deactivate() {
		/*
		** Nothing needs to be done for now
		*/
	}			
	
	function action_on_init() {
		// Localization
		load_plugin_textdomain('wp-flow-plus', false, basename( dirname( __FILE__ ) ) . '/languages' );
	}
	
	function addAdminScripts() {
		
		wp_enqueue_style( 'wp-color-picker' );
		wp_enqueue_script('wpif2_utility_js', plugins_url('js/wpif2_utility.js', __FILE__), array('wp-color-picker', 'jquery'));
	}	

	function addScripts() {
		
		global $wp_styles;
	
		wp_enqueue_style( 'wpflowpluscss',  plugins_url('css/screen.css', __FILE__));
		wp_enqueue_style( 'wpflowplus-ie8', plugins_url('css/ie8.css', __FILE__));
		$wp_styles->add_data( 'wpflowplus-ie8', 'conditional', 'IE 8' );
		wp_enqueue_script('wpif2_flowplus', plugins_url('js/imageflowplus.js', __FILE__), array('jquery'), '2.1');
	}		

	function flow_func($attr) {
		/*
		** Shortcode handler
		*/
		global $blog_id;

		/* Increment the instance to support multiple galleries on a single page */
		$this->wpif2_instance ++;

		/* Get options */
		$options = $this->getAdminOptions();

		/* Prepare options */
		$bgcolor = $options['bgcolor'];
		$txcolor = $options['txcolor'];
		$slcolor = $options['slcolor'];
		$width   = $options['width'];
		$link    = $options['link'];
		$reflect = $options['reflect'];
		$strict  = $options['strict'];

		/* Determine reflection script to use */
		if ($reflect == 'v2') {
			$reflect_script = 'reflect2.php';
		} else if ($reflect == 'v3') {
			$reflect_script = 'reflect3.php';
		} else if ($reflect == 'CSS') {
			$reflect_script = 'CSS';
		} else {
			$reflect_script = '';
		}

		/* Produce the Javascript for this instance */
		$js  = "\n".'<script type="text/javascript">'."\n";
		$js .= 'jQuery(document).ready(function() { '."\n".'var flowplus_' . $this->wpif2_instance . ' = new flowplus('.$this->wpif2_instance.');'."\n";
		$js .= 'flowplus_' . $this->wpif2_instance . '.init( {';

		if ( !isset ($attr['rotate']) ) {
			$js_options = 'autoRotate: "' . $options['autorotate'] . '", ';
		} else {
			$js_options = 'autoRotate: "' . $attr['rotate'] . '", ';
		}
		$js_options .= 'autoRotatepause: ' . $options['pause'] . ', ';
		if ( !isset ($attr['startimg']) ) {
			$js_options .= 'startImg: 1' . ', ';
		} else {
			$js_options .= 'startImg: ' . $attr['startimg'] . ', ';
		}
		if ( !isset ($attr['samewindow']) ) {
			$js_options .= $options['samewindow']? 'sameWindow: true, ' : 'sameWindow: false, ';
		} else {
			$js_options .= 'sameWindow: ' . $attr['samewindow'] . ', ';
		}
		if ( isset ($options['aspect']) ) {
			$js_options .= 'aspectRatio: ' . $options['aspect'] . ', ';
		}
		if ($reflect == 'none') {
			$js_options .= 'reflectPC: 0';
		} else {
			$js_options .= 'reflectPC: 1';
		}
		
		$js .= apply_filters ('wpif2_js_options', $js_options);
		$js .= '} );'."\n";
		$js .= '});'."\n";
		$js .= "</script>\n\n";

		/* Get the list of images */
		$image_list = apply_filters ('wpif2_image_list', array(), $attr);
		if (empty($image_list)) {
		 	if ( !isset ($attr['dir']) ) {
				$image_list = $this->images_from_library($attr, $options);
			} else {
				$image_list = $this->images_from_dir($attr, $options);
	  		}
		}

		/**
		* Start output
		*/
		$noscript = '<noscript><div id="' . $this->noscriptdiv . '_' . $this->wpif2_instance . '" class="' . $this->noscriptdiv . '">';	
		$output  = '<div id="' . $this->flowplusdiv . '_' . $this->wpif2_instance . '" class="' . $this->flowplusdiv . '" style="background-color: ' . $bgcolor . '; color: ' . $txcolor . '; width: ' . $width . '">' . PHP_EOL; 
		$output .= '<div id="' . $this->loadingdiv . '_' . $this->wpif2_instance . '" class="' . $this->loadingdiv . '" style="color: ' . $txcolor . ';">' . PHP_EOL;
		$output .= '<b>';
		$output .= __('Loading Images','wp-flow-plus');
		$output .= '</b><br/>' . PHP_EOL;
		$output .= '<img src="' . WPIF2_PLUGIN_URL . '/img/loading.gif" width="208" height="13" alt="' . $this->loadingdiv . '" />' . PHP_EOL;
		$output .= '</div>' . PHP_EOL;
		$output .= '<div id="' . $this->imagesdiv . '_' . $this->wpif2_instance . '" class="' . $this->imagesdiv . '">' . PHP_EOL;	

		/**
		* Add images
		*/
		if (!empty ($image_list) ) {
		    $i = 0;
		    foreach ( $image_list as $this_image ) {

				/* What does the carousel image link to? */
				$linkurl 		= $this_image['link'];
				$rel 			= '';
				$dsc			= '';
				if ($linkurl === '') {
					/* We are linking to the popup - use the title and description as the alt text */
					$linkurl = $this_image['large'];
					$rel = ' data-style="wpif2_lightbox"';
					$alt = ' alt="'.$this_image['title'].'"';
					if ($this_image['desc'] != '') {
						
						$dsc = ' data-description="' . htmlspecialchars(str_replace(array("\r\n", "\r", "\n"), "<br />", $this_image['desc'])) . '"';
					}
				} else {
					/* We are linking to an external url - use the title as the alt text */
					$alt = ' alt="'.$this_image['title'].'"';
				}

				/* construct the image source */
				/* Provide 2 methods of passing the image name to the reflection script to account for different server configurations */
				if ( ($reflect == 'v2') || ($reflect == 'v3') ) {
					if ($strict == 'true') {
						$dir_array = parse_url($this_image['small']);
						$url_path = $dir_array['path'];
						$pic_reflected 	= WPIF2_PLUGIN_URL .'/php/' . $reflect_script .'?img='. urlencode($url_path) . '&amp;bgc=' . urlencode($bgcolor)
											. '&amp;fade_start=30';
					} else {
						$theImageSrc = $this_image['small'];
						if ( function_exists ('get_blog_details') && isset($blog_id) && $blog_id > 0 && $blog_id != BLOG_ID_CURRENT_SITE ) {
							/* WPMU image path must be corrected if not the root blog */
							$imageParts = explode(get_blog_details($blog_id)->path, $this_image['small']);
							if (isset($imageParts[1])) {
								$theImageSrc = get_blog_details( BLOG_ID_CURRENT_SITE )->path . $imageParts[1];
							}
						}					
						$pic_reflected 	= WPIF2_PLUGIN_URL .'/php/' . $reflect_script .'?img='. urlencode($theImageSrc) . '&amp;bgc=' . urlencode($bgcolor)
											. '&amp;fade_start=30';
					}
				} else {
					$pic_reflected = $this_image['small'];
				}

				$output .= '<div class="wpif2_image_block">';
				$output .= '<img src="' . $pic_reflected . '" data-link="' . $linkurl . '"' . $rel . $alt . $dsc . ' />';
				if ($reflect == 'CSS') {
					$output .= '<div class="wpif2_reflection" style="background-color:' . $bgcolor . '">';
					$output .= '<img src="' . $this_image['small'] . '" alt="" />';
					$rgba_transparent = $this->hex2rgba ($bgcolor, 0);
					$rgba_solid = $this->hex2rgba ($bgcolor, 1);
					$output .= '<div class="wpif2_overlay" style="
background: -moz-linear-gradient(top,  ' . $rgba_transparent . ' 0%, ' . $rgba_solid . ' 75%); /* FF3.6+ */
background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,' . $rgba_transparent . '), color-stop(75%,' . $rgba_solid . ')); /* Chrome,Safari4+ */
background: -webkit-linear-gradient(top,  ' . $rgba_transparent . ' 0%,' . $rgba_solid . ' 75%); /* Chrome10+,Safari5.1+ */
background: -o-linear-gradient(top,  ' . $rgba_transparent . ' 0%,' . $rgba_solid . ' 75%); /* Opera 11.10+ */
background: -ms-linear-gradient(top,  ' . $rgba_transparent . ' 0%,' . $rgba_solid . ' 75%); /* IE10+ */
background: linear-gradient(to bottom,  ' . $rgba_transparent . ' 0%,' . $rgba_solid . ' 75%); /* W3C */
filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=#00' . substr($bgcolor, 1, 6) . ', endColorstr=' . $bgcolor . ',GradientType=0 ); /* IE6-9 */"></div></div>';

				}
				$output .= '</div>';

				/* build separate thumbnail list for users with scripts disabled */
				$noscript .= '<a href="' . $linkurl . '"><img src="' . $this_image['small'] .'" width="100"  alt="'.$this_image['title'].'" /></a>';
				$i++;
		    }
		}
					
		
		$output .= '</div>' . PHP_EOL;
		$output .= '<div id="' . $this->captionsdiv . '_' . $this->wpif2_instance . '" class="' . $this->captionsdiv . '"';
		if ($options['nocaptions']) $output .= ' style="display:none !important;"';
		$output .= '></div>' . PHP_EOL;
		$output .= '<div id="' . $this->scrollbardiv . '_' . $this->wpif2_instance . '" class="' . $this->scrollbardiv;
		if ($slcolor == "black") $output .= ' black';
		$output .= '"';
		if ($options['noslider']) $output .= ' style="display:none !important;"';
		$output .= '><div id="' . $this->sliderdiv . '_' . $this->wpif2_instance . '" class="' . $this->sliderdiv . '">' . PHP_EOL;
		$output .= '</div>';
		$output .= '</div>' . PHP_EOL;
		$output .= $noscript . '</div></noscript></div>';	

		return $js . $output;

	}

	function getAdminOptions() {
		/*
		** Merge default options with the saved values
		*/
		$use_options = array(	'gallery_url' => '0', 	// Path to gallery folders when not using built in gallery shortcode
						'bgcolor' 	 => '#000000',	// Background color defaults to black
						'txcolor' 	 => '#ffffff',	// Text color defaults to white
						'slcolor' 	 => 'white',	// Slider color defaults to white
						'link'    	 => 'false',	// Don't link to image description
						'width'   	 => '520px',	// Width of containing div
						'aspect'  	 => '1.9',		// Aspect ratio of containing div
						'reflect' 	 => 'CSS',		// v2, v3, CSS, or none
						'strict'  	 => 'false',	// True for strict servers that don't allow http:// in script args
						'autorotate' => 'off',		// True to enable auto rotation
						'pause'  	 =>'3000',		// Time to pause between auto rotations
						'samewindow' => false,		// True to open links in same window rather than new window
						'nocaptions' => false,		// True to hide captions in the carousel
						'noslider'	 => false,		// True to hide the scrollbar
						'imgsize'	 => 'medium'	// Default carousel image size
					);
		$saved_options = get_option($this->adminOptionsName);
		if (!empty($saved_options)) {
			foreach ($saved_options as $key => $option)
				$use_options[$key] = $option;
		}

		return $use_options;
	}

	function get_path($gallery_url) {
		/*
		** Determine the path to prepend with DOCUMENT_ROOT
		*/
		if (substr($gallery_url, 0, 7) != "http://") return $gallery_url;

		$dir_array = parse_url($gallery_url);
		return $dir_array['path'];
	}

	/* Convert hexdec color string to rgb(a) string */
	function hex2rgba($color, $opacity) {
		$default = 'rgb(0,0,0)';

		//Return default if no color provided
		if(empty($color))
			  return $default; 

		//Sanitize $color if "#" is provided 
        if ($color[0] == '#' ) {
        	$color = substr( $color, 1 );
        }

        //Check if color has 6 or 3 characters and get values
        if (strlen($color) == 6) {
                $hex = array( $color[0] . $color[1], $color[2] . $color[3], $color[4] . $color[5] );
        } elseif ( strlen( $color ) == 3 ) {
                $hex = array( $color[0] . $color[0], $color[1] . $color[1], $color[2] . $color[2] );
        } else {
                return $default;
        }

        //Convert hexadec to rgb
        $rgb =  array_map('hexdec', $hex);

        //Add opacity is set(rgba or rgb)
		if(abs($opacity) > 1)
			$opacity = 1.0;
		$output = 'rgba('.implode(",",$rgb).','.$opacity.')';

        //Return rgb(a) color string
        return $output;
	}
	
	function image_links($form_fields, $post) {	// @DEPRECATED
		$form_fields["wpif2-image-link"] = array(
			"label" => __("WP Flow Plus Link", 'wp-flow-plus'),
			"input" => "", // this is default if "input" is omitted
			"value" => get_post_meta($post->ID, "_wpif2-image-link", true),
      	 	"helps" => __("To be used with carousel added via [wp-flowplus] shortcode."),
		);
	   return $form_fields;
	}

	function image_links_save($post, $attachment) {	// @DEPRECATED
		// $attachment part of the form $_POST ($_POST[attachments][postID])
      	// $post['post_type'] == 'attachment'
		if( isset($attachment['wpif2-image-link']) ){
			// update_post_meta(postID, meta_key, meta_value);
			update_post_meta($post['ID'], '_wpif2-image-link', $attachment['wpif2-image-link']);
		}
		return $post;
	}

	function images_from_library ($attr, $options) {
		/*
		** Generate a list of the images we are using from the Media Library
		*/
		if ( isset( $attr['orderby'] ) ) {
			$attr['orderby'] = sanitize_sql_orderby( $attr['orderby'] );
			if ( !$attr['orderby'] )
				unset( $attr['orderby'] );
		}

		/*
		** Standard gallery shortcode defaults that we support here	
		*/
		global $post;
		extract(shortcode_atts(array(
				'order'      => 'ASC',
				'orderby'    => 'menu_order ID',
				'id'         => $post->ID,
				'include'    => '',
				'exclude'    => '',
				'mediatag'	 => '',	// corresponds to Media Tags plugin by Paul Menard
		  ), $attr));
	
		$id = intval($id);

		if ( !empty($mediatag) ) {
			$attachments = array();
			if ( function_exists('get_attachments_by_media_tags') ) {
				$mediaList = get_attachments_by_media_tags("media_tags=$mediatag&orderby=$orderby&order=$order");
				foreach ($mediaList as $key => $val) {
					$attachments[$val->ID] = $mediaList[$key];
				}
			}
		} elseif ( !empty($include) ) {
			$include = preg_replace( '/[^0-9,]+/', '', $include );
			$_attachments = get_posts( array('include' => $include, 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image', 'order' => $order, 'orderby' => $orderby) );

			$attachments = array();
			foreach ( $_attachments as $key => $val ) {
				$attachments[$val->ID] = $_attachments[$key];
			}
		} elseif ( !empty($exclude) ) {
			$exclude = preg_replace( '/[^0-9,]+/', '', $exclude );
			$attachments = get_children( array('post_parent' => $id, 'exclude' => $exclude, 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image', 'order' => $order, 'orderby' => $orderby) );
		} else {
			$attachments = get_children( array('post_parent' => $id, 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image', 'order' => $order, 'orderby' => $orderby) );
		}

		$image_list = array();
		foreach ( $attachments as $id => $attachment ) {
			$small_image = wp_get_attachment_image_src($id, $options['imgsize']);
			$large_image = wp_get_attachment_image_src($id, "large");

			/* If the media description contains an url and the link option is enabled, use the media description as the linkurl */
			$link_url = '';
			if (($options['link'] == 'true') && 
				((substr($attachment->post_content,0,7) == 'http://') || (substr($attachment->post_content,0,8) == 'https://'))) {
				$link_url = $attachment->post_content;
			}

			$image_link = get_post_meta($id, '_wpif2-image-link', true);
			if (isset($image_link) && ($image_link != '')) $link_url = $image_link;

			$image_list[] = array (
				'small' => $small_image[0],
				'large' => $large_image[0],
				'link'  => $link_url,
				'title' => $attachment->post_title,
				'desc'  => $attachment->post_content,
			);
		}
		return $image_list;
	}

	function images_from_dir ($attr, $options) {
		/*
		** Generate the image list by reading a folder
		*/
		$image_list = array();

		$galleries_path = rtrim($_SERVER['DOCUMENT_ROOT'], '/') . '/' . $this->get_path($options['gallery_url']);
		if (!file_exists($galleries_path))
			return '';

		/*
		** Gallery directory is ok - replace the shortcode with the image gallery
		*/
		$plugin_url = get_option('siteurl') . "/" . PLUGINDIR . "/" . plugin_basename(dirname(__FILE__)); 			
			
		$gallerypath = $galleries_path . $attr['dir'];
		if (file_exists($gallerypath))
		{	
			$handle = opendir($gallerypath);
			while ($image=readdir($handle)) {
				if (filetype($gallerypath."/".$image) != "dir" && !preg_match('/refl_/',$image)) {
					$pageURL = 'http';
					if (isset($_SERVER['HTTPS']) && ($_SERVER["HTTPS"] == "on")) {$pageURL .= "s";}
					$pageURL .= "://";
					if ($_SERVER["SERVER_PORT"] != "80") {
				   	$pageURL .= $_SERVER["SERVER_NAME"].":".$_SERVER["SERVER_PORT"];
				} else {
				   	$pageURL .= $_SERVER["SERVER_NAME"];
				}
				$imagepath = $pageURL . '/' . $this->get_path($options['gallery_url']) . $attr['dir'] . '/' . $image;
				$image_list[] = array (
					'small' => $imagepath,
					'large' => $imagepath,
					'link'  => '',
					'title' => $image,
					'desc'  => '',
			);
			    }
			}
			closedir($handle);
		}

		return $image_list;
	}

	// Add settings link on plugin page
	function plugin_settings_link($links = array()) { 
		$settings_link = '<a href="options-general.php?page=wpFlowPlus">'.__('Settings', 'wp-flow-plus').'</a>';
		array_unshift($links, $settings_link);
		return $links;
	}
	
	function settings_page_add() { 
		add_options_page( __('WP Flow Plus Options', 'wp-flow-plus'), __('WP Flow Plus', 'wp-flow-plus'), 
					'manage_options', 'wpFlowPlus', array($this, 'settings_page_output'));
	}

	/*
	** Construct the admin settings page for the plugin
	*/
	function settings_page_output() {
		global $options_page;

		// verify user has permission
		if (!current_user_can('manage_options'))
			wp_die(__('Sorry, but you have no permission to change settings.','wp-flow-plus'));	
			
		// update the settings for the current tab
		if ( isset($_POST['save_wpflowplus']) && ($_POST['save_wpflowplus'] == 'true') && 
					check_admin_referer('update_wpflowplus_options')) {
			$current_tab = isset( $_GET['tab'] ) ? $_GET['tab'] : 'general';
			do_action ( 'wpfp_settings_update_' . $current_tab);
		}

		// Get tabs for the settings page
		$tabs = apply_filters( 'wpflowplus_settings_tabs_array', array() );
		
		// proceed with the settings form
		$options = $this->getAdminOptions();
		include 'views/admin-settings.php';
	}
	
	/*
	** Add the default tabs to the settings tab array
	*/
	function settings_tabs_array_default ($settings_tabs ) {
		$default_tabs = array (
							'general' =>  __( 'General', 'wp-flow-plus' ),
							'format' => __( 'Format', 'wp-flow-plus' ),
							'help' => __( 'Help', 'wp-flow-plus' ));
		
        //print_r($default_tabs + $settings_tabs);
		return $default_tabs + $settings_tabs;
	}
	
	/*
	** Output the admin settings page for the "Format" tab
	*/
	function settings_tab_format() {
		$options = $this->getAdminOptions();
		include 'views/admin-settings-tab-format.php';
	}
	
	/*
	** Output the admin settings page for the "General" tab
	*/
	function settings_tab_general() {
		$options = $this->getAdminOptions();
		include 'views/admin-settings-tab-general.php';
	}

	/*
	** Output the admin settings page for the "Help" tab
	*/
	function settings_tab_help() {
		$options = $this->getAdminOptions();
		include 'views/admin-settings-tab-help.php';
	}
	
	/*
	** Save the "Format" tab updates
	*/
	function settings_update_format() {
		$options = $this->getAdminOptions();
		$errors = '';
		$error_count = 0;

		/*
		** Validate the background colour
		*/
		if (isset($_POST['wpimageflow2_bgc'])) {
			if ((preg_match('/^#[a-f0-9]{6}$/i', $_POST['wpimageflow2_bgc'])) || ($_POST['wpimageflow2_bgc'] == 'transparent')) {
				$options['bgcolor'] = $_POST['wpimageflow2_bgc'];
			} else {
				$error_count++;
				$errors .= "<p>".__('Invalid background color, not saved.','wp-flow-plus')."</p>";	
			}
		}
		
		/*
		** Validate the text colour
		*/
		if (isset($_POST['wpimageflow2_txc'])) {
			if (preg_match('/^#[a-f0-9]{6}$/i', $_POST['wpimageflow2_txc'])) {
				$options['txcolor'] = $_POST['wpimageflow2_txc'];
			} else {
				$error_count++;
				$errors .= "<p>".__('Invalid text color, not saved.','wp-flow-plus')."</p>";	
			}
		}
		
		/* 
		** Look for disable captions option
		*/
		if (isset($_POST['wpimageflow2_nocaptions']) && ($_POST['wpimageflow2_nocaptions'] == 'nocaptions')) {
			$options['nocaptions'] = true;
		} else {
			$options['nocaptions'] = false;
		}
		
		/*
		** Validate the slider color
		*/
		if (isset($_POST['wpimageflow2_slc'])) {
			if (($_POST['wpimageflow2_slc'] == 'black') || ($_POST['wpimageflow2_slc'] == 'white')) {
				$options['slcolor'] = $_POST['wpimageflow2_slc'];
			} else {
				$error_count++;
				$errors .= "<p>".__('Invalid slider color, not saved.','wp-flow-plus')."</p>";	
			}
		}
		
		/* 
		** Look for disable slider option
		*/
		if (isset($_POST['wpimageflow2_noslider']) && ($_POST['wpimageflow2_noslider'] == 'noslider')) {
			$options['noslider'] = true;
		} else {
			$options['noslider'] = false;
		}
		
		/*
		** Accept the container width
		*/
		if (isset($_POST['wpimageflow2_width'])) {
			$options['width'] = $_POST['wpimageflow2_width'];
		}
		
		/*
		** Accept the container aspect ratio
		*/
		if (isset($_POST['wpimageflow2_aspect'])) {
			$options['aspect'] = $_POST['wpimageflow2_aspect'];
		}
		
		/*
		** Accept the carousel image size
		*/
		if (isset($_POST['wpimageflow2_image_size'])) {
			$options['imgsize'] = $_POST['wpimageflow2_image_size'];
		}
				
		/*
		** Done validation, update whatever was accepted
		*/
		$this->settings_update_save ($options, $errors, $error_count);
	}

	/*
	** Save the "General" tab updates
	*/
	function settings_update_general() {
		$options = $this->getAdminOptions();
		$errors = '';
		$error_count = 0;
		
		/* 
		** Look for link to description option @DEPRECATED
		*/
		if (isset($_POST['wpimageflow2_link']) && ($_POST['wpimageflow2_link'] == 'link')) {
			$options['link'] = 'true';
		} else {
			$options['link'] = 'false';
		}

		/* 
		** Look for link to new window option
		*/
		if (isset($_POST['wpimageflow2_samewindow']) && ($_POST['wpimageflow2_samewindow'] == 'same')) {
			$options['samewindow'] = true;
		} else {
			$options['samewindow'] = false;
		}
		
		/* 
		** Look for reflect option
		*/
		if (isset ($_POST['wpimageflow2_reflect'])) {
			$options['reflect'] =  $_POST['wpimageflow2_reflect'];
		}

		/* 
		** Look for strict option
		*/
		if (isset($_POST['wpimageflow2_strict']) && ($_POST['wpimageflow2_strict'] == 'strict')) {
			$options['strict'] = 'true';
		} else {
			$options['strict'] = 'false';
		}
		
		/* 
		** Look for auto rotate option
		*/
		if (isset ($_POST['wpimageflow2_autorotate']) && ($_POST['wpimageflow2_autorotate'] == 'autorotate')) {
			$options['autorotate'] = 'on';
		} else {
			$options['autorotate'] = 'off';
		}

		/*
		** Accept the pause value
		*/
		if (isset($_POST['wpimageflow2_pause'])) {
			$options['pause'] = $_POST['wpimageflow2_pause'];
		}
		
		/*
		** Accept the path URL
		*/
		if (isset($_POST['wpimageflow2_path'])) {
			$options['gallery_url'] = trim($_POST['wpimageflow2_path']);
		}
		
		/*
		** Done validation, update whatever was accepted
		*/
		$this->settings_update_save ($options, $errors, $error_count);
	}
	
		/*
	** Save the "Help" tab updates
	*/
	function settings_update_help() {
		// the help tab has no settings to update
	}
	
function settings_update_save($options, $errors = '', $error_count = 0) {
		update_option($this->adminOptionsName, $options);
		if ($errors == '') {
			echo "<div id='message' class='updated'>";	
			echo '<p>'.__('Settings were saved.','wp-flow-plus').'</p></div>';	
		} else {
			echo "<div id='message' class='error'>" . $errors;	
			if ($error_count == 1) {
				echo '<p>'.__('The above setting was not saved.','wp-flow-plus');
			} else {
				echo '<p>'.__('The above settings were not saved.','wp-flow-plus');
			}
			echo __(' Other settings were successfully saved.','wp-flow-plus').'</p></div>';
		}
	}
	
	function version_error () {
		echo '<div class="error">' . __('WP Flow Plus requires at least WordPress 2.8.4','wp-flow-plus') . '</div>';
	}
	
}

}

if (class_exists("WPFlowPlus")) {
	$wpimageflow2 = new WPFlowPlus();
}
?>