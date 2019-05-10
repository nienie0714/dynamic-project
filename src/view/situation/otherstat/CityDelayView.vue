<template>
  <div class="other-stat">
    <div class="bar-wrapper">
      <div id="cityBar" class="bar"></div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
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
          min: '0',
          max: '100',
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
              position: 'insideTop',
              distance: 15
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
    this.queryDataReq()
    window.onresize = () => {
      this.$nextTick(() => {
        this.cityBar.resize()
      })
    }
  },
  methods: {
    queryDataReq () {
      let that = this
      setTimeout(() => {
        that.cityBarOption.xAxis.data = that.data.city
        for (let i = 0; i < that.data.total.length; i++) {
          let rateData = (((that.data.total[i] - that.data.delay[i]) / that.data.total[i]) * 100).toFixed(2)
          that.data.rate.push(rateData)
        }
        that.cityBarOption.series[0].data = that.data.rate
        that.updateView()
      }, 100)
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
                  <td style="width: 180px;">放行延误航班架次</td>
                  <td style="width: 200px;">城市放行正常率（%）</td>
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
