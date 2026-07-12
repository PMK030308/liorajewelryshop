<?php
/**
 * Template part: thẻ bài viết (dùng trong index / search / archive).
 *
 * @package LioraBlog
 */
?>
<article id="post-<?php the_ID(); ?>" <?php post_class( 'post-card' ); ?>>
	<a class="thumb" href="<?php the_permalink(); ?>" aria-label="<?php echo esc_attr( get_the_title() ); ?>">
		<?php if ( has_post_thumbnail() ) : ?>
			<?php the_post_thumbnail( 'liora-card', array( 'alt' => esc_attr( get_the_title() ) ) ); ?>
		<?php else : ?>
			<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#ffb0c7;font-family:'Dancing Script',cursive;font-size:1.6rem;"><?php esc_html_e( 'Liora', 'liora-blog' ); ?></div>
		<?php endif; ?>
	</a>

	<div class="body">
		<div class="meta">
			<time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo esc_html( get_the_date() ); ?></time>
			<span class="dot"></span>
			<?php
			$cats = get_the_category_list( ', ' );
			if ( $cats ) {
				echo '<span>' . wp_kses_post( $cats ) . '</span>';
			}
			?>
		</div>

		<h3 class="title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>

		<?php if ( has_excerpt() ) : ?>
			<p class="excerpt"><?php echo esc_html( wp_strip_all_tags( get_the_excerpt() ) ); ?></p>
		<?php else : ?>
			<p class="excerpt"><?php echo esc_html( wp_trim_words( wp_strip_all_tags( get_the_content() ), 28, '…' ) ); ?></p>
		<?php endif; ?>

		<a class="read-more" href="<?php the_permalink(); ?>"><?php esc_html_e( 'Đọc tiếp →', 'liora-blog' ); ?></a>
	</div>
</article>