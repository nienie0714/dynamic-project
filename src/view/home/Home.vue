<template>
  <div class="body-view">
    <el-container direction="vertical" ref="homeBodyViewContainer">
      <div class="home-return-main-img" @click="returnMainPage()" v-if="!isMergeView"></div>
      <!-- 态势时钟 -->
      <div class="merge-time-wrapper"  v-if="isMergeView">
        <div class="merge-date">
          <div class="time-rs font-blue">{{latestDate.split('/')[0]}}/{{latestDate.split('/')[1]}}/{{latestDate.split('/')[2]}}</div>
          <div class="time-rs font-blue">星期{{latestWeek}}</div>
        </div>
        <div class="merge-time time-st font-blue">{{latestTime}}</div>
      </div>
      <header-view @select="handleHeaderMenu"></header-view>
      <el-main :class="((routerViewName!='航班查询')&&(routerViewName!='任务调度')&&(routerViewName!='态势分析'))?'home-top-main':''"><!-- ((routerViewName!='态势分析')?'merge-top-main':'') -->
        <el-container class="home-container-cent">
          <div v-if="require('lodash').map(this.homeRouterData, 'path').includes(basicPath)" style="display: flex; width: 100%;">
            <Aside-menu-view></Aside-menu-view>
            <el-main class="home-main">
              <router-view/>
            </el-main>
          </div>
          <router-view v-else/>
        </el-container>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import AsideMenuView from './AsideMenuView'
import HeaderView from './HeaderView'
import baseMixin from '@/components/mixin/baseMixin'

export default {
  mixins: [baseMixin],
  components: {
    AsideMenuView,
    HeaderView
  },
  data () {
    return {
      basicPath: '',
      // 命名视图名称
      routerViewName: this.$route.name,
      homeRouterData: [],
      isMergeView: false
    }
  },
  created () {
    this.basicPath = this.$route.matched[0].path
    this.isMergeView = this.basicPath == '/situation'
    this.homeRouterData = this.$store.getters.getHomeRouterData
  },
  methods: {
    returnMainPage () {
      if (window.opener && !window.opener.closed) {
        const {href} = this.$router.resolve({
          name: window.opener.name
        })
        window.open(href, window.opener.name)
      } else {
        this.$router.push({name: '主页面'})
      }
    },
    handleHeaderMenu (data) {
      this.$router.push({name: data.key})
    }
  },
  watch: {
    $route (to, from) {
      this.routerViewName = to.name
    }
  }/* ,
  mounted () {
    const that = this
    this.$nextTick(() => {
      const containerWidth = that.$el.querySelector('.flight-contain')
      containerWidth.style.width = window.innerWidth
      window.onresize = () => {
        this.$nextTick(() => {
          return (() => {
            const containerWidth = that.$el.querySelector('.flight-contain')
            containerWidth.style.width = window.innerWidth
          })()
        })
      }
    })
  } */
}
</script>

<style>
.body-view {
  background: url(../../assets/img/bg.jpg);
}
.home-return-main-img {
  height: 48px;
  width: 48px;
  position: absolute;
  top: 0;
  right: 0;
  background-image: url(../../assets/img/btn_home.png);
  z-index: 99;
  cursor: pointer;
}
.merge-time-wrapper {
  margin-top: 15px;
  margin-right: 20px;
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
}
.merge-date {
  margin-right: 15px;
}
.merge-date > div {
  text-align: right;
}
.time-st {
  font-size: 42px;
}
.time-rs {
  font-size: 19px;
}
</style>
