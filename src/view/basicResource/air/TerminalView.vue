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
import {idReg, sevDotTwoDigit, sixDotSixDigit, threeD, degreePos} from '../../../util/rules.js'
import {queryAll, postData} from '../../../api/base.js'
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
      baseUrl: 'airportResource/terminal',
      formData: {
        title: '新增',
        visible: false,
        inline: true,
        className: 'twiceCol',
        key: 'terminalNo',
        formData: [
          {key: 'terminalNo', label: '航站楼编号', type: 'input', toUpper: true, maxlength: 20},
          {key: 'name', label: '名称', type: 'textarea', autosize: true, maxlength: 50},
          {key: 'attr', label: '属性', type: 'tabs', tabsKey: 'attr', class: 'auto-width'},
          {key: 'sortkey', label: '排序码', type: 'input'},
          {key: 'isUseable', label: '是否可用', type: 'tabs', tabsKey: 'isYOrN'},
          {key: 'remark', label: '备注', type: 'textarea', autosize: true, maxlength: 100}
        ],
        rules: {
          terminalNo: [
            {required: true, message: '必填项', trigger: 'blur'},
            {validator: idReg, trigger: 'blur'},
            {validator: this.unique, trigger: 'blur'}
          ],
          attr: [
            {required: true, message: '必填项', trigger: 'blur'}
          ],
          name: [
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
          // 'p': '航站楼编号',
          key: 'terminalNo',
          value: '',
          type: 'input',
          inputText: '航站楼编号',
          toUpper: true,
          span: 3
        }, {
          // 'p': '属性',
          key: 'attr',
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
          'span': 5
        }, {
          p: '是否可用',
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
          'span': 4
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
        key: 'terminalNo',
        multipleSelection: [],
        fields: [
          {prop: 'terminalNo', label: '航站楼编号', fixed: true, hidden: false},
          {prop: 'name', label: '名称', fixed: false, hidden: false},
          {prop: 'attr', label: '属性', fixed: false, hidden: false, optionKey: 'attr'},
          {prop: 'isUseable', label: '是否可用', fixed: false, hidden: false, optionKey: 'isYOrN'}
        ]
      },
      importData: {
        visible: false,
        uploadUrl: 'terminal',
        fileType: '.xls',
        fileUrl: '/dataImport/downloadExcel/terminal'
      }
    }
  },
  methods: {
    handleDeleteConfirm () {
      this.deleteData.loading = true
      postData(this.deleteUrl, this.deleteData.data).then(response => {
        if (response.data.code == 0) {
          this.showSuccess('删除')
          this.customMethod()
          this.queryDataReq(1)
        } else {
          this.showError('删除', '该航站楼存在关联关系，关联项可能为航站楼区域、航站楼资源、登机口、停机位、机坪区域等')
        }
        this.deleteData.visible = false
        this.deleteData.loading = false
      }).catch(() => {
        this.deleteData.loading = false
      })
    },
    downloadErrorExcel (data) {
      let titles = ['航站楼编号', '名称', '属性', '是否可用']
      let attrArr = this.retEnumName(_.map(data, 'attr'), 'attr')
      let ynArr = this.retEnumName(_.map(data, 'isUseable'), 'isYOrN')
      let arrs = [_.map(data, 'terminalNo'), _.map(data, 'name'), attrArr, ynArr]
      let widths = [150, 150, 130, 70]
      let newArrs = this.arrExcelFill(arrs)
      this.downloadError(titles, newArrs, widths)
    }
  }
}
</script>

<style scope>
</style>
