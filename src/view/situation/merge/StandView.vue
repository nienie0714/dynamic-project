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
            <div class="absolute-tag font-rs">机位紧张</div>
            <div class="text">
              <div class="font-st font-gray">空闲 / 占用</div>
              <div class="num-st font-white">{{data.nFree || '-'}} / {{data.nUsed || '-'}}</div>
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
              <div class="num-rd font-white">{{data.nData.B.freeNum }} / {{data.nData.B.usedNum }}</div>
              <div>
                <progrs :type="'line'" :percentage="parseInt((data.nData.B.usedNum)/(data.nData.B.totalNum)*100) || 0" :width="132" color="#03A786"></progrs>
              </div>
            </div>
            <div>
              <div class="stand-title font-rd font-gray">
                <div class="stand-icon bg-c"></div>
                <div>类机位</div>
              </div>
              <div class="num-rd font-white">{{data.nData.C.freeNum }} / {{data.nData.C.usedNum }}</div>
              <div>
                <progrs :type="'line'" :percentage="parseInt((data.nData.C.usedNum)/(data.nData.C.totalNum)*100) || 0" :width="132" color="#03A786"></progrs>
              </div>
            </div>
            <div>
              <div class="stand-title font-rd font-gray">
                <div class="stand-icon bg-d"></div>
                <div>类机位</div>
              </div>
              <div class="num-rd font-white">{{data.nData.D.freeNum }} / {{data.nData.D.usedNum }}</div>
              <div>
                <progrs :type="'line'" :percentage="parseInt((data.nData.D.usedNum)/(data.nData.D.totalNum)*100) || 0" :width="132" color="#03A786"></progrs>
              </div>
            </div>
            <div>
              <div class="stand-title font-rd font-gray">
                <div class="stand-icon bg-e"></div>
                <div>类机位</div>
              </div>
              <div class="num-rd font-white">{{data.nData.E.freeNum }} / {{data.nData.E.usedNum }}</div>
              <div>
                <progrs :type="'line'" :percentage="parseInt((data.nData.E.usedNum)/(data.nData.E.totalNum)*100) || 0" :width="132" color="#03A786"></progrs>
              </div>
            </div>
          </div>
          <div class="stand-row">
            <div>
              <div class="font-rd font-gray">廊桥位</div>
              <div class="num-rd font-white">{{data.nData.L.freeNum }} / {{data.nData.L.usedNum }}</div>
              <div>
                <progrs :type="'line'" :percentage="parseInt((data.nData.L.usedNum)/(data.nData.L.totalNum)*100) || 0" :width="132" color="#03A786"></progrs>
              </div>
            </div>
            <div>
              <div class="font-rd font-gray">远机位</div>
              <div class="num-rd font-white">{{data.nData.Y.freeNum }} / {{data.nData.Y.usedNum }}</div>
              <div>
                <progrs :type="'line'" :percentage="parseInt((data.nData.Y.usedNum)/(data.nData.Y.totalNum)*100) || 0" :width="132" color="#03A786"></progrs>
              </div>
            </div>
            <div>
              <div class="font-rd font-gray">货运位</div>
              <div class="num-rd font-white">{{data.nData.H.freeNum }} / {{data.nData.H.usedNum }}</div>
              <div>
                <progrs :type="'line'" :percentage="parseInt((data.nData.H.usedNum)/(data.nData.H.totalNum)*100) || 0" :width="132" color="#03A786"></progrs>
              </div>
            </div>
            <div>
              <div class="font-rd font-gray">除冰位</div>
              <div class="num-rd font-white">{{data.nData.I.freeNum }} / {{data.nData.I.usedNum }}</div>
              <div>
                <progrs :type="'line'" :percentage="parseInt((data.nData.I.usedNum)/(data.nData.I.totalNum)*100) || 0" :width="132" color="#03A786"></progrs>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="body-bottom merge-block one-hour">
        <div class="header" :style="`height: calc(100% / 275 * 50)`">
          <div class="header-title font-nd">1 小时内机位预占用情况</div>
        </div>
        <div class="body">
          <div class="body-top">
            <div>
              <div class="progress-circle">
                <div id="oneCircle" class="circle"></div>
                <!-- <div class="absolute-tag font-rs">机位紧张</div> -->
                <div class="text">
                  <div class="font-nd font-gray">预占用</div>
                  <div class="num-rd font-white">{{data.nUsed || '-'}}</div>
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
                  <div class="num-rd font-white">{{data.pData.B.usedNum }}</div>
                </div>
                <div>
                  <div class="stand-title font-rd font-gray">
                    <div class="stand-icon bg-c"></div>
                    <div>类机位</div>
                  </div>
                  <div class="num-rd font-white">{{data.pData.C.usedNum }}</div>
                </div>
                <div>
                  <div class="stand-title font-rd font-gray">
                    <div class="stand-icon bg-d"></div>
                    <div>类机位</div>
                  </div>
                  <div class="num-rd font-white">{{data.pData.D.usedNum }}</div>
                </div>
                <div>
                  <div class="stand-title font-rd font-gray">
                    <div class="stand-icon bg-e"></div>
                    <div>类机位</div>
                  </div>
                  <div class="num-rd font-white">{{data.pData.E.usedNum }}</div>
                </div>
              </div>
              <div class="stand-row">
                <div>
                  <div class="font-rd font-gray">廊桥位</div>
                  <div class="num-rd font-white">{{data.pData.L.usedNum }}</div>
                </div>
                <div>
                  <div class="font-rd font-gray">远机位</div>
                  <div class="num-rd font-white">{{data.pData.Y.usedNum }}</div>
                </div>
                <div>
                  <div class="font-rd font-gray">货运位</div>
                  <div class="num-rd font-white">{{data.pData.H.usedNum }}</div>
                </div>
                <div>
                  <div class="font-rd font-gray">除冰位</div>
                  <div class="num-rd font-white">{{data.pData.I.usedNum}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Progrs from '@/components/common/ProgressView'
import { queryAllStat } from '@/api/base'

export default {
  props: ['resize', 'refrush'],
  components: {
    Progrs
  },
  data () {
    return {
      standCircleEl: null,
      standCircle: null,
      oneCircleEl: null,
      oneCircle: null,
      queryUrl: '/basicdata/flightInOutStat/queryStandStat',
      data: {
        nData: {
          B: {},
          C: {},
          D: {},
          E: {},
          L: {},
          Y: {},
          H: {},
          I: {}
        },
        pData: {
          B: {},
          C: {},
          D: {},
          E: {},
          L: {},
          Y: {},
          H: {},
          I: {}
        },
        nUsed: 0,
        nFree: 0,
        pUsed: 0,
        pFree: 0
      }
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
    updateData () {
      let that = this
      queryAllStat(this.queryUrl).then(res => {
        if (res.data.code == 0) {
          // data.pData.I.usedNum
          for (let k in res.data.data.pData) {
            for (let j in that.data.pData) {
              if (k == j) {
                that.data.pData[j] = res.data.data.pData[k]
              }
            }
          }
          for (let k in res.data.data.nData) {
            for (let j in that.data.nData) {
              if (k == j) {
                that.data.nData[j] = res.data.data.nData[k]
              }
            }
          }
          that.data.nUsed = res.data.data.nUsed
          that.data.nFree = res.data.data.nFree
          that.data.pUsed = res.data.data.pUsed
          that.data.pFree = res.data.data.pFree

          that.updateOption()
        }
      })
    },
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
            radius: ['68%', '76%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              }
            },
            data: [
              {value: this.data.nFree, name: '空闲', itemStyle: {color: '#FF6959', borderColor: '#071622', borderWidth: 2}},
              {value: this.data.nUsed, name: '占用', itemStyle: {color: '#7A939E', borderColor: '#071622', borderWidth: 2}}
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
          formatter: '{b}: {c}'
        },
        series: [
          {
            name: '预占用',
            type: 'pie',
            radius: ['62%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              }
            },
            data: [
              {value: this.data.pUsed, name: '预占用', itemStyle: {color: '#03A786', borderColor: '#071622', borderWidth: 2}}
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
    },
    refrush: {
      handler (value) {
        this.updateData()
      }
    }
  }
}
</script>
<style scoped>
.merge-block > .header {
  margin-left: calc(100% / 800 * 20);
  height: calc(100% / 570 * 60);
  line-height: calc(100% / 570 * 60);
}
.passenger>.body {
  margin: 0 calc(100% / 800 * 20) calc(100% / 800 * 20) calc(100% / 800 * 20);
  height: calc(100% - (100% / 570 * 60) - calc(100% / 570 * 20));
  /* height: calc(100% / 275 * 215); */
  display: flex;
  flex-direction: column;
}
.passenger>.body>div {
  box-sizing: border-box;
  height: calc(50% + 50% / 570 * 60 - 100% / 758 * 10);
  margin-bottom: calc(100% / 758 * 10);
}
.passenger>.body>div:first-child {
  display: flex;
  height: calc(50% - 50% / 570 * 60);
}
.one-hour>.body>div:first-child {
  display: flex;
  height: 100%;
}
.one-hour>.body> .body-top > div:last-child {
  margin-left: calc(100% / 715 * 50);
}
.one-hour > .body {
  height: calc(100% / 270 * 200);
  padding: 0 calc(100% / 800 * 20);
  margin-bottom: calc(100% / 756 * 20);
}
.body-top>div:first-child {
  /* width: 30%; 机位统计 圆环 */
  display: flex;
  justify-content: center;
  overflow: hidden;
}
.body-top>div:last-child {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  margin-left: calc(100% / 755 * 20);
}
.stand-row {
  height: 50%;
  display: flex;
}
.one-hour .body-top>div:last-child {
  width: calc(100% / 800 * 565);
}
.stand-row-top {
  border-bottom: 1px solid rgba(60, 166, 200, 0.3);
}
.stand-row > div {
  width: 25%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
  height: auto;
  background-position: center;
  background-repeat: no-repeat;
  background-size: auto 100%;
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
  top: 0;
  right: 0;
  background-color: #ff6959;
  text-align: center;
  padding: calc(100% / 227 * 3) calc(100% / 227 * 8);
  border-radius: 20% / 50%;
  font-weight: bold;
  overflow: hidden;
  white-space: nowrap;
  width: fit-content;
}
.one-hour {
  background-color: rgba(60, 166, 200, 0.1);
  border: 1px solid rgba(60, 166, 200, 0.5);
  box-shadow: 0 0 30px rgba(60, 166, 200, 0.25);
}
</style>
