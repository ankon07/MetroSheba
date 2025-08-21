module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Remove the old react-native-reanimated/plugin
      // 'react-native-reanimated/plugin', // Remove this line
      
      // For now, we'll use the app without the reanimated plugin
      // If you need reanimated, install react-native-worklets and use:
      // 'react-native-worklets/plugin',
    ],
  };
};