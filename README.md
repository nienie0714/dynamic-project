# dynamic-project
## 目录结构
```
DYNAMIC-PROJECT
┣ build
┣ config
┃ ┣ index.js		配置转发路径
┃ ┣ dev.env.js 	配置打包环境全局变量
┃ ┣ prod.env.js	配置开发环境全局变量
┃ ┣ test.env.js 	配置测试环境全局变量
┣ dist				部署包
┣ src
┃ ┣ api			axios请求封装方法（js）
┃ ┣ assets			资源文件（font/img）
┃ ┣ components	
┃ ┃ ┣ common	公共封装组件
┃ ┃ ┃ ┣ BaseTableView	公共列表组件
┃ ┃ ┃ ┣ QueryView		公共查询块组件
┃ ┃ ┃ ┣ ItemsView		查询块对应内容组件（可以不需要单独提出）
┃ ┃ ┃ ┣ PaginationView	公共分页组件（基础数据）
┃ ┃ ┃ ┣ ToolButtonView	公共工具栏组件（基础数据）
┃ ┃ ┃ ┣ WarningBoxView	公共提示框组件（针对确认提示）
┃ ┃ ┃ ┣ EditView		公共编辑页面组件（主要针对基础数据模块）
┃ ┃ ┃ ┗ DateRangePicker	时间选择器（两个输入框相互校验）
┃ ┃ ┃
┃ ┃ ┗ mixin		公共封装混入文件
┃ ┃    ┣ baseMixin		当前日期、时间——首次同步服务器后定时刷新
┃ ┃    ┣ basicMsgBoxMixin创建公共确认提示框组件
┃ ┃    ┣ basicMsgMixin	创建公共消息提示框组件
┃ ┃    ┣ basicTableMixin	列表基础数据、操作（基础数据）
┃ ┃    ┣ pageTableMixin	分页列表数据、操作（基础数据）
┃ ┃    ┣ wholeTableMixin	不分页列表数据、操作（基础数据）
┃ ┃    ┣ webSocketMixin	连接websocket（任务调度）
┃ ┃    ┗ rabbitMqMixin	连接rabbitMq（任务调度）
┃ ┃   
┃ ┣ conf			配置转发路径
┃ ┃ ┗ axios.conf.js	axios配置文件（request/response基础配置及拦截器）
┃ ┃
┃ ┣ router			配置路由
┃ ┣ store			
┃ ┃ ┣ modules
┃ ┃ ┃┣ baseStore.js	首次登录记录及最后登录时间
┃ ┃ ┃┣ config.js	长链接及dfs等相关配置
┃ ┃ ┃┗ enum.js	业务通用配置信息
┃ ┃ ┃
┃ ┃ ┗ index.js
┃ ┃
┃ ┣ style			配置通用样式
┃ ┣ util			
┃ ┃ ┣ rules.js		正则判断方法集合
┃ ┃ ┗ util.js		通用方法集合
┃ ┃
┃ ┣ view			
┃ ┃ ┣ home		业务无关框架页面/组件
┃ ┃ ┃┣ LoginView	登录页面
┃ ┃ ┃┣ MainView	入口页面
┃ ┃ ┃┣ Home		入口跳转后页面框架
┃ ┃ ┃┣ HeaderView		入口跳转后header组件
┃ ┃ ┃┣ AsideMenuView	（基础数据）入口跳转后左侧菜单组件
┃ ┃ ┃┗ BasicResourceView	（基础数据）入口跳转后右侧框架
┃ ┃ ┃
┃ ┃ ┣ basicResource	基础数据模块
┃ ┃ ┃┣ air			机场资源
┃ ┃ ┃┣ basic		航空数据
┃ ┃ ┃┣ device		设备管理
┃ ┃ ┃┣ knowledge	知识库
┃ ┃ ┃┣ msg			消息管理
┃ ┃ ┃┣ org			组织机构
┃ ┃ ┃┣ perm		    系统权限
┃ ┃ ┃┗ taskPool		业务管理
┃ ┃ ┃
┃ ┃ ┣ statistics	数据统计模块
┃ ┃ ┃┗ hisdata		管理
┃ ┃ ┃
┃ ┃ ┣ flight		航班查询页面
┃ ┃ ┃
┃ ┃ ┗ taskScheduling	任务调度页面
┃ ┃   ┣ gantt		甘特图
┃ ┃   ┃┣ FlightGanttView		航班甘特图
┃ ┃   ┃┗ ResourceGanttView	资源甘特图
┃ ┃   ┣ MessageView			消息组件
┃ ┃   ┗ TaskSchedulingView	任务调度页面
┃ ┃
┃ ┣ App.vue		配置转发路径
┃ ┗ main.js		配置转发路径
┣ static				静态资源文件
┣ test				测试
┣ index.html
┣ node_modules	    依赖包
┣ package.json		依赖配置
┗ …
```
注：
- 前端项目结构
- 命名规则：统一驼峰式
- 文件夹：首字母小写
- 配置文件：首字母小写
- js：首字母小写
- Vue组件：首字母大写
- Vue的通用mixin文件：首字母小写


## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
