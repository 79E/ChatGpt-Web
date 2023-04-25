module.exports = {
    printWidth: 100, // 最大行长规则通常设置为 100 或 120。
    tabWidth: 2, // 指定每个标签缩进级别的空格数。
    useTabs: false, // 使用制表符而不是空格缩进行。
    semi: false, // true（默认）: 在每条语句的末尾添加一个分号。false：仅在可能导致 ASI 失败的行的开头添加分号。
    singleQuote: true, // 使用单引号而不是双引号
    quoteProps: 'as-needed', // 引用对象中的属性时，仅在需要时在对象属性周围添加引号。
    bracketSpacing: true, // 在对象文字中的括号之间打印空格。
    trailingComma: 'none', // "none":没有尾随逗号。"es5": 在 ES5 中有效的尾随逗号（对象、数组等），TypeScript 中的类型参数中没有尾随逗号。"all"- 尽可能使用尾随逗号。
    bracketSameLine: false, // 将>多行 HTML（HTML、JSX、Vue、Angular）元素放在最后一行的末尾，而不是单独放在下一行（不适用于自闭合元素）。
    jsxSingleQuote: false, // 在 JSX 中使用单引号而不是双引号。
    arrowParens: 'always', // 在唯一的箭头函数参数周围始终包含括号。
    insertPragma: false, // 插入编译指示
    requirePragma: false, // 需要编译指示
    proseWrap: 'never', // 如果散文超过打印宽度，则换行
    htmlWhitespaceSensitivity: 'strict', // 所有标签周围的空格（或缺少空格）被认为是重要的。
    endOfLine: 'lf', // 确保在文本文件中仅使用 ( \n)换行，常见于 Linux 和 macOS 以及 git repos 内部。
    rangeStart: 0, // 格式化文件时，回到包含所选语句的第一行的开头。
};
