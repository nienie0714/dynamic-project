<template>
  <div class="merge-body">
    <!-- <progrs type="circle" :percentage="24">
      <template slot="text">
        <div>测试</div>
      </template>
    </progrs> -->
    <div class="left">
      <div class="top">
        <Dynamic></Dynamic>
      </div>
      <div class="bottom">
        <div class="lb-left">
          <Green></Green>
        </div>
        <div class="lb-right">
          <Bridge></Bridge>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="top">
        <Passenger></Passenger>
      </div>
      <div class="bottom">
        <Stand></Stand>
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
    }
  },
  methods: {
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
  margin-top: 20px;
  bottom: 0;
  background-color: green;
}
.left > .top {
  height: calc((100% - 20px) / 950 * 530);
}
.left > .bottom {
  height: calc((100% - 20px) / 950 * 420);
  display: flex;
}
.right > .top {
  height: calc((100% - 20px) / 950 * 380);
}
.right > .bottom {
  height: calc((100% - 20px) / 950 * 570);
}
.left > .bottom > .lb-left {
  width: calc((100% - 20px) / 1040 * 390);
  height: 100%;
  background-color: cyan;
}
.left > .bottom > .lb-right {
  margin-left: 20px;
  width: calc((100% - 20px) / 1040 * 650);
  height: 100%;
  background-color: hotpink;
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
    width: calc((100% - 20px) / 1860 * 1060);
    height: 0;
    padding-bottom: calc((100% - 20px) / 1860 * 970);
  }
  .right {
    margin-left: 20px;
    width: calc((100% - 20px) / 1860 * 800);
    height: 0;
    padding-bottom: calc((100% - 20px) / 1860 * 970);
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
