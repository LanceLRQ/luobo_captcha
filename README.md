# 萝卜纸巾验证码

萝卜？纸巾？包包？米老鼠！

## 功能特点

你现在是一只喵，你的前面有萝卜、纸巾、米老鼠，你需要学会分辨它们。



纯整活，不是真正的验证码功能工具，不要在真实项目里使用。纯AI生成，不含一点人工（不是，至少切图是人工）

灵感和素材来源：Bilibili UP主 [@超级无敌大开门](https://space.bilibili.com/3493132916230432)

![预览图](./public/thumb.jpg)


## 技术栈

- **Next.js 16** - React 框架
- **React 19** - UI 库
- **Tailwind CSS 4** - 样式框架
- **Howler.js** - 音频播放库

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000 查看效果。

### 构建生产版本

```bash
npm run build
npm start
```

## 项目结构

```
├── public/
│   ├── captcha-images/        # 验证码图片资源
│   │   ├── kaimen/            # 点击验证码图片组
│   │   │   ├── group_1/       # 第1组图片
│   │   │   ├── group_2/       # 第2组图片
│   │   │   └── ...
│   │   └── btns/              # 九宫格按钮图片
│   └── vocals/                # 语音音效文件
│       ├── luobo-*.wav        # 萝卜提示音
│       ├── zhijin-*.wav       # 纸巾提示音
│       ├── baobao-*.wav       # 包包提示音
│       ├── milaoshu-*.wav     # 米老鼠提示音
│       ├── zhenbang-*.wav     # 正确音效
│       └── *-btn.wav          # 按钮点击音效
├── src/
│   ├── app/
│   │   ├── page.js            # 主页面
│   │   ├── layout.js          # 布局组件
│   │   └── globals.css        # 全局样式
│   ├── components/
│   │   └── captcha/
│   │       ├── ClickCaptcha.jsx   # 点击位置验证码组件
│   │       └── GridCaptcha.jsx    # 九宫格验证码组件
│   └── config/
│       └── captchaConfig.js   # 验证码配置文件
```

## 配置说明

### 点击验证码配置 (`clickCaptchaConfigs`)

```javascript
{
  id: 'kaimen_group_1',           // 配置唯一标识
  basePath: '/captcha-images/kaimen/group_1',  // 图片基础路径
  images: {
    default: '0.jpg',             // 默认图片
    states: ['1.jpg', '2.jpg']    // 各区域对应的状态图片
  },
  areas: [                        // 可点击区域配置
    {
      name: 'zhijin',             // 区域名称（对应语音配置）
      label: '纸巾',              // 显示文案
      x: 150, y: 250,             // 区域位置
      width: 120, height: 140,    // 区域大小
      stateIndex: 0               // 对应的状态图片索引
    },
    // ...
  ],
  promptTemplate: '{target}',     // 提示文案模板
  imageSize: 400,                 // 图片尺寸
  debug: false                    // 调试模式（显示点击区域）
}
```

### 九宫格验证码配置 (`gridCaptchaConfig`)

```javascript
{
  items: [                        // 物品配置
    {
      name: 'luobo',              // 物品名称（对应语音配置）
      label: '萝卜',              // 显示文案
      variants: [                 // 展示形式
        {
          type: 'button',         // 双状态按钮
          images: {
            up: '/captcha-images/btns/luobo-up.jpg',
            down: '/captcha-images/btns/luobo-down.jpg'
          }
        },
        {
          type: 'image',          // 纯图片
          image: '/captcha-images/btns/luobo-pic.jpg'
        }
      ]
    },
    // ...
  ],
  promptTemplate: '{target}',     // 提示文案模板
}
```

### 语音配置 (`vocalConfigs`)

```javascript
{
  // 答案提示音效（每个物品多个语音文件，随机播放）
  luobo: ['/vocals/luobo-1.wav', '/vocals/luobo-2.wav', ...],
  zhijin: ['/vocals/zhijin-1.wav', '/vocals/zhijin-2.wav', ...],
  // ...

  // 正确音效
  zhenbang: ['/vocals/zhenbang-1.wav', '/vocals/zhenbang-2.wav', ...],
}
```

## 添加新的验证码图片组

1. 在 `public/captcha-images/kaimen/` 下创建新的图片组目录
2. 准备图片：
   - `0.jpg` - 默认状态图片
   - `1.jpg`, `2.jpg`, ... - 各区域被点击时的状态图片
3. 在 `src/config/captchaConfig.js` 的 `clickCaptchaConfigs` 数组中添加新配置
4. 如需添加新的语音，在 `public/vocals/` 中添加音频文件，并更新 `vocalConfigs`

## License

WTFPL
