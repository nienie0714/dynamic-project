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
import {threeD, maxENReg, chReg} from '../../../util/rules.js'
import { postData, queryAll } from '../../../api/base.js'
import _ from 'lodash'

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
      baseUrl: 'basicdata/vehicleType',
      // 查询条件每行个数
      colSize: 4,
      formData: {
        title: '新增',
        visible: false,
        inline: true,
        className: 'twiceCol',
        key: 'vTypeNo',
        clearRulesKey: ['vTypeName'],
        formData: [
          {key: 'vTypeNo', label: '车型编号', type: 'input', isHidden: true},
          {key: 'vTypeName', label: '车型名称', type: 'input', maxlength: 30},
          {key: 'vTypeBrief', label: '车型简称', type: 'input', maxlength: 1},
          {key: 'sortkey', label: '排序码', type: 'input'},
          {key: 'remark', label: '备注', type: 'textarea', autosize: true, maxlength: 100},
          {key: 'vTypeUrl', label: '车型图标', type: 'upload', action: 'dfs/files', fileType: ['png', 'jpg', 'jpeg'], showFile: true, required: true}
        ],
        rules: {
          /* vTypeNo: [
            {required: true, message: '必填项'},
            {validator: maxENReg, trigger: 'blur'},
            {validator: this.unique, trigger: 'blur'}
          ], */
          vTypeName: [
            {required: true, message: '必填项', trigger: 'blur'},
            {validator: this.unique, trigger: 'blur'}
          ],
          vTypeBrief: [
            {required: true, message: '必填项', trigger: 'blur'},
            {validator: chReg, trigger: 'blur'}
          ],
          /* vTypeUrl: [
            {required: true, message: '必填项', trigger: 'change'}
          ], */
          sortkey: [
            {validator: threeD, trigger: 'blur'}
          ]
        }
      },
      // 查询条件设置
      queryList: [
        {
          // 'p': '车型名称',
          key: 'vTypeNo',
          value: null,
          type: 'select',
          filterable: true,
          optKey: 'vTypeNo',
          optLabel: 'vTypeName',
          inputText: '车型名称',
          getOptions: '/basicdata/vehicleType/queryAll',
          span: 4
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
        key: 'vTypeNo',
        multipleSelection: [],
        fields: [
          /* {prop: 'vTypeNo', label: '车型编号', fixed: true, hidden: false}, */
          {prop: 'vTypeName', label: '车型名称', fixed: true, hidden: false},
          {prop: 'vTypeBrief', label: '车型简称', fixed: false},
          {prop: 'vTypeUrl', label: '车型图标', type: 'img', fixed: false, hidden: false}
        ]
      },
      importData: {
        visible: false,
        uploadUrl: 'vehicleType',
        fileType: '.xls',
        fileUrl: '/dataImport/downloadExcel/vehicleType'
      }
    }
  },
  methods: {
    customMethod () {
      this.queryList.forEach(item => {
        if (item.key == 'vTypeNo') {
          queryAll(item.getOptions, {}).then(response => {
            if (response.data.code == 0) {
              this.$set(item, 'options', response.data.data)
            }
          })
        }
      })
    },
    handleDeleteConfirm (event) {
      if ((event && event.keyCode == 13) || !event) {
        this.deleteData.loading = true
        postData(this.deleteUrl, this.deleteData.data).then(response => {
          if (response.data.code == 0) {
            this.showSuccess('删除')
            this.customMethod()
            this.queryDataReq(1)
            this.handleDeleteClose()
          } else {
            this.showError('删除', response.data.msg)
          }
          this.deleteData.loading = false
        }).catch(() => {
          this.deleteData.loading = false
        })
      }
    },
    downloadErrorExcel (data) {
      let titles = ['车型名称', '车型简称']
      let arrs = [_.map(data, 'vTypeName'), _.map(data, 'vTypeBrief')]
      let widths = [250, 250]
      this.downloadError(titles, arrs, widths)
    }
  }
}
</script>
