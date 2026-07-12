<?php
/**
 * Header — Liora Blog.
 *
 * @package LioraBlog
 */
$shop   = liora_shop_links();
$blog_u = liora_blog_url();
$logo   = has_custom_logo() ? get_custom_logo() : '<span class="script">Liora</span>';
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="profile" href="https://gmpg.org/xfn/11">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="screen-reader-text" href="#main"><?php esc_html_e( 'Bỏ qua tới nội dung', 'liora-blog' ); ?></a>

<header class="site-header">
	<div class="container">
		<div class="bar">
			<a class="brand" href="<?php echo esc_url( $blog_u ); ?>">
				<span class="logo-wrap"><?php echo $logo; // custom_logo, đã escape nội bộ ?></span>
				<span class="script">Liora Blog</span>
			</a>

			<nav class="main-nav" aria-label="<?php esc_attr_e( 'Menu chính', 'liora-blog' ); ?>">
				<a href="<?php echo esc_url( $shop['home'] ); ?>" target="_blank" rel="noopener"><?php esc_html_e( 'Trang chủ', 'liora-blog' ); ?></a>
				<a href="<?php echo esc_url( $shop['shop'] ); ?>" target="_blank" rel="noopener"><?php esc_html_e( 'Sản phẩm', 'liora-blog' ); ?></a>
				<a href="<?php echo esc_url( $shop['about'] ); ?>" target="_blank" rel="noopener"><?php esc_html_e( 'Giới thiệu', 'liora-blog' ); ?></a>
				<a class="current" href="<?php echo esc_url( $blog_u ); ?>"><?php esc_html_e( 'Blog', 'liora-blog' ); ?></a>
				<a href="<?php echo esc_url( $shop['contact'] ); ?>" target="_blank" rel="noopener"><?php esc_html_e( 'Liên hệ', 'liora-blog' ); ?></a>
			</nav>

			<button class="menu-toggle" aria-label="<?php esc_attr_e( 'Mở menu', 'liora-blog' ); ?>" aria-expanded="false" aria-controls="mobile-nav" onclick="this.setAttribute('aria-expanded', this.getAttribute('aria-expanded')==='true'?'false':'true'); document.getElementById('mobile-nav').classList.toggle('open');">
				<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
			</button>
		</div>

		<nav id="mobile-nav" class="mobile-nav" aria-label="<?php esc_attr_e( 'Menu mobile', 'liora-blog' ); ?>">
			<a href="<?php echo esc_url( $shop['home'] ); ?>" target="_blank" rel="noopener"><?php esc_html_e( 'Trang chủ', 'liora-blog' ); ?></a>
			<a href="<?php echo esc_url( $shop['shop'] ); ?>" target="_blank" rel="noopener"><?php esc_html_e( 'Sản phẩm', 'liora-blog' ); ?></a>
			<a href="<?php echo esc_url( $shop['about'] ); ?>" target="_blank" rel="noopener"><?php esc_html_e( 'Giới thiệu', 'liora-blog' ); ?></a>
			<a class="current" href="<?php echo esc_url( $blog_u ); ?>"><?php esc_html_e( 'Blog', 'liora-blog' ); ?></a>
			<a href="<?php echo esc_url( $shop['contact'] ); ?>" target="_blank" rel="noopener"><?php esc_html_e( 'Liên hệ', 'liora-blog' ); ?></a>
		</nav>
	</div>
</header>

<main id="main">