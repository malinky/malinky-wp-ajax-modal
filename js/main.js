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
                                
                                mamOpen(result.malinky_ajax_modal_post);
                                

        
                                

                            }
        });

    }


    function mamOpen(mamSettings) {
        mapOverlay();
        $('body').append(mamSettings);
        /*
         * Show first then center.
         */
        $('.malinky-ajax-modal').show();
        mamCenter();
        /**
         * Remove loading div and clear timers.
         */
        mamLoaded();
        clearTimeout(mamLoadingTimer);
    }


    function mamCenter() {
        /*
         * Use a timer when settings these to ensure append is finished in the ajax success.
         * Reason is although success would normally be synchronus the ajax success method isn't.
         * This results in the element height being calculated incorrectly without the timer.
         */
        setTimeout(function() {
            $('.malinky-ajax-modal').css({
                'left': '50%',
                'top': '50%',
                'margin-top': - $('.malinky-ajax-modal').outerHeight() / 2,
                'margin-left': - $('.malinky-ajax-modal').outerWidth() / 2
            });
        }, 150);
    }


    function mapOverlay() {
        $('body').append('<div class="malinky-ajax-modal-overlay"></div>');
    }


    function mamClose() {
        $('.malinky-ajax-modal-overlay').remove();
        $('.malinky-ajax-modal-loading').remove();
        $('.malinky-ajax-modal').remove();
        $(window).unbind('resize.mamModal');
    }


    /**
     * Append and show loader.gif
     */
    function mamLoading() {
        $('body').append('<div class="malinky-ajax-modal-loading"></div>');
        $('.malinky-ajax-modal-loading').show();
    }


    /**
     * Remove loader.gif
     */
    function mamLoaded() {
        $('.malinky-ajax-modal-loading').remove();
    }   


    /**
     * Close and destroy modal.
     * Attach the event to body as it's the nearest static parent on page load. See delegated events
     */
    $('body').on( 'click', '.malinky-ajax-modal__close, .malinky-ajax-modal-overlay', function(event) {
        mamClose();
    });


    /**
     * Attach click event to modal links.
     */
    $('.malinky-ajax-modal-link').click(function(event) {
        if (window.matchMedia('(min-width: 768px)').matches) {
            var mamUrl = $(this).attr('href');
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
        } else {
            return;
        }
    });  

});