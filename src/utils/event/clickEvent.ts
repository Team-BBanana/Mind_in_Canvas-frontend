import { fabric } from 'fabric'
import { ActionMode } from '@/constants'
import { DrawStyle, DrawType } from '@/constants/draw'
import { ShapeStyle } from '@/constants/shape'
import { paintBoard } from '../paintBoard.ts'

import { ReticulateElement } from '../element/draw/reticulate.ts'
import { ShapeElement } from '../element/draw/shape'
import { PixelsElement } from '../element/draw/pixels.ts'
import { DrawTextElement } from '../element/draw/text.ts'
import { MultiLineElement } from '../element/draw/multiLine.ts'
import { RainbowElement } from '../element/draw/rainbow.ts'
import { ThornElement } from '../element/draw/thorn.ts'
import { MultiPointElement } from '../element/draw/multiPoint.ts'
import { WiggleElement } from '../element/draw/wiggle.ts'

import { RectShape } from '../element/shape/rect.ts'
import { CircleShape } from '../element/shape/circle.ts'
import { LineShape } from '../element/shape/line.ts'
import { EllipseShape } from '../element/shape/ellipse.ts'
import { TriangleShape } from '../element/shape/triangle.ts'
import { ArrowOutlineShape } from '../element/shape/arrowOutline.ts'
import { CloudShape } from '../element/shape/cloud.ts'
import { TooltipsShape } from '../element/shape/tooltips.ts'
import { LightningShape } from '../element/shape/lightning.ts'
import { CloseShape } from '../element/shape/close.ts'
import { CheckShap } from '../element/shape/check.ts'
import { InfoShape } from '../element/shape/info.ts'
import { BackspaceShape } from '../element/shape/backspace.ts'
import { BlockShap } from '../element/shape/block.ts'
import { SpeakerShape } from '../element/shape/speaker.ts'
import { SearchShape } from '../element/shape/search.ts'
import { InfoOutlineShape } from '../element/shape/infoOutline.ts'
import { HeartShape } from '../element/shape/heart.ts'
import { AlertShape } from '../element/shape/alert.ts'
import { ArrowLineShape } from '../element/shape/arrowLine.ts'

import useDrawStore from '@/store/draw'
import useBoardStore from '@/store/board'
import useShapeStore from '@/store/shape'

export class CanvasClickEvent {
  isMouseDown = false
  isSpaceKeyDown = false
  startPoint: fabric.Point | undefined
  currentElement:
    | ShapeElement
    | PixelsElement
    | DrawTextElement
    | MultiLineElement
    | ReticulateElement
    | RainbowElement
    | ThornElement
    | MultiPointElement
    | WiggleElement
    | RectShape
    | CircleShape
    | LineShape
    | EllipseShape
    | TriangleShape
    | ArrowOutlineShape
    | CloudShape
    | TooltipsShape
    | LightningShape
    | CloseShape
    | CheckShap
    | InfoShape
    | BackspaceShape
    | BlockShap
    | SpeakerShape
    | SearchShape
    | InfoOutlineShape
    | HeartShape
    | AlertShape
    | ArrowLineShape
    | null = null // The current mouse move draws the element

  constructor() {
    this.initClickEvent()
  }

  initClickEvent() {
    const canvas = paintBoard.canvas

    canvas?.on('mouse:down', (e) => {
      this.isMouseDown = true
      if (this.isSpaceKeyDown) {
        return
      }
      this.startPoint = e.absolutePointer
      let currentElement = null

      if (useBoardStore.getState().mode === ActionMode.DRAW) {
        if (useBoardStore.getState().drawType === DrawType.Shape) {
          switch (useShapeStore.getState().shapeStyle) {
            case ShapeStyle.Rect:
              currentElement = new RectShape(e.absolutePointer)
              break
            case ShapeStyle.Circle:
              currentElement = new CircleShape(e.absolutePointer)
              break
            case ShapeStyle.Line:
              currentElement = new LineShape(e.absolutePointer)
              break
            case ShapeStyle.Ellipse:
              currentElement = new EllipseShape(e.absolutePointer)
              break
            case ShapeStyle.Triangle:
              currentElement = new TriangleShape(e.absolutePointer)
              break
            case ShapeStyle.ArrowLine:
              currentElement = new ArrowLineShape(e.absolutePointer)
              break
            case ShapeStyle.ArrowOutline:
              currentElement = new ArrowOutlineShape(e.absolutePointer)
              break
            case ShapeStyle.Cloud:
              currentElement = new CloudShape(e.absolutePointer)
              break
            case ShapeStyle.Tooltips:
              currentElement = new TooltipsShape(e.absolutePointer)
              break
            case ShapeStyle.Lightning:
              currentElement = new LightningShape(e.absolutePointer)
              break
            case ShapeStyle.Close:
              currentElement = new CloseShape(e.absolutePointer)
              break
            case ShapeStyle.Check:
              currentElement = new CheckShap(e.absolutePointer)
              break
            case ShapeStyle.Info:
              currentElement = new InfoShape(e.absolutePointer)
              break
            case ShapeStyle.Backspace:
              currentElement = new BackspaceShape(e.absolutePointer)
              break
            case ShapeStyle.Block:
              currentElement = new BlockShap(e.absolutePointer)
              break
            case ShapeStyle.Speaker:
              currentElement = new SpeakerShape(e.absolutePointer)
              break
            case ShapeStyle.Search:
              currentElement = new SearchShape(e.absolutePointer)
              break
            case ShapeStyle.InfoOutline:
              currentElement = new InfoOutlineShape(e.absolutePointer)
              break
            case ShapeStyle.Heart:
              currentElement = new HeartShape(e.absolutePointer)
              break
            case ShapeStyle.Alert:
              currentElement = new AlertShape(e.absolutePointer)
              break
            default:
              break
          }
        } else if (useBoardStore.getState().drawType === DrawType.FreeStyle) {
          switch (useDrawStore.getState().drawStyle) {
            case DrawStyle.Shape:
              currentElement = new ShapeElement()
              break
            case DrawStyle.Pixels:
              currentElement = new PixelsElement()
              break
            case DrawStyle.Text:
              currentElement = new DrawTextElement()
              break
            case DrawStyle.MultiLine:
              currentElement = new MultiLineElement()
              break
            case DrawStyle.Reticulate:
              currentElement = new ReticulateElement()
              break
            case DrawStyle.Rainbow:
              currentElement = new RainbowElement()
              break
            case DrawStyle.Thorn:
              currentElement = new ThornElement()
              break
            case DrawStyle.MultiPoint:
              currentElement = new MultiPointElement()
              break
            case DrawStyle.Wiggle:
              currentElement = new WiggleElement()
              break
            default:
              break
          }
        }
      }
      this.currentElement = currentElement
    })
    canvas?.on('mouse:move', (e) => {
      if (this.isMouseDown) {
        // Press space, drag the canvas, stop drawing.
        if (this.isSpaceKeyDown) {
          canvas.relativePan(new fabric.Point(e.e.movementX, e.e.movementY))
          return
        }

        // two touch disabled drawing on mobile
        if (paintBoard.evnet?.touchEvent.isTwoTouch) {
          return
        }

        if (
          useBoardStore.getState().mode === ActionMode.DRAW &&
          this.currentElement
        ) {
          this.currentElement.addPosition(e.absolutePointer)
        }
      }
    })
    canvas?.on('mouse:up', (e) => {
      this.isMouseDown = false

      if (this.currentElement) {
        let isDestroy = false
        if (this.startPoint && e.absolutePointer) {
          const { x: startX, y: startY } = this.startPoint
          const { x: endX, y: endY } = e.absolutePointer
          if (startX === endX && startY === endY) {
            this.currentElement.destroy()
            isDestroy = true
          }
        }
        if (!isDestroy) {
          if (
            this.currentElement instanceof LineShape ||
            this.currentElement instanceof ArrowLineShape
          ) {
            this.currentElement?.mouseUp()
          }
          paintBoard.history?.saveState()
        }
        this.currentElement = null
      }
    })

    canvas?.on('mouse:dblclick', (e) => {
      if (e?.absolutePointer) {
        const { x, y } = e.absolutePointer
        paintBoard.textElement?.loadText(x, y)
      }
    })
  }

  setSpaceKeyDownState(isSpaceKeyDown: boolean) {
    this.isSpaceKeyDown = isSpaceKeyDown
  }
}