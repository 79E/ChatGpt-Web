module.exports = {
    'env': {
        'browser': true,
        'es2021': true,
        'node': true,
        'es6': true
    },
    'overrides': [],
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        'ecmaVersion': 'latest',
        'sourceType': 'module',
        'ecmaFeatures': { // 表示你想使用的额外的语言特性
          'jsx': true // 启用 JSX
        }
    },
    'extends':  [
      'eslint:recommended',
      'prettier',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'plugin:@typescript-eslint/recommended',
    ],
    'plugins': [
      'prettier',
      'react',
      'react-hooks',
      '@typescript-eslint'
    ],
    'rules': {
      // eslint 的配置
      'quotes': ['ERROR', 'single'], //单引号
      'no-console': ['error', { 'allow': ['log'] }],// 允许使用 console.log()
      'no-confusing-arrow': 0, // 禁止在可能与比较操作符相混淆的地方使用箭头函数
      // eslint-plugin-react 的配置
      'react/prop-types': 0,
      // eslint-plugin-react-hooks 的配置
      'react-hooks/rules-of-hooks' : 'error',
      'react-hooks/exhaustive-deps' : 'warn',
      'no-useless-escape': 'warn',
      'react/react-in-jsx-scope': 0,
      'prefer-const': 'error',
      'no-constant-condition': 'warn',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-is-mounted.md
      'react/no-is-mounted': 'warn',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-pascal-case.md
      'react/jsx-pascal-case': [
        'error', {
          allowAllCaps: false,
          allowNamespace: true,
          allowLeadingUnderscore: true,
          ignore: [],
        },
      ],

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/display-name.md
      'react/display-name': 'warn',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/forbid-component-props.md
      'react/forbid-component-props': [0, { forbid: ['className', 'style', 'id'] }],

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-closing-bracket-location.md
      'react/jsx-closing-bracket-location': ['error', 'line-aligned'],

      // https://eslint.org/docs/latest/rules/jsx-quotes
      'jsx-quotes': ['error', 'prefer-double'],

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-tag-spacing.md
      'react/jsx-tag-spacing': [
        'error', {
          closingSlash: 'never',
          beforeSelfClosing: 'always',
          afterOpening: 'never',
          beforeClosing: 'never',
        },
      ],

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-curly-spacing.md
      'react/jsx-curly-spacing': ['warn', { when: 'never' }],

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-array-index-key.md
      'react/no-array-index-key': 'error',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/require-default-props.md
      'react/require-default-props': [
        'error', {
          forbidDefaultForRequired: false,
          ignoreFunctionalComponents: true,
        },
      ],

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-this-in-sfc.md
      'react/no-this-in-sfc': 'error',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-boolean-value.md
      'react/jsx-boolean-value': ['warn', 'never'],

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-string-refs.md
      'react/no-string-refs': ['error', { noTemplateLiterals: true }],

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-wrap-multilines.md
      'react/jsx-wrap-multilines': [
        'warn', {
          declaration: 'parens-new-line',
          assignment: 'parens-new-line',
          return: 'parens-new-line',
          arrow: 'parens-new-line',
          condition: 'parens-new-line',
          logical: 'parens-new-line',
          prop: 'parens-new-line',
        },
      ],

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/self-closing-comp.md
      'react/self-closing-comp': [
        'error', {
          component: true,
          html: true,
        },
      ],

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-closing-tag-location.md
      'react/jsx-closing-tag-location': 'error',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-bind.md
      'react/jsx-no-bind': [
        'warn', {
          ignoreRefs: true,
          allowArrowFunctions: true,
          allowFunctions: false,
          allowBind: false,
          ignoreDOMComponents: true,
        },
      ],

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/require-render-return.md
      'react/require-render-return': 'error',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/sort-comp.md
      'react/sort-comp': [
        'warn', {
          order: [
            'static-variables',
            'static-methods',
            'instance-variables',
            'lifecycle',
            '/^handle.+$/',
            '/^on.+$/',
            'getters',
            'setters',
            '/^(get|set)(?!(InitialState$|DefaultProps$|ChildContext$)).+$/',
            'instance-methods',
            'everything-else',
            'rendering',
          ],
          groups: {
            lifecycle: [
              'displayName',
              'propTypes',
              'contextTypes',
              'childContextTypes',
              'mixins',
              'statics',
              'defaultProps',
              'constructor',
              'getDefaultProps',
              'getInitialState',
              'state',
              'getChildContext',
              'getDerivedStateFromProps',
              'componentWillMount',
              'UNSAFE_componentWillMount',
              'componentDidMount',
              'componentWillReceiveProps',
              'UNSAFE_componentWillReceiveProps',
              'shouldComponentUpdate',
              'componentWillUpdate',
              'UNSAFE_componentWillUpdate',
              'getSnapshotBeforeUpdate',
              'componentDidUpdate',
              'componentDidCatch',
              'componentWillUnmount',
            ],
            rendering: [
              '/^render.+$/',
              'render',
            ],
          },
        },
      ],
  }
}
