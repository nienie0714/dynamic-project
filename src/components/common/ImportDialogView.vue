<template>
  <el-dialog :visible.sync="importData.visible" :close-on-click-modal="false" width="500px" append-to-body class="other-dialog import-dialog" @close="closeImportDialog">
    <div slot="title" class="dialog-header">
      <img :src="require('@img/title_deco.png')" />
      <span class="header-title">导入</span>
    </div>
    <div class="dialog-body">
      <el-upload action="dfs/files" :multiple="false" :accept="importData.fileType" :file-list="importData.data.fileList"
      :auto-upload="false" :on-remove="handleRemove" :on-change="handleUploadChange" ref="upload">
        <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
        <el-button size="small" type="success" :disabled="require('lodash').isEmpty(importData.data.fileList)" :loading="importData.data.loading" @click="submitUpload">{{importData.data.loading ? '上传中' : '上传文件'}}</el-button>
        <el-button size="small" type="primary"  @click="downloadExcel()">下载模板</el-button>
      </el-upload>
      <div class="tip-font">导入完成前，请勿关闭当前窗口</div>
      <div v-if="~importData.statusData.status">
        <div>导入成功 <span style="color: green;">{{importData.statusData.success}}</span> 条<br/>导入失败 <span style="color: red;">{{importData.statusData.fail}}</span> 条。</div>
        <el-button size="small" type="primary" :disabled="!importData.statusData.fileUrl" @click="downloadErrorExcel()">下载导入失败信息</el-button>
        <!-- <div>
          <div>查看导入失败信息：</div>
          <button type="button" class="el-button el-button--primary"><a>下载失败文件</a></button>
        </div> -->
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button :loading="importData.loading" @click="closeImportDialog">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import basicMsgBoxMixin from '@/components/mixin/basicMsgBoxMixin'
import {download, upload} from '@/api/base'
export default {
  mixins: [basicMsgBoxMixin],
  props: ['data'],
  data () {
    return {
      importData: {
        visible: false,
        loading: false,
        uploadUrl: '',
        data: {
          fileList: [],
          loading: false,
          progress: 0
        },
        fileType: '.xls',
        fileName: '',
        fileUrl: '',
        statusData: {
          status: -1,
          success: 0,
          fail: 0,
          fileUrl: false
        }
      }
    }
  },
  mounted () {
    this.importData.uploadUrl = this.data.uploadUrl
    this.importData.fileType = this.data.fileType
    this.importData.fileUrl = this.data.fileUrl
    this.importData.fileName = this.data.fileName + '导入模板'
  },
  methods: {
    handleRemove (file, fileList) {
      this.$refs.upload.clearFiles()
      this.importData.data.fileList = []
    },
    handleUploadChange (file, fileList) {
      this.$refs.upload.clearFiles()
      this.importData.data.fileList = [file]
    },
    submitUpload () {
      this.importData.data.loading = true
      let formdata = new FormData()
      let _this = this
      formdata.append('file', this.importData.data.fileList[0].raw)
      formdata.append('submit', false)
      upload('/dataImport/importExcel/' + this.importData.uploadUrl, formdata).then(res => {
        if (res.data.code == 0) {
          if (res.data.data['successCount'] > 0) {
            this.$emit('handleRefresh')
          }
          this.importData.statusData.success = res.data.data['successCount']
          this.importData.statusData.fail = res.data.data['failCount']
          this.importData.errorData = res.data.data['errList']
          if (this.importData.errorData && this.importData.errorData.length > 0) {
            this.importData.statusData.fileUrl = true
          }
          this.importData.data.fileList = []
          this.importData.statusData.status = 0
        } else {
          this.showError('导入', res.data.msg)
        }
        this.importData.data.loading = false
      })
    },
    downloadExcel () {
      download(this.importData.fileUrl, null).then(res => {
        this.downFile(res, this.importData.fileName, 'xls')
      }).catch(err => {
        this.showError('下载模板', '请重新尝试 !')
        console.log(err)
      })
    },
    // Blob文件转换下载
    downFile (result, fileName) {
      var data = result.data
      let type = data.type
      var blob = new Blob([data], { type: type })
      var objectUrl = URL.createObjectURL(blob)
      var a = document.createElement('a')
      a.setAttribute('style', 'display:none')
      a.setAttribute('href', objectUrl)
      a.setAttribute('download', fileName)
      a.click()
      URL.revokeObjectURL(objectUrl)
    },
    downloadErrorExcel () {
      this.$emit('downloadErrorExcel', this.importData.errorData)
      // let a = document.createElement('a')
      // a.setAttribute('style', 'display:none')
      // a.setAttribute('href', this.dfsUrl + this.importData.statusData.fileUrl)
      // a.setAttribute('download', this.importData.errorFileName)
      // a.click()
    },
    closeImportDialog () {
      this.$parent.$parent.importData.visible = false
      this.importData.statusData.status = -1
      this.importData.statusData.success = 0
      this.importData.statusData.fail = 0
      this.importData.statusData.fileUrl = false
      this.importData.data.fileList = []
    }
  },
  watch: {
    'data.visible': {
      handler (visible) {
        this.importData.visible = visible
      },
      immediate: true
    }
  }
}
</script>

<style>
</style>
