export type TNode<T> = {
  value: T
  children?: TNode<T>[]
}

export type TParent<T> = TNode<T> & {
  children: TNode<T>[]
}
