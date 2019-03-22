<template>
  <div class="whole-table-class">
    <div class="div-left-table">
      <div class="div-left-table_header" :style="leftTableStyle">
        <table cellpadding="0" cellspacing="0" class="left-table_header">
          <thead>
            <tr v-for="num in tableData.headerNum" :key="num">
              <th v-if="tableData.type=='selection'&&num==1" :width="50" :style="tableData.headerStyle"
              :rowspan="tableData.headerNum?tableData.headerNum:1">
                <div :class="(tableData.multipleSelection.length == tableData.data.length && tableData.data.length > 0) ? 'radio-button el-checkbox__input is-checked' : 'radio-button el-checkbox__input'" @click="autoSelectClick(item)">
                  <div class="el-checkbox__inner"></div>
                </div>
              </th>
              <div v-for="(field, index) in tableData.leftFields" :key="index" :style="`width': ${num==1?field.width+'px':''}; height: 40px; float: left; line-height: 40px;`">
                <th v-if="!field.hidden&&num==1" :width="field.width"
                :colspan="field.colspan?field.colspan:1" :rowspan="field.rowspan?field.rowspan:1">{{field.label}}</th>
                <th v-else-if="!field.hidden&&field.hasOwnProperty('fields')" v-for="(item, x) in field.fields" :key="x" :width="item.width">{{item.label}}</th>
              </div>
            </tr>
          </thead>
        </table>
      </div>
      <div class="div-left-table_body" @mousewheel="scrollEvent" :style="leftTableStyle">
        <table cellpadding="0" cellspacing="0" class="left-table_body" ref="wholeTable">
          <tbody>
            <tr v-for="(item, index) in tableData.data" :key="index" :class="[(index%2==0)?'single-row':'', selectIndex==index?'select-row':'']"
            @click="clickRow(index)" @dblclick="tableData.hasOwnProperty('dblClick')&&dblRowClick(index, tableData.dblClick)"><!--  :class="[tableData.tableRowClassName({'row': item, 'rowIndex': index}), tableClickRowClass[index]?'is-active':'']" -->
              <td v-if="tableData.type=='selection'" :width="50" style="padding-top: 15px; margin-bottom: -15px;">
                <div :class="~require('lodash').findIndex(tableData.multipleSelection, [tableData.key, item[tableData.key]]) ? 'radio-button el-checkbox__input is-checked' : 'radio-button el-checkbox__input'" @click.stop="itemSelectClick(item)">
                  <div class="el-checkbox__inner"></div>
                </div>
              </td>
              <div v-for="(field, x) in tableData.leftFields" :key="x" :style="`width': ${field.width+'px'}; height: 50px; float: left; line-height: 50px;`">
                <td v-if="!field.hidden" :width="field.width" :class="field.class" @dblclick="field.hasOwnProperty('dblClick')&&dblClick(index, field)">
                  <div v-if="field.hasOwnProperty('optionKey')">
                    <el-tooltip v-if="field.hasOwnProperty('overflow')&&field.overflow" :content="formatterOption(field, item)" placement="top-start">
                      <div class="td-div" :style="`width: ${field.width}px;`">{{ formatterOption(field, item) }}</div>
                    </el-tooltip>
                    <div v-else class="td-div" :style="`width: ${field.width}px;`">{{ formatterOption(field, item) }}</div>
                  </div>
                  <div v-else-if="field.hasOwnProperty('edit') && tableData.editData.index == index" :style="`width: ${field.width}px;`">
                    <slot name="slot-edit-div" :item="item" :field="field"></slot>
                  </div>
                  <div v-else-if="field.hasOwnProperty('format')">
                    <el-tooltip v-if="field.hasOwnProperty('overflow')&&field.overflow" :content="formatterField(field, item)" placement="top-start">
                      <div class="td-div" :style="`width: ${field.width}px;`">{{ formatterField(field, item) }}</div>
                    </el-tooltip>
                    <div v-else class="td-div" :style="`width: ${field.width}px;`">{{ formatterField(field, item) }}</div>
                  </div>
                  <div v-else>
                    <el-tooltip v-if="field.hasOwnProperty('overflow')&&field.overflow" :content="item[field.prop]" placement="top-start">
                      <div class="td-div" :style="`width: ${field.width}px;`">
                        {{ item[field.prop] }}
                      </div>
                    </el-tooltip>
                    <div v-else class="td-div" :style="`width: ${field.width}px;`">{{ item[field.prop] }}</div>
                  </div>
                </td>
              </div>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="div-center-table" :style="rightTableStyle">
      <div class="div-right-table_header">
        <div class="div-right-table_header-div">
          <table cellpadding="0" cellspacing="0" class="right-table_header" :style="rightTableBodyStyle">
            <thead>
              <tr v-for="num in tableData.headerNum" :key="num">
                <div v-for="(field, index) in tableData.centerFields" :key="index" :style="`width': ${num==1?field.width+'px':''}; height: 40px; float: left; line-height: 40px;`">
                  <th v-if="!field.hidden&&num==1" :width="field.width"
                  :colspan="field.colspan?field.colspan:1" :rowspan="field.rowspan?field.rowspan:1">{{field.label}}</th>
                  <th v-else-if="!field.hidden&&field.hasOwnProperty('fields')" v-for="(item, x) in field.fields" :key="x" :width="item.width">{{item.label}}</th>
                </div>
              </tr>
            </thead>
          </table>
        </div>
      </div>
      <div class="div-right-table_body" @mousewheel="scrollEvent" :style="rightTableHeightStyle">
        <table cellpadding="0" cellspacing="0" class="right-table_body" :style="rightTableBodyStyle">
          <tbody>
            <tr v-for="(item, index) in tableData.data" :key="index" :class="[(index%2==0)?'single-row':'', selectIndex==index?'select-row':'']"
            @click="clickRow(index)" @dblclick="tableData.hasOwnProperty('dblClick')&&dblRowClick(index, tableData.dblClick)"><!--  :class="[tableRowClassName({'row': item, 'rowIndex': index}), tableClickRowClass[index]?'is-active':'']" -->
              <div v-for="(field, x) in tableData.centerFields" :key="x" class="body-tr-div" :style="`width': ${field.width+'px'}; height: 50px; float: left; line-height: 50px;`">
                <div v-if="!field.hidden&&field.hasOwnProperty('fields')">
                  <td v-for="(obj, x) in field.fields" :key="x" :width="obj.width" :class="obj.class">
                    <div v-if="obj.hasOwnProperty('optionKey')">
                      <el-tooltip v-if="obj.hasOwnProperty('overflow')&&obj.overflow" :content="formatterOption(obj, field.hasOwnProperty('index') ? ((item[field.prop] && item[field.prop][field.index]) ? item[field.prop][field.index] : item[field.prop]) : item)" placement="top-start">
                        <div class="td-div" :style="`width: ${obj.width}px;`">{{ formatterOption(obj, field.hasOwnProperty('index') ? ((item[field.prop] && item[field.prop][field.index]) ? item[field.prop][field.index] : item[field.prop]) : item) }}</div>
                      </el-tooltip>
                      <div v-else class="td-div" :style="`width: ${obj.width}px;`">{{ formatterOption(obj, field.hasOwnProperty('index') ? ((item[field.prop] && item[field.prop][field.index]) ? item[field.prop][field.index] : item[field.prop]) : item) }}</div>
                    </div>
                    <div v-else-if="obj.hasOwnProperty('edit')" :style="`width: ${obj.width}px;`">
                      <slot name="slot-edit-div"></slot>
                    </div>
                    <div v-else-if="obj.hasOwnProperty('format')">
                      <el-tooltip v-if="obj.hasOwnProperty('overflow')&&obj.overflow" :content="formatterField(obj, (field.hasOwnProperty('index') ? ((item[field.prop] && item[field.prop][field.index]) ? item[field.prop][field.index] : item[field.prop]) : item))" placement="top-start">
                        <div class="td-div" :style="`width: ${obj.width}px;`">{{ formatterField(obj, (field.hasOwnProperty('index') ? ((item[field.prop] && item[field.prop][field.index]) ? item[field.prop][field.index] : item[field.prop]) : item)) }}</div>
                      </el-tooltip>
                      <div v-else class="td-div" :style="`width: ${obj.width}px;`">{{ formatterField(obj, (field.hasOwnProperty('index') ? ((item[field.prop] && item[field.prop][field.index]) ? item[field.prop][field.index] : item[field.prop]) : item)) }}</div>
                    </div>
                    <div v-else>
                      <el-tooltip v-if="obj.hasOwnProperty('overflow')&&obj.overflow" :content="field.hasOwnProperty('index') ? ((item[field.prop] && item[field.prop][field.index]) ? item[field.prop][field.index][obj.prop] : '') : item[obj.prop]" placement="top-start">
                        <div class="td-div" :style="`width: ${obj.width}px;`">{{ field.hasOwnProperty('index') ? ((item[field.prop] && item[field.prop][field.index]) ? item[field.prop][field.index][obj.prop] : '') : item[obj.prop] }}</div>
                      </el-tooltip>
                      <div v-else class="td-div" :style="`width: ${obj.width}px;`">{{ field.hasOwnProperty('index') ? ((item[field.prop] && item[field.prop][field.index]) ? item[field.prop][field.index][obj.prop] : '') : item[obj.prop] }}</div>
                    </div>
                  </td>
                </div>
                <td v-else-if="!field.hidden" :width="field.width" :class="field.class">
                  <div v-if="field.hasOwnProperty('optionKey')">
                    <el-tooltip v-if="field.hasOwnProperty('overflow')&&field.overflow" :content="formatterOption(field, item)" placement="top-start">
                      <div class="td-div" :style="`width: ${field.width}px;`">{{ formatterOption(field, item) }}</div>
                    </el-tooltip>
                    <div v-else class="td-div" :style="`width: ${field.width}px;`">{{ formatterOption(field, item) }}</div>
                  </div>
                  <div v-else-if="field.hasOwnProperty('edit')" :style="`width: ${field.width}px;`">
                    <slot name="slot-edit-div"></slot>
                  </div>
                  <div v-else-if="field.hasOwnProperty('format')">
                    <el-tooltip v-if="field.hasOwnProperty('overflow')&&field.overflow" :content="formatterField(field, item)" placement="top-start">
                      <div class="td-div" :style="`width: ${field.width}px;`">{{ formatterField(field, item) }}</div>
                    </el-tooltip>
                    <div v-else class="td-div" :style="`width: ${field.width}px;`">{{ formatterField(field, item) }}</div>
                  </div>
                  <div v-else class="td-div">
                    <el-tooltip v-if="field.hasOwnProperty('overflow')&&field.overflow" :content="item[field.prop]" placement="top-start">
                      <div class="td-div" :style="`width: ${field.width}px;`">{{ item[field.prop] }}</div>
                    </el-tooltip>
                    <div v-else class="td-div" :style="`width: ${field.width}px;`">{{ item[field.prop] }}</div>
                  </div>
                </td>
              </div>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="div-opr-table" v-if="tableData.hasOwnProperty('rightFields')" :style="oprTableStyle">
      <div class="div-opr-table_header" :style="oprTableStyle">
        <div class="div-right-table_header-div">
          <table cellpadding="0" cellspacing="0" class="right-table_header" :style="rightTableBodyStyle">
            <thead>
              <tr v-for="num in tableData.headerNum" :key="num">
                <div v-for="(field, index) in tableData.rightFields" :key="index" :style="`width': ${num==1?field.width+'px':''}; height: 40px; float: left; line-height: 40px;`">
                  <th v-if="!field.hidden&&num==1" :width="field.width"
                  :colspan="field.colspan?field.colspan:1" :rowspan="field.rowspan?field.rowspan:1">{{field.label}}</th>
                  <th v-else-if="!field.hidden&&field.hasOwnProperty('fields')" v-for="(item, x) in field.fields" :key="x" :width="item.width">{{item.label}}</th>
                </div>
                <th v-if="(tableData.isOperat ? false : true)&&(num==1)" :width="tableData.oprWidth - 10">操作</th>
                <th v-else-if="(tableData.isOperat ? false : true)&&(num!=1)" :width="tableData.oprWidth - 10"></th>
                <!-- 自定义右侧冻结列-title内容 -->
                <slot name="slot-opr-header" :num="num"></slot>
              </tr>
            </thead>
          </table>
        </div>
      </div>
      <div class="div-opr-table_body" :style="oprTableStyle">
        <table cellpadding="0" cellspacing="0" class="opr-table_body">
          <tbody>
            <tr v-for="(item, index) in tableData.data" :key="index" :class="[(index%2==0)?'single-row':'', selectIndex==index?'select-row':'']"
            @click="clickRow(index)">
              <div v-for="(field, x) in tableData.rightFields" :key="x" :style="`width': ${field.width+'px'}; height: 50px; float: left; line-height: 50px;`">
                <td v-if="!field.hidden" :width="field.width" :class="field.class" @dblclick="field.hasOwnProperty('dblClick')&&dblClick(index, field)">
                  <div v-if="field.hasOwnProperty('optionKey')" class="td-div" :style="`width: ${field.width}px;`">
                    {{ formatterOption(field, item) }}
                  </div>
                  <div v-else-if="field.hasOwnProperty('edit') && tableData.editData.index == index" :style="`width: ${field.width}px;`">
                    <slot name="slot-edit-div" :item="item" :field="field"></slot>
                  </div>
                  <div v-else-if="field.hasOwnProperty('format')" class="td-div" :style="`width: ${field.width}px;`">
                    {{ formatterField(field, item) }}
                  </div>
                  <div v-else class="td-div" :style="`width: ${field.width}px;`">{{ item[field.prop] }}</div>
                </td>
              </div>
              <td v-if="tableData.isOperat ? false : true" :width="tableData.oprWidth" class="table-opt-col">
                <div class="div-opr-i">
                  <div>
                    <div class="tool-div-button button-detail" title="详情" @click.stop="handleDetail(item)"></div>
                    <div v-if="permissions.update" class="tool-div-button button-edit" title="编辑" @click.stop="handleEdit(item)"></div>
                    <div v-if="permissions.delete" class="tool-div-button button-delete" title="删除" @click.stop="handleDelete(item)"></div>
                  </div>
                </div>
              </td>
                <!-- 自定义右侧冻结列-body内容 -->
              <slot name="slot-opr-body" :index="index" :item="item"></slot>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { queryAll } from '../../api/base.js'

export default {
  props: ['tableData', 'permissions'],
  data () {
    return {
      leftTableStyle: {
        width: ''
      },
      rightTableStyle: {
        width: '100%'
      },
      rightTableBodyStyle: {
        width: ''
      },
      rightTableHeightStyle: {
        height: ''
      },
      oprTableStyle: {
        width: ''
      },
      autoSelect: false,
      // 行class定义
      tableClickRowClass: {},
      selectIndex: null
    }
  },
  mounted () {
    let leftWidth = this.tableData.type == 'selection' ? 50 : 0
    let rightWidth = 0
    let oprWidth = this.tableData.oprWidth
    if (this.tableData.hasOwnProperty('leftFields')) {
      _.forEach(this.tableData.leftFields, (field) => {
        leftWidth += field.width
        if (field.hasOwnProperty('optionKey')) {
          this.$store.commit('setOption', field.optionKey)
          field.options = this.$store.getters.getOption
        } else if (field.hasOwnProperty('getOptions')) {
          queryAll(field.getOptions, field.query).then(response => {
            if (response.data.code == 0) {
              if (field.hasOwnProperty('options')) {
                field.options = field.options.concat(response.data.data)
              } else {
                this.$set(field, 'options', response.data.data)
              }
            }
          })
        }
      })
    }
    if (this.tableData.hasOwnProperty('centerFields')) {
      _.forEach(this.tableData.centerFields, (field) => {
        rightWidth += field.width
        if (field.hasOwnProperty('optionKey')) {
          this.$store.commit('setOption', field.optionKey)
          field.options = this.$store.getters.getOption
        } else if (field.hasOwnProperty('getOptions')) {
          queryAll(field.getOptions, field.query).then(response => {
            if (response.data.code == 0) {
              if (field.hasOwnProperty('options')) {
                field.options = field.options.concat(response.data.data)
              } else {
                this.$set(field, 'options', response.data.data)
              }
            }
          })
        }
      })
    }
    if (this.tableData.hasOwnProperty('rightFields')) {
      _.forEach(this.tableData.rightFields, (field) => {
        oprWidth += field.width
        if (field.hasOwnProperty('optionKey')) {
          this.$store.commit('setOption', field.optionKey)
          field.options = this.$store.getters.getOption
        } else if (field.hasOwnProperty('getOptions')) {
          queryAll(field.getOptions, field.query).then(response => {
            if (response.data.code == 0) {
              if (field.hasOwnProperty('options')) {
                field.options = field.options.concat(response.data.data)
              } else {
                this.$set(field, 'options', response.data.data)
              }
            }
          })
        }
      })
    }
    this.leftTableStyle.width = leftWidth + 'px'
    this.rightTableBodyStyle.width = rightWidth + 'px'
    this.rightTableStyle.width = `calc(100% - ${leftWidth + oprWidth}px`
    this.oprTableStyle.width = oprWidth + 'px'
    this.rightTableHeightStyle.height = `calc(100% - ${this.tableData.headerNum * 40}px`
    this.scrollTable()
  },
  methods: {
    autoSelectClick () {
      if (this.tableData.multipleSelection.length == this.tableData.data.length) {
        this.tableData.multipleSelection = []
      } else {
        this.tableData.multipleSelection = this.tableData.data
      }
    },
    itemSelectClick (item) {
      let index = _.findIndex(this.tableData.multipleSelection, [this.tableData.key, item[this.tableData.key]])
      if (~index) {
        this.tableData.multipleSelection.splice(index, 1)
      } else {
        this.tableData.multipleSelection.push(item)
      }
    },
    clickRow (index, type) {
      if (this.selectIndex == index) {
        this.selectIndex = null
      } else {
        this.selectIndex = index
      }
      if (type == 'scroll') {
        this.tableClickRowClass = {}
        this.$set(this.tableClickRowClass, index, true)
      } else {
        if (this.tableClickRowClass && this.tableClickRowClass.hasOwnProperty(index) && this.tableClickRowClass[index]) {
          this.tableClickRowClass = {}
        } else {
          this.tableClickRowClass = {}
          this.$set(this.tableClickRowClass, index, true)
        }
      }
    },
    dblRowClick (index, method) {
      method(index)
    },
    dblClick (index, field) {
      let method = field.dblClick
      if (method) {
        let data = {
          index: index,
          field: field
        }
        method(data)
      }
    },
    scrollTable () {
      var oprTableBody = document.getElementsByClassName('div-opr-table_body')[0]
      var rightTableBody = document.getElementsByClassName('div-right-table_body')[0]
      oprTableBody.onscroll = function () {
        var oprTableTop = this.scrollTop
        document.getElementsByClassName('div-right-table_body')[0].scrollTop = oprTableTop
        document.getElementsByClassName('div-left-table_body')[0].scrollTop = oprTableTop
      }
      rightTableBody.onscroll = function () {
        var rightTableLeft = this.scrollLeft
        document.getElementsByClassName('div-right-table_header')[0].scrollLeft = rightTableLeft
      }
    },
    scrollEvent (event) {
      var scrollTop = event.wheelDeltaY
      document.getElementsByClassName('div-opr-table_body')[0].scrollTop -= scrollTop
    },
    formatterField (field, item) {
      let value = ''
      if (item) {
        let method = field.format
        if (method) {
          let data = {
            item: item,
            field: field
          }
          method(data, par => {
            value = par
          })
        }
      }
      return value
    },
    // 格式化 enum 成员
    formatterOption (field, item) {
      if (field.optionKey) {
        for (let i = 0; i < field.options.length; i++) {
          if (field.options[i].key == item[field.prop]) {
            return field.options[i].value
          }
        }
      }
      return item[field.prop]
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
    }
  }
}
</script>

<style>
.whole-table-class {
  width: 100%;
  height: calc(100% - 75px);
  display: flex;
}
.whole-table-view {
  height: calc(100% - 116px);
}
.whole-table-class .div-left-table,
.whole-table-class .div-center-table,
.whole-table-class .div-opr-table {
  display: flex;
  flex-direction: column;
}
.whole-table-class .div-right-table_header {
  height: auto;
  width: 100%;
}
.whole-table-class .div-right-table_header-div {
  width: 100%;
  margin-left: -5px;
}
.whole-table-class .left-table_header th,
.whole-table-class .right-table_header th,
.whole-table-class .opr-table_header th {
  height: 40px;
  font-size: 14px;
  line-height: 40px;
  color: #7a939e;
}
.whole-table-class .left-table_body td,
.whole-table-class .right-table_body td,
.whole-table-class .opr-table_body td {
  height: 50px;
  font-size: 15px;
  color: #fff;
  text-overflow: ellipsis;
  vertical-align: middle;
  text-align: center;
}
.whole-table-class tr {
  display: flex;
}
.whole-table-class tr.single-row {
  background-color: #0e2d3e;
}
.whole-table-class tr.select-row {
  background-color: #215870;
}
.whole-table-class tr .td-div {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.whole-table-class .div-center-table {
  overflow: hidden;
}
.whole-table-class .div-right-table_body {
  width: 100%;
  height: 100%;
}
.whole-table-class .table-opt-col {
  display: flex;
  align-items: center;
}
</style>
