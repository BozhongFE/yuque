<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
let startX = 0;
let endX = 0;

const leftSymbol = Symbol("left");
const rightSymbol = Symbol("right");
export default {
  name: "App",
  data() {
    return {
      datas: [
        {
          haoyun: 1,
          status: 1,
          period_days: 1
        },
        {
          haoyun: 2,
          status: 1,
          period_days: 2
        },
        {
          haoyun: 3,
          status: 1,
          period_days: 3
        },
        {
          haoyun: 4,
          status: 1,
          period_days: 4
        },
        {
          haoyun: 5,
          status: 1,
          period_days: 5
        }
      ],
      artboardDatas: [
        {
          haoyun: 1,
          status: 1,
          period_days: 1
        },
        {
          haoyun: 2,
          status: 1,
          period_days: 2
        },
        {
          haoyun: 3,
          status: 1,
          period_days: 3
        }
      ],
      rotateDeg: 0,
      curIndex: 1
    };
  },
  computed: {
    curData() {
      return this.datas[this.curIndex];
    }
  },
  methods: {
    handleTouchStart(event) {
      startX = event.changedTouches[0].clientX;
    },
    handleTouchEnd(event) {
      const dataLength = this.datas.length;
      if (dataLength <= 1) return false;

      endX = event.changedTouches[0].clientX;
      const position = this.getPosition();
      const rotateDeg = this.rotateDeg;

      // 2条时只能左右转动
      const isNotTouchLeft =
        dataLength === 2 &&
        dataLength === this.curIndex + 1 &&
        position === leftSymbol;
      const isNotTouchRight =
        dataLength === 2 && this.curIndex === 0 && position === rightSymbol;
      if (isNotTouchLeft || isNotTouchRight) return false;

      this.rotateDeg =
        position === leftSymbol ? rotateDeg + 60 : rotateDeg - 60;
      const addDegNum = this.rotateDeg >= 0 ? 0 : 360;
      this.curIndex = ((this.rotateDeg % 360) + addDegNum) / 60;
    },
    getPosition() {
      return startX > endX ? leftSymbol : rightSymbol;
    }
  }
};
</script>

<style>
.artboards-container {
  position: relative;
  max-width: 310px;
  height: 310px;
  border-radius: 50%;
  margin: 0 auto;
}
.artboards-wrapper {
  position: absolute;
  bottom: 0;
  width: 310px;
  height: 310px;
  margin: 0 auto;
}
.artboards-wrapper .artboards__bg {
  position: relative;
  width: inherit;
  height: inherit;
  background: url(./assets/artboards/pink-artboard.png) center bottom no-repeat;
  background-size: 100%;
}

.artboards__bg .artboards-datas {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 110px;
  margin: 0 auto;
  text-align: center;
  color: #fff;
}
.artboards-data-wrapper .desc-data__text {
  display: block;
  font-size: 14px;
}
.artboards-datas .detail-data__text {
  display: block;
}
.artboards-datas .detail-data__text .detail-data--number {
  font-size: 32px;
}
.artboards-datas .arrow-icon__bg {
  position: absolute;
  top: 50%;
  right: -4px;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  background: url(./assets/artboards/arrow.png) no-repeat;
  background-size: 100%;
}

.artboards-wrapper .artboards-arc__bg {
  width: 100%;
  height: inherit;
  background: url(./assets/artboards/arc.png) center bottom no-repeat;
  background-size: 100%;
}

.cycle--list {
  position: absolute;
  top: 0;
  left: 0;
  width: inherit;
  height: inherit;
  margin: 0;
  padding: 0;
  list-style: none;
  transition: all 1s ease;
}
.cycle--item-wrapper {
  position: absolute;
  top: 0;
  width: inherit;
  height: inherit;
}
.cycle--list .cycle--item {
  width: inherit;
  /* transform: rotate(-125deg); */
  transform-origin: 50% 155px;
  text-align: center;
  color: #ffb3c6;
}
.cycle--list .cycle--item.active {
  color: #ff668c;
}
.cycle--list .cycle--item .cycle--title {
  /* transform: rotateX(-180deg); */
  margin: 0;
  font-weight: unset;
  font-size: 14px;
}
.cycle--list .cycle--item .cycle--day {
  font-size: 18px;
}
</style>
