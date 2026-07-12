<?php
/**
 * Trang tĩnh.
 *
 * @package LioraBlog
 */
get_header();

while ( have_posts() ) :
	the_post();
	$shop = liora_shop_links();
	?>
	<div class="container">
		<div class="page-content">
			<div class="breadcrumb">
				<a href="<?php echo esc_url( $shop['home'] ); ?>" target="_blank" rel="noopener">Liora</a>
				<span>/</span>
				<a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Blog', 'liora-blog' ); ?></a>
				<span>/</span>
				<span><?php the_title(); ?></span>
			</div>

			<h1><?php the_title(); ?></h1>

			<?php if ( has_post_thumbnail() ) : ?>
				<div class="article-hero">
					<?php the_post_thumbnail( 'liora-hero', array( 'alt' => esc_attr( get_the_title() ) ) ); ?>
				</div>
			<?php endif; ?>

			<div class="entry-content">
				<?php
				the_content();
				wp_link_pages( array(
					'before' => '<div style="margin-top:1.5rem;">' . esc_html__( 'Trang:', 'liora-blog' ),
					'after'  => '</div>',
				) );
				?>
			</div>

			<?php if ( comments_open() || get_comments_number() ) : ?>
				<div class="comments-area"><?php comments_template(); ?></div>
			<?php endif; ?>
		</div>
	</div>
	<?php
endwhile;

get_footer();