import * as t from '@babel/types';
import { TEMPLATE_ID, REACT_KEY, LEAF, ENTRY } from '../../constants';
import * as helpers from '../../helpers';

/**
 * 生成属性值模板
 *
 * @param {string} attributeName
 * @param {string} dataPath
 * @param {(t.StringLiteral | t.JSXExpressionContainer)} [value]
 * @returns
 */
function createAttributeValueTemplate(
  attributeName: string,
  dataPath: string,
  value?: t.StringLiteral | t.JSXExpressionContainer
) {
  let template = '';
  // case: 无 value，当做 true 处理
  if (value === null) {
    template = 'true';
  }

  // case: Literal
  // 直接静态化
  if (t.isLiteral(value)) {
    template = value.value;
  }

  // case: JSXExpressionContainer
  if (t.isJSXExpressionContainer(value)) {
    // 同 Literal 处理
    if (t.isLiteral(value.expression)) {
      template = (value.expression as t.StringLiteral).value;
    } else {
      // TODO: 更多情况处理
      // 1. 属性是方法，可以直接用对应方法名做属性值
      // ...其他情况
      template = `{{${dataPath}.props['${attributeName}']}}`;
    }
  }

  // 附加的一些默认属性，没有 value
  if (!value) {
    template = `{{${dataPath}.props['${attributeName}']}}`;
  }

  return `"${template}"`;
}

/**
 * 生成模板中的属性片段
 *
 * @export
 * @param {string} componentType
 * @param {string} dataPath
 * @param {(Array<t.JSXAttribute | t.JSXSpreadAttribute>)} attributes
 * @returns
 */
export function createAttributesTemplate(
  componentType: string,
  dataPath: string,
  attributes: Array<t.JSXAttribute | t.JSXSpreadAttribute>
) {
  const SEPARATOR = '\n  ';
  let template: Array<[string, string]> = [];

  const { hasSpreadAttribute, props } = helpers.getProps(
    attributes,
    componentType
  );

  // case: Spread Attributes
  // 包含了 Spread Attributes 就返回所有属性
  if (hasSpreadAttribute) {
    template = props.map(([prop]) => [
      prop,
      createAttributeValueTemplate(prop, dataPath),
    ]);
  }

  template = props
    // template id 不渲染
    // react "key" 属性 不渲染
    // leaf 属性 不渲染
    // entry 属性 不渲染
    .filter(
      ([prop]) => ![TEMPLATE_ID, REACT_KEY, LEAF, ENTRY].find(k => k === prop)
    )
    .map(([prop, value]) => [
      prop,
      createAttributeValueTemplate(prop, dataPath, value),
    ]);

  return template.map(([prop, value]) => `${prop}=${value}`).join(SEPARATOR);
}
