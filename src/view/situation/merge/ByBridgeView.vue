<template>
  <div class="bybridge merge-block">
    <div class="header">
      <img height="20%" :src="require('@img/title_deco.png')" />
      <span class="header-title font-st">靠桥率统计</span>
    </div>
    <div class="body gauge-wrapper">
      <div class="gauge-left-content">
        <div class="gauge-title">航班靠桥率</div>
        <div class="gauge-echart">
          <div id="bybridgeFltRate" class="gauge-canvas"></div>
        </div>
        <div class="gauge-subtitle">已靠桥 / 总数 (架)</div>
        <div class="gauge-value">110 / 128</div>
      </div>
      <div class="gauge-right-content">
        <div class="gauge-title">旅客靠桥率</div>
        <div class="gauge-echart">
          <div id="bybridgePasRate" class="gauge-canvas"></div>
        </div>
        <div class="gauge-subtitle">已靠桥 / 总数 (人)</div>
        <div class="gauge-value">110 / 128</div>
      </div>
    </div>
    <div class="absolute-div">偏低</div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      bybridgeFltRate: null,
      bybridgeFltRateEl: null,
      bybridgeFltRateOption: {
        series: [
          {
            name: '业务指标',
            type: 'gauge',
            radius: '90%',
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
              show: true,
              distance: -12, // 标签与刻度线的距离,默认 5。
              color: '#fff',
              padding: 3,
              fontSize: 12,
              formatter: function (value) {
                if (value == 0 || value == 100) {
                  return ''
                }
                return value + ''
              }
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
                show: true,
                offsetCenter: [0, 0],
                formatter: function (value) {
                  value = value + ''
                  if (value.indexOf('.') != -1) {
                    let arr = value.split('.')
                    let start = arr[0] + '.'
                    let end = arr[1]
                    return [`{start|${start}}{end|${end}}`]
                  }
                  return `{start|${value}}`
                },
                textStyle: {
                  fontSize: 30
                },
                rich: {
                  start: {
                    color: '#fff',
                    fontSize: 40,
                    height: 40,
                    verticalAlign: 'top'
                  },
                  end: {
                    color: '#fff',
                    fontSize: 20,
                    height: 50,
                    verticalAlign: 'center'
                  }
                }
            },
            data: [{
                value: 53.96
            }]
          },
          {
            type: 'gauge',
            radius: '75%',
            z: '-1',
            // 仪表盘轴线(轮廓线)相关配置。
            axisLine: {
              show: true,
              lineStyle: {
                width: 18,
                color: [[1, 'rgba(255,0,0, 0.2)']]
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
      },
      bybridgePasRate: null,
      bybridgePasRateEl: null,
      bybridgePasRateOption: {
        series: [
          {
            name: '业务指标',
            type: 'gauge',
            radius: '90%',
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
              show: true,
              distance: -12, // 标签与刻度线的距离,默认 5。
              color: '#fff',
              padding: 3,
              fontSize: 12,
              formatter: function (value) {
                if (value == 0 || value == 100) {
                  return ''
                }
                return value + ''
              }
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
              show: true,
              offsetCenter: [0, 0],
              formatter: function (value) {
                value = value + ''
                if (value.indexOf('.') != -1) {
                  let arr = value.split('.')
                  let start = arr[0] + '.'
                  let end = arr[1]
                  return [`{start|${start}}{end|${end}}`]
                }
                return `{start|${value}}`
              },
              textStyle: {
                fontSize: 30
              },
              rich: {
                start: {
                  color: '#fff',
                  fontSize: 40,
                  height: 40,
                  verticalAlign: 'top'
                },
                end: {
                  color: '#fff',
                  fontSize: 20,
                  height: 50,
                  verticalAlign: 'center'
                }
              }
            },
            data: [{
                value: 53.96
            }]
          },
          {
            type: 'gauge',
            radius: '75%',
            z: '-1',
            // 仪表盘轴线(轮廓线)相关配置。
            axisLine: {
              show: true,
              lineStyle: {
                width: 18,
                color: [[1, 'rgba(255,0,0, 0.2)']]
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
    }
  },
  mounted () {
    this.bybridgeFltRateEl = document.getElementById('bybridgeFltRate')
    this.bybridgeFltRate = this.$echarts.init(this.bybridgeFltRateEl)
    this.bybridgeFltRate.setOption(this.bybridgeFltRateOption)

    this.bybridgePasRateEl = document.getElementById('bybridgePasRate')
    this.bybridgePasRate = this.$echarts.init(this.bybridgePasRateEl)
    this.bybridgePasRate.setOption(this.bybridgePasRateOption)

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
      this.$nextTick(() => {
        window.onresize = () => {
          let outOpts2 = {
            height: 'auto',
            width: this.bybridgeFltRateEl.clientHeight
          }
          this.bybridgeFltRate.resize(outOpts2)
          let inOpts2 = {
            height: 'auto',
            width: this.bybridgePasRateEl.clientHeight
          }
          this.bybridgePasRate.resize(inOpts2)
        }
      })
    })
  },
  created () {
    this.queryByBridge()
  },
  methods: {
    queryByBridge () {
      let that = this
      // setTimeout(() => {
      //   let temp = that.bybridgeFltRateOption
      //   temp.series[0].data = []
      //   that.bybridgeFltRate.setOption(temp)
      // }, 100)
      setInterval(function () {
        let temp = that.bybridgeFltRateOption
        let temp2 = that.bybridgePasRateOption
        // var random = (Math.random() * 100).toFixed(2)
        var random = (Math.random() * 100).toFixed(2)
        var color = [[random / 100, '#FDCF53'], [1, '#2B404A']]
        // var color = [[0.2, '#91c7ae'], [0.8, '#FDCF53'], [1, '#2B404A']]
        temp.series[0].axisLine.lineStyle.color = color
        temp.series[0].data[0].value = random
        that.bybridgeFltRate.setOption(temp)
        temp2.series[0].axisLine.lineStyle.color = color
        temp2.series[0].data[0].value = random
        that.bybridgePasRate.setOption(temp2)
      }, 500)
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
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.gauge-right-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.gauge-title {
  font-size: 18px;
  font-weight: 200;
  color: #fff;
  height: 10%;
  text-align: center;
}
.gauge-echart {
  height: 70%;
  width: 100%;
}
.gauge-echart > div {
  height: 100%;
  width: 100%;
}
.gauge-subtitle {
  font-size: 18px;
  color: #768F9A;
  text-align: center;
  height: 10%;
}
.gauge-value {
  font-size: 20px;
  color: #fff;
  height: 10%;
  text-align: center;
}
.absolute-div {
  position: absolute;
  top: 100px;
  left: 250px;
  width: 60px;
  height: 22px;
  background-color: #FDCF53;
  text-align: center;
  padding: 2px 2px;
  border-radius: 15px;
  font-weight: bold;
}
</style>
