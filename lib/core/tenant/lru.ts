export class CacheNode<K, V> {
  key: K;
  value: V;
  prev: CacheNode<K, V> | null = null;
  next: CacheNode<K, V> | null = null;

  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
  }
}

export class LRUCache<K, V> {
  private capacity: number;
  private cache: Map<K, CacheNode<K, V>> = new Map();
  private head: CacheNode<K, V> | null = null;
  private tail: CacheNode<K, V> | null = null;

  constructor(capacity: number) {
    this.capacity = capacity;
  }

  get(key: K): V | null {
    const node = this.cache.get(key);
    if (!node) return null;

    this.moveToHead(node);
    return node.value;
  }

  put(key: K, value: V): void {
    const node = this.cache.get(key);

    if (node) {
      // Update value and move node to head
      node.value = value;
      this.moveToHead(node);
    } else {
      if (this.cache.size >= this.capacity) {
        this.removeTail();
      }

      const newNode = new CacheNode(key, value);
      this.addNode(newNode);
      this.cache.set(key, newNode);
    }
  }

  private addNode(node: CacheNode<K, V>): void {
    node.next = this.head;
    node.prev = null;

    if (this.head) {
      this.head.prev = node;
    } else {
      this.tail = node; // This is the only node in the list
    }

    this.head = node;
  }

  private removeNode(node: CacheNode<K, V>): void {
    if (node.prev) {
      node.prev.next = node.next;
    } else {
      this.head = node.next;
    }

    if (node.next) {
      node.next.prev = node.prev;
    } else {
      this.tail = node.prev;
    }
  }

  private moveToHead(node: CacheNode<K, V>): void {
    if (node === this.head) return; // Node is already at head

    this.removeNode(node);
    this.addNode(node);
  }

  private removeTail(): void {
    if (!this.tail) return;

    if (this.tail === this.head) {
      this.head = this.tail = null; // Cache is now empty
    } else {
      this.tail = this.tail.prev;
      if (this.tail) {
        this.tail.next = null;
      }
    }

    if (this.tail) {
      this.cache.delete(this.tail.key);
    }
  }
}
