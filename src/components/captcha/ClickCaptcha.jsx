'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { Howl } from 'howler';
import { vocalConfigs } from '@/config/captchaConfig';

// 当前播放的音效实例
let currentSound = null;
let playTimer = null;

// 预加载缓存
const preloadedSounds = {};

// 预加载音效
const preloadVocals = () => {
  Object.entries(vocalConfigs).forEach(([key, vocals]) => {
    if (!preloadedSounds[key]) {
      preloadedSounds[key] = vocals.map(src => new Howl({
        src: [src],
        preload: true,
        volume: 1.0,
      }));
    }
  });
};

// 检查是否正在播放
const isPlaying = () => {
  return currentSound && currentSound.playing();
};

// 停止当前音效和定时器
const stopCurrentSound = () => {
  if (playTimer) {
    clearTimeout(playTimer);
    playTimer = null;
  }
  if (currentSound) {
    currentSound.stop();
    currentSound = null;
  }
};

// 随机播放音效（带1秒延迟）
// force: true 强制播放（会停止之前的），false 不打断当前播放
// delay: 延迟时间（毫秒）
const playRandomVocal = (key, force = true, delay = 1000) => {
  const cachedSounds = preloadedSounds[key];
  const vocals = vocalConfigs[key];
  if ((!cachedSounds || cachedSounds.length === 0) && (!vocals || vocals.length === 0)) {
    return null;
  }

  // 如果不强制且正在播放或等待播放，则不播放
  if (!force && (isPlaying() || playTimer)) {
    return currentSound;
  }

  // 停止之前的音效和定时器
  stopCurrentSound();

  const randomIndex = Math.floor(Math.random() * (cachedSounds?.length || vocals.length));

  // 延迟播放
  playTimer = setTimeout(() => {
    playTimer = null;
    // 优先使用预加载的音效
    if (cachedSounds && cachedSounds[randomIndex]) {
      currentSound = cachedSounds[randomIndex];
      currentSound.play();
    } else {
      currentSound = new Howl({
        src: [vocals[randomIndex]],
        volume: 1.0,
      });
      currentSound.play();
    }
  }, delay);

  return true;
};

/**
 * 点击位置验证码组件
 * 用户需要点击正确的区域来完成验证
 */
export default function ClickCaptcha({
  onSuccess,
  onFailure,
  onClose,
  config = {}
}) {
  const {
    basePath = '/captcha-images/kaimen/group_1',
    images = {
      default: '0.jpg',
      states: ['1.jpg', '2.jpg']
    },
    areas = [
      { name: 'luobo', label: '萝卜', x: 10, y: 280, width: 120, height: 120, stateIndex: 1 },
      { name: 'zhijin', label: '纸巾', x: 150, y: 250, width: 120, height: 140, stateIndex: 0 }
    ],
    promptTemplate = '{target}',
    imageSize = 400,
    debug = false
  } = config;

  // 随机选择一个正确答案（组件挂载时确定）
  const correctArea = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * areas.length);
    return areas[randomIndex];
  }, [areas]);

  // 根据模板生成提示文案
  const prompt = useMemo(() => {
    return promptTemplate.replace('{target}', correctArea.label);
  }, [promptTemplate, correctArea]);

  const [currentImage, setCurrentImage] = useState(`${basePath}/${images.default}`);
  const [activeArea, setActiveArea] = useState(null);
  const [status, setStatus] = useState('pending'); // pending, success
  const [isVerifying, setIsVerifying] = useState(false);
  const containerRef = useRef(null);
  const isHoldingRef = useRef(false);

  // 组件挂载时预加载音效并播放正确答案的提示音效（无延迟），卸载时停止
  useEffect(() => {
    preloadVocals();
    playRandomVocal(correctArea.name, true, 0);
    return () => {
      stopCurrentSound();
    };
  }, [correctArea.name]);

  // 获取点击位置对应的区域
  const getAreaAtPosition = useCallback((x, y) => {
    for (const area of areas) {
      if (
        x >= area.x &&
        x <= area.x + area.width &&
        y >= area.y &&
        y <= area.y + area.height
      ) {
        return area;
      }
    }
    return null;
  }, [areas]);

  // 计算缩放后的坐标
  const getScaledPosition = useCallback((clientX, clientY) => {
    if (!containerRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const scale = imageSize / rect.width;
    return {
      x: x * scale,
      y: y * scale
    };
  }, [imageSize]);

  // 鼠标/触摸按下
  const handlePointerDown = useCallback((e) => {
    if (status !== 'pending' || isVerifying) return;

    e.preventDefault();
    isHoldingRef.current = true;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const pos = getScaledPosition(clientX, clientY);

    if (pos) {
      const area = getAreaAtPosition(pos.x, pos.y);
      if (area) {
        setActiveArea(area);
        setCurrentImage(`${basePath}/${images.states[area.stateIndex]}`);
      }
    }
  }, [status, isVerifying, getScaledPosition, getAreaAtPosition, basePath, images.states]);

  // 鼠标/触摸抬起 - 验证
  const handlePointerUp = useCallback((e) => {
    if (!isHoldingRef.current || status !== 'pending' || isVerifying) return;

    isHoldingRef.current = false;

    // 如果有激活的区域，进行验证
    if (activeArea) {
      // 检查是否点击了正确的区域
      if (activeArea.name === correctArea.name) {
        // 正确：保持当前图片不变，播放正确音效（无延迟），显示成功状态
        setIsVerifying(true);
        playRandomVocal('zhenbang', true, 0);
        setTimeout(() => {
          setStatus('success');
          setIsVerifying(false);
          setTimeout(() => onSuccess?.(), 500);
        }, 300);
      } else {
        // 错误：恢复默认图片，重新播放提示音效（不打断当前播放，0.5-1秒随机延迟），允许重试
        setCurrentImage(`${basePath}/${images.default}`);
        setActiveArea(null);
        const randomDelay = 500 + Math.random() * 500; // 0.5-1秒随机
        playRandomVocal(correctArea.name, false, randomDelay);
      }
    } else {
      setActiveArea(null);
    }
  }, [status, isVerifying, activeArea, correctArea, basePath, images.default, onSuccess]);

  // 鼠标离开区域
  const handlePointerLeave = useCallback(() => {
    if (isHoldingRef.current && status === 'pending') {
      // 如果是按住状态离开，保持当前图片不变
    }
  }, [status]);

  // 鼠标/触摸取消
  const handlePointerCancel = useCallback(() => {
    isHoldingRef.current = false;
    setCurrentImage(`${basePath}/${images.default}`);
    setActiveArea(null);
  }, [basePath, images.default]);

  // 刷新
  const handleRefresh = useCallback(() => {
    setCurrentImage(`${basePath}/${images.default}`);
    setActiveArea(null);
    setStatus('pending');
    setIsVerifying(false);
    isHoldingRef.current = false;
  }, [basePath, images.default]);

  // 添加全局事件监听（处理鼠标在按住状态下移出组件的情况）
  useEffect(() => {
    const handleGlobalPointerUp = () => {
      if (isHoldingRef.current && status === 'pending') {
        isHoldingRef.current = false;
        setCurrentImage(`${basePath}/${images.default}`);
        setActiveArea(null);
      }
    };

    window.addEventListener('mouseup', handleGlobalPointerUp);
    window.addEventListener('touchend', handleGlobalPointerUp);

    return () => {
      window.removeEventListener('mouseup', handleGlobalPointerUp);
      window.removeEventListener('touchend', handleGlobalPointerUp);
    };
  }, [basePath, images.default, status]);

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden w-[400px]">
      {/* 头部 */}
      <div className="bg-[#4285f4] text-white px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span className="font-medium">图形验证码</span>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* 提示信息 */}
      <div className="px-4 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-center gap-3">
        <p className="text-gray-800 text-2xl font-bold">{prompt}</p>
        <button
          onClick={() => playRandomVocal(correctArea.name, true, 0)}
          className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
          title="重听"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          </svg>
        </button>
      </div>

      {/* 图片区域 */}
      <div className="relative">
        <div
          ref={containerRef}
          className="relative cursor-pointer select-none touch-none"
          onMouseDown={handlePointerDown}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerLeave}
          onTouchStart={handlePointerDown}
          onTouchEnd={handlePointerUp}
          onTouchCancel={handlePointerCancel}
        >
          <img
            src={currentImage}
            alt="验证码图片"
            className="w-full h-auto block"
            draggable={false}
          />

          {/* 调试模式：显示点击区域 */}
          {debug && (
            <>
              {areas.map((area, index) => {
                const containerWidth = containerRef.current?.offsetWidth || imageSize;
                const scale = containerWidth / imageSize;
                const isCorrect = area.name === correctArea.name;
                return (
                  <div
                    key={index}
                    className="absolute border-2 border-dashed pointer-events-none"
                    style={{
                      left: area.x * scale,
                      top: area.y * scale,
                      width: area.width * scale,
                      height: area.height * scale,
                      borderColor: isCorrect ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.5)',
                      backgroundColor: isCorrect ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.1)',
                    }}
                  >
                    <span className="absolute top-0 left-0 text-xs bg-black/50 text-white px-1">
                      {area.label} {isCorrect ? '(正确)' : ''}
                    </span>
                  </div>
                );
              })}
            </>
          )}

          {/* 验证中遮罩 */}
          {isVerifying && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* 成功状态 */}
          {status === 'success' && (
            <div className="absolute inset-0 bg-green-500/80 flex items-center justify-center">
              <div className="text-white text-center">
                <svg className="w-16 h-16 mx-auto" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <p className="mt-2 font-medium">真棒</p>
              </div>
            </div>
          )}

        </div>
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
        <div className="text-xs text-gray-400">
          点击验证
        </div>
      </div>
    </div>
  );
}
