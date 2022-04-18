import { TNode, TParent } from './types'

export const N = <T>(value: T, ...children: TNode<T>[]) => {
  const node: TParent<T> = { value, children }

  return node
}
