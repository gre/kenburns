module.exports = {
  "parser": "babel-eslint",
  "plugins": [
    "flowtype"
  ],
  "env": {
    "browser": true,
    "commonjs": true,
    "es6": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:flowtype/recommended"
  ],
  "parserOptions": {
    "sourceType": "module"
  },
  "settings": {
    "flowtype": {
      "onlyFilesWithFlowAnnotation": false
    }
  },
  "rules": {
    "strict": 0,
    "flowtype/define-flow-type": 1,
    "flowtype/use-flow-type": 1,
    "indent": [
      "error",
      2
    ],
    "no-console": [
      2,
      { "allow": ["warn", "error"] }
    ],
    "quotes": [
      "error",
      "double"
    ],
    "semi": [
      "error",
      "always"
    ]
  }
};
