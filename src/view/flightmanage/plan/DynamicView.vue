<template>
  <el-container direction="vertical">
    <el-header class="query-contain">
      <Query-view :data="queryRowGroup" class="left" @keyupEnter="queryDataReq()"></Query-view>
      <div class="left-button">
        <el-button type="info" icon="el-icon-search" plain @click="cleanQueryData()">清空</el-button>
        <el-button type="primary" icon="el-icon-search" @click="queryDataReq()">查询</el-button>
        <el-dropdown trigger="click">
          <el-button type="success" icon="el-icon-more-outline">更多</el-button>
          <el-dropdown-menu slot="dropdown" class="morrow-button-dpd">
            <el-dropdown-item :divided="true" @click.native="openTransDialog">生成次日计划</el-dropdown-item>
            <el-dropdown-item :divided="true" @click.native="jointReq">航班拼接</el-dropdown-item>
            <el-dropdown-item :divided="true" @click.native="unJointReq">断开拼接</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <el-main class="whole-table-view mult-title-table">
      <div class="whole-table-header">
        <div class="whole-table-title">查询结果</div>
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
      <whole-table-view :permissions="permissions" :tableData="tableData" ref="basicTable"
      @handleDetail="handleDetail" @handleEdit="handleEdit" @handleDelete="handleDelete" @tableRowContextmenu="tableRowContextmenu">
      </whole-table-view>
      <Menu-right-view :menuData="menuData"></Menu-right-view>
    </el-main>
    <Edit-view :formData="formData" @handleAdd="saveAdd" @handleEdit="saveEdit">
      <template slot="slot-scope" slot-scope="scopeTemp">
        <div class="pro-task-opr-div-com pro-tasks-opr-div">
          <div class="task-pro-div">
            <div class="task-div-header">{{scopeTemp.item.label}}<div v-if="formData.title!='详情'" class="add-button">
              <div :class="((formData.title!='详情')&&(!scopeTemp.item.editIndex)&&(scopeTemp.item.editIndex!=0))?'tool-div-button tool-add':'tool-div-button tool-add div-disabled'" @click="((formData.title!='详情')&&(!scopeTemp.item.editIndex)&&(scopeTemp.item.editIndex!=0))&&addOpr(scopeTemp)"></div>
            </div></div>
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
                            <el-select v-if="field.type == 'select'" v-model="item[field.propObj]" :placeholder="field.label" @change="itemChangeHandle(item, field)"
                            :filterable="true" :clearable="true" :value-key="field.valueKey">
                              <el-option v-for="option in field.options" :key="option[field.itemKey]" :label="option[field.itemLabel]" :value="field.hasOwnProperty('valueKey') ? option : option[field.itemKey]">
                                <span style="float: left">{{ option[field.itemLabel] }}</span>
                                <span v-if="field.hasOwnProperty('itemLabelSpan')" style="float: right; color: #8492a6; font-size: 13px">{{ option[field.itemLabelSpan] }}</span>
                              </el-option>
                            </el-select>
                            <el-time-picker v-if="field.type == 'time'" class="change-padding" v-model="item[field.prop]" :prefix-icon="field.iconClass" :editable="true" :clearable="true" :format="field.format" :value-format="field.valueFormat" :placeholder="field.label" :picker-options="field.pickerOpt">
                            </el-time-picker>
                            <el-date-picker v-if="field.type == 'datetime'" class="change-padding" v-model="item[field.prop]" :type="field.type" :prefix-icon="field.iconClass" :editable="true" :clearable="true" :format="field.format" :value-format="field.valueFormat" :placeholder="'请选择' + field.label"
                            :default-value="item.defaultDate"></el-date-picker>
                          </div>
                        </td>
                        <td class="cont-tr-div table-opt-col">
                          <div :class="(canSave(scopeTemp, item))?'tool-div-button opr-edit-save':'tool-div-button opr-edit-save div-disabled'"
                          @click="saveOpr(scopeTemp, item, index)"></div>
                          <div class="tool-div-button opr-edit-cancel" @click="cancelOpr(scopeTemp, index)"></div>
                        </td>
                      </div>
                      <div v-else class="tr-div-td">
                        <td v-for="field in scopeTemp.item.tabelFields" :key="field.prop" class="cont-tr-div" :width="field.width">
                          <div v-if="field.hasOwnProperty('propCn')">{{item[field.propCn]}}</div>
                          <div v-else-if="field.type == 'datetime'">{{item[field.prop]}}</div>
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
    <el-dialog :visible.sync="formData.edit.visible" :close-on-click-modal="false" width="240px" append-to-body class="other-dialog plan-edit-dialog" @close="closeEditDialog">
      <div slot="title" class="dialog-header">
        <img :src="require('@img/title_deco.png')" />
        <span class="header-title">提示</span>
      </div>
      <div class="dialog-body">
        <div>请选择需要{{formData.title=='详情'?'查看':'编辑'}}的信息</div>
        <div>
          <el-radio-group v-model="formData.edit.type"><!--  :change="valueChange(data)" -->
            <el-radio-button v-for="option in options.fltType.options" :key="option.key" :label="option.key"> {{ option.value }}</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeEditDialog">关 闭</el-button>
        <el-button type="primary" @click="handleEditConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="transData.visible" :close-on-click-modal="false" width="400px" append-to-body class="other-dialog sched-plan-dialog" @close="closeTransDialog">
      <div slot="title" class="dialog-header">
        <img :src="require('@img/title_deco.png')" />
        <span class="header-title">生成次日计划</span>
      </div>
      <div class="dialog-body">
        <div>请选择生成计划的时间区间</div>
        <div>
          <el-date-picker v-model="transData.data['beginTime']" type="datetime" placeholder="请选择开始时间" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm"></el-date-picker>
        </div>
        <div>
          <el-date-picker v-model="transData.data['endTime']" type="datetime" placeholder="请选择结束时间" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm"></el-date-picker>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeTransDialog">关 闭</el-button>
        <el-button type="primary" :loading="transData.loading" @click="handleTransConfirm()">确 定</el-button>
      </div>
    </el-dialog>
    <Warning-box-view :data="changeData" @handleConfirm="handleChange" @handleClose="closeChangeDialog"></Warning-box-view>
    <Warning-box-view :data="confirmData" @handleConfirm="handleConfirmPlan" @handleClose="handleConfirmPlanClose"></Warning-box-view>
  </el-container>
</template>

<script>
import MenuRightView from '../../../components/common/MenuRight/MenuRightView'
import QueryView from '../../../components/common/QueryView'
import WholeTableView from '../../../components/common/BaseWholeTableView'
import ToolButtonView from '../../../components/common/ToolButtonView'
import EditView from '../../../components/common/EditView'
import baseMixin from '../../../components/mixin/baseMixin'
import basicTableMixin from '../../../components/mixin/basicTableMixin'
import wholeTableMixin from '../../../components/mixin/wholeTableMixin'
import basicMsgMixin from '../../../components/mixin/basicMsgMixin'
import {flightNumReg} from '../../../util/rules.js'
import {postAllData, queryAll, upload, download, postData} from '../../../api/base.js'
import _ from 'lodash'

// const tableHeight = ''

export default {
  components: {
    MenuRightView,
    QueryView,
    WholeTableView,
    ToolButtonView,
    EditView
  },
  mixins: [baseMixin, basicTableMixin, wholeTableMixin, basicMsgMixin],
  data () {
    return {
      menuData: {
        show: false,
        style: {
          x: 0,
          y: 0
        },
        data: {},
        items: [
        {
          label: '确认',
          disabled: false,
          method: this.confirmPlan
        }
      ]
      },
      jointUrl: '/planFlight/jointPlanFlight',
      unJointUrl: '/planFlight/breakJointPlanFlight',
      changeData: {
        title: '提示',
        info: '当前航班已确认，是否修改此航班 ?',
        width: '500px',
        class: ' dialog-delete-warn',
        warning: ' ',
        visible: false,
        loading: false,
        method: null,
        index: null,
        row: null
      },
      confirmData: {
        title: '确认航班',
        info: '是否确认此航班 ?',
        width: '500px',
        class: ' dialog-delete-warn',
        warning: ' ',
        visible: false,
        loading: false,
        url: '/planFlight/confirmPlanFlight',
        id: null
      },
      name: '',
      dfsUrl: '',
      aptLoc: '',
      options: {
        airport: {
          options: [],
          optionsRemove: []
        },
        fltType: {
          key: 'fltType',
          options: []
        }
      },
      transData: {
        loading: false,
        visible: false,
        url: '/scheduleFlight/generatePlanFlight',
        data: {
          beginTime: '',
          endTime: ''
        }
      },
      // 菜单对应按钮权限
      permissions: {
        add: false,
        update: false,
        delete: false,
        export: false,
        import: false
      },
      // 基础路径
      baseUrl: 'dynamicFlight/', // +save  delete  update
      queryUrl: 'dynamicFlight/queryDynamicFlightVOs',
      formData: {
        title: '新增',
        visible: false,
        inline: true,
        width: '730px',
        className: 'twiceCol',
        key: 'scheduleFlightId',
        edit: {
          url: '/planFlight/queryPlanFlightDetail',
          type: 'A',
          id: null,
          row: {},
          visible: false
        },
        formData: [
          {key: 'dynamicFlightId', label: '编号', type: 'pInput', isHidden: true},
          {key: 'airline', label: '航空公司', type: 'select', filterable: true, getOptions: '/basicdata/airline/queryAll', itemKey: 'airlineIata', itemLabel: 'briefC'},
          {key: 'flightNo', label: '航班号', type: 'input', toUpper: true, maxlength: 5},
          {key: 'execDate', label: '执行日期', type: 'date', format: 'yyyy-MM-dd', valueFormat: 'yyyy-MM-dd', defaultValue: ''},
          {key: 'attr', label: '属性', type: 'tabs', tabsKey: 'attr', options: []},
          {key: 'task', label: '航班任务', type: 'select', filterable: true, getOptions: '/basicdata/flighttask/queryAll', itemKey: 'taskCode', itemLabel: 'briefC'},
          {key: 'inOutFlag', label: '进出标识', type: 'tabs', tabsKey: 'fltType', options: [], change: this.changeFlag},
          {key: 'aircraftNo', label: '机号', type: 'select', filterable: true, getOptions: '/basicdata/aircraft/queryAll', itemKey: 'aircraftNo', itemLabel: 'aircraftNo', change: this.changeArcft},
          {key: 'aircraftType', label: '机型', type: 'select', filterable: true, getOptions: '/basicdata/aircraftType/queryAll', itemKey: 'aircraftIcao', itemLabel: 'aircraftIcao', change: this.changeArcftType},
          {key: 'startStation', label: '始发站', type: 'select', filterable: true, itemKey: 'airportIata', itemLabel: 'briefC', holdRule: true},
          {key: 'terminalStation', label: '目的站', type: 'select', filterable: true, itemKey: 'airportIata', itemLabel: 'briefC', holdRule: true},
          // {key: 'prevStation', label: '前站', type: 'select', filterable: true, itemKey: 'airportIata', itemLabel: 'briefC', holdRule: true},
          // {key: 'nextStation', label: '下站', type: 'select', filterable: true, itemKey: 'airportIata', itemLabel: 'briefC', holdRule: true},
          {key: 'dateRange', key1: 'std', key2: 'sta', label: '计划起飞/降落时间', label1: '计划起飞时间', label2: '计划降落时间', type: 'dateRangePicker', rangeMethod: this.dateRangeReg, dateType: 'datetime', required: 3, format: 'yyyy-MM-dd HH:mm', valueFormat: 'yyyy-MM-dd HH:mm', class: 'auto-width'},
          {key: 'dateRange1', key1: 'etd', key2: 'eta', label: '预计起飞/降落时间', label1: '预计起飞时间', label2: '预计降落时间', type: 'dateRangePicker', rangeMethod: this.dateRangeReg, dateType: 'datetime', format: 'yyyy-MM-dd HH:mm', valueFormat: 'yyyy-MM-dd HH:mm', class: 'auto-width'},
          {key: 'dateRange2', key1: 'atd', key2: 'ata', label: '实际起飞/降落时间', label1: '实际起飞时间', label2: '实际降落时间', type: 'dateRangePicker', rangeMethod: this.dateRangeReg, dateType: 'datetime', format: 'yyyy-MM-dd HH:mm', valueFormat: 'yyyy-MM-dd HH:mm', class: 'auto-width'},
          {key: 'progressStatus', label: '进展状态', type: 'select', filterable: true, getOptions: '/basicdata/flightstatus/queryAll', itemKey: 'statusCode', itemLabel: 'nameC', optionsQuery: {abnormalFlag: 'N'}},
          {key: 'abnormalStatus', label: '异常状态', type: 'select', filterable: true, getOptions: '/basicdata/flightstatus/queryAll', itemKey: 'statusCode', itemLabel: 'nameC', optionsQuery: {abnormalFlag: 'Y'}},
          {key: 'abnormalReason', label: '异常原因', type: 'select', filterable: true, getOptions: '/basicdata/abnormalreason/queryAll', itemKey: 'reasonCode', itemLabel: 'nameC'},
          // {key: 'alternateStationCn', label: '备降站', type: 'select', filterable: true, getOptions: '/basicdata/aircraftType/queryAll', itemKey: 'aircraftIcao', itemLabel: 'aircraftIcao'},
          // {key: 'alternateReason', label: '备降原因', type: 'select', filterable: true, getOptions: '/basicdata/aircraftType/queryAll', itemKey: 'aircraftIcao', itemLabel: 'aircraftIcao'},
          {key: 'vipFlag', label: 'VIP标识', type: 'tabs', tabsKey: 'isYOrN', options: []},
          {key: 'stand', label: '停机位', type: 'select', filterable: true, getOptions: '/airportResource/aircraftStand/queryAll', itemKey: 'standNo', itemLabel: 'standNo', change: this.changeStand},
          {key: 'terminal', label: '航站楼', type: 'select', filterable: true, getOptions: '/airportResource/terminal/queryAll', itemKey: 'terminalNo', itemLabel: 'name', change: this.changeTmn},
          {key: 'runway', label: '跑道', type: 'select', filterable: true, getOptions: '/airportResource/runway/queryAll', itemKey: 'runwayNo', itemLabel: 'runwayNo'},
          {key: 'agency', label: '代理', type: 'select', filterable: true, getOptions: '/basicdata/agency/queryAll', itemKey: 'code', itemLabel: 'briefC'},
          {key: 'belt', label: '行李转盘', type: 'select', filterable: true, getOptions: '/airportResource/terminalResource/queryAll', itemKey: 'resourceId', itemLabel: 'resourceNo', optionsQuery: {resourceType: 'BELT'}},
          {key: 'checkinRegion', label: '值机区域', type: 'select', filterable: true, getOptions: '/airportResource/terminalArea/queryAll', itemKey: 'terminalAreaNo', itemLabel: 'name'},
          {key: 'checkinCounter', label: '值机柜台', type: 'select', filterable: true, getOptions: '/airportResource/terminalResource/queryAll', itemKey: 'resourceId', itemLabel: 'resourceNo', optionsQuery: {resourceType: 'COUNTER'}},
          {key: 'gate', label: '登机口', type: 'select', filterable: true, getOptions: '/airportResource/gate/queryAll', itemKey: 'gateNo', itemLabel: 'gateNo'},
          {key: 'chute', label: '行李滑槽', type: 'select', filterable: true, getOptions: '/airportResource/terminalResource/queryAll', itemKey: 'resourceId', itemLabel: 'resourceNo', optionsQuery: {resourceType: 'CHUTE'}},
          {key: 'psgNumTotal', label: '旅客总数', type: 'number', position: 'right', step: 1, min: 0},
          {key: 'psgNumAdult', label: '成人', type: 'number', position: 'right', step: 1, min: 0},
          {key: 'psgNumBaby', label: '婴儿', type: 'number', position: 'right', step: 1, min: 0},
          {key: 'lugNumTotal', label: '交运行李数', type: 'number', position: 'right', step: 1, min: 0},
          {key: 'dateRange3', key1: 'lugTimeF', key2: 'lugTimeL', label: '首/末件行李上架时间', label1: '首件行李上架时间', label2: '末件行李上架时间', type: 'dateRangePicker', rangeMethod: this.dateRangeReg, dateType: 'datetime', format: 'yyyy-MM-dd HH:mm', valueFormat: 'yyyy-MM-dd HH:mm', class: 'auto-width'},
          {
            key: 'lstDynamicFlightStation',
            label: '经停站',
            type: 'slot',
            class: 'whole-width',
            editIndex: null,
            editType: 0,
            getOptions: '/basicdata/airport/queryAll',
            saveKey: 'lstDynamicFlightStation',
            tabelFields: [
              {prop: 'station', label: '经停站', propObj: 'stationObj', propCn: 'stationCn', type: 'select', width: '140', valueKey: 'airportIata', itemKey: 'airportIata', itemLabel: 'briefC'},
              {prop: 'sta', label: '计划降落', type: 'datetime', iconClass: 'a', width: '155', format: 'yyyy-MM-dd HH:mm', valueFormat: 'yyyy-MM-dd HH:mm'},
              {prop: 'std', label: '计划起飞', type: 'datetime', iconClass: 'a', width: '155', format: 'yyyy-MM-dd HH:mm', valueFormat: 'yyyy-MM-dd HH:mm'},
              {prop: 'sortkey', label: '航站顺序', width: '70', type: 'number', min: 0, max: 999}
            ],
            tempData: {},
            tempArr: []
          },
          {
            key: 'lstShareFlightStation',
            label: '共享航班',
            type: 'slot',
            class: 'whole-width',
            editIndex: null,
            editType: 0,
            getOptions: '/basicdata/airline/queryAll',
            saveKey: 'lstShareFlightStation',
            tabelFields: [
              {prop: 'airline', label: '航空公司', propObj: 'airlineObj', propCn: 'airlineCn', type: 'select', width: '250', valueKey: 'airlineIata', itemKey: 'airlineIata', itemLabel: 'briefC'},
              {prop: 'flightNo', label: '航班号', width: '250', type: 'input', maxlength: 5, required: true}
            ],
            tempData: {},
            tempArr: []
          }
        ],
        rules: {
          airline: [
            {required: true, message: '必填项', trigger: 'blur'}
          ],
          flightNo: [
            {required: true, message: '必填项', trigger: 'blur'},
            {validator: flightNumReg, trigger: 'blur'}
          ],
          attr: [
            {required: true, message: '必填项', trigger: 'blur'}
          ],
          task: [
            {required: true, message: '必填项', trigger: 'blur'}
          ],
          execDate: [
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
          aircraftNo: [
            {required: true, message: '必填项', trigger: 'blur'}
          ]
        }
      },
      // 查询条件每行个数
      colSize: 5,
      // 查询条件设置
      queryList: [
        {
          // 'p': '航班号',
          key: 'flightNo',
          value: '',
          type: 'input',
          inputText: '航班号',
          toUpper: true,
          span: 3
        }, {
          // 'p': '开始时间',
          key: 'beginDate',
          value: null,
          type: 'date',
          editable: false,
          clearable: true,
          inputText: '开始时间',
          valueFormat: 'yyyy-MM-dd',
          span: 3
        }, {
          // 'p': '结束时间',
          key: 'endDate',
          value: null,
          type: 'date',
          editable: false,
          clearable: true,
          inputText: '结束时间',
          valueFormat: 'yyyy-MM-dd',
          span: 3
        }
      ],
      // 列表设置
      tableData: {
        loading: false,
        data: [],
        type: 'selection',
        headerStyle: '',
        oprWidth: 100,
        key: 'afid',
        multipleSelection: [],
        tableRowClassName: this.tableRowClassName,
        headerNum: 1,
        leftFields: [
          {prop: 'flightNum', label: '航班号', width: 80, fixed: true, hidden: false},
          {prop: 'execDate', label: '执行日期', width: 100, fixed: false, hidden: false, formatter: this.formatterDay},
          {prop: 'attr', label: '属性', width: 80, fixed: true, hidden: false, optionKey: 'attr'},
          {prop: 'taskCn', label: '任务', width: 80, fixed: true, hidden: false},
          {prop: 'inOutFlagCn', label: '进出标识', width: 80, fixed: true, hidden: false},
          {prop: 'aircraftType', label: '机型', width: 100, fixed: true, hidden: false, overflow: true},
          {prop: 'aircraftNo', label: '机号', width: 80, fixed: true, hidden: false},
          {prop: 'stand', label: '机位', width: 80, childClass: 'standClass', fixed: true, hidden: false}
        ],
        centerFields: [
          {prop: 'shareFlights', label: '共享航班', width: 120, fixed: false, hidden: false, overflow: true},
          {prop: 'startStationCn', label: '始发站', width: 120, fixed: false, hidden: false, overflow: true},
          {prop: 'terminalStationCn', label: '目的站', width: 120, fixed: false, hidden: false, overflow: true},
          {prop: 'routeCn', label: '航线', width: 300, fixed: true, hidden: false, overflow: true},
          {prop: 'std', label: '计划起飞', width: 80, fixed: false, hidden: false, formatter: this.formatterMin},
          {prop: 'etd', label: '预计起飞', width: 80, fixed: false, hidden: false, formatter: this.formatterMin},
          {prop: 'atd', label: '实际起飞', width: 80, fixed: false, hidden: false, formatter: this.formatterMin},
          {prop: 'sta', label: '计划到达', width: 80, fixed: false, hidden: false, formatter: this.formatterMin},
          {prop: 'eta', label: '预计到达', width: 80, fixed: false, hidden: false, formatter: this.formatterMin},
          {prop: 'ata', label: '实际到达', width: 80, fixed: false, hidden: false, formatter: this.formatterMin},
          {prop: 'htot', label: '协调起飞', width: 80, fixed: false, hidden: false, formatter: this.formatterMin},
          {prop: 'prevStation', label: '前站', width: 80, fixed: false, hidden: false, formatter: this.formatterMin},
          {prop: 'nextStation', label: '下站', width: 80, fixed: false, hidden: false, formatter: this.formatterMin},
          {prop: 'prevDepTimeS', label: '前站计划起飞', width: 80, fixed: false, hidden: false, formatter: this.formatterMin},
          {prop: 'prevDepTimeE', label: '前站预计起飞', width: 80, fixed: false, hidden: false, formatter: this.formatterMin},
          {prop: 'prevDepTimeA', label: '前站实际起飞', width: 80, fixed: false, hidden: false, formatter: this.formatterMin},
          {prop: 'progressStatusCn', label: '进展状态', width: 100, fixed: false, hidden: false},
          {prop: 'abnormalStatusCn', label: '异常状态', width: 120, fixed: false, hidden: false, optionKey: 'abnormalFlag'},
          {prop: 'abnormalReasonCn', label: '异常原因', width: 180, fixed: false, hidden: false},
          {prop: 'alternateStationCn', label: '备降站', width: 180, fixed: false, hidden: false},
          {prop: 'alternateReason', label: '备降原因', width: 180, fixed: false, hidden: false},
           {prop: 'vipFlag', label: 'VIP标识', type: 'tabs', hidden: false, optionKey: 'isYOrN', formatter: this.formatterFlag, width: 70, edit: true},
          {prop: 'agency', label: '代理', width: 120, fixed: false, hidden: false},
          {prop: 'runway', label: '跑道', width: 120, fixed: false, hidden: false},
          {prop: 'belt', label: '转盘', width: 80, fixed: false, hidden: false},
          {prop: 'checkinRegion', label: '值机区域', width: 80, fixed: false, hidden: false},
          {prop: 'checkinCounter', label: '值机柜台', width: 80, fixed: false, hidden: false},
          {prop: 'gate', label: '登机口', width: 90, fixed: false, hidden: false},
          {prop: 'chute', label: '行李滑槽', width: 90, fixed: false, hidden: false},
          {prop: 'psgNumTotal', label: '旅客总数', width: 80, fixed: false, hidden: false},
          {prop: 'psgNumAdult', label: '成人', width: 80, fixed: false, hidden: false},
          {prop: 'psgNumBaby', label: '婴儿', width: 80, fixed: false, hidden: false},
          {prop: 'lugNumTotal', label: '交运行李数', width: 120, fixed: true, hidden: false},
          {prop: 'lugTimeF', label: '首件行李上架时间', width: 130, fixed: true, hidden: false, formatter: this.formatterHHMM},
          {prop: 'lugTimeL', label: '末件行李上架时间', width: 130, fixed: true, hidden: false, formatter: this.formatterHHMM}
        ],
        rightFields: [
          {prop: 'terminal', label: '航站楼', width: 90, fixed: false, hidden: false}
        ],
        editData: {
          url: '/planFlight/updateAircraftNoAndVipFlag',
          index: null,
          tempObj: {}
        }
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
    this.$store.commit('setOption', this.options.fltType.key)
    this.options.fltType.options = this.$store.getters.getOption
  },
  methods: {
    // customQueryMethod () {
    //   this.$set(this.queryData, 'remark', 'S')
    // },
    dateRangeReg (rule, value, callback) {
      if (value.hasOwnProperty('start') && value.hasOwnProperty('end')) {
        if (value.start && value.end) {
          if (value.start >= value.end) {
            let same = this.formData.formData.filter((obj) => {
              return obj.key == rule.field
            })
            callback(new Error(same.regInfo ? same.regInfo : '起飞时间必须小于降落时间'))
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
            this.$set(this.formData.formData[i], 'options', this.options.airport.options)
            station[0].key = this.formData.formData[i].key
          }
          if (this.formData.formData[i].key == 'startStation') {
            this.$set(this.formData.formData[i], 'disabled', false)
            this.$set(this.formData.formData[i], 'options', this.options.airport.optionsRemove)
            station[1].key = this.formData.formData[i].key
          }
        }
      } else { // 出港->始发站为本站点
        for (let i = 0; i < this.formData.formData.length; i++) {
          if (this.formData.formData[i].key == 'startStation') {
            this.$set(this.formData.formData[i], 'disabled', true)
            this.$set(this.formData.formData[i], 'options', this.options.airport.options)
            station[0].key = this.formData.formData[i].key
          }
          if (this.formData.formData[i].key == 'terminalStation') {
            this.$set(this.formData.formData[i], 'disabled', false)
            this.$set(this.formData.formData[i], 'options', this.options.airport.optionsRemove)
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
    addOpr (scopeTemp) {
      scopeTemp.item.tempData = {}
      let obj = {}
      scopeTemp.item.tabelFields.forEach(field => {
        this.$set(obj, field.prop, null)
      })
      scopeTemp.item.tempArr.push(obj)
      scopeTemp.item.editIndex = scopeTemp.item.tempArr.length - 1
      scopeTemp.item.editType = 0
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
    },
    deleteOpr (scopeTemp, item, index) {
      scopeTemp.item.editIndex = null
      scopeTemp.item.editType = null
      scopeTemp.item.tempArr.splice(index, 1)
    },
    canSave (scopeTemp, item) {
      let can = true
      _.forEach(scopeTemp.item.tabelFields, (field) => {
        if (!item[field.prop]) {
          can = false
        }
      })
      return can
    },
    saveOpr (scopeTemp, item, index) {
      let can = this.canSave(scopeTemp, item)
      if (scopeTemp.item.key == 'lstDynamicFlightStation') {
        if (can) {
          if (item[scopeTemp.item.tabelFields[1].prop] < item[scopeTemp.item.tabelFields[2].prop]) {
            let result = this.oprSortkeyReg(item.sortkey)
            if (result) {
              this.showError('保存', '航站顺序' + result)
            } else {
              scopeTemp.item.editIndex = null
              scopeTemp.item.editType = null
            }
          } else {
            this.showError('保存经停站', '降落时间必须小于起飞时间 !')
          }
        }
      } else {
        // 共享
        if (can) {
          let reg = /^[0-9]{3,4}[a-zA-Z]?$/
          if (!reg.test(item[scopeTemp.item.tabelFields[1].prop])) {
            this.showError('保存共享航班', '航班号必须为3~4位数字加0~1位字母 !')
          } else {
            scopeTemp.item.editIndex = null
            scopeTemp.item.editType = null
          }
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
    openTransDialog () {
      this.transData.visible = true
      let date = new Date(this.newTime.getTime() + 24 * 3600 * 1000)
      let day = `${date.getFullYear()}-${this.addZero(date.getMonth() + 1)}-${this.addZero(date.getDate())}`
      this.$set(this.transData.data, 'beginTime', day + ' 00:00')
      this.$set(this.transData.data, 'endTime', day + ' 23:59')
      document.addEventListener('keypress', this.handleTransConfirm, false)
      /* date.setHours(0, 0, 0)
      this.$set(this.transData.data, 'beginTime', new Date(date))
      date.setHours(23, 59, 59)
      this.$set(this.transData.data, 'endTime', new Date(date)) */
    },
    handleTransConfirm (event) {
      if ((event && event.keyCode == 13) || !event) {
        if (!this.transData.data['endTime'] || !Date.parse(this.transData.data['beginTime'])) {
          this.showError('生成次日计划', '开始时间/结束时间不能为空 !')
        } else {
          let dateSpan = Math.abs(Date.parse(this.transData.data['endTime']) - Date.parse(this.transData.data['beginTime']))
          let days = Math.ceil((dateSpan / (24 * 3600 * 1000)))
          if (days > 3) {
            this.showError('生成次日计划', '所选时间区间最多相差 3 天 !')
          } else if (days < 0) {
            this.showError('生成次日计划', '结束时间必须大于开始时间 !')
          } else {
            this.transData.loading = true
            postData(this.transData.url, this.transData.data).then(res => {
              if (res.data.code == 0) {
                this.showSuccess('生成次日计划')
                this.closeTransDialog()
                this.queryDataReq()
              } else {
                this.transData.loading = false
                this.showError('生成次日计划', '请重新尝试 !')
              }
            })
          }
        }
      }
    },
    closeTransDialog () {
      this.transData.loading = false
      this.transData.visible = false
      document.removeEventListener('keypress', this.handleTransConfirm)
    },
    jointReq () {
      queryAll(this.jointUrl, this.queryData).then(res => {
        if (res.data.code == 0) {
          this.showSuccess('航班拼接')
          this.queryUrl = res.data.data.path
          this.queryDataReq()
        } else {
          this.showError('航班拼接', '请重新尝试')
        }
      })
    },
    unJointReq () {
      queryAll(this.unJointUrl, this.queryData).then(res => {
        if (res.data.code == 0) {
          this.showSuccess('断开拼接')
          this.queryUrl = res.data.data.path
          this.queryDataReq()
        } else {
          this.showError('断开拼接', '请重新尝试')
        }
      })
    },
    handleEditConfirm (row) {
      if (this.formData.edit.type == 'A') {
        this.formData.edit.id = JSON.parse(JSON.stringify(this.formData.edit.row['planFlightIdA']))
      } else {
        this.formData.edit.id = JSON.parse(JSON.stringify(this.formData.edit.row['planFlightIdD']))
      }
      queryAll(this.formData.edit.url, this.formData.edit.id).then(res => {
        if (res.data.code == 0) {
          this.setEditInfo(res.data.data)
        } else {
          this.showError('获取当前计划信息', '请重新尝试 !')
        }
      })
    },
    setEditInfo (row) {
      let obj = _.filter(this.formData.formData, ['type', 'slot'])
      let urls = _.map(obj, 'getOptions')
      let datas = _.fill(Array(obj.length), {})
      postAllData(urls, datas).then(this.axios.spread((resa, resb) => {
        if (resa.data.code == 0) {
          this.options.airport.options = resa.data.data
          this.options.airport.optionsRemove = JSON.parse(JSON.stringify(this.options.airport.options))
          let index = _.findIndex(this.options.airport.optionsRemove, ['airportIata', this.aptLoc])
          this.options.airport.optionsRemove.splice(index, 1)
          if (resb.data.code == 0) {
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
                  _.forEach(this.formData.formData[i].tabelFields, (field) => {
                    if (field.hasOwnProperty('propObj')) {
                      _.forEach(this.formData.formData[i].tempArr, (temp) => {
                        let obj = {}
                        this.$set(obj, field.itemKey, temp[field.prop])
                        this.$set(obj, field.itemLabel, temp[field.propCn])
                        this.$set(temp, field.propObj, obj)
                      })
                    }
                    _.forEach(obj, (item) => {
                      if (this.formData.formData[i].key == item.key) {
                        if (field.prop == 'station') {
                          field.options = this.options.airport.optionsRemove
                        } else if (field.prop == 'airline') {
                          field.options = resb.data.data
                        }
                      }
                    })
                  })
                  this.formData.formData[i].editIndex = null
                }
              }
              if (row['inOutFlag'] == 'A') {
                if (this.formData.formData[i].key == 'terminalStation') {
                  this.$set(this.formData.formData[i], 'isDisabled', true)
                  this.$set(this.formData.formData[i], 'defaultValue', this.aptLoc)
                  this.$set(this.formData.formData[i], 'options', this.options.airport.options)
                }
                if (this.formData.formData[i].key == 'startStation') {
                  this.$delete(this.formData.formData[i], 'isDisabled')
                  this.$delete(this.formData.formData[i], 'disabled')
                  this.$set(this.formData.formData[i], 'options', this.options.airport.optionsRemove)
                }
              } else {
                if (this.formData.formData[i].key == 'startStation') {
                  this.$set(this.formData.formData[i], 'isDisabled', true)
                  this.$set(this.formData.formData[i], 'defaultValue', this.aptLoc)
                  this.$set(this.formData.formData[i], 'options', this.options.airport.options)
                }
                if (this.formData.formData[i].key == 'terminalStation') {
                  this.$delete(this.formData.formData[i], 'isDisabled')
                  this.$delete(this.formData.formData[i], 'disabled')
                  this.$set(this.formData.formData[i], 'options', this.options.airport.optionsRemove)
                }
              }
              if (this.formData.formData[i].key == 'prevStation') {
                this.$set(this.formData.formData[i], 'options', this.options.airport.optionsRemove)
              }
              if (this.formData.formData[i].key == 'nextStation') {
                this.$set(this.formData.formData[i], 'options', this.options.airport.optionsRemove)
              }
            }
            this.formData.visible = true
          } else {
            this.showError('获取航空公司信息', '请重新尝试 !')
          }
        } else {
          this.showError('获取机场信息', '请重新尝试 !')
        }
      }))
    },
    closeEditDialog () {
      this.formData.edit.type = this.options.fltType.options[0].key
      this.formData.edit.visible = false
      this.formData.edit.id = null
      this.formData.edit.row = {}
    },
    tableRowContextmenu (data) {
      this.menuData.style.x = data.x
      this.menuData.style.y = data.y
      this.menuData.data = data.item
      this.menuData.show = true
    },
    changeArcft (value, callback) {
      queryAll('/basicdata/aircraft/detail', value).then(res => {
        let aircraftType = {
          key: 'aircraftType',
          value: null
        }
        if (res.data.code == 0) {
          this.$set(aircraftType, 'value', res.data.data['aircraftIcao'])
          callback(aircraftType)
          return null
        } else {
          this.showError('通过飞机号获取机型信息', '请重新选择飞机号')
          callback(aircraftType)
          return null
        }
      })
    },
    changeArcftType (value, callback) {
      let aircraft = {
        key: 'aircraftNo',
        value: null
      }
      callback(aircraft)
      return null
    },
    changeStand (value, callback) {
      queryAll('/airportResource/aircraftStand/detail', value).then(res => {
        let terminal = {
          key: 'terminal',
          value: null
        }
        if (res.data.code == 0) {
          if (!_.isNull(res.data.data)) {
            this.$set(terminal, 'value', res.data.data['terminalNo'])
            callback(terminal)
            return null
          } else {
            this.showErrorCustom('该机位未设置航站楼', '请先为该机位设置航站楼 !')
            callback(terminal)
            return null
          }
        } else {
          this.showError('通过机位获取航站楼信息', '请重新选择机位')
          callback(terminal)
          return null
        }
      })
    },
    changeTmn (value, callback) {
      let stand = {
        key: 'stand',
        value: null
      }
      callback(stand)
      return null
    },
    confirmPlan (data) {
      if (data || this.confirmData.id != null) {
        this.confirmData.visible = true
        this.confirmData.id = data ? data.strPlanFlightId : this.confirmData.id
        document.addEventListener('keypress', this.handleConfirmPlan, false)
      }
    },
    handleConfirmPlan (event) {
      if ((event && event.keyCode == 13) || !event) {
        queryAll(this.confirmData.url, this.confirmData.id).then(res => {
          if (res.data.code == 0) {
            this.showSuccess('确认')
            this.handleConfirmPlanClose()
            this.queryDataReq()
          } else {
            this.confirmData.loading = false
            this.showError('确认', '请重新尝试 !')
          }
        })
      }
    },
    handleConfirmPlanClose () {
      this.confirmData.id = null
      this.confirmData.loading = false
      this.confirmData.visible = false
      document.removeEventListener('keypress', this.handleConfirmPlan)
    },
    handleChange (event) {
      if ((event && event.keyCode == 13) || !event) {
        if (this.changeData.method) {
          this.changeData.method()
          this.closeChangeDialog()
        }
      }
    },
    closeChangeDialog () {
      this.changeData.visible = false
      this.changeData.method = null
      this.changeData.index = null
      document.removeEventListener('keypress', this.handleChange)
    },
    // 新增
    handleAdd () {
      let obj = _.filter(this.formData.formData, ['type', 'slot'])
      let urls = _.map(obj, 'getOptions')
      let datas = _.fill(Array(obj.length), {})
      postAllData(urls, datas).then(this.axios.spread((resa, resb) => {
        if (resa.data.code == 0) {
          this.options.airport.options = resa.data.data
          this.options.airport.optionsRemove = JSON.parse(JSON.stringify(this.options.airport.options))
          let index = _.findIndex(this.options.airport.optionsRemove, ['airportIata', this.aptLoc])
          this.options.airport.optionsRemove.splice(index, 1)
          if (resb.data.code == 0) {
            for (let i = 0; i < this.formData.formData.length; i++) {
              if (this.formData.formData[i].type == 'slot') {
                if (this.formData.formData[i].hasOwnProperty('tempArr')) {
                  this.formData.formData[i].tempArr = []
                  this.formData.formData[i].editIndex = null
                  _.forEach(obj, (item) => {
                    if (this.formData.formData[i].key == item.key) {
                      _.forEach(this.formData.formData[i].tabelFields, (field) => {
                        if (field.prop == 'station') {
                          field.options = this.options.airport.optionsRemove
                        } else if (field.prop == 'airline') {
                          field.options = resb.data.data
                        }
                      })
                    }
                  })
                }
              }
              if (this.formData.formData[i].key == 'terminalStation') {
                this.$set(this.formData.formData[i], 'isDisabled', true)
                this.$set(this.formData.formData[i], 'defaultValue', this.aptLoc)
                this.$set(this.formData.formData[i], 'options', this.options.airport.options)
              }
              if (this.formData.formData[i].key == 'startStation') {
                this.$delete(this.formData.formData[i], 'isDisabled')
                this.$delete(this.formData.formData[i], 'disabled')
                this.$set(this.formData.formData[i], 'defaultValue', '')
                this.$set(this.formData.formData[i], 'options', this.options.airport.optionsRemove)
              }
              if (this.formData.formData[i].key == 'prevStation') {
                this.$set(this.formData.formData[i], 'options', this.options.airport.optionsRemove)
              }
              if (this.formData.formData[i].key == 'nextStation') {
                this.$set(this.formData.formData[i], 'options', this.options.airport.optionsRemove)
              }
              if (this.formData.formData[i].hasOwnProperty('tabsKey') && this.formData.formData[i].tabsKey == 'isYOrN') {
                this.formData.formData[i].defaultValue = 'N'
              }
              if (this.formData.formData[i].key == 'execDate') {
                this.$delete(this.formData.formData[i], 'isDisabled')
                this.$delete(this.formData.formData[i], 'disabled')
                let year = this.newTime.getFullYear()
                let month = this.newTime.getMonth() + 1
                let day = this.newTime.getDate()
                this.$set(this.formData.formData[i], 'defaultValue', year + '-' + month + '-' + day)
              }
            }
            this.formData.title = '新增'
            this.formData.visible = true
          } else {
            this.showError('获取航空公司信息', '请重新尝试 !')
          }
        } else {
          this.showError('获取机场信息', '请重新尝试 !')
        }
      }))
    },
    // 详情
    handleDetail (row) {
      this.formData.title = '详情'
      if (~_.findIndex(this.options.fltType.options, ['key', row['inOutFlag']])) {
        this.setEditInfo(JSON.parse(JSON.stringify(row)))
      } else {
        this.formData.edit.row = JSON.parse(JSON.stringify(row))
        this.formData.edit.visible = true
      }
    },
    // 编辑
    handleEdit (row) {
      if (row.confirmedFlag == 'Y') {
        this.changeData.row = row
        this.confirmData.id = row.strPlanFlightId
        this.changeData.method = this.editConfirm
        this.changeData.visible = true
        document.addEventListener('keypress', this.handleChange, false)
      } else {
        this.confirmData.id = null
        this.editConfirm(row)
      }
    },
    editConfirm (row) {
      if (row == null) {
        row = this.changeData.row
      }
      this.formData.title = '编辑'
      if (~_.findIndex(this.options.fltType.options, ['key', row['inOutFlag']])) {
        this.setEditInfo(JSON.parse(JSON.stringify(row)))
      } else {
        this.formData.edit.row = JSON.parse(JSON.stringify(row))
        this.formData.edit.visible = true
      }
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
    },
    customMethod () {
      this.confirmPlan()
    }
  }
}
</script>

<style>
/* .mult-title-table .el-table__fixed-body-wrapper {
  top: 40px !important
} */
.morrow-button-dpd>li:first-of-type {
  border-top: 0;
}
.morrow-button-dpd .el-dropdown-menu__item--divided {
  margin-top: 0;
  border-top: 1px solid rgba(60, 166, 200, 0.3);
}
.morrow-button-dpd .el-dropdown-menu__item--divided:before {
  height: 0 !important;
}
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
.plan-edit-dialog>.el-dialog {
  height: 250px;
}
.plan-edit-dialog .dialog-body>div:first-of-type {
  font-size: 18px;
  color: #7a939e;
  margin: 12px 0 20px 0;
}
.plan-edit-dialog .dialog-body>div:last-of-type {
  margin: 10px 30px;
}
.sched-plan-dialog>.el-dialog {
  height: 300px;
}
.sched-plan-dialog .dialog-body>div:first-of-type {
  font-size: 18px;
  color: #7a939e;
  margin: 12px 0 20px 0;
}
.sched-plan-dialog .dialog-body>div:last-of-type {
  margin: 10px 30px;
}
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
  margin-bottom: 12px;
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
