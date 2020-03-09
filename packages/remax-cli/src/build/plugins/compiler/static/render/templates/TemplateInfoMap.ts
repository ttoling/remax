import { RenderNode, RawRenderNode } from 'remax-types';

export interface TemplateInfo {
  rootNode: RenderNode;
  rawNode: RawRenderNode;
  template: string;
  id: string;
  module: string;
  isEntry?: boolean;
}

/**
 * 存储 template 信息
 *
 */
export default class TemplateInfoMap {
  public values(module?: string) {
    return this.templates.filter(t => !module || t.module === module);
  }

  public has(id: string) {
    return !!this.templates.find(t => t.id === id);
  }

  public set(
    rootNode: RenderNode,
    id: string,
    module: string,
    template: string,
    rawNode: RawRenderNode,
    isEntry?: boolean
  ) {
    this.templates = this.templates.filter(t => t.id !== id);
    this.templates.push({ rootNode, template, rawNode, module, id, isEntry });
  }

  public remove(module: string) {
    this.templates.filter(t => t.module !== module);
  }

  private templates: TemplateInfo[] = [];
}
