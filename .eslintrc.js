module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 7,
    sourceType: "module"
  },
  extends: ["eslint:recommended"],
  env: {
    node: true
  },
  rules: {
    "no-var": "off"
  }
};
