<template>
  <div class="in-out-dynamic merge-block">
    <div class="header">
      <img :src="require('@img/title_deco.png')" />
      <span class="header-title">出、进港航班动态</span>
    </div>
    <div class="body">
      <div class="dymc-block">
        <div class="test"></div>
      </div>
      <div class="dymc-block"></div>
    </div>
  </div>
</template>

<style scoped>
.body>.dymc-block {
  height: calc(50% - 10px);
}
.body>.dymc-block:first-child {
  margin-top: 20px;
}
.test {
  width: 70px;
  height: 140px;
  background-color: violet;
  position: relative;
}
.test:after {
  content: "";
  width: 60px;
  height: 150px;
  position: absolute;
  background: #081C2A;
  top: -10px;
  left: 10px;
  border-radius: 100% 0 0 0;
}
</style>
