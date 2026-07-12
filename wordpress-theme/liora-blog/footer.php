<?php
/**
 * Footer — Liora Blog.
 *
 * @package LioraBlog
 */
$shop = liora_shop_links();
?>
</main><!-- #main -->

<footer class="site-footer">
	<div class="container">
		<div class="inner">
			<div>
				<span class="script" style="font-family:'Dancing Script',cursive;font-size:1.4rem;color:#fff;">Liora</span>
				<div style="font-size:.82rem;opacity:.85;"><?php bloginfo( 'name' ); ?> — Blog trang sức bạc cao cấp</div>
			</div>

			<nav style="display:flex;gap:1.2rem;flex-wrap:wrap;font-size:.88rem;">
				<a href="<?php echo esc_url( $shop['home'] ); ?>" target="_blank" rel="noopener"><?php esc_html_e( 'Shop Liora', 'liora-blog' ); ?></a>
				<a href="<?php echo esc_url( $shop['shop'] ); ?>" target="_blank" rel="noopener"><?php esc_html_e( 'Sản phẩm', 'liora-blog' ); ?></a>
				<a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Tất cả bài viết', 'liora-blog' ); ?></a>
				<a href="<?php echo esc_url( $shop['contact'] ); ?>" target="_blank" rel="noopener"><?php esc_html_e( 'Liên hệ', 'liora-blog' ); ?></a>
			</nav>

			<div style="text-align:right;font-size:.88rem;">
				<div class="hotline">Hotline 0985 048 952</div>
				<div style="opacity:.7;font-size:.8rem;">9:00 – 21:00 hàng ngày</div>
			</div>

			<div class="copyright">
				© <?php echo esc_html( date_i18n( 'Y' ) ); ?> Liorajewelry. All rights reserved.
			</div>
		</div>
	</div>
</footer>

<?php wp_footer(); ?>
</body>
</html>