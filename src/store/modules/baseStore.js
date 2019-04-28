export default {
  state: {
    firstTime: true,
    lastUpdateTime: '',
    homeRouterData: [
      {
        moduleName: '基础数据',
        path: '/basicdata',
        loc: 'userResource',
        name: 'basicName',
        routerName: 'basicRouterName',
        winName: 'basicOpenWin'
      },
      {
        moduleName: '数据统计',
        path: '/statistics',
        loc: 'statResource',
        name: 'statName',
        routerName: 'statRouterName',
        winName: 'statOpenWin'
      },
      {
        moduleName: '航班管理',
        path: '/flightmanage',
        loc: 'fltResource',
        name: 'fltName',
        routerName: 'fltRouterName',
        winName: 'fltOpenWin'
      }
    ]
  },
  getters: {
    getFirstTime: state => {
      return state.firstTime
    },
    getLastUpdateTime: state => {
      return state.lastUpdateTime
    },
    getHomeRouterData: state => {
      return state.homeRouterData
    }
  },
  mutations: {
    changeInsTime (state) {
      state.firstTime = false
    },
    setLastUpdateTime (state, time) {
      state.lastUpdateTime = time
    }
  },
  actions: {
    changeInsTime (context) {
      context.commit('changeInsTime')
    }
  }
}
