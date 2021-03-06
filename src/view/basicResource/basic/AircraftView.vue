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
import {idReg, sixNum} from '../../../util/rules.js'
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
      baseUrl: 'basicdata/aircraft',
      formData: {
        title: '新增',
        visible: false,
        inline: true,
        className: 'twiceCol',
        key: 'aircraftNo',
        formData: [
          {key: 'aircraftNo', label: '飞机号', type: 'input', maxlength: 10},
          {key: 'aircraftIcao', label: '机型ICAO码', type: 'select', filterable: true, getOptions: '/basicdata/aircraftType/queryAll', itemKey: 'aircraftIcao', itemLabel: 'aircraftIcao'},
          {key: 'airline', label: '航空公司', type: 'select', filterable: true, getOptions: '/basicdata/airline/queryAll', itemKey: 'airlineIata', itemLabel: 'briefC', change: this.changeNo},
          {key: 'airlineSub', label: '航空分公司', type: 'select', filterable: true, getOptions: '/basicdata/airline/queryAll', itemKey: 'airlineIata', itemLabel: 'briefC'},
          {key: 'seatsFirst', label: '头等舱座位数', type: 'input'},
          {key: 'seatsBussiness', label: '商务舱座位数', type: 'input'},
          {key: 'seatsEconomy', label: '经济舱座位数', type: 'input'},
          {key: 'remark', label: '备注', type: 'textarea', autosize: true, maxlength: 100}
        ],
        rules: {
          aircraftNo: [
            {required: true, message: '必填项', trigger: 'blur'},
            {validator: idReg, trigger: 'blur'},
            {validator: this.unique, trigger: 'blur'}
          ],
          seatsFirst: [
            {validator: sixNum, trigger: 'blur'}
          ],
          seatsBussiness: [
            {validator: sixNum, trigger: 'blur'}
          ],
          seatsEconomy: [
            {validator: sixNum, trigger: 'blur'}
          ]
        }
      },
      // 查询条件每行个数
      colSize: 4,
      // 查询条件设置
      queryList: [
        {
          // 'p': '飞机号',
          key: 'aircraftNo',
          value: '',
          type: 'input',
          inputText: '飞机号',
          toUpper: true,
          span: 4
        }, {
          // 'p': '机型',
          key: 'aircraftIcao',
          value: '',
          type: 'input',
          inputText: '机型',
          toUpper: true,
          span: 4
          // value: '',
          // type: 'select',
          // filterable: true,
          // inputText: '机型',
          // getOptions: '/basicdata/aircraftType/queryAll',
          // optKey: 'aircraftIcao',
          // optLabel: 'aircraftIcao',
          // span: 4
        }, {
          // p: '航空公司',
          key: 'airlineName',
          value: '',
          type: 'input',
          inputText: '航空公司',
          span: 4
          // value: '',
          // type: 'select',
          // filterable: true,
          // inputText: '航空公司',
          // getOptions: '/basicdata/airline/queryAll',
          // optKey: 'airlineIata',
          // optLabel: 'briefC',
          // span: 4
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
        key: 'aircraftNo',
        multipleSelection: [],
        fields: [
          {prop: 'aircraftNo', label: '飞机号', fixed: true, hidden: false},
          {prop: 'aircraftIcao', label: '机型ICAO码', fixed: false, hidden: false},
          {prop: 'airlineName', label: '航空公司', fixed: false, hidden: false},
          {prop: 'airlineSubName', label: '航空分公司', fixed: false, hidden: false}/* ,
          {prop: 'seatsFirst', label: '头等舱座位数', fixed: false, hidden: false},
          {prop: 'seatsBussiness', label: '商务舱座位数', fixed: false, hidden: false},
          {prop: 'seatsEconomy', label: '经济舱座位数', fixed: false, hidden: false} */
        ]
      },
      importData: {
        visible: false,
        uploadUrl: 'aircraft',
        fileType: '.xls',
        fileUrl: '/dataImport/downloadExcel/aircraft'
      }
    }
  },
  methods: {
    changeNo (value, callback) {
      let mainAirline = {}
      if (value) {
        mainAirline.mainAirline = value
      } else {
        mainAirline = null
      }
      queryAll('/basicdata/airline/queryAll', mainAirline).then(response => {
        let airlineSub = {
          key: 'airlineSub',
          value: null
        }
        if (response.data.code == 0) {
          for (let i = 0; i < this.formData.formData.length; i++) {
            if (this.formData.formData[i].key == 'airlineSub') {
              this.$set(this.formData.formData[i], 'options', response.data.data)
              // if (response.data.data.length > 0) { // 默认回填首个
              //   airlineSub.value = response.data.data[0].airlineIata
              // }
              callback(airlineSub)
              return
            }
          }
        } else {
          callback(airlineSub)
          return null
        }
      })
    },
    downloadErrorExcel (data) {
      let titles = ['飞机号', '机型ICAO码', '航空公司', '航空分公司']
      let arrs = [_.map(data, 'aircraftNo'), _.map(data, 'aircraftIcao'), _.map(data, 'airlineName'), _.map(data, 'airlineSubName')]
      let widths = [125, 125, 125, 125]
      let newArrs = this.arrExcelFill(arrs)
      this.downloadError(titles, newArrs, widths)
    }
  }
}
</script>

<style scope>
</style>
