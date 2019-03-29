<template>
  <el-container direction="vertical">
    <el-header class="query-contain">
      <Query-view :data="queryRowGroup" class="left" @keyupEnter="queryDataReq()"></Query-view>
      <div class="left-button">
        <el-button type="info" icon="el-icon-search" plain @click="cleanQueryData()">清空</el-button>
        <el-button type="primary" icon="el-icon-search" @click="queryDataReq()">查询</el-button>
      </div>
    </el-header>
    <el-main class="page-table-view">
      <div class="page-table-header">
        <div class="page-table-title">查询结果</div>
        <Tool-button-view :permissions="permissions" :selectionCount="tableData.multipleSelection.length" @handleDownload="handleDownload" @handleAdd="handleAdd" @handleDelete="handleDelete"></Tool-button-view>
         <div class="pagination-view">
          <div class="el-pagination">
            <span class="el-pagination__total">共 {{ tableTotal }} 条</span>
          </div>
        </div>
      </div>
      <Table-view :permissions="permissions" :tableData="tableData" ref="basicTable" @handleDetail="handleDetail" @handleEdit="handleEdit" @handleDelete="handleDelete">
        <template slot="button-slot-scope" slot-scope="scopeData">
          <div class="tool-div-button button-default" title="恢复默认" @click="handleDefault(scopeData.data)"></div>
        </template>
      </Table-view>
    </el-main>
    <Edit-view :formData="formData" @handleAdd="saveAdd" @handleEdit="saveEdit"></Edit-view>
    <Warning-box-view :data="deleteData" @handleConfirm="handleDeleteConfirm" @handleClose="handleDeleteClose"></Warning-box-view>
  </el-container>
</template>

<script>
import QueryView from '../../../components/common/QueryView'
import PaginationView from '../../../components/common/PaginationView'
import TableView from '../../../components/common/BaseTableView'
import ToolButtonView from '../../../components/common/ToolButtonView'
import EditView from '../../../components/common/EditView'
import basicTableMixin from '../../../components/mixin/basicTableMixin'
import pageTableMixin from '../../../components/mixin/pageTableMixin'
import baseMixin from '../../../components/mixin/baseMixin'
import {idReg, idNumReg} from '../../../util/rules.js'
import {queryAll, postData} from '../../../api/base.js'

export default {
  components: {
    QueryView,
    PaginationView,
    TableView,
    ToolButtonView,
    EditView
  },
  mixins: [basicTableMixin, pageTableMixin, baseMixin],
  data () {
    return {
      // 基础路径
      baseUrl: '',
      queryUrl: 'basicdata/classifyCode/querySeason',
      editUrl: 'basicdata/classifyCode/updateSeason',
      formData: {
        title: '新增',
        visible: false,
        inline: true,
        className: 'twiceCol',
        formData: [
          {key: 'code', label: 'code', type: 'input', isHidden: true},
          {key: 'classify', label: 'classify', type: 'input', isHidden: true},
          {key: 'name', label: '名称', type: 'pInput'},
          {key: 'dateRange', key1: 'beginDate', key2: 'endDate', label: '计划日期区间', label1: '计划开始日期', label2: '计划结束日期', type: 'dateRangePicker', rangeMethod: this.dateRangeReg, dateType: 'date', required: 3, format: 'yyyy-MM-dd', valueFormat: 'yyyy-MM-dd', class: 'auto-width'}
        ],
        rules: {
          name: [
            {required: true, message: '必填项', trigger: 'blur'}
          ],
          sortkey: [
            {validator: idNumReg, trigger: 'blur'}
          ]
        }
      },
      // 查询条件每行个数
      colSize: 4,
      // 查询条件设置
      queryList: [{
          // 'p': '资源类型',
          key: 'code',
          tabsKey: 'scheduleSeason',
          value: null,
          type: 'tabs',
          size: 'medium',
          inputText: '',
          options: [{
            key: null,
            value: '全部'
          }],
          'valueChange': 'attrChange',
          'span': 5
        }],
      // 分页参数
      pageData: {
        currentPage: 1,
        pageSizes: [10],
        pageSize: 10,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0
      },
      // 列表设置
      tableData: {
        loading: false,
        data: [],
        stripe: true,
        height: window.innerHeight,
        highlight: true,
        headerCellClass: 'tableHeaderCell-Center',
        rowClassName: this.tableRowClassName,
        key: 'resourceId',
        multipleSelection: [],
        fields: [
          {prop: 'code', label: 'code', fixed: true, hidden: true},
          {prop: 'name', label: '名称', fixed: true, hidden: false},
          {prop: 'beginDate', label: '开始时间', fixed: false, hidden: false},
          {prop: 'endDate', label: '结束时间', fixed: false, hidden: false}
        ]
      },
      time: {
        winStart: '',
        winEnd: '',
        sumStart: '',
        sumEnd: ''
      }
    }
  },
  created () {
  },
  methods: {
    dateRangeReg (rule, value, callback) {
      if (value.hasOwnProperty('beginDate') && value.hasOwnProperty('endDate')) {
        if (value.beginDate && value.endDate) {
          if (value.beginDate >= value.endDate) {
            let same = this.formData.formData.filter((obj) => {
              return obj.key == rule.field
            })
            callback(new Error(same.regInfo ? same.regInfo : '开始时间必须小于结束时间'))
          }
        }
      }
      callback()
    },
    handleDefault (row) {
      this.getDefaultTime()
      if (row.code == 'N') {
        // 夏秋
        row.beginDate = this.time.sumStart
        row.endDate = this.time.sumEnd
      } else {
        // 冬春
        row.beginDate = this.time.winStart
        row.endDate = this.time.winEnd
      }
      postData(this.editUrl, row).then(res => {
        if (res.data.code == 0) {
          this.showSuccess(`恢复默认`)
          this.queryDataReq()
        } else {
          this.showError(`恢复默认`, '请联系管理员 !')
        }
      })
    },
    getDefaultTime () {
      let year = this.newTime.getFullYear()
      let winStart = this.getWeekByDay(year + '-10-31')
      this.time.winStart = this.dateAdd(year + '-10-31', -winStart)// 每年10月份最后一个周日
      let winEnd = this.getWeekByDay((year + 1) + '-3-31')
      this.time.winEnd = this.dateAdd((year + 1) + '-3-31', -(winEnd + 1))// 次年3月份最后一个周日之前的周六

      let sumStart = this.getWeekByDay(year + '-3-31')
      this.time.sumStart = this.dateAdd(year + '-3-31', -sumStart)// 每年3月份最后一个周日
      let sumEnd = this.getWeekByDay(year + '-10-31')
      this.time.sumEnd = this.dateAdd(year + '-10-31', -(sumEnd + 1))// 当年10月份最后一个周日之前的周六
    },
    getWeekByDay (dayValue) { // dayValue=“2014-01-01”
      let day = new Date(Date.parse(dayValue.replace(/-/g, '/')))
      return day.getDay() // 返一个星期中的某一天，其中0为星期日
    },
    dateAdd (dd, n) { // 得到某一日期的前一天 后一天 n可以正负数
      var strs = []
      strs = dd.split('-')
      var y = strs[0]
      var m = strs[1]
      var d = strs[2]
      var t = new Date(y, m - 1, d)
      var str = t.getTime() + n * (1000 * 60 * 60 * 24)
      var newdate = new Date()
      newdate.setTime(str)
      var strYear = newdate.getFullYear()
      var strDay = newdate.getDate()
      if (strDay < 10) {
        strDay = '0' + strDay
      }
      var strMonth = newdate.getMonth() + 1
      if (strMonth < 10) {
        strMonth = '0' + strMonth
      }
      var strdate = strYear + '-' + strMonth + '-' + strDay
      return strdate
    }
  },
  computed: {
    tableTotal () {
      return `${this.tableData.data ? this.tableData.data.length : 0}`
    }
  }
}
</script>
