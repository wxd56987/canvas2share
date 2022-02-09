"use strict";
exports.__esModule = true;
var CanvasDrawer = /** @class */ (function () {
    /**
     *
     * @param ctx canvas 上下文
     */
    function CanvasDrawer(ctxId, ratio) {
        if (ratio === void 0) { ratio = 1; }
        this.canvas = document.getElementById(ctxId);
        // 计算dpr 设备像素比（dpr） = 设备像素（分辨率）/设备独立像素（屏幕尺寸）
        var dpr = window.devicePixelRatio;
        var _a = this.canvas.getBoundingClientRect(), cssWidth = _a.width, cssHeight = _a.height;
        this.canvas.style.width = this.canvas.width + "px";
        this.canvas.style.height = this.canvas.height + "px";
        this.canvas.width = dpr * cssWidth;
        this.canvas.height = dpr * cssHeight;
        this.ctx = this.canvas.getContext("2d");
        this.ctx.scale(dpr, dpr);
        this.ratio = ratio;
    }
    /**
     * 绘制矩形
     * @param x 矩形左上角x轴坐标
     * @param y 矩形左上角y轴坐标
     * @param options 长, 宽, 颜色, 圆角（如果有）
     */
    CanvasDrawer.prototype.rect = function (x, y, options) {
        var width = options.width, height = options.height, color = options.color, _a = options.radius, radius = _a === void 0 ? 0 : _a;
        // 设置填充颜色
        this.ctx.fillStyle = color;
        if (radius) {
            // 如果有圆角则绘制圆角
            this.rectRadius(x, y, options);
        }
        else {
            // 否则直接绘制矩形
            this.ctx.fillRect(this.getCalcNum(x), this.getCalcNum(y), this.getCalcNum(width), this.getCalcNum(height));
        }
    };
    /**
     * 圆角矩形
     * @param x 矩形左上角x坐标
     * @param y 矩形左上角y坐标
     * @param options 矩形宽、高、颜色、圆角
     */
    CanvasDrawer.prototype.rectRadius = function (x, y, options) {
        var _this = this;
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (options === void 0) { options = {}; }
        var w = options.width, h = options.height, _a = options.color, color = _a === void 0 ? "#fff" : _a, _b = options.radius, r = _b === void 0 ? 3 : _b;
        var _c = [x, y, w, h].map(function (item) {
            return _this.getCalcNum(item);
        }), calcX = _c[0], calcY = _c[1], calcW = _c[2], calcH = _c[3];
        this.ctx.beginPath();
        this.ctx.arc(calcX + r, calcY + r, r, Math.PI, Math.PI * 1.5);
        this.ctx.moveTo(calcX + r, calcY);
        this.ctx.lineTo(calcX + calcW - r, calcY);
        this.ctx.lineTo(calcX + calcW, calcY + r);
        this.ctx.arc(calcX + calcW - r, calcY + r, r, Math.PI * 1.5, Math.PI * 2);
        this.ctx.lineTo(calcX + calcW, calcY + calcH - r);
        this.ctx.lineTo(calcX + calcW - r, calcY + calcH);
        this.ctx.arc(calcX + calcW - r, calcY + calcH - r, r, 0, Math.PI * 0.5);
        this.ctx.lineTo(calcX + r, calcY + calcH);
        this.ctx.lineTo(calcX, calcY + calcH - r);
        this.ctx.arc(calcX + r, calcY + calcH - r, r, Math.PI * 0.5, Math.PI);
        this.ctx.lineTo(calcX, calcY + r);
        this.ctx.lineTo(calcX + r, calcY);
        this.ctx.strokeStyle = color;
        this.ctx.stroke();
        // 填充
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.closePath();
    };
    /**
     * 绘制圆
     *
     * 仅创建路径 不绘制
     * @param x 圆心 x 坐标
     * @param y 圆心 y 坐标
     * @param radius 圆半径
     * @param options 圆弧角度、方向等其他参数
     */
    CanvasDrawer.prototype.arc = function (x, y, radius, options) {
        var _this = this;
        if (radius === void 0) { radius = 10; }
        var _a = options.sAngle, sAngle = _a === void 0 ? 0 : _a, _b = options.eAngle, eAngle = _b === void 0 ? 2 * Math.PI : _b, _c = options.ccw, ccw = _c === void 0 ? false : _c, color = options.color;
        var _d = [x, y, radius].map(function (i) {
            return Math.floor(_this.getCalcNum(i));
        }), calcX = _d[0], calcY = _d[1], calcR = _d[2];
        // 绘制
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(calcX, calcY, calcR, sAngle, eAngle, ccw);
        this.ctx.stroke();
    };
    /**
     * 绘制线段
     * @param x1 起始点x轴坐标
     * @param y1 起始点y轴坐标
     * @param x2 终点x轴坐标
     * @param y2 终点y轴坐标
     * @param color 线段颜色
     */
    CanvasDrawer.prototype.line = function (x1, y1, x2, y2, color) {
        if (color === void 0) { color = "#fff"; }
        // 创建路径
        this.ctx.beginPath();
        // 移动至起点
        this.ctx.moveTo(this.getCalcNum(x1), this.getCalcNum(y1));
        // 移动至终点
        this.ctx.lineTo(this.getCalcNum(x2), this.getCalcNum(y2));
        // 设置描边颜色
        this.ctx.strokeStyle = color;
        // 描边
        this.ctx.stroke();
        // 关闭路径
        this.ctx.closePath();
    };
    /**
     * 绘制文本，支持自动换行
     * @param text 文字内容
     * @param x 文本框左上角 x 坐标
     * @param y 文本框左上角 y 坐标
     * @param fontOptions 字体大小、颜色、行高、样式
     * @param width 文本框宽度
     * @param rowCount 文本行数
     *
     * @return 文本区域左下角坐标
     */
    CanvasDrawer.prototype.fillText = function (text, x, y, fontOptions, width, rowCount) {
        var _this = this;
        if (fontOptions === void 0) { fontOptions = ""; }
        if (width === void 0) { width = 750; }
        if (rowCount === void 0) { rowCount = 1; }
        var _a = fontOptions.split(" "), _b = _a[0], fontSize = _b === void 0 ? 20 : _b, _c = _a[1], color = _c === void 0 ? "#000" : _c, _d = _a[2], lineHeight = _d === void 0 ? 1 : _d, _e = _a[3], fontStyle = _e === void 0 ? "normal" : _e, _f = _a[4], align = _f === void 0 ? "left" : _f;
        // 保存绘图上下文
        this.ctx.save();
        // 设置字号
        this.ctx.font = "".concat(this.getCalcNum(fontSize), "px sans-serif");
        this.ctx.fillStyle = color;
        this.ctx.textBaseline = "middle";
        this.ctx.textAlign = align;
        var alignY = y + (fontSize * lineHeight) / 2;
        var rows = this.wrapText(text, {
            width: this.getCalcNum(width),
            rowCount: rowCount
        });
        rows.forEach(function (row, rowIdx) {
            _this.textWithRatio(row, x, alignY + rowIdx * lineHeight * fontSize, "".concat(fontSize, " ").concat(fontStyle));
        });
        this.ctx.restore();
        // 如果文字不足一行，那么返回该行宽度
        var rowWidth = rows.length === 1
            ? this.ctx.measureText(rows[0]).width / this.ratio
            : width;
        return {
            width: rowWidth,
            x: x,
            y: y + rows.length * lineHeight * fontSize
        };
    };
    /**
     * 绘制单行文本
     * @param text 文本
     * @param x 文本框左上角x坐标
     * @param y 文本框左上角y坐标
     * @param options 字体、加粗样式
     */
    CanvasDrawer.prototype.textWithRatio = function (text, x, y, options) {
        if (options === void 0) { options = ""; }
        var calcX = this.getCalcNum(x);
        var calcY = this.getCalcNum(y);
        var _a = options.split(" "), fontSize = _a[0], boldStyle = _a[1];
        this.ctx.fillText(text, calcX, calcY);
        if (boldStyle === "bold") {
            var offset = this.calculateOffset(fontSize);
            this.ctx.fillText(text, calcX + offset, calcY + offset);
        }
    };
    /**
     * 根据字体大小估算字体加粗所需偏移量，用于兼容安卓设备
     * @param fontSize 字体大小
     */
    CanvasDrawer.prototype.calculateOffset = function (fontSize) {
        if (fontSize >= 26) {
            return 0.3;
        }
        return 0.2;
    };
    /**
     * 将整段文字按行转换为数组返回
     * @param text 文字内容
     * @param options 文本框宽度、行数
     */
    CanvasDrawer.prototype.wrapText = function (text, options) {
        if (options === void 0) { options = {}; }
        var X = options.width;
        var rowCount = options.rowCount; // 行数
        var ASCIICalcWIDTH = this.ctx.measureText("a").width; // 单字节字符宽度，并不绝对准确，实际 . 和 a 的文字宽度不同
        var CNCalcWIDTH = this.ctx.measureText("字").width; // 中文字符宽度
        var rows = [];
        var textLen = text.length;
        for (var i = 0, currentX = 0, rowIdx = 0; i < textLen && rowIdx < rowCount; i++) {
            var s = text[i]; // 当前字符
            // 字符宽度
            var w = /[\u0000-\u00FF]/.test(s) ? ASCIICalcWIDTH : CNCalcWIDTH; // eslint-disable-line no-control-regex
            if (currentX + w <= X) {
                // 更新当前行 || 增加第一行
                if (rows[rowIdx]) {
                    rows[rowIdx] += s;
                }
                else {
                    rows.push(s);
                }
                currentX += w;
            }
            else if (rowIdx + 1 < rowCount) {
                // 另起一行
                rows.push(s);
                currentX = w;
                rowIdx++;
            }
            else {
                // 文本超过展示行数
                var rowLen = rows[rowIdx].length;
                rows[rowIdx] = "".concat(rows[rowIdx].substring(0, rowLen - 2), "...");
                rowIdx++;
            }
        }
        return rows.map(function (row) { return row.trim(); });
    };
    /**
     * 图片
     * @param x 图片x轴坐标
     * @param y 图片y轴坐标
     * @param options 长、宽、图像地址（必须为本地地址）
     */
    CanvasDrawer.prototype.image = function (x, y, options) {
        var _this = this;
        var width = options.width, height = options.height, image = options.image;
        var img = new Image(); // 创建img元素
        img.crossOrigin = "anonymous";
        img.src = image; // 设置图片源地址
        return new Promise(function (resolve) {
            img.onload = function () {
                _this.ctx.drawImage(img, _this.getCalcNum(x), _this.getCalcNum(y), _this.getCalcNum(width), _this.getCalcNum(height));
                resolve();
            };
        });
    };
    /**
     * 圆形图片
     * @param x 图片x轴坐标
     * @param y 图片y轴坐标
     * @param options 长、宽、图像地址（必须为本地地址）
     */
    CanvasDrawer.prototype.circleImage = function (x, y, options) {
        var _this = this;
        var width = options.width, height = options.height, image = options.image;
        // 绘制裁剪路径
        this.ctx.strokeStyle = "transparent";
        this.ctx.beginPath();
        this.ctx.arc(this.getCalcNum(x + width / 2), this.getCalcNum(y + height / 2), this.getCalcNum(width) / 2, 0, Math.PI * 2, false);
        this.ctx.stroke();
        this.ctx.clip();
        var img = new Image(); // 创建img元素
        img.crossOrigin = "anonymous";
        img.src = image; // 设置图片源地址
        img.onload = function () {
            _this.ctx.drawImage(img, _this.getCalcNum(x), _this.getCalcNum(y), _this.getCalcNum(width), _this.getCalcNum(height));
        };
    };
    /**
     * 圆角图片
     * @param x 图片x轴坐标
     * @param y 图片y轴坐标
     * @param radius 圆角
     * @param options 长、宽、图像地址（必须为本地地址）
     */
    CanvasDrawer.prototype.radiusImage = function (x, y, options) {
        var _this = this;
        var width = options.width, height = options.height, image = options.image;
        // 绘制裁剪路径
        this.rectRadius(x, y, options);
        this.ctx.clip();
        var img = new Image(); // 创建img元素
        img.crossOrigin = "anonymous";
        img.src = image; // 设置图片源地址
        img.onload = function () {
            _this.ctx.drawImage(img, _this.getCalcNum(x), _this.getCalcNum(y), _this.getCalcNum(width), _this.getCalcNum(height));
        };
    };
    /**
     * 生成图片
     */
    CanvasDrawer.prototype.generateImage = function () {
        return this.canvas.toDataURL("image/png");
    };
    /**
     * 将数值转换为按比例计算后的值
     *
     * @param data
     * @param args 待转换的数值
     * @return 转换后的值
     */
    CanvasDrawer.prototype.getCalcNum = function (data) {
        return data * this.ratio;
    };
    return CanvasDrawer;
}());
exports["default"] = CanvasDrawer;
