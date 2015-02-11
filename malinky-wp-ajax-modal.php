<?php
/**
 * Plugin Name: Malinky Ajax Modal Plugin
 * Plugin URI: https://github.com/malinky/malinky-wp-ajax-modal
 * Description: Add ajax modal.
 * Version: 1.0
 * Author: Malinky
 * Author URI: https://github.com/malinky
 * License: GPL2
 */

class Malinky_Ajax_Modal
{

	public function __construct()
	{

		//Trailing Slash
		define( 'MALINKY_AJAX_MODAL_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
		//No Trailing Slash
		define( 'MALINKY_AJAX_MODAL_PLUGIN_URL', plugins_url( basename( plugin_dir_path( __FILE__ ) ) ) );


        /* ------------------------------------------------------------------------ *
	     * Ajax
	     * wp_ajax_nopriv and wp_ajax followed by ajax action / the method called
	     * ------------------------------------------------------------------------ */
        add_action( 'wp_ajax_nopriv_malinky-ajax-modal-submit', array( $this, 'malinky_ajax_modal_submit' ) );
        add_action( 'wp_ajax_malinky-ajax-modal-submit', array( $this, 'malinky_ajax_modal_submit' ) );


		/* ------------------------------------------------------------------------ *
	     * Includes
	     * ------------------------------------------------------------------------ */
		include( 'malinky-ajax-modal-functions.php' );


	   	/* ------------------------------------------------------------------------ *
	     * Call Methods - LOADED LAST TO ENSURE CSS CASCADES.
	     * ------------------------------------------------------------------------ */
	   	add_action( 'wp_enqueue_scripts', array( $this, 'malinky_ajax_modal_styles' ), 99 );
	   	add_action( 'wp_enqueue_scripts', array( $this, 'malinky_ajax_modal_scripts' ), 99 );

	}


	public function malinky_ajax_modal_styles()
	{

		/**
		 * Ajax paging style.
		 *
		 * @link http://bxslider.com/
		 */		
		wp_register_style( 'malinky-ajax-modal', 
							MALINKY_AJAX_MODAL_PLUGIN_URL . '/css/style.css', 
							false, 
							NULL
		);
		wp_enqueue_style( 'malinky-ajax-modal' );

	}


	public function malinky_ajax_modal_scripts()
	{

		/**
		 * Trigger ajax paging.
		 */
		wp_register_script( 'malinky-ajax-modal-main-js', 
							MALINKY_AJAX_MODAL_PLUGIN_URL . '/js/main.js', 
							array( 'jquery' ), 
							NULL, 
							true
		);

		/**
		 * Set up variables to localize in main.js.
		 */
		$malinky_ajax_modal['ajaxurl'] = admin_url( 'admin-ajax.php' );

		wp_localize_script( 'malinky-ajax-modal-main-js', 'malinky_ajax_modal', $malinky_ajax_modal );
		wp_enqueue_script( 'malinky-ajax-modal-main-js' );

	}


	public function malinky_ajax_modal_submit()
	{

		$modal_url 	= isset( $_GET['mamUrl'] ) ? $_GET['mamUrl'] : false;

		$malinky_ajax_modal_post = malinky_ajax_modal_post( $modal_url );
		
		/**
		 * Debugging.
		 * echo json_encode( $malinky_ajax_modal_post );
		 * exit;
		 */
		
		ob_start(); ?>

			<div class="malinky-ajax-modal" itemscope itemtype="http://schema.org/ItemPage">
				<img src="<?php echo esc_url( get_field( 'post_hero_shot', $malinky_ajax_modal_post->ID )['sizes']['malinky_thumbnail'] ); ?>" alt="<?php echo esc_attr( $malinky_ajax_modal_post->post_title ); ?>" class="malinky-ajax-modal__image" itemprop="primaryImageOfPage" />
				<div class="malinky-ajax-modal__text">
					<h5 class="malinky-ajax-modal__text__heading" itemprop="name"><?php echo esc_html( $malinky_ajax_modal_post->post_title ); ?></h5>
					<p itemprop="mainContentOfPage"><?php echo $malinky_ajax_modal_post->post_content; ?></p>
				</div>
				<a class="malinky-ajax-modal__close button">X</a>
			</div>

		<?php $result['malinky_ajax_modal_post'] = ob_get_clean();

		echo json_encode( $result );

        exit();

	}

}


$malinky_ajax_modal = new Malinky_Ajax_Modal();