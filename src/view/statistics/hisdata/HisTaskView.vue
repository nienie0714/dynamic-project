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
                  <div v-for="(val, index) in obj.value" :key="index" class="his-info-arr-div">
                    <div>{{val[obj.showKey]}}</div>
                    <el-popover placement="bottom-start" popper-class="task-reason-popover" :disabled="val[obj.attachments].length <= 0">
                      <div>
                        <el-carousel trigger="click" arrow="always" :autoplay="false">
                          <el-carousel-item v-for="(imgUrl, index) in require('lodash').map(val[obj.attachments], 'attachmentUrl')" :key="index">
                            <img v-if="imgUrl.split('.')[imgUrl.split('.').length-1] != 'mp4'" :src="dfsUrl + imgUrl" @click="showWinImg(dfsUrl + imgUrl)" style="cursor: pointer;"/>
                            <video v-else width="240" height="423" controls="controls" autoplay="autoplay">
                              <source :src="dfsUrl + imgUrl" type="video/mp4" />
                              <object :data="dfsUrl + imgUrl" width="240" height="423">
                                <embed width="240" height="423" :src="dfsUrl + imgUrl" />
                              </object>
                            </video>
                          </el-carousel-item>
                        </el-carousel>
                        <div v-show="showImg" class="show-img" @click="showImg = false">
                          <img :src="imgSrc"/>
                        </div>
                      </div>
                      <div class="task-reason-popover-slot" slot="reference">
                        <div :class="val[obj.attachments].length <= 0 ? 'attachment-gray div-button' : 'attachment-white div-button'"></div>
                      </div>
                    </el-popover>
                  </div>
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
      baseUrl: 'taskscheduling/hisDynamicTaskRecord',
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
          {key: 'flightNo', label: '航班号', type: 'label', span: 6},
          {key: 'execDate', label: '航班日期', type: 'label', span: 6},
          {key: 'taskName', label: '任务名称', type: 'label', span: 6},
          {key: 'currState', label: '任务状态', type: 'label', span: 6},
          {key: 'teamName', label: '保障人员/班组', type: 'label', span: 24},
          {key: 'a1', label: '占位', type: 'label', span: 0},
          {key: 'a2', label: '占位', type: 'label', span: 0},
          {key: 'a3', label: '占位', type: 'label', span: 0},
          {key: 'distributeTime', label: '派发时间', type: 'label', formatter: true, span: 6},
          {key: 'receiveTime', label: '接受时间', type: 'label', formatter: true, span: 6},
          {key: 'beginTimeE', label: '预计开始', type: 'label', formatter: true, span: 6},
          {key: 'endTimeE', label: '预计结束', type: 'label', formatter: true, span: 6},
          {key: 'beginTimeA', label: '实际开始', type: 'label', formatter: true, span: 6},
          {key: 'endTimeA', label: '实际结束', type: 'label', formatter: true, span: 6},
          {key: 'costMinute', label: '保障时长/分', type: 'label', span: 6},
          {key: 'alarmFlag', label: '是否超时', type: 'label', span: 6},
          {key: 'exceptions', label: '异常信息', type: 'arr', showKey: 'exceptionDesc', attachments: 'attachments', span: 24},
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
          // 'p': '航班号',
          key: 'flightNo',
          value: '',
          toUpper: true,
          type: 'input',
          inputText: '航班号',
          span: 3
        },
        {
          // 'p': '时间区间',
          key: 'date',
          value: null,
          type: 'daterange',
          editable: false,
          clearable: true,
          rangeSeparator: '至',
          inputText: '时间范围',
          valueFormat: 'yyyy-MM-dd',
          format: 'yyyy-MM-dd',
          pickerOpt: {
            disabledDate: (time) => {
              let maxDate = new Date(this.latestDate)
              return time.getTime() > maxDate
            }
          },
          span: 6
        }, /* , {
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
        }, */
        {
          // 'p': '班组',
          key: 'teamName',
          value: '',
          type: 'input',
          inputText: '班组',
          span: 3
        }, {
          // 'p': '人员',
          key: 'empName',
          value: '',
          type: 'input',
          inputText: '人员',
          span: 3
        }, {
          // 'p': '任务',
          key: 'taskNo',
          value: '',
          type: 'select',
          filterable: true,
          optKey: 'taskNo',
          optLabel: 'taskCn',
          inputText: '任务名称',
          getOptions: 'taskbasic/tasks/queryAll',
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
        highlight: true,
        headerCellClass: 'tableHeaderCell-Center',
        rowClassName: this.tableRowClassName,
        multipleSelection: [],
        fields: [
          {prop: 'flightNo', label: '航班号', fixed: true, hidden: false, width: '180'},
          {prop: 'execDate', label: '航班日期', fixed: false, hidden: false, width: '110'},
          {prop: 'taskName', label: '任务名称', fixed: false, hidden: false},
          {prop: 'currState', label: '任务状态', fixed: false, hidden: false, width: '110'},
          {prop: 'taskOrEmpName', label: '保障人员/班组', fixed: false, hidden: false, width: '110'},
          {prop: 'distributeTime', label: '派发时间', fixed: false, hidden: false, formatter: this.formatterMin, width: '85'},
          {prop: 'receiveTime', label: '接受时间', fixed: false, hidden: false, formatter: this.formatterMin, width: '85'},
          {prop: 'beginTimeE', label: '预计开始', fixed: false, hidden: false, formatter: this.formatterMin, width: '85'},
          {prop: 'endTimeE', label: '预计结束', fixed: false, hidden: false, formatter: this.formatterMin, width: '85'},
          {prop: 'beginTimeA', label: '实际开始', fixed: false, hidden: false, formatter: this.formatterMin, width: '85'},
          {prop: 'endTimeA', label: '实际结束', fixed: false, hidden: false, formatter: this.formatterMin, width: '85'},
          {prop: 'costMinute', label: '保障时长/分', fixed: false, hidden: false, width: '100'},
          {prop: 'alarmFlag', label: '是否超时', fixed: false, hidden: false, optionKey: 'isZOrO', options: [{key: 1, value: '是'}, {key: 0, value: '否'}], width: '85'},
          {prop: 'exception', label: '是否异常', fixed: false, hidden: false, optionKey: 'isTOrF', options: [{key: true, value: '是'}, {key: false, value: '否'}], width: '85'}
        ]
      },
      showImg: false,
      imgSrc: null
    }
  },
  mounted () {
    this.$store.commit('setConfigValue', 'dfsUrl')
    this.dfsUrl = this.$store.getters.getConfigValue

    // 页面起始修改发送参数的初始值为当日
    this.$set(this.queryList[1], 'value', [this.formatterNewtimeOfYMD(), this.formatterNewtimeOfYMD()])
    this.$set(this.queryData, 'date', this.queryList[1].value)
  },
  methods: {
    showWinImg (src) {
      this.showImg = true
      this.imgSrc = src
    },
    customAfterQuery () {
      this.tableData.data.forEach(item => {
        if (item.teamName) {
          this.$set(item, 'taskOrEmpName', item.teamName)
        } else {
          this.$set(item, 'taskOrEmpName', item.empName)
        }
        if (item.endTimeE || item.endTimeA) {
          item.alarmFlag = item.endTimeA > item.endTimeE ? 1 : 0
        } else {
          item.alarmFlag = 0
        }
      })
    },
    // 详情
    handleDetail (row) {
      let that = this
      queryAll('/taskscheduling/hisDynamicTaskRecord/queryTaskDetail', row).then(res => {
        for (let i = 0; i < that.formData.formData.length; i++) {
          if (['exceptions', 'operations'].includes(that.formData.formData[i].key)) {
            this.$set(that.formData.formData[i], 'value', res.data.data[that.formData.formData[i].key])
          } else {
            if (['teamName'].includes(that.formData.formData[i].key)) {
              if (res.data.data.task.teamName) {
                that.$set(that.formData.formData[i], 'value', res.data.data.task[that.formData.formData[i].key])
              } else {
                that.$set(that.formData.formData[i], 'value', res.data.data.task.empName)
              }
            } else if (['alarmFlag'].includes(that.formData.formData[i].key)) {
              if (res.data.data.task.endTimeE || res.data.data.task.endTimeA) {
                let num = res.data.data.task.endTimeA > res.data.data.task.endTimeE ? 1 : 0
                that.$set(that.formData.formData[i], 'value', num)
              } else {
                that.$set(that.formData.formData[i], 'value', 0)
              }
            } else {
              that.$set(that.formData.formData[i], 'value', res.data.data.task[that.formData.formData[i].key])
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
    }
  }
}
</script>

<style scope>
.task-reason-popover-slot {
  flex-grow: 0;
  width: 30px;
  height: 30px;
  margin-left: 15px;
  margin-right: 10px;
}
.task-reason-popover-slot>div {
  width: 30px;
  height: 30px;
}
.attachment-gray {
  background-image: url('../../../assets/img/list_icon_gray.png');
  width: 30px;
  height: 30px;
  padding: 0 !important;
  cursor: auto;
}
.attachment-white {
  background-image: url('../../../assets/img/list_icon_white.png');
  width: 30px;
  height: 30px;
  padding: 0 !important;
  cursor: pointer;
}
</style>
