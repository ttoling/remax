import * as t from '@babel/types';
import { NodePath } from '@babel/traverse';
import * as helpers from './helpers';
import { STUB_BLOCK, TEMPLATE_ID, EXPRESSION_BLOCK, ENTRY } from './constants';
import { RenderNode } from 'remax-types';

function isStubAttribute(attribute: t.JSXAttribute | t.JSXSpreadAttribute) {
  if (t.isJSXSpreadAttribute(attribute)) {
    return false;
  }

  const attrName = attribute.name.name;

  if (attrName === TEMPLATE_ID || attrName === ENTRY) {
    return false;
  }

  // case: Null
  if (attribute.value === null) {
    return true;
  }

  // case: Literal 属性
  if (t.isLiteral(attribute.value)) {
    return true;
  }

  // case: 表达式
  if (t.isJSXExpressionContainer(attribute.value)) {
    // 同 Literal
    if (t.isLiteral(attribute.value.expression)) {
      return true;
    }
  }
}

/**
 * 判断是否是一个可以 stub 的元素
 */
export function isStubElement(renderNode: RenderNode, path: NodePath) {
  const { node, children } = renderNode;

  let isSelfStub = false;

  if (t.isJSXFragment(node)) {
    isSelfStub = true;
  }

  if (t.isJSXElement(node)) {
    const name = (node.openingElement.name as any)?.name;

    if (name === STUB_BLOCK) {
      return true;
    }

    if (name === EXPRESSION_BLOCK) {
      return false;
    }

    if (!helpers.isHostComponentElement(node, path)) {
      return false;
    }

    const attributes = node.openingElement.attributes;
    isSelfStub = attributes.every(isStubAttribute);
  }

  const isChildrenVoid = children.every(c => {
    if (t.isJSXElement(c.node) || t.isJSXFragment(c.node)) {
      return isStubElement(c, path);
    }

    if (t.isJSXText(c.node)) {
      return true;
    }

    if (t.isJSXExpressionContainer(c.node)) {
      if (t.isLiteral(c.node.expression)) {
        return true;
      }
    }

    // case: JSXSpreadChild

    return false;
  });

  return isSelfStub && isChildrenVoid;
}

/**
 * 在生成模板后，将空元素置为 stub element
 * 用于帮助简化 React 生成 虚拟 dom
 */
export function asStubElement(renderNode: RenderNode, path: NodePath) {
  const { node, children } = renderNode;

  children.forEach(c => {
    asStubElement(c, path);
  });

  if (!t.isJSXElement(node)) {
    return;
  }

  if ((node.openingElement.name as any)?.name === STUB_BLOCK) {
    return;
  }

  // 非 host component 不处理
  if (!helpers.isHostComponentElement(node, path)) {
    return false;
  }

  // 删除可以被 stub 的属性
  node.openingElement.attributes = node.openingElement.attributes.filter(
    attr => !isStubAttribute(attr)
  );

  if (isStubElement(renderNode, path)) {
    helpers.replacedWithStubBlock(node, path);
  }
}
