import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { hasSupabase } from '../lib/supabase';
import { signUp } from '../lib/auth';

export default function RegisterPage() {
  const { state, dispatch, navigate, showToast } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [err, setErr] = useState('');

  React.useEffect(() => {
    if (state.user) navigate(state.user.role === 'admin' ? '/admin/dashboard' : '/account');
  }, [state.user]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    const trimmed = email.trim().toLowerCase();
    if (password.length < 6) { setErr('Mật khẩu cần tối thiểu 6 ký tự.'); return; }
    if (password !== confirm) { setErr('Mật khẩu xác nhận không khớp.'); return; }

    // Backend thật (Supabase Auth)
    if (hasSupabase) {
      try {
        const user = await signUp(name.trim(), trimmed, password, phone.trim() || undefined);
        dispatch({ type: 'LOGIN', payload: user });
        showToast('🎉 Đăng ký thành công!');
        setTimeout(() => navigate('/account'), 200);
      } catch (err) {
        setErr((err as Error).message || 'Đăng ký thất bại.');
      }
      return;
    }

    // Fallback offline (demo localStorage)
    if (state.users.find(u => u.email.toLowerCase() === trimmed)) {
      setErr('Email này đã được đăng ký.');
      return;
    }
    const user = {
      id: 'u-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
      email: trimmed,
      password,
      name: name.trim(),
      phone: phone.trim() || undefined,
      role: 'customer' as const,
      createdAt: Date.now(),
    };
    dispatch({ type: 'REGISTER', payload: user });
    showToast('🎉 Đăng ký thành công!');
    setTimeout(() => navigate('/account'), 200);
  };

  return (
    <main className="page container-x py-12 md:py-20 max-w-md min-h-[70vh]">
      <div className="bg-white border border-rule rounded-lg p-7 md:p-9 shadow-card">
        <div className="text-center mb-7">
          <div className="text-[11px] tracking-widest text-brand-500 font-semibold mb-2">TẠO TÀI KHOẢN</div>
          <h1 className="text-2xl font-bold text-brand-700">Đăng ký</h1>
          <p className="text-sm text-mute mt-1">Gia nhập LIORA để nhận voucher và ưu đãi</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ink2 mb-1.5">Họ tên</label>
            <input required value={name} onChange={e => setName(e.target.value)} placeholder="Nguyễn Văn A"
              className="w-full border border-rule rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink2 mb-1.5">Email</label>
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com"
              className="w-full border border-rule rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink2 mb-1.5">Số điện thoại (tuỳ chọn)</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="0987654321"
              className="w-full border border-rule rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 transition-colors" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-ink2 mb-1.5">Mật khẩu</label>
              <input required type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Tối thiểu 6 ký tự"
                className="w-full border border-rule rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink2 mb-1.5">Xác nhận</label>
              <input required type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Nhập lại"
                className="w-full border border-rule rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 transition-colors" />
            </div>
          </div>

          {err && <div className="text-sm bg-red-50 text-red-600 border border-red-200 px-3 py-2 rounded">{err}</div>}

          <button type="submit" className="w-full bg-brand-700 text-white font-semibold py-3 rounded-md hover:bg-brand-800 transition-colors">
            Tạo tài khoản
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-ink2">
          Đã có tài khoản?{' '}
          <a href="#/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }} className="text-brand-500 hover:text-brand-700 font-semibold">
            Đăng nhập
          </a>
        </div>
      </div>
    </main>
  );
}
