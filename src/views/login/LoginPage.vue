<template>
  <div class="login-page">
    <div class="login-copy">
      <span class="eyebrow">WELCOME BACK</span>
      <h1>Northstar 管理平台</h1>
      <p>专注于权限、用户和运营数据的统一管理。</p>
    </div>

    <el-card class="login-card" shadow="never">
      <h2>账号登录</h2>
      <el-form :model="form" label-position="top">
        <el-form-item label="用户名">
          <el-input v-model="form.username" placeholder="admin" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" show-password placeholder="请输入密码" />
        </el-form-item>
        <el-button type="primary" class="submit-btn" @click="handleLogin">进入系统</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

const form = reactive({
  username: 'admin',
  password: '123456',
})

function handleLogin() {
  ElMessage.success('登录成功')
  router.push('/dashboard')
}
</script>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 32px;
  align-items: center;
  padding: 48px;
  background:
    radial-gradient(circle at 12% 18%, rgba(79, 124, 255, 0.18), transparent 24%),
    linear-gradient(135deg, var(--color-bg), var(--color-surface-muted));
}

.login-copy {
  max-width: 620px;
  color: var(--color-text-strong);

  h1 {
    margin: 0;
    font-size: clamp(42px, 7vw, 82px);
    line-height: 0.96;
  }

  p {
    max-width: 32ch;
    margin: 18px 0 0;
    color: var(--color-text-muted);
    font-size: 18px;
  }
}

.eyebrow {
  display: inline-block;
  margin-bottom: 18px;
  color: var(--color-primary);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.22em;
}

.login-card {
  border: 1px solid var(--color-border);
  border-radius: 24px;
  background: var(--color-surface-glass);
  box-shadow: 0 20px 60px var(--color-shadow);

  h2 {
    margin: 0 0 18px;
    color: var(--color-text-strong);
  }
}

.submit-btn {
  width: 100%;
  margin-top: 8px;
}

@media (max-width: 900px) {
  .login-page {
    grid-template-columns: 1fr;
    padding: 24px;
  }
}
</style>
