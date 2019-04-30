<template>
  <div class="passenger merge-block">
    <div class="header">
      <img :src="require('@img/title_deco.png')" />
      <span class="header-title">旅客统计</span>
    </div>
    <div class="body">
      <div></div>
      <div></div>
    </div>
  </div>
</template>

<style scoped>
.passenger>.body {
  margin: 0 20px 10px 20px;
  display: flex;
  flex-direction: column;
}
.passenger>.body>div {
  box-sizing: border-box;
  height: 50%;
}
.passenger>.body>div:first-child {
  border-bottom: 1px solid blue;
}
</style>
