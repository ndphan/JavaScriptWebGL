class ModelData {
  vertices: number[];
  cacheId?: number;
  $id: number = ModelData._$ID++;

  static _$ID = 1;
}

export default ModelData;
