<?php
/**
 * Admin View: Settings tab "Format"
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

?>
<table class="form-table">
<tr>
	<th scope="row">
	<label for="wpimageflow2_bgc"><?php echo __('Background color', 'wp-flow-plus'); ?></label>
	</th>
	<td>
	<input type="text" name="wpimageflow2_bgc" id="wpimageflow2_bgc" onkeyup="colorcode_validate(this, this.value);" value="<?php echo $options['bgcolor']; ?>">
	&nbsp;<em><?php _e('Hex value or "transparent". Do not use transparent with CSS reflections.', 'wp-flow-plus'); ?></em>
	</td>
</tr>
<tr>
	<th scope="row">
	<label for="wpimageflow2_txc"><?php echo __('Text color', 'wp-flow-plus'); ?></label>
	</th>
	<td>
	<input type="text" name="wpimageflow2_txc" class="wpif2-color-field" value="<?php echo $options['txcolor']; ?>">
	&nbsp;<label for="wpimageflow2_nocaptions"><?php _e('Disable captions', 'wp-flow-plus'); ?>: </label>
	<input type="checkbox" name="wpimageflow2_nocaptions" id="wpimageflow2_nocaptions" value="nocaptions" <?php if ($options['nocaptions'] == 'true') echo ' CHECKED'; ?> />
	</td>
</tr>
<tr>
	<th scope="row">
	<label for="wpimageflow2_txc"><?php echo __('Slider color', 'wp-flow-plus'); ?></label>
	</th>
	<td>
	<select name="wpimageflow2_slc">
	<option value="white"<?php if ($options['slcolor'] == 'white') echo ' SELECTED'; echo __('>White', 'wp-flow-plus'); ?></option>
	<option value="black"<?php if ($options['slcolor'] == 'black') echo ' SELECTED'; echo __('>Black', 'wp-flow-plus'); ?></option>
	</select>
	&nbsp;<label for="wpimageflow2_noslider"><?php _e('Disable slider', 'wp-flow-plus'); ?>: </label>
	<input type="checkbox" name="wpimageflow2_noslider" id="wpimageflow2_noslider" value="noslider" <?php if ($options['noslider'] == 'true') echo ' CHECKED'; ?> />
	</td>
</tr>
<tr>
	<th scope="row">
	<?php echo __('Container width CSS', 'wp-flow-plus'); ?>
	</th>
	<td>
	<input type="text" name="wpimageflow2_width" value="<?php echo $options['width']; ?>"> 
	</td>
</tr>
<tr>
	<th scope="row">
	<?php echo __('Container aspect ratio', 'wp-flow-plus'); ?>
	</th>
	<td>
	<input type="text" name="wpimageflow2_aspect" value="<?php echo $options['aspect']; ?>">
	&nbsp;<em><?php _e('Default 1.9. Higher numbers result in shorter height and vice versa.', 'wp-flow-plus'); ?></em>
	</td>
</tr>
<tr>
	<th scope="row">
	<?php echo __('Carousel image size', 'wp-flow-plus'); ?>
	</th>
	<td>
	<?php $image_sizes = get_intermediate_image_sizes(); ?>
	<select name="wpimageflow2_image_size">
	  <?php foreach ($image_sizes as $size_name): ?>
		<?php $selected = ''; ?>
		<?php if ($size_name == $options['imgsize']) $selected = ' selected'; ?>
		<option <?php echo 'value = "' . $size_name . '"' . $selected; ?>><?php echo $size_name; ?></option>
	  <?php endforeach; ?>
	</select>
	&nbsp;<em><?php _e('Applies to images taken from the Media Library only.', 'wp-flow-plus'); ?></em>
	</td>
</tr>
</table>

<p class="submit"><input class="button button-primary" name="submit" value="<?php echo __('Save Changes','wp-flow-plus'); ?>" type="submit" /></p>

<?php
include "admin-settings-promo.php";
?>