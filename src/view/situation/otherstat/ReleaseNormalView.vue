<template>
<div class="stat-wrapper">
  <div class="tool-bar">
    <div class="left-button">
      <el-col :span="3" style="margin-right: 20px">
        <el-radio-group v-model="time.type" size="small" @change="radioChange">
          <el-radio-button label="day">月度</el-radio-button>
          <el-radio-button label="month">年度</el-radio-button>
        </el-radio-group>
      </el-col>
      <el-col :span="4">
        <el-date-picker v-model="time.statDate" type="date" placeholder="请选择日期" :editable="false" :clearable="false" :default-value="time.statDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
      </el-col>
    </div>
  </div>
  <div class="other-stat">
    <div class="bar-wrapper">
      <div id="normalBar" class="stat-view"></div>
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
      queryUrl: '/basicdata/flightInOutStat/queryFlightReleaseStat',
      time: {
        type: 'day',
        statDate: ''
      },
      normalBarEl: null,
      normalBar: null,
      normalBarOption: {
        title: {
          text: '航班放行正常率',
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
          selectedMode: false,
          textStyle: {
            color: '#7a939e',
            fontSize: 14, // this.fontSizeRs,
            lineHeight: 14,
            fontFamily: `'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 微软雅黑, Arial, sans-serif`
          }
        },
        grid: {
          left: 60,
          right: 25,
          top: 90,
          bottom: 70,
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
              optionToContent: this.optionToContent
            },
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
          type: 'category',
          boundaryGap: true,
          axisLine: {
            lineStyle: {
              color: 'rgba(60, 166, 200, 0.3)'
            }
          },
          axisLabel: {
            interval: 0,
            color: '#fff',
            fontSize: 16, // this.fontSizeRs,
            fontFamily: `'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 微软雅黑, Arial, sans-serif`
          },
          axisTick: {
            show: false,
            alignWithLabel: true
          },
          data: []
        },
        yAxis: {
          name: '正常率 %',
          min: '0',
          max: '100',
          nameLocation: 'start',
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
            fontSize: 18,
            fontFamily: `'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 微软雅黑, Arial, sans-serif`
          },
          nameTextStyle: {
            padding: [0, 0, 0, -65],
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
            name: '航班放行正常率',
            type: 'bar',
            barCategoryGap: '50%',
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
                {type: 'max', name: '最大值', label: {show: false}}
              ],
              lineStyle: {
                color: 'rgba(60, 166, 200, 0.3)'
              }
            },
            data: []
          }
        ]
      },
      data: {
        unit: ['2019-1', '2019-2', '2019-3', '2019-4', '2019-5', '2019-6', '2019-7', '2019-8', '2019-1', '2019-2', '2019-3', '2019-4', '2019-5', '2019-6', '2019-7', '2019-8'],
        total: [28, 31, 28, 29, 31, 31, 30, 18, 28, 31, 28, 29, 31, 31, 30, 18],
        delay: [21, 21, 12, 12, 11, 11, 9, 7, 21, 21, 12, 12, 11, 11, 9, 7],
        rate: []
      }
    }
  },
  mounted () {
    this.normalBarEl = document.getElementById('normalBar')
    this.normalBar = this.$echarts.init(this.normalBarEl)

    window.onresize = () => {
      this.$nextTick(() => {
        this.normalBar.resize()
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
        let name = ''
        if (this.time.type == 'day') {
          name = this.time.statDate.split('-')[1].replace(/\b(0+)/gi, '')
          this.normalBarOption.title.text = name + '月航班放行正常率'
        } else {
          name = this.time.statDate.split('-')[0]
          this.normalBarOption.title.text = name + '年航班放行正常率'
        }
        this.setLastUpdateTime()
        this.updateView()
      }).catch(() => {
        this.restore()
        this.updateView()
      })
    },
    restore (data) {
      if (data) {
        this.data.unit = data.unit || []
        this.data.total = data.total || []
        this.data.delay = data.delay || []
        this.data.rate = []
      } else {
        this.data = {
          unit: [],
          total: [],
          delay: [],
          rate: []
        }
      }
      this.normalBarOption.xAxis.data = this.data.unit
      for (let i = 0; i < this.data.total.length; i++) {
        let rateData = Math.floor((this.data.total[i] - this.data.delay[i]) / this.data.total[i] * 10000) / 100
        this.data.rate.push(rateData >= 0 ? rateData : '-')
      }
      this.normalBarOption.series[0].data = this.data.rate
    },
    updateView () {
      if (this.normalBar) {
        this.normalBar.clear()
      }
      this.normalBar.setOption(this.normalBarOption, true)
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
                  <td style="width: 180px;">日期</td>
                  <td style="width: 180px;">放行架次</td>
                  <td style="width: 180px;">放行延误架次</td>
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
            <td style="width: 180px;">${this.data.total[i]}</td>
            <td style="width: 180px;">${this.data.delay[i]}</td>
            <td style="width: 200px;">${series[0].data[i]}</td>
          </tr>`
      }
      table += '</tbody></table></div></div>'
      return table
    },
    radioChange () {
      this.queryDataReq()
      this.updateView()
    },
    exportBefore () {
      let titles = ['日期', '放行架次', '放行延误架次', '出港航班放行正常率（%）']
      let arrs = [this.data.unit, this.data.total, this.data.delay, this.data.rate]
      let widths = [80, 110, 110, 200]
      exportPDF(this.normalBar, titles, arrs, widths, this.normalBarOption.title.text)
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
</style>
