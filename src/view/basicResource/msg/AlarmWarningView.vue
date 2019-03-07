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
        <Tool-button-view :permissions="permissions" :selectionCount="tableData.multipleSelection.length" @handleDownload="handleDownload">
          <template slot="button-slot-scope">
            <div v-if="permissions.defaultAll" class="tool-div-button tool-bind" @click="handleDefault(null)"></div>
          </template>
        </Tool-button-view>
        <Pagination-view :pageData="pageData" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange"></Pagination-view>
      </div>
      <Table-view :permissions="permissions" :tableData="tableData" ref="basicTable" @handleDetail="handleDetail" @handleEdit="handleEdit">
        <template slot="button-slot-scope" slot-scope="scopeData">
          <div v-if="permissions.default" class="tool-div-button button-delete" @click="handleDefault(scopeData.data)"></div>
        </template>
      </Table-view>
    </el-main>
    <Edit-view :formData="formData" @handleAdd="saveAdd" @handleEdit="saveEdit"></Edit-view>
    <Warning-box-view :data="deleteData" @handleConfirm="handleDeleteConfirm"></Warning-box-view>
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
import baseMixin from '../../../components/mixin/baseMixin'
import {idReg, sevDotTwoDigit, sixDotSixDigit, degreePos} from '../../../util/rules.js'
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
  mixins: [basicTableMixin, pageTableMixin, baseMixin],
  data () {
    return {
      // 菜单对应按钮权限
      permissions: {
        add: false,
        update: false,
        delete: false,
        export: false,
        default: false,
        defaultAll: false
      },
      // 基础路径
      baseUrl: 'message/aomsOperationWarning',
      // 恢复默认
      defaultUrl: 'message/aomsOperationWarning/recoverDefaultWarning',
      formData: {
        title: '新增',
        visible: false,
        inline: true,
        className: 'twiceCol',
        formData: [
          {key: 'taskNo', label: '任务编号', type: 'input', isHidden: true},
          {key: 'taskCn', label: '任务', type: 'input', disabled: true},
          {key: 'operationNo', label: '任务操作编号', type: 'input', isHidden: true},
          {key: 'operationCn', label: '任务操作', type: 'input', disabled: true},
          {key: 'warning1', label: '预警阈值1', type: 'number', position: 'right', step: 1, change: this.changeNo1, max: 0},
          {key: 'warning2', label: '预警阈值2', type: 'number', position: 'right', step: 1, change: this.changeNo2, min: 0, max: 0},
          {key: 'warning3', label: '预警阈值3', type: 'number', position: 'right', step: 1, change: this.changeNo3, min: 0},
          {key: 'remark', label: '备注', type: 'textarea', autosize: true, maxlength: 100}
        ],
        rules: {
          warning1: [
            {required: true, message: '必填项', trigger: 'change'}
          ],
          warning2: [
            {required: true, message: '必填项', trigger: 'change'}
          ],
          warning3: [
            {required: true, message: '必填项', trigger: 'change'}
          ]
        }
      },
      // 查询条件每行个数
      colSize: 4,
      // 查询条件设置
      queryList: [
        {
          // 'p': '任务'
          key: 'taskNo',
          value: '',
          type: 'select',
          filterable: true,
          inputText: '任务',
          getOptions: '/message/aomsOperationWarning/queryWarningTask',
          optKey: 'taskNo',
          optLabel: 'taskCn',
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
        multipleSelection: [],
        fields: [
          {prop: 'taskCn', label: '任务', fixed: true, hidden: false},
          {prop: 'operationCn', label: '任务操作', fixed: false, hidden: false},
          {prop: 'warning1', label: '预警阈值1', fixed: false, hidden: false},
          {prop: 'warning2', label: '预警阈值2', fixed: false, hidden: false},
          {prop: 'warning3', label: '预警阈值3', fixed: false, hidden: false},
          {prop: 'remark', label: '备注', fixed: false, hidden: false}
        ]
      }
    }
  },
  methods: {
    // 编辑
    handleEdit (row) {
      for (let i = 0; i < this.formData.formData.length; i++) {
        switch (this.formData.formData[i].key) {
          case 'warning1': this.$set(this.formData.formData[i], 'max', row['warning2'] === 0 ? 0 : (row['warning2'] - 1))
          break
          case 'warning2': this.$set(this.formData.formData[i], 'min', row['warning1'] === 0 ? 0 : (row['warning1'] + 1))
          this.$set(this.formData.formData[i], 'max', row['warning3'] === 0 ? 0 : (row['warning3'] - 1))
          break
          case 'warning3': this.$set(this.formData.formData[i], 'min', row['warning2'] === 0 ? 0 : (row['warning2'] + 1))
          break
        }
        this.$set(this.formData.formData[i], 'value', row[this.formData.formData[i].key])
      }
      this.formData.title = '编辑'
      this.formData.visible = true
    },
    changeNo1 (value, callback) {
      // for (let i = 0; i < this.formData.formData.length; i++) {
      //   if (this.formData.formData[i].key == 'warning1') {
      //     if (value == undefined || value == null) {
      //       // 填了空值
      //       if (this.formData.formData[i].max >= 0) {
      //         // 填0
      //         let obj = {
      //           key: 'warning1',
      //           value: 0
      //         }
      //         callback(obj)
      //       } else {
      //         alert('请输入值')
      //         callback()
      //       }
      //     } else {
      //       // 判断是否合法
      //       if (value <= this.formData.formData[i].max) {
      //         // 合法
      //         // 设置2的最小值
      //         for (let i = 0; i < this.formData.formData.length; i++) {
      //           if (this.formData.formData[i].key == 'warning2') {
      //             console.log(this.formData.formData[i])
      //             this.$set(this.formData.formData[i], 'min', value + 1)
      //           }
      //         }
      //         callback()
      //       } else {
      //         // 不合法，消掉，直接提示
      //         let obj = {
      //           key: 'warning1',
      //           value: undefined
      //         }
      //         callback(obj)
      //       }
      //     }
      //     // if (value > this.formData.formData[i].max) {

      //     // }
      //     // this.$set(this.formData.formData[i], 'min', value + 1)
      //   }
      // }

      for (let i = 0; i < this.formData.formData.length; i++) {
        if (this.formData.formData[i].key == 'warning2') {
          console.log(this.formData.formData[i])
          this.$set(this.formData.formData[i], 'min', value == 0 ? 0 : value + 1)
        }
      }
      // 456 123
      // console.log(this.formData.formData[5])

      // if (value == null || value == undefined) { // || warning2 > 0
      //   let obj = {
      //     key: 'warning1',
      //     value: 0
      //   }
      //   callback(obj)
      // } else {
      //   callback()
      // }
      callback()
      return null
    },
    changeNo2 (value, callback) {
      for (let i = 0; i < this.formData.formData.length; i++) {
        if (this.formData.formData[i].key == 'warning1') {
          this.$set(this.formData.formData[i], 'max', value == 0 ? 0 : value - 1)
        } else if (this.formData.formData[i].key == 'warning3') {
          this.$set(this.formData.formData[i], 'min', value == 0 ? 0 : value + 1)
        }
      }
      callback()
      return null
    },
    changeNo3 (value, callback) {
      for (let i = 0; i < this.formData.formData.length; i++) {
        if (this.formData.formData[i].key == 'warning2') {
          this.$set(this.formData.formData[i], 'max', value == 0 ? 0 : value - 1)
        }
      }
      callback()
      return null
    },
    handleDefault (row) {
      var data = []
      if (row) {
        let {taskNo, operationNo, ...rest} = row
        data.push({taskNo, operationNo})
      } else {
        data = this.tableData.data
      }
      postData(this.defaultUrl, data).then(res => {
        if (res.data.code == 0) {
          this.showSuccess(`${row ? '' : '一键'}恢复默认`)
          this.queryDataReq()
        } else {
          this.showError(`${row ? '' : '一键'}恢复默认`, '请联系管理员 !')
        }
      })
    }
  }
}
</script>

<style scope>
</style>
