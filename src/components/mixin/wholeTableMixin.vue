<script>
import basicMsgBoxMixin from './basicMsgBoxMixin'
import { postData, queryAll } from '../../api/base'
import baseMixin from './baseMixin'
import _ from 'lodash'

export default {
  mixins: [basicMsgBoxMixin, baseMixin],
  data () {
    return {
      // 同一查找条件点击次数
      ctrlFTouchTime: 0,
      // 查找面板展开状态
      ctrlFVisible: false,
      // 查找功能条件
      ctrlF: [[{
        // 'p': '航线',
        key: 'findKey',
        value: '',
        type: 'input',
        inputText: '航班号',
        toUpper: true,
        icon: 'none'
      }]],
      ctrlFList: [],
      // 点击任务行
      clickTaskDiv: false,
      oprPopoverDirect: '',
      oprPopoverIndex: null,
      homeRouterData: [],
      // 下载文件名
      fileName: '无线站坪调航班管理导出.xls'
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
      }
    })
    var asideView = this.$root.$el.querySelector('.el-aside')
    var basicContView = this.$root.$el.querySelector('.basic-resource-contain')
    var basicWidth = window.innerWidth - asideView.offsetWidth - 40
    basicContView.style.width = basicWidth + 'px'
    this.$nextTick(() => {
      that.queryResourcePerm()
    })
    window.onresize = () => {
      this.$nextTick(() => {
        return (() => {
          var basicWidth = window.innerWidth - asideView.offsetWidth - 40
          basicContView.style.width = basicWidth + 'px'
        })()
      })
    }
    /* this.$nextTick(() => {
      this.scrollTable()
    }) */
  },
  methods: {
    handleCtrlFButton () {
      this.ctrlFVisible = !this.ctrlFVisible
      if (!this.ctrlFVisible) {
        this.ctrlF[0][0].value = ''
      }
    },
    wholeMounted (top) {
      this.divTableBodyStyle.height = window.innerHeight - top - 62 + 'px'
      this.tableContStyle.width = window.innerWidth - 40 + 'px'
      this.wholeBodyStyle.width = window.innerWidth - 20 + 'px'
      this.updateTableWidth()
    },
    // 窗口变化/初始化时根据窗口修改组件样式
    windowResizeStyle (that) {
      const wholeWidth = that.$el.querySelector('.el-container')
      wholeWidth.style.width = window.innerWidth - 20 + 'px'
    },
    // 发送查询请求
    queryDataReq: _.throttle(function (status) {
      if (status != 1) {
        this.getQueryData()
        this.tableData.data = []
      }
      this.customQueryMethod()
      postData(this.queryUrl, this.queryData).then(response => {
        this.setLastUpdateTime()
        this.tableData.loading = false
        this.tableData.multipleSelection = []
        if (this.tableData.hasOwnProperty('editData')) {
          if (this.hasOwnProperty('initEditable')) {
            this.initEditable()
          }
        }
        if (response.data.code == 0) {
          if (response.data.data.hasOwnProperty('rows')) {
            this.tableData.data = response.data.data.rows
          } else {
            this.tableData.data = response.data.data
          }
          this.customAfterQuery()
        } else {
          this.showError('获取列表数据', '请重新尝试')
        }
      })
    }, 1000),
    customAfterQuery () {
    },
    setLastUpdateTime () {
      var now = this.newTime
      var hour = now.getHours()
      var min = now.getMinutes()
      var second = now.getSeconds()
      if (hour < 10) {
        hour = '0' + hour
      }
      if (min < 10) {
        min = '0' + min
      }
      if (second < 10) {
        second = '0' + second
      }
      var time = hour + ':' + min + ':' + second
      this.$store.commit('setLastUpdateTime', time)
    },
    changeHandleOfCtrlF (data, selectedValue) {
      this.ctrlFTouchTime = 0
      this.ctrlFList = []
    },
    getCtrlFList () {
      var data = this.getQueryData(this.ctrlF[0])
      this.tableData.data.forEach((value, index, array) => {
        if (value['flightNoA'] && !value['flightNoD']) {
          if (value['flightNoA'].indexOf(data['findKey']) >= 0) {
            value.lineNum = index
            this.ctrlFList[this.ctrlFList.length] = value
          }
        } else if (value['flightNoA'] && value['flightNoD']) {
          if (value['flightNoA'].indexOf(data['findKey']) >= 0) {
            value.lineNum = index
            this.ctrlFList[this.ctrlFList.length] = value
          } else if (value['flightNoD'].indexOf(data['findKey']) >= 0) {
            value.lineNum = index
            this.ctrlFList[this.ctrlFList.length] = value
          }
        } else if (!value['flightNoA'] && value['flightNoD']) {
          if (value['flightNoD'].indexOf(data['findKey']) >= 0) {
            value.lineNum = index
            this.ctrlFList[this.ctrlFList.length] = value
          }
        }
      })
    },
    findCtrlF () {
      if (this.ctrlFTouchTime === 0) {
        this.getCtrlFList()
      } else {
        if (this.ctrlFTouchTime >= this.ctrlFList.length) {
          this.ctrlFTouchTime = 0
        }
      }
      if (this.ctrlFList.length > 0) {
        this.locateScroll()
        this.ctrlFTouchTime++
      }
    },
    locateScroll () {
      var scrollTop = this.$refs.wholeTable.querySelectorAll('tr')[this.ctrlFList[this.ctrlFTouchTime].lineNum].offsetTop
      document.getElementsByClassName('div-opr-table_body')[0].scrollTop = scrollTop
      this.clickRow(this.ctrlFList[this.ctrlFTouchTime].lineNum, 'scroll')
    },
    tableRowClassName (data) {
      switch (data.row.colourType) {
        case '1' : return 'color-1-row'
        case '2' : return 'color-2-row'
        case '3' : return 'color-3-row'
        case '4' : return 'color-4-row'
        case '4.1' : return 'color-4_1-row'
        case '4.2' : return 'color-4_2-row'
        case '4.3' : return 'color-4_3-row'
      }
    },
    formatterFlag (row) {
      if (row.item[row.field.prop]) {
        let arr = row.item[row.field.prop].split('|')
        let valArr = []
        _.forEach(arr, str => {
          let obj = _.find(row.field.options, ['key', str])
          if (obj) {
            valArr.push(obj.value)
          }
        })
        return valArr.join('|')
      } else {
        return ''
      }
    },
    formatterHHMM (row) {
      return row.item[row.field.prop] ? row.item[row.field.prop].substr(0, 16) : ''
    }
  },
  computed: {
    tableTotal () {
      return `${this.tableData.data ? this.tableData.data.length : 0}`
    }
  }
}
</script>
