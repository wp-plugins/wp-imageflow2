<?php 
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

//This plugin creates an entry in the options database. When the plugin will be deleted, this code will automatically delete the database entry from the options Wordpress table.
delete_option('wpimageflow2_options'); 

// Remove the metadata we added to images
$allposts = get_posts('numberposts=-1&post_type=attachment&post_status=any');

  foreach( $allposts as $postinfo) {
    delete_post_meta($postinfo->ID, '_wpif2-image-link');
  }
?>