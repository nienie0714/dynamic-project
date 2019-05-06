<template>
  <div class="passenger merge-block">
    <div class="header">
      <img height="20%" :src="require('@img/merge/title_deco_4k.png')" />
      <span class="header-title font-st">机位统计</span>
    </div>
    <div class="body">
      <div class="body-top">
        <div>
          <div class="progress-circle">
            <div id="standCircle" class="circle"></div>
            <div class="text">
              <div class="font-st font-white">空闲 / 占用</div>
              <div class="num-st font-white">8 / 40</div>
            </div>
          </div>
        </div>
        <div>
          <div class="stand-row stand-row-top">
            <div>
              <div class="stand-title font-rd font-gray">
                <div class="stand-icon bg-b"></div>
                <div>类机位</div>
              </div>
              <div class="num-rd font-white">15 / 23</div>
              <div>
                <progrs :type="'line'" :percentage="24" :width="132" color="#03A786"></progrs>
              </div>
            </div>
            <div>
              <div class="stand-title font-rd font-gray">
                <div class="stand-icon bg-c"></div>
                <div>类机位</div>
              </div>
              <div class="num-rd font-white">15 / 23</div>
              <div>
                <progrs :type="'line'" :percentage="24" :width="132" color="#03A786"></progrs>
              </div>
            </div>
            <div>
              <div class="stand-title font-rd font-gray">
                <div class="stand-icon bg-d"></div>
                <div>类机位</div>
              </div>
              <div class="num-rd font-white">15 / 23</div>
              <div>
                <progrs :type="'line'" :percentage="24" :width="132" color="#03A786"></progrs>
              </div>
            </div>
            <div>
              <div class="stand-title font-rd font-gray">
                <div class="stand-icon bg-e"></div>
                <div>类机位</div>
              </div>
              <div class="num-rd font-white">15 / 23</div>
              <div>
                <progrs :type="'line'" :percentage="24" :width="132" color="#03A786"></progrs>
              </div>
            </div>
          </div>
          <div class="stand-row">
            <div>
              <div class="font-rd font-gray">廊桥位</div>
              <div class="num-rd font-white">15 / 23</div>
              <div>
                <progrs :type="'line'" :percentage="24" :width="132" color="#03A786"></progrs>
              </div>
            </div>
            <div>
              <div class="font-rd font-gray">远机位</div>
              <div class="num-rd font-white">15 / 23</div>
              <div>
                <progrs :type="'line'" :percentage="24" :width="132" color="#03A786"></progrs>
              </div>
            </div>
            <div>
              <div class="font-rd font-gray">除冰位</div>
              <div class="num-rd font-white">15 / 23</div>
              <div>
                <progrs :type="'line'" :percentage="24" :width="132" color="#03A786"></progrs>
              </div>
            </div>
            <div>
              <div class="font-rd font-gray">货运位</div>
              <div class="num-rd font-white">15 / 23</div>
              <div>
                <progrs :type="'line'" :percentage="24" :width="132" color="#03A786"></progrs>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="body-bottom merge-block one-hour" :style="{height: '46%'}">
        <div class="header" :style="{height: 'calc(200% / 570 * 60)'}">
          <div class="header-title font-nd">1 小时内机位占用情况（预计）</div>
        </div>
        <div class="body">
          <div class="body-top">
            <div>
              <div class="progress-circle">
                <div id="oneCircle" class="circle"></div>
                <div class="text">
                  <div class="font-nd font-white">空闲 / 占用</div>
                  <div class="num-nd font-white">8 / 40</div>
                </div>
              </div>
            </div>
            <div>
              <div class="stand-row stand-row-top">
                <div>
                  <div class="stand-title font-rd font-gray">
                    <div class="stand-icon bg-b"></div>
                    <div>类机位</div>
                  </div>
                  <div class="num-rd font-white">15 / 23</div>
                </div>
                <div>
                  <div class="stand-title font-rd font-gray">
                    <div class="stand-icon bg-c"></div>
                    <div>类机位</div>
                  </div>
                  <div class="num-rd font-white">15 / 23</div>
                </div>
                <div>
                  <div class="stand-title font-rd font-gray">
                    <div class="stand-icon bg-d"></div>
                    <div>类机位</div>
                  </div>
                  <div class="num-rd font-white">15 / 23</div>
                </div>
                <div>
                  <div class="stand-title font-rd font-gray">
                    <div class="stand-icon bg-e"></div>
                    <div>类机位</div>
                  </div>
                  <div class="num-rd font-white">15 / 23</div>
                </div>
              </div>
              <div class="stand-row">
                <div>
                  <div class="font-rd font-gray">廊桥位</div>
                  <div class="num-rd font-white">15 / 23</div>
                </div>
                <div>
                  <div class="font-rd font-gray">远机位</div>
                  <div class="num-rd font-white">15 / 23</div>
                </div>
                <div>
                  <div class="font-rd font-gray">除冰位</div>
                  <div class="num-rd font-white">15 / 23</div>
                </div>
                <div>
                  <div class="font-rd font-gray">货运位</div>
                  <div class="num-rd font-white">15 / 23</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="absolute-tag font-rd">机位紧张</div>
    <div class="absolute-subtag font-rs">机位紧张</div>
  </div>
</template>

<script>
import Progrs from '@/components/common/ProgressView'

export default {
  props: ['resize'],
  components: {
    Progrs
  },
  data () {
    return {
      standCircleEl: null,
      standCircle: null,
      oneCircleEl: null,
      oneCircle: null
    }
  },
  mounted () {
    this.standCircleEl = document.getElementById('standCircle')
    this.standCircle = this.$echarts.init(this.standCircleEl)
    this.oneCircleEl = document.getElementById('oneCircle')
    this.oneCircle = this.$echarts.init(this.oneCircleEl)
    this.updateOption()
    this.$nextTick(() => {
      let outOpts = {
        height: 'auto',
        width: this.standCircleEl.clientHeight
      }
      this.standCircle.resize(outOpts)

      let inOpts = {
        height: 'auto',
        width: this.oneCircleEl.clientHeight
      }
      this.oneCircle.resize(inOpts)
    })
  },
  methods: {
    resizeMeth () {
      let outOpts2 = {
        height: 'auto',
        width: this.standCircleEl.clientHeight
      }
      this.standCircle.resize(outOpts2)
      let inOpts2 = {
        height: 'auto',
        width: this.oneCircleEl.clientHeight
      }
      this.oneCircle.resize(inOpts2)
    },
    updateOption () {
      let outOptions = {
        tooltip: {
          trigger: 'item',
          confine: true,
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        series: [
          {
            name: '机位统计',
            type: 'pie',
            radius: ['72%', '80%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              }
            },
            data: [
              {value: 12, name: '空闲', itemStyle: {color: '#FF6959', borderColor: '#071622', borderWidth: 2}},
              {value: 121, name: '占用', itemStyle: {color: '#7A939E', borderColor: '#071622', borderWidth: 2}}
            ]
          }
        ]
      }
      // FF6959 橙色 03A786 绿色
      this.standCircle.setOption(outOptions, true)
      let inOptions = {
        tooltip: {
          trigger: 'item',
          confine: true,
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        series: [
          {
            name: '机位预计',
            type: 'pie',
            radius: ['72%', '80%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              }
            },
            data: [
              {value: 16, name: '空闲', itemStyle: {color: '#03A786', borderColor: '#071622', borderWidth: 2}},
              {value: 74, name: '占用', itemStyle: {color: '#7A939E', borderColor: '#071622', borderWidth: 2}}
            ]
          }
        ]
      }
      this.oneCircle.setOption(inOptions, true)
    }
  },
  watch: {
    resize: {
      handler (value) {
        this.resizeMeth()
      }
    }
  }
}
</script>
<style scoped>
.merge-block > .header {
  margin-left: calc(100% / 783 * 20);
  height: calc(100% / 570 * 60);
  line-height: calc(100% / 530 * 60);
}
.passenger>.body {
  margin: 0 calc(100% / 783 * 20) calc(100% / 380 * 10) calc(100% / 783 * 20);
  height: calc(100% - (100% / 530 * 60));
  display: flex;
  flex-direction: column;
}
.passenger>.body>div {
  box-sizing: border-box;
  height: 50%;
}
.passenger>.body>div:first-child {
  display: flex;
}
.one-hour>.body>div:first-child {
  display: flex;
  height: 100%;
}
.one-hour > .body {
  padding-right: calc(100% / 783 * 20)
}
.body-top>div:first-child {
  width: 30%; /* 机位统计 圆环*/
  display: flex;
  justify-content: center;
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
.stand-row-top {
  border-bottom: 1px solid blue;
}
.stand-row > div {
  width: 25%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
  padding: 3% 0;
  box-sizing: border-box;
}
.stand-row > div > div:last-child {
  width: 100%;
}
.stand-title {
  display: flex;
  width: 100%;
}
.stand-icon {
  width: 18%;
  height: 100%;
  margin: 0 2% 0 0;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-size: 120% 120%;
}
.bg-b {
  background-image: url(~@img/merge/icon_B_4k.png) !important;
}
.bg-c {
  background-image: url(~@img/merge/icon_C_4k.png) !important;
}
.bg-d {
  background-image: url(~@img/merge/icon_D_4k.png) !important;
}
.bg-e {
  background-image: url(~@img/merge/icon_E_4k.png) !important;
}
.progress-circle {
  height: 100%;
  position: relative;
}
.progress-circle>.circle {
  height: 100%;
}
.progress-circle>.text {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  pointer-events: none;
}
.progress-circle>.text>div:last-child {
  margin-top: 10px;
}
.absolute-tag {
  position: absolute;
  top: 15%;
  left: 19%;
  width: 9%;
  height: 4%;
  background-color: #ff6959;
  text-align: center;
  padding: 0.5% 0.5%;
  border-radius: 15px;
  font-weight: bold;
}
.absolute-subtag {
  position: absolute;
  top: 65%;
  left: 19%;
  width: 9%;
  height: 4%;
  background-color: #ff6959;
  text-align: center;
  padding: 0.5% 0.5%;
  border-radius: 15px;
  font-weight: bold;
}
</style>
