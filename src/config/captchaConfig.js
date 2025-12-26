// 音效配置 - key 对应 area 的 name
export const vocalConfigs = {
  // 答案提示音效
  luobo: ['/vocals/luobo-1.wav', '/vocals/luobo-2.wav', '/vocals/luobo-3.wav'],
  zhijin: ['/vocals/zhijin-1.wav'],
  // 正确音效
  zhenbang: ['/vocals/zhenbang-1.wav', '/vocals/zhenbang-2.wav', '/vocals/zhenbang-3.wav', '/vocals/zhenbang-4.wav'],
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
      { name: 'luobo', label: '萝卜', x: 10, y: 280, width: 120, height: 120, stateIndex: 1 },
      { name: 'zhijin', label: '纸巾', x: 150, y: 250, width: 120, height: 140, stateIndex: 0 },
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
  images: [
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
  prompt: '请选择所有包含猫的图片',
  headerImage: '/captcha-images/grid-header.svg'
};
