<template>
  <el-table ref="baseTable" v-loading="tableData.loading" :data="tableData.data" :height="tableData.height" :row-key="tableData.key" :border="tableData.border"
  :header-row-class-name="tableData.headerRowClass" :header-cell-class-name="tableData.headerCellClass" :stripe="tableData.stripe"
  :highlight-current-row="tableData.highlight" @current-change="handleCurrentChange" :row-class-name="tableData.rowClassName"
  :header-cell-style="{'text-align': 'center'}" @row-contextmenu="rowContextmenu" @selection-change="handleSelectionChange">
  <!-- :show-summary="tableData.sum?tableData.sum.showSummary:null" :sum-text="tableData.sum?tableData.sum.sumText:'合计'" :summary-method="tableData.sum?tableData.sum.sumMth:null" -->
    <div v-for="(field, idx) in tableData.fields" :key="idx">
      <el-table-column v-if="!field.hidden&&!field.optionKey&&!field.type" :prop='field.prop' :column-key="field.prop" :key="idx+2"
      :label='field.label' :width="field.width" :show-overflow-tooltip="field.overflow" :fixed="field.fixed" :reserve-selection="field.selection"
      :sortable="field.sortable" :formatter="field.formatter">
      </el-table-column>
      <el-table-column v-else-if="!field.hidden&&field.optionKey&&!field.type" :prop='field.prop' :column-key="field.prop" :key="idx+2"
      :label='field.label' :width="field.width" :show-overflow-tooltip="field.overflow" :fixed="field.fixed" :reserve-selection="field.selection"
      :sortable="field.sortable" :formatter="field.formatter">
        <template slot-scope="scope">
          {{ formatterOption(field, scope.row) }}
        </template>
      </el-table-column>
      <el-table-column v-else-if="!field.hidden&&(field.type=='multFields')" :label="field.label" :key="idx+2">
        <el-table-column v-for="fld in field.fields" v-if="!fld.hidden&&!fld.optionKey&&!fld.type" :key="fld.index" :prop='fld.prop' :column-key="fld.prop"
        :label='fld.label' :width="fld.width" :show-overflow-tooltip="fld.overflow" :fixed="fld.fixed" :reserve-selection="fld.selection"
        :sortable="fld.sortable">
          <template slot-scope="scope">
            <!-- <slot name="mult-fields-slot-scope" :fld="fld" :field="field" :row="scope.row"></slot> -->
            {{ showMultColumn(fld, field, scope.row) }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column v-else-if="!field.hidden&&(field.type == 'slotScope')" :prop='field.prop' :column-key="field.prop" :key="idx+2"
      :label='field.label' :width="field.width" :show-overflow-tooltip="field.overflow" :fixed="field.fixed" :reserve-selection="field.selection"
      :formatter="field.formatter">
        <template slot-scope="scope">
          <slot name="slot-scope" :row="scope.row" :field="field"></slot>
        </template>
      </el-table-column>
      <el-table-column v-else-if="!field.hidden&&!field.optionKey&&(field.type=='file'||field.type=='img')" :prop='field.prop' :column-key="field.prop"
      :label='field.label' :width="field.width" :show-overflow-tooltip="field.overflow" :fixed="field.fixed" :reserve-selection="field.selection" :key="idx+2"
      :sortable="field.sortable" :formatter="field.formatter">
        <template slot-scope="scope">
          <div v-if="field.type == 'img'" class="img-div"><img class="table-row-img" :src="dfsUrl + scope.row[field.prop]"/></div>
          <!-- <i class="el-icon-download" @click="handleDownloadFile(scope.row, field)"></i> -->
          <a v-else class="a-download" :href="dfsUrl + scope.row[field.prop]" :download="scope.row[field.name]"><i class="el-icon-download"></i></a>
        </template>
      </el-table-column>
      <el-table-column v-if="tableData.type&&idx==0" :type="tableData.type" width="50" :fixed="'left'" :key="1"></el-table-column>
    </div>
    <el-table-column v-if="tableData.isOperat ? false : true" :fixed="'right'" :label='"操作"' :width="tableData.oprWidth ? tableData.oprWidth : 190" :key="tableData.fields.length + 2"
    class-name="table-opt-col">
      <template slot-scope="scope">
        <div class="tool-div-button button-detail" title="详情" @click="handleDetail(scope.row)"></div>
        <div v-if="permissions.update" class="tool-div-button button-edit" title="编辑" @click="handleEdit(scope.row)"></div>
        <div v-if="permissions.delete" class="tool-div-button button-delete" title="删除" @click="handleDelete(scope.row)"></div>
        <slot name="button-slot-scope" :data="scope.row"></slot>
      </template>
    </el-table-column>
    <slot name="table-opt-right"></slot>
  </el-table>
</template>

<script>
import {downloadFile} from '../../api/base.js'
import _ from 'lodash'
export default {
  props: ['permissions', 'tableData'],
  data () {
    return {
      // key: optionKey; value: []//options
      options: {},
      dfsUrl: ''
    }
  },
  mounted () {
    this.tableData.fields.forEach(field => {
      if (field.type && (field.type != 'slotScope')) {
        this.$store.commit('setConfigValue', 'dfsUrl')
        this.dfsUrl = this.$store.getters.getConfigValue
      }
    })
  },
  methods: {
    handleCurrentChange (currentRow, oldCurrentRow) {
      this.$emit('change', {
        currentRow: currentRow,
        oldCurrentRow: oldCurrentRow
      })
    },
    formatter (row, column) {
      this.$emit('formatter', {
        row: row,
        column: column
      })
    },
    rowContextmenu (row, event) {
      this.$emit('rowContextmenu', {
        row: row,
        event: event
      })
    },
    // 跳转编辑页面
    handleEdit (row) {
      this.$emit('handleEdit', row)
    },
    // 跳转详情页面
    handleDetail (row) {
      this.$emit('handleDetail', row)
    },
    // 跳转删除页面
    handleDelete (row) {
      this.$emit('handleDelete', row)
    },
    showMultColumn (fld, field, row) {
      let value = ''
      if (field.hasOwnProperty('method')) {
        let obj = {
          fld: fld,
          field: field,
          row: row
        }
        field.method(obj, par => {
          /* let value = ''
          if (row[field.prop][field.index]) {
            if (fld.hasOwnProperty('formatter')) {
              fld.formatter(row[field.prop][field.index][fld.prop], param => {
                value = param
              })
            } else {
              value = row[field.prop][field.index][fld.prop]
            }
          } else {
            value = ''
          } */
          value = par
        })
      }
      return value
    },
    /* showMultColumn (fld, field, row) {
      let value = ''
      if (row[field.prop][field.index]) {
        if (fld.hasOwnProperty('formatter')) {
          fld.formatter(row[field.prop][field.index][fld.prop], param => {
            value = param
          })
        } else {
          value = row[field.prop][field.index][fld.prop]
        }
      } else {
        value = ''
      }
      return value
    }, */
    // 格式化 enum 成员
    formatterOption (field, row) {
      if (field.optionKey) {
        if (this.options.hasOwnProperty(field.optionKey)) {
          var temp = this.options[field.optionKey]
        } else {
          if (field.hasOwnProperty('options') && !_.isEmpty(field.options)) {
            temp = field.options
          } else {
            this.$store.commit('setOption', field.optionKey)
            temp = this.$store.getters.getOption
            this.$set(this.options, field.optionKey, temp)
          }
        }
        for (let i = 0; i < temp.length; i++) {
          if (temp[i].key == row[field.prop]) {
            return temp[i].value
          }
        }
      }
      return row[field.prop]
    },
    handleSelectionChange (row) {
      this.tableData.multipleSelection = row
    },
    handleDownloadFile (row, field) {
      var url = this.dfsUrl + row[field.prop]
      downloadFile(url, {}, 0).then(response => {
        this.downFile(response, row[field.name])
      })
    },
    // Blob文件转换下载
    downFile (result, fileName, fileType) {
      var data = result.data
      let type
      if (fileType) {
        type = fileType
      } else {
        type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
      var blob = new Blob([data], { type: type })
      var objectUrl = URL.createObjectURL(blob)
      var a = document.createElement('a')
      a.setAttribute('style', 'display:none')
      a.setAttribute('href', objectUrl)
      a.setAttribute('download', fileName)
      a.click()
      URL.revokeObjectURL(objectUrl)
    }
  }
}
</script>

<style>
.el-table {
  text-align: center;
}
.el-checkbox__input {
  border-radius: 50% !important;
}
.a-download {
  color: #fff;
  cursor: pointer;
}
.el-table__body-wrapper,
.el-table__fixed-body-wrapper {
  border-radius: 0 0 10px 10px;
}
/* .el-table__fixed-body-wrapper {
  top: 40px !important;
} */
.el-table__fixed-header-wrapper th,
.el-table__header-wrapper th {
  padding: 0;
  height: 40px;
}
.el-table__fixed-body-wrapper td,
.el-table__body-wrapper td {
  padding: 0;
  height: 50px;
  line-height: 50px;
}
.el-table--striped .el-table__body tr.el-table__row--striped td {
  background: none;
}
/* .el-table__fixed-body-wrapper .hover-row td,
.el-table__body-wrapper .hover-row td,
.el-table__fixed-body-wrapper .current-row td,
.el-table__body-wrapper .current-row td {
  background: none !important;
} */
.el-table__fixed-body-wrapper .hover-row,
.el-table__fixed-body-wrapper .current-row, {
  box-shadow: none;
}
.el-table__fixed-body-wrapper .hover-row th,
.el-table__fixed-body-wrapper .hover-row td,
.el-table__fixed-body-wrapper .current-row th,
.el-table__fixed-body-wrapper .current-row td {
  background: #215870 !important;
}
.el-table__body-wrapper .hover-row th,
.el-table__body-wrapper .hover-row td,
.el-table__body-wrapper .current-row th,
.el-table__body-wrapper .current-row td {
  background: #215870 !important;/* rgba(60,166,200,0.4) !important; */
}
.table-opt-col>div {
  display: flex;
  justify-content: center;
}
.img-div {
  display: flex;
  justify-content: center;
  align-self: center;
}
.table-row-img {
  max-height: 50px;
}
</style>
