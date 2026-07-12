<?php
/**
 * Liora Blog — functions & theme setup.
 *
 * @package LioraBlog
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Truy cập trực tiếp bị chặn.
}

/**
 * URL web chính (shop React). Đổi tại đây nếu domain khác.
 */
if ( ! defined( 'LIORA_SHOP_URL' ) ) {
	define( 'LIORA_SHOP_URL', 'https://liorajewelry.com' );
}

/**
 * Thiết lập theme.
 */
function liora_setup() {
	add_theme_support( 'title-tag' );           // <title> do WP/plugin SEO quản lý.
	add_theme_support( 'post-thumbnails' );      // ảnh đại diện bài viết.
	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script', 'navigation-widgets' ) );
	add_theme_support( 'custom-logo', array(
		'height'      => 80,
		'width'       => 80,
		'flex-height' => true,
		'flex-width'  => true,
	) );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'align-wide' );

	// Kích thước ảnh.
	add_image_size( 'liora-card', 720, 450, true );
	add_image_size( 'liora-hero', 1280, 720, true );

	register_nav_menus( array(
		'primary' => __( 'Menu chính', 'liora-blog' ),
		'footer'  => __( 'Menu footer', 'liora-blog' ),
	) );

	load_theme_textdomain( 'liora-blog', get_template_directory() . '/languages' );
}
add_action( 'after_setup_theme', 'liora_setup' );

/**
 * Đăng ký stylesheet + font Google.
 */
function liora_assets() {
	// Font thương hiệu (giống index.html của web React).
	wp_enqueue_style(
		'liora-fonts',
		'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700&family=Dancing+Script:wght@600&display=swap',
		array(),
		null
	);
	// Style theme.
	wp_enqueue_style( 'liora-style', get_stylesheet_uri(), array( 'liora-fonts' ), '1.0.0' );
}
add_action( 'wp_enqueue_scripts', 'liora_assets' );

/**
 * Chiều rộng nội dung (cho embed/oEmbed).
 */
if ( ! isset( $content_width ) ) {
	$content_width = 760;
}

/**
 * Meta description dự phòng khi chưa cài plugin SEO.
 * Chỉ xuất khi không có plugin SEO (để tránh trùng lặp). Ưu tiên Rank Math / Yoast.
 */
function liora_fallback_meta_description() {
	// Đừng xuất nếu plugin SEO đang lo.
	if ( class_exists( 'WPSEO_Frontend', false ) || class_exists( 'RankMath', false ) || defined( 'RANK_MATH_VERSION' ) ) {
		return;
	}
	$desc = '';
	if ( is_singular() ) {
		$desc = wp_strip_all_tags( get_the_excerpt() );
		if ( ! $desc ) {
			$desc = wp_strip_all_tags( wp_trim_words( get_the_content(), 30 ) );
		}
	} elseif ( is_home() || is_front_page() ) {
		$desc = get_bloginfo( 'description' );
	} elseif ( is_category() || is_tag() || is_tax() ) {
		$desc = wp_strip_all_tags( term_description() );
	}
	if ( $desc ) {
		echo '<meta name="description" content="' . esc_attr( wp_trim_words( $desc, 30, '…' ) ) . '" />' . "\n";
	}
}
add_action( 'wp_head', 'liora_fallback_meta_description', 5 );

/**
 * Trả link "Tin tức" về blog (cho header theme).
 */
function liora_blog_url() {
	return home_url( '/' );
}

/**
 * Helper: link các trang web chính (hash route React).
 */
function liora_shop_links() {
	return array(
		'home'    => LIORA_SHOP_URL . '/',
		'shop'    => LIORA_SHOP_URL . '/#/shop',
		'about'   => LIORA_SHOP_URL . '/#/about',
		'contact' => LIORA_SHOP_URL . '/#/lien-he',
	);
}

/**
 * Widget sidebar cho trang bài.
 */
function liora_widgets_init() {
	register_sidebar( array(
		'id'            => 'article-sidebar',
		'name'          => __( 'Sidebar bài viết', 'liora-blog' ),
		'description'   => __( 'Hiển thị bên cạnh bài viết (mục lục, bài mới, danh mục).', 'liora-blog' ),
		'before_widget' => '<section class="widget %2$s" id="%1$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h2 class="widget-title">',
		'after_title'   => '</h2>',
	) );
}
add_action( 'widgets_init', 'liora_widgets_init' );

/**
 * Lớp "current" cho menu top — đánh dấu Blog.
 */
function liora_nav_current_class( $classes, $item ) {
	return $classes;
}
add_filter( 'nav_menu_css_class', 'liora_nav_current_class', 10, 2 );