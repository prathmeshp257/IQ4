module.exports = {
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss)$':
      '<rootDir>/node_modules/jest-css-modules-transform',
  },
  modulePaths: ['<rootDir>'],
  moduleDirectories: ['node_modules'],
  testPathIgnorePatterns: ['/node_modules/', '/jspm_packages'],
  unmockedModulePathPatterns: ['./node_modules/react'],
};
