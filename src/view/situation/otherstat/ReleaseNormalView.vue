<template>
  <div class="other-stat">
    <div class="tool-bar">
      <div class="left-button">
        <el-button type="primary" icon="el-icon-search" @click="switchTime('year')">年</el-button>
        <el-button type="primary" icon="el-icon-search" @click="switchTime('month')">月</el-button>
        <el-button type="primary" icon="el-icon-search" @click="switchTime('day')">日</el-button>
      </div>
    </div>
    <div class="bar-wrapper">
      <div id="normalBar" class="bar"></div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      normalBarEl: null,
      normalBar: null,
      normalBarOption: {
        title: {
          text: '航班放行正常率',
          x: 'center',
          y: 'top',
          textAlign: 'center',
          textStyle: {
            color: '#fff',
            fontWeight: 'normal',
            fontSize: 18,
            fontFamily: `'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 微软雅黑, Arial, sans-serif`
          }
        },
        legend: {
          show: true,
          bottom: 10,
          inactiveColor: 'rgba(122, 147, 158, 0.6)',
          textStyle: {
            color: '#7a939e',
            fontSize: 14, // this.fontSizeRs,
            fontFamily: `'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 微软雅黑, Arial, sans-serif`
          }
        },
        grid: {
          left: 50,
          right: 50,
          top: 50,
          bottom: 50,
          containLabel: true
        },
        toolbox: {
          top: 0,
          right: '5%',
          itemSize: 20,
          iconStyle: {
            borderColor: '#7a939e'
          },
          feature: {
            dataView: {
              readOnly: true,
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
            lineStyle: {
              color: 'rgba(60,166,200,0.7)'
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
            rotate: 0,
            margin: 15,
            color: '#fff',
            fontSize: 0, // this.fontSizeRs,
            fontFamily: `'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 微软雅黑, Arial, sans-serif`
          },
          axisTick: {
            show: false,
            alignWithLabel: true
          },
          z: 10,
          data: []
        },
        yAxis: {
          // min: 'dataMin',
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
          startValue: -24,
          end: 100
        }],
        series: [
          {
            name: '航班放行正常率',
            type: 'bar',
            symbol: 'circle',
            symbolSize: 8,
            smooth: true,
            connectNulls: true,
            barCategoryGap: '50%',
            itemStyle: {
              normal: {
                color: 'rgb(3, 167, 134)'
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
            tooltip: {
              formatter: '{c}',
              backgroundColor: 'rgb(3, 167, 134)',
              textStyle: {
                fontSize: 0, // this.fontSizeRs,
                fontFamily: `'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 微软雅黑, Arial, sans-serif`
              }
            },
            data: [],
            animation: false
          }
        ]
      },
      data: {
        day: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'],
        month: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        year: ['2019-1', '2019-2', '2019-3', '2019-4', '2019-5', '2019-6', '2019-7', '2019-8', '2019-1', '2019-2', '2019-3', '2019-4', '2019-5', '2019-6', '2019-7', '2019-8'],
        total: [28, 31, 28, 29, 31, 31, 30, 18, 28, 31, 28, 29, 31, 31, 30, 18],
        delay: [21, 21, 12, 12, 11, 11, 9, 7, 21, 21, 12, 12, 11, 11, 9, 7],
        rate: []
      }
    }
  },
  mounted () {
    this.normalBarEl = document.getElementById('normalBar')
    this.normalBar = this.$echarts.init(this.normalBarEl)
    this.$nextTick(() => {
      this.normalBar.resize()
    })
  },
  created () {
    this.queryDataReq()
  },
  methods: {
    queryDataReq () {
      let that = this
      setTimeout(() => {
        that.normalBarOption.xAxis.data = that.data.year
        for (let i = 0; i < that.data.total.length; i++) {
          let rateData = (((that.data.total[i] - that.data.delay[i]) / that.data.total[i]) * 100).toFixed(2)
          that.data.rate.push(rateData)
        }
        that.normalBarOption.series[0].data = that.data.rate
        that.updateView()
      }, 100)
    },
    updateView () {
      this.normalBar.clear()
      this.normalBar.setOption(this.normalBarOption, true)
    },
    optionToContent (opt) {
      var axisData = opt.xAxis[0].data
      var series = opt.series
      var table = '<table style="width:100%;text-align:center"><tbody><tr>' +
                  '<td>日期</td>' +
                  '<td>放行架次</td>' +
                  '<td>放行延误架次</td>' +
                  '<td>' + series[0].name + '</td>' +
                  '</tr>'
      for (var i = 0, l = axisData.length; i < l; i++) {
          table += '<tr>' +
                  '<td>' + axisData[i] + '</td>' +
                  '<td>' + this.data.total[i] + '</td>' +
                  '<td>' + this.data.delay[i] + '</td>' +
                  '<td>' + series[0].data[i] + '</td>' +
                  '</tr>'
      }
      table += '</tbody></table>'
      return table
    },
    switchTime (time) {
      if (time == 'year') {
        this.normalBarOption.xAxis.data = this.data.year
      } else if (time == 'month') {
        this.normalBarOption.xAxis.data = this.data.month
      } else if (time == 'day') {
        this.normalBarOption.xAxis.data = this.data.day
      }
      this.updateView()
    }
  }
}
</script>

<style scoped>
.other-stat,
.other-stat > div:last-child {
  width: 100%;
  height: calc(100% - 25px);
}
.bar-wrapper {
  height: 100%;
  position: relative;
}
.bar-wrapper>.bar {
  height: 100%;
}
.tool-bar {
  padding: 10px 20px;
}
</style>
