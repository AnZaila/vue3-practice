<template>
  <div class="page-stack" v-loading="loading">
    <section class="hero-card">
      <div class="hero-copy">
        <span class="eyebrow">SETTINGS</span>
        <h2>参数配置</h2>
        <p>登录锁定、密码策略等运行参数集中维护。</p>
      </div>
      <div class="hero-actions">
        <el-button v-permission="'system:config:update'" type="primary" :loading="saving" @click="save">保存</el-button>
      </div>
    </section>

    <el-card shadow="never" class="table-card">
      <el-table :data="configs" row-key="configKey">
        <el-table-column prop="configKey" label="键" min-width="220" />
        <el-table-column label="值" min-width="220">
          <template #default="{ row }">
            <el-input v-model="row.configValue" />
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="说明" min-width="200" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { configApi } from '@/api'
import type { SysConfig } from '@/types/models'

const loading = ref(false)
const saving = ref(false)
const configs = ref<SysConfig[]>([])

async function load() {
  loading.value = true
  try {
    configs.value = await configApi.list()
  } finally {
    loading.value = false
  }
}

async function save() {
  saving.value = true
  try {
    await configApi.save(configs.value)
    ElMessage.success('参数已保存')
  } finally {
    saving.value = false
  }
}

onMounted(load)
</script>
