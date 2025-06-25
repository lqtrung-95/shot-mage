module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        '@babel/plugin-transform-runtime',
        {
          corejs: 3,
          helpers: true,
          regenerator: true,
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
