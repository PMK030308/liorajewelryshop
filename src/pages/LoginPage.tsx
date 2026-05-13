import React, { useState } from 'react';
import { useStore } from '../store/useStore';

export default function LoginPage() {
  const { state, dispatch, navigate, showToast } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState<string>('');

  // Already logged in → redirect
  React.useEffect(() => {
    if (state.user) {
      navigate(state.user.role === 'admin' ? '/admin/dashboard' : '/account');
    }
  }, [state.user]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    const trimmed = email.trim().toLowerCase();
    const found = state.users.find(u => u.email.toLowerCase() === trimmed);
    if (!found) {
      setErr('Email không tồn tại trong hệ thống.');
      return;
    }
    if (found.password !== password) {
      setErr('Mật khẩu không đúng.');
      return;
    }
    dispatch({ type: 'LOGIN', payload: found });
    showToast(`👋 Xin chào ${found.name}!`);
    setTimeout(() => navigate(found.role === 'admin' ? '/admin/dashboard' : '/account'), 200);
  };

  return (
    <main className="page container-x py-12 md:py-20 max-w-md min-h-[70vh]">
      <div className="bg-white border border-rule rounded-lg p-7 md:p-9 shadow-card">
        <div className="text-center mb-7">
          <div className="text-[11px] tracking-widest text-brand-500 font-semibold mb-2">CHÀO MỪNG TRỞ LẠI</div>
          <h1 className="text-2xl font-bold text-brand-700">Đăng nhập</h1>
          <p className="text-sm text-mute mt-1">Đăng nhập để theo dõi đơn hàng và nhận ưu đãi</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ink2 mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full border border-rule rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink2 mb-1.5">Mật khẩu</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-rule rounded-md px-4 py-2.5 pr-12 text-sm focus:outline-none focus:border-brand-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-[11px] text-mute hover:text-brand-500"
              >
                {showPw ? 'Ẩn' : 'Hiện'}
              </button>
            </div>
          </div>

          {err && (
            <div className="text-sm bg-red-50 text-red-600 border border-red-200 px-3 py-2 rounded">{err}</div>
          )}

          <button type="submit" className="w-full bg-brand-700 text-white font-semibold py-3 rounded-md hover:bg-brand-800 transition-colors">
            Đăng nhập
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-ink2">
          Chưa có tài khoản?{' '}
          <a
            href="#/register"
            onClick={(e) => { e.preventDefault(); navigate('/register'); }}
            className="text-brand-500 hover:text-brand-700 font-semibold"
          >
            Đăng ký ngay
          </a>
        </div>

        <div className="border-t border-rule mt-7 pt-5">
          <div className="text-[11px] text-mute uppercase tracking-wider text-center mb-2">Tài khoản demo</div>
          <div className="text-xs text-ink2 text-center leading-relaxed">
            <div><b>Admin:</b> admin@liora.com / admin123</div>
            <div className="text-mute mt-1">Hoặc đăng ký tài khoản khách hàng mới</div>
          </div>
        </div>
      </div>
    </main>
  );
}
