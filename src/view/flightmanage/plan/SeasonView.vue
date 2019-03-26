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
      <Table-view :permissions="permissions" :tableData="tableData" ref="basicTable" @handleDetail="handleDetail" @handleEdit="handleEdit" @handleDelete="handleDelete"></Table-view>
    </el-main>
    <Edit-view :formData="formData" @handleAdd="saveAdd" @handleEdit="saveEdit"></Edit-view>
    <Warning-box-view :data="deleteData" @handleConfirm="handleDeleteConfirm"></Warning-box-view>
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
import {idReg, idNumReg} from '../../../util/rules.js'

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
      baseUrl: 'sys/resource',
      formData: {
        title: '新增',
        visible: false,
        inline: true,
        className: 'twiceCol',
        formData: [
          {key: 'id', label: '资源名称', type: 'input', isHidden: true},
          {key: 'name', label: '资源名称', type: 'pInput'},
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
        // p: '资源名称',
        key: 'name',
        value: '',
        type: 'input',
        inputText: '名称',
        span: 4
      }, {
          // 'p': '资源类型',
          key: 'season',
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
          {prop: 'name', label: '名称', fixed: true, hidden: false},
          {prop: 'start', label: '开始时间', fixed: false, hidden: false},
          {prop: 'icon', label: '结束时间', fixed: false, hidden: false}
        ]
      }
    }
  },
  methods: {
    dateRangeReg (rule, value, callback) {
      if (value.hasOwnProperty('start') && value.hasOwnProperty('end')) {
        if (value.start && value.end) {
          if (value.start >= value.end) {
            let same = this.formData.formData.filter((obj) => {
              return obj.key == rule.field
            })
            callback(new Error(same.regInfo ? same.regInfo : '开始时间必须小于结束时间'))
          }
        }
      }
      callback()
    }
  },
  computed: {
    tableTotal () {
      return `${this.tableData.data ? this.tableData.data.length : 0}`
    }
  }
}
</script>
