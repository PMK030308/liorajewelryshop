<?php
/**
 * 404 — không tìm thấy trang.
 *
 * @package LioraBlog
 */
get_header();
$shop = liora_shop_links();
?>
<div class="container">
	<div class="notice-box">
		<h1>404</h1>
		<p><?php esc_html_e( 'Trang bạn tìm không tồn tại. Có thể bài viết đã bị xoá hoặc di chuyển.', 'liora-blog' ); ?></p>
		<div style="display:flex;gap:.8rem;justify-content:center;flex-wrap:wrap;">
			<a class="btn-pink" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Về Blog Liora →', 'liora-blog' ); ?></a>
			<a class="btn-pink" href="<?php echo esc_url( $shop['home'] ); ?>" target="_blank" rel="noopener"><?php esc_html_e( 'Về Shop Liora', 'liora-blog' ); ?></a>
		</div>
	</div>
</div>
<?php get_footer(); ?>