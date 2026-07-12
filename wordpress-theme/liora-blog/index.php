<?php
/**
 * Danh sách bài viết (blog home / archive).
 *
 * @package LioraBlog
 */
get_header();

$title = '';
if ( is_home() && ! is_front_page() ) {
	$title = single_post_title( '', false );
} elseif ( is_archive() ) {
	$title = get_the_archive_title();
}
?>

<section class="page-hero">
	<div class="container">
		<div class="breadcrumb">
			<a href="<?php echo esc_url( liora_shop_links()['home'] ); ?>" target="_blank" rel="noopener">Liora</a>
			<span>/</span>
			<span><?php echo esc_html( $title ? strip_tags( $title ) : 'Blog' ); ?></span>
		</div>
		<h1><?php echo $title ? wp_kses_post( $title ) : esc_html__( 'Tin tức & Blog Liora', 'liora-blog' ); ?></h1>
		<p><?php esc_html_e( 'Kiến thức trang sức bạc, đá quý, cách bảo quản và phối đồ cùng Liora.', 'liora-blog' ); ?></p>
	</div>
</section>

<div class="container">
	<?php if ( have_posts() ) : ?>
		<div class="posts-grid">
			<?php while ( have_posts() ) : the_post(); ?>
				<?php get_template_part( 'template-parts/card', get_post_type() ); ?>
			<?php endwhile; ?>
		</div>

		<?php the_posts_pagination( array(
			'prev_text'          => __( '‹ Trước', 'liora-blog' ),
			'next_text'          => __( 'Sau ›', 'liora-blog' ),
			'before_page_number' => '',
		) ); ?>
	<?php else : ?>
		<div class="notice-box">
			<h1><?php esc_html_e( 'Chưa có bài viết nào', 'liora-blog' ); ?></h1>
			<p><?php esc_html_e( 'Hãy thêm bài viết đầu tiên trong WordPress Admin → Bài viết → Thêm mới.', 'liora-blog' ); ?></p>
			<a class="btn-pink" href="<?php echo esc_url( admin_url( 'post-new.php' ) ); ?>"><?php esc_html_e( 'Viết bài mới →', 'liora-blog' ); ?></a>
		</div>
	<?php endif; ?>
</div>

<?php get_footer(); ?>