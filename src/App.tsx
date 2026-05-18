import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from './store/useStore';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import VoucherPopup from './components/VoucherPopup';
import Toast from './components/Toast';
import FloatButtons from './components/FloatButtons';
import MobileBottomNav from './components/MobileBottomNav';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import CheckoutPage from './pages/CheckoutPage';
import AboutPage from './pages/AboutPage';
import NewsPage from './pages/NewsPage';
import ContactPage from './pages/ContactPage';
import SimplePage from './pages/SimplePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccountPage from './pages/AccountPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';

function renderRoute(route: string): React.ReactNode {
  if (route === '/' || route === '') return <HomePage />;
  if (route === '/shop') return <ShopPage />;
  if (route.startsWith('/product/')) return <ProductPage slug={route.replace('/product/', '')} />;
  if (route === '/checkout' || route === '/cart-view') return <CheckoutPage />;
  if (route === '/about') return <AboutPage />;
  if (route === '/news') return <NewsPage />;
  if (route === '/lien-he') return <ContactPage />;

  // ---- Auth ----
  if (route === '/login') return <LoginPage />;
  if (route === '/register') return <RegisterPage />;
  if (route === '/account') return <AccountPage />;

  // ---- Admin ----
  if (route === '/admin' || route === '/admin/dashboard') return <AdminDashboard />;
  if (route === '/admin/products') return <AdminProducts />;
  if (route === '/admin/orders') return <AdminOrders />;

  if (route === '/kiem-dinh') return (
    <SimplePage
      title="Kiểm Định"
      body={
        <>
          <p>Tất cả các sản phẩm kim cương Moissanite của Liorajewelry đều được kiểm định bởi GRA (Gemological Research Association) — đảm bảo chất lượng, độ trong và độ lấp lánh tương đương kim cương thật.</p>
          <p>Mỗi sản phẩm đi kèm thẻ kiểm định và bảo hành để khách hàng yên tâm sử dụng.</p>
        </>
      }
    />
  );
  if (route === '/feedback') return (
    <SimplePage
      title="Feedback"
      body={
        <>
          <p>Cảm ơn các khách hàng đã tin tưởng và đồng hành cùng Liorajewelry. Mỗi feedback là động lực để chúng mình hoàn thiện hơn mỗi ngày 💖</p>
          <p>Theo dõi fanpage Liorajewelry.shop để xem các đánh giá thực tế từ khách hàng.</p>
        </>
      }
    />
  );
  if (route === '/huong-dan') return (
    <SimplePage
      title="Hướng Dẫn"
      body={
        <>
          <p><strong>Hướng dẫn chọn size nhẫn:</strong> Dùng một sợi chỉ quấn quanh ngón tay, đo chiều dài đoạn chỉ rồi đối chiếu bảng size.</p>
          <p><strong>Hướng dẫn bảo quản:</strong> Tránh nước hoa, hoá chất; cất trong hộp khi không sử dụng; lau bằng vải mềm.</p>
          <p><strong>Hướng dẫn đặt hàng:</strong> Chọn sản phẩm → Thêm vào giỏ → Thanh toán → Nhận hàng và kiểm tra trước khi trả tiền (COD).</p>
        </>
      }
    />
  );

  return (
    <main className="page container-x py-20 text-center min-h-[50vh]">
      <h1 className="text-2xl font-bold mb-3">Không tìm thấy trang</h1>
      <a className="btn-pink" href="#/" onClick={(e) => { e.preventDefault(); window.location.hash = '/'; }}>← Về trang chủ</a>
    </main>
  );
}

function Router() {
  const { state } = useStore();
  const routeKey = state.route.startsWith('/product/') ? '/product' : state.route;
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={routeKey}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.25, ease: [0.2, 0.6, 0.2, 1] }}
      >
        {renderRoute(state.route)}
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const { state } = useStore();
  const isAdminRoute = state.route.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Header />}
      <div className={!isAdminRoute ? 'pb-16 lg:pb-0' : ''}>
        <Router />
      </div>
      {!isAdminRoute && <Footer />}

      {/* Global overlays */}
      <CartDrawer />
      <VoucherPopup />
      <Toast />
      {!isAdminRoute && <FloatButtons />}
      {!isAdminRoute && <MobileBottomNav />}
    </>
  );
}
