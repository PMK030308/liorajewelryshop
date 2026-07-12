<?php
/**
 * Kết quả tìm kiếm.
 *
 * @package LioraBlog
 */
get_header();
?>
<section class="page-hero">
	<div class="container">
		<div class="breadcrumb">
			<a href="<?php echo esc_url( liora_shop_links()['home'] ); ?>" target="_blank" rel="noopener">Liora</a>
			<span>/</span>
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Blog', 'liora-blog' ); ?></a>
			<span>/</span>
			<span><?php esc_html_e( 'Tìm kiếm', 'liora-blog' ); ?></span>
		</div>
		<h1><?php printf( esc_html__( 'Kết quả cho: %s', 'liora-blog' ), '<span style="color:var(--brand-500);">' . esc_html( get_search_query() ) . '</span>' ); ?></h1>
	</div>
</section>

<div class="container">
	<?php if ( have_posts() ) : ?>
		<p style="color:var(--mute);font-size:.85rem;margin:1.5rem 0 .25rem;">
			<?php
			global $wp_query;
			printf( esc_html__( 'Tìm thấy %d bài viết.', 'liora-blog' ), (int) $wp_query->found_posts );
			?>
		</p>
		<div class="posts-grid">
			<?php while ( have_posts() ) : the_post(); ?>
				<?php get_template_part( 'template-parts/card', get_post_type() ); ?>
			<?php endwhile; ?>
		</div>

		<?php the_posts_pagination( array( 'prev_text' => '‹', 'next_text' => '›' ) ); ?>
	<?php else : ?>
		<div class="notice-box">
			<h1><?php esc_html_e( 'Không tìm thấy', 'liora-blog' ); ?></h1>
			<p><?php esc_html_e( 'Không có bài viết nào khớp với từ khoá. Thử từ khoá khác nhé.', 'liora-blog' ); ?></p>
			<?php get_search_form(); ?>
		</div>
	<?php endif; ?>
</div>

<?php get_footer(); ?>