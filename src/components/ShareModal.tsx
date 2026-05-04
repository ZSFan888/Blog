import React, { useId, useRef, useState } from 'react';
import { X, Copy, Check, Link as LinkIcon } from 'lucide-react';
import { SlideModal } from './SlideModal';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen?: () => void;
  onCloseCallback?: () => void;
  title: string;
  excerpt: string;
  url: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ 
  isOpen, 
  onClose, 
  onOpen,
  onCloseCallback,
  title, 
  excerpt, 
  url 
}) => {
  const [copiedType, setCopiedType] = useState<'all' | 'link' | null>(null);
  const [copyError, setCopyError] = useState<string | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const resetTimerRef = useRef<number | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  const clearResetTimer = () => {
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
  };

  const scheduleReset = () => {
    clearResetTimer();
    resetTimerRef.current = window.setTimeout(() => {
      setCopiedType(null);
      setCopyError(null);
    }, 2000);
  };

  React.useEffect(() => {
    if (!isOpen) {
      clearResetTimer();
      setCopiedType(null);
      setCopyError(null);
    }
  }, [isOpen]);

  React.useEffect(() => {
    return () => {
      clearResetTimer();
    };
  }, []);

  const writeToClipboard = async (value: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
      return true;
    }

    const textArea = document.createElement('textarea');
    textArea.value = value;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    let copied = false;
    try {
      copied = document.execCommand('copy');
    } finally {
      document.body.removeChild(textArea);
    }

    return copied;
  };

  const handleCopy = async (type: 'all' | 'link') => {
    const text = type === 'all' ? `标题：${title}\n简介：${excerpt}\n链接：${url}` : url;

    try {
      const copied = await writeToClipboard(text);
      if (!copied) {
        throw new Error('Copy command was rejected');
      }

      setCopiedType(type);
      setCopyError(null);
      scheduleReset();
    } catch (error) {
      console.error('Copy failed:', error);
      setCopiedType(null);
      setCopyError('复制失败，请手动复制链接。');
      scheduleReset();
    }
  };

  return (
    <SlideModal
      isOpen={isOpen}
      onClose={onClose}
      onOpen={onOpen}
      onCloseCallback={onCloseCallback}
      initialFocusRef={closeButtonRef}
      ariaLabelledby={titleId}
      className="mobile:border-t-0"
    >
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-xl border border-zinc-200 bg-white p-2 text-zinc-400 transition-all hover:border-zinc-300 hover:text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:text-zinc-300"
          aria-label="关闭分享弹窗"
        >
          <X size={18} />
        </button>

        <div className="relative pr-12">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Share</p>
          <h3 id={titleId} className="text-xl font-serif font-bold text-zinc-900 dark:text-zinc-100 sm:text-2xl">分享文章</h3>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">复制完整分享文案，或者只带走这篇文章的链接。</p>
        </div>

        <div className="relative mt-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
            <LinkIcon size={12} />
            当前文章
          </div>
          <h4 className="mb-2 line-clamp-2 text-base font-bold leading-7 text-zinc-900 dark:text-zinc-100">{title}</h4>
          <p id={descriptionId} className="mb-4 line-clamp-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{excerpt}</p>
          <div className="break-all rounded-2xl border border-dashed border-zinc-300 bg-white p-3 text-sm font-mono leading-6 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">{url}</div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            onClick={() => handleCopy('all')}
            className="flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            aria-label="复制标题、简介和链接"
          >
            {copiedType === 'all' ? <Check size={16} /> : <Copy size={16} />}
            {copiedType === 'all' ? '已复制全部' : '复制完整分享'}
          </button>
          <button
            onClick={() => handleCopy('link')}
            className="flex items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white py-3 text-sm font-bold text-zinc-900 transition-all hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
            aria-label="仅复制文章链接"
          >
            {copiedType === 'link' ? <Check size={16} /> : <LinkIcon size={16} />}
            {copiedType === 'link' ? '链接已复制' : '仅复制链接'}
          </button>
        </div>

        <p className="mt-4 text-xs text-zinc-600 dark:text-zinc-400" aria-live="polite">
          {copyError ?? (copiedType ? '复制成功。' : '可复制完整分享文案或单独链接。')}
        </p>
      </div>
    </SlideModal>
  );
};
