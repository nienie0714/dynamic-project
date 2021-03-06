import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/view/home/MainView'
import Login from '@/view/home/LoginView'
import Home from '@/view/home/Home'
import Basic from '@/view/home/BasicResourceView'
import store from '../store'
import {postData} from '../api/base'
import _ from 'lodash'

Vue.use(Router)

var router = new Router({
  routes: [
    {
      path: '/',
      name: '登录',
      component: Login
      /* redirect: to => {
        return { path: '/basic' }
      }, */
      /* component: DynamicFlightView, */
    },
    {
      path: '/main',
      name: '主页面',
      component: Main
    },
    {
      path: 'dynamicmap',
      name: '指挥监控'
    },
    {
      path: '/flight-view',
      component: Home,
      redirect: to => {
        return {path: '/flight'}
      },
      children: [{
        path: '/flight',
        name: '航班查询',
        component: r => require.ensure([], () => r(require('@/view/flight/DynamicFlightView'), 'DynamicFlightView')),
        beforeEnter: (to, from, next) => {
          postData('sysconfig/listSysParams', null).then(res => {
            store.commit('setConfigs', res.data.data)
            next()
          })
        }
      }]
    },
    {
      path: '/critical-view',
      component: Home,
      redirect: to => {
        return {path: '/critical'}
      },
      children: [{
        path: '/critical',
        name: '航班放行监控',
        component: r => require.ensure([], () => r(require('@/view/flight/CriticalFlightView'), 'CriticalFlightView')),
        beforeEnter: (to, from, next) => {
          postData('sysconfig/listSysParams', null).then(res => {
            store.commit('setConfigs', res.data.data)
            next()
          })
        }
      }]
    },
    {
      path: '/tasksched-view',
      component: Home,
      /* redirect: to => {
        return {path: '/tasksched'}
      }, */
      children: [{
        path: '/tasksched',
        name: '任务调度',
        component: r => require.ensure([], () => r(require('@/view/taskScheduling/TaskSchedulingView'), 'TaskSchedulingView')),
        beforeEnter: (to, from, next) => {
          var taskArr = []
          postData('permission/taskscheduling/task/queryOwnTaskByEmp', {}).then(response => {
            taskArr = response.data.data
            store.commit('setTaskColOption', taskArr)
            postData('sysconfig/listSysParams', null).then(res => {
              store.commit('setConfigs', res.data.data)
              next()
            })
          })
        }
      }]
    },
    {
      path: '/situation',
      component: Home,
      /* beforeEnter: (to, from, next) => {
        var resource = []
        var obj = {
          url: '/statistics'
        }
        postData('basicdata/sysUser/queryResourceByUserId', obj).then(response => {
          resource = response.data.data
          localStorage.setItem('statResource', JSON.stringify(resource))
          postData('sysconfig/listSysParams', null).then(res => {
            store.commit('setConfigs', res.data.data)
            next()
          })
        })
      }, */
      children: [
        {
          path: 'merge',
          name: '态势分析',
          component: r => require.ensure([], () => r(require('@/view/situation/MergeView'), 'MergeView')),
          beforeEnter: (to, from, next) => {
            postData('sysconfig/listSysParams', null).then(res => {
              store.commit('setConfigs', res.data.data)
              next()
            })
          }
        }
      ]
    },
    {
      path: '/resourceGantt',
      name: '资源甘特图',
      component: r => require.ensure([], () => r(require('@/view/taskScheduling/gantt/ResourceGanttView'), 'ResourceGanttView')),
      beforeEnter: (to, from, next) => {
        var taskArr = []
        postData('permission/taskscheduling/task/queryOwnTaskByEmp', {}).then(response => {
          taskArr = response.data.data
          store.commit('setTaskColOption', taskArr)
          postData('sysconfig/listSysParams', null).then(res => {
            store.commit('setConfigs', res.data.data)
            next()
          })
        })
      }
    },
    {
      path: '/flightGantt',
      name: '航班保障甘特图',
      component: r => require.ensure([], () => r(require('@/view/taskScheduling/gantt/FlightGanttView'), 'FlightGanttView')),
      beforeEnter: (to, from, next) => {
        postData('sysconfig/listSysParams', null).then(res => {
          store.commit('setConfigs', res.data.data)
          next()
        })
      }
    },
    {
      path: '/statistics',
      name: '数据统计',
      component: Home,
      beforeEnter: (to, from, next) => {
        var resource = []
        var obj = {
          url: '/statistics'
        }
        postData('basicdata/sysUser/queryResourceByUserId', obj).then(response => {
          resource = response.data.data
          localStorage.setItem('statResource', JSON.stringify(resource))
          postData('sysconfig/listSysParams', null).then(res => {
            store.commit('setConfigs', res.data.data)
            next()
          })
        })
      },
      children: [
        {
          path: 'hisdata',
          name: '历史数据',
          component: Basic,
          children: [
            {
              path: 'hisTask',
              name: '航班保障任务查询',
              component: r => require.ensure([], () => r(require('@/view/statistics/hisdata/HisTaskView'), 'HisTaskView'))
            },
            {
              path: 'hisVehicle',
              name: '车辆保障任务查询',
              component: r => require.ensure([], () => r(require('@/view/statistics/hisdata/HisVehicleView'), 'HisVehicleView'))
            }
          ]
        },
        {
          path: 'otherstat',
          name: '态势统计',
          component: Basic,
          children: [
            {
              path: 'relNormal',
              name: '航班放行正常率',
              component: r => require.ensure([], () => r(require('@/view/situation/otherstat/ReleaseNormalView'), 'ReleaseNormalView'))
            },
            {
              path: 'relDelayD',
              name: '出港航班放行延误率',
              component: r => require.ensure([], () => r(require('@/view/situation/otherstat/ReleaseDelayDView'), 'ReleaseDelayDView'))
            },
            {
              path: 'cityDelay',
              name: '飞往各城市航班放行延误情况',
              component: r => require.ensure([], () => r(require('@/view/situation/otherstat/CityDelayView'), 'CityDelayView'))
            },
            {
              path: 'companyDelay',
              name: '各航空公司航班放行延误情况',
              component: r => require.ensure([], () => r(require('@/view/situation/otherstat/CompanyDelayView'), 'CompanyDelayView'))
            },
            {
              path: 'planOut',
              name: '计划离港时刻航班运行情况',
              component: r => require.ensure([], () => r(require('@/view/situation/otherstat/PlanOutView'), 'PlanOutView'))
            },
            {
              path: 'relDelayA',
              name: '进港航班延误情况',
              component: r => require.ensure([], () => r(require('@/view/situation/otherstat/ReleaseDelayAView'), 'ReleaseDelayAView'))
            },
            {
              path: 'hourTakeOffDown',
              name: '小时航班起降架次',
              component: r => require.ensure([], () => r(require('@/view/situation/otherstat/HourTakeOffDownView'), 'HourTakeOffDownView'))
            },
            {
              path: 'hourTakeDown',
              name: '小时航班落地架次',
              component: r => require.ensure([], () => r(require('@/view/situation/otherstat/HourTakeDownView'), 'HourTakeDownView'))
            },
            {
              path: 'hourTakeOff',
              name: '小时航班起飞架次',
              component: r => require.ensure([], () => r(require('@/view/situation/otherstat/HourTakeOffView'), 'HourTakeOffView'))
            },
            {
              path: 'standRate',
              name: '机位使用频率',
              component: r => require.ensure([], () => r(require('@/view/situation/otherstat/StandRateView'), 'StandRateView'))
            }
          ]
        },
        {
          path: 'vehiclestat',
          name: '车辆统计',
          component: Basic,
          children: [
            {
              path: 'alarm',
              name: '车辆报警统计',
              component: r => require.ensure([], () => r(require('@/view/situation/vehiclestat/AlarmView'), 'AlarmView'))
            },
            {
              path: 'inOffLine',
              name: '车辆上线/离线统计',
              component: r => require.ensure([], () => r(require('@/view/situation/vehiclestat/InOffLineView'), 'InOffLineView'))
            },
            {
              path: 'vehUse',
              name: '车辆使用统计',
              component: r => require.ensure([], () => r(require('@/view/situation/vehiclestat/VehUseView'), 'VehUseView'))
            }
          ]
        },
        {
          path: 'kpistat',
          name: 'KPI统计',
          component: Basic,
          children: [
            {
              path: 'dept',
              name: '部门工作量统计',
              component: r => require.ensure([], () => r(require('@/view/situation/kpistat/DeptView'), 'EmployeeView'))
            },
            {
              path: 'employee',
              name: '个人工作量统计',
              component: r => require.ensure([], () => r(require('@/view/situation/kpistat/EmployeeView'), 'EmployeeView'))
            }
          ]
        }
      ]
    },
    {
      path: '/flightmanage',
      name: '航班管理',
      component: Home,
      beforeEnter: (to, from, next) => {
        var resource = []
        var obj = {
          url: '/flightmanage'
        }
        postData('basicdata/sysUser/queryResourceByUserId', obj).then(response => {
          resource = response.data.data
          localStorage.setItem('fltResource', JSON.stringify(resource))
          postData('sysconfig/listSysParams', null).then(res => {
            store.commit('setConfigs', res.data.data)
            next()
          })
        })
      },
      children: [
        {
          path: 'plan',
          name: '航班计划',
          component: Basic,
          children: [
            {
              path: 'schedule',
              name: '班期计划',
              component: r => require.ensure([], () => r(require('@/view/flightmanage/plan/ScheduleView'), 'ScheduleView'))
            },
            {
              path: 'morrow',
              name: '次日计划',
              component: r => require.ensure([], () => r(require('@/view/flightmanage/plan/MorrowView'), 'MorrowView'))
            },
            {
              path: 'season',
              name: '换季管理',
              component: r => require.ensure([], () => r(require('@/view/flightmanage/plan/SeasonView'), 'SeasonView'))
            },
            {
              path: 'dynamic',
              name: '航班动态',
              component: r => require.ensure([], () => r(require('@/view/flightmanage/plan/DynamicView'), 'DynamicView'))
            }
          ]
        }
      ]
    },
    {
      path: '/test',
      name: '测试',
      component: r => require.ensure([], () => r(require('@/view/taskScheduling/MessageView'), 'MessageView'))
    },
    {
      path: '/basicdata',
      name: '基础数据',
      component: Home,
      beforeEnter: (to, from, next) => {
        var resource = []
        var obj = {
          url: '/basicdata'
        }
        postData('basicdata/sysUser/queryResourceByUserId', obj).then(response => {
          resource = response.data.data
          localStorage.setItem('userResource', JSON.stringify(resource))
          postData('sysconfig/listSysParams', null).then(res => {
            store.commit('setConfigs', res.data.data)
            next()
          })
        })
      },
      children: [
        {
          path: 'basic',
          name: '航空数据',
          component: Basic,
          children: [
            {
              path: 'airport',
              name: '机场信息',
              component: r => require.ensure([], () => r(require('@/view/basicResource/basic/AirportView'), 'AirportView'))
            }, {
              path: 'airline',
              name: '航空公司',
              component: r => require.ensure([], () => r(require('@/view/basicResource/basic/AirlineView'), 'AirlineView'))
            }, {
              path: 'aircraftType',
              name: '航空器类型',
              component: r => require.ensure([], () => r(require('@/view/basicResource/basic/AircraftTypeView'), 'AircraftTypeView'))
            }, {
              path: 'aircraft',
              name: '飞机信息',
              component: r => require.ensure([], () => r(require('@/view/basicResource/basic/AircraftView'), 'AircraftView'))
            },
            {
              path: 'flightTask',
              name: '航班任务',
              component: r => require.ensure([], () => r(require('@/view/basicResource/basic/FlightTaskView'), 'FlightTaskView'))
            },
            {
              path: 'flightStatus',
              name: '航班状态',
              component: r => require.ensure([], () => r(require('@/view/basicResource/basic/FlightStatusView'), 'FlightStatusView'))
            },
            {
              path: 'abnormalReason',
              name: '异常原因',
              component: r => require.ensure([], () => r(require('@/view/basicResource/basic/AbnormalReasonView'), 'AbnormalReasonView'))
            },
            {
              path: 'agency',
              name: '代理信息',
              component: r => require.ensure([], () => r(require('@/view/basicResource/basic/AgencyView'), 'AgencyView'))
            }]
        },
        {
          path: 'air',
          name: '机场资源',
          component: Basic,
          children: [
            {
              path: 'stand',
              name: '停机位',
              component: r => require.ensure([], () => r(require('@/view/basicResource/air/BasicStandView'), 'BasicStandView')),
              props: true
            },
            {
              path: 'apronArea',
              name: '机坪区域',
              component: r => require.ensure([], () => r(require('@/view/basicResource/air/ApronAreaView'), 'ApronAreaView'))
            },
            {
              path: 'bridge',
              name: '廊桥',
              component: r => require.ensure([], () => r(require('@/view/basicResource/air/BridgeView'), 'BridgeView'))
            },
            {
              path: 'gate',
              name: '登机口',
              component: r => require.ensure([], () => r(require('@/view/basicResource/air/GateView'), 'GateView'))
            },
            {
              path: 'resMaintRec',
              name: '资源维护记录',
              component: r => require.ensure([], () => r(require('@/view/basicResource/air/ResMaintRecView'), 'ResMaintRecView'))
            },
            {
              path: 'runway',
              name: '跑道',
              component: r => require.ensure([], () => r(require('@/view/basicResource/air/RunwayView'), 'RunwayView'))
            },
            {
              path: 'terminal',
              name: '航站楼',
              component: r => require.ensure([], () => r(require('@/view/basicResource/air/TerminalView'), 'TerminalView'))
            },
            {
              path: 'terminalResource',
              name: '航站楼资源',
              component: r => require.ensure([], () => r(require('@/view/basicResource/air/TerminalResourceView'), 'TerminalResourceView'))
            },
            {
              path: 'terminalArea',
              name: '航站楼区域',
              component: r => require.ensure([], () => r(require('@/view/basicResource/air/TerminalAreaView'), 'TerminalAreaView'))
            }]
        },
        {
          path: 'org',
          name: '组织机构',
          component: Basic,
          children: [
            {
              path: 'deptTree',
              name: '部门',
              component: r => require.ensure([], () => r(require('@/view/basicResource/org/DeptTreeView'), 'DeptTreeView'))
            },
            {
              path: 'emp',
              name: '员工',
              component: r => require.ensure([], () => r(require('@/view/basicResource/org/EmpView'), 'EmpView'))
            },
            {
              path: 'teamUnit',
              name: '班组',
              component: r => require.ensure([], () => r(require('@/view/basicResource/org/TeamUnitView'), 'TeamUnitView'))
            },
            {
              path: 'team',
              name: '保障单元',
              component: r => require.ensure([], () => r(require('@/view/basicResource/org/TeamView'), 'TeamView'))
            },
            {
              path: 'teamEmp',
              name: '班组成员',
              component: r => require.ensure([], () => r(require('@/view/basicResource/org/TeamEmpView'), 'TeamEmpView'))
            },
            {
              path: 'duty',
              name: '值班信息',
              component: r => require.ensure([], () => r(require('@/view/basicResource/org/DutyView'), 'DutyView'))
            }
          ]
        },
        {
          path: 'perm',
          name: '权限',
          component: Basic,
          children: [
            {
              path: 'classify',
              name: '分类信息',
              component: r => require.ensure([], () => r(require('@/view/basicResource/perm/ClassifyView'), 'ClassifyView'))
            },
            {
              path: 'user',
              name: '用户',
              component: r => require.ensure([], () => r(require('@/view/basicResource/perm/UserView'), 'UserView'))
            },
            {
              path: 'role',
              name: '角色',
              component: r => require.ensure([], () => r(require('@/view/basicResource/perm/RoleView'), 'RoleView'))
            },
            {
              path: 'resource',
              name: '资源',
              component: r => require.ensure([], () => r(require('@/view/basicResource/perm/ResourceView'), 'ResourceView'))
            },
            {
              path: 'log',
              name: '日志',
              component: r => require.ensure([], () => r(require('@/view/basicResource/perm/LogView'), 'LogView'))
            }
          ]
        },
        {
          path: 'device',
          name: '设备管理',
          component: Basic,
          children: [
            {
              path: 'terminal-device',
              name: '终端',
              component: r => require.ensure([], () => r(require('@/view/basicResource/device/TerminalDeviceView'), 'TerminalDeviceView')),
              props: true
            },
            {
              path: 'vehicle',
              name: '车辆',
              component: r => require.ensure([], () => r(require('@/view/basicResource/device/VehicleView'), 'VehicleView')),
              props: true
            },
            {
              path: 'vehicle-model',
              name: '车型',
              component: r => require.ensure([], () => r(require('@/view/basicResource/device/VehicleModelView'), 'VehicleModelView')),
              props: true
            },
            {
              path: 'vehicle-maint-record',
              name: '车辆维护记录',
              component: r => require.ensure([], () => r(require('@/view/basicResource/device/VehicleMaintRecordView'), 'VehicleMaintRecordView')),
              props: true
            },
            {
              path: 'vehicle-device-relation',
              name: '车辆设备关系',
              component: r => require.ensure([], () => r(require('@/view/basicResource/device/VehicleDeviceRelationView'), 'VehicleDeviceRelationView')),
              props: true
            },
            {
              path: 'camera',
              name: '摄像头',
              component: r => require.ensure([], () => r(require('@/view/basicResource/device/CameraView'), 'CameraView')),
              props: true
            }
          ]
        },
        {
          path: 'knowledge',
          name: '知识库',
          component: Basic,
          children: [
            {
              path: 'catalogue',
              name: '知识库目录',
              component: r => require.ensure([], () => r(require('@/view/basicResource/knowledge/CatalogueView'), 'CatalogueView')),
              props: true
            },
            {
              path: 'file',
              name: '知识库文件',
              component: r => require.ensure([], () => r(require('@/view/basicResource/knowledge/FileView'), 'FileView')),
              props: true
            }
          ]
        },
        {
          path: 'taskPool',
          name: '任务池',
          component: Basic,
          children: [
            {
              path: 'task',
              name: '保障任务',
              component: r => require.ensure([], () => r(require('@/view/basicResource/taskPool/TaskView'), 'TaskView')),
              props: true
            },
            {
              path: 'taskRole',
              name: '任务角色',
              component: r => require.ensure([], () => r(require('@/view/basicResource/taskPool/TaskRoleView'), 'TaskRoleView')),
              props: true
            },
            {
              path: 'taskRoleEmp',
              name: '员工任务角色',
              component: r => require.ensure([], () => r(require('@/view/basicResource/taskPool/TaskRoleEmpView'), 'TaskRoleEmpView')),
              props: true
            },
            {
              path: 'proConfig',
              name: '航班流程配置',
              component: r => require.ensure([], () => r(require('@/view/basicResource/taskPool/ProConfigView'), 'ProConfigView')),
              props: true
            },
            {
              path: 'node',
              name: '节点定义',
              component: r => require.ensure([], () => r(require('@/view/basicResource/taskPool/NodeView'), 'NodeView')),
              props: true
            },
            {
              path: 'proNode',
              name: '流程节点',
              component: r => require.ensure([], () => r(require('@/view/basicResource/taskPool/ProNodeView'), 'ProNodeView')),
              props: true
            },
            {
              path: 'process',
              name: '航班流程定义',
              component: r => require.ensure([], () => r(require('@/view/basicResource/taskPool/ProcessView'), 'ProcessView')),
              props: true
            },
            {
              path: 'taskException',
              name: '任务模板',
              component: r => require.ensure([], () => r(require('@/view/basicResource/taskPool/TaskExceptionView'), 'TaskExceptionView')),
              props: true
            }
          ]
        },
        {
          path: 'msg',
          name: '消息管理',
          component: Basic,
          children: [
            {
              path: 'msgDefine',
              name: '消息定义',
              component: r => require.ensure([], () => r(require('@/view/basicResource/msg/MsgDefineView'), 'MsgDefineView')),
              props: true
            },
            {
              path: 'msgBind',
              name: '消息绑定',
              component: r => require.ensure([], () => r(require('@/view/basicResource/msg/MsgBindView'), 'MsgBindView')),
              props: true
            },
            {
              path: 'msgQuery',
              name: '消息记录',
              component: r => require.ensure([], () => r(require('@/view/basicResource/msg/MsgQueryView'), 'MsgQueryView')),
              props: true
            },
            {
              path: 'noticeTopic',
              name: '通告主题',
              component: r => require.ensure([], () => r(require('@/view/basicResource/msg/NoticeTopicView'), 'NoticeTopicView')),
              props: true
            },
            {
              path: 'alarmWarning',
              name: '预警设置',
              component: r => require.ensure([], () => r(require('@/view/basicResource/msg/AlarmWarningView'), 'AlarmWarningView')),
              props: true
            }
          ]
        },
        {
          path: 'scheduling',
          name: '排班管理',
          component: Basic,
          children: [{
            path: 'shiftSetting',
            name: '班次设置',
            component: r => require.ensure([], () => r(require('@/view/basicResource/scheduling/ShiftSettingView'), 'ShiftSettingView')),
            props: true
          }, {
            path: 'schedulingPlan',
            name: '排班管理',
            component: r => require.ensure([], () => r(require('@/view/basicResource/scheduling/SchedulingPlanView'), 'SchedulingPlanView')),
            props: true
          }]
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path != '/') {
    var token = localStorage.getItem('token')
    if (token && token != '') {
      let names = localStorage.getItem('winNames')
      let winNames = names ? JSON.parse(names) : []
      let index = winNames.indexOf(from.name)
      if (~index) {
        winNames.splice(index, 1)
      }
      if (to.name !== '主页面') {
        winNames.push(to.name)
        localStorage.setItem('winNames', JSON.stringify(winNames))
      }
      if (store.getters.getFirstTime) {
        var type = []
        var all = []
        postData('basicdata/classifyCode/queryAllClassify', null).then(response => {
          type = response.data.data
          postData('basicdata/classifyCode/queryAll', {}).then(response => {
            all = response.data.data
            store.commit('createEnum', {'type': type, 'all': all})
            next()
          })
        })
        store.dispatch('changeInsTime')
      } else {
        next()
      }
    } else {
      router.push({path: '/'})
      next(false)
    }
  } else {
    let names = localStorage.getItem('winNames')
    let winNames = names ? JSON.parse(names) : []
    winNames.forEach(name => {
      let {href} = router.resolve({ name: name })
      let win = window.open(href, name)
      if (win) {
        win.close()
      }
    })
    localStorage.setItem('winNames', '')
    next()
  }
})

export default router
