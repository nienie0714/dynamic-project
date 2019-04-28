<template>
  <div v-if="menuData.show" ref="rightMenu" class="right-menu-pop" :style="`top: ${menuData.style.y}px; left: ${menuData.style.x}px;`">
    <ul>
      <li v-for="(item, index) in menuData.items" :key="index" :class="item.disabled ? 'disabled' : ''" @mouseenter="handleHover(index)" @mouseleave="handleRemoveHover"
      @click="!item.hasOwnProperty('children')&&handleClick(item)">
        <span>{{ item.label }}</span>
        <i v-if="item.hasOwnProperty('children')" class="el-icon-caret-right"></i>
        <child v-if="item.hasOwnProperty('children') && (hoverIndex == index)" :children="item.children" :data="menuData.data" :index="index" :childStyle="style"></child>
      </li>
    </ul>
  </div>
</template>

<script>
import Child from './MenuRightChildView'

export default {
  props: ['menuData'],
  components: {
    Child
  },
  data () {
    return {
      hoverIndex: null,
      style: {
        left: 0,
        top: 0,
        width: 'max-content'
      },
      data: null
    }
  },
  mounted () {
    this.data = this.menuData.data
    document.addEventListener('click', this.hiddenMenu)
  },
  destroyed () {
    document.removeEventListener('click', this.hiddenMenu)
  },
  methods: {
    hiddenMenu () {
      this.menuData.show = false
    },
    handleHover (index) {
      if (this.hoverIndex == index) {
        this.hoverIndex = null
      } else {
        this.hoverIndex = index
        let width = this.$refs.rightMenu.offsetWidth
        this.style.left = width + 'px'
        this.style.top = 36 * index + 'px'
      }
    },
    handleRemoveHover () {
      this.hoverIndex = null
    },
    handleClick (item) {
      let method = item.method
      if (method) {
        method(this.menuData.data)
      }
    }
  }
}
</script>

<style>
.right-menu-pop {
  border: 1px solid rgba(60, 166, 200, 0.7);
  border-radius: 4px;
  background-color: rgba(8, 25, 38, 0.93);
  box-shadow: 0 0 30px rgba(60, 166, 200, 0.4) inset, 0 8px 20px rgba(6, 13, 20, 0.9);
  position: absolute;
}
.right-menu-pop>ul {
  padding: 0;
  margin: 0;
  list-style-type: none;
}
.right-menu-pop>ul>li {
  color: #fff;
  font-size: 14px;
  padding: 8px 16px;
  cursor: pointer;
  list-style-type: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.right-menu-pop>ul>li.disabled {
  opacity: 0.4;
  pointer-events: none;
}
.right-menu-pop>ul>li:not(:last-of-type) {
  border-bottom: 1px solid rgba(60, 166, 200, 0.4);
}
.right-menu-pop>ul>li:first-of-type {
  border-radius: 4px 4px 0 0;
}
.right-menu-pop>ul>li:last-of-type {
  border-radius: 0 0 4px 4px;
}
.right-menu-pop>ul>li:hover {
  background-color: rgba(60, 166, 200, 0.4);
  color: #fff;
}
</style>
