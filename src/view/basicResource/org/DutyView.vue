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
        add: false,
        update: false,
        delete: false,
        export: false
      },
      // 基础路径
      baseUrl: 'basicdata/aomsDutyInfo',
      formData: {
        title: '新增',
        visible: false,
        inline: true,
        className: 'twiceCol',
        key: 'dutyId',
        formData: [
          {key: 'departmentId', label: '值班Id', isHidden: true},
          {key: 'departmentName', label: '部门名称', type: 'input', maxlength: 50},
          {key: 'dutyLeader', label: '值班领导', type: 'input', maxlength: 50}
        ],
        rules: {
          dutyLeader: [
            {required: true, message: '必填项', trigger: 'blur'}
          ]
        }
      },
      // 查询条件每行个数
      colSize: 4,
      // 查询条件设置
      queryList: [
        {
          // 'p': '用户名',
          key: 'departmentName',
          value: '',
          type: 'input',
          inputText: '部门',
          span: 4
        },
        {
          // 'p': '用户名',
          key: 'dutyLeader',
          value: '',
          type: 'input',
          inputText: '领导',
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
        key: 'userId',
        multipleSelection: [],
        fields: [
          {prop: 'departmentId', label: '值班Id', hidden: true},
          {prop: 'departmentName', label: '部门名称', fixed: 'left', hidden: false},
          {prop: 'dutyLeader', label: '值班领导', fixed: false, hidden: false}
        ]
      }
    }
  },
  methods: {
    handleEdit (row) {
      for (let i = 0; i < this.formData.formData.length; i++) {
        this.$set(this.formData.formData[i], 'value', row[this.formData.formData[i].key])
        if (this.formData.formData[i].key == 'departmentName') {
          this.$set(this.formData.formData[i], 'type', 'pInput')
        }
      }
      this.formData.title = '编辑'
      this.formData.visible = true
    }
  }
}
</script>
