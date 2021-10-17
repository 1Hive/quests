import { bufferToHex, keccak256 } from 'ethereumjs-util';

export default class MerkleTree {
  elements: any[];

  bufferElementPositionIndex: any;

  layers: any[];

  constructor(elements: any[]) {
    this.elements = [];
    elements.forEach((x) => this.elements.push(x));
    // Sort elements
    this.elements.sort(Buffer.compare);
    // Deduplicate elements
    this.elements = MerkleTree.bufDedup(this.elements);

    this.bufferElementPositionIndex = this.elements.reduce((memo, el, index) => {
      memo[bufferToHex(el)] = index;
      return memo;
    }, {});

    // Create layers
    this.layers = this.getLayers(this.elements);
  }

  getLayers(elements: any[]) {
    if (elements.length === 0) {
      throw new Error('empty tree');
    }

    const layers = [];
    layers.push(elements);

    // Get next layer until we reach the root
    while (layers[layers.length - 1].length > 1) {
      layers.push(this.getNextLayer(layers[layers.length - 1]));
    }

    return layers;
  }

  // eslint-disable-next-line class-methods-use-this
  getNextLayer(elements: any[]) {
    return elements.reduce((layer, el, idx, arr) => {
      if (idx % 2 === 0) {
        // Hash the current element with its pair element
        layer.push(MerkleTree.combinedHash(el, arr[idx + 1]));
      }

      return layer;
    }, []);
  }

  static combinedHash(first: any, second: any) {
    if (!first) {
      return second;
    }
    if (!second) {
      return first;
    }

    return keccak256(MerkleTree.sortAndConcat(first, second));
  }

  getRoot() {
    return this.layers[this.layers.length - 1][0];
  }

  getHexRoot() {
    return bufferToHex(this.getRoot());
  }

  getProof(el: any) {
    let idx = this.bufferElementPositionIndex[bufferToHex(el)];

    if (typeof idx !== 'number') {
      throw new Error('Element does not exist in Merkle tree');
    }

    return this.layers.reduce((proof, layer) => {
      const pairElement = MerkleTree.getPairElement(idx, layer);

      if (pairElement) {
        proof.push(pairElement);
      }

      idx = Math.floor(idx / 2);

      return proof;
    }, []);
  }

  getHexProof(el: any) {
    const proof = this.getProof(el);

    return MerkleTree.bufArrToHexArr(proof);
  }

  static getPairElement(idx: any, layer: any) {
    const pairIdx = idx % 2 === 0 ? idx + 1 : idx - 1;

    if (pairIdx < layer.length) {
      return layer[pairIdx];
    }
    return null;
  }

  static bufDedup(elements: any[]) {
    return elements.filter((el, idx) => idx === 0 || !elements[idx - 1].equals(el));
  }

  static bufArrToHexArr(arr: any[]) {
    if (arr.some((el) => !Buffer.isBuffer(el))) {
      throw new Error('Array is not an array of buffers');
    }

    return arr.map((el) => `0x${el.toString('hex')}`);
  }

  static sortAndConcat(...args: any[]) {
    const newArr: any[] = [];
    args.forEach((x) => newArr.push(x));
    return Buffer.concat(newArr.sort(Buffer.compare));
  }
}
