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
        <Tool-button-view :permissions="permissions" :selectionCount="tableData.multipleSelection.length" @handleImport="handleImport" @handleDownload="handleDownload" @handleAdd="handleAdd" @handleDelete="handleDelete"></Tool-button-view>
        <Pagination-view :pageData="pageData" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange"></Pagination-view>
      </div>
      <Table-view :permissions="permissions" :tableData="tableData" ref="basicTable" @handleDetail="handleDetail" @handleEdit="handleEdit" @handleDelete="handleDelete"></Table-view>
    </el-main>
    <Edit-view :formData="formData" @handleAdd="saveAdd" @handleEdit="saveEdit"></Edit-view>
    <Warning-box-view :data="deleteData" @handleConfirm="handleDeleteConfirm" @handleClose="handleDeleteClose"></Warning-box-view>
    <import-dialog :data="importData" @downloadErrorExcel="downloadErrorExcel" @handleRefresh="handleRefresh"></import-dialog>
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
import {idReg, threeD} from '../../../util/rules.js'
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
      baseUrl: 'basicdata/flighttask',
      formData: {
        title: '新增',
        visible: false,
        inline: true,
        className: 'twiceCol',
        key: 'taskCode',
        formData: [
          {key: 'taskCode', label: '任务代码', type: 'input', toUpper: true, maxlength: 10},
          {key: 'briefC', label: '中文简称', type: 'input', maxlength: 20},
          {key: 'briefE', label: '英文简称', type: 'input', maxlength: 50},
          {key: 'sortkey', label: '排序码', type: 'input'},
          {key: 'remark', label: '备注', type: 'textarea', autosize: true, maxlength: 100}
        ],
        rules: {
          taskCode: [
            {required: true, message: '必填项', trigger: 'blur'},
            {validator: idReg, trigger: 'blur'},
            {validator: this.unique, trigger: 'blur'}
          ],
          briefC: [
            {required: true, message: '必填项', trigger: 'blur'}
          ],
          sortkey: [
            {validator: threeD, trigger: 'blur'}
          ]
        }
      },
      // 查询条件每行个数
      colSize: 4,
      // 查询条件设置
      queryList: [
        {
          // 'p': '任务代码',
          key: 'taskCode',
          value: '',
          type: 'input',
          inputText: '任务代码',
          toUpper: true,
          span: 3
        }, {
          // 'p': '中文简称',
          key: 'briefC',
          value: '',
          type: 'input',
          inputText: '中文简称',
          span: 4
        }
      ],
      // 列表设置
      tableData: {
        loading: false,
        data: [],
        stripe: true,
        height: window.innerHeight,
        type: 'selection',
        highlight: true,
        headerCellClass: 'tableHeaderCell-Center',
        rowClassName: this.tableRowClassName,
        key: 'taskCode',
        multipleSelection: [],
        fields: [
          {prop: 'taskCode', label: '任务代码', fixed: true, hidden: false},
          {prop: 'briefC', label: '中文简称', fixed: false, hidden: false},
          {prop: 'briefE', label: '英文简称', fixed: false, hidden: false}
        ]
      },
      importData: {
        visible: false,
        uploadUrl: 'flightTask',
        fileType: '.xls',
        fileUrl: '/dataImport/downloadExcel/flightTask'
      }
    }
  },
  methods: {
    downloadErrorExcel (data) {
      let titles = ['任务代码', '中文简称', '英文简称']
      let arrs = [_.map(data, 'taskCode'), _.map(data, 'briefC'), _.map(data, 'briefE')]
      let widths = [167, 167, 167]
      let newArrs = this.arrExcelFill(arrs)
      this.downloadError(titles, newArrs, widths)
    }
  }
}
</script>

<style scope>
</style>
