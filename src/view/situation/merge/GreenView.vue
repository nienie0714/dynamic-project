<template>
  <div class="passenger merge-block">
    <div class="header">
      <img height="20%" :src="require('@img/merge/title_deco_4k.png')" />
      <span class="header-title font-st">航班放行正常率</span>
    </div>
    <div class="body">
      <div class="body-top">
        <div class="progress-circle">
          <div id="greenRate" class="circle"></div>
          <div class="text margin">
            <div class="font-st font-white">当日放行正常率</div>
            <div class="num-st font-white">{{(toRate*100).toFixed(2)}}<span class="num-rd">%</span></div>
            <div class="absolute-tag font-rd" :class="toRate > 0.5 ? 'bg-green' : 'bg-yellow'">{{toRate > 0.5 ? '正常' : '偏低'}}</div>
          </div>
        </div>
      </div>
      <div class="body-bottom">
        <div>
          <div class="body-bottom-left">
            <div class="progress-circle">
              <div id="yesCircle" class="circle"></div>
              <div class="text">
                <div class="font-rd font-white">昨日</div>
              </div>
            </div>
          </div>
          <div class="body-bottom-right">
            <div class="num-rd font-white">78.32</div>
            <div class="font-rd" :class="yesRate > 0.5 ? 'font-green' : 'font-yellow'">{{yesRate > 0.5 ? '正常' : '偏低'}}</div>
          </div>
        </div>
        <div>
          <div class="body-bottom-right">
            <div class="num-rd font-white" :style="{'text-align': 'right'}">78.32</div>
            <div class="font-rd" :class="monthRate > 0.5 ? 'font-green' : 'font-yellow'" :style="{'text-align': 'right'}">{{monthRate > 0.5 ? '正常' : '偏低'}}</div>
          </div>
          <div class="body-bottom-left">
            <div class="progress-circle">
              <div id="monthCircle" class="circle"></div>
              <div class="text">
                <div class="font-rd font-white">本月</div>
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
export default {
  props: ['resize'],
  components: {
    Progrs
  },
  data () {
    return {
      toRate: 0,
      greenRate: null,
      greenCircleEl: null,
      fontSizeTh: 0,
      greenRateOption: {},
      yesRate: 0.3,
      yesCircleEl: null,
      yesCircle: null,
      monthRate: 0.7,
      monthCircleEl: null,
      monthCircle: null
    }
  },
  mounted () {
    this.greenCircleEl = document.getElementById('greenRate')
    this.greenRate = this.$echarts.init(this.greenCircleEl)
    this.updateGreenOption()

    this.yesCircleEl = document.getElementById('yesCircle')
    this.yesCircle = this.$echarts.init(this.yesCircleEl)
    this.monthCircleEl = document.getElementById('monthCircle')
    this.monthCircle = this.$echarts.init(this.monthCircleEl)
    this.updateOption()
    this.$nextTick(() => {
      let Opts = {
        height: 'auto',
        width: this.greenCircleEl.clientHeight
      }
      this.greenRate.resize(Opts)
      this.fontSizeTh = this.$store.getters.getFontSizeTh([this.greenCircleEl.clientWidth, 390])
      this.updateGreenOption()

      let outOpts = {
        height: 'auto',
        width: this.yesCircleEl.clientHeight
      }
      this.yesCircle.resize(outOpts)

      let inOpts = {
        height: 'auto',
        width: this.monthCircleEl.clientHeight
      }
      this.monthCircle.resize(inOpts)
      this.updateOption()
    })
  },
  created () {
    this.queryGreenRate()
  },
  methods: {
    resizeMeth () {
      let Opts2 = {
        height: 'auto',
        width: this.greenCircleEl.clientHeight
      }
      this.greenRate.resize(Opts2)
      let outOpts2 = {
        height: 'auto',
        width: this.yesCircleEl.clientHeight
      }
      this.yesCircle.resize(outOpts2)
      let inOpts2 = {
        height: 'auto',
        width: this.monthCircleEl.clientHeight
      }
      this.fontSizeTh = this.$store.getters.getFontSizeTh([this.greenCircleEl.clientWidth, 420])
      this.monthCircle.resize(inOpts2)
      this.updateOption()
      this.updateGreenOption()
    },
    updateGreenOption () {
      this.greenRateOption = {
        series: [
          {
            name: '业务指标',
            type: 'gauge',
            radius: '95%',
            startAngle: 180,
            endAngle: 180,
            // 仪表盘轴线(轮廓线)相关配置。
            axisLine: {
                show: true,
                lineStyle: {
                    width: 12
                }
            },
            // 分隔线样式。
            splitLine: {
              show: true,
              // interval: 100,
              length: this.fontSizeTh,
              lineStyle: {
                color: '#2F7F9E',
                width: 1.5
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
            data: [{
                value: 0
            }]
          }
        ]
      }
      this.greenRate.setOption(this.greenRateOption, true)
    },
    queryGreenRate () {
      let that = this
      setTimeout(() => {
        let temp = that.greenRateOption
        var random = (Math.random() * 100).toFixed(2)
        that.toRate = random / 100
        var color = [[1, '#071622']]
        temp.series[0].axisLine.lineStyle.color = color
        temp.series[0].endAngle = 180 - that.toRate * 360 + 1
        temp.series[0].splitNumber = parseInt(170 * that.toRate)
        that.greenRate.setOption(temp)
      }, 100)
    },
    updateOption () {
      let yesColor = ''
      if (this.yesRate > 0.5) {
        yesColor = '#03A786'
      } else {
        yesColor = '#FDCF53'
      }
      let outOptions = {
        tooltip: {
          trigger: 'item',
          confine: true,
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        series: [
          {
            type: 'pie',
            radius: ['75%', '90%'],
            avoidLabelOverlap: false,
            silent: true,
            label: {
              normal: {
                show: false,
                position: 'center'
              }
            },
            data: [
              {value: 12, name: '未执行', itemStyle: {color: '#060D14'}},
              {value: 121, name: '已执行', itemStyle: {color: yesColor}}
            ]
          }
        ]
      }
      this.yesCircle.setOption(outOptions, true)
      let monthColor = ''
      if (this.monthRate > 0.5) {
        monthColor = '#03A786'
      } else {
        monthColor = '#FDCF53'
      }
      let inOptions = {
        tooltip: {
          trigger: 'item',
          confine: true,
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        series: [
          {
            type: 'pie',
            radius: ['75%', '90%'],
            avoidLabelOverlap: false,
            silent: true,
            label: {
              normal: {
                show: false,
                position: 'center'
              }
            },
            data: [
              {value: 16, name: '未执行', itemStyle: {color: '#060D14'}}, // 黑色圈
              {value: 74, name: '已执行', itemStyle: {color: monthColor}} // 绿色
            ]
          }
        ]
      }
      this.monthCircle.setOption(inOptions, true)
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
  margin-left: calc(100% / 386 * 20);
  height: calc(100% / 420 * 60);
  line-height: calc(100% / 420 * 60);
}
.passenger>.body {
  margin: 0 20px 0 20px;
  height: calc(100% - (100% / 420 * 60));
  display: flex;
  flex-direction: column;
}
.passenger>.body {
  display: flex;
}
.passenger>.body>.body-top {
  width: 100%;
  height: calc(100% / 420 * 280);
}
.passenger>.body>.body-top > div {
  width: 100%;
  height: 100%;
  background-image: url(~@img/merge/bg_earth_4k.jpg) !important;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-size: 65% auto;
}
.passenger>.body>.body-bottom {
  display: flex;
  height: calc(100% / 420 * 110);
  padding: calc(100% / 420 * 20) 0;
}
.passenger>.body>.body-bottom>div {
  width: 50%;
  display: flex;
  margin: 2% 0;
}
.passenger>.body>.body-bottom>div:nth-child(1) {
  border-right: 1px solid rgba(60, 166, 200, 0.3);
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
  margin: 0 8%;
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
  left: 31%;
  width: 40%;
  height: 6%;
  text-align: center;
  color:#fff;
}
.absolute-tag {
  background-color: #ff6959;
  text-align: center;
  padding: calc(100% / 227 * 3) calc(100% / 227 * 8);
  border-radius: 20% / 50%;
  font-weight: bold;
  overflow: hidden;
  white-space: nowrap;
  width: fit-content;
}
.progress-circle>.text>div:last-child {
  margin-top: 0;
}
.font-green {
  color: #03A786;
}
.font-yellow {
  color: #FDCF53;
}
.bg-green {
  background-color: #03A786;
}
.bg-yellow {
  background-color: #FDCF53;
}
.progress-circle > .margin > div {
  margin-top: calc(100% / 420 * 10)
}
.progress-circle>.circle {
    display: flex;
    justify-content: center;
}
</style>
