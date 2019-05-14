<template>
  <div class="other-stat">
    <div>
      <div id="companyBar" class="bar"></div>
    </div>
  </div>
</template>

<script>
import baseMixin from '@/components/mixin/baseMixin'
import { exportPDF } from '@/util/util.js'

export default {
  mixins: [baseMixin],
  data () {
    return {
      companyBarEl: null,
      companyBar: null,
      data: {
        company: ['MC', 'CA', 'CZ', 'SC', '3U', 'JR', 'MF', 'HU', '9H', 'ZH', 'JD', 'OQ', 'G5', 'QW', 'HO', 'MC', 'CA', 'CZ', 'SC', '3U', 'JR', 'MF', 'HU', '9H', 'ZH', 'JD', 'OQ', 'G5', 'QW', 'HO'],
        total: [500, 257, 256, 255, 245, 479, 252, 251, 250, 325, 185, 175, 225, 155, 145, 500, 257, 256, 255, 245, 479, 252, 251, 250, 325, 185, 175, 225, 155, 145],
        delay: [16, 15, 16, 17, 18, 2, 5, 3, 7, 6, 3, 5, 4, 3, 2, 4, 3, 2, 14, 15, 16, 17, 18, 2, 5, 3, 7, 6, 3, 5, 4, 3, 2, 4, 3, 2],
        rate: [],
        runRate: ['12%', '12%', '12%', '12%', '12%', '12%', '12%', '12%', '12%', '12%', '12%', '12%', '12%', '12%', '12%']
      },
      barOptions: {
        title: {
          text: '3月主要航空公司的航班放行正常率',
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
          data: ['航班放行架次', '放行正常率']
        },
        grid: {
          left: 0,
          right: 0,
          top: 60,
          bottom: 50,
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
              optionToContent: this.optionToContent
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
            margin: 15,
            color: '#fff',
            fontSize: 16, // this.fontSizeRs,
            fontFamily: `'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 微软雅黑, Arial, sans-serif`
          },
          data: []
        },
        yAxis: [
          {
            name: '百分比',
            min: '0',
            max: '100',
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
              color: '#7a939e'
            }
          },
          {
            name: '架次',
            min: 0,
            max: 'dataMax',
            nameLocation: 'start',
            splitLine: {
              show: false
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
              // formatter: function (value) {
              //   // x轴文字的改为竖版展示
              //   let str = value.split('')
              //   return str.join('\n')
              // }
            },
            nameTextStyle: {
              color: '#7a939e'
            }
          }
        ],
        dataZoom: [{
          type: 'inside',
          filterMode: 'empty',
          startValue: 0,
          endValue: 30
        }],
        series: [
          {
            name: '航班放行架次',
            type: 'line',
            yAxisIndex: 1,
            barCategoryGap: '35%',
            itemStyle: {
              normal: {
                color: 'rgba(60, 166, 200, 1)'
              }
            },
            label: {
              show: true,
              position: 'insideTop',
              distance: 15
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
                    offset: 0, color: 'rgba(60, 166, 200, 1)'
                  }, {
                    offset: 0.5, color: 'rgba(60, 166, 200, 0.7)'
                  }, {
                    offset: 1, color: 'rgba(60, 166, 200, 0.1)'
                  }]
                }
              }
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
            name: '放行正常率',
            type: 'bar',
            yAxisIndex: 0,
            barCategoryGap: '45%',
            itemStyle: {
              normal: {
                color: 'rgba(8, 167, 130, 0.8)'
              }
            },
            label: {
              show: true,
              position: 'top',
              distance: 15,
              formatter: '{c}%'
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
    this.companyBarEl = document.getElementById('companyBar')
    this.companyBar = this.$echarts.init(this.companyBarEl)
    this.queryDataReq()
    window.onresize = () => {
      this.$nextTick(() => {
        this.companyBar.resize()
      })
    }
  },
  methods: {
    queryDataReq (status) {
      let that = this
      setTimeout(() => {
        this.barOptions.xAxis.data = this.data.company
        that.barOptions.series[0].data = this.data.total
        for (let i = 0; i < that.data.total.length; i++) {
          let rateData = (((that.data.total[i] - that.data.delay[i]) / that.data.total[i]) * 100).toFixed(2)
          that.data.rate.push(rateData)
        }
        that.barOptions.yAxis[0].min = Math.min(...that.data.rate) - Math.min(...that.data.rate) % 10 - 5
        that.barOptions.yAxis[0].min = that.barOptions.yAxis[0].min > 0 ? that.barOptions.yAxis[0].min : 0
        // that.barOptions.yAxis[0].splitNumber = (that.barOptions.yAxis[0].max - that.barOptions.yAxis[0].min) / 5
        that.barOptions.series[1].data = that.data.rate
        that.setLastUpdateTime()
        that.updateView()
      }, 100)
      this.updateView()
    },
    optionToContent (opt) {
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
                  <td style="width: 180px;">航空公司</td>
                  <td style="width: 180px;">航班放行架次</td>
                  <td style="width: 180px;">航班放行正常率（%）</td>
                  <td style="width: 200px;">航班放行延误架次</td>
                  <td style="width: 200px;">运营出港航班占比（%）</td>
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
            <td style="width: 200px;">${this.data.delay[i]}</td>
            <td style="width: 200px;">${this.data.runRate[i]}</td>
          </tr>`
      }
      table += '</tbody></table></div></div>'
      return table
    },
    updateView () {
      if (this.companyBar) {
        this.companyBar.clear()
      }
      this.companyBar.setOption(this.barOptions, true)
      this.companyBar.on('legendToggleSelect', (params) => {
        debugger
      })
    },
    exportBefore () {
      let titles = ['航空公司', '航班放行架次', '航班放行正常率（%）', '航班放行延误架次', '运营出港航班占比（%）']
      let arrs = [this.data.company, this.data.total, this.data.rate, this.data.delay, this.data.runRate]
      let widths = [100, 100, 100, 100, 100]
      exportPDF(this.companyBar, titles, arrs, widths, this.barOptions.title.text, 22)
    }
  }
}
</script>

<style scoped>
.other-stat>div,
.bar {
  width: 100%;
  height: 100%;
}
.other-stat {
  width: calc(100% - 40px);
  height: calc(100% - 40px);
  padding: 20px;
}
</style>
