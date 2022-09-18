<template>
  <div class="home-container">
    <el-card :header="state.title">
      <el-form ref="ruleFormRef" :rules="rules" status-icon :model="state.form" label-width="120px">
        <el-form-item label="token" prop="token">
          <el-input v-model="state.form.token" />
        </el-form-item>
        <el-form-item label="次数" prop="count">
          <el-input v-model.number="state.form.count" maxlength="2" placeholder="次数不宜过多，否则有封号的风险！" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="state.loading">执行</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
        <el-form-item class="success-text-form-item" v-show="state.successCount">
          <div class="success-text" v-for="item in state.successCount" :key="item">成功{{item}}次！</div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import { gameOver } from '@/api/home/index';

const ruleFormRef = ref<FormInstance>();

const rules = reactive<FormRules>({
  token: [
    { required: true, message: '必填项', trigger: 'change' },
  ],
  count: [
    { required: true, message: '必填项', trigger: 'change' }
  ]
});

const state = reactive({
  title: '羊了个羊通关秘籍',
  form: {
    token: '',
    count: 1
  },
  loading: false,
  successCount: 0
});

// 调用接口
function action (){
  state.loading = true;
  let count = 0;
  return function () {
    count++;
    gameOver(state.form).then(response => {
      if(response.data.err_code == 0) {
        state.successCount++;
      } else {
        ElMessage.error('服务器错误！');
      }
    }).catch(() => {
      ElMessage.error('服务器错误！');
    }).finally(()=> {
      count--;
      if(count !== 0) return;
      state.loading = false;
    });
  }
}

// 提交表单
function submitForm () {
  ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      const actionSubmit = action();
      for(let i = 0; i < state.form.count; i++) {
        actionSubmit();
      }
    } else {
      console.log('error submit!', fields);
    }
  })
}

// 重置表单
function resetForm () {
  ruleFormRef.value.resetFields();
}

</script>

<style lang="scss" scoped>
.home-container {
  max-width: 1000px;
  margin: auto;
  .success-text {
    width: 100%;
  }
}
</style>

