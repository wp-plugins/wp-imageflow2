<?php
/*
Plugin Name: WP-ImageFlow2
Plugin URI: http://www.stofko.ca/wp-imageflow2-wordpress-plugin/
Description: WordPress implementation of the picture gallery ImageFlow. 
Version: 1.0.1
Author: Bev Stofko
Author URI: http://www.stofko.ca

Based on the discontinued plugin by Sven Kubiak
URI: http://www.svenkubiak.de/wp-imageflow2
Description: WordPress implementation of the picture gallery ImageFlow. 
Version: 1.0
Author: Sven Kubiak
Author URI: http://www.svenkubiak.de

ImageFlow Author: Finn Rudoplh
ImageFlow Homepage: http://imageflow.finnrudolph.de
(WP-ImageFlow2 currently contains ImageFlow Version 0.9)

Copyright 2010 Bev Stofko

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
global $wp_version;
define('WPIMAGEFLOWVERSION', version_compare($wp_version, '2.8.4', '>='));

if (!class_exists("WPImageFlow2")) {
Class WPImageFlow2
{
	var $isrss = false;
	var $adminOptionsName = 'wpimageflow2_options';

	function wpimageflow2()
	{
		if (!WPIMAGEFLOWVERSION)
		{
			add_action ('admin_notices',__('WP-ImageFlow2 requires at least WordPress 2.8.4','wp-imageflow2'));
			return;
		}	
		
		add_action('init', array(&$this, 'isRssFeed'));

		if ($this->isrss == true)
			return;

			
		register_activation_hook( __FILE__, array(&$this, 'activate'));
		register_deactivation_hook( __FILE__, array(&$this, 'deactivate'));
		add_action('init', array(&$this, 'addScripts'));	
		add_action('admin_menu', array(&$this, 'wpImageFlow2AdminMenu'));	
		add_filter('the_content', array(&$this, 'checkForFlow'));
		add_filter('post_gallery', array(&$this, 'gallery'), 10, 4);
	}
	
	function activate()
	{
		/*
		** Nothing needs to be done for now
		*/
	}
	
	function deactivate()
	{
		/*
		** Nothing needs to be done for now
		*/
	}			
	
	function checkForFlow($content)
	{
		/*
		** ImageFlow gallery with images taken from a directory
		*/
		global $wpdb;
			
		if (stristr($content, '[wp-imageflow2'))
		{
			/*
			** Found the shortcode - look for the gallery directory
			*/
			$replace = '';
			$options = $this->getAdminOptions();
			$bgcolor = $options['bgcolor'];
			$txcolor = $options['txcolor'];
			$slcolor = $options['slcolor'];
			$width   = $options['width'];

			$galleries_path = $_SERVER['DOCUMENT_ROOT'] . '/' . $options['gallery_url'];
			if (!file_exists($galleries_path))
				return $content;

			/*
			** Gallery directory is ok - replace the shortcode with the image gallery
			*/
			$plugin_url = get_option('siteurl') . "/" . PLUGINDIR . "/" . plugin_basename(dirname(__FILE__)); 			
			
			$search = "@(?:<p>)*\s*\[WP-IMAGEFLOW2\s*=\s*(\w+|^\+)\]\s*(?:</p>)*@i";
			if (preg_match_all($search, $content, $matches, PREG_SET_ORDER))
			{ 			
				foreach ($matches as $match) 
				{				
					$gallerypath = $galleries_path . $match [1];
					
					if (file_exists($gallerypath))
					{		
						$replace  = '<div id="imageflow" style="background-color: ' . $bgcolor . '; color: ' . $txcolor . '; width: ' . $width .'">'; 
						$replace .= '<div id="loading" style="color: ' . $txcolor . ';">';
						$replace .= '<b>';
						$replace .= __('Loading Images','wp-imageflow2');
						$replace .= '</b><br/>';
						$replace .= '<img src="'.$plugin_url.'/img/loading.gif" width="208" height="13" alt="loading" />';
						$replace .= '</div>';
						$replace .= '<div id="images">';	
					
						$handle = opendir($gallerypath);
						while ($image=readdir($handle))
						{
							if (filetype($gallerypath."/".$image) != "dir" && !eregi('refl_',$image))
						    {						
								$imagepath = 'http://www.' . $_SERVER['SERVER_NAME'] . '/' . $options['gallery_url'] . $match[1] . '/' . $image;
								$pic_original 	= $imagepath;
								$pic_reflected 	= $plugin_url.'/php/reflect.php?img=' . $pic_original . '&bgc=' . urlencode($bgcolor);
								$replace .= '<img src="'.$pic_reflected.'" longdesc="'.$pic_original.'" alt="'.$image.'"/>';
						    }				
						}			
						closedir($handle);
			
						$replace .= '</div>';
						$replace .= '<div id="captions"></div>';
						$replace .= '<div id="scrollbar"';
						if ($slcolor == "black") {
							$replace .= ' class="black"';
						}
						$replace .= '><div id="slider">';
						$replace .= '</div>';
						$replace .= '</div>';
						$replace .= '</div>';	
						
						$content = str_replace ($match[0], $replace, $content);	
					}
				}
			}
		}		
		return $content;	
	}
	
	function gallery($output, $attr = array( )) {
		/*
		** ImageFlow gallery overrides built-in Wordpress gallery
		*/
		global $wpdb;

		/**
		* Grab attachments
		*/
		global $post;
	
		if ( isset( $attr['orderby'] ) ) {
			$attr['orderby'] = sanitize_sql_orderby( $attr['orderby'] );
			if ( !$attr['orderby'] )
				unset( $attr['orderby'] );
		}

		/*
		** Standard gallery shortcode defaults	
		*/
		extract(shortcode_atts(array(
			'order'      => 'ASC',
			'orderby'    => 'menu_order ID',
			'id'         => $post->ID,
			'itemtag'    => 'dl',
			'icontag'    => 'dt',
			'captiontag' => 'dd',
			'columns'    => 3,
			'size'       => 'thumbnail',
		), $attr));
	
		/*
		** Check for images in gallery (this is lifted from Wordpress core media.php gallery_shortcode function)
		*/
		$id = intval($id);
		if ( 'RAND' == $order )
			$orderby = 'none';

		if ( !empty($include) ) {
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

		if ( empty($attachments) )
			return '';

		if ( is_feed() ) {
			$output = "\n";
			foreach ( $attachments as $att_id => $attachment )
				$output .= wp_get_attachment_link($att_id, $size, true) . "\n";
			return $output;
		}

		/*
		** Get options for ImageFlow gallery display
		*/
		$options = $this->getAdminOptions();
		$bgcolor = $options['bgcolor'];
		$txcolor = $options['txcolor'];
		$slcolor = $options['slcolor'];
		$width   = $options['width'];
		$link    = $options['link'];

		$plugin_url = get_option('siteurl') . "/" . PLUGINDIR . "/" . plugin_basename(dirname(__FILE__)); 			

		/**
		* Start output
		*/
		$output  = '<div id="imageflow" style="background-color: ' . $bgcolor . '; color: ' . $txcolor . '; width: ' . $width . '">'; 
		$output .= '<div id="loading" style="color: ' . $txcolor . ';">';
		$output .= '<b>';
		$output .= __('Loading Images','wp-imageflow2');
		$output .= '</b><br/>';
		$output .= '<img src="'.$plugin_url.'/img/loading.gif" width="208" height="13" alt="loading" />';
		$output .= '</div>';
		$output .= '<div id="images">';	

		/**
		* Add images
		*/
		$i = 0;
		foreach ( $attachments as $id => $attachment ) {
			$image = wp_get_attachment_image_src($id, "medium");
			$pic_reflected 	= $plugin_url.'/php/reflect.php?img='.$image[0] . '&bgc=' . urlencode($bgcolor);
			$pic_original 	= $image[0];
			if ($link == 'true') {
				/* Add link to description if this option is enabled */
				$linkurl = $attachment->post_content;
				if ($linkurl === '') $linkurl = $pic_original;
			} else {
				$linkurl = $pic_original;
			}
			$output .= '<img src="'.$pic_reflected.'" longdesc="'.$linkurl.'" alt="'.$attachment->post_title.'"/>';
			$i++;
		}
					
		
		$output .= '</div>';
		$output .= '<div id="captions"></div>';
		$output .= '<div id="scrollbar"';
		if ($slcolor == "black") {
			$output .= ' class="black"';
		}
		$output .= '><div id="slider">';
		$output .= '</div>';
		$output .= '</div>';
		$output .= '</div>';	

		return $output;
	}

	function getAdminOptions() {
		/*
		** Merge default options with the saved values
		*/
		$use_options = array(	'gallery_url' => '0', 	// Path to gallery folders when not using built in gallery shortcode
						'bgcolor' => '#000000', // Background color defaults to black
						'txcolor' => '#ffffff', // Text color defaults to white
						'slcolor' => 'white',	// Slider color defaults to white
						'link'    => 'false',	// Don't link to image description
						'width'   => '520px'	// Width of containing div
					);
		$saved_options = get_option($this->adminOptionsName);
		if (!empty($saved_options)) {
			foreach ($saved_options as $key => $option)
				$use_options[$key] = $option;
		}

		return $use_options;
	}

	function addScripts()
	{
		$plugin_url = get_option('siteurl') . "/" . PLUGINDIR . "/" . plugin_basename(dirname(__FILE__)); 			
		
		wp_enqueue_style( 'wpimageflow2css', $plugin_url.'/css/screen.css');
		wp_enqueue_script('colorcode_validate', $plugin_url.'/js/colorcode_validate.js');
		wp_enqueue_script('imageflow', $plugin_url.'/js/imageflow.js');
	}	
	
	function isRssFeed()
	{
		switch (basename($_SERVER['PHP_SELF']))
		{
			case 'wp-rss.php':
				$this->isrss = true;
			break;
			case 'wp-rss2.php':
				$this->isrss = true;
			break;
			case 'wp-atom.php':
				$this->isrss = true;
			break;
			case 'wp-rdf.php':
				$this->isrss = true;
			break;
			default:
				$this->isrss = false;	
		}		
	}
	
	function wpImageFlow2AdminMenu()
	{
		add_options_page('WP-ImageFlow2', 'WP-ImageFlow2', 8, 'wpImageFlow2', array(&$this, 'wpImageFlow2OptionPage'));	
	}
	
	function wpImageFlow2OptionPage()
	{		
		if (!current_user_can('manage_options'))
			wp_die(__('Sorry, but you have no permission to change settings.','wp-imageflow2'));	
			
		$options = $this->getAdminOptions();
		if (($_POST['save_wpimageflow2'] == 'true') && check_admin_referer('wpimageflow2_options'))
		{
			echo "<div id='message' id='updated fade'>";	

			/*
			** Validate the background colour
			*/
			if (preg_match('/^#[a-f0-9]{6}$/i', $_POST['wpimageflow2_bgc'])) {
				$options['bgcolor'] = $_POST['wpimageflow2_bgc'];
			} else {
			echo "<p><b style='color:red;'>".__('Invalid background color, not saved.','wp-imageflow2'). " - " . $_POST['wpimageflow2_bgc'] ."</b></p>";	
			}

			/*
			** Validate the text colour
			*/
			if (preg_match('/^#[a-f0-9]{6}$/i', $_POST['wpimageflow2_txc'])) {
				$options['txcolor'] = $_POST['wpimageflow2_txc'];
			} else {
			echo "<p><b style='color:red;'>".__('Invalid text color, not saved.','wp-imageflow2'). " - " . $_POST['wpimageflow2_txc'] ."</b></p>";	
			}

			/*
			** Validate the slider color
			*/
			if (($_POST['wpimageflow2_slc'] == 'black') || ($_POST['wpimageflow2_slc'] == 'white')) {
				$options['slcolor'] = $_POST['wpimageflow2_slc'];
			} else {
			echo "<p><b style='color:red;'>".__('Invalid slider color, not saved.','wp-imageflow2'). " - " . $_POST['wpimageflow2_slc'] ."</b></p>";	
			}

			/*
			** Accept the container width
			*/
			$options['width'] = $_POST['wpimageflow2_width'];

			/* 
			** Look for link to description option
			*/
			if (isset ($_POST['wpimageflow2_link']) && ($_POST['wpimageflow2_link'] == 'link')) {
				$options['link'] = 'true';
			} else {
				$options['link'] = 'false';
			}

			/*
			** Done validation, update whatever was accepted
			*/
			$options['gallery_url'] = $_POST['wpimageflow2_path'];
			update_option($this->adminOptionsName, $options);
			echo "<p>".__('Settings were saved.','wp-imageflow2')."</p></div>";	
		}
			
		?>
					
		<div class="wrap">
			<h2>WP-ImageFlow2</h2>
			<form action="options-general.php?page=wpImageFlow2" method="post">
	    		<h3><?php echo __('Settings','wp-imageflow2'); ?></h3>
	    		<table class="form-table">
				<tr>
					<th scope="row" valign="top">
					<? echo __('Background color', 'wp-imageflow2'); ?>
					</th>
					<td>
					<input type="text" name="wpimageflow2_bgc" onkeyup="colorcode_validate(this, this.value);" value="<?php echo $options['bgcolor']; ?>"> 
					</td>
				</tr>
				<tr>
					<th scope="row" valign="top">
					<? echo __('Text color', 'wp-imageflow2'); ?>
					</th>
					<td>
					<input type="text" name="wpimageflow2_txc" onkeyup="colorcode_validate(this, this.value);" value="<?php echo $options['txcolor']; ?>"> 
					</td>
				</tr>
				<tr>
					<th scope="row" valign="top">
					<? echo __('Slider color', 'wp-imageflow2'); ?>
					</th>
					<td>
					<select name="wpimageflow2_slc">
					<option value="white"<?php if ($options['slcolor'] == 'white') echo ' SELECTED'; echo __('>White', 'wp-imageflow2'); ?></option>
					<option value="black"<?php if ($options['slcolor'] == 'black') echo ' SELECTED'; echo __('>Black', 'wp-imageflow2'); ?></option>
					</select>
					</td>
				</tr>
				<tr>
					<th scope="row" valign="top">
					<? echo __('Container width CSS', 'wp-imageflow2'); ?>
					</th>
					<td>
					<input type="text" name="wpimageflow2_width" value="<?php echo $options['width']; ?>"> 
					</td>
				</tr>
				<tr>
					<th scope="row" valign="top">
					<? echo __('Check this box to have the built in gallery use the description field as an external link from the image thumbnail.', 'wp-imageflow2'); ?>
					</th>
					<td>
					<input type="checkbox" name="wpimageflow2_link" value="link" <?php if ($options['link'] == 'true') echo ' CHECKED'; ?> />
					</td>
				</tr>
	    			<tr>
					<th scope="row" valign="top">
					<?php echo __('Enter a value here if you wish to upload images to a directory and use the wp-imageflow2 shortcode.','wp-imageflow2'); ?>	
					</th>
					<td>
					<?php echo __('Path to galleries from homepage root path.','wp-imageflow2'); ?>
					<br /><input type="text" size="35" name="wpimageflow2_path" value="<?php echo $options['gallery_url']; ?>">
					<br /><?php echo __('e.g.','wp-imageflow2'); ?> wp-content/galleries/
					<br /><?php echo __('Ending slash, but NO starting slash','wp-imageflow2'); ?>
					</td>
				</tr>
				<tr>
					<th scope="row" valign="top">&nbsp;</th>
					<td>
					<input type="hidden" value="true" name="save_wpimageflow2">
					<?php
					if ( function_exists('wp_nonce_field') )
						wp_nonce_field('wpimageflow2_options');
					?>
					<input name="submit" value="<?php echo __('Save','wp-imageflow2'); ?>" type="submit" />			
					</td>
				</tr>				
			</table>
			</form>				
	    		<table class="form-table">
	    			<tr>
					<th scope="row" valign="top">
					<?php echo __('Subdirectory galleries found:','wp-imageflow2'); ?>	
					</th>
					<td>
					<?php
						$galleries_path = $_SERVER['DOCUMENT_ROOT'] . '/' . $options['gallery_url'];
						if (file_exists($galleries_path)) {
							$handle	= opendir($galleries_path);
							while ($dir=readdir($handle))
							{
								if ($dir != "." && $dir != "..")
								{									
									echo "[wp-imageflow2=".$dir."]";
									echo "<br />";
								}
							}
							closedir($handle);								
						} else {
							echo "Gallery path doesn't exist";
						}					
					?>
					</td>
				</tr>
			</table>		
		</div>
		
		<?php			
	}		
}

}

if (class_exists("WPImageFlow2")) {
	$wpimageflow2 = new WPImageFlow2();
}
?>