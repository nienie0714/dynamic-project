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
import {rdEReg, threeD} from '../../../util/rules.js'
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
      baseUrl: 'basicdata/flightstatus',
      formData: {
        title: '新增',
        visible: false,
        inline: true,
        className: 'twiceCol',
        key: 'statusCode',
        formData: [
          {key: 'statusCode', label: '状态代码', type: 'input', toUpper: true},
          {key: 'abnormalFlag', label: '状态分类', type: 'tabs', tabsKey: 'abnormalFlag'},
          {key: 'nameC', label: '中文名称', type: 'input', maxlength: 50},
          {key: 'nameE', label: '英文名称', type: 'input', maxlength: 50},
          {key: 'sortkey', label: '排序码', type: 'input'},
          {key: 'remark', label: '备注', type: 'textarea', autosize: true, maxlength: 100}
        ],
        rules: {
          statusCode: [
            {required: true, message: '必填项', trigger: 'blur'},
            {validator: rdEReg, trigger: 'blur'},
            {validator: this.unique, trigger: 'blur'}
          ],
          abnormalFlag: [
            {required: true, message: '必填项', trigger: 'blur'}
          ],
          nameC: [
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
          // 'p': '状态代码',
          key: 'statusCode',
          value: '',
          type: 'input',
          inputText: '状态代码',
          toUpper: true,
          span: 3
        }, {
          // 'p': '状态分类',
          /* key: 'attr',
          tabsKey: 'attr',
          value: null,
          type: 'tabs',
          size: 'medium',
          inputText: '',
          options: [{
            key: null,
            value: '全部'
          }],
          'valueChange': 'attrChange',
          'span': 7.5
        }, { */
          // 'p': '状态分类',
          key: 'abnormalFlag',
          tabsKey: 'abnormalFlag',
          value: null,
          type: 'tabs',
          size: 'medium',
          inputText: '',
          options: [{
            key: null,
            value: '全部'
          }],
          span: 3
        }, {
          // 'p': '状态描述',
          key: 'nameC',
          value: '',
          type: 'input',
          inputText: '状态描述',
          span: 5
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
        key: 'statusCode',
        multipleSelection: [],
        fields: [
          {prop: 'statusCode', label: '状态代码', fixed: true, hidden: false},
          {prop: 'abnormalFlag', label: '状态分类', fixed: false, hidden: false, optionKey: 'abnormalFlag'},
          {prop: 'nameC', label: '中文名称', fixed: false, hidden: false},
          {prop: 'nameE', label: '英文名称', fixed: false, hidden: false}
        ]
      },
      importData: {
        visible: false,
        uploadUrl: 'flightStatus',
        fileType: '.xls',
        fileUrl: '/dataImport/downloadExcel/flightStatus'
      }
    }
  },
  methods: {
    downloadErrorExcel (data) {
      let titles = ['状态代码', '状态分类', '中文名称', '英文名称']
      let arrs = [_.map(data, 'statusCode'), _.map(data, 'abnormalFlag'), _.map(data, 'nameC'), _.map(data, 'nameE')]
      let widths = [125, 125, 125, 125]
      let newArrs = this.arrExcelFill(arrs)
      this.downloadError(titles, newArrs, widths)
    }
  }
}
</script>

<style scope>
</style>
