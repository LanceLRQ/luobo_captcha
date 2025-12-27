'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { Howl } from 'howler';
import { vocalConfigs } from '@/config/captchaConfig';

// 当前播放的音效实例
let currentSound = null;
let playTimer = null;

// 预加载缓存
const preloadedSounds = {};
const preloadedClickSounds = {};

// 预加载点击音效
const preloadClickSound = (name) => {
  const src = `/vocals/${name}-btn.wav`;
  if (!preloadedClickSounds[name]) {
    preloadedClickSounds[name] = new Howl({
      src: [src],
      preload: true,
      volume: 1.0,
    });
  }
};

// 播放点击音效（不打断提示音效）
const playClickSound = (name) => {
  const cached = preloadedClickSounds[name];
  if (cached) {
    cached.play();
  } else {
    const sound = new Howl({
      src: [`/vocals/${name}-btn.wav`],
      volume: 1.0,
    });
    sound.play();
  }
};

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

// 随机播放音效
const playRandomVocal = (key) => {
  const cachedSounds = preloadedSounds[key];
  const vocals = vocalConfigs[key];
  if ((!cachedSounds || cachedSounds.length === 0) && (!vocals || vocals.length === 0)) {
    return null;
  }

  stopCurrentSound();

  const randomIndex = Math.floor(Math.random() * (cachedSounds?.length || vocals.length));

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

  return true;
};

/**
 * 九宫格验证码组件
 */
export default function GridCaptcha({
  onSuccess,
  onFailure,
  onClose,
  config = {}
}) {
  const {
    items = [],
    promptTemplate = '{target}',
  } = config;

  // 生成随机答案的函数
  const generateRandomData = () => {
    if (items.length === 0) return { correctItem: null, gridItems: [] };

    const randomIndex = Math.floor(Math.random() * items.length);
    const correctItem = items[randomIndex];

    const gridItems = Array.from({ length: 9 }, (_, index) => {
      const randomItemIndex = Math.floor(Math.random() * items.length);
      const item = items[randomItemIndex];
      const randomVariantIndex = Math.floor(Math.random() * item.variants.length);
      const variant = item.variants[randomVariantIndex];
      return {
        id: index,
        name: item.name,
        label: item.label,
        ...variant,
      };
    });

    return { correctItem, gridItems };
  };

  // 使用 useState 存储随机值，惰性初始化确保同步
  const [captchaData, setCaptchaData] = useState(() => generateRandomData());
  const { correctItem, gridItems } = captchaData;

  // 根据模板生成提示文案
  const prompt = useMemo(() => {
    if (!correctItem) return '';
    return promptTemplate.replace('{target}', correctItem.label);
  }, [promptTemplate, correctItem]);

  // 计算所有正确答案的索引（按name匹配）
  const correctIndices = useMemo(() => {
    if (!correctItem) return new Set();
    return new Set(gridItems.filter(item => item.name === correctItem.name).map(item => item.id));
  }, [gridItems, correctItem]);

  const [selectedIds, setSelectedIds] = useState(new Set());
  const [pressedId, setPressedId] = useState(null);
  const [status, setStatus] = useState('pending'); // pending, success
  const [isVerifying, setIsVerifying] = useState(false);

  // 预加载音效并播放提示
  useEffect(() => {
    preloadVocals();
    // 预加载点击音效（只预加载有 button 类型的物品）
    ['luobo', 'zhijin', 'milaoshu'].forEach(name => preloadClickSound(name));
    if (correctItem) {
      playRandomVocal(correctItem.name);
    }
    return () => {
      stopCurrentSound();
    };
  }, [correctItem]);

  const handleImageMouseDown = useCallback((id, item) => {
    if (status !== 'pending' || isVerifying) return;
    // 如果是取消操作（已选中），不切换图片也不播放音效
    if (selectedIds.has(id)) return;
    setPressedId(id);
    // 如果是 button 类型，播放点击音效
    if (item.type === 'button') {
      playClickSound(item.name);
    }
  }, [status, isVerifying, selectedIds]);

  const handleImageMouseUp = useCallback((id) => {
    if (status !== 'pending' || isVerifying) return;
    setPressedId(null);

    // 切换选中状态
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

  const handleImageMouseLeave = useCallback(() => {
    setPressedId(null);
  }, []);

  const handleVerify = useCallback(() => {
    setIsVerifying(true);

    setTimeout(() => {
      // 检查选中的是否与正确答案完全匹配
      const isCorrect =
        selectedIds.size === correctIndices.size &&
        [...selectedIds].every(id => correctIndices.has(id));

      if (isCorrect) {
        setStatus('success');
        playRandomVocal('zhenbang');
        setTimeout(() => onSuccess?.(), 500);
      } else {
        // 失败后重置选择，播放答案语音提示
        setSelectedIds(new Set());
        if (correctItem) {
          playRandomVocal(correctItem.name);
        }
      }
      setIsVerifying(false);
    }, 300);
  }, [selectedIds, correctIndices, correctItem, onSuccess]);

  const handleRefresh = useCallback(() => {
    const newData = generateRandomData();
    setCaptchaData(newData);
    setSelectedIds(new Set());
    setStatus('pending');
    setIsVerifying(false);
    // 播放新答案的提示音
    if (newData.correctItem) {
      playRandomVocal(newData.correctItem.name);
    }
  }, [items]);

  // 获取格子显示的图片
  const getItemImage = (item, isPressed) => {
    if (item.type === 'button') {
      return isPressed ? item.images.down : item.images.up;
    }
    return item.image;
  };

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden w-[350px]">
      {/* 头部 */}
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
        <div className="flex items-center gap-2">
          <p className="text-2xl font-bold">{prompt}</p>
          <button
            onClick={() => correctItem && playRandomVocal(correctItem.name)}
            className="p-1 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors"
            title="重听"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* 九宫格区域 */}
      <div className="p-1 bg-white relative">
        <div className="grid grid-cols-3 gap-1">
          {gridItems.map((item) => {
            const isSelected = selectedIds.has(item.id);
            const isPressed = pressedId === item.id;
            return (
              <div
                key={item.id}
                className={`
                  relative aspect-square cursor-pointer overflow-hidden
                  transition-all duration-200
                  ${isSelected ? 'ring-4 ring-[#4285f4] ring-inset' : 'hover:opacity-80'}
                `}
                onMouseDown={() => handleImageMouseDown(item.id, item)}
                onMouseUp={() => handleImageMouseUp(item.id)}
                onMouseLeave={handleImageMouseLeave}
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleImageMouseDown(item.id, item);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  handleImageMouseUp(item.id);
                }}
              >
                <img
                  src={getItemImage(item, isPressed)}
                  alt={`选项 ${item.id + 1}`}
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

        {/* 成功状态 */}
        {status === 'success' && (
          <div className="absolute inset-0 bg-green-500/90 flex items-center justify-center">
            <div className="text-white text-center">
              <svg className="w-16 h-16 mx-auto" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <p className="mt-2 font-medium">真棒</p>
            </div>
          </div>
        )}
      </div>

      {/* 底部操作栏 */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
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
          onClick={handleVerify}
          disabled={status !== 'pending' || isVerifying}
          className="px-6 py-2 rounded font-medium text-white transition-colors bg-[#4285f4] hover:bg-[#3367d6] cursor-pointer"
        >
          确认
        </button>
      </div>
    </div>
  );
}
