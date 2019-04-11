<template>
  <div class="basic-resource-contain table-container">
    <el-container direction="vertical">
      <el-header>
        <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>基础资源</el-breadcrumb-item>
          <el-breadcrumb-item @click="changeRouterViewName('stand')">停机位管理</el-breadcrumb-item>
        </el-breadcrumb> -->
        <div class="table-header">
          <img :src="require('@img/title_deco.png')" />
          <span class="header-title">{{ routerViewName }}</span>
          <div class="header-update-div">
            <div>最后更新时间：</div>
            <div>{{lastUpdateTime}}</div>
            <div class="header-refrush">
              <div class="img-refrush" @click="handleLetUpdate"></div>
              </div>
          </div>
        </div>
      </el-header>
      <el-main>
        <div class="basic-resource-main">
          <router-view ref="basicRouter"></router-view><!--  v-if="$route.matched[0].path == $store.state.homeRouterData[0].path" -->
          <!-- <router-view v-else-if="$route.matched[0].path == $store.state.homeRouterData[1].path" ref="basicRouter"></router-view>
          <router-view v-else-if="$route.matched[0].path == $store.state.homeRouterData[2].path" ref="basicRouter"></router-view> -->
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  data () {
    return {
      // 命名视图名称
      routerViewName: '',
      obj: null
    }
  },
  mounted () {
    window.name = this.$route.name
    this.homeRouterData = this.$store.getters.getHomeRouterData
    this.obj = _.find(this.homeRouterData, ['path', this.$route.matched[0].path])
    this.routerViewName = localStorage.getItem(this.obj.name)
    localStorage.setItem(this.obj.routerName, this.$route.name)
  },
  methods: {
    changeRouterViewName (keyName) {
      this.$router.push({name: keyName})
    },
    handleLetUpdate () {
      this.$refs.basicRouter.queryDataReq(1)
    }
  },
  watch: {
    $route (to, from) {
      this.routerViewName = localStorage.getItem(this.obj.name)
      localStorage.setItem(this.obj.routerName, this.$route.name)
      localStorage.setItem(this.obj.routerName, to.name)
    }
  },
  computed: {
    lastUpdateTime () {
      return this.$store.getters.getLastUpdateTime
    }
  }
}
</script>

<style scoped>
.el-main {
  padding: 0
}
.el-main .basic-resource-main {
  height: 100%;
}
.basic-resource-contain {
  height: calc(100% - 2px);
}
</style>
