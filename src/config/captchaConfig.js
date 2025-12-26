// 音效配置 - key 对应 area 的 name
export const vocalConfigs = {
  // 答案提示音效
  baobao: ['/vocals/baobao-1.wav', '/vocals/baobao-2.wav', '/vocals/baobao-3.wav'],
  luobo: ['/vocals/luobo-1.wav', '/vocals/luobo-2.wav', '/vocals/luobo-3.wav', '/vocals/luobo-4.wav', '/vocals/luobo-5.wav'],
  zhijin: ['/vocals/zhijin-1.wav', '/vocals/zhijin-2.wav', '/vocals/zhijin-3.wav', '/vocals/zhijin-4.wav', '/vocals/zhijin-5.wav'],
  milaoshu: ['/vocals/milaoshu-1.wav', '/vocals/milaoshu-2.wav', '/vocals/milaoshu-3.wav', '/vocals/milaoshu-4.wav', '/vocals/milaoshu-5.wav'],
  // 正确音效
  zhenbang: ['/vocals/zhenbang-1.wav', '/vocals/zhenbang-2.wav', '/vocals/zhenbang-3.wav', '/vocals/zhenbang-4.wav', '/vocals/zhenbang-5.wav', '/vocals/zhenbang-6.wav'],
};

// 点击验证码配置列表 - 每次随机取一个
export const clickCaptchaConfigs = [
  {
    id: 'kaimen_group_1',
    basePath: '/captcha-images/kaimen/group_1',
    images: {
      default: '0.jpg',
      states: ['1.jpg', '2.jpg']
    },
    areas: [
      { name: 'zhijin', label: '纸巾', x: 150, y: 250, width: 120, height: 140, stateIndex: 0 },
      { name: 'luobo', label: '萝卜', x: 10, y: 280, width: 120, height: 120, stateIndex: 1 },
    ],
    promptTemplate: '{target}',
    imageSize: 400,
    debug: false
  }, 
  {
    id: 'kaimen_group_2',
    basePath: '/captcha-images/kaimen/group_2',
    images: {
      default: '0.jpg',
      states: ['1.jpg', '2.jpg']
    },
    areas: [
      { name: 'zhijin', label: '纸巾', x: 280, y: 250, width: 120, height: 140, stateIndex: 0 },
      { name: 'luobo', label: '萝卜', x: 140, y: 280, width: 80, height: 120, stateIndex: 1 },
    ],
    promptTemplate: '{target}',
    imageSize: 400,
    debug: false
  },
  {
    id: 'kaimen_group_3',
    basePath: '/captcha-images/kaimen/group_3',
    images: {
      default: '0.jpg',
      states: ['1.jpg', '2.jpg']
    },
    areas: [
      { name: 'zhijin', label: '纸巾', x: 10, y: 260, width: 140, height: 130, stateIndex: 0 },
      { name: 'baobao', label: '包包', x: 180, y: 260, width: 220, height: 120, stateIndex: 1 },
    ],
    promptTemplate: '{target}',
    imageSize: 400,
    debug: false
  },
  {
    id: 'kaimen_group_4',
    basePath: '/captcha-images/kaimen/group_4',
    images: {
      default: '0.jpg',
      states: ['1.jpg', '2.jpg', '3.jpg']
    },
    areas: [
      { name: 'luobo', label: '萝卜', x: 150, y: 300, width: 80, height: 100, stateIndex: 0 },
      { name: 'zhijin', label: '纸巾', x: 10, y: 270, width: 140, height: 130, stateIndex: 1 },
      { name: 'milaoshu', label: '米老鼠', x: 240, y: 280, width: 150, height: 120, stateIndex: 2 },
    ],
    promptTemplate: '{target}',
    imageSize: 400,
    debug: false
  },
  // 可以继续添加更多配置
  // {
  //   id: 'kaimen_group_2',
  //   basePath: '/captcha-images/kaimen/group_2',
  //   ...
  // },
];

// 九宫格验证码配置
export const gridCaptchaConfig = {
  // 4种物品，每种可能有多种展示形式
  items: [
    {
      name: 'luobo',
      label: '萝卜',
      variants: [
        { type: 'button', images: { up: '/captcha-images/btns/luobo-up.jpg', down: '/captcha-images/btns/luobo-down.jpg' } },
        { type: 'image', image: '/captcha-images/btns/luobo-pic.jpg' }
      ]
    },
    {
      name: 'zhijin',
      label: '纸巾',
      variants: [
        { type: 'button', images: { up: '/captcha-images/btns/zhijin-up.jpg', down: '/captcha-images/btns/zhijin-down.jpg' } },
        { type: 'image', image: '/captcha-images/btns/zhijin-pic.jpg' }
      ]
    },
    {
      name: 'milaoshu',
      label: '米老鼠',
      variants: [
        { type: 'button', images: { up: '/captcha-images/btns/milaoshu-up.jpg', down: '/captcha-images/btns/milaoshu-down.jpg' } },
        { type: 'image', image: '/captcha-images/btns/milaoshu-pic.jpg' }
      ]
    },
    {
      name: 'baobao',
      label: '包包',
      variants: [
        { type: 'image', image: '/captcha-images/btns/baobao-pic.jpg' }
      ]
    },
  ],
  promptTemplate: '{target}',
};
