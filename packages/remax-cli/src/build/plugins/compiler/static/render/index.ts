import * as t from '@babel/types';
import { NodePath } from '@babel/traverse';
import { TEMPLATE_ID, ENTRY } from '../constants';
import { createTemplate, templateInfoSet } from '../render/templates';
import { JSXNode, RenderNode } from '../types';
import * as helpers from '../helpers';

/**
 * 是否该记录这个 JSX 片段，用于生成模板
 *
 * @param {NodePath} path
 * @returns
 */
function shouldBeTemplate(path: NodePath<t.JSXElement | t.JSXFragment>) {
  const parent = path.parent;

  // case:
  // 记录根节点
  // 父节点不为 JSXElement 或 JSXFragment，说明 path 为根节点
  if (!t.isJSXElement(parent) && !t.isJSXFragment(parent)) {
    return true;
  }

  // TODO: path 本身是一个 React 组件 或者 原生组件，也应该记录下来，
  // 可以将它的 children 静态化成模板做优化

  return false;
}

/**
 * 判断是否是入口 JSX 片段
 *
 * @param {t.JSXElement} node
 * @returns
 */
function isEntryPath(node: t.JSXElement | t.JSXFragment) {
  if (t.isJSXFragment(node)) {
    return false;
  }

  return !!node.openingElement.attributes.find(
    attr => t.isJSXAttribute(attr) && attr.name.name === ENTRY
  );
}

let id = 0;

function generateID() {
  id += 1;
  return id.toString();
}

/**
 * 标记 template id
 * 在 react 虚拟 dom 上记录 template id，就可以在渲染时找到虚拟节点对应的模板
 *
 * @param {t.JSXOpeningElement} element
 * @returns
 */
function markTemplateID(element: t.JSXOpeningElement): string {
  let templateID = helpers.getTemplateID(element);

  if (!templateID) {
    templateID = generateID();
    element.attributes.push(
      t.jsxAttribute(t.jsxIdentifier(TEMPLATE_ID), t.stringLiteral(templateID))
    );
  }

  return templateID;
}

/**
 * 整理 JSXNodes，主要目的是消化 JSXFragment，得到正确的 Node 结构
 *
 * @param {JSXNode} node
 * @returns {RenderNode[]}
 */
function sortNodes(node: JSXNode): RenderNode[] {
  if (t.isJSXFragment(node)) {
    return node.children.reduce<RenderNode[]>(
      (prev, current) => prev.concat(sortNodes(current)),
      []
    );
  }

  if (t.isJSXElement(node)) {
    return [
      {
        node,
        children: node.children.reduce<RenderNode[]>(
          (prev, current) => prev.concat(sortNodes(current)),
          []
        ),
      },
    ];
  }

  // case JSXText
  // case JSXExpressionContainer
  // case JSXSpreadChild

  return [
    {
      node,
      children: [],
    },
  ];
}

/**
 * 将 JSX 片段保存起来，用于生成静态化的原生模板
 *
 * @export
 * @returns
 */
export default function render() {
  return {
    pre(state: any) {
      templateInfoSet.remove(state.opts.filename);
    },
    visitor: {
      JSXElement: (path: NodePath<t.JSXElement>, state: any) => {
        if (!shouldBeTemplate(path)) {
          return;
        }

        const nodes = sortNodes(path.node);

        nodes.forEach((node, index) => {
          const module = state.filename;
          const templateID = markTemplateID(path.node.openingElement);
          const template = createTemplate(node, path, module, ['node']);

          templateInfoSet.add(
            templateID,
            template,
            module,
            isEntryPath(path.node)
          );
        });
      },
      JSXFragment: (path: NodePath<t.JSXFragment>, state: any) => {
        if (!shouldBeTemplate(path)) {
          return;
        }

        const nodes = sortNodes(path.node);

        nodes.forEach((node, index) => {
          // case: JSXExpressionContainer 已经都被包裹在 expression-block 里面，entry 中不会有
          // case: JSXFragment 已经被 sortNodes 方法处理掉了，不会出现
          // case: JSXText TODO: 由于 JSXText 无法记录 template id，这里先不处理
          // case: JSXSpreadChild 未知使用场景
          if (!t.isJSXElement(node.node)) {
            return;
          }

          const module = state.filename;
          const templateID = markTemplateID(node.node.openingElement);
          const template = createTemplate(node, path, module, ['node']);

          templateInfoSet.add(
            templateID,
            template,
            module,
            isEntryPath(path.node)
          );
        });
      },
    },
  };
}
