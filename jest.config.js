module.exports = {
  roots: ['<rootDir>/src', '<rootDir>/test'],
  transform: {
    '^.+\\.tsx?$': '<rootDir>/jest.ts-transformer.cjs',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  modulePathIgnorePatterns: ['<rootDir>/build/'],
  testEnvironment: 'node',
};
