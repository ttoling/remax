import VNode from './VNode';

export const TEMPLATE_ID = '_tid';
const rawRenderNodes = __REMAX_RAW_RENDER_NODES__;

export function getRawRenderNode(node: VNode) {
  return rawRenderNodes.find(t => t.id === node.props?.[TEMPLATE_ID])?.rawNode;
}

export function equal(node: VNode, rawRenderNode: any, shallow?: boolean) {
  if (!rawRenderNode) {
    return false;
  }

  // 判断元素类型是否一致
  if (rawRenderNode.type !== node.type) {
    return false;
  }

  // 判断属性是否是 rawRenderNode 的子集
  for (const prop in node.props || {}) {
    if (!rawRenderNode.props.find((p: string) => p === prop)) {
      return false;
    }
  }

  if (!shallow) {
    // shallow 比较 children
    for (const index in node.children) {
      const child = node.children[index];
      if (!equal(child, rawRenderNode.children[index], true)) {
        return false;
      }
    }
  }

  return true;
}
