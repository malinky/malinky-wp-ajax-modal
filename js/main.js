/* ------------------------------------------------------------------------ *
 * jQuery
 * ------------------------------------------------------------------------ */

jQuery(document).ready(function($){

    /**
     * Load post.
     */
    function mamPost(mamUrl)
    {

        var data = {
            action:     'malinky-ajax-modal-submit',
            mamUrl:     mamUrl
        };

        /**
         * Load the content of the next page.
         * Find the .archive-content divs only found in content.php.
         * Add after the last article of .malinky-ajax-modal-content.
         * .after() is used as it doesn't add whitespace where using .append() breaks the layout due to
         * the use of display: inline-block.
         */
        $.ajax({
                type:       'GET',
                url:        malinky_ajax_modal.ajaxurl,
                data:       data,
                success:    function(response) {

                                var result = $.parseJSON(response);

                                /**
                                 * Debug result, also set in malinky_ajax_modal_submit() and malinky_ajax_modal_wp_query().
                                 * console.log(result);
                                 */

                                $('body').append(result.malinky_ajax_modal_post);

                                /**
                                 * Remove loading div and clear timer.s
                                 */
                                mamLoaded();
                                clearTimeout(mamLoadingTimer);

                            }
        });

    }


    /**
     * Add loader.gif
     */
    function mamLoading()
    {

        $('.malinky-ajax-modal-loading').show();

    }


    /**
     * Remove loader.gif
     */
    function mamLoaded()
    {

        $('.malinky-ajax-modal-loading').remove();

    }   


    /**
     * Close and destroy modal.
     * Attach the event to body as it's the nearest static parent on page load.
     */
    $('body').on( 'click', '.malinky-ajax-modal__close, .malinky-ajax-modal-overlay', function(event) {

        $('.malinky-ajax-modal-overlay').remove();
        $('.malinky-ajax-modal-loading').remove();
        $('.malinky-ajax-modal').remove();

    });


    /**
     * Use .on as the pagination is added after page load and we need to use delegated event.
     */
    $('.malinky-ajax-modal-link').click(function(event) {

        var mamUrl = $(this).attr('href');

        if (!document.querySelector('.malinky-ajax-modal-overlay')) {
            $('body').append('<div class="malinky-ajax-modal-overlay"></div>');
            $('.malinky-ajax-modal-overlay').width($(document).width());
            $('.malinky-ajax-modal-overlay').height($(document).height());
        }   

        if (!document.querySelector('.malinky-ajax-modal-loading')) {
            $('body').append('<div class="malinky-ajax-modal-loading"></div>');
        }                               

        /**
         * Delay loading text and div.
         */
        mamLoadingTimer = setTimeout(mamLoading, 750);

        /**
         * Debug timer. Remove mamPost call and use setTimeout instead.
         * setTimeout(function() {
         *   mamPost(mamUrl);
         * }, 3000);
         */                 

        mamPost(mamUrl);

        event.preventDefault();

    });  

});