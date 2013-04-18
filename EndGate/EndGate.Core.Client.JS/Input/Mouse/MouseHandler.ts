/// <reference path="../../Assets/Vectors/Vector2d.ts" />
/// <reference path="../../Utilities/EventHandler.ts" />
/// <reference path="MouseButton.ts" />
/// <reference path="IMouseEvent.d.ts" />
/// <reference path="IMouseClickEvent.d.ts" />
/// <reference path="IMouseScrollEvent.d.ts" />

module EndGate.Core.Input.Mouse {

    export class MouseHandler {
        // Used to determine mouse buttons without using extra conditional statements, performance enhancer
        private static MouseButtonArray = [null, MouseButton.Left, MouseButton.Middle, MouseButton.Right];

        private _target: HTMLCanvasElement;

        constructor(target: HTMLCanvasElement) {
            this._target = target;

            this.OnClick = new Utilities.EventHandler();
            this.OnDoubleClick = new Utilities.EventHandler();
            this.OnDown = new Utilities.EventHandler();
            this.OnUp = new Utilities.EventHandler();
            this.OnMove = new Utilities.EventHandler();
            this.OnScroll = new Utilities.EventHandler();

            this.Wire();
        }

        public OnClick: Utilities.EventHandler;
        public OnDoubleClick: Utilities.EventHandler;
        public OnDown: Utilities.EventHandler;
        public OnUp: Utilities.EventHandler;
        public OnMove: Utilities.EventHandler;

        public OnScroll: Utilities.EventHandler;

        private Wire(): void {
            this._target.onclick = this._target.oncontextmenu = this.BuildEvent(this.OnClick, this.BuildMouseClickEvent);
            this._target.ondblclick = this.BuildEvent(this.OnDoubleClick, this.BuildMouseClickEvent);
            this._target.onmousedown = this.BuildEvent(this.OnDown, this.BuildMouseClickEvent);
            this._target.onmouseup = this.BuildEvent(this.OnUp, this.BuildMouseClickEvent);
            this._target.onmousemove = this.BuildEvent(this.OnMove, this.BuildMouseEvent);

            // OnScroll, in order to detect horizontal scrolling need to hack a bit (browser sniffing)
            // if we were just doing vertical scrolling we could settle with the else statement in this block
            if ((/MSIE/i.test(navigator.userAgent))) {
                this._target.addEventListener("wheel", this.BuildEvent(this.OnScroll, (e: any) => {
                    e.wheelDeltaX = -e.deltaX;
                    e.wheelDeltaY = -e.deltaY;
                    return this.BuildMouseScrollEvent(e);
                }), false);
            }
            else if ((/Firefox/i.test(navigator.userAgent))) {
                this._target.addEventListener("DOMMouseScroll", this.BuildEvent(this.OnScroll, (e: any) => {
                    e.wheelDeltaX = e.axis === 1 ? -e.detail : 0;
                    e.wheelDeltaY = e.axis === 2 ? -e.detail : 0;
                    return this.BuildMouseScrollEvent(e);
                }), false);
            }
            else {
                this._target.addEventListener("mousewheel", this.BuildEvent(this.OnScroll, this.BuildMouseScrollEvent), false);
            }
        }

        private BuildEvent(eventHandler: Utilities.EventHandler, mouseEventBuilder: (mouseEvent: MouseEvent) => IMouseEvent, returnValue: bool = false): (e: MouseEvent) => void {
            return (e: MouseEvent) => {
                if (eventHandler.HasBindings()) {
                    eventHandler.Trigger(mouseEventBuilder.call(this, e));
                }

                return returnValue;
            }
        }

        private BuildMouseScrollEvent(event: MouseWheelEvent): IMouseScrollEvent {
            return {
                Position: this.GetMousePosition(event),
                Direction: this.GetMouseScrollDierction(event)
            };
        }

        private BuildMouseEvent(event: MouseEvent): IMouseEvent {
            return {
                Position: this.GetMousePosition(event)
            };
        }

        private BuildMouseClickEvent(event: MouseEvent): IMouseClickEvent {
            return {
                Position: this.GetMousePosition(event),
                Button: this.GetMouseButton(event)
            };
        }

        private GetMousePosition(event: MouseEvent): Assets.Vector2d {
            return new Assets.Vector2d(
                event.offsetX ? (event.offsetX) : event.pageX - this._target.offsetLeft,
                event.offsetY ? (event.offsetY) : event.pageY - this._target.offsetTop
            );
        }

        private GetMouseButton(event: MouseEvent): string {
            if (event.which) {
                return MouseHandler.MouseButtonArray[event.which];
            }

            return MouseButton.Right;
        }

        private GetMouseScrollDierction(event: any): Assets.Vector2d{
            return new Assets.Vector2d(-Math.max(-1, Math.min(1, event.wheelDeltaX)), -Math.max(-1, Math.min(1, event.wheelDeltaY)));
        }
    }

}