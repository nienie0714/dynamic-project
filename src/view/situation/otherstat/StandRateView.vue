<template>
  <div class="other-stat">
    <div class="bar-wrapper">
      <div id="standBar" class="bar"></div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
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
          name: '频率',
          min: '0',
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
            fontSize: 18,
            fontFamily: `'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 微软雅黑, Arial, sans-serif`
          },
          nameTextStyle: {
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
        city: ['1 #', '2 #', '3 #', '4 #', '5 #', '6 #', '7 #', '8 #', '9 #', '10 #', '11 #', '12 #', '13 #', '14 #', '15 #', '16 #'],
        time: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
        totalTime: 0,
        rate: []
      }
    }
  },
  mounted () {
    this.standBarEl = document.getElementById('standBar')
    this.standBar = this.$echarts.init(this.standBarEl)
    this.data.totalTime = 0
    this.queryDataReq()
    window.onresize = () => {
      this.$nextTick(() => {
        this.standBar.resize()
      })
    }
  },
  methods: {
    queryDataReq () {
      let that = this
      setTimeout(() => {
        that.standBarOption.xAxis.data = that.data.city
        for (let i = 0; i < this.data.time.length; i++) {
          this.data.totalTime += this.data.time[i]
        }
        for (let j = 0; j < that.data.time.length; j++) {
          let rateData = (((that.data.time[j]) / that.data.totalTime) * 100).toFixed(2)
          that.data.rate.push(rateData)
        }
        that.standBarOption.series[0].data = that.data.rate
        that.updateView()
      }, 100)
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
            <td style="width: 200px;">${this.data.time[i]}</td>
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
