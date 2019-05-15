<template>
  <!-- <div class="other-stat">
    <div>
      <div id="delayBar" class="bar"></div>
      <embed width="100%" height="100%" name="plugin" id="plugin" :src="src" type="application/pdf" internalinstanceid="117">
    </div>
  </div> -->
  <div class="div-wrapper">
    <div class="tool-bar">
      <div class="left-button">
        <el-col :span="4">
          <el-date-picker v-model="time.statDate" type="month" placeholder="请选择月份" :editable="false" :clearable="true" :default-value="time.statDate" value-format="yyyy-MM-dd"></el-date-picker>
        </el-col>
      </div>
    </div>
    <div class="other-stat">
      <div class="bar-wrapper">
        <div id="delayBar" class="bar"></div>
      </div>
    </div>
  </div>
</template>

<script>
import baseMixin from '@/components/mixin/baseMixin'
import { exportPDF } from '@/util/util.js'
import { queryAllStat } from '@/api/base'

export default {
  mixins: [baseMixin],
  data () {
    return {
      queryUrl: '/basicdata/flightInOutStat/queryFlightNoReleaseStat',
      time: {
        statDate: ''
      },
      delayBarEl: null,
      delayBar: null,
      data: {
        flights: ['CA1257', 'HO1335', 'CZ6961', 'JR1517', 'CZ6963', 'SC8752', 'MU2872', 'CZ6118', 'MF8614', 'CZ1786', 'CZ3270', 'ZH9232', 'JD5394', '3U8027', 'MU5692', 'JD5394A', '3U8027A', 'MU5692A', 'JD5394B', '3U8027B', 'MU5692B', 'JD5394C', '3U8027C', 'MU5692C', 'test', 'CA1257'],
        total: [28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 16, 15, 14, 14, 16, 15, 2, 4, 3, 0, 28],
        delay: [14, 15, 16, 17, 18, 2, 5, 3, 7, 6, 3, 5, 4, 3, 2, 4, 3, 2, 2, 4, 3, 2, 4, 3, 0, 14]
      },
      barOptions: {
        title: {
          text: '3月放行延误主要航班',
          x: 'center',
          y: 'top',
          textAlign: 'left',
          textStyle: {
            color: '#fff',
            fontWeight: 'normal',
            fontSize: 20, // this.fontSizeSt,
            fontFamily: `'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 微软雅黑, Arial, sans-serif`
          }
        },
        legend: {
          x: 'center',
          bottom: 0,
          inactiveColor: 'rgba(122, 147, 158, 0.6)',
          itemGap: 20,
          textStyle: {
            color: '#7a939e',
            fontSize: 14, // this.fontSizeRs,
            lineHeight: 14,
            fontFamily: `'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 微软雅黑, Arial, sans-serif`
          },
          data: ['航班离港架次', '放行延误架次']
        },
        grid: {
          left: 0,
          right: 0,
          top: 60,
          bottom: 10,
          containLabel: true
        },
        toolbox: {
          right: 20,
          itemSize: 18, // this.fontSizeRs,
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
                            <td style="width: 180px;">出港航班</td>
                            <td style="width: 180px;">${series[0].name}</td>
                            <td style="width: 180px;">${series[1].name}</td>
                            <td style="width: 200px;">出港航班放行正常率（%）</td>
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
                      <td style="width: 200px;">${Math.floor((series[0].data[i] - series[1].data[i]) / series[0].data[i] * 10000) / 100}</td>
                    </tr>`
                }
                table += '</tbody></table></div></div>'
                return table
              }
            },
            // magicType: {type: ['bar']},
            restore: {},
            mySavePDF: {
              show: true,
              title: '导出pdf',
              icon: 'path://M4.7,22.9L29.3,45.5L54.7,23.4M4.6,43.6L4.6,58L53.8,58L53.8,43.6M29.2,45.1L29.2,0',
              onclick: this.exportBefore
            }
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
            type: 'shadow',
            shadowStyle: {
              color: 'rgba(60,166,200,0.2)'
            }
          }
        },
        xAxis: {
          boundaryGap: true,
          axisLine: {
            lineStyle: {
              color: 'rgba(60, 166, 200, 0.3)'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0,
            margin: 40,
            verticalAlign: 'bottom',
            align: 'center',
            rotate: -45,
            color: '#fff',
            fontSize: 16, // this.fontSizeRs,
            fontFamily: `'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 微软雅黑, Arial, sans-serif`
          },
          data: []
        },
        yAxis: {
          name: '架次',
          min: 0,
          max: 'dataMax',
          nameLocation: 'start',
          padding: [0, 0, 0, 55],
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
            fontSize: 18, // this.fontSizeRs,
            fontFamily: `'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 微软雅黑, Arial, sans-serif`
          },
          nameTextStyle: {
            padding: [0, 0, 0, -40],
            color: '#7a939e'
          }
        },
        dataZoom: [{
          type: 'inside',
          filterMode: 'empty',
          startValue: 0,
          endValue: 20
        }],
        series: [
          {
            name: '航班离港架次',
            type: 'bar',
            itemStyle: {
              normal: {
                color: 'rgba(3, 167, 134, 0.8)'
              }
            },
            label: {
              show: true,
              position: 'top'
            },
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
            name: '放行延误架次',
            type: 'bar',
            itemStyle: {
              normal: {
                color: 'rgba(60, 166, 200, 0.8)'
              }
            },
            label: {
              show: true,
              position: 'top'
            },
            markLine: {
              symbol: ['arrow', 'arrow'],
              symbolSize: 10,
              symbolOffset: [0, -2],
              data: [
                {type: 'max', name: '最大值', label: {position: 'end'}}
              ],
              lineStyle: {
                color: 'rgba(60, 166, 200, 0.3)'
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
    this.delayBarEl = document.getElementById('delayBar')
    this.delayBar = this.$echarts.init(this.delayBarEl)
    window.onresize = () => {
      this.$nextTick(() => {
        this.delayBar.resize()
        let opts = {
          type: 'png',
          excludeComponents: ['toolbox']
        }
      })
    }
  },
  methods: {
    queryDataReq () {
      queryAllStat(this.queryUrl, this.time).then(res => {
        if (res.data.code == 0) {
          this.restore(res.data.data)
        } else {
          this.restore()
        }
        let month = this.time.statDate.split('-')[1].replace(/\b(0+)/gi, '')
        this.barOptions.title.text = month + '月放行延误主要航班'
        this.barOptions.xAxis.data = this.data.flights
        this.barOptions.series[0].data = this.data.total
        this.barOptions.series[1].data = this.data.delay
        this.setLastUpdateTime()
        this.updateView()
      }).catch(() => {
        this.restore()
        this.updateView()
      })
    },
    restore (data) {
      if (data) {
        this.data.flights = data.flights || []
        this.data.total = data.total || []
        this.data.delay = data.delay || []
      } else {
        this.data = {
          flights: [],
          total: [],
          delay: []
        }
      }
    },
    updateView () {
      if (this.delayBar) {
        this.delayBar.clear()
      }
      this.delayBar.setOption(this.barOptions, true)
    },
    exportBefore () {
      let percs = []
      this.data.flights.forEach((item, i) => {
        let perc = Math.floor((this.data.total[i] - this.data.delay[i]) / this.data.total[i] * 10000) / 100
        percs.push(perc >= 0 ? perc : '-')
      })
      let titles = ['出港航班', '航班离港架次', '放行延误架次', '出港航班放行正常率（%）']
      let arrs = [this.data.flights, this.data.total, this.data.delay, percs]
      let widths = [80, 110, 110, 200]
      exportPDF(this.delayBar, titles, arrs, widths)
    }
  },
  watch: {
    latestDate: {
      handler (value) {
        this.time.statDate = value.replace(/\//g, '-')
      },
      immediate: false
    },
    'time.statDate': {
      handler (value) {
        this.queryDataReq()
      }
    }
  }
}
</script>

<style scoped>
.div-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.tool-bar {
  margin-left: 20px;
  height: 60px;
}
.other-stat>div,
.bar {
  width: 100%;
  height: 100%;
}
.other-stat {
  width: calc(100% - 40px);
  height: calc(100% - 72px);
  padding: 20px;
}
</style>
