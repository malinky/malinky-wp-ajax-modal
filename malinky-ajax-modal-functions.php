<?php

if ( ! function_exists( 'malinky_ajax_modal_post' ) ) {

	/**
	 * Get the post to open in the modal.
	 *
	 * @param int $modal_url URL of the post to open in modal.
	 */
	function malinky_ajax_modal_post( $modal_url )
	{

		if ( ! $modal_url ) return;

		$malinky_post_id = url_to_postid( $modal_url );

		if ( ! $malinky_post_id ) return;

		$malinky_post = get_post( $malinky_post_id ) ;

		return $malinky_post;

	}

}