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
      baseUrl: 'basicdata/sysLog',
      formData: {
        title: '详情',
        visible: false,
        inline: true,
        className: 'twiceCol',
        key: 'logId',
        clearRulesKey: ['userName'],
        formData: [
          {key: 'logId', label: '日志Id', type: 'input', isHidden: true, maxlength: 9},
          {key: 'logSummary', label: '日志类型', type: 'input', maxlength: 50},
          {key: 'logUser', label: '操作用户', type: 'input', maxlength: 10},
          {key: 'logTime', label: '日志时间', type: 'input'},
          {key: 'logSource', label: '日志来源', type: 'input', maxlength: 100}, // 操作系统名称或客户端地址等
          {key: 'createtime', label: '创建时间', type: 'date', format: 'yyyy-MM-dd HH:mm:ss', valueFormat: 'yyyy-MM-dd HH:mm:ss'},
          {key: 'updatetime', label: '修改时间', type: 'date', format: 'yyyy-MM-dd HH:mm:ss', valueFormat: 'yyyy-MM-dd HH:mm:ss'},
          {key: 'logDetail', label: '日志详情', type: 'textarea', class: 'auto-height', maxlength: 500},
          {key: 'logSession', label: '登录会话', type: 'textarea', class: 'auto-height', autosize: true, maxlength: 100},
          {key: 'remark', label: '备注', type: 'textarea', class: 'auto-height', autosize: true, maxlength: 100}
        ]
      },
      // 查询条件每行个数
      colSize: 5,
      // 查询条件设置
      queryList: [
        {
          // 'p': '用户名',
          key: 'logSummary',
          value: '',
          type: 'input',
          inputText: '日志类型',
          span: 4
          // value: '',
          // type: 'select',
          // filterable: true,
          // optKey: 'logType',
          // optLabel: 'logSummary',
          // inputText: '日志类型',
          // getOptions: '/basicdata/sysLog/queryLogType',
          // span: 4
        },
        {
          // 'p': '用户名',
          key: 'logUser',
          value: '',
          type: 'input',
          inputText: '操作用户',
          span: 4
        },
        {
          // 'p': '用户名',
          key: 'logDetail',
          value: '',
          type: 'input',
          inputText: '航班号',
          span: 4
        },
        {
          // 'p': '开始时间',
          key: 'beginDate',
          value: null,
          type: 'datetime',
          editable: false,
          clearable: true,
          inputText: '开始时间',
          valueFormat: 'yyyy-MM-dd HH:mm',
          format: 'yyyy-MM-dd HH:mm',
          span: 4
        }, {
          // 'p': '结束时间',
          key: 'endDate',
          value: null,
          type: 'datetime',
          editable: false,
          clearable: true,
          inputText: '结束时间',
          valueFormat: 'yyyy-MM-dd HH:mm',
          format: 'yyyy-MM-dd HH:mm',
          span: 4
        }
      ],
      // 列表设置
      tableData: {
        loading: false,
        data: [],
        stripe: true,
        height: window.innerHeight,
        highlight: true,
        headerCellClass: 'tableHeaderCell-Center',
        rowClassName: this.tableRowClassName,
        key: 'logId',
        multipleSelection: [],
        fields: [
          {prop: 'logId', label: '日志Id', hidden: true},
          {prop: 'empName', label: '操作用户', fixed: true, hidden: false},
          {prop: 'logTime', label: '日志时间', fixed: false, hidden: false, formatter: this.formatterDayMin},
          {prop: 'logSource', label: '日志来源', fixed: false, hidden: false},
          {prop: 'logSummary', label: '日志类型', fixed: false, hidden: false},
          {prop: 'logSession', label: '登录会话', fixed: false, hidden: false, overflow: true},
          {prop: 'logDetail', label: '日志详情', fixed: false, hidden: false, width: '350px', overflow: true}
        ]
      }
    }
  },
  methods: {
  }
}
</script>
