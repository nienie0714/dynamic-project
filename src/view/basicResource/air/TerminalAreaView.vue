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
import {idReg} from '../../../util/rules.js'
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
      baseUrl: 'airportResource/terminalArea',
      formData: {
        title: '新增',
        visible: false,
        inline: true,
        className: 'twiceCol',
        key: 'terminalAreaNo',
        formData: [
          {key: 'terminalAreaNo', label: '区域编号', type: 'input', maxlength: 20},
          {key: 'name', label: '区域名称', type: 'input', maxlength: 20},
          {key: 'category', label: '区域类型', type: 'tabs', tabsKey: 'category', size: 'small', class: 'auto-width'},
          {key: 'terminalNo', label: '航站楼', type: 'select', filterable: true, getOptions: '/airportResource/terminal/queryAll', itemKey: 'terminalNo', itemLabel: 'name'},
          {key: 'isUseable', label: '是否可用', type: 'tabs', tabsKey: 'isYOrN'},
          {key: 'remark', label: '备注', type: 'textarea', autosize: true, maxlength: 100}
        ],
        rules: {
          terminalAreaNo: [
            {required: true, message: '必填项', trigger: 'blur'},
            {validator: idReg, trigger: 'blur'},
            {validator: this.unique, trigger: 'blur'}
          ],
          category: [
            {required: true, message: '必填项', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '必填项', trigger: 'blur'}
          ],
          terminalNo: [
            {required: true, message: '必填项', trigger: 'blur'}
          ],
          isUseable: [
            {required: true, message: '必填项', trigger: 'blur'}
          ]
        }
      },
      // 查询条件每行个数
      colSize: 4,
      // 查询条件设置
      queryList: [
        {
          // 'p': '区域名称',
          key: 'name',
          value: '',
          type: 'input',
          inputText: '区域名称',
          span: 4
        }, {
          // 'p': '属性',
          key: 'category',
          tabsKey: 'category',
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
        }, {
          // p: '是否可用',
          key: 'isUseable',
          tabsKey: 'isYOrN',
          value: null,
          type: 'tabs',
          size: 'medium',
          inputText: '',
          options: [{
            key: null,
            value: '全部'
          }],
          'valueChange': 'attrChange',
          'span': 3
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
        key: 'terminalAreaNo',
        multipleSelection: [],
        fields: [
          {prop: 'terminalAreaNo', label: '区域编号', fixed: true, hidden: false},
          {prop: 'category', label: '区域类型', fixed: false, hidden: false, optionKey: 'category'},
          {prop: 'name', label: '区域名称', fixed: false, hidden: false},
          {prop: 'terminalName', label: '航站楼', fixed: false, hidden: false},
          {prop: 'isUseable', label: '是否可用', fixed: false, hidden: false, optionKey: 'isYOrN'}
        ]
      },
      importData: {
        visible: false,
        uploadUrl: 'terminalArea',
        fileType: '.xls',
        fileUrl: '/dataImport/downloadExcel/terminalArea'
      }
    }
  },
  methods: {
    downloadErrorExcel (data) {
      let titles = ['区域编号', '区域类型', '区域名称', '航站楼', '是否可用']
      let ynArr = this.retEnumName(_.map(data, 'isUseable'), 'isYOrN')
      let arrs = [_.map(data, 'terminalAreaNo'), _.map(data, 'category'), _.map(data, 'name'), _.map(data, 'terminalName'), ynArr]
      let widths = [100, 100, 100, 100, 100]
      let newArrs = this.arrExcelFill(arrs)
      this.downloadError(titles, newArrs, widths)
    }
  }
}
</script>

<style scope>
</style>
