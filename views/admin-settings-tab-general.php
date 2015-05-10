<?php
/**
 * Admin View: Settings tab "General"
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

?>
<h3><?php echo __('Options for all Galleries','wp-flow-plus'); ?></h3>
<p><?php _e('The images in the carousel will by default link to a Lightbox enlargement of the image. Alternatively, you may specify
a URL to link to each image from the Media Library. This link address should be configured in the image uploader/editor of the Media Library.', 'wp-flow-plus'); ?></p>
<table class="form-table">
<tr>
	<th scope="row">
	<?php echo __('Open URL links in same window', 'wp-flow-plus'); ?>
	</th>
	<td>
	<input type="checkbox" name="wpimageflow2_samewindow" value="same" <?php if ($options['samewindow'] == 'true') echo ' CHECKED'; ?> /> 
		<em><?php _e('The default is to open links in a new window', 'wp-flow-plus'); ?></em>
	</td>
</tr>
<tr>
	<th scope="row">
	<?php echo __('Choose a reflection script', 'wp-flow-plus'); ?>
	</th>
	<td>
	<input type="radio" name="wpimageflow2_reflect" value="CSS" <?php if ($options['reflect'] == 'CSS') echo ' CHECKED'; ?> />
	<?php echo __('CSS reflections, supported by all modern browsers (including IE8+).', 'wp-flow-plus'); ?>
	<br />
	<input type="radio" name="wpimageflow2_reflect" value="v2" <?php if ($options['reflect'] == 'v2') echo ' CHECKED'; ?> />
	<?php echo __('V2 (requires GD).', 'wp-flow-plus'); ?>
	<br />
	<input type="radio" name="wpimageflow2_reflect" value="v3" <?php if ($options['reflect'] == 'v3') echo ' CHECKED'; ?> />
	<?php echo __('V3. Recommended only if you need transparent PNGs, GD version 2.0.28 strongly recommended.', 'wp-flow-plus'); ?>
	<br />
	<input type="radio" name="wpimageflow2_reflect" value="none" <?php if ($options['reflect'] == 'none') echo ' CHECKED'; ?> />
	<?php echo __('Disable reflections', 'wp-flow-plus'); ?>
	</td>
</tr>
<tr>
	<th scope="row">
	<?php echo __('Strict Mode', 'wp-flow-plus'); ?>
	</th>
	<td>
	<input type="checkbox" name="wpimageflow2_strict" value="strict" <?php if ($options['strict'] == 'true') echo ' CHECKED'; ?> /> 
		<em><?php _e('Check this box if your server is strict and serves a 404 error on reflected images', 'wp-flow-plus'); ?></em>
	</td>
</tr>
<tr>
	<th scope="row">
	<?php echo __('Enable auto rotation', 'wp-flow-plus'); ?>
	</th>
	<td>
	<input type="checkbox" name="wpimageflow2_autorotate" value="autorotate" <?php if ($options['autorotate'] == 'on') echo ' CHECKED'; ?> /> 
		<em><?php _e('This may be overridden in the shortcode', 'wp-flow-plus'); ?></em>
	</td>
</tr>
<tr>
	<th scope="row">
	<?php echo __('Auto rotation pause', 'wp-flow-plus'); ?>
	</th>
	<td>
	<input type="text" name="wpimageflow2_pause" value="<?php echo $options['pause']; ?>"> 
	</td>
</tr>
</table>

<h3><?php echo __('Galleries Based on Folders','wp-flow-plus'); ?></h3>
<a style="cursor:pointer;" title="Click for help" onclick="toggleVisibility('detailed_display_tip');"><?php _e('Click to toggle detailed help', 'wp-flow-plus'); ?></a>
<div id="detailed_display_tip" style="display:none; width: 600px; background-color: #eee; padding: 8px;
border: 1px solid #aaa; margin: 20px; box-shadow: rgb(51, 51, 51) 2px 2px 8px;">
<p<?php _e('>You can upload a collection of images to a folder and have WP Flow Plus read the folder and gather the images, without the need to upload through the Wordpress image uploader. Using this method provides fewer features in the gallery since there are no titles, links, or descriptions stored with the images. This is provided as a quick and easy way to display an image carousel.', 'wp-flow-plus'); ?></p>
<p><?php _e('The folder structure should resemble the following', 'wp-flow-plus'); ?>:</p>
<p>
- wp-content<br />
&nbsp;&nbsp;&nbsp;- galleries<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- gallery1<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- image1.jpg<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- image2.jpg<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- image3.jpg<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- gallery2<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- image4.jpg<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- image5.jpg<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- image6.jpg</p>

<p><?php _e('With this structure you would enter "wp-content/galleries/" as the folder path below', 'wp-flow-plus'); ?>.</p>
</div>

<table class="form-table">
	<tr>
	<th scope="row">
	<?php _e('Folder Path','wp-flow-plus'); ?>	
	</th>
	<td>
	<?php _e('This should be the path to galleries from homepage root path, or full url including http://.','wp-flow-plus'); ?>
	<br /><input type="text" size="35" name="wpimageflow2_path" value="<?php echo $options['gallery_url']; ?>">
	<br /><?php echo __('e.g.','wp-flow-plus'); ?> wp-content/galleries/
	<br /><?php echo __('Ending slash, but NO starting slash','wp-flow-plus'); ?>
	</td>
</tr>
	<tr>
	<th scope="row">
	<?php echo __('These folder galleries were found:','wp-flow-plus'); ?>	
	</th>
	<td>
	<?php
		$galleries_path = rtrim($_SERVER['DOCUMENT_ROOT'], '/') . '/' . $this->get_path($options['gallery_url']);
		if (file_exists($galleries_path)) {
			$handle	= opendir($galleries_path);
			while ($dir=readdir($handle))
			{
				if ($dir != "." && $dir != "..")
				{									
					echo "[wp-flowplus dir=".$dir."]";
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

<p class="submit"><input class="button button-primary" name="submit" value="<?php echo __('Save Changes','wp-flow-plus'); ?>" type="submit" /></p>

<?php
include "admin-settings-promo.php";
?>

<h3><?php echo __('Deprecated','wp-flow-plus'); ?></h3>
<p><?php _e('NOTE: The following option is deprecated and will be removed in the future', 'wp-flow-plus'); ?>. </p>
<table class="form-table">
<tr>
	<th scope="row">
	<?php echo __('Image Link in Description', 'wp-flow-plus'); ?>
	</td>
	<td>
	<input type="checkbox" name="wpimageflow2_link" value="link" <?php if ($options['link'] == 'true') echo ' CHECKED'; ?> /> <?php _e('Check this box to have images from the Media Library use the description field as an external link from the image thumbnail. <em><b>This option is now deprecated, instead use the new image link field in the Wordpress image editor to specify a link from the carousel', 'wp-flow-plus'); ?></b></em>
	</td>
</tr>
</table>		