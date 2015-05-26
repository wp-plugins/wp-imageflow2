<?php
/**
 * Admin View: Settings
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}
?>

<div class="wrap">
	<h2><?php _e('WP Flow Plus Settings', 'wp-flow-plus'); ?></h2>
	<form action="" method="post">
		<?php
			$current_tab = isset( $_GET['tab'] ) ? $_GET['tab'] : 'general';
			echo '<h2 class="nav-tab-wrapper">';
				foreach ( $tabs as $tab_key => $tab_caption ) {
					$active = $current_tab == $tab_key ? 'nav-tab-active' : '';
					echo '<a class="nav-tab ' . $active . '" href="?page=wpFlowPlus&tab=' . $tab_key . '">' . $tab_caption . '</a>';
				}
			echo '</h2>';
			
			do_action ( 'wpfp_settings_tab_' . $current_tab);
		?>

	<input type="hidden" value="true" name="save_wpflowplus">
	<?php
	if ( function_exists('wp_nonce_field') )
		wp_nonce_field('update_wpflowplus_options');
	?>
	</form>				

</div>
		