<template>
  <div class="passenger merge-block">
    <div class="header">
      <img height="20%" :src="require('@img/merge/title_deco_4k.png')" />
      <span class="header-title font-st">旅客统计</span>
    </div>
    <div class="body">
      <div class="pass-block">
        <div>
          <div class="font-st">出港旅客统计</div>
          <div class="font-nd">机上等待时间/航班数</div>
        </div>
        <div>
          <div class="count">
            <div>
              <div class="font-rd font-gray">值机总人数</div>
              <div class="num-nd font-white">1065</div>
            </div>
            <div>
              <div class="font-rd font-gray">登机总人数</div>
              <div class="num-nd font-white">1060</div>
            </div>
            <div>
              <div class="font-rd font-gray">隔离区人数</div>
              <div class="num-nd font-white">190</div>
            </div>
          </div>
          <div class="time">
            <div>
              <div class="time-icon icon-1"></div>
              <div class="font-rs font-gray">&lt;45min</div>
              <div class="num-rd color-1">230</div>
            </div>
            <div>
              <div class="time-icon icon-2"></div>
              <div class="font-rs font-gray">45~90min</div>
              <div class="num-rd color-2">230</div>
            </div>
            <div>
              <div class="time-icon icon-3"></div>
              <div class="font-rs font-gray">90~150min</div>
              <div class="num-rd color-3">230</div>
            </div>
            <div>
              <div class="time-icon icon-4"></div>
              <div class="font-rs font-gray">&gt;150min</div>
              <div class="num-rd color-4">230</div>
            </div>
          </div>
        </div>
      </div>
      <div class="pass-block">
        <div>
          <div class="font-st">进港旅客统计</div>
          <div class="font-nd">机上等待时间/航班数</div>
        </div>
        <div>
          <div class="count">
            <div>
              <div class="font-rd font-gray">值机总人数</div>
              <div class="num-nd font-white">1065</div>
            </div>
            <div>
              <div class="font-rd font-gray">登机总人数</div>
              <div class="num-nd font-white">1060</div>
            </div>
          </div>
          <div class="time">
            <div>
              <div class="time-icon icon-1"></div>
              <div class="font-rs font-gray">&lt;45min</div>
              <div class="num-rd color-1">230</div>
            </div>
            <div>
              <div class="time-icon icon-2"></div>
              <div class="font-rs font-gray">45~90min</div>
              <div class="num-rd color-2">230</div>
            </div>
            <div>
              <div class="time-icon icon-3"></div>
              <div class="font-rs font-gray">90~150min</div>
              <div class="num-rd color-3">230</div>
            </div>
            <div>
              <div class="time-icon icon-4"></div>
              <div class="font-rs font-gray">&gt;150min</div>
              <div class="num-rd color-4">230</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.merge-block > .header {
  margin-left: calc(100% / 783 * 20);
  height: calc(100% / 380 * 60);
  line-height: calc(100% / 380 * 60);
}
.merge-block > .body {
  height: calc(100% - (100% / 380 * 80));
}
.passenger>.body {
  margin: 0 calc(100% / 783 * 20) calc(100% / 380 * 10) calc(100% / 783 * 20);
  display: flex;
  flex-direction: column;
}
.passenger>.body>div:first-child {
  border-bottom: 1px solid rgba(60, 166, 200, 0.3);
}
.pass-block {
  box-sizing: border-box;
  height: 50%;
  display: flex;
  flex-direction: column;
  padding: calc(50% / 380 * 10) 0 calc(50% / 380 * 20) 0;
}
.pass-block>div:first-child {
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: space-between;
}
.pass-block>div:last-child {
  width: 100%;
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
}
.pass-block>div:first-child>div  {
  height: 100%;
  color: #fff;
}
.pass-block>div:last-child>div {
  box-sizing: border-box;
  width: 50%;
  display: flex;
}
.pass-block>div:last-child>.time {
  border-left: 1px solid rgba(60, 166, 200, 0.3);
}
.count>div {
  width: calc(100% / 3);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
}
.time>div {
  width: calc(100% / 4);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
  margin-left: calc(25% / 4);
  overflow: hidden;
}
.color-1 {
  color: #F5F46B;
}
.color-2 {
  color: #FDCF53;
}
.color-3 {
  color: #FE9E59;
}
.color-4 {
  color: #FE6959;
}
.icon-1 {
  background-image: url(~@img/merge/icon_time_45_4k.png);
}
.icon-2 {
  background-image: url(~@img/merge/icon_time_90_4k.png);
}
.icon-3 {
  background-image: url(~@img/merge/icon_time_150_4k.png);
}
.icon-4 {
  background-image: url(~@img/merge/icon_time_r150_4k.png);
}
.time-icon {
  width: 100%;
  height: 20%;
  margin: 0 0 8% 0;
  background-position: left;
  background-repeat: no-repeat;
  background-size: auto 100%;
}
</style>
