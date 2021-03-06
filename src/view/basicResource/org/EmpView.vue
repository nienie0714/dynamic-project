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
import {postData} from '../../../api/base.js'
import {idNumReg, sixNum, phoneReg, threeD} from '../../../util/rules.js'
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
      baseUrl: 'organization/employee',
      formData: {
        title: '新增',
        visible: false,
        inline: true,
        className: 'twiceCol',
        key: 'empId',
        formData: [
          {key: 'empId', label: '员工编号', type: 'input', maxlength: 6, isHidden: true},
          {key: 'reserved2', label: '员工编号', type: 'input', maxlength: 6},
          {key: 'empName', label: '员工名称', type: 'input', maxlength: 30},
          {key: 'gender', label: '性别', type: 'tabs', tabsKey: 'gender'},
          {key: 'phone', label: '联系电话', type: 'input', maxlength: 15},
          {key: 'parentDeptIds', label: '部门', saveKey: 'deptId', type: 'casc', class: 'auto-width', getOptions: '/organization/department/queryDeptTreeByUserId', props: {value: 'id', label: 'text', children: 'children'}, options: []},
          {key: 'airportIata', label: '所属机场', type: 'select', filterable: true, tabsKey: 'airport', itemKey: 'key', itemLabel: 'value', default: true},
          {key: 'post', label: '职务', type: 'select', filterable: true, tabsKey: 'post', itemKey: 'key', itemLabel: 'value'},
          {key: 'qualification', label: '员工资质', type: 'textarea', autosize: true, maxlength: 50},
          {key: 'remark', label: '备注', type: 'textarea', autosize: true, maxlength: 100}
        ], /* {key: 'taskRoleIds', label: '任务角色', type: 'select', multiple: true, class: 'auto-width', getOptions: '/taskbasic/taskRole/queryAll', itemKey: 'taskRoleId', itemLabel: 'name', autosize: true}, */
        rules: {
          reserved2: [
            {required: true, message: '必填项', trigger: 'blur'},
            {validator: sixNum, trigger: 'blur'},
            {validator: this.uniqueKey, trigger: 'blur'}
          ],
          parentDeptIds: [
            {required: true, message: '必填项', trigger: 'change'}
          ],
          empName: [
            {required: true, message: '必填项', trigger: 'blur'}
          ],
          gender: [
            {required: true, message: '必填项', trigger: 'blur'}
          ],
          reserved1: [
            {required: true, message: '必填项', trigger: 'blur'}
          ],
          phone: [
            {validator: phoneReg, trigger: 'blur'}
          ]
        }
      },
      // 查询条件每行个数
      colSize: 4,
      // 查询条件设置
      queryList: [
        {
          // 'p': '员工姓名',
          key: 'empName',
          value: '',
          type: 'input',
          inputText: '员工姓名/员工编号',
          span: 4
        }, {
          // 'p': '部门',
          key: 'deptName',
          value: '',
          type: 'input',
          inputText: '部门',
          span: 4
          // value: null,
          // type: 'select',
          // filterable: true,
          // optKey: 'deptId',
          // optLabel: 'deptName',
          // optLabelSpan: 'deptParentName',
          // inputText: '部门',
          // getOptions: '/organization/department/queryDeptByEmp',
          // span: 4
        }, {
          // 'p': '职务',
          key: 'post',
          value: '',
          type: 'input',
          inputText: '职务',
          span: 4
          // tabsKey: 'post',
          // value: null,
          // type: 'select',
          // filterable: true,
          // optKey: 'key',
          // optLabel: 'value',
          // inputText: '职务',
          // 'valueChange': 'attrChange',
          // 'span': 4
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
        key: 'empId',
        multipleSelection: [],
        fields: [
          {prop: 'empId', label: '员工编号', fixed: true, hidden: true},
          {prop: 'reserved2', label: '员工编号', fixed: false, hidden: false},
          {prop: 'empName', label: '员工姓名', fixed: false, hidden: false},
          {prop: 'gender', label: '性别', fixed: false, hidden: false, optionKey: 'gender'},
          {prop: 'phone', label: '联系电话', fixed: false, hidden: false},
          {prop: 'airportIata', label: '所属机场', fixed: false, hidden: false, optionKey: 'airport'},
          {prop: 'deptName', label: '部门', fixed: false, hidden: false},
          {prop: 'post', label: '职务', fixed: false, hidden: false, optionKey: 'post'},
          {prop: 'qualification', label: '员工资质', fixed: false, hidden: false}
        ]
      },
      importData: {
        visible: false,
        uploadUrl: 'employee',
        fileType: '.xls',
        fileUrl: '/dataImport/downloadExcel/employee'
      }
    }
  },
  methods: {
    // 新增
    handleAdd () {
      for (let i = 0; i < this.formData.formData.length; i++) {
        if (this.formData.formData[i].key == 'empId') {
          this.$set(this.formData.formData[i], 'value', null)
          break
        }
      }
      this.formData.title = '新增'
      this.formData.visible = true
    },
    handleDeleteConfirm () {
      this.deleteData.loading = true
      postData(this.deleteUrl, this.deleteData.data).then(response => {
        if (response.data.code == 0) {
          this.showSuccess('删除')
          this.customMethod()
          this.queryDataReq(1)
        } else if (response.data.code == -1) {
          this.showError('删除', response.data.msg)
        } else {
          this.showError('删除')
        }
        this.deleteData.visible = false
        this.deleteData.loading = false
      }).catch(() => {
        this.deleteData.loading = false
      })
    },
    downloadErrorExcel (data) {
      let titles = ['员工编号', '员工姓名', '部门', '所属机场', '职务', '性别', '联系电话', '员工资质']
      let arrs = [_.map(data, 'reserved2'), _.map(data, 'empName'), _.map(data, 'deptName'), _.map(data, 'airportIata'), _.map(data, 'post'), _.map(data, 'gender'), _.map(data, 'phone'), _.map(data, 'qualification')]
      let widths = [100, 90, 90, 100, 110, 62, 100, 100]
      this.downloadError(titles, arrs, widths, null, 'l')
    }
  }
}
</script>
