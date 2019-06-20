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
import {idReg, idNumReg, threeD, mustD} from '../../../util/rules.js'
import { postData } from '@/api/base'
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
      baseUrl: 'basicdata/aircraftType',
      formData: {
        title: '新增',
        visible: false,
        inline: true,
        className: 'twiceCol',
        key: 'aircraftTypeId',
        // clearRulesKey: ['aircraftIata'], // 编辑页面清除规则
        formData: [
          {key: 'aircraftTypeId', label: 'id', type: 'input', isHidden: true},
          {key: 'aircraftIcao', label: 'ICAO码', type: 'input', toUpper: true, maxlength: 10},
          {key: 'aircraftIata', label: 'IATA码', type: 'input', toUpper: true, maxlength: 10},
          {key: 'reserved2', label: '最小过站时长/分', type: 'input', change: this.changeNo},
          {key: 'briefC', label: '中文简称', type: 'input', maxlength: 20},
          {key: 'nameC', label: '中文全称', type: 'input', maxlength: 50},
          {key: 'briefE', label: '英文简称', type: 'input', maxlength: 50},
          {key: 'nameE', label: '英文全称', type: 'input', maxlength: 50},
          {key: 'aircraftClassify', label: '机型分类', type: 'tabs', tabsKey: 'aircraftClassify'},
          {key: 'reserved1', label: '是否靠桥', type: 'tabs', tabsKey: 'isYOrN'},
          {key: 'sortkey', label: '排序码', type: 'input'},
          {key: 'remark', label: '备注', type: 'textarea', autosize: true, maxlength: 100}
        ],
        rules: {
          aircraftIata: [
            {required: true, message: '必填项', trigger: 'blur'},
            {validator: idReg, trigger: 'blur'},
            {validator: this.uniqueAirType, trigger: 'blur'}
          ],
          aircraftIcao: [
            {required: true, message: '必填项', trigger: 'blur'},
            {validator: idReg, trigger: 'blur'},
            {validator: this.uniqueAirType, trigger: 'blur'}
          ],
          reserved2: [
            {validator: mustD, trigger: 'blur'}
          ],
          sortkey: [
            {validator: threeD, trigger: 'blur'}
          ]
        }
      },
      // 查询条件每行个数
      colSize: 4,
      // 查询条件设置
      queryList: [
        {
          // 'p': 'IATA码/ICAO码',
          key: 'aircraftIata',
          value: '',
          type: 'input',
          inputText: 'IATA码/ICAO码',
          toUpper: true,
          span: 3
        }, {
          // 'p': '机型分类',
          key: 'aircraftClassify',
          tabsKey: 'aircraftClassify',
          value: null,
          type: 'tabs',
          size: 'medium',
          inputText: '',
          options: [{
            key: null,
            value: '全部'
          }],
          'valueChange': 'attrChange',
          'span': 4
        }, {
          // 'p': '名称描述',
          key: 'briefC',
          value: '',
          type: 'input',
          inputText: '名称描述',
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
        key: 'aircraftTypeId',
        multipleSelection: [],
        fields: [
          {prop: 'aircraftTypeId', label: 'id', fixed: true, hidden: true},
          {prop: 'aircraftIcao', label: 'ICAO码', fixed: false, hidden: false},
          {prop: 'aircraftIata', label: 'IATA码', fixed: false, hidden: false},
          {prop: 'reserved2', label: '最小过站时长/分', fixed: false, hidden: false},
          {prop: 'aircraftClassify', label: '机型分类', fixed: false, hidden: false, optionKey: 'aircraftClassify'},
          {prop: 'reserved1', label: '是否靠桥', fixed: false, hidden: false, optionKey: 'isYOrN'},
          {prop: 'briefC', label: '中文简称', fixed: false, hidden: false},
          {prop: 'briefE', label: '英文简称', fixed: false, hidden: false}
        ]
      },
      airTypeData: {
        aircraftIcao: '',
        aircraftIata: ''
      },
      importData: {
        visible: false,
        uploadUrl: 'aircraftType',
        fileType: '.xls',
        fileUrl: '/dataImport/downloadExcel/aircraftType'
      }
    }
  },
  methods: {
    changeNo (value, callback) {
      let reserved2 = {
        key: 'reserved2',
        value: null
      }
      value = parseInt(value)
      if (value) {
        if (value % 5 == 1 || value % 5 == 2) {
          reserved2.value = value - value % 5
        } else if (value % 5 == 3 || value % 5 == 4) {
          reserved2.value = value + 5 - value % 5
        } else if (value % 5 == 0) {
          reserved2.value = value
        }
      }
      callback(reserved2)
    },
    customSaveBefore (data) {
      if (data.reserved2 == null) {
        data.reserved2 = 0
      }
      return data
    },
    handleEdit (row) {
      for (let i = 0; i < this.formData.formData.length; i++) {
        if (this.formData.formData[i].key == 'reserved2') {
          if (row.reserved2 == null || row.reserved2 == '') {
            this.$set(this.formData.formData[i], 'value', 0)
          } else {
            this.$set(this.formData.formData[i], 'value', row[this.formData.formData[i].key])
          }
        } else {
          this.$set(this.formData.formData[i], 'value', row[this.formData.formData[i].key])
        }
      }
      this.airTypeData.aircraftIcao = row.aircraftIcao
      this.airTypeData.aircraftIata = row.aircraftIata
      this.formData.title = '编辑'
      this.formData.visible = true
    },
    // 唯一性校验
    uniqueAirType (rule, value, callback) {
      if (value != '' && value != null) {
        setTimeout(() => {
          if (rule.field == 'aircraftIcao' && value == this.airTypeData.aircraftIcao) {
            callback()
          } else if (rule.field == 'aircraftIata' && value == this.airTypeData.aircraftIata) {
            callback()
          } else {
            let key = rule.field
            let data = {}
            this.$set(data, rule.field, value)
            postData(this.baseUrl + '/checkExist', data).then(response => {
              if (response.data.code == 0 && response.data.data.hasOwnProperty('exist')) {
                if (response.data.data.exist > 0) {
                  callback(new Error('当前编号已存在'))
                } else {
                  callback()
                }
              } else {
                callback(new Error('请求失败'))
              }
            })
          }
        }, 200)
      } else {
        callback()
      }
    },
    downloadErrorExcel (data) {
      let titles = ['ICAO码', 'IATA码', '最小过站时长/分', '机型分类', '是否靠桥', '中文简称', '英文简称']
      let arrs = [_.map(data, 'aircraftIcao'), _.map(data, 'aircraftIata'), _.map(data, 'reserved2'), _.map(data, 'aircraftClassify'), _.map(data, 'reserved1'), _.map(data, 'briefC'), _.map(data, 'briefE')]
      let widths = [70, 87, 104, 87, 87, 87, 87]
      this.downloadError(titles, arrs, widths, null, 'l')
    }
  },
  watch: {
    'formData.visible': {
      handler (data) {
        if (!data) {
          this.airTypeData.aircraftIcao = ''
          this.airTypeData.aircraftIata = ''
        }
      },
      immediate: true
    }
  }
}
</script>

<style scope>
</style>
