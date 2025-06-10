import {
  ElementNode,
  SerializedElementNode,
  Spread,
  DOMConversionMap,
  DOMExportOutput,
  $applyNodeReplacement,
  LexicalNode,
} from 'lexical';

export type AlertType = 'info' | 'warning' | 'error' | 'urgent' | 'success';

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
    const dom = document.createElement('div');
    dom.className = `alert alert-${this.__alertType}`;

    const icon = document.createElement('i');
    icon.className = `alert-icon ${this.__alertType}-icon`;
    dom.appendChild(icon);

    return dom;
  }

  updateDOM(prevNode: AlertNode, dom: HTMLElement): boolean {
    if (prevNode.__alertType !== this.__alertType) {
      // Update alert wrapper class
      dom.classList.remove(`alert-${prevNode.__alertType}`);
      dom.classList.add(`alert-${this.__alertType}`);

      // Update icon class
      const icon = dom.querySelector('i.alert-icon');
      if (icon) {
        icon.classList.remove(`${prevNode.__alertType}-icon`);
        icon.classList.add(`${this.__alertType}-icon`);
      }
    }

    return false; // No need to replace the entire DOM
  }

  static importJSON(serializedNode: SerializedAlertNode): AlertNode {
    const node = new AlertNode(serializedNode.alertType);
    return node;
  }

  exportJSON(): SerializedAlertNode {
    return {
      ...super.exportJSON(),
      type: 'alert',
      version: 1,
      alertType: this.__alertType,
    };
  }

  isInline(): boolean {
    return false;
  }

  canContainText(): boolean {
    return false;
  }

  canContainBlock(): boolean {
    return true;
  }

  getTextContent(): string {
    return this.getChildren()
      .map(n => n.getTextContent())
      .join('\n');
  }

  static importDOM(): DOMConversionMap {
    return {
      div: (node: Node) => {
        const domNode = node as HTMLElement;
        if (domNode.classList.contains('alert')) {
          const match = Array.from(domNode.classList).find(
            cls => cls.startsWith('alert-') && cls !== 'alert',
          );

          if (match) {
            const type = match.replace('alert-', '') as AlertType;

            return {
              conversion: () => ({node: $createAlertNode(type)}),
              priority: 1,
            };
          }
        }
        return null;
      },
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('div');
    element.className = `alert alert-${this.__alertType}`;

    const icon = document.createElement('i');
    icon.className = `alert-icon ${this.__alertType}-icon`;
    element.appendChild(icon);

    return {
      element,
    };
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
