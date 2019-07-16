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
import {ndENReg, rdEReg, threeD} from '../../../util/rules.js'
import {queryAll, postData} from '../../../api/base.js'
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
      baseUrl: 'basicdata/airline',
      formData: {
        title: '新增',
        visible: false,
        inline: true,
        className: 'twiceCol',
        key: 'airlineIata',
        formData: [
          {key: 'airlineIata', label: 'IATA码', type: 'input', toUpper: true},
          {key: 'attr', label: '属性', type: 'tabs', tabsKey: 'attr'},
          {key: 'airlineIcao', label: 'ICAO码', type: 'input', toUpper: true},
          {key: 'briefC', label: '中文简称', type: 'input', maxlength: 20},
          {key: 'briefE', label: '英文简称', type: 'input', maxlength: 50},
          {key: 'nameC', label: '中文全称', type: 'input', maxlength: 50},
          {key: 'nameE', label: '英文全称', type: 'input', maxlength: 50},
          {key: 'mainAirline', label: '主航空公司', type: 'select', filterable: true, getOptions: 'basicdata/airline/queryAll', itemKey: 'airlineIata', itemLabel: 'briefC'},
          {key: 'sortkey', label: '排序码', type: 'input'},
          {key: 'remark', label: '备注', type: 'textarea', autosize: true, maxlength: 100}
        ],
        rules: {
          airlineIata: [
            {required: true, message: '必填项', trigger: 'blur'},
            {validator: ndENReg, trigger: 'blur'},
            {validator: this.unique, trigger: 'blur'}
          ],
          attr: [
            {required: true, message: '必填项', trigger: 'blur'}
          ],
          airlineIcao: [
            {required: true, message: '必填项', trigger: 'blur'},
            {validator: rdEReg, trigger: 'blur'},
            {validator: this.uniqueAirType, trigger: 'blur'}
          ],
          briefC: [
            {required: true, message: '必填项', trigger: 'blur'}
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
          key: 'airlineIata',
          value: '',
          type: 'input',
          inputText: 'IATA码/ICAO码',
          toUpper: true,
          span: 3
        }, {
          // 'p': '属性',
          key: 'attr',
          tabsKey: 'attr',
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
          span: 5
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
        key: 'airlineIata',
        multipleSelection: [],
        fields: [
          {prop: 'airlineIata', label: 'IATA码', fixed: true, hidden: false},
          {prop: 'airlineIcao', label: 'ICAO码', fixed: false, hidden: false},
          {prop: 'attr', label: '属性', fixed: false, hidden: false, optionKey: 'attr'},
          {prop: 'briefC', label: '中文简称', fixed: false, hidden: false},
          {prop: 'briefE', label: '英文简称', fixed: false, hidden: false},
          {prop: 'mainAirlineCn', label: '主航空公司', fixed: false, hidden: false} // todo
        ]
      },
      airlineIcao: '',
      importData: {
        visible: false,
        uploadUrl: 'airline',
        fileType: '.xls',
        fileUrl: '/dataImport/downloadExcel/airline'
      }
    }
  },
  methods: {
    // 编辑
    handleEdit (row) {
      this.airlineIcao = row.airlineIcao
      queryAll('basicdata/airline/queryAll', {}).then(response => {
        if (response.data.code == 0) {
          let options = response.data.data
          let optionsRemove = JSON.parse(JSON.stringify(options))
          let index = _.findIndex(optionsRemove, ['airlineIata', row.airlineIata])
          optionsRemove.splice(index, 1)
          // console.log(_.differenceWith(options, optionsRemove, _.isEqual))
          for (let i = 0; i < this.formData.formData.length; i++) {
            this.$set(this.formData.formData[i], 'value', row[this.formData.formData[i].key])
            if (this.formData.formData[i].key == 'mainAirline') {
              this.$set(this.formData.formData[i], 'options', optionsRemove)
            }
          }
          this.formData.title = '编辑'
          this.formData.visible = true
        } else {
          this.showError('获取主航空公司信息', '请重新尝试 !')
        }
      })
    },
    // 唯一性校验
    uniqueAirType (rule, value, callback) {
      if (value != '' && value != null) {
        setTimeout(() => {
          if (rule.field == 'airlineIcao' && value == this.airlineIcao) {
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
      let titles = ['IATA码', 'ICAO码', '属性', '中文简称', '英文简称', '主航空公司']
      let attrArr = this.retEnumName(_.map(data, 'attr'), 'attr')
      let arrs = [_.map(data, 'airlineIata'), _.map(data, 'airlineIcao'), attrArr, _.map(data, 'briefC'), _.map(data, 'briefE'), _.map(data, 'mainAirlineCn')]
      let widths = [83, 83, 83, 83, 83, 83]
      let newArrs = this.arrExcelFill(arrs)
      this.downloadError(titles, newArrs, widths)
    }
  },
  watch: {
    'formData.visible': {
      handler (data) {
        if (!data) {
          this.airlineIcao = ''
        }
      },
      immediate: true
    }
  }
}
</script>

<style scope>
</style>
