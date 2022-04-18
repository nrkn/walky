import { Size } from '../geometry/types'
import { N } from '../tree/n'
import { isTNode } from '../tree/predicates'
import { TNode } from '../tree/types'
import { WArg, WCanvas, WSpan, WTypeMap } from './types'

export const W = <K extends keyof WTypeMap>(
  _name: K,
  value: WTypeMap[ K ],
  ...args: WArg<K>[]
) => {
  const { children, partials } = args.reduce(
    ( prev, curr ) => {
      if( isTNode( curr ) ){
        prev.children.push( curr )
      } else {
        prev.partials.push( curr )
      }

      return prev
    },
    {
      children: [] as any[],
      partials: [] as any[]
    }
  )

  const node = N( value, ...children ) as unknown as TNode<WTypeMap[ K ]>

  Object.assign( node.value, ...partials )
  
  return node
}

export const wcanvas = ( { width, height }: Size, ...args: WArg<'canvas'>[] ) => {
  const canvasEl: WCanvas = { 
    width, height, name: [ width, height ].join( '×' ) 
  }
  
  return W( 'canvas', canvasEl, ...args )
}

export const wspan = ( text: string, ...args: Partial<WSpan>[] )  => {
  const spanEl: WSpan = { text, name: text, x: 0, y: 0 }

  return W( 'span', spanEl, ...args )
}