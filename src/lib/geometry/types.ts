export type Point = {
  x: number
  y: number
}

export type Size = {
  width: number
  height: number
}

export type Rect = Point & Size

export type Edges = {
  left: number
  top: number
  right: number
  bottom: number
}
