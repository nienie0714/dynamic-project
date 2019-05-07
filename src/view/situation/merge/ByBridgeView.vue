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
          <div class="text">
            <div class="num-st font-white">95.</div>
            <div class="num-rd font-white">28</div>
          </div>
        </div>
        <div class="gauge-subtitle font-rd font-gray">已靠桥 / 总数 (架)</div>
        <div class="gauge-value num-rd font-white">110 / 128</div>
      </div>
      <div class="gauge-right-content">
        <div class="gauge-title font-rd font-white">旅客靠桥率</div>
        <div class="gauge-echart">
          <div id="bybridgePasRate" class="gauge-canvas"></div>
          <div class="text">
            <div class="num-st font-white">52.</div>
            <div class="num-rd font-white">28</div>
          </div>
        </div>
        <div class="gauge-subtitle font-rd font-gray">已靠桥 / 总数 (人)</div>
        <div class="gauge-value num-rd font-white">110 / 128</div>
      </div>
    </div>
    <div class="absolute-div font-rd bg-yellow" v-if="fltRate < 0.5">偏低</div>
    <div class="absolute-subdiv font-rd bg-yellow" v-if="fltRate < 0.5">偏低</div>
  </div>
</template>

<script>
export default {
  props: ['resize'],
  data () {
    return {
      fltRate: 0,
      pasRate: 0,
      bybridgeFltRate: null,
      bybridgeFltRateEl: null,
      bybridgeFltRateOption: null,
      fontSizeTh: 0,
      bybridgePasRate: null,
      bybridgePasRateEl: null,
      bybridgePasRateOption: null
    }
  },
  mounted () {
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
      console.log(this.fontSizeTh)
      this.updatedOption()
    })
  },
  created () {
    this.queryByBridge()
  },
  methods: {
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
      })
    },
    updatedOption () {
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
            radius: '85%',
            z: '-1',
            // 仪表盘轴线(轮廓线)相关配置。
            axisLine: {
              show: true,
              lineStyle: {
                width: 25,
                color: [[1, 'rgba(122,147,160, 0.15)']]
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
              show: true,
              distance: -27, // 标签与刻度线的距离,默认 5。
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
                width: 25,
                color: [[1, 'rgba(122,147,160, 0.15)']]
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
              show: true,
              distance: -27, // 标签与刻度线的距离,默认 5。
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
      setTimeout(function () {
        let temp = that.bybridgeFltRateOption
        let temp2 = that.bybridgePasRateOption
        // var random = (Math.random() * 100).toFixed(2)
        var random = 66.66
        that.fltRate = random / 100
        that.pasRate = random / 100
        var color = null
        if (random / 100 > 0.5) {
          color = [[random / 100, '#3da6cc'], [1, '#2e434c']]
        } else {
          color = [[random / 100, '#FDCF53'], [1, '#2e434c']]
        }
        // 3da6cc 蓝色  FDCF53 黄色
        temp.series[0].axisLine.lineStyle.color = color
        temp.series[0].data[0].value = random
        that.bybridgeFltRate.setOption(temp)
        temp2.series[0].axisLine.lineStyle.color = color
        temp2.series[0].data[0].value = random
        that.bybridgePasRate.setOption(temp2)
      }, 100)
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
  margin-left: calc(100% / 644 * 20);
  height: calc(100% / 420 * 60);
  line-height: calc(100% / 420 * 60);
}
.bybridge>.body {
  height: calc(100% - (100% / 420 * 60));
}
.bybridge {
  position: relative;
}
.gauge-wrapper {
  display: flex;
}
.gauge-left-content {
  width: 50%;
  /* display: flex;
  flex-direction: column;
  justify-content: center; */
}
.gauge-right-content {
  flex: 1;
  /* display: flex;
  flex-direction: column;
  justify-content: center; */
}
.gauge-title {
  height: calc(100% / 420 * 52);
  text-align: center;
}
.gauge-echart {
  height: calc(100% / 420 * 250);
  width: 100%;
  position: relative;
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
  display: flex;
  justify-content: center;
  align-items: flex-end;
  pointer-events: none;
}
.gauge-subtitle {
  text-align: center;
  height: calc(100% / 420 * 52);
}
.gauge-value {
  height: calc(100% / 420 * 52);
  text-align: center;
}
.absolute-div {
  position: absolute;
  top: 22%;
  left: 38%;
  width: 10%;
  height: 5%;
  background-color: #FDCF53;
  text-align: center;
  padding: 0.5% 0.5%;
  border-radius: 15px;
  font-weight: bold;
}
.absolute-subdiv {
  position: absolute;
  top: 22%;
  left: 86%;
  width: 10%;
  height: 5%;
  background-color: #FDCF53;
  text-align: center;
  padding: 0.5% 0.5%;
  border-radius: 15px;
  font-weight: bold;
}
.bg-green {
  background-color: #03A786;
}
.bg-yellow {
  background-color: #FDCF53;
}
</style>
