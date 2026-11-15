module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/test/web/'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|expo(nent)?|@expo|expo-router|expo-audio|@expo-audio|@unimodules|@testing-library|react-clone-referenced-element|pretty-format|standard-navigation)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: ['**/__tests__/**/*.(test|spec).[jt]s?(x)', '**/?(*.)+(test|spec).[jt]s?(x)'],
};
