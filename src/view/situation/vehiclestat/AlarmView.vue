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
      queryUrl: 'statistics/aomsVehicleStat/queryVehicleAlarmStat',
      exportUrl: '/statistics/aomsVehicleStat/alarmStat/exportExcel',
      formData: {
        title: '详情',
        visible: false,
        inline: true,
        className: 'twiceCol',
        // key: 'vehicleId',
        clearRulesKey: [],
        formData: [
          {key: 'vehicleNo', label: '车辆牌号', type: 'input', maxlength: 9},
          {key: 'vehicleTypeName', label: '车辆类型', type: 'input', maxlength: 9},
          {key: 'statDate', label: '执行日期', type: 'date', format: 'yyyy-MM-dd', valueFormat: 'yyyy-MM-dd'},
          {key: 'alarmType', label: '报警类型', type: 'tabs', tabsKey: 'vehicleAlarm'},
          {key: 'alarmNum', label: '报警次数', type: 'number', position: 'right', step: 1}
        ]
      },
      // 查询条件每行个数
      colSize: 5,
      // 查询条件设置
      queryList: [
        {
          // 'p': '上线离线',
          key: 'alarmType',
          tabsKey: 'vehicleAlarm',
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
          key: 'vehicleType',
          value: '',
          type: 'select',
          inputText: '车型名称',
          getOptions: '/basicdata/vehicleType/queryAll',
          span: 4,
          optKey: 'vTypeNo',
          optLabel: 'vTypeName',
          filterable: true
        },
        {
          // p: '车牌号',
          key: 'vehicleNo',
          value: '',
          type: 'input',
          inputText: '车辆牌号',
          span: 4
        },
        {
          // 'p': '时间区间',
          key: 'date',
          value: null,
          type: 'daterange',
          editable: false,
          clearable: true,
          rangeSeparator: '至',
          inputText: '时间范围',
          valueFormat: 'yyyy-MM-dd',
          format: 'yyyy-MM-dd',
          pickerOpt: {
            disabledDate: (time) => {
              let maxDate = new Date(this.latestDate)
              return time.getTime() > maxDate
            }
          },
          span: 6
        }/* , {
          // 'p': '结束时间',
          key: 'end',
          value: null,
          type: 'date',
          editable: false,
          clearable: true,
          inputText: '结束时间',
          valueFormat: 'yyyy-MM-dd',
          format: 'yyyy-MM-dd',
          span: 4
        } */
      ],
      // 列表设置
      tableData: {
        loading: false,
        data: [],
        stripe: true,
        height: window.innerHeight,
        highlight: true,
        isOperat: true,
        headerCellClass: 'tableHeaderCell-Center',
        rowClassName: this.tableRowClassName,
        // key: 'vehicleId',
        multipleSelection: [],
        fields: [
          {prop: 'vehicleNo', label: '车辆牌号', fixed: true, hidden: false},
          {prop: 'vehicleTypeName', label: '车辆类型', fixed: false, hidden: false},
          {prop: 'statDate', label: '执行日期', hidden: false, formatter: this.formatterDay},
          {prop: 'alarmType', label: '报警类型', hidden: false, optionKey: 'vehicleAlarm'},
          {prop: 'alarmNum', label: '报警次数', hidden: false}
        ]
      }
    }
  },
  mounted () {
    // 页面起始修改发送参数的初始值为当日
    this.$set(this.queryList[3], 'value', [this.formatterNewtimeOfYMD(), this.formatterNewtimeOfYMD()])
    // this.$set(this.queryList[4], 'value', this.formatterNewtimeOfYMD())
    this.$set(this.queryData, 'date', this.queryList[3].value)
    // this.$set(this.queryData, 'end', this.queryList[4].value)
  },
  methods: {
    customBeforeQuery () {
      let result = null
      if (this.queryData.start && this.queryData.end) {
        result = new Date(this.queryData.start) <= new Date(this.queryData.end)
        if (result) {
          return true
        } else {
          this.showError('请求', '开始时间必须小于结束时间 !')
          return false
        }
      } else {
        return true
      }
    }
  }
}
</script>
