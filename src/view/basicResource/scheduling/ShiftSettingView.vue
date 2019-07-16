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
        <Tool-button-view
          :permissions="permissions"
          :selectionCount="tableData.multipleSelection.length"
          @handleImport="handleImport"
          @handleDownload="handleDownload"
          @handleAdd="handleAdd"
          @handleDelete="handleDelete"
        ></Tool-button-view>
        <Pagination-view
          :pageData="pageData"
          @sizeChange="handleSizeChange"
          @currentChange="handleCurrentChange"
        ></Pagination-view>
      </div>
      <Table-view
        :permissions="permissions"
        :tableData="tableData"
        ref="basicTable"
        @handleDetail="handleDetail"
        @handleEdit="handleEdit"
        @handleDelete="handleDelete"
      ></Table-view>
    </el-main>
    <Edit-view :formData="formData" @handleAdd="saveAdd" @handleEdit="saveEdit">
      <template slot="slot-scope" slot-scope="scopeData">
        <el-input v-model="scopeData.data[scopeData.item.key]" prefix-icon="el-icon-time"
        :step="300" :readonly="true"
        @focus="focusInput(scopeData.item)"></el-input><!--  @blur="blurInput(scopeData.item, $event)" -->
        <div v-show="scopeData.item.show"
          class="el-time-panel el-popper el-custom-time-panel"
          style="position: absolute; z-index: 2015;"
          x-placement="bottom-start"
        >
          <div class="el-time-panel__content">
            <div class="el-time-spinner">
              <div class="el-time-spinner__wrapper el-scrollbar">
                <div
                  class="el-scrollbar__wrap"
                  style="max-height: inherit; margin-top: 8px; margin-bottom: -8px;"
                >
                  <ul class="el-scrollbar__view el-time-spinner__list">
                    <li v-for="(a, i) in 24" :key="i"
                    :class="['el-time-spinner__item', scopeData.data[scopeData.item.key] && (scopeData.data[scopeData.item.key].substr(0, 2) == ((i >= 10) ? i : ('0' + i))) ? 'active' : '']"
                    @click="clickHH(scopeData, (i >= 10) ? i : ('0' + i), $event)"
                  >{{ (i >= 10) ? i : ('0' + i) }}</li>
                  </ul>
                </div>
              </div>
              <div class="el-time-spinner__wrapper el-scrollbar">
                <div
                  class="el-scrollbar__wrap"
                  style="max-height: inherit; margin-top: 8px; margin-bottom: -8px;"
                >
                  <ul class="el-scrollbar__view el-time-spinner__list">
                    <li v-for="(a, i) in 12" :key="i"
                    :class="['el-time-spinner__item', scopeData.data[scopeData.item.key] && (scopeData.data[scopeData.item.key].substr(3, 2) == ((5*i >= 10) ? 5*i : ('0' + 5*i))) ? 'active' : '']"
                    @click="clickMM(scopeData, (5*i >= 10) ? 5*i : ('0' + 5*i), $event)"
                  >{{ (5*i >= 10) ? 5*i : ('0' + 5*i) }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="el-time-panel__footer">
            <button type="button" :disabled="scopeData.item.key == 'beginTime'" @click="clickYH(scopeData)" :class="['el-time-panel__btn confirm', (scopeData.item.key == 'beginTime')?'is-disabled':'']">夜航</button>
            <button type="button" @click="blurInput(scopeData.item)" class="el-time-panel__btn cancel">关闭</button>
          </div>
          <div x-arrow class="popper__arrow" style="left: 35px;"></div>
        </div>
      </template>
    </Edit-view>
    <Warning-box-view
      :data="deleteData"
      @handleConfirm="handleDeleteConfirm"
      @handleClose="handleDeleteClose"
    ></Warning-box-view>
    <import-dialog
      :data="importData"
      @downloadErrorExcel="downloadErrorExcel"
      @handleRefresh="handleRefresh"
    ></import-dialog>
  </el-container>
</template>

<script>
import QueryView from '@/components/common/QueryView'
import PaginationView from '@/components/common/PaginationView'
import TableView from '@/components/common/BaseTableView'
import ToolButtonView from '@/components/common/ToolButtonView'
import EditView from '@/components/common/EditView'
import basicTableMixin from '@/components/mixin/basicTableMixin'
import pageTableMixin from '@/components/mixin/pageTableMixin'
import { idReg, sixNum } from '@/util/rules.js'
import { queryAll, postData } from '@/api/base.js'
import _ from 'lodash'

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
      baseUrl: '/schedplan/scheduleShift',
      formData: {
        title: '新增',
        visible: false,
        inline: true,
        className: 'twiceCol',
        key: 'shiftId',
        formData: [
          { key: 'shiftId', label: '班次名称', isHidden: true },
          { key: 'shiftName', label: '班次名称', type: 'input', maxlength: 10, class: 'auto-margin' },
          // { key: 'timeRange1', key1: 'startTime', key2: 'endTime', unlinkPanels: true, label: '班次时段', label1: '开始时间', label2: '结束时间', type: 'datetimerange', required: 3, dateType: 'datetimerange', format: 'HH:mm', valueFormat: 'HH:mm', class: 'auto-width' },
          { key: 'beginTime', label: '班次时段', type: 'slot', valueType: 'string', show: false },
          { key: 'endTime', label: ' ', type: 'slot', valueType: 'string', show: false }
        ],
        rules: {
          shiftName: [
            { required: true, message: '必填项', trigger: 'blur' },
            { validator: this.unique, trigger: 'blur' }
          ],
          beginTime: [
            { required: true, message: '必填项', trigger: 'change' }
          ],
          endTime: [
            { required: true, message: '必填项', trigger: 'change' }
          ]
        }
      },
      // 查询条件每行个数
      colSize: 4,
      // 查询条件设置
      queryList: [
        {
          key: 'shiftName',
          value: '',
          type: 'input',
          inputText: '班次名称',
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
        key: 'shiftId',
        multipleSelection: [],
        fields: [
          { prop: 'shiftName', label: '班次名称', fixed: true, hidden: false },
          { prop: 'detpName', label: '部门', fixed: false, hidden: false },
          { prop: '', label: '班次时段', fixed: false, hidden: false, formatter: this.formatterTime }
        ]
      },
      importData: {
        visible: false,
        uploadUrl: '',
        fileType: '.xls',
        fileUrl: ''
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
    downloadErrorExcel () {},
    focusInput (item) {
      this.formData.formData.forEach(item => {
        if (item.hasOwnProperty('show')) {
          item.show = true
        }
      })
      document.addEventListener('click', this.clickOther)
    },
    clickOther (event) {
      if (!['UL', 'LI', 'INPUT'].includes(event.target.tagName) && !['el-time-panel__footer', 'el-time-panel__btn confirm'].includes(event.target.className)) {
        this.blurInput()
      }
    },
    blurInput (item, event) {
      if (item) {
        item.show = false
      } else {
        this.formData.formData.forEach(item => {
          if (item.hasOwnProperty('show')) {
            item.show = false
          }
        })
        document.removeEventListener('click', this.clickOther)
      }
    },
    clickHH (scopeData, val, event) {
      let arr = scopeData.data[scopeData.item.key].split(':')
      if (arr.length > 1) {
        arr[0] = val
      } else {
        arr[0] = val
        arr.push('00')
      }
      scopeData.data[scopeData.item.key] = arr.join(':')
      event.target.scrollIntoView({behavior: 'auto', block: 'center'})
    },
    clickMM (scopeData, val, event) {
      let arr = scopeData.data[scopeData.item.key].split(':')
      if (arr.length > 1) {
        arr[1] = val
      } else {
        arr[0] = '00'
        arr.push(val)
      }
      scopeData.data[scopeData.item.key] = arr.join(':')
      event.target.scrollIntoView({behavior: 'instant', block: 'center'})
    },
    clickYH (scopeData) {
      scopeData.data[scopeData.item.key] = '夜航结束'
    },
    // 唯一性校验
    unique (rule, value, callback) {
      if (value != '' && value != null && value !== this.formData.formData[1].value) {
        setTimeout(() => {
          let key = rule.field
          let data = {}
          this.$set(data, rule.field, value)
          postData(this.baseUrl + '/checkExist', data).then(response => {
            if (response.data.code == 0 && response.data.data.hasOwnProperty('exist')) {
              if (response.data.data.exist > 0) {
                callback(new Error('当前班次名称已存在'))
              } else {
                callback()
              }
            } else {
              callback(new Error('请求失败'))
            }
          })
        }, 200)
      } else {
        callback()
      }
    },
    // 格式化 HH:MM:SS
    formatterTime (row, column) {
      if (row['beginTime'] && row['endTime']) {
        return (row['beginTime'] + '~' + row['endTime'])
      } else if (row['beginTime']) {
        return row['beginTime']
      } else if (row['endTime']) {
        return row['endTime']
      } else {
        return ''
      }
    }
  }
}
</script>

<style>
.el-custom-time-panel  .el-scrollbar__wrap {
  padding-bottom: 0 !important;
}
</style>
