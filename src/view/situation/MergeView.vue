<template>
  <div class="merge-body">
    <!-- <progrs type="circle" :percentage="24">
      <template slot="text">
        <div>测试</div>
      </template>
    </progrs> -->
    <div class="left">
      <div class="top">
        <Dynamic :resize="resize" :refrush="refrush"></Dynamic>
      </div>
      <div class="bottom">
        <div class="lb-left">
          <Green :resize="resize" :refrush="refrush"></Green>
        </div>
        <div class="lb-right">
          <Bridge :resize="resize" :refrush="refrush"></Bridge>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="top">
        <Passenger :refrush="refrush"></Passenger>
      </div>
      <div class="bottom">
        <Stand :resize="resize" :refrush="refrush"></Stand>
      </div>
    </div>
  </div>
</template>

<script>
import Progrs from '@/components/common/ProgressView'
import Passenger from './merge/PassengerView'
import Bridge from './merge/ByBridgeView'
import Dynamic from './merge/InOutDynamicView'
import Green from './merge/GreenView'
import Stand from './merge/StandView'

export default {
  components: {
    Progrs,
    Passenger,
    Green,
    Stand,
    Bridge,
    Dynamic
  },
  data () {
    return {
      // 任务调度、航班查询特殊设置
      pageStyle: [{
        key: 'background',
        value: 'url(' + require('@img/task_bg.jpg') + ') top repeat-x'
      }, {
        key: 'background-color',
        value: '#060d14'
      }],
      resize: false,
      intervalTime: 60 * 1000,
      refrush: false
    }
  },
  mounted () {
    let bodyView = this.$root.$el.querySelector('.body-view')
    this.pageStyle.forEach(item => {
      bodyView.style[item.key] = item.value
    })
    this.refrushTime()
    this.timer = setInterval(this.refrushTime, this.intervalTime)
    window.onresize = () => {
      this.$nextTick(() => {
        this.resize = !this.resize
      })
    }
  },
  methods: {
    refrushTime () {
      this.refrush = !this.refrush
    }
  }
}
</script>

<style scoped>
.merge-body {
  margin-top: 10px;
  width: 100%;
  height: 100%;
  display: flex;
  overflow-x: hidden;
  overflow-y: auto;
}
.left, .right {
  display: flex;
  flex-direction: column;
  position: relative;
}
.top, .bottom {
  width: 100%;
  position: absolute;
}
.top {
  top: 0;
}
.bottom {
  margin-top: 2%;
  bottom: 0;
}
.left > .top {
  height: calc((100% - 2%) / 950 * 530);
}
.left > .bottom {
  height: calc((100% - 2%) / 950 * 420);
  display: flex;
}
.right > .top {
  height: calc((100% - 2%) / 950 * 380);
}
.right > .bottom {
  height: calc((100% - 2%) / 950 * 570);
}
.left > .bottom > .lb-left {
  width: calc((100% - 2%) / 1040 * 390);
  height: 100%;
}
.left > .bottom > .lb-right {
  margin-left: 2%;
  width: calc((100% - 2%) / 1040 * 650);
  height: 100%;
}
@media (min-width: 1920px) and (max-aspect-ratio: 16/9) {
  .merge-body {
    overflow-y: hidden !important;
  }
}
@media (min-width: 1920px) {
  .merge-body {
    flex-direction: row;
  }
  .left {
    width: calc((100% - 1%) / 1860 * 1060);
    height: 0;
    padding-bottom: calc((100% - 1%) / 1860 * 970);
  }
  .right {
    margin-left: 1%;
    width: calc((100% - 1%) / 1860 * 800);
    height: 0;
    padding-bottom: calc((100% - 1%) / 1860 * 970);
  }
}
@media (max-width: 1919px) {
  .merge-body {
    flex-direction: column;
  }
  .left {
    width: 100%;
    height: 0;
    padding-bottom: calc(100% / 1060 * 970);
  }
  .right {
    margin-top: 20px;
    width: 100%;
    height: 0;
    padding-bottom: calc(100% / 1060 * 970);
  }
}
</style>
