const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for .cjs files (helps with Firebase and other modules)
config.resolver.sourceExts.push('cjs');

// Disable package exports to avoid module resolution issues
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
