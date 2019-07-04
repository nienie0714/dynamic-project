<template>
  <div class="stat-wrapper">
    <div class="tool-bar">
      <div class="left-button">
        <el-col :span="3">
          <el-date-picker v-model="time.statDate" type="date" placeholder="请选择日期" :editable="false" :clearable="false" :default-value="time.statDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
        </el-col>
      </div>
    </div>
    <div class="other-stat">
      <div>
        <div id="cityBar" class="stat-view"></div>
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
      queryUrl: '/basicdata/flightInOutStat/queryCityReleaseStat',
      time: {
        statDate: ''
      },
      cityBarEl: null,
      cityBar: null,
      cityBarOption: {
        title: {
          text: '飞往各城市航班放行延误情况',
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
            rotate: -45,
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
          name: '正常率 %',
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
            padding: [0, 0, 0, -65],
            color: '#7a939e'
          }
        },
        dataZoom: [{
          type: 'inside',
          filterMode: 'empty',
          startValue: 0,
          endValue: 25
        }],
        series: [
          {
            name: '航班放行正常率',
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
              symbolSize: 10,
              symbolOffset: [0, 0],
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
        city: ['西安', '北京', '成都', '上海', '重庆', '广州', '厦门', '沈阳', '西安', '北京', '成都', '上海', '重庆', '广州', '厦门', '沈阳', '西安', '北京', '成都', '上海', '重庆', '广州', '厦门', '沈阳', '西安', '北京', '成都', '上海', '重庆', '广州', '厦门', '沈阳', '西安', '北京', '成都', '上海', '重庆', '广州', '厦门', '沈阳', '西安', '北京', '成都', '上海', '重庆', '广州', '厦门', '沈阳', '西安', '北京', '成都', '上海', '重庆', '广州', '厦门', '沈阳', '西安', '北京', '成都', '上海', '重庆', '广州', '厦门', '沈阳'],
        total: [28, 31, 28, 29, 31, 31, 30, 18, 28, 31, 28, 29, 31, 31, 30, 18, 28, 31, 28, 29, 31, 31, 30, 18, 28, 31, 28, 29, 31, 31, 30, 18, 28, 31, 28, 29, 31, 31, 30, 18, 28, 31, 28, 29, 31, 31, 30, 18],
        delay: [21, 21, 12, 12, 11, 11, 9, 7, 21, 21, 12, 12, 11, 11, 9, 7, 21, 21, 12, 12, 11, 11, 9, 7, 21, 21, 12, 12, 11, 11, 9, 7, 21, 21, 12, 12, 11, 11, 9, 7, 21, 21, 12, 12, 11, 11, 9, 7],
        rate: []
      }
    }
  },
  mounted () {
    this.cityBarEl = document.getElementById('cityBar')
    this.cityBar = this.$echarts.init(this.cityBarEl)
    window.onresize = () => {
      this.$nextTick(() => {
        this.cityBar.resize()
      })
    }
  },
  methods: {
    queryDataReq () {
      this.time.statDate = this.time.statDate == '2019-05-16' ? '2019-05-14' : this.time.statDate
      queryAllStat(this.queryUrl, this.time).then(res => {
        if (res.data.code == 0) {
          this.restore(res.data.data)
        } else {
          this.restore()
        }
        for (let i = 0; i < this.data.total.length; i++) {
          let rateData = Math.floor((this.data.total[i] - this.data.delay[i]) / this.data.total[i] * 10000) / 100
          this.data.rate.push(rateData >= 0 ? rateData : '-')
        }
        this.cityBarOption.xAxis.data = this.data.city
        this.cityBarOption.series[0].data = this.data.rate
        this.setLastUpdateTime()
        this.updateView()
      }).catch(() => {
        this.restore()
        this.updateView()
      })
    },
    restore (data) {
      if (data) {
        this.data.city = data.city || []
        this.data.total = data.total || []
        this.data.delay = data.delay || []
        this.data.rate = []
      } else {
        this.data = {
          city: [],
          total: [],
          delay: [],
          rate: []
        }
      }
    },
    updateView () {
      this.cityBar.clear()
      this.cityBar.setOption(this.cityBarOption, true)
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
                  <td style="width: 180px;">航班目的地城市</td>
                  <td style="width: 180px;">执飞架次</td>
                  <td style="width: 200px;">城市放行正常率（%）</td>
                  <td style="width: 180px;">放行延误航班架次</td>
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
            <td style="width: 200px;">${series[0].data[i]}</td>
            <td style="width: 180px;">${this.data.delay[i]}</td>
          </tr>`
      }
      table += '</tbody></table></div></div>'
      return table
    },
    exportBefore () {
      let titles = ['航班目的地城市', '执飞架次', '城市放行正常率（%）', '放行延误航班架次']
      let arrs = [this.data.city, this.data.total, this.data.rate, this.data.delay]
      let widths = [130, 115, 150, 115]
      exportPDF(this.cityBar, titles, arrs, widths, this.cityBarOption.title.text, 21)
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
