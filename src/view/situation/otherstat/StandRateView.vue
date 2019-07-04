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
        <div id="standBar" class="stat-view"></div>
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
      queryUrl: '/basicdata/flightInOutStat/queryStandUsedStat',
      time: {
        statDate: ''
      },
      standBarEl: null,
      standBar: null,
      standBarOption: {
        title: {
          text: '3月各机位使用频率',
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
            show: true,
            interval: 0,
            // rotate: -45,
            margin: 15,
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
          name: '频率 %',
          min: '0',
          max: 'dataMax',
          nameLocation: 'start',
          padding: [0, 0, 0, 30],
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
            margin: 10,
            color: '#7a939e',
            fontSize: 18,
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
          endValue: 50
        }],
        series: [
          {
            name: '机位使用频率',
            type: 'bar',
            barCategoryGap: '35%',
            itemStyle: {
              normal: {
                color: 'rgba(60, 166, 200, 0.6)'
              }
            },
            label: {
              show: true,
              position: 'top'
            },
            markLine: {
              symbol: ['arrow', 'arrow'],
              symbolSize: 8,
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
        stands: ['1 #', '2 #', '3 #', '4 #', '5 #', '6 #', '7 #', '8 #', '9 #', '10 #', '11 #', '12 #', '13 #', '14 #', '15 #', '16 #'],
        time: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
        total: 0,
        rate: []
      }
    }
  },
  mounted () {
    this.standBarEl = document.getElementById('standBar')
    this.standBar = this.$echarts.init(this.standBarEl)
    window.onresize = () => {
      this.$nextTick(() => {
        this.standBar.resize()
      })
    }
  },
  methods: {
    queryDataReq () {
      let that = this
      queryAllStat(this.queryUrl, this.time).then(res => {
        if (res.data.code == 0) {
          this.restore(res.data.data)
        } else {
          this.restore()
        }
        let month = this.time.statDate.split('-')[1].replace(/\b(0+)/gi, '')
        this.standBarOption.title.text = month + '月各机位使用频率'
        that.setLastUpdateTime()
        that.updateView()
      }, 100)
    },
    restore (data) {
      if (data) {
        this.data.stands = data.stands || []
        this.data.total = data.total[0]
        this.data.used = data.used || []
        this.data.rate = []
      } else {
        this.data = {
          stands: [],
          total: [],
          used: [],
          rate: []
        }
      }
      this.standBarOption.xAxis.data = this.data.stands
      for (let j = 0; j < this.data.used.length; j++) {
        let rateData = (((this.data.used[j]) / this.data.total) * 100).toFixed(2)
        this.data.rate.push(rateData >= 0 ? rateData : '-')
      }
      this.standBarOption.series[0].data = this.data.rate
    },
    updateView () {
      this.standBar.clear()
      this.standBar.setOption(this.standBarOption, true)
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
                  <td style="width: 200px;">机位编号</td>
                  <td style="width: 200px;">机位使用次数</td>
                  <td style="width: 200px;">机位使用频率（%）</td>
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
            <td style="width: 200px;">${this.data.used[i]}</td>
            <td style="width: 200px;">${series[0].data[i]}</td>
          </tr>`
      }
      table += '</tbody></table></div></div>'
      return table
    },
    exportBefore () {
      let titles = ['机位编号', '机位使用次数', '机位使用频率（%）']
      let arrs = [this.data.stands, this.data.used, this.data.rate]
      let widths = [167, 167, 167]
      exportPDF(this.standBar, titles, arrs, widths, this.standBarOption.title.text)
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
