<template>
  <div id="app">
    <button @click="generateQr">生成分享图</button>
    <canvas id="my-canvas" width="350" height="777"></canvas>
    <div>---------canvas-to-img--------------</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CanvasDrawer from "./utils/canvas-drawer";

@Component
export default class App extends Vue {
  ctx: any;
  qrimg: any =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAXNSR0IArs4c6QAABPxJREFUeF7tnNuuGjAMBMv/fzRV+0aQGK3WIafp9NXEcXZs53Ioj+fz+fzlv2sUeAj0GpZ/FyLQu3gK9DKeAhXobQpcth73UIFepsBly7FCBXqZApctxwoV6GUKXLYcK1Sglylw2XKsUIFepsBly6kr9PF4fFUS+vNtG8/qv/WXikPrI38CXRQSqBVKRRPZrdBFrrZFWqFLhbYZtqbzCoj80+fJ3s4fleOfr4wM6ze+h5LguxdMApFdoMMZ1gpKwMjezr87Ycm/FQrfYk0TgATfnTDbgaaHFDqUtPZVUNoiCOju9cUJ0n4v9/SC2/kFCtcEqiDKOBrf2q1QINBWCAmc+ifgNF+6x9lyIUEISGqnjrA7YSiBaH6K/y0Bb99DSRASNLXTfNMJKdDyDEBABLooQIKldhI4rUCan+aj8XTqJv/X30NRAHjpSoHTfAItBSeBU2AEhOaj8VZo+ZYs0PJQMZ3BBITmo/Gpneb75yuUFkj2VFASjO6F6cMCxU92Wh+N//q1JQ0oFZQEoZcc2rPI/+71pf63n3LTgATa/SiNQP176GsNUUtrK5T2PGqJ0/bp9dD60vnGKzQNIP08HXp229N408/Tnk7+BBo+XJCgrV2gIZC2gltgNP44UApwtz3dw1vBdq+n9V+33DaAdrxAl0Nq+wfuFkg7XqACbXPoR4+vW256z2vVoD0wjSf1tzv+1r9Aw5eiVnBKoNa/QAX6+emP7nltBlKG23JJISCQnjLp7ZKArOPbz1M8lICn53/To722CPT1R0OoPkgvGo8JJtBXiVJBrdAlxWjPJYFPC3p6/vGWS3sa7VEkCNmxBYWP9+SPEqzVg+Yne31taRdAwMiOCxQoSfTZnm76BIzsFC2Np3ipw6Tzt/5wvvZQZIXOJjgBI/v2lkuHHgqQxk/vaWkF7a5w0ufrhyICQgHTeIG+KmiFQkZRwlih4Y89WqHUw4YrlDKUgGThvn+aKoj8U/w0ntZH8dEpnOYf30NJEFpwGnB6aCH/FD+Np/UJlBRc7CQYuRPoohAJQhlMgpNdoMN7KAm+204JRS263cPS8RRvnaDTL0W7Ab4dAn7YqZmACBQyhASyQr9dYuV8Ah3eQ1NBS36/qKWRf9rzaD3p/NP+cH3tHkoBUwCpPRWU9tz0FJ7OT/qk/kiv+i2XAqYAUnsrgBU6fChJAdKhJvUn0BBoW0HTLTJNCAJO8aUJlsZH/sdbrkBJ8s/2Vj+BLvpaoeWPJ1I+k8DpoYwqgOb771tuKzgJnPqnPSv1R9ee6QTCApi+h9ICKSAaT3byL9DylLs741P/AhXoRwWoY9hyl/9RPb2HtgDoUEQA0y0h/fz2a0vaElPBd/snQSnhaPy0XaDltUugkJJWaFez11co7Wltyyb5v13BAi2/kyTQL7dcK5RSLnzMblsatSzyL9BhoKG7t48TUPKfAk/nI//0MkXxp/bte2ga0PTFnQRPT9UUH62XOgaNJ7tAw5cpgVJKlW/F5N4KJYXgUBQOjz+etkjaEwk4BTgdD81H9vGWSxO29mkBBWqFvigwnWBtwluh4UsRXUPSFj996q2Bthnl+FkFBDqr53FvAj2OYDYAgc7qedybQI8jmA1AoLN6Hvcm0OMIZgMQ6Kyex70J9DiC2QAEOqvncW8CPY5gNgCBzup53JtAjyOYDUCgs3oe9ybQ4whmAxDorJ7Hvf0GHQczDnSkC1gAAAAASUVORK5CYII=";
  count = 0;

  constructor() {
    super();
    // 本地图片，需要html，标签加载
    var image = document.createElement("img");
    image.src = this.qrimg;
    image.setAttribute('class', 'qrimg')
    document.body.appendChild(image);
  }
  generateQr = (): void => {
    this.ctx = new CanvasDrawer("my-canvas");

    // 由于网络图片加载异步，采用promise，加载绘制
    Promise.all([
      this.loadImage(
        "https://img1.dxycdn.com/2022/0208/572/0874533829616111353-2.png"
      ),
      this.loadImage(
        "https://img1.dxycdn.com/2021/1206/295/3792855844643429153-2.png"
      ),
      this.loadImage(
        "https://img1.dxycdn.com/2022/0208/204/4998527042828111353-2.png"
      ),
    ]).then((imgs) => {
      // 背景图片
      this.ctx.image(0, 0, {
        width: 355,
        height: 777,
        image: imgs[0],
      });
      // 头像
      this.ctx.image(48, 57, {
        width: 32,
        height: 32,
        image: imgs[1],
      });
      // title
      this.ctx.image(15, 94, {
        width: 325,
        height: 516.5,
        image: imgs[2],
      });
      //qr 边框
      this.ctx.rect(250, 636, {
        width: 90,
        height: 90,
        color: "#ac8dfc",
        radius: 10,
      });
      //qr 本地图片需要 在html标签引入
      this.ctx.image(260, 646, {
        width: 70,
        height: 70,
        image: document.querySelector(".qrimg"),
      });
      // 昵称
      this.ctx.fillText("一个大晴天", 94, 64, "18 #FFFFFF 1 bold left", 200, 1);
      // 解锁文案
      this.ctx.fillText(
        "解锁身份领取奖品",
        248,
        737,
        "12 #FFFFFF 1 bold left",
        200,
        1
      );

      // 生成图片
      this.exportQr()
    });
  };
  exportQr = (): void => {
    var image = document.createElement("img");
    image.src = this.ctx.generateImage();
    document.body.appendChild(image);
  };
  loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.src = url;
    });
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
img {
  width: 100%;
}
.qrimg {
  display: none;
}
</style>
