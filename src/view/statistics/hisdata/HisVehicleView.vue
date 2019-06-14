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
      <Table-view :permissions="permissions" :tableData="tableData" ref="basicTable" @handleDetail="handleDetail" @handleEdit="handleEdit" @handleDelete="handleDelete"></Table-view>
    </el-main>
    <div class="dialog-form-edit statistics-dialog">
      <el-dialog :inline="formData.inline" :title="formData.title" :visible.sync="formData.visible" :append-to-body="formData.appendToBody"
      :custom-class="formData.className" :close-on-click-modal="false" :width="formData.width?formData.width:'480px'">
        <div slot="title" class="dialog-header">
          <img :src="require('@img/title_deco.png')"/>
          <span class="header-title">{{ formData.title }}</span>
        </div>
        <div class="dialog-body">
          <el-row v-for="(item, index) in formData.groupData" :key="index" class="his-info-normal">
            <el-col v-for="obj in item" :key="obj.key" :span="obj.span">
              <div v-if="obj.type == 'label'">
                <div class="his-info-title">{{obj.label}}</div>
                <div class="his-info-cont">{{obj.formatter?formatter(obj.value):(obj.key=='alarmFlag'?(obj.value==null?'':(obj.value?'是':'否')):obj.value)}}</div>
              </div>
              <div v-else-if="obj.type == 'arr'">
                <div class="his-info-title">{{obj.label}}</div>
                <div class="his-info-cont his-info-arr">
                  <div v-for="(val, index) in obj.value" :key="index" class="his-info-arr-div">{{val[obj.showKey]}}</div>
                </div>
              </div>
              <div v-else-if="obj.type == 'list'" class="whole-contain">
                <div class="his-info-list-title">{{obj.label}}</div>
                <div class="his-info-table-div div-head">
                  <table class="his-info-table table-head">
                    <thead>
                      <tr class="his-info-table-thead">
                        <th  v-for="field in obj.tableField" :key="field.prop">{{field.label}}</th>
                      </tr>
                    </thead>
                  </table>
                </div>
                <div class="his-info-table-div div-body">
                  <table class="his-info-table table-body">
                    <tbody>
                      <tr v-for="(item, index) in obj.value" :key="index" :class="(index % 2 == 0)?'his-info-table-tr tr-single':'his-info-table-tr tr-double'">
                        <td v-for="field in obj.tableField" :key="field.prop">
                          <div v-if="field.type == 'files'" class="file-down-div">
                            <a v-for="url in item[field.prop]" :key="url['tableKeyId']" class="a-download" :href="dfsUrl + url[field.urlKey]" :download="substr(url[field.urlKey])"><i class="el-icon-download"></i></a>
                          </div>
                          <div v-else :class="(field.prop=='operationTimeA' && item[field.prop] != null?'text-dec':'')">{{field.formatter?formatter(item[field.prop]):item[field.prop]}}</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
        </div>
      </el-dialog>
    </div>
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
      baseUrl: '/taskscheduling/hisDynamicVehicleRecord',
      // 分页参数
      pageData: {
        currentPage: 1,
        pageSizes: [10, 20, 30],
        pageSize: 10,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0
      },
      dfsUrl: '',
      formData: {
        title: '详情',
        visible: false,
        inline: true,
        width: '600px',
        key: 'reasonCode',
        formData: [
          {key: 'vehicleNo', label: '车辆牌号', type: 'label', span: 6},
          {key: 'vehicleTypeName', label: '车辆类型', type: 'label', span: 6},
          {key: 'flightNo', label: '航班号', type: 'label', span: 6},
          {key: 'execDate', label: '航班日期', type: 'label', span: 6},
          {key: 'airlineCn', label: '航空公司', type: 'label', span: 6},
          {key: 'aircraftType', label: '机型', type: 'label', span: 6},
          {key: 'aircraftNo', label: '机号', type: 'label', span: 6},
          {key: 'taskCn', label: '任务名称', type: 'label', span: 6},
          {key: 'teamName', label: '保障人员/班组', type: 'label', span: 24},
          {key: 'a1', label: '占位', type: 'label', span: 0},
          {key: 'a2', label: '占位', type: 'label', span: 0},
          {key: 'a3', label: '占位', type: 'label', span: 0},
          {key: 'currState', label: '任务状态', type: 'label', span: 6},
          {key: 'distributeTime', label: '派发时间', type: 'label', formatter: true, span: 6},
          {key: 'receiveTime', label: '接受时间', type: 'label', formatter: true, span: 6},
          {key: 'beginTimeE', label: '预计开始', type: 'label', formatter: true, span: 6},
          {key: 'endTimeE', label: '预计结束', type: 'label', formatter: true, span: 6},
          {key: 'beginTimeA', label: '实际开始', type: 'label', formatter: true, span: 6},
          {key: 'endTimeA', label: '实际结束', type: 'label', formatter: true, span: 6},
          {key: 'costMinute', label: '保障时长/分', type: 'label', span: 6},
          {key: 'alarmFlag', label: '是否超时', type: 'label', span: 6},
          {key: 'exceptions', label: '异常信息', type: 'arr', showKey: 'exceptionDesc', span: 24},
          {
            key: 'operations',
            label: '详情列表',
            type: 'list',
            span: 24,
            tableField: [
              {prop: 'operationName', label: '操作名称'},
              {prop: 'operationTimeE', label: '预计时间', formatter: true},
              {prop: 'operationTimeA', label: '实际时间', formatter: true},
              {prop: 'empName', label: '操作人'}
              // {prop: 'attachments', label: '附件', type: 'files', urlKey: 'attachmentUrl'}
            ]
          }
        ],
        groupData: []
      },
      // 查询条件每行个数
      colSize: 6,
      // 查询条件设置
      queryList: [
        {
          // p: '航空公司',
          key: 'airline',
          value: '',
          type: 'select',
          filterable: true,
          inputText: '航空公司',
          getOptions: '/basicdata/airline/queryAll',
          optKey: 'airlineIata',
          optLabel: 'briefC',
          span: 3
        }, {
          // p: '车牌号',
          key: 'vehicleNo',
          value: '',
          type: 'input',
          inputText: '车辆牌号',
          span: 3
        }, {
          key: 'vehicleType',
          value: '',
          type: 'select',
          inputText: '车型名称',
          getOptions: '/basicdata/vehicleType/queryAll',
          span: 3,
          optKey: 'vTypeNo',
          optLabel: 'vTypeName',
          filterable: true
        }, {
          // 'p': '开始时间',
          key: 'start',
          value: null,
          type: 'date',
          editable: false,
          clearable: true,
          inputText: '开始时间',
          valueFormat: 'yyyy-MM-dd',
          format: 'yyyy-MM-dd',
          span: 3
        }, {
          // 'p': '结束时间',
          key: 'end',
          value: null,
          type: 'date',
          editable: false,
          clearable: true,
          inputText: '结束时间',
          valueFormat: 'yyyy-MM-dd',
          format: 'yyyy-MM-dd',
          span: 3
        }, {
          key: 'empName',
          value: '',
          type: 'input',
          inputText: '人员',
          span: 3
        }
      ],
      // 列表设置
      tableData: {
        loading: false,
        data: [],
        stripe: true,
        height: window.innerHeight,
        oprWidth: 120,
        // type: 'selection',
        highlight: true,
        headerCellClass: 'tableHeaderCell-Center',
        rowClassName: this.tableRowClassName,
        multipleSelection: [],
        fields: [
          {prop: 'vehicleNo', label: '车辆牌号', fixed: true, width: 150, hidden: false},
          {prop: 'vehicleTypeName', label: '车辆类型', width: 150, hidden: false},
          {prop: 'execDate', label: '执行日期', width: 110, hidden: false, formatter: this.formatterDay},
          {prop: 'airlineCn', label: '航空公司', hidden: false},
          {prop: 'aircraftType', label: '机型', width: 100, hidden: false},
          {prop: 'aircraftNo', label: '机号', width: 100, hidden: false},
          {prop: 'flightNo', label: '航班号', width: 110, hidden: false},
          {prop: 'taskCn', label: '任务名称', hidden: false},
          {prop: 'costTime', label: '保障时长/分', width: 100, hidden: false},
          {prop: 'teamName', label: '保障人员/班组', hidden: false}
        ]
      }
    }
  },
  mounted () {
    this.$store.commit('setConfigValue', 'dfsUrl')
    this.dfsUrl = this.$store.getters.getConfigValue

    // 页面起始修改发送参数的初始值为当日
    this.$set(this.queryList[3], 'value', this.formatterNewtimeOfYMD())
    this.$set(this.queryList[4], 'value', this.formatterNewtimeOfYMD())
    this.$set(this.queryData, 'start', this.queryList[3].value)
    this.$set(this.queryData, 'end', this.queryList[4].value)
  },
  methods: {
    customAfterQuery () {
      this.tableData.data.forEach(item => {
        if (item.teamName) {
          this.$set(item, 'teamName', item.teamName)
        } else {
          this.$set(item, 'teamName', item.empName)
        }
      })
    },
    // 详情
    handleDetail (row) {
      queryAll('/taskscheduling/hisDynamicTaskRecord/queryTaskDetail', row).then(res => {
        for (let i = 0; i < this.formData.formData.length; i++) {
          if (['exceptions', 'operations'].includes(this.formData.formData[i].key)) {
            this.$set(this.formData.formData[i], 'value', res.data.data[this.formData.formData[i].key])
          } else {
            if (['vehicleNo', 'vehicleTypeName', 'flightNo', 'execDate', 'airlineCn', 'aircraftType', 'aircraftNo', 'taskCn', 'teamName'].includes(this.formData.formData[i].key)) {
              this.$set(this.formData.formData[i], 'value', row[this.formData.formData[i].key])
            } else {
              this.$set(this.formData.formData[i], 'value', res.data.data.task[this.formData.formData[i].key])
            }
          }
        }
        var arr = _.dropRight(this.formData.formData, 2)
        this.formData.groupData = _.chunk(arr, 4)
        arr = _.drop(this.formData.formData, this.formData.formData.length - 2)
        this.formData.groupData = _.concat(this.formData.groupData, _.chunk(arr, 1))
        this.formData.visible = true
      })
    },
    handleClose () {
      this.formData.visible = false
    },
    // 格式化 HH:MM
    formatter (value) {
      return value ? value.substr(11, 5) : '--:--'
    },
    substr (url) {
      var arr = url.split('/')
      return arr[arr.length - 1]
    },
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

<style scope>
</style>
