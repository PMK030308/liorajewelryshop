<?php
/**
 * Form tìm kiếm.
 *
 * @package LioraBlog
 */
?>
<form role="search" method="get" class="search-form" action="<?php echo esc_url( home_url( '/' ) ); ?>">
	<label>
		<span class="screen-reader-text"><?php esc_html_e( 'Tìm kiếm cho:', 'liora-blog' ); ?></span>
		<input type="search" class="search-field" placeholder="<?php esc_attr_e( 'Tìm bài viết…', 'liora-blog' ); ?>" value="<?php echo esc_attr( get_search_query() ); ?>" name="s" />
	</label>
	<button type="submit" class="search-submit" aria-label="<?php esc_attr_e( 'Tìm', 'liora-blog' ); ?>">
		<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
	</button>
</form>