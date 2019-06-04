

export class VNode {
  constructor(tagName, attributes, children) {
    this.tagName = tagName;
    this.attributes = attributes;
    this.children = children;
  }
}

export function createTextNode(value) {
  return new VNode(undefined, undefined, value);
}
