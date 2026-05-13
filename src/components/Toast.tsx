import React from 'react';
import { useStore } from '../store/useStore';

export default function Toast() {
  const { state } = useStore();
  return (
    <div
      id="toast"
      className={`toast ${state.toast ? 'show' : ''}`}
      role="status"
      aria-live="polite"
    >
      {state.toast}
    </div>
  );
}
