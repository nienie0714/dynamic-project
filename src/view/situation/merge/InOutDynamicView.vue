<template>
  <div class="in-out-dynamic merge-block">
    <div class="header">
      <img height="20%" :src="require('@img/merge/title_deco_4k.png')" />
      <span class="header-title font-st">出、进港航班动态</span>
    </div>
    <div class="body">
      <div class="dymc-block">
        <div>
          <div class="progress-circle">
            <div id="outCircle" class="circle"></div>
            <div class="text">
              <div class="font-st font-white">出港计划</div>
              <div class="num-st font-white">128</div>
            </div>
          </div>
          <div class="progress-info">
            <div>
              <div class="info-block">
                <div class="font-rs font-gray">已执行</div>
                <div class="num-nd font-white">121</div>
              </div>
              <div class="info-block">
                <div class="font-rs font-gray">未执行</div>
                <div class="num-nd font-white">12</div>
              </div>
            </div>
            <div>
              <div class="info-block">
                <div class="font-rs font-gray">取消</div>
                <div class="num-nd font-white">12</div>
              </div>
              <div class="info-block">
                <div class="font-rs font-gray">延误</div>
                <div class="num-nd font-yellow">3</div>
              </div>
            </div>
            <div class="info-block">
              <div class="font-rs font-gray">出港正常率 %</div>
              <div class="pro-trans">
                <div :class="['pro-trans-val', (percD>50)?'pro-trans-val-nrm':'pro-trans-val-arm']" :style="`height: ${percD}%;`"></div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="progress-circle">
            <div id="inCircle" class="circle"></div>
            <div class="text">
              <div class="font-st font-white">进港计划</div>
              <div class="num-st font-white">90</div>
            </div>
          </div>
          <div class="progress-info">
            <div>
              <div class="info-block">
                <div class="font-rs font-gray">已执行</div>
                <div class="num-nd font-white">76</div>
              </div>
              <div class="info-block">
                <div class="font-rs font-gray">未执行</div>
                <div class="num-nd font-white">14</div>
              </div>
            </div>
            <div>
              <div class="info-block">
                <div class="font-rs font-gray">取消</div>
                <div class="num-nd font-white">12</div>
              </div>
              <div class="info-block">
                <div class="font-rs font-gray">延误</div>
                <div class="num-nd font-yellow">3</div>
              </div>
            </div>
            <div class="info-block">
              <div class="font-rs font-gray">进港正常率 %</div>
              <div class="pro-trans">
                <div :class="['pro-trans-val', (percA>50)?'pro-trans-val-nrm':'pro-trans-val-arm']" :style="`height: ${percA}%;`"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="dymc-block">
        <div class="hour-takeoff-land">
          <div id="lineZoom" class="line"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  props: ['resize'],
  data () {
    return {
      fontFamily: `'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 微软雅黑, Arial, sans-serif`,
      outCircleEl: null,
      outCircle: null,
      inCircleEl: null,
      inCircle: null,
      lineZoomEl: null,
      lineZoom: null,
      fontSizeSt: 0,
      fontSizeRs: 0,
      percD: 30,
      percA: 68
    }
  },
  mounted () {
    this.outCircleEl = document.getElementById('outCircle')
    this.outCircle = this.$echarts.init(this.outCircleEl)
    this.inCircleEl = document.getElementById('inCircle')
    this.inCircle = this.$echarts.init(this.inCircleEl)
    this.lineZoomEl = document.getElementById('lineZoom')
    this.lineZoom = this.$echarts.init(this.lineZoomEl)
    this.updateOption()
    this.$nextTick(() => {
      let outOpts = {
        height: 'auto',
        width: this.outCircleEl.clientHeight
      }
      this.outCircle.resize(outOpts)

      let inOpts = {
        height: 'auto',
        width: this.inCircleEl.clientHeight
      }
      this.inCircle.resize(inOpts)
      this.fontSizeSt = this.$store.getters.getFontSizeSt([this.lineZoomEl.clientWidth, 1060])
      this.fontSizeRs = this.$store.getters.getFontSizeRs([this.lineZoomEl.clientWidth, 1060])
      this.updateLineOption()
    })
  },
  methods: {
    resizeMeth () {
      let outOpts2 = {
        height: 'auto',
        width: this.outCircleEl.clientHeight
      }
      this.outCircle.resize(outOpts2)
      let inOpts2 = {
        height: 'auto',
        width: this.inCircleEl.clientHeight
      }
      this.inCircle.resize(inOpts2)
      this.fontSizeSt = this.$store.getters.getFontSizeSt([this.lineZoomEl.clientWidth, 1060])
      this.fontSizeRs = this.$store.getters.getFontSizeRs([this.lineZoomEl.clientWidth, 1060])
      this.lineZoom.resize()
      this.updateLineOption()
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
            name: '出港计划',
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
              {value: 12, name: '未执行', itemStyle: {color: '#7A939E', borderColor: '#071622', borderWidth: 2}},
              {value: 121, name: '已执行', itemStyle: {color: '#3DA6CC', borderColor: '#071622', borderWidth: 2}}
            ]
          }
        ]
      }
      this.outCircle.setOption(outOptions, true)
      let inOptions = {
        tooltip: {
          trigger: 'item',
          confine: true,
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        series: [
          {
            name: '出港计划',
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
              {value: 16, name: '未执行', itemStyle: {color: '#7A939E', borderColor: '#071622', borderWidth: 2}},
              {value: 74, name: '已执行', itemStyle: {color: '#3DA6CC', borderColor: '#071622', borderWidth: 2}}
            ]
          }
        ]
      }
      this.inCircle.setOption(inOptions, true)
    },
    updateLineOption () {
      let data = []
      for (let i = 12; i > -12; i--) {
        let num = ((16 - i) > 24) ? (16 - i - 24) : (16 - i)
        data.push({
          time: num + ':00',
          value: num + 60 - i
        })
      }
      let xData = _.map(data, 'time')
      let yData = _.map(data, 'value')
      let yDatb = []
      yData.forEach((item, index) => {
        yDatb.push(item + 2 * index - 20)
      })
      let lineOptions = {
        title: {
          text: '每小时起降架次',
          textAlign: 'left',
          left: 100 / 1065 * 20 + '%',
          textStyle: {
            color: '#fff',
            fontWeight: 'normal',
            fontSize: this.fontSizeSt,
            fontFamily: this.fontFamily
          }
        },
        legend: {
          align: 'auto',
          // right: 100 / 1065 * 20 + '%',
          inactiveColor: 'rgba(122, 147, 158, 0.6)',
          itemGap: 20,
          textStyle: {
            color: '#7a939e',
            fontSize: this.fontSizeRs,
            fontFamily: this.fontFamily
          },
          data: ['出港', '进港']
        },
        grid: {
          left: 100 / 1065 * 40 + '%',
          right: 100 / 1065 * 45 + '%',
          top: 100 / 224 * 40 + '%',
          bottom: 100 / 224 * 20 + '%',
          containLabel: true
        },
        toolbox: {
          right: 100 / 1065 * 35 + '%',
          itemSize: this.fontSizeRs,
          iconStyle: {
            borderColor: '#7a939e'
          },
          feature: {
            dataView: {readOnly: false},
            // magicType: {type: ['bar']},
            restore: {},
            saveAsImage: {}
          }
        },
        tooltip: {
          trigger: 'item',
          confine: true
        },
        xAxis: {
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: 'rgba(60, 166, 200, 0.3)'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            margin: 15,
            color: '#fff',
            fontSize: this.fontSizeRs,
            fontFamily: this.fontFamily
          },
          // data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          data: xData
          // min: 'dataMin',
          // max: 'dataMax'
        },
        yAxis: {
          min: 'dataMin',
          max: 'dataMax',
          splitLine: {
            lineStyle: {
              color: 'rgba(60, 166, 200, 0.3)'
            }
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            margin: 15,
            color: '#7a939e',
            fontSize: this.fontSizeRs,
            fontFamily: this.fontFamily
          }
        },
        dataZoom: [{
          type: 'inside',
          filterMode: 'none',
          start: 25,
          end: 75
        }],
        series: [
          {
            name: '出港',
            type: 'line',
            // data: [120, 132, 101, 134, 90, 230, 210]
            symbol: 'circle',
            symbolSize: 8,
            smooth: true,
            itemStyle: {
              normal: {
                color: 'rgb(3, 167, 134)',
                borderColor: '#071622',
                borderWidth: 2
              }
            },
            lineStyle: {
              opacity: 0
            },
            areaStyle: {
              normal: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0, color: 'rgba(3, 167, 134, 0.8)'
                  }, {
                    offset: 0.5, color: 'rgba(3, 167, 134, 0.5)'
                  }, {
                    offset: 1, color: 'rgba(3, 167, 134, 0.1)'
                  }]
                }
              }
            },
            // label: {
            //   normal: {
            //     show: false,
            //     position: 'center'
            //   }
            // },
            // markPoint: {
            //   data: [
            //     {type: 'max', name: '最大值'},
            //     {type: 'min', name: '最小值'}
            //   ]
            // },
            tooltip: {
              formatter: '{c}',
              backgroundColor: 'rgb(3, 167, 134)',
              textStyle: {
                fontSize: this.fontSizeRs,
                fontFamily: this.fontFamily
              }
            },
            data: yDatb
          },
          {
            name: '进港',
            type: 'line',
            // data: [120, 132, 101, 134, 90, 230, 210]
            symbol: 'circle',
            symbolSize: 8,
            smooth: true,
            itemStyle: {
              normal: {
                color: 'rgb(60, 166, 200)',
                borderColor: '#071622',
                borderWidth: 2
              }
            },
            lineStyle: {
              opacity: 0
            },
            areaStyle: {
              normal: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0, color: 'rgba(60, 166, 200, 0.8)'
                  }, {
                    offset: 0.5, color: 'rgba(60, 166, 200, 0.5)'
                  }, {
                    offset: 1, color: 'rgba(60, 166, 200, 0.1)'
                  }]
                }
              }
            },
            // label: {
            //   normal: {
            //     show: false,
            //     position: 'center'
            //   }
            // },
            tooltip: {
              formatter: '{c}',
              backgroundColor: 'rgb(60, 166, 200)',
              textStyle: {
                fontSize: this.fontSizeRs,
                fontFamily: this.fontFamily
              }
            },
            data: yData
          }
        ]
      }
      this.lineZoom.setOption(lineOptions, true)
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
  margin-left: calc(100% / 1058 * 20);
  height: calc(100% / 530 * 60);
  line-height: calc(100% / 530 * 60);
}
.in-out-dynamic>.body {
  height: calc(100% - (100% / 530 * 60) - 20px);
}
.body>.dymc-block {
  height: 50%;
  display: flex;
}
.body>.dymc-block:first-child {
  margin-top: 20px;
}
.body>.dymc-block:first-child>div {
  width: 50%;
  display: flex;
}
.progress-info {
  padding: 5% 0;
  width: 100%;
  display: flex;
}
.progress-info>div {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.progress-info>div:not(:last-child) {
  width: 30%;
  border-left: 1px solid rgba(60, 166, 200, 0.3);
}
.progress-info>div:last-child {
  width: 40%;
  align-items: flex-start;
  padding-left: calc(100% / 120 * 5);
  box-sizing: border-box;
}
.progress-info>div:last-child>div:last-child {
  margin-top: calc(100% / 120 * 10);
}
.info-block>div:last-child {
  margin-top: calc(100% / 60 * 10);
}
.pro-trans {
  width: 60%;
  height: calc(100% / 60 * 50);
  position: relative;
  background-image: url(~@img/merge/icon__flight_percent_valid_4k.png);
  background-position-y: bottom;
  background-repeat:no-repeat;
  background-size: cover;
}
.pro-trans-val {
  width: 100%;
  position: absolute;
  bottom: 0;
  background-position-y: bottom;
  background-repeat:no-repeat;
  background-size: cover;
}
.pro-trans-val-nrm {
  background-image: url(~@img/merge/icon__flight_percent_green_4k.png);
}
.pro-trans-val-arm {
  background-image: url(~@img/merge/icon__flight_percent_yellow_4k.png);
}
.pro-trans:after {
  content: "";
  width: 100%;
  height: calc(120%);
  position: absolute;
  background: #071622;
  top: -10px;
  left: 10px;
  border-radius: 100% 0 0 0;
}
.hour-takeoff-land {
  width: 100%;
  height: 100%;
}
.line {
  width: 100%;
  height: 100%;
}
</style>
