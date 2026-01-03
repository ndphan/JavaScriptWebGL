import EntityManager from "../Manager/EntityManager";
import ObjectManager from "../Manager/ObjectManager";
import Coordinate from "./Data/Coordinate";
import EngineObject from "./EngineEntity/EngineObject";
import EngineHelper from "./EngineHelper";
import Renderer from "./Renderer";
import WorldDelegate from "./WorldDelegate";

export interface DebugCameraInfo {
  position: Coordinate;
  rotation: { ax: number; ay: number; az: number };
  origin: Coordinate;
}

export interface DebugEntityInfo {
  type: string;
  position: Coordinate;
  hidden: boolean;
  hasShaderEntity: boolean;
  textureRef?: string;
  bufferId?: number;
  features: string[];
  isLowPriority: boolean;
}

export interface DebugInfo {
  fps: number;
  frameTime: number;
  entityCount: number;
  camera: DebugCameraInfo;
  entities: DebugEntityInfo[];
  webglInfo: {
    faceCullingEnabled: boolean;
    depthTestEnabled: boolean;
    blendEnabled: boolean;
    clearColor: string;
  };
  renderCalls: number;
  lastError?: string;
}

export default class EngineDebugger {
  private debugElement: HTMLDivElement;
  private isVisible: boolean = true;
  private updateInterval: number | null = null;
  private fpsCounter: number = 0;
  private lastFrameTime: number = performance.now();
  private frameTimeHistory: number[] = [];
  private renderCallCount: number = 0;
  private lastError: string | undefined;
  private world: WorldDelegate | null = null;
  private engineHelper: EngineHelper | null = null;
  private renderer: Renderer | null = null;
  private lastUpdateTime: number = 0;
  private updateThrottleMs: number = 100;
  private lastEntityCount: number = -1;

  constructor(private canvas: HTMLCanvasElement) {
    this.createDebugUI();
    this.enableDebugOnRightClick();
    this.hide();
  }

  /**
   * Cleans up debugger UI and keyboard controls.
   */
  public destroy(): void {
    if (this.debugElement && this.debugElement.parentElement) {
      this.debugElement.parentElement.removeChild(this.debugElement);
    }
  }

  private createDebugUI(): void {
    // Create debug overlay container
    this.debugElement = document.createElement('div');
    this.debugElement.id = 'engine-debugger';
    this.debugElement.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.9);
      color: #ffffff;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      padding: 15px;
      border-radius: 8px;
      min-width: 400px;
      max-width: 500px;
      max-height: 80vh;
      overflow-y: auto;
      z-index: 10000;
      border: 1px solid #333;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      line-height: 1.4;
    `;

    // Create the static structure that won't be replaced
    this.createStaticStructure();

    // Add to canvas parent or body
    const parent = this.canvas.parentElement || document.body;
    parent.style.position = 'relative'; // Ensure parent can contain absolute positioned children
    parent.appendChild(this.debugElement);
  }

  private createStaticStructure(): void {
    this.debugElement.innerHTML = `
      <div style="margin-top: 25px;">
        <h3 style="margin: 0 0 10px 0; color: #4CAF50; font-size: 14px;">Engine Debugger</h3>
        
        <div id="debug-performance" style="margin-bottom: 10px;">
          <strong style="color: #FFD700;">Performance:</strong><br>
          <span id="perf-content"></span>
        </div>

        <div id="debug-camera-controls" style="margin-bottom: 15px; border: 1px solid #444; padding: 8px; border-radius: 4px;">
          <strong style="color: #FFD700;">Camera Controls:</strong><br>
          <div style="margin: 8px 0;">
            <strong>Position:</strong><br>
            <div style="display: flex; gap: 5px; margin: 5px 0;">
              <div style="flex: 1;">
                X: <input id="cam-pos-x" type="number" step="0.1" 
                   style="width: 60px; background: #333; color: white; border: 1px solid #555; padding: 2px;">
              </div>
              <div style="flex: 1;">
                Y: <input id="cam-pos-y" type="number" step="0.1" 
                   style="width: 60px; background: #333; color: white; border: 1px solid #555; padding: 2px;">
              </div>
              <div style="flex: 1;">
                Z: <input id="cam-pos-z" type="number" step="0.1" 
                   style="width: 60px; background: #333; color: white; border: 1px solid #555; padding: 2px;">
              </div>
            </div>
          </div>
          
          <div style="margin: 8px 0;">
            <strong>Rotation:</strong><br>
            <div style="display: flex; gap: 5px; margin: 5px 0;">
              <div style="flex: 1;">
                X: <input id="cam-rot-x" type="number" step="1" 
                   style="width: 60px; background: #333; color: white; border: 1px solid #555; padding: 2px;">
              </div>
              <div style="flex: 1;">
                Y: <input id="cam-rot-y" type="number" step="1" 
                   style="width: 60px; background: #333; color: white; border: 1px solid #555; padding: 2px;">
              </div>
              <div style="flex: 1;">
                Z: <input id="cam-rot-z" type="number" step="1" 
                   style="width: 60px; background: #333; color: white; border: 1px solid #555; padding: 2px;">
              </div>
            </div>
          </div>
          
          <div style="margin: 8px 0;">
            <strong>Origin:</strong><br>
            <div style="display: flex; gap: 5px; margin: 5px 0;">
              <div style="flex: 1;">
                X: <input id="cam-origin-x" type="number" step="0.1" 
                   style="width: 60px; background: #333; color: white; border: 1px solid #555; padding: 2px;">
              </div>
              <div style="flex: 1;">
                Y: <input id="cam-origin-y" type="number" step="0.1" 
                   style="width: 60px; background: #333; color: white; border: 1px solid #555; padding: 2px;">
              </div>
              <div style="flex: 1;">
                Z: <input id="cam-origin-z" type="number" step="0.1" 
                   style="width: 60px; background: #333; color: white; border: 1px solid #555; padding: 2px;">
              </div>
            </div>
          </div>
          
          <div style="margin: 8px 0;">
            <button id="reset-camera-btn" 
                    style="background: #4CAF50; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 11px;">
              Reset Camera
            </button>
            <button id="look-at-origin-btn" 
                    style="background: #2196F3; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 11px; margin-left: 5px;">
              Look at Origin
            </button>
            <button id="reset-origin-btn" 
                    style="background: #FF9800; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 11px; margin-left: 5px;">
              Fix Origin
            </button>
          </div>
        </div>

        <div id="debug-webgl" style="margin-bottom: 10px;">
          <strong style="color: #FFD700;">WebGL State:</strong><br>
          <span id="webgl-content"></span>
        </div>

        <div id="debug-entities" style="margin-bottom: 10px;">
          <strong style="color: #FFD700;">Entities (<span id="entity-count">0</span>):</strong><br>
          <div id="entities-container" style="max-height: 180px; overflow-y: auto; overflow-x: hidden; border: 1px solid #444; padding: 5px; margin-top: 5px; background: rgba(0,0,0,0.3);">
            <!-- Entities will be populated here -->
          </div>
        </div>

        <div id="debug-error" style="margin-bottom: 10px; display: none;">
          <strong style="color: #FF4444;">Last Error:</strong><br>
          <span id="error-content" style="color: #FF4444; font-size: 11px; word-break: break-word;"></span>
        </div>
      </div>
    `;

    // Add toggle button
    const toggleButton = document.createElement('button');
    toggleButton.textContent = '×';
    toggleButton.style.cssText = `
      position: absolute;
      top: 5px;
      right: 5px;
      background: #ff4444;
      color: white;
      border: none;
      border-radius: 3px;
      width: 20px;
      height: 20px;
      cursor: pointer;
      font-size: 14px;
      line-height: 1;
    `;
    toggleButton.onclick = () => this.toggle();
    this.debugElement.appendChild(toggleButton);

    // Set up event listeners for camera controls
    this.setupCameraControlEventListeners();
  }

  private calculateFPS(): number {
    const now = performance.now();
    const frameTime = now - this.lastFrameTime;
    this.lastFrameTime = now;

    this.frameTimeHistory.push(frameTime);
    if (this.frameTimeHistory.length > 60) {
      this.frameTimeHistory.shift();
    }

    const avgFrameTime = this.frameTimeHistory.reduce((a, b) => a + b, 0) / this.frameTimeHistory.length;
    return Math.round(1000 / avgFrameTime);
  }

  public updateDebugInfo(engineHelper: EngineHelper | null): void {
    this.fpsCounter = this.calculateFPS();

    if (!engineHelper || !this.isVisible) return;

    const now = performance.now();
    if (now - this.lastUpdateTime < this.updateThrottleMs) return;
    this.lastUpdateTime = now;

    const debugInfo = this.gatherDebugInfo(engineHelper);
    this.renderDebugInfo(debugInfo);
  }

  public setReferences(world: WorldDelegate, renderer: Renderer): void {
    this.world = world;
    this.renderer = renderer;
  }

  public setEngineHelper(engineHelper: EngineHelper): void {
    this.engineHelper = engineHelper;
  }

  private buildEntityInfo(entity: EngineObject): DebugEntityInfo {
    return {
      type: entity ? entity.constructor.name : 'null',
      position: entity ? {
        x: Math.round(entity.position.x * 100) / 100,
        y: Math.round(entity.position.y * 100) / 100,
        z: Math.round(entity.position.z * 100) / 100
      } : { x: 0, y: 0, z: 0 },
      hidden: entity ? entity.hidden : true,
      hasShaderEntity: entity ? !!entity.shaderEntity : false,
      textureRef: entity?.shaderEntity?.rendererTextureRef,
      bufferId: entity?.shaderEntity?.rendererBufferId,
      features: entity?.features?.map(f => f.constructor.name) || [],
      isLowPriority: entity?.isLowPriority || false
    };
  }

  private gatherDebugInfo(engineHelper: EngineHelper): DebugInfo {
    const camera = engineHelper.camera;

    // Get WebGL context info from the canvas
    const canvas = this.canvas;
    const glContext = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
    const webglInfo = glContext ? {
      faceCullingEnabled: glContext.isEnabled(glContext.CULL_FACE),
      depthTestEnabled: glContext.isEnabled(glContext.DEPTH_TEST),
      blendEnabled: glContext.isEnabled(glContext.BLEND),
      clearColor: this.getClearColorString(glContext)
    } : {
      faceCullingEnabled: false,
      depthTestEnabled: false,
      blendEnabled: false,
      clearColor: 'unknown'
    };

    // Get camera info
    const cameraInfo = {
      position: {
        x: Math.round(camera.getActiveCamera().position.x * 100) / 100,
        y: Math.round(camera.getActiveCamera().position.y * 100) / 100,
        z: Math.round(camera.getActiveCamera().position.z * 100) / 100
      },
      rotation: {
        ax: Math.round(camera.getActiveCamera().position.ax * 100) / 100,
        ay: Math.round(camera.getActiveCamera().position.ay * 100) / 100,
        az: Math.round(camera.getActiveCamera().position.az * 100) / 100
      },
      origin: {
        x: Math.round(camera.getActiveCamera().position.originX * 100) / 100,
        y: Math.round(camera.getActiveCamera().position.originY * 100) / 100,
        z: Math.round(camera.getActiveCamera().position.originZ * 100) / 100
      }
    };

    const entities = this.world instanceof ObjectManager && this.world?.entities?.flatMap((entity: EngineObject, index) => {
      if (entity instanceof EntityManager) {
        return entity.entities.map(obj => this.buildEntityInfo(obj));
      }
      return this.buildEntityInfo(entity)
    }) || [];

    return {
      fps: this.fpsCounter,
      frameTime: this.frameTimeHistory.length > 0 ?
        Math.round(this.frameTimeHistory[this.frameTimeHistory.length - 1] * 100) / 100 : 0,
      entityCount: entities.length,
      camera: cameraInfo,
      entities: entities,
      webglInfo: webglInfo,
      renderCalls: this.renderCallCount,
      lastError: this.lastError
    };
  }

  private getClearColorString(ctx: WebGLRenderingContext): string {
    const color = ctx.getParameter(ctx.COLOR_CLEAR_VALUE) as Float32Array;
    return `rgba(${Math.round(color[0] * 255)}, ${Math.round(color[1] * 255)}, ${Math.round(color[2] * 255)}, ${color[3]})`;
  }

  private renderDebugInfo(info: DebugInfo): void {
    const perfContent = this.debugElement.querySelector('#perf-content');
    if (perfContent) {
      perfContent.innerHTML = `
        FPS: <span style="color: ${info.fps > 50 ? '#4CAF50' : info.fps > 30 ? '#FFA500' : '#FF4444'}">${info.fps}</span><br>
        Frame Time: ${info.frameTime}ms<br>
        Render Calls: ${info.renderCalls}
      `;
    }

    // Update camera controls with current values
    this.updateCameraControls(info.camera);

    // Update WebGL state
    const webglContent = this.debugElement.querySelector('#webgl-content');
    if (webglContent) {
      webglContent.innerHTML = `
        Face Culling: <span style="color: ${info.webglInfo.faceCullingEnabled ? '#4CAF50' : '#FF4444'}">${info.webglInfo.faceCullingEnabled ? 'ON' : 'OFF'}</span><br>
        Depth Test: <span style="color: ${info.webglInfo.depthTestEnabled ? '#4CAF50' : '#FF4444'}">${info.webglInfo.depthTestEnabled ? 'ON' : 'OFF'}</span><br>
        Blend: <span style="color: ${info.webglInfo.blendEnabled ? '#4CAF50' : '#FF4444'}">${info.webglInfo.blendEnabled ? 'ON' : 'OFF'}</span><br>
        Clear Color: ${info.webglInfo.clearColor}
      `;
    }

    // Update entity count
    const entityCountEl = this.debugElement.querySelector('#entity-count');
    if (entityCountEl) {
      entityCountEl.textContent = info.entityCount.toString();
    }

    // Update entities list efficiently - preserve scroll position
    this.updateEntitiesList(info.entities);

    // Update error display
    this.updateErrorDisplay(info.lastError);
  }

  private updateCameraControls(camera: DebugInfo['camera']): void {
    const posX = this.debugElement.querySelector('#cam-pos-x') as HTMLInputElement;
    const posY = this.debugElement.querySelector('#cam-pos-y') as HTMLInputElement;
    const posZ = this.debugElement.querySelector('#cam-pos-z') as HTMLInputElement;
    const rotX = this.debugElement.querySelector('#cam-rot-x') as HTMLInputElement;
    const rotY = this.debugElement.querySelector('#cam-rot-y') as HTMLInputElement;
    const rotZ = this.debugElement.querySelector('#cam-rot-z') as HTMLInputElement;

    // Origin input elements
    const originX = this.debugElement.querySelector('#cam-origin-x') as HTMLInputElement;
    const originY = this.debugElement.querySelector('#cam-origin-y') as HTMLInputElement;
    const originZ = this.debugElement.querySelector('#cam-origin-z') as HTMLInputElement;

    if (posX && posX !== document.activeElement) {
      posX.value = camera.position.x.toString();
    }
    if (posY && posY !== document.activeElement) {
      posY.value = camera.position.y.toString();
    }
    if (posZ && posZ !== document.activeElement) {
      posZ.value = camera.position.z.toString();
    }
    if (rotX && rotX !== document.activeElement) {
      rotX.value = camera.rotation.ax.toString();
    }
    if (rotY && rotY !== document.activeElement) {
      rotY.value = camera.rotation.ay.toString();
    }
    if (rotZ && rotZ !== document.activeElement) {
      rotZ.value = camera.rotation.az.toString();
    }

    // Update origin input fields with proper styling based on values
    if (originX && originX !== document.activeElement) {
      originX.value = camera.origin.x.toString();
      originX.style.borderColor = camera.origin.x === 0 ? '#4CAF50' : '#FF4444';
    }
    if (originY && originY !== document.activeElement) {
      originY.value = camera.origin.y.toString();
      originY.style.borderColor = camera.origin.y === 0 ? '#4CAF50' : '#FF4444';
    }
    if (originZ && originZ !== document.activeElement) {
      originZ.value = camera.origin.z.toString();
      originZ.style.borderColor = camera.origin.z === 0 ? '#4CAF50' : '#FF4444';
    }
  }

  private updateEntitiesList(entities: DebugInfo['entities']): void {
    const container = this.debugElement.querySelector('#entities-container');
    if (!container) return;

    if (this.lastEntityCount === entities.length) return;
    this.lastEntityCount = entities.length;

    const scrollTop = container.scrollTop;

    const entitiesHtml = entities.map((entity, index) => `
      <div style="margin-bottom: 5px; padding: 4px; border-left: 3px solid ${entity.hidden ? '#FF4444' : entity.isLowPriority ? '#FFA500' : '#4CAF50'}; background: rgba(255,255,255,0.05); border-radius: 2px;">
        <strong style="color: #87CEEB;">${index}: ${entity.type}</strong>${entity.isLowPriority ? ' <span style="color: #FFA500; font-size: 10px;">[LOW PRIORITY]</span>' : ''}<br>
        <span style="font-size: 11px;">
          Pos: (${entity.position.x}, ${entity.position.y}, ${entity.position.z})<br>
          Hidden: ${entity.hidden ? 'YES' : 'NO'} | 
          Shader: ${entity.hasShaderEntity ? 'YES' : 'NO'}<br>
          ${entity.textureRef ? `Texture: <span style="color: #90EE90;">${entity.textureRef}</span><br>` : ''}
          ${entity.bufferId !== undefined ? `Buffer ID: <span style="color: #FFB6C1;">${entity.bufferId}</span><br>` : '<span style="color: #FF6B6B;">No Buffer</span><br>'}
          ${entity.features.length > 0 ? `Features: <span style="color: #FFD700;">${entity.features.join(', ')}</span>` : '<span style="color: #888;">No Features</span>'}
        </span>
      </div>
    `).join('');

    container.innerHTML = entitiesHtml;
    container.scrollTop = scrollTop;
  }

  private updateErrorDisplay(lastError?: string): void {
    const errorDiv = this.debugElement.querySelector('#debug-error') as HTMLElement;
    const errorContent = this.debugElement.querySelector('#error-content') as HTMLElement;

    if (lastError && errorDiv && errorContent) {
      errorDiv.style.display = 'block';
      errorContent.textContent = lastError;
    } else if (errorDiv) {
      errorDiv.style.display = 'none';
    }
  }

  public toggle(): void {
    this.isVisible = !this.isVisible;
    this.debugElement.style.display = this.isVisible ? 'block' : 'none';
  }

  public show(): void {
    this.isVisible = true;
    this.debugElement.style.display = 'block';
  }

  public hide(): void {
    this.isVisible = false;
    this.debugElement.style.display = 'none';
  }

  public incrementRenderCalls(): void {
    this.renderCallCount++;
  }

  public resetRenderCalls(): void {
    this.renderCallCount = 0;
  }

  public logError(error: string): void {
    this.lastError = error;
    console.error('Engine Error:', error);
  }



  private setupCameraControlEventListeners(): void {
    // Position controls
    const posX = this.debugElement.querySelector('#cam-pos-x') as HTMLInputElement;
    const posY = this.debugElement.querySelector('#cam-pos-y') as HTMLInputElement;
    const posZ = this.debugElement.querySelector('#cam-pos-z') as HTMLInputElement;

    posX?.addEventListener('change', (e) => this.setCameraPosition('x', (e.target as HTMLInputElement).value));
    posY?.addEventListener('change', (e) => this.setCameraPosition('y', (e.target as HTMLInputElement).value));
    posZ?.addEventListener('change', (e) => this.setCameraPosition('z', (e.target as HTMLInputElement).value));

    // Rotation controls
    const rotX = this.debugElement.querySelector('#cam-rot-x') as HTMLInputElement;
    const rotY = this.debugElement.querySelector('#cam-rot-y') as HTMLInputElement;
    const rotZ = this.debugElement.querySelector('#cam-rot-z') as HTMLInputElement;

    rotX?.addEventListener('change', (e) => this.setCameraRotation('ax', (e.target as HTMLInputElement).value));
    rotY?.addEventListener('change', (e) => this.setCameraRotation('ay', (e.target as HTMLInputElement).value));
    rotZ?.addEventListener('change', (e) => this.setCameraRotation('az', (e.target as HTMLInputElement).value));

    // Origin controls
    const originX = this.debugElement.querySelector('#cam-origin-x') as HTMLInputElement;
    const originY = this.debugElement.querySelector('#cam-origin-y') as HTMLInputElement;
    const originZ = this.debugElement.querySelector('#cam-origin-z') as HTMLInputElement;

    originX?.addEventListener('change', (e) => this.setCameraOrigin('x', (e.target as HTMLInputElement).value));
    originY?.addEventListener('change', (e) => this.setCameraOrigin('y', (e.target as HTMLInputElement).value));
    originZ?.addEventListener('change', (e) => this.setCameraOrigin('z', (e.target as HTMLInputElement).value));

    // Buttons
    const resetBtn = this.debugElement.querySelector('#reset-camera-btn') as HTMLButtonElement;
    const lookAtBtn = this.debugElement.querySelector('#look-at-origin-btn') as HTMLButtonElement;
    const resetOriginBtn = this.debugElement.querySelector('#reset-origin-btn') as HTMLButtonElement;

    resetBtn?.addEventListener('click', () => this.resetCamera());
    lookAtBtn?.addEventListener('click', () => this.lookAtOrigin());
    resetOriginBtn?.addEventListener('click', () => this.resetCameraOrigin());
  }

  public enableDebugOnRightClick(): void {
    this.canvas.addEventListener('contextmenu', (event) => {
      event.preventDefault();

      const debugMenu = document.createElement('div');
      debugMenu.style.cssText = `
        position: absolute;
        top: ${event.clientY}px;
        left: ${event.clientX}px;
        background: #333;
        color: white;
        border: 1px solid #555;
        padding: 10px;
        border-radius: 5px;
        z-index: 10001;
      `;
      debugMenu.innerHTML = '<button id="debug-toggle">Toggle Debug</button>';

      document.body.appendChild(debugMenu);

      const toggleButton = debugMenu.querySelector('#debug-toggle') as HTMLButtonElement;
      toggleButton.addEventListener('click', () => {
        this.toggle();
        document.body.removeChild(debugMenu);
      });

      document.addEventListener('click', () => {
        if (document.body.contains(debugMenu)) {
          document.body.removeChild(debugMenu);
        }
      }, { once: true });
    });
  }

  private setCameraPosition(axis: string, value: string): void {
    if (!this.engineHelper || !this.engineHelper.camera) return;

    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    const camera = this.engineHelper.camera.getActiveCamera();
    switch (axis) {
      case 'x':
        camera.position.x = numValue;
        break;
      case 'y':
        camera.position.y = numValue;
        break;
      case 'z':
        camera.position.z = numValue;
        break;
    }
    camera.updateProjectionView();
  }

  private setCameraRotation(axis: string, value: string): void {
    if (!this.engineHelper || !this.engineHelper.camera) return;

    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    const camera = this.engineHelper.camera.getActiveCamera();
    switch (axis) {
      case 'ax':
        camera.position.ax = numValue;
        break;
      case 'ay':
        camera.position.ay = numValue;
        break;
      case 'az':
        camera.position.az = numValue;
        break;
    }
    camera.updateProjectionView();
  }

  private setCameraOrigin(axis: string, value: string): void {
    if (!this.engineHelper || !this.engineHelper.camera) return;

    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    const camera = this.engineHelper.camera.getActiveCamera();
    switch (axis) {
      case 'x':
        camera.position.originX = numValue;
        break;
      case 'y':
        camera.position.originY = numValue;
        break;
      case 'z':
        camera.position.originZ = numValue;
        break;
    }
    camera.dirtyOrigin = true;
    camera.dirtyQuat = true;
    camera.dirtyModel = true;
    camera.updateProjectionView();
  }

  private resetCamera(): void {
    if (!this.engineHelper || !this.engineHelper.camera) return;

    const camera = this.engineHelper.camera.getActiveCamera();
    camera.center(0, 2, 5);
    camera.position.ax = 0;
    camera.position.ay = 0;
    camera.position.az = 0;
    camera.updateProjectionView();
    console.log('Camera reset to default position');
  }

  private lookAtOrigin(): void {
    if (!this.engineHelper || !this.engineHelper.camera) return;

    const camera = this.engineHelper.camera.getActiveCamera();
    camera.lookAt(0, 0, 0);
    camera.updateProjectionView();
    console.log('Camera looking at origin');
  }

  private resetCameraOrigin(): void {
    if (!this.engineHelper || !this.engineHelper.camera) return;

    const camera = this.engineHelper.camera.getActiveCamera();
    camera.position.originX = 0;
    camera.position.originY = 0;
    camera.position.originZ = 0;
    camera.dirtyOrigin = true;
    camera.dirtyQuat = true;
    camera.dirtyModel = true;
    camera.updateProjectionView();
    console.log('Camera rotation origin reset to (0,0,0)');
  }
}
