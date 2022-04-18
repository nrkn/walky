import { fitAndPosition } from 'object-fit-math'
import { Size } from 'object-fit-math/dist/types'
import { Css } from '../lib/dom/types'
import { N } from '../lib/tree/n'
import { TNode } from '../lib/tree/types'
import { walk } from '../lib/tree/walk'
import { ass } from '../lib/util'
import { wcanvas, wspan } from '../lib/w'
import { WCanvas, WCanvasElement, WNode, WSpanElement } from '../lib/w/types'

document.body.append(`Hello LA. You're up way past your bedtime`)

const testView = document.createElement('div')

const testViewStyle: Css = {
  display: 'block',
  width: '80vmin',
  height: '45vmin',
  background: '#eee'
}

Object.assign(testView.style, testViewStyle)

document.body.append(testView)

// how does canvas behave?
// it takes initial dimensions and uses contain to fill parent element

const canvasCss: Css = {
  display: 'block',
  position: 'absolute',
  width: '100%',
  height: '100%',
  objectFit: 'contain'
}

let lastSize: string | undefined
let currentCanvas: WCanvasElement | undefined
let resizeListener: ( e: UIEvent ) => void | undefined
let htmlCanvas: HTMLCanvasElement | undefined

type Dirty = {
  size?: Size  
}

const dirty: Dirty = {}


const tick = async ( time: number ) => {
  const { size } = dirty

  if( size !== undefined ){
    // .. do stuff

    dirty.size = undefined
  }

  if( 
    htmlCanvas === undefined || currentCanvas === undefined 
  ) return 

  const ctx = ass( htmlCanvas.getContext('2d') )

  const color = currentCanvas.value.bg ? `rgb(${ currentCanvas.value.bg.join() })` : '#000'

  ctx.fillStyle = color
  ctx.fillRect( 0, 0, htmlCanvas.width, htmlCanvas.height )
  ctx.font = '8px sans-serif'  

  walk<WNode>( canEl, node => {
    if( 'text' in node.value){
      const { value } = node as WSpanElement
      
      const color = value.color ? `rgb(${ value.color.join()})` : '#fff'

      ctx.fillStyle = color

      const text = value.name === 'debugPointer' ? String( time | 0 ) : value.text

      ctx.fillText( text, value.x, value.y + 8 )
    }
  })

  requestAnimationFrame( tick )
}

const addCanvas = (parent: HTMLElement, el: WCanvasElement) => {
  removeCanvas( parent )

  parent.style.position = 'relative'

  const { width, height } = parent.getBoundingClientRect()
  
  htmlCanvas = document.createElement('canvas')

  htmlCanvas.width = el.value.width
  htmlCanvas.height = el.value.height

  const ctx = ass( htmlCanvas.getContext('2d') )

  ctx.fillStyle = '#39f'

  ctx.fillRect( 0, 0, htmlCanvas.width, htmlCanvas.height )

  Object.assign( htmlCanvas.style, canvasCss )
  
  parent.append( htmlCanvas )

  lastSize = [ width, height ].join()
  currentCanvas = el  

  resizeListener = () => {
    const { width, height } = parent.getBoundingClientRect()

    const size = [ width, height ].join()

    if( size === lastSize ) return

    dirty.size = { width, height }
  }
  
  window.addEventListener( 'resize', resizeListener )

  requestAnimationFrame( tick )
}

const removeCanvas = ( parent: HTMLElement ) => {
  if( resizeListener !== undefined ){
    window.removeEventListener( 'resize', resizeListener )
  }

  if( currentCanvas !== undefined ){
    currentCanvas = undefined
    htmlCanvas = undefined
    ass( parent.querySelector( 'canvas' ) ).remove()
  }
}


const canSize: Size = { width: 160, height: 144 }

const canEl = wcanvas(
  canSize,
  { bg: [ 51,255,153 ] },
  wspan('walky'),
  wspan('schrkNET v1.666'),
  wspan('----------', { y: 8 }),
  wspan('==========', { y: canSize.height - 16 }),
  wspan('[0,0]', { name: 'debugPointer', y: canSize.height - 8 })
)

const pre = document.createElement('pre')

walk(canEl, (node, depth = 0) => {
  pre.append(`${' '.repeat(depth * 2)}${node.value.name}\n`)
})

document.body.append(pre)

let hasCanvas = false
testView.addEventListener( 'click', () => {
  if( hasCanvas ){
    removeCanvas( testView )
    hasCanvas = false
  } else {
    addCanvas( testView, canEl )
    hasCanvas = true
  }
})

