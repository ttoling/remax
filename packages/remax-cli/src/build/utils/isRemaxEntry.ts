import { parse } from 'acorn';

export default function isRemaxEntry(code: string) {
  const ast: any = parse(code, {
    sourceType: 'module',
  });

  return ast.body.every((node: any) => {
    // 检查是不是原生写法
    if (
      node.type === 'ExpressionStatement' &&
      node.expression.type === 'CallExpression' &&
      node.expression.callee.type === 'Identifier' &&
      node.expression.callee.name === 'Page' &&
      node.expression.arguments.length > 0 &&
      node.expression.arguments[0].type === 'ObjectExpression'
    ) {
      return false;
    }

    if (
      node.type === 'ExpressionStatement' &&
      node.expression.type === 'CallExpression' &&
      node.expression.callee.type === 'Identifier' &&
      node.expression.callee.name === 'Component' &&
      node.expression.arguments.length > 0 &&
      node.expression.arguments[0].type === 'ObjectExpression'
    ) {
      return false;
    }

    return true;
  });
}
