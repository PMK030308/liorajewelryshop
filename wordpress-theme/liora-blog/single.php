<?php
/**
 * Trang bài viết đơn.
 *
 * @package LioraBlog
 */
get_header();

while ( have_posts() ) :
	the_post();
	$shop = liora_shop_links();
	?>
	<div class="container">
		<div class="article-wrap">

			<article class="article-main">
				<div class="breadcrumb">
					<a href="<?php echo esc_url( $shop['home'] ); ?>" target="_blank" rel="noopener">Liora</a>
					<span>/</span>
					<a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Blog', 'liora-blog' ); ?></a>
					<span>/</span>
					<span><?php echo esc_html( wp_trim_words( get_the_title(), 8, '…' ) ); ?></span>
				</div>

				<a class="back-link" href="<?php echo esc_url( home_url( '/' ) ); ?>">← <?php esc_html_e( 'Quay lại Blog', 'liora-blog' ); ?></a>

				<div class="article-meta">
					<time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo esc_html( get_the_date() ); ?></time>
					<span class="dot"></span>
					<span class="author"><?php esc_html_e( 'Bởi', 'liora-blog' ); ?> <?php the_author(); ?></span>
					<?php
					$cats = get_the_category_list( ', ' );
					if ( $cats ) {
						echo '<span class="dot"></span><span>' . wp_kses_post( $cats ) . '</span>';
					}
					?>
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
						'before'      => '<div style="margin-top:1.5rem;">' . esc_html__( 'Trang:', 'liora-blog' ),
						'after'       => '</div>',
						'next_or_num' => 'num',
					) );
					?>
				</div>

				<?php
				$tags = get_the_tag_list( '', ' ', '' );
				if ( $tags ) :
					?>
					<div class="tags"><?php echo wp_kses_post( $tags ); ?></div>
				<?php endif; ?>

				<?php if ( comments_open() || get_comments_number() ) : ?>
					<div class="comments-area">
						<?php comments_template(); ?>
					</div>
				<?php endif; ?>
			</article>

			<aside class="sidebar">
				<?php if ( is_active_sidebar( 'article-sidebar' ) ) : ?>
					<?php dynamic_sidebar( 'article-sidebar' ); ?>
				<?php else : ?>
					<section class="widget">
						<h2 class="widget-title"><?php esc_html_e( 'Danh mục', 'liora-blog' ); ?></h2>
						<ul><?php wp_list_categories( array( 'title_li' => '' ) ); ?></ul>
					</section>
					<section class="widget">
						<h2 class="widget-title"><?php esc_html_e( 'Bài viết mới', 'liora-blog' ); ?></h2>
						<ul>
							<?php
							$recent = new WP_Query( array( 'posts_per_page' => 5, 'post_status' => 'publish' ) );
							while ( $recent->have_posts() ) :
								$recent->the_post();
								?>
								<li><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></li>
								<?php
							endwhile;
							wp_reset_postdata();
							?>
						</ul>
					</section>
					<section class="widget">
						<h2 class="widget-title"><?php esc_html_e( 'Khám phá shop', 'liora-blog' ); ?></h2>
						<p style="margin:0 0 .8rem;font-size:.85rem;color:var(--ink2);">
							<?php esc_html_e( 'Trang sức bạc cao cấp dành cho giới trẻ.', 'liora-blog' ); ?>
						</p>
						<a class="btn-pink" href="<?php echo esc_url( $shop['shop'] ); ?>" target="_blank" rel="noopener"><?php esc_html_e( 'Xem sản phẩm →', 'liora-blog' ); ?></a>
					</section>
				<?php endif; ?>
			</aside>

		</div>
	</div>
	<?php
endwhile;

get_footer();