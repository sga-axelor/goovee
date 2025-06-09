import {
  ElementNode,
  SerializedElementNode,
  Spread,
  DOMConversionMap,
  DOMExportOutput,
  $applyNodeReplacement,
  LexicalNode,
} from 'lexical';

export type AlertType = 'info' | 'warning' | 'error' | 'urgent';

export type SerializedAlertNode = Spread<
  {
    type: 'alert';
    alertType: AlertType;
    version: 1;
  },
  SerializedElementNode
>;

export class AlertNode extends ElementNode {
  __alertType: AlertType;

  static getType(): string {
    return 'alert';
  }

  static clone(node: AlertNode): AlertNode {
    return new AlertNode(node.__alertType, node.__key);
  }

  constructor(alertType: AlertType, key?: string) {
    super(key);
    this.__alertType = alertType;
  }

  createDOM(): HTMLElement {
    const div = document.createElement('div');
    div.className = `alert-box alert-${this.__alertType}`;
    return div;
  }

  updateDOM(prevNode: AlertNode, dom: HTMLElement): boolean {
    if (prevNode.__alertType !== this.__alertType) {
      dom.className = `alert-box alert-${this.__alertType}`;
    }
    return false;
  }

  exportJSON(): SerializedAlertNode {
    return {
      ...super.exportJSON(),
      type: 'alert',
      alertType: this.__alertType,
      version: 1,
    };
  }

  static importJSON(serializedNode: SerializedAlertNode): AlertNode {
    return new AlertNode(serializedNode.alertType);
  }

  static importDOM(): DOMConversionMap | null {
    return {
      div: () => ({
        conversion: domNode => {
          if (
            domNode instanceof HTMLElement &&
            domNode.className.includes('alert-box')
          ) {
            const match = domNode.className.match(
              /alert-(info|warning|error|urgent)/,
            );
            const type = (match?.[1] ?? 'info') as AlertType;
            return {
              node: new AlertNode(type),
            };
          }
          return null;
        },
        priority: 1,
      }),
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('div');
    element.className = `alert-box alert-${this.__alertType}`;
    return {element};
  }

  isInline(): boolean {
    return false;
  }
}
export function $createAlertNode(alertType: AlertType): AlertNode {
  const node = new AlertNode(alertType);
  return $applyNodeReplacement(node);
}

export function $isAlertNode(
  node: LexicalNode | null | undefined,
): node is AlertNode {
  return node instanceof AlertNode;
}
