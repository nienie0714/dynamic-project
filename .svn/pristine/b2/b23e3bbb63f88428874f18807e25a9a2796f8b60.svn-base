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
        <template slot="button-slot-scope" slot-scope="scopeData">
          <div v-if="permissions.reset" class="tool-div-button button-reset" title="重置密码" @click="handleReset(scopeData.data)"></div>
        </template>
      </Table-view>
    </el-main>
    <Edit-view :formData="formData" @handleAdd="saveAdd" @handleEdit="saveEdit" @handleReset="saveReset"></Edit-view>
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
        reset: false,
        export: false
      },
      // 基础路径
      baseUrl: 'basicdata/sysUser',
      formData: {
        title: '新增',
        visible: false,
        inline: true,
        className: 'twiceCol',
        key: 'userId',
        clearRulesKey: ['userName'],
        formData: [
          {key: 'userId', label: '用户ID', isHidden: true},
          {key: 'userName', label: '用户名称', type: 'input', maxlength: 20},
          {key: 'empId', label: '员工姓名', type: 'select', filterable: true, getOptions: '/organization/employee/queryUnboundEmp', itemKey: 'empId', itemLabel: 'empName', itemLabelSpan: 'deptName'},
          {key: 'password', label: '密码', type: 'password', minlength: 6, maxlength: 8},
          {key: 'roleIds', label: '角色', type: 'select', filterable: true, multiple: true, getOptions: '/sys/role/getEnabledAll', itemKey: 'roleId', itemLabel: 'name', autosize: true, class: 'auto-width'}
        ],
        rules: {
          userName: [
            {required: true, message: '必填项', trigger: 'blur'},
            {validator: this.unique, trigger: 'blur'}
          ],
          empId: [
            {required: true, message: '必填项', trigger: 'change'}
          ],
          password: [
            {required: true, message: '必填项', trigger: 'blur'},
            {validator: passwordReg, trigger: 'blur'}
          ]
        }
      },
      // 查询条件每行个数
      colSize: 4,
      // 查询条件设置
      queryList: [
        {
          // 'p': '用户名',
          key: 'userName',
          value: '',
          type: 'input',
          inputText: '用户名',
          span: 4
        }, {
          // 'p': '角色',
          key: 'roleId',
          value: '',
          type: 'select',
          filterable: true,
          optKey: 'roleId',
          optLabel: 'name',
          inputText: '角色',
          getOptions: '/sys/role/getEnabledAll',
          span: 4
        }, {
          // 'p': '员工',
          key: 'empId',
          value: '',
          type: 'select',
          filterable: true,
          optKey: 'empId',
          optLabel: 'empName',
          inputText: '员工',
          getOptions: '/organization/employee/queryAll',
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
        key: 'userId',
        multipleSelection: [],
        fields: [
          {prop: 'userName', label: '用户名', fixed: true, hidden: false},
          {prop: 'empName', label: '员工姓名', fixed: false, hidden: false},
          {prop: 'deptName', label: '部门', fixed: false, hidden: false},
          {prop: 'roleNames', label: '角色', fixed: false, hidden: false, overflow: true}
        ]
      }
    }
  },
  methods: {
    // 新增
    handleAdd () {
      for (let i = 0; i < this.formData.formData.length; i++) {
        if (this.formData.formData[i].key != 'userId') {
          if (this.formData.formData[i].hasOwnProperty('isHidden')) {
            this.formData.formData[i].isHidden = false
          }
        }
        if (this.formData.formData[i].key == 'empId') {
          this.$delete(this.formData.formData[i], 'optionsQuery')
        }
      }
      this.formData.title = '新增'
      this.formData.visible = true
    },
    // 详情
    handleDetail (row) {
      for (let i = 0; i < this.formData.formData.length; i++) {
        this.$set(this.formData.formData[i], 'value', row[this.formData.formData[i].key])
        if (this.formData.formData[i].key == 'password') {
          this.$set(this.formData.formData[i], 'isHidden', true)
        } else if (this.formData.formData[i].key != 'userId') {
          this.$set(this.formData.formData[i], 'isHidden', false)
        }
        if (this.formData.formData[i].key == 'empId') {
          let data = {
            'empId': row[this.formData.formData[i].key]
          }
          this.$set(this.formData.formData[i], 'optionsQuery', data)
        }
      }
      this.formData.title = '详情'
      this.formData.visible = true
    },
    // 编辑
    handleEdit (row) {
      for (let i = 0; i < this.formData.formData.length; i++) {
        this.$set(this.formData.formData[i], 'value', row[this.formData.formData[i].key])
        if (this.formData.formData[i].key == 'password') {
          this.$set(this.formData.formData[i], 'isHidden', true)
        } else if (this.formData.formData[i].key != 'userId') {
          this.$set(this.formData.formData[i], 'isHidden', false)
        }
        if (this.formData.formData[i].key == 'empId') {
          let data = {
            'empId': row[this.formData.formData[i].key]
          }
          this.$set(this.formData.formData[i], 'optionsQuery', data)
        }
      }
      this.formData.title = '编辑'
      this.formData.visible = true
    },
    // 重置
    handleReset (row) {
      for (let i = 0; i < this.formData.formData.length; i++) {
        this.$set(this.formData.formData[i], 'value', row[this.formData.formData[i].key])
        if (this.formData.formData[i].key == 'password' || this.formData.formData[i].key == 'userName') {
          this.$set(this.formData.formData[i], 'isHidden', false)
        } else {
          this.$set(this.formData.formData[i], 'isHidden', true)
        }
      }
      this.formData.title = '重置'
      this.formData.visible = true
    },
    // 发送重置密码请求
    saveReset (data) {
      postData(this.resetUrl, data).then(response => {
        if (response.data.code == 0) {
          this.formData.visible = false
          this.showSuccess('密码重置')
          this.customMethod()
          this.queryDataReq(1)
        }
        this.formData.loading = false
      })
    }
  }
}
</script>
