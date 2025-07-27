(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ExampleApp"] = factory();
	else
		root["ExampleApp"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./ExampleApp/Sphere.ts":
/*!******************************!*\
  !*** ./ExampleApp/Sphere.ts ***!
  \******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var index_1 = __webpack_require__(/*! ../dist/index */ "./dist/index.js");
var Sphere = /** @class */ (function (_super) {
    __extends(Sphere, _super);
    function Sphere(rect, vertexUvCacheId) {
        var _this = _super.call(this, rect, new index_1.TextureVertexModel()) || this;
        _this.vertexUvCacheId = vertexUvCacheId;
        return _this;
    }
    Sphere.prototype.render = function (engineHelper) {
        engineHelper.render(this.shaderEntity);
    };
    Sphere.prototype.init = function (engineHelper) {
        this.vertexModel = engineHelper.newVertexModelUv3d(this.vertexUvCacheId);
        _super.prototype.init.call(this, engineHelper);
    };
    return Sphere;
}(index_1.ModelObject3d));
exports["default"] = Sphere;


/***/ }),

/***/ "./ExampleApp/index.ts":
/*!*****************************!*\
  !*** ./ExampleApp/index.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var index_1 = __webpack_require__(/*! ../dist/index */ "./dist/index.js");
var Sphere_1 = __webpack_require__(/*! ./Sphere */ "./ExampleApp/Sphere.ts");
var World = /** @class */ (function (_super) {
    __extends(World, _super);
    function World() {
        return _super.call(this) || this;
    }
    World.prototype.render = function () {
        var _this = this;
        this.entities.forEach(function (ent) {
            if (ent)
                ent.render(_this.engineHelper);
        });
    };
    World.prototype.update = function () {
        var _this = this;
        this.entities.forEach(function (ent) {
            if (ent)
                ent.update(_this.engineHelper);
        });
        var _a = this.engineHelper.camera.camera3d.position, x = _a.x, y = _a.y, z = _a.z;
        if (this.sky)
            this.sky.center(x, y, z);
    };
    World.prototype.event = function (event) {
        _super.prototype.event.call(this, event);
        if (event.eventType === index_1.Events.DRAG) {
            this.engineHelper.camera.camera3d.angleY(-event.dxRaw);
            this.engineHelper.camera.camera3d.angleX(event.dyRaw);
            this.engineHelper.camera.camera3d.updateProjectionView();
        }
        return undefined;
    };
    World.prototype.loadResources = function () {
        this.engineHelper
            .getResource("assets/sphere.txt")
            .then(index_1.ResourceResolver.objResolverMultiple(this.engineHelper, [
            { textureSource: "assets/background.jpg", name: "background" },
            { textureSource: "assets/sun.png", name: "sun" }
        ]));
        this.engineHelper
            .getResource("assets/low_poly_tree.txt")
            .then(index_1.ResourceResolver.objResolver(this.engineHelper, "assets/low_poly_tree.png", "low_poly_tree"));
        this.engineHelper
            .getResource("assets/low_poly_girl.txt")
            .then(index_1.ResourceResolver.objResolver(this.engineHelper, "assets/low_poly_girl.png", "low_poly_girl"));
        this.engineHelper
            .getResource("assets/racing_car.txt")
            .then(index_1.ResourceResolver.objResolver(this.engineHelper, "assets/racing_car.png", "racing_car"));
        this.engineHelper
            .getResource("assets/paprika.fnt")
            .then(index_1.ResourceResolver.bmFontResolver(this.engineHelper));
        this.engineHelper
            .getResource("assets/atlas.txt")
            .then(index_1.ResourceResolver.bitmapResolver(this.engineHelper, 1024, 1024, 20e-3));
        this.engineHelper
            .getResource("/assets/missing-texture.txt")
            .then(index_1.ResourceResolver.bitmapResolver(this.engineHelper, 1184, 1184, 0));
    };
    World.prototype.init = function () {
        var _this = this;
        var length = 30;
        var width = 20;
        this.engineHelper.camera.camera3d.center(0, 2, length / 2 - 4);
        this.engineHelper.camera.camera3d.updateProjectionView();
        // Sky (Sphere)
        this.sky = new Sphere_1.default(new index_1.Rect3d(0.0, 2.0, 0.0, 30.0, 32.0, 30.0), "background");
        this.sky.setRenderType(index_1.RenderType.TRIANGLE);
        this.sky.init(this.engineHelper);
        this.addEntity(this.sky);
        // Low poly girl
        this.lowPolyGirl = new index_1.Object3d(new index_1.Rect3d(-4, 0.95, 5, 1.0, 1.0, 1.0), "low_poly_girl");
        this.lowPolyGirl.angleY(240);
        this.lowPolyGirl.scale(0.7, 0.7, 0.7);
        this.lowPolyGirl.setRenderType(index_1.RenderType.TRIANGLE);
        this.lowPolyGirl.init(this.engineHelper);
        this.addEntity(this.lowPolyGirl);
        // Racing car
        this.racingCar = new index_1.Object3d(new index_1.Rect3d(0, -0.25, 0, 1.5, 1.5, 1.5), "racing_car");
        this.racingCar.angleY(135);
        this.racingCar.setRenderType(index_1.RenderType.TRIANGLE);
        this.racingCar.init(this.engineHelper);
        this.addEntity(this.racingCar);
        // Ground (tiled)
        // this.ground = new Ground3d(
        //   new Rect3d(0.0, 0.0, 0.0, width, 0, length),
        //   "ground"
        // );
        // this.ground.init(this.engineHelper);
        // this.addEntity(this.ground);
        // // Cube 1
        // this.cube = new Cube(
        //   new Rect3d(-4, 2, -12, 1, 1, 1),
        //   "assets/atlas.png",
        //   ["wood", "cloth", "sky", "grass", "paper", "rock"]
        // );
        // this.cube.init(this.engineHelper);
        // this.addEntity(this.cube);
        // // Cube 2
        // this.cube2 = new Cube(
        //   new Rect3d(4, 2, 2, 1, 1, 1),
        //   "assets/atlas.png",
        //   ["wood", "cloth", "sky", "grass", "paper", "rock"]
        // );
        // this.cube2.init(this.engineHelper);
        // this.addEntity(this.cube2);
        // Sun (Sphere)
        this.sun = new Sphere_1.default(new index_1.Rect3d(0.0, 10, -15, 1.0, 1.0, 1.0), "sun");
        this.sun.setRenderType(index_1.RenderType.TRIANGLE);
        this.sun.init(this.engineHelper);
        this.addEntity(this.sun);
        // Low poly trees
        this.lowPolyTree = [];
        var treeCreator = function (l, w) {
            var tree = new index_1.Object3d(new index_1.Rect3d(l, 0, w, 1.0, 1.0, 1.0), "low_poly_tree");
            var heightRand = Math.random() * 0.8 - 0.8;
            var scale = 3.5 + heightRand;
            tree.scale(scale, scale, scale);
            tree.setRenderType(index_1.RenderType.TRIANGLE);
            tree.init(_this.engineHelper);
            _this.lowPolyTree.push(tree);
            _this.addEntity(tree);
        };
        for (var l = 0; l < length; l += 4) {
            treeCreator(-width / 2, l - length / 2);
            treeCreator(width / 2 - 1, l - length / 2);
        }
        for (var w = 1; w < width - 1; w += 4) {
            treeCreator(w - width / 2, -length / 2);
            treeCreator(w - width / 2, length / 2 - 1);
        }
        // Road (as a plane)
        var vertexModel = this.engineHelper.newVertexModel("road", index_1.PlaneType.XZ);
        this.road = new index_1.Plane3d(new index_1.Rect3d(0, 0.01, 0.0, 1, 1, 1), vertexModel);
        this.road.scale(3, 1, (2 * width) / Math.sqrt(2));
        this.road.angleY(-45);
        this.road.center(-2, 0.01, -15);
        this.road.init(this.engineHelper);
        this.addEntity(this.road);
        // initialise all the engine objects
        _super.prototype.init.call(this);
        this.engineHelper.setLighting(new index_1.Light({
            pos: [-20, 15, -20],
            in: [1.0, 1.0, 1.0],
            attenuation: 0.015,
            ambientCoeff: 0.3,
            at: [0.0, 0.0, 0.0]
        }));
    };
    return World;
}(index_1.ObjectManager));
exports["default"] = World;


/***/ }),

/***/ "./dist/AssetLoader/BitmapConfigParser.js":
/*!************************************************!*\
  !*** ./dist/AssetLoader/BitmapConfigParser.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports) {


var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var BitmapConfigParser = /** @class */ (function () {
    function BitmapConfigParser(raw, bitmapWidth, bitmapHeight, precision) {
        var _this = this;
        this.SOURCE_KEY = "$source =";
        this.map = raw
            .split("\n")
            .map(function (line) {
            return _this.processLine(bitmapWidth, bitmapHeight, precision, line);
        })
            .filter(function (e) { return !!e; })
            .reduce(function (sum, next) { return (__assign(__assign({}, sum), next)); });
        this.raw = raw
            .split("\n")
            .map(function (line) { return _this.processRawLine(line); })
            .filter(function (e) { return !!e; })
            .reduce(function (sum, next) { return (__assign(__assign({}, sum), next)); });
    }
    BitmapConfigParser.prototype.processRawLine = function (line) {
        if (line.startsWith(this.SOURCE_KEY)) {
            this.source = line
                .substr(line.indexOf(this.SOURCE_KEY) + this.SOURCE_KEY.length)
                .trim()
                .replace("\r", "")
                .replace("\n", "");
            if (window.location.origin === "file://") {
                console.info("file based loading should not have ./ in front of the source");
            }
            return;
        }
        else {
            return this.processTextureLine(line);
        }
    };
    BitmapConfigParser.prototype.processTextureLine = function (line) {
        var _a;
        var seperator = "\u0020";
        var nameindex = line.indexOf(seperator);
        var key = line.substr(0, nameindex);
        var temp = line.substr(nameindex + 1);
        temp = temp.substr(temp.indexOf(seperator) + 1);
        var leftindex = temp.indexOf(seperator);
        var left = parseFloat(temp.substr(0, leftindex + 1));
        temp = temp.substr(leftindex + 1);
        var topindex = temp.indexOf(seperator);
        var top = parseFloat(temp.substr(0, topindex));
        temp = temp.substr(topindex + 1);
        var widthIndex = temp.indexOf(seperator);
        var width = parseFloat(temp.substr(0, widthIndex));
        temp = temp.substr(widthIndex);
        var height = parseFloat(temp);
        return _a = {},
            _a[key] = [left, top, width, height],
            _a;
    };
    BitmapConfigParser.prototype.processLine = function (bitmapWidth, bitmapHeight, precision, line) {
        var _a;
        var seperator = "\u0020";
        var nameindex = line.indexOf(seperator);
        var key = line.substr(0, nameindex);
        var temp = line.substr(nameindex + 1);
        temp = temp.substr(temp.indexOf(seperator) + 1);
        var leftindex = temp.indexOf(seperator);
        var left = parseFloat(temp.substr(0, leftindex + 1));
        temp = temp.substr(leftindex + 1);
        var topindex = temp.indexOf(seperator);
        var top = parseFloat(temp.substr(0, topindex));
        temp = temp.substr(topindex + 1);
        var widthIndex = temp.indexOf(seperator);
        var width = parseFloat(temp.substr(0, widthIndex));
        temp = temp.substr(widthIndex);
        var height = parseFloat(temp);
        return _a = {},
            _a[key] = [
                (left + width) / bitmapWidth - precision,
                (height + top) / bitmapHeight - precision,
                (left + width) / bitmapWidth - precision,
                top / bitmapHeight + precision,
                left / bitmapWidth + precision,
                top / bitmapHeight + precision,
                left / bitmapWidth + precision,
                (top + height) / bitmapHeight - precision,
            ],
            _a;
    };
    BitmapConfigParser.prototype.getMap = function () {
        return this.map;
    };
    BitmapConfigParser.prototype.getTextureSource = function () {
        return this.source;
    };
    return BitmapConfigParser;
}());
exports["default"] = BitmapConfigParser;
//# sourceMappingURL=BitmapConfigParser.js.map

/***/ }),

/***/ "./dist/AssetLoader/FntFontReader.js":
/*!*******************************************!*\
  !*** ./dist/AssetLoader/FntFontReader.js ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var FontMetaData_1 = __webpack_require__(/*! ../Core/Data/FontMetaData */ "./dist/Core/Data/FontMetaData.js");
var FntFontReader = /** @class */ (function (_super) {
    __extends(FntFontReader, _super);
    function FntFontReader(raw) {
        var _this = _super.call(this) || this;
        var lines = raw.split("\n");
        _this.context = new FontMetaData_1.FontMeta();
        for (var lineIdx in lines) {
            if (!lines.hasOwnProperty(lineIdx)) {
                continue;
            }
            var line = lines[lineIdx];
            _this.parseWidth(_this.context, line);
            _this.parseHeight(_this.context, line);
            _this.parseFilename(_this.context, line);
            _this.parseLineHeight(_this.context, line);
            _this.parseChar(_this.context, line);
        }
        return _this;
    }
    FntFontReader.prototype.parseChar = function (context, line) {
        var match = line.match(FntFontReader.FONT_CHAR);
        if (match) {
            var font = new FontMetaData_1.FontCharacter();
            font.charCode = parseFloat(match[1]);
            font.x = parseFloat(match[2]);
            font.y = parseFloat(match[3]);
            font.width = parseFloat(match[4]);
            font.height = parseFloat(match[5]);
            font.xOffset = parseFloat(match[6]) / context.width;
            font.yOffset = parseFloat(match[7]) / context.height;
            font.char = String.fromCharCode(font.charCode);
            context.fonts[font.char] = font;
        }
    };
    FntFontReader.prototype.parseHeight = function (context, line) {
        if (!context.height) {
            var match = line.match(FntFontReader.HEIGHT);
            if (match) {
                context.height = parseFloat(match[1]);
            }
        }
    };
    FntFontReader.prototype.parseLineHeight = function (context, line) {
        if (!context.lineHeight) {
            var match = line.match(FntFontReader.LINE_HEIGHT);
            if (match) {
                context.lineHeight = parseFloat(match[1]);
            }
        }
    };
    FntFontReader.prototype.parseWidth = function (context, line) {
        if (!context.width) {
            var match = line.match(FntFontReader.WIDTH);
            if (match) {
                context.width = parseFloat(match[1]);
            }
        }
    };
    FntFontReader.prototype.parseFilename = function (context, line) {
        if (!context.filename) {
            var match = line.match(FntFontReader.FILENAME);
            if (match) {
                context.filename = match[1];
            }
        }
    };
    FntFontReader.FILENAME = /file="([\w\d\W\D]+)"/;
    FntFontReader.WIDTH = /scaleW=([\d]+)/;
    FntFontReader.HEIGHT = /scaleH=([\d]+)/;
    FntFontReader.LINE_HEIGHT = /lineHeight=([\d]+)/;
    FntFontReader.FONT_CHAR = new RegExp("char[\\s]+" +
        ["id", "x", "y", "width", "height", "xoffset", "yoffset"]
            .map(function (column) { return "".concat(column, "=([-\\d]+)[\\s]+"); })
            .reduce(function (sum, str) { return sum + str; }));
    return FntFontReader;
}(FontMetaData_1.default));
exports["default"] = FntFontReader;
//# sourceMappingURL=FntFontReader.js.map

/***/ }),

/***/ "./dist/AssetLoader/ResourceResolver.js":
/*!**********************************************!*\
  !*** ./dist/AssetLoader/ResourceResolver.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var FntFontReader_1 = __webpack_require__(/*! ./FntFontReader */ "./dist/AssetLoader/FntFontReader.js");
var BitmapConfigParser_1 = __webpack_require__(/*! ./BitmapConfigParser */ "./dist/AssetLoader/BitmapConfigParser.js");
var VertexParser_1 = __webpack_require__(/*! ./VertexParser */ "./dist/AssetLoader/VertexParser.js");
var ResourceResolver = /** @class */ (function () {
    function ResourceResolver() {
    }
    ResourceResolver.bmFontResolver = function (_) {
        return function (result) {
            result.registerFont(new FntFontReader_1.default(result.data));
            return result;
        };
    };
    ResourceResolver.bitmapResolver = function (engineHelper, bitmapWidth, bitmapHeight, precision) {
        return function (result) {
            var bitmapLoader = new BitmapConfigParser_1.default(result.data, bitmapWidth, bitmapHeight, precision);
            var textureSource = bitmapLoader.getTextureSource();
            for (var key in bitmapLoader.getMap()) {
                if (bitmapLoader.map.hasOwnProperty(key)) {
                    var uv = bitmapLoader.map[key];
                    engineHelper.addUVCache(textureSource, key, uv);
                }
            }
            return result;
        };
    };
    ResourceResolver.objResolverMultiple = function (engineHelper, sources) {
        return function (result) {
            sources.map(function (_a) {
                var textureSource = _a.textureSource, name = _a.name;
                return engineHelper.addVertexUvCache(textureSource, name, new VertexParser_1.default(result.data).vertices);
            });
        };
    };
    ResourceResolver.objResolver = function (engineHelper, textureSource, name) {
        return function (result) {
            engineHelper.addVertexUvCache(textureSource, name, new VertexParser_1.default(result.data).vertices);
        };
    };
    return ResourceResolver;
}());
exports["default"] = ResourceResolver;
//# sourceMappingURL=ResourceResolver.js.map

/***/ }),

/***/ "./dist/AssetLoader/VertexParser.js":
/*!******************************************!*\
  !*** ./dist/AssetLoader/VertexParser.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var VertexParser = /** @class */ (function () {
    function VertexParser(raw) {
        if (typeof raw === "string") {
            this.vertices = raw.split(",").map(parseFloat);
        }
        else if (raw instanceof Array) {
            this.vertices = raw;
        }
        else {
            console.error("Unexpected obj type");
        }
    }
    return VertexParser;
}());
exports["default"] = VertexParser;
//# sourceMappingURL=VertexParser.js.map

/***/ }),

/***/ "./dist/Core/App.js":
/*!**************************!*\
  !*** ./dist/Core/App.js ***!
  \**************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppSubscription = exports.WebGLContainer = void 0;
var Camera_1 = __webpack_require__(/*! ./Camera */ "./dist/Core/Camera.js");
var Updater_1 = __webpack_require__(/*! ./Updater */ "./dist/Core/Updater.js");
var Renderer_1 = __webpack_require__(/*! ./Renderer */ "./dist/Core/Renderer.js");
var EngineHelper_1 = __webpack_require__(/*! ./EngineHelper */ "./dist/Core/EngineHelper.js");
var Events_1 = __webpack_require__(/*! ./Events */ "./dist/Core/Events.js");
var Timer_1 = __webpack_require__(/*! ./Common/Timer */ "./dist/Core/Common/Timer.js");
var NotificationQueue_1 = __webpack_require__(/*! ./Common/NotificationQueue */ "./dist/Core/Common/NotificationQueue.js");
var SubscriberPool_1 = __webpack_require__(/*! ./Common/SubscriberPool */ "./dist/Core/Common/SubscriberPool.js");
var WebGLContainer = /** @class */ (function () {
    function WebGLContainer(elementId, parentElement, aspectRatio, isFullScreen, restoreContentFn) {
        this.isFullScreen = isFullScreen;
        this.aspectRatio = aspectRatio;
        this.canvas = document.createElement("canvas");
        if (elementId) {
            this.canvas.id = elementId;
        }
        else {
            this.canvas.id = "app";
        }
        this.canvas.addEventListener("webglcontextlost", function (event) { return event.preventDefault(); }, false);
        this.canvas.addEventListener("webglcontextrestored", restoreContentFn, false);
        parentElement.appendChild(this.canvas);
    }
    WebGLContainer.prototype.delete = function () {
        this.canvas.style.display = "none";
        if (this.canvas.parentElement) {
            this.canvas.parentElement.removeChild(this.canvas);
        }
    };
    WebGLContainer.prototype.resize = function (measureElement) {
        var width = measureElement.offsetWidth;
        var height = width / this.getAspectRatio();
        if (this.isFullScreen) {
            width = window.innerWidth;
            height = window.innerHeight;
        }
        this.canvas.width = width * window.devicePixelRatio;
        this.canvas.height = height * window.devicePixelRatio;
        this.canvas.style.height = "".concat(height, "px");
        this.canvas.style.width = "".concat(width, "px");
    };
    WebGLContainer.prototype.getAspectRatio = function () {
        var aspectRatio = this.aspectRatio;
        if (!aspectRatio) {
            var width = window.innerWidth ||
                document.documentElement.clientWidth ||
                document.body.clientWidth;
            var height = window.innerHeight ||
                document.documentElement.clientHeight ||
                document.body.clientHeight;
            aspectRatio = width / height;
        }
        return aspectRatio;
    };
    WebGLContainer.prototype.getCtx = function () {
        var ctx = this.canvas.getContext("webgl") ||
            this.canvas.getContext("experimental-webgl");
        if (!ctx) {
            throw new Error("WebGL not avaliable");
        }
        return ctx;
    };
    return WebGLContainer;
}());
exports.WebGLContainer = WebGLContainer;
var AppSubscription = /** @class */ (function () {
    function AppSubscription() {
    }
    AppSubscription.START_ITERATION = new SubscriberPool_1.Subscription("App#StartIteration");
    AppSubscription.GET_FPS = new SubscriberPool_1.Subscription("App#GetFPS");
    return AppSubscription;
}());
exports.AppSubscription = AppSubscription;
var App = /** @class */ (function () {
    function App(args) {
        var _this = this;
        this.ready = false;
        this.isPaused = true;
        this.frameTime = 0.0;
        this.framesElapsed = 0;
        this.setup = function () {
            var args = _this.args;
            _this.timer = new Timer_1.default();
            _this.camera = new Camera_1.default();
            _this.updater = new Updater_1.default(args);
            _this.renderer = new Renderer_1.default(args, _this.webGLContainer, _this.camera, _this.notificationQueue, _this.subscriberPool);
            _this.camera.setupCamera(args.camera, args.aspectRatio, _this.webGLContainer.canvas);
            _this.engineHelper = new EngineHelper_1.default(_this.notificationQueue, _this.subscriberPool, _this.camera);
            _this.world = _this.args.world;
            _this.world.setEngineHelper(_this.engineHelper);
        };
        this.onEvent = function (event) {
            if (event.eventType === Events_1.default.RESIZE) {
                _this.resizeScreen();
            }
            if (_this.world) {
                _this.world.event(event);
            }
            return true;
        };
        this.destroy = function () {
            clearInterval(_this.interval);
            _this.renderer.delete();
            Events_1.event.delete(_this.onEvent);
            _this.webGLContainer.delete();
            console.log("destroying", _this);
        };
        this.animationFrame = function () {
            if (!_this.ready) {
                return;
            }
            try {
                _this.updater.update(_this.timer.peak(), _this.engineHelper);
                _this.renderer.render(_this.timer.peak(), _this.engineHelper);
                _this.notifyFrames();
                _this.timer.start();
            }
            catch (error) {
                console.error(error);
                clearInterval(_this.interval);
                if (_this.errorCallback) {
                    _this.errorCallback(error);
                }
            }
        };
        this.startIteration = function () { return requestAnimationFrame(_this.animationFrame); };
        this.notifyFrames = function () {
            _this.frameTime += _this.timer.peak();
            _this.framesElapsed++;
            if (_this.framesElapsed === 60) {
                if (_this.args.subscribe) {
                    _this.args.subscribe({
                        fps: (1000.0 / _this.frameTime) * _this.framesElapsed,
                    });
                }
                _this.framesElapsed = 0;
                _this.frameTime = 0;
            }
        };
        this.startRunLoop = function () {
            _this.timer.start();
            var fps = _this.fps;
            _this.interval = setInterval(function () {
                if (!_this.isPaused) {
                    _this.animationFrame();
                }
                if (_this.isStepRender) {
                    clearInterval(_this.interval);
                    _this.interval = undefined;
                }
                if (_this.fps !== fps) {
                    clearInterval(_this.interval);
                    _this.interval = undefined;
                    _this.startRunLoop();
                }
            }, fps);
        };
        this.initSystem = function () {
            _this.initFont();
            _this.world.init(_this.engineHelper);
            _this.renderer.init();
            return _this.engineHelper.getAllResourcesLoading();
        };
        this.loadResources = function (resources) {
            _this.world.loadResources(resources);
            return _this.engineHelper.getAllResourcesLoading();
        };
        this.runApp = function () {
            _this.ready = true;
            if (!_this.isStepRender) {
                _this.startRunLoop();
            }
            else {
                _this.animationFrame();
            }
        };
        this.onRunError = function (error) {
            clearInterval(_this.interval);
            console.error(error);
            throw error;
        };
        this.run = function () {
            console.log("Running", _this);
            var startTime = new Date();
            return _this.loadResources(_this.args.resources)
                .then(_this.initSystem)
                .then(_this.renderer.bindBuffer)
                .then(_this.runApp)
                .then(function () {
                return console.log("startup time: ".concat(new Date().getTime() - startTime.getTime()));
            })
                .then(function () {
                return new Promise(function (resolve) {
                    setTimeout(resolve, 1);
                });
            })
                .catch(_this.onRunError);
        };
        this.resizeCanvas = function (measureElement) {
            _this.webGLContainer.resize(measureElement);
        };
        this.resizeScreen = function () {
            var measureElement = document.getElementById(_this.args.elementId);
            _this.resizeCanvas(measureElement);
            _this.camera.setupCamera(_this.args.camera, _this.args.aspectRatio, _this.webGLContainer.canvas);
            _this.notificationQueue.push(Renderer_1.RendererNotification.RESIZE_SCREEN);
            if (_this.isStepRender && _this.ready) {
                _this.animationFrame();
            }
        };
        this.buildCanvas = function (args) {
            if (_this.webGLContainer) {
                return;
            }
            var appElement = document.body;
            if (args.elementId) {
                appElement = document.getElementById(args.elementId);
            }
            _this.webGLContainer = new WebGLContainer(args.canvasId, appElement, args.aspectRatio, args.isFullScreen, _this.setup);
            _this.resizeCanvas(appElement);
        };
        this.reset = function () {
            if (_this.world) {
                _this.world.reset();
            }
            else {
                console.error("Game Delegate not ready to call reset");
            }
        };
        this.toggleShow = function () {
            if (_this.isVisible) {
                _this.hide();
            }
            else {
                _this.show();
            }
        };
        this.show = function () {
            _this.webGLContainer.canvas.style.display = "initial";
            _this.resizeScreen();
            _this.isVisible = true;
        };
        this.hide = function () {
            _this.webGLContainer.canvas.style.display = "none";
            _this.isVisible = false;
        };
        this.togglePause = function () {
            _this.isPaused = !_this.isPaused;
        };
        this.pause = function () {
            _this.isPaused = true;
        };
        this.unpause = function () {
            _this.isPaused = false;
        };
        if (!args) {
            throw new Error("no args passed into App");
        }
        this.notificationQueue = new NotificationQueue_1.default();
        this.subscriberPool = new SubscriberPool_1.default();
        this.subscriberPool.listen(AppSubscription.START_ITERATION, this.startIteration);
        this.args = args;
        this.buildCanvas(args);
        this.isStepRender = args.isStepRender || false;
        Events_1.event.bind(this.onEvent, this.webGLContainer);
        Events_1.event.setThrottle(args.eventThrottle || 1000.0 / 25.0);
        this.errorCallback = args.error;
        this.setup();
        if (args.clearColour) {
            this.renderer.glContext.setClearColor(args.clearColour);
        }
        this.setFPS(args.fps);
    }
    App.prototype.setFPS = function (fps) {
        this.fps = 1000.0 / fps || 1000.0 / 30.0;
        this.subscriberPool.publish(AppSubscription.GET_FPS, this.fps);
    };
    App.prototype.toggleStepRender = function (run) {
        if (run === void 0) { run = !this.isStepRender; }
        this.isStepRender = run;
        if (!this.isStepRender && !this.interval) {
            this.startRunLoop();
        }
    };
    App.prototype.initFont = function () {
        this.engineHelper.initFont();
    };
    return App;
}());
exports["default"] = App;
//# sourceMappingURL=App.js.map

/***/ }),

/***/ "./dist/Core/Buffer/ArrayBuffer.js":
/*!*****************************************!*\
  !*** ./dist/Core/Buffer/ArrayBuffer.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var ArrayBuffer = /** @class */ (function () {
    function ArrayBuffer(ctx) {
        this.bufferArray = [];
        this.verticeSize = 0;
        this.bufferReg = {};
        this.bufferRegId = 1;
        this.deleted = false;
        this.isBuffered = false;
        this.bufferid = ctx.createBuffer();
        this.ctx = ctx;
        ctx.bindBuffer(ctx.ARRAY_BUFFER, this.bufferid);
    }
    ArrayBuffer.prototype.delete = function () {
        this.ctx.deleteBuffer(this.bufferid);
        this.deleted = true;
    };
    ArrayBuffer.prototype.bufferBind = function () {
        if (this.deleted) {
            return;
        }
        this.isBuffered = true;
        this.bind();
        if (!this.isBuffered) {
            this.maxSize = 200000;
        }
        else {
            this.maxSize = this.bufferArray.length * 2.0;
        }
        var buffer = new Float32Array(this.maxSize);
        buffer.fill(0, this.bufferArray.length);
        buffer.set(this.bufferArray);
        this.ctx.bufferData(this.ctx.ARRAY_BUFFER, buffer, this.ctx.STATIC_DRAW);
    };
    ArrayBuffer.prototype.length = function () {
        return this.verticeSize;
    };
    ArrayBuffer.prototype.bufferSub = function (offset, data, vertexSize) {
        if (this.deleted) {
            return;
        }
        this.bind();
        this.ctx.bufferSubData(this.ctx.ARRAY_BUFFER, offset * Float32Array.BYTES_PER_ELEMENT * vertexSize, new Float32Array(data));
    };
    ArrayBuffer.prototype.reset = function () {
        this.bufferArray = [];
    };
    ArrayBuffer.prototype.push = function (vertices, size) {
        this.bufferArray = this.bufferArray.concat(vertices);
        this.verticeSize += size;
        if (this.isBuffered) {
            if (this.bufferArray.length < this.maxSize) {
                this.bufferSub(this.verticeSize - size, vertices, vertices.length / size);
            }
            else {
                this.bufferBind();
                console.log("buffer resizing as limit has been reached");
            }
        }
    };
    ArrayBuffer.prototype.bind = function () {
        if (this.deleted === true) {
            return;
        }
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.bufferid);
    };
    ArrayBuffer.prototype.unbind = function () {
        // do nothing for now
    };
    return ArrayBuffer;
}());
exports["default"] = ArrayBuffer;
//# sourceMappingURL=ArrayBuffer.js.map

/***/ }),

/***/ "./dist/Core/Buffer/Texture.js":
/*!*************************************!*\
  !*** ./dist/Core/Buffer/Texture.js ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var TextureLoader = /** @class */ (function () {
    function TextureLoader() {
    }
    TextureLoader.prototype.loadImage = function (src) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.image = document.createElement("img");
            if (window.location.origin !== "file://") {
                _this.image.crossOrigin = "anonymous";
            }
            _this.image.onload = function () { return resolve(); };
            _this.image.onerror = function (error) { return reject(error); };
            _this.image.src = src;
        });
    };
    return TextureLoader;
}());
var Texture = /** @class */ (function (_super) {
    __extends(Texture, _super);
    function Texture(src, ctx) {
        var _this = _super.call(this) || this;
        _this.isLoaded = false;
        _this.isError = false;
        _this.load = _this.loadImage(src)
            .then(function () { return _this.onLoad(ctx); })
            .catch(function (error) { return _this.onError(error); });
        return _this;
    }
    Texture.prototype.onError = function (error) {
        this.isError = true;
        this.isLoaded = false;
        throw error;
    };
    Texture.prototype.onLoad = function (ctx) {
        this.handleTextureLoaded(this.image, ctx);
        this.isLoaded = true;
        this.width = this.image.width;
        this.height = this.image.height;
        return true;
    };
    Texture.prototype.newTextureUnit = function () {
        return Texture.textureCount++;
    };
    Texture.prototype.bindTexture = function (ctx, sampler) {
        if (this.isLoaded) {
            ctx.uniform1i(sampler, this.texUnit);
        }
    };
    Texture.prototype.handleTextureLoaded = function (image, ctx) {
        this.texUnit = this.newTextureUnit();
        ctx.activeTexture(ctx.TEXTURE0 + this.texUnit);
        this.texture = this.createTextureFromImage(image, ctx);
    };
    Texture.prototype.createTextureFromImage = function (image, ctx) {
        var texture = ctx.createTexture();
        ctx.bindTexture(ctx.TEXTURE_2D, texture);
        ctx.texParameterf(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
        ctx.texParameterf(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST);
        ctx.texParameterf(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
        ctx.texParameterf(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
        ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, image);
        return texture;
    };
    Texture.textureCount = 0;
    return Texture;
}(TextureLoader));
exports["default"] = Texture;
//# sourceMappingURL=Texture.js.map

/***/ }),

/***/ "./dist/Core/Builder/ConfigMapBuilder.js":
/*!***********************************************!*\
  !*** ./dist/Core/Builder/ConfigMapBuilder.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConfigEntity = void 0;
var BasicSprite_1 = __webpack_require__(/*! ../../Entity/BasicSprite */ "./dist/Entity/BasicSprite.js");
var LineColour_1 = __webpack_require__(/*! ../../Entity/LineColour */ "./dist/Entity/LineColour.js");
var Moveable_1 = __webpack_require__(/*! ../../Entity/Moveable */ "./dist/Entity/Moveable.js");
var Plane2d_1 = __webpack_require__(/*! ../../Entity/Plane2d */ "./dist/Entity/Plane2d.js");
var Plane3d_1 = __webpack_require__(/*! ../../Entity/Plane3d */ "./dist/Entity/Plane3d.js");
var PlaneColour_1 = __webpack_require__(/*! ../../Entity/PlaneColour */ "./dist/Entity/PlaneColour.js");
var SpriteModel_1 = __webpack_require__(/*! ../../Entity/SpriteModel */ "./dist/Entity/SpriteModel.js");
var SpriteMoveable_1 = __webpack_require__(/*! ../../Entity/SpriteMoveable */ "./dist/Entity/SpriteMoveable.js");
var TriangleColour2d_1 = __webpack_require__(/*! ../../Entity/TriangleColour2d */ "./dist/Entity/TriangleColour2d.js");
var Coordinate_1 = __webpack_require__(/*! ../Data/Coordinate */ "./dist/Core/Data/Coordinate.js");
var Rect2d_1 = __webpack_require__(/*! ../Data/Rect2d */ "./dist/Core/Data/Rect2d.js");
var Rect3d_1 = __webpack_require__(/*! ../Data/Rect3d */ "./dist/Core/Data/Rect3d.js");
var EngineObject_1 = __webpack_require__(/*! ../EngineEntity/EngineObject */ "./dist/Core/EngineEntity/EngineObject.js");
var Events_1 = __webpack_require__(/*! ../Events */ "./dist/Core/Events.js");
var Font_1 = __webpack_require__(/*! ../Font/Font */ "./dist/Core/Font/Font.js");
var Physics_1 = __webpack_require__(/*! ../Physics/Physics */ "./dist/Core/Physics/Physics.js");
var ConfigMapBuilder = /** @class */ (function () {
    function ConfigMapBuilder(engineHelper) {
        this.engineHelper = engineHelper;
        this.objects = [];
        this.ref = {};
        this.anchor = {};
        this.texts = [];
    }
    ConfigMapBuilder.prototype.build = function (map) {
        for (var prop in map) {
            if (map.hasOwnProperty(prop)) {
                if (prop.startsWith("$")) {
                    this.ref[prop] = map[prop];
                }
                else if (prop.startsWith("+")) {
                    this.anchor[prop] = map[prop];
                }
                else {
                    var object = map[prop];
                    this.initObjectPosition(object);
                    if (object.$ref && this.ref[object.$ref]) {
                        // merge ref with object
                        object = __assign(__assign({}, this.ref[object.$ref]), object);
                    }
                    if (object.$anchor && this.anchor[object.$anchor]) {
                        var anchor = this.anchor[object.$anchor];
                        // translate anchor
                        if (object.type === "Font") {
                            object.position.x += anchor.position.x;
                            object.position.y += anchor.position.y;
                        }
                        else {
                            object.position.x += anchor.position.x;
                            object.position.y += anchor.position.y;
                            object.position.width += anchor.position.width;
                            object.position.height += anchor.position.height;
                        }
                    }
                    this.buildModel(object);
                }
            }
        }
    };
    ConfigMapBuilder.prototype.initObjectPosition = function (object) {
        if (!object.position) {
            object.position = { x: 0, y: 0, height: 0, width: 0 };
        }
        else {
            if (!object.position.x) {
                object.position.x = 0;
            }
            if (!object.position.y) {
                object.position.y = 0;
            }
            if (!object.position.width) {
                object.position.width = 0;
            }
            if (!object.position.height) {
                object.position.height = 0;
            }
        }
    };
    ConfigMapBuilder.prototype.buildModel = function (config) {
        if (!config.type) {
            console.error("unable to parse empty type for object", config);
            return null;
        }
        var obj = null;
        if (config.type === "Plane2D") {
            obj = this.createPlane2D(config.model, this.createRect2d(config.position, config.isCentre), config.hasPhysics);
            this.hookCustomHandler(config, obj);
        }
        else if (config.type === "Plane3D") {
            obj = this.createPlane3D(config.model, this.createRect3d(config.position, config.isCentre), config.hasPhysics, config.planeType);
            this.hookCustomHandler(config, obj);
        }
        else if (config.type === "Triangle") {
            obj = this.createTriangle(config.rgba, this.createRect2d(config.position, config.isCentre));
            this.hookCustomHandler(config, obj);
        }
        else if (config.type === "SpriteMoveable") {
            obj = this.createSpriteMoveable(config.spriteModel, this.createRect2d(config.position, config.isCentre), config.hasPhysics, config.ticks);
            this.hookCustomHandler(config, obj);
        }
        else if (config.type === "Moveable") {
            obj = this.createMoveable(config.model, this.createRect2d(config.position, config.isCentre), config.hasPhysics);
            this.hookCustomHandler(config, obj);
        }
        else if (config.type === "Sprite") {
            obj = this.createSprite(config.spriteModel, this.createRect2d(config.position, config.isCentre), config.hasPhysics, config.ticks);
            this.hookCustomHandler(config, obj);
        }
        else if (config.type === "Font") {
            obj = this.createText(config.texture, this.createCoordinate(config.position), config.fontSize, config.text);
            obj.id = config.id;
        }
        else if (config.type === "Colour") {
            obj = this.createColour(config.rgba, this.createRect2d(config.position, config.isCentre));
            this.hookCustomHandler(config, obj);
        }
        else if (config.type === "Line") {
            obj = this.createLineColour(config.rgba, config.point1, config.point2, config.thickness);
            this.hookCustomHandler(config, obj);
        }
        else {
            console.warn("Unable to find entity of type ".concat(config.type));
        }
        if (obj instanceof EngineObject_1.default) {
            obj.$id = config.id || obj.$id;
            obj.data = config.data;
            obj.isLastEvent = config.isLastEvent || false;
        }
        if (obj instanceof EngineObject_1.default || obj instanceof Font_1.FontReference) {
            if (config.isTop) {
                obj.setTop(true);
            }
        }
        if (obj instanceof EngineObject_1.default && config.clone) {
            obj.setClone(true);
        }
        // @ts-expect-error ignore
        return obj;
    };
    ConfigMapBuilder.prototype.hookCustomHandler = function (config, object) {
        var _this = this;
        if (config.render) {
            var _renderCustom_1;
            if (typeof window[config.render] === "function") {
                _renderCustom_1 = window[config.render].bind(object);
            }
            else if (typeof config.render === "function") {
                _renderCustom_1 = config.render;
            }
            else {
                _renderCustom_1 = function () { };
            }
            var _render_1 = object.render.bind(object);
            object.render = function (engineHelper) {
                _render_1(engineHelper);
                _renderCustom_1(engineHelper);
            };
        }
        if (config.update) {
            var _updateCustom_1;
            if (typeof window[config.update] === "function") {
                _updateCustom_1 = window[config.update].bind(object);
            }
            else if (typeof config.update === "function") {
                _updateCustom_1 = config.update;
            }
            else {
                _updateCustom_1 = function () { };
            }
            var _update_1 = object.update.bind(object);
            object.update = function (engineHelper) {
                _update_1(engineHelper);
                _updateCustom_1(engineHelper);
            };
        }
        var onClickedDefined = config.onClick && typeof config.onClick === "function";
        if (config.event) {
            var _eventCustom_1;
            if (typeof window[config.event] === "function") {
                _eventCustom_1 = window[config.event].bind(object);
            }
            else if (typeof config.event === "function") {
                _eventCustom_1 = config.event;
            }
            else {
                _eventCustom_1 = function () { };
            }
            var _event_1 = object.event.bind(object);
            object.event = function (event, engineHelper) {
                var shouldPropagate = true;
                // only stop propagation if the event returns false
                shouldPropagate =
                    shouldPropagate && _event_1(event, engineHelper) !== false;
                shouldPropagate =
                    shouldPropagate &&
                        _eventCustom_1(event, engineHelper, object) !== false;
                if (onClickedDefined) {
                    shouldPropagate =
                        shouldPropagate &&
                            _this.isClicked(event, engineHelper, object, config.onClick) !==
                                false;
                }
                return shouldPropagate;
            };
        }
        else if (onClickedDefined) {
            var _event_2 = object.event.bind(object);
            object.event = function (event, engineHelper) {
                var shouldPropagate = _event_2(event, engineHelper) !== false;
                shouldPropagate =
                    shouldPropagate &&
                        _this.isClicked(event, engineHelper, object, config.onClick) !== false;
                return shouldPropagate;
            };
        }
    };
    ConfigMapBuilder.prototype.isClicked = function (event, engineHelper, object, onClick) {
        if (event.eventType === Events_1.default.UP &&
            engineHelper.isClicked(event, object.getRect2()) &&
            object.hidden === false) {
            return onClick.bind(object)(event, engineHelper, object);
        }
    };
    ConfigMapBuilder.prototype.createRect2d = function (position, isCentre) {
        var rect = new Rect2d_1.default(Number(position.x), Number(position.y), Number(position.width), Number(position.height), 0);
        return isCentre ? rect.center() : rect;
    };
    ConfigMapBuilder.prototype.createRect3d = function (position, isCentre) {
        var rect = new Rect3d_1.default(Number(position.x), Number(position.y), Number(position.z), Number(position.width), Number(position.height), Number(position.length));
        return isCentre ? rect.center() : rect;
    };
    ConfigMapBuilder.prototype.createCoordinate = function (position) {
        return new Coordinate_1.default(Number(position.x), Number(position.y), 0);
    };
    ConfigMapBuilder.prototype.createText = function (texture, pos, fontSize, text) {
        var textRef = Font_1.FontReference.newFont(pos, texture, 0)
            .setText(text)
            .setFontSize(fontSize);
        this.texts.push(textRef);
        return textRef;
    };
    ConfigMapBuilder.prototype.createLineColour = function (rgba, point1, point2, thickness) {
        var colour = new LineColour_1.default(point1, point2, thickness, rgba);
        this.objects.push(colour);
        return colour;
    };
    ConfigMapBuilder.prototype.createColour = function (rgba, location) {
        var colour = new PlaneColour_1.default(location, rgba);
        this.objects.push(colour);
        return colour;
    };
    ConfigMapBuilder.prototype.createSpriteMoveable = function (model, location, hasPhysics, ticks) {
        var spriteModel = new SpriteModel_1.default(location, ticks || 120.0, model);
        var obj = new SpriteMoveable_1.default(location, spriteModel);
        spriteModel.position.z = -1;
        spriteModel.scaleZ(0);
        if (hasPhysics) {
            Physics_1.default.registerPhysics(obj, obj.physics);
        }
        this.objects.push(obj);
        return obj;
    };
    ConfigMapBuilder.prototype.createMoveable = function (model, location, hasPhysics) {
        var obj = new Plane2d_1.default(location, model);
        obj.setLayer(-1);
        var moveable = new Moveable_1.default();
        moveable.entities.push(obj);
        moveable.rotateZ(180.0);
        moveable.setRect(location);
        if (hasPhysics) {
            Physics_1.default.registerPhysics(moveable, moveable.physics);
        }
        moveable.updatePhysicsPosition();
        this.objects.push(moveable);
        return moveable;
    };
    ConfigMapBuilder.prototype.createSprite = function (model, location, hasPhysics, ticks) {
        var spriteModel = new SpriteModel_1.default(location, ticks || 120.0, model);
        var obj = new BasicSprite_1.default(location, spriteModel);
        spriteModel.position.z = -1;
        spriteModel.rotateZ(180.0);
        spriteModel.scaleZ(0);
        if (hasPhysics) {
            Physics_1.default.registerPhysics(obj, obj.physics);
        }
        this.objects.push(obj);
        return obj;
    };
    ConfigMapBuilder.prototype.createPlane2D = function (model, location, hasPhysics) {
        var obj = new Plane2d_1.default(location, model);
        obj.rotateZ(180.0);
        if (hasPhysics) {
            Physics_1.default.registerPhysics(obj);
        }
        this.objects.push(obj);
        return obj;
    };
    ConfigMapBuilder.prototype.createPlane3D = function (model, location, hasPhysics, plane) {
        var vertexModel = this.engineHelper.newVertexModel(model, plane);
        var obj = new Plane3d_1.default(location, vertexModel);
        if (hasPhysics) {
            Physics_1.default.registerPhysics(obj);
        }
        this.objects.push(obj);
        return obj;
    };
    ConfigMapBuilder.prototype.createTriangle = function (rgba, location) {
        var obj = new TriangleColour2d_1.default(location, rgba);
        this.objects.push(obj);
        return obj;
    };
    return ConfigMapBuilder;
}());
var ConfigEntity = /** @class */ (function () {
    function ConfigEntity() {
    }
    return ConfigEntity;
}());
exports.ConfigEntity = ConfigEntity;
exports["default"] = ConfigMapBuilder;
//# sourceMappingURL=ConfigMapBuilder.js.map

/***/ }),

/***/ "./dist/Core/Builder/ShaderEntityBuilder.js":
/*!**************************************************!*\
  !*** ./dist/Core/Builder/ShaderEntityBuilder.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var ShaderEntity_1 = __webpack_require__(/*! ../EngineEntity/ShaderEntity */ "./dist/Core/EngineEntity/ShaderEntity.js");
var ShaderEntityBuilder = /** @class */ (function () {
    function ShaderEntityBuilder(engineHelper) {
        this.engineHelper = engineHelper;
    }
    ShaderEntityBuilder.prototype.createTexture = function (textureSource) {
        this.textureSource = textureSource;
        this.hasTexture = true;
        return this;
    };
    ShaderEntityBuilder.prototype.addBuffer = function (vertexModel) {
        this.vertexModel = vertexModel;
        return this;
    };
    ShaderEntityBuilder.prototype.build = function (engineObject, opt) {
        if (!this.vertexModel) {
            console.error("VertexModel is undefined", this);
        }
        var entity = new ShaderEntity_1.ShaderEntity();
        var entityOption = entity.getOpt();
        entityOption.renderType = opt.renderType;
        entityOption.shaderType = opt.shaderType;
        entity.model = engineObject.getModel;
        entity.modelPosition = function () { return engineObject.position; };
        entity.vertexModel = this.vertexModel;
        entity.vertexModel.registerModel(this.engineHelper);
        this.engineHelper.registerEntity(entity);
        if (this.hasTexture) {
            entity.src = this.textureSource;
            this.engineHelper.createTexture(entity);
        }
        return entity;
    };
    ShaderEntityBuilder.clone = function (shaderEntity) {
        return Object.assign(new ShaderEntity_1.ShaderEntity(), shaderEntity);
    };
    return ShaderEntityBuilder;
}());
exports["default"] = ShaderEntityBuilder;
//# sourceMappingURL=ShaderEntityBuilder.js.map

/***/ }),

/***/ "./dist/Core/Builder/VertexBuilder.js":
/*!********************************************!*\
  !*** ./dist/Core/Builder/VertexBuilder.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VertexBuilder = void 0;
var PlaneType_1 = __webpack_require__(/*! ../Data/PlaneType */ "./dist/Core/Data/PlaneType.js");
var VertexBuilder = /** @class */ (function () {
    function VertexBuilder() {
    }
    VertexBuilder.prototype.toArray2D = function (vertexes) {
        var vertexConstruct = [];
        for (var key in vertexes) {
            if (vertexes.hasOwnProperty(key)) {
                var _vertex = vertexes[key];
                vertexConstruct.push(_vertex.vertex.x);
                vertexConstruct.push(_vertex.vertex.y);
                vertexConstruct.push(_vertex.vertex.z);
                vertexConstruct.push(_vertex.normal.x);
                vertexConstruct.push(_vertex.normal.y);
                vertexConstruct.push(_vertex.normal.z);
                vertexConstruct.push(_vertex.texture.u);
                vertexConstruct.push(_vertex.texture.v);
            }
        }
        return vertexConstruct;
    };
    VertexBuilder.prototype.toTextureArray = function (vertexes) {
        var vertexConstruct = [];
        for (var key in vertexes) {
            if (vertexes.hasOwnProperty(key)) {
                var _vertex = vertexes[key];
                vertexConstruct.push(_vertex.vertex.x);
                vertexConstruct.push(_vertex.vertex.y);
                vertexConstruct.push(_vertex.vertex.z);
                vertexConstruct.push(_vertex.normal.x);
                vertexConstruct.push(_vertex.normal.y);
                vertexConstruct.push(_vertex.normal.z);
                vertexConstruct.push(_vertex.texture.u);
                vertexConstruct.push(_vertex.texture.v);
            }
        }
        return vertexConstruct;
    };
    VertexBuilder.prototype.toColourArray = function (vertexes) {
        var vertexConstruct = [];
        for (var key in vertexes) {
            if (vertexes.hasOwnProperty(key)) {
                var _vertex = vertexes[key];
                vertexConstruct.push(_vertex.vertex.x);
                vertexConstruct.push(_vertex.vertex.y);
                vertexConstruct.push(_vertex.vertex.z);
                vertexConstruct.push(_vertex.colour.r);
                vertexConstruct.push(_vertex.colour.g);
                vertexConstruct.push(_vertex.colour.b);
                vertexConstruct.push(_vertex.colour.a);
            }
        }
        return vertexConstruct;
    };
    VertexBuilder.prototype.triangleXYColour = function (colour) {
        var r = colour.r / 255.0;
        var g = colour.g / 255.0;
        var b = colour.b / 255.0;
        var a = colour.a / 255.0;
        var _colour = [
            1,
            1,
            0,
            r,
            g,
            b,
            a,
            0,
            1,
            0,
            r,
            g,
            b,
            a,
            0,
            0,
            0,
            r,
            g,
            b,
            a,
        ];
        return _colour;
    };
    VertexBuilder.prototype.planeXYColour = function (colour) {
        var r = colour.r / 255.0;
        var g = colour.g / 255.0;
        var b = colour.b / 255.0;
        var a = colour.a / 255.0;
        var _colour = [
            -0.5,
            -0.5,
            0,
            r,
            g,
            b,
            a,
            0.5,
            -0.5,
            0,
            r,
            g,
            b,
            a,
            -0.5,
            0.5,
            0,
            r,
            g,
            b,
            a,
            0.5,
            0.5,
            0,
            r,
            g,
            b,
            a,
        ];
        return _colour;
    };
    VertexBuilder.prototype.planeCCW = function (loc, width, height) {
        var left = loc[0];
        var top = loc[1];
        var right = loc[2];
        var bottom = loc[3];
        var uv = [
            left / width,
            bottom / height,
            left / width,
            top / height,
            right / width,
            top / height,
            right / width,
            bottom / height,
        ];
        return uv;
    };
    VertexBuilder.prototype.planeCW = function (loc, width, height) {
        var left = loc[0];
        var top = loc[1];
        var right = loc[2];
        var bottom = loc[3];
        var uv = [
            right / width,
            bottom / height,
            right / width,
            top / height,
            left / width,
            top / height,
            left / width,
            bottom / height,
        ];
        return uv;
    };
    VertexBuilder.prototype.planeUV = function (vertices, uv) {
        vertices[0].texture.u = uv[4];
        vertices[0].texture.v = uv[1];
        vertices[2].texture.u = uv[4];
        vertices[2].texture.v = uv[3];
        vertices[1].texture.u = uv[0];
        vertices[1].texture.v = uv[1];
        vertices[3].texture.u = uv[0];
        vertices[3].texture.v = uv[3];
    };
    VertexBuilder.prototype.planeXY = function (vertices) {
        this.plane(vertices, PlaneType_1.default.XY);
    };
    VertexBuilder.prototype.plane = function (vertices, PLANE) {
        switch (PLANE) {
            case PlaneType_1.default.XY: {
                vertices[0].vertex.x = -1 / 2;
                vertices[0].vertex.y = -1 / 2;
                vertices[0].normal.z = -1;
                vertices[1].vertex.x = -1 / 2;
                vertices[1].vertex.y = 1 / 2;
                vertices[1].normal.z = -1;
                vertices[2].vertex.x = 1 / 2;
                vertices[2].vertex.y = -1 / 2;
                vertices[2].normal.z = -1;
                vertices[3].vertex.x = 1 / 2;
                vertices[3].vertex.y = 1 / 2;
                vertices[3].normal.z = -1;
                break;
            }
            case PlaneType_1.default.YX: {
                vertices[0].vertex.x = 1 / 2;
                vertices[0].vertex.y = 1 / 2;
                vertices[0].normal.z = 1;
                vertices[2].vertex.x = 1 / 2;
                vertices[2].vertex.y = -1 / 2;
                vertices[2].normal.z = 1;
                vertices[1].vertex.x = -1 / 2;
                vertices[1].vertex.y = 1 / 2;
                vertices[1].normal.z = 1;
                vertices[3].vertex.x = -1 / 2;
                vertices[3].vertex.y = -1 / 2;
                vertices[3].normal.z = 1;
                break;
            }
            case PlaneType_1.default.XZ: {
                vertices[0].vertex.x = -1 / 2;
                vertices[0].vertex.z = -1 / 2;
                vertices[0].normal.y = 1;
                vertices[1].vertex.x = -1 / 2;
                vertices[1].vertex.z = 1 / 2;
                vertices[1].normal.y = 1;
                vertices[2].vertex.x = 1 / 2;
                vertices[2].vertex.z = -1 / 2;
                vertices[2].normal.y = 1;
                vertices[3].vertex.x = 1 / 2;
                vertices[3].vertex.z = 1 / 2;
                vertices[3].normal.y = 1;
                break;
            }
            case PlaneType_1.default.ZX: {
                vertices[0].vertex.x = 1 / 2;
                vertices[0].vertex.z = 1 / 2;
                vertices[0].normal.y = -1;
                vertices[2].vertex.x = 1 / 2;
                vertices[2].vertex.z = -1 / 2;
                vertices[2].normal.y = -1;
                vertices[1].vertex.x = -1 / 2;
                vertices[1].vertex.z = 1 / 2;
                vertices[1].normal.y = -1;
                vertices[3].vertex.x = -1 / 2;
                vertices[3].vertex.z = -1 / 2;
                vertices[3].normal.y = -1;
                break;
            }
            case PlaneType_1.default.YZ: {
                vertices[0].vertex.y = -1 / 2;
                vertices[0].vertex.z = -1 / 2;
                vertices[0].normal.x = -1;
                vertices[1].vertex.y = -1 / 2;
                vertices[1].vertex.z = 1 / 2;
                vertices[1].normal.x = -1;
                vertices[2].vertex.y = 1 / 2;
                vertices[2].vertex.z = -1 / 2;
                vertices[2].normal.x = -1;
                vertices[3].vertex.y = 1 / 2;
                vertices[3].vertex.z = 1 / 2;
                vertices[3].normal.x = -1;
                break;
            }
            case PlaneType_1.default.ZY: {
                vertices[0].vertex.y = 1 / 2;
                vertices[0].vertex.z = 1 / 2;
                vertices[0].normal.x = 1;
                vertices[2].vertex.y = 1 / 2;
                vertices[2].vertex.z = -1 / 2;
                vertices[2].normal.x = 1;
                vertices[1].vertex.y = -1 / 2;
                vertices[1].vertex.z = 1 / 2;
                vertices[1].normal.x = 1;
                vertices[3].vertex.y = -1 / 2;
                vertices[3].vertex.z = -1 / 2;
                vertices[3].normal.x = 1;
                break;
            }
            default:
                break;
        }
    };
    VertexBuilder.prototype.circleXYColour = function (segments, colour) {
        var r = colour.r / 255.0;
        var g = colour.g / 255.0;
        var b = colour.b / 255.0;
        var a = colour.a / 255.0;
        var increment = (2 * Math.PI) / segments;
        var vertices = [];
        for (var angle = -Math.PI / 2; angle < Math.PI / 2; angle += increment) {
            var x = Math.sin(angle);
            var y = Math.cos(angle);
            vertices.push(x, y, 0);
            vertices.push(r, g, b, a);
            vertices.push(x, -y, 0);
            vertices.push(r, g, b, a);
        }
        return vertices;
    };
    return VertexBuilder;
}());
exports.VertexBuilder = VertexBuilder;
//# sourceMappingURL=VertexBuilder.js.map

/***/ }),

/***/ "./dist/Core/Camera.js":
/*!*****************************!*\
  !*** ./dist/Core/Camera.js ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BaseCamera = void 0;
var gl_matrix_1 = __webpack_require__(/*! gl-matrix */ "./node_modules/gl-matrix/esm/index.js");
var ModelPosition_1 = __webpack_require__(/*! ./EngineEntity/ModelPosition */ "./dist/Core/EngineEntity/ModelPosition.js");
var Coordinate_1 = __webpack_require__(/*! ./Data/Coordinate */ "./dist/Core/Data/Coordinate.js");
var Timer_1 = __webpack_require__(/*! ./Common/Timer */ "./dist/Core/Common/Timer.js");
var Rect2d_1 = __webpack_require__(/*! ./Data/Rect2d */ "./dist/Core/Data/Rect2d.js");
var CollisionDetection_1 = __webpack_require__(/*! ./Physics/CollisionDetection */ "./dist/Core/Physics/CollisionDetection.js");
var BaseCamera = /** @class */ (function (_super) {
    __extends(BaseCamera, _super);
    function BaseCamera() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.zoomScale = { x: 2, y: 2, z: 2 };
        _this.baseTranslate = { x: -1, y: -1, z: 0 };
        _this._isUpdateView = true;
        _this.timer = new Timer_1.default();
        _this.updateProjectionView = function () {
            _this._isUpdateView = true;
        };
        _this.commitProjectionView = function () {
            _this._isUpdateView = false;
            var quatRotationxyz = gl_matrix_1.quat.create();
            quatRotationxyz = gl_matrix_1.quat.rotateX(quatRotationxyz, quatRotationxyz, _this.degreesToRadians(_this.position.ax));
            quatRotationxyz = gl_matrix_1.quat.rotateY(quatRotationxyz, quatRotationxyz, _this.degreesToRadians(_this.position.ay));
            quatRotationxyz = gl_matrix_1.quat.rotateZ(quatRotationxyz, quatRotationxyz, _this.degreesToRadians(_this.position.az));
            quatRotationxyz = gl_matrix_1.quat.normalize(quatRotationxyz, quatRotationxyz);
            var dest = gl_matrix_1.mat4.create();
            var quatMat = gl_matrix_1.mat4.create();
            gl_matrix_1.mat4.fromQuat(quatMat, quatRotationxyz);
            gl_matrix_1.mat4.multiply(dest, dest, quatMat);
            var pos = gl_matrix_1.vec3.fromValues(-_this.position.x, -_this.position.y, -_this.position.z);
            gl_matrix_1.mat4.translate(dest, dest, pos);
            _this.viewMatrix = dest;
        };
        _this.perspective = function () {
            return gl_matrix_1.mat4.perspective(gl_matrix_1.mat4.create(), _this.degreesToRadians(_this.fov), _this.aspect, _this.near, _this.far);
        };
        _this.updateProjectionMatrix = function () {
            _this.frustum = _this.perspective();
        };
        return _this;
    }
    BaseCamera.prototype.clearPan = function () {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = undefined;
        }
    };
    BaseCamera.prototype.pan = function (time, speed, x, y, z) {
        var _this = this;
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = undefined;
        }
        this.steps = time;
        this._moveTime = time;
        if (x !== undefined) {
            this.dx = x - this.position.x;
            this.tx = x;
        }
        else {
            this.dx = 0;
            this.tx = this.position.x;
        }
        if (y !== undefined) {
            this.dy = y - this.position.y;
            this.ty = y;
        }
        else {
            this.dy = 0;
            this.ty = this.position.y;
        }
        if (z !== undefined) {
            this.dz = z - this.position.z;
            this.tz = z;
        }
        else {
            this.dz = 0;
            this.tz = this.position.z;
        }
        this.timer.start();
        this.interval = setInterval(function () {
            var time = _this.timer.peak();
            if (_this.steps > 0) {
                _this.steps -= time;
                if (_this.steps <= 0) {
                    _this.position.x = _this.tx;
                    _this.position.y = _this.ty;
                    _this.position.z = _this.tz;
                    if (_this.interval) {
                        clearInterval(_this.interval);
                        _this.interval = undefined;
                    }
                }
                else {
                    _this.position.x += (_this.dx * time) / _this._moveTime;
                    _this.position.y += (_this.dy * time) / _this._moveTime;
                    _this.position.z += (_this.dz * time) / _this._moveTime;
                }
                _this.updateProjectionView();
            }
            else {
                _this.position.x = _this.tx;
                _this.position.y = _this.ty;
                _this.position.z = _this.tz;
                if (_this.interval) {
                    clearInterval(_this.interval);
                    _this.interval = undefined;
                }
                _this.updateProjectionView();
            }
            _this.timer.start();
        }, speed);
    };
    BaseCamera.prototype.isOutOfBound = function (bound, pos) {
        return false;
    };
    BaseCamera.prototype.isUpdateView = function () {
        return this._isUpdateView;
    };
    BaseCamera.prototype.angleX = function (dx) {
        this.position.ax -= dx;
        if (this.position.ax > 90) {
            var diff = 90;
            this.position.ax = diff;
        }
        else if (this.position.ax < -90) {
            var diff = -90;
            this.position.ax = diff;
        }
    };
    BaseCamera.prototype.angleZ = function (dz) {
        this.position.az += dz;
        if (this.position.az > 360) {
            var diff = this.position.az - 360;
            this.position.az = diff;
        }
        else if (this.position.az < 0) {
            var diff = this.position.az + 360;
            this.position.az = diff;
        }
    };
    BaseCamera.prototype.angleY = function (dy) {
        var _a, _b;
        if ((_b = (_a = this.cameraOptions) === null || _a === void 0 ? void 0 : _a.experimental) === null || _b === void 0 ? void 0 : _b.inverseAngleY) {
            if (dy) {
                dy *= -1;
            }
        }
        this.position.ay += dy;
        if (this.position.ay > 360) {
            var diff = this.position.ay - 360;
            this.position.ay = diff;
        }
        else if (this.position.ay < 0) {
            var diff = this.position.ay + 360;
            this.position.ay = diff;
        }
    };
    BaseCamera.prototype.zoomIn = function (delta) {
        this.fov -= delta;
        this.fov = Math.max(delta, this.fov);
        this.updateProjectionMatrix();
    };
    BaseCamera.prototype.zoomOut = function (delta) {
        var maxFovAspect = (Math.atan(1.0 / this.aspect) * 360.0) / Math.PI;
        this.fov += delta;
        this.fov = Math.min(Math.min(this.cameraOptions.maxFov || maxFovAspect, maxFovAspect), this.fov);
        this.updateProjectionMatrix();
    };
    BaseCamera.prototype.setupCamera = function (cameraOptions, aspectRatio, canvas) {
        var _a;
        this.cameraOptions = cameraOptions || {};
        var near = this.near || cameraOptions.near || 1.0;
        var far = this.far || cameraOptions.far || 4.0;
        var aspect = cameraOptions.aspect || canvas.width / canvas.height;
        if ((_a = this.cameraOptions.experimental) === null || _a === void 0 ? void 0 : _a.enabled) {
            var width = canvas.offsetWidth;
            var height = canvas.offsetHeight;
            var zoom = {
                x: width <= height ? 2 : (2 * aspectRatio) / (width / height),
                y: height <= width ? 2 : (2 * aspectRatio) / (width / height),
                z: 1,
            };
            this.setZoom(zoom);
            this.setBaseTranslate({
                x: -1 + (2 - zoom.x) / 2,
                y: -1 + (2 - zoom.y) / 2,
                z: 0,
            });
        }
        var fov = this.fov || cameraOptions.fov || 45.0;
        if (cameraOptions.isFovMax) {
            var maxFovAspect = (Math.atan(1.0 / aspect) * 360.0) / Math.PI;
            fov = maxFovAspect;
        }
        this.aspect = aspect;
        this.fov = fov;
        this.near = near;
        this.far = far;
        this.updateProjectionMatrix();
        this.updateProjectionView();
    };
    BaseCamera.prototype.setZoom = function (zoom) {
        this.zoomScale = zoom;
    };
    BaseCamera.prototype.setBaseTranslate = function (baseTranslate) {
        this.baseTranslate = baseTranslate;
    };
    return BaseCamera;
}(ModelPosition_1.default));
exports.BaseCamera = BaseCamera;
var Camera2d = /** @class */ (function (_super) {
    __extends(Camera2d, _super);
    function Camera2d() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.INTERVAL_TIME = 10;
        _this.bound = new Rect2d_1.default(0, 0, 1, 1);
        _this.perspective = function () {
            var translateSpace = gl_matrix_1.mat4.create();
            gl_matrix_1.mat4.translate(translateSpace, translateSpace, gl_matrix_1.vec3.fromValues(_this.baseTranslate.x, _this.baseTranslate.y, _this.baseTranslate.z));
            gl_matrix_1.mat4.scale(translateSpace, translateSpace, gl_matrix_1.vec3.fromValues(_this.zoomScale.x, _this.zoomScale.y, 1.0));
            return translateSpace;
        };
        return _this;
    }
    Camera2d.prototype.distanceEvent = function (event) {
        return new Coordinate_1.default(event.x + this.position.x, this.position.y + event.y);
    };
    Camera2d.prototype.zoomIn = function (delta) {
        this.zoomScale.x += delta;
        this.zoomScale.y += delta;
        this.updateProjectionMatrix();
    };
    Camera2d.prototype.zoomOut = function (delta) {
        this.zoomScale.x = Math.max(0.1, this.zoomScale.x - delta);
        this.zoomScale.y = Math.max(0.1, this.zoomScale.y - delta);
        this.updateProjectionMatrix();
    };
    Camera2d.prototype.isOutOfBound = function (pos) {
        this.bound.x = this.position.x + this.bound.width / 2.0;
        this.bound.y = this.position.y + this.bound.height / 2.0;
        return !CollisionDetection_1.CollisionDetection.isRectInRect(this.bound, pos);
    };
    Camera2d.prototype.pan2d = function (time, x, y) {
        _super.prototype.pan.call(this, time, this.INTERVAL_TIME, x, y);
    };
    Camera2d.prototype.pan2dDif = function (time, dx, dy) {
        var _a = this.position, x = _a.x, y = _a.y;
        _super.prototype.pan.call(this, time, this.INTERVAL_TIME, x + (dx !== null && dx !== void 0 ? dx : 0), y + (dy !== null && dy !== void 0 ? dy : 0));
    };
    return Camera2d;
}(BaseCamera));
var Camera3d = /** @class */ (function (_super) {
    __extends(Camera3d, _super);
    function Camera3d() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Camera3d.prototype.pan3d = function (time, x, y, z) {
        _super.prototype.pan.call(this, time, this.INTERVAL_TIME, x, y, z);
    };
    return Camera3d;
}(Camera2d));
var Camera = /** @class */ (function () {
    function Camera() {
        this.camera3d = new Camera3d();
    }
    Camera.prototype.setupCamera = function (cameraOptions, aspectRatio, canvas) {
        this.camera3d.setupCamera(cameraOptions, aspectRatio || 1, canvas);
        this.height = canvas.height;
        this.width = canvas.width;
    };
    Camera.prototype.commitProjectionView = function () {
        if (this.camera3d.isUpdateView()) {
            this.camera3d.commitProjectionView();
        }
    };
    return Camera;
}());
exports["default"] = Camera;
//# sourceMappingURL=Camera.js.map

/***/ }),

/***/ "./dist/Core/Common/IdGenerator.js":
/*!*****************************************!*\
  !*** ./dist/Core/Common/IdGenerator.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.generateId = generateId;
function generateId() {
    return "xxxxxxxxx".replace(/[x]/g, function (c) {
        var r = (Math.random() * 16) | 0;
        var v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
//# sourceMappingURL=IdGenerator.js.map

/***/ }),

/***/ "./dist/Core/Common/NotificationQueue.js":
/*!***********************************************!*\
  !*** ./dist/Core/Common/NotificationQueue.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationPayload = exports.Notification = void 0;
var Notification = /** @class */ (function () {
    function Notification(key, action) {
        this.key = key;
        this.action = action;
    }
    return Notification;
}());
exports.Notification = Notification;
var NotificationPayload = /** @class */ (function (_super) {
    __extends(NotificationPayload, _super);
    function NotificationPayload(key, action, data) {
        var _this = _super.call(this, key, action) || this;
        _this.data = data;
        return _this;
    }
    NotificationPayload.from = function (notification, data) {
        return new NotificationPayload(notification.key, notification.action, data);
    };
    return NotificationPayload;
}(Notification));
exports.NotificationPayload = NotificationPayload;
var LinkedList = /** @class */ (function () {
    function LinkedList(data) {
        this.data = data;
    }
    return LinkedList;
}());
var NotificationQueue = /** @class */ (function () {
    function NotificationQueue() {
        this.queueMap = {};
    }
    NotificationQueue.prototype.clearQueue = function () {
        this.queueMap = {};
    };
    NotificationQueue.prototype.pushPayload = function (notification) {
        var key = notification.key;
        var nodes = this.queueMap[key];
        if (!nodes) {
            this.queueMap[key] = { bottom: undefined, top: undefined };
            nodes = this.queueMap[key];
        }
        if (!nodes.bottom) {
            nodes.bottom = new LinkedList(notification);
            nodes.top = nodes.bottom;
        }
        else if (nodes.top) {
            nodes.top.next = new LinkedList(notification);
            nodes.top = nodes.top.next;
        }
        else {
            throw new Error("Unexpected state for notification push payload");
        }
    };
    NotificationQueue.prototype.push = function (notification, data) {
        if (notification instanceof NotificationPayload) {
            console.error("Please use pushPayload");
        }
        this.pushPayload(new NotificationPayload(notification.key, notification.action, data));
    };
    NotificationQueue.prototype.pushNotification = function (key, action) {
        this.push(new Notification(key, action));
    };
    NotificationQueue.prototype.take = function (key) {
        var bottom = this.getBottom(key);
        if (!bottom) {
            return undefined;
        }
        var data = this.peak(key);
        if (!data) {
            throw new Error("Expected data to appear when reading data from notification");
        }
        this.shiftQueue(key);
        return data;
    };
    NotificationQueue.prototype.shiftQueue = function (key) {
        var nodes = this.queueMap[key];
        var bottom = nodes.bottom;
        if (bottom) {
            nodes.bottom = bottom.next;
            if (!nodes.bottom) {
                nodes.top = undefined;
            }
        }
        else {
            throw new Error("Trying to shift queue with bottom undefined");
        }
    };
    NotificationQueue.prototype.getBottom = function (key) {
        return this.queueMap[key] ? this.queueMap[key].bottom : undefined;
    };
    NotificationQueue.prototype.peak = function (key) {
        var bottom = this.getBottom(key);
        return (bottom && bottom.data) || undefined;
    };
    return NotificationQueue;
}());
exports["default"] = NotificationQueue;
//# sourceMappingURL=NotificationQueue.js.map

/***/ }),

/***/ "./dist/Core/Common/SubscriberPool.js":
/*!********************************************!*\
  !*** ./dist/Core/Common/SubscriberPool.js ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SubscriptionListeners = exports.Subscription = void 0;
var Subscription = /** @class */ (function () {
    function Subscription(key) {
        this.key = key;
    }
    return Subscription;
}());
exports.Subscription = Subscription;
var SubscriptionListeners = /** @class */ (function (_super) {
    __extends(SubscriptionListeners, _super);
    function SubscriptionListeners(key) {
        var _this = _super.call(this, key) || this;
        _this.listeners = {};
        _this.subscriptionId = 0;
        return _this;
    }
    SubscriptionListeners.prototype.listen = function (callback) {
        this.listeners[this.subscriptionId++] = callback;
        return this.subscriptionId - 1;
    };
    SubscriptionListeners.prototype.unlisten = function (subscriptionId) {
        delete this.listeners[subscriptionId];
    };
    SubscriptionListeners.prototype.publish = function (data) {
        Object.values(this.listeners).forEach(function (listener) { return listener(data); });
    };
    SubscriptionListeners.prototype.flush = function () {
        this.listeners = {};
    };
    return SubscriptionListeners;
}(Subscription));
exports.SubscriptionListeners = SubscriptionListeners;
var SubscriberPool = /** @class */ (function () {
    function SubscriberPool() {
        this.subscribers = {};
    }
    SubscriberPool.prototype.listen = function (subscription, callback) {
        return this.getSubscriptionListeners(subscription).listen(callback);
    };
    SubscriberPool.prototype.getSubscriptionListeners = function (subscription) {
        var key = subscription.key;
        if (!this.subscribers[key]) {
            this.subscribers[key] = new SubscriptionListeners(key);
        }
        return this.subscribers[key];
    };
    SubscriberPool.prototype.publish = function (subscription, data) {
        this.getSubscriptionListeners(subscription).publish(data);
    };
    return SubscriberPool;
}());
exports["default"] = SubscriberPool;
//# sourceMappingURL=SubscriberPool.js.map

/***/ }),

/***/ "./dist/Core/Common/Timer.js":
/*!***********************************!*\
  !*** ./dist/Core/Common/Timer.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var Timer = /** @class */ (function () {
    function Timer() {
        this._start = Date.now();
    }
    Timer.prototype.start = function () {
        this._start = Date.now();
        return this;
    };
    Timer.prototype.peak = function () {
        return Date.now() - this._start;
    };
    Timer.prototype.stop = function () {
        this._end = Date.now();
        var elapsed = this._end - this._start;
        this._start = this._end;
        return elapsed;
    };
    return Timer;
}());
exports["default"] = Timer;
//# sourceMappingURL=Timer.js.map

/***/ }),

/***/ "./dist/Core/Data/Colour.js":
/*!**********************************!*\
  !*** ./dist/Core/Data/Colour.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var Colour = /** @class */ (function () {
    function Colour(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    return Colour;
}());
exports["default"] = Colour;
//# sourceMappingURL=Colour.js.map

/***/ }),

/***/ "./dist/Core/Data/ColourVertexModel.js":
/*!*********************************************!*\
  !*** ./dist/Core/Data/ColourVertexModel.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var RenderUnit_1 = __webpack_require__(/*! ./RenderUnit */ "./dist/Core/Data/RenderUnit.js");
var VertexModel_1 = __webpack_require__(/*! ./VertexModel */ "./dist/Core/Data/VertexModel.js");
var ModelData_1 = __webpack_require__(/*! ./ModelData */ "./dist/Core/Data/ModelData.js");
var EngineObjectHelper_1 = __webpack_require__(/*! ../EngineEntity/EngineObjectHelper */ "./dist/Core/EngineEntity/EngineObjectHelper.js");
var ColourVertexModel = /** @class */ (function (_super) {
    __extends(ColourVertexModel, _super);
    function ColourVertexModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ColourVertexModel.prototype.createRenderUnits = function (count) {
        this.renderUnits = [];
        for (var index = 0; index < count; index++) {
            this.renderUnits.push(new RenderUnit_1.ColourRenderUnit());
        }
        return this;
    };
    ColourVertexModel.prototype.fillRenderUnits = function (values) {
        this.renderUnits = [];
        for (var index = 0; index < values.length; index += 7) {
            var renderUnit = new RenderUnit_1.ColourRenderUnit();
            renderUnit.vertex.x = values[index];
            renderUnit.vertex.y = values[index + 1];
            renderUnit.vertex.z = values[index + 2];
            renderUnit.colour.r = values[index + 3];
            renderUnit.colour.g = values[index + 4];
            renderUnit.colour.b = values[index + 5];
            renderUnit.colour.a = values[index + 6];
            this.renderUnits.push(renderUnit);
        }
        return this;
    };
    ColourVertexModel.prototype.createModel = function () {
        var model = new ModelData_1.default();
        model.vertices = EngineObjectHelper_1.default.vertex.toColourArray(this.renderUnits);
        return model;
    };
    return ColourVertexModel;
}(VertexModel_1.default));
exports["default"] = ColourVertexModel;
//# sourceMappingURL=ColourVertexModel.js.map

/***/ }),

/***/ "./dist/Core/Data/Coordinate.js":
/*!**************************************!*\
  !*** ./dist/Core/Data/Coordinate.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var Coordinate = /** @class */ (function () {
    function Coordinate(x, y, z) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }
    return Coordinate;
}());
exports["default"] = Coordinate;
//# sourceMappingURL=Coordinate.js.map

/***/ }),

/***/ "./dist/Core/Data/FontMetaData.js":
/*!****************************************!*\
  !*** ./dist/Core/Data/FontMetaData.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FontCharacter = exports.FontMeta = void 0;
var FontMeta = /** @class */ (function () {
    function FontMeta() {
        this.fonts = {};
    }
    return FontMeta;
}());
exports.FontMeta = FontMeta;
var FontCharacter = /** @class */ (function () {
    function FontCharacter() {
    }
    return FontCharacter;
}());
exports.FontCharacter = FontCharacter;
var FontMetaData = /** @class */ (function () {
    function FontMetaData() {
    }
    return FontMetaData;
}());
exports["default"] = FontMetaData;
//# sourceMappingURL=FontMetaData.js.map

/***/ }),

/***/ "./dist/Core/Data/Light.js":
/*!*********************************!*\
  !*** ./dist/Core/Data/Light.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var gl_matrix_1 = __webpack_require__(/*! gl-matrix */ "./node_modules/gl-matrix/esm/index.js");
var Light = /** @class */ (function () {
    function Light(options) {
        this.pos = options.pos;
        this.in = options.in;
        this.attenuation = options.attenuation;
        this.ambientCoeff = options.ambientCoeff;
        this.at = options.at;
    }
    Light.prototype.vecZero = function (vec) {
        return gl_matrix_1.vec3.equals(vec, gl_matrix_1.vec3.fromValues(0, 0, 0));
    };
    Light.prototype.parellelVec = function (vec1, vec2) {
        return (this.vecZero(vec1) !== true &&
            this.vecZero(vec2) !== true &&
            gl_matrix_1.vec3.equals(gl_matrix_1.vec3.normalize(gl_matrix_1.vec3.create(), vec1), gl_matrix_1.vec3.normalize(gl_matrix_1.vec3.create(), vec2)) === true);
    };
    Light.prototype.perpVec = function (vec) {
        var perp = gl_matrix_1.vec3.fromValues(1.0, 0.0, 0.0);
        if (this.parellelVec(vec, perp) === true) {
            perp = gl_matrix_1.vec3.fromValues(0.0, 0.0, 1.0);
        }
        return perp;
    };
    Light.prototype.posVec = function () {
        return gl_matrix_1.vec3.fromValues(this.pos[0], this.pos[1], this.pos[2]);
    };
    Light.prototype.atVec = function () {
        return gl_matrix_1.vec3.fromValues(this.at[0], this.at[1], this.at[2]);
    };
    Light.prototype.lookAt = function () {
        var pos = this.posVec();
        var at = this.atVec();
        var atCross = at;
        var posCross = pos;
        if (this.parellelVec(pos, at) === true) {
            atCross = this.perpVec(pos);
        }
        else {
            if (this.vecZero(pos) === true) {
                posCross = this.perpVec(at);
            }
            if (this.vecZero(at) === true) {
                atCross = this.perpVec(pos);
            }
        }
        this.up = gl_matrix_1.vec3.cross(gl_matrix_1.vec3.create(), posCross, atCross);
        return gl_matrix_1.mat4.lookAt(gl_matrix_1.mat4.create(), pos, at, this.up);
    };
    return Light;
}());
exports["default"] = Light;
//# sourceMappingURL=Light.js.map

/***/ }),

/***/ "./dist/Core/Data/ModelData.js":
/*!*************************************!*\
  !*** ./dist/Core/Data/ModelData.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var ModelData = /** @class */ (function () {
    function ModelData() {
        this.$id = ModelData._$ID++;
    }
    ModelData._$ID = 1;
    return ModelData;
}());
exports["default"] = ModelData;
//# sourceMappingURL=ModelData.js.map

/***/ }),

/***/ "./dist/Core/Data/PlaneType.js":
/*!*************************************!*\
  !*** ./dist/Core/Data/PlaneType.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var PlaneType = /** @class */ (function () {
    function PlaneType(name, width, height, length, normalDirection) {
        this.name = name;
        this.width = width;
        this.height = height;
        this.length = length;
        this.normalDirection = normalDirection;
    }
    PlaneType.XY = new PlaneType("XY", 0, 0, 0, 0);
    PlaneType.YX = new PlaneType("YX", 0, 0, 0, 0);
    PlaneType.XZ = new PlaneType("XZ", 0, 0, 0, 0);
    PlaneType.ZX = new PlaneType("ZX", 0, 0, 0, 0);
    PlaneType.YZ = new PlaneType("YZ", 0, 0, 0, 0);
    PlaneType.ZY = new PlaneType("ZY", 0, 0, 0, 0);
    PlaneType.BACKWARDS = -1;
    PlaneType.FORWARD = 1;
    return PlaneType;
}());
exports["default"] = PlaneType;
//# sourceMappingURL=PlaneType.js.map

/***/ }),

/***/ "./dist/Core/Data/Rect2d.js":
/*!**********************************!*\
  !*** ./dist/Core/Data/Rect2d.js ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Rect3d_1 = __webpack_require__(/*! ./Rect3d */ "./dist/Core/Data/Rect3d.js");
var Rect2d = /** @class */ (function (_super) {
    __extends(Rect2d, _super);
    function Rect2d(x, y, width, height, layer) {
        return _super.call(this, x, y, layer || 0, width, height, 1) || this;
    }
    Rect2d.create = function () {
        return new Rect2d(0, 0, 0, 0, 0);
    };
    Rect2d.prototype.newCenter = function () {
        return new Rect2d(this.x + this.width / 2.0, this.y + this.height / 2.0, this.width, this.height, this.z);
    };
    return Rect2d;
}(Rect3d_1.default));
exports["default"] = Rect2d;
//# sourceMappingURL=Rect2d.js.map

/***/ }),

/***/ "./dist/Core/Data/Rect3d.js":
/*!**********************************!*\
  !*** ./dist/Core/Data/Rect3d.js ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Coordinate_1 = __webpack_require__(/*! ./Coordinate */ "./dist/Core/Data/Coordinate.js");
var Rect3d = /** @class */ (function (_super) {
    __extends(Rect3d, _super);
    function Rect3d(x, y, z, width, height, length) {
        var _this = _super.call(this, x, y, z) || this;
        _this.width = width || 0;
        _this.height = height || 0;
        _this.length = length || 0;
        return _this;
    }
    Rect3d.prototype.center = function () {
        if (!this.centre || !this.equalCenter(this.centre)) {
            this.centre = this.newCenter();
        }
        return this.centre;
    };
    Rect3d.prototype.equal = function (r) {
        return (r.x === this.x &&
            r.y === this.y &&
            r.z === this.z &&
            r.width === this.width &&
            r.height === this.height &&
            r.length === this.length);
    };
    Rect3d.prototype.equalCenter = function (c) {
        return (c.x === this.x + this.width / 2.0 &&
            c.y === this.y + this.height / 2.0 &&
            c.z === this.z + this.length / 2.0 &&
            c.width === this.width &&
            c.height === this.height &&
            c.length === this.length);
    };
    Rect3d.prototype.newCenter = function () {
        return new Rect3d(this.x + this.width / 2.0, this.y + this.height / 2.0, this.z + this.length / 2.0, this.width, this.height, this.length);
    };
    return Rect3d;
}(Coordinate_1.default));
exports["default"] = Rect3d;
//# sourceMappingURL=Rect3d.js.map

/***/ }),

/***/ "./dist/Core/Data/RenderOption.js":
/*!****************************************!*\
  !*** ./dist/Core/Data/RenderOption.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RenderType = exports.ShaderType = void 0;
var ShaderType = /** @class */ (function () {
    function ShaderType() {
    }
    ShaderType.THREE_DIMENSION = 2;
    ShaderType.TWO_DIMENSION = 1;
    ShaderType.COLOUR = 3;
    return ShaderType;
}());
exports.ShaderType = ShaderType;
var RenderType = /** @class */ (function () {
    function RenderType() {
    }
    RenderType.PLAIN = 4;
    RenderType.TRIANGLE = 5;
    RenderType.RECTANGLE = 6;
    return RenderType;
}());
exports.RenderType = RenderType;
var RenderOption = /** @class */ (function () {
    function RenderOption() {
    }
    return RenderOption;
}());
exports["default"] = RenderOption;
//# sourceMappingURL=RenderOption.js.map

/***/ }),

/***/ "./dist/Core/Data/RenderUnit.js":
/*!**************************************!*\
  !*** ./dist/Core/Data/RenderUnit.js ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ColourRenderUnit = exports.TextureRenderUnit = exports.RenderUnit = exports.Colour = exports.TextureUnit = void 0;
var Coordinate_1 = __webpack_require__(/*! ./Coordinate */ "./dist/Core/Data/Coordinate.js");
var TextureUnit = /** @class */ (function () {
    function TextureUnit() {
        this.u = 0.0;
        this.v = 0.0;
    }
    return TextureUnit;
}());
exports.TextureUnit = TextureUnit;
var Colour = /** @class */ (function () {
    function Colour() {
        this.r = 0.0;
        this.g = 0.0;
        this.b = 0.0;
        this.a = 0.0;
    }
    return Colour;
}());
exports.Colour = Colour;
var RenderUnit = /** @class */ (function () {
    function RenderUnit() {
        this.vertex = new Coordinate_1.default(0, 0, 0);
    }
    return RenderUnit;
}());
exports.RenderUnit = RenderUnit;
var TextureRenderUnit = /** @class */ (function (_super) {
    __extends(TextureRenderUnit, _super);
    function TextureRenderUnit() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.texture = new TextureUnit();
        _this.normal = new Coordinate_1.default(0, 0, 0);
        return _this;
    }
    return TextureRenderUnit;
}(RenderUnit));
exports.TextureRenderUnit = TextureRenderUnit;
var ColourRenderUnit = /** @class */ (function (_super) {
    __extends(ColourRenderUnit, _super);
    function ColourRenderUnit() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.colour = new Colour();
        return _this;
    }
    return ColourRenderUnit;
}(RenderUnit));
exports.ColourRenderUnit = ColourRenderUnit;
//# sourceMappingURL=RenderUnit.js.map

/***/ }),

/***/ "./dist/Core/Data/Resource.js":
/*!************************************!*\
  !*** ./dist/Core/Data/Resource.js ***!
  \************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var Resource = /** @class */ (function () {
    function Resource() {
    }
    return Resource;
}());
exports["default"] = Resource;
//# sourceMappingURL=Resource.js.map

/***/ }),

/***/ "./dist/Core/Data/TextureVertexModel.js":
/*!**********************************************!*\
  !*** ./dist/Core/Data/TextureVertexModel.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var RenderUnit_1 = __webpack_require__(/*! ./RenderUnit */ "./dist/Core/Data/RenderUnit.js");
var VertexModel_1 = __webpack_require__(/*! ./VertexModel */ "./dist/Core/Data/VertexModel.js");
var ModelData_1 = __webpack_require__(/*! ./ModelData */ "./dist/Core/Data/ModelData.js");
var EngineObjectHelper_1 = __webpack_require__(/*! ../EngineEntity/EngineObjectHelper */ "./dist/Core/EngineEntity/EngineObjectHelper.js");
var TextureVertexModel = /** @class */ (function (_super) {
    __extends(TextureVertexModel, _super);
    function TextureVertexModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TextureVertexModel.prototype.createRenderUnits = function (count) {
        this.renderUnits = [];
        for (var index = 0; index < count; index++) {
            this.renderUnits.push(new RenderUnit_1.TextureRenderUnit());
        }
        return this;
    };
    TextureVertexModel.prototype.fillRenderUnits = function (values) {
        this.renderUnits = [];
        for (var index = 0; index < values.length; index += 8) {
            var renderUnit = new RenderUnit_1.TextureRenderUnit();
            renderUnit.vertex.x = values[index];
            renderUnit.vertex.y = values[index + 1];
            renderUnit.vertex.z = values[index + 2];
            renderUnit.normal.x = values[index + 3];
            renderUnit.normal.y = values[index + 4];
            renderUnit.normal.z = values[index + 5];
            renderUnit.texture.u = values[index + 6];
            renderUnit.texture.v = values[index + 7];
            this.renderUnits.push(renderUnit);
        }
        return this;
    };
    TextureVertexModel.prototype.createModel = function () {
        var model = new ModelData_1.default();
        model.vertices = EngineObjectHelper_1.default.vertex.toTextureArray(this.renderUnits);
        return model;
    };
    return TextureVertexModel;
}(VertexModel_1.default));
exports["default"] = TextureVertexModel;
//# sourceMappingURL=TextureVertexModel.js.map

/***/ }),

/***/ "./dist/Core/Data/Vector2d.js":
/*!************************************!*\
  !*** ./dist/Core/Data/Vector2d.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var vec2_1 = __webpack_require__(/*! gl-matrix/vec2 */ "./node_modules/gl-matrix/esm/vec2.js");
var Vector2d = /** @class */ (function (_super) {
    __extends(Vector2d, _super);
    function Vector2d() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Vector2d.prototype, "x", {
        get: function () {
            return this[0];
        },
        set: function (x) {
            this[0] = x;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector2d.prototype, "y", {
        get: function () {
            return this[1];
        },
        set: function (y) {
            this[1] = y;
        },
        enumerable: false,
        configurable: true
    });
    Vector2d.prototype.normalise = function () {
        return vec2_1.default.normalize(Vector2d.newVector(0.0, 0.0), this);
    };
    Vector2d.prototype.dot = function (v) {
        return vec2_1.default.dot(this, v);
    };
    Vector2d.prototype.negate = function () {
        return vec2_1.default.negate(Vector2d.newVector(0.0, 0.0), this);
    };
    Vector2d.prototype.scale = function (s) {
        return vec2_1.default.scale(Vector2d.newVector(0.0, 0.0), this, s);
    };
    Vector2d.prototype.subtract = function (v) {
        return vec2_1.default.subtract(Vector2d.newVector(0, 0), this, v);
    };
    Vector2d.prototype.add = function (v) {
        return vec2_1.default.add(Vector2d.newVector(0, 0), this, v);
    };
    Vector2d.newVector = function (x, y) {
        var vector = new Vector2d();
        vector.x = x;
        vector.y = y;
        return vector;
    };
    return Vector2d;
}(Float32Array));
exports["default"] = Vector2d;
//# sourceMappingURL=Vector2d.js.map

/***/ }),

/***/ "./dist/Core/Data/VertexModel.js":
/*!***************************************!*\
  !*** ./dist/Core/Data/VertexModel.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var VertexModel = /** @class */ (function () {
    function VertexModel() {
    }
    VertexModel.prototype.registerModel = function (engineHelper) {
        if (!this.vertexBufferId) {
            this.vertexBufferId = engineHelper.addBufferCache(this.createModel());
        }
    };
    return VertexModel;
}());
exports["default"] = VertexModel;
//# sourceMappingURL=VertexModel.js.map

/***/ }),

/***/ "./dist/Core/EngineEntity/EngineMap.js":
/*!*********************************************!*\
  !*** ./dist/Core/EngineEntity/EngineMap.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Physics_1 = __webpack_require__(/*! ../Physics/Physics */ "./dist/Core/Physics/Physics.js");
var ConfigMapBuilder_1 = __webpack_require__(/*! ../Builder/ConfigMapBuilder */ "./dist/Core/Builder/ConfigMapBuilder.js");
var EntityManager2d_1 = __webpack_require__(/*! ../../Manager/EntityManager2d */ "./dist/Manager/EntityManager2d.js");
var EngineMap = /** @class */ (function (_super) {
    __extends(EngineMap, _super);
    function EngineMap() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.$ref = {};
        _this.show = false;
        return _this;
    }
    EngineMap.prototype.reset = function () {
        this.entities = [];
        this.$ref = {};
    };
    EngineMap.prototype.beforeShow = function () { };
    EngineMap.prototype.updatePosition = function (entity, position) {
        if (this.$ref[entity.$id]) {
            this.$ref[entity.$id].position = position;
        }
        else {
            console.error("Trying to update position when entity not set", this);
        }
    };
    EngineMap.prototype.setShow = function (show) {
        this.show = show;
        if (this.show) {
            this.beforeShow();
        }
        this.entities.forEach(function (ent) {
            Physics_1.default.setEnabledPhysics(ent, show);
            ent.hidden = !show;
        });
        if (this.show) {
            this.restore();
        }
    };
    EngineMap.prototype.restore = function () {
        for (var prop in this.$ref) {
            if (this.$ref.hasOwnProperty(prop)) {
                var entityData = this.$ref[prop];
                entityData.entity.setPosition(entityData.position);
            }
        }
    };
    EngineMap.prototype.addEntity = function (entity) {
        if (!this.$ref[entity.$id]) {
            this.entities.push(entity);
            this.$ref[entity.$id] = {
                entity: entity,
                position: entity.position,
            };
        }
        return this;
    };
    EngineMap.prototype.update = function (engineHelper) {
        if (!this.show) {
            return;
        }
        this.entities.forEach(function (ent) { return ent.update(engineHelper); });
        if (this.configBuilder) {
            this.configBuilder.texts.forEach(function (fontRef) {
                return engineHelper.writeFont(fontRef);
            });
        }
    };
    EngineMap.prototype.render = function (engineHelper) {
        if (!this.show) {
            return;
        }
        this.entities.forEach(function (ent) { return ent.render(engineHelper); });
    };
    EngineMap.prototype.event = function (event, engineHelper) {
        if (!this.show) {
            return;
        }
        for (var _i = 0, _a = this.entities; _i < _a.length; _i++) {
            var entities = _a[_i];
            if (entities.isLastEvent) {
                continue;
            }
            var shouldPropagate = entities.event(event, engineHelper);
            if (shouldPropagate === false) {
                return false;
            }
        }
        for (var _b = 0, _c = this.entities; _b < _c.length; _b++) {
            var entities = _c[_b];
            if (!entities.isLastEvent) {
                continue;
            }
            var shouldPropagate = entities.event(event, engineHelper);
            if (shouldPropagate === false) {
                return false;
            }
        }
    };
    EngineMap.prototype.init = function (engineHelper) {
        this.engineHelper = engineHelper;
        this.entities.forEach(function (ent) { return ent.init(engineHelper); });
    };
    EngineMap.prototype.parseMap = function (engineHelper, map) {
        this.configBuilder = new ConfigMapBuilder_1.default(engineHelper);
        this.configBuilder.build(map);
        this.addEntities();
    };
    EngineMap.prototype.addEntities = function () {
        var _this = this;
        if (!this.configBuilder || !this.configBuilder.objects)
            return;
        this.configBuilder.objects.forEach(function (ent) {
            return _this.addEntity(ent);
        });
    };
    return EngineMap;
}(EntityManager2d_1.default));
exports["default"] = EngineMap;
//# sourceMappingURL=EngineMap.js.map

/***/ }),

/***/ "./dist/Core/EngineEntity/EngineObject.js":
/*!************************************************!*\
  !*** ./dist/Core/EngineEntity/EngineObject.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var ModelPosition_1 = __webpack_require__(/*! ./ModelPosition */ "./dist/Core/EngineEntity/ModelPosition.js");
var IdGenerator_1 = __webpack_require__(/*! ../Common/IdGenerator */ "./dist/Core/Common/IdGenerator.js");
var EngineObject = /** @class */ (function (_super) {
    __extends(EngineObject, _super);
    function EngineObject() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.$hidden = false;
        _this.$id = (0, IdGenerator_1.generateId)();
        _this.clone = false;
        _this.isTop = false;
        _this.isLastEvent = false;
        return _this;
    }
    EngineObject.prototype.copyTexture = function (obj) {
        this.shaderEntity.rendererTextureRef = obj.shaderEntity.rendererTextureRef;
        this.shaderEntity.vertexModel = obj.shaderEntity.vertexModel;
        this.shaderEntity.rendererBufferId = obj.shaderEntity.rendererBufferId;
    };
    Object.defineProperty(EngineObject.prototype, "shaderEntity", {
        get: function () {
            if (this._shaderEntity !== undefined &&
                this._shaderEntity.hidden !== this.$hidden) {
                this._shaderEntity.hidden = this.$hidden;
            }
            return this._shaderEntity;
        },
        set: function (shaderEntity) {
            this._shaderEntity = shaderEntity;
            this._shaderEntity.isTop = this.isTop;
            this._shaderEntity.clone = this.clone;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EngineObject.prototype, "hidden", {
        get: function () {
            return this.$hidden;
        },
        set: function (value) {
            this.setHidden(value);
        },
        enumerable: false,
        configurable: true
    });
    EngineObject.prototype.setHidden = function (value) {
        this.$hidden = value;
        if (this.shaderEntity) {
            this.shaderEntity.hidden = value;
        }
    };
    EngineObject.prototype.setTop = function (isTop) {
        this.isTop = isTop;
        if (!this.shaderEntity)
            return;
        this.shaderEntity.isTop = isTop;
    };
    EngineObject.prototype.setClone = function (clone) {
        this.clone = clone;
        if (!this.shaderEntity)
            return;
        this.shaderEntity.clone = clone;
    };
    EngineObject.prototype.update = function (engineHelper) { };
    EngineObject.prototype.render = function (engineHelper) { };
    EngineObject.prototype.event = function (event, engineHelper) {
        return;
    };
    EngineObject.prototype.init = function (engineHelper) { };
    return EngineObject;
}(ModelPosition_1.default));
exports["default"] = EngineObject;
//# sourceMappingURL=EngineObject.js.map

/***/ }),

/***/ "./dist/Core/EngineEntity/EngineObjectHelper.js":
/*!******************************************************!*\
  !*** ./dist/Core/EngineEntity/EngineObjectHelper.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var CollisionDetection_1 = __webpack_require__(/*! ../Physics/CollisionDetection */ "./dist/Core/Physics/CollisionDetection.js");
var VertexBuilder_1 = __webpack_require__(/*! ../Builder/VertexBuilder */ "./dist/Core/Builder/VertexBuilder.js");
var EngineObjectHelper = /** @class */ (function () {
    function EngineObjectHelper() {
    }
    EngineObjectHelper.vertex = new VertexBuilder_1.VertexBuilder();
    EngineObjectHelper.collision = new CollisionDetection_1.CollisionDetection();
    return EngineObjectHelper;
}());
exports["default"] = EngineObjectHelper;
//# sourceMappingURL=EngineObjectHelper.js.map

/***/ }),

/***/ "./dist/Core/EngineEntity/ModelObject2d.js":
/*!*************************************************!*\
  !*** ./dist/Core/EngineEntity/ModelObject2d.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var ShaderEntityBuilder_1 = __webpack_require__(/*! ../Builder/ShaderEntityBuilder */ "./dist/Core/Builder/ShaderEntityBuilder.js");
var RenderOption_1 = __webpack_require__(/*! ../Data/RenderOption */ "./dist/Core/Data/RenderOption.js");
var EngineObject_1 = __webpack_require__(/*! ./EngineObject */ "./dist/Core/EngineEntity/EngineObject.js");
var ModelObject2d = /** @class */ (function (_super) {
    __extends(ModelObject2d, _super);
    function ModelObject2d(rect, vertexModel) {
        var _this = _super.call(this) || this;
        _this.vertexModel = vertexModel;
        _this.centerRect(rect);
        _this.rotateOriginRect(rect);
        _this.scaleRect(rect);
        return _this;
    }
    ModelObject2d.prototype.init = function (engineHelper) {
        var renderOpt = new RenderOption_1.default();
        renderOpt.renderType = RenderOption_1.RenderType.RECTANGLE;
        renderOpt.shaderType = RenderOption_1.ShaderType.TWO_DIMENSION;
        this.shaderEntity = new ShaderEntityBuilder_1.default(engineHelper)
            .addBuffer(this.vertexModel)
            .createTexture(this.vertexModel.textureSource)
            .build(this, renderOpt);
    };
    return ModelObject2d;
}(EngineObject_1.default));
exports["default"] = ModelObject2d;
//# sourceMappingURL=ModelObject2d.js.map

/***/ }),

/***/ "./dist/Core/EngineEntity/ModelObject3d.js":
/*!*************************************************!*\
  !*** ./dist/Core/EngineEntity/ModelObject3d.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var ShaderEntityBuilder_1 = __webpack_require__(/*! ../Builder/ShaderEntityBuilder */ "./dist/Core/Builder/ShaderEntityBuilder.js");
var RenderOption_1 = __webpack_require__(/*! ../Data/RenderOption */ "./dist/Core/Data/RenderOption.js");
var EngineObject_1 = __webpack_require__(/*! ./EngineObject */ "./dist/Core/EngineEntity/EngineObject.js");
var ModelObject3d = /** @class */ (function (_super) {
    __extends(ModelObject3d, _super);
    function ModelObject3d(rect, vertexModel) {
        var _this = _super.call(this) || this;
        _this.renderType = RenderOption_1.RenderType.TRIANGLE;
        _this.vertexModel = vertexModel;
        _this.centerRect(rect);
        _this.rotateOriginRect(rect);
        _this.scaleRect(rect);
        return _this;
    }
    ModelObject3d.prototype.setRenderType = function (renderType) {
        this.renderType = renderType;
    };
    ModelObject3d.prototype.init = function (engineHelper) {
        var renderOpt = new RenderOption_1.default();
        renderOpt.renderType = this.renderType;
        renderOpt.shaderType = RenderOption_1.ShaderType.THREE_DIMENSION;
        this.shaderEntity = new ShaderEntityBuilder_1.default(engineHelper)
            .addBuffer(this.vertexModel)
            .createTexture(this.vertexModel.textureSource)
            .build(this, renderOpt);
    };
    return ModelObject3d;
}(EngineObject_1.default));
exports["default"] = ModelObject3d;
//# sourceMappingURL=ModelObject3d.js.map

/***/ }),

/***/ "./dist/Core/EngineEntity/ModelObjectRect3d.js":
/*!*****************************************************!*\
  !*** ./dist/Core/EngineEntity/ModelObjectRect3d.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var ShaderEntityBuilder_1 = __webpack_require__(/*! ../Builder/ShaderEntityBuilder */ "./dist/Core/Builder/ShaderEntityBuilder.js");
var RenderOption_1 = __webpack_require__(/*! ../Data/RenderOption */ "./dist/Core/Data/RenderOption.js");
var EngineObject_1 = __webpack_require__(/*! ./EngineObject */ "./dist/Core/EngineEntity/EngineObject.js");
var ModelObjectRect3d = /** @class */ (function (_super) {
    __extends(ModelObjectRect3d, _super);
    function ModelObjectRect3d(rect, vertexModel) {
        var _this = _super.call(this) || this;
        _this.vertexModel = vertexModel;
        _this.centerRect(rect);
        _this.rotateOriginRect(rect);
        _this.scaleRect(rect);
        return _this;
    }
    ModelObjectRect3d.prototype.init = function (engineHelper) {
        var renderOpt = new RenderOption_1.default();
        renderOpt.renderType = RenderOption_1.RenderType.RECTANGLE;
        renderOpt.shaderType = RenderOption_1.ShaderType.THREE_DIMENSION;
        this.shaderEntity = new ShaderEntityBuilder_1.default(engineHelper)
            .addBuffer(this.vertexModel)
            .createTexture(this.vertexModel.textureSource)
            .build(this, renderOpt);
    };
    return ModelObjectRect3d;
}(EngineObject_1.default));
exports["default"] = ModelObjectRect3d;
//# sourceMappingURL=ModelObjectRect3d.js.map

/***/ }),

/***/ "./dist/Core/EngineEntity/ModelPosition.js":
/*!*************************************************!*\
  !*** ./dist/Core/EngineEntity/ModelPosition.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var gl_matrix_1 = __webpack_require__(/*! gl-matrix */ "./node_modules/gl-matrix/esm/index.js");
var Rect3d_1 = __webpack_require__(/*! ../Data/Rect3d */ "./dist/Core/Data/Rect3d.js");
var Position_1 = __webpack_require__(/*! ./Position */ "./dist/Core/EngineEntity/Position.js");
var ModelPosition = /** @class */ (function () {
    function ModelPosition() {
        var _this = this;
        this.position = new Position_1.default();
        this.dirtyModel = true;
        this.dirtyQuat = true;
        this.dirtyPos = true;
        this.dirtyScale = true;
        this.dirtyOrigin = true;
        this.intermediateModels = [
            gl_matrix_1.mat4.create(),
            gl_matrix_1.mat4.create(),
            gl_matrix_1.mat4.create(),
            gl_matrix_1.mat4.create(),
        ];
        // prevent memory reallocation of objects
        this.initialMat4Temp = gl_matrix_1.mat4.create();
        this.rotateQuatTemp = gl_matrix_1.quat.create();
        this.rotateMat4Temp = gl_matrix_1.mat4.create();
        this.getModel = function () {
            if (_this.dirtyModel) {
                _this.dirtyModel = false;
                _this._buildModel();
            }
            return _this.cachedModel;
        };
        this.getPosition = function () {
            return _this.position;
        };
    }
    ModelPosition.prototype.setPosition = function (position) {
        this.position = position;
        this.dirtyOrigin = true;
        this.dirtyQuat = true;
        this.dirtyPos = true;
        this.dirtyModel = true;
    };
    ModelPosition.prototype.pos = function () {
        return [this.position.x, this.position.y, this.position.z];
    };
    ModelPosition.prototype.centerRect = function (rect) {
        this.center(rect.x, rect.y, rect.z);
    };
    ModelPosition.prototype.rotateOriginRect = function (rect) {
        this.rotateOrigin(rect.x, rect.y, rect.z);
    };
    ModelPosition.prototype.centerCoord = function (coord) {
        this.center(coord.x, coord.y, coord.z);
    };
    ModelPosition.prototype.center = function (x, y, z) {
        if (this.position.x === x &&
            this.position.y === y &&
            this.position.z === z) {
            return;
        }
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;
        this.dirtyPos = true;
        this.dirtyModel = true;
        this.rotateOrigin(x, y, z);
    };
    ModelPosition.prototype.translate = function (dx, dy, dz) {
        this.position.x += dx;
        this.position.y += dy;
        this.position.z += dz;
        this.dirtyPos = true;
        this.dirtyModel = true;
        this.rotateOrigin(this.position.x, this.position.y, this.position.z);
    };
    ModelPosition.prototype.rotateOrigin = function (x, y, z) {
        if (this.position.originX !== x ||
            this.position.originY !== y ||
            this.position.originZ !== z) {
            this.position.originX = x;
            this.position.originY = y;
            this.position.originZ = z;
            this.dirtyOrigin = true;
            this.dirtyQuat = true;
            this.dirtyModel = true;
        }
    };
    ModelPosition.prototype.angleX = function (x) {
        if (this.position.ax !== x) {
            this.position.ax = x;
            this.dirtyQuat = true;
            this.dirtyModel = true;
        }
    };
    ModelPosition.prototype.angleY = function (y) {
        if (this.position.ay !== y) {
            this.position.ay = y;
            this.dirtyQuat = true;
            this.dirtyModel = true;
        }
    };
    ModelPosition.prototype.angleZ = function (z) {
        if (this.position.az !== z) {
            this.position.az = z;
            this.dirtyQuat = true;
            this.dirtyModel = true;
        }
    };
    ModelPosition.prototype.rotateX = function (x) {
        this.angleX(x);
    };
    ModelPosition.prototype.rotateY = function (y) {
        this.angleY(y);
    };
    ModelPosition.prototype.rotateZ = function (z) {
        this.angleZ(z);
    };
    ModelPosition.prototype.scaleX = function (x) {
        this.position.scaleX = x;
        this.position.width = this.position.scaleX;
        this.dirtyScale = true;
        this.dirtyModel = true;
    };
    ModelPosition.prototype.scaleY = function (y) {
        this.position.scaleY = y;
        this.position.height = this.position.scaleY;
        this.dirtyScale = true;
        this.dirtyModel = true;
    };
    ModelPosition.prototype.scaleZ = function (z) {
        this.position.scaleZ = z;
        this.dirtyScale = true;
        this.dirtyModel = true;
    };
    ModelPosition.prototype.scale = function (x, y, z) {
        if (this.position.scaleX === x &&
            this.position.scaleY === y &&
            this.position.scaleZ === z) {
            return;
        }
        this.position.scaleX = x;
        this.position.scaleY = y;
        this.position.scaleZ = z;
        this.position.width = x;
        this.position.height = y;
        this.position.length = z;
        this.dirtyScale = true;
        this.dirtyModel = true;
    };
    ModelPosition.prototype.scaleRect = function (rect) {
        this.scale(rect.width, rect.height, rect.length);
    };
    ModelPosition.prototype._buildQuat = function () {
        var quatMat = this.createMat4NoAlloc(this.rotateMat4Temp);
        var quatRotationxyz = this.createQuatNoAlloc(this.rotateQuatTemp);
        quatRotationxyz = gl_matrix_1.quat.rotateX(quatRotationxyz, quatRotationxyz, this.degreesToRadians(this.position.ax));
        quatRotationxyz = gl_matrix_1.quat.rotateY(quatRotationxyz, quatRotationxyz, this.degreesToRadians(this.position.ay));
        quatRotationxyz = gl_matrix_1.quat.rotateZ(quatRotationxyz, quatRotationxyz, this.degreesToRadians(this.position.az));
        quatRotationxyz = gl_matrix_1.quat.normalize(quatRotationxyz, quatRotationxyz);
        return gl_matrix_1.mat4.fromQuat(quatMat, quatRotationxyz);
    };
    ModelPosition.prototype.getIntermediateModel = function (point, dest) {
        var org = this.intermediateModels[point];
        for (var index in dest) {
            if (dest.hasOwnProperty(index)) {
                dest[index] = org[index];
            }
        }
        return dest;
    };
    ModelPosition.prototype._buildModelIntermediate = function (point, dest) {
        // faster copy - preserve existing reference to prevent GC
        var org = this.intermediateModels[point];
        for (var index in dest) {
            if (dest.hasOwnProperty(index)) {
                org[index] = dest[index];
            }
        }
        return dest;
    };
    ModelPosition.prototype.createQuatNoAlloc = function (out) {
        out[0] = 0;
        out[1] = 0;
        out[2] = 0;
        out[3] = 1;
        return out;
    };
    ModelPosition.prototype.createMat4NoAlloc = function (out) {
        out[0] = 1;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = 1;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[10] = 1;
        out[11] = 0;
        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
        out[15] = 1;
        return out;
    };
    ModelPosition.prototype._buildModel = function () {
        var _dirty = false;
        var dest = this.createMat4NoAlloc(this.initialMat4Temp);
        if (this.dirtyOrigin) {
            _dirty = true;
            var origin_1 = [
                this.position.originX,
                this.position.originY,
                this.position.originZ,
            ];
            gl_matrix_1.mat4.translate(dest, dest, origin_1);
            this._buildModelIntermediate(0, dest);
        }
        else {
            dest = this.getIntermediateModel(0, dest);
        }
        // cache this one as its heavy
        if (this.dirtyQuat || _dirty) {
            _dirty = true;
            this.quatRotationxyz = this._buildQuat();
            gl_matrix_1.mat4.multiply(dest, dest, this.quatRotationxyz);
            this._buildModelIntermediate(1, dest);
        }
        else {
            dest = this.getIntermediateModel(1, dest);
        }
        if (this.dirtyPos || _dirty) {
            _dirty = true;
            var negOrigin = [
                -1 * this.position.originX,
                -1 * this.position.originY,
                -1 * this.position.originZ,
            ];
            gl_matrix_1.mat4.translate(dest, dest, negOrigin);
            var pos = [
                this.position.x,
                this.position.y,
                this.position.z,
            ];
            gl_matrix_1.mat4.translate(dest, dest, pos);
            this._buildModelIntermediate(2, dest);
        }
        else {
            dest = this.getIntermediateModel(2, dest);
        }
        if (this.dirtyScale || _dirty) {
            _dirty = true;
            var scale = [
                this.position.scaleX,
                this.position.scaleY,
                this.position.scaleZ,
            ];
            gl_matrix_1.mat4.scale(dest, dest, scale);
            this._buildModelIntermediate(3, dest);
        }
        else {
            dest = this.getIntermediateModel(3, dest);
        }
        this.dirtyPos = false;
        this.dirtyQuat = false;
        this.dirtyScale = false;
        this.dirtyOrigin = false;
        this.cachedModel = dest;
    };
    ModelPosition.prototype.degreesToRadians = function (degrees) {
        return Math.round(gl_matrix_1.glMatrix.toRadian(degrees) * 100) / 100;
    };
    ModelPosition.prototype.setRect = function (rect) {
        this.scaleRect(rect);
        this.centerRect(rect);
    };
    // memory optimised
    ModelPosition.prototype.setRect2 = function (x, y, z, width, height, length) {
        this.scale(width, height, length);
        this.center(x, y, z);
    };
    // memory optimised
    ModelPosition.prototype.getRect2 = function () {
        return this.position;
    };
    ModelPosition.prototype.getRect = function () {
        return new Rect3d_1.default(this.position.x, this.position.y, this.position.z, this.position.width, this.position.height, this.position.length);
    };
    return ModelPosition;
}());
exports["default"] = ModelPosition;
//# sourceMappingURL=ModelPosition.js.map

/***/ }),

/***/ "./dist/Core/EngineEntity/Position.js":
/*!********************************************!*\
  !*** ./dist/Core/EngineEntity/Position.js ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Rect2d_1 = __webpack_require__(/*! ../Data/Rect2d */ "./dist/Core/Data/Rect2d.js");
var Position = /** @class */ (function (_super) {
    __extends(Position, _super);
    function Position() {
        var _this = _super.call(this, 0, 0, 0, 0, 0) || this;
        _this.x = 0;
        _this.y = 0;
        _this.z = 0;
        _this.ax = 0;
        _this.ay = 0;
        _this.az = 0;
        _this.nx = 0;
        _this.ny = 0;
        _this.nz = 0;
        _this.width = 0;
        _this.height = 0;
        _this.length = 0;
        _this.scaleX = 1;
        _this.scaleY = 1;
        _this.scaleZ = 1;
        _this.originX = 0;
        _this.originY = 0;
        _this.originZ = 0;
        _this.maxHeight = 0;
        _this.maxWidth = 0;
        return _this;
    }
    return Position;
}(Rect2d_1.default));
exports["default"] = Position;
//# sourceMappingURL=Position.js.map

/***/ }),

/***/ "./dist/Core/EngineEntity/ShaderEntity.js":
/*!************************************************!*\
  !*** ./dist/Core/EngineEntity/ShaderEntity.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ShaderEntity = void 0;
var RenderOption_1 = __webpack_require__(/*! ../Data/RenderOption */ "./dist/Core/Data/RenderOption.js");
var ShaderEntity = /** @class */ (function () {
    function ShaderEntity() {
        this.opt = new RenderOption_1.default();
        this.clone = false;
    }
    ShaderEntity.prototype.getVertexModel = function () {
        return this.vertexModel;
    };
    ShaderEntity.prototype.getVertexBufferId = function () {
        return this.vertexModel.vertexBufferId;
    };
    ShaderEntity.prototype.getOpt = function () {
        return this.opt;
    };
    ShaderEntity.prototype.getModel = function () {
        return this.model();
    };
    ShaderEntity.prototype.getTextureSource = function () {
        return this.src;
    };
    ShaderEntity.prototype.setTextureSource = function (src) {
        this.src = src;
    };
    ShaderEntity.prototype.renderCopy = function (model) {
        var newInstance = this.shallowCopy();
        newInstance.model = model.getModel;
        newInstance.modelPosition = model.getPosition;
        return newInstance;
    };
    ShaderEntity.prototype.shallowCopy = function () {
        var newInstance = new ShaderEntity();
        newInstance.opt = this.opt;
        newInstance.vertexModel = this.vertexModel;
        newInstance.rendererBufferId = this.rendererBufferId;
        newInstance.rendererTextureRef = this.rendererTextureRef;
        newInstance.src = this.src;
        newInstance.isTop = this.isTop;
        newInstance.hidden = this.hidden;
        return newInstance;
    };
    return ShaderEntity;
}());
exports.ShaderEntity = ShaderEntity;
//# sourceMappingURL=ShaderEntity.js.map

/***/ }),

/***/ "./dist/Core/EngineHelper.js":
/*!***********************************!*\
  !*** ./dist/Core/EngineHelper.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var App_1 = __webpack_require__(/*! ./App */ "./dist/Core/App.js");
var PlaneType_1 = __webpack_require__(/*! ./Data/PlaneType */ "./dist/Core/Data/PlaneType.js");
var RenderOption_1 = __webpack_require__(/*! ./Data/RenderOption */ "./dist/Core/Data/RenderOption.js");
var TextureVertexModel_1 = __webpack_require__(/*! ./Data/TextureVertexModel */ "./dist/Core/Data/TextureVertexModel.js");
var EngineObjectHelper_1 = __webpack_require__(/*! ./EngineEntity/EngineObjectHelper */ "./dist/Core/EngineEntity/EngineObjectHelper.js");
var Font_1 = __webpack_require__(/*! ./Font/Font */ "./dist/Core/Font/Font.js");
var Renderer_1 = __webpack_require__(/*! ./Renderer */ "./dist/Core/Renderer.js");
var CollisionDetection_1 = __webpack_require__(/*! ./Physics/CollisionDetection */ "./dist/Core/Physics/CollisionDetection.js");
var EngineHelper = /** @class */ (function () {
    function EngineHelper(notificationQueue, subscriberPool, camera) {
        var _this = this;
        this.resourcesLoading = [];
        this.bufferCache = {};
        this.fontCache = {};
        this.fontNameKeyReverse = {};
        this.uvCache = {};
        this.vertexUVCache = {};
        this.cacheId = 0;
        this.camera = camera;
        this.notificationQueue = notificationQueue;
        this.subscriberPool = subscriberPool;
        subscriberPool.listen(App_1.AppSubscription.GET_FPS, function (fps) { return (_this.fps = fps); });
    }
    EngineHelper.prototype.startIteration = function () {
        this.subscriberPool.publish(App_1.AppSubscription.START_ITERATION);
    };
    EngineHelper.prototype.render = function (entity) {
        var shaderProgram = entity.opt.shaderType;
        if ((shaderProgram === RenderOption_1.ShaderType.TWO_DIMENSION ||
            shaderProgram === RenderOption_1.ShaderType.COLOUR) &&
            this.camera.camera3d.isOutOfBound(entity.modelPosition())) {
            return;
        }
        var model = entity.getModel();
        if (entity.clone) {
            model = model.slice(0);
        }
        this.notificationQueue.pushPayload(Renderer_1.RendererNotification.renderEntity(entity, model));
    };
    EngineHelper.prototype.renderCopy = function (entity, pos) {
        this.render(entity.shaderEntity.renderCopy(pos));
    };
    EngineHelper.prototype.setLighting = function (light) {
        this.notificationQueue.pushPayload(Renderer_1.RendererNotification.setLighting(light));
    };
    EngineHelper.prototype.createTexture = function (object) {
        this.subscriberPool.publish(Renderer_1.RendererSubscription.CREATE_TEXTURE, Renderer_1.RendererSubscription.createTexturePayload(object, this.resourcesLoading));
    };
    EngineHelper.prototype.getFPS = function () {
        return this.fps;
    };
    EngineHelper.prototype.getTotalPixelHeight = function () {
        return window.screen.height;
    };
    EngineHelper.prototype.getTotalPixelWidth = function () {
        return window.screen.width;
    };
    EngineHelper.prototype.getScreenHeight = function () {
        return this.camera.height;
    };
    EngineHelper.prototype.getScreenWidth = function () {
        return this.camera.width;
    };
    EngineHelper.prototype.setTime = function (time) {
        if (time) {
            this.time = time;
        }
    };
    EngineHelper.prototype.getTime = function () {
        return this.time;
    };
    EngineHelper.prototype.getVerticesById = function (id) {
        if (this.bufferCache[id]) {
            return this.bufferCache[id].vertices;
        }
        else {
            console.error("Unable to find src in cache", id, this);
            throw new Error("unable to find src in cache");
        }
    };
    EngineHelper.prototype.updateBufferCache = function (buffer, verticesCacheId) {
        buffer.cacheId = verticesCacheId;
        this.bufferCache[verticesCacheId] = buffer;
        return verticesCacheId;
    };
    EngineHelper.prototype.addBufferCache = function (buffer) {
        var cacheId = this.cacheId++;
        this.bufferCache[cacheId] = buffer;
        buffer.cacheId = cacheId;
        return cacheId;
    };
    EngineHelper.prototype.getResource = function (src) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            console.log("Loading resource ".concat(src));
            xhr.open("GET", src);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    // handle file:// loading with status 0
                    if (xhr.status === 200 || xhr.status === 0) {
                        var cacheId_1 = _this.cacheId++;
                        resolve({
                            data: xhr.responseText,
                            engineHelper: _this,
                            cacheId: cacheId_1,
                            registerBuffer: function (obj) {
                                _this.bufferCache[cacheId_1] = obj;
                            },
                            registerFont: function (meta) {
                                var font = new Font_1.default(meta);
                                _this.fontCache[cacheId_1] = {
                                    meta: meta,
                                    font: font,
                                };
                                _this.fontNameKeyReverse[src] = cacheId_1;
                            },
                        });
                    }
                    else {
                        reject(xhr.responseText);
                    }
                }
            };
            xhr.send();
        });
        this.resourcesLoading.push(promise);
        return promise;
    };
    EngineHelper.prototype.getAllResourcesLoading = function () {
        return Promise.all(this.resourcesLoading);
    };
    EngineHelper.prototype.updateBuffer = function (object) {
        this.updateBufferCache(object.vertexModel.createModel(), object.vertexModel.vertexBufferId);
        var notification = Renderer_1.RendererNotification.updateBuffer(object, this.getBuffer(object));
        this.notificationQueue.pushPayload(notification);
    };
    EngineHelper.prototype.getBufferModelData = function (object) {
        return this.bufferCache[object.getVertexBufferId()];
    };
    EngineHelper.prototype.getBuffer = function (object) {
        var buffer = this.getBufferModelData(object).vertices;
        if (!buffer) {
            throw new Error("No buffer was found for this entity");
        }
        return buffer;
    };
    EngineHelper.prototype.registerEntity = function (object) {
        this.subscriberPool.publish(Renderer_1.RendererSubscription.REGISTER_ENTITY, Renderer_1.RendererSubscription.registerEntityPayload(object, this.getBufferModelData(object)));
    };
    EngineHelper.prototype.initFont = function () {
        for (var fontType in this.fontCache) {
            if (!this.fontCache.hasOwnProperty(fontType)) {
                continue;
            }
            var font = this.fontCache[fontType].font;
            font.init(this);
        }
    };
    EngineHelper.prototype.renderFont = function () {
        for (var fontType in this.fontCache) {
            if (!this.fontCache.hasOwnProperty(fontType)) {
                continue;
            }
            var font = this.fontCache[fontType].font;
            font.render(this);
        }
    };
    EngineHelper.prototype.updateFont = function () {
        for (var fontType in this.fontCache) {
            if (!this.fontCache.hasOwnProperty(fontType)) {
                continue;
            }
            var font = this.fontCache[fontType].font;
            font.update(this);
        }
    };
    EngineHelper.prototype.newVertexModel2d = function (cacheId) {
        return this.newVertexModel(cacheId, PlaneType_1.default.YX);
    };
    EngineHelper.prototype.newVertexModelUv3d = function (cacheId) {
        var cache = this.vertexUVCache[cacheId];
        var vertexModel = new TextureVertexModel_1.default().fillRenderUnits(cache.uv);
        vertexModel.textureSource = cache.source;
        return vertexModel;
    };
    EngineHelper.prototype.createPlaneVertexModel = function (src, uv, plane) {
        var vertexModel = new TextureVertexModel_1.default().createRenderUnits(4);
        vertexModel.textureSource = src;
        EngineObjectHelper_1.default.vertex.plane(vertexModel.renderUnits, plane);
        EngineObjectHelper_1.default.vertex.planeUV(vertexModel.renderUnits, uv);
        return vertexModel;
    };
    EngineHelper.prototype.getUVCache = function (name) {
        return this.uvCache[name].uv;
    };
    EngineHelper.prototype.addUVCache = function (source, name, uv) {
        this.uvCache[name] = { source: source, uv: uv };
    };
    EngineHelper.prototype.getVertexUvCache = function (name) {
        return this.vertexUVCache[name].uv;
    };
    EngineHelper.prototype.newVertexModel = function (cacheId, plane) {
        var cache = this.uvCache[cacheId];
        if (!cache) {
            var cache_1 = this.uvCache["missing"];
            console.warn("texture ".concat(cacheId, " has not been loaded - loading default texture"));
            return this.createPlaneVertexModel(cache_1.source, cache_1.uv, plane);
        }
        return this.createPlaneVertexModel(cache.source, cache.uv, plane);
    };
    EngineHelper.prototype.addVertexUvCache = function (textureSource, name, vertexUv) {
        this.vertexUVCache[name] = { source: textureSource, uv: vertexUv };
    };
    EngineHelper.prototype.writeFont = function (fontRef) {
        var fontCacheId = undefined;
        if (typeof fontRef.$cacheId === "string") {
            fontCacheId = this.fontNameKeyReverse[fontRef.$cacheId];
        }
        else if (typeof fontRef.$cacheId === "number") {
            fontCacheId = fontRef.$cacheId;
        }
        else if (fontRef.$cacheId !== undefined) {
            throw new Error("fontId is not a number or string");
        }
        var font;
        if (fontCacheId === undefined) {
            font = Font_1.default.DefaultFont;
        }
        else {
            font = this.fontCache[fontCacheId].font;
        }
        return font.writeRef(fontRef);
    };
    EngineHelper.prototype.isClickedObject = function (event, object) {
        return this.isClicked(event, object.getRect2());
    };
    EngineHelper.prototype.isClicked = function (event, rect) {
        var distance = this.camera.camera3d.distanceEvent(event);
        return CollisionDetection_1.CollisionDetection.isPointInRect(rect, distance);
    };
    EngineHelper.prototype.rotate = function (event, rect) {
        var _a = this.camera.camera3d.position, x = _a.x, y = _a.y;
        return CollisionDetection_1.CollisionDetection.rotate(x + event.x, y + event.y, rect);
    };
    EngineHelper.prototype.updateProjectionMatrix = function () {
        this.notificationQueue.pushPayload(Renderer_1.RendererNotification.UPDATE_PROJECTION_MATRIX);
    };
    return EngineHelper;
}());
exports["default"] = EngineHelper;
//# sourceMappingURL=EngineHelper.js.map

/***/ }),

/***/ "./dist/Core/Events.js":
/*!*****************************!*\
  !*** ./dist/Core/Events.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.event = void 0;
var Coordinate_1 = __webpack_require__(/*! ./Data/Coordinate */ "./dist/Core/Data/Coordinate.js");
var Events = /** @class */ (function () {
    function Events() {
        var _this = this;
        this.eventDown = false;
        this.touchDown = false;
        this.eventDownX = 0.0;
        this.eventDownY = 0.0;
        this.eventDownDx = 0.0;
        this.eventDownDy = 0.0;
        this.keyDownMap = {};
        this.prevEvent = 0.0;
        this.timeStamp = 0.0;
        this.prevTimeStamp = 0.0;
        this.motionTimeStamp = 0.0;
        this.orientationQuaternion = [0.0, 0.0, 0.0, 0.0];
        this.NULL_EVENT = {
            x: 0,
            y: 0,
            dx: 0,
            dy: 0,
            dxRaw: 0,
            dyRaw: 0,
            eventType: -1,
            prevEventType: -1,
            timeStamp: 0,
            prevTimeStamp: 0,
            orientationQuaternion: [0, 0, 0, 0],
            rawEvent: undefined,
            isDown: false,
            isUp: false,
        };
        this.boundedWindow = false;
        this.callback = [];
        this.throttle = 1000.0 / 25.0;
        this.setThrottle = function (throttle) {
            if (throttle) {
                _this.throttle = throttle;
            }
        };
        this.bind = function (callback, webGLContainer) {
            _this.callback.push(callback);
            _this.webGLContainer = webGLContainer;
            _this.bindCanvas();
            _this.bindWindow();
        };
        this.handleOrientationChange = function () {
            _this.orientation = window.orientation || 0;
        };
        this.handleMotion = function (event) {
            if (!_this.motionTimeStamp) {
                _this.motionTimeStamp = event.timeStamp;
            }
            _this.incrementQuaternion(event);
            if (event && event.timeStamp - _this.motionTimeStamp > _this.throttle) {
                var tempEventDownX = _this.eventDownX;
                var tempEventDownY = _this.eventDownY;
                _this.eventDownX = _this.orientationQuaternion[0];
                _this.eventDownY = _this.orientationQuaternion[1];
                _this.handleEvent(event, Events.ORIENTATION);
                _this.eventDownX = tempEventDownX;
                _this.eventDownY = tempEventDownY;
                _this.prevEvent = Events.ORIENTATION;
                _this.motionTimeStamp = event.timeStamp;
                _this.orientationQuaternion = [0.0, 0.0, 0.0, 1.0];
            }
        };
        this.incrementQuaternion = function (event) {
            var accData = event.rotationRate
                ? event.rotationRate
                : { beta: 0, gamma: 0, alpha: 0 };
            var eventQuaternion = _this.getQuaternion(accData.alpha, accData.beta, accData.gamma);
            _this.orientationQuaternion[0] += eventQuaternion[0];
            _this.orientationQuaternion[1] += eventQuaternion[1];
            _this.orientationQuaternion[2] += eventQuaternion[2];
        };
        this.buildEvent = function (evt, type) {
            if (!_this.webGLContainer.canvas)
                return _this.NULL_EVENT;
            return {
                x: _this.eventDownX / _this.webGLContainer.canvas.offsetWidth,
                y: 1 - _this.eventDownY / _this.webGLContainer.canvas.offsetHeight,
                dx: (2.0 * _this.eventDownDx) / _this.webGLContainer.canvas.offsetWidth,
                dy: (2.0 * _this.eventDownDy) / _this.webGLContainer.canvas.offsetHeight,
                dxRaw: _this.eventDownDx,
                dyRaw: _this.eventDownDy,
                eventType: type,
                prevEventType: _this.prevEvent,
                timeStamp: _this.timeStamp,
                prevTimeStamp: _this.prevTimeStamp,
                orientationQuaternion: _this.orientationQuaternion,
                rawEvent: evt,
                isDown: type === Events.DOWN,
                isUp: type === Events.UP,
            };
        };
        this.resize = function (evt) {
            _this.handleEvent(evt, Events.RESIZE);
        };
        this.buildEventKey = function (evt, type) {
            return {
                eventType: type,
                keyCode: evt.key,
                code: evt.code,
                event: evt,
                keyDown: _this.keyDownMap,
                isDown: type === Events.DOWN,
                isUp: type === Events.UP,
            };
        };
        this.keyDown = function (evt) {
            _this.keyDownMap[evt.code] = true;
            _this.handleEvent(evt, Events.KEY_DOWN);
            switch (evt.keyCode) {
                // prevent arrow keys from scrolling window
                case 37:
                case 39:
                case 38:
                case 40:
                    evt.preventDefault();
                    break;
            }
        };
        this.keyUp = function (evt) {
            _this.keyDownMap[evt.code] = false;
            _this.handleEvent(evt, Events.KEY_UP);
        };
        this.handleMouseUp = function (evt) {
            _this.eventDown = false;
            _this.timeStamp = evt.timeStamp;
            _this.eventDownX = evt.offsetX;
            _this.eventDownY = evt.offsetY;
            _this.handleEvent(evt, Events.UP);
            _this.prevEvent = Events.UP;
            _this.prevTimeStamp = evt.timeStamp;
        };
        this.handleEventDown = function (evt) {
            _this.eventDown = true;
            _this.eventDownX = evt.offsetX;
            _this.eventDownY = evt.offsetY;
            _this.timeStamp = evt.timeStamp;
            _this.handleEvent(evt, Events.DOWN);
            _this.prevEvent = Events.DOWN;
            _this.prevTimeStamp = evt.timeStamp;
        };
        this.handleEventMove = function (evt) {
            if (_this.eventDown && evt.timeStamp - _this.timeStamp > _this.throttle) {
                var xUp = evt.offsetX;
                var yUp = evt.offsetY;
                _this.eventDownDx = _this.eventDownX - xUp;
                _this.eventDownDy = _this.eventDownY - yUp;
                _this.eventDownX = xUp;
                _this.eventDownY = yUp;
                _this.timeStamp = evt.timeStamp;
                _this.handleEvent(evt, Events.DRAG);
                _this.prevEvent = Events.DRAG;
                _this.prevTimeStamp = evt.timeStamp;
            }
        };
        this.handleTouchEnd = function (evt) {
            _this.touchDown = false;
            _this.timeStamp = evt.timeStamp;
            _this.handleEvent(evt, Events.UP);
            _this.prevEvent = Events.UP;
            _this.prevTimeStamp = evt.timeStamp;
        };
        this.handleTouchStart = function (evt) {
            _this.touchDown = true;
            _this.timeStamp = evt.timeStamp;
            if (evt.target instanceof HTMLElement) {
                var rect = evt.target.getBoundingClientRect();
                _this.eventDownX = evt.touches[0].clientX - rect.left;
                _this.eventDownY = evt.touches[0].clientY - rect.top;
            }
            _this.handleEvent(evt, Events.DOWN);
            _this.prevEvent = Events.DOWN;
            _this.prevTimeStamp = evt.timeStamp;
            if (evt.cancelable) {
                evt.preventDefault();
            }
        };
        this.handleTouchMove = function (evt) {
            if (_this.touchDown &&
                evt.timeStamp - _this.timeStamp > _this.throttle &&
                evt.target instanceof HTMLElement) {
                var rect = evt.target.getBoundingClientRect();
                var xUp = evt.touches[0].clientX - rect.left;
                var yUp = evt.touches[0].clientY - rect.top;
                _this.eventDownDx = (_this.eventDownX - xUp) / 2.0;
                _this.eventDownDy = (_this.eventDownY - yUp) / 2.0;
                _this.eventDownX = xUp;
                _this.eventDownY = yUp;
                _this.timeStamp = evt.timeStamp;
                _this.handleEvent(evt, Events.DRAG);
                _this.prevEvent = Events.DRAG;
                _this.prevTimeStamp = evt.timeStamp;
            }
            // prevent device scrolling
            if (evt.cancelable) {
                evt.preventDefault();
            }
        };
        this.handleEvent = function (evt, event) {
            var targetEvent = _this.buildEvent(evt, event);
            for (var i = 0; i < _this.callback.length; i++) {
                var callbackPropagate = _this.callback[i](targetEvent);
                if (callbackPropagate === false) {
                    break;
                }
            }
        };
    }
    Events.prototype.delete = function (cb) {
        this.callback = this.callback.filter(function (c) { return c !== cb; });
    };
    Events.prototype.bindWindow = function () {
        if (this.boundedWindow) {
            return;
        }
        window.addEventListener("mouseup", this.isBodyFocus(this.handleMouseUp), true);
        window.addEventListener("touchend", this.isBodyFocus(this.handleTouchEnd), true);
        window.addEventListener("resize", this.resize, true);
        window.addEventListener("keydown", this.isBodyFocus(this.keyDown), true);
        window.addEventListener("keyup", this.isBodyFocus(this.keyUp), true);
        if (window.hasOwnProperty("DeviceMotionEvent")) {
            window.addEventListener("devicemotion", this.handleMotion, true);
        }
        if (window.hasOwnProperty("DeviceOrientationEvent")) {
            window.addEventListener("orientationchange", this.handleOrientationChange, true);
        }
        this.boundedWindow = true;
    };
    Events.prototype.bindCanvas = function () {
        this.webGLContainer.canvas.addEventListener("mousedown", this.handleEventDown, true);
        this.webGLContainer.canvas.addEventListener("mousemove", this.handleEventMove, true);
        this.webGLContainer.canvas.addEventListener("touchstart", this.handleTouchStart, true);
        this.webGLContainer.canvas.addEventListener("touchmove", this.handleTouchMove, true);
    };
    Events.prototype.isBodyFocus = function (callback) {
        return function (_event) {
            if (window.document.activeElement === window.document.body) {
                callback(_event);
            }
            else {
                // console.trace('body is not focused when event triggered', event);
            }
        };
    };
    Events.prototype.getQuaternion = function (alpha, beta, gamma) {
        var degtorad = Math.PI / 180.0;
        var radtodeg = 180.0 / Math.PI;
        var _x = beta ? beta * degtorad : 0;
        var _y = gamma ? gamma * degtorad : 0;
        var _z = alpha ? alpha * degtorad : 0;
        var cX = Math.cos(_x / 2);
        var cY = Math.cos(_y / 2);
        var cZ = Math.cos(_z / 2);
        var sX = Math.sin(_x / 2);
        var sY = Math.sin(_y / 2);
        var sZ = Math.sin(_z / 2);
        var w = cX * cY * cZ - sX * sY * sZ;
        var x = sX * cY * cZ - cX * sY * sZ;
        var y = cX * sY * cZ + sX * cY * sZ;
        var z = cX * cY * sZ + sX * sY * cZ;
        var screenAccData = new Coordinate_1.default(0, 0, 0);
        switch (this.orientation) {
            case 90:
                screenAccData.x = -x;
                screenAccData.y = z;
                break;
            case 180:
                screenAccData.x = -z;
                screenAccData.y = -x;
                break;
            case 270:
            case -90:
                screenAccData.x = x;
                screenAccData.y = -z;
                break;
            default:
                screenAccData.x = z;
                screenAccData.y = x;
                break;
        }
        // convert to engine coords
        return [
            (screenAccData.x * radtodeg) / w,
            (-1 * screenAccData.y * radtodeg) / w,
            (y * radtodeg) / w,
            1.0,
        ];
    };
    Events.DOWN = 1;
    Events.DRAG = 2;
    Events.UP = 3;
    Events.RESIZE = 4;
    Events.ORIENTATION = 5;
    Events.KEY_DOWN = 6;
    Events.KEY_UP = 7;
    Events.SYSTEM_EVENTS = 8;
    return Events;
}());
exports["default"] = Events;
exports.event = new Events();
//# sourceMappingURL=Events.js.map

/***/ }),

/***/ "./dist/Core/Font/Font.js":
/*!********************************!*\
  !*** ./dist/Core/Font/Font.js ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FontReference = void 0;
var EntityManager_1 = __webpack_require__(/*! ../../Manager/EntityManager */ "./dist/Manager/EntityManager.js");
var Timer_1 = __webpack_require__(/*! ../Common/Timer */ "./dist/Core/Common/Timer.js");
var Coordinate_1 = __webpack_require__(/*! ../Data/Coordinate */ "./dist/Core/Data/Coordinate.js");
var PlaneType_1 = __webpack_require__(/*! ../Data/PlaneType */ "./dist/Core/Data/PlaneType.js");
var Rect2d_1 = __webpack_require__(/*! ../Data/Rect2d */ "./dist/Core/Data/Rect2d.js");
var EngineObjectHelper_1 = __webpack_require__(/*! ../EngineEntity/EngineObjectHelper */ "./dist/Core/EngineEntity/EngineObjectHelper.js");
var ModelObject2d_1 = __webpack_require__(/*! ../EngineEntity/ModelObject2d */ "./dist/Core/EngineEntity/ModelObject2d.js");
var ModelPosition_1 = __webpack_require__(/*! ../EngineEntity/ModelPosition */ "./dist/Core/EngineEntity/ModelPosition.js");
var Renderer_1 = __webpack_require__(/*! ../Renderer */ "./dist/Core/Renderer.js");
var FontChar = /** @class */ (function (_super) {
    __extends(FontChar, _super);
    function FontChar(fontChar, rect, vertexModel) {
        var _this = _super.call(this, rect, vertexModel) || this;
        _this.fontChar = fontChar;
        return _this;
    }
    return FontChar;
}(ModelObject2d_1.default));
var RenderFont = /** @class */ (function () {
    function RenderFont(font, fontPos, time) {
        this.repeat = false;
        this.newFont(font, fontPos, time);
    }
    RenderFont.prototype.render = function (engineHelper) {
        if (this.isRepeat() && !this.repeat) {
            return;
        }
        else {
            this.repeat = false;
        }
        if (this.shaderEntity) {
            engineHelper.render(this.shaderEntity);
        }
    };
    RenderFont.prototype.expire = function () {
        this.displayTime = -1;
        this.shaderEntity = undefined;
        this.font = undefined;
    };
    RenderFont.prototype.isExpired = function () {
        return (this.displayTime !== undefined &&
            !this.isRepeat() &&
            this.displayTime < this.timer.peak());
    };
    RenderFont.prototype.refresh = function () {
        this.repeat = true;
    };
    RenderFont.prototype.isRepeat = function () {
        return this.displayTime === 0;
    };
    RenderFont.prototype.newFont = function (font, fontPos, time) {
        this.font = font;
        this.displayTime = time;
        this.timer = this.timer ? this.timer : new Timer_1.default();
        this.timer.start();
        this.id = this.id ? this.id : RenderFont.$id++;
        this.shaderEntity = font.shaderEntity.shallowCopy();
        var pos = new ModelPosition_1.default();
        pos.centerRect(fontPos);
        pos.rotateOriginRect(fontPos);
        pos.rotateZ(180);
        pos.scaleRect(fontPos);
        this.shaderEntity.model = pos.getModel;
        this.shaderEntity.modelPosition = function () { return pos.position; };
        this.modelPos = pos;
    };
    RenderFont.$id = 0;
    return RenderFont;
}());
var FontManager = /** @class */ (function (_super) {
    __extends(FontManager, _super);
    function FontManager(metaData) {
        var _this = _super.call(this) || this;
        _this.metaData = metaData;
        _this.fonts = {};
        _this.renderFontState = {};
        _this.renderFontPool = [];
        _this.avgWidth = 0;
        _this.avgHeight = 0;
        _this.count = 0;
        return _this;
    }
    FontManager.prototype.getFont = function (charCode) {
        return this.fonts[charCode];
    };
    FontManager.prototype.createRender = function (font, fontPos, time) {
        var renderFont;
        if (this.renderFontPool.length > 0) {
            renderFont = this.renderFontPool.pop();
            renderFont.newFont(font, fontPos, time);
        }
        else {
            renderFont = new RenderFont(font, fontPos, time);
        }
        this.renderFontState[renderFont.id] = renderFont;
        return renderFont;
    };
    FontManager.prototype.refreshExpired = function () {
        var _this = this;
        Object.values(this.renderFontState).forEach(function (font) {
            if (font.isExpired()) {
                delete _this.renderFontState[font.id];
                _this.renderFontPool.push(font);
            }
        });
    };
    FontManager.prototype.update = function (engineHelper) {
        this.refreshExpired();
        _super.prototype.update.call(this, engineHelper);
    };
    FontManager.prototype.render = function (engineHelper) {
        var fonts = Object.values(this.renderFontState);
        fonts.forEach(function (r) { return r.render(engineHelper); });
        this.count = fonts.length;
    };
    FontManager.prototype.init = function (engineHelper) {
        var context = this.metaData.context;
        var fonts = context.fonts;
        var defaultRect = new Rect2d_1.default(0.5, 0.5, 1.0, 1.0, 1.0);
        var totalWidth = 0.0;
        var totalHeight = 0.0;
        var totalNo = 0;
        for (var fontIdx in fonts) {
            var fontChar = fonts[fontIdx];
            var pos = [
                fontChar.x,
                fontChar.y,
                fontChar.x + fontChar.width,
                fontChar.y + fontChar.height,
            ];
            var uvs = EngineObjectHelper_1.default.vertex.planeCW(pos, context.width, context.height);
            var vertexModel = engineHelper.createPlaneVertexModel(context.filename, uvs, PlaneType_1.default.YX);
            var font = new FontChar(fontChar, defaultRect, vertexModel);
            this.fonts[fontChar.charCode] = font;
            this.entities.push(font);
            totalWidth += fontChar.width;
            totalHeight += fontChar.height;
            totalNo += 1;
        }
        this.avgHeight = totalHeight / totalNo;
        this.avgWidth = totalWidth / totalNo;
        _super.prototype.init.call(this, engineHelper);
    };
    return FontManager;
}(EntityManager_1.default));
var FontReference = /** @class */ (function () {
    function FontReference() {
    }
    FontReference.prototype.render = function (engineHelper) {
        engineHelper.writeFont(this);
    };
    FontReference.newFont = function (pos, cacheId, time) {
        var ref = new FontReference();
        ref.displayRect = new Rect2d_1.default(0, 0, 0, 0);
        ref.pos = pos;
        ref.time = time;
        ref.$cacheId = cacheId;
        ref.isDirtyPos = false;
        ref.isDirtyText = false;
        return ref;
    };
    FontReference.prototype.setTop = function (isTop) {
        this.isTop = isTop;
        return this;
    };
    FontReference.prototype.translate = function (dx, dy) {
        this.pos.x += dx;
        this.pos.y += dy;
        this.isDirtyPos = true;
        return this;
    };
    FontReference.prototype.center = function (x, y) {
        this.pos.x = x;
        this.pos.y = y;
        this.isDirtyPos = true;
        return this;
    };
    FontReference.prototype.setPosition = function (position) {
        this.pos = new Coordinate_1.default(position.x, position.y);
        this.isDirtyPos = true;
        return this;
    };
    FontReference.prototype.setWidth = function (width) {
        this.width = width;
        this.isDirtyPos = true;
        return this;
    };
    FontReference.prototype.setText = function (text) {
        if (this._hidden) {
            this.prevText = text;
            this.text = "";
        }
        else {
            this.text = text;
            this.prevText = "";
        }
        this.isDirtyText = true;
        return this;
    };
    FontReference.prototype.setFontSize = function (fontSize) {
        this.fontSize = fontSize;
        this.isDirtyPos = true;
        return this;
    };
    Object.defineProperty(FontReference.prototype, "hidden", {
        set: function (hidden) {
            var _a;
            if (!this._hidden && hidden) {
                this.prevText = this.text;
                this.text = "";
                this.isDirtyText = true;
            }
            else if (this._hidden && !hidden) {
                this.text = (_a = this.prevText) !== null && _a !== void 0 ? _a : "";
                this.prevText = "";
                this.isDirtyText = true;
            }
            this._hidden = hidden;
        },
        enumerable: false,
        configurable: true
    });
    return FontReference;
}());
exports.FontReference = FontReference;
var Font = /** @class */ (function () {
    function Font(metaData) {
        var _this = this;
        this.warningShown = false;
        this.fontCacheId = 1;
        this.expireRenderFont = function (fontRef) {
            _this.fontCache[fontRef.$id].forEach(function (f) { return f.expire(); });
            _this.fontCache[fontRef.$id] = [];
        };
        this.writeRef = function (fontRef) {
            if (_this.fontManager.count > Font.MAX_FONT) {
                if (!_this.warningShown) {
                    _this.warningShown = true;
                    console.warn("Maximum font is being rendered", _this.fontManager.count);
                }
            }
            if (!fontRef.fontSize) {
                if (!fontRef.width) {
                    if (!_this.warningShown) {
                        _this.warningShown = true;
                        console.warn("Either font size or width needs to be set in FontReference");
                    }
                    return fontRef;
                }
                if (!fontRef.text) {
                    if (!_this.warningShown) {
                        _this.warningShown = true;
                        console.warn("Font text must be set to calculate font size to fit width");
                    }
                    return fontRef;
                }
                fontRef.fontSize = _this.calculateFontSize(fontRef.width, fontRef.text.length);
            }
            else if (!fontRef.width) {
                fontRef.width = _this.calcTotalTextWidth(fontRef);
            }
            if (fontRef.isDirtyText && fontRef.$id) {
                _this.expireRenderFont(fontRef);
            }
            if (!fontRef.$id || fontRef.isDirtyText) {
                if (!fontRef.$id) {
                    fontRef.$id = _this.fontCacheId++;
                }
                fontRef.isDirtyText = false;
                fontRef.isDirtyPos = false;
                fontRef.prevPos = new Coordinate_1.default(fontRef.pos.x, fontRef.pos.y);
                var fonts = _this.createFonts(fontRef);
                _this.fontCache[fontRef.$id] = fonts;
                _this.fontRefCache[fontRef.$id] = fontRef;
            }
            else if (fontRef.isDirtyPos) {
                var fonts = _this.fontCache[fontRef.$id];
                var fontPos = fontRef.pos;
                if (!fontRef.prevPos) {
                    fontRef.prevPos = new Coordinate_1.default(fontRef.pos.x, fontRef.pos.y);
                }
                var dx_1 = fontRef.prevPos.x - fontPos.x;
                var dy_1 = fontRef.prevPos.y - fontPos.y;
                fonts.forEach(function (font) {
                    var modelPos = font.modelPos;
                    modelPos.translate(-dx_1, -dy_1, 0);
                    modelPos.rotateOrigin(modelPos.position.x, modelPos.position.y, modelPos.position.z);
                });
                fontRef.isDirtyPos = false;
                fontRef.prevPos.x = fontRef.pos.x;
                fontRef.prevPos.y = fontRef.pos.y;
            }
            _this.fontCache[fontRef.$id].forEach(function (font) {
                font.refresh();
                font.shaderEntity.isTop = fontRef.isTop;
            });
            return fontRef;
        };
        this.fontManager = new FontManager(metaData);
        this.fontCache = {};
        this.fontRefCache = {};
        if (!Font.DefaultFont) {
            Font.DefaultFont = this;
        }
    }
    Font.prototype.event = function () {
        return;
    };
    Font.prototype.update = function (engineHelper) {
        if (engineHelper.notificationQueue.peak(Renderer_1.RendererNotification.RESIZE_SCREEN.key)) {
            Object.values(this.fontRefCache).forEach(this.expireRenderFont);
            Object.values(this.fontRefCache).forEach(function (font) { return (font.isDirtyText = true); });
            this.fontManager.refreshExpired();
            Object.values(this.fontRefCache).forEach(this.writeRef);
        }
        this.fontManager.update(engineHelper);
    };
    Font.prototype.render = function (engineHelper) {
        this.fontManager.render(engineHelper);
    };
    Font.prototype.init = function (engineHelper) {
        this.fontManager.init(engineHelper);
    };
    Font.prototype.calcTotalTextWidth = function (fontRef) {
        var text = fontRef.text;
        var fontSize = fontRef.fontSize / Font.pixelDensity;
        var carryWidth = 0;
        for (var charIdx = 0; charIdx < text.length; charIdx++) {
            var charCode = text.charCodeAt(charIdx);
            var font = this.fontManager.getFont(charCode);
            var height = fontSize;
            var fontRatio = Math.abs(font.fontChar.height) < 10e-6
                ? 0.0
                : font.fontChar.width / font.fontChar.height;
            var width = height * fontRatio;
            carryWidth += width;
        }
        return carryWidth;
    };
    Font.prototype.calculateFontSize = function (width, length) {
        var fontRatio = Math.abs(this.fontManager.avgHeight) < 10e-6
            ? 0.0
            : this.fontManager.avgWidth / this.fontManager.avgHeight;
        var widthFactor = 3;
        return ((width / fontRatio) * Font.pixelDensity) / length / widthFactor;
    };
    Font.prototype.createFonts = function (fontRef) {
        var pos = fontRef.pos;
        var time = fontRef.time;
        var text = fontRef.text;
        var fontSize = Font.fontHeight(fontRef.fontSize);
        var totalWidth = this.calcTotalTextWidth(fontRef);
        var maxHeight = 0;
        var carryWidth = -totalWidth / 2.0;
        var fonts = [];
        for (var charIdx = 0; charIdx < text.length; charIdx++) {
            var charCode = text.charCodeAt(charIdx);
            var font = this.fontManager.getFont(charCode);
            var fontChar = font.fontChar;
            var height = fontSize;
            maxHeight = Math.max(maxHeight, height);
            var fontRatio = Math.abs(fontChar.height) < 10e-6
                ? 0.0
                : fontChar.width / fontChar.height;
            var width = height * fontRatio;
            carryWidth += width;
            var fontPos = new Rect2d_1.default(pos.x + carryWidth - width / 2.0 - fontChar.xOffset / 2.0, pos.y + height / 2.0 - fontChar.yOffset / 2.0, width, height, -1 * pos.z);
            var renderFont = this.fontManager.createRender(font, fontPos, time);
            fonts.push(renderFont);
        }
        fontRef.displayRect.x = pos.x;
        fontRef.displayRect.y = pos.y;
        fontRef.displayRect.width = carryWidth;
        fontRef.displayRect.height = maxHeight;
        return fonts;
    };
    Font.fontHeight = function (fontSize) {
        return fontSize / Font.pixelDensity;
    };
    Font.MAX_FONT = 1000;
    Font.pixelDensity = 400.0;
    return Font;
}());
exports["default"] = Font;
//# sourceMappingURL=Font.js.map

/***/ }),

/***/ "./dist/Core/Physics/CollisionDetection.js":
/*!*************************************************!*\
  !*** ./dist/Core/Physics/CollisionDetection.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Polygon = exports.CollisionDetection = exports.Collision = void 0;
var Vector2d_1 = __webpack_require__(/*! ../Data/Vector2d */ "./dist/Core/Data/Vector2d.js");
var gl_matrix_1 = __webpack_require__(/*! gl-matrix */ "./node_modules/gl-matrix/esm/index.js");
var Collision = /** @class */ (function () {
    function Collision() {
    }
    return Collision;
}());
exports.Collision = Collision;
var CollisionDetection = /** @class */ (function () {
    function CollisionDetection() {
    }
    CollisionDetection.rotate = function (x, y, rotate) {
        var center = gl_matrix_1.vec2.fromValues(x, y);
        gl_matrix_1.vec2.rotate(center, center, gl_matrix_1.vec2.fromValues(rotate.originX, rotate.originY), Math.PI * (2 - rotate.az / 180));
        return { x: center[0], y: center[1] };
    };
    CollisionDetection.getLength = function (x1, y1, x2, y2) {
        return Math.sqrt(Math.abs((x1 - x2) * (x1 - x2)) + Math.abs((y1 - y2) * (y1 - y2)));
    };
    CollisionDetection.isCollidingRect = function (x1, y1, width1, height1, x2, y2, width2, height2) {
        return (CollisionDetection.getLength(x1, 0, x2, 0) <
            width1 / 2.0 + width2 / 2.0 &&
            CollisionDetection.getLength(y1, 0, y2, 0) < height1 / 2.0 + height2 / 2.0);
    };
    CollisionDetection.isRectInRect = function (rect1, rect2) {
        return !(rect1.x + rect1.width / 2.0 < rect2.x - rect2.width / 2.0 ||
            rect1.y + rect1.height / 2.0 < rect2.y - rect2.height / 2.0 ||
            rect1.x - rect1.width / 2.0 > rect2.x + rect2.width / 2.0 ||
            rect1.y - rect1.height / 2.0 > rect2.y + rect2.height / 2.0);
    };
    CollisionDetection.isPointInRect = function (rect, coord) {
        return this.isCollidingRect(rect.x, rect.y, rect.width, rect.height, coord.x, coord.y, 0.01, 0.01);
    };
    CollisionDetection.isPointInPlane3d = function (camera, obj, x, y) {
        var mvp = gl_matrix_1.mat4.multiply(gl_matrix_1.mat4.create(), camera.frustum, gl_matrix_1.mat4.multiply(gl_matrix_1.mat4.create(), camera.viewMatrix, obj.getModel()));
        var r1 = this.toClipSpace(obj.vertexModel.renderUnits[0].vertex, mvp);
        if (r1[2] > 1.0)
            return false;
        var r2 = this.toClipSpace(obj.vertexModel.renderUnits[1].vertex, mvp);
        if (r2[2] > 1.0)
            return false;
        var r3 = this.toClipSpace(obj.vertexModel.renderUnits[2].vertex, mvp);
        if (r3[2] > 1.0)
            return false;
        var r4 = this.toClipSpace(obj.vertexModel.renderUnits[3].vertex, mvp);
        if (r4[2] > 1.0)
            return false;
        var rectPolygon = [
            [r1[0], r1[1]],
            [r2[0], r2[1]],
            [r4[0], r4[1]],
            [r3[0], r3[1]],
        ];
        return this.pointInPolygon([x, y], rectPolygon);
    };
    CollisionDetection.toClipSpace = function (pos, mvp) {
        var vec4Trans = gl_matrix_1.vec4.transformMat4(gl_matrix_1.vec4.create(), gl_matrix_1.vec4.set(gl_matrix_1.vec4.create(), pos.x, pos.y, pos.z, 1.0), mvp);
        var vec4Norm = gl_matrix_1.vec4.scale(gl_matrix_1.vec4.create(), vec4Trans, 1.0 / vec4Trans[3]);
        return gl_matrix_1.vec4.set(gl_matrix_1.vec4.create(), (vec4Norm[0] + 1.0) / 2.0, (vec4Norm[1] + 1.0) / 2.0, vec4Norm[2], 1.0);
    };
    CollisionDetection.pointInPolygon = function (point, polygon) {
        var x = point[0];
        var y = point[1];
        var inside = false;
        for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            var xi = polygon[i][0];
            var yi = polygon[i][1];
            var xj = polygon[j][0];
            var yj = polygon[j][1];
            var intersect = yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
            if (intersect) {
                inside = !inside;
            }
        }
        return inside;
    };
    return CollisionDetection;
}());
exports.CollisionDetection = CollisionDetection;
var Polygon = /** @class */ (function () {
    function Polygon() {
        this.max = 0;
        this.min = 0;
    }
    Polygon.prototype.subtractCenter = function (p) {
        return this.center.subtract(p.center);
    };
    Polygon.prototype.offset = function (v) {
        this.points.forEach(function (point) { return point.add(v); });
    };
    Polygon.prototype.area = function (v1, v2) {
        return v1.x * v2.y - v2.x * v1.y;
    };
    Polygon.prototype.calculateCentre = function () {
        var centroid = Vector2d_1.default.newVector(0, 0);
        var totalSignedArea = 0.0;
        var vertexCount = this.points.length;
        for (var i = 0; i < vertexCount; ++i) {
            var vertex = this.points[i];
            var nextVertex = void 0;
            if (i == vertexCount - 1) {
                nextVertex = this.points[0];
            }
            else {
                nextVertex = this.points[i + 1];
            }
            var area = this.area(vertex, nextVertex);
            totalSignedArea += area;
            centroid.x += (vertex.x + nextVertex.x) * area;
            centroid.y += (vertex.y + nextVertex.y) * area;
        }
        centroid.x /= 3.0 * totalSignedArea;
        centroid.y /= 3.0 * totalSignedArea;
        return centroid;
    };
    Polygon.prototype.polygonProjection = function (axis, polygon) {
        var dotProduct = axis.dot(polygon.points[0]);
        polygon.min = dotProduct;
        polygon.max = dotProduct;
        for (var i = 0; i < polygon.points.length; i++) {
            var point = polygon.points[i];
            dotProduct = point.dot(axis);
            if (dotProduct < polygon.min) {
                polygon.min = dotProduct;
            }
            else if (dotProduct > polygon.max) {
                polygon.max = dotProduct;
            }
        }
    };
    Polygon.prototype.boundaryDistance = function (minA, maxA, minB, maxB) {
        if (minA < minB) {
            return minB - maxA;
        }
        else {
            return minA - maxB;
        }
    };
    Polygon.prototype.isCollision = function (polygonB, velocity) {
        var result = new Collision();
        result.isIntersect = true;
        result.willIntersect = true;
        var edgeCountA = this.edges.length;
        var edgeCountB = polygonB.edges.length;
        var minIntervalDistance = Infinity;
        var translationAxis = new Vector2d_1.default();
        var edge;
        for (var edgeIndex = 0; edgeIndex < edgeCountA + edgeCountB; edgeIndex++) {
            if (edgeIndex < edgeCountA) {
                edge = this.edges[edgeIndex];
            }
            else {
                edge = polygonB.edges[edgeIndex - edgeCountA];
            }
            var axis = Vector2d_1.default.newVector(-edge.y, edge.x).normalise();
            this.polygonProjection(axis, this);
            this.polygonProjection(axis, polygonB);
            if (this.boundaryDistance(this.min, this.max, polygonB.min, polygonB.max) >
                0) {
                result.isIntersect = false;
            }
            if (velocity) {
                var velocityProjection = axis.dot(velocity);
                if (velocityProjection < 0) {
                    this.min += velocityProjection;
                }
                else {
                    this.max += velocityProjection;
                }
            }
            var intervalDistance = this.boundaryDistance(this.min, this.max, polygonB.min, polygonB.max);
            if (intervalDistance > 0) {
                result.willIntersect = false;
            }
            if (!result.isIntersect && !result.willIntersect) {
                break;
            }
            intervalDistance = Math.abs(intervalDistance);
            if (intervalDistance < minIntervalDistance) {
                minIntervalDistance = intervalDistance;
                translationAxis = axis;
                var distance = this.subtractCenter(polygonB);
                if (distance.dot(translationAxis) < 0) {
                    translationAxis = translationAxis.negate();
                }
            }
        }
        if (result.willIntersect) {
            result.minDeintersectDistance = translationAxis.scale(minIntervalDistance);
        }
        return result;
    };
    return Polygon;
}());
exports.Polygon = Polygon;
//# sourceMappingURL=CollisionDetection.js.map

/***/ }),

/***/ "./dist/Core/Physics/EngineMath.js":
/*!*****************************************!*\
  !*** ./dist/Core/Physics/EngineMath.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var Coordinate_1 = __webpack_require__(/*! ../Data/Coordinate */ "./dist/Core/Data/Coordinate.js");
var EngineMath = /** @class */ (function () {
    function EngineMath() {
    }
    EngineMath.boundRect = function (bound, pos) {
        var boundedX = Math.max(bound.x + pos.width / 2.0, Math.min(bound.x + bound.width - pos.width / 2.0, pos.x));
        var boundedY = Math.max(bound.y + pos.height / 2.0, Math.min(bound.y + bound.height - pos.height / 2.0, pos.y));
        return new Coordinate_1.default(boundedX, boundedY, pos.z);
    };
    EngineMath.getLength = function (x1, y1, x2, y2) {
        return Math.sqrt(Math.abs((x1 - x2) * (x1 - x2)) + Math.abs((y1 - y2) * (y1 - y2)));
    };
    return EngineMath;
}());
exports["default"] = EngineMath;
//# sourceMappingURL=EngineMath.js.map

/***/ }),

/***/ "./dist/Core/Physics/Physics.js":
/*!**************************************!*\
  !*** ./dist/Core/Physics/Physics.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PhysicsData = exports.ParabolicSimulation = void 0;
var Timer_1 = __webpack_require__(/*! ../Common/Timer */ "./dist/Core/Common/Timer.js");
var CollisionDetection_1 = __webpack_require__(/*! ./CollisionDetection */ "./dist/Core/Physics/CollisionDetection.js");
var Physics = /** @class */ (function () {
    function Physics() {
    }
    Physics.registerPhysics = function (entity, physics) {
        if (physics === void 0) { physics = undefined; }
        if (!entity.$physicsId) {
            entity.$physicsId = Physics.physicsEntityIdCount++;
            this.physicsEntities[entity.$physicsId] = {
                entity: entity,
                enabled: true,
                physics: physics,
            };
        }
    };
    Physics.deregisterPhysics = function (entity) {
        if (entity.$physicsId !== undefined &&
            this.physicsEntities[entity.$physicsId]) {
            delete this.physicsEntities[entity.$physicsId];
        }
    };
    Physics.setEnabledPhysics = function (entity, enabled) {
        if (this.physicsEntities[entity.$physicsId]) {
            this.physicsEntities[entity.$physicsId].enabled = enabled;
        }
    };
    Physics.isCollidingOffset2d = function (entity, dx, dy) {
        var px = entity.position.x + dx;
        var py = entity.position.y + dy;
        return Physics.isCollidingPos2d(entity, px, py);
    };
    Physics.isCollidingPoint2d = function (entity) {
        var px = entity.position.x;
        var py = entity.position.y;
        return Physics.isCollidingPos2d(entity, px, py);
    };
    Physics.isCollidingResolve = function (entity, dx, dy) {
        var _a;
        var collision = [];
        var _dx = [];
        var _dy = [];
        for (var key in this.physicsEntities) {
            if (this.physicsEntities.hasOwnProperty(key)) {
                var physicsEntity = this.physicsEntities[key];
                var node = physicsEntity.entity;
                if (physicsEntity.enabled && node.$physicsId !== entity.$physicsId) {
                    var _b = ((_a = physicsEntity.physics) === null || _a === void 0 ? void 0 : _a.collisionSize) || node.position, x = _b.x, y = _b.y, width = _b.width, height = _b.height;
                    var colliding = CollisionDetection_1.CollisionDetection.isCollidingRect(x, y, width, height, entity.position.x + dx, entity.position.y + dy, entity.position.width, entity.position.height);
                    if (colliding) {
                        collision.push(physicsEntity.entity);
                        var collidingX = CollisionDetection_1.CollisionDetection.isCollidingRect(x, y, width, height, entity.position.x + dx, entity.position.y, entity.position.width, entity.position.height);
                        var collidingY = CollisionDetection_1.CollisionDetection.isCollidingRect(x, y, width, height, entity.position.x, entity.position.y + dy, entity.position.width, entity.position.height);
                        if (collidingX && collidingY) {
                            _dx.push(-Physics.dxBoundary(entity, x, width));
                            _dy.push(-Physics.dyBoundary(entity, y, height));
                        }
                        else if (collidingX) {
                            _dx.push(Physics.dxBoundary(entity, x, width));
                        }
                        else if (collidingY) {
                            _dy.push(Physics.dyBoundary(entity, y, height));
                        }
                    }
                }
            }
        }
        if (_dx.length > 0) {
            dx = Math.min.apply(Math, _dx);
        }
        if (_dy.length > 0) {
            dy = Math.min.apply(Math, _dy);
        }
        if (Math.abs(dx) < 10e-6) {
            dx = 0;
        }
        if (Math.abs(dy) < 10e-6) {
            dy = 0;
        }
        return [dx, dy, collision];
    };
    Physics.dyBoundary = function (entity, y, height) {
        var _dy = Math.abs(CollisionDetection_1.CollisionDetection.getLength(entity.position.y, 0, y, 0) -
            entity.position.height / 2 -
            height / 2);
        _dy *= Math.sign(y - entity.position.y) * 0.9999999;
        return _dy;
    };
    Physics.dxBoundary = function (entity, x, width) {
        var _dx = Math.abs(CollisionDetection_1.CollisionDetection.getLength(entity.position.x, 0, x, 0) -
            entity.position.width / 2 -
            width / 2);
        _dx *= Math.sign(x - entity.position.x) * 0.9999999;
        return _dx;
    };
    Physics.isCollidingPos2d = function (entity, px, py) {
        var collision = [];
        for (var key in this.physicsEntities) {
            if (this.physicsEntities.hasOwnProperty(key)) {
                var physicsEntity = this.physicsEntities[key];
                var pEntityRoot = physicsEntity.entity;
                if (physicsEntity.enabled &&
                    pEntityRoot.$physicsId !== entity.$physicsId) {
                    var colliding = CollisionDetection_1.CollisionDetection.isCollidingRect(pEntityRoot.position.x, pEntityRoot.position.y, pEntityRoot.position.width, pEntityRoot.position.height, px, py, entity.position.width, entity.position.height);
                    if (colliding) {
                        collision.push(physicsEntity.entity);
                    }
                }
            }
        }
        return collision;
    };
    Physics.generateSimulationId = function () {
        var simulationId = this.simulationIdCurrent;
        this.simulationIdCurrent += 1;
        return simulationId;
    };
    Physics.pauseSimulation = function (simulationId) {
        var data = this.simulations[simulationId];
        if (!data) {
            return;
        }
        data.pause = true;
    };
    Physics.resumeSimulation = function (simulationId) {
        var data = this.simulations[simulationId];
        if (!data) {
            return;
        }
        data.pause = false;
    };
    Physics.cancelSimulation = function (simulationId, force) {
        if (force === void 0) { force = false; }
        var data = this.simulations[simulationId];
        if (!data) {
            return;
        }
        data.cancelled = true;
        data.totalIterations = 0;
        if (!force && data.completeSimulation) {
            data.completeSimulation();
        }
    };
    Physics.physicsLoop = function () {
        var simulationCount = 0;
        for (var simulationId in this.simulations) {
            if (this.simulations.hasOwnProperty(simulationId)) {
                var data = this.simulations[simulationId];
                if (!data)
                    continue;
                if (data.cancelled) {
                    continue;
                }
                if (data) {
                    if (data.pause) {
                        data.timer.start();
                        continue;
                    }
                    var time = data.timer.peak();
                    if (data.totalIterations === 0 || data.runTime < data.totalRunTime) {
                        data.simulation(+simulationId, time, data.totalRunTime, data.totalIterations);
                        data.runTime += time;
                        data.timer.start();
                        data.totalIterations += 1;
                        simulationCount++;
                    }
                    else {
                        this.cancelSimulation(simulationId);
                    }
                }
            }
        }
    };
    Physics.runSimulation = function (totalRunTime, simulation, completeSimulation, existingSimulationId) {
        var simulationId = existingSimulationId || this.generateSimulationId();
        var data = this.simulations[simulationId];
        if (!data) {
            this.simulations[simulationId] = {
                pause: false,
                timer: new Timer_1.default().start(),
                simulation: simulation,
                totalRunTime: totalRunTime,
                completeSimulation: completeSimulation,
                totalIterations: 0,
                runTime: 0.0,
                cancelled: false,
            };
        }
        else {
            if (data.cancelled) {
                data.pause = false;
                data.timer.start();
                data.simulation = simulation;
                data.totalRunTime = totalRunTime;
                data.completeSimulation = completeSimulation;
                data.cancelled = false;
            }
            data.totalIterations = 0;
            data.runTime = 0;
        }
        if (this.simulationLoop === undefined) {
            this.simulationLoop = setInterval(this.physicsLoop.bind(this), this.TIME_STEP_MILLIS);
        }
        return simulationId;
    };
    Physics.parabolicSimulation = function (parabolic, simulation, completeSimulation) {
        var _this = this;
        return this.runSimulation(parabolic.totalRunTime, function (simulationId, timeStep) {
            var data = _this.simulations[simulationId];
            if (data) {
                var runTime = data.runTime;
                var height = parabolic.height;
                var width = parabolic.width;
                var totalRunTime = parabolic.totalRunTime;
                var a = ((1.0 / 3.0 + 1.0) * height) / width / width;
                var b = a * width;
                var vy = height / 2.0 / (totalRunTime / 2.0);
                var x = (Math.sqrt(4 * a * vy * runTime + b * b) - b) / (2 * a);
                var vx = -width / totalRunTime;
                var y = -(a * vx * runTime * vx * runTime + b * vx * runTime);
                var dx = x - parabolic.px;
                var dy = y - parabolic.py;
                parabolic.px = x;
                parabolic.py = y;
                simulation(simulationId, timeStep, dx, dy);
            }
        }, completeSimulation);
    };
    Physics.TIME_STEP_MILLIS = 10;
    Physics.simulations = {};
    Physics.simulationIdCurrent = 1;
    Physics.physicsEntities = {};
    Physics.physicsEntityIdCount = 1;
    return Physics;
}());
exports["default"] = Physics;
var ParabolicSimulation = /** @class */ (function () {
    function ParabolicSimulation() {
    }
    return ParabolicSimulation;
}());
exports.ParabolicSimulation = ParabolicSimulation;
var PhysicsData = /** @class */ (function () {
    function PhysicsData() {
    }
    return PhysicsData;
}());
exports.PhysicsData = PhysicsData;
//# sourceMappingURL=Physics.js.map

/***/ }),

/***/ "./dist/Core/Renderer.js":
/*!*******************************!*\
  !*** ./dist/Core/Renderer.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RendererNotification = exports.RendererSubscription = void 0;
var RenderOption_1 = __webpack_require__(/*! ./Data/RenderOption */ "./dist/Core/Data/RenderOption.js");
var Entity3DProgram_1 = __webpack_require__(/*! ./WebGL/EntityProgram/Entity3DProgram */ "./dist/Core/WebGL/EntityProgram/Entity3DProgram.js");
var EntityColorProgram_1 = __webpack_require__(/*! ./WebGL/EntityProgram/EntityColorProgram */ "./dist/Core/WebGL/EntityProgram/EntityColorProgram.js");
var WebGLContext_1 = __webpack_require__(/*! ./WebGL/Base/WebGLContext */ "./dist/Core/WebGL/Base/WebGLContext.js");
var Texture_1 = __webpack_require__(/*! ./Buffer/Texture */ "./dist/Core/Buffer/Texture.js");
var NotificationQueue_1 = __webpack_require__(/*! ./Common/NotificationQueue */ "./dist/Core/Common/NotificationQueue.js");
var SubscriberPool_1 = __webpack_require__(/*! ./Common/SubscriberPool */ "./dist/Core/Common/SubscriberPool.js");
var RendererSubscription = /** @class */ (function () {
    function RendererSubscription() {
    }
    RendererSubscription.CREATE_TEXTURE = new SubscriberPool_1.Subscription("Renderer#CreateTexture");
    RendererSubscription.REGISTER_ENTITY = new SubscriberPool_1.Subscription("Renderer#RegisterEntity");
    RendererSubscription.createTexturePayload = function (object, resourcesLoading) { return [object, resourcesLoading]; };
    RendererSubscription.registerEntityPayload = function (entity, buffer) { return [
        entity,
        buffer,
    ]; };
    return RendererSubscription;
}());
exports.RendererSubscription = RendererSubscription;
var RendererNotification = /** @class */ (function () {
    function RendererNotification() {
    }
    RendererNotification.NOTIFICATION_PRE_RENDER_KEY = "Renderer#Prerender";
    RendererNotification.NOTIFICATION_RENDER_KEY = "Renderer#Render";
    RendererNotification.NOTIFICATION_INIT_KEY = "Renderer#Init";
    RendererNotification.UPDATE_PROJECTION_MATRIX = new NotificationQueue_1.Notification(RendererNotification.NOTIFICATION_PRE_RENDER_KEY, "UPDATE_PROJECTION_MATRIX");
    RendererNotification.RESIZE_SCREEN = new NotificationQueue_1.Notification(RendererNotification.NOTIFICATION_PRE_RENDER_KEY, "RESIZE_SCREEN");
    RendererNotification.CREATE_TEXTURE = new NotificationQueue_1.Notification(RendererNotification.NOTIFICATION_INIT_KEY, "CREATE_TEXTURE");
    RendererNotification.REGISTER_ENTITY = new NotificationQueue_1.Notification(RendererNotification.NOTIFICATION_INIT_KEY, "REGISTER_ENTITY");
    RendererNotification.registerEntity = function (entity, modelData) {
        return NotificationQueue_1.NotificationPayload.from(RendererNotification.REGISTER_ENTITY, [
            entity,
            modelData,
        ]);
    };
    RendererNotification.UPDATE_BUFFER = new NotificationQueue_1.Notification(RendererNotification.NOTIFICATION_PRE_RENDER_KEY, "UPDATE_BUFFER");
    RendererNotification.updateBuffer = function (entity, buffer) {
        return NotificationQueue_1.NotificationPayload.from(RendererNotification.UPDATE_BUFFER, [
            entity,
            buffer,
        ]);
    };
    RendererNotification.createTexture = function (object, resourcesLoading) {
        return NotificationQueue_1.NotificationPayload.from(RendererNotification.CREATE_TEXTURE, [
            object,
            resourcesLoading,
        ]);
    };
    RendererNotification.SET_LIGHTING = new NotificationQueue_1.Notification(RendererNotification.NOTIFICATION_PRE_RENDER_KEY, "SET_LIGHTING");
    RendererNotification.setLighting = function (light) {
        return NotificationQueue_1.NotificationPayload.from(RendererNotification.SET_LIGHTING, [light]);
    };
    RendererNotification.RENDER_ENTITY = new NotificationQueue_1.Notification(RendererNotification.NOTIFICATION_RENDER_KEY, "RENDER_ENTITY");
    RendererNotification.renderEntity = function (entity, model) {
        return NotificationQueue_1.NotificationPayload.from(RendererNotification.RENDER_ENTITY, [
            entity,
            model,
        ]);
    };
    return RendererNotification;
}());
exports.RendererNotification = RendererNotification;
var Renderer = /** @class */ (function () {
    function Renderer(args, webGLContainer, camera, notificationQueue, subscriberPool) {
        var _this = this;
        this.textureReg = {};
        this._renderEntities = {};
        this.cachedModelData = {};
        this.resizeViewPort = function () {
            _this.glContext.resizeViewPort(_this.webGLContainer.canvas);
        };
        this.updatePerspective = function () {
            if (_this.shader3DProgram) {
                _this.shader3DProgram.updatePerspective(_this.camera.camera3d.frustum);
            }
            if (_this.shaderColourProgram) {
                _this.shaderColourProgram.updatePerspective(_this.camera.camera3d.frustum);
            }
        };
        this.delete = function () {
            Object.values(_this.textureReg).forEach(function (texReg) {
                var texture = texReg.texture;
                if (texture.texture) {
                    _this.glContext.deleteTexture(texture.texture);
                }
                texture.texture = undefined;
                texture.texUnit = undefined;
            });
            Texture_1.default.textureCount = 0;
            if (_this.shader3DProgram) {
                _this.shader3DProgram.delete();
            }
            if (_this.shaderColourProgram) {
                _this.shaderColourProgram.delete();
            }
            _this.glContext.destroyWebGL();
        };
        this.setLighting = function (light) {
            if (_this.shader3DProgram) {
                _this.shader3DProgram.setLight(light, _this.camera.camera3d);
            }
            else {
                throw new Error("Lighting is set without any 3D entities");
            }
        };
        this.updateBuffer = function (entity, buffer) {
            var opt = entity.getOpt();
            var program = _this._getProgramOpt(opt);
            program.updateBuffer(entity, buffer);
        };
        this._getProgram3D = function (opt) {
            var program;
            if (_this._isPlain(opt)) {
                throw new Error("Plain no longer supported");
            }
            else {
                program = _this.shader3DProgram;
            }
            return program;
        };
        this._getProgramOpt = function (opt) {
            var program;
            if (RenderOption_1.ShaderType.COLOUR === opt.shaderType) {
                program = _this.shaderColourProgram;
            }
            else if (RenderOption_1.ShaderType.THREE_DIMENSION === opt.shaderType ||
                RenderOption_1.ShaderType.TWO_DIMENSION === opt.shaderType) {
                program = _this._getProgram3D(opt);
            }
            else {
                throw new Error("unsupported opt shader type");
            }
            return program;
        };
        this._defRender = function () {
            _this._defRenderTop(false);
            _this._defRenderTop(true);
        };
        this._render = function (entity, model) {
            if (entity.hidden) {
                return;
            }
            var opt = entity.getOpt();
            var payload = [entity, model];
            if (RenderOption_1.ShaderType.COLOUR === opt.shaderType) {
                _this._renderEntities[RenderOption_1.ShaderType.COLOUR].push(payload);
            }
            else if (RenderOption_1.ShaderType.THREE_DIMENSION === opt.shaderType) {
                _this._renderEntities[RenderOption_1.ShaderType.THREE_DIMENSION].push(payload);
            }
            else if (RenderOption_1.ShaderType.TWO_DIMENSION === opt.shaderType) {
                _this._renderEntities[RenderOption_1.ShaderType.TWO_DIMENSION].push(payload);
            }
        };
        this.bindBuffer = function () {
            if (_this.shader3DProgram) {
                _this.shader3DProgram.bindBuffer();
            }
            if (_this.shaderColourProgram) {
                _this.shaderColourProgram.bindBuffer();
            }
        };
        this._resetDefferred = function () {
            var _a;
            _this._renderEntities = (_a = {},
                _a[RenderOption_1.ShaderType.COLOUR] = [],
                _a[RenderOption_1.ShaderType.THREE_DIMENSION] = [],
                _a[RenderOption_1.ShaderType.TWO_DIMENSION] = [],
                _a);
        };
        this.handleNotification = function (notification) {
            var updatePerspective = false;
            switch (notification.action) {
                case RendererNotification.RENDER_ENTITY.action:
                    _this._render(notification.data[0], notification.data[1]);
                    break;
                case RendererNotification.UPDATE_PROJECTION_MATRIX.action:
                    updatePerspective = true;
                    break;
                case RendererNotification.RESIZE_SCREEN.action:
                    _this.resizeViewPort();
                    updatePerspective = true;
                    break;
                case RendererNotification.CREATE_TEXTURE.action:
                    _this.createTexture(notification.data[0], notification.data[1]);
                    break;
                case RendererNotification.UPDATE_BUFFER.action:
                    _this.updateBuffer(notification.data[0], notification.data[1]);
                    break;
                case RendererNotification.REGISTER_ENTITY.action:
                    _this.registerEntity(notification.data[0], notification.data[1]);
                    break;
                case RendererNotification.SET_LIGHTING.action:
                    _this.setLighting(notification.data[0]);
                    break;
                default:
                    console.error("unhandled notification: ", notification);
                    break;
            }
            if (updatePerspective) {
                _this.updatePerspective();
            }
        };
        if (!args.world) {
            throw new Error("world not defined");
        }
        this.notificationQueue = notificationQueue;
        this.subscriberPool = subscriberPool;
        this.camera = camera;
        this.world = args.world;
        this.webGLContainer = webGLContainer;
        this.ctx = this.webGLContainer.getCtx();
        this.glContext = new WebGLContext_1.default(this.ctx);
        this.glContext.setupDefault();
        this.subscriberPool.listen(RendererSubscription.CREATE_TEXTURE, function (data) {
            var object = data[0], resourcesLoading = data[1];
            _this.createTexture(object, resourcesLoading);
        });
        this.subscriberPool.listen(RendererSubscription.REGISTER_ENTITY, function (data) {
            var entity = data[0], buffer = data[1];
            _this.registerEntity(entity, buffer);
        });
    }
    Renderer.prototype._isPlain = function (opt) {
        return opt.renderType === RenderOption_1.RenderType.PLAIN;
    };
    Renderer.prototype._defRenderTop = function (isTop) {
        // render colour
        var colourModel = this._renderEntities[RenderOption_1.ShaderType.COLOUR].filter(function (e) { return !!e[0].isTop === isTop; });
        if (colourModel.length > 0) {
            this.shaderColourProgram.render(colourModel, this.camera.camera3d);
        }
        var model3d = this._renderEntities[RenderOption_1.ShaderType.THREE_DIMENSION].filter(function (e) { return !!e[0].isTop === isTop; });
        if (model3d.length > 0) {
            this.shader3DProgram.render3DShadowMap(model3d, this.resizeViewPort);
            this.shader3DProgram.render(model3d, this.camera.camera3d, this.textureReg, false);
        }
        var model2d = this._renderEntities[RenderOption_1.ShaderType.TWO_DIMENSION].filter(function (e) { return !!e[0].isTop === isTop; });
        if (model2d.length > 0) {
            this.shader3DProgram.render(model2d, this.camera.camera3d, this.textureReg, true);
        }
    };
    Renderer.prototype.init = function () {
        this.readMessages(RendererNotification.NOTIFICATION_INIT_KEY);
    };
    Renderer.prototype.readMessages = function (key, isUniqueAction) {
        if (isUniqueAction === void 0) { isUniqueAction = false; }
        var message;
        var unique = {};
        while ((message = this.notificationQueue.take(key))) {
            if (!isUniqueAction || unique[message.action] === undefined) {
                this.handleNotification(message);
                if (isUniqueAction) {
                    unique[message.action] = true;
                }
            }
        }
    };
    Renderer.prototype._lazyLoadProgram = function (opt) {
        if (RenderOption_1.ShaderType.COLOUR === opt.shaderType) {
            if (!this.shaderColourProgram) {
                this.shaderColourProgram = new EntityColorProgram_1.default(this.ctx);
            }
        }
        else if (RenderOption_1.ShaderType.THREE_DIMENSION === opt.shaderType ||
            RenderOption_1.ShaderType.TWO_DIMENSION === opt.shaderType) {
            if (!this.shader3DProgram) {
                this.shader3DProgram = new Entity3DProgram_1.default(this.ctx);
            }
        }
        else {
            console.error(this, opt);
            throw new Error("unsupported opt shader type");
        }
        this.updatePerspective();
    };
    Renderer.prototype.registerEntity = function (object, modelData) {
        var opt = object.getOpt();
        this._lazyLoadProgram(opt);
        var program = this._getProgramOpt(opt);
        if (!this.cachedModelData[modelData.$id]) {
            program.registerEntity(object, modelData.vertices);
            this.cachedModelData[modelData.$id] = object.rendererBufferId;
        }
        else {
            object.rendererBufferId = this.cachedModelData[modelData.$id];
        }
    };
    Renderer.prototype.render = function (time, engineHelper) {
        this.glContext.clear();
        this.readMessages(RendererNotification.NOTIFICATION_PRE_RENDER_KEY, true);
        this.camera.commitProjectionView();
        engineHelper.setTime(time);
        // reinitialse next cycle
        this._resetDefferred();
        this.world.render();
        engineHelper.renderFont();
        this.readMessages(RendererNotification.NOTIFICATION_RENDER_KEY);
        this._defRender();
    };
    Renderer.prototype.createTexture = function (object, resourcesLoading) {
        var src = object.getTextureSource();
        if (src === undefined) {
            console.error("src is undefined when trying to create texture", object);
            throw new Error("src is undefined when trying to create texture");
        }
        object.rendererTextureRef = src;
        var textureReg = this.textureReg[src];
        if (!textureReg) {
            var texture = new Texture_1.default(src, this.ctx);
            this.textureReg[src] = {
                texture: texture,
            };
            resourcesLoading.push(texture.load);
        }
        else if (textureReg.texture && textureReg.texture.error) {
            console.error("there was an error while trying to load texture", textureReg);
            throw new Error("there was an error while trying to load texture");
        }
    };
    return Renderer;
}());
exports["default"] = Renderer;
//# sourceMappingURL=Renderer.js.map

/***/ }),

/***/ "./dist/Core/Updater.js":
/*!******************************!*\
  !*** ./dist/Core/Updater.js ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var Updater = /** @class */ (function () {
    function Updater(args) {
        if (!args.world) {
            throw new Error("world not defined");
        }
        this.world = args.world;
    }
    Updater.prototype.update = function (time, engineHelper) {
        engineHelper.setTime(time);
        this.world.update();
        engineHelper.updateFont();
    };
    return Updater;
}());
exports["default"] = Updater;
//# sourceMappingURL=Updater.js.map

/***/ }),

/***/ "./dist/Core/WebGL/Base/BaseProgram.js":
/*!*********************************************!*\
  !*** ./dist/Core/WebGL/Base/BaseProgram.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var BaseProgram = /** @class */ (function () {
    function BaseProgram(ctx) {
        this.ctx = ctx;
    }
    BaseProgram.prototype.compileShaders = function (vertexShaderContent, fragmentShaderContent) {
        var ctx = this.ctx;
        var vertexShader = ctx.createShader(ctx.VERTEX_SHADER);
        var fragmentShader = ctx.createShader(ctx.FRAGMENT_SHADER);
        if (!vertexShader || !fragmentShader) {
            throw new Error("Unable to create vertex or fragment shader");
        }
        var fragmentChar = fragmentShaderContent;
        var vertexChar = vertexShaderContent;
        ctx.shaderSource(vertexShader, vertexChar);
        ctx.compileShader(vertexShader);
        ctx.shaderSource(fragmentShader, fragmentChar);
        ctx.compileShader(fragmentShader);
        if (!ctx.getShaderParameter(vertexShader, ctx.COMPILE_STATUS)) {
            throw new Error("could not compile vertex shader:" + ctx.getShaderInfoLog(vertexShader));
        }
        if (!ctx.getShaderParameter(fragmentShader, ctx.COMPILE_STATUS)) {
            throw new Error("could not compile fragment shader:" +
                ctx.getShaderInfoLog(fragmentShader));
        }
        var program = ctx.createProgram();
        ctx.attachShader(program, vertexShader);
        ctx.attachShader(program, fragmentShader);
        ctx.linkProgram(program);
        ctx.validateProgram(program);
        if (!ctx.getProgramParameter(program, ctx.LINK_STATUS)) {
            throw new Error("Link failed: " + ctx.getProgramInfoLog(program));
        }
        return program;
    };
    BaseProgram.prototype.delete = function () {
        this.ctx.deleteProgram(this.program);
    };
    BaseProgram.prototype._bindProgram = function (program) {
        this.ctx.useProgram(program);
    };
    BaseProgram.prototype._unbindProgram = function () { };
    return BaseProgram;
}());
exports["default"] = BaseProgram;
//# sourceMappingURL=BaseProgram.js.map

/***/ }),

/***/ "./dist/Core/WebGL/Base/ProgramReference.js":
/*!**************************************************!*\
  !*** ./dist/Core/WebGL/Base/ProgramReference.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var ProgramReference = /** @class */ (function () {
    function ProgramReference(key, ctx, isAttribute, program) {
        if (isAttribute) {
            this.ref = ctx.getAttribLocation(program, key);
            if (this.ref === -1) {
                throw new Error("Unable to find attribute shader key = " + key);
            }
        }
        else {
            this.ref = ctx.getUniformLocation(program, key);
            if (this.ref === null) {
                throw new Error("Unable to find uniform shader key = " + key);
            }
        }
    }
    return ProgramReference;
}());
exports["default"] = ProgramReference;
//# sourceMappingURL=ProgramReference.js.map

/***/ }),

/***/ "./dist/Core/WebGL/Base/WebGLContext.js":
/*!**********************************************!*\
  !*** ./dist/Core/WebGL/Base/WebGLContext.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var Colour_1 = __webpack_require__(/*! ../../Data/Colour */ "./dist/Core/Data/Colour.js");
var WebGLContext = /** @class */ (function () {
    function WebGLContext(ctx) {
        this.clearColour = new Colour_1.default(1.0, 1.0, 1.0, 1.0);
        this.ctx = ctx;
    }
    WebGLContext.prototype.setClearColor = function (colour) {
        this.clearColour = colour;
        this.ctx.clearColor(colour.r, colour.g, colour.b, colour.a);
    };
    WebGLContext.prototype.setupDefault = function () {
        this.setClearColor(this.clearColour);
        this.ctx.enable(this.ctx.BLEND);
        this.ctx.blendFunc(this.ctx.SRC_ALPHA, this.ctx.ONE_MINUS_SRC_ALPHA);
        this.ctx.enable(this.ctx.CULL_FACE);
        this.ctx.frontFace(this.ctx.CCW);
        this.ctx.cullFace(this.ctx.BACK);
        this.ctx.clearDepth(1);
        this.ctx.enable(this.ctx.DEPTH_TEST);
        this.ctx.depthFunc(this.ctx.LEQUAL);
    };
    WebGLContext.prototype.clear = function () {
        this.ctx.clear(this.ctx.COLOR_BUFFER_BIT | this.ctx.DEPTH_BUFFER_BIT);
    };
    WebGLContext.prototype.deleteTexture = function (texture) {
        this.ctx.deleteTexture(texture);
    };
    WebGLContext.prototype.resizeViewPort = function (canvas) {
        this.ctx.viewport(0, 0, canvas.width, canvas.height);
    };
    WebGLContext.prototype.getWebGL2RenderingContext = function () {
        return this.ctx;
    };
    WebGLContext.prototype.destroyWebGL = function () {
        var ctx = this.ctx;
        var ctx2 = this.getWebGL2RenderingContext();
        var isWebGL2RenderingContext = !!ctx2.createTransformFeedback;
        if (isWebGL2RenderingContext) {
            ctx2.bindVertexArray(null);
        }
        var numAttribs = ctx.getParameter(ctx.MAX_VERTEX_ATTRIBS);
        var tmp = ctx.createBuffer();
        ctx.bindBuffer(ctx.ARRAY_BUFFER, tmp);
        for (var ii = 0; ii < numAttribs; ++ii) {
            ctx.disableVertexAttribArray(ii);
            ctx.vertexAttribPointer(ii, 4, ctx.FLOAT, false, 0, 0);
            ctx.vertexAttrib1f(ii, 0);
            if (isWebGL2RenderingContext) {
                ctx2.vertexAttribDivisor(ii, 0);
            }
        }
        ctx.deleteBuffer(tmp);
        var numTextureUnits = ctx.getParameter(ctx.MAX_TEXTURE_IMAGE_UNITS);
        for (var ii = 0; ii < numTextureUnits; ++ii) {
            ctx.activeTexture(ctx.TEXTURE0 + ii);
            ctx.bindTexture(ctx.TEXTURE_CUBE_MAP, null);
            ctx.bindTexture(ctx.TEXTURE_2D, null);
            if (isWebGL2RenderingContext) {
                ctx2.bindTexture(ctx2.TEXTURE_2D_ARRAY, null);
                ctx2.bindTexture(ctx2.TEXTURE_3D, null);
                ctx2.bindSampler(ii, null);
            }
        }
        ctx.activeTexture(ctx.TEXTURE0);
        ctx.useProgram(null);
        ctx.bindBuffer(ctx.ARRAY_BUFFER, null);
        ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, null);
        ctx.bindFramebuffer(ctx.FRAMEBUFFER, null);
        ctx.bindRenderbuffer(ctx.RENDERBUFFER, null);
        ctx.disable(ctx.BLEND);
        ctx.disable(ctx.CULL_FACE);
        ctx.disable(ctx.DEPTH_TEST);
        ctx.disable(ctx.DITHER);
        ctx.disable(ctx.SCISSOR_TEST);
        ctx.blendColor(0, 0, 0, 0);
        ctx.blendEquation(ctx.FUNC_ADD);
        ctx.blendFunc(ctx.ONE, ctx.ZERO);
        ctx.clearColor(0, 0, 0, 0);
        ctx.clearDepth(1);
        ctx.clearStencil(-1);
        ctx.colorMask(true, true, true, true);
        ctx.cullFace(ctx.BACK);
        ctx.depthFunc(ctx.LESS);
        ctx.depthMask(true);
        ctx.depthRange(0, 1);
        ctx.frontFace(ctx.CCW);
        ctx.hint(ctx.GENERATE_MIPMAP_HINT, ctx.DONT_CARE);
        ctx.lineWidth(1);
        ctx.pixelStorei(ctx.PACK_ALIGNMENT, 4);
        ctx.pixelStorei(ctx.UNPACK_ALIGNMENT, 4);
        ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, 0);
        ctx.pixelStorei(ctx.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0);
        if (ctx.UNPACK_COLORSPACE_CONVERSION_WEBGL) {
            ctx.pixelStorei(ctx.UNPACK_COLORSPACE_CONVERSION_WEBGL, ctx.BROWSER_DEFAULT_WEBGL);
        }
        ctx.polygonOffset(0, 0);
        ctx.sampleCoverage(1, false);
        ctx.scissor(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.stencilFunc(ctx.ALWAYS, 0, 0xffffffff);
        ctx.stencilMask(0xffffffff);
        ctx.stencilOp(ctx.KEEP, ctx.KEEP, ctx.KEEP);
        ctx.viewport(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT | ctx.STENCIL_BUFFER_BIT);
        if (isWebGL2RenderingContext) {
            ctx2.drawBuffers([ctx2.BACK]);
            ctx2.readBuffer(ctx2.BACK);
            ctx2.bindBuffer(ctx2.COPY_READ_BUFFER, null);
            ctx2.bindBuffer(ctx2.COPY_WRITE_BUFFER, null);
            ctx2.bindBuffer(ctx2.PIXEL_PACK_BUFFER, null);
            ctx2.bindBuffer(ctx2.PIXEL_UNPACK_BUFFER, null);
            var numTransformFeedbacks = ctx.getParameter(ctx2.MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS);
            for (var ii = 0; ii < numTransformFeedbacks; ++ii) {
                ctx2.bindBufferBase(ctx2.TRANSFORM_FEEDBACK_BUFFER, ii, null);
            }
            var numUBOs = ctx.getParameter(ctx2.MAX_UNIFORM_BUFFER_BINDINGS);
            for (var ii = 0; ii < numUBOs; ++ii) {
                ctx2.bindBufferBase(ctx2.UNIFORM_BUFFER, ii, null);
            }
            ctx2.disable(ctx2.RASTERIZER_DISCARD);
            ctx2.pixelStorei(ctx2.UNPACK_IMAGE_HEIGHT, 0);
            ctx2.pixelStorei(ctx2.UNPACK_SKIP_IMAGES, 0);
            ctx2.pixelStorei(ctx2.UNPACK_ROW_LENGTH, 0);
            ctx2.pixelStorei(ctx2.UNPACK_SKIP_ROWS, 0);
            ctx2.pixelStorei(ctx2.UNPACK_SKIP_PIXELS, 0);
            ctx2.pixelStorei(ctx2.PACK_ROW_LENGTH, 0);
            ctx2.pixelStorei(ctx2.PACK_SKIP_ROWS, 0);
            ctx2.pixelStorei(ctx2.PACK_SKIP_PIXELS, 0);
            ctx2.hint(ctx2.FRAGMENT_SHADER_DERIVATIVE_HINT, ctx2.DONT_CARE);
        }
    };
    WebGLContext.prototype.programInfo = function (program) {
        var numAttribs = this.ctx.getProgramParameter(program, this.ctx.ACTIVE_ATTRIBUTES);
        for (var ii = 0; ii < numAttribs; ++ii) {
            var attribInfo = this.ctx.getActiveAttrib(program, ii);
            if (!attribInfo) {
                break;
            }
            console.log(this.ctx.getAttribLocation(program, attribInfo.name), attribInfo.name);
        }
    };
    return WebGLContext;
}());
exports["default"] = WebGLContext;
//# sourceMappingURL=WebGLContext.js.map

/***/ }),

/***/ "./dist/Core/WebGL/EntityProgram/Entity3DProgram.js":
/*!**********************************************************!*\
  !*** ./dist/Core/WebGL/EntityProgram/Entity3DProgram.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var Shader3DProgram_1 = __webpack_require__(/*! ../ShaderProgram/Shader3DProgram */ "./dist/Core/WebGL/ShaderProgram/Shader3DProgram.js");
var RenderOption_1 = __webpack_require__(/*! ../../Data/RenderOption */ "./dist/Core/Data/RenderOption.js");
var Entity3DProgram = /** @class */ (function () {
    function Entity3DProgram(ctx) {
        this.ctx = ctx;
        this.program = new Shader3DProgram_1.default(ctx);
    }
    Entity3DProgram.prototype.updatePerspective = function (projectionMatrix) {
        this.program.bindProgram();
        this.program.glSetProjectMatrix(projectionMatrix);
    };
    Entity3DProgram.prototype.delete = function () {
        this.program.arrayBuffer.delete();
        this.program.delete();
    };
    Entity3DProgram.prototype.setLight = function (light, camera) {
        this.program.setLight(light, camera);
    };
    Entity3DProgram.prototype.updateBuffer = function (entity, buffer) {
        var opt = entity.getOpt();
        if (RenderOption_1.ShaderType.THREE_DIMENSION !== opt.shaderType) {
            console.error("Updating buffer for registered 3D Entity but with different shader type as RenderOptions", opt);
            return;
        }
        var buffReg = this.program.arrayBuffer.bufferReg[entity.rendererBufferId];
        if (!buffer || buffer.length !== buffReg.verticesSize) {
            console.error("New Buffer data does not match initial buffer data!", entity, buffer, buffReg.verticesSize);
        }
        this.program.arrayBuffer.bufferSub(buffReg.offset, buffer, Shader3DProgram_1.default.DRAW_VERTEX_SIZE);
    };
    Entity3DProgram.prototype._render3DShadowEntities = function (entities) {
        for (var index = 0; index < entities.length; index++) {
            var data = entities[index];
            var entity = data[0];
            var model = data[1];
            var opt = entity.getOpt();
            this.program.glSetShadowModelMatrix(model);
            if (!entity.rendererBufferId) {
                throw new Error("Unregistered entity buffer" + entity);
            }
            var buffReg = this.program.arrayBuffer.bufferReg[entity.rendererBufferId];
            if (opt.renderType === RenderOption_1.RenderType.TRIANGLE) {
                this.ctx.drawArrays(this.ctx.TRIANGLES, buffReg.offset, buffReg.size);
            }
            else {
                this.ctx.drawArrays(this.ctx.TRIANGLE_STRIP, buffReg.offset, buffReg.size);
            }
        }
    };
    Entity3DProgram.prototype._setupShadow = function () {
        this.program.bindShadowTexture();
    };
    Entity3DProgram.prototype.render3DShadowMap = function (entities, setOriginalViewport) {
        if (!this.program.isShadowEnabled) {
            return;
        }
        this.ctx.disable(this.ctx.CULL_FACE);
        this.program.prepareShadowTexture();
        this._render3DShadowEntities(entities);
        this.program.revertShadowTexture();
        setOriginalViewport();
        this.ctx.enable(this.ctx.CULL_FACE);
        this.ctx.cullFace(this.ctx.BACK);
        this._setupShadow();
    };
    Entity3DProgram.prototype.render = function (entities, camera, textureReg, is2d) {
        this.program.arrayBuffer.bind();
        this.program.bindAttributePointers();
        this.program.bindProgram();
        this.program.glSetViewMatrix(camera.viewMatrix);
        if (is2d) {
            if (this.ctx.isEnabled(this.ctx.CULL_FACE)) {
                this.ctx.disable(this.ctx.CULL_FACE);
            }
            if (this.ctx.isEnabled(this.ctx.DEPTH_TEST)) {
                this.ctx.disable(this.ctx.DEPTH_TEST);
            }
        }
        else {
            if (!this.ctx.isEnabled(this.ctx.CULL_FACE)) {
                this.ctx.enable(this.ctx.CULL_FACE);
            }
            if (!this.ctx.isEnabled(this.ctx.DEPTH_TEST)) {
                this.ctx.enable(this.ctx.DEPTH_TEST);
            }
        }
        for (var index = 0; index < entities.length; index++) {
            var data = entities[index];
            var entity = data[0];
            var model = data[1];
            var opt = entity.getOpt();
            if (!entity.rendererTextureRef) {
                throw new Error("Unregistered entity texture" + entity);
            }
            var texReg = textureReg[entity.rendererTextureRef];
            this.program.bindTexture(texReg.texture);
            this.program.glSetModelViewMatrix(model);
            if (!entity.rendererBufferId) {
                throw new Error("Unregistered entity buffer" + entity);
            }
            var buffReg = this.program.arrayBuffer.bufferReg[entity.rendererBufferId];
            if (opt.renderType === RenderOption_1.RenderType.TRIANGLE) {
                this.ctx.drawArrays(this.ctx.TRIANGLES, buffReg.offset, buffReg.size);
            }
            else {
                this.ctx.drawArrays(this.ctx.TRIANGLE_STRIP, buffReg.offset, buffReg.size);
            }
        }
        this.program.arrayBuffer.unbind();
        this.program.unbindAttributePointers();
        this.program.unbindProgram();
    };
    Entity3DProgram.prototype.bindBuffer = function () {
        this.program.arrayBuffer.bufferBind();
    };
    Entity3DProgram.prototype.registerEntity = function (object, objBuffer) {
        var size = objBuffer.length / Shader3DProgram_1.default.DRAW_VERTEX_SIZE;
        this.program.arrayBuffer.bufferReg[this.program.arrayBuffer.bufferRegId] = {
            offset: this.program.arrayBuffer.length(),
            size: size,
            verticesSize: objBuffer.length,
        };
        this.program.arrayBuffer.push(objBuffer, size);
        object.rendererBufferId = this.program.arrayBuffer.bufferRegId;
        this.program.arrayBuffer.bufferRegId++;
    };
    return Entity3DProgram;
}());
exports["default"] = Entity3DProgram;
//# sourceMappingURL=Entity3DProgram.js.map

/***/ }),

/***/ "./dist/Core/WebGL/EntityProgram/EntityColorProgram.js":
/*!*************************************************************!*\
  !*** ./dist/Core/WebGL/EntityProgram/EntityColorProgram.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var RenderOption_1 = __webpack_require__(/*! ../../Data/RenderOption */ "./dist/Core/Data/RenderOption.js");
var ShaderColourProgram_1 = __webpack_require__(/*! ../ShaderProgram/ShaderColourProgram */ "./dist/Core/WebGL/ShaderProgram/ShaderColourProgram.js");
var EntityColourProgram = /** @class */ (function () {
    function EntityColourProgram(ctx) {
        this.ctx = ctx;
        this.program = new ShaderColourProgram_1.default(ctx);
    }
    EntityColourProgram.prototype.delete = function () {
        this.program.arrayBuffer.delete();
        this.program.delete();
    };
    EntityColourProgram.prototype.updateBuffer = function (entity, buffer) {
        var opt = entity.getOpt();
        if (RenderOption_1.ShaderType.COLOUR !== opt.shaderType) {
            console.error("Updating buffer for registered Colour Entity but with different shader type as RenderOptions", opt);
            return;
        }
        var buffReg = this.program.arrayBuffer.bufferReg[entity.rendererBufferId];
        if (!buffer || buffer.length !== buffReg.verticesSize) {
            console.error("New Buffer data does not match initial buffer data!", entity, buffer, buffReg.verticesSize);
        }
        this.program.arrayBuffer.bufferSub(buffReg.offset, buffer, ShaderColourProgram_1.default.DRAW_VERTEX_SIZE);
    };
    EntityColourProgram.prototype.bindBuffer = function () {
        this.program.arrayBuffer.bufferBind();
    };
    EntityColourProgram.prototype.render = function (entities, camera) {
        this.program.arrayBuffer.bind();
        this.program.bindAttributePointers();
        this.program.bindProgram();
        this.program.glSetViewMatrix(camera.viewMatrix);
        if (this.ctx.isEnabled(this.ctx.CULL_FACE)) {
            this.ctx.disable(this.ctx.CULL_FACE);
        }
        if (this.ctx.isEnabled(this.ctx.DEPTH_TEST)) {
            this.ctx.disable(this.ctx.DEPTH_TEST);
        }
        for (var index = 0; index < entities.length; index++) {
            var data = entities[index];
            var entity = data[0];
            var model = data[1];
            if (!entity.rendererBufferId) {
                throw new Error("Unregistered entity buffer" + entity);
            }
            var buffReg = this.program.arrayBuffer.bufferReg[entity.rendererBufferId];
            this.program.glSetModelViewMatrix(model);
            this.ctx.drawArrays(this.ctx.TRIANGLE_STRIP, buffReg.offset, buffReg.size);
        }
        this.program.arrayBuffer.unbind();
        this.program.unbindAttributePointers();
        this.program.unbindProgram();
    };
    EntityColourProgram.prototype.registerEntity = function (object, objBuffer) {
        var size = objBuffer.length / ShaderColourProgram_1.default.DRAW_VERTEX_SIZE;
        this.program.arrayBuffer.bufferReg[this.program.arrayBuffer.bufferRegId] = {
            offset: this.program.arrayBuffer.length(),
            size: size,
            verticesSize: objBuffer.length,
        };
        this.program.arrayBuffer.push(objBuffer, size);
        object.rendererBufferId = this.program.arrayBuffer.bufferRegId;
        this.program.arrayBuffer.bufferRegId++;
    };
    EntityColourProgram.prototype.updatePerspective = function (projectionMatrix) {
        this.program.bindProgram();
        this.program.glSetProjectMatrix(projectionMatrix);
    };
    return EntityColourProgram;
}());
exports["default"] = EntityColourProgram;
//# sourceMappingURL=EntityColorProgram.js.map

/***/ }),

/***/ "./dist/Core/WebGL/ShaderProgram/Shader3DProgram.js":
/*!**********************************************************!*\
  !*** ./dist/Core/WebGL/ShaderProgram/Shader3DProgram.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var BaseProgram_1 = __webpack_require__(/*! ../Base/BaseProgram */ "./dist/Core/WebGL/Base/BaseProgram.js");
var ShadowDepthFragmentShader_glsl_1 = __webpack_require__(/*! ../Shaders/ShadowDepthFragmentShader.glsl */ "./dist/Core/WebGL/Shaders/ShadowDepthFragmentShader.glsl");
var PassthroughVertexShader_glsl_1 = __webpack_require__(/*! ../Shaders/PassthroughVertexShader.glsl */ "./dist/Core/WebGL/Shaders/PassthroughVertexShader.glsl");
var ShadowLightVertexShader_glsl_1 = __webpack_require__(/*! ../Shaders/ShadowLightVertexShader.glsl */ "./dist/Core/WebGL/Shaders/ShadowLightVertexShader.glsl");
var ShadowLightFragmentShader_glsl_1 = __webpack_require__(/*! ../Shaders/ShadowLightFragmentShader.glsl */ "./dist/Core/WebGL/Shaders/ShadowLightFragmentShader.glsl");
var LightFragmentShader_glsl_1 = __webpack_require__(/*! ../Shaders/LightFragmentShader.glsl */ "./dist/Core/WebGL/Shaders/LightFragmentShader.glsl");
var LightVertexShader_glsl_1 = __webpack_require__(/*! ../Shaders/LightVertexShader.glsl */ "./dist/Core/WebGL/Shaders/LightVertexShader.glsl");
var ArrayBuffer_1 = __webpack_require__(/*! ../../Buffer/ArrayBuffer */ "./dist/Core/Buffer/ArrayBuffer.js");
var gl_matrix_1 = __webpack_require__(/*! gl-matrix */ "./node_modules/gl-matrix/esm/index.js");
var Texture_1 = __webpack_require__(/*! ../../Buffer/Texture */ "./dist/Core/Buffer/Texture.js");
var ProgramReference_1 = __webpack_require__(/*! ../Base/ProgramReference */ "./dist/Core/WebGL/Base/ProgramReference.js");
var Shader3DProgram = /** @class */ (function (_super) {
    __extends(Shader3DProgram, _super);
    function Shader3DProgram(ctx) {
        var _this = _super.call(this, ctx) || this;
        // this must be changed in shader as well.
        _this.shadowDepthTextureSize = 1024.0;
        _this.arrayBuffer = new ArrayBuffer_1.default(ctx);
        if (_this.isShadowEnabled) {
            _this.program = _this.compileShaders(ShadowLightVertexShader_glsl_1.default, ShadowLightFragmentShader_glsl_1.default);
            _this.bindProgram();
            _this.shadowMap = new ProgramReference_1.default("shadowMap", ctx, false, _this.program);
            _this.light1View = new ProgramReference_1.default("u_light1_view", ctx, false, _this.program);
            _this.light1Projection = new ProgramReference_1.default("u_light1_projection", ctx, false, _this.program);
        }
        else {
            _this.program = _this.compileShaders(LightVertexShader_glsl_1.default, LightFragmentShader_glsl_1.default);
            _this.bindProgram();
        }
        _this.normal = new ProgramReference_1.default("a_normal", ctx, true, _this.program);
        _this.position = new ProgramReference_1.default("a_position", ctx, true, _this.program);
        _this.textureCoords = new ProgramReference_1.default("a_texture_coords", ctx, true, _this.program);
        _this.projMtrx = new ProgramReference_1.default("u_projection", ctx, false, _this.program);
        _this.viewMtrx = new ProgramReference_1.default("u_view", ctx, false, _this.program);
        _this.modelMtrx = new ProgramReference_1.default("u_model", ctx, false, _this.program);
        _this.tex2DSampler = new ProgramReference_1.default("texture", ctx, false, _this.program);
        _this.light1Pos = new ProgramReference_1.default("u_light1_pos", ctx, false, _this.program);
        _this.light1Intensities = new ProgramReference_1.default("u_light1_intensities", ctx, false, _this.program);
        _this.light1Attenu = new ProgramReference_1.default("u_light1_attenuation", ctx, false, _this.program);
        _this.light1AmbCoeff = new ProgramReference_1.default("u_light1_ambient_coefficient", ctx, false, _this.program);
        if (_this.isShadowEnabled) {
            _this.initShadowProgram();
        }
        return _this;
    }
    Shader3DProgram.prototype.initShadowProgram = function () {
        var ctx = this.ctx;
        this.shadowProgram = this.compileShaders(PassthroughVertexShader_glsl_1.default, ShadowDepthFragmentShader_glsl_1.default);
        this.bindShadowProgram();
        this.shadowPos = new ProgramReference_1.default("a_position", ctx, true, this.shadowProgram);
        this.shadowProjection = new ProgramReference_1.default("u_projection", ctx, false, this.shadowProgram);
        this.shadowView = new ProgramReference_1.default("u_view", ctx, false, this.shadowProgram);
        this.shadowModel = new ProgramReference_1.default("u_model", ctx, false, this.shadowProgram);
        this.shadowFramebuffer = ctx.createFramebuffer();
        this.createDepthTexture();
        this.shadowRenderBuffer = ctx.createRenderbuffer();
        ctx.bindRenderbuffer(ctx.RENDERBUFFER, this.shadowRenderBuffer);
        ctx.renderbufferStorage(ctx.RENDERBUFFER, ctx.DEPTH_COMPONENT16, this.shadowDepthTextureSize, this.shadowDepthTextureSize);
        ctx.bindFramebuffer(ctx.FRAMEBUFFER, this.shadowFramebuffer);
        ctx.framebufferTexture2D(ctx.FRAMEBUFFER, ctx.COLOR_ATTACHMENT0, ctx.TEXTURE_2D, this.shadowDepthTexture, 0);
        ctx.framebufferRenderbuffer(ctx.FRAMEBUFFER, ctx.DEPTH_ATTACHMENT, ctx.RENDERBUFFER, this.shadowRenderBuffer);
        ctx.bindTexture(ctx.TEXTURE_2D, null);
        ctx.bindRenderbuffer(ctx.RENDERBUFFER, null);
        ctx.bindFramebuffer(ctx.FRAMEBUFFER, null);
    };
    Shader3DProgram.prototype.createDepthTexture = function () {
        var ctx = this.ctx;
        this.shadowTextureUnit = Texture_1.default.textureCount;
        ctx.activeTexture(ctx.TEXTURE0 + this.shadowTextureUnit);
        Texture_1.default.textureCount += 1;
        this.shadowDepthTexture = ctx.createTexture();
        ctx.bindTexture(ctx.TEXTURE_2D, this.shadowDepthTexture);
        ctx.texParameterf(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR);
        ctx.texParameterf(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
        ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, this.shadowDepthTextureSize, this.shadowDepthTextureSize, 0, ctx.RGBA, ctx.UNSIGNED_BYTE, null);
    };
    Shader3DProgram.prototype.bindShadowProgram = function () {
        this._bindProgram(this.shadowProgram);
    };
    Shader3DProgram.prototype.bindProgram = function () {
        this._bindProgram(this.program);
    };
    Shader3DProgram.prototype.unbindProgram = function () {
        this._unbindProgram();
    };
    Shader3DProgram.prototype.unbindShadowProgram = function () { };
    Shader3DProgram.prototype.enableAttribPointers = function () {
        var ctx = this.ctx;
        ctx.enableVertexAttribArray(this.position.ref);
        ctx.enableVertexAttribArray(this.textureCoords.ref);
        ctx.enableVertexAttribArray(this.normal.ref);
    };
    Shader3DProgram.prototype.bindAttributePointers = function () {
        this.enableAttribPointers();
        var ctx = this.ctx;
        ctx.vertexAttribPointer(this.position.ref, 3, ctx.FLOAT, false, 4 * 8, 0);
        ctx.vertexAttribPointer(this.normal.ref, 3, ctx.FLOAT, true, 4 * 8, 3 * 4);
        ctx.vertexAttribPointer(this.textureCoords.ref, 2, ctx.FLOAT, true, 4 * 8, 6 * 4);
    };
    Shader3DProgram.prototype.enableShadowAttribPointers = function () {
        this.ctx.enableVertexAttribArray(this.shadowPos.ref);
    };
    Shader3DProgram.prototype.bindShadowAttributePointers = function () {
        this.enableShadowAttribPointers();
        var ctx = this.ctx;
        ctx.vertexAttribPointer(this.shadowPos.ref, 3, ctx.FLOAT, false, 4 * 8, 0);
    };
    Shader3DProgram.prototype.glSetShadowModelMatrix = function (matrixArray) {
        this.ctx.uniformMatrix4fv(this.shadowModel.ref, false, matrixArray);
    };
    Shader3DProgram.prototype.unbindShadowAttributePointers = function () {
        this.ctx.disableVertexAttribArray(this.shadowPos.ref);
    };
    Shader3DProgram.prototype.setLight = function (light, camera) {
        this.light = light;
        var lookAt = light.lookAt();
        this.bindProgram();
        var ctx = this.ctx;
        ctx.uniform3fv(this.light1Pos.ref, light.pos);
        ctx.uniform3fv(this.light1Intensities.ref, light.in);
        ctx.uniform1f(this.light1AmbCoeff.ref, light.ambientCoeff);
        ctx.uniform1f(this.light1Attenu.ref, light.attenuation);
        if (this.isShadowEnabled) {
            var cameraFrustum = gl_matrix_1.mat4.frustum(gl_matrix_1.mat4.create(), -1 * camera.aspect, 1 * camera.aspect, -1 * camera.aspect, 1 * camera.aspect, 1, gl_matrix_1.vec3.squaredDistance(light.posVec(), light.atVec()));
            ctx.uniformMatrix4fv(this.light1View.ref, false, lookAt);
            ctx.uniformMatrix4fv(this.light1Projection.ref, false, cameraFrustum);
            this.bindShadowProgram();
            ctx.uniformMatrix4fv(this.shadowView.ref, false, lookAt);
            ctx.uniformMatrix4fv(this.shadowProjection.ref, false, cameraFrustum);
        }
    };
    Shader3DProgram.prototype.prepareShadowTexture = function () {
        var ctx = this.ctx;
        ctx.activeTexture(ctx.TEXTURE0 + this.shadowTextureUnit);
        ctx.bindTexture(ctx.TEXTURE_2D, this.shadowDepthTexture);
        ctx.bindRenderbuffer(ctx.RENDERBUFFER, this.shadowRenderBuffer);
        ctx.bindFramebuffer(ctx.FRAMEBUFFER, this.shadowFramebuffer);
        ctx.viewport(0, 0, this.shadowDepthTextureSize, this.shadowDepthTextureSize);
        ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);
        this.arrayBuffer.bind();
        this.bindShadowAttributePointers();
        this.bindShadowProgram();
    };
    Shader3DProgram.prototype.revertShadowTexture = function () {
        var ctx = this.ctx;
        ctx.bindFramebuffer(ctx.FRAMEBUFFER, null);
        ctx.bindRenderbuffer(ctx.RENDERBUFFER, null);
        this.arrayBuffer.unbind();
        this.unbindShadowAttributePointers();
        this.unbindShadowProgram();
    };
    Shader3DProgram.prototype.bindShadowTexture = function () {
        this.bindProgram();
        this.ctx.uniform1i(this.shadowMap.ref, this.shadowTextureUnit);
    };
    Shader3DProgram.prototype.unbindAttributePointers = function () {
        var ctx = this.ctx;
        ctx.disableVertexAttribArray(this.position.ref);
        ctx.disableVertexAttribArray(this.textureCoords.ref);
        ctx.disableVertexAttribArray(this.normal.ref);
    };
    Shader3DProgram.prototype.glSetViewMatrix = function (matrixArray) {
        this.ctx.uniformMatrix4fv(this.viewMtrx.ref, false, matrixArray);
    };
    Shader3DProgram.prototype.glSetProjectMatrix = function (matrixArray) {
        this.ctx.uniformMatrix4fv(this.projMtrx.ref, false, matrixArray);
    };
    Shader3DProgram.prototype.glSetModelViewMatrix = function (matrixArray) {
        this.ctx.uniformMatrix4fv(this.modelMtrx.ref, false, matrixArray);
    };
    Shader3DProgram.prototype.bindTexture = function (texture) {
        texture.bindTexture(this.ctx, this.tex2DSampler.ref);
    };
    Shader3DProgram.DRAW_VERTEX_SIZE = 8;
    return Shader3DProgram;
}(BaseProgram_1.default));
exports["default"] = Shader3DProgram;
//# sourceMappingURL=Shader3DProgram.js.map

/***/ }),

/***/ "./dist/Core/WebGL/ShaderProgram/ShaderColourProgram.js":
/*!**************************************************************!*\
  !*** ./dist/Core/WebGL/ShaderProgram/ShaderColourProgram.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var BaseProgram_1 = __webpack_require__(/*! ../Base/BaseProgram */ "./dist/Core/WebGL/Base/BaseProgram.js");
var RGBFragmentShader_glsl_1 = __webpack_require__(/*! ../Shaders/RGBFragmentShader.glsl */ "./dist/Core/WebGL/Shaders/RGBFragmentShader.glsl");
var RGBVertexShader_glsl_1 = __webpack_require__(/*! ../Shaders/RGBVertexShader.glsl */ "./dist/Core/WebGL/Shaders/RGBVertexShader.glsl");
var ArrayBuffer_1 = __webpack_require__(/*! ../../Buffer/ArrayBuffer */ "./dist/Core/Buffer/ArrayBuffer.js");
var ProgramReference_1 = __webpack_require__(/*! ../Base/ProgramReference */ "./dist/Core/WebGL/Base/ProgramReference.js");
var ShaderProgramColour = /** @class */ (function (_super) {
    __extends(ShaderProgramColour, _super);
    function ShaderProgramColour(ctx) {
        var _this = _super.call(this, ctx) || this;
        _this.arrayBuffer = new ArrayBuffer_1.default(ctx);
        _this.program = _this.compileShaders(RGBVertexShader_glsl_1.default, RGBFragmentShader_glsl_1.default);
        _this.bindProgram();
        _this.positionRef = new ProgramReference_1.default("a_position", ctx, true, _this.program);
        _this.colorRef = new ProgramReference_1.default("a_color", ctx, true, _this.program);
        _this.modelViewMatrixRef = new ProgramReference_1.default("u_model", ctx, false, _this.program);
        _this.viewMtrx = new ProgramReference_1.default("u_view", ctx, false, _this.program);
        _this.projMtrx = new ProgramReference_1.default("u_projection", ctx, false, _this.program);
        return _this;
    }
    ShaderProgramColour.prototype.bindProgram = function () {
        this._bindProgram(this.program);
    };
    ShaderProgramColour.prototype.unbindProgram = function () {
        this._unbindProgram();
    };
    ShaderProgramColour.prototype.enableAttribPointers = function () {
        var ctx = this.ctx;
        ctx.enableVertexAttribArray(this.positionRef.ref);
        ctx.enableVertexAttribArray(this.colorRef.ref);
    };
    ShaderProgramColour.prototype.bindAttributePointers = function () {
        this.enableAttribPointers();
        var ctx = this.ctx;
        ctx.vertexAttribPointer(this.positionRef.ref, 2, ctx.FLOAT, false, 4 * 7, 0);
        ctx.vertexAttribPointer(this.colorRef.ref, 4, ctx.FLOAT, false, 4 * 7, 3 * 4);
    };
    ShaderProgramColour.prototype.unbindAttributePointers = function () {
        var ctx = this.ctx;
        ctx.disableVertexAttribArray(this.positionRef.ref);
        ctx.disableVertexAttribArray(this.colorRef.ref);
    };
    ShaderProgramColour.prototype.glSetProjectMatrix = function (matrixArray) {
        this.ctx.uniformMatrix4fv(this.projMtrx.ref, false, matrixArray);
    };
    ShaderProgramColour.prototype.glSetModelViewMatrix = function (matrixArray) {
        this.ctx.uniformMatrix4fv(this.modelViewMatrixRef.ref, false, matrixArray);
    };
    ShaderProgramColour.prototype.glSetViewMatrix = function (matrixArray) {
        this.ctx.uniformMatrix4fv(this.viewMtrx.ref, false, matrixArray);
    };
    ShaderProgramColour.DRAW_VERTEX_SIZE = 7;
    return ShaderProgramColour;
}(BaseProgram_1.default));
exports["default"] = ShaderProgramColour;
//# sourceMappingURL=ShaderColourProgram.js.map

/***/ }),

/***/ "./dist/Core/WebGL/Shaders/LightFragmentShader.glsl":
/*!**********************************************************!*\
  !*** ./dist/Core/WebGL/Shaders/LightFragmentShader.glsl ***!
  \**********************************************************/
/***/ ((module) => {

module.exports = "\nprecision mediump float;\nprecision mediump int;\n\nvarying vec2 v_texture_coords;\nvarying vec3 v_normal;\n\nvarying vec3 v_light1_pos;\nvarying vec3 v_light1_intensities;\nvarying float v_light1_ambient_coefficient;\nvarying float v_diffuseCoefficient;\nvarying float v_attenuation;\n\nuniform sampler2D texture;\nuniform sampler2D shadowMap;\n\nvoid main(void) {\n  vec3 n = normalize(v_normal);\n  vec3 l = normalize(v_light1_pos);\n  float cosTheta = clamp(dot(n, l), 0.0, 1.0);\n\n  vec4 surfaceColor = texture2D(texture, v_texture_coords);\n  vec3 diffuse = v_diffuseCoefficient * surfaceColor.rgb * v_light1_intensities;\n  vec3 ambient = v_light1_ambient_coefficient * surfaceColor.rgb * v_light1_intensities;\n\n  vec3 linearColor = ambient + v_attenuation * diffuse * cosTheta;\n\n  gl_FragColor = vec4(linearColor, surfaceColor.a);\n}\n\n";

/***/ }),

/***/ "./dist/Core/WebGL/Shaders/LightVertexShader.glsl":
/*!********************************************************!*\
  !*** ./dist/Core/WebGL/Shaders/LightVertexShader.glsl ***!
  \********************************************************/
/***/ ((module) => {

module.exports = "precision mediump int;\nprecision mediump float;\n\nattribute vec3 a_position;\nattribute vec2 a_texture_coords;\nattribute vec3 a_normal;\n\nuniform mat4 u_projection;\nuniform mat4 u_view;\nuniform mat4 u_model;\n\nuniform vec3 u_light1_pos;\nuniform vec3 u_light1_intensities;\nuniform float u_light1_attenuation;\nuniform float u_light1_ambient_coefficient;\n\nvarying vec2 v_texture_coords;\nvarying vec3 v_normal;\n\nvarying vec3 v_light1_pos;\nvarying vec3 v_light1_intensities;\nvarying float v_light1_ambient_coefficient;\nvarying float v_diffuseCoefficient;\nvarying float v_attenuation;\n\nfloat transpose(float m) {\n  return m;\n}\n\nmat2 transpose(mat2 m) {\n  return mat2(m[0][0], m[1][0],\n    m[0][1], m[1][1]);\n}\n\nmat3 transpose(mat3 m) {\n  return mat3(m[0][0], m[1][0], m[2][0],\n    m[0][1], m[1][1], m[2][1],\n    m[0][2], m[1][2], m[2][2]);\n}\n\nmat4 transpose(mat4 m) {\n  return mat4(m[0][0], m[1][0], m[2][0], m[3][0],\n    m[0][1], m[1][1], m[2][1], m[3][1],\n    m[0][2], m[1][2], m[2][2], m[3][2],\n    m[0][3], m[1][3], m[2][3], m[3][3]);\n}\n\nfloat inverse(float m) {\n  return 1.0 / m;\n}\n\nmat2 inverse(mat2 m) {\n  return mat2(m[1][1], -m[0][1],\n    -m[1][0], m[0][0]) / (m[0][0] * m[1][1] - m[0][1] * m[1][0]);\n}\n\nmat3 inverse(mat3 m) {\n  float a00 = m[0][0], a01 = m[0][1], a02 = m[0][2];\n  float a10 = m[1][0], a11 = m[1][1], a12 = m[1][2];\n  float a20 = m[2][0], a21 = m[2][1], a22 = m[2][2];\n\n  float b01 = a22 * a11 - a12 * a21;\n  float b11 = -a22 * a10 + a12 * a20;\n  float b21 = a21 * a10 - a11 * a20;\n\n  float det = a00 * b01 + a01 * b11 + a02 * b21;\n\n  return mat3(b01, (-a22 * a01 + a02 * a21), (a12 * a01 - a02 * a11),\n    b11, (a22 * a00 - a02 * a20), (-a12 * a00 + a02 * a10),\n    b21, (-a21 * a00 + a01 * a20), (a11 * a00 - a01 * a10)) / det;\n}\n\nmat4 inverse(mat4 m) {\n  float\n  a00 = m[0][0], a01 = m[0][1], a02 = m[0][2], a03 = m[0][3],\n    a10 = m[1][0], a11 = m[1][1], a12 = m[1][2], a13 = m[1][3],\n    a20 = m[2][0], a21 = m[2][1], a22 = m[2][2], a23 = m[2][3],\n    a30 = m[3][0], a31 = m[3][1], a32 = m[3][2], a33 = m[3][3],\n\n    b00 = a00 * a11 - a01 * a10,\n    b01 = a00 * a12 - a02 * a10,\n    b02 = a00 * a13 - a03 * a10,\n    b03 = a01 * a12 - a02 * a11,\n    b04 = a01 * a13 - a03 * a11,\n    b05 = a02 * a13 - a03 * a12,\n    b06 = a20 * a31 - a21 * a30,\n    b07 = a20 * a32 - a22 * a30,\n    b08 = a20 * a33 - a23 * a30,\n    b09 = a21 * a32 - a22 * a31,\n    b10 = a21 * a33 - a23 * a31,\n    b11 = a22 * a33 - a23 * a32,\n\n    det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;\n\n  return mat4(\n    a11 * b11 - a12 * b10 + a13 * b09,\n    a02 * b10 - a01 * b11 - a03 * b09,\n    a31 * b05 - a32 * b04 + a33 * b03,\n    a22 * b04 - a21 * b05 - a23 * b03,\n    a12 * b08 - a10 * b11 - a13 * b07,\n    a00 * b11 - a02 * b08 + a03 * b07,\n    a32 * b02 - a30 * b05 - a33 * b01,\n    a20 * b05 - a22 * b02 + a23 * b01,\n    a10 * b10 - a11 * b08 + a13 * b06,\n    a01 * b08 - a00 * b10 - a03 * b06,\n    a30 * b04 - a31 * b02 + a33 * b00,\n    a21 * b02 - a20 * b04 - a23 * b00,\n    a11 * b07 - a10 * b09 - a12 * b06,\n    a00 * b09 - a01 * b07 + a02 * b06,\n    a31 * b01 - a30 * b03 - a32 * b00,\n    a20 * b03 - a21 * b01 + a22 * b00) / det;\n}\n\nfloat pow3(float x, float y) {\n  return exp2(y * log2(x));\n}\n\nvec3 pow2(vec3 x, vec3 y) {\n  return vec3(pow3(x.x, y.x), pow3(x.y, y.y), pow3(x.z, y.z));\n}\n\nvoid main(void) {\n\n  v_texture_coords = a_texture_coords;\n  v_normal = a_normal;\n\n  v_light1_pos = u_light1_pos;\n  v_light1_intensities = u_light1_intensities;\n  v_light1_ambient_coefficient = u_light1_ambient_coefficient;\n\n  vec3 surfacePos = vec3(u_model * vec4(a_position, 1));\n\n  mat3 normalMatrix = transpose(inverse(mat3(u_model)));\n  vec3 normal = normalize(normalMatrix * a_normal);\n\n  vec3 surfaceToLight = u_light1_pos - surfacePos;\n\n  v_diffuseCoefficient = max(0.0, dot(normal, surfaceToLight));\n  v_attenuation = 1.0 / (1.0 + u_light1_attenuation * pow3(1.0, 2.0));\n  gl_Position = u_projection * u_view * u_model * vec4(a_position, 1.0);\n}\n";

/***/ }),

/***/ "./dist/Core/WebGL/Shaders/PassthroughVertexShader.glsl":
/*!**************************************************************!*\
  !*** ./dist/Core/WebGL/Shaders/PassthroughVertexShader.glsl ***!
  \**************************************************************/
/***/ ((module) => {

module.exports = "\nprecision mediump int;\nprecision mediump float;\n\nattribute vec3 a_position;\n\nuniform mat4 u_projection;\nuniform mat4 u_view;\nuniform mat4 u_model;\nvoid main(void) {\n  gl_Position = u_projection * u_view * u_model * vec4(a_position, 1.0);\n}\n\n";

/***/ }),

/***/ "./dist/Core/WebGL/Shaders/RGBFragmentShader.glsl":
/*!********************************************************!*\
  !*** ./dist/Core/WebGL/Shaders/RGBFragmentShader.glsl ***!
  \********************************************************/
/***/ ((module) => {

module.exports = "\nprecision mediump float;\nvarying vec4 v_color;\nvoid main(void) {\n  gl_FragColor = v_color;\n}\n\n";

/***/ }),

/***/ "./dist/Core/WebGL/Shaders/RGBVertexShader.glsl":
/*!******************************************************!*\
  !*** ./dist/Core/WebGL/Shaders/RGBVertexShader.glsl ***!
  \******************************************************/
/***/ ((module) => {

module.exports = "\nattribute vec3 a_position;\nattribute vec4 a_color;\nvarying vec4 v_color;\nuniform mat4 u_model;\nuniform mat4 u_view;\nuniform mat4 u_projection;\n\nvoid main(void) {\n  v_color = a_color;\n  gl_Position = u_projection * u_view * u_model * vec4(a_position, 1);\n}\n\n";

/***/ }),

/***/ "./dist/Core/WebGL/Shaders/ShadowDepthFragmentShader.glsl":
/*!****************************************************************!*\
  !*** ./dist/Core/WebGL/Shaders/ShadowDepthFragmentShader.glsl ***!
  \****************************************************************/
/***/ ((module) => {

module.exports = "\nprecision mediump float;\n\nvec4 packDepthToRGBA(const float v) {\n  const float PackUpscale = 256. / 255.;\n  const vec3 PackFactors = vec3(256. * 256. * 256., 256. * 256., 256.);\n  const float ShiftRight8 = 1. / 256.;\n\n  vec4 r = vec4(fract(v * PackFactors), v);\n  r.yzw -= r.xyz * ShiftRight8; // tidy overflow\n  return r * PackUpscale;\n}\n\nvoid main(void) {\n  gl_FragColor = packDepthToRGBA(gl_FragCoord.z);\n}\n\n";

/***/ }),

/***/ "./dist/Core/WebGL/Shaders/ShadowLightFragmentShader.glsl":
/*!****************************************************************!*\
  !*** ./dist/Core/WebGL/Shaders/ShadowLightFragmentShader.glsl ***!
  \****************************************************************/
/***/ ((module) => {

module.exports = "\nprecision mediump float;\nprecision mediump int;\n\nvarying vec2 v_texture_coords;\nvarying vec3 v_position;\nvarying vec3 v_normal;\nvarying mat4 v_model;\n\nvarying vec3 v_light1_pos;\nvarying vec3 v_light1_intensities;\nvarying float v_light1_attenuation;\nvarying float v_light1_ambient_coefficient;\nvarying float v_diffuseCoefficient;\nvarying float v_attenuation;\nvarying vec4 v_shadow_pos;\n\nuniform sampler2D texture;\nuniform sampler2D shadowMap;\nuniform float numLights;\n\nstruct Light {\n  vec3 position;\n  vec3 intensities;\n  float ambientCoefficient;\n  float attenuation;\n};\n\nfloat decodeFloat(vec4 color) {\n  const vec4 bitShift = vec4(\n    1.0 / (256.0 * 256.0 * 256.0),\n    1.0 / (256.0 * 256.0),\n    1.0 / 256.0,\n    1\n  );\n  return dot(color, bitShift);\n}\n\nfloat random(vec3 seed, int i) {\n  vec4 seed4 = vec4(seed, i);\n  float dot_product = dot(seed4, vec4(12.9898, 78.233, 45.164, 94.673));\n  return fract(sin(dot_product) * 43758.5453);\n}\n\nvec2 poisson(int index) {\n  if (index == 0)\n    return vec2(-0.94201624, -0.39906216);\n  if (index == 1)\n    return vec2(0.94558609, -0.76890725);\n  if (index == 2)\n    return vec2(-0.094184101, -0.92938870);\n  if (index == 3)\n    return vec2(0.34495938, 0.29387760);\n  if (index == 4)\n    return vec2(-0.91588581, 0.45771432);\n  if (index == 5)\n    return vec2(-0.81544232, -0.87912464);\n  if (index == 6)\n    return vec2(-0.38277543, 0.27676845);\n  if (index == 7)\n    return vec2(0.97484398, 0.75648379);\n  if (index == 8)\n    return vec2(0.44323325, -0.97511554);\n  if (index == 9)\n    return vec2(0.53742981, -0.47373420);\n  if (index == 10)\n    return vec2(-0.26496911, -0.41893023);\n  if (index == 11)\n    return vec2(0.79197514, 0.19090188);\n  if (index == 12)\n    return vec2(-0.24188840, 0.99706507);\n  if (index == 13)\n    return vec2(-0.81409955, 0.91437590);\n  if (index == 14)\n    return vec2(0.19984126, 0.78641367);\n  if (index == 15)\n    return vec2(0.14383161, -0.14100790);\n  return vec2(0, 0);\n}\n\nfloat unpackRGBAToDepth(const vec4 v) {\n  const float UnpackDownscale = 255. / 256.;\n  const vec3 PackFactors = vec3(256. * 256. * 256., 256. * 256., 256.);\n  const vec4 UnpackFactors = UnpackDownscale / vec4(PackFactors, 1.);\n  return dot(v, UnpackFactors);\n}\n\nvoid main(void) {\n  Light light1;\n  light1.intensities = v_light1_intensities;\n  light1.position = v_light1_pos;\n  light1.attenuation = v_light1_attenuation;\n  light1.ambientCoefficient = v_light1_ambient_coefficient;\n\n  vec4 surfaceColor = texture2D(texture, v_texture_coords);\n  vec3 diffuse = v_diffuseCoefficient * surfaceColor.rgb * light1.intensities;\n  vec3 ambient = light1.ambientCoefficient * surfaceColor.rgb * light1.intensities;\n  vec3 n = normalize(v_normal);\n  vec3 l = normalize(v_light1_pos);\n  float cosTheta = clamp(dot(n, l), 0.0, 1.0);\n\n  const float texelSize = 1.0 / 1024.0;\n\n  float amountInLight = 0.0;\n\n  vec3 fragmentDepth = v_shadow_pos.xyz / v_shadow_pos.w;\n  const float shadowAcneRemover = 0.001;\n  fragmentDepth.z -= shadowAcneRemover;\n\n  float soften = 0.0;\n  for (int x = -1; x <= 1; x++) {\n    for (int y = -1; y <= 1; y++) {\n      float texelDepth = unpackRGBAToDepth(texture2D(shadowMap, fragmentDepth.xy + vec2(x, y) * texelSize));\n      soften += 1.0;\n      if (fragmentDepth.z < texelDepth) {\n        amountInLight += 1.0;\n      }\n    }\n  }\n\n  amountInLight /= soften;\n\n  vec3 linearColor = ambient + amountInLight * v_attenuation * diffuse * cosTheta;\n  vec3 gamma = vec3(1.0 / 2.2);\n  gl_FragColor = vec4(pow(linearColor, gamma), surfaceColor.a);\n}\n";

/***/ }),

/***/ "./dist/Core/WebGL/Shaders/ShadowLightVertexShader.glsl":
/*!**************************************************************!*\
  !*** ./dist/Core/WebGL/Shaders/ShadowLightVertexShader.glsl ***!
  \**************************************************************/
/***/ ((module) => {

module.exports = "\nprecision mediump int;\nprecision mediump float;\n\nattribute vec3 a_position;\nattribute vec2 a_texture_coords;\nattribute vec3 a_normal;\n\nuniform mat4 u_projection;\nuniform mat4 u_view;\nuniform mat4 u_model;\n\nuniform vec3 u_light1_pos;\nuniform vec3 u_light1_intensities;\nuniform float u_light1_attenuation;\nuniform float u_light1_ambient_coefficient;\nuniform mat4 u_light1_view;\nuniform mat4 u_light1_projection;\n\nvarying vec2 v_texture_coords;\nvarying vec3 v_position;\nvarying vec3 v_normal;\nvarying mat4 v_model;\n\nvarying vec3 v_light1_pos;\nvarying vec3 v_light1_intensities;\nvarying float v_light1_attenuation;\nvarying float v_light1_ambient_coefficient;\n\nvarying float v_diffuseCoefficient;\nvarying float v_attenuation;\nvarying vec4 v_shadow_pos;\n\nstruct Light {\n  vec3 position;\n  vec3 intensities;\n  float ambientCoefficient;\n  float attenuation;\n};\n\nfloat transpose(float m) {\n  return m;\n}\n\nmat2 transpose(mat2 m) {\n  return mat2(m[0][0], m[1][0],\n    m[0][1], m[1][1]);\n}\n\nmat3 transpose(mat3 m) {\n  return mat3(m[0][0], m[1][0], m[2][0],\n    m[0][1], m[1][1], m[2][1],\n    m[0][2], m[1][2], m[2][2]);\n}\n\nmat4 transpose(mat4 m) {\n  return mat4(m[0][0], m[1][0], m[2][0], m[3][0],\n    m[0][1], m[1][1], m[2][1], m[3][1],\n    m[0][2], m[1][2], m[2][2], m[3][2],\n    m[0][3], m[1][3], m[2][3], m[3][3]);\n}\n\nfloat inverse(float m) {\n  return 1.0 / m;\n}\n\nmat2 inverse(mat2 m) {\n  return mat2(m[1][1], -m[0][1],\n    -m[1][0], m[0][0]) / (m[0][0] * m[1][1] - m[0][1] * m[1][0]);\n}\n\nmat3 inverse(mat3 m) {\n  float a00 = m[0][0], a01 = m[0][1], a02 = m[0][2];\n  float a10 = m[1][0], a11 = m[1][1], a12 = m[1][2];\n  float a20 = m[2][0], a21 = m[2][1], a22 = m[2][2];\n\n  float b01 = a22 * a11 - a12 * a21;\n  float b11 = -a22 * a10 + a12 * a20;\n  float b21 = a21 * a10 - a11 * a20;\n\n  float det = a00 * b01 + a01 * b11 + a02 * b21;\n\n  return mat3(b01, (-a22 * a01 + a02 * a21), (a12 * a01 - a02 * a11),\n    b11, (a22 * a00 - a02 * a20), (-a12 * a00 + a02 * a10),\n    b21, (-a21 * a00 + a01 * a20), (a11 * a00 - a01 * a10)) / det;\n}\n\nmat4 inverse(mat4 m) {\n  float\n  a00 = m[0][0], a01 = m[0][1], a02 = m[0][2], a03 = m[0][3],\n    a10 = m[1][0], a11 = m[1][1], a12 = m[1][2], a13 = m[1][3],\n    a20 = m[2][0], a21 = m[2][1], a22 = m[2][2], a23 = m[2][3],\n    a30 = m[3][0], a31 = m[3][1], a32 = m[3][2], a33 = m[3][3],\n\n    b00 = a00 * a11 - a01 * a10,\n    b01 = a00 * a12 - a02 * a10,\n    b02 = a00 * a13 - a03 * a10,\n    b03 = a01 * a12 - a02 * a11,\n    b04 = a01 * a13 - a03 * a11,\n    b05 = a02 * a13 - a03 * a12,\n    b06 = a20 * a31 - a21 * a30,\n    b07 = a20 * a32 - a22 * a30,\n    b08 = a20 * a33 - a23 * a30,\n    b09 = a21 * a32 - a22 * a31,\n    b10 = a21 * a33 - a23 * a31,\n    b11 = a22 * a33 - a23 * a32,\n\n    det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;\n\n  return mat4(\n    a11 * b11 - a12 * b10 + a13 * b09,\n    a02 * b10 - a01 * b11 - a03 * b09,\n    a31 * b05 - a32 * b04 + a33 * b03,\n    a22 * b04 - a21 * b05 - a23 * b03,\n    a12 * b08 - a10 * b11 - a13 * b07,\n    a00 * b11 - a02 * b08 + a03 * b07,\n    a32 * b02 - a30 * b05 - a33 * b01,\n    a20 * b05 - a22 * b02 + a23 * b01,\n    a10 * b10 - a11 * b08 + a13 * b06,\n    a01 * b08 - a00 * b10 - a03 * b06,\n    a30 * b04 - a31 * b02 + a33 * b00,\n    a21 * b02 - a20 * b04 - a23 * b00,\n    a11 * b07 - a10 * b09 - a12 * b06,\n    a00 * b09 - a01 * b07 + a02 * b06,\n    a31 * b01 - a30 * b03 - a32 * b00,\n    a20 * b03 - a21 * b01 + a22 * b00) / det;\n}\n\nconst mat4 norm_shadow_coords = mat4(0.5, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.5, 0.5, 0.5, 1.0);\n\nvoid main(void) {\n\n  v_texture_coords = a_texture_coords;\n  v_position = a_position;\n  v_normal = a_normal;\n  v_model = u_model;\n\n  v_light1_pos = u_light1_pos;\n  v_light1_intensities = u_light1_intensities;\n  v_light1_attenuation = u_light1_attenuation;\n  v_light1_ambient_coefficient = u_light1_ambient_coefficient;\n\n  Light light1;\n  light1.intensities = v_light1_intensities;\n  light1.position = v_light1_pos;\n  light1.attenuation = v_light1_attenuation;\n  light1.ambientCoefficient = v_light1_ambient_coefficient;\n\n  vec3 surfacePos = vec3(v_model * vec4(v_position, 1));\n\n  mat3 normalMatrix = transpose(inverse(mat3(v_model)));\n  vec3 normal = normalize(normalMatrix * v_normal);\n\n  vec3 fragPosition = vec3(v_model * vec4(v_position, 1));\n\n  vec3 surfaceToLight = light1.position - fragPosition;\n\n  float brightness = dot(normal, surfaceToLight) / (length(surfaceToLight) * length(normal));\n  if (brightness > 1.0) {\n    brightness = 1.0;\n  } else if (brightness < 0.0) {\n    brightness = 0.0;\n  }\n\n  float distanceToLight = length(light1.position - surfacePos);\n\n  v_diffuseCoefficient = max(0.0, dot(normal, surfaceToLight));\n  v_attenuation = 1.0 / (1.0 + light1.attenuation * pow(distanceToLight, 2.0));\n  v_shadow_pos = norm_shadow_coords * u_light1_projection * u_light1_view * u_model * vec4(a_position, 1.0);\n  gl_Position = u_projection * u_view * u_model * vec4(a_position, 1.0);\n}\n\n";

/***/ }),

/***/ "./dist/Core/WorldDelegate.js":
/*!************************************!*\
  !*** ./dist/Core/WorldDelegate.js ***!
  \************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var WorldDelegate = /** @class */ (function () {
    function WorldDelegate() {
    }
    WorldDelegate.prototype.setEngineHelper = function (engineHelper) {
        this.engineHelper = engineHelper;
    };
    WorldDelegate.prototype.loadResources = function (resources) {
        throw new Error("unimplemented method");
    };
    WorldDelegate.prototype.update = function () {
        throw new Error("unimplemented method");
    };
    WorldDelegate.prototype.render = function () {
        throw new Error("unimplemented method");
    };
    WorldDelegate.prototype.event = function (event) {
        throw new Error("unimplemented method");
    };
    WorldDelegate.prototype.pause = function () {
        throw new Error("unimplemented method");
    };
    WorldDelegate.prototype.resume = function () {
        throw new Error("unimplemented method");
    };
    WorldDelegate.prototype.init = function (engineHelper) {
        throw new Error("unimplemented method");
    };
    WorldDelegate.prototype.destroy = function () {
        throw new Error("unimplemented method");
    };
    WorldDelegate.prototype.reset = function () { };
    return WorldDelegate;
}());
exports["default"] = WorldDelegate;
//# sourceMappingURL=WorldDelegate.js.map

/***/ }),

/***/ "./dist/Entity/BasicSprite.js":
/*!************************************!*\
  !*** ./dist/Entity/BasicSprite.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Moveable_1 = __webpack_require__(/*! ./Moveable */ "./dist/Entity/Moveable.js");
var BasicSprite = /** @class */ (function (_super) {
    __extends(BasicSprite, _super);
    function BasicSprite(rect, spriteModel) {
        var _this = _super.call(this) || this;
        _this.spriteModel = spriteModel;
        _this.spriteModel.setRect(rect);
        _this.entities.push(_this.spriteModel);
        return _this;
    }
    BasicSprite.prototype.render = function (engineHelper) {
        this.spriteModel.render(engineHelper);
    };
    BasicSprite.prototype.update = function (engineHelper) {
        this.spriteModel.update(engineHelper);
    };
    BasicSprite.prototype.init = function (engineHelper) {
        _super.prototype.init.call(this, engineHelper);
        this.setRect(this.spriteModel.getRect());
        this.updatePhysicsPosition();
    };
    return BasicSprite;
}(Moveable_1.default));
exports["default"] = BasicSprite;
//# sourceMappingURL=BasicSprite.js.map

/***/ }),

/***/ "./dist/Entity/LineColour.js":
/*!***********************************!*\
  !*** ./dist/Entity/LineColour.js ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var ShaderEntityBuilder_1 = __webpack_require__(/*! ../Core/Builder/ShaderEntityBuilder */ "./dist/Core/Builder/ShaderEntityBuilder.js");
var Colour_1 = __webpack_require__(/*! ../Core/Data/Colour */ "./dist/Core/Data/Colour.js");
var ColourVertexModel_1 = __webpack_require__(/*! ../Core/Data/ColourVertexModel */ "./dist/Core/Data/ColourVertexModel.js");
var RenderOption_1 = __webpack_require__(/*! ../Core/Data/RenderOption */ "./dist/Core/Data/RenderOption.js");
var EngineObject_1 = __webpack_require__(/*! ../Core/EngineEntity/EngineObject */ "./dist/Core/EngineEntity/EngineObject.js");
var EngineObjectHelper_1 = __webpack_require__(/*! ../Core/EngineEntity/EngineObjectHelper */ "./dist/Core/EngineEntity/EngineObjectHelper.js");
var LineColour = /** @class */ (function (_super) {
    __extends(LineColour, _super);
    function LineColour(point1, point2, thickness, rgba) {
        var _this = _super.call(this) || this;
        _this.point1 = point1;
        _this.point2 = point2;
        _this.thickness = thickness;
        _this.rgba = rgba;
        return _this;
    }
    LineColour.prototype.render = function (engineHelper) {
        engineHelper.render(this.shaderEntity);
    };
    LineColour.prototype.updatePosition = function (point1, point2) {
        this.point1 = point1;
        this.point2 = point2;
        var lX = point2.x - point1.x;
        var lY = point2.y - point1.y;
        var length = Math.sqrt(lX * lX + lY * lY);
        var angle = Math.atan2(lY, lX) * (180 / Math.PI);
        var mX = (point1.x + point2.x) / 2;
        var mY = (point1.y + point2.y) / 2;
        this.center(mX, mY, 0);
        this.rotateOrigin(mX, mY, 0);
        this.angleZ(angle);
        this.scale(length, this.thickness, 1.0);
    };
    LineColour.prototype.init = function (engineHelper) {
        this.vertexModel = new ColourVertexModel_1.default().fillRenderUnits(EngineObjectHelper_1.default.vertex.planeXYColour(this.rgba || new Colour_1.default(0, 0, 0, 0)));
        this.updatePosition(this.point1, this.point2);
        var renderOpt = new RenderOption_1.default();
        renderOpt.renderType = RenderOption_1.RenderType.TRIANGLE;
        renderOpt.shaderType = RenderOption_1.ShaderType.COLOUR;
        this.shaderEntity = new ShaderEntityBuilder_1.default(engineHelper)
            .addBuffer(this.vertexModel)
            .build(this, renderOpt);
    };
    return LineColour;
}(EngineObject_1.default));
exports["default"] = LineColour;
//# sourceMappingURL=LineColour.js.map

/***/ }),

/***/ "./dist/Entity/Moveable.js":
/*!*********************************!*\
  !*** ./dist/Entity/Moveable.js ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var ModelPosition_1 = __webpack_require__(/*! ../Core/EngineEntity/ModelPosition */ "./dist/Core/EngineEntity/ModelPosition.js");
var Physics_1 = __webpack_require__(/*! ../Core/Physics/Physics */ "./dist/Core/Physics/Physics.js");
var EntityManager_1 = __webpack_require__(/*! ../Manager/EntityManager */ "./dist/Manager/EntityManager.js");
var Coordinate_1 = __webpack_require__(/*! ../Core/Data/Coordinate */ "./dist/Core/Data/Coordinate.js");
var EngineMath_1 = __webpack_require__(/*! ../Core/Physics/EngineMath */ "./dist/Core/Physics/EngineMath.js");
var Rect2d_1 = __webpack_require__(/*! ../Core/Data/Rect2d */ "./dist/Core/Data/Rect2d.js");
var Moveable = /** @class */ (function (_super) {
    __extends(Moveable, _super);
    function Moveable() {
        var _this = _super.call(this) || this;
        _this.dampenReduction = 0.0;
        _this.completeSimulation = function () {
            _this.resetPhysics();
        };
        _this.resetPhysics = function () {
            _this.physics.t.x = _this.position.x;
            _this.physics.t.y = _this.position.y;
            _this.physics.t.z = _this.position.z;
            _this.physics.d.x = 0;
            _this.physics.d.y = 0;
            _this.physics.d.z = 0;
            _this.physics.isMoving = false;
            _this.physics.collisionIteration = 0;
        };
        _this.physicSimulation = function (simulationId, time, _) {
            var physics = _this.physics;
            physics.isMoving = true;
            var dx = physics.v.x * time;
            var dy = physics.v.y * time;
            var model = _this;
            if (physics.collisionSize) {
                physics.modelPos.setRect(physics.collisionSize);
                physics.modelPos.$physicsId = _this.$physicsId;
                model = physics.modelPos;
            }
            var _a = _this.resolveCollision(model, dx, dy), _dx = _a[0], _dy = _a[1], collision = _a[2];
            if (_this.shouldTranslate(collision)) {
                physics.collisionIteration = 0;
            }
            else {
                _this.addDampener(time);
                dx = _dx;
                dy = _dy;
                physics.collisionIteration++;
                if (physics.collisionIteration > physics.collisionStopItThres) {
                    _this.cancelSimulation(simulationId);
                }
            }
            _this.movementRotation(physics.v.x);
            _this.translate(dx, dy, 0);
            if (physics.collisionSize) {
                physics.modelPos.translate(dx, dy, 0);
                physics.collisionSize.x += dx;
                physics.collisionSize.y += dy;
            }
            if (_this.isBounded) {
                _this.updateLocBoundToBoundary();
            }
            _this.completePhysicsIteration(time);
        };
        _this.physics = {
            t: new Coordinate_1.default(0, 0, 0),
            d: new Coordinate_1.default(0, 0, 0),
            v: new Coordinate_1.default(0, 0, 0),
            a: new Coordinate_1.default(0, 0, 0),
            modelPos: new ModelPosition_1.default(),
            isMoving: false,
            collisionSize: undefined,
            bound: new Rect2d_1.default(0, 0, 1.0, 1.0),
            simulationId: undefined,
            jumpSimulationId: undefined,
            gravitySimulationId: undefined,
            collisionIteration: 0,
            collisionStopItThres: 5,
        };
        _this.isMoveable = true;
        _this.isBounded = true;
        _this.hasCollision = true;
        return _this;
    }
    Moveable.prototype.updatePhysicsPosition = function () {
        this.physics.t.x = this.position.x;
        this.physics.t.y = this.position.y;
        this.physics.t.z = this.position.z;
    };
    Moveable.prototype.updateDeltaDistance = function (x, y, z) {
        if (x !== undefined) {
            this.physics.d.x = x - this.position.x;
            this.physics.t.x = x;
        }
        else {
            this.physics.d.x = this.physics.t.x - this.position.x;
        }
        if (y !== undefined) {
            this.physics.d.y = y - this.position.y;
            this.physics.t.y = y;
        }
        else {
            this.physics.d.y = this.physics.t.y - this.position.y;
        }
        if (z !== undefined) {
            this.physics.d.z = z - this.position.z;
            this.physics.t.z = z;
        }
        else {
            this.physics.d.z = this.physics.t.z - this.position.z;
        }
    };
    Moveable.prototype.updateLocBoundToBoundary = function () {
        var _a;
        var pos = this.physics.collisionSize
            ? this.physics.modelPos.position
            : this.position;
        var boundRect = (_a = this.physics.bound) !== null && _a !== void 0 ? _a : new Rect2d_1.default(0, 0, 1, 1, 0);
        var coordinate = EngineMath_1.default.boundRect(boundRect, this.physics.collisionSize
            ? this.physics.modelPos.position
            : this.position);
        var dx = 0;
        var dy = 0;
        if (pos.x !== coordinate.x) {
            this.physics.v.x = 0;
            dx = coordinate.x - pos.x;
        }
        if (pos.y !== coordinate.y) {
            this.physics.v.y = 0;
            dy = coordinate.y - pos.y;
        }
        this.center(this.position.x + dx, this.position.y + dy, this.position.z);
    };
    Moveable.prototype.calcTotalDeltaDistance = function () {
        return Math.sqrt(this.physics.d.x * this.physics.d.x +
            this.physics.d.y * this.physics.d.y +
            this.physics.d.z * this.physics.d.z);
    };
    Moveable.prototype.translateTo = function (velocity, dx, dy, dz, complete) {
        var directionalModifier = dx !== 0 ? 10e-6 * (this.physics.d.x < 0 ? -1 : 1) : 0;
        this.physics.t.x += (dx || 0) + directionalModifier;
        this.physics.t.y += dy || 0;
        this.physics.t.z += dz || 0;
        this.moveTo(velocity, this.physics.t.x, this.physics.t.y, this.physics.t.z, complete);
    };
    Moveable.prototype.shouldTranslate = function (colliding) {
        return colliding.length === 0;
    };
    Moveable.prototype.moveToTime = function (time, x, y, z, complete) {
        var _this = this;
        var _a;
        Physics_1.default.cancelSimulation((_a = this.physics.simulationId) !== null && _a !== void 0 ? _a : 0, true);
        if (!this.isMoveable) {
            return;
        }
        var physics = this.physics;
        this.updateDeltaDistance(x, y, z);
        var totalTime = Math.max(time, 10e-6);
        this.movementRotation(physics.d.x);
        var completeSim = this.completeSimulation;
        if (complete) {
            completeSim = function () {
                _this.completeSimulation();
                complete();
            };
        }
        physics.simulationId = Physics_1.default.runSimulation(totalTime, this.moveSimulation.bind(this), completeSim, physics.simulationId);
    };
    Moveable.prototype.movementRotation = function (dx) {
        if (this.isRotateMove) {
            if (dx > 0) {
                this.rotateY(0);
            }
            else if (dx < 0) {
                this.rotateY(180);
            }
        }
    };
    Moveable.prototype.moveTo = function (velocity, x, y, z, complete) {
        var _this = this;
        var _a;
        Physics_1.default.cancelSimulation((_a = this.physics.simulationId) !== null && _a !== void 0 ? _a : 0, true);
        if (!this.isMoveable) {
            return;
        }
        var physics = this.physics;
        this.updateDeltaDistance(x, y, z);
        var distance = this.calcTotalDeltaDistance();
        var totalTime = distance / velocity;
        this.movementRotation(physics.d.x);
        var completeSim = this.completeSimulation;
        if (complete) {
            completeSim = function () {
                _this.completeSimulation();
                complete();
            };
        }
        physics.simulationId = Physics_1.default.runSimulation(totalTime, this.moveSimulation.bind(this), completeSim, physics.simulationId);
    };
    Moveable.prototype.addDampener = function (time) {
        var dampeningProp = time / 1000.0;
        var xSign = Math.sign(this.physics.v.x);
        this.physics.v.x -= xSign * this.dampenReduction * dampeningProp;
        if (xSign !== Math.sign(this.physics.v.x)) {
            this.physics.v.x = 0;
        }
        var ySign = Math.sign(this.physics.v.y);
        this.physics.v.y -= ySign * this.dampenReduction * dampeningProp;
        if (ySign !== Math.sign(this.physics.v.y)) {
            this.physics.v.y = 0;
        }
        if (Math.abs(this.physics.v.x) < 10e-6) {
            this.physics.v.x = 0;
        }
        if (Math.abs(this.physics.v.y) < 10e-6) {
            this.physics.v.y = 0;
        }
    };
    Moveable.prototype.addImpulse = function (acceleration, contactTime) {
        this.physics.v.x += acceleration.x * contactTime;
        this.physics.v.y += acceleration.y * contactTime;
    };
    Moveable.prototype.setVelocity = function (velocity) {
        this.physics.v.x = velocity.x;
        this.physics.v.y = velocity.y;
    };
    Moveable.prototype.runPhysicsSimulation = function (simulationId, totalTime) {
        if (totalTime === void 0) { totalTime = Physics_1.default.TIME_STEP_MILLIS * 2.0; }
        Physics_1.default.runSimulation(totalTime, this.physicSimulation, this.completeSimulation, simulationId);
    };
    Moveable.prototype.completePhysicsIteration = function (_) { };
    Moveable.prototype.resolveCollision = function (model, dx, dy) {
        if (this.hasCollision) {
            return Physics_1.default.isCollidingResolve(model, dx, dy);
        }
        else {
            return [dx, dy, []];
        }
    };
    Moveable.prototype.cancelSimulation = function (simulationId) {
        var simulation = Physics_1.default.simulations[simulationId];
        if (simulation === null || simulation === void 0 ? void 0 : simulation.completeSimulation) {
            simulation.completeSimulation();
        }
        Physics_1.default.cancelSimulation(simulationId);
    };
    Moveable.prototype.moveSimulation = function (simulationId, time, totalRunTime) {
        if (Math.abs(totalRunTime) < 10e-6) {
            return;
        }
        var physics = this.physics;
        physics.isMoving = true;
        var propTime = Math.min(1.0, time / totalRunTime);
        var dx = physics.d.x * propTime;
        var dy = physics.d.y * propTime;
        var dz = physics.d.z * propTime;
        this.translateCollision(simulationId, dx, dy, dz);
        this.completePhysicsIteration(time);
    };
    Moveable.prototype.translateCollision = function (simulationId, dx, dy, dz) {
        var physics = this.physics;
        var model = this;
        if (physics.collisionSize) {
            physics.modelPos.setRect(physics.collisionSize);
            physics.modelPos.$physicsId = this.$physicsId;
            model = physics.modelPos;
        }
        var colliding = Physics_1.default.isCollidingOffset2d(model, dx, dy);
        if (this.shouldTranslate(colliding)) {
            this.translate(dx, dy, dz);
            if (physics.collisionSize) {
                physics.modelPos.translate(dx, dy, 0);
                physics.collisionSize.x += dx;
                physics.collisionSize.y += dy;
            }
            if (this.isBounded) {
                this.updateLocBoundToBoundary();
            }
            this.physics.collisionIteration = 0;
        }
        else {
            this.physics.collisionIteration++;
            if (this.physics.collisionIteration > this.physics.collisionStopItThres) {
                this.cancelSimulation(simulationId);
            }
        }
    };
    Moveable.prototype.setMoveable = function (isMoving) {
        this.isMoveable = isMoving;
    };
    Moveable.prototype.copyTexture = function (obj) {
        this.shaderEntity ? _super.prototype.copyTexture.call(this, obj) : undefined;
        this.entities.forEach(function (entity) { return entity.copyTexture(obj); });
    };
    return Moveable;
}(EntityManager_1.default));
exports["default"] = Moveable;
//# sourceMappingURL=Moveable.js.map

/***/ }),

/***/ "./dist/Entity/Object3d.js":
/*!*********************************!*\
  !*** ./dist/Entity/Object3d.js ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var TextureVertexModel_1 = __webpack_require__(/*! ../Core/Data/TextureVertexModel */ "./dist/Core/Data/TextureVertexModel.js");
var ModelObject3d_1 = __webpack_require__(/*! ../Core/EngineEntity/ModelObject3d */ "./dist/Core/EngineEntity/ModelObject3d.js");
var Object3d = /** @class */ (function (_super) {
    __extends(Object3d, _super);
    function Object3d(rect, vertexUvCacheId) {
        var _this = _super.call(this, rect, new TextureVertexModel_1.default()) || this;
        _this.vertexUvCacheId = vertexUvCacheId;
        return _this;
    }
    Object3d.prototype.render = function (engineHelper) {
        engineHelper.render(this.shaderEntity);
    };
    Object3d.prototype.init = function (engineHelper) {
        this.vertexModel = engineHelper.newVertexModelUv3d(this.vertexUvCacheId);
        _super.prototype.init.call(this, engineHelper);
    };
    return Object3d;
}(ModelObject3d_1.default));
exports["default"] = Object3d;
//# sourceMappingURL=Object3d.js.map

/***/ }),

/***/ "./dist/Entity/Plane2d.js":
/*!********************************!*\
  !*** ./dist/Entity/Plane2d.js ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var ModelObject2d_1 = __webpack_require__(/*! ../Core/EngineEntity/ModelObject2d */ "./dist/Core/EngineEntity/ModelObject2d.js");
var TextureVertexModel_1 = __webpack_require__(/*! ../Core/Data/TextureVertexModel */ "./dist/Core/Data/TextureVertexModel.js");
var Plane2d = /** @class */ (function (_super) {
    __extends(Plane2d, _super);
    function Plane2d(rect, textureReference) {
        var _this = _super.call(this, rect, new TextureVertexModel_1.default()) || this;
        _this.textureReference = textureReference;
        return _this;
    }
    Plane2d.prototype.setLayer = function (layer) {
        this.position.z = -layer;
    };
    Plane2d.prototype.render = function (engineHelper) {
        engineHelper.render(this.shaderEntity);
    };
    Plane2d.prototype.init = function (engineHelper) {
        this.vertexModel = engineHelper.newVertexModel2d(this.textureReference);
        _super.prototype.init.call(this, engineHelper);
    };
    return Plane2d;
}(ModelObject2d_1.default));
exports["default"] = Plane2d;
//# sourceMappingURL=Plane2d.js.map

/***/ }),

/***/ "./dist/Entity/Plane3d.js":
/*!********************************!*\
  !*** ./dist/Entity/Plane3d.js ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var ModelObjectRect3d_1 = __webpack_require__(/*! ../Core/EngineEntity/ModelObjectRect3d */ "./dist/Core/EngineEntity/ModelObjectRect3d.js");
var TextureVertexModel_1 = __webpack_require__(/*! ../Core/Data/TextureVertexModel */ "./dist/Core/Data/TextureVertexModel.js");
var Plane3d = /** @class */ (function (_super) {
    __extends(Plane3d, _super);
    function Plane3d(rect, vertexModel) {
        var _this = _super.call(this, rect, vertexModel) || this;
        if (!(vertexModel instanceof TextureVertexModel_1.default)) {
            var error = "Vertex model must of be type TextureVertexModel";
            console.error(error, vertexModel);
            throw new Error(error);
        }
        if (!vertexModel.renderUnits || vertexModel.renderUnits.length !== 4) {
            var error = "Plane3d requires 4 vertexes";
            console.error(error, vertexModel);
            throw new Error(error);
        }
        return _this;
    }
    Plane3d.prototype.render = function (engineHelper) {
        engineHelper.render(this.shaderEntity);
    };
    return Plane3d;
}(ModelObjectRect3d_1.default));
exports["default"] = Plane3d;
//# sourceMappingURL=Plane3d.js.map

/***/ }),

/***/ "./dist/Entity/PlaneColour.js":
/*!************************************!*\
  !*** ./dist/Entity/PlaneColour.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var RenderOption_1 = __webpack_require__(/*! ../Core/Data/RenderOption */ "./dist/Core/Data/RenderOption.js");
var EngineObject_1 = __webpack_require__(/*! ../Core/EngineEntity/EngineObject */ "./dist/Core/EngineEntity/EngineObject.js");
var ShaderEntityBuilder_1 = __webpack_require__(/*! ../Core/Builder/ShaderEntityBuilder */ "./dist/Core/Builder/ShaderEntityBuilder.js");
var Colour_1 = __webpack_require__(/*! ../Core/Data/Colour */ "./dist/Core/Data/Colour.js");
var ColourVertexModel_1 = __webpack_require__(/*! ../Core/Data/ColourVertexModel */ "./dist/Core/Data/ColourVertexModel.js");
var EngineObjectHelper_1 = __webpack_require__(/*! ../Core/EngineEntity/EngineObjectHelper */ "./dist/Core/EngineEntity/EngineObjectHelper.js");
var PlaneColour = /** @class */ (function (_super) {
    __extends(PlaneColour, _super);
    function PlaneColour(rect, rgba) {
        var _this = _super.call(this) || this;
        _this.rgba = rgba;
        _this.centerRect(rect);
        _this.rotateOriginRect(rect);
        _this.scaleRect(rect);
        return _this;
    }
    PlaneColour.prototype.render = function (engineHelper) {
        engineHelper.render(this.shaderEntity);
    };
    PlaneColour.prototype.init = function (engineHelper) {
        this.vertexModel = new ColourVertexModel_1.default().fillRenderUnits(EngineObjectHelper_1.default.vertex.planeXYColour(this.rgba || new Colour_1.default(0, 0, 0, 0)));
        var renderOpt = new RenderOption_1.default();
        renderOpt.renderType = RenderOption_1.RenderType.TRIANGLE;
        renderOpt.shaderType = RenderOption_1.ShaderType.COLOUR;
        this.shaderEntity = new ShaderEntityBuilder_1.default(engineHelper)
            .addBuffer(this.vertexModel)
            .build(this, renderOpt);
    };
    return PlaneColour;
}(EngineObject_1.default));
exports["default"] = PlaneColour;
//# sourceMappingURL=PlaneColour.js.map

/***/ }),

/***/ "./dist/Entity/SpriteModel.js":
/*!************************************!*\
  !*** ./dist/Entity/SpriteModel.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Plane2d_1 = __webpack_require__(/*! ./Plane2d */ "./dist/Entity/Plane2d.js");
var Timer_1 = __webpack_require__(/*! ../Core/Common/Timer */ "./dist/Core/Common/Timer.js");
var EntityManager2d_1 = __webpack_require__(/*! ../Manager/EntityManager2d */ "./dist/Manager/EntityManager2d.js");
var SpriteModel = /** @class */ (function (_super) {
    __extends(SpriteModel, _super);
    function SpriteModel(rect, ticks, textures) {
        var _this = _super.call(this) || this;
        _this.spriteIdx = 0;
        _this.timer = new Timer_1.default();
        _this.setRect(rect);
        _this.ticks = ticks;
        _this.textures = textures;
        return _this;
    }
    SpriteModel.prototype.update = function (_) { };
    SpriteModel.prototype.render = function (engineHelper) {
        var _a;
        (_a = this.entities[this.spriteIdx]) === null || _a === void 0 ? void 0 : _a.render(engineHelper);
        this.calcSpriteIdx();
    };
    SpriteModel.prototype.calcSpriteIdx = function () {
        if (this.timer.peak() > this.ticks) {
            var spriteLength = this.entities.length;
            this.spriteIdx += Math.round(this.timer.peak() / this.ticks);
            if (this.spriteIdx >= spriteLength) {
                var idxFactor = this.spriteIdx / spriteLength;
                this.spriteIdx = Math.round((idxFactor - Math.floor(idxFactor)) * spriteLength);
                if (this.spriteIdx >= spriteLength) {
                    console.error("index out of bound after shaping", this.spriteIdx);
                    this.spriteIdx = 0;
                }
            }
            this.timer.start();
        }
    };
    SpriteModel.prototype.init = function (engineHelper) {
        var _this = this;
        if (!this.textures) {
            return;
        }
        for (var index = 0; index < this.textures.length; index++) {
            this.entities.push(new Plane2d_1.default(this.getRect(), this.textures[index]));
        }
        this.entities.forEach(function (e) {
            e.setTop(_this.isTop);
            e.hidden = _this.hidden;
        });
        this.center(this.position.x, this.position.y, this.position.z);
        this.rotateOrigin(this.position.x, this.position.y, this.position.z);
        this.rotateZ(180);
        _super.prototype.init.call(this, engineHelper);
        this.timer.start();
    };
    return SpriteModel;
}(EntityManager2d_1.default));
exports["default"] = SpriteModel;
//# sourceMappingURL=SpriteModel.js.map

/***/ }),

/***/ "./dist/Entity/SpriteMoveable.js":
/*!***************************************!*\
  !*** ./dist/Entity/SpriteMoveable.js ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SpriteMoveableModel = void 0;
var SpriteModel_1 = __webpack_require__(/*! ./SpriteModel */ "./dist/Entity/SpriteModel.js");
var Moveable_1 = __webpack_require__(/*! ./Moveable */ "./dist/Entity/Moveable.js");
var SpriteMoveableModel = /** @class */ (function (_super) {
    __extends(SpriteMoveableModel, _super);
    function SpriteMoveableModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SpriteMoveableModel;
}(SpriteModel_1.default));
exports.SpriteMoveableModel = SpriteMoveableModel;
var SpriteMoveable = /** @class */ (function (_super) {
    __extends(SpriteMoveable, _super);
    function SpriteMoveable(rect, spriteModel) {
        var _this = _super.call(this) || this;
        _this.spriteModel = spriteModel;
        _this.spriteModel.setRect(rect);
        return _this;
    }
    SpriteMoveable.prototype.render = function (engineHelper) {
        this.spriteModel.render(engineHelper);
    };
    SpriteMoveable.prototype.update = function (engineHelper) {
        this.spriteModel.update(engineHelper);
    };
    SpriteMoveable.prototype.init = function (engineHelper) {
        this.entities.push(this.spriteModel);
        _super.prototype.init.call(this, engineHelper);
        this.setRect(this.spriteModel.getRect());
        this.updatePhysicsPosition();
    };
    return SpriteMoveable;
}(Moveable_1.default));
exports["default"] = SpriteMoveable;
//# sourceMappingURL=SpriteMoveable.js.map

/***/ }),

/***/ "./dist/Entity/TriangleColour2d.js":
/*!*****************************************!*\
  !*** ./dist/Entity/TriangleColour2d.js ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var ShaderEntityBuilder_1 = __webpack_require__(/*! ../Core/Builder/ShaderEntityBuilder */ "./dist/Core/Builder/ShaderEntityBuilder.js");
var ColourVertexModel_1 = __webpack_require__(/*! ../Core/Data/ColourVertexModel */ "./dist/Core/Data/ColourVertexModel.js");
var RenderOption_1 = __webpack_require__(/*! ../Core/Data/RenderOption */ "./dist/Core/Data/RenderOption.js");
var EngineObject_1 = __webpack_require__(/*! ../Core/EngineEntity/EngineObject */ "./dist/Core/EngineEntity/EngineObject.js");
var EngineObjectHelper_1 = __webpack_require__(/*! ../Core/EngineEntity/EngineObjectHelper */ "./dist/Core/EngineEntity/EngineObjectHelper.js");
var TriangleColour2d = /** @class */ (function (_super) {
    __extends(TriangleColour2d, _super);
    function TriangleColour2d(rect, rgba) {
        var _this = _super.call(this) || this;
        _this.vertexModel = new ColourVertexModel_1.default().fillRenderUnits(EngineObjectHelper_1.default.vertex.triangleXYColour(rgba));
        _this.centerRect(rect);
        _this.rotateOriginRect(rect);
        _this.scaleRect(rect);
        return _this;
    }
    TriangleColour2d.prototype.render = function (engineHelper) {
        engineHelper.render(this.shaderEntity);
    };
    TriangleColour2d.prototype.init = function (engineHelper) {
        var renderOpt = new RenderOption_1.default();
        renderOpt.renderType = RenderOption_1.RenderType.TRIANGLE;
        renderOpt.shaderType = RenderOption_1.ShaderType.COLOUR;
        this.shaderEntity = new ShaderEntityBuilder_1.default(engineHelper)
            .addBuffer(this.vertexModel)
            .build(this, renderOpt);
    };
    return TriangleColour2d;
}(EngineObject_1.default));
exports["default"] = TriangleColour2d;
//# sourceMappingURL=TriangleColour2d.js.map

/***/ }),

/***/ "./dist/Manager/EntityManager.js":
/*!***************************************!*\
  !*** ./dist/Manager/EntityManager.js ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var EngineObject_1 = __webpack_require__(/*! ../Core/EngineEntity/EngineObject */ "./dist/Core/EngineEntity/EngineObject.js");
var EntityManager = /** @class */ (function (_super) {
    __extends(EntityManager, _super);
    function EntityManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.entities = [];
        return _this;
    }
    EntityManager.prototype.setPosition = function (position) {
        this.entities.forEach(function (e) { return e.setPosition(position); });
    };
    EntityManager.prototype.center = function (x, y, z) {
        _super.prototype.center.call(this, x, y, z);
        this.entities.forEach(function (e) { return e.center(x, y, z); });
    };
    EntityManager.prototype.rotateOrigin = function (x, y, z) {
        _super.prototype.rotateOrigin.call(this, x, y, z);
        this.entities.forEach(function (e) { return e.rotateOrigin(x, y, z); });
    };
    EntityManager.prototype.rotateOriginRect = function (rect) {
        this.rotateOrigin(rect.x, rect.y, rect.z);
    };
    EntityManager.prototype.rotateX = function (x) {
        this.angleX(x);
    };
    EntityManager.prototype.rotateY = function (y) {
        this.angleY(y);
    };
    EntityManager.prototype.rotateZ = function (z) {
        this.angleZ(z);
    };
    EntityManager.prototype.angleX = function (x) {
        _super.prototype.angleX.call(this, x);
        this.entities.forEach(function (e) { return e.angleX(x); });
    };
    EntityManager.prototype.angleY = function (y) {
        _super.prototype.angleY.call(this, y);
        this.entities.forEach(function (e) { return e.angleY(y); });
    };
    EntityManager.prototype.angleZ = function (z) {
        _super.prototype.angleZ.call(this, z);
        this.entities.forEach(function (e) { return e.angleZ(z); });
    };
    EntityManager.prototype.scaleX = function (x) {
        _super.prototype.scaleX.call(this, x);
        this.entities.forEach(function (e) { return e.scaleX(x); });
    };
    EntityManager.prototype.scaleY = function (y) {
        _super.prototype.scaleY.call(this, y);
        this.entities.forEach(function (e) { return e.scaleY(y); });
    };
    EntityManager.prototype.scaleZ = function (z) {
        _super.prototype.scaleZ.call(this, z);
        this.entities.forEach(function (e) { return e.scaleZ(z); });
    };
    EntityManager.prototype.scale = function (x, y, z) {
        _super.prototype.scale.call(this, x, y, z);
        this.entities.forEach(function (e) { return e.scale(x, y, z); });
    };
    EntityManager.prototype.translate = function (dx, dy, dz) {
        _super.prototype.translate.call(this, dx, dy, dz);
        this.entities.forEach(function (e) { return e.translate(dx, dy, dz); });
    };
    EntityManager.prototype.init = function (engineHelper) {
        _super.prototype.init.call(this, engineHelper);
        this.entities.forEach(function (a) { return a.init(engineHelper); });
    };
    EntityManager.prototype.render = function (engineHelper) {
        if (this.hidden) {
            return;
        }
        this.entities.forEach(function (entity) { return entity.render(engineHelper); });
        _super.prototype.render.call(this, engineHelper);
    };
    EntityManager.prototype.update = function (engineHelper) {
        if (this.hidden) {
            return;
        }
        this.entities.forEach(function (entity) { return entity.update(engineHelper); });
        _super.prototype.update.call(this, engineHelper);
    };
    EntityManager.prototype.setTop = function (isTop) {
        _super.prototype.setTop.call(this, isTop);
        this.entities.forEach(function (entity) { return entity.setTop(isTop); });
    };
    Object.defineProperty(EntityManager.prototype, "hidden", {
        set: function (value) {
            _super.prototype.setHidden.call(this, value);
            this.entities.forEach(function (entity) { return (entity.hidden = value); });
        },
        enumerable: false,
        configurable: true
    });
    return EntityManager;
}(EngineObject_1.default));
exports["default"] = EntityManager;
//# sourceMappingURL=EntityManager.js.map

/***/ }),

/***/ "./dist/Manager/EntityManager2d.js":
/*!*****************************************!*\
  !*** ./dist/Manager/EntityManager2d.js ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var EntityManager_1 = __webpack_require__(/*! ./EntityManager */ "./dist/Manager/EntityManager.js");
var Plane2d_1 = __webpack_require__(/*! ../Entity/Plane2d */ "./dist/Entity/Plane2d.js");
var EntityManager2d = /** @class */ (function (_super) {
    __extends(EntityManager2d, _super);
    function EntityManager2d() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EntityManager2d.prototype.setLayer = function (priority) {
        this.entities.forEach(function (entity) {
            if (entity instanceof Plane2d_1.default) {
                entity.setLayer(priority);
            }
        });
        this.position.z = -1 * priority;
        return this;
    };
    EntityManager2d.prototype.init = function (engineHelper) {
        _super.prototype.init.call(this, engineHelper);
        this.setLayer(-this.position.z);
    };
    return EntityManager2d;
}(EntityManager_1.default));
exports["default"] = EntityManager2d;
//# sourceMappingURL=EntityManager2d.js.map

/***/ }),

/***/ "./dist/Manager/ObjectManager.js":
/*!***************************************!*\
  !*** ./dist/Manager/ObjectManager.js ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var WorldDelegate_1 = __webpack_require__(/*! ../Core/WorldDelegate */ "./dist/Core/WorldDelegate.js");
var ObjectManager = /** @class */ (function (_super) {
    __extends(ObjectManager, _super);
    function ObjectManager() {
        var _this = _super.call(this) || this;
        _this.entities = [];
        _this.deferred = [];
        _this.isLoaded = false;
        return _this;
    }
    ObjectManager.prototype.render = function () {
        var _this = this;
        this.entities.forEach(function (ent) { return ent.render(_this.engineHelper); });
    };
    ObjectManager.prototype.update = function () {
        var _this = this;
        this.entities.forEach(function (ent) { return ent.update(_this.engineHelper); });
    };
    ObjectManager.prototype.addEntity = function (entity) {
        this.entities.push(entity);
    };
    ObjectManager.prototype.event = function (event) {
        for (var entityIdx = 0; entityIdx < this.entities.length; entityIdx++) {
            var shouldPropagate = this.entities[entityIdx].event(event, this.engineHelper);
            if (shouldPropagate === false) {
                return false;
            }
        }
    };
    ObjectManager.prototype.loadTexture = function (onLoad) {
        if (!this.isLoaded) {
            this.deferred.push(onLoad);
        }
        else {
            onLoad();
        }
    };
    ObjectManager.prototype.init = function () {
        for (var entityIdx = 0; entityIdx < this.entities.length; entityIdx++) {
            this.entities[entityIdx].init(this.engineHelper);
        }
        this.deferred.forEach(function (def) { return def(); });
        this.isLoaded = true;
    };
    return ObjectManager;
}(WorldDelegate_1.default));
exports["default"] = ObjectManager;
//# sourceMappingURL=ObjectManager.js.map

/***/ }),

/***/ "./dist/index.js":
/*!***********************!*\
  !*** ./dist/index.js ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TextureVertexModel = exports.RenderType = exports.Object3d = exports.ModelObject3d = exports.BitmapConfigParser = exports.Plane3d = exports.Coordinate = exports.Camera = exports.Polygon = exports.CollisionDetection = exports.Collision = exports.Events = exports.ConfigEntity = exports.generateId = exports.Timer = exports.Position = exports.Physics = exports.ModelPosition = exports.Rect2d = exports.Rect3d = exports.Moveable = exports.Colour = exports.PlaneType = exports.Light = exports.Resource = exports.ResourceResolver = exports.LineColour = exports.FontReference = exports.Font = exports.EntityManager2d = exports.EntityManager = exports.ObjectManager = exports.EngineMap = exports.EngineHelper = exports.EngineObject = exports.App = void 0;
var App_1 = __webpack_require__(/*! ./Core/App */ "./dist/Core/App.js");
exports.App = App_1.default;
var EngineObject_1 = __webpack_require__(/*! ./Core/EngineEntity/EngineObject */ "./dist/Core/EngineEntity/EngineObject.js");
Object.defineProperty(exports, "EngineObject", ({ enumerable: true, get: function () { return EngineObject_1.default; } }));
var EngineHelper_1 = __webpack_require__(/*! ./Core/EngineHelper */ "./dist/Core/EngineHelper.js");
Object.defineProperty(exports, "EngineHelper", ({ enumerable: true, get: function () { return EngineHelper_1.default; } }));
var EngineMap_1 = __webpack_require__(/*! ./Core/EngineEntity/EngineMap */ "./dist/Core/EngineEntity/EngineMap.js");
Object.defineProperty(exports, "EngineMap", ({ enumerable: true, get: function () { return EngineMap_1.default; } }));
var ObjectManager_1 = __webpack_require__(/*! ./Manager/ObjectManager */ "./dist/Manager/ObjectManager.js");
Object.defineProperty(exports, "ObjectManager", ({ enumerable: true, get: function () { return ObjectManager_1.default; } }));
var EntityManager_1 = __webpack_require__(/*! ./Manager/EntityManager */ "./dist/Manager/EntityManager.js");
Object.defineProperty(exports, "EntityManager", ({ enumerable: true, get: function () { return EntityManager_1.default; } }));
var EntityManager2d_1 = __webpack_require__(/*! ./Manager/EntityManager2d */ "./dist/Manager/EntityManager2d.js");
Object.defineProperty(exports, "EntityManager2d", ({ enumerable: true, get: function () { return EntityManager2d_1.default; } }));
var Font_1 = __webpack_require__(/*! ./Core/Font/Font */ "./dist/Core/Font/Font.js");
Object.defineProperty(exports, "Font", ({ enumerable: true, get: function () { return Font_1.default; } }));
var Font_2 = __webpack_require__(/*! ./Core/Font/Font */ "./dist/Core/Font/Font.js");
Object.defineProperty(exports, "FontReference", ({ enumerable: true, get: function () { return Font_2.FontReference; } }));
var LineColour_1 = __webpack_require__(/*! ./Entity/LineColour */ "./dist/Entity/LineColour.js");
Object.defineProperty(exports, "LineColour", ({ enumerable: true, get: function () { return LineColour_1.default; } }));
var ResourceResolver_1 = __webpack_require__(/*! ./AssetLoader/ResourceResolver */ "./dist/AssetLoader/ResourceResolver.js");
Object.defineProperty(exports, "ResourceResolver", ({ enumerable: true, get: function () { return ResourceResolver_1.default; } }));
var Resource_1 = __webpack_require__(/*! ./Core/Data/Resource */ "./dist/Core/Data/Resource.js");
Object.defineProperty(exports, "Resource", ({ enumerable: true, get: function () { return Resource_1.default; } }));
var Light_1 = __webpack_require__(/*! ./Core/Data/Light */ "./dist/Core/Data/Light.js");
Object.defineProperty(exports, "Light", ({ enumerable: true, get: function () { return Light_1.default; } }));
var PlaneType_1 = __webpack_require__(/*! ./Core/Data/PlaneType */ "./dist/Core/Data/PlaneType.js");
Object.defineProperty(exports, "PlaneType", ({ enumerable: true, get: function () { return PlaneType_1.default; } }));
var Colour_1 = __webpack_require__(/*! ./Core/Data/Colour */ "./dist/Core/Data/Colour.js");
Object.defineProperty(exports, "Colour", ({ enumerable: true, get: function () { return Colour_1.default; } }));
var Moveable_1 = __webpack_require__(/*! ./Entity/Moveable */ "./dist/Entity/Moveable.js");
Object.defineProperty(exports, "Moveable", ({ enumerable: true, get: function () { return Moveable_1.default; } }));
var Rect3d_1 = __webpack_require__(/*! ./Core/Data/Rect3d */ "./dist/Core/Data/Rect3d.js");
Object.defineProperty(exports, "Rect3d", ({ enumerable: true, get: function () { return Rect3d_1.default; } }));
var Rect2d_1 = __webpack_require__(/*! ./Core/Data/Rect2d */ "./dist/Core/Data/Rect2d.js");
Object.defineProperty(exports, "Rect2d", ({ enumerable: true, get: function () { return Rect2d_1.default; } }));
var ModelPosition_1 = __webpack_require__(/*! ./Core/EngineEntity/ModelPosition */ "./dist/Core/EngineEntity/ModelPosition.js");
Object.defineProperty(exports, "ModelPosition", ({ enumerable: true, get: function () { return ModelPosition_1.default; } }));
var Physics_1 = __webpack_require__(/*! ./Core/Physics/Physics */ "./dist/Core/Physics/Physics.js");
Object.defineProperty(exports, "Physics", ({ enumerable: true, get: function () { return Physics_1.default; } }));
var Position_1 = __webpack_require__(/*! ./Core/EngineEntity/Position */ "./dist/Core/EngineEntity/Position.js");
Object.defineProperty(exports, "Position", ({ enumerable: true, get: function () { return Position_1.default; } }));
var Timer_1 = __webpack_require__(/*! ./Core/Common/Timer */ "./dist/Core/Common/Timer.js");
Object.defineProperty(exports, "Timer", ({ enumerable: true, get: function () { return Timer_1.default; } }));
var IdGenerator_1 = __webpack_require__(/*! ./Core/Common/IdGenerator */ "./dist/Core/Common/IdGenerator.js");
Object.defineProperty(exports, "generateId", ({ enumerable: true, get: function () { return IdGenerator_1.generateId; } }));
var ConfigMapBuilder_1 = __webpack_require__(/*! ./Core/Builder/ConfigMapBuilder */ "./dist/Core/Builder/ConfigMapBuilder.js");
Object.defineProperty(exports, "ConfigEntity", ({ enumerable: true, get: function () { return ConfigMapBuilder_1.ConfigEntity; } }));
var Events_1 = __webpack_require__(/*! ./Core/Events */ "./dist/Core/Events.js");
Object.defineProperty(exports, "Events", ({ enumerable: true, get: function () { return Events_1.default; } }));
var CollisionDetection_1 = __webpack_require__(/*! ./Core/Physics/CollisionDetection */ "./dist/Core/Physics/CollisionDetection.js");
Object.defineProperty(exports, "Collision", ({ enumerable: true, get: function () { return CollisionDetection_1.Collision; } }));
Object.defineProperty(exports, "CollisionDetection", ({ enumerable: true, get: function () { return CollisionDetection_1.CollisionDetection; } }));
Object.defineProperty(exports, "Polygon", ({ enumerable: true, get: function () { return CollisionDetection_1.Polygon; } }));
var Camera_1 = __webpack_require__(/*! ./Core/Camera */ "./dist/Core/Camera.js");
Object.defineProperty(exports, "Camera", ({ enumerable: true, get: function () { return Camera_1.default; } }));
var Coordinate_1 = __webpack_require__(/*! ./Core/Data/Coordinate */ "./dist/Core/Data/Coordinate.js");
Object.defineProperty(exports, "Coordinate", ({ enumerable: true, get: function () { return Coordinate_1.default; } }));
var Plane3d_1 = __webpack_require__(/*! ./Entity/Plane3d */ "./dist/Entity/Plane3d.js");
Object.defineProperty(exports, "Plane3d", ({ enumerable: true, get: function () { return Plane3d_1.default; } }));
var BitmapConfigParser_1 = __webpack_require__(/*! ./AssetLoader/BitmapConfigParser */ "./dist/AssetLoader/BitmapConfigParser.js");
Object.defineProperty(exports, "BitmapConfigParser", ({ enumerable: true, get: function () { return BitmapConfigParser_1.default; } }));
var ModelObject3d_1 = __webpack_require__(/*! ./Core/EngineEntity/ModelObject3d */ "./dist/Core/EngineEntity/ModelObject3d.js");
Object.defineProperty(exports, "ModelObject3d", ({ enumerable: true, get: function () { return ModelObject3d_1.default; } }));
var Object3d_1 = __webpack_require__(/*! ./Entity/Object3d */ "./dist/Entity/Object3d.js");
Object.defineProperty(exports, "Object3d", ({ enumerable: true, get: function () { return Object3d_1.default; } }));
var RenderOption_1 = __webpack_require__(/*! ./Core/Data/RenderOption */ "./dist/Core/Data/RenderOption.js");
Object.defineProperty(exports, "RenderType", ({ enumerable: true, get: function () { return RenderOption_1.RenderType; } }));
var TextureVertexModel_1 = __webpack_require__(/*! ./Core/Data/TextureVertexModel */ "./dist/Core/Data/TextureVertexModel.js");
Object.defineProperty(exports, "TextureVertexModel", ({ enumerable: true, get: function () { return TextureVertexModel_1.default; } }));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/gl-matrix/esm/common.js":
/*!**********************************************!*\
  !*** ./node_modules/gl-matrix/esm/common.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ARRAY_TYPE: () => (/* binding */ ARRAY_TYPE),
/* harmony export */   EPSILON: () => (/* binding */ EPSILON),
/* harmony export */   RANDOM: () => (/* binding */ RANDOM),
/* harmony export */   equals: () => (/* binding */ equals),
/* harmony export */   setMatrixArrayType: () => (/* binding */ setMatrixArrayType),
/* harmony export */   toRadian: () => (/* binding */ toRadian)
/* harmony export */ });
/**
 * Common utilities
 * @module glMatrix
 */
// Configuration Constants
var EPSILON = 0.000001;
var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
var RANDOM = Math.random;
/**
 * Sets the type of array used when creating new vectors and matrices
 *
 * @param {Float32ArrayConstructor | ArrayConstructor} type Array type, such as Float32Array or Array
 */

function setMatrixArrayType(type) {
  ARRAY_TYPE = type;
}
var degree = Math.PI / 180;
/**
 * Convert Degree To Radian
 *
 * @param {Number} a Angle in Degrees
 */

function toRadian(a) {
  return a * degree;
}
/**
 * Tests whether or not the arguments have approximately the same value, within an absolute
 * or relative tolerance of glMatrix.EPSILON (an absolute tolerance is used for values less
 * than or equal to 1.0, and a relative tolerance is used for larger values)
 *
 * @param {Number} a The first number to test.
 * @param {Number} b The second number to test.
 * @returns {Boolean} True if the numbers are approximately equal, false otherwise.
 */

function equals(a, b) {
  return Math.abs(a - b) <= EPSILON * Math.max(1.0, Math.abs(a), Math.abs(b));
}
if (!Math.hypot) Math.hypot = function () {
  var y = 0,
      i = arguments.length;

  while (i--) {
    y += arguments[i] * arguments[i];
  }

  return Math.sqrt(y);
};

/***/ }),

/***/ "./node_modules/gl-matrix/esm/index.js":
/*!*********************************************!*\
  !*** ./node_modules/gl-matrix/esm/index.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   glMatrix: () => (/* reexport module object */ _common_js__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   mat2: () => (/* reexport module object */ _mat2_js__WEBPACK_IMPORTED_MODULE_1__),
/* harmony export */   mat2d: () => (/* reexport module object */ _mat2d_js__WEBPACK_IMPORTED_MODULE_2__),
/* harmony export */   mat3: () => (/* reexport module object */ _mat3_js__WEBPACK_IMPORTED_MODULE_3__),
/* harmony export */   mat4: () => (/* reexport module object */ _mat4_js__WEBPACK_IMPORTED_MODULE_4__),
/* harmony export */   quat: () => (/* reexport module object */ _quat_js__WEBPACK_IMPORTED_MODULE_5__),
/* harmony export */   quat2: () => (/* reexport module object */ _quat2_js__WEBPACK_IMPORTED_MODULE_6__),
/* harmony export */   vec2: () => (/* reexport module object */ _vec2_js__WEBPACK_IMPORTED_MODULE_7__),
/* harmony export */   vec3: () => (/* reexport module object */ _vec3_js__WEBPACK_IMPORTED_MODULE_8__),
/* harmony export */   vec4: () => (/* reexport module object */ _vec4_js__WEBPACK_IMPORTED_MODULE_9__)
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common.js */ "./node_modules/gl-matrix/esm/common.js");
/* harmony import */ var _mat2_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mat2.js */ "./node_modules/gl-matrix/esm/mat2.js");
/* harmony import */ var _mat2d_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./mat2d.js */ "./node_modules/gl-matrix/esm/mat2d.js");
/* harmony import */ var _mat3_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./mat3.js */ "./node_modules/gl-matrix/esm/mat3.js");
/* harmony import */ var _mat4_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./mat4.js */ "./node_modules/gl-matrix/esm/mat4.js");
/* harmony import */ var _quat_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./quat.js */ "./node_modules/gl-matrix/esm/quat.js");
/* harmony import */ var _quat2_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./quat2.js */ "./node_modules/gl-matrix/esm/quat2.js");
/* harmony import */ var _vec2_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./vec2.js */ "./node_modules/gl-matrix/esm/vec2.js");
/* harmony import */ var _vec3_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./vec3.js */ "./node_modules/gl-matrix/esm/vec3.js");
/* harmony import */ var _vec4_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./vec4.js */ "./node_modules/gl-matrix/esm/vec4.js");












/***/ }),

/***/ "./node_modules/gl-matrix/esm/mat2.js":
/*!********************************************!*\
  !*** ./node_modules/gl-matrix/esm/mat2.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LDU: () => (/* binding */ LDU),
/* harmony export */   add: () => (/* binding */ add),
/* harmony export */   adjoint: () => (/* binding */ adjoint),
/* harmony export */   clone: () => (/* binding */ clone),
/* harmony export */   copy: () => (/* binding */ copy),
/* harmony export */   create: () => (/* binding */ create),
/* harmony export */   determinant: () => (/* binding */ determinant),
/* harmony export */   equals: () => (/* binding */ equals),
/* harmony export */   exactEquals: () => (/* binding */ exactEquals),
/* harmony export */   frob: () => (/* binding */ frob),
/* harmony export */   fromRotation: () => (/* binding */ fromRotation),
/* harmony export */   fromScaling: () => (/* binding */ fromScaling),
/* harmony export */   fromValues: () => (/* binding */ fromValues),
/* harmony export */   identity: () => (/* binding */ identity),
/* harmony export */   invert: () => (/* binding */ invert),
/* harmony export */   mul: () => (/* binding */ mul),
/* harmony export */   multiply: () => (/* binding */ multiply),
/* harmony export */   multiplyScalar: () => (/* binding */ multiplyScalar),
/* harmony export */   multiplyScalarAndAdd: () => (/* binding */ multiplyScalarAndAdd),
/* harmony export */   rotate: () => (/* binding */ rotate),
/* harmony export */   scale: () => (/* binding */ scale),
/* harmony export */   set: () => (/* binding */ set),
/* harmony export */   str: () => (/* binding */ str),
/* harmony export */   sub: () => (/* binding */ sub),
/* harmony export */   subtract: () => (/* binding */ subtract),
/* harmony export */   transpose: () => (/* binding */ transpose)
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common.js */ "./node_modules/gl-matrix/esm/common.js");

/**
 * 2x2 Matrix
 * @module mat2
 */

/**
 * Creates a new identity mat2
 *
 * @returns {mat2} a new 2x2 matrix
 */

function create() {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(4);

  if (_common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
  }

  out[0] = 1;
  out[3] = 1;
  return out;
}
/**
 * Creates a new mat2 initialized with values from an existing matrix
 *
 * @param {ReadonlyMat2} a matrix to clone
 * @returns {mat2} a new 2x2 matrix
 */

function clone(a) {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(4);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}
/**
 * Copy the values from one mat2 to another
 *
 * @param {mat2} out the receiving matrix
 * @param {ReadonlyMat2} a the source matrix
 * @returns {mat2} out
 */

function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}
/**
 * Set a mat2 to the identity matrix
 *
 * @param {mat2} out the receiving matrix
 * @returns {mat2} out
 */

function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  return out;
}
/**
 * Create a new mat2 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m10 Component in column 1, row 0 position (index 2)
 * @param {Number} m11 Component in column 1, row 1 position (index 3)
 * @returns {mat2} out A new 2x2 matrix
 */

function fromValues(m00, m01, m10, m11) {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(4);
  out[0] = m00;
  out[1] = m01;
  out[2] = m10;
  out[3] = m11;
  return out;
}
/**
 * Set the components of a mat2 to the given values
 *
 * @param {mat2} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m10 Component in column 1, row 0 position (index 2)
 * @param {Number} m11 Component in column 1, row 1 position (index 3)
 * @returns {mat2} out
 */

function set(out, m00, m01, m10, m11) {
  out[0] = m00;
  out[1] = m01;
  out[2] = m10;
  out[3] = m11;
  return out;
}
/**
 * Transpose the values of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {ReadonlyMat2} a the source matrix
 * @returns {mat2} out
 */

function transpose(out, a) {
  // If we are transposing ourselves we can skip a few steps but have to cache
  // some values
  if (out === a) {
    var a1 = a[1];
    out[1] = a[2];
    out[2] = a1;
  } else {
    out[0] = a[0];
    out[1] = a[2];
    out[2] = a[1];
    out[3] = a[3];
  }

  return out;
}
/**
 * Inverts a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {ReadonlyMat2} a the source matrix
 * @returns {mat2} out
 */

function invert(out, a) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3]; // Calculate the determinant

  var det = a0 * a3 - a2 * a1;

  if (!det) {
    return null;
  }

  det = 1.0 / det;
  out[0] = a3 * det;
  out[1] = -a1 * det;
  out[2] = -a2 * det;
  out[3] = a0 * det;
  return out;
}
/**
 * Calculates the adjugate of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {ReadonlyMat2} a the source matrix
 * @returns {mat2} out
 */

function adjoint(out, a) {
  // Caching this value is nessecary if out == a
  var a0 = a[0];
  out[0] = a[3];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] = a0;
  return out;
}
/**
 * Calculates the determinant of a mat2
 *
 * @param {ReadonlyMat2} a the source matrix
 * @returns {Number} determinant of a
 */

function determinant(a) {
  return a[0] * a[3] - a[2] * a[1];
}
/**
 * Multiplies two mat2's
 *
 * @param {mat2} out the receiving matrix
 * @param {ReadonlyMat2} a the first operand
 * @param {ReadonlyMat2} b the second operand
 * @returns {mat2} out
 */

function multiply(out, a, b) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3];
  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];
  out[0] = a0 * b0 + a2 * b1;
  out[1] = a1 * b0 + a3 * b1;
  out[2] = a0 * b2 + a2 * b3;
  out[3] = a1 * b2 + a3 * b3;
  return out;
}
/**
 * Rotates a mat2 by the given angle
 *
 * @param {mat2} out the receiving matrix
 * @param {ReadonlyMat2} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2} out
 */

function rotate(out, a, rad) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3];
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  out[0] = a0 * c + a2 * s;
  out[1] = a1 * c + a3 * s;
  out[2] = a0 * -s + a2 * c;
  out[3] = a1 * -s + a3 * c;
  return out;
}
/**
 * Scales the mat2 by the dimensions in the given vec2
 *
 * @param {mat2} out the receiving matrix
 * @param {ReadonlyMat2} a the matrix to rotate
 * @param {ReadonlyVec2} v the vec2 to scale the matrix by
 * @returns {mat2} out
 **/

function scale(out, a, v) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3];
  var v0 = v[0],
      v1 = v[1];
  out[0] = a0 * v0;
  out[1] = a1 * v0;
  out[2] = a2 * v1;
  out[3] = a3 * v1;
  return out;
}
/**
 * Creates a matrix from a given angle
 * This is equivalent to (but much faster than):
 *
 *     mat2.identity(dest);
 *     mat2.rotate(dest, dest, rad);
 *
 * @param {mat2} out mat2 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2} out
 */

function fromRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  out[0] = c;
  out[1] = s;
  out[2] = -s;
  out[3] = c;
  return out;
}
/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat2.identity(dest);
 *     mat2.scale(dest, dest, vec);
 *
 * @param {mat2} out mat2 receiving operation result
 * @param {ReadonlyVec2} v Scaling vector
 * @returns {mat2} out
 */

function fromScaling(out, v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;
  out[3] = v[1];
  return out;
}
/**
 * Returns a string representation of a mat2
 *
 * @param {ReadonlyMat2} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */

function str(a) {
  return "mat2(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ")";
}
/**
 * Returns Frobenius norm of a mat2
 *
 * @param {ReadonlyMat2} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */

function frob(a) {
  return Math.hypot(a[0], a[1], a[2], a[3]);
}
/**
 * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing the input matrix
 * @param {ReadonlyMat2} L the lower triangular matrix
 * @param {ReadonlyMat2} D the diagonal matrix
 * @param {ReadonlyMat2} U the upper triangular matrix
 * @param {ReadonlyMat2} a the input matrix to factorize
 */

function LDU(L, D, U, a) {
  L[2] = a[2] / a[0];
  U[0] = a[0];
  U[1] = a[1];
  U[3] = a[3] - L[2] * U[1];
  return [L, D, U];
}
/**
 * Adds two mat2's
 *
 * @param {mat2} out the receiving matrix
 * @param {ReadonlyMat2} a the first operand
 * @param {ReadonlyMat2} b the second operand
 * @returns {mat2} out
 */

function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  return out;
}
/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat2} out the receiving matrix
 * @param {ReadonlyMat2} a the first operand
 * @param {ReadonlyMat2} b the second operand
 * @returns {mat2} out
 */

function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  return out;
}
/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {ReadonlyMat2} a The first matrix.
 * @param {ReadonlyMat2} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */

function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}
/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {ReadonlyMat2} a The first matrix.
 * @param {ReadonlyMat2} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */

function equals(a, b) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3];
  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];
  return Math.abs(a0 - b0) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3));
}
/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat2} out the receiving matrix
 * @param {ReadonlyMat2} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat2} out
 */

function multiplyScalar(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  return out;
}
/**
 * Adds two mat2's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat2} out the receiving vector
 * @param {ReadonlyMat2} a the first operand
 * @param {ReadonlyMat2} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat2} out
 */

function multiplyScalarAndAdd(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  out[2] = a[2] + b[2] * scale;
  out[3] = a[3] + b[3] * scale;
  return out;
}
/**
 * Alias for {@link mat2.multiply}
 * @function
 */

var mul = multiply;
/**
 * Alias for {@link mat2.subtract}
 * @function
 */

var sub = subtract;

/***/ }),

/***/ "./node_modules/gl-matrix/esm/mat2d.js":
/*!*********************************************!*\
  !*** ./node_modules/gl-matrix/esm/mat2d.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   add: () => (/* binding */ add),
/* harmony export */   clone: () => (/* binding */ clone),
/* harmony export */   copy: () => (/* binding */ copy),
/* harmony export */   create: () => (/* binding */ create),
/* harmony export */   determinant: () => (/* binding */ determinant),
/* harmony export */   equals: () => (/* binding */ equals),
/* harmony export */   exactEquals: () => (/* binding */ exactEquals),
/* harmony export */   frob: () => (/* binding */ frob),
/* harmony export */   fromRotation: () => (/* binding */ fromRotation),
/* harmony export */   fromScaling: () => (/* binding */ fromScaling),
/* harmony export */   fromTranslation: () => (/* binding */ fromTranslation),
/* harmony export */   fromValues: () => (/* binding */ fromValues),
/* harmony export */   identity: () => (/* binding */ identity),
/* harmony export */   invert: () => (/* binding */ invert),
/* harmony export */   mul: () => (/* binding */ mul),
/* harmony export */   multiply: () => (/* binding */ multiply),
/* harmony export */   multiplyScalar: () => (/* binding */ multiplyScalar),
/* harmony export */   multiplyScalarAndAdd: () => (/* binding */ multiplyScalarAndAdd),
/* harmony export */   rotate: () => (/* binding */ rotate),
/* harmony export */   scale: () => (/* binding */ scale),
/* harmony export */   set: () => (/* binding */ set),
/* harmony export */   str: () => (/* binding */ str),
/* harmony export */   sub: () => (/* binding */ sub),
/* harmony export */   subtract: () => (/* binding */ subtract),
/* harmony export */   translate: () => (/* binding */ translate)
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common.js */ "./node_modules/gl-matrix/esm/common.js");

/**
 * 2x3 Matrix
 * @module mat2d
 * @description
 * A mat2d contains six elements defined as:
 * <pre>
 * [a, b,
 *  c, d,
 *  tx, ty]
 * </pre>
 * This is a short form for the 3x3 matrix:
 * <pre>
 * [a, b, 0,
 *  c, d, 0,
 *  tx, ty, 1]
 * </pre>
 * The last column is ignored so the array is shorter and operations are faster.
 */

/**
 * Creates a new identity mat2d
 *
 * @returns {mat2d} a new 2x3 matrix
 */

function create() {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(6);

  if (_common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[4] = 0;
    out[5] = 0;
  }

  out[0] = 1;
  out[3] = 1;
  return out;
}
/**
 * Creates a new mat2d initialized with values from an existing matrix
 *
 * @param {ReadonlyMat2d} a matrix to clone
 * @returns {mat2d} a new 2x3 matrix
 */

function clone(a) {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(6);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  return out;
}
/**
 * Copy the values from one mat2d to another
 *
 * @param {mat2d} out the receiving matrix
 * @param {ReadonlyMat2d} a the source matrix
 * @returns {mat2d} out
 */

function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  return out;
}
/**
 * Set a mat2d to the identity matrix
 *
 * @param {mat2d} out the receiving matrix
 * @returns {mat2d} out
 */

function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  out[4] = 0;
  out[5] = 0;
  return out;
}
/**
 * Create a new mat2d with the given values
 *
 * @param {Number} a Component A (index 0)
 * @param {Number} b Component B (index 1)
 * @param {Number} c Component C (index 2)
 * @param {Number} d Component D (index 3)
 * @param {Number} tx Component TX (index 4)
 * @param {Number} ty Component TY (index 5)
 * @returns {mat2d} A new mat2d
 */

function fromValues(a, b, c, d, tx, ty) {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(6);
  out[0] = a;
  out[1] = b;
  out[2] = c;
  out[3] = d;
  out[4] = tx;
  out[5] = ty;
  return out;
}
/**
 * Set the components of a mat2d to the given values
 *
 * @param {mat2d} out the receiving matrix
 * @param {Number} a Component A (index 0)
 * @param {Number} b Component B (index 1)
 * @param {Number} c Component C (index 2)
 * @param {Number} d Component D (index 3)
 * @param {Number} tx Component TX (index 4)
 * @param {Number} ty Component TY (index 5)
 * @returns {mat2d} out
 */

function set(out, a, b, c, d, tx, ty) {
  out[0] = a;
  out[1] = b;
  out[2] = c;
  out[3] = d;
  out[4] = tx;
  out[5] = ty;
  return out;
}
/**
 * Inverts a mat2d
 *
 * @param {mat2d} out the receiving matrix
 * @param {ReadonlyMat2d} a the source matrix
 * @returns {mat2d} out
 */

function invert(out, a) {
  var aa = a[0],
      ab = a[1],
      ac = a[2],
      ad = a[3];
  var atx = a[4],
      aty = a[5];
  var det = aa * ad - ab * ac;

  if (!det) {
    return null;
  }

  det = 1.0 / det;
  out[0] = ad * det;
  out[1] = -ab * det;
  out[2] = -ac * det;
  out[3] = aa * det;
  out[4] = (ac * aty - ad * atx) * det;
  out[5] = (ab * atx - aa * aty) * det;
  return out;
}
/**
 * Calculates the determinant of a mat2d
 *
 * @param {ReadonlyMat2d} a the source matrix
 * @returns {Number} determinant of a
 */

function determinant(a) {
  return a[0] * a[3] - a[1] * a[2];
}
/**
 * Multiplies two mat2d's
 *
 * @param {mat2d} out the receiving matrix
 * @param {ReadonlyMat2d} a the first operand
 * @param {ReadonlyMat2d} b the second operand
 * @returns {mat2d} out
 */

function multiply(out, a, b) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3],
      a4 = a[4],
      a5 = a[5];
  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3],
      b4 = b[4],
      b5 = b[5];
  out[0] = a0 * b0 + a2 * b1;
  out[1] = a1 * b0 + a3 * b1;
  out[2] = a0 * b2 + a2 * b3;
  out[3] = a1 * b2 + a3 * b3;
  out[4] = a0 * b4 + a2 * b5 + a4;
  out[5] = a1 * b4 + a3 * b5 + a5;
  return out;
}
/**
 * Rotates a mat2d by the given angle
 *
 * @param {mat2d} out the receiving matrix
 * @param {ReadonlyMat2d} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2d} out
 */

function rotate(out, a, rad) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3],
      a4 = a[4],
      a5 = a[5];
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  out[0] = a0 * c + a2 * s;
  out[1] = a1 * c + a3 * s;
  out[2] = a0 * -s + a2 * c;
  out[3] = a1 * -s + a3 * c;
  out[4] = a4;
  out[5] = a5;
  return out;
}
/**
 * Scales the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {ReadonlyMat2d} a the matrix to translate
 * @param {ReadonlyVec2} v the vec2 to scale the matrix by
 * @returns {mat2d} out
 **/

function scale(out, a, v) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3],
      a4 = a[4],
      a5 = a[5];
  var v0 = v[0],
      v1 = v[1];
  out[0] = a0 * v0;
  out[1] = a1 * v0;
  out[2] = a2 * v1;
  out[3] = a3 * v1;
  out[4] = a4;
  out[5] = a5;
  return out;
}
/**
 * Translates the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {ReadonlyMat2d} a the matrix to translate
 * @param {ReadonlyVec2} v the vec2 to translate the matrix by
 * @returns {mat2d} out
 **/

function translate(out, a, v) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3],
      a4 = a[4],
      a5 = a[5];
  var v0 = v[0],
      v1 = v[1];
  out[0] = a0;
  out[1] = a1;
  out[2] = a2;
  out[3] = a3;
  out[4] = a0 * v0 + a2 * v1 + a4;
  out[5] = a1 * v0 + a3 * v1 + a5;
  return out;
}
/**
 * Creates a matrix from a given angle
 * This is equivalent to (but much faster than):
 *
 *     mat2d.identity(dest);
 *     mat2d.rotate(dest, dest, rad);
 *
 * @param {mat2d} out mat2d receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2d} out
 */

function fromRotation(out, rad) {
  var s = Math.sin(rad),
      c = Math.cos(rad);
  out[0] = c;
  out[1] = s;
  out[2] = -s;
  out[3] = c;
  out[4] = 0;
  out[5] = 0;
  return out;
}
/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat2d.identity(dest);
 *     mat2d.scale(dest, dest, vec);
 *
 * @param {mat2d} out mat2d receiving operation result
 * @param {ReadonlyVec2} v Scaling vector
 * @returns {mat2d} out
 */

function fromScaling(out, v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;
  out[3] = v[1];
  out[4] = 0;
  out[5] = 0;
  return out;
}
/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat2d.identity(dest);
 *     mat2d.translate(dest, dest, vec);
 *
 * @param {mat2d} out mat2d receiving operation result
 * @param {ReadonlyVec2} v Translation vector
 * @returns {mat2d} out
 */

function fromTranslation(out, v) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  out[4] = v[0];
  out[5] = v[1];
  return out;
}
/**
 * Returns a string representation of a mat2d
 *
 * @param {ReadonlyMat2d} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */

function str(a) {
  return "mat2d(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ")";
}
/**
 * Returns Frobenius norm of a mat2d
 *
 * @param {ReadonlyMat2d} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */

function frob(a) {
  return Math.hypot(a[0], a[1], a[2], a[3], a[4], a[5], 1);
}
/**
 * Adds two mat2d's
 *
 * @param {mat2d} out the receiving matrix
 * @param {ReadonlyMat2d} a the first operand
 * @param {ReadonlyMat2d} b the second operand
 * @returns {mat2d} out
 */

function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  out[4] = a[4] + b[4];
  out[5] = a[5] + b[5];
  return out;
}
/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat2d} out the receiving matrix
 * @param {ReadonlyMat2d} a the first operand
 * @param {ReadonlyMat2d} b the second operand
 * @returns {mat2d} out
 */

function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  out[4] = a[4] - b[4];
  out[5] = a[5] - b[5];
  return out;
}
/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat2d} out the receiving matrix
 * @param {ReadonlyMat2d} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat2d} out
 */

function multiplyScalar(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  out[4] = a[4] * b;
  out[5] = a[5] * b;
  return out;
}
/**
 * Adds two mat2d's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat2d} out the receiving vector
 * @param {ReadonlyMat2d} a the first operand
 * @param {ReadonlyMat2d} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat2d} out
 */

function multiplyScalarAndAdd(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  out[2] = a[2] + b[2] * scale;
  out[3] = a[3] + b[3] * scale;
  out[4] = a[4] + b[4] * scale;
  out[5] = a[5] + b[5] * scale;
  return out;
}
/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {ReadonlyMat2d} a The first matrix.
 * @param {ReadonlyMat2d} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */

function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5];
}
/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {ReadonlyMat2d} a The first matrix.
 * @param {ReadonlyMat2d} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */

function equals(a, b) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3],
      a4 = a[4],
      a5 = a[5];
  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3],
      b4 = b[4],
      b5 = b[5];
  return Math.abs(a0 - b0) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5));
}
/**
 * Alias for {@link mat2d.multiply}
 * @function
 */

var mul = multiply;
/**
 * Alias for {@link mat2d.subtract}
 * @function
 */

var sub = subtract;

/***/ }),

/***/ "./node_modules/gl-matrix/esm/mat3.js":
/*!********************************************!*\
  !*** ./node_modules/gl-matrix/esm/mat3.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   add: () => (/* binding */ add),
/* harmony export */   adjoint: () => (/* binding */ adjoint),
/* harmony export */   clone: () => (/* binding */ clone),
/* harmony export */   copy: () => (/* binding */ copy),
/* harmony export */   create: () => (/* binding */ create),
/* harmony export */   determinant: () => (/* binding */ determinant),
/* harmony export */   equals: () => (/* binding */ equals),
/* harmony export */   exactEquals: () => (/* binding */ exactEquals),
/* harmony export */   frob: () => (/* binding */ frob),
/* harmony export */   fromMat2d: () => (/* binding */ fromMat2d),
/* harmony export */   fromMat4: () => (/* binding */ fromMat4),
/* harmony export */   fromQuat: () => (/* binding */ fromQuat),
/* harmony export */   fromRotation: () => (/* binding */ fromRotation),
/* harmony export */   fromScaling: () => (/* binding */ fromScaling),
/* harmony export */   fromTranslation: () => (/* binding */ fromTranslation),
/* harmony export */   fromValues: () => (/* binding */ fromValues),
/* harmony export */   identity: () => (/* binding */ identity),
/* harmony export */   invert: () => (/* binding */ invert),
/* harmony export */   mul: () => (/* binding */ mul),
/* harmony export */   multiply: () => (/* binding */ multiply),
/* harmony export */   multiplyScalar: () => (/* binding */ multiplyScalar),
/* harmony export */   multiplyScalarAndAdd: () => (/* binding */ multiplyScalarAndAdd),
/* harmony export */   normalFromMat4: () => (/* binding */ normalFromMat4),
/* harmony export */   projection: () => (/* binding */ projection),
/* harmony export */   rotate: () => (/* binding */ rotate),
/* harmony export */   scale: () => (/* binding */ scale),
/* harmony export */   set: () => (/* binding */ set),
/* harmony export */   str: () => (/* binding */ str),
/* harmony export */   sub: () => (/* binding */ sub),
/* harmony export */   subtract: () => (/* binding */ subtract),
/* harmony export */   translate: () => (/* binding */ translate),
/* harmony export */   transpose: () => (/* binding */ transpose)
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common.js */ "./node_modules/gl-matrix/esm/common.js");

/**
 * 3x3 Matrix
 * @module mat3
 */

/**
 * Creates a new identity mat3
 *
 * @returns {mat3} a new 3x3 matrix
 */

function create() {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(9);

  if (_common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
  }

  out[0] = 1;
  out[4] = 1;
  out[8] = 1;
  return out;
}
/**
 * Copies the upper-left 3x3 values into the given mat3.
 *
 * @param {mat3} out the receiving 3x3 matrix
 * @param {ReadonlyMat4} a   the source 4x4 matrix
 * @returns {mat3} out
 */

function fromMat4(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[4];
  out[4] = a[5];
  out[5] = a[6];
  out[6] = a[8];
  out[7] = a[9];
  out[8] = a[10];
  return out;
}
/**
 * Creates a new mat3 initialized with values from an existing matrix
 *
 * @param {ReadonlyMat3} a matrix to clone
 * @returns {mat3} a new 3x3 matrix
 */

function clone(a) {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(9);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  return out;
}
/**
 * Copy the values from one mat3 to another
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the source matrix
 * @returns {mat3} out
 */

function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  return out;
}
/**
 * Create a new mat3 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m10 Component in column 1, row 0 position (index 3)
 * @param {Number} m11 Component in column 1, row 1 position (index 4)
 * @param {Number} m12 Component in column 1, row 2 position (index 5)
 * @param {Number} m20 Component in column 2, row 0 position (index 6)
 * @param {Number} m21 Component in column 2, row 1 position (index 7)
 * @param {Number} m22 Component in column 2, row 2 position (index 8)
 * @returns {mat3} A new mat3
 */

function fromValues(m00, m01, m02, m10, m11, m12, m20, m21, m22) {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(9);
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m10;
  out[4] = m11;
  out[5] = m12;
  out[6] = m20;
  out[7] = m21;
  out[8] = m22;
  return out;
}
/**
 * Set the components of a mat3 to the given values
 *
 * @param {mat3} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m10 Component in column 1, row 0 position (index 3)
 * @param {Number} m11 Component in column 1, row 1 position (index 4)
 * @param {Number} m12 Component in column 1, row 2 position (index 5)
 * @param {Number} m20 Component in column 2, row 0 position (index 6)
 * @param {Number} m21 Component in column 2, row 1 position (index 7)
 * @param {Number} m22 Component in column 2, row 2 position (index 8)
 * @returns {mat3} out
 */

function set(out, m00, m01, m02, m10, m11, m12, m20, m21, m22) {
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m10;
  out[4] = m11;
  out[5] = m12;
  out[6] = m20;
  out[7] = m21;
  out[8] = m22;
  return out;
}
/**
 * Set a mat3 to the identity matrix
 *
 * @param {mat3} out the receiving matrix
 * @returns {mat3} out
 */

function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 1;
  out[5] = 0;
  out[6] = 0;
  out[7] = 0;
  out[8] = 1;
  return out;
}
/**
 * Transpose the values of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the source matrix
 * @returns {mat3} out
 */

function transpose(out, a) {
  // If we are transposing ourselves we can skip a few steps but have to cache some values
  if (out === a) {
    var a01 = a[1],
        a02 = a[2],
        a12 = a[5];
    out[1] = a[3];
    out[2] = a[6];
    out[3] = a01;
    out[5] = a[7];
    out[6] = a02;
    out[7] = a12;
  } else {
    out[0] = a[0];
    out[1] = a[3];
    out[2] = a[6];
    out[3] = a[1];
    out[4] = a[4];
    out[5] = a[7];
    out[6] = a[2];
    out[7] = a[5];
    out[8] = a[8];
  }

  return out;
}
/**
 * Inverts a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the source matrix
 * @returns {mat3} out
 */

function invert(out, a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2];
  var a10 = a[3],
      a11 = a[4],
      a12 = a[5];
  var a20 = a[6],
      a21 = a[7],
      a22 = a[8];
  var b01 = a22 * a11 - a12 * a21;
  var b11 = -a22 * a10 + a12 * a20;
  var b21 = a21 * a10 - a11 * a20; // Calculate the determinant

  var det = a00 * b01 + a01 * b11 + a02 * b21;

  if (!det) {
    return null;
  }

  det = 1.0 / det;
  out[0] = b01 * det;
  out[1] = (-a22 * a01 + a02 * a21) * det;
  out[2] = (a12 * a01 - a02 * a11) * det;
  out[3] = b11 * det;
  out[4] = (a22 * a00 - a02 * a20) * det;
  out[5] = (-a12 * a00 + a02 * a10) * det;
  out[6] = b21 * det;
  out[7] = (-a21 * a00 + a01 * a20) * det;
  out[8] = (a11 * a00 - a01 * a10) * det;
  return out;
}
/**
 * Calculates the adjugate of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the source matrix
 * @returns {mat3} out
 */

function adjoint(out, a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2];
  var a10 = a[3],
      a11 = a[4],
      a12 = a[5];
  var a20 = a[6],
      a21 = a[7],
      a22 = a[8];
  out[0] = a11 * a22 - a12 * a21;
  out[1] = a02 * a21 - a01 * a22;
  out[2] = a01 * a12 - a02 * a11;
  out[3] = a12 * a20 - a10 * a22;
  out[4] = a00 * a22 - a02 * a20;
  out[5] = a02 * a10 - a00 * a12;
  out[6] = a10 * a21 - a11 * a20;
  out[7] = a01 * a20 - a00 * a21;
  out[8] = a00 * a11 - a01 * a10;
  return out;
}
/**
 * Calculates the determinant of a mat3
 *
 * @param {ReadonlyMat3} a the source matrix
 * @returns {Number} determinant of a
 */

function determinant(a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2];
  var a10 = a[3],
      a11 = a[4],
      a12 = a[5];
  var a20 = a[6],
      a21 = a[7],
      a22 = a[8];
  return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
}
/**
 * Multiplies two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the first operand
 * @param {ReadonlyMat3} b the second operand
 * @returns {mat3} out
 */

function multiply(out, a, b) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2];
  var a10 = a[3],
      a11 = a[4],
      a12 = a[5];
  var a20 = a[6],
      a21 = a[7],
      a22 = a[8];
  var b00 = b[0],
      b01 = b[1],
      b02 = b[2];
  var b10 = b[3],
      b11 = b[4],
      b12 = b[5];
  var b20 = b[6],
      b21 = b[7],
      b22 = b[8];
  out[0] = b00 * a00 + b01 * a10 + b02 * a20;
  out[1] = b00 * a01 + b01 * a11 + b02 * a21;
  out[2] = b00 * a02 + b01 * a12 + b02 * a22;
  out[3] = b10 * a00 + b11 * a10 + b12 * a20;
  out[4] = b10 * a01 + b11 * a11 + b12 * a21;
  out[5] = b10 * a02 + b11 * a12 + b12 * a22;
  out[6] = b20 * a00 + b21 * a10 + b22 * a20;
  out[7] = b20 * a01 + b21 * a11 + b22 * a21;
  out[8] = b20 * a02 + b21 * a12 + b22 * a22;
  return out;
}
/**
 * Translate a mat3 by the given vector
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the matrix to translate
 * @param {ReadonlyVec2} v vector to translate by
 * @returns {mat3} out
 */

function translate(out, a, v) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a10 = a[3],
      a11 = a[4],
      a12 = a[5],
      a20 = a[6],
      a21 = a[7],
      a22 = a[8],
      x = v[0],
      y = v[1];
  out[0] = a00;
  out[1] = a01;
  out[2] = a02;
  out[3] = a10;
  out[4] = a11;
  out[5] = a12;
  out[6] = x * a00 + y * a10 + a20;
  out[7] = x * a01 + y * a11 + a21;
  out[8] = x * a02 + y * a12 + a22;
  return out;
}
/**
 * Rotates a mat3 by the given angle
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */

function rotate(out, a, rad) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a10 = a[3],
      a11 = a[4],
      a12 = a[5],
      a20 = a[6],
      a21 = a[7],
      a22 = a[8],
      s = Math.sin(rad),
      c = Math.cos(rad);
  out[0] = c * a00 + s * a10;
  out[1] = c * a01 + s * a11;
  out[2] = c * a02 + s * a12;
  out[3] = c * a10 - s * a00;
  out[4] = c * a11 - s * a01;
  out[5] = c * a12 - s * a02;
  out[6] = a20;
  out[7] = a21;
  out[8] = a22;
  return out;
}
/**
 * Scales the mat3 by the dimensions in the given vec2
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the matrix to rotate
 * @param {ReadonlyVec2} v the vec2 to scale the matrix by
 * @returns {mat3} out
 **/

function scale(out, a, v) {
  var x = v[0],
      y = v[1];
  out[0] = x * a[0];
  out[1] = x * a[1];
  out[2] = x * a[2];
  out[3] = y * a[3];
  out[4] = y * a[4];
  out[5] = y * a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  return out;
}
/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.translate(dest, dest, vec);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {ReadonlyVec2} v Translation vector
 * @returns {mat3} out
 */

function fromTranslation(out, v) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 1;
  out[5] = 0;
  out[6] = v[0];
  out[7] = v[1];
  out[8] = 1;
  return out;
}
/**
 * Creates a matrix from a given angle
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.rotate(dest, dest, rad);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */

function fromRotation(out, rad) {
  var s = Math.sin(rad),
      c = Math.cos(rad);
  out[0] = c;
  out[1] = s;
  out[2] = 0;
  out[3] = -s;
  out[4] = c;
  out[5] = 0;
  out[6] = 0;
  out[7] = 0;
  out[8] = 1;
  return out;
}
/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.scale(dest, dest, vec);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {ReadonlyVec2} v Scaling vector
 * @returns {mat3} out
 */

function fromScaling(out, v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = v[1];
  out[5] = 0;
  out[6] = 0;
  out[7] = 0;
  out[8] = 1;
  return out;
}
/**
 * Copies the values from a mat2d into a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat2d} a the matrix to copy
 * @returns {mat3} out
 **/

function fromMat2d(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = 0;
  out[3] = a[2];
  out[4] = a[3];
  out[5] = 0;
  out[6] = a[4];
  out[7] = a[5];
  out[8] = 1;
  return out;
}
/**
 * Calculates a 3x3 matrix from the given quaternion
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {ReadonlyQuat} q Quaternion to create matrix from
 *
 * @returns {mat3} out
 */

function fromQuat(out, q) {
  var x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var yx = y * x2;
  var yy = y * y2;
  var zx = z * x2;
  var zy = z * y2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  out[0] = 1 - yy - zz;
  out[3] = yx - wz;
  out[6] = zx + wy;
  out[1] = yx + wz;
  out[4] = 1 - xx - zz;
  out[7] = zy - wx;
  out[2] = zx - wy;
  out[5] = zy + wx;
  out[8] = 1 - xx - yy;
  return out;
}
/**
 * Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {ReadonlyMat4} a Mat4 to derive the normal matrix from
 *
 * @returns {mat3} out
 */

function normalFromMat4(out, a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];
  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

  var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det) {
    return null;
  }

  det = 1.0 / det;
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  return out;
}
/**
 * Generates a 2D projection matrix with the given bounds
 *
 * @param {mat3} out mat3 frustum matrix will be written into
 * @param {number} width Width of your gl context
 * @param {number} height Height of gl context
 * @returns {mat3} out
 */

function projection(out, width, height) {
  out[0] = 2 / width;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = -2 / height;
  out[5] = 0;
  out[6] = -1;
  out[7] = 1;
  out[8] = 1;
  return out;
}
/**
 * Returns a string representation of a mat3
 *
 * @param {ReadonlyMat3} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */

function str(a) {
  return "mat3(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + ")";
}
/**
 * Returns Frobenius norm of a mat3
 *
 * @param {ReadonlyMat3} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */

function frob(a) {
  return Math.hypot(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8]);
}
/**
 * Adds two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the first operand
 * @param {ReadonlyMat3} b the second operand
 * @returns {mat3} out
 */

function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  out[4] = a[4] + b[4];
  out[5] = a[5] + b[5];
  out[6] = a[6] + b[6];
  out[7] = a[7] + b[7];
  out[8] = a[8] + b[8];
  return out;
}
/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the first operand
 * @param {ReadonlyMat3} b the second operand
 * @returns {mat3} out
 */

function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  out[4] = a[4] - b[4];
  out[5] = a[5] - b[5];
  out[6] = a[6] - b[6];
  out[7] = a[7] - b[7];
  out[8] = a[8] - b[8];
  return out;
}
/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat3} out
 */

function multiplyScalar(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  out[4] = a[4] * b;
  out[5] = a[5] * b;
  out[6] = a[6] * b;
  out[7] = a[7] * b;
  out[8] = a[8] * b;
  return out;
}
/**
 * Adds two mat3's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat3} out the receiving vector
 * @param {ReadonlyMat3} a the first operand
 * @param {ReadonlyMat3} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat3} out
 */

function multiplyScalarAndAdd(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  out[2] = a[2] + b[2] * scale;
  out[3] = a[3] + b[3] * scale;
  out[4] = a[4] + b[4] * scale;
  out[5] = a[5] + b[5] * scale;
  out[6] = a[6] + b[6] * scale;
  out[7] = a[7] + b[7] * scale;
  out[8] = a[8] + b[8] * scale;
  return out;
}
/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {ReadonlyMat3} a The first matrix.
 * @param {ReadonlyMat3} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */

function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8];
}
/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {ReadonlyMat3} a The first matrix.
 * @param {ReadonlyMat3} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */

function equals(a, b) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3],
      a4 = a[4],
      a5 = a[5],
      a6 = a[6],
      a7 = a[7],
      a8 = a[8];
  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3],
      b4 = b[4],
      b5 = b[5],
      b6 = b[6],
      b7 = b[7],
      b8 = b[8];
  return Math.abs(a0 - b0) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a8), Math.abs(b8));
}
/**
 * Alias for {@link mat3.multiply}
 * @function
 */

var mul = multiply;
/**
 * Alias for {@link mat3.subtract}
 * @function
 */

var sub = subtract;

/***/ }),

/***/ "./node_modules/gl-matrix/esm/mat4.js":
/*!********************************************!*\
  !*** ./node_modules/gl-matrix/esm/mat4.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   add: () => (/* binding */ add),
/* harmony export */   adjoint: () => (/* binding */ adjoint),
/* harmony export */   clone: () => (/* binding */ clone),
/* harmony export */   copy: () => (/* binding */ copy),
/* harmony export */   create: () => (/* binding */ create),
/* harmony export */   determinant: () => (/* binding */ determinant),
/* harmony export */   equals: () => (/* binding */ equals),
/* harmony export */   exactEquals: () => (/* binding */ exactEquals),
/* harmony export */   frob: () => (/* binding */ frob),
/* harmony export */   fromQuat: () => (/* binding */ fromQuat),
/* harmony export */   fromQuat2: () => (/* binding */ fromQuat2),
/* harmony export */   fromRotation: () => (/* binding */ fromRotation),
/* harmony export */   fromRotationTranslation: () => (/* binding */ fromRotationTranslation),
/* harmony export */   fromRotationTranslationScale: () => (/* binding */ fromRotationTranslationScale),
/* harmony export */   fromRotationTranslationScaleOrigin: () => (/* binding */ fromRotationTranslationScaleOrigin),
/* harmony export */   fromScaling: () => (/* binding */ fromScaling),
/* harmony export */   fromTranslation: () => (/* binding */ fromTranslation),
/* harmony export */   fromValues: () => (/* binding */ fromValues),
/* harmony export */   fromXRotation: () => (/* binding */ fromXRotation),
/* harmony export */   fromYRotation: () => (/* binding */ fromYRotation),
/* harmony export */   fromZRotation: () => (/* binding */ fromZRotation),
/* harmony export */   frustum: () => (/* binding */ frustum),
/* harmony export */   getRotation: () => (/* binding */ getRotation),
/* harmony export */   getScaling: () => (/* binding */ getScaling),
/* harmony export */   getTranslation: () => (/* binding */ getTranslation),
/* harmony export */   identity: () => (/* binding */ identity),
/* harmony export */   invert: () => (/* binding */ invert),
/* harmony export */   lookAt: () => (/* binding */ lookAt),
/* harmony export */   mul: () => (/* binding */ mul),
/* harmony export */   multiply: () => (/* binding */ multiply),
/* harmony export */   multiplyScalar: () => (/* binding */ multiplyScalar),
/* harmony export */   multiplyScalarAndAdd: () => (/* binding */ multiplyScalarAndAdd),
/* harmony export */   ortho: () => (/* binding */ ortho),
/* harmony export */   orthoNO: () => (/* binding */ orthoNO),
/* harmony export */   orthoZO: () => (/* binding */ orthoZO),
/* harmony export */   perspective: () => (/* binding */ perspective),
/* harmony export */   perspectiveFromFieldOfView: () => (/* binding */ perspectiveFromFieldOfView),
/* harmony export */   perspectiveNO: () => (/* binding */ perspectiveNO),
/* harmony export */   perspectiveZO: () => (/* binding */ perspectiveZO),
/* harmony export */   rotate: () => (/* binding */ rotate),
/* harmony export */   rotateX: () => (/* binding */ rotateX),
/* harmony export */   rotateY: () => (/* binding */ rotateY),
/* harmony export */   rotateZ: () => (/* binding */ rotateZ),
/* harmony export */   scale: () => (/* binding */ scale),
/* harmony export */   set: () => (/* binding */ set),
/* harmony export */   str: () => (/* binding */ str),
/* harmony export */   sub: () => (/* binding */ sub),
/* harmony export */   subtract: () => (/* binding */ subtract),
/* harmony export */   targetTo: () => (/* binding */ targetTo),
/* harmony export */   translate: () => (/* binding */ translate),
/* harmony export */   transpose: () => (/* binding */ transpose)
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common.js */ "./node_modules/gl-matrix/esm/common.js");

/**
 * 4x4 Matrix<br>Format: column-major, when typed out it looks like row-major<br>The matrices are being post multiplied.
 * @module mat4
 */

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */

function create() {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(16);

  if (_common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
  }

  out[0] = 1;
  out[5] = 1;
  out[10] = 1;
  out[15] = 1;
  return out;
}
/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {ReadonlyMat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */

function clone(a) {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(16);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
/**
 * Copy the values from one mat4 to another
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the source matrix
 * @returns {mat4} out
 */

function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
/**
 * Create a new mat4 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m03 Component in column 0, row 3 position (index 3)
 * @param {Number} m10 Component in column 1, row 0 position (index 4)
 * @param {Number} m11 Component in column 1, row 1 position (index 5)
 * @param {Number} m12 Component in column 1, row 2 position (index 6)
 * @param {Number} m13 Component in column 1, row 3 position (index 7)
 * @param {Number} m20 Component in column 2, row 0 position (index 8)
 * @param {Number} m21 Component in column 2, row 1 position (index 9)
 * @param {Number} m22 Component in column 2, row 2 position (index 10)
 * @param {Number} m23 Component in column 2, row 3 position (index 11)
 * @param {Number} m30 Component in column 3, row 0 position (index 12)
 * @param {Number} m31 Component in column 3, row 1 position (index 13)
 * @param {Number} m32 Component in column 3, row 2 position (index 14)
 * @param {Number} m33 Component in column 3, row 3 position (index 15)
 * @returns {mat4} A new mat4
 */

function fromValues(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(16);
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m03;
  out[4] = m10;
  out[5] = m11;
  out[6] = m12;
  out[7] = m13;
  out[8] = m20;
  out[9] = m21;
  out[10] = m22;
  out[11] = m23;
  out[12] = m30;
  out[13] = m31;
  out[14] = m32;
  out[15] = m33;
  return out;
}
/**
 * Set the components of a mat4 to the given values
 *
 * @param {mat4} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m03 Component in column 0, row 3 position (index 3)
 * @param {Number} m10 Component in column 1, row 0 position (index 4)
 * @param {Number} m11 Component in column 1, row 1 position (index 5)
 * @param {Number} m12 Component in column 1, row 2 position (index 6)
 * @param {Number} m13 Component in column 1, row 3 position (index 7)
 * @param {Number} m20 Component in column 2, row 0 position (index 8)
 * @param {Number} m21 Component in column 2, row 1 position (index 9)
 * @param {Number} m22 Component in column 2, row 2 position (index 10)
 * @param {Number} m23 Component in column 2, row 3 position (index 11)
 * @param {Number} m30 Component in column 3, row 0 position (index 12)
 * @param {Number} m31 Component in column 3, row 1 position (index 13)
 * @param {Number} m32 Component in column 3, row 2 position (index 14)
 * @param {Number} m33 Component in column 3, row 3 position (index 15)
 * @returns {mat4} out
 */

function set(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m03;
  out[4] = m10;
  out[5] = m11;
  out[6] = m12;
  out[7] = m13;
  out[8] = m20;
  out[9] = m21;
  out[10] = m22;
  out[11] = m23;
  out[12] = m30;
  out[13] = m31;
  out[14] = m32;
  out[15] = m33;
  return out;
}
/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */

function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Transpose the values of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the source matrix
 * @returns {mat4} out
 */

function transpose(out, a) {
  // If we are transposing ourselves we can skip a few steps but have to cache some values
  if (out === a) {
    var a01 = a[1],
        a02 = a[2],
        a03 = a[3];
    var a12 = a[6],
        a13 = a[7];
    var a23 = a[11];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a01;
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a02;
    out[9] = a12;
    out[11] = a[14];
    out[12] = a03;
    out[13] = a13;
    out[14] = a23;
  } else {
    out[0] = a[0];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a[1];
    out[5] = a[5];
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a[2];
    out[9] = a[6];
    out[10] = a[10];
    out[11] = a[14];
    out[12] = a[3];
    out[13] = a[7];
    out[14] = a[11];
    out[15] = a[15];
  }

  return out;
}
/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the source matrix
 * @returns {mat4} out
 */

function invert(out, a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];
  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

  var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det) {
    return null;
  }

  det = 1.0 / det;
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
  return out;
}
/**
 * Calculates the adjugate of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the source matrix
 * @returns {mat4} out
 */

function adjoint(out, a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];
  out[0] = a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22);
  out[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
  out[2] = a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12);
  out[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
  out[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
  out[5] = a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22);
  out[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
  out[7] = a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12);
  out[8] = a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21);
  out[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
  out[10] = a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11);
  out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
  out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
  out[13] = a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21);
  out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
  out[15] = a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11);
  return out;
}
/**
 * Calculates the determinant of a mat4
 *
 * @param {ReadonlyMat4} a the source matrix
 * @returns {Number} determinant of a
 */

function determinant(a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];
  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

  return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
}
/**
 * Multiplies two mat4s
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the first operand
 * @param {ReadonlyMat4} b the second operand
 * @returns {mat4} out
 */

function multiply(out, a, b) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15]; // Cache only the current line of the second matrix

  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];
  out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[4];
  b1 = b[5];
  b2 = b[6];
  b3 = b[7];
  out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[8];
  b1 = b[9];
  b2 = b[10];
  b3 = b[11];
  out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[12];
  b1 = b[13];
  b2 = b[14];
  b3 = b[15];
  out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  return out;
}
/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to translate
 * @param {ReadonlyVec3} v vector to translate by
 * @returns {mat4} out
 */

function translate(out, a, v) {
  var x = v[0],
      y = v[1],
      z = v[2];
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;

  if (a === out) {
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
  } else {
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    out[0] = a00;
    out[1] = a01;
    out[2] = a02;
    out[3] = a03;
    out[4] = a10;
    out[5] = a11;
    out[6] = a12;
    out[7] = a13;
    out[8] = a20;
    out[9] = a21;
    out[10] = a22;
    out[11] = a23;
    out[12] = a00 * x + a10 * y + a20 * z + a[12];
    out[13] = a01 * x + a11 * y + a21 * z + a[13];
    out[14] = a02 * x + a12 * y + a22 * z + a[14];
    out[15] = a03 * x + a13 * y + a23 * z + a[15];
  }

  return out;
}
/**
 * Scales the mat4 by the dimensions in the given vec3 not using vectorization
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to scale
 * @param {ReadonlyVec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/

function scale(out, a, v) {
  var x = v[0],
      y = v[1],
      z = v[2];
  out[0] = a[0] * x;
  out[1] = a[1] * x;
  out[2] = a[2] * x;
  out[3] = a[3] * x;
  out[4] = a[4] * y;
  out[5] = a[5] * y;
  out[6] = a[6] * y;
  out[7] = a[7] * y;
  out[8] = a[8] * z;
  out[9] = a[9] * z;
  out[10] = a[10] * z;
  out[11] = a[11] * z;
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
/**
 * Rotates a mat4 by the given angle around the given axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {ReadonlyVec3} axis the axis to rotate around
 * @returns {mat4} out
 */

function rotate(out, a, rad, axis) {
  var x = axis[0],
      y = axis[1],
      z = axis[2];
  var len = Math.hypot(x, y, z);
  var s, c, t;
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;
  var b00, b01, b02;
  var b10, b11, b12;
  var b20, b21, b22;

  if (len < _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON) {
    return null;
  }

  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;
  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c;
  a00 = a[0];
  a01 = a[1];
  a02 = a[2];
  a03 = a[3];
  a10 = a[4];
  a11 = a[5];
  a12 = a[6];
  a13 = a[7];
  a20 = a[8];
  a21 = a[9];
  a22 = a[10];
  a23 = a[11]; // Construct the elements of the rotation matrix

  b00 = x * x * t + c;
  b01 = y * x * t + z * s;
  b02 = z * x * t - y * s;
  b10 = x * y * t - z * s;
  b11 = y * y * t + c;
  b12 = z * y * t + x * s;
  b20 = x * z * t + y * s;
  b21 = y * z * t - x * s;
  b22 = z * z * t + c; // Perform rotation-specific matrix multiplication

  out[0] = a00 * b00 + a10 * b01 + a20 * b02;
  out[1] = a01 * b00 + a11 * b01 + a21 * b02;
  out[2] = a02 * b00 + a12 * b01 + a22 * b02;
  out[3] = a03 * b00 + a13 * b01 + a23 * b02;
  out[4] = a00 * b10 + a10 * b11 + a20 * b12;
  out[5] = a01 * b10 + a11 * b11 + a21 * b12;
  out[6] = a02 * b10 + a12 * b11 + a22 * b12;
  out[7] = a03 * b10 + a13 * b11 + a23 * b12;
  out[8] = a00 * b20 + a10 * b21 + a20 * b22;
  out[9] = a01 * b20 + a11 * b21 + a21 * b22;
  out[10] = a02 * b20 + a12 * b21 + a22 * b22;
  out[11] = a03 * b20 + a13 * b21 + a23 * b22;

  if (a !== out) {
    // If the source and destination differ, copy the unchanged last row
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }

  return out;
}
/**
 * Rotates a matrix by the given angle around the X axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function rotateX(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a10 = a[4];
  var a11 = a[5];
  var a12 = a[6];
  var a13 = a[7];
  var a20 = a[8];
  var a21 = a[9];
  var a22 = a[10];
  var a23 = a[11];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged rows
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  } // Perform axis-specific matrix multiplication


  out[4] = a10 * c + a20 * s;
  out[5] = a11 * c + a21 * s;
  out[6] = a12 * c + a22 * s;
  out[7] = a13 * c + a23 * s;
  out[8] = a20 * c - a10 * s;
  out[9] = a21 * c - a11 * s;
  out[10] = a22 * c - a12 * s;
  out[11] = a23 * c - a13 * s;
  return out;
}
/**
 * Rotates a matrix by the given angle around the Y axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function rotateY(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a03 = a[3];
  var a20 = a[8];
  var a21 = a[9];
  var a22 = a[10];
  var a23 = a[11];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged rows
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  } // Perform axis-specific matrix multiplication


  out[0] = a00 * c - a20 * s;
  out[1] = a01 * c - a21 * s;
  out[2] = a02 * c - a22 * s;
  out[3] = a03 * c - a23 * s;
  out[8] = a00 * s + a20 * c;
  out[9] = a01 * s + a21 * c;
  out[10] = a02 * s + a22 * c;
  out[11] = a03 * s + a23 * c;
  return out;
}
/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function rotateZ(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a03 = a[3];
  var a10 = a[4];
  var a11 = a[5];
  var a12 = a[6];
  var a13 = a[7];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged last row
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  } // Perform axis-specific matrix multiplication


  out[0] = a00 * c + a10 * s;
  out[1] = a01 * c + a11 * s;
  out[2] = a02 * c + a12 * s;
  out[3] = a03 * c + a13 * s;
  out[4] = a10 * c - a00 * s;
  out[5] = a11 * c - a01 * s;
  out[6] = a12 * c - a02 * s;
  out[7] = a13 * c - a03 * s;
  return out;
}
/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {ReadonlyVec3} v Translation vector
 * @returns {mat4} out
 */

function fromTranslation(out, v) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.scale(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {ReadonlyVec3} v Scaling vector
 * @returns {mat4} out
 */

function fromScaling(out, v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = v[1];
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = v[2];
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from a given angle around a given axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotate(dest, dest, rad, axis);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @param {ReadonlyVec3} axis the axis to rotate around
 * @returns {mat4} out
 */

function fromRotation(out, rad, axis) {
  var x = axis[0],
      y = axis[1],
      z = axis[2];
  var len = Math.hypot(x, y, z);
  var s, c, t;

  if (len < _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON) {
    return null;
  }

  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;
  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c; // Perform rotation-specific matrix multiplication

  out[0] = x * x * t + c;
  out[1] = y * x * t + z * s;
  out[2] = z * x * t - y * s;
  out[3] = 0;
  out[4] = x * y * t - z * s;
  out[5] = y * y * t + c;
  out[6] = z * y * t + x * s;
  out[7] = 0;
  out[8] = x * z * t + y * s;
  out[9] = y * z * t - x * s;
  out[10] = z * z * t + c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from the given angle around the X axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateX(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function fromXRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad); // Perform axis-specific matrix multiplication

  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = c;
  out[6] = s;
  out[7] = 0;
  out[8] = 0;
  out[9] = -s;
  out[10] = c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from the given angle around the Y axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateY(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function fromYRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad); // Perform axis-specific matrix multiplication

  out[0] = c;
  out[1] = 0;
  out[2] = -s;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = s;
  out[9] = 0;
  out[10] = c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from the given angle around the Z axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateZ(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function fromZRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad); // Perform axis-specific matrix multiplication

  out[0] = c;
  out[1] = s;
  out[2] = 0;
  out[3] = 0;
  out[4] = -s;
  out[5] = c;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from a quaternion rotation and vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {ReadonlyVec3} v Translation vector
 * @returns {mat4} out
 */

function fromRotationTranslation(out, q, v) {
  // Quaternion math
  var x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  out[0] = 1 - (yy + zz);
  out[1] = xy + wz;
  out[2] = xz - wy;
  out[3] = 0;
  out[4] = xy - wz;
  out[5] = 1 - (xx + zz);
  out[6] = yz + wx;
  out[7] = 0;
  out[8] = xz + wy;
  out[9] = yz - wx;
  out[10] = 1 - (xx + yy);
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}
/**
 * Creates a new mat4 from a dual quat.
 *
 * @param {mat4} out Matrix
 * @param {ReadonlyQuat2} a Dual Quaternion
 * @returns {mat4} mat4 receiving operation result
 */

function fromQuat2(out, a) {
  var translation = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(3);
  var bx = -a[0],
      by = -a[1],
      bz = -a[2],
      bw = a[3],
      ax = a[4],
      ay = a[5],
      az = a[6],
      aw = a[7];
  var magnitude = bx * bx + by * by + bz * bz + bw * bw; //Only scale if it makes sense

  if (magnitude > 0) {
    translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2 / magnitude;
    translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2 / magnitude;
    translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2 / magnitude;
  } else {
    translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
    translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
    translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
  }

  fromRotationTranslation(out, a, translation);
  return out;
}
/**
 * Returns the translation vector component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslation,
 *  the returned vector will be the same as the translation vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive translation component
 * @param  {ReadonlyMat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */

function getTranslation(out, mat) {
  out[0] = mat[12];
  out[1] = mat[13];
  out[2] = mat[14];
  return out;
}
/**
 * Returns the scaling factor component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslationScale
 *  with a normalized Quaternion paramter, the returned vector will be
 *  the same as the scaling vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive scaling factor component
 * @param  {ReadonlyMat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */

function getScaling(out, mat) {
  var m11 = mat[0];
  var m12 = mat[1];
  var m13 = mat[2];
  var m21 = mat[4];
  var m22 = mat[5];
  var m23 = mat[6];
  var m31 = mat[8];
  var m32 = mat[9];
  var m33 = mat[10];
  out[0] = Math.hypot(m11, m12, m13);
  out[1] = Math.hypot(m21, m22, m23);
  out[2] = Math.hypot(m31, m32, m33);
  return out;
}
/**
 * Returns a quaternion representing the rotational component
 *  of a transformation matrix. If a matrix is built with
 *  fromRotationTranslation, the returned quaternion will be the
 *  same as the quaternion originally supplied.
 * @param {quat} out Quaternion to receive the rotation component
 * @param {ReadonlyMat4} mat Matrix to be decomposed (input)
 * @return {quat} out
 */

function getRotation(out, mat) {
  var scaling = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(3);
  getScaling(scaling, mat);
  var is1 = 1 / scaling[0];
  var is2 = 1 / scaling[1];
  var is3 = 1 / scaling[2];
  var sm11 = mat[0] * is1;
  var sm12 = mat[1] * is2;
  var sm13 = mat[2] * is3;
  var sm21 = mat[4] * is1;
  var sm22 = mat[5] * is2;
  var sm23 = mat[6] * is3;
  var sm31 = mat[8] * is1;
  var sm32 = mat[9] * is2;
  var sm33 = mat[10] * is3;
  var trace = sm11 + sm22 + sm33;
  var S = 0;

  if (trace > 0) {
    S = Math.sqrt(trace + 1.0) * 2;
    out[3] = 0.25 * S;
    out[0] = (sm23 - sm32) / S;
    out[1] = (sm31 - sm13) / S;
    out[2] = (sm12 - sm21) / S;
  } else if (sm11 > sm22 && sm11 > sm33) {
    S = Math.sqrt(1.0 + sm11 - sm22 - sm33) * 2;
    out[3] = (sm23 - sm32) / S;
    out[0] = 0.25 * S;
    out[1] = (sm12 + sm21) / S;
    out[2] = (sm31 + sm13) / S;
  } else if (sm22 > sm33) {
    S = Math.sqrt(1.0 + sm22 - sm11 - sm33) * 2;
    out[3] = (sm31 - sm13) / S;
    out[0] = (sm12 + sm21) / S;
    out[1] = 0.25 * S;
    out[2] = (sm23 + sm32) / S;
  } else {
    S = Math.sqrt(1.0 + sm33 - sm11 - sm22) * 2;
    out[3] = (sm12 - sm21) / S;
    out[0] = (sm31 + sm13) / S;
    out[1] = (sm23 + sm32) / S;
    out[2] = 0.25 * S;
  }

  return out;
}
/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {ReadonlyVec3} v Translation vector
 * @param {ReadonlyVec3} s Scaling vector
 * @returns {mat4} out
 */

function fromRotationTranslationScale(out, q, v, s) {
  // Quaternion math
  var x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  var sx = s[0];
  var sy = s[1];
  var sz = s[2];
  out[0] = (1 - (yy + zz)) * sx;
  out[1] = (xy + wz) * sx;
  out[2] = (xz - wy) * sx;
  out[3] = 0;
  out[4] = (xy - wz) * sy;
  out[5] = (1 - (xx + zz)) * sy;
  out[6] = (yz + wx) * sy;
  out[7] = 0;
  out[8] = (xz + wy) * sz;
  out[9] = (yz - wx) * sz;
  out[10] = (1 - (xx + yy)) * sz;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     mat4.translate(dest, origin);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *     mat4.translate(dest, negativeOrigin);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {ReadonlyVec3} v Translation vector
 * @param {ReadonlyVec3} s Scaling vector
 * @param {ReadonlyVec3} o The origin vector around which to scale and rotate
 * @returns {mat4} out
 */

function fromRotationTranslationScaleOrigin(out, q, v, s, o) {
  // Quaternion math
  var x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  var sx = s[0];
  var sy = s[1];
  var sz = s[2];
  var ox = o[0];
  var oy = o[1];
  var oz = o[2];
  var out0 = (1 - (yy + zz)) * sx;
  var out1 = (xy + wz) * sx;
  var out2 = (xz - wy) * sx;
  var out4 = (xy - wz) * sy;
  var out5 = (1 - (xx + zz)) * sy;
  var out6 = (yz + wx) * sy;
  var out8 = (xz + wy) * sz;
  var out9 = (yz - wx) * sz;
  var out10 = (1 - (xx + yy)) * sz;
  out[0] = out0;
  out[1] = out1;
  out[2] = out2;
  out[3] = 0;
  out[4] = out4;
  out[5] = out5;
  out[6] = out6;
  out[7] = 0;
  out[8] = out8;
  out[9] = out9;
  out[10] = out10;
  out[11] = 0;
  out[12] = v[0] + ox - (out0 * ox + out4 * oy + out8 * oz);
  out[13] = v[1] + oy - (out1 * ox + out5 * oy + out9 * oz);
  out[14] = v[2] + oz - (out2 * ox + out6 * oy + out10 * oz);
  out[15] = 1;
  return out;
}
/**
 * Calculates a 4x4 matrix from the given quaternion
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {ReadonlyQuat} q Quaternion to create matrix from
 *
 * @returns {mat4} out
 */

function fromQuat(out, q) {
  var x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var yx = y * x2;
  var yy = y * y2;
  var zx = z * x2;
  var zy = z * y2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  out[0] = 1 - yy - zz;
  out[1] = yx + wz;
  out[2] = zx - wy;
  out[3] = 0;
  out[4] = yx - wz;
  out[5] = 1 - xx - zz;
  out[6] = zy + wx;
  out[7] = 0;
  out[8] = zx + wy;
  out[9] = zy - wx;
  out[10] = 1 - xx - yy;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Generates a frustum matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Number} left Left bound of the frustum
 * @param {Number} right Right bound of the frustum
 * @param {Number} bottom Bottom bound of the frustum
 * @param {Number} top Top bound of the frustum
 * @param {Number} near Near bound of the frustum
 * @param {Number} far Far bound of the frustum
 * @returns {mat4} out
 */

function frustum(out, left, right, bottom, top, near, far) {
  var rl = 1 / (right - left);
  var tb = 1 / (top - bottom);
  var nf = 1 / (near - far);
  out[0] = near * 2 * rl;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = near * 2 * tb;
  out[6] = 0;
  out[7] = 0;
  out[8] = (right + left) * rl;
  out[9] = (top + bottom) * tb;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = far * near * 2 * nf;
  out[15] = 0;
  return out;
}
/**
 * Generates a perspective projection matrix with the given bounds.
 * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
 * which matches WebGL/OpenGL's clip volume.
 * Passing null/undefined/no value for far will generate infinite projection matrix.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum, can be null or Infinity
 * @returns {mat4} out
 */

function perspectiveNO(out, fovy, aspect, near, far) {
  var f = 1.0 / Math.tan(fovy / 2),
      nf;
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[15] = 0;

  if (far != null && far !== Infinity) {
    nf = 1 / (near - far);
    out[10] = (far + near) * nf;
    out[14] = 2 * far * near * nf;
  } else {
    out[10] = -1;
    out[14] = -2 * near;
  }

  return out;
}
/**
 * Alias for {@link mat4.perspectiveNO}
 * @function
 */

var perspective = perspectiveNO;
/**
 * Generates a perspective projection matrix suitable for WebGPU with the given bounds.
 * The near/far clip planes correspond to a normalized device coordinate Z range of [0, 1],
 * which matches WebGPU/Vulkan/DirectX/Metal's clip volume.
 * Passing null/undefined/no value for far will generate infinite projection matrix.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum, can be null or Infinity
 * @returns {mat4} out
 */

function perspectiveZO(out, fovy, aspect, near, far) {
  var f = 1.0 / Math.tan(fovy / 2),
      nf;
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[15] = 0;

  if (far != null && far !== Infinity) {
    nf = 1 / (near - far);
    out[10] = far * nf;
    out[14] = far * near * nf;
  } else {
    out[10] = -1;
    out[14] = -near;
  }

  return out;
}
/**
 * Generates a perspective projection matrix with the given field of view.
 * This is primarily useful for generating projection matrices to be used
 * with the still experiemental WebVR API.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Object} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */

function perspectiveFromFieldOfView(out, fov, near, far) {
  var upTan = Math.tan(fov.upDegrees * Math.PI / 180.0);
  var downTan = Math.tan(fov.downDegrees * Math.PI / 180.0);
  var leftTan = Math.tan(fov.leftDegrees * Math.PI / 180.0);
  var rightTan = Math.tan(fov.rightDegrees * Math.PI / 180.0);
  var xScale = 2.0 / (leftTan + rightTan);
  var yScale = 2.0 / (upTan + downTan);
  out[0] = xScale;
  out[1] = 0.0;
  out[2] = 0.0;
  out[3] = 0.0;
  out[4] = 0.0;
  out[5] = yScale;
  out[6] = 0.0;
  out[7] = 0.0;
  out[8] = -((leftTan - rightTan) * xScale * 0.5);
  out[9] = (upTan - downTan) * yScale * 0.5;
  out[10] = far / (near - far);
  out[11] = -1.0;
  out[12] = 0.0;
  out[13] = 0.0;
  out[14] = far * near / (near - far);
  out[15] = 0.0;
  return out;
}
/**
 * Generates a orthogonal projection matrix with the given bounds.
 * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
 * which matches WebGL/OpenGL's clip volume.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */

function orthoNO(out, left, right, bottom, top, near, far) {
  var lr = 1 / (left - right);
  var bt = 1 / (bottom - top);
  var nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = -2 * bt;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 2 * nf;
  out[11] = 0;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = (far + near) * nf;
  out[15] = 1;
  return out;
}
/**
 * Alias for {@link mat4.orthoNO}
 * @function
 */

var ortho = orthoNO;
/**
 * Generates a orthogonal projection matrix with the given bounds.
 * The near/far clip planes correspond to a normalized device coordinate Z range of [0, 1],
 * which matches WebGPU/Vulkan/DirectX/Metal's clip volume.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */

function orthoZO(out, left, right, bottom, top, near, far) {
  var lr = 1 / (left - right);
  var bt = 1 / (bottom - top);
  var nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = -2 * bt;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = nf;
  out[11] = 0;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = near * nf;
  out[15] = 1;
  return out;
}
/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis.
 * If you want a matrix that actually makes an object look at another object, you should use targetTo instead.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {ReadonlyVec3} eye Position of the viewer
 * @param {ReadonlyVec3} center Point the viewer is looking at
 * @param {ReadonlyVec3} up vec3 pointing up
 * @returns {mat4} out
 */

function lookAt(out, eye, center, up) {
  var x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
  var eyex = eye[0];
  var eyey = eye[1];
  var eyez = eye[2];
  var upx = up[0];
  var upy = up[1];
  var upz = up[2];
  var centerx = center[0];
  var centery = center[1];
  var centerz = center[2];

  if (Math.abs(eyex - centerx) < _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON && Math.abs(eyey - centery) < _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON && Math.abs(eyez - centerz) < _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON) {
    return identity(out);
  }

  z0 = eyex - centerx;
  z1 = eyey - centery;
  z2 = eyez - centerz;
  len = 1 / Math.hypot(z0, z1, z2);
  z0 *= len;
  z1 *= len;
  z2 *= len;
  x0 = upy * z2 - upz * z1;
  x1 = upz * z0 - upx * z2;
  x2 = upx * z1 - upy * z0;
  len = Math.hypot(x0, x1, x2);

  if (!len) {
    x0 = 0;
    x1 = 0;
    x2 = 0;
  } else {
    len = 1 / len;
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }

  y0 = z1 * x2 - z2 * x1;
  y1 = z2 * x0 - z0 * x2;
  y2 = z0 * x1 - z1 * x0;
  len = Math.hypot(y0, y1, y2);

  if (!len) {
    y0 = 0;
    y1 = 0;
    y2 = 0;
  } else {
    len = 1 / len;
    y0 *= len;
    y1 *= len;
    y2 *= len;
  }

  out[0] = x0;
  out[1] = y0;
  out[2] = z0;
  out[3] = 0;
  out[4] = x1;
  out[5] = y1;
  out[6] = z1;
  out[7] = 0;
  out[8] = x2;
  out[9] = y2;
  out[10] = z2;
  out[11] = 0;
  out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
  out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
  out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
  out[15] = 1;
  return out;
}
/**
 * Generates a matrix that makes something look at something else.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {ReadonlyVec3} eye Position of the viewer
 * @param {ReadonlyVec3} center Point the viewer is looking at
 * @param {ReadonlyVec3} up vec3 pointing up
 * @returns {mat4} out
 */

function targetTo(out, eye, target, up) {
  var eyex = eye[0],
      eyey = eye[1],
      eyez = eye[2],
      upx = up[0],
      upy = up[1],
      upz = up[2];
  var z0 = eyex - target[0],
      z1 = eyey - target[1],
      z2 = eyez - target[2];
  var len = z0 * z0 + z1 * z1 + z2 * z2;

  if (len > 0) {
    len = 1 / Math.sqrt(len);
    z0 *= len;
    z1 *= len;
    z2 *= len;
  }

  var x0 = upy * z2 - upz * z1,
      x1 = upz * z0 - upx * z2,
      x2 = upx * z1 - upy * z0;
  len = x0 * x0 + x1 * x1 + x2 * x2;

  if (len > 0) {
    len = 1 / Math.sqrt(len);
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }

  out[0] = x0;
  out[1] = x1;
  out[2] = x2;
  out[3] = 0;
  out[4] = z1 * x2 - z2 * x1;
  out[5] = z2 * x0 - z0 * x2;
  out[6] = z0 * x1 - z1 * x0;
  out[7] = 0;
  out[8] = z0;
  out[9] = z1;
  out[10] = z2;
  out[11] = 0;
  out[12] = eyex;
  out[13] = eyey;
  out[14] = eyez;
  out[15] = 1;
  return out;
}
/**
 * Returns a string representation of a mat4
 *
 * @param {ReadonlyMat4} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */

function str(a) {
  return "mat4(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + ", " + a[9] + ", " + a[10] + ", " + a[11] + ", " + a[12] + ", " + a[13] + ", " + a[14] + ", " + a[15] + ")";
}
/**
 * Returns Frobenius norm of a mat4
 *
 * @param {ReadonlyMat4} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */

function frob(a) {
  return Math.hypot(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10], a[11], a[12], a[13], a[14], a[15]);
}
/**
 * Adds two mat4's
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the first operand
 * @param {ReadonlyMat4} b the second operand
 * @returns {mat4} out
 */

function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  out[4] = a[4] + b[4];
  out[5] = a[5] + b[5];
  out[6] = a[6] + b[6];
  out[7] = a[7] + b[7];
  out[8] = a[8] + b[8];
  out[9] = a[9] + b[9];
  out[10] = a[10] + b[10];
  out[11] = a[11] + b[11];
  out[12] = a[12] + b[12];
  out[13] = a[13] + b[13];
  out[14] = a[14] + b[14];
  out[15] = a[15] + b[15];
  return out;
}
/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the first operand
 * @param {ReadonlyMat4} b the second operand
 * @returns {mat4} out
 */

function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  out[4] = a[4] - b[4];
  out[5] = a[5] - b[5];
  out[6] = a[6] - b[6];
  out[7] = a[7] - b[7];
  out[8] = a[8] - b[8];
  out[9] = a[9] - b[9];
  out[10] = a[10] - b[10];
  out[11] = a[11] - b[11];
  out[12] = a[12] - b[12];
  out[13] = a[13] - b[13];
  out[14] = a[14] - b[14];
  out[15] = a[15] - b[15];
  return out;
}
/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat4} out
 */

function multiplyScalar(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  out[4] = a[4] * b;
  out[5] = a[5] * b;
  out[6] = a[6] * b;
  out[7] = a[7] * b;
  out[8] = a[8] * b;
  out[9] = a[9] * b;
  out[10] = a[10] * b;
  out[11] = a[11] * b;
  out[12] = a[12] * b;
  out[13] = a[13] * b;
  out[14] = a[14] * b;
  out[15] = a[15] * b;
  return out;
}
/**
 * Adds two mat4's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat4} out the receiving vector
 * @param {ReadonlyMat4} a the first operand
 * @param {ReadonlyMat4} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat4} out
 */

function multiplyScalarAndAdd(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  out[2] = a[2] + b[2] * scale;
  out[3] = a[3] + b[3] * scale;
  out[4] = a[4] + b[4] * scale;
  out[5] = a[5] + b[5] * scale;
  out[6] = a[6] + b[6] * scale;
  out[7] = a[7] + b[7] * scale;
  out[8] = a[8] + b[8] * scale;
  out[9] = a[9] + b[9] * scale;
  out[10] = a[10] + b[10] * scale;
  out[11] = a[11] + b[11] * scale;
  out[12] = a[12] + b[12] * scale;
  out[13] = a[13] + b[13] * scale;
  out[14] = a[14] + b[14] * scale;
  out[15] = a[15] + b[15] * scale;
  return out;
}
/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {ReadonlyMat4} a The first matrix.
 * @param {ReadonlyMat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */

function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] && a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15];
}
/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {ReadonlyMat4} a The first matrix.
 * @param {ReadonlyMat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */

function equals(a, b) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3];
  var a4 = a[4],
      a5 = a[5],
      a6 = a[6],
      a7 = a[7];
  var a8 = a[8],
      a9 = a[9],
      a10 = a[10],
      a11 = a[11];
  var a12 = a[12],
      a13 = a[13],
      a14 = a[14],
      a15 = a[15];
  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];
  var b4 = b[4],
      b5 = b[5],
      b6 = b[6],
      b7 = b[7];
  var b8 = b[8],
      b9 = b[9],
      b10 = b[10],
      b11 = b[11];
  var b12 = b[12],
      b13 = b[13],
      b14 = b[14],
      b15 = b[15];
  return Math.abs(a0 - b0) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a8), Math.abs(b8)) && Math.abs(a9 - b9) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a9), Math.abs(b9)) && Math.abs(a10 - b10) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a10), Math.abs(b10)) && Math.abs(a11 - b11) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a11), Math.abs(b11)) && Math.abs(a12 - b12) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a12), Math.abs(b12)) && Math.abs(a13 - b13) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a13), Math.abs(b13)) && Math.abs(a14 - b14) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a14), Math.abs(b14)) && Math.abs(a15 - b15) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a15), Math.abs(b15));
}
/**
 * Alias for {@link mat4.multiply}
 * @function
 */

var mul = multiply;
/**
 * Alias for {@link mat4.subtract}
 * @function
 */

var sub = subtract;

/***/ }),

/***/ "./node_modules/gl-matrix/esm/quat.js":
/*!********************************************!*\
  !*** ./node_modules/gl-matrix/esm/quat.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   add: () => (/* binding */ add),
/* harmony export */   calculateW: () => (/* binding */ calculateW),
/* harmony export */   clone: () => (/* binding */ clone),
/* harmony export */   conjugate: () => (/* binding */ conjugate),
/* harmony export */   copy: () => (/* binding */ copy),
/* harmony export */   create: () => (/* binding */ create),
/* harmony export */   dot: () => (/* binding */ dot),
/* harmony export */   equals: () => (/* binding */ equals),
/* harmony export */   exactEquals: () => (/* binding */ exactEquals),
/* harmony export */   exp: () => (/* binding */ exp),
/* harmony export */   fromEuler: () => (/* binding */ fromEuler),
/* harmony export */   fromMat3: () => (/* binding */ fromMat3),
/* harmony export */   fromValues: () => (/* binding */ fromValues),
/* harmony export */   getAngle: () => (/* binding */ getAngle),
/* harmony export */   getAxisAngle: () => (/* binding */ getAxisAngle),
/* harmony export */   identity: () => (/* binding */ identity),
/* harmony export */   invert: () => (/* binding */ invert),
/* harmony export */   len: () => (/* binding */ len),
/* harmony export */   length: () => (/* binding */ length),
/* harmony export */   lerp: () => (/* binding */ lerp),
/* harmony export */   ln: () => (/* binding */ ln),
/* harmony export */   mul: () => (/* binding */ mul),
/* harmony export */   multiply: () => (/* binding */ multiply),
/* harmony export */   normalize: () => (/* binding */ normalize),
/* harmony export */   pow: () => (/* binding */ pow),
/* harmony export */   random: () => (/* binding */ random),
/* harmony export */   rotateX: () => (/* binding */ rotateX),
/* harmony export */   rotateY: () => (/* binding */ rotateY),
/* harmony export */   rotateZ: () => (/* binding */ rotateZ),
/* harmony export */   rotationTo: () => (/* binding */ rotationTo),
/* harmony export */   scale: () => (/* binding */ scale),
/* harmony export */   set: () => (/* binding */ set),
/* harmony export */   setAxes: () => (/* binding */ setAxes),
/* harmony export */   setAxisAngle: () => (/* binding */ setAxisAngle),
/* harmony export */   slerp: () => (/* binding */ slerp),
/* harmony export */   sqlerp: () => (/* binding */ sqlerp),
/* harmony export */   sqrLen: () => (/* binding */ sqrLen),
/* harmony export */   squaredLength: () => (/* binding */ squaredLength),
/* harmony export */   str: () => (/* binding */ str)
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common.js */ "./node_modules/gl-matrix/esm/common.js");
/* harmony import */ var _mat3_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mat3.js */ "./node_modules/gl-matrix/esm/mat3.js");
/* harmony import */ var _vec3_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./vec3.js */ "./node_modules/gl-matrix/esm/vec3.js");
/* harmony import */ var _vec4_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./vec4.js */ "./node_modules/gl-matrix/esm/vec4.js");




/**
 * Quaternion
 * @module quat
 */

/**
 * Creates a new identity quat
 *
 * @returns {quat} a new quaternion
 */

function create() {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(4);

  if (_common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }

  out[3] = 1;
  return out;
}
/**
 * Set a quat to the identity quaternion
 *
 * @param {quat} out the receiving quaternion
 * @returns {quat} out
 */

function identity(out) {
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  return out;
}
/**
 * Sets a quat from the given angle and rotation axis,
 * then returns it.
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyVec3} axis the axis around which to rotate
 * @param {Number} rad the angle in radians
 * @returns {quat} out
 **/

function setAxisAngle(out, axis, rad) {
  rad = rad * 0.5;
  var s = Math.sin(rad);
  out[0] = s * axis[0];
  out[1] = s * axis[1];
  out[2] = s * axis[2];
  out[3] = Math.cos(rad);
  return out;
}
/**
 * Gets the rotation axis and angle for a given
 *  quaternion. If a quaternion is created with
 *  setAxisAngle, this method will return the same
 *  values as providied in the original parameter list
 *  OR functionally equivalent values.
 * Example: The quaternion formed by axis [0, 0, 1] and
 *  angle -90 is the same as the quaternion formed by
 *  [0, 0, 1] and 270. This method favors the latter.
 * @param  {vec3} out_axis  Vector receiving the axis of rotation
 * @param  {ReadonlyQuat} q     Quaternion to be decomposed
 * @return {Number}     Angle, in radians, of the rotation
 */

function getAxisAngle(out_axis, q) {
  var rad = Math.acos(q[3]) * 2.0;
  var s = Math.sin(rad / 2.0);

  if (s > _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON) {
    out_axis[0] = q[0] / s;
    out_axis[1] = q[1] / s;
    out_axis[2] = q[2] / s;
  } else {
    // If s is zero, return any axis (no rotation - axis does not matter)
    out_axis[0] = 1;
    out_axis[1] = 0;
    out_axis[2] = 0;
  }

  return rad;
}
/**
 * Gets the angular distance between two unit quaternions
 *
 * @param  {ReadonlyQuat} a     Origin unit quaternion
 * @param  {ReadonlyQuat} b     Destination unit quaternion
 * @return {Number}     Angle, in radians, between the two quaternions
 */

function getAngle(a, b) {
  var dotproduct = dot(a, b);
  return Math.acos(2 * dotproduct * dotproduct - 1);
}
/**
 * Multiplies two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a the first operand
 * @param {ReadonlyQuat} b the second operand
 * @returns {quat} out
 */

function multiply(out, a, b) {
  var ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  var bx = b[0],
      by = b[1],
      bz = b[2],
      bw = b[3];
  out[0] = ax * bw + aw * bx + ay * bz - az * by;
  out[1] = ay * bw + aw * by + az * bx - ax * bz;
  out[2] = az * bw + aw * bz + ax * by - ay * bx;
  out[3] = aw * bw - ax * bx - ay * by - az * bz;
  return out;
}
/**
 * Rotates a quaternion by the given angle about the X axis
 *
 * @param {quat} out quat receiving operation result
 * @param {ReadonlyQuat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */

function rotateX(out, a, rad) {
  rad *= 0.5;
  var ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  var bx = Math.sin(rad),
      bw = Math.cos(rad);
  out[0] = ax * bw + aw * bx;
  out[1] = ay * bw + az * bx;
  out[2] = az * bw - ay * bx;
  out[3] = aw * bw - ax * bx;
  return out;
}
/**
 * Rotates a quaternion by the given angle about the Y axis
 *
 * @param {quat} out quat receiving operation result
 * @param {ReadonlyQuat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */

function rotateY(out, a, rad) {
  rad *= 0.5;
  var ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  var by = Math.sin(rad),
      bw = Math.cos(rad);
  out[0] = ax * bw - az * by;
  out[1] = ay * bw + aw * by;
  out[2] = az * bw + ax * by;
  out[3] = aw * bw - ay * by;
  return out;
}
/**
 * Rotates a quaternion by the given angle about the Z axis
 *
 * @param {quat} out quat receiving operation result
 * @param {ReadonlyQuat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */

function rotateZ(out, a, rad) {
  rad *= 0.5;
  var ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  var bz = Math.sin(rad),
      bw = Math.cos(rad);
  out[0] = ax * bw + ay * bz;
  out[1] = ay * bw - ax * bz;
  out[2] = az * bw + aw * bz;
  out[3] = aw * bw - az * bz;
  return out;
}
/**
 * Calculates the W component of a quat from the X, Y, and Z components.
 * Assumes that quaternion is 1 unit in length.
 * Any existing W component will be ignored.
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a quat to calculate W component of
 * @returns {quat} out
 */

function calculateW(out, a) {
  var x = a[0],
      y = a[1],
      z = a[2];
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
  return out;
}
/**
 * Calculate the exponential of a unit quaternion.
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a quat to calculate the exponential of
 * @returns {quat} out
 */

function exp(out, a) {
  var x = a[0],
      y = a[1],
      z = a[2],
      w = a[3];
  var r = Math.sqrt(x * x + y * y + z * z);
  var et = Math.exp(w);
  var s = r > 0 ? et * Math.sin(r) / r : 0;
  out[0] = x * s;
  out[1] = y * s;
  out[2] = z * s;
  out[3] = et * Math.cos(r);
  return out;
}
/**
 * Calculate the natural logarithm of a unit quaternion.
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a quat to calculate the exponential of
 * @returns {quat} out
 */

function ln(out, a) {
  var x = a[0],
      y = a[1],
      z = a[2],
      w = a[3];
  var r = Math.sqrt(x * x + y * y + z * z);
  var t = r > 0 ? Math.atan2(r, w) / r : 0;
  out[0] = x * t;
  out[1] = y * t;
  out[2] = z * t;
  out[3] = 0.5 * Math.log(x * x + y * y + z * z + w * w);
  return out;
}
/**
 * Calculate the scalar power of a unit quaternion.
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a quat to calculate the exponential of
 * @param {Number} b amount to scale the quaternion by
 * @returns {quat} out
 */

function pow(out, a, b) {
  ln(out, a);
  scale(out, out, b);
  exp(out, out);
  return out;
}
/**
 * Performs a spherical linear interpolation between two quat
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a the first operand
 * @param {ReadonlyQuat} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {quat} out
 */

function slerp(out, a, b, t) {
  // benchmarks:
  //    http://jsperf.com/quaternion-slerp-implementations
  var ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  var bx = b[0],
      by = b[1],
      bz = b[2],
      bw = b[3];
  var omega, cosom, sinom, scale0, scale1; // calc cosine

  cosom = ax * bx + ay * by + az * bz + aw * bw; // adjust signs (if necessary)

  if (cosom < 0.0) {
    cosom = -cosom;
    bx = -bx;
    by = -by;
    bz = -bz;
    bw = -bw;
  } // calculate coefficients


  if (1.0 - cosom > _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON) {
    // standard case (slerp)
    omega = Math.acos(cosom);
    sinom = Math.sin(omega);
    scale0 = Math.sin((1.0 - t) * omega) / sinom;
    scale1 = Math.sin(t * omega) / sinom;
  } else {
    // "from" and "to" quaternions are very close
    //  ... so we can do a linear interpolation
    scale0 = 1.0 - t;
    scale1 = t;
  } // calculate final values


  out[0] = scale0 * ax + scale1 * bx;
  out[1] = scale0 * ay + scale1 * by;
  out[2] = scale0 * az + scale1 * bz;
  out[3] = scale0 * aw + scale1 * bw;
  return out;
}
/**
 * Generates a random unit quaternion
 *
 * @param {quat} out the receiving quaternion
 * @returns {quat} out
 */

function random(out) {
  // Implementation of http://planning.cs.uiuc.edu/node198.html
  // TODO: Calling random 3 times is probably not the fastest solution
  var u1 = _common_js__WEBPACK_IMPORTED_MODULE_0__.RANDOM();
  var u2 = _common_js__WEBPACK_IMPORTED_MODULE_0__.RANDOM();
  var u3 = _common_js__WEBPACK_IMPORTED_MODULE_0__.RANDOM();
  var sqrt1MinusU1 = Math.sqrt(1 - u1);
  var sqrtU1 = Math.sqrt(u1);
  out[0] = sqrt1MinusU1 * Math.sin(2.0 * Math.PI * u2);
  out[1] = sqrt1MinusU1 * Math.cos(2.0 * Math.PI * u2);
  out[2] = sqrtU1 * Math.sin(2.0 * Math.PI * u3);
  out[3] = sqrtU1 * Math.cos(2.0 * Math.PI * u3);
  return out;
}
/**
 * Calculates the inverse of a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a quat to calculate inverse of
 * @returns {quat} out
 */

function invert(out, a) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3];
  var dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
  var invDot = dot ? 1.0 / dot : 0; // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

  out[0] = -a0 * invDot;
  out[1] = -a1 * invDot;
  out[2] = -a2 * invDot;
  out[3] = a3 * invDot;
  return out;
}
/**
 * Calculates the conjugate of a quat
 * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a quat to calculate conjugate of
 * @returns {quat} out
 */

function conjugate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] = a[3];
  return out;
}
/**
 * Creates a quaternion from the given 3x3 rotation matrix.
 *
 * NOTE: The resultant quaternion is not normalized, so you should be sure
 * to renormalize the quaternion yourself where necessary.
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyMat3} m rotation matrix
 * @returns {quat} out
 * @function
 */

function fromMat3(out, m) {
  // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
  // article "Quaternion Calculus and Fast Animation".
  var fTrace = m[0] + m[4] + m[8];
  var fRoot;

  if (fTrace > 0.0) {
    // |w| > 1/2, may as well choose w > 1/2
    fRoot = Math.sqrt(fTrace + 1.0); // 2w

    out[3] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot; // 1/(4w)

    out[0] = (m[5] - m[7]) * fRoot;
    out[1] = (m[6] - m[2]) * fRoot;
    out[2] = (m[1] - m[3]) * fRoot;
  } else {
    // |w| <= 1/2
    var i = 0;
    if (m[4] > m[0]) i = 1;
    if (m[8] > m[i * 3 + i]) i = 2;
    var j = (i + 1) % 3;
    var k = (i + 2) % 3;
    fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1.0);
    out[i] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot;
    out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
    out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
    out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
  }

  return out;
}
/**
 * Creates a quaternion from the given euler angle x, y, z.
 *
 * @param {quat} out the receiving quaternion
 * @param {x} Angle to rotate around X axis in degrees.
 * @param {y} Angle to rotate around Y axis in degrees.
 * @param {z} Angle to rotate around Z axis in degrees.
 * @returns {quat} out
 * @function
 */

function fromEuler(out, x, y, z) {
  var halfToRad = 0.5 * Math.PI / 180.0;
  x *= halfToRad;
  y *= halfToRad;
  z *= halfToRad;
  var sx = Math.sin(x);
  var cx = Math.cos(x);
  var sy = Math.sin(y);
  var cy = Math.cos(y);
  var sz = Math.sin(z);
  var cz = Math.cos(z);
  out[0] = sx * cy * cz - cx * sy * sz;
  out[1] = cx * sy * cz + sx * cy * sz;
  out[2] = cx * cy * sz - sx * sy * cz;
  out[3] = cx * cy * cz + sx * sy * sz;
  return out;
}
/**
 * Returns a string representation of a quatenion
 *
 * @param {ReadonlyQuat} a vector to represent as a string
 * @returns {String} string representation of the vector
 */

function str(a) {
  return "quat(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ")";
}
/**
 * Creates a new quat initialized with values from an existing quaternion
 *
 * @param {ReadonlyQuat} a quaternion to clone
 * @returns {quat} a new quaternion
 * @function
 */

var clone = _vec4_js__WEBPACK_IMPORTED_MODULE_3__.clone;
/**
 * Creates a new quat initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} a new quaternion
 * @function
 */

var fromValues = _vec4_js__WEBPACK_IMPORTED_MODULE_3__.fromValues;
/**
 * Copy the values from one quat to another
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a the source quaternion
 * @returns {quat} out
 * @function
 */

var copy = _vec4_js__WEBPACK_IMPORTED_MODULE_3__.copy;
/**
 * Set the components of a quat to the given values
 *
 * @param {quat} out the receiving quaternion
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} out
 * @function
 */

var set = _vec4_js__WEBPACK_IMPORTED_MODULE_3__.set;
/**
 * Adds two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a the first operand
 * @param {ReadonlyQuat} b the second operand
 * @returns {quat} out
 * @function
 */

var add = _vec4_js__WEBPACK_IMPORTED_MODULE_3__.add;
/**
 * Alias for {@link quat.multiply}
 * @function
 */

var mul = multiply;
/**
 * Scales a quat by a scalar number
 *
 * @param {quat} out the receiving vector
 * @param {ReadonlyQuat} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {quat} out
 * @function
 */

var scale = _vec4_js__WEBPACK_IMPORTED_MODULE_3__.scale;
/**
 * Calculates the dot product of two quat's
 *
 * @param {ReadonlyQuat} a the first operand
 * @param {ReadonlyQuat} b the second operand
 * @returns {Number} dot product of a and b
 * @function
 */

var dot = _vec4_js__WEBPACK_IMPORTED_MODULE_3__.dot;
/**
 * Performs a linear interpolation between two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a the first operand
 * @param {ReadonlyQuat} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {quat} out
 * @function
 */

var lerp = _vec4_js__WEBPACK_IMPORTED_MODULE_3__.lerp;
/**
 * Calculates the length of a quat
 *
 * @param {ReadonlyQuat} a vector to calculate length of
 * @returns {Number} length of a
 */

var length = _vec4_js__WEBPACK_IMPORTED_MODULE_3__.length;
/**
 * Alias for {@link quat.length}
 * @function
 */

var len = length;
/**
 * Calculates the squared length of a quat
 *
 * @param {ReadonlyQuat} a vector to calculate squared length of
 * @returns {Number} squared length of a
 * @function
 */

var squaredLength = _vec4_js__WEBPACK_IMPORTED_MODULE_3__.squaredLength;
/**
 * Alias for {@link quat.squaredLength}
 * @function
 */

var sqrLen = squaredLength;
/**
 * Normalize a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a quaternion to normalize
 * @returns {quat} out
 * @function
 */

var normalize = _vec4_js__WEBPACK_IMPORTED_MODULE_3__.normalize;
/**
 * Returns whether or not the quaternions have exactly the same elements in the same position (when compared with ===)
 *
 * @param {ReadonlyQuat} a The first quaternion.
 * @param {ReadonlyQuat} b The second quaternion.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

var exactEquals = _vec4_js__WEBPACK_IMPORTED_MODULE_3__.exactEquals;
/**
 * Returns whether or not the quaternions have approximately the same elements in the same position.
 *
 * @param {ReadonlyQuat} a The first vector.
 * @param {ReadonlyQuat} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

var equals = _vec4_js__WEBPACK_IMPORTED_MODULE_3__.equals;
/**
 * Sets a quaternion to represent the shortest rotation from one
 * vector to another.
 *
 * Both vectors are assumed to be unit length.
 *
 * @param {quat} out the receiving quaternion.
 * @param {ReadonlyVec3} a the initial vector
 * @param {ReadonlyVec3} b the destination vector
 * @returns {quat} out
 */

var rotationTo = function () {
  var tmpvec3 = _vec3_js__WEBPACK_IMPORTED_MODULE_2__.create();
  var xUnitVec3 = _vec3_js__WEBPACK_IMPORTED_MODULE_2__.fromValues(1, 0, 0);
  var yUnitVec3 = _vec3_js__WEBPACK_IMPORTED_MODULE_2__.fromValues(0, 1, 0);
  return function (out, a, b) {
    var dot = _vec3_js__WEBPACK_IMPORTED_MODULE_2__.dot(a, b);

    if (dot < -0.999999) {
      _vec3_js__WEBPACK_IMPORTED_MODULE_2__.cross(tmpvec3, xUnitVec3, a);
      if (_vec3_js__WEBPACK_IMPORTED_MODULE_2__.len(tmpvec3) < 0.000001) _vec3_js__WEBPACK_IMPORTED_MODULE_2__.cross(tmpvec3, yUnitVec3, a);
      _vec3_js__WEBPACK_IMPORTED_MODULE_2__.normalize(tmpvec3, tmpvec3);
      setAxisAngle(out, tmpvec3, Math.PI);
      return out;
    } else if (dot > 0.999999) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 1;
      return out;
    } else {
      _vec3_js__WEBPACK_IMPORTED_MODULE_2__.cross(tmpvec3, a, b);
      out[0] = tmpvec3[0];
      out[1] = tmpvec3[1];
      out[2] = tmpvec3[2];
      out[3] = 1 + dot;
      return normalize(out, out);
    }
  };
}();
/**
 * Performs a spherical linear interpolation with two control points
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a the first operand
 * @param {ReadonlyQuat} b the second operand
 * @param {ReadonlyQuat} c the third operand
 * @param {ReadonlyQuat} d the fourth operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {quat} out
 */

var sqlerp = function () {
  var temp1 = create();
  var temp2 = create();
  return function (out, a, b, c, d, t) {
    slerp(temp1, a, d, t);
    slerp(temp2, b, c, t);
    slerp(out, temp1, temp2, 2 * t * (1 - t));
    return out;
  };
}();
/**
 * Sets the specified quaternion with values corresponding to the given
 * axes. Each axis is a vec3 and is expected to be unit length and
 * perpendicular to all other specified axes.
 *
 * @param {ReadonlyVec3} view  the vector representing the viewing direction
 * @param {ReadonlyVec3} right the vector representing the local "right" direction
 * @param {ReadonlyVec3} up    the vector representing the local "up" direction
 * @returns {quat} out
 */

var setAxes = function () {
  var matr = _mat3_js__WEBPACK_IMPORTED_MODULE_1__.create();
  return function (out, view, right, up) {
    matr[0] = right[0];
    matr[3] = right[1];
    matr[6] = right[2];
    matr[1] = up[0];
    matr[4] = up[1];
    matr[7] = up[2];
    matr[2] = -view[0];
    matr[5] = -view[1];
    matr[8] = -view[2];
    return normalize(out, fromMat3(out, matr));
  };
}();

/***/ }),

/***/ "./node_modules/gl-matrix/esm/quat2.js":
/*!*********************************************!*\
  !*** ./node_modules/gl-matrix/esm/quat2.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   add: () => (/* binding */ add),
/* harmony export */   clone: () => (/* binding */ clone),
/* harmony export */   conjugate: () => (/* binding */ conjugate),
/* harmony export */   copy: () => (/* binding */ copy),
/* harmony export */   create: () => (/* binding */ create),
/* harmony export */   dot: () => (/* binding */ dot),
/* harmony export */   equals: () => (/* binding */ equals),
/* harmony export */   exactEquals: () => (/* binding */ exactEquals),
/* harmony export */   fromMat4: () => (/* binding */ fromMat4),
/* harmony export */   fromRotation: () => (/* binding */ fromRotation),
/* harmony export */   fromRotationTranslation: () => (/* binding */ fromRotationTranslation),
/* harmony export */   fromRotationTranslationValues: () => (/* binding */ fromRotationTranslationValues),
/* harmony export */   fromTranslation: () => (/* binding */ fromTranslation),
/* harmony export */   fromValues: () => (/* binding */ fromValues),
/* harmony export */   getDual: () => (/* binding */ getDual),
/* harmony export */   getReal: () => (/* binding */ getReal),
/* harmony export */   getTranslation: () => (/* binding */ getTranslation),
/* harmony export */   identity: () => (/* binding */ identity),
/* harmony export */   invert: () => (/* binding */ invert),
/* harmony export */   len: () => (/* binding */ len),
/* harmony export */   length: () => (/* binding */ length),
/* harmony export */   lerp: () => (/* binding */ lerp),
/* harmony export */   mul: () => (/* binding */ mul),
/* harmony export */   multiply: () => (/* binding */ multiply),
/* harmony export */   normalize: () => (/* binding */ normalize),
/* harmony export */   rotateAroundAxis: () => (/* binding */ rotateAroundAxis),
/* harmony export */   rotateByQuatAppend: () => (/* binding */ rotateByQuatAppend),
/* harmony export */   rotateByQuatPrepend: () => (/* binding */ rotateByQuatPrepend),
/* harmony export */   rotateX: () => (/* binding */ rotateX),
/* harmony export */   rotateY: () => (/* binding */ rotateY),
/* harmony export */   rotateZ: () => (/* binding */ rotateZ),
/* harmony export */   scale: () => (/* binding */ scale),
/* harmony export */   set: () => (/* binding */ set),
/* harmony export */   setDual: () => (/* binding */ setDual),
/* harmony export */   setReal: () => (/* binding */ setReal),
/* harmony export */   sqrLen: () => (/* binding */ sqrLen),
/* harmony export */   squaredLength: () => (/* binding */ squaredLength),
/* harmony export */   str: () => (/* binding */ str),
/* harmony export */   translate: () => (/* binding */ translate)
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common.js */ "./node_modules/gl-matrix/esm/common.js");
/* harmony import */ var _quat_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./quat.js */ "./node_modules/gl-matrix/esm/quat.js");
/* harmony import */ var _mat4_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./mat4.js */ "./node_modules/gl-matrix/esm/mat4.js");



/**
 * Dual Quaternion<br>
 * Format: [real, dual]<br>
 * Quaternion format: XYZW<br>
 * Make sure to have normalized dual quaternions, otherwise the functions may not work as intended.<br>
 * @module quat2
 */

/**
 * Creates a new identity dual quat
 *
 * @returns {quat2} a new dual quaternion [real -> rotation, dual -> translation]
 */

function create() {
  var dq = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(8);

  if (_common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE != Float32Array) {
    dq[0] = 0;
    dq[1] = 0;
    dq[2] = 0;
    dq[4] = 0;
    dq[5] = 0;
    dq[6] = 0;
    dq[7] = 0;
  }

  dq[3] = 1;
  return dq;
}
/**
 * Creates a new quat initialized with values from an existing quaternion
 *
 * @param {ReadonlyQuat2} a dual quaternion to clone
 * @returns {quat2} new dual quaternion
 * @function
 */

function clone(a) {
  var dq = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(8);
  dq[0] = a[0];
  dq[1] = a[1];
  dq[2] = a[2];
  dq[3] = a[3];
  dq[4] = a[4];
  dq[5] = a[5];
  dq[6] = a[6];
  dq[7] = a[7];
  return dq;
}
/**
 * Creates a new dual quat initialized with the given values
 *
 * @param {Number} x1 X component
 * @param {Number} y1 Y component
 * @param {Number} z1 Z component
 * @param {Number} w1 W component
 * @param {Number} x2 X component
 * @param {Number} y2 Y component
 * @param {Number} z2 Z component
 * @param {Number} w2 W component
 * @returns {quat2} new dual quaternion
 * @function
 */

function fromValues(x1, y1, z1, w1, x2, y2, z2, w2) {
  var dq = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(8);
  dq[0] = x1;
  dq[1] = y1;
  dq[2] = z1;
  dq[3] = w1;
  dq[4] = x2;
  dq[5] = y2;
  dq[6] = z2;
  dq[7] = w2;
  return dq;
}
/**
 * Creates a new dual quat from the given values (quat and translation)
 *
 * @param {Number} x1 X component
 * @param {Number} y1 Y component
 * @param {Number} z1 Z component
 * @param {Number} w1 W component
 * @param {Number} x2 X component (translation)
 * @param {Number} y2 Y component (translation)
 * @param {Number} z2 Z component (translation)
 * @returns {quat2} new dual quaternion
 * @function
 */

function fromRotationTranslationValues(x1, y1, z1, w1, x2, y2, z2) {
  var dq = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(8);
  dq[0] = x1;
  dq[1] = y1;
  dq[2] = z1;
  dq[3] = w1;
  var ax = x2 * 0.5,
      ay = y2 * 0.5,
      az = z2 * 0.5;
  dq[4] = ax * w1 + ay * z1 - az * y1;
  dq[5] = ay * w1 + az * x1 - ax * z1;
  dq[6] = az * w1 + ax * y1 - ay * x1;
  dq[7] = -ax * x1 - ay * y1 - az * z1;
  return dq;
}
/**
 * Creates a dual quat from a quaternion and a translation
 *
 * @param {ReadonlyQuat2} dual quaternion receiving operation result
 * @param {ReadonlyQuat} q a normalized quaternion
 * @param {ReadonlyVec3} t tranlation vector
 * @returns {quat2} dual quaternion receiving operation result
 * @function
 */

function fromRotationTranslation(out, q, t) {
  var ax = t[0] * 0.5,
      ay = t[1] * 0.5,
      az = t[2] * 0.5,
      bx = q[0],
      by = q[1],
      bz = q[2],
      bw = q[3];
  out[0] = bx;
  out[1] = by;
  out[2] = bz;
  out[3] = bw;
  out[4] = ax * bw + ay * bz - az * by;
  out[5] = ay * bw + az * bx - ax * bz;
  out[6] = az * bw + ax * by - ay * bx;
  out[7] = -ax * bx - ay * by - az * bz;
  return out;
}
/**
 * Creates a dual quat from a translation
 *
 * @param {ReadonlyQuat2} dual quaternion receiving operation result
 * @param {ReadonlyVec3} t translation vector
 * @returns {quat2} dual quaternion receiving operation result
 * @function
 */

function fromTranslation(out, t) {
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  out[4] = t[0] * 0.5;
  out[5] = t[1] * 0.5;
  out[6] = t[2] * 0.5;
  out[7] = 0;
  return out;
}
/**
 * Creates a dual quat from a quaternion
 *
 * @param {ReadonlyQuat2} dual quaternion receiving operation result
 * @param {ReadonlyQuat} q the quaternion
 * @returns {quat2} dual quaternion receiving operation result
 * @function
 */

function fromRotation(out, q) {
  out[0] = q[0];
  out[1] = q[1];
  out[2] = q[2];
  out[3] = q[3];
  out[4] = 0;
  out[5] = 0;
  out[6] = 0;
  out[7] = 0;
  return out;
}
/**
 * Creates a new dual quat from a matrix (4x4)
 *
 * @param {quat2} out the dual quaternion
 * @param {ReadonlyMat4} a the matrix
 * @returns {quat2} dual quat receiving operation result
 * @function
 */

function fromMat4(out, a) {
  //TODO Optimize this
  var outer = _quat_js__WEBPACK_IMPORTED_MODULE_1__.create();
  _mat4_js__WEBPACK_IMPORTED_MODULE_2__.getRotation(outer, a);
  var t = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(3);
  _mat4_js__WEBPACK_IMPORTED_MODULE_2__.getTranslation(t, a);
  fromRotationTranslation(out, outer, t);
  return out;
}
/**
 * Copy the values from one dual quat to another
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {ReadonlyQuat2} a the source dual quaternion
 * @returns {quat2} out
 * @function
 */

function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  return out;
}
/**
 * Set a dual quat to the identity dual quaternion
 *
 * @param {quat2} out the receiving quaternion
 * @returns {quat2} out
 */

function identity(out) {
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  out[4] = 0;
  out[5] = 0;
  out[6] = 0;
  out[7] = 0;
  return out;
}
/**
 * Set the components of a dual quat to the given values
 *
 * @param {quat2} out the receiving quaternion
 * @param {Number} x1 X component
 * @param {Number} y1 Y component
 * @param {Number} z1 Z component
 * @param {Number} w1 W component
 * @param {Number} x2 X component
 * @param {Number} y2 Y component
 * @param {Number} z2 Z component
 * @param {Number} w2 W component
 * @returns {quat2} out
 * @function
 */

function set(out, x1, y1, z1, w1, x2, y2, z2, w2) {
  out[0] = x1;
  out[1] = y1;
  out[2] = z1;
  out[3] = w1;
  out[4] = x2;
  out[5] = y2;
  out[6] = z2;
  out[7] = w2;
  return out;
}
/**
 * Gets the real part of a dual quat
 * @param  {quat} out real part
 * @param  {ReadonlyQuat2} a Dual Quaternion
 * @return {quat} real part
 */

var getReal = _quat_js__WEBPACK_IMPORTED_MODULE_1__.copy;
/**
 * Gets the dual part of a dual quat
 * @param  {quat} out dual part
 * @param  {ReadonlyQuat2} a Dual Quaternion
 * @return {quat} dual part
 */

function getDual(out, a) {
  out[0] = a[4];
  out[1] = a[5];
  out[2] = a[6];
  out[3] = a[7];
  return out;
}
/**
 * Set the real component of a dual quat to the given quaternion
 *
 * @param {quat2} out the receiving quaternion
 * @param {ReadonlyQuat} q a quaternion representing the real part
 * @returns {quat2} out
 * @function
 */

var setReal = _quat_js__WEBPACK_IMPORTED_MODULE_1__.copy;
/**
 * Set the dual component of a dual quat to the given quaternion
 *
 * @param {quat2} out the receiving quaternion
 * @param {ReadonlyQuat} q a quaternion representing the dual part
 * @returns {quat2} out
 * @function
 */

function setDual(out, q) {
  out[4] = q[0];
  out[5] = q[1];
  out[6] = q[2];
  out[7] = q[3];
  return out;
}
/**
 * Gets the translation of a normalized dual quat
 * @param  {vec3} out translation
 * @param  {ReadonlyQuat2} a Dual Quaternion to be decomposed
 * @return {vec3} translation
 */

function getTranslation(out, a) {
  var ax = a[4],
      ay = a[5],
      az = a[6],
      aw = a[7],
      bx = -a[0],
      by = -a[1],
      bz = -a[2],
      bw = a[3];
  out[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
  out[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
  out[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
  return out;
}
/**
 * Translates a dual quat by the given vector
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {ReadonlyQuat2} a the dual quaternion to translate
 * @param {ReadonlyVec3} v vector to translate by
 * @returns {quat2} out
 */

function translate(out, a, v) {
  var ax1 = a[0],
      ay1 = a[1],
      az1 = a[2],
      aw1 = a[3],
      bx1 = v[0] * 0.5,
      by1 = v[1] * 0.5,
      bz1 = v[2] * 0.5,
      ax2 = a[4],
      ay2 = a[5],
      az2 = a[6],
      aw2 = a[7];
  out[0] = ax1;
  out[1] = ay1;
  out[2] = az1;
  out[3] = aw1;
  out[4] = aw1 * bx1 + ay1 * bz1 - az1 * by1 + ax2;
  out[5] = aw1 * by1 + az1 * bx1 - ax1 * bz1 + ay2;
  out[6] = aw1 * bz1 + ax1 * by1 - ay1 * bx1 + az2;
  out[7] = -ax1 * bx1 - ay1 * by1 - az1 * bz1 + aw2;
  return out;
}
/**
 * Rotates a dual quat around the X axis
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {ReadonlyQuat2} a the dual quaternion to rotate
 * @param {number} rad how far should the rotation be
 * @returns {quat2} out
 */

function rotateX(out, a, rad) {
  var bx = -a[0],
      by = -a[1],
      bz = -a[2],
      bw = a[3],
      ax = a[4],
      ay = a[5],
      az = a[6],
      aw = a[7],
      ax1 = ax * bw + aw * bx + ay * bz - az * by,
      ay1 = ay * bw + aw * by + az * bx - ax * bz,
      az1 = az * bw + aw * bz + ax * by - ay * bx,
      aw1 = aw * bw - ax * bx - ay * by - az * bz;
  _quat_js__WEBPACK_IMPORTED_MODULE_1__.rotateX(out, a, rad);
  bx = out[0];
  by = out[1];
  bz = out[2];
  bw = out[3];
  out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
  out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
  out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
  out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
  return out;
}
/**
 * Rotates a dual quat around the Y axis
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {ReadonlyQuat2} a the dual quaternion to rotate
 * @param {number} rad how far should the rotation be
 * @returns {quat2} out
 */

function rotateY(out, a, rad) {
  var bx = -a[0],
      by = -a[1],
      bz = -a[2],
      bw = a[3],
      ax = a[4],
      ay = a[5],
      az = a[6],
      aw = a[7],
      ax1 = ax * bw + aw * bx + ay * bz - az * by,
      ay1 = ay * bw + aw * by + az * bx - ax * bz,
      az1 = az * bw + aw * bz + ax * by - ay * bx,
      aw1 = aw * bw - ax * bx - ay * by - az * bz;
  _quat_js__WEBPACK_IMPORTED_MODULE_1__.rotateY(out, a, rad);
  bx = out[0];
  by = out[1];
  bz = out[2];
  bw = out[3];
  out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
  out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
  out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
  out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
  return out;
}
/**
 * Rotates a dual quat around the Z axis
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {ReadonlyQuat2} a the dual quaternion to rotate
 * @param {number} rad how far should the rotation be
 * @returns {quat2} out
 */

function rotateZ(out, a, rad) {
  var bx = -a[0],
      by = -a[1],
      bz = -a[2],
      bw = a[3],
      ax = a[4],
      ay = a[5],
      az = a[6],
      aw = a[7],
      ax1 = ax * bw + aw * bx + ay * bz - az * by,
      ay1 = ay * bw + aw * by + az * bx - ax * bz,
      az1 = az * bw + aw * bz + ax * by - ay * bx,
      aw1 = aw * bw - ax * bx - ay * by - az * bz;
  _quat_js__WEBPACK_IMPORTED_MODULE_1__.rotateZ(out, a, rad);
  bx = out[0];
  by = out[1];
  bz = out[2];
  bw = out[3];
  out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
  out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
  out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
  out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
  return out;
}
/**
 * Rotates a dual quat by a given quaternion (a * q)
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {ReadonlyQuat2} a the dual quaternion to rotate
 * @param {ReadonlyQuat} q quaternion to rotate by
 * @returns {quat2} out
 */

function rotateByQuatAppend(out, a, q) {
  var qx = q[0],
      qy = q[1],
      qz = q[2],
      qw = q[3],
      ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  out[0] = ax * qw + aw * qx + ay * qz - az * qy;
  out[1] = ay * qw + aw * qy + az * qx - ax * qz;
  out[2] = az * qw + aw * qz + ax * qy - ay * qx;
  out[3] = aw * qw - ax * qx - ay * qy - az * qz;
  ax = a[4];
  ay = a[5];
  az = a[6];
  aw = a[7];
  out[4] = ax * qw + aw * qx + ay * qz - az * qy;
  out[5] = ay * qw + aw * qy + az * qx - ax * qz;
  out[6] = az * qw + aw * qz + ax * qy - ay * qx;
  out[7] = aw * qw - ax * qx - ay * qy - az * qz;
  return out;
}
/**
 * Rotates a dual quat by a given quaternion (q * a)
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {ReadonlyQuat} q quaternion to rotate by
 * @param {ReadonlyQuat2} a the dual quaternion to rotate
 * @returns {quat2} out
 */

function rotateByQuatPrepend(out, q, a) {
  var qx = q[0],
      qy = q[1],
      qz = q[2],
      qw = q[3],
      bx = a[0],
      by = a[1],
      bz = a[2],
      bw = a[3];
  out[0] = qx * bw + qw * bx + qy * bz - qz * by;
  out[1] = qy * bw + qw * by + qz * bx - qx * bz;
  out[2] = qz * bw + qw * bz + qx * by - qy * bx;
  out[3] = qw * bw - qx * bx - qy * by - qz * bz;
  bx = a[4];
  by = a[5];
  bz = a[6];
  bw = a[7];
  out[4] = qx * bw + qw * bx + qy * bz - qz * by;
  out[5] = qy * bw + qw * by + qz * bx - qx * bz;
  out[6] = qz * bw + qw * bz + qx * by - qy * bx;
  out[7] = qw * bw - qx * bx - qy * by - qz * bz;
  return out;
}
/**
 * Rotates a dual quat around a given axis. Does the normalisation automatically
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {ReadonlyQuat2} a the dual quaternion to rotate
 * @param {ReadonlyVec3} axis the axis to rotate around
 * @param {Number} rad how far the rotation should be
 * @returns {quat2} out
 */

function rotateAroundAxis(out, a, axis, rad) {
  //Special case for rad = 0
  if (Math.abs(rad) < _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON) {
    return copy(out, a);
  }

  var axisLength = Math.hypot(axis[0], axis[1], axis[2]);
  rad = rad * 0.5;
  var s = Math.sin(rad);
  var bx = s * axis[0] / axisLength;
  var by = s * axis[1] / axisLength;
  var bz = s * axis[2] / axisLength;
  var bw = Math.cos(rad);
  var ax1 = a[0],
      ay1 = a[1],
      az1 = a[2],
      aw1 = a[3];
  out[0] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
  out[1] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
  out[2] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
  out[3] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
  var ax = a[4],
      ay = a[5],
      az = a[6],
      aw = a[7];
  out[4] = ax * bw + aw * bx + ay * bz - az * by;
  out[5] = ay * bw + aw * by + az * bx - ax * bz;
  out[6] = az * bw + aw * bz + ax * by - ay * bx;
  out[7] = aw * bw - ax * bx - ay * by - az * bz;
  return out;
}
/**
 * Adds two dual quat's
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {ReadonlyQuat2} a the first operand
 * @param {ReadonlyQuat2} b the second operand
 * @returns {quat2} out
 * @function
 */

function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  out[4] = a[4] + b[4];
  out[5] = a[5] + b[5];
  out[6] = a[6] + b[6];
  out[7] = a[7] + b[7];
  return out;
}
/**
 * Multiplies two dual quat's
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {ReadonlyQuat2} a the first operand
 * @param {ReadonlyQuat2} b the second operand
 * @returns {quat2} out
 */

function multiply(out, a, b) {
  var ax0 = a[0],
      ay0 = a[1],
      az0 = a[2],
      aw0 = a[3],
      bx1 = b[4],
      by1 = b[5],
      bz1 = b[6],
      bw1 = b[7],
      ax1 = a[4],
      ay1 = a[5],
      az1 = a[6],
      aw1 = a[7],
      bx0 = b[0],
      by0 = b[1],
      bz0 = b[2],
      bw0 = b[3];
  out[0] = ax0 * bw0 + aw0 * bx0 + ay0 * bz0 - az0 * by0;
  out[1] = ay0 * bw0 + aw0 * by0 + az0 * bx0 - ax0 * bz0;
  out[2] = az0 * bw0 + aw0 * bz0 + ax0 * by0 - ay0 * bx0;
  out[3] = aw0 * bw0 - ax0 * bx0 - ay0 * by0 - az0 * bz0;
  out[4] = ax0 * bw1 + aw0 * bx1 + ay0 * bz1 - az0 * by1 + ax1 * bw0 + aw1 * bx0 + ay1 * bz0 - az1 * by0;
  out[5] = ay0 * bw1 + aw0 * by1 + az0 * bx1 - ax0 * bz1 + ay1 * bw0 + aw1 * by0 + az1 * bx0 - ax1 * bz0;
  out[6] = az0 * bw1 + aw0 * bz1 + ax0 * by1 - ay0 * bx1 + az1 * bw0 + aw1 * bz0 + ax1 * by0 - ay1 * bx0;
  out[7] = aw0 * bw1 - ax0 * bx1 - ay0 * by1 - az0 * bz1 + aw1 * bw0 - ax1 * bx0 - ay1 * by0 - az1 * bz0;
  return out;
}
/**
 * Alias for {@link quat2.multiply}
 * @function
 */

var mul = multiply;
/**
 * Scales a dual quat by a scalar number
 *
 * @param {quat2} out the receiving dual quat
 * @param {ReadonlyQuat2} a the dual quat to scale
 * @param {Number} b amount to scale the dual quat by
 * @returns {quat2} out
 * @function
 */

function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  out[4] = a[4] * b;
  out[5] = a[5] * b;
  out[6] = a[6] * b;
  out[7] = a[7] * b;
  return out;
}
/**
 * Calculates the dot product of two dual quat's (The dot product of the real parts)
 *
 * @param {ReadonlyQuat2} a the first operand
 * @param {ReadonlyQuat2} b the second operand
 * @returns {Number} dot product of a and b
 * @function
 */

var dot = _quat_js__WEBPACK_IMPORTED_MODULE_1__.dot;
/**
 * Performs a linear interpolation between two dual quats's
 * NOTE: The resulting dual quaternions won't always be normalized (The error is most noticeable when t = 0.5)
 *
 * @param {quat2} out the receiving dual quat
 * @param {ReadonlyQuat2} a the first operand
 * @param {ReadonlyQuat2} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {quat2} out
 */

function lerp(out, a, b, t) {
  var mt = 1 - t;
  if (dot(a, b) < 0) t = -t;
  out[0] = a[0] * mt + b[0] * t;
  out[1] = a[1] * mt + b[1] * t;
  out[2] = a[2] * mt + b[2] * t;
  out[3] = a[3] * mt + b[3] * t;
  out[4] = a[4] * mt + b[4] * t;
  out[5] = a[5] * mt + b[5] * t;
  out[6] = a[6] * mt + b[6] * t;
  out[7] = a[7] * mt + b[7] * t;
  return out;
}
/**
 * Calculates the inverse of a dual quat. If they are normalized, conjugate is cheaper
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {ReadonlyQuat2} a dual quat to calculate inverse of
 * @returns {quat2} out
 */

function invert(out, a) {
  var sqlen = squaredLength(a);
  out[0] = -a[0] / sqlen;
  out[1] = -a[1] / sqlen;
  out[2] = -a[2] / sqlen;
  out[3] = a[3] / sqlen;
  out[4] = -a[4] / sqlen;
  out[5] = -a[5] / sqlen;
  out[6] = -a[6] / sqlen;
  out[7] = a[7] / sqlen;
  return out;
}
/**
 * Calculates the conjugate of a dual quat
 * If the dual quaternion is normalized, this function is faster than quat2.inverse and produces the same result.
 *
 * @param {quat2} out the receiving quaternion
 * @param {ReadonlyQuat2} a quat to calculate conjugate of
 * @returns {quat2} out
 */

function conjugate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] = a[3];
  out[4] = -a[4];
  out[5] = -a[5];
  out[6] = -a[6];
  out[7] = a[7];
  return out;
}
/**
 * Calculates the length of a dual quat
 *
 * @param {ReadonlyQuat2} a dual quat to calculate length of
 * @returns {Number} length of a
 * @function
 */

var length = _quat_js__WEBPACK_IMPORTED_MODULE_1__.length;
/**
 * Alias for {@link quat2.length}
 * @function
 */

var len = length;
/**
 * Calculates the squared length of a dual quat
 *
 * @param {ReadonlyQuat2} a dual quat to calculate squared length of
 * @returns {Number} squared length of a
 * @function
 */

var squaredLength = _quat_js__WEBPACK_IMPORTED_MODULE_1__.squaredLength;
/**
 * Alias for {@link quat2.squaredLength}
 * @function
 */

var sqrLen = squaredLength;
/**
 * Normalize a dual quat
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {ReadonlyQuat2} a dual quaternion to normalize
 * @returns {quat2} out
 * @function
 */

function normalize(out, a) {
  var magnitude = squaredLength(a);

  if (magnitude > 0) {
    magnitude = Math.sqrt(magnitude);
    var a0 = a[0] / magnitude;
    var a1 = a[1] / magnitude;
    var a2 = a[2] / magnitude;
    var a3 = a[3] / magnitude;
    var b0 = a[4];
    var b1 = a[5];
    var b2 = a[6];
    var b3 = a[7];
    var a_dot_b = a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3;
    out[0] = a0;
    out[1] = a1;
    out[2] = a2;
    out[3] = a3;
    out[4] = (b0 - a0 * a_dot_b) / magnitude;
    out[5] = (b1 - a1 * a_dot_b) / magnitude;
    out[6] = (b2 - a2 * a_dot_b) / magnitude;
    out[7] = (b3 - a3 * a_dot_b) / magnitude;
  }

  return out;
}
/**
 * Returns a string representation of a dual quatenion
 *
 * @param {ReadonlyQuat2} a dual quaternion to represent as a string
 * @returns {String} string representation of the dual quat
 */

function str(a) {
  return "quat2(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ")";
}
/**
 * Returns whether or not the dual quaternions have exactly the same elements in the same position (when compared with ===)
 *
 * @param {ReadonlyQuat2} a the first dual quaternion.
 * @param {ReadonlyQuat2} b the second dual quaternion.
 * @returns {Boolean} true if the dual quaternions are equal, false otherwise.
 */

function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7];
}
/**
 * Returns whether or not the dual quaternions have approximately the same elements in the same position.
 *
 * @param {ReadonlyQuat2} a the first dual quat.
 * @param {ReadonlyQuat2} b the second dual quat.
 * @returns {Boolean} true if the dual quats are equal, false otherwise.
 */

function equals(a, b) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3],
      a4 = a[4],
      a5 = a[5],
      a6 = a[6],
      a7 = a[7];
  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3],
      b4 = b[4],
      b5 = b[5],
      b6 = b[6],
      b7 = b[7];
  return Math.abs(a0 - b0) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7));
}

/***/ }),

/***/ "./node_modules/gl-matrix/esm/vec2.js":
/*!********************************************!*\
  !*** ./node_modules/gl-matrix/esm/vec2.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   add: () => (/* binding */ add),
/* harmony export */   angle: () => (/* binding */ angle),
/* harmony export */   ceil: () => (/* binding */ ceil),
/* harmony export */   clone: () => (/* binding */ clone),
/* harmony export */   copy: () => (/* binding */ copy),
/* harmony export */   create: () => (/* binding */ create),
/* harmony export */   cross: () => (/* binding */ cross),
/* harmony export */   dist: () => (/* binding */ dist),
/* harmony export */   distance: () => (/* binding */ distance),
/* harmony export */   div: () => (/* binding */ div),
/* harmony export */   divide: () => (/* binding */ divide),
/* harmony export */   dot: () => (/* binding */ dot),
/* harmony export */   equals: () => (/* binding */ equals),
/* harmony export */   exactEquals: () => (/* binding */ exactEquals),
/* harmony export */   floor: () => (/* binding */ floor),
/* harmony export */   forEach: () => (/* binding */ forEach),
/* harmony export */   fromValues: () => (/* binding */ fromValues),
/* harmony export */   inverse: () => (/* binding */ inverse),
/* harmony export */   len: () => (/* binding */ len),
/* harmony export */   length: () => (/* binding */ length),
/* harmony export */   lerp: () => (/* binding */ lerp),
/* harmony export */   max: () => (/* binding */ max),
/* harmony export */   min: () => (/* binding */ min),
/* harmony export */   mul: () => (/* binding */ mul),
/* harmony export */   multiply: () => (/* binding */ multiply),
/* harmony export */   negate: () => (/* binding */ negate),
/* harmony export */   normalize: () => (/* binding */ normalize),
/* harmony export */   random: () => (/* binding */ random),
/* harmony export */   rotate: () => (/* binding */ rotate),
/* harmony export */   round: () => (/* binding */ round),
/* harmony export */   scale: () => (/* binding */ scale),
/* harmony export */   scaleAndAdd: () => (/* binding */ scaleAndAdd),
/* harmony export */   set: () => (/* binding */ set),
/* harmony export */   sqrDist: () => (/* binding */ sqrDist),
/* harmony export */   sqrLen: () => (/* binding */ sqrLen),
/* harmony export */   squaredDistance: () => (/* binding */ squaredDistance),
/* harmony export */   squaredLength: () => (/* binding */ squaredLength),
/* harmony export */   str: () => (/* binding */ str),
/* harmony export */   sub: () => (/* binding */ sub),
/* harmony export */   subtract: () => (/* binding */ subtract),
/* harmony export */   transformMat2: () => (/* binding */ transformMat2),
/* harmony export */   transformMat2d: () => (/* binding */ transformMat2d),
/* harmony export */   transformMat3: () => (/* binding */ transformMat3),
/* harmony export */   transformMat4: () => (/* binding */ transformMat4),
/* harmony export */   zero: () => (/* binding */ zero)
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common.js */ "./node_modules/gl-matrix/esm/common.js");

/**
 * 2 Dimensional Vector
 * @module vec2
 */

/**
 * Creates a new, empty vec2
 *
 * @returns {vec2} a new 2D vector
 */

function create() {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(2);

  if (_common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
  }

  return out;
}
/**
 * Creates a new vec2 initialized with values from an existing vector
 *
 * @param {ReadonlyVec2} a vector to clone
 * @returns {vec2} a new 2D vector
 */

function clone(a) {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(2);
  out[0] = a[0];
  out[1] = a[1];
  return out;
}
/**
 * Creates a new vec2 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} a new 2D vector
 */

function fromValues(x, y) {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(2);
  out[0] = x;
  out[1] = y;
  return out;
}
/**
 * Copy the values from one vec2 to another
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the source vector
 * @returns {vec2} out
 */

function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  return out;
}
/**
 * Set the components of a vec2 to the given values
 *
 * @param {vec2} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} out
 */

function set(out, x, y) {
  out[0] = x;
  out[1] = y;
  return out;
}
/**
 * Adds two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {vec2} out
 */

function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  return out;
}
/**
 * Subtracts vector b from vector a
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {vec2} out
 */

function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  return out;
}
/**
 * Multiplies two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {vec2} out
 */

function multiply(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  return out;
}
/**
 * Divides two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {vec2} out
 */

function divide(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  return out;
}
/**
 * Math.ceil the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a vector to ceil
 * @returns {vec2} out
 */

function ceil(out, a) {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  return out;
}
/**
 * Math.floor the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a vector to floor
 * @returns {vec2} out
 */

function floor(out, a) {
  out[0] = Math.floor(a[0]);
  out[1] = Math.floor(a[1]);
  return out;
}
/**
 * Returns the minimum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {vec2} out
 */

function min(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  return out;
}
/**
 * Returns the maximum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {vec2} out
 */

function max(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  return out;
}
/**
 * Math.round the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a vector to round
 * @returns {vec2} out
 */

function round(out, a) {
  out[0] = Math.round(a[0]);
  out[1] = Math.round(a[1]);
  return out;
}
/**
 * Scales a vec2 by a scalar number
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec2} out
 */

function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  return out;
}
/**
 * Adds two vec2's after scaling the second operand by a scalar value
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec2} out
 */

function scaleAndAdd(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  return out;
}
/**
 * Calculates the euclidian distance between two vec2's
 *
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {Number} distance between a and b
 */

function distance(a, b) {
  var x = b[0] - a[0],
      y = b[1] - a[1];
  return Math.hypot(x, y);
}
/**
 * Calculates the squared euclidian distance between two vec2's
 *
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {Number} squared distance between a and b
 */

function squaredDistance(a, b) {
  var x = b[0] - a[0],
      y = b[1] - a[1];
  return x * x + y * y;
}
/**
 * Calculates the length of a vec2
 *
 * @param {ReadonlyVec2} a vector to calculate length of
 * @returns {Number} length of a
 */

function length(a) {
  var x = a[0],
      y = a[1];
  return Math.hypot(x, y);
}
/**
 * Calculates the squared length of a vec2
 *
 * @param {ReadonlyVec2} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */

function squaredLength(a) {
  var x = a[0],
      y = a[1];
  return x * x + y * y;
}
/**
 * Negates the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a vector to negate
 * @returns {vec2} out
 */

function negate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  return out;
}
/**
 * Returns the inverse of the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a vector to invert
 * @returns {vec2} out
 */

function inverse(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  return out;
}
/**
 * Normalize a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a vector to normalize
 * @returns {vec2} out
 */

function normalize(out, a) {
  var x = a[0],
      y = a[1];
  var len = x * x + y * y;

  if (len > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len = 1 / Math.sqrt(len);
  }

  out[0] = a[0] * len;
  out[1] = a[1] * len;
  return out;
}
/**
 * Calculates the dot product of two vec2's
 *
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {Number} dot product of a and b
 */

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1];
}
/**
 * Computes the cross product of two vec2's
 * Note that the cross product must by definition produce a 3D vector
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {vec3} out
 */

function cross(out, a, b) {
  var z = a[0] * b[1] - a[1] * b[0];
  out[0] = out[1] = 0;
  out[2] = z;
  return out;
}
/**
 * Performs a linear interpolation between two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec2} out
 */

function lerp(out, a, b, t) {
  var ax = a[0],
      ay = a[1];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  return out;
}
/**
 * Generates a random vector with the given scale
 *
 * @param {vec2} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec2} out
 */

function random(out, scale) {
  scale = scale || 1.0;
  var r = _common_js__WEBPACK_IMPORTED_MODULE_0__.RANDOM() * 2.0 * Math.PI;
  out[0] = Math.cos(r) * scale;
  out[1] = Math.sin(r) * scale;
  return out;
}
/**
 * Transforms the vec2 with a mat2
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the vector to transform
 * @param {ReadonlyMat2} m matrix to transform with
 * @returns {vec2} out
 */

function transformMat2(out, a, m) {
  var x = a[0],
      y = a[1];
  out[0] = m[0] * x + m[2] * y;
  out[1] = m[1] * x + m[3] * y;
  return out;
}
/**
 * Transforms the vec2 with a mat2d
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the vector to transform
 * @param {ReadonlyMat2d} m matrix to transform with
 * @returns {vec2} out
 */

function transformMat2d(out, a, m) {
  var x = a[0],
      y = a[1];
  out[0] = m[0] * x + m[2] * y + m[4];
  out[1] = m[1] * x + m[3] * y + m[5];
  return out;
}
/**
 * Transforms the vec2 with a mat3
 * 3rd vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the vector to transform
 * @param {ReadonlyMat3} m matrix to transform with
 * @returns {vec2} out
 */

function transformMat3(out, a, m) {
  var x = a[0],
      y = a[1];
  out[0] = m[0] * x + m[3] * y + m[6];
  out[1] = m[1] * x + m[4] * y + m[7];
  return out;
}
/**
 * Transforms the vec2 with a mat4
 * 3rd vector component is implicitly '0'
 * 4th vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the vector to transform
 * @param {ReadonlyMat4} m matrix to transform with
 * @returns {vec2} out
 */

function transformMat4(out, a, m) {
  var x = a[0];
  var y = a[1];
  out[0] = m[0] * x + m[4] * y + m[12];
  out[1] = m[1] * x + m[5] * y + m[13];
  return out;
}
/**
 * Rotate a 2D vector
 * @param {vec2} out The receiving vec2
 * @param {ReadonlyVec2} a The vec2 point to rotate
 * @param {ReadonlyVec2} b The origin of the rotation
 * @param {Number} rad The angle of rotation in radians
 * @returns {vec2} out
 */

function rotate(out, a, b, rad) {
  //Translate point to the origin
  var p0 = a[0] - b[0],
      p1 = a[1] - b[1],
      sinC = Math.sin(rad),
      cosC = Math.cos(rad); //perform rotation and translate to correct position

  out[0] = p0 * cosC - p1 * sinC + b[0];
  out[1] = p0 * sinC + p1 * cosC + b[1];
  return out;
}
/**
 * Get the angle between two 2D vectors
 * @param {ReadonlyVec2} a The first operand
 * @param {ReadonlyVec2} b The second operand
 * @returns {Number} The angle in radians
 */

function angle(a, b) {
  var x1 = a[0],
      y1 = a[1],
      x2 = b[0],
      y2 = b[1],
      // mag is the product of the magnitudes of a and b
  mag = Math.sqrt(x1 * x1 + y1 * y1) * Math.sqrt(x2 * x2 + y2 * y2),
      // mag &&.. short circuits if mag == 0
  cosine = mag && (x1 * x2 + y1 * y2) / mag; // Math.min(Math.max(cosine, -1), 1) clamps the cosine between -1 and 1

  return Math.acos(Math.min(Math.max(cosine, -1), 1));
}
/**
 * Set the components of a vec2 to zero
 *
 * @param {vec2} out the receiving vector
 * @returns {vec2} out
 */

function zero(out) {
  out[0] = 0.0;
  out[1] = 0.0;
  return out;
}
/**
 * Returns a string representation of a vector
 *
 * @param {ReadonlyVec2} a vector to represent as a string
 * @returns {String} string representation of the vector
 */

function str(a) {
  return "vec2(" + a[0] + ", " + a[1] + ")";
}
/**
 * Returns whether or not the vectors exactly have the same elements in the same position (when compared with ===)
 *
 * @param {ReadonlyVec2} a The first vector.
 * @param {ReadonlyVec2} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1];
}
/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {ReadonlyVec2} a The first vector.
 * @param {ReadonlyVec2} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

function equals(a, b) {
  var a0 = a[0],
      a1 = a[1];
  var b0 = b[0],
      b1 = b[1];
  return Math.abs(a0 - b0) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1));
}
/**
 * Alias for {@link vec2.length}
 * @function
 */

var len = length;
/**
 * Alias for {@link vec2.subtract}
 * @function
 */

var sub = subtract;
/**
 * Alias for {@link vec2.multiply}
 * @function
 */

var mul = multiply;
/**
 * Alias for {@link vec2.divide}
 * @function
 */

var div = divide;
/**
 * Alias for {@link vec2.distance}
 * @function
 */

var dist = distance;
/**
 * Alias for {@link vec2.squaredDistance}
 * @function
 */

var sqrDist = squaredDistance;
/**
 * Alias for {@link vec2.squaredLength}
 * @function
 */

var sqrLen = squaredLength;
/**
 * Perform some operation over an array of vec2s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

var forEach = function () {
  var vec = create();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 2;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
    }

    return a;
  };
}();

/***/ }),

/***/ "./node_modules/gl-matrix/esm/vec3.js":
/*!********************************************!*\
  !*** ./node_modules/gl-matrix/esm/vec3.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   add: () => (/* binding */ add),
/* harmony export */   angle: () => (/* binding */ angle),
/* harmony export */   bezier: () => (/* binding */ bezier),
/* harmony export */   ceil: () => (/* binding */ ceil),
/* harmony export */   clone: () => (/* binding */ clone),
/* harmony export */   copy: () => (/* binding */ copy),
/* harmony export */   create: () => (/* binding */ create),
/* harmony export */   cross: () => (/* binding */ cross),
/* harmony export */   dist: () => (/* binding */ dist),
/* harmony export */   distance: () => (/* binding */ distance),
/* harmony export */   div: () => (/* binding */ div),
/* harmony export */   divide: () => (/* binding */ divide),
/* harmony export */   dot: () => (/* binding */ dot),
/* harmony export */   equals: () => (/* binding */ equals),
/* harmony export */   exactEquals: () => (/* binding */ exactEquals),
/* harmony export */   floor: () => (/* binding */ floor),
/* harmony export */   forEach: () => (/* binding */ forEach),
/* harmony export */   fromValues: () => (/* binding */ fromValues),
/* harmony export */   hermite: () => (/* binding */ hermite),
/* harmony export */   inverse: () => (/* binding */ inverse),
/* harmony export */   len: () => (/* binding */ len),
/* harmony export */   length: () => (/* binding */ length),
/* harmony export */   lerp: () => (/* binding */ lerp),
/* harmony export */   max: () => (/* binding */ max),
/* harmony export */   min: () => (/* binding */ min),
/* harmony export */   mul: () => (/* binding */ mul),
/* harmony export */   multiply: () => (/* binding */ multiply),
/* harmony export */   negate: () => (/* binding */ negate),
/* harmony export */   normalize: () => (/* binding */ normalize),
/* harmony export */   random: () => (/* binding */ random),
/* harmony export */   rotateX: () => (/* binding */ rotateX),
/* harmony export */   rotateY: () => (/* binding */ rotateY),
/* harmony export */   rotateZ: () => (/* binding */ rotateZ),
/* harmony export */   round: () => (/* binding */ round),
/* harmony export */   scale: () => (/* binding */ scale),
/* harmony export */   scaleAndAdd: () => (/* binding */ scaleAndAdd),
/* harmony export */   set: () => (/* binding */ set),
/* harmony export */   sqrDist: () => (/* binding */ sqrDist),
/* harmony export */   sqrLen: () => (/* binding */ sqrLen),
/* harmony export */   squaredDistance: () => (/* binding */ squaredDistance),
/* harmony export */   squaredLength: () => (/* binding */ squaredLength),
/* harmony export */   str: () => (/* binding */ str),
/* harmony export */   sub: () => (/* binding */ sub),
/* harmony export */   subtract: () => (/* binding */ subtract),
/* harmony export */   transformMat3: () => (/* binding */ transformMat3),
/* harmony export */   transformMat4: () => (/* binding */ transformMat4),
/* harmony export */   transformQuat: () => (/* binding */ transformQuat),
/* harmony export */   zero: () => (/* binding */ zero)
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common.js */ "./node_modules/gl-matrix/esm/common.js");

/**
 * 3 Dimensional Vector
 * @module vec3
 */

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */

function create() {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(3);

  if (_common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }

  return out;
}
/**
 * Creates a new vec3 initialized with values from an existing vector
 *
 * @param {ReadonlyVec3} a vector to clone
 * @returns {vec3} a new 3D vector
 */

function clone(a) {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(3);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}
/**
 * Calculates the length of a vec3
 *
 * @param {ReadonlyVec3} a vector to calculate length of
 * @returns {Number} length of a
 */

function length(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return Math.hypot(x, y, z);
}
/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */

function fromValues(x, y, z) {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(3);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the source vector
 * @returns {vec3} out
 */

function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}
/**
 * Set the components of a vec3 to the given values
 *
 * @param {vec3} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} out
 */

function set(out, x, y, z) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  return out;
}
/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  return out;
}
/**
 * Multiplies two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function multiply(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  return out;
}
/**
 * Divides two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function divide(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  return out;
}
/**
 * Math.ceil the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to ceil
 * @returns {vec3} out
 */

function ceil(out, a) {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  out[2] = Math.ceil(a[2]);
  return out;
}
/**
 * Math.floor the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to floor
 * @returns {vec3} out
 */

function floor(out, a) {
  out[0] = Math.floor(a[0]);
  out[1] = Math.floor(a[1]);
  out[2] = Math.floor(a[2]);
  return out;
}
/**
 * Returns the minimum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function min(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  out[2] = Math.min(a[2], b[2]);
  return out;
}
/**
 * Returns the maximum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function max(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  out[2] = Math.max(a[2], b[2]);
  return out;
}
/**
 * Math.round the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to round
 * @returns {vec3} out
 */

function round(out, a) {
  out[0] = Math.round(a[0]);
  out[1] = Math.round(a[1]);
  out[2] = Math.round(a[2]);
  return out;
}
/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */

function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  return out;
}
/**
 * Adds two vec3's after scaling the second operand by a scalar value
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec3} out
 */

function scaleAndAdd(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  out[2] = a[2] + b[2] * scale;
  return out;
}
/**
 * Calculates the euclidian distance between two vec3's
 *
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {Number} distance between a and b
 */

function distance(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  return Math.hypot(x, y, z);
}
/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {Number} squared distance between a and b
 */

function squaredDistance(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  return x * x + y * y + z * z;
}
/**
 * Calculates the squared length of a vec3
 *
 * @param {ReadonlyVec3} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */

function squaredLength(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return x * x + y * y + z * z;
}
/**
 * Negates the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to negate
 * @returns {vec3} out
 */

function negate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  return out;
}
/**
 * Returns the inverse of the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to invert
 * @returns {vec3} out
 */

function inverse(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  return out;
}
/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to normalize
 * @returns {vec3} out
 */

function normalize(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var len = x * x + y * y + z * z;

  if (len > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len = 1 / Math.sqrt(len);
  }

  out[0] = a[0] * len;
  out[1] = a[1] * len;
  out[2] = a[2] * len;
  return out;
}
/**
 * Calculates the dot product of two vec3's
 *
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {Number} dot product of a and b
 */

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function cross(out, a, b) {
  var ax = a[0],
      ay = a[1],
      az = a[2];
  var bx = b[0],
      by = b[1],
      bz = b[2];
  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
}
/**
 * Performs a linear interpolation between two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec3} out
 */

function lerp(out, a, b, t) {
  var ax = a[0];
  var ay = a[1];
  var az = a[2];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  return out;
}
/**
 * Performs a hermite interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @param {ReadonlyVec3} c the third operand
 * @param {ReadonlyVec3} d the fourth operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec3} out
 */

function hermite(out, a, b, c, d, t) {
  var factorTimes2 = t * t;
  var factor1 = factorTimes2 * (2 * t - 3) + 1;
  var factor2 = factorTimes2 * (t - 2) + t;
  var factor3 = factorTimes2 * (t - 1);
  var factor4 = factorTimes2 * (3 - 2 * t);
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  return out;
}
/**
 * Performs a bezier interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @param {ReadonlyVec3} c the third operand
 * @param {ReadonlyVec3} d the fourth operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec3} out
 */

function bezier(out, a, b, c, d, t) {
  var inverseFactor = 1 - t;
  var inverseFactorTimesTwo = inverseFactor * inverseFactor;
  var factorTimes2 = t * t;
  var factor1 = inverseFactorTimesTwo * inverseFactor;
  var factor2 = 3 * t * inverseFactorTimesTwo;
  var factor3 = 3 * factorTimes2 * inverseFactor;
  var factor4 = factorTimes2 * t;
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  return out;
}
/**
 * Generates a random vector with the given scale
 *
 * @param {vec3} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec3} out
 */

function random(out, scale) {
  scale = scale || 1.0;
  var r = _common_js__WEBPACK_IMPORTED_MODULE_0__.RANDOM() * 2.0 * Math.PI;
  var z = _common_js__WEBPACK_IMPORTED_MODULE_0__.RANDOM() * 2.0 - 1.0;
  var zScale = Math.sqrt(1.0 - z * z) * scale;
  out[0] = Math.cos(r) * zScale;
  out[1] = Math.sin(r) * zScale;
  out[2] = z * scale;
  return out;
}
/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to transform
 * @param {ReadonlyMat4} m matrix to transform with
 * @returns {vec3} out
 */

function transformMat4(out, a, m) {
  var x = a[0],
      y = a[1],
      z = a[2];
  var w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1.0;
  out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
  return out;
}
/**
 * Transforms the vec3 with a mat3.
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to transform
 * @param {ReadonlyMat3} m the 3x3 matrix to transform with
 * @returns {vec3} out
 */

function transformMat3(out, a, m) {
  var x = a[0],
      y = a[1],
      z = a[2];
  out[0] = x * m[0] + y * m[3] + z * m[6];
  out[1] = x * m[1] + y * m[4] + z * m[7];
  out[2] = x * m[2] + y * m[5] + z * m[8];
  return out;
}
/**
 * Transforms the vec3 with a quat
 * Can also be used for dual quaternions. (Multiply it with the real part)
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to transform
 * @param {ReadonlyQuat} q quaternion to transform with
 * @returns {vec3} out
 */

function transformQuat(out, a, q) {
  // benchmarks: https://jsperf.com/quaternion-transform-vec3-implementations-fixed
  var qx = q[0],
      qy = q[1],
      qz = q[2],
      qw = q[3];
  var x = a[0],
      y = a[1],
      z = a[2]; // var qvec = [qx, qy, qz];
  // var uv = vec3.cross([], qvec, a);

  var uvx = qy * z - qz * y,
      uvy = qz * x - qx * z,
      uvz = qx * y - qy * x; // var uuv = vec3.cross([], qvec, uv);

  var uuvx = qy * uvz - qz * uvy,
      uuvy = qz * uvx - qx * uvz,
      uuvz = qx * uvy - qy * uvx; // vec3.scale(uv, uv, 2 * w);

  var w2 = qw * 2;
  uvx *= w2;
  uvy *= w2;
  uvz *= w2; // vec3.scale(uuv, uuv, 2);

  uuvx *= 2;
  uuvy *= 2;
  uuvz *= 2; // return vec3.add(out, a, vec3.add(out, uv, uuv));

  out[0] = x + uvx + uuvx;
  out[1] = y + uvy + uuvy;
  out[2] = z + uvz + uuvz;
  return out;
}
/**
 * Rotate a 3D vector around the x-axis
 * @param {vec3} out The receiving vec3
 * @param {ReadonlyVec3} a The vec3 point to rotate
 * @param {ReadonlyVec3} b The origin of the rotation
 * @param {Number} rad The angle of rotation in radians
 * @returns {vec3} out
 */

function rotateX(out, a, b, rad) {
  var p = [],
      r = []; //Translate point to the origin

  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2]; //perform rotation

  r[0] = p[0];
  r[1] = p[1] * Math.cos(rad) - p[2] * Math.sin(rad);
  r[2] = p[1] * Math.sin(rad) + p[2] * Math.cos(rad); //translate to correct position

  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
/**
 * Rotate a 3D vector around the y-axis
 * @param {vec3} out The receiving vec3
 * @param {ReadonlyVec3} a The vec3 point to rotate
 * @param {ReadonlyVec3} b The origin of the rotation
 * @param {Number} rad The angle of rotation in radians
 * @returns {vec3} out
 */

function rotateY(out, a, b, rad) {
  var p = [],
      r = []; //Translate point to the origin

  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2]; //perform rotation

  r[0] = p[2] * Math.sin(rad) + p[0] * Math.cos(rad);
  r[1] = p[1];
  r[2] = p[2] * Math.cos(rad) - p[0] * Math.sin(rad); //translate to correct position

  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
/**
 * Rotate a 3D vector around the z-axis
 * @param {vec3} out The receiving vec3
 * @param {ReadonlyVec3} a The vec3 point to rotate
 * @param {ReadonlyVec3} b The origin of the rotation
 * @param {Number} rad The angle of rotation in radians
 * @returns {vec3} out
 */

function rotateZ(out, a, b, rad) {
  var p = [],
      r = []; //Translate point to the origin

  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2]; //perform rotation

  r[0] = p[0] * Math.cos(rad) - p[1] * Math.sin(rad);
  r[1] = p[0] * Math.sin(rad) + p[1] * Math.cos(rad);
  r[2] = p[2]; //translate to correct position

  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
/**
 * Get the angle between two 3D vectors
 * @param {ReadonlyVec3} a The first operand
 * @param {ReadonlyVec3} b The second operand
 * @returns {Number} The angle in radians
 */

function angle(a, b) {
  var ax = a[0],
      ay = a[1],
      az = a[2],
      bx = b[0],
      by = b[1],
      bz = b[2],
      mag1 = Math.sqrt(ax * ax + ay * ay + az * az),
      mag2 = Math.sqrt(bx * bx + by * by + bz * bz),
      mag = mag1 * mag2,
      cosine = mag && dot(a, b) / mag;
  return Math.acos(Math.min(Math.max(cosine, -1), 1));
}
/**
 * Set the components of a vec3 to zero
 *
 * @param {vec3} out the receiving vector
 * @returns {vec3} out
 */

function zero(out) {
  out[0] = 0.0;
  out[1] = 0.0;
  out[2] = 0.0;
  return out;
}
/**
 * Returns a string representation of a vector
 *
 * @param {ReadonlyVec3} a vector to represent as a string
 * @returns {String} string representation of the vector
 */

function str(a) {
  return "vec3(" + a[0] + ", " + a[1] + ", " + a[2] + ")";
}
/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param {ReadonlyVec3} a The first vector.
 * @param {ReadonlyVec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}
/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {ReadonlyVec3} a The first vector.
 * @param {ReadonlyVec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

function equals(a, b) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2];
  var b0 = b[0],
      b1 = b[1],
      b2 = b[2];
  return Math.abs(a0 - b0) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2));
}
/**
 * Alias for {@link vec3.subtract}
 * @function
 */

var sub = subtract;
/**
 * Alias for {@link vec3.multiply}
 * @function
 */

var mul = multiply;
/**
 * Alias for {@link vec3.divide}
 * @function
 */

var div = divide;
/**
 * Alias for {@link vec3.distance}
 * @function
 */

var dist = distance;
/**
 * Alias for {@link vec3.squaredDistance}
 * @function
 */

var sqrDist = squaredDistance;
/**
 * Alias for {@link vec3.length}
 * @function
 */

var len = length;
/**
 * Alias for {@link vec3.squaredLength}
 * @function
 */

var sqrLen = squaredLength;
/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

var forEach = function () {
  var vec = create();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 3;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
    }

    return a;
  };
}();

/***/ }),

/***/ "./node_modules/gl-matrix/esm/vec4.js":
/*!********************************************!*\
  !*** ./node_modules/gl-matrix/esm/vec4.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   add: () => (/* binding */ add),
/* harmony export */   ceil: () => (/* binding */ ceil),
/* harmony export */   clone: () => (/* binding */ clone),
/* harmony export */   copy: () => (/* binding */ copy),
/* harmony export */   create: () => (/* binding */ create),
/* harmony export */   cross: () => (/* binding */ cross),
/* harmony export */   dist: () => (/* binding */ dist),
/* harmony export */   distance: () => (/* binding */ distance),
/* harmony export */   div: () => (/* binding */ div),
/* harmony export */   divide: () => (/* binding */ divide),
/* harmony export */   dot: () => (/* binding */ dot),
/* harmony export */   equals: () => (/* binding */ equals),
/* harmony export */   exactEquals: () => (/* binding */ exactEquals),
/* harmony export */   floor: () => (/* binding */ floor),
/* harmony export */   forEach: () => (/* binding */ forEach),
/* harmony export */   fromValues: () => (/* binding */ fromValues),
/* harmony export */   inverse: () => (/* binding */ inverse),
/* harmony export */   len: () => (/* binding */ len),
/* harmony export */   length: () => (/* binding */ length),
/* harmony export */   lerp: () => (/* binding */ lerp),
/* harmony export */   max: () => (/* binding */ max),
/* harmony export */   min: () => (/* binding */ min),
/* harmony export */   mul: () => (/* binding */ mul),
/* harmony export */   multiply: () => (/* binding */ multiply),
/* harmony export */   negate: () => (/* binding */ negate),
/* harmony export */   normalize: () => (/* binding */ normalize),
/* harmony export */   random: () => (/* binding */ random),
/* harmony export */   round: () => (/* binding */ round),
/* harmony export */   scale: () => (/* binding */ scale),
/* harmony export */   scaleAndAdd: () => (/* binding */ scaleAndAdd),
/* harmony export */   set: () => (/* binding */ set),
/* harmony export */   sqrDist: () => (/* binding */ sqrDist),
/* harmony export */   sqrLen: () => (/* binding */ sqrLen),
/* harmony export */   squaredDistance: () => (/* binding */ squaredDistance),
/* harmony export */   squaredLength: () => (/* binding */ squaredLength),
/* harmony export */   str: () => (/* binding */ str),
/* harmony export */   sub: () => (/* binding */ sub),
/* harmony export */   subtract: () => (/* binding */ subtract),
/* harmony export */   transformMat4: () => (/* binding */ transformMat4),
/* harmony export */   transformQuat: () => (/* binding */ transformQuat),
/* harmony export */   zero: () => (/* binding */ zero)
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common.js */ "./node_modules/gl-matrix/esm/common.js");

/**
 * 4 Dimensional Vector
 * @module vec4
 */

/**
 * Creates a new, empty vec4
 *
 * @returns {vec4} a new 4D vector
 */

function create() {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(4);

  if (_common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
  }

  return out;
}
/**
 * Creates a new vec4 initialized with values from an existing vector
 *
 * @param {ReadonlyVec4} a vector to clone
 * @returns {vec4} a new 4D vector
 */

function clone(a) {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(4);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}
/**
 * Creates a new vec4 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} a new 4D vector
 */

function fromValues(x, y, z, w) {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(4);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = w;
  return out;
}
/**
 * Copy the values from one vec4 to another
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the source vector
 * @returns {vec4} out
 */

function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}
/**
 * Set the components of a vec4 to the given values
 *
 * @param {vec4} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} out
 */

function set(out, x, y, z, w) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = w;
  return out;
}
/**
 * Adds two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {vec4} out
 */

function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  return out;
}
/**
 * Subtracts vector b from vector a
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {vec4} out
 */

function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  return out;
}
/**
 * Multiplies two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {vec4} out
 */

function multiply(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  out[3] = a[3] * b[3];
  return out;
}
/**
 * Divides two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {vec4} out
 */

function divide(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  out[3] = a[3] / b[3];
  return out;
}
/**
 * Math.ceil the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a vector to ceil
 * @returns {vec4} out
 */

function ceil(out, a) {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  out[2] = Math.ceil(a[2]);
  out[3] = Math.ceil(a[3]);
  return out;
}
/**
 * Math.floor the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a vector to floor
 * @returns {vec4} out
 */

function floor(out, a) {
  out[0] = Math.floor(a[0]);
  out[1] = Math.floor(a[1]);
  out[2] = Math.floor(a[2]);
  out[3] = Math.floor(a[3]);
  return out;
}
/**
 * Returns the minimum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {vec4} out
 */

function min(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  out[2] = Math.min(a[2], b[2]);
  out[3] = Math.min(a[3], b[3]);
  return out;
}
/**
 * Returns the maximum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {vec4} out
 */

function max(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  out[2] = Math.max(a[2], b[2]);
  out[3] = Math.max(a[3], b[3]);
  return out;
}
/**
 * Math.round the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a vector to round
 * @returns {vec4} out
 */

function round(out, a) {
  out[0] = Math.round(a[0]);
  out[1] = Math.round(a[1]);
  out[2] = Math.round(a[2]);
  out[3] = Math.round(a[3]);
  return out;
}
/**
 * Scales a vec4 by a scalar number
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec4} out
 */

function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  return out;
}
/**
 * Adds two vec4's after scaling the second operand by a scalar value
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec4} out
 */

function scaleAndAdd(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  out[2] = a[2] + b[2] * scale;
  out[3] = a[3] + b[3] * scale;
  return out;
}
/**
 * Calculates the euclidian distance between two vec4's
 *
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {Number} distance between a and b
 */

function distance(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  var w = b[3] - a[3];
  return Math.hypot(x, y, z, w);
}
/**
 * Calculates the squared euclidian distance between two vec4's
 *
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {Number} squared distance between a and b
 */

function squaredDistance(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  var w = b[3] - a[3];
  return x * x + y * y + z * z + w * w;
}
/**
 * Calculates the length of a vec4
 *
 * @param {ReadonlyVec4} a vector to calculate length of
 * @returns {Number} length of a
 */

function length(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var w = a[3];
  return Math.hypot(x, y, z, w);
}
/**
 * Calculates the squared length of a vec4
 *
 * @param {ReadonlyVec4} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */

function squaredLength(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var w = a[3];
  return x * x + y * y + z * z + w * w;
}
/**
 * Negates the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a vector to negate
 * @returns {vec4} out
 */

function negate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] = -a[3];
  return out;
}
/**
 * Returns the inverse of the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a vector to invert
 * @returns {vec4} out
 */

function inverse(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  out[3] = 1.0 / a[3];
  return out;
}
/**
 * Normalize a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a vector to normalize
 * @returns {vec4} out
 */

function normalize(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var w = a[3];
  var len = x * x + y * y + z * z + w * w;

  if (len > 0) {
    len = 1 / Math.sqrt(len);
  }

  out[0] = x * len;
  out[1] = y * len;
  out[2] = z * len;
  out[3] = w * len;
  return out;
}
/**
 * Calculates the dot product of two vec4's
 *
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {Number} dot product of a and b
 */

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
}
/**
 * Returns the cross-product of three vectors in a 4-dimensional space
 *
 * @param {ReadonlyVec4} result the receiving vector
 * @param {ReadonlyVec4} U the first vector
 * @param {ReadonlyVec4} V the second vector
 * @param {ReadonlyVec4} W the third vector
 * @returns {vec4} result
 */

function cross(out, u, v, w) {
  var A = v[0] * w[1] - v[1] * w[0],
      B = v[0] * w[2] - v[2] * w[0],
      C = v[0] * w[3] - v[3] * w[0],
      D = v[1] * w[2] - v[2] * w[1],
      E = v[1] * w[3] - v[3] * w[1],
      F = v[2] * w[3] - v[3] * w[2];
  var G = u[0];
  var H = u[1];
  var I = u[2];
  var J = u[3];
  out[0] = H * F - I * E + J * D;
  out[1] = -(G * F) + I * C - J * B;
  out[2] = G * E - H * C + J * A;
  out[3] = -(G * D) + H * B - I * A;
  return out;
}
/**
 * Performs a linear interpolation between two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec4} out
 */

function lerp(out, a, b, t) {
  var ax = a[0];
  var ay = a[1];
  var az = a[2];
  var aw = a[3];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  out[3] = aw + t * (b[3] - aw);
  return out;
}
/**
 * Generates a random vector with the given scale
 *
 * @param {vec4} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec4} out
 */

function random(out, scale) {
  scale = scale || 1.0; // Marsaglia, George. Choosing a Point from the Surface of a
  // Sphere. Ann. Math. Statist. 43 (1972), no. 2, 645--646.
  // http://projecteuclid.org/euclid.aoms/1177692644;

  var v1, v2, v3, v4;
  var s1, s2;

  do {
    v1 = _common_js__WEBPACK_IMPORTED_MODULE_0__.RANDOM() * 2 - 1;
    v2 = _common_js__WEBPACK_IMPORTED_MODULE_0__.RANDOM() * 2 - 1;
    s1 = v1 * v1 + v2 * v2;
  } while (s1 >= 1);

  do {
    v3 = _common_js__WEBPACK_IMPORTED_MODULE_0__.RANDOM() * 2 - 1;
    v4 = _common_js__WEBPACK_IMPORTED_MODULE_0__.RANDOM() * 2 - 1;
    s2 = v3 * v3 + v4 * v4;
  } while (s2 >= 1);

  var d = Math.sqrt((1 - s1) / s2);
  out[0] = scale * v1;
  out[1] = scale * v2;
  out[2] = scale * v3 * d;
  out[3] = scale * v4 * d;
  return out;
}
/**
 * Transforms the vec4 with a mat4.
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the vector to transform
 * @param {ReadonlyMat4} m matrix to transform with
 * @returns {vec4} out
 */

function transformMat4(out, a, m) {
  var x = a[0],
      y = a[1],
      z = a[2],
      w = a[3];
  out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
  out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
  out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
  out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
  return out;
}
/**
 * Transforms the vec4 with a quat
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the vector to transform
 * @param {ReadonlyQuat} q quaternion to transform with
 * @returns {vec4} out
 */

function transformQuat(out, a, q) {
  var x = a[0],
      y = a[1],
      z = a[2];
  var qx = q[0],
      qy = q[1],
      qz = q[2],
      qw = q[3]; // calculate quat * vec

  var ix = qw * x + qy * z - qz * y;
  var iy = qw * y + qz * x - qx * z;
  var iz = qw * z + qx * y - qy * x;
  var iw = -qx * x - qy * y - qz * z; // calculate result * inverse quat

  out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
  out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
  out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
  out[3] = a[3];
  return out;
}
/**
 * Set the components of a vec4 to zero
 *
 * @param {vec4} out the receiving vector
 * @returns {vec4} out
 */

function zero(out) {
  out[0] = 0.0;
  out[1] = 0.0;
  out[2] = 0.0;
  out[3] = 0.0;
  return out;
}
/**
 * Returns a string representation of a vector
 *
 * @param {ReadonlyVec4} a vector to represent as a string
 * @returns {String} string representation of the vector
 */

function str(a) {
  return "vec4(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ")";
}
/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param {ReadonlyVec4} a The first vector.
 * @param {ReadonlyVec4} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}
/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {ReadonlyVec4} a The first vector.
 * @param {ReadonlyVec4} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

function equals(a, b) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3];
  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];
  return Math.abs(a0 - b0) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3));
}
/**
 * Alias for {@link vec4.subtract}
 * @function
 */

var sub = subtract;
/**
 * Alias for {@link vec4.multiply}
 * @function
 */

var mul = multiply;
/**
 * Alias for {@link vec4.divide}
 * @function
 */

var div = divide;
/**
 * Alias for {@link vec4.distance}
 * @function
 */

var dist = distance;
/**
 * Alias for {@link vec4.squaredDistance}
 * @function
 */

var sqrDist = squaredDistance;
/**
 * Alias for {@link vec4.length}
 * @function
 */

var len = length;
/**
 * Alias for {@link vec4.squaredLength}
 * @function
 */

var sqrLen = squaredLength;
/**
 * Perform some operation over an array of vec4s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

var forEach = function () {
  var vec = create();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 4;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      vec[3] = a[i + 3];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
      a[i + 3] = vec[3];
    }

    return a;
  };
}();

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./ExampleApp/index.ts");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=index.js.map