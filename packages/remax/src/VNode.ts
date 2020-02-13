import { TYPE_TEXT } from './constants';
import Container from './Container';

export interface RawNode {
  id?: number;
  type: string;
  props?: any;
  children?: RawNode[];
  text?: string;
}

export type Path = Array<string | number>;

export default class VNode {
  id: number;
  container: Container;
  headChild: VNode | null = null;
  next: VNode | null = null;
  lastChild: VNode | null = null;
  childrenSize = 0;
  mounted = false;
  type: string;
  props?: any;
  parent: VNode | null = null;
  text?: string;

  constructor({
    id,
    type,
    props,
    container,
  }: {
    id: number;
    type: string;
    props?: any;
    container: any;
  }) {
    this.id = id;
    this.container = container;
    this.type = type;
    this.props = props;
  }

  findChild(child: VNode | null) {
    let current = this.headChild;
    while (current !== null) {
      if (current.id === child?.id) {
        return current;
      }
      current = current.next;
    }
    return null;
  }

  findChildIndex(child: VNode) {
    let current = this.headChild;
    let index = 0;
    while (current !== null) {
      if (current.id === child.id) {
        return index;
      }
      current = current.next;
      index += 1;
    }
    return -1;
  }

  appendChild(node: VNode, immediately: boolean) {
    node.parent = this;
    node.next = null;
    node.prev = null;

    if (this.findChild(node)) {
      this.removeChild(node, immediately);
    }

    if (!this.headChild) {
      this.headChild = node;
    } else {
      node.prev = this.lastChild;
      this.lastChild!.next = node;
    }
    this.lastChild = node;
    this.childrenSize += 1;

    if (this.isMounted()) {
      this.container.requestUpdate(
        [...this.path(), 'children'],
        this.childrenSize - 1,
        0,
        immediately,
        node.toJSON()
      );
    }
  }

  removeChild(node: VNode, immediately: boolean) {
    const index = this.findChildIndex(node);
    if (node.prev) {
      node.prev.next = node.next;
      this.headChild = node.prev;
      if (this.lastChild?.id === node.id) {
        this.lastChild = node.prev;
      }
    } else {
      this.headChild = node.next;
      if (this.lastChild?.id === node.id) {
        this.lastChild = null;
      }
    }
    if (node.next) {
      node.next.prev = node.prev;
    }
    this.childrenSize -= 1;
    if (this.isMounted()) {
      this.container.requestUpdate(
        [...this.path(), 'children'],
        index,
        1,
        immediately
      );
    }
  }

  insertBefore(newNode: VNode, referenceNode: VNode, immediately: boolean) {
    newNode.parent = this;

    if (this.findChild(newNode)) {
      this.removeChild(newNode, immediately);
    }

    const index = this.findChildIndex(referenceNode);

    if (referenceNode.prev) {
      referenceNode.prev.next = newNode;
    } else {
      this.headChild = newNode;
    }
    newNode.next = referenceNode;
    referenceNode.prev = newNode;
    this.childrenSize += 1;

    if (this.isMounted()) {
      this.container.requestUpdate(
        [...this.path(), 'children'],
        index,
        0,
        immediately,
        newNode.toJSON()
      );
    }
  }

  update() {
    // root 不会更新，所以肯定有 parent
    this.container.requestUpdate(
      [...this.parent!.path(), 'children'],
      this.parent!.findChildIndex(this),
      1,
      false,
      this.toJSON()
    );
  }

  path(): Path {
    if (!this.parent) {
      return ['root'];
    }
    return [
      ...this.parent.path(),
      'children',
      this.parent.findChildIndex(this),
    ];
  }

  isMounted(): boolean {
    return this.parent ? this.parent.isMounted() : this.mounted;
  }

  toJSON(): RawNode {
    if (this.type === TYPE_TEXT) {
      return {
        type: this.type,
        text: this.text,
      };
    }
    const children = [];
    let current = this.headChild;
    while (current !== null) {
      children.push(current.toJSON());
      current = current.next;
    }

    return {
      id: this.id,
      type: this.type,
      props: this.props,
      children: children,
      text: this.text,
    };
  }
}
