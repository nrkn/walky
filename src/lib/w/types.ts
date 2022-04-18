import { Point, Size } from '../geometry/types'
import { TNode } from '../tree/types'
import { Tuple3 } from '../types'
import { wNames } from './const'

export type WName = typeof wNames[ number ]

export type WNode = {
  name: string
}

export type WCanvas = WNode & Size & {
  bg?: Tuple3
}

export type WSpan = WNode & Point & {
  text: string
  color?: Tuple3
  bg?: Tuple3
}

export type WTypeMap = {
  canvas: WCanvas
  span: WSpan
}

export type WElement = WTypeMap[ WName ]

export type WArg<K extends WName> = TNode<WElement> | Partial<WTypeMap[K]>

export type WCanvasElement = TNode<WCanvas>
export type WSpanElement = TNode<WSpan>
