<script>
import {getQueryAll} from '../../api/base.js'

export default {
  data () {
    return {
      loginName: '王媛',
      // 最新时间
      latestDate: '1900/01/01',
      latestTime: '00:00',
      latestWeek: '一',
      newTime: new Date(),
      intervalTime: 1000
    }
  },
  mounted () {
    var _this = this
    getQueryAll('/', null).then(res => {
      this.newTime = new Date(res.headers.date)
      this.timer = setInterval(this.refrushNowTime, this.intervalTime)
    })
  },
  methods: {
    // 定时器实时刷新当前时间
    refrushNowTime () {
      this.newTime = new Date(this.newTime.getTime() + this.intervalTime)
      var today = this.newTime
      var hour = this.addZero(today.getHours())
      var min = this.addZero(today.getMinutes())
      var now = `${hour}:${min}`
      if (now != this.latestTime) {
        this.latestTime = now
      }
      var dateStr = `${today.getFullYear()}/${this.addZero(today.getMonth() + 1)}/${this.addZero(today.getDate())}`
      if (dateStr != this.latestDate) {
        this.latestDate = dateStr
        this.latestWeek = '日一二三四五六'.charAt(new Date().getDay())
      }
    },
    addZero (value) {
      if (value < 10) {
        return `0${value}`
      } else {
        return value
      }
    },
    formatterTimeOfHM (time) {
      if (time) {
        var date = new Date(time)
        var hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
        var minite = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
        return `${hour}:${minite}`
      } else {
        return '—:—'
      }
    },
    formatterTimeOfYMDHMS (time, split) {
      if (time) {
        var date = new Date(time)
        var dateStr = `${date.getFullYear()}${split}${this.addZero(date.getMonth() + 1)}${split}${this.addZero(date.getDate())}`
        var hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
        var minite = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
        var second = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
        return `${dateStr} ${hour}:${minite}:${second}`
      } else {
        return '—'
      }
    },
    formatterNewtimeOfYMD () {
        var date = this.newTime
        var dateStr = `${date.getFullYear()}-${this.addZero(date.getMonth() + 1)}-${this.addZero(date.getDate())}`
        return `${dateStr}`
    }
  }
}
</script>
