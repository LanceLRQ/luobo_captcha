'use client';

import { useState, useCallback, useMemo } from 'react';

/**
 * 九宫格验证码组件
 * 用户需要从9张图片中选择符合条件的图片
 */
export default function GridCaptcha({
  onSuccess,
  onFailure,
  onClose,
  config = {}
}) {
  const {
    images = [
      { id: 1, url: '/captcha-images/grid/cat1.svg', isTarget: true },
      { id: 2, url: '/captcha-images/grid/dog1.svg', isTarget: false },
      { id: 3, url: '/captcha-images/grid/cat2.svg', isTarget: true },
      { id: 4, url: '/captcha-images/grid/bird1.svg', isTarget: false },
      { id: 5, url: '/captcha-images/grid/dog2.svg', isTarget: false },
      { id: 6, url: '/captcha-images/grid/cat3.svg', isTarget: true },
      { id: 7, url: '/captcha-images/grid/bird2.svg', isTarget: false },
      { id: 8, url: '/captcha-images/grid/fish1.svg', isTarget: false },
      { id: 9, url: '/captcha-images/grid/dog3.svg', isTarget: false },
    ],
    prompt = '请选择所有包含猫的图片',
    headerImage = '/captcha-images/grid-header.svg'
  } = config;

  const [selectedIds, setSelectedIds] = useState(new Set());
  const [status, setStatus] = useState('pending'); // pending, success, failure
  const [isVerifying, setIsVerifying] = useState(false);

  // 计算正确答案
  const correctIds = useMemo(() => {
    return new Set(images.filter(img => img.isTarget).map(img => img.id));
  }, [images]);

  const handleImageClick = useCallback((id) => {
    if (status !== 'pending' || isVerifying) return;

    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, [status, isVerifying]);

  const handleVerify = useCallback(() => {
    if (selectedIds.size === 0) return;

    setIsVerifying(true);

    // 模拟验证延迟
    setTimeout(() => {
      // 检查选中的是否与正确答案完全匹配
      const isCorrect =
        selectedIds.size === correctIds.size &&
        [...selectedIds].every(id => correctIds.has(id));

      if (isCorrect) {
        setStatus('success');
        setTimeout(() => onSuccess?.(), 500);
      } else {
        setStatus('failure');
        setTimeout(() => {
          onFailure?.();
        }, 1000);
      }
      setIsVerifying(false);
    }, 800);
  }, [selectedIds, correctIds, onSuccess, onFailure]);

  const handleRefresh = useCallback(() => {
    setSelectedIds(new Set());
    setStatus('pending');
    setIsVerifying(false);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden w-[350px]">
      {/* 头部带图片 */}
      <div className="relative">
        <div className="bg-[#4285f4] text-white px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-80">请选择所有符合条件的图片</span>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
          <p className="text-xl font-bold">{prompt}</p>
          <p className="text-sm opacity-80 mt-1">
            如果没有符合条件的图片，请点击跳过
          </p>
        </div>
        {/* 头部示例图片 */}
        {headerImage && (
          <div className="bg-[#4285f4] px-4 pb-3">
            <img
              src={headerImage}
              alt="示例"
              className="w-full h-24 object-cover rounded"
            />
          </div>
        )}
      </div>

      {/* 九宫格区域 */}
      <div className="p-1 bg-white relative">
        <div className="grid grid-cols-3 gap-1">
          {images.map((image) => {
            const isSelected = selectedIds.has(image.id);
            return (
              <div
                key={image.id}
                className={`
                  relative aspect-square cursor-pointer overflow-hidden
                  transition-all duration-200
                  ${isSelected ? 'ring-4 ring-[#4285f4] ring-inset' : 'hover:opacity-80'}
                `}
                onClick={() => handleImageClick(image.id)}
              >
                <img
                  src={image.url}
                  alt={`选项 ${image.id}`}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                {/* 选中标记 */}
                {isSelected && (
                  <div className="absolute top-1 left-1 w-6 h-6 bg-[#4285f4] rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 验证中遮罩 */}
        {isVerifying && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* 成功/失败状态 */}
        {status === 'success' && (
          <div className="absolute inset-0 bg-green-500/90 flex items-center justify-center">
            <div className="text-white text-center">
              <svg className="w-16 h-16 mx-auto" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <p className="mt-2 font-medium">验证成功</p>
            </div>
          </div>
        )}

        {status === 'failure' && (
          <div className="absolute inset-0 bg-red-500/90 flex items-center justify-center">
            <div className="text-white text-center">
              <svg className="w-16 h-16 mx-auto" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
              </svg>
              <p className="mt-2 font-medium">验证失败，请重试</p>
            </div>
          </div>
        )}
      </div>

      {/* 底部操作栏 */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors"
            title="刷新"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
            </svg>
          </button>
          <button
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors"
            title="帮助"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
            </svg>
          </button>
        </div>

        <button
          onClick={handleVerify}
          disabled={status !== 'pending' || isVerifying}
          className={`
            px-6 py-2 rounded font-medium text-white transition-colors
            ${selectedIds.size === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-[#4285f4] hover:bg-[#3367d6] cursor-pointer'
            }
          `}
        >
          {selectedIds.size === 0 ? '跳过' : '验证'}
        </button>
      </div>
    </div>
  );
}
