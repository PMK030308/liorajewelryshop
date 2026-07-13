<?php
/**
 * Liora Headless — expose site content qua WP REST cho web React.
 *
 * Namespace: liora/v1
 *  - GET /wp-json/liora/v1/site-content  → trả JSON blob (partial) lưu trong option `liora_site_content`.
 *
 * Web React merge partial này over DEFAULT_SITE_CONTENT: trường nào WP cung cấp thì override,
 * trường thiếu fallback về seed của React. Không cần duplicate toàn bộ seed trong PHP.
 *
 * @package LioraBlog
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Option key lưu JSON site content (partial override).
 */
if ( ! defined( 'LIORA_HEADLESS_OPTION' ) ) {
	define( 'LIORA_HEADLESS_OPTION', 'liora_site_content' );
}

/**
 * Đăng ký REST route GET /liora/v1/site-content.
 */
function liora_headless_register_routes() {
	register_rest_route(
		'liora/v1',
		'/site-content',
		array(
			'methods'             => 'GET',
			'callback'            => 'liora_headless_get_site_content',
			'permission_callback' => '__return_true', // Public read — web React fetch không cần auth.
		)
	);
}
add_action( 'rest_api_init', 'liora_headless_register_routes' );

/**
 * Trả site content partial từ option.
 *
 * @return WP_REST_Response
 */
function liora_headless_get_site_content() {
	$raw = get_option( LIORA_HEADLESS_OPTION, '' );
	$data = $raw ? json_decode( $raw, true ) : null;

	if ( ! is_array( $data ) ) {
		// Chưa có override → báo chưa seed, React fallback mặc định.
		return rest_ensure_response( array( 'seeded' => false ) );
	}

	// Đánh dấu đã seed để React biết đang dùng nguồn WP.
	$data['seeded'] = true;
	return rest_ensure_response( $data );
}

/**
 * CORS cho REST API — cho phép web React (khác domain) fetch.
 * Áp dụng cho namespace liora/v1/* và wp/v2/posts (dùng cho list tin tức).
 *
 * @param bool             $served  Whether the request has already been served.
 * @param WP_HTTP_Response $result  Response object.
 * @return bool
 */
function liora_headless_rest_cors( $served, $result ) {
	$route = isset( $_SERVER['REQUEST_URI'] ) ? wp_unslash( $_SERVER['REQUEST_URI'] ) : '';

	// Chỉ thêm header cho các route headless dùng ( tránh mở rộng CORS cho toàn bộ REST ).
	$apply =
		false !== strpos( $route, '/wp-json/liora/v1/' )
		|| false !== strpos( $route, '/wp-json/wp/v2/posts' );

	if ( ! $apply ) {
		return $served;
	}

	$origin = get_http_origin();
	// Mở cho tất cả origin (shop + localhost dev). Thu hẹp lại nếu cần chặt hơn.
	header( 'Access-Control-Allow-Origin: *' );
	header( 'Access-Control-Allow-Methods: GET, OPTIONS' );
	header( 'Access-Control-Allow-Credentials: false' );
	header( 'Vary: Origin' );

	// Preflight
	if ( isset( $_SERVER['REQUEST_METHOD'] ) && 'OPTIONS' === $_SERVER['REQUEST_METHOD'] ) {
		status_header( 204 );
		exit;
	}

	return $served;
}
add_filter( 'rest_pre_serve_request', 'liora_headless_rest_cors', 15, 2 );

/* ---------------------------------------------------------------------- *
 * WP Admin: trang "Liora Headless" — edit JSON option override.
 * ---------------------------------------------------------------------- */

/**
 * Đăng ký submenu dưới Tools.
 */
function liora_headless_admin_menu() {
	add_submenu_page(
		'tools.php',
		__( 'Liora Headless', 'liora-blog' ),
		__( 'Liora Headless', 'liora-blog' ),
		'manage_options',
		'liora-headless',
		'liora_headless_admin_page'
	);
}
add_action( 'admin_menu', 'liora_headless_admin_menu' );

/**
 * Render trang admin + xử lý lưu.
 */
function liora_headless_admin_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	$saved = false;
	$error = '';

	// Xử lý submit form.
	if ( isset( $_POST['liora_headless_nonce'] ) && check_admin_referer( 'liora_headless_save', 'liora_headless_nonce' ) ) {
		$json = isset( $_POST['liora_site_content'] ) ? wp_unslash( $_POST['liora_site_content'] ) : '';
		$decoded = $json ? json_decode( $json, true ) : null;
		if ( null === $decoded && trim( $json ) !== '' ) {
			$error = __( 'JSON không hợp lệ — không lưu. Vui lòng kiểm tra lại cú pháp.', 'liora-blog' );
		} else {
			update_option( LIORA_HEADLESS_OPTION, trim( $json ) );
			$saved = true;
		}
	}

	$current = get_option( LIORA_HEADLESS_OPTION, '' );
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'Liora Headless — Site Content', 'liora-blog' ); ?></h1>
		<p>
			<?php esc_html_e( 'Nội dung JSON ở đây sẽ được serve tại /wp-json/liora/v1/site-content và override lên mặc định của web React.', 'liora-blog' ); ?>
			<?php esc_html_e( 'Chỉ cần điền các trường muốn ghi đè (partial). Trường thiếu giữ giá trị mặc định của React.', 'liora-blog' ); ?>
		</p>

		<?php if ( $saved ) : ?>
			<div class="notice notice-success is-dismissible"><p><?php esc_html_e( 'Đã lưu.', 'liora-blog' ); ?></p></div>
		<?php endif; ?>
		<?php if ( $error ) : ?>
			<div class="notice notice-error is-dismissible"><p><?php echo esc_html( $error ); ?></p></div>
		<?php endif; ?>

		<p>
			<strong><?php esc_html_e( 'Endpoint:', 'liora-blog' ); ?></strong>
			<code><?php echo esc_html( home_url( '/wp-json/liora/v1/site-content' ) ); ?></code>
		</p>

		<form method="post">
			<?php wp_nonce_field( 'liora_headless_save', 'liora_headless_nonce' ); ?>
			<p>
				<label for="liora_site_content"><strong><?php esc_html_e( 'JSON override (SiteContent partial):', 'liora-blog' ); ?></strong></label><br>
				<textarea
					id="liora_site_content"
					name="liora_site_content"
					rows="20"
					cols="100"
					style="font-family: monospace; width: 100%; max-width: 900px;"
					placeholder='<?php echo esc_attr( "{\n  \"settings\": {\n    \"tagline\": \"Own Your Shine\",\n    \"shopeeUrl\": \"https://shopee.vn/liora.jewelry\"\n  },\n  \"footer\": { ... }\n}" ); ?>'
				><?php echo esc_textarea( $current ); ?></textarea>
			</p>
			<?php submit_button( __( 'Lưu', 'liora-blog' ) ); ?>
		</form>

		<h2><?php esc_html_e( 'Các trường có thể override', 'liora-blog' ); ?></h2>
		<p><?php esc_html_e( 'Khớp với SiteContent của React: settings, footer, heroSlides, about, pages, newsArticles, navCategories, categoryTiles, shopQuickFilters.', 'liora-blog' ); ?></p>
	</div>
	<?php
}