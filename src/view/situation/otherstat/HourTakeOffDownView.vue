<template>
  <div class="stat-wrapper">
    <div class="tool-bar">
      <div class="left-button">
        <el-col :span="3">
          <el-date-picker v-model="time.statDate" type="month" placeholder="请选择月份" :editable="false" :clearable="false" :default-value="time.statDate" value-format="yyyy-MM-dd"></el-date-picker>
        </el-col>
      </div>
    </div>
    <div class="other-stat">
      <div>
        <div id="delayBar" class="stat-view"></div>
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
      queryUrl: '/basicdata/flightInOutStat/queryHourArrDepStat',
      time: {
        inOut: 'AD',
        statDate: ''
      },
      delayBarEl: null,
      delayBar: null,
      data: {
        time: ['23:31~00:30', '23:54~00:53', '23:31~00:30', '23:54~00:53', '23:31~00:30', '23:54~00:53', '23:31~00:30', '23:54~00:53', '23:31~00:30', '23:54~00:53', '23:31~00:30', '23:54~00:53', '23:31~00:30', '23:54~00:53', '23:31~00:30', '23:54~00:53', '23:31~00:30', '23:54~00:53', '23:31~00:30', '23:54~00:53', '23:31~00:30', '23:54~00:53', '23:31~00:30', '23:54~00:53', '23:31~00:30', '23:54~00:53', '23:31~00:30', '23:54~00:53', '23:31~00:30', '23:54~00:53', '23:31~00:30', '23:54~00:53', '23:31~00:30', '23:54~00:53', '23:31~00:30', '23:54~00:53', '23:31~00:30', '23:54~00:53', '23:31~00:30', '23:54~00:53'],
        max: [28, 27, 26, 25, 18, 23, 22, 21, 17, 19, 18, 17, 16, 15, 14, 16, 15, 14, 14, 16, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 16, 15, 14, 14, 16],
        avg: [14, 15, 16, 17, 18, 2, 5, 3, 7, 6, 3, 5, 4, 3, 2, 4, 3, 2, 2, 4, 14, 15, 16, 17, 18, 2, 5, 3, 7, 6, 3, 5, 4, 3, 2, 4, 3, 2, 2, 4]
      },
      barOptions: {
        title: {
          text: '5月航班小时起降架次最大值与平均值',
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
          data: ['航班小时起降架次最大值', '月均航班小时起降架次']
        },
        grid: {
          left: 50,
          right: 25,
          top: 90,
          bottom: 90,
          containLabel: false
        },
        toolbox: {
          right: 20,
          top: 40,
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
                            <td style="width: 200px;">时间段</td>
                            <td style="width: 200px;">${series[0].name}</td>
                            <td style="width: 200px;">${series[1].name}</td>
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
                      <td style="width: 200px;">${axisData[i]}</td>
                      <td style="width: 200px;">${series[0].data[i]}</td>
                      <td style="width: 200px;">${series[1].data[i]}</td>
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
            type: 'line',
            axis: 'x',
            lineStyle: {
              color: 'rgba(60,166,200,0.2)'
            }
          }
        },
        xAxis: {
          type: 'category',
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
            margin: 32,
            verticalAlign: 'center',
            align: 'center',
            rotate: -90,
            color: '#fff',
            fontSize: 16, // this.fontSizeRs,
            fontFamily: `'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 微软雅黑, Arial, sans-serif`
          },
          data: []
        },
        yAxis: {
          name: '架次',
          type: 'value',
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
            padding: [0, 0, 0, -50],
            color: '#7a939e'
          }
        },
        dataZoom: [{
          type: 'inside',
          filterMode: 'empty',
          startValue: 0,
          endValue: 999
        }],
        series: [
          {
            name: '航班小时起降架次最大值',
            type: 'line',
            // data: [120, 132, 101, 134, 90, 230, 210]
            symbol: 'circle',
            symbolSize: 8,
            smooth: false,
            connectNulls: true,
            itemStyle: {
              normal: {
                color: 'rgb(3, 167, 134)',
                borderColor: '#071622',
                borderWidth: 2
              }
            },
            lineStyle: {
              opacity: 0.8
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
            name: '月均航班小时起降架次',
            type: 'line',
            symbol: 'circle',
            symbolSize: 8,
            smooth: false,
            itemStyle: {
              normal: {
                color: 'rgb(60, 166, 200)',
                borderColor: '#071622',
                borderWidth: 2
              }
            },
            lineStyle: {
              opacity: 0.8
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
        this.barOptions.title.text = month + '月航班小时起降架次最大值与平均值'
        this.setLastUpdateTime()
        this.updateView()
      }).catch(() => {
        this.restore()
        this.updateView()
      })
    },
    restore (data) {
      if (data) {
        this.data.time = data.time || []
        this.data.max = data.max || []
        this.data.avg = data.avg || []
      } else {
        this.data = {
          time: [],
          max: [],
          avg: []
        }
      }
      this.barOptions.xAxis.data = this.data.time
      this.barOptions.series[0].data = this.data.max
      this.barOptions.series[1].data = this.data.avg
    },
    updateView () {
      if (this.delayBar) {
        this.delayBar.clear()
      }
      this.delayBar.setOption(this.barOptions, true)
    },
    exportBefore () {
      let titles = ['时间段', '航班小时起降架次最大值', '月均航班小时起降架次']
      let arrs = [this.data.time, this.data.max, this.data.avg]
      let widths = [162, 185, 167]
      exportPDF(this.delayBar, titles, arrs, widths, this.barOptions.title.text)
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
