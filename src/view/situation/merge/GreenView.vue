<template>
  <div class="passenger merge-block">
    <div class="header">
      <img :src="require('@img/title_deco.png')" />
      <span class="header-title">航班放行正常率</span>
    </div>
    <div class="body">
      <div class="body-top">
        <div class="green-echart">
          <div id="greenRate" class="green-canvas"></div>
        </div>
      </div>
      <div class="body-bottom">
        <div>
          <div class="body-bottom-left">
            <progrs :type="'circle'" :percentage="24" :width="'25%'">
              <template slot="text">
                <div>昨日</div>
              </template>
            </progrs>
          </div>
          <div class="body-bottom-right">
            <div>78.32</div>
            <div>偏低</div>
          </div>
        </div>
        <div>
          <div class="body-bottom-right">
            <div>78.32</div>
            <div>偏低</div>
          </div>
          <div class="body-bottom-left">
            <progrs type="circle" :percentage="24" :width="'25%'">
              <template slot="text">
                <div>昨日</div>
              </template>
            </progrs>
          </div>
        </div>
      </div>
    </div>
    <div class="absolute-title">当日放行正常率</div>
    <div class="absolute-tag">正常</div>
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
      greenRate: null,
      greenRateOption: {
        // title: {
        //   text: '航班靠桥率',
        //   textAlign: 'center',
        //   padding: [70, 170],
        //   textStyle: {
        //     color: '#fff',
        //     fontSize: 14
        //   }
        // },
        series: [
          {
            name: '业务指标',
            type: 'gauge',
            radius: '90%',
            startAngle: 359,
            endAngle: 0,
            splitNumber: 100,
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
              show: true,
              interval: 100,
              length: 8,
              lineStyle: {
                color: '#2F7F9E',
                width: 2
              }
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
                show: true,
                offsetCenter: [0, 10],
                formatter: function (value) {
                  value = value + ''
                  // value = '92'
                  return `{start|${value}}{end|%}`
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
          }
        ]
      }
    }
  },
  mounted () {
    this.greenRate = this.$echarts.init(document.getElementById('greenRate'))
    this.greenRate.setOption(this.greenRateOption)
    window.addEventListener('resize', () => {
      this.$nextTick(() => {
        this.greenRate.resize()
      })
     })
  },
  created () {
    this.queryGreenRate()
  },
  methods: {
    queryGreenRate () {
      let that = this
      // setTimeout(() => {
      //   let temp = that.greenRateOption
      //   temp.series[0].data = []
      //   that.greenRate.setOption(temp)
      // }, 100)
      setInterval(function () {
        let temp = that.greenRateOption
        var random = (Math.random() * 100).toFixed(2)
        // random = 60
        var color = [[random / 100, '#FDCF53'], [1, '#2B404A']]
        // var color = [[0.2, '#91c7ae'], [0.8, '#FDCF53'], [1, '#2B404A']]
        temp.series[0].axisLine.lineStyle.color = color
        temp.series[0].data[0].value = random
        that.greenRate.setOption(temp)
      }, 500)
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
.passenger>.body {
  display: flex;
}
.passenger>.body>.body-top {
  width: 100%;
  height: 75%;
  border-bottom: 1px solid blue;
}
.passenger>.body>.body-top > div {
  width: 100%;
  height: 100%;
  background-image: url(/static/img/time_bg_left_corner.9b13c12.png) !important;
  background-position: center;
  background-repeat: no-repeat;
}
.passenger>.body>.body-bottom {
  display: flex;
  height: 30%;
}
.passenger>.body>.body-bottom>div {
  width: 50%;
  display: flex;
  padding: 8px 0;
}
.passenger>.body>.body-bottom>div:nth-child(1) {
  border-right: 1px solid blue;
}

.body-bottom-left {
  flex: 1;
  height: 100%;
}
.body-bottom-right {
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 10px;
}
.body-bottom-right > div:nth-child(1) {
  height: 30%;
  color: #fff;
}
.body-bottom-right > div:nth-child(2) {
  font-weight: 600;
  color: rgb(180, 204, 73);
}
.green-echart {
  height: 100%;
  width: 100%;
}
.green-echart > div {
  height: 100%;
  width: 100%;
}
.merge-block {
  position: relative;
}
.absolute-title {
  position: absolute;
  top: 30%;
  left: 34%;
  width: 120px;
  height: 22px;
  text-align: center;
  padding: 2px 2px;
  font-weight: bold;
  color:#fff;
}
.absolute-tag {
  position: absolute;
  top: 51%;
  left: 42%;
  width: 60px;
  height: 22px;
  background-color: #FDCF53;
  text-align: center;
  padding: 2px 2px;
  border-radius: 15px;
  font-weight: bold;
}
</style>
