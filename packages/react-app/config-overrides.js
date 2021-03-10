/* config-overrides.js */

const path = require('path')
const { useBabelRc, override, useEslintRc } = require('customize-cra')

module.exports = override(useBabelRc())
