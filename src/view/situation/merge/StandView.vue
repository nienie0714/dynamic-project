<template>
  <div class="passenger merge-block">
    <div class="header">
      <img :src="require('@img/title_deco.png')" />
      <span class="header-title">机位统计</span>
    </div>
    <div class="body">
      <div class="body-top">
        <div>
          <progrs :type="'circle'" :percentage="24" :width="'100%'"></progrs>
        </div>
        <div>
          <div class="stand-row">
            <div>
              <div class="num-rd">买机位</div>
              <div class="font-rd">15/23</div>
              <div>
                <progrs :type="'line'" :percentage="24"></progrs>
              </div>
            </div>
            <div>B</div>
            <div>C</div>
            <div>D</div>
          </div>
          <div class="stand-row">
            <div>A</div>
            <div>B</div>
            <div>C</div>
            <div>D</div>
          </div>
        </div>
      </div>
      <div class="body-bottom merge-block" :style="{height: '50%'}"></div>
    </div>
  </div>
</template>

<script>
import Progrs from '@/components/common/ProgressView'
export default {
  components: {
    Progrs
  },
  data () {
    return {
    }
  }
}
</script>
<style scoped>
.passenger>.body {
  margin: 0 20px 10px 20px;
  height: calc(100% - 70px);
  display: flex;
  flex-direction: column;
}
.passenger>.body>div {
  box-sizing: border-box;
  height: 50%;
}
.passenger>.body>div:first-child {
  border-bottom: 1px solid blue;
  display: flex;
}
.body-top>div:first-child {
  width: 30%; /* 机位统计 圆环*/
}
.body-top>div:last-child {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.stand-row {
  height: 50%;
  display: flex;
}
.stand-row > div {
  width: 25%;
}
</style>
