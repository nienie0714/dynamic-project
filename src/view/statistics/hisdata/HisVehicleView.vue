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
      <Table-view :permissions="permissions" :tableData="tableData" ref="basicTable" @handleDetail="handleDetail" @handleEdit="handleEdit" @handleDelete="handleDelete"></Table-view>
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
import {queryAll} from '../../../api/base.js'
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
      // 基础路径
      baseUrl: 'taskscheduling/hisDynamicTaskRecord',
      // 分页参数
      pageData: {
        currentPage: 1,
        pageSizes: [10, 20, 30],
        pageSize: 10,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0
      },
      dfsUrl: '',
      formData: {
        title: '详情',
        visible: false,
        inline: true,
        className: 'twiceCol',
        width: '600px',
        key: 'reasonCode',
        formData: [
          {key: 'vehicleNo', label: '车辆牌号', type: 'input', maxlength: 9},
          {key: 'vehicleTypeName', label: '车辆类型', type: 'input', maxlength: 9},
          {key: 'statDate', label: '执行日期', type: 'date', format: 'yyyy-MM-dd', valueFormat: 'yyyy-MM-dd'},
          {key: 'airline', label: '航空公司', type: 'select', filterable: true, optionsKey: 'Airline', itemKey: 'airlineIata', itemLabel: 'briefC'},
          {key: 'aircraftType', label: '机型', type: 'select', filterable: true, optionsKey: 'AircraftType', itemKey: 'aircraftIcao', itemLabel: 'aircraftIcao', change: this.changeArcftType},
          {key: 'aircraftNo', label: '机号', type: 'select', filterable: true, optionsKey: 'Aircraft', itemKey: 'aircraftNo', itemLabel: 'aircraftNo', change: this.changeArcft},
          {key: 'flightNo', label: '航班号', type: 'input', toUpper: true, maxlength: 5},
          {key: 'taskCn', label: '任务名称', type: 'input', maxlength: 50},
          {key: 'usedHours', label: '保障时长', type: 'input', maxlength: 50},
          {key: 'teamName', label: '保障人员', type: 'input', maxlength: 50}
        ],
        groupData: []
      },
      // 查询条件每行个数
      colSize: 6,
      // 查询条件设置
      queryList: [
        {
          // p: '航空公司',
          key: 'airline',
          value: '',
          type: 'select',
          filterable: true,
          inputText: '航空公司',
          getOptions: '/basicdata/airline/queryAll',
          optKey: 'airlineIata',
          optLabel: 'briefC',
          span: 3
        }, {
          // p: '车牌号',
          key: 'vehicleNo',
          value: '',
          type: 'input',
          inputText: '车辆牌号',
          span: 3
        }, {
          key: 'vehicleType',
          value: '',
          type: 'select',
          inputText: '车型名称',
          getOptions: '/basicdata/vehicleType/queryAll',
          span: 3,
          optKey: 'vTypeNo',
          optLabel: 'vTypeName',
          filterable: true
        }, {
          // 'p': '开始时间',
          key: 'start',
          value: null,
          type: 'date',
          editable: false,
          clearable: true,
          inputText: '开始时间',
          valueFormat: 'yyyy-MM-dd',
          format: 'yyyy-MM-dd',
          span: 3
        }, {
          // 'p': '结束时间',
          key: 'end',
          value: null,
          type: 'date',
          editable: false,
          clearable: true,
          inputText: '结束时间',
          valueFormat: 'yyyy-MM-dd',
          format: 'yyyy-MM-dd',
          span: 3
        }, {
          key: 'empName',
          value: '',
          type: 'input',
          inputText: '人员',
          span: 3
        }
      ],
      // 列表设置
      tableData: {
        loading: false,
        data: [],
        stripe: true,
        height: window.innerHeight,
        // type: 'selection',
        highlight: true,
        headerCellClass: 'tableHeaderCell-Center',
        rowClassName: this.tableRowClassName,
        multipleSelection: [],
        fields: [
          {prop: 'vehicleNo', label: '车辆牌号', fixed: true, hidden: false},
          {prop: 'vehicleTypeName', label: '车辆类型', hidden: false},
          {prop: 'statDate', label: '执行日期', hidden: false, formatter: this.formatterDay},
          {prop: 'airlineName', label: '航空公司', hidden: false},
          {prop: 'aircraftType', label: '机型', width: 100, hidden: false},
          {prop: 'aircraftNo', label: '机号', width: 80, hidden: false},
          {prop: 'flightNo', label: '航班号', width: 80, hidden: false},
          {prop: 'taskCn', label: '任务名称', hidden: false},
          {prop: 'usedHours', label: '保障时长', hidden: false},
          {prop: 'teamName', label: '保障人员', hidden: false}
        ]
      }
    }
  },
  mounted () {
    this.$store.commit('setConfigValue', 'dfsUrl')
    this.dfsUrl = this.$store.getters.getConfigValue

    // 页面起始修改发送参数的初始值为当日
    this.$set(this.queryList[3], 'value', this.formatterNewtimeOfYMD())
    this.$set(this.queryList[4], 'value', this.formatterNewtimeOfYMD())
    this.$set(this.queryData, 'start', this.queryList[3].value)
    this.$set(this.queryData, 'end', this.queryList[4].value)
  },
  methods: {
    // 详情
    handleDetail (row) {
      queryAll('/taskscheduling/hisDynamicTaskRecord/queryTaskDetail', row).then(res => {
        for (let i = 0; i < this.formData.formData.length; i++) {
          if (['exceptions', 'operations'].includes(this.formData.formData[i].key)) {
            this.$set(this.formData.formData[i], 'value', res.data.data[this.formData.formData[i].key])
          } else {
            this.$set(this.formData.formData[i], 'value', res.data.data.task[this.formData.formData[i].key])
          }
        }
        var arr = _.dropRight(this.formData.formData, 3)
        this.formData.groupData = _.chunk(arr, 4)
        arr = _.drop(this.formData.formData, this.formData.formData.length - 3)
        this.formData.groupData = _.concat(this.formData.groupData, _.chunk(arr, 1))
        this.formData.visible = true
      })
    },
    handleClose () {
      this.formData.visible = false
    },
    // 格式化 HH:MM
    formatter (value) {
      return value ? value.substr(11, 5) : ''
    },
    substr (url) {
      var arr = url.split('/')
      return arr[arr.length - 1]
    },
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
    }
  }
}
</script>

<style scope>
</style>
