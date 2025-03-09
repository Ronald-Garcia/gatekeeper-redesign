/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.[tj]sx?$": ["ts-jest", 
    {
      globals: {
        'ts-jest': {
            useESM: true, 
            tsconfig: {
              target: "ESNext",
              module: "ESNext",
              moduleResolution: "node",
              esModuleInterop: true,
              skipLibCheck: true,
              strict: true,
            },
        }
    },
    }]
  },
moduleNameMapper: {
    '(.+)\\.js': '$1'
},
extensionsToTreatAsEsm: ['.ts']
};

