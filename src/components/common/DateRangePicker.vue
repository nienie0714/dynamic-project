<template>
  <!-- <div class="date-range-picker">
    <el-form-item :label="dateRange.label1" :prop="dateRange.key1">
      <el-date-picker v-model="editData[dateRange.key1]" :type="dateRange.dateType"
      :format="dateRange.format" :placeholder="dateRange.placeholder" @change="handleDateChange"></el-date-picker>
    </el-form-item>
    <el-form-item :label="dateRange.label2" :prop="dateRange.key2">
      <el-date-picker v-model="editData[dateRange.key2]" :type="dateRange.dateType"
      :format="dateRange.format" :placeholder="dateRange.placeholder" @change="handleDateChange"></el-date-picker>
    </el-form-item>
  </div> -->
  <div class="date-range-picker">
      <el-date-picker v-model="editData[dateRange.key1]" :type="dateRange.dateType" style="width: 47%;" :value-format="dateRange.valueFormat"
      :format="dateRange.format" :placeholder="'请选择' + dateRange.label1" @change="handleDateChange"></el-date-picker>
      <span style="width: 4%; display: inline-block;"></span>
      <el-date-picker v-model="editData[dateRange.key2]" :type="dateRange.dateType" style="width: 47%;" :value-format="dateRange.valueFormat"
      :format="dateRange.format" :placeholder="'请选择' + dateRange.label2" @change="handleDateChange"></el-date-picker>
  </div>
</template>

<script>
export default {
  props: ['dateRange', 'editData'],
  methods: {
    handleDateChange (event) {
      this.editData[this.dateRange.key] = {}
      this.$set(this.editData[this.dateRange.key], 'start', this.editData[this.dateRange.key1])
      this.$set(this.editData[this.dateRange.key], 'end', this.editData[this.dateRange.key2])
    }
  }
}
</script>
