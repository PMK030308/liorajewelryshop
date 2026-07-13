import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import AdminLayout from './AdminLayout';
import { getWordPressConfig, saveWordPressConfig, fetchWordPressPosts, fetchWooCommerceProducts, fetchWordPressSiteContent, WordPressConfig } from '../../utils/wordpressService';
import { CheckCircle2, XCircle, RefreshCw, Save, HelpCircle, Lightbulb } from 'lucide-react';

export default function WordPressSettings() {
  const { showToast, navigate } = useStore();
  const [config, setConfig] = useState<WordPressConfig>({
    useWordPress: false,
    apiUrl: '',
    consumerKey: '',
    consumerSecret: '',
  });

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    wpOk?: boolean;
    wcOk?: boolean;
    scOk?: boolean;
    wpError?: string;
    wcError?: string;
    scError?: string;
    tested?: boolean;
  }>({});

  useEffect(() => {
    setConfig(getWordPressConfig());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveWordPressConfig(config);
    showToast('Đã lưu cấu hình WordPress. Tải lại trang để áp dụng.');
    
    // Auto-test if enabled
    if (config.useWordPress) {
      runConnectionTest(config);
    }
  };

  const runConnectionTest = async (testConfig: WordPressConfig) => {
    setTesting(true);
    setTestResult({ tested: true });
    
    let wpOk = false;
    let wcOk = false;
    let scOk = false;
    let wpError = '';
    let wcError = '';
    let scError = '';

    // 1. Test WordPress posts API
    try {
      if (!testConfig.apiUrl) throw new Error('Chưa điền URL trang web WordPress');

      // Temporary enable for test invocation
      const tempConfig = { ...testConfig, useWordPress: true };
      const posts = await fetchWordPressPosts(tempConfig);
      wpOk = Array.isArray(posts);
    } catch (e: any) {
      wpError = e.message || 'Lỗi không xác định';
    }

    // 2. Test WooCommerce API
    try {
      if (!testConfig.apiUrl) throw new Error('Chưa điền URL trang web WordPress');
      if (!testConfig.consumerKey || !testConfig.consumerSecret) {
        throw new Error('Chưa điền đầy đủ Consumer Key hoặc Consumer Secret');
      }

      const tempConfig = { ...testConfig, useWordPress: true };
      const products = await fetchWooCommerceProducts(tempConfig);
      wcOk = Array.isArray(products);
    } catch (e: any) {
      wcError = e.message || 'Lỗi không xác định';
    }

    // 3. Test site-content endpoint (liora/v1/site-content — route custom của theme)
    try {
      if (!testConfig.apiUrl) throw new Error('Chưa điền URL trang web WordPress');
      const tempConfig = { ...testConfig, useWordPress: true };
      const partial = await fetchWordPressSiteContent(tempConfig);
      scOk = typeof partial === 'object' && partial !== null;
    } catch (e: any) {
      scError = e.message || 'Lỗi không xác định';
    }

    setTestResult({
      wpOk,
      wcOk,
      scOk,
      wpError,
      wcError,
      scError,
      tested: true,
    });
    setTesting(false);

    if (wpOk && wcOk && scOk) {
      showToast('Kết nối WordPress, WooCommerce & Site Content thành công!');
    } else {
      showToast('Kiểm tra kết nối chưa hoàn tất. Xem chi tiết bên cạnh.');
    }
  };

  return (
    <AdminLayout active="wordpress">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-700">Tích hợp WordPress</h1>
          <p className="text-sm text-mute">Thiết lập Headless WordPress & WooCommerce để quản lý nội dung danh mục và tin tức</p>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="bg-white border border-rule rounded-xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-rule mb-2">
              <h2 className="font-semibold text-brand-750">Thông tin kết nối API</h2>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.useWordPress}
                  onChange={(e) => setConfig({ ...config, useWordPress: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-rule peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-rule after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-700"></div>
                <span className="ml-2 text-xs font-semibold text-ink">Bật tích hợp</span>
              </label>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-mute mb-1.5">WordPress Site URL</label>
                <input
                  type="url"
                  placeholder="https://your-wordpress-site.com"
                  value={config.apiUrl}
                  onChange={(e) => setConfig({ ...config, apiUrl: e.target.value })}
                  className="w-full text-sm px-3 py-2 border border-rule rounded-lg focus:outline-none focus:border-brand-500 bg-[#fbfcfd]"
                  required={config.useWordPress}
                />
                <span className="text-[11px] text-mute mt-1 block">Địa chỉ trang web WordPress (không có dấu gạch chéo cuối cùng, ví dụ: https://liora.local)</span>
              </div>

              <div className="bg-[#f8fafc] rounded-xl border border-slate-100 p-4 space-y-4">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold uppercase text-ink2 tracking-wider">WooCommerce REST API</span>
                  <span className="cursor-help" title="Lấy chìa khóa API trong Cấu hình WooCommerce -> Nâng cao -> REST API">
                    <HelpCircle size={14} className="text-mute" />
                  </span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-ink2 mb-1.5">Consumer Key (CK)</label>
                    <input
                      type="text"
                      placeholder="ck_..."
                      value={config.consumerKey}
                      onChange={(e) => setConfig({ ...config, consumerKey: e.target.value })}
                      className="w-full text-sm px-3 py-2 border border-rule rounded-lg focus:outline-none focus:border-brand-500 bg-white"
                      required={config.useWordPress}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink2 mb-1.5">Consumer Secret (CS)</label>
                    <input
                      type="password"
                      placeholder="cs_..."
                      value={config.consumerSecret}
                      onChange={(e) => setConfig({ ...config, consumerSecret: e.target.value })}
                      className="w-full text-sm px-3 py-2 border border-rule rounded-lg focus:outline-none focus:border-brand-500 bg-white"
                      required={config.useWordPress}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="btn-pink px-5 py-2 text-sm flex items-center gap-2"
              >
                <Save size={16} />
                Lưu cài đặt
              </button>
              
              {config.apiUrl && (
                <button
                  type="button"
                  onClick={() => runConnectionTest(config)}
                  disabled={testing}
                  className="px-4 py-2 border border-rule hover:bg-[#f6f8fa] active:bg-[#eff2f5] text-ink text-sm rounded-lg font-medium transition flex items-center gap-2 disabled:opacity-50"
                >
                  {testing ? <RefreshCw size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                  Kiểm tra kết nối
                </button>
              )}
            </div>
          </form>
        </div>

        <aside className="space-y-6">
          <div className="bg-white border border-rule rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-ink border-b border-rule pb-2 text-sm uppercase tracking-wider">Trạng thái kết nối</h3>
            
            {testResult.tested ? (
              <div className="space-y-4">
                {/* WP Status */}
                <div className="flex items-start gap-3">
                  {testResult.wpOk ? (
                    <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={18} />
                  ) : (
                    <XCircle className="text-rose-500 shrink-0 mt-0.5" size={18} />
                  )}
                  <div>
                    <h4 className="text-xs font-bold text-ink">WordPress REST API Posts (Tin tức)</h4>
                    <p className="text-xs text-mute mt-0.5">
                      {testResult.wpOk ? 'Kết nối thành công. Đã đọc danh sách blog.' : testResult.wpError || 'Không thể kết nối.'}
                    </p>
                  </div>
                </div>

                {/* WooCommerce Status */}
                <div className="flex items-start gap-3">
                  {testResult.wcOk ? (
                    <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={18} />
                  ) : (
                    <XCircle className="text-rose-500 shrink-0 mt-0.5" size={18} />
                  )}
                  <div>
                    <h4 className="text-xs font-bold text-ink">WooCommerce REST API Products (Sản phẩm)</h4>
                    <p className="text-xs text-mute mt-0.5">
                      {testResult.wcOk ? 'Kết nối thành công. Đọc được danh mục hàng hoá.' : testResult.wcError || 'Không thể kết nối.'}
                    </p>
                  </div>
                </div>

                {/* Site Content Status */}
                <div className="flex items-start gap-3">
                  {testResult.scOk ? (
                    <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={18} />
                  ) : (
                    <XCircle className="text-rose-500 shrink-0 mt-0.5" size={18} />
                  )}
                  <div>
                    <h4 className="text-xs font-bold text-ink">Site Content (liora/v1/site-content)</h4>
                    <p className="text-xs text-mute mt-0.5">
                      {testResult.scOk
                        ? 'Kết nối thành công. Endpoint trả JSON override nội dung site.'
                        : testResult.scError || 'Không thể kết nối. Kiểm tra theme đã cập nhật route + CORS.'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-mute text-xs">
                Chưa chạy kiểm thử kết nối API. Tạo thiết lập và click "Kiểm tra kết nối" để xác minh.
              </div>
            )}
          </div>

          <div className="bg-brand-50 border border-brand-200 rounded-xl p-5 space-y-2.5">
            <h4 className="font-bold text-xs uppercase text-brand-700 tracking-wider inline-flex items-center gap-1.5"><Lightbulb size={13} strokeWidth={2} /> Hướng dẫn nhanh</h4>
            <ol className="list-decimal pl-4 text-[11px] text-ink2 space-y-1.5 leading-relaxed">
              <li>Cài đặt WordPress và plugin <strong>WooCommerce</strong>.</li>
              <li>Đi tới <strong>WooCommerce &gt; Cấu hình &gt; Nâng cao &gt; REST API</strong> bấm Tạo Key.</li>
              <li>Chọn quyền hạn là <strong>Chỉ Đọc (Read)</strong> cho Key này để đảm bảo an toàn.</li>
              <li>Cập nhật theme <strong>liora-blog</strong> (file <em>inc/headless.php</em>) để kích hoạt route <code>liora/v1/site-content</code> + CORS. CORS đã được theme tự lo cho route headless &amp; <code>wp/v2/posts</code>.</li>
              <li>Quản lý nội dung override (hero, settings, footer, about...) tại <strong>Bảng điều khiển WP &gt; Tools &gt; Liora Headless</strong> — dán JSON partial vào ô trống.</li>
              <li>Bật thuộc tính <strong>Permalinks</strong> sang tùy chọn đẹp (ví dụ: Post Name) trong cài đặt WordPress của bạn.</li>
            </ol>
          </div>
        </aside>
      </div>
    </AdminLayout>
  );
}
