'use client';

import { useState, useCallback } from 'react';
import ClickCaptcha from '@/components/captcha/ClickCaptcha';
import GridCaptcha from '@/components/captcha/GridCaptcha';
import { clickCaptchaConfigs, gridCaptchaConfig } from '@/config/captchaConfig';

export default function Home() {
  const [showClickCaptcha, setShowClickCaptcha] = useState(false);
  const [showGridCaptcha, setShowGridCaptcha] = useState(false);
  const [clickResult, setClickResult] = useState(null);
  const [gridResult, setGridResult] = useState(null);
  const [currentClickConfig, setCurrentClickConfig] = useState(null);
  const [gridCaptchaKey, setGridCaptchaKey] = useState(0);

  const handleClickSuccess = useCallback(() => {
    setClickResult('success');
    setTimeout(() => setShowClickCaptcha(false), 800);
  }, []);

  const handleClickFailure = useCallback(() => {
    setClickResult('failure');
    setTimeout(() => {
      setClickResult(null);
      setShowClickCaptcha(false);
    }, 1500);
  }, []);

  const handleGridSuccess = useCallback(() => {
    setGridResult('success');
    setTimeout(() => setShowGridCaptcha(false), 800);
  }, []);

  const handleGridFailure = useCallback(() => {
    setGridResult('failure');
    setTimeout(() => {
      setGridResult(null);
      setShowGridCaptcha(false);
    }, 1500);
  }, []);

  const resetClickCaptcha = useCallback(() => {
    // 随机选择一个配置
    const randomIndex = Math.floor(Math.random() * clickCaptchaConfigs.length);
    setCurrentClickConfig(clickCaptchaConfigs[randomIndex]);
    setClickResult(null);
    setShowClickCaptcha(true);
  }, []);

  const resetGridCaptcha = useCallback(() => {
    setGridResult(null);
    setGridCaptchaKey(prev => prev + 1);
    setShowGridCaptcha(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            萝卜纸巾验证码
          </h1>
          <img
          src="/captcha-images/kaimen.jpg"
          alt="萝卜纸巾验证码"
          className="h-25 mt-3 rounded m-auto"
          draggable={false}
        />
        </div>

        {/* 两种验证码演示区域 */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* 点击位置验证码 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              模式一
            </h2>

            {/* 状态显示 */}
            {clickResult && (
              <div className={`mb-4 p-3 rounded-lg text-center ${
                clickResult === 'success'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {clickResult === 'success' ? '验证成功喵!' : '验证失败喵~'}
              </div>
            )}

            {/* reCAPTCHA 风格的触发器 */}
            <div
              className="border-2 border-gray-200 rounded-lg p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={resetClickCaptcha}
            >
              <div className={`w-8 h-8 border-2 rounded flex items-center justify-center transition-colors ${
                clickResult === 'success'
                  ? 'border-green-500 bg-green-500'
                  : 'border-gray-300 hover:border-gray-400'
              }`}>
                {clickResult === 'success' && (
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                )}
              </div>
              <span className="text-gray-700">喵？</span>
              <div className="ml-auto flex flex-col items-center">
                <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span className="text-xs text-gray-400">喵喵喵</span>
              </div>
            </div>
          </div>

          {/* 九宫格验证码 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              模式二
            </h2>

            {/* 状态显示 */}
            {gridResult && (
              <div className={`mb-4 p-3 rounded-lg text-center ${
                gridResult === 'success'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {gridResult === 'success' ? '验证成功喵!' : '验证失败喵~'}
              </div>
            )}

            {/* reCAPTCHA 风格的触发器 */}
            <div
              className="border-2 border-gray-200 rounded-lg p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={resetGridCaptcha}
            >
              <div className={`w-8 h-8 border-2 rounded flex items-center justify-center transition-colors ${
                gridResult === 'success'
                  ? 'border-green-500 bg-green-500'
                  : 'border-gray-300 hover:border-gray-400'
              }`}>
                {gridResult === 'success' && (
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                )}
              </div>
              <span className="text-gray-700">喵喵？</span>
              <div className="ml-auto flex flex-col items-center">
                <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/>
                </svg>
                <span className="text-xs text-gray-400">喵喵喵</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 点击验证码弹窗 */}
      {showClickCaptcha && currentClickConfig && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <ClickCaptcha
            key={currentClickConfig.id}
            config={currentClickConfig}
            onSuccess={handleClickSuccess}
            onFailure={handleClickFailure}
            onClose={() => setShowClickCaptcha(false)}
          />
        </div>
      )}

      {/* 九宫格验证码弹窗 */}
      {showGridCaptcha && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <GridCaptcha
            key={gridCaptchaKey}
            config={gridCaptchaConfig}
            onSuccess={handleGridSuccess}
            onFailure={handleGridFailure}
            onClose={() => setShowGridCaptcha(false)}
          />
        </div>
      )}
    </div>
  );
}
