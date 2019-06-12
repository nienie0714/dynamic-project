<script>
import { queryPageDataList } from '../../api/base'
import baseMixin from './baseMixin'
import _ from 'lodash'

export default {
  mixins: [baseMixin],
  data () {
    return {
      homeRouterData: [],
      // 分页参数
      pageData: {
        currentPage: 1,
        pageSizes: [10, 20, 30],
        pageSize: 10,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0
      },
      // 下载文件名
      fileName: '无线站坪调度基础数据导出.xls'
    }
  },
  mounted () {
    this.homeRouterData = this.$store.getters.getHomeRouterData
    const that = this
    window.name = this.$route.name
    _.forEach(this.homeRouterData, (item) => {
      if (this.$route.matched[0].path == item.path) {
        // 下载文件名
        this.fileName = localStorage.getItem(item.name) + '.xls'
        this.$set(this.importData, 'fileName', localStorage.getItem(item.name))
      }
    })
    this.$nextTick(() => {
      that.queryResourcePerm()
      var targetTop2 = this.$refs.basicTable.$refs.baseTable.$el.querySelector('.el-table__body-wrapper').getBoundingClientRect().top
      var titleHeight2 = this.$refs.basicTable.$refs.baseTable.$el.querySelector('.el-table__header-wrapper').getBoundingClientRect().height
      this.tableData.height = window.innerHeight - targetTop2 + titleHeight2 - 30
      var asideView = this.$root.$el.querySelector('.el-aside')
      var basicContView = this.$root.$el.querySelector('.basic-resource-contain')
      // var basicWidth = window.innerWidth - asideView.offsetWidth - 40
      // basicContView.style.width = basicWidth + 'px'
      window.onresize = () => {
        this.$nextTick(() => {
          return (() => {
            const targetTop = that.$refs.basicTable.$refs.baseTable.$el.querySelector('.el-table__body-wrapper').getBoundingClientRect().top
            var titleHeight = that.$refs.basicTable.$refs.baseTable.$el.querySelector('.el-table__header-wrapper').getBoundingClientRect().height
            that.tableData.height = window.innerHeight - targetTop + titleHeight - 30
            var basicWidth = window.innerWidth - asideView.offsetWidth - 40
            basicContView.style.width = basicWidth + 'px'
          })()
        })
      }
    })
  },
  methods: {
    customBeforeQuery () {
      return true
    },
    // 发送分页查询请求
    queryDataReq (status) {
      if (status != 1) {
        this.getQueryData()
        this.pageData.currentPage = 1
      }
      let data = {
        pageNum: this.pageData.currentPage ? this.pageData.currentPage : 1,
        pageSize: this.pageData.pageSize ? this.pageData.pageSize : 10,
        data: this.queryData
      }
      let result = this.customBeforeQuery()
      if (result) {
        queryPageDataList(this.queryUrl, data).then(response => {
          this.setLastUpdateTime()
          /* this.tableData.loading = false */
          if (response.data.code == 0) {
            if (response.data.data.hasOwnProperty('rows')) {
              this.tableData.data = response.data.data.rows
              if (response.data.data.hasOwnProperty('total')) {
                this.pageData.total = response.data.data.total
              }
              this.customAfterQuery()
            }
          } else {
            this.showError('获取列表数据', '请重新尝试')
          }
        })
      }
    },
    customAfterQuery () {}
    // },
    // setLastUpdateTime () {
    //   var now = this.newTime
    //   var hour = now.getHours()
    //   var min = now.getMinutes()
    //   var second = now.getSeconds()
    //   if (hour < 10) {
    //     hour = '0' + hour
    //   }
    //   if (min < 10) {
    //     min = '0' + min
    //   }
    //   if (second < 10) {
    //     second = '0' + second
    //   }
    //   var time = hour + ':' + min + ':' + second
    //   this.$store.commit('setLastUpdateTime', time)
    // }
  }
}
</script>
