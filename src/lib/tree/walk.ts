import { TNode } from './types'

export const walk = <T>(
  node: TNode<T>,
  cb: (node: TNode<T>, depth?: number, parent?: TNode<T>) => any,
  depth = 0,
  parent?: TNode<T>
) => {
  const isHalt = cb(node, depth, parent)

  if (isHalt) return isHalt

  if (node.children) {
    for (const child of node.children) {
      const isHalt = walk(child, cb, depth + 1, node)

      if (isHalt) return isHalt
    }
  }
}
