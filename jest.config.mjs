import nextJest from 'next/jest.js'
 
const createJestConfig = nextJest({
  dir: './',
})
 
const config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  // Afegim aquesta línia per a que Jest pugui resoldre els imports amb la dracera '@'
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  
}
 
export default createJestConfig(config)