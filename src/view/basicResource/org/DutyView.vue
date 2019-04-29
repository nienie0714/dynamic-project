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
      baseUrl: 'basicdata/dutyInfo',
      formData: {
        title: '新增',
        visible: false,
        inline: true,
        className: 'twiceCol',
        key: 'dutyId',
        formData: [
          {key: 'dutyId', label: '值班Id', isHidden: true},
          {key: 'airLeader', label: '机场公司值班领导', type: 'input', maxlength: 50},
          {key: 'generalDuty', label: '总值班室', type: 'input', maxlength: 50},
          {key: 'operationManagementDept', label: '运行管理部', type: 'input', maxlength: 50},
          {key: 'securityDept', label: '安检护卫部', type: 'input', maxlength: 50},
          {key: 'airportPSB', label: '机场公安局', type: 'input', maxlength: 50},
          {key: 'terminalManagementDept', label: '航站楼管理部', type: 'input', maxlength: 50},
          {key: 'airFoodCompany', label: '航食公司', type: 'input', maxlength: 50},
          {key: 'safetyNavigationDept', label: '安全航务部', type: 'input', maxlength: 50},
          {key: 'airServiceCompany', label: '航服公司', type: 'input', maxlength: 50},
          {key: 'airportManagementDept', label: '机场管理部', type: 'input', maxlength: 50},
          {key: 'groundServiceCompany', label: '地服公司', type: 'input', maxlength: 50},
          {key: 'logisticsCompany', label: '物流公司', type: 'input', maxlength: 50},
          {key: 'propertyCompany', label: '物业公司', type: 'input', maxlength: 50}
        ],
        rules: {
          airLeader: [
            {required: true, message: '必填项', trigger: 'blur'}
          ],
          generalDuty: [
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
          key: 'airLeader',
          value: '',
          type: 'input',
          inputText: '值班领导',
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
          {prop: 'dutyId', label: '值班Id', fixed: true, hidden: true},
          {prop: 'airLeader', label: '机场公司值班领导', fixed: false, hidden: false},
          {prop: 'generalDuty', label: '总值班室', fixed: false, hidden: false},
          {prop: 'operationManagementDept', label: '运行管理部', fixed: false, hidden: false},
          {prop: 'securityDept', label: '安检护卫部', fixed: false, hidden: false},
          {prop: 'airportPSB', label: '机场公安局', fixed: false, hidden: false},
          {prop: 'terminalManagementDept', label: '航站楼管理部', fixed: false, hidden: false},
          {prop: 'airFoodCompany', label: '航食公司', fixed: false, hidden: false},
          {prop: 'commandDept', label: '指挥部', fixed: false, hidden: false},
          {prop: 'safetyNavigationDept', label: '安全航务部', fixed: false, hidden: false},
          {prop: 'airServiceCompany', label: '航服公司', fixed: false, hidden: false},
          {prop: 'airportManagementDept', label: '机场管理部', fixed: false, hidden: false},
          {prop: 'groundServiceCompany', label: '地服公司', fixed: false, hidden: false},
          {prop: 'logisticsCompany', label: '物流公司', fixed: false, hidden: false},
          {prop: 'propertyCompany', label: '物业公司', fixed: false, hidden: false}
        ]
      }
    }
  },
  methods: {
  }
}
</script>
