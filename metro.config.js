// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add any additional modules that need to be processed by Metro
config.resolver.extraNodeModules = {
  stream: require.resolve('stream-browserify'),
  'text-encoding': require.resolve('text-encoding'),
};

// Add additional modules to the resolver
config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs', 'cjs'];

module.exports = config;
