<template>
  <div id="app">
    <div @click="generateQr">112--canvas{{ count }}</div>
    <img :src="qrimg" alt="" srcset="" id="img2" />
    <img src="https://img1.dxycdn.com/2022/0208/572/0874533829616111353-2.png" alt="" class="bg">
    <img src="../src/assets/logo.png" alt="" srcset="" id="img" />
    <canvas id="my-canvas" width="750" height="1554"></canvas>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import QRCode from "qrcode";
import CanvasDrawer from "./utils/canvas-drawer";

@Component
export default class App extends Vue {
  ctx: any;
  qrimg: any = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAXNSR0IArs4c6QAABPxJREFUeF7tnNuuGjAMBMv/fzRV+0aQGK3WIafp9NXEcXZs53Ioj+fz+fzlv2sUeAj0GpZ/FyLQu3gK9DKeAhXobQpcth73UIFepsBly7FCBXqZApctxwoV6GUKXLYcK1Sglylw2XKsUIFepsBly6kr9PF4fFUS+vNtG8/qv/WXikPrI38CXRQSqBVKRRPZrdBFrrZFWqFLhbYZtqbzCoj80+fJ3s4fleOfr4wM6ze+h5LguxdMApFdoMMZ1gpKwMjezr87Ycm/FQrfYk0TgATfnTDbgaaHFDqUtPZVUNoiCOju9cUJ0n4v9/SC2/kFCtcEqiDKOBrf2q1QINBWCAmc+ifgNF+6x9lyIUEISGqnjrA7YSiBaH6K/y0Bb99DSRASNLXTfNMJKdDyDEBABLooQIKldhI4rUCan+aj8XTqJv/X30NRAHjpSoHTfAItBSeBU2AEhOaj8VZo+ZYs0PJQMZ3BBITmo/Gpneb75yuUFkj2VFASjO6F6cMCxU92Wh+N//q1JQ0oFZQEoZcc2rPI/+71pf63n3LTgATa/SiNQP176GsNUUtrK5T2PGqJ0/bp9dD60vnGKzQNIP08HXp229N408/Tnk7+BBo+XJCgrV2gIZC2gltgNP44UApwtz3dw1vBdq+n9V+33DaAdrxAl0Nq+wfuFkg7XqACbXPoR4+vW256z2vVoD0wjSf1tzv+1r9Aw5eiVnBKoNa/QAX6+emP7nltBlKG23JJISCQnjLp7ZKArOPbz1M8lICn53/To722CPT1R0OoPkgvGo8JJtBXiVJBrdAlxWjPJYFPC3p6/vGWS3sa7VEkCNmxBYWP9+SPEqzVg+Yne31taRdAwMiOCxQoSfTZnm76BIzsFC2Np3ipw6Tzt/5wvvZQZIXOJjgBI/v2lkuHHgqQxk/vaWkF7a5w0ufrhyICQgHTeIG+KmiFQkZRwlih4Y89WqHUw4YrlDKUgGThvn+aKoj8U/w0ntZH8dEpnOYf30NJEFpwGnB6aCH/FD+Np/UJlBRc7CQYuRPoohAJQhlMgpNdoMN7KAm+204JRS263cPS8RRvnaDTL0W7Ab4dAn7YqZmACBQyhASyQr9dYuV8Ah3eQ1NBS36/qKWRf9rzaD3p/NP+cH3tHkoBUwCpPRWU9tz0FJ7OT/qk/kiv+i2XAqYAUnsrgBU6fChJAdKhJvUn0BBoW0HTLTJNCAJO8aUJlsZH/sdbrkBJ8s/2Vj+BLvpaoeWPJ1I+k8DpoYwqgOb771tuKzgJnPqnPSv1R9ee6QTCApi+h9ICKSAaT3byL9DylLs741P/AhXoRwWoY9hyl/9RPb2HtgDoUEQA0y0h/fz2a0vaElPBd/snQSnhaPy0XaDltUugkJJWaFez11co7Wltyyb5v13BAi2/kyTQL7dcK5RSLnzMblsatSzyL9BhoKG7t48TUPKfAk/nI//0MkXxp/bte2ga0PTFnQRPT9UUH62XOgaNJ7tAw5cpgVJKlW/F5N4KJYXgUBQOjz+etkjaEwk4BTgdD81H9vGWSxO29mkBBWqFvigwnWBtwluh4UsRXUPSFj996q2Bthnl+FkFBDqr53FvAj2OYDYAgc7qedybQI8jmA1AoLN6Hvcm0OMIZgMQ6Kyex70J9DiC2QAEOqvncW8CPY5gNgCBzup53JtAjyOYDUCgs3oe9ybQ4whmAxDorJ7Hvf0GHQczDnSkC1gAAAAASUVORK5CYII=';
  count = 0;

  constructor() {
    super();
    setTimeout(() => {
      this.ctx = new CanvasDrawer("my-canvas");
      this.ctx.rect(0, 0, {
        width: 20,
        height: 20,
        color: "#fec400",
        radius: 10,
      });
      this.ctx.arc(30, 20, 10, {
        sAngle: 0,
        eAngle: Math.PI * 2,
        ccw: true,
        color: "#333333",
      });
      this.ctx.line(0, 50, 50, 50, "blue");
      this.ctx.fillText(
        "考虑到图片是从网络加载，如果 drawImage 的时候图片还没有完全加载完成，则什么都不做，个别浏览器会抛异常。所以我们应该保证在 img 绘制完成之后再 drawImage",
        0,
        60,
        "20 red",
        200,
        5
      );
      this.ctx.image(0, 200, {
        width: 100,
        height: 100,
        image: document.querySelector("#img"),
      });

      this.ctx.radiusImage(500, 200, {
        width: 100,
        height: 100,
        image: document.querySelector("#img"),
        radius: 30,
        color: "#fec400",
      });

      // document
      //   .querySelector("#img")
      //   ?.setAttribute("src", this.ctx.generateImage());

      console.log(this);
    }, 200);
  }
  generateQr = (): void => {
    const qr = "xxxxsssssss";
    this.count++
    document
        .querySelector("#img2")
        ?.setAttribute("src", this.ctx.generateImage());
    console.log(this);
    QRCode.toDataURL(qr).then((res: string) => {
      console.log(res);
      console.log(this);
      this.qrimg = res;
    });
  };
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
#img{
  display: none;
} 
#img2{
  display: none;
}
#my-canvas {
  border: 1px solid #eee;
}
</style>
