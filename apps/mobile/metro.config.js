const path = require('path')
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const projectRoot = __dirname
const monorepoRoot = path.resolve(__dirname, '../..')

const config = {
  // Ensure Metro can resolve hoisted deps when using npm/yarn workspaces
  watchFolders: [monorepoRoot],
  resolver: {
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(monorepoRoot, 'node_modules'),
    ],
    // Some helpers like @babel/runtime can be hoisted. Provide an explicit alias.
    extraNodeModules: {
      '@babel/runtime': path.resolve(
        monorepoRoot,
        'node_modules',
        '@babel',
        'runtime'
      ),
    },
  },
}

module.exports = mergeConfig(getDefaultConfig(projectRoot), config)
