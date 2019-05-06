<template>
  <div class="in-out-dynamic merge-block">
    <div class="header">
      <img height="20%" :src="require('@img/title_deco.png')" />
      <span class="header-title font-st">出、进港航班动态</span>
    </div>
    <div class="body">
      <div class="dymc-block">
        <div>
          <div class="progress-circle">
            <div id="outCircle" class="circle"></div>
            <div class="text">
              <div class="font-st font-white">出港计划</div>
              <div class="num-st font-white">128</div>
            </div>
          </div>
          <div class="progress-info">
            <div class="test"></div>
          </div>
        </div>
        <div>
          <div class="progress-circle">
            <div id="inCircle" class="circle"></div>
            <div class="text">
              <div class="font-st font-white">进港计划</div>
              <div class="num-st font-white">90</div>
            </div>
          </div>
          <div class="progress-info">
            <div class="test"></div>
          </div>
        </div>
      </div>
      <div class="dymc-block"></div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      outCircleEl: null,
      outCircle: null,
      inCircleEl: null,
      inCircle: null
    }
  },
  mounted () {
    this.outCircleEl = document.getElementById('outCircle')
    this.outCircle = this.$echarts.init(this.outCircleEl)
    this.inCircleEl = document.getElementById('inCircle')
    this.inCircle = this.$echarts.init(this.inCircleEl)
    this.updateOption()
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
      this.$nextTick(() => {
        window.onresize = () => {
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
        }
      })
    })
  },
  methods: {
    updateOption () {
      let outOptions = {
        tooltip: {
          trigger: 'item',
          confine: true,
          formatter: '{a} <br/>{b}: {c} ({d}%)'
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
              {value: 12, name: '未执行', itemStyle: {color: '#7A939E', borderColor: '#081C2A', borderWidth: 2}},
              {value: 121, name: '已执行', itemStyle: {color: '#3DA6CC', borderColor: '#081C2A', borderWidth: 2}}
            ]
          }
        ]
      }
      this.outCircle.setOption(outOptions, true)
      let inOptions = {
        tooltip: {
          trigger: 'item',
          confine: true,
          formatter: '{a} <br/>{b}: {c} ({d}%)'
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
              {value: 16, name: '未执行', itemStyle: {color: '#7A939E', borderColor: '#081C2A', borderWidth: 2}},
              {value: 74, name: '已执行', itemStyle: {color: '#3DA6CC', borderColor: '#081C2A', borderWidth: 2}}
            ]
          }
        ]
      }
      this.inCircle.setOption(inOptions, true)
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
  margin-top: 20px;
}
.body>.dymc-block:first-child>div {
  width: 50%;
  display: flex;
}
.progress-circle {
  height: 100%;
  position: relative;
}
.progress-circle>.circle {
  height: 100%;
}
.progress-circle>.text {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  pointer-events: none;
}
.progress-circle>.text>div:last-child {
  margin-top: 10px;
}
.progress-info {
  padding: 5% 0;
  width: 100%;
}
.progress-info>div {
  border-left: 1px solid blue;
}
.test {
  width: 70px;
  height: 140px;
  background-color: violet;
  position: relative;
}
.test:after {
  content: "";
  width: 60px;
  height: 150px;
  position: absolute;
  background: #081C2A;
  top: -10px;
  left: 10px;
  border-radius: 100% 0 0 0;
}
</style>
