import { CollisionDetection } from "../Physics/CollisionDetection";
import { VertexBuilder } from "../Builder/VertexBuilder";

export default class EngineObjectHelper {
  static vertex: VertexBuilder = new VertexBuilder();
  static collision: CollisionDetection = new CollisionDetection();
}
