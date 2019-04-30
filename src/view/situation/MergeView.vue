<template>
  <div class="merge-body">
    <!-- <progrs type="circle" :percentage="24">
      <template slot="text">
        <div>测试</div>
      </template>
    </progrs> -->
    <router-view></router-view>
  </div>
</template>

<script>
import Progrs from '@/components/common/ProgressView'
export default {
  components: {
    Progrs
  },
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style scoped>
.merge-body {
}
</style>
