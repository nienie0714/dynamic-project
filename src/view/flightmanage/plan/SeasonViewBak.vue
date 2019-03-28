<template>
  <el-container direction="vertical">
    <el-header class="query-contain">
      <Query-view :data="queryRowGroup" class="left" @keyupEnter="queryDataReq()"></Query-view>
      <div class="left-button">
        <el-button type="info" icon="el-icon-search" plain @click="cleanQueryData()">清空</el-button>
        <el-button type="primary" icon="el-icon-search" @click="queryDataReq()">查询</el-button>
      </div>
    </el-header>
    <el-main class="page-table-view mult-title-table">
      <div class="page-table-header">
        <div class="page-table-title">查询结果</div>
        <Tool-button-view :permissions="permissions" :selectionCount="tableData.multipleSelection.length" @handleDownload="handleDownload" @handleAdd="handleAdd" @handleDelete="handleDelete">
          <template slot="button-slot-scope-pre">
            <div v-if="permissions.import" class="tool-div-button tool-import" title="导入" @click="handleImport"></div>
          </template>
        </Tool-button-view>
        <div class="pagination-view">
          <div class="el-pagination">
            <span class="el-pagination__total">共 {{ tableTotal }} 条</span>
          </div>
        </div>
      </div>
      <whole-table-view :permissions="permissions" :tableData="tableData" ref="basicTable" @handleDetail="handleDetail" @handleEdit="handleEdit" @handleDelete="handleDelete"></whole-table-view>
    </el-main>
    <Edit-view :formData="formData" @handleAdd="saveAdd" @handleEdit="saveEdit">
      <template slot="slot-scope" slot-scope="scopeTemp">
        <div class="pro-task-opr-div-com pro-tasks-opr-div">
          <div class="task-pro-div">
            <div class="task-div-header">经停站<div v-if="formData.title!='详情'" class="add-button"><div :class="((formData.title!='详情')&&(!scopeTemp.item.editIndex)&&(scopeTemp.item.editIndex!=0))?'tool-div-button tool-add':'tool-div-button tool-add div-disabled'" @click="((formData.title!='详情')&&(!scopeTemp.item.editIndex)&&(scopeTemp.item.editIndex!=0))&&addOpr(scopeTemp)"></div></div></div>
            <div class="task-div-tasks-list">
              <div class="task-pro-cont-table-div div-head">
                <table cellpadding="0" cellspacing="0" class="task-pro-cont-table table-head">
                  <thead>
                    <tr class="task-pro-cont-table-thead tr-single">
                      <th v-for="(item, index) in scopeTemp.item.tabelFields" :key="index" :width="item.width">{{item.label}}</th>
                      <th></th>
                    </tr>
                  </thead>
                </table>
              </div>
              <div class="task-pro-cont-table-div div-body">
                <table cellpadding="0" cellspacing="0" class="task-pro-cont-table table-body">
                  <tbody>
                    <tr v-for="(item, index) in scopeTemp.item.tempArr" :key="index" :class="(index % 2 > 0)?'task-pro-cont-table-tr tr-single':'task-pro-cont-table-tr tr-double'">
                      <div v-if="scopeTemp.item.editIndex == index" class="tr-div-td">
                        <td v-for="field in scopeTemp.item.tabelFields" :key="field.prop" class="cont-tr-div" :width="field.width">
                          <div class="td-edit-div">
                            <el-input v-if="field.type == 'input'" :type="field.type" v-model.trim.lazy="item[field.prop]" :placeholder="field.label" auto-complete="off" :maxlength="field.maxlength"></el-input>
                            <el-input v-if="field.type == 'number'" :type="field.type" v-model.trim.lazy="item[field.prop]" :placeholder="field.label" auto-complete="off" :min="field.min" :max="field.max"></el-input>
                            <!-- <el-select v-if="field.type == 'select'" v-model="item[field.prop]" :placeholder="'请选择' + field.label" :filterable="true" :clearable="true">
                              <el-option v-for="option in field.options" :key="option.index" :label="option[field.itemLabel]" :value="option[field.itemKey]">
                                <span style="float: left">{{ option[field.itemLabel] }}</span>
                              </el-option>
                            </el-select> -->
                            <el-select v-if="field.type == 'select'" v-model="item[field.propObj]" :placeholder="'请选择' + field.label" @change="itemChangeHandle(item, field)"
                            :filterable="true" :clearable="true" :value-key="field.valueKey">
                              <el-option v-for="option in field.options" :key="option[field.itemKey]" :label="option[field.itemLabel]" :value="field.hasOwnProperty('valueKey') ? option : option[field.itemKey]">
                                <span style="float: left">{{ option[field.itemLabel] }}</span>
                                <span v-if="field.hasOwnProperty('itemLabelSpan')" style="float: right; color: #8492a6; font-size: 13px">{{ option[field.itemLabelSpan] }}</span>
                              </el-option>
                            </el-select>
                            <el-time-picker v-if="field.type == 'time'" v-model="item[field.prop]" :editable="true" :clearable="true" :format="field.format" :value-format="field.valueFormat" :placeholder="'请选择' + field.label" :picker-options="field.pickerOpt">
                            </el-time-picker>
                          </div>
                        </td>
                        <td class="cont-tr-div table-opt-col">
                          <div :class="(item[scopeTemp.item.tabelFields[0].prop]&&item[scopeTemp.item.tabelFields[1].prop]&&item[scopeTemp.item.tabelFields[2].prop])?'tool-div-button opr-edit-save':'tool-div-button opr-edit-save div-disabled'"
                          @click="saveOpr(scopeTemp, item, index)"></div>
                          <div class="tool-div-button opr-edit-cancel" @click="cancelOpr(scopeTemp, index)"></div>
                        </td>
                      </div>
                      <div v-else class="tr-div-td">
                        <td v-for="field in scopeTemp.item.tabelFields" :key="field.prop" class="cont-tr-div" :width="field.width">
                          <div v-if="field.hasOwnProperty('propCn')">{{item[field.propCn]}}</div>
                          <div v-else>{{item[field.prop]}}</div>
                        </td>
                        <td v-if="formData.title!='详情'" class="cont-tr-div table-opt-col">
                          <div :class="(formData.title!='详情')?'tool-div-button button-edit':'tool-div-button button-edit div-disabled'" @click="(formData.title!='详情')&&editOpr(scopeTemp, item, index)"></div>
                          <div :class="(formData.title!='详情')?'tool-div-button button-delete':'tool-div-button button-delete div-disabled'" @click="(formData.title!='详情')&&deleteOpr(scopeTemp, item, index)"></div>
                          <div :class="(formData.title!='详情')?'tool-div-button button-up':'tool-div-button button-up div-disabled'" @click="upOpr(scopeTemp, index)"></div>
                        </td>
                      </div>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Edit-view>
    <Warning-box-view :data="deleteData" @handleConfirm="handleDeleteConfirm" @handleClose="handleDeleteClose"></Warning-box-view>
    <el-dialog :visible.sync="importData.visible" :close-on-click-modal="false" width="500px" append-to-body class="other-dialog plan-dialog" @close="closeImportDialog">
      <div slot="title" class="dialog-header">
        <img :src="require('@img/title_deco.png')" />
        <span class="header-title">导入</span>
      </div>
      <div class="dialog-body">
        <el-upload action="dfs/files" :multiple="false" :accept="importData.fileType" :file-list="importData.data.fileList"
        :auto-upload="false" :on-remove="handleRemove" :on-change="handleUploadChange" ref="upload">
          <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
          <el-button size="small" type="success" :disabled="require('lodash').isEmpty(importData.data.fileList)" :loading="importData.data.loading" @click="submitUpload">{{importData.data.loading ? '上传中' : '上传文件'}}</el-button>
          <el-button size="small" type="primary"  @click="downloadExcel()">下载模板</el-button>
        </el-upload>
        <div class="tip-font">关闭当前导入窗口，下次导入将清空所有{{name}}数据</div>
        <div v-if="~importData.statusData.status">
          <div>导入成功 <span style="color: green;">{{importData.statusData.success}}</span> 条<br/>导入失败 <span style="color: red;">{{importData.statusData.fail}}</span> 条。</div>
          <el-button size="small" type="primary" :disabled="!importData.statusData.fileUrl" @click="downloadErrorExcel()">下载导入失败信息</el-button>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="importData.loading" @click="closeImportDialog">关 闭</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import QueryView from '../../../components/common/QueryView'
import WholeTableView from '../../../components/common/BaseWholeTableView'
import ToolButtonView from '../../../components/common/ToolButtonView'
import EditView from '../../../components/common/EditView'
import basicTableMixin from '../../../components/mixin/basicTableMixin'
import wholeTableMixin from '../../../components/mixin/wholeTableMixin'
import basicMsgMixin from '../../../components/mixin/basicMsgMixin'
import {flightNumReg} from '../../../util/rules.js'
import {queryAll, upload, download} from '../../../api/base.js'
import _ from 'lodash'

// const tableHeight = ''

export default {
  components: {
    QueryView,
    WholeTableView,
    ToolButtonView,
    EditView
  },
  mixins: [basicTableMixin, wholeTableMixin, basicMsgMixin],
  data () {
    return {
      name: '',
      dfsUrl: '',
      aptLoc: '',
      options: [],
      optionsRemove: [],
      // 菜单对应按钮权限
      permissions: {
        update: false,
        export: false,
        import: false
      },
      // 基础路径
      baseUrl: 'scheduleFlight',
      queryUrl: '/scheduleFlight/queryScheduleFlightVOs',
      formData: {
        title: '新增',
        visible: false,
        inline: true,
        width: '600px',
        className: 'twiceCol',
        key: 'scheduleFlightId',
        getOptions: '/basicdata/airport/queryAll',
        formData: [
          {key: 'scheduleFlightId', label: '编号', type: 'pInput', isHidden: true},
          {key: 'airline', label: '航空公司', type: 'select', filterable: true, getOptions: '/basicdata/airline/queryAll', itemKey: 'airlineIata', itemLabel: 'briefC'},
          {key: 'flightNum', label: '航班号', type: 'input', toUpper: true, maxlength: 5},
          {key: 'attr', label: '属性', type: 'tabs', tabsKey: 'attr', options: []},
          {key: 'task', label: '航班任务', type: 'select', filterable: true, getOptions: '/basicdata/flighttask/queryAll', itemKey: 'taskCode', itemLabel: 'briefC'},
          {key: 'startStation', label: '始发站', type: 'select', filterable: true, itemKey: 'airportIata', itemLabel: 'briefC', holdRule: true},
          {key: 'terminalStation', label: '目的站', type: 'select', filterable: true, itemKey: 'airportIata', itemLabel: 'briefC', holdRule: true},
          {key: 'inOutFlag', label: '进出标识', type: 'tabs', tabsKey: 'fltType', options: [], change: this.changeFlag},
          {key: 'aircraftType', label: '机型', type: 'select', filterable: true, getOptions: '/basicdata/aircraftType/queryAll', itemKey: 'aircraftIcao', itemLabel: 'aircraftIcao'},
          {
            key: 'execArr',
            label: '每周班次',
            type: 'checkbox',
            filterable: true,
            class: 'auto-width',
            itemKey: 'key',
            itemLabel: 'value',
            options: [
              {key: '1', value: '星期一'},
              {key: '2', value: '星期二'},
              {key: '3', value: '星期三'},
              {key: '4', value: '星期四'},
              {key: '5', value: '星期五'},
              {key: '6', value: '星期六'},
              {key: '7', value: '星期日'}
            ]
          },
          {key: 'season', label: '班期季节', type: 'tabs', tabsKey: 'scheduleSeason', options: []},
          {key: 'dateRange', key1: 'beginDate', key2: 'endDate', label: '计划日期区间', label1: '计划开始日期', label2: '计划结束日期', type: 'dateRangePicker', rangeMethod: this.dateRangeReg, dateType: 'date', required: 3, format: 'yyyy-MM-dd', valueFormat: 'yyyy-MM-dd', class: 'auto-width'},
          // {key: 'beginDate', label: '计划开始', type: 'date', format: 'yyyy-MM-dd', valueFormat: 'yyyy-MM-dd'},
          // {key: 'endDate', label: '计划结束', type: 'date', format: 'yyyy-MM-dd', valueFormat: 'yyyy-MM-dd'},
          {key: 'timeRange', key1: 'std', key2: 'sta', label: '计划起飞/降落时间', label1: '计划起飞时间', label2: '计划降落时间', pickerOpt: {format: 'HH:mm'}, type: 'dateRangePicker', rangeMethod: this.dateRangeReg, dateType: 'time', required: 3, format: 'HH:mm', valueFormat: 'HH:mm', class: 'auto-width'},
          // {key: 'std', label: '计划起飞', type: 'time', valueFormat: 'HH:mm', pickerOpt: {format: 'HH:mm'}},
          // {key: 'sta', label: '计划降落', type: 'time', valueFormat: 'HH:mm', pickerOpt: {format: 'HH:mm'}},
          {
            key: 'lstScheduleFlightStation',
            label: '',
            type: 'slot',
            class: 'whole-width',
            editIndex: null,
            editType: 0,
            saveKey: 'lstScheduleFlightStation',
            tabelFields: [
              {prop: 'station', label: '经停站', propObj: 'stationObj', propCn: 'stationCn', type: 'select', width: '170', valueKey: 'airportIata', itemKey: 'airportIata', itemLabel: 'briefC'},
              {prop: 'sta', label: '计划降落', type: 'time', width: '110', format: 'HH:mm', valueFormat: 'HH:mm', pickerOpt: {format: 'HH:mm'}},
              {prop: 'std', label: '计划起飞', type: 'time', width: '110', format: 'HH:mm', valueFormat: 'HH:mm', pickerOpt: {format: 'HH:mm'}}
            ],
            tempData: {},
            tempArr: []
          }
        ],
        rules: {
          airline: [
            {required: true, message: '必填项', trigger: 'blur'}
          ],
          flightNum: [
            {required: true, message: '必填项', trigger: 'blur'},
            {validator: flightNumReg, trigger: 'blur'}
          ],
          attr: [
            {required: true, message: '必填项', trigger: 'blur'}
          ],
          task: [
            {required: true, message: '必填项', trigger: 'blur'}
          ],
          startStation: [
            {required: true, message: '必填项', trigger: 'blur'}
          ],
          terminalStation: [
            {required: true, message: '必填项', trigger: 'blur'}
          ],
          inOutFlag: [
            {required: true, message: '必填项', trigger: 'blur'}
          ],
          aircraftType: [
            {required: true, message: '必填项', trigger: 'blur'}
          ],
          execArr: [
            {required: true, message: '必填项', trigger: 'blur'}
          ],
          season: [
            {required: true, message: '必填项', trigger: 'blur'}
          ],
          beginDate: [
            {required: true, message: '必填项', trigger: 'blur'}
          ],
          endDate: [
            {required: true, message: '必填项', trigger: 'blur'}
          ],
          std: [
            {required: true, message: '必填项', trigger: 'blur'}
          ],
          sta: [
            {required: true, message: '必填项', trigger: 'blur'}
          ]
        }
      },
      // 查询条件每行个数
      colSize: 5,
      // 查询条件设置
      queryList: [
        {
          // 'p': '班期季节',
          key: 'season',
          tabsKey: 'scheduleSeason',
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
        headerStyle: 'padding-top: 15px; margin-bottom: -5px;',
        oprWidth: 130,
        key: 'scheduleFlightId',
        multipleSelection: [],
        headerNum: 2,
        leftFields: [
          {prop: 'name', label: '名称', hidden: false, width: 180, overflow: true},
          {prop: 'start', label: '开始时间', hidden: false, width: 150, overflow: true},
          {prop: 'end', label: '结束时间', hidden: false, width: 160, overflow: true}
        ],
        rightFields: []
      },
      importData: {
        visible: false,
        loading: false,
        uploadUrl: '/scheduleFlight/importExcel',
        data: {
          clearType: 0,
          fileList: [],
          loading: false,
          progress: 0
        },
        fileType: '.xls',
        fileName: '',
        fileUrl: 'scheduleFlight/downloadExcelTemplate',
        errorFileName: '',
        statusData: {
          status: -1,
          success: 0,
          fail: 0,
          fileUrl: ''
        }
      }
    }
  },
  mounted () {
    this.$store.commit('setConfigValue', 'dfsUrl')
    this.dfsUrl = this.$store.getters.getConfigValue
    this.$store.commit('setConfigValue', 'aptLoc')
    this.aptLoc = this.$store.getters.getConfigValue
    this.name = localStorage.getItem(_.find(this.$store.getters.getHomeRouterData, ['path', this.$route.matched[0].path]).name)
    this.importData.fileName = this.name + '导入模板.xls'
    this.importData.errorFileName = this.name + '导入失败信息.xls'
  },
  methods: {
    dateRangeReg (rule, value, callback) {
      if (value.hasOwnProperty('start') && value.hasOwnProperty('end')) {
        if (value.start && value.end) {
          if (value.start >= value.end) {
            let same = this.formData.formData.filter((obj) => {
              return obj.key == rule.field
            })
            callback(new Error(same.regInfo ? same.regInfo : '开始时间必须小于结束时间'))
          }
        }
      }
      callback()
    },
    changeFlag (value, callback) {
      let station = [{
        key: '',
        value: this.aptLoc
      }, {
        key: '',
        value: ''
      }]
      if (value == 'A') { // 进港->目的站为本站点
        for (let i = 0; i < this.formData.formData.length; i++) {
          if (this.formData.formData[i].key == 'terminalStation') {
            this.$set(this.formData.formData[i], 'disabled', true)
            this.$set(this.formData.formData[i], 'options', this.options)
            station[0].key = this.formData.formData[i].key
          }
          if (this.formData.formData[i].key == 'startStation') {
            this.$set(this.formData.formData[i], 'disabled', false)
            this.$set(this.formData.formData[i], 'options', this.optionsRemove)
            station[1].key = this.formData.formData[i].key
          }
        }
      } else { // 出港->始发站为本站点
        for (let i = 0; i < this.formData.formData.length; i++) {
          if (this.formData.formData[i].key == 'startStation') {
            this.$set(this.formData.formData[i], 'disabled', true)
            this.$set(this.formData.formData[i], 'options', this.options)
            station[0].key = this.formData.formData[i].key
          }
          if (this.formData.formData[i].key == 'terminalStation') {
            this.$set(this.formData.formData[i], 'disabled', false)
            this.$set(this.formData.formData[i], 'options', this.optionsRemove)
            station[1].key = this.formData.formData[i].key
          }
        }
      }
      callback(station)
      return null
    },
    handleImport () {
      this.importData.visible = true
    },
    handleRemove (file, fileList) {
      this.$refs.upload.clearFiles()
      this.importData.data.fileList = []
    },
    handleUploadChange (file, fileList) {
      this.$refs.upload.clearFiles()
      this.importData.data.fileList = [file]
    },
    submitUpload () {
      this.importData.data.loading = true
      let formdata = new FormData()
      formdata.append('file', this.importData.data.fileList[0].raw)
      formdata.append('clearType', this.importData.data.clearType)
      formdata.append('submit', false)
      upload(this.importData.uploadUrl, formdata).then(res => {
        if (res.data.code == 0) {
          if (res.data.data['success_count'] > 0) {
            this.importData.data.clearType += 1
            this.queryDataReq()
          }
          this.importData.statusData.success = res.data.data['success_count']
          this.importData.statusData.fail = res.data.data['fail_count']
          this.importData.statusData.fileUrl = res.data.data['filePath']
          this.importData.data.fileList = []
          this.importData.statusData.status = 0
        } else {
          this.showError('导入', res.data.msg)
        }
        this.importData.data.loading = false
      })
    },
    downloadExcel () {
      download(this.importData.fileUrl, null).then(res => {
        this.downFile(res, this.importData.fileName)
      }).catch(err => {
        this.showError('下载模板', '请重新尝试 !')
        console.log(err)
      })
      /* this.downFile(response, this.fileName)
      let a = document.createElement('a')
      a.setAttribute('style', 'display:none')
      a.setAttribute('href', this.apiUrl + this.importData.fileUrl)
      a.setAttribute('download', this.importData.fileName)
      a.click()
      console.log('a') */
    },
    downloadErrorExcel () {
      let a = document.createElement('a')
      a.setAttribute('style', 'display:none')
      a.setAttribute('href', this.dfsUrl + this.importData.statusData.fileUrl)
      a.setAttribute('download', this.importData.errorFileName)
      a.click()
    },
    closeImportDialog () {
      this.importData.visible = false
      this.importData.data.clearType = 0
      this.importData.statusData.status = -1
      this.importData.statusData.success = 0
      this.importData.statusData.fail = 0
      this.importData.statusData.fileUrl = null
      this.importData.data.fileList = []
    },
    formatterCharHHMMVal (value, callback) {
      let val = value ? value.substr(0, 2) + ':' + value.substr(2, 2) : ''
      callback(val)
    },
    addOpr (scopeTemp) {
      scopeTemp.item.tempData = {}
      let obj = {}
      scopeTemp.item.tabelFields.forEach(field => {
        this.$set(obj, field.prop, null)
      })
      scopeTemp.item.tempArr.push(obj)
      scopeTemp.item.editIndex = scopeTemp.item.tempArr.length - 1
      scopeTemp.item.editType = 0
      scopeTemp.item.tabelFields[0].options = this.formData.formData[5].options
      let indexTemp = _.findIndex(scopeTemp.item.tabelFields[0].options, ['airportIata', this.aptLoc])
      scopeTemp.item.tabelFields[0].options.splice(indexTemp, 1)
      this.$nextTick(() => {
        let element = document.getElementsByClassName('task-pro-cont-table-tr')
        if (element.length) {
          element[element.length - 1].scrollIntoView()
        }
      })
    },
    editOpr (scopeTemp, item, index) {
      scopeTemp.item.editIndex = index
      scopeTemp.item.editType = 1
      scopeTemp.item.tempData = JSON.parse(JSON.stringify(item))
      scopeTemp.item.tabelFields[0].options = this.formData.formData[5].options
      let indexTemp = _.findIndex(scopeTemp.item.tabelFields[0].options, ['airportIata', this.aptLoc])
      scopeTemp.item.tabelFields[0].options.splice(indexTemp, 1)
      /* for (var i = 0; i < this.formData.formData[4].tabelFields.length; i++) {
        if (this.formData.formData[4].tabelFields[i].hasOwnProperty('saveKey')) {
          this.$set(this.tempData, this.formData.formData[4].tabelFields[i].editProp, scopeTemp.data[scopeTemp.item.key][index][this.formData.formData[4].tabelFields[i].editProp])
        }
      } */
    },
    deleteOpr (scopeTemp, item, index) {
      scopeTemp.item.editIndex = null
      scopeTemp.item.editType = null
      scopeTemp.item.tempArr.splice(index, 1)
    },
    saveOpr (scopeTemp, item, index) {
      if (item[scopeTemp.item.tabelFields[0].prop] && item[scopeTemp.item.tabelFields[1].prop] && item[scopeTemp.item.tabelFields[2].prop]) {
        if (item[scopeTemp.item.tabelFields[1].prop] < item[scopeTemp.item.tabelFields[2].prop]) {
          scopeTemp.item.editIndex = null
          scopeTemp.item.editType = null
        } else {
          this.showError('保存经停站', '降落时间必须小于起飞时间 !')
        }
      }
    },
    cancelOpr (scopeTemp, index) {
      if (scopeTemp.item.editType == 0) {
        this.$delete(scopeTemp.item.tempArr, index)
      } else {
        this.$set(scopeTemp.item.tempArr, index, scopeTemp.item.tempData)
      }
      scopeTemp.item.editIndex = null
    },
    upOpr (scopeTemp, index) {
      if (index > 0) {
        var temp = scopeTemp.item.tempArr[index]
        scopeTemp.item.tempArr.splice(index, 1)
        scopeTemp.item.tempArr.splice(index - 1, 0, temp)
      }
    },
    itemChangeHandle (item, field) {
      item[field.prop] = item[field.propObj][field.itemKey]
      item[field.propCn] = item[field.propObj][field.itemLabel]
    },
    // 新增
    handleAdd () {
      queryAll(this.formData.getOptions, {}).then(response => {
        if (response.data.code == 0) {
          this.options = response.data.data
          this.optionsRemove = JSON.parse(JSON.stringify(this.options))
          let index = _.findIndex(this.optionsRemove, ['airportIata', this.aptLoc])
          this.optionsRemove.splice(index, 1)
          for (let i = 0; i < this.formData.formData.length; i++) {
            if (this.formData.formData[i].type == 'slot') {
              if (this.formData.formData[i].hasOwnProperty('tempArr')) {
                this.formData.formData[i].tempArr = []
                this.formData.formData[i].editIndex = null
              }
            }
            if (this.formData.formData[i].key == 'terminalStation') {
              this.$set(this.formData.formData[i], 'isDisabled', true)
              this.$set(this.formData.formData[i], 'defaultValue', this.aptLoc)
              this.$set(this.formData.formData[i], 'options', this.options)
            }
            if (this.formData.formData[i].key == 'startStation') {
              this.$delete(this.formData.formData[i], 'isDisabled')
              this.$delete(this.formData.formData[i], 'disabled')
              this.$set(this.formData.formData[i], 'defaultValue', '')
              this.$set(this.formData.formData[i], 'options', this.optionsRemove)
            }
          }
          this.formData.title = '新增'
          this.formData.visible = true
        } else {
          this.showError('获取机场信息', '请重新尝试 !')
        }
      })
    },
    // 详情
    handleDetail (row) {
      queryAll(this.formData.getOptions, {}).then(response => {
        if (response.data.code == 0) {
          this.options = response.data.data
          this.optionsRemove = JSON.parse(JSON.stringify(this.options))
          let index = _.findIndex(this.optionsRemove, ['airportIata', this.aptLoc])
          this.optionsRemove.splice(index, 1)
          for (let i = 0; i < this.formData.formData.length; i++) {
            if (this.formData.formData[i].type == 'dateRangePicker') {
              this.$set(this.formData.formData[i], 'value', {start: null, end: null})
              this.formData.formData[i].value.start = row[this.formData.formData[i].key1]
              this.formData.formData[i].value.end = row[this.formData.formData[i].key2]
            } else {
              this.$set(this.formData.formData[i], 'value', row[this.formData.formData[i].key])
            }
            if (this.formData.formData[i].type == 'slot') {
              if (this.formData.formData[i].hasOwnProperty('tempArr')) {
                this.formData.formData[i].tempArr = row[this.formData.formData[i].key] ? JSON.parse(JSON.stringify(row[this.formData.formData[i].key])) : []
                this.formData.formData[i].editIndex = null
              }
            }
            if (row['inOutFlag'] == 'A') {
              if (this.formData.formData[i].key == 'terminalStation') {
                this.$set(this.formData.formData[i], 'defaultValue', this.aptLoc)
                this.$set(this.formData.formData[i], 'options', this.options)
              }
              if (this.formData.formData[i].key == 'startStation') {
                this.$set(this.formData.formData[i], 'options', this.optionsRemove)
              }
            } else {
              if (this.formData.formData[i].key == 'startStation') {
                this.$set(this.formData.formData[i], 'defaultValue', this.aptLoc)
                this.$set(this.formData.formData[i], 'options', this.options)
              }
              if (this.formData.formData[i].key == 'terminalStation') {
                this.$set(this.formData.formData[i], 'options', this.optionsRemove)
              }
            }
          }
          this.formData.title = '详情'
          this.formData.visible = true
        } else {
          this.showError('获取机场信息', '请重新尝试 !')
        }
      })
    },
    // 编辑
    handleEdit (row) {
      queryAll(this.formData.getOptions, {}).then(response => {
        if (response.data.code == 0) {
          this.options = response.data.data
          this.optionsRemove = JSON.parse(JSON.stringify(this.options))
          let index = _.findIndex(this.optionsRemove, ['airportIata', this.aptLoc])
          this.optionsRemove.splice(index, 1)
          for (let i = 0; i < this.formData.formData.length; i++) {
            if (this.formData.formData[i].type == 'dateRangePicker') {
              this.$set(this.formData.formData[i], 'value', {start: null, end: null})
              this.formData.formData[i].value.start = row[this.formData.formData[i].key1]
              this.formData.formData[i].value.end = row[this.formData.formData[i].key2]
            } else {
              this.$set(this.formData.formData[i], 'value', row[this.formData.formData[i].key])
            }
            if (this.formData.formData[i].type == 'slot') {
              if (this.formData.formData[i].hasOwnProperty('tempArr')) {
                this.formData.formData[i].tempArr = row[this.formData.formData[i].key] ? JSON.parse(JSON.stringify(row[this.formData.formData[i].key])) : []
                _.forEach(this.formData.formData[i].tabelFields, (item) => {
                  if (item.hasOwnProperty('propObj')) {
                    _.forEach(this.formData.formData[i].tempArr, (temp) => {
                      let obj = {}
                      this.$set(obj, item.itemKey, temp[item.prop])
                      this.$set(obj, item.itemLabel, temp[item.propCn])
                      this.$set(temp, item.propObj, obj)
                    })
                  }
                })
                this.formData.formData[i].editIndex = null
              }
            }
            if (row['inOutFlag'] == 'A') {
              if (this.formData.formData[i].key == 'terminalStation') {
                this.$set(this.formData.formData[i], 'isDisabled', true)
                this.$set(this.formData.formData[i], 'defaultValue', this.aptLoc)
                this.$set(this.formData.formData[i], 'options', this.options)
              }
              if (this.formData.formData[i].key == 'startStation') {
                this.$delete(this.formData.formData[i], 'isDisabled')
                this.$delete(this.formData.formData[i], 'disabled')
                this.$set(this.formData.formData[i], 'options', this.optionsRemove)
              }
            } else {
              if (this.formData.formData[i].key == 'startStation') {
                this.$set(this.formData.formData[i], 'isDisabled', true)
                this.$set(this.formData.formData[i], 'defaultValue', this.aptLoc)
                this.$set(this.formData.formData[i], 'options', this.options)
              }
              if (this.formData.formData[i].key == 'terminalStation') {
                this.$delete(this.formData.formData[i], 'isDisabled')
                this.$delete(this.formData.formData[i], 'disabled')
                this.$set(this.formData.formData[i], 'options', this.optionsRemove)
              }
            }
          }
          this.formData.title = '编辑'
          this.formData.visible = true
        } else {
          this.showError('获取机场信息', '请重新尝试 !')
        }
      })
    },
    customSaveBefore (data) {
      for (let i = 0; i < this.formData.formData.length; i++) {
        if (this.formData.formData[i].type == 'slot') {
          if (this.formData.formData[i].editIndex == null) {
            return data
          } else {
            this.showError('保存', '当前有经停站未保存 !')
            return null
          }
        }
      }
    }
  }
}
</script>

<style>
/* .mult-title-table .el-table__fixed-body-wrapper {
  top: 40px !important
} */
.mult-title-table .el-table th {
  background: #081e2d !important;
}
.mult-title-table .el-table td {
  border: none;
}
/* 导入块（上侧） */
.plan-dialog .dialog-body>div:first-of-type {
  margin-top: 20px;
}
.plan-dialog .dialog-body>div:first-of-type>button:last-of-type {
  margin-left: 140px;
}
.plan-dialog .dialog-body>div:first-of-type>button {
  margin-left: 15px;
}
.plan-dialog .dialog-body>div:first-of-type>ul {
  margin-top: 30px;
}
.plan-dialog .dialog-body .el-upload-list__item {
  border-radius: 8px;
}
.el-upload-list__item {
  background-color: rgba(60,166,200,0.4) !important;
  cursor: pointer;
}
.el-upload-list__item:hover .el-upload-list__item-name,
.el-upload-list__item:hover .el-upload-list__item-name [class^=el-icon] {
  color: #fff !important;
}
.el-upload-list__item-name,
.el-upload-list__item-name [class^=el-icon] {
  color: #7a939e !important;
}
.plan-dialog .dialog-body .el-upload-list__item-name,
.plan-dialog .dialog-body .el-upload-list__item-name [class^=el-icon] {
  font-size: 20px;
}
.plan-dialog .dialog-body .el-upload-list__item-name {
  margin-left: 20px;
  text-align: left;
  height: 50px;
  line-height: 50px;
}
.plan-dialog .dialog-body .el-upload-list__item>.el-icon-close:before {
  line-height: 40px;
  margin-right: 10px;
  font-size: 20px;
  color: #fff;
}
.el-upload-list--text:focus {
  outline: 0;
}
.el-upload-list__item:focus {
  outline: 0;
}
/* 提示块（下侧） */
.plan-dialog .dialog-body>div:not(:first-of-type) {
  margin-top: 20px;
  display: flex;
  align-items: center;
  margin-left: 10px;
  text-align: left;
}
.plan-dialog .dialog-body>.tip-font {
  font-size: 16px;
  color: #7a939e;
}
.plan-dialog .dialog-body>div:not(:first-of-type):not(.tip-font) {
  font-size: 20px;
  color: #fff;
}
.plan-dialog .dialog-body>div:not(:first-of-type):not(.tip-font)>div:first-of-type {
  width: calc(100% - 116px);
}
/* .plan-dialog .dialog-body>div:last-of-type>div:last-of-type {
  margin-top: 10px;
  display: flex;
}
.plan-dialog .dialog-body>div:last-of-type>div:last-of-type>button {
  margin-left: 20px;
} */
</style>

<style scoped>
.page-table-view .pro-task-div {
  white-space: nowrap;
  overflow: hidden;
  /* text-overflow: ellipsis; */
  height: 28px;
  margin: 4px 10px 4px 0;
  padding: 7px 10px;
  border-radius: 6px;
  box-sizing: border-box;
  cursor: pointer;
}
.page-table-view .pro-task-opr-div-row .task-active {
  border: none;
  background-color: rgba(3, 167, 134, 0.6);
  line-height: 14px;
}
.page-table-view .pro-task-opr-div-row .task-dis-active {
  border: 1px solid rgba(122, 147, 158, 0.6);
  line-height: 12px;
}
.pro-task-opr-pop .el-header {
  height: 40px !important;
  line-height: 16px;
  font-size: 16px;
  padding: 12px;
}
.pro-task-opr-pop .el-header>div:not(:last-of-type) {
  float: left;
}
.pro-task-opr-pop .el-header>div:last-of-type {
  float: right;
}
.pro-task-opr-pop .font-white {
  color: #fff;
}
.pro-task-opr-pop .font-green {
  color: #03a786;
}
.pro-task-opr-pop .font-gray {
  color: #7a939e;
  margin-left: 10px;
}
.pro-task-opr-pop .pro-task-div,
.pro-task-opr-div {
  display: flex;
}
.pro-task-opr-row-div {
  padding: 8px 12px 12px 12px;
}
.pro-task-opr-div>div {
  background-color: rgba(122, 147, 158, 0.4);
  border-radius: 14px;
  color: #fff;
  height: 14px;
  line-height: 14px;
  font-size: 14px;
  padding: 7px 14px;
}
.pro-task-opr-div>div:not(:last-of-type),
.pro-task-opr-div.el-popover__reference {
  margin-right: 10px;
}
.pro-task-opr-div.el-popover__reference {
  cursor: pointer;
}
.pro-task-opr-div.el-popover__reference>div:hover {
  background-color: rgba(54, 141, 178, 0.4);
}
.pro-task-opr-div-com {
  display: flex;
}
.pro-tasks-opr-div {
  height: 400px;
}
.pro-task-opr-div-com>div {
  border: 1px solid rgba(60,166, 200, 0.6);
  background-color: rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 30px rgba(60, 166, 200, 0.3) inset;
  border-radius: 12px;
}
.pro-task-opr-div-com .task-pro-div {
  flex-grow: 1;
  padding: 0 0 10px 0;
}
.pro-task-opr-div-com .task-pro-div .add-button {
  float: right;
  width: 30px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.pro-task-opr-div-com .task-pro-div .add-button .tool-div-button {
  width: 30px;
  height: 30px;
  border: 1px solid #447385;
  border-radius: 6px;
  box-sizing: content-box;
  cursor: pointer;
  background-position: center;
}
.pro-task-opr-div-com .task-div-header {
  font-size: 16px;
  color: #7a939e;
}
.pro-tasks-opr-div .task-div-header {
  height: 50px;
  line-height: 50px;
}
.pro-task-opr-div-com .task-pro-div .task-div-header {
  padding: 0 20px;
}
.pro-task-opr-div-com .task-div-tasks-list {
  overflow: hidden;
}
.pro-task-opr-div-com .task-div-tasks-list .div-body.task-pro-cont-table-div {
  overflow-x: hidden;
  height: calc(100% - 44px);
}
.pro-tasks-opr-div .task-div-tasks-list {
  height: calc(100% - 50px);
}
.pro-task-opr-div-com .task-pro-div .task-pro-task {
  padding: 0 10px 16px 20px;
}
.pro-task-opr-div-com .task-pro-div .task-pro-task.task-single {
  background-color: rgba(60,166,200,0.1);
}
.task-pro-task .task-pro-head {
  height: 40px;
}
.task-pro-task .task-pro-cont {
  margin: 4px 0 0 0;
  display: flex;
  flex-wrap: wrap;
}
.task-pro-task .task-pro-head .head-left,
.task-pro-task .task-pro-head .head-right {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.task-pro-task .task-pro-head .head-left {
  float: left;
  font-size: 16px;
}
.task-pro-task .task-pro-head .head-right {
  float: right;
  font-size: 14px;
}
.task-pro-task .task-pro-head .head-left .task-cn {
  color: #4ccfff;
  margin: 0 10px 0 0;
}
.task-pro-task .task-pro-head .head-left .task-type {
  color: #7a939e;
}
.task-pro-task .task-pro-head .head-right .label {
  color: #7a939e;
  margin: 0 10px 0 0;
}
.task-pro-task .task-pro-head .head-right .switch {
  margin: 0 20px 0 0;
}
.pro-task-opr-cont-pop {
  display: flex;
  padding: 12px;
}
.pro-task-opr-cont-pop .cont-label {
  font-size: 14px;
  color: #7a939e;
  height: 14px;
  margin-bottom: 12px;
}
.pro-task-opr-cont-pop .cont-cont {
  font-size: 16px;
  color: #fff;
  height: 16px;
  word-wrap: break-word;
}
.temp-pro-task-dialog {
  height: 610px;
  width: 870px;
}
.temp-pro-task-dialog .el-form-item__content {
  height: 16px !important;
  line-height: 16px;
}
.task-pro-cont-table-thead {
  height: 44px;
  color: #7a939e;
}
.task-pro-cont-table {
  width: 100%;
}
.task-pro-cont-table-tr {
  height: 44px;
  color: #fff;
}
.task-pro-cont-table-tr .cont-tr-div {
  float: left;
}
.task-pro-cont-table tr>th {
  text-align: left;
}
.task-pro-cont-table tr>th:first-of-type,
.task-pro-cont-table tr>.tr-div-td>td:first-of-type {
  padding-left: 20px;
}
.cont-tr-div {
  display: flex;
  justify-content: left;
}
.cont-tr-div>div {
  height: 44px;
  line-height: 44px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.table-opt-col {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 44px;
}
.task-pro-cont-table-div .table-opt-col {
  padding-left: 10px;
}
.td-edit-div {
  margin-right: 10px;
}
.td-edit-div input {
  border-radius: 6px;
}
</style>
