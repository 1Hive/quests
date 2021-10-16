import { utils } from 'ethers';
import MerkleTree from './merkle-tree';

export default class BalanceTree {
  tree: MerkleTree;

  constructor(balances: any) {
    this.tree = new MerkleTree(
      balances.map(({ account, amount }: any, index: number) =>
        BalanceTree.toNode(index, account, amount),
      ),
    );
  }

  static verifyProof(index: number, account: any, amount: any, proof: any, root: any) {
    let pair = BalanceTree.toNode(index, account, amount);
    // eslint-disable-next-line no-restricted-syntax
    for (const item of proof) {
      pair = MerkleTree.combinedHash(pair, item);
    }

    return pair.equals(root);
  }

  // keccak256(abi.encode(index, account, amount))
  static toNode(index: number, account: any, amount: any) {
    return Buffer.from(
      utils
        .solidityKeccak256(['uint256', 'address', 'uint256'], [index, account, amount])
        .substr(2),
      'hex',
    );
  }

  getHexRoot() {
    return this.tree.getHexRoot();
  }

  // returns the hex bytes32 values of the proof
  getProof(index: number, account: any, amount: any) {
    return this.tree.getHexProof(BalanceTree.toNode(index, account, amount));
  }
}
