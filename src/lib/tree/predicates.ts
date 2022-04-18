import { TNode } from './types'

export const isTNode = ( item: any ): item is TNode<any> => 
  item && 'value' in item
