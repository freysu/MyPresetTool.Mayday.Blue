const defaultConfig = {
  themeColors: {
    low: [
      { color: 'whi', per: '30%' },
      { color: 'red', per: '70%' },
    ],
    mid: [
      { color: 'yel', per: '20%' },
      { color: 'ora', per: '30%' },
      { color: 'sky', per: '20%' },
      { color: 'red', per: '30%' },
    ],
    high: [
      { color: 'ora', per: '40%' },
      { color: 'red', per: '60%' },
    ],
    accent: [
      { color: 'sky', per: '50%' },
      { color: 'yel', per: '50%' },
    ],
    base: 'red',
  },
  name: '一颗苹果',
  default: true,
  version: 'v1',
};

const mypresets = [
  {
    themeColors: {
      low: [
        { color: 'blu', per: '40%' },
        { color: 'yel', per: '60%' },
      ],
      mid: [
        { color: 'blu', per: '40%' },
        { color: 'yel', per: '60%' },
      ],
      high: [
        { color: 'blu', per: '40%' },
        { color: 'yel', per: '60%' },
      ],
      accent: [
        { color: 'blu', per: '40%' },
        { color: 'yel', per: '60%' },
      ],
      base: 'yel',
    },
    name: '洗衣机',
    version: 'v1',
  },
  {
    themeColors: {
      low: [
        { color: 'red', per: '60%' },
        { color: 'blu', per: '40%' },
      ],
      mid: [
        { color: 'red', per: '60%' },
        { color: 'blu', per: '30%' },
        { color: 'whi', per: '10%' },
      ],
      high: [
        { color: 'red', per: '50%' },
        { color: 'blu', per: '30%' },
        { color: 'whi', per: '20%' },
      ],
      accent: [
        { color: 'red', per: '50%' },
        { color: 'whi', per: '50%' },
      ],
      base: 'red',
    },
    name: '盛夏光年',
    version: 'v1',
  },
  {
    themeColors: {
      low: [
        { color: 'sky', per: '50%' },
        { color: 'blu', per: '50%' },
      ],
      mid: [
        { color: 'red', per: '50%' },
        { color: 'whi', per: '50%' },
      ],
      high: [
        { color: 'yel', per: '40%' },
        { color: 'blu', per: '40%' },
        { color: 'pin', per: '20%' },
      ],
      accent: [
        { color: 'yel', per: '40%' },
        { color: 'whi', per: '40%' },
        { color: 'pin', per: '20%' },
      ],
      base: 'red',
    },
    name: '孙悟空',
    version: 'v1',
  },
  {
    themeColors: {
      low: [
        { color: 'yel', per: '50%' },
        { color: 'blu', per: '50%' },
      ],
      mid: [
        { color: 'yel', per: '30%' },
        { color: 'whi', per: '40%' },
        { color: 'sky', per: '30%' },
      ],
      high: [
        { color: 'yel', per: '50%' },
        { color: 'blu', per: '50%' },
      ],
      accent: [
        { color: 'yel', per: '50%' },
        { color: 'red', per: '50%' },
      ],
      base: 'blu',
    },
    name: '生存以上生活以下',
    version: 'v1',
  },
  {
    themeColors: {
      low: [
        { color: 'blu', per: '50%' },
        { color: 'whi', per: '50%' },
      ],
      mid: [
        { color: 'sky', per: '40%' },
        { color: 'yel', per: '40%' },
        { color: 'whi', per: '20%' },
      ],
      high: [
        { color: 'pin', per: '40%' },
        { color: 'yel', per: '40%' },
        { color: 'whi', per: '20%' },
      ],
      accent: [
        { color: 'blu', per: '50%' },
        { color: 'whi', per: '50%' },
      ],
      base: 'yel',
    },
    name: 'OAOA_5525',
    version: 'v1',
  },
  {
    themeColors: {
      low: [
        { color: 'sky', per: '60%' },
        { color: 'whi', per: '40%' },
      ],
      mid: [
        { color: 'sky', per: '60%' },
        { color: 'whi', per: '30%' },
        { color: 'yel', per: '10%' },
      ],
      high: [
        { color: 'sky', per: '50%' },
        { color: 'whi', per: '30%' },
        { color: 'red', per: '20%' },
      ],
      accent: [
        { color: 'red', per: '50%' },
        { color: 'yel', per: '50%' },
      ],
      base: 'sky',
    },
    name: '爱情万岁（Live）',
    version: 'v2',
  },
  {
    themeColors: {
      low: [
        { color: 'whi', per: '50%' },
        { color: 'yel', per: '50%' },
      ],
      mid: [
        { color: 'ora', per: '40%' },
        { color: 'yel', per: '40%' },
        { color: 'sky', per: '20%' },
      ],
      high: [
        { color: 'red', per: '30%' },
        { color: 'ora', per: '30%' },
        { color: 'pin', per: '40%' },
      ],
      accent: [
        { color: 'yel', per: '30%' },
        { color: 'whi', per: '70%' },
      ],
      base: 'ora',
    },
    name: '宠上天',
    version: 'v3',
  },
  {
    themeColors: {
      low: [
        { color: 'yel', per: '60%' },
        { color: 'whi', per: '40%' },
      ],
      mid: [
        { color: 'yel', per: '50%' },
        { color: 'whi', per: '50%' },
      ],
      high: [
        { color: 'ora', per: '50%' },
        { color: 'whi', per: '50%' },
      ],
      accent: [
        { color: 'yel', per: '40%' },
        { color: 'ora', per: '40%' },
        { color: 'whi', per: '20%' },
      ],
      base: 'yel',
    },
    name: '干啦干啦',
    version: 'v1',
  },
];

mypresets.push(defaultConfig);

export { mypresets };
