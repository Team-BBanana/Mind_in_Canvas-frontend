import { CanvasClickEvent } from './clickEvent.ts'
import { ObjectEvent } from './objectEvent.ts'
import { CanvasTouchEvent } from './touchEvent.ts'
import { CanvasZoomEvent } from './zoomEvent.ts'
import { WindowEvent } from './windowEvent.ts'

export class CanvasEvent {
  clickEvent: CanvasClickEvent
  zoomEvent: CanvasZoomEvent
  objectEvent: ObjectEvent
  windowEvent: WindowEvent
  touchEvent: CanvasTouchEvent

  constructor() {
    const clickEvent = new CanvasClickEvent()
    this.clickEvent = clickEvent

    const zoomEvent = new CanvasZoomEvent()
    this.zoomEvent = zoomEvent

    const objectEvent = new ObjectEvent()
    this.objectEvent = objectEvent

    const windowEvent = new WindowEvent()
    this.windowEvent = windowEvent

    const touchEvent = new CanvasTouchEvent()
    this.touchEvent = touchEvent
  }

  removeEvent() {
    this.windowEvent.removeWindowEvent()
    this.touchEvent.removeTouchEvent()
  }
}
