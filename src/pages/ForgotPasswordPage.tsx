import React, { useState } from 'react';
import { Mail, KeyRound, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useStore } from '../store/useStore';
import { hasSupabase } from '../lib/supabase';

export default function ForgotPasswordPage() {
  const { navigate, showToast } = useStore();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    const trimmed = email.trim().toLowerCase();

    if (hasSupabase) {
      try {
        const { supabase } = await import('../lib/supabase');
        if (!supabase) throw new Error('Supabase chưa cấu hình');
        const { error } = await supabase.auth.resetPasswordForEmail(trimmed, {
          redirectTo: `${window.location.origin}${window.location.pathname}#/quen-mat-khau`,
        });
        if (error) throw error;
        setSent(true);
        showToast('✓ Đã gửi link đặt lại mật khẩu qua email');
      } catch (error) {
        setErr((error as Error).message || 'Không thể gửi email. Thử lại sau.');
      } finally {
        setLoading(false);
      }
    } else {
      // Offline demo — chỉ giả lập
      setTimeout(() => {
        setSent(true);
        setLoading(false);
        showToast('✓ (Demo) Đã gửi link đặt lại mật khẩu');
      }, 800);
    }
  };

  return (
    <main className="page container-x py-12 md:py-20 max-w-md min-h-[70vh]">
      <div className="bg-white border border-rule rounded-lg p-7 md:p-9 shadow-card">
        <button
          onClick={() => navigate('/login')}
          className="inline-flex items-center gap-1.5 text-xs text-mute hover:text-brand-500 mb-4"
        >
          <ArrowLeft size={14} strokeWidth={2} /> Quay lại đăng nhập
        </button>

        <div className="text-center mb-7">
          <div className="w-14 h-14 mx-auto rounded-full bg-brand-50 text-brand-700 flex items-center justify-center mb-3">
            <KeyRound size={26} strokeWidth={1.8} />
          </div>
          <h1 className="text-2xl font-bold text-brand-700">Quên mật khẩu?</h1>
          <p className="text-sm text-mute mt-1">
            Nhập email đăng ký, chúng tôi sẽ gửi link đặt lại mật khẩu
          </p>
        </div>

        {sent ? (
          <div className="text-center py-4">
            <CheckCircle2 size={48} strokeWidth={1.4} className="mx-auto text-green-600 mb-4" />
            <h2 className="font-bold text-lg mb-2 text-ink">Đã gửi email!</h2>
            <p className="text-sm text-ink2 mb-6 leading-relaxed">
              Vui lòng kiểm tra hộp thư <b>{email}</b> (kể cả mục Spam) và bấm vào link để đặt lại mật khẩu.
              Link có hiệu lực trong 1 giờ.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="bg-brand-700 hover:bg-brand-800 text-white font-semibold px-6 py-3 rounded-md text-sm transition-colors w-full"
            >
              Về trang đăng nhập
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ink2 mb-1.5">Email đăng ký</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full border border-rule rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>

            {err && (
              <div className="text-sm bg-red-50 text-red-600 border border-red-200 px-3 py-2 rounded">{err}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-700 text-white font-semibold py-3 rounded-md hover:bg-brand-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Đang gửi...
                </>
              ) : (
                <>
                  <Mail size={16} strokeWidth={2} />
                  Gửi link đặt lại
                </>
              )}
            </button>
          </form>
        )}

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
      </div>
    </main>
  );
}