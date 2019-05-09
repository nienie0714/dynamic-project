<template>
  <div class="other-stat">
    <div>
      <div id="delayBar" class="line"></div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      delayBarEl: null,
      delayBar: null,
      data: {
        flights: ['CA1257', 'HO1335', 'CZ6961', 'JR1517', 'CZ6963', 'SC8752', 'MU2872', 'CZ6118', 'MF8614', 'CZ1786', 'CZ3270', 'ZH9232', 'JD5394', '3U8027', 'MU5692'],
        total: [28, 31, 28, 29, 31, 31, 30, 18, 28, 31, 31, 18, 31, 27, 31],
        delay: [21, 21, 12, 12, 11, 11, 9, 7, 6, 5, 7, 6, 9, 5, 5]
      }
    }
  },
  mounted () {
    this.delayBarEl = document.getElementById('delayBar')
    this.delayBar = this.$echarts.init(this.delayBarEl)
    this.$nextTick(() => {
      this.delayBar.resize()
      // setTimeout(() => this.lineZoom.setOption(this.lineOptions, true), 100)
    })
  },
  methods: {
    queryDataReq () {

    }
  }
}
</script>

<style scoped>
.other-stat {

}
</style>
