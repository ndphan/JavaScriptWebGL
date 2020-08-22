import Rect2d from "../Core/Data/Rect2d";
import Events, { EngineEvent } from "../Core/Events";
import { CollisionDetection } from "../Core/Physics/CollisionDetection";
import Plane2d from "../Entity/Plane2d";
import { FontReference } from "../Core/Font/Font";
import EngineHelper from "../Core/EngineHelper";

class Button extends Plane2d {
  private onClickEnd: (event: EngineEvent) => void;
  private onClickStart?: (event: EngineEvent) => void;
  private text?: string;
  private textRef?: FontReference;
  private readonly textMargin = 0.01;

  constructor(
    rect: Rect2d,
    textureReference: string,
    onClickEnd: (event: EngineEvent) => void,
    onClickStart?: (event: EngineEvent) => void
  ) {
    super(rect, textureReference);
    this.onClickEnd = onClickEnd;
    this.onClickStart = onClickStart;
  }
  setText(text: string): Button {
    this.text = text;
    if (!this.textRef) {
      this.textRef = FontReference.newFont(this.position.center(), undefined, 0)
        .setText(text)
        .setWidth(this.position.width - this.textMargin);
    }
    return this;
  }
  setFont(fontSize: number): Button {
    this.textRef?.setFontSize(fontSize);
    return this;
  }
  getText(): string | undefined {
    return this.text;
  }
  render(engineHelper: EngineHelper) {
    super.render(engineHelper);
    if (this.textRef) {
      if (
        this.position.x !== this.textRef.pos.x ||
        this.position.y !== this.textRef.pos.y
      ) {
        this.textRef.setPosition(this.position.center());
      }
      this.textRef.render(engineHelper);
    }
  }
  update(engineHelper: EngineHelper) {
    if(this.textRef) {
      this.textRef.setTop(this.isTop);
    }
    super.update(engineHelper);
  }
  event(event: EngineEvent, engineHelper: EngineHelper): void {
    const distance = engineHelper.camera.camera2d.distanceEvent(event);
    if (event.eventType === Events.UP) {
      const isClicked = CollisionDetection.isPointInRect(
        this.getRect(),
        distance
      );
      if (isClicked && this.onClickEnd) {
        this.onClickEnd(event);
      }
    } else if (event.eventType === Events.DOWN) {
      const isClicked = CollisionDetection.isPointInRect(
        this.getRect(),
        distance
      );
      if (isClicked && this.onClickStart) {
        this.onClickStart(event);
      }
    }
  }
}

export default Button;
