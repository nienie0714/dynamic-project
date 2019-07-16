<template>
  <div class="sched-plan-view">
    <div class="sched-plan-list">
      <div class="button-list">
        <div class="left">
          <el-button type="primary">指定换班</el-button>
          <el-button type="primary">非指定换班</el-button>
        </div>
        <div class="right">
          <el-button type="primary">导入</el-button>
        </div>
      </div>
      <div class="filter">
        <el-input v-model.trim="planData.queryData.planName" placeholder="请输入计划名称" @keyup.enter.native="queryList"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="queryList">查询</el-button>
      </div>
      <div class="list-table">
        <ul>
          <li v-for="(item, index) in planData.planList" :key="index" :class="selectIndex == index ? 'active' : ''" @click="clickPlan(index)">
            <div class="text">{{item.planName}}</div>
            <div class="opr">
              <div class="tool-div-button button-edit" title="编辑" @click="handleEdit(scope.row)"></div><!--  v-if="permissions.update" -->
              <div class="tool-div-button button-delete" title="删除" @click="handleDelete(scope.row)"></div><!--  v-if="permissions.delete" -->
            </div>
          </li>
        </ul>
      </div>
      <div class="insert-li">
        <el-button type="primary" @click="openPlanDialog">+ 新建排班计划</el-button>
      </div>
    </div>
    <div v-if="data && data.length > 0" class="sched-plan-date">
      <div class="date-header">
        <div>
          <div>&#60;</div>
          <div class="month">2019-07</div>
          <div>&#62;</div>
        </div>
      </div>
      <div class="date-body">
        <div class="table-title">
          <div class="left-frozen row-div date-div">
            <div>班次</div>
          </div>
          <div class="right-scroll" @mousewheel="scrollEvent">
            <div v-for="(col, cIndex) in data" :key="cIndex" class="title-div date-div">
              <div>{{col.date.substr(5, 5)}} {{col.week}}</div>
              <div>{{col.unitNames.join(' ')}}</div>
            </div>
          </div>
        </div>
        <div class="table-body">
          <div class="left-frozen" @mousewheel="scrollEvent">
            <div v-for="(row, rIndex) in shiftList" :key="rIndex" class="row-div cross date-div" :style="{height: rHeight[rIndex]}">
              <div>{{row.shiftName}}</div>
              <div>({{row.beginTime}}~{{row.endTime}})</div>
            </div>
          </div>
          <div class="scroll-div">
            <div class="right-scroll">
              <div v-for="(row, rIndex) in shiftList" :key="rIndex" :ref="'row' + rIndex" class="row-li">
                <div v-for="(col, cIndex) in data" :key="cIndex" class="row-div cross date-div unit-sub-list">
                  <div v-show="unitSubs(row, col)" v-for="(unitSub, i) in unitSubs(row, col)" :key="i" class="unit-sub-div" :title="unitSub.unitSubName">
                    {{unitSub.unitSubName}}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="newPlan.visible" :close-on-click-modal="false" append-to-body class="other-dialog sched-plan-dialog" @close="closePlanDialog">
      <div slot="title" class="dialog-header">
        <img :src="require('@img/title_deco.png')" />
        <span class="header-title">新建排班计划</span>
      </div>
      <div class="dialog-body">
        <div class="plan-step">
          <div v-for="(step, sIndex) in stepList" :key="sIndex" class="step-div">
            <div :class="['step-info', newPlan.index == sIndex ? 'active' : '']">
              <div>{{sIndex + 1}}</div>
              <div>{{step}}</div>
            </div>
            <div v-if="sIndex < stepList.length - 1" class="next-step"></div>
          </div>
        </div>
        <div class="plan-button"></div>
        <div class="plan-date-body">
          <template v-if="newPlan.index === 0">
            <div class="plan-info-div">
              <div class="info-label">计划名称<span class="require-label">*必填项</span></div>
              <div class="info-value">
                <el-input v-model.trim="newPlan.data.planName" placeholder="请输入计划名称"></el-input>
              </div>
            </div>
            <div class="plan-info-div info-title">日期范围</div>
            <div class="date-range-div">
              <div class="plan-info-div">
                <div class="info-label">开始日期~结束日期<span class="require-label">*必填项</span></div>
                <div class="info-value">
                  <el-date-picker type="daterange" v-model.trim="newPlan.data.date" range-separator="~" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                  start-placeholder="开始日期" end-placeholder="结束日期" @change="changeDateRange"></el-date-picker>
                </div>
              </div>
            </div>
            <div class="plan-info-div">
              <div class="info-label">排班周期<span class="require-label">*必填项</span></div>
              <div class="info-value">
                <el-radio-group v-model="newPlan.data.cycle" size="small" @change="changeCycle">
                  <el-radio-button v-for="val in cycleList" :key="val" :label="val"> {{ val }}</el-radio-button>
                </el-radio-group>
              </div>
            </div>
          </template>
          <template v-else-if="newPlan.index === 1">
            <div class="plan-info-div" style="height: calc(100% - 30px);">
              <div class="info-label">排班小组<span class="require-label">*必填项</span>（至少选择{{newPlan.data.cycle == cycleList[cycleList.length-1] ?'四':'三'}}个班组）</div>
              <div class="list-div">
                <div class="list-all">
                  <ul>
                    <li v-for="(unit, uIndex) in unitData.unitList" :key="uIndex" @click="selectUnit(unit)">
                      <div :class="~require('lodash').findIndex(newPlan.data.units, ['unitId', unit.unitId]) ? 'radio-button el-checkbox__input is-checked' : 'radio-button el-checkbox__input'">
                        <div class="el-checkbox__inner"></div>
                      </div>
                      <div>{{unit.unitName}}</div>
                    </li>
                  </ul>
                </div>
                <div class="list-select">
                  <div class="table-title">
                    <div class="unit-left-frozen row-div date-div">
                      <div></div>
                    </div>
                    <div class="unit-right-scroll" @mousewheel="scrollUnitEvent">
                      <div v-for="col in cycleLength" :key="col" class="title-div date-div">
                        <div>第{{col}}天</div>
                      </div>
                    </div>
                  </div>
                  <div class="table-body">
                    <div class="unit-left-frozen" @mousewheel="scrollUnitEvent">
                      <div v-for="(unit, rIndex) in newPlan.data.units" :key="rIndex" class="row-div cross date-div" style="height: 100px;">
                        <div>{{unit.unitName}}</div>
                      </div>
                    </div>
                    <div class="scroll-unit-div">
                      <div class="unit-right-scroll">
                        <div v-for="(unit, rIndex) in newPlan.data.units" :key="rIndex" class="row-li" style="height: 100px;">
                          <div v-for="(col, cIndex) in cycleLength" :key="cIndex" class="row-div cross date-div unit-sub-list">
                            <!-- <el-button type="primary">点击选择</el-button> -->
                            <div v-if="unit.workDays.includes(cIndex)" class="unit-sub-work-div" @click="changeWork(rIndex, cIndex)">上班</div>
                            <div v-else :class="['unit-sub-unwork-div', (cycleMax===newPlan.data.units[rIndex].workDays.length)?'disabled':'']"
                            @click="(newPlan.data.units[rIndex].workDays.length<cycleMax) && changeWork(rIndex, cIndex)">休息</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="newPlan.index == 2">
            <div class="plan-info-div" style="height: 100%;">
              <div class="info-label">班次选择<span class="require-label">*必填项</span></div>
              <div class="list-div" style="height: calc(100% - 30px);">
                <div class="list-all-div">
                  <div class="info-label">待选班次</div>
                  <div class="list-all">
                    <ul>
                      <li v-for="(shift, sIndex) in shiftData.shiftList" :key="sIndex" @click="selectShift(shift)">
                        <div :class="~require('lodash').findIndex(newPlan.data.shifts, ['shiftId', shift.shiftId]) ? 'radio-button el-checkbox__input is-checked' : 'radio-button el-checkbox__input'">
                          <div class="el-checkbox__inner"></div>
                        </div>
                        <div>{{shift.shiftName}}({{shift.beginTime}}~{{shift.endTime}})</div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="list-select-div">
                  <div class="info-label">已选班次</div>
                  <div class="list-select">
                    <ul>
                      <li v-for="(shift, sIndex) in newPlan.data.shifts" :key="sIndex">
                        <div>{{shift.shiftName}}({{shift.beginTime}}~{{shift.endTime}})</div>
                        <div class="shift-cancle" @click="selectShift(shift)"></div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="newPlan.index === 3">
            <div class="table-title">
              <div class="plan-left-frozen row-div date-div">
                <div>班次</div>
              </div>
              <div class="plan-right-scroll" @mousewheel="scrollPlanEvent">
                <div v-for="(col, cIndex) in newPlan.data.data" :key="cIndex" class="title-div date-div">
                  <div>{{col.date.substr(5, 5)}} {{col.week}}</div>
                  <div>{{col.unitNames.join(' ')}}</div>
                </div>
              </div>
            </div>
            <div class="table-body">
              <div class="plan-left-frozen" @mousewheel="scrollPlanEvent">
                <div v-for="(row, rIndex) in newPlan.data.shifts" :key="rIndex" class="row-div cross date-div" :style="{height: pHeight[rIndex]}">
                  <div>{{row.shiftName}}</div>
                  <div>({{row.beginTime}}~{{row.endTime}})</div>
                </div>
              </div>
              <div class="scroll-plan-div">
                <div class="plan-right-scroll">
                  <div v-for="(row, rIndex) in newPlan.data.shifts" :key="rIndex" :ref="'plan' + rIndex" class="row-li">
                    <div v-for="(col, cIndex) in newPlan.data.data" :key="cIndex" class="row-div cross date-div unit-sub-list">
                      <div v-show="unitSubs(row, col)" v-for="(unitSub, i) in unitSubs(row, col)" :key="i" class="unit-sub-div" :title="unitSub.unitSubName">
                        {{unitSub.unitSubName}}
                      </div>
                      <!-- <el-button type="primary" @click="addUnitSub(rIndex, cIndex)">点击选择</el-button> -->
                      <el-popover placement="bottom" width="300" trigger="click">
                        <div class="unit-subs-popover">
                          <div v-for="(unitSubArr, key) in unitSubsList(col.unitIds)" :key="key">
                            <div>{{key}}</div>
                            <div>
                              <div v-for="(unitSub, uIndex) in unitSubArr" :key="uIndex"
                              :class="['div-button', require('lodash').find(unitSubs(row, col), ['unitSubId', unitSub.unitSubId]) ? 'div-button-select' : '']"
                              @click="addUnitSub(rIndex, cIndex, unitSub)">{{ unitSub.unitSubName }}</div>
                            </div>
                          </div>
                        </div>
                        <el-button type="primary" slot="reference">点击选择</el-button>
                      </el-popover>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button :disabled="newPlan.index === 0" @click="prevStep()">上一步</el-button>
        <el-button v-if="newPlan.index < 3" :disabled="determNext" @click="nextStep()">下一步</el-button><!--  -->
        <el-button v-if="newPlan.index == 3" type="primary" :loading="newPlan.loading" @click="finishedStep">生 成</el-button>
        <el-button @click="closePlanDialog">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import basicMsgBoxMixin from '@/components/mixin/basicMsgBoxMixin'
// import basicMsgBoxMixin from '@/components/mixin/pageTableMixin'
import _ from 'lodash'
import { queryAll, postData } from '@/api/base'
import { objKeySort } from '@/util/util.js'

export default {
  components: {
  },
  mixins: [basicMsgBoxMixin], // basicMsgBoxMixin
  data () {
    return {
      rHeight: [],
      pHeight: [],
      selectIndex: 0,
      stepList: ['日期选择', '班组选择', '班次选择', '生成'],
      cycleList: ['上一休二', '上二休一', '上二休二'],
      unitList: [
        {
          unitId: 1,
          unitName: '班组1'
        },
        {
          unitId: 2,
          unitName: '班组2'
        },
        {
          unitId: 3,
          unitName: '班组3'
        },
        {
          unitId: 4,
          unitName: '班组4'
        }
      ],
      unitData: {
        url: '/organization/teamUnit/queryAll',
        unitList: []
      },
      shiftData: {
        url: '/schedplan/scheduleShift/queryAll',
        shiftList: []
      },
      unitSubData: {
        url: '/organization/teamUnitSub/queryAllByUnitIds',
        data: []
      },
      newPlan: {
        visible: false,
        index: 0,
        url: '/schedplan/schedulePlan/savePlan',
        data: {
          planName: '',
          date: [],
          cycle: '上一休二',
          units: [],
          shifts: [],
          data: []
        }
      },
      planData: {
        url: '/schedplan/schedulePlan/queryAll',
        queryData: {
          planName: ''
        },
        planList: []
      },
      shiftList: [
        {
          shiftId: 1,
          shiftName: '班次1',
          beginTime: '00:00',
          endTime: '04:00'
        },
        {
          shiftId: 2,
          shiftName: '班次2',
          time: '05:00-09:00'
        },
        {
          shiftId: 3,
          shiftName: '班次3',
          time: '10:00-14:00'
        },
        {
          shiftId: 4,
          shiftName: '班次4',
          time: '15:00-19:00'
        },
        {
          shiftId: 5,
          shiftName: '班次5',
          time: '20:00-00:00'
        },
        {
          shiftId: 6,
          shiftName: '班次6',
          time: '20:00-00:00'
        },
        {
          shiftId: 7,
          shiftName: '班次7',
          time: '20:00-00:00'
        },
        {
          shiftId: 8,
          shiftName: '班次8',
          time: '20:00-00:00'
        }
      ],
      data: [],
      teamList: [
        {
          teamId: 1,
          teamName: '班组一'
        },
        {
          teamId: 2,
          teamName: '班组二'
        },
        {
          teamId: 3,
          teamName: '班组三'
        },
        {
          teamId: 4,
          teamName: '班组四'
        }
      ]
    }
  },
  mounted () {
    this.queryList()
  },
  methods: {
    queryList () {
      queryAll(this.planData.url, this.planData.queryData).then(res => {
        if (res.data.code == 0) {
          this.planData.planList = res.data.data
          this.data = []
        } else {
          this.showError('获取排班计划列表', '请重新获取')
        }
      })
    },
    clickPlan (index) {
      this.selectIndex = index
      this.data = [
        {
          date: '2019-07-03',
          week: '周一',
          unitIds: [1, 2],
          unitNames: ['班组1', '班组2'],
          shiftArr: [
            {
              shiftId: 1,
              unitSubs: [
                {
                  unitSubId: 1,
                  unitSubName: '放行1'
                },
                {
                  unitSubId: 2,
                  unitSubName: '放行2'
                },
                {
                  unitSubId: 3,
                  unitSubName: '放行3'
                },
                {
                  unitSubId: 4,
                  unitSubName: '放行4'
                },
                {
                  unitSubId: 5,
                  unitSubName: '放行5'
                },
                {
                  unitSubId: 6,
                  unitSubName: '放行6'
                }
              ]
            },
            {
              shiftId: 2,
              unitSubs: [
                {
                  unitSubId: 1,
                  unitSubName: '放行1'
                },
                {
                  unitSubId: 2,
                  unitSubName: '放行2'
                },
                {
                  unitSubId: 3,
                  unitSubName: '放行3'
                },
                {
                  unitSubId: 4,
                  unitSubName: '放行4'
                },
                {
                  unitSubId: 5,
                  unitSubName: '放行5'
                },
                {
                  unitSubId: 6,
                  unitSubName: '放行6'
                }
              ]
            }
          ]
        },
        {
          date: '2019-07-04',
          unitIds: [1, 2],
          unitNames: ['班组1', '班组2'],
          shiftArr: [
            {
              shiftId: 1,
              unitSubs: [
                {
                  unitSubId: 1,
                  unitSubName: '放行1'
                },
                {
                  unitSubId: 2,
                  unitSubName: '放行2'
                },
                {
                  unitSubId: 3,
                  unitSubName: '放行3'
                },
                {
                  unitSubId: 4,
                  unitSubName: '放行4'
                },
                {
                  unitSubId: 5,
                  unitSubName: '放行5'
                }
              ]
            },
            {
              shiftId: 2,
              unitSubs: [
                {
                  unitSubId: 1,
                  unitSubName: '放行1'
                },
                {
                  unitSubId: 2,
                  unitSubName: '放行2'
                },
                {
                  unitSubId: 3,
                  unitSubName: '放行3'
                }
              ]
            }
          ]
        },
        {
          date: '2019-07-05',
          unitIds: [1, 2],
          unitNames: ['班组1', '班组2'],
          shiftArr: [
            {
              shiftId: 1,
              unitSubs: [
                {
                  unitSubId: 1,
                  unitSubName: '放行1'
                },
                {
                  unitSubId: 2,
                  unitSubName: '放行2'
                },
                {
                  unitSubId: 3,
                  unitSubName: '放行3'
                },
                {
                  unitSubId: 4,
                  unitSubName: '放行4'
                },
                {
                  unitSubId: 5,
                  unitSubName: '放行5'
                }
              ]
            },
            {
              shiftId: 2,
              unitSubs: [
                {
                  unitSubId: 1,
                  unitSubName: '放行1'
                },
                {
                  unitSubId: 2,
                  unitSubName: '放行2'
                },
                {
                  unitSubId: 3,
                  unitSubName: '放行3'
                }
              ]
            }
          ]
        },
        {
          date: '2019-07-06',
          unitIds: [1, 2],
          unitNames: ['班组1', '班组2'],
          shiftArr: [
            {
              shiftId: 1,
              unitSubs: [
                {
                  unitSubId: 1,
                  unitSubName: '放行1'
                },
                {
                  unitSubId: 2,
                  unitSubName: '放行2'
                },
                {
                  unitSubId: 3,
                  unitSubName: '放行3'
                },
                {
                  unitSubId: 4,
                  unitSubName: '放行4'
                },
                {
                  unitSubId: 5,
                  unitSubName: '放行5'
                }
              ]
            },
            {
              shiftId: 2,
              unitSubs: [
                {
                  unitSubId: 1,
                  unitSubName: '放行1'
                },
                {
                  unitSubId: 2,
                  unitSubName: '放行2'
                },
                {
                  unitSubId: 3,
                  unitSubName: '放行3'
                }
              ]
            }
          ]
        },
        {
          date: '2019-07-07',
          unitIds: [1, 2],
          unitNames: ['班组1', '班组2'],
          shiftArr: [
            {
              shiftId: 1,
              unitSubs: [
                {
                  unitSubId: 1,
                  unitSubName: '放行1'
                },
                {
                  unitSubId: 2,
                  unitSubName: '放行2'
                },
                {
                  unitSubId: 3,
                  unitSubName: '放行3'
                },
                {
                  unitSubId: 4,
                  unitSubName: '放行4'
                },
                {
                  unitSubId: 5,
                  unitSubName: '放行5'
                }
              ]
            },
            {
              shiftId: 2,
              unitSubs: [
                {
                  unitSubId: 1,
                  unitSubName: '放行1'
                },
                {
                  unitSubId: 2,
                  unitSubName: '放行2'
                },
                {
                  unitSubId: 3,
                  unitSubName: '放行3'
                }
              ]
            }
          ]
        },
        {
          date: '2019-07-08',
          week: '周一',
          unitIds: [1, 2],
          unitNames: ['班组1', '班组2'],
          shiftArr: [
            {
              shiftId: 1,
              unitSubs: [
                {
                  unitSubId: 1,
                  unitSubName: '放行1'
                },
                {
                  unitSubId: 2,
                  unitSubName: '放行2'
                },
                {
                  unitSubId: 3,
                  unitSubName: '放行3'
                },
                {
                  unitSubId: 4,
                  unitSubName: '放行4'
                },
                {
                  unitSubId: 5,
                  unitSubName: '放行5'
                }
              ]
            },
            {
              shiftId: 2,
              unitSubs: [
                {
                  unitSubId: 1,
                  unitSubName: '放行1'
                },
                {
                  unitSubId: 2,
                  unitSubName: '放行2'
                },
                {
                  unitSubId: 3,
                  unitSubName: '放行3'
                }
              ]
            }
          ]
        }
      ]
      this.$nextTick(() => {
        this.scrollTable()
        this.getRHeight()
      })
    },
    getRHeight () {
      this.rHeight = []
      this.shiftList.forEach((row, rIndex) => {
        this.rHeight.push(this.$refs['row' + rIndex][0].offsetHeight + 'px')
      })
    },
    getPHeight () {
      this.pHeight = []
      this.newPlan.data.shifts.forEach((row, rIndex) => {
        this.pHeight.push(this.$refs['plan' + rIndex][0].offsetHeight + 'px')
      })
    },
    scrollTable () {
      var scrollDiv = document.getElementsByClassName('scroll-div')[0]
      let that = this
      scrollDiv.onscroll = function () {
        var scrollTop = this.scrollTop
        document.getElementsByClassName('left-frozen')[0].scrollTop = scrollTop
        document.getElementsByClassName('left-frozen')[1].scrollTop = scrollTop
        var scrollLeft = this.scrollLeft
        document.getElementsByClassName('right-scroll')[0].scrollLeft = scrollLeft
      }
    },
    scrollPlanTable () {
      let that = this
      that.$nextTick(() => {
        var scrollDiv = document.getElementsByClassName('scroll-plan-div')[0]
        scrollDiv.onscroll = function () {
          var scrollTop = this.scrollTop
          document.getElementsByClassName('plan-left-frozen')[0].scrollTop = scrollTop
          document.getElementsByClassName('plan-left-frozen')[1].scrollTop = scrollTop
          var scrollLeft = this.scrollLeft
          document.getElementsByClassName('plan-right-scroll')[0].scrollLeft = scrollLeft
        }
      })
    },
    scrollUnitTable () {
      let that = this
      this.$nextTick(() => {
        var scrollDiv = document.getElementsByClassName('scroll-unit-div')[0]
        scrollDiv.onscroll = function () {
          var scrollTop = this.scrollTop
          document.getElementsByClassName('unit-left-frozen')[0].scrollTop = scrollTop
          document.getElementsByClassName('unit-left-frozen')[1].scrollTop = scrollTop
          var scrollLeft = this.scrollLeft
          document.getElementsByClassName('unit-right-scroll')[0].scrollLeft = scrollLeft
        }
      })
    },
    scrollEvent (event) {
      var scrollTop = event.wheelDeltaY
      document.getElementsByClassName('scroll-div')[0].scrollTop -= scrollTop
    },
    scrollPlanEvent (event) {
      var scrollTop = event.wheelDeltaY
      document.getElementsByClassName('scroll-plan-div')[0].scrollTop -= scrollTop
    },
    scrollUnitEvent (event) {
      var scrollTop = event.wheelDeltaY
      document.getElementsByClassName('scroll-unit-div')[0].scrollTop -= scrollTop
    },
    openPlanDialog () {
      if (!this.newPlan.visible) {
        this.newPlan.visible = true
        queryAll(this.unitData.url, {}).then(res => {
          if (res.data.code === 0) {
            this.unitData.unitList = res.data.data
          }
        })
        queryAll(this.shiftData.url, {}).then(res => {
          if (res.data.code === 0) {
            this.shiftData.shiftList = res.data.data
          }
        })
      }
    },
    prevStep () {
      this.newPlan.index--
    },
    nextStep () {
      this.newPlan.index++
      if (this.newPlan.index === 1) {
        this.scrollUnitTable()
      }
      if (this.newPlan.index === 3) {
        queryAll(this.unitSubData.url, _.map(this.newPlan.data.units, 'unitId')).then(res => {
          if (res.data.code === 0) {
            this.unitSubData.data = res.data.data
          }
        })
        let oldLength = this.newPlan.data.data.length
        let time = 24 * 60 * 60 * 1000
        let diff = (new Date(this.newPlan.data.date[1]).getTime() / time - new Date(this.newPlan.data.date[0]).getTime() / time) + 1
        let length = (diff < this.cycleLength) ? diff : this.cycleLength
        let arr = new Array(length)
        arr.fill(null)
        let shiftArr = []
        this.newPlan.data.shifts.forEach(shift => {
          this.$set(shift, 'unitSubs', [])
          shiftArr.push(shift)
        })
        if (oldLength <= 0) {
          arr.forEach((val, cIndex) => {
            let date = this.formatterYMD(this.newPlan.data.date[0], cIndex)
            let unitIds = []
            let unitNames = []
            this.newPlan.data.units.forEach(unit => {
              if (unit.workDays.includes(cIndex)) {
                unitIds.push(unit.unitId)
                unitNames.push(unit.unitName)
              }
            })
            let obj = {
              date: date,
              week: this.weekName(new Date(date).getDay()),
              unitIds: unitIds,
              unitNames: unitNames,
              shiftArr: shiftArr
            }
            this.newPlan.data.data.push(JSON.parse(JSON.stringify(obj)))
          })
          this.$nextTick(() => {
            this.getPHeight()
          })
        } else if (oldLength < length) {
          for (let i = oldLength; i < length; i++) {
            let date = this.formatterYMD(this.newPlan.data.date[0], i)
            let unitIds = []
            let unitNames = []
            this.newPlan.data.units.forEach(unit => {
              if (unit.workDays.includes(i)) {
                unitIds.push(unit.unitId)
                unitNames.push(unit.unitName)
              }
            })
            let obj = {
              date: date,
              week: this.weekName(new Date(date).getDay()),
              unitIds: unitIds,
              unitNames: unitNames,
              shiftArr: shiftArr
            }
            this.newPlan.data.data.push(JSON.parse(JSON.stringify(obj)))
          }
          this.$nextTick(() => {
            this.getPHeight()
          })
        }
        this.scrollPlanTable()
      }
    },
    finishedStep () {
      postData(this.newPlan.url, this.newPlan.data).then(res => {
        if (res.data.code === 0) {
          this.showSuccess('保存')
          this.closePlanDialog()
        }
      })
    },
    closePlanDialog () {
      this.newPlan.visible = false
      this.newPlan.index = 0
      this.newPlan.data = {
        planName: '',
        date: [],
        cycle: '上一休二',
        units: [],
        shifts: [],
        data: []
      }
    },
    changeDateRange (value) {
      let oldLength = this.newPlan.data.data.length
      if (oldLength > 0) {
        let time = 24 * 60 * 60 * 1000
        let diff = (new Date(this.newPlan.data.date[1]).getTime() / time - new Date(this.newPlan.data.date[0]).getTime() / time) + 1
        let length = (diff < this.cycleLength) ? diff : this.cycleLength
        let shiftArr = []
        this.newPlan.data.shifts.forEach(shift => {
          this.$set(shift, 'unitSubs', [])
          shiftArr.push(shift)
        })
        if (length <= oldLength) {
          this.newPlan.data.data.splice(length, oldLength - length)
          if (this.newPlan.data.data[0].date !== value[0]) {
            this.newPlan.data.data.forEach((item, i) => {
              let date = this.formatterYMD(this.newPlan.data.date[0], i)
              this.$set(item, 'date', date)
              this.$set(item, 'week', this.weekName(new Date(date).getDay()))
            })
          }
        } else {
          if (this.newPlan.data.data[0].date !== value[0]) {
            this.newPlan.data.data.forEach((item, i) => {
              let date = this.formatterYMD(this.newPlan.data.date[0], i)
              this.$set(item, 'date', date)
              this.$set(item, 'week', this.weekName(new Date(date).getDay()))
            })
          }
        }
      }
    },
    changeCycle (value) {
      if (this.newPlan.data.data && this.newPlan.data.data.length > 0) {
        this.newPlan.data.units.forEach(unit => {
          unit.workDays = []
        })
        this.newPlan.data.data = []
      }
    },
    selectUnit (unit) {
      let index = _.findIndex(this.newPlan.data.units, ['unitId', unit.unitId])
      if (~index) {
        this.newPlan.data.units.splice(index, 1)
        if (this.newPlan.data.data.length > 0) {
          this.newPlan.data.data.forEach(item => {
            _.remove(item.unitIds, (val) => { return (val === unit.unitId) })
            _.remove(item.unitNames, (val) => { return (val === unit.unitName) })
            item.shiftArr.forEach(shift => {
              _.remove(shift.unitSubs, ['unitId', unit.unitId])
            })
          })
        }
      } else {
        this.$set(unit, 'workDays', JSON.parse(JSON.stringify([])))
        this.newPlan.data.units.push(unit)
      }
    },
    selectShift (shift) {
      let index = _.findIndex(this.newPlan.data.shifts, ['shiftId', shift.shiftId])
      if (~index) {
        this.newPlan.data.shifts.splice(index, 1)
        if (this.newPlan.data.data.length > 0) {
          this.newPlan.data.data.forEach(item => {
            _.remove(item.shiftArr, ['shiftId', shift.shiftId])
          })
        }
      } else {
        this.$set(shift, 'unitSubs', [])
        this.newPlan.data.shifts.push(shift)
        if (this.newPlan.data.data.length > 0) {
          this.newPlan.data.data.forEach(item => {
            item.shiftArr.push(JSON.parse(JSON.stringify(shift)))
          })
        }
      }
    },
    changeWork (rIndex, cIndex) {
      let index = _.findIndex(this.newPlan.data.units[rIndex].workDays, (val, i) => {
        return (val === cIndex)
      })
      if (index > -1) {
        this.newPlan.data.units[rIndex].workDays.splice(index, 1)
        if (this.newPlan.data.data.length > 0) {
          if (cIndex < this.newPlan.data.data.length) {
            let unit = this.newPlan.data.units[rIndex]
            _.remove(this.newPlan.data.data[cIndex].unitIds, (val) => {
              return val === unit.unitId
            })
            _.remove(this.newPlan.data.data[cIndex].unitNames, (val) => {
              return val === unit.unitName
            })
            this.newPlan.data.data[cIndex].shiftArr.forEach(shift => {
              _.remove(shift.unitSubs, ['unitId', unit.unitId])
            })
          }
        }
      } else {
        this.newPlan.data.units[rIndex].workDays.push(cIndex)
        if (this.newPlan.data.data.length > 0) {
          if (cIndex < this.newPlan.data.data.length) {
            let unit = this.newPlan.data.units[rIndex]
            this.newPlan.data.data[cIndex].unitIds.push(unit.unitId)
            this.newPlan.data.data[cIndex].unitNames.push(unit.unitName)
          }
        }
      }
    },
    addUnitSub (rIndex, cIndex, unitSub) {
      let index = _.findIndex(this.unitSubs(this.newPlan.data.shifts[rIndex], this.newPlan.data.data[cIndex]), ['unitSubId', unitSub.unitSubId])
      if (~index) {
        this.newPlan.data.data[cIndex].shiftArr[rIndex].unitSubs.splice(index, 1)
      } else {
        this.newPlan.data.data[cIndex].shiftArr[rIndex].unitSubs.push(unitSub)
      }
      this.$nextTick(() => {
        this.$set(this.pHeight, rIndex, this.$refs['plan' + rIndex][0].offsetHeight + 'px')
      })
    },
    formatterYMD (time, day) {
      if (time) {
        var date = new Date(time)
        if (day) {
          date = date.setDate(date.getDate() + day)
          date = new Date(date)
        }
        var dateStr = `${date.getFullYear()}-${this.addZero(date.getMonth() + 1)}-${this.addZero(date.getDate())}`
        return dateStr
      } else {
        return '—'
      }
    },
    addZero (value) {
      if (value < 10) {
        return `0${value}`
      } else {
        return value
      }
    }
  },
  computed: {
    unitSubs () {
      return function (row, col) {
        let obj = _.find(col.shiftArr, ['shiftId', row.shiftId])
        if (obj && obj.hasOwnProperty('unitSubs')) {
          return obj.unitSubs
        } else {
          return null
        }
      }
    },
    unitSubsList () {
      return function (ids) {
        let arr = []
        let arrEn = []
        ids.forEach(id => {
          let obj = _.find(this.unitSubData.data, ['id', id])
          if (obj) {
            arr.push(...obj.data)
          }
        })
        arr.forEach(item => {
          let firstEn = window.pinyinUtil.getFirstLetter(item.unitSubName.charAt(0))
          if (!arrEn[firstEn]) {
            this.$set(arrEn, firstEn, [])
          }
          arrEn[firstEn].push(item)
        })
        arrEn = objKeySort(arrEn)
        return arrEn
      }
    },
    weekName () {
      return function (week) {
        let name = '周日'
        switch (week) {
          case 1: name = '周一'
          break
          case 2: name = '周二'
          break
          case 3: name = '周三'
          break
          case 4: name = '周四'
          break
          case 5: name = '周五'
          break
          case 6: name = '周六'
          break
        }
        return name
      }
    },
    determNext: function () {
      if ((this.newPlan.index === 0) && (this.newPlan.data.planName) && this.newPlan.data.date.length === 2 && this.newPlan.data.cycle) {
        return false
      } else if (this.newPlan.index === 1) {
        if (this.newPlan.data.units.length < this.cycleLength) {
          return true
        } else {
          for (let i = 0; i < this.newPlan.data.units.length; i++) {
            if (this.newPlan.data.units[i].workDays.length < this.cycleMax) {
              return true
            }
          }
          return false
        }
      } else if ((this.newPlan.index === 2) && (this.newPlan.data.shifts.length > 0)) {
        return false
      } else {
        return true
      }
    },
    cycleLength: function () {
      if (this.newPlan.data.cycle === this.cycleList[this.cycleList.length - 1]) {
        return 4
      } else {
        return 3
      }
    },
    cycleMax: function () {
      if (this.newPlan.data.cycle === this.cycleList[0]) {
        return 1
      } else {
        return 2
      }
    },
    getpHeight () {
      return function (rIndex) {
        if (this.$refs['plan' + rIndex]) {
          return (this.$refs['plan' + rIndex][0].offsetHeight)
        }
      }
    }
  }
}
</script>

<style scoped>
.sched-plan-view {
  display: flex;
  height: calc(100% - 12px);
}
.sched-plan-list {
  width: 332px;
  height: 100%;
  border: 1px solid rgba(60, 166, 200, 0.4);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  margin: 0 12px 12px 12px;
  box-sizing: border-box;
}
.button-list {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgba(60, 166, 200, 0.2);
  padding: 12px 12px 12px 12px;
}
.filter {
  margin: 12px;
  display: flex;
}
.filter>:last-child {
  margin-left: 6px;
}
.list-table {
  height: calc(100% - 191px);
  overflow-x: hidden;
}
.insert-li {
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
}
ul {
  padding: 0;
  margin: 0;
}
ul>li {
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  box-sizing: border-box;
}
li.active {
  background-color: #215870 !important;
}
li.active>.text {
  color: #fff;
}
.row-li {
  display: flex;
  width: fit-content;
}
div:not(.list-all):not(.list-select)>ul>li:nth-child(odd),
.left-frozen .row-div:nth-child(odd),
.plan-left-frozen .row-div:nth-child(odd),
.unit-left-frozen .row-div:nth-child(odd),
.row-li:nth-child(odd) {
  background-color: #0e2d3e;
}
div:not(.list-all):not(.list-select)>ul>li:nth-child(even),
.left-frozen .row-div:nth-child(even),
.plan-left-frozen .row-div:nth-child(even),
.unit-left-frozen .row-div:nth-child(even),
.row-li:nth-child(even) {
  background-color: #081e2d;
}
ul>li>.text {
  font-size: 14px;
  color: #7a939e;
  height: 14px;
  line-height: 14px;
  padding-left: 12px;
}
.sched-plan-date {
  margin: 0 12px 12px 0;
  width: calc(100% - 368px);
  height: 100%;
  border: 1px solid rgba(60, 166, 200, 0.4);
  border-radius: 8px;
  box-sizing: border-box;
}
.sched-plan-date .date-header {
  height: 80px;
  border-bottom: 1px solid rgba(60, 166, 200, 0.2);
}
.date-header>div {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.date-header>div>div {
  color: #fff;
  font-size: 24px;
  line-height: 24px;
  font-family: dinRegular;
}
.date-header>div>div:not(:last-child) {
  margin-right: 12px;
}
.date-header>div>div:not(.month) {
  cursor: pointer;
}
.date-body {
  height: calc(100% - 81px);
  overflow: hidden;
}
.date-div {
  box-sizing: border-box;
}
:not(.unit-right-scroll)>:not(.unit-right-scroll)>.date-div {
  width: 200px;
  min-width: 200px;
  max-width: 200px;
}
.unit-right-scroll {
  width: 100%;
}
.unit-right-scroll>.row-li {
  width: calc(100%);
}
.unit-right-scroll .date-div {
  flex-grow: 1;
}
:not(.unit-right-scroll)>:not(.unit-right-scroll):not(.unit-left-frozen)>.date-div:not(.unit-left-frozen) {
  border-right: 1px solid rgba(60, 166, 200, 0.2);
}
.table-body {
  height: calc(100% - 100px);
}
.scroll-div,
.scroll-plan-div,
.scroll-unit-div {
  overflow-y: auto;
  overflow-x: scroll;
}
.scroll-div::-webkit-scrollbar-track-piece,
.scroll-plan-div::-webkit-scrollbar-track-piece,
.scroll-unit-div::-webkit-scrollbar-track-piece {
  background: transparent;
}

.scroll-unit-div {
  width: 100%;
}
.table-title,
.table-body {
  display: flex;
}
.title-div>div {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
}
:not(.unit-right-scroll)>.title-div>div {
  height: 50%;
}
.unit-right-scroll>.title-div>div {
  height: 100%;
}
div:not(.unit-right-scroll)>.title-div>div:not(:last-child) {
  border-bottom: 1px solid rgba(60, 166, 200, 0.2);
}
.row-div {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80px;
}
.cross {
  flex-direction: column;
}
.unit-sub-list {
  display: flex;
  justify-content: space-evenly;
  flex-direction: row;
  flex-wrap: wrap;
}
.unit-sub-work-div,
.unit-sub-unwork-div {
  cursor: pointer;
}
.unit-sub-div,
.unit-sub-work-div,
.unit-sub-unwork-div {
  border-radius: 6px;
  font-size: 14px;
  color: #fff;
  box-sizing: border-box;
  max-width: 180px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.unit-sub-div {
  padding: 3px 16px;
  margin: 4px 0;
}
.unit-sub-work-div,
.unit-sub-unwork-div {
  padding: 5px 0;
  width: 80px;
  text-align: center;
}
.unit-sub-div,
.unit-sub-work-div {
  background-color: #03A786;
  /* border: 1px solid rgba(122,147,158,1); */
}
.unit-sub-unwork-div.disabled {
  cursor: not-allowed;
}
.unit-sub-unwork-div {
  border: 1px solid rgba(160, 220, 255, 0.2);
}
/* *********** */
.table-title .left-frozen {
}
.table-body .left-frozen,
.table-body .plan-left-frozen {
  height: calc(100% - 8px);
}
.table-body .left-frozen>.date-div:last-child,
.table-body .plan-left-frozen>.date-div:last-child {
  border-bottom: 1px solid rgba(60, 166, 200, 0.2);
}
.table-title .right-scroll,
.table-title .plan-right-scroll,
.table-title .unit-right-scroll {
  display: flex;
}
.table-body .right-scroll,
.table-body .plan-right-scroll,
.table-body .unit-right-scroll {
  overflow: auto;
}
/* *********** */
.table-title .left-frozen,
.table-title .plan-left-frozen,
.table-title .unit-left-frozen,
.table-title .right-scroll,
.table-title .plan-right-scroll,
.table-title .unit-right-scroll,
.table-body .left-frozen,
.table-body .plan-left-frozen,
.table-body .unit-left-frozen {
  overflow: hidden;
}
.table-body .right-scroll,
.table-body .plan-right-scroll,
.table-body .unit-right-scroll {
  overflow: auto;
}
.table-body .right-scroll>.row-li:last-child>.date-div,
.table-body .plan-right-scroll>.row-li:last-child>.date-div {
  border-bottom: 1px solid rgba(60, 166, 200, 0.2);
}
.table-title {
  height: 100px;
  width: calc(100% - 8px);
}
.table-title>div:not(.unit-right-scroll)>.date-div {
  border-bottom: 1px solid rgba(60, 166, 200, 0.2);
}
.left-frozen,
.plan-left-frozen,
.unit-left-frozen {
  width: 200px;
  min-width: 200px;
  max-width: 200px;
}
.table-body .left-frozen>div,
.table-body .plan-left-frozen>div {
  border-right: 1px solid rgba(60, 166, 200, 0.2);
}
.left-frozen,
.plan-left-frozen,
.unit-left-frozen,
.table-title {
  color: #7a939e;
}
.right-scroll,
.plan-right-scroll {
  width: fit-content;
}
.table-title>div {
  height: 100%;
}
.dialog-body {
  height: 100%;
}
.plan-step {
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.plan-step .step-div {
  display: flex;
  justify-content: center;
  align-items: center;
}
.plan-step .step-div .step-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #7a939e;
}
.plan-step .step-div .step-info.active {
  color: #fff;
}
.plan-step .step-div .step-info>div:first-child {
  margin-bottom: 6px;
  font-size: 30px;
  font-family: dinRegular;
  font-weight: bold;
}
.plan-step .step-div .step-info>div:last-child {
  font-size: 14px;
  font-weight: bold;
}
.plan-step .step-div:not(:last-child)>div {
  margin-right: 20px;
}
.plan-button {
  height: 40px;
}
.plan-date-body {
  height: calc(100% - 130px);
  overflow: auto;
}
.next-step {
  width: 81px;
  height: 8px;
  background-image: url(~@img/img_plan_next_step.png);
}
.plan-date-body .plan-info-div {
  text-align: left;
}
.plan-date-body>.plan-info-div:not(:first-child) {
  margin-top: 64px;
}
.plan-date-body .date-range-div {
  display: flex;
  margin-top: 24px;
}
.info-label {
  font-size: 14px;
  color: #7a939e;
  margin-bottom: 10px;
}
.info-title {
  font-size: 18px;
  color: #7a939e;
}
.info-value {
  width: 240px;
}
.require-label {
  color: #D9415A;
  margin-left: 14px;
}
.list-div {
  width: 100%;
  height: calc(100% - 20px);
  display: flex;
  justify-content: flex-start;
}
.list-div .list-all,
.list-div .list-select {
  background-color: rgba(8, 25, 38, 0.8);
  border: 1px solid rgba(60, 166, 200, 0.7);
  box-shadow: 0 0 30px rgba(60, 166, 200, 0.4) inset;
  border-radius: 10px;
  overflow: hidden;
}
.list-div .list-all,
.list-div>.list-all-div>.list-all,
.list-div>.list-select-div>.list-select{
  height: calc(100% - 24px);
  width: 180px;
  padding: 12px 20px;
  overflow: auto;
}
.list-div>.list-all-div,
.list-div>.list-select-div {
  height: 100%;
  min-height: 400px;
  width: 240px;
}
.list-div>.list-all-div>.list-all,
.list-div>.list-select-div>.list-select {
  height: calc(100% - 54px);
  width: calc(100% - 40px);
}
.list-div .list-select {
  height: 100%;
  width: calc(100% - 200px);
  margin-left: 20px;
}
.list-div>.list-all li,
.list-div>.list-all-div li,
.list-div>.list-select-div li {
  height: 40px;
  color: #fff;
  font-size: 16px;
  line-height: 16px;
  justify-content: flex-start;
}
.list-select-div li {
  justify-content: space-between !important;
}
.list-div li>div:last-child {
  margin-left: 12px;
}
.unit-subs-popover {
  margin: 20px 10px 10px 20px;
  flex-wrap: wrap;
  max-height: 400px;
  overflow-x: hidden;
}
.unit-subs-popover>div>div:first-child {
  color: #7a939e;
  font-size: 16px;
}
.unit-subs-popover>div>div {
  display: flex;
}
.unit-subs-popover>div>div>div {
  padding-left: 10px;
  padding-right: 10px;
  flex-grow: 0;
  margin-bottom: 10px;
  margin-right: 10px;
}
.shift-cancle {
  width: 16px;
  height: 16px;
  background-image: url(~@img/im/icon_btn_close_gray.png);
  cursor: pointer;
}
</style>

<style>
/* 弹窗 */
.sched-plan-dialog>.el-dialog {
  height: calc(100% - 120px);
  min-height: 600px;
  width: calc(100% - 700px);
  min-width: 800px;
}
</style>
