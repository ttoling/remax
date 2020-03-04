// 原生模板 ID 属性名称
export const TEMPLATE_ID = '_tid';
// React "Key" 属性名称
export const REACT_KEY = 'key';
// 单节点标记属性 "leaf"
export const LEAF = 'leaf';
// 入口 JSX 标记属性 "entry"
export const ENTRY = 'entry';
// fragment block，原生不存在，用于将 JSXFragment 转换成 JSXElement 统一处理
export const FRAGMENT_BLOCK = 'fragment-block';
// 表达式逻辑标签，原生不存在，仅为 remax 处理表达式所用
export const EXPRESSION_BLOCK = 'expression-block';
// stub 元素标签，原生不存在，remax 用于简化虚拟 dom
export const STUB_BLOCK = 'stub-block';
