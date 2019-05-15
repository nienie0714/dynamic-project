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
              <div class="num-st font-white">{{data.flightStatD.totalFlight}}</div>
            </div>
          </div>
          <div class="progress-info">
            <div>
              <div class="info-block">
                <div class="font-rs font-gray">已执行</div>
                <div class="num-nd font-white">{{data.flightStatD.execFlight}}</div>
              </div>
              <div class="info-block">
                <div class="font-rs font-gray">未执行</div>
                <div class="num-nd font-white">{{data.flightStatD.noExecFlight}}</div>
              </div>
            </div>
            <div>
              <div class="info-block">
                <div class="font-rs font-gray">取消</div>
                <div class="num-nd font-white">{{data.flightStatD.canFlight}}</div>
              </div>
              <div class="info-block">
                <div class="font-rs font-gray">延误</div>
                <div class="num-nd font-yellow">{{data.flightStatD.dlyFlight}}</div>
              </div>
            </div>
            <div class="info-block">
              <div class="font-rs font-gray">出港正常率 %</div>
              <div class="pro-trans">
                <div :class="['pro-trans-val', (data.flightStatD.normalPec>=pecBase)?'pro-trans-val-nrm':'pro-trans-val-arm']" :style="`height: ${data.flightStatD.normalPec}%;`"></div>
                <div class="pro-text container cross">
                  <div v-if="data.flightStatD.normalPec != '--'" :class="['font-rs', (data.flightStatD.normalPec>=pecBase) ? 'font-green' : 'font-yellow']">{{(data.flightStatD.normalPec>=pecBase) ? '正常' : '偏低'}}</div>
                  <div class="num-rd font-white">{{data.flightStatD.normalPec}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="progress-circle">
            <div id="inCircle" class="circle"></div>
            <div class="text">
              <div class="font-st font-white">进港计划</div>
              <div class="num-st font-white">{{data.flightStatA.totalFlight}}</div>
            </div>
          </div>
          <div class="progress-info">
            <div>
              <div class="info-block">
                <div class="font-rs font-gray">已执行</div>
                <div class="num-nd font-white">{{data.flightStatA.execFlight}}</div>
              </div>
              <div class="info-block">
                <div class="font-rs font-gray">未执行</div>
                <div class="num-nd font-white">{{data.flightStatA.noExecFlight}}</div>
              </div>
            </div>
            <div>
              <div class="info-block">
                <div class="font-rs font-gray">取消</div>
                <div class="num-nd font-white">{{data.flightStatA.canFlight}}</div>
              </div>
              <div class="info-block">
                <div class="font-rs font-gray">延误</div>
                <div class="num-nd font-yellow">{{data.flightStatA.dlyFlight}}</div>
              </div>
            </div>
            <div class="info-block">
              <div class="font-rs font-gray">进港正常率 %</div>
              <div class="pro-trans">
                <div :class="['pro-trans-val', (data.flightStatA.normalPec>=pecBase)?'pro-trans-val-nrm':'pro-trans-val-arm']" :style="`height: ${data.flightStatA.normalPec}%;`"></div>
                <div class="pro-text container cross">
                  <div v-if="data.flightStatA.normalPec != '--'" :class="['font-rs', (data.flightStatA.normalPec>=pecBase) ? 'font-green' : 'font-yellow']">{{(data.flightStatA.normalPec>=pecBase) ? '正常' : '偏低'}}</div>
                  <div class="num-rd font-white">{{data.flightStatA.normalPec}}</div>
                </div>
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
import { queryAllStat } from '@/api/base'
import _ from 'lodash'

export default {
  props: ['resize', 'refrush'],
  data () {
    return {
      outCircleEl: null,
      outCircle: null,
      inCircleEl: null,
      inCircle: null,
      lineZoomEl: null,
      lineZoom: null,
      fontSizeSt: 0,
      fontSizeRs: 0,
      pecBase: 50,
      queryUrl: '/basicdata/flightInOutStat/queryFlightStat',
      data: {
        flightStatD: {
          totalFlight: '-',
          execFlight: '-',
          noExecFlight: '-',
          canFlight: '-',
          dlyFlight: '-',
          normalPec: 0
        },
        flightStatA: {
          totalFlight: '-',
          execFlight: '-',
          noExecFlight: '-',
          canFlight: '-',
          dlyFlight: '-',
          normalPec: 0
        },
        perFlight: {
          in: [],
          time: [],
          out: []
        }
      },
      outOptions: {
        tooltip: {
          trigger: 'item',
          confine: true,
          formatter: '{a} <br/>{b}: {c} ({d}%)',
          extraCssText:
            `background-color: rgba(19, 47, 64, 0.96);
            border: 1px solid rgba(60, 166, 200, 0.7);
            box-shadow: 0 0 30px rgba(60, 166, 200, 0.4) inset, 0 8px 20px rgba(6, 13, 20, 0.9);
            border-radius: 8px;`
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
              {value: 0, name: '未执行', itemStyle: {color: '#7A939E', borderColor: '#071622', borderWidth: 2}},
              {value: 0, name: '已执行', itemStyle: {color: '#3DA6CC', borderColor: '#071622', borderWidth: 2}}
            ]
          }
        ]
      },
      inOptions: {
        tooltip: {
          trigger: 'item',
          confine: true,
          formatter: '{a} <br/>{b}: {c} ({d}%)',
          extraCssText:
            `background-color: rgba(19, 47, 64, 0.96);
            border: 1px solid rgba(60, 166, 200, 0.7);
            box-shadow: 0 0 30px rgba(60, 166, 200, 0.4) inset, 0 8px 20px rgba(6, 13, 20, 0.9);
            border-radius: 8px;`
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
              {value: 0, name: '未执行', itemStyle: {color: '#7A939E', borderColor: '#071622', borderWidth: 2}},
              {value: 0, name: '已执行', itemStyle: {color: '#3DA6CC', borderColor: '#071622', borderWidth: 2}}
            ]
          }
        ]
      },
      lineOptions: {
        title: {
          text: '每小时起降架次',
          textAlign: 'left',
          left: 100 / 1065 * 20 + '%',
          textStyle: {
            color: '#fff',
            fontWeight: 'normal',
            fontSize: 0, // this.fontSizeSt,
            fontFamily: `'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 微软雅黑, Arial, sans-serif`
          }
        },
        legend: {
          align: 'auto',
          inactiveColor: 'rgba(122, 147, 158, 0.6)',
          itemGap: 20,
          textStyle: {
            color: '#7a939e',
            fontSize: 0, // this.fontSizeRs,
            fontFamily: `'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 微软雅黑, Arial, sans-serif`
          },
          data: ['出港', '进港']
        },
        grid: {
          left: 100 / 1065 * 40 + '%',
          right: 100 / 1065 * 45 + '%',
          top: 100 / 224 * 40 + '%',
          bottom: 100 / 224 * 10 + '%',
          containLabel: true
        },
        toolbox: {
          right: 100 / 1065 * 35 + '%',
          itemSize: 0, // this.fontSizeRs,
          iconStyle: {
            borderColor: '#7a939e'
          },
          feature: {
            dataView: {
              title: '转换表格',
              readOnly: true,
              backgroundColor: 'transparent',
              textareaColor: 'rgba(8, 25, 38, 1)',
              textareaBorderColor: 'rgba(60, 166, 200, 0.7)',
              textColor: '#fff',
              lang: ['', '关闭'],
              buttonColor: 'rgba(60, 166, 200, 0.4)',
              optionToContent: function (opt) {
                let axisData = opt.xAxis[0].data
                let series = opt.series
                let table = `
                  <div class="echarts-view">
                    <div class="close el-dialog__headerbtn">
                      <i class="el-dialog__close el-icon el-icon-close" onclick="documentElement.getElementsByClassName('echarts-view')[0].parentElement.parentElement.style.display = 'none'"></i>
                    </div>
                    <div class="header">
                      <table class="echarts-table" border="1" cellpadding="0" cellspacing="0">
                        <tbody>
                          <tr>
                            <td style="width: 180px;">统计</td>
                            <td style="width: 180px;">${series[0].name}</td>
                            <td style="width: 180px;">${series[1].name}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div class="body">
                      <table class="echarts-table" border="1" cellpadding="0" cellspacing="0">
                        <tbody>`
                for (let i = 0, l = axisData.length; i < l; i++) {
                  table += `
                    <tr>
                      <td style="width: 180px;">${axisData[i]}</td>
                      <td style="width: 180px;">${series[0].data[i]}</td>
                      <td style="width: 180px;">${series[1].data[i]}</td>
                    </tr>`
                }
                table += '</tbody></table></div></div>'
                return table
              }
            },
            restore: {},
            saveAsImage: {}
          }
        },
        tooltip: {
          trigger: 'axis',
          confine: true,
          extraCssText:
            `background-color: rgba(19, 47, 64, 0.96);
            border: 1px solid rgba(60, 166, 200, 0.7);
            box-shadow: 0 0 30px rgba(60, 166, 200, 0.4) inset, 0 8px 20px rgba(6, 13, 20, 0.9);
            border-radius: 8px;`,
          axisPointer: {
            lineStyle: {
              color: 'rgba(60,166,200,0.7)'
            }
          }
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
            fontSize: 0, // this.fontSizeRs,
            fontFamily: `'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 微软雅黑, Arial, sans-serif`
          },
          data: []
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
            fontSize: 0, // this.fontSizeRs,
            fontFamily: `'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 微软雅黑, Arial, sans-serif`
          }
        },
        dataZoom: [{
          type: 'inside',
          filterMode: 'none',
          startValue: -24,
          end: 100
        }],
        series: [
          {
            name: '出港',
            type: 'line',
            // data: [120, 132, 101, 134, 90, 230, 210]
            symbol: 'circle',
            symbolSize: 8,
            smooth: true,
            connectNulls: true,
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
                fontSize: 0, // this.fontSizeRs,
                fontFamily: `'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 微软雅黑, Arial, sans-serif`
              }
            },
            data: []
          },
          {
            name: '进港',
            type: 'line',
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
            tooltip: {
              formatter: '{c}',
              backgroundColor: 'rgb(60, 166, 200)',
              textStyle: {
                fontSize: 0, // this.fontSizeRs,
                fontFamily: `'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 微软雅黑, Arial, sans-serif`
              }
            },
            data: []
          }
        ]
      }
    }
  },
  mounted () {
    this.pecBase = parseFloat(this.$store.getters.getCfgVal('fltRag'))
    this.outCircleEl = document.getElementById('outCircle')
    this.outCircle = this.$echarts.init(this.outCircleEl)
    this.inCircleEl = document.getElementById('inCircle')
    this.inCircle = this.$echarts.init(this.inCircleEl)
    this.lineZoomEl = document.getElementById('lineZoom')
    this.lineZoom = this.$echarts.init(this.lineZoomEl)
    this.updateView()
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
      setTimeout(() => this.lineZoom.setOption(this.lineOptions, true), 100)
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
      setTimeout(() => this.lineZoom.setOption(this.lineOptions, true), 100)
    },
    updateData () {
      queryAllStat(this.queryUrl).then(res => {
        if (res.data.code == 0) {
          for (let key in this.data) {
            if (res.data.data[key]) {
              for (let name in this.data[key]) {
                if (name == 'normalPec') {
                  if (res.data.data[key]['totalFlight'] && (res.data.data[key]['execFlight'] != null)) {
                    this.$set(this.data[key], 'normalPec', Math.floor(res.data.data[key]['execFlight'] / res.data.data[key]['totalFlight'] * 100))
                  } else {
                    this.$set(this.data[key], 'normalPec', '--')
                  }
                } else {
                    this.$set(this.data[key], name, (res.data.data[key].hasOwnProperty(name)) ? res.data.data[key][name] : '-')
                }
              }
            }
          }
        } else {
          this.restore()
        }
        this.lineOptions.xAxis.data = this.data.perFlight.time
        this.lineOptions.series[0].data = this.data.perFlight.out
        this.lineOptions.series[1].data = this.data.perFlight.in
        this.updateView()
      }).catch(() => {
        this.restore()
        this.lineOptions.xAxis.data = this.data.perFlight.time
        this.lineOptions.series[0].data = this.data.perFlight.out
        this.lineOptions.series[1].data = this.data.perFlight.in
        this.updateView()
      })
    },
    updateView () {
      this.outCircle.setOption(this.outOptions, true)
      this.inCircle.setOption(this.inOptions, true)
      this.lineZoom.setOption(this.lineOptions, true)
    },
    restore () {
      this.data = {
        flightStatD: {
          totalFlight: '-',
          execFlight: '-',
          noExecFlight: '-',
          canFlight: '-',
          dlyFlight: '-',
          normalPec: 0
        },
        flightStatA: {
          totalFlight: '-',
          execFlight: '-',
          noExecFlight: '-',
          canFlight: '-',
          dlyFlight: '-',
          normalPec: 0
        },
        perFlight: {
          in: [],
          time: [],
          out: []
        }
      }
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
    },
    fontSizeSt: {
      handler (value) {
        this.lineOptions.title.textStyle.fontSize = value
      }
    },
    fontSizeRs: {
      handler (value) {
        this.lineOptions.legend.textStyle.fontSize = value
        this.lineOptions.toolbox.itemSize = value
        this.lineOptions.xAxis.axisLabel.fontSize = value
        this.lineOptions.yAxis.axisLabel.fontSize = value
        this.lineOptions.series[0].tooltip.textStyle.fontSize = value
        this.lineOptions.series[0].symbolSize = value / 2
        this.lineOptions.series[0].itemStyle.normal.borderWidth = value / 10
        this.lineOptions.series[1].tooltip.textStyle.fontSize = value
        this.lineOptions.series[1].symbolSize = value / 2
        this.lineOptions.series[1].itemStyle.normal.borderWidth = value / 10
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
  margin-right: calc(100% / 1058 * 20);
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
  padding-left: calc(100% / 120 * 3);
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
.pro-text {
  position: absolute;
  bottom: 0;
  left: calc(100% / 66 * 20 + 10px);
  z-index: 1;
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
