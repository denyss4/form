// Metro must not crawl the non-app material that shares this folder (pmdata alone is 1.82 GB).
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

const notApp = [
  'pmdata',
  'form-model',
  'FORM-ML-Kit',
  'FORM-ML-Kit-v2',
  'hiring-agent',
  'Inspirations',
  'Fonts',
  'Components',
  'Skills',
];
const escapeForRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const notAppPattern = new RegExp(
  `^${escapeForRegExp(__dirname)}[\\\\/](${notApp.join('|')})[\\\\/].*`
);

config.resolver.blockList = [].concat(config.resolver.blockList ?? [], notAppPattern);

module.exports = config;
