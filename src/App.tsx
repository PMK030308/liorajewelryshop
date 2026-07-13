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
import ArticlePage from './pages/ArticlePage';
import ContactPage from './pages/ContactPage';
import SimplePage from './pages/SimplePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccountPage from './pages/AccountPage';
import WishlistPage from './pages/WishlistPage';
import TrackOrderPage from './pages/TrackOrderPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminContent from './pages/admin/AdminContent';
import AdminNews from './pages/admin/AdminNews';
import AdminFrontend from './pages/admin/AdminFrontend';
import WordPressSettings from './pages/admin/WordPressSettings';

function EditableSimplePage({ slug, fallbackTitle, fallbackBody }: { slug: string; fallbackTitle: string; fallbackBody: React.ReactNode }) {
  const { state } = useStore();
  const page = state.siteContent.pages.find(p => p.slug === slug && p.visible);
  return (
    <SimplePage
      title={page?.title || fallbackTitle}
      body={page ? <div dangerouslySetInnerHTML={{ __html: page.content }} /> : fallbackBody}
    />
  );
}

function CmsPageOrNotFound({ route }: { route: string }) {
  const { state } = useStore();
  const slug = route.replace(/^\//, '');
  const page = state.siteContent.pages.find(p => p.slug === slug && p.visible);

  if (page) {
    return (
      <SimplePage
        title={page.title}
        body={<div dangerouslySetInnerHTML={{ __html: page.content }} />}
      />
    );
  }

  return (
    <main className="page container-x py-20 text-center min-h-[50vh]">
      <h1 className="text-2xl font-bold mb-3">Khong tim thay trang</h1>
      <a className="btn-pink" href="#/" onClick={(e) => { e.preventDefault(); window.location.hash = '/'; }}>Ve trang chu</a>
    </main>
  );
}

function renderRoute(route: string): React.ReactNode {
  if (route === '/' || route === '') return <HomePage />;
  if (route === '/shop') return <ShopPage />;
  if (route.startsWith('/product/')) return <ProductPage slug={route.replace('/product/', '')} />;
  if (route === '/checkout' || route === '/cart-view') return <CheckoutPage />;
  if (route === '/about') return <AboutPage />;
  if (route.startsWith('/news/')) return <ArticlePage slug={decodeURIComponent(route.replace('/news/', ''))} />;
  if (route === '/news') return <NewsPage />;
  if (route === '/lien-he') return <ContactPage />;

  if (route === '/login') return <LoginPage />;
  if (route === '/register') return <RegisterPage />;
  if (route === '/account') return <AccountPage />;
  if (route === '/wishlist') return <WishlistPage />;
  if (route === '/track-order') return <TrackOrderPage />;

  if (route === '/admin' || route === '/admin/dashboard') return <AdminDashboard />;
  if (route === '/admin/products') return <AdminProducts />;
  if (route === '/admin/orders') return <AdminOrders />;
  if (route === '/admin/content') return <AdminContent />;
  if (route === '/admin/frontend') return <AdminFrontend />;
  if (route === '/admin/news') return <AdminNews />;
  if (route === '/admin/wordpress') return <WordPressSettings />;

  if (route === '/kiem-dinh') {
    return (
      <EditableSimplePage
        slug="kiem-dinh"
        fallbackTitle="Kiem Dinh"
        fallbackBody={
          <>
            <p>Tat ca nguyen lieu su dung trong san pham Liorajewelry deu duoc kiem dinh chat luong nghiem ngat.</p>
            <p>Moi san pham di kem the bao hanh va phieu kiem dinh de khach hang yen tam su dung.</p>
          </>
        }
      />
    );
  }

  if (route === '/feedback') {
    return (
      <EditableSimplePage
        slug="feedback"
        fallbackTitle="Feedback"
        fallbackBody={
          <>
            <p>Cam on cac khach hang da tin tuong va dong hanh cung Liorajewelry.</p>
            <p>Theo doi fanpage Liorajewelry.shop de xem cac danh gia thuc te tu khach hang.</p>
          </>
        }
      />
    );
  }

  if (route === '/huong-dan') {
    return (
      <EditableSimplePage
        slug="huong-dan"
        fallbackTitle="Huong Dan"
        fallbackBody={
          <>
            <p><strong>Huong dan chon size nhan:</strong> Dung mot soi chi quan quanh ngon tay, do chieu dai doan chi roi doi chieu bang size.</p>
            <p><strong>Huong dan bao quan:</strong> Tranh nuoc hoa, hoa chat; cat trong hop khi khong su dung; lau bang vai mem.</p>
          </>
        }
      />
    );
  }

  return <CmsPageOrNotFound route={route} />;
}

function Router() {
  const { state } = useStore();
  const routeKey = state.route.startsWith('/product/') ? '/product'
    : state.route.startsWith('/news/') ? '/news'
    : state.route;
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
      {!isAdminRoute && <VoucherPopup />}
      <Toast />
      {!isAdminRoute && <FloatButtons />}
      {!isAdminRoute && <MobileBottomNav />}
    </>
  );
}
