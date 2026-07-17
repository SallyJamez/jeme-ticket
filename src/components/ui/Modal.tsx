"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl border border-ink-200 bg-white p-5 shadow-pop animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-sm font-semibold text-ink-900">{title}</h3>
          <button onClick={onClose} className="focus-ring rounded-lg p-1 text-ink-400 hover:bg-ink-100">
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
