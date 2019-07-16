<template>
<div class="whole-contain critical-contain">
  <div class="flight-url-select-div">
    <Query-view :data="queryRowGroup" class="left" @keyupEnter="queryDataReq()"></Query-view>
    <div class="left-button">
        <el-button type="info" plain @click="cleanQueryData()">清空</el-button>
        <el-button type="primary" @click="queryDataReq()">查询</el-button>
        <el-popover placement="bottom" trigger="manual" v-model="ctrlFVisible" popper-class="ctrl-f-popover" width="274">
          <Query-view :data="ctrlF" @change="changeHandleOfCtrlF" class="right" @keyupEnter="findCtrlF()"></Query-view>
          <div class="ctrl-f-query" @click="findCtrlF()"></div>
          <div class="ctrl-f-close" @click="handleCtrlFButton()"></div>
          <el-button slot="reference" :class="ctrlFVisible?'open':'close'" type="info" @click="handleCtrlFButton()">定位</el-button>
        </el-popover>
        <el-button type="info" @click="handleDownload()">导出</el-button>
        <el-button type="success" @click="queryDataReq(1)">刷新</el-button>
      </div>
  </div>
  <el-container direction="vertical" :style="wholeBodyStyle">
    <el-main class="flight-table-main">
      <el-container direction="vertical" :style="tableContStyle" class="flight-table-container table-container" ref="flight-table">
          <el-header style="height: 40px;">
            <div class="table-header flight-table-header-left">
              <img :src="require('@img/title_deco.png')" />
              <span class="header-title">放行监控列表</span>
              <span>
                <div class="dot-font" title="计划过站时长 < 最小过站时长">
                  <div class="dot-color-2"></div>
                  <span>计划异常</span>
                </div>
                <div class="dot-font" title="目标时间 < 离港延误+20分钟">
                  <div class="dot-color-3"></div>
                  <span>临界异常</span>
                </div>
              </span>
            </div>
          </el-header>
        <el-main class="whole-table-main">
          <div class="div-left-table" :style="divLeftTableStyle">
            <div class="div-left-table_header" :style="divLeftTableStyle">
              <table cellpadding="0" cellspacing="0" class="left-table_header">
                <thead>
                  <tr>
                    <th v-show="!item.hidden" v-for="(item, index) in tableData.fields" :key="index" :width="item.width" @click="clickSort(item)">{{item.label}}<span
                    :class="['sort-icon', (item.prop == sort.sortData.sortKey) ? `sort-${sort.sortData.rule}` : '']"></span>
                    </th>
                  </tr>
                </thead>
              </table>
            </div>
            <div class="div-left-table_body" :style="divTableBodyStyle" @mousewheel="scrollEvent">
              <table cellpadding="0" cellspacing="0" class="left-table_body" ref="wholeTable">
                <tbody>
                  <tr v-for="(item, index) in tableData.data" :key="index" :class="[tableRowClassName({'row': item, 'rowIndex': index}), tableClickRowClass[index]?'is-active':'']"
                  @click="clickRow(index)" @dblclick="changeEditable(index, item)"><!-- @contextmenu.prevent="tableRowContextmenu(item, $event)" -->
                    <div v-for="field in tableData.fields" :key="field.prop" :class="field.hidden?'body-tr-div':'body-tr-div show-field'" :style="!field.hidden && {width: field.width + 'px'}">
                      <td v-if="!field.hidden" :width="field.width" :class="field.class">
                        <div v-if="field.prop == 'mark'" class="first-col-color">
                          <img v-if="item[field.prop]" :src="require('@img/icon_heart_liked.png')" @click.self.stop="cancelMarkFlight(item)" @dblclick="eventStop($event)"/>
                          <img v-else :src="require('@img/icon_heart_default.png')" @click.self.stop="markFlight(item)" @dblclick="eventStop($event)"/>
                        </div>
                        <div v-else-if="field.prop == 'index'" :class="field.childClass">{{ index + 1 }}</div>
                        <div v-else-if="field.prop == 'stand' && item[field.prop]" :class="field.childClass">{{ item[field.prop] }}</div>
                        <div v-else-if="field.prop == 'preDepTime'" :class="`${item['preDepTimeCss']?item['preDepTimeCss']:''} time-bg`">{{ item[field.prop] ? item[field.prop] : '—:—' }}</div>
                        <div v-else-if="field.prop == 'arrvTime'" :class="`${item['arrvTimeCss']?item['arrvTimeCss']:''} time-bg`">{{ item[field.prop] ? item[field.prop] : '—:—' }}</div>
                        <div v-else-if="field.prop == 'deptTime'" :class="`${item['deptTimeCss']?item['deptTimeCss']:''} time-bg`">{{ item[field.prop] ? item[field.prop] : '—:—' }}</div>
                        <div v-else>{{ item[field.prop] }}</div>
                      </td>
                    </div>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="div-right-table" :style="divRightTableStyle">
            <div class="div-right-table_header">
              <div class="div-right-table_header-div">
                <table cellpadding="0" cellspacing="0" class="right-table_header" :style="rightTableWidthStyle">
                  <thead>
                    <tr>
                      <th v-show="!item.hidden" v-for="(item, index) in tableData.otherFields" :key="index" :width="item.width" @click="clickSort(item)">{{item.label}}<span
                      :class="['sort-icon', (item.prop == sort.sortData.sortKey) ? `sort-${sort.sortData.rule}` : '']"></span></th>
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
            <div class="div-right-table_body" :style="divTableBodyStyle" @mousewheel="scrollEvent">
              <table cellpadding="0" cellspacing="0" class="right-table_body_block" :style="rightTableBlockWidthStyle">
                <tbody>
                  <tr v-for="(item, index) in tableData.data" :key="index" :class="[tableRowClassName({'row': item, 'rowIndex': index}), tableClickRowClass[index]?'is-active':'']"
                  @click="clickRow(index)" @dblclick="changeEditable(index, item)">
                    <div class="body-tr-div" :style="{width: '100%'}"></div>
                  </tr>
                </tbody>
              </table>
              <table cellpadding="0" cellspacing="0" class="right-table_body" :style="rightTableWidthStyle">
                <tbody>
                  <tr v-for="(item, index) in tableData.data" :key="index" :class="[tableRowClassName({'row': item, 'rowIndex': index}), tableClickRowClass[index]?'is-active':'']"
                  @click="clickRow(index)" @dblclick="changeEditable(index, item)" @keyup.esc.native="changeEditable(index)"><!-- @contextmenu.prevent="tableRowContextmenu(item, $event)"  -->
                    <div v-for="other in tableData.otherFields" :key="other.prop" class="body-tr-div" :style="!other.hidden && {width: other.width + 'px'}">
                      <td v-if="!other.hidden" :width="other.width" :class="other.class">
                        <div v-if="other.prop == 'ctot'" class="td-input-div td-time-div">
                          <div v-if="item.flightNoD != null && (editable === index)" @click="eventStop($event)" @dblclick="eventStop($event)">
                            <el-date-picker v-model="editTempItem[other.prop]" type="datetime" :clearable="false" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" :prefix-icon="'a'" :picker-options="{selectableRange: editReg.range}"></el-date-picker>
                          </div>
                          <span v-else>{{ spliteMin(item[other.prop]) }}</span>
                        </div>
                        <div v-else-if="other.prop == 'attenuationParam'" class="td-input-div">
                          <div v-if="(editable === index)" @click="eventStop($event)" @dblclick="eventStop($event)">
                            <el-popover trigger="hover" :content="editReg.msg" :disabled="editReg.result" popper-class="editable-popper">
                              <el-input slot="reference" v-model.trim="editTempItem[other.prop]"
                              :class="editReg.result?'':'error-input'" @focus="$event.currentTarget.select()"
                              @keyup.enter.native="changeEditable(index, item)" @mousewheel.native.stop @blur.stop="editReg.show = false"
                              @change="editRegChange(index, other.prop)" @mouseenter.native="editRegMouseup(other.prop)"></el-input>
                            </el-popover>
                          </div>
                          <span v-else>{{ item[other.prop] }}</span>
                        </div>
                        <div v-else-if="other.hasOwnProperty('formatter')">{{ spliteMin(item[other.prop]) }}</div>
                        <div v-else>{{ item[other.prop] }}</div>
                      </td>
                    </div>
                  </tr>
                </tbody>
              </table>
              <!-- <div v-if="editReg.show" class="edit-reg-msg">{{editReg.msg}}</div> -->
              <!-- <div v-if="editReg.show" class="edit-reg-msg" :style="editRegStyle">{{editReg.msg}}</div> -->
            </div>
          </div>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</div>
</template>

<script>
import QueryView from '../../components/common/QueryView'
import basicTableMixin from '../../components/mixin/basicTableMixin'
import wholeTableMixin from '../../components/mixin/flightTableMixin'
import baseMixin from '../../components/mixin/baseMixin'
import basicMsgMixin from '../../components/mixin/basicMsgMixin'
import {queryAll, postData, download} from '../../api/base.js'
import _ from 'lodash'

export default {
  components: {
    QueryView
  },
  mixins: [baseMixin, basicTableMixin, basicMsgMixin, wholeTableMixin],
  data () {
    return {
      // 右侧table宽度
      /* divRightTableStyle: {
        width: 'calc(100% - 732px)'
      }, */
      // 允许登机时间URL
      allowBoardURL: 'flight/dynamic/allowBoarding',
      // 允许登机请求参数
      allowBoardData: {
        flightIdA: '',
        flightIdD: '',
        time: ''
      },
      // 下载文件名
      fileName: '航班放行监控.xls',
      // 右键菜单显示状态 true-显示; false-隐藏
      // cardShow: false,
      // 右键菜单定位 top 和 left 值
      // cardTop: 0,
      // cardLeft: 0,
      baseUrl: 'flight/dynamic',
      // 请求路径
      queryUrl: 'flight/dynamic/queryDynamicAircraftList',
      // 下载路径
      exportUrl: 'flight/dynamic/exportExcel',
      // 查询条件每行个数
      colSize: 6,
      // 航班查询接口选择过滤
      flightUrlSelect: 'real',
      // 航班类型过滤条件
      flightType: 'S',
      // 历史航班查询中航班日期
      execDate: '',
      maxDate: '',
      pickerOptionsMethod: {
        disabledDate (time) {
          var maxDate = new Date()
          maxDate.setDate(maxDate.getDate() - 2)
          return time.getTime() > maxDate
        }
      },
      // 查询条件设置
      queryList: [{
        // span: '航班号',
        key: 'flightNo',
        value: '',
        type: 'input',
        inputText: '航班号',
        toUpper: true,
        span: 24
      }],
      // 获取默认隐藏/显示列路径
      queryDefaultRowUrl: 'sysconfig/empFlight/list',
      // 保存默认隐藏/显示列路径
      saveDefaultRowUrl: 'sysconfig/empFlight/saveAll',
      // 列表设置
      tableData: {
        data: [],
        fields: [
          // {prop: 'index', label: '', width: '40', minWidth: '40', fixed: true, hidden: false},
          {prop: 'flightNoA', label: '进航班号', width: '80', fixed: true, hidden: false},
          {prop: 'flightNoD', label: '出航班号', width: '80', fixed: true, hidden: false},
          {prop: 'execDateA', label: '进执行日期', width: '95', fixed: false, hidden: false, formatter: this.formatterDay},
          {prop: 'execDateD', label: '出执行日期', width: '95', fixed: false, hidden: false, formatter: this.formatterDay},
          {prop: 'sta', label: '计划到达', width: '70', fixed: false, hidden: false, class: 'st time-bg td-left-border'},
          {prop: 'eta', label: '预计到达', width: '70', fixed: false, hidden: false, class: 'et time-bg td-left-border'},
          {prop: 'ata', label: '实际到达', width: '70', fixed: false, hidden: false, class: 'at time-bg td-left-border'},
          {prop: 'std', label: '计划起飞', width: '70', fixed: false, hidden: false, class: 'st time-bg td-left-border'},
          {prop: 'etd', label: '预计起飞', width: '70', fixed: false, hidden: false, class: 'et time-bg td-left-border'},
          {prop: 'atd', label: '实际起飞', width: '70', fixed: false, hidden: false, class: 'at time-bg td-left-border'}
        ],
        otherFields: [
          {prop: 'schedViaMin', label: '计划过站时长', width: '100', fixed: true, hidden: false, class: 'td-left-border'},
          {prop: 'blockOnTime', label: '实际挡轮档', width: '90', fixed: true, hidden: false, formatter: true, sort: true},
          {prop: 'blockOffTime', label: '实际撤轮挡', width: '90', fixed: true, hidden: false, formatter: true, sort: true},
          {prop: 'estBlockOnTime', label: '预计挡轮档', width: '90', fixed: true, hidden: false, formatter: true, sort: true},
          {prop: 'estBlockOffTime', label: '预计撤轮档', width: '90', fixed: true, hidden: false, formatter: true, sort: true},
          {prop: 'ttot', label: '目标起飞时间', width: '105', fixed: true, hidden: false, formatter: true, sort: true},
          {prop: 'rlsDelayTime', label: '放行延误时间', width: '105', fixed: true, hidden: false, formatter: true},
          {prop: 'depDelayTime', label: '离港延误时间', width: '105', fixed: true, hidden: false, formatter: true},
          {prop: 'ctot', label: 'CTOT', width: '130', fixed: true, hidden: false},
          {prop: 'minViaMin', label: '最小过站时长/分', width: '100', fixed: false, hidden: false},
          {prop: 'attenuationParam', label: '衰减参数', width: '90', fixed: false, hidden: false}
        ]
      },
      options: [],
      editable: null,
      editRegArr: ['ctot', 'attenuationParam'], // ['ctot', 'attenuationParam'],
      editTempItem: {},
      editReg: {
        show: false,
        result: true,
        msg: '最多为三位整数 !',
        range: null
      },
      editRegStyle: {
        left: '0px',
        top: '0px'
      },
      changeEditableUrl: '/dynamicFlight/updateCtot',
      sort: {
        querySortUrl: '/basicdata/sysUserCustom/queryAll',
        changeSortUrl: '/basicdata/sysUserCustom/saveAll',
        queryData: {
          customType: 'CriticalFlight'
        },
        sortData: {
          sortKey: 'ttot',
          rule: 'asc',
          customType: 'CriticalFlight'
        }
      },
      timerQuery: null,
      intTime: 5 * 1000
    }
  },
  watch: {
    queryList: function (newValue, oldValue) {
      this.text = 'Waiting for the value to changed...'
      /* this.debouncedGetAnswer()
      console.log('value2 is changed :' + oldValue + ' to ' + newValue) */
    }
  },
  created () {
    this.getSortData()
    // document.addEventListener('click', this.eClick)
    // this.getDefaultRow()
  },
  mounted () {
    window.name = this.$route.name
    // this.$nextTick(() => {
      var flightMain = this.$refs['flight-table'].$el.querySelector('.el-main')
      var top1 = flightMain.getBoundingClientRect().top
      flightMain.style.height = window.innerHeight - top1 - 20 + 'px'
      this.wholeMounted(top1)
      window.onresize = () => {
        this.$nextTick(() => {
          return (() => {
            var top2 = flightMain.getBoundingClientRect().top
            flightMain.style.height = window.innerHeight - top2 - 20 + 'px'
            this.wholeMounted(top1)
          })()
        })
      }
    // })
    this.timerQuery = setInterval(this.queryDataRefresh, this.intTime)
    document.addEventListener('keyup', this.initEditable)
  },
  destroyed () {
    document.removeEventListener('keyup', this.initEditable)
  },
  methods: {
    // 下载
    handleDownload () {
      let sum = this.pageData ? this.pageData.total : 1
      let data = {...this.queryData, execDateFlag: 0, type: 'critical'}
      if (sum) {
        download(this.exportUrl, data, sum).then(response => {
          this.downFile(response, this.fileName)
        })
      } else {
        this.showError('导出', '当前导出结果为空')
      }
    },
    customResBefore (data) {
      data = _.orderBy(data, [this.sort.sortData.sortKey], [this.sort.sortData.rule])
      /* data = _.sortBy(data, (value) => {
        if (this.sort.sortData.rule == 'asc') {
          return value[this.sort.sortData.sortKey]
        } else {
          return -value[this.sort.sortData.sortKey]
        }
      }) */
      return data
    },
    getSortData () {
      queryAll(this.sort.querySortUrl, this.sort.queryData).then(res => {
        if (res.data.code == 0) {
          if (res.data.data.length > 0) {
            let obj = res.data.data[0]
            this.sort.sortData.sortKey = obj.confValue
            this.sort.sortData.rule = obj.confItem
          }
        } else {
          this.showError('获取排序', '可手动进行排序')
        }
      })
    },
    clickSort (item) {
      if (item.prop == this.sort.sortData.sortKey) {
        switch (this.sort.sortData.rule) {
          case 'asc': this.sort.sortData.rule = 'desc'
          break
          case 'desc': this.sort.sortData.rule = 'asc'
          break
          // case '': this.sort.sortData.rule = 'asc'
          // break
        }
      } else {
        this.sort.sortData.sortKey = item.prop
        this.sort.sortData.rule = 'asc'
      }
      this.tableData.data = this.customResBefore(this.tableData.data)
      postData(this.sort.changeSortUrl, this.sort.sortData).then(res => {
      })
    },
    updateTableWidth () {
      var key = this.customOtherFields()
      var otherFieldsWidth = 0
      this.tableData[key].forEach(item => {
        if (!item.hidden) {
          otherFieldsWidth = otherFieldsWidth + parseInt(item.width)
        }
      })
      this.rightTableWidthStyle.width = otherFieldsWidth + 'px'
      let leftWidth = 0
      this.tableData.fields.forEach(item => {
        if (!item.hidden) {
          leftWidth += parseInt(item.width)
        }
      })
      this.divLeftTableStyle.width = leftWidth + 'px'
      this.divLeftTableStyle.minWidth = leftWidth + 'px'
      this.divRightTableStyle.width = 'calc(100% - ' + this.divLeftTableStyle.width + ')'
      this.customUpdateTableWidth(otherFieldsWidth)
    },
    tableRowClassName ({row, rowIndex}) {
      // 目标起飞时间>离港延误时间+20 => ttot>depDelayTime+20 => color-critical-warn-row
      // 计划过站时长<最小过站时长 => schedViaMin<minViaMin => color-critical-tip-row
      let color = 'color-cretical-default'
      if (row.ttot && row.depDelayTime && (new Date(row.ttot) > new Date(new Date(row.depDelayTime).getTime() + 20 * 60 * 1000))) {
        color = 'color-critical-warn-row'
      } else {
        let schedViaMin = parseFloat(row.schedViaMin)
        let minViaMin = parseFloat(row.minViaMin)
        if (!_.isNaN(schedViaMin) && !_.isNaN(minViaMin) && (schedViaMin < minViaMin)) {
          color = 'color-critical-tip-row'
        }
      }
      return color
    },
    scrollTable () {
      let rightTableBody = document.getElementsByClassName('div-right-table_body')[0]
      let that = this
      rightTableBody.onscroll = function () {
        let rightTableTop = this.scrollTop
        document.getElementsByClassName('div-left-table_body')[0].scrollTop = rightTableTop
        let rightTableLeft = this.scrollLeft
        document.getElementsByClassName('div-right-table_header')[0].scrollLeft = rightTableLeft
      }
    },
    scrollEvent (event) {
      var scrollTop = event.wheelDeltaY
      document.getElementsByClassName('div-right-table_body')[0].scrollTop -= scrollTop
    },
    locateScroll () {
      var scrollTop = this.$refs.wholeTable.querySelectorAll('tr')[this.ctrlFList[this.ctrlFTouchTime].lineNum].offsetTop
      document.getElementsByClassName('div-right-table_body')[0].scrollTop = scrollTop
      this.clickRow(this.ctrlFList[this.ctrlFTouchTime].lineNum, 'scroll')
    },
    spliteMin (value) {
      return value ? value.substr(11, 5) : '—:—'
    },
    numThreeReg (value) {
      if (value != '' && value != null) {
        let reg = /^(-)?\d{1,3}$/
        if (reg.test(value)) {
          return true
        } else {
          return false
        }
      } else {
        return null
      }
    },
    initEditable (event) {
      // this.tableData.data[index] = JSON.parse(JSON.stringify(this.editTempItem))
      if (!event || event.keyCode == 27) {
        this.editable = null
        this.editReg = {
          show: false,
          msg: '最多为三位整数 !',
          result: true
        }
      }
    },
    queryDataRefresh () {
      this.queryDataReq(1)
    },
    customQueryBefore (data) {
      let temp = {...data, execDateFlag: 0}
      return temp
    },
    changeEditable (index, item) {
      if (item) {
        if (item['dynamicFlightIdD']) {
          if (this.editable === index) {
            if (this.editReg.result === true) {
              var data = {}
              this.editRegArr.forEach(key => {
                this.$set(data, key, this.editTempItem[key])
              })
              this.$set(data, 'dynamicFlightIdA', this.editTempItem['dynamicFlightIdA'])
              this.$set(data, 'dynamicFlightIdD', this.editTempItem['dynamicFlightIdD'])
              postData(this.changeEditableUrl, data).then(res => {
                if (res.data.code == 0) {
                  this.showSuccess('保存')
                  this.initEditable()
                  this.queryDataRefresh()
                  this.timerQuery = setInterval(this.queryDataRefresh, this.intTime)
                } else {
                  this.showError('请求', '请检查网络连接 !')
                }
              })
            }
          } else {
            this.timerQuery = clearInterval(this.timerQuery)
            this.editTempItem = JSON.parse(JSON.stringify(this.tableData.data[index]))
            this.initEditable()
            this.editable = index
            this.editReg.count = 0
            this.editRegArr.forEach(key => {
              if (key != 'ctot') {
                if (this.editTempItem[key]) {
                  this.editTempItem[key].forEach((value) => {
                    this.$set(this.editReg, 'result', null)
                    this.$set(this.editReg, 'show', false)
                    this.editRegChange(index, key, true)
                  })
                }
              }
            })
          }
        }
      } else {
        this.editTempItem = JSON.parse(JSON.stringify(this.tableData.data[index]))
        this.initEditable()
      }
    },
    editRegChange (index, key, init) {
      var oldResult = null
      var result = null
      if (!init) {
        oldResult = this.editReg.result
      }
      result = this.numThreeReg(this.editTempItem[key])
      switch (result) {
        case null: this.editReg.result = true
        this.editReg.show = false
        break
        case true: this.editReg.result = true
        this.editReg.show = false
        break
        case false: this.editReg.result = false
        this.editReg.show = true
        break
      }
      switch (oldResult) {
        case null:
          if (!this.editReg.result) {
            this.editReg.count += 1
          }
          break
        case true:
          if (!this.editReg.result) {
            this.editReg.count += 1
          }
          break
        case false:
          if (this.editReg.result) {
            this.editReg.count -= 1
          }
          break
      }
    },
    editRegMouseup (key) {
      if (this.editReg.result == false) {
        this.editReg.show = true
      } else {
        this.editReg.show = false
      }
    },
    customUpdateTableWidth () {},
    customOtherFields () {
      return 'otherFields'
    }
  },
  computed: {
    /* comMessage: function (value1) {
      return this.message + value1
    },
    comMessage2: function (value2) {
      return this.message + value2
    } */
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.table-container {
  margin-right: 20px;
}
.contextmenu-card {
  position: absolute;
  z-index: 3
}
/* 航班顶部*实时-历史*选择框 */
.flight-url-select-div {
  position: absolute;
  top: 25px;
  left: 590px;
  right: 260px;
  display: inline-flex;
  justify-content: space-between;
}
.flight-url-select-div>.left {
  width: fit-content;
}
.flight-url-select-div>.left-button {
  min-width: 338px;
}
/* 历史航班日期选择 */
.flight-url-his-date-div {
  position: absolute;
  top: 25px;
  left: calc(50% + 121px);
  margin-left: 20px;
}
/* 编辑表头内容列宽度 */
.opr-popover-all {
  width: 100%;
}
.edit-reg-msg {
  position: absolute;
  color: red;
}
.sort-icon {
  margin-left: 2px;
  display: inline-block;
  /* width: 10px;
  height: 14px;
  background-image: url(~@img/pop_win_arrow.png);
  background-size: 100% 100%;
  background-position: center; */
}
.sort-asc {
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 10px solid rgba(60, 166, 200, .7);
}
.sort-desc {
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 10px solid rgba(60, 166, 200, .7);
}
th {
  user-select: none;
  cursor: pointer;
}
</style>
