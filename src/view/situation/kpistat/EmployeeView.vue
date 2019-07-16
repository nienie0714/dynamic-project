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
        <Pagination-view :pageData="pageData" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange"></Pagination-view>
      </div>
      <Table-view :permissions="permissions" :tableData="tableData" ref="basicTable" @handleDetail="handleDetail" @handleEdit="handleEdit" @handleDelete="handleDelete">
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
import {passwordReg} from '../../../util/rules.js'
import {postData} from '../../../api/base.js'
import _ from 'lodash'

// const tableHeight = ''

export default {
  components: {
    QueryView,
    PaginationView,
    TableView,
    ToolButtonView,
    EditView
  },
  mixins: [basicTableMixin, pageTableMixin],
  data () {
    return {
      // 菜单对应按钮权限
      permissions: {
        export: false
      },
      // 基础路径
      baseUrl: '/statistics/aomsTaskStat/person',
      queryUrl: '/statistics/aomsTaskStat/person',
      exportUrl: '/statistics/aomsTaskStat/person/exportExcel',
      formData: {
        title: '详情',
        visible: false,
        inline: true,
        className: 'twiceCol',
        // key: 'vehicleId',
        clearRulesKey: [],
        formData: [
          {key: 'vehicleNo', label: '车辆牌号', type: 'input', maxlength: 9}
        ]
      },
      // 查询条件每行个数
      colSize: 5,
      // 查询条件设置
      queryList: [
        {
          key: 'queryType',
          tabsKey: 'queryType',
          value: 'day',
          type: 'tabs',
          size: 'medium',
          inputText: '',
          'valueChange': 'attrChange',
          'span': 5
        },
        {
          key: 'unitName',
          value: '',
          type: 'input',
          inputText: '保障单位（个人/班组）',
          span: 4
        },
        {
          key: 'taskCn',
          value: '',
          type: 'input',
          inputText: '任务名称',
          span: 4
        },
        {
          // 'p': '时间区间',
          key: 'date',
          value: null,
          type: 'daterange',
          editable: false,
          clearable: true,
          rangeSeparator: '至',
          inputText: '时间范围',
          valueFormat: 'yyyy-MM-dd',
          format: 'yyyy-MM-dd',
          pickerOpt: {
            disabledDate: (time) => {
              let maxDate = new Date(this.latestDate)
              return time.getTime() > maxDate
            }
          },
          span: 6
        }
      ],
      // 列表设置
      tableData: {
        loading: false,
        data: [],
        stripe: true,
        height: window.innerHeight,
        highlight: true,
        isOperat: true,
        headerCellClass: 'tableHeaderCell-Center',
        rowClassName: this.tableRowClassName,
        // key: 'vehicleId',
        multipleSelection: [],
        fields: [
          {prop: 'unitName', label: '保障单位（人员/单元）', fixed: true, hidden: false},
          {prop: 'date', label: '执行日期', fixed: false, hidden: false},
          {prop: 'taskCn', label: '任务名称', hidden: false},
          {prop: 'taskTime', label: '任务总时长/分', hidden: false},
          {prop: 'totalFlight', label: '保障航班总量', hidden: false},
          {prop: 'endFlight', label: '保障航班量-停场', hidden: false},
          {prop: 'startFlight', label: '保障航班量-始发', hidden: false},
          {prop: 'viaFlight', label: '保障航班量-过站', hidden: false}
        ]
      }
    }
  },
  mounted () {
    // 页面起始修改发送参数的初始值为当日
    this.$set(this.queryList[3], 'value', [this.formatterNewtimeOfYMD(), this.formatterNewtimeOfYMD()])
    this.$set(this.queryData, 'date', this.queryList[3].value)
  },
  methods: {
    customBeforeQuery () {
      let result = null
      if (this.queryData.start && this.queryData.end) {
        result = new Date(this.queryData.start) <= new Date(this.queryData.end)
        if (result) {
          return true
        } else {
          this.showError('请求', '开始时间必须小于结束时间 !')
          return false
        }
      } else {
        return true
      }
    },
    customAfterQuery () {
      this.tableData.data.forEach(item => {
        let total = 0
        if (item.endFlight && _.isNumber(item.endFlight)) {
          total += item.endFlight
        }
        if (item.startFlight && _.isNumber(item.endFlight)) {
          total += item.startFlight
        }
        if (item.viaFlight && _.isNumber(item.endFlight)) {
          total += item.viaFlight
        }
        this.$set(item, 'totalFlight', total)

        if (item.statDate) {
          if (this.queryData.queryType == 'day') {
           this.$set(item, 'date', item.statDate)
          }
        }
        if (item.statMonth) {
          if (this.queryData.queryType == 'month') {
           this.$set(item, 'date', item.statMonth)
          }
        }
      })
    }
  }
}
</script>
