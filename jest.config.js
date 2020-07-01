// eslint-disable-next-line prettier/prettier
const {
  pathsToModuleNameMapper
} = require('ts-jest/utils');
// eslint-disable-next-line prettier/prettier
const {
  compilerOptions
} = require('./tsconfig');

module.exports = {
  roots: ['<rootDir>'],
  setupFilesAfterEnv: ['./jest.setup.js', 'jest-webextension-mock'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.scss$': '<rootDir>/config/jest/cssTransform.js',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  preset: 'ts-jest',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
};