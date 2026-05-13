import React from 'react';
import { useStore } from '../store/useStore';

interface Props {
  title: string;
  body: React.ReactNode;
}

export default function SimplePage({ title, body }: Props) {
  const { navigate } = useStore();
  return (
    <main className="page container-x py-10">
      <div className="text-xs text-mute mb-4">
        <a href="#/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="hover:text-brand-500">Trang chủ</a> / {title}
      </div>
      <h1 className="text-3xl md:text-4xl font-bold mb-6">{title}</h1>
      <div className="prose max-w-3xl text-ink2 leading-relaxed space-y-4">{body}</div>
    </main>
  );
}
