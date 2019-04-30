<template>
  <div class="merge-body">
    <div class="gauge-wrapper">
      <div id="bybridgeFltRate" class="gauge-canvas" :style="byBridgeFltStyle"></div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      bybridgeFltRate: null,
      bybridgeFltRateOption: {
        title: {
          text: '航班靠桥率',
          textAlign: 'center',
          padding: [0, 150],
          textStyle: {
            color: '#fff',
            fontSize: 14
          }
        },
        series: [
          {
            name: '业务指标',
            type: 'gauge',
            // 仪表盘轴线(轮廓线)相关配置。
            axisLine: {
                show: true,
                lineStyle: {
                    width: 8,
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
              distance: 1, // 标签与刻度线的距离,默认 5。
              color: '#728A95', // 文字的颜色,默认 #fff
              backgroundColor: '#fff',
              borderRadius: '50',
              padding: 3,
              fontSize: 12, // 文字的字体大小,默认 5。
              formatter: '{value}' // 刻度标签的内容格式器
            },
            // 仪表盘指针。
            markPoint: {
              symbol: 'circle',
              sumbolSize: 20
            },
            pointer: {
                show: true,
                // 指针长度
                length: '90%',
                width: 8
            },
            // 仪表盘标题。
            title: {
                show: true,
                text: '%%%%%%%%',
                color: '#fff'
            },
            // 仪表盘详情，用于显示数据
            detail: {
                show: true,
                offsetCenter: [0, '-10%'],
                formatter: '{value}',
                textStyle: {
                    fontSize: 30
                }
            },
            data: [{
                value: 53.96,
                x: 'center',
                y: 'center',
                itemStyle: {color: '#fff'}
            }]
          }
        ]
        },
        byBridgeFltStyle: {
          width: 'calc(100%)',
          height: 'calc(100%)'
        }
    }
  },
  mounted () {
    this.bybridgeFltRate = this.$echarts.init(document.getElementById('bybridgeFltRate'))
    this.bybridgeFltRate.setOption(this.bybridgeFltRateOption)
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
        var random = (Math.random() * 100).toFixed(2)
        var color = [[random / 100, '#FDCF53'], [1, '#2B404A']]
        // var color = [[0.2, '#91c7ae'], [0.8, '#FDCF53'], [1, '#2B404A']]
        temp.series[0].axisLine.lineStyle.color = color
        temp.series[0].data[0].value = random
        that.bybridgeFltRate.setOption(temp)
      }, 500)
    }
  }
}
</script>

<style scoped>
.merge-body {
}
.gauge-wrapper {
  width: 300px;
  height: 300px;
  position: relative;
}
</style>
