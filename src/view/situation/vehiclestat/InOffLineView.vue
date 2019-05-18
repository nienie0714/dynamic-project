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
      baseUrl: 'basicdata/VehicleMaintenanceRecord',
      formData: {
        title: '详情',
        visible: false,
        inline: true,
        className: 'twiceCol',
        key: 'maintenanceId',
        clearRulesKey: [],
        formData: [
          {key: 'vehicleNo', label: '车辆牌号', type: 'input', maxlength: 9},
          {key: 'status', label: '车辆状态', type: 'input', maxlength: 50},
          {key: 'num', label: '上线/离线次数', type: 'number', position: 'right', step: 1}
        ]
      },
      // 查询条件每行个数
      colSize: 4,
      // 查询条件设置
      queryList: [
        {
          // 'p': '上线离线',
          key: 'inOff',
          tabsKey: 'inOff',
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
        },
        {
          // p: '车牌号',
          key: 'vehicleNo',
          value: '',
          type: 'select',
          filterable: true,
          inputText: '请选择车辆牌号',
          getOptions: '/basicdata/VehicleMaintenanceRecord/getVehicleNo',
          span: 3
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
          {prop: 'vehicleNo', label: '车辆牌号', fixed: true, hidden: false},
          {prop: 'status', label: '车辆状态', hidden: false},
          {prop: 'num', label: '上线/离线次数', hidden: false}
        ]
      }
    }
  },
  methods: {
  }
}
</script>
