<template>
  <div class="bybridge merge-block">
    <div class="header">
      <img height="20%" :src="require('@img/merge/title_deco_4k.png')" />
      <span class="header-title font-st">靠桥率统计</span>
    </div>
    <div class="body gauge-wrapper">
      <div class="gauge-left-content">
        <div class="gauge-title font-rd font-white">航班靠桥率</div>
        <div class="gauge-echart">
          <div id="bybridgeFltRate" class="gauge-canvas"></div>
          <div class="absolute-div font-rd bg-yellow" v-if="fltRate <= pecBase">偏低</div>
          <div class="text">
            <div class="num-st font-white">{{splitFltRate[0]}}.</div>
            <div class="num-rs font-white">{{splitFltRate[1]}}</div>
          </div>
        </div>
        <div class="gauge-subtitle font-rd font-gray">已靠桥 / 总数 (架)</div>
        <div class="gauge-value num-rd font-white">{{data.bridgedFlight}} / {{data.enableBridgeFlight}}</div>
      </div>
      <div class="gauge-right-content">
        <div class="gauge-title font-rd font-white">旅客靠桥率</div>
        <div class="gauge-echart">
          <div id="bybridgePasRate" class="gauge-canvas"></div>
          <div class="absolute-div font-rd bg-yellow" v-if="pasRate <= pecBase">偏低</div>
          <div class="text">
            <div class="num-st font-white">{{splitPasRate[0]}}.</div>
            <div class="num-rs font-white">{{splitPasRate[1]}}</div>
          </div>
        </div>
        <div class="gauge-subtitle font-rd font-gray">已靠桥 / 总数 (人)</div>
        <div class="gauge-value num-rd font-white">{{data.bridgedPassenger}} / {{data.enableBridgePassenger}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { queryAllStat } from '@/api/base'
export default {
  props: ['resize', 'refrush'],
  data () {
    return {
      queryUrl: '/basicdata/flightInOutStat/queryBridgeStat',
      fltRate: 0,
      splitFltRate: [],
      fltRateStr: '',
      pasRate: 0,
      splitPasRate: [],
      bybridgeFltRate: null,
      bybridgeFltRateEl: null,
      bybridgeFltRateOption: null,
      fontSizeTh: 0,
      bybridgePasRate: null,
      bybridgePasRateEl: null,
      bybridgePasRateOption: null,
      pecBase: 50,
      data: {
        'bridgedFlight': '--', // 已靠桥航班
        'enableBridgeFlight': '--', // 可以靠桥航班(总数)
        'bridgedPassenger': '--', // 已靠桥旅客
        'enableBridgePassenger': '--' // 可以靠桥的旅客(总数)
      }
    }
  },
  mounted () {
    this.pecBase = this.$store.getters.getCfgVal('fltRag')
    this.bybridgeFltRateEl = document.getElementById('bybridgeFltRate')
    this.bybridgeFltRate = this.$echarts.init(this.bybridgeFltRateEl)

    this.bybridgePasRateEl = document.getElementById('bybridgePasRate')
    this.bybridgePasRate = this.$echarts.init(this.bybridgePasRateEl)
    this.updatedOption()

    this.$nextTick(() => {
      let outOpts = {
        height: 'auto',
        width: this.bybridgeFltRateEl.clientHeight
      }
      this.bybridgeFltRate.resize(outOpts)

      let inOpts = {
        height: 'auto',
        width: this.bybridgePasRateEl.clientHeight
      }
      this.bybridgePasRate.resize(inOpts)
      this.fontSizeTh = this.$store.getters.getFontSizeTh([this.bybridgeFltRateEl.clientWidth * 2, 650])
      this.updatedOption()
    })
  },
  created () {
  },
  methods: {
    updateData () {
      let that = this
      queryAllStat(this.queryUrl).then(res => {
        if (res.data.code == 0) {
          let tmp = res.data.data[0]
          if (typeof (res.data.data[0]) == 'undefined') {
            this.restore()
          } else {
            that.data.bridgedFlight = Number.isInteger(tmp.bridgedFlight) ? tmp.bridgedFlight : '-'
            that.data.enableBridgeFlight = Number.isInteger(tmp.enableBridgeFlight) ? tmp.enableBridgeFlight : '-'
            that.data.bridgedPassenger = Number.isInteger(tmp.bridgedPassenger) ? tmp.bridgedPassenger : '-'
            that.data.enableBridgePassenger = Number.isInteger(tmp.enableBridgePassenger) ? tmp.enableBridgePassenger : '-'

            that.fltRate = that.data.bridgedFlight / that.data.enableBridgeFlight
            that.splitFltRate = that.splitFloat(that.fltRate)
            that.pasRate = that.data.bridgedPassenger / that.data.enableBridgePassenger
            that.splitPasRate = that.splitFloat(that.pasRate)

            that.queryByBridge()
          }
        } else {
          this.restore()
        }
      }).catch(() => {
        this.restore()
      })
    },
    restore () {
      this.data = {
        'bridgedFlight': '--', // 已靠桥航班
        'enableBridgeFlight': '--', // 可以靠桥航班(总数)
        'bridgedPassenger': '--', // 已靠桥旅客
        'enableBridgePassenger': '--' // 可以靠桥的旅客(总数)
      }
      this.splitFltRate = ['--', '--']
      this.splitPasRate = ['--', '--']
      this.fltRate = NaN
      this.pasRate = NaN
      this.queryByBridge()
    },
    splitFloat (num) {
      if (Number.isNaN(num)) {
        return ['--', '--']
      }
      let ret = []
      ret[0] = parseInt(num * 100)
      let temp = (num * 100).toFixed(2) + ''
      if (temp.includes('.')) {
        ret[1] = temp.split('.')[1]
      } else {
        ret[1] = '00'
      }
      return ret
    },
    resizeMeth () {
      this.$nextTick(() => {
        let outOpts2 = {
          height: 'auto',
          width: this.bybridgeFltRateEl.clientHeight
        }
        this.bybridgeFltRate.resize(outOpts2)
        let inOpts2 = {
          height: 'auto',
          width: this.bybridgePasRateEl.clientHeight
        }
        this.fontSizeTh = this.$store.getters.getFontSizeTh([this.bybridgeFltRateEl.clientWidth * 2, 650])
        this.bybridgePasRate.resize(inOpts2)
        this.updatedOption()
        this.queryByBridge()
      })
    },
    updatedOption () {
      let height = this.bybridgePasRateEl.clientHeight
      this.bybridgeFltRateOption = {
        series: [
          {
            name: '航班靠桥率',
            type: 'gauge',
            radius: '100%',
            // 仪表盘轴线(轮廓线)相关配置。
            axisLine: {
                show: true,
                lineStyle: {
                    width: 6,
                    color: [[1, '#2B404A']]
                }
            },
            // 分隔线样式。
            splitLine: {
                show: false
            },
            // 刻度样式。
            axisTick: {
              show: false
            },
            // 刻度标签。
            axisLabel: {
              show: false
            },
            // 仪表盘指针。
            markPoint: {
              symbol: 'circle',
              sumbolSize: 20
            },
            pointer: {
                show: true,
                // 指针长度
                length: '10%',
                width: 0
            },
            itemStyle: {
              color: '#3DA6CC'
            },
            // 仪表盘详情，用于显示数据
            detail: {
              show: false
            },
            data: [{
                value: 53.96
            }]
          },
          {
            type: 'gauge',
            radius: height / 2 - height / 214 * 20,
            z: '-1',
            // 仪表盘轴线(轮廓线)相关配置。
            axisLine: {
              show: true,
              lineStyle: {
                width: 1.7 * this.fontSizeTh,
                color: [[1, 'rgba(122,147,160, 0.15)']]
              }
            },
            // 分隔线样式。
            splitLine: {
                show: false,
                length: 0
            },
            // 刻度样式。
            axisTick: {
              show: false,
              length: 0
            },
            // 刻度标签。
            axisLabel: {
              show: true,
              distance: 0, // 标签与刻度线的距离,默认 5。
              color: '#7a939e',
              padding: 3,
              fontSize: this.fontSizeTh,
              formatter: function (value) {
                if (value == 0 || value == 100) {
                  return ''
                }
                return value + ''
              }
            },
            pointer: {
                show: false,
                // 指针长度
                length: '10%',
                width: 0
            },
            // 仪表盘详情，用于显示数据
            detail: {
              show: false
            },
            data: [{
                value: 100
            }]
          }
        ]
      }
      this.bybridgeFltRate.setOption(this.bybridgeFltRateOption, true)
      this.bybridgePasRateOption = {
        series: [
          {
            name: '旅客靠桥率',
            type: 'gauge',
            radius: '100%',
            // 仪表盘轴线(轮廓线)相关配置。
            axisLine: {
                show: true,
                lineStyle: {
                    width: 6,
                    color: [[1, '#2B404A']]
                }
            },
            // 分隔线样式。
            splitLine: {
                show: false
            },
            // 刻度样式。
            axisTick: {
              show: false
            },
            // 刻度标签。
            axisLabel: {
              show: false
            },
            // 仪表盘指针。
            markPoint: {
              symbol: 'circle',
              sumbolSize: 20
            },
            pointer: {
                show: false,
                // 指针长度
                length: '10%',
                width: 0
            },
            itemStyle: {
              color: '#3DA6CC'
            },
            // 仪表盘详情，用于显示数据
            detail: {
              show: false
            },
            data: [{
                value: 53.96
            }]
          },
          {
            type: 'gauge',
            radius: '85%',
            z: '-1',
            // 仪表盘轴线(轮廓线)相关配置。
            axisLine: {
              show: true,
              lineStyle: {
                width: 1.7 * this.fontSizeTh,
                color: [[1, 'rgba(122,147,160, 0.15)']]
              }
            },
            // 分隔线样式。
            splitLine: {
                show: false,
                length: 0
            },
            // 刻度样式。
            axisTick: {
              show: false,
              length: 0
            },
            // 刻度标签。
            axisLabel: {
              show: true,
              distance: 0, // 标签与刻度线的距离,默认 5。
              color: '#7a939e',
              padding: 3,
              fontSize: this.fontSizeTh,
              formatter: function (value) {
                if (value == 0 || value == 100) {
                  return ''
                }
                return value + ''
              }
            },
            pointer: {
                show: false,
                // 指针长度
                length: '10%',
                width: 0
            },
            // 仪表盘详情，用于显示数据
            detail: {
              show: false
            },
            data: [{
                value: 100
            }]
          }
        ]
      }
      this.bybridgePasRate.setOption(this.bybridgePasRateOption, true)
    },
    queryByBridge () {
      let that = this
      this.$nextTick(() => {
        var color = null
        if (that.fltRate / 100 >= that.pecBase) {
          color = [[that.fltRate, '#3da6cc'], [1, '#2e434c']]
        } else if (that.fltRate / 100 < that.pecBase) {
          color = [[that.fltRate, '#FDCF53'], [1, '#2e434c']]
        } else {
          color = [[1, '#7a939e']]
        }
        that.bybridgeFltRateOption.series[0].axisLine.lineStyle.color = color
        that.bybridgeFltRateOption.series[0].data[0].value = that.fltRate
        that.bybridgeFltRate.setOption(that.bybridgeFltRateOption, true)
        if (that.pasRate / 100 >= that.pecBase) {
          color = [[that.pasRate, '#3da6cc'], [1, '#2e434c']]
        } else if (that.pasRate / 100 < that.pecBase) {
          color = [[that.pasRate, '#FDCF53'], [1, '#2e434c']]
        } else {
           color = [[1, '#7a939e']]
        }
        // 3da6cc 蓝色  FDCF53 黄色
        that.bybridgePasRateOption.series[0].axisLine.lineStyle.color = color
        that.bybridgePasRateOption.series[0].data[0].value = this.pasRate
        that.bybridgePasRate.setOption(that.bybridgePasRateOption, true)
      })
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
  margin-left: calc(100% / 644 * 20);
  height: calc(100% / 420 * 60);
  line-height: calc(100% / 420 * 60);
}
.bybridge>.body {
  height: calc(100% - (100% / 420 * 60));
  margin: 0 calc(100% / 644 * 20);
}
.bybridge {
  position: relative;
}
.gauge-wrapper {
  display: flex;
}
.gauge-left-content {
  width: 50%;
}
.gauge-right-content {
  flex: 1;
}
.gauge-title {
  height: calc(100% / 420 * 52);
  text-align: center;
}
.gauge-echart {
  height: calc(100% / 420 * 270);
  width: 100%;
  position: relative;
  background-image: url(~@img/merge/bg_circle_glow_4k.png);
  background-repeat: no-repeat;
  background-position: center;
  background-size: auto 80%;
}
.gauge-echart > .gauge-canvas {
  height: 100%;
}
.gauge-canvas {
  display: flex;
  justify-content: center;
}
.gauge-echart>.text {
  position: absolute;
  width: fit-content;
  height: fit-content;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
.gauge-echart>.text > div {
  display: inline-block;
}
.gauge-subtitle {
  text-align: center;
  height: calc(100% / 420 * 35);
}
.gauge-value {
  height: calc(100% / 420 * 52);
  text-align: center;
}
.absolute-div {
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
.bg-green {
  background-color: #03A786;
}
.bg-yellow {
  background-color: #FDCF53;
}
</style>
