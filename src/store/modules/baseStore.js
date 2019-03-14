export default {
  state: {
    firstTime: true,
    lastUpdateTime: '',
    homeRouterData: [
      {
        routerName: '基础数据',
        path: '/basicdata',
        loc: 'userResource',
        text: 'basicdataName',
        name: 'basicName',
        winName: 'basicOpenWin'
      },
      {
        routerName: '数据统计',
        path: '/statistics',
        loc: 'statResource',
        text: 'statisticsName',
        name: 'statName',
        winName: 'statOpenWin'
      },
      {
        routerName: '航班管理',
        path: '/flightmanage',
        loc: 'fltResource',
        text: 'flightmanageName',
        name: 'fltName',
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
