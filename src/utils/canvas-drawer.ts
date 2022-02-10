interface RectOptions {
  /**
   * 矩形宽
   */
  width: number;
  /**
   * 矩形高
   */
  height: number;
  /**
   * 矩形填充色
   */
  color: string;
  /**
   * 倒角尺寸
   */
  radius?: number;
}

interface ImageOptions {
  /**
   * 图片宽
   */
  width: number;
  /**
   * 图片高
   */
  height: number;
  /**
   * 图片地址
   */
  image: CanvasImageSource;
}

interface ArcOptions {
  /**
   * 起始弧度，单位弧度（在3点钟方向）
   */
  sAngle?: number;
  /**
   * 终止弧度
   */
  eAngle?: number;
  /**
   * 弧度的方向是否是逆时针
   */
  ccw?: boolean;
  /**
   * 填充色
   */
  color: string;
}

interface TextCalcValue {
  /**
   * 文字第一行宽度
   */
  width: number;
  /**
   * 文字左下角x轴坐标
   */
  x: number;
  /**
   * 文字左下角y轴坐标
   */
  y: number;
}

/**
 * 默认对象类型参数
 */
interface DefaultOptions {
  [propName: string]: any;
}

interface CanvasDrawerInterface {
  rect(x: number, y: number, options: RectOptions): void;
  line(x1: number, y1: number, x2: number, y2: number, color?: string): void;
  image(x: number, y: number, options: ImageOptions): void;
  circleImage(x: number, y: number, options: ImageOptions): void;
  radiusImage(x: number, y: number, options: ImageOptions): void;
  arc(x: number, y: number, radius?: number, options?: ArcOptions): void;
  fillText(
    text: string,
    x: number,
    y: number,
    fontOptions: string,
    width: number,
    rowCount: number
  ): TextCalcValue;
}

export default class CanvasDrawer implements CanvasDrawerInterface {
  /**
   * canvas id
   */
  public ctxId: string | undefined;

  /**
   * canvas 上下文
   */
  public ctx: CanvasRenderingContext2D;

  /**
   * rpx2px 比率
   */
  public ratio: number;

  /**
   * canvas
   */
  public canvas: HTMLCanvasElement;

  /**
   *
   * @param ctx canvas 上下文
   */
  constructor(ctxId: string, ratio = 1) {
    this.canvas = document.getElementById(ctxId) as HTMLCanvasElement;

    // 计算dpr 设备像素比（dpr） = 设备像素（分辨率）/设备独立像素（屏幕尺寸）
    const dpr = window.devicePixelRatio;
    const { width: cssWidth, height: cssHeight } =
      this.canvas.getBoundingClientRect();
    this.canvas.style.width = this.canvas.width + "px";
    this.canvas.style.height = this.canvas.height + "px";

    this.canvas.width = dpr * cssWidth;
    this.canvas.height = dpr * cssHeight;

    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.ctx.scale(dpr, dpr);
    this.ratio = ratio;
  }

  /**
   * 绘制矩形
   * @param x 矩形左上角x轴坐标
   * @param y 矩形左上角y轴坐标
   * @param options 长, 宽, 颜色, 圆角（如果有）
   */
  public rect(x: number, y: number, options: RectOptions): void {
    const { width, height, color, radius = 0 } = options;

    // 设置填充颜色
    this.ctx.fillStyle = color;

    if (radius) {
      // 如果有圆角则绘制圆角
      this.rectRadius(x, y, options);
    } else {
      // 否则直接绘制矩形
      this.ctx.fillRect(
        this.getCalcNum(x),
        this.getCalcNum(y),
        this.getCalcNum(width),
        this.getCalcNum(height)
      );
    }
  }

  /**
   * 圆角矩形
   * @param x 矩形左上角x坐标
   * @param y 矩形左上角y坐标
   * @param options 矩形宽、高、颜色、圆角
   */
  private rectRadius(x = 0, y = 0, options: DefaultOptions = {}): void {
    const { width: w, height: h, color = "#fff", radius: r = 8 } = options;
    const [calcX, calcY, calcW, calcH] = [x, y, w, h].map((item) =>
      this.getCalcNum(item)
    );

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
  }

  /**
   * 绘制圆
   *
   * 仅创建路径 不绘制
   * @param x 圆心 x 坐标
   * @param y 圆心 y 坐标
   * @param radius 圆半径
   * @param options 圆弧角度、方向等其他参数
   */
  public arc(x: number, y: number, radius = 10, options: ArcOptions): void {
    const { sAngle = 0, eAngle = 2 * Math.PI, ccw = false, color } = options;

    const [calcX, calcY, calcR] = [x, y, radius].map((i) =>
      Math.floor(this.getCalcNum(i))
    );

    // 绘制
    this.ctx.strokeStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(calcX, calcY, calcR, sAngle, eAngle, ccw);
    this.ctx.stroke();
  }

  /**
   * 绘制线段
   * @param x1 起始点x轴坐标
   * @param y1 起始点y轴坐标
   * @param x2 终点x轴坐标
   * @param y2 终点y轴坐标
   * @param color 线段颜色
   */
  public line(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color = "#fff"
  ): void {
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
  }

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
  public fillText(
    text: string,
    x: number,
    y: number,
    fontOptions = "",
    width = 750,
    rowCount = 1
  ): TextCalcValue {
    const [
      fontSize = 20,
      color = "#000",
      lineHeight = 1,
      fontStyle = "normal",
      align = "left",
    ]: any[] = fontOptions.split(" ");

    // 保存绘图上下文
    this.ctx.save();

    // 设置字号
    this.ctx.font = `${this.getCalcNum(fontSize)}px sans-serif`;
    this.ctx.fillStyle = color;
    this.ctx.textBaseline = "middle";
    this.ctx.textAlign = align;
    const alignY = y + (fontSize * lineHeight) / 2;
    const rows = this.wrapText(text, {
      width: this.getCalcNum(width),
      rowCount,
    });

    rows.forEach((row, rowIdx) => {
      this.textWithRatio(
        row,
        x,
        alignY + rowIdx * lineHeight * fontSize,
        `${fontSize} ${fontStyle}`
      );
    });
    this.ctx.restore();

    // 如果文字不足一行，那么返回该行宽度
    const rowWidth =
      rows.length === 1
        ? this.ctx.measureText(rows[0]).width / this.ratio
        : width;

    return {
      width: rowWidth,
      x,
      y: y + rows.length * lineHeight * fontSize,
    };
  }

  /**
   * 绘制单行文本
   * @param text 文本
   * @param x 文本框左上角x坐标
   * @param y 文本框左上角y坐标
   * @param options 字体、加粗样式
   */
  private textWithRatio(
    text: string,
    x: number,
    y: number,
    options = ""
  ): void {
    const calcX = this.getCalcNum(x);
    const calcY = this.getCalcNum(y);
    const [fontSize, boldStyle]: any[] = options.split(" ");

    this.ctx.fillText(text, calcX, calcY);

    if (boldStyle === "bold") {
      const offset = this.calculateOffset(fontSize);

      this.ctx.fillText(text, calcX + offset, calcY + offset);
    }
  }

  /**
   * 根据字体大小估算字体加粗所需偏移量，用于兼容安卓设备
   * @param fontSize 字体大小
   */
  private calculateOffset(fontSize: number): number {
    if (fontSize >= 26) {
      return 0.3;
    }

    return 0.2;
  }

  /**
   * 将整段文字按行转换为数组返回
   * @param text 文字内容
   * @param options 文本框宽度、行数
   */
  private wrapText(text: string, options: DefaultOptions = {}): string[] {
    const X = options.width;
    const { rowCount } = options; // 行数
    const ASCIICalcWIDTH = this.ctx.measureText("a").width; // 单字节字符宽度，并不绝对准确，实际 . 和 a 的文字宽度不同
    const CNCalcWIDTH = this.ctx.measureText("字").width; // 中文字符宽度
    const rows: string[] = [];
    const textLen = text.length;

    for (
      let i = 0, currentX = 0, rowIdx = 0;
      i < textLen && rowIdx < rowCount;
      i++
    ) {
      const s = text[i]; // 当前字符
      // 字符宽度
      const w = /[\u0000-\u00FF]/.test(s) ? ASCIICalcWIDTH : CNCalcWIDTH; // eslint-disable-line no-control-regex

      if (currentX + w <= X) {
        // 更新当前行 || 增加第一行
        if (rows[rowIdx]) {
          rows[rowIdx] += s;
        } else {
          rows.push(s);
        }

        currentX += w;
      } else if (rowIdx + 1 < rowCount) {
        // 另起一行
        rows.push(s);
        currentX = w;
        rowIdx++;
      } else {
        // 文本超过展示行数
        const rowLen = rows[rowIdx].length;

        rows[rowIdx] = `${rows[rowIdx].substring(0, rowLen - 2)}...`;
        rowIdx++;
      }
    }

    return rows.map((row) => row.trim());
  }

  /**
   * 图片
   * @param x 图片x轴坐标
   * @param y 图片y轴坐标
   * @param options 长、宽、图像地址（必须为本地地址）
   */
  public image(x: number, y: number, options: ImageOptions): void {
    const { width, height, image } = options;
    
    this.ctx.drawImage(
      image,
      this.getCalcNum(x),
      this.getCalcNum(y),
      this.getCalcNum(width),
      this.getCalcNum(height)
    );
  }

  /**
   * 圆形图片
   * @param x 图片x轴坐标
   * @param y 图片y轴坐标
   * @param options 长、宽、图像地址（必须为本地地址）
   */
  public circleImage(x: number, y: number, options: ImageOptions): void {
    const { width, height, image } = options;

    // 绘制裁剪路径
    this.ctx.strokeStyle = "transparent";
    this.ctx.beginPath();
    this.ctx.arc(
      this.getCalcNum(x + width / 2),
      this.getCalcNum(y + height / 2),
      this.getCalcNum(width) / 2,
      0,
      Math.PI * 2,
      false
    );
    this.ctx.stroke();

    this.ctx.clip();

    this.ctx.drawImage(
      image,
      this.getCalcNum(x),
      this.getCalcNum(y),
      this.getCalcNum(width),
      this.getCalcNum(height)
    );
  }

  /**
   * 圆角图片
   * @param x 图片x轴坐标
   * @param y 图片y轴坐标
   * @param radius 圆角
   * @param options 长、宽、图像地址（必须为本地地址）
   */
  public radiusImage(x: number, y: number, options: ImageOptions): void {
    const { width, height, image } = options;

    // 绘制裁剪路径
    this.rectRadius(x, y, options);

    this.ctx.clip();

    this.ctx.drawImage(
      image,
      this.getCalcNum(x),
      this.getCalcNum(y),
      this.getCalcNum(width),
      this.getCalcNum(height)
    );
  }

  /**
   * 生成图片
   */
  public generateImage(): string {
    return this.canvas.toDataURL("image/png");
  }

  /**
   * 将数值转换为按比例计算后的值
   *
   * @param data
   * @param args 待转换的数值
   * @return 转换后的值
   */
  private getCalcNum(data: number): number {
    return data * this.ratio;
  }
}
