<template>
  <div class="page-stack" v-loading="!profile">
    <section class="hero-card">
      <div class="hero-copy">
        <span class="eyebrow">ACCOUNT</span>
        <h2>个人中心</h2>
        <p>维护本人资料、头像和密码。修改密码后当前会话会立即失效。</p>
      </div>
    </section>

    <el-alert
      v-if="profile?.mustChangePassword"
      title="首次登录或管理员重置后，请先修改密码"
      type="warning"
      show-icon
      :closable="false"
    />

    <section class="split-grid">
      <el-card shadow="never" class="table-card">
        <template #header><strong>基本资料</strong></template>
        <el-form :model="form" label-position="top">
          <el-form-item label="头像">
            <div class="avatar-row">
              <el-avatar :src="form.avatar" :size="56">{{ avatarText }}</el-avatar>
              <el-upload :show-file-list="false" accept="image/*" :http-request="uploadAvatar">
                <el-button>上传头像</el-button>
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item label="账号"><el-input :model-value="profile?.username" disabled /></el-form-item>
          <el-form-item label="部门 / 岗位">
            <el-input :model-value="orgLabel" disabled />
          </el-form-item>
          <el-form-item label="姓名"><el-input v-model="form.displayName" /></el-form-item>
          <el-form-item label="邮箱"><el-input v-model="form.email" /></el-form-item>
          <el-form-item label="手机号"><el-input v-model="form.phone" /></el-form-item>
          <el-button type="primary" :loading="saving" @click="saveProfile">保存资料</el-button>
        </el-form>
      </el-card>

      <el-card shadow="never" class="table-card">
        <template #header><strong>修改密码</strong></template>
        <el-form :model="pwd" label-position="top">
          <el-form-item label="原密码"><el-input v-model="pwd.oldPassword" type="password" show-password /></el-form-item>
          <el-form-item label="新密码">
            <el-input v-model="pwd.newPassword" type="password" show-password />
            <p class="hint">8–32 位，需包含大小写字母、数字和特殊字符，且不能与最近密码重复。</p>
          </el-form-item>
          <el-form-item label="确认新密码"><el-input v-model="pwd.confirm" type="password" show-password /></el-form-item>
          <el-button type="warning" :loading="changing" @click="changePassword">确认修改</el-button>
        </el-form>
      </el-card>
    </section>

    <section class="split-grid">
      <el-card shadow="never" class="table-card">
        <template #header><strong>我的角色与权限</strong></template>
        <p class="hint">角色：{{ (profile?.roleNames ?? []).join('、') || '--' }}</p>
        <p class="hint">数据范围：{{ profile?.dataScope || '--' }}</p>
        <div class="perm-wrap">
          <el-tag v-for="code in profile?.permissions ?? []" :key="code" size="small" effect="plain">{{ code }}</el-tag>
        </div>
      </el-card>

      <el-card shadow="never" class="table-card">
        <template #header><strong>我的会话</strong></template>
        <el-table :data="sessions" stripe>
          <el-table-column prop="ip" label="IP" min-width="120" />
          <el-table-column prop="userAgent" label="设备" min-width="180" show-overflow-tooltip />
          <el-table-column label="当前" width="80">
            <template #default="{ row }">
              <el-tag v-if="row.current" type="success" effect="light">本机</el-tag>
            </template>
          </el-table-column>
          <el-table-column width="90">
            <template #default="{ row }">
              <el-button v-if="!row.current" link type="danger" @click="kickMine(row.id)">下线</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UploadRequestOptions } from 'element-plus'
import { authApi, fileApi } from '@/api'
import { usePermissionStore } from '@/stores/permission'
import { useSessionStore } from '@/stores/session'
import { useTabsStore } from '@/stores/tabs'
import type { OnlineSession } from '@/types/models'

const session = useSessionStore()
const permission = usePermissionStore()
const tabs = useTabsStore()
const router = useRouter()
const profile = computed(() => session.profile)
const saving = ref(false)
const changing = ref(false)
const sessions = ref<OnlineSession[]>([])
const form = reactive({ displayName: '', email: '', phone: '', avatar: '' })
const pwd = reactive({ oldPassword: '', newPassword: '', confirm: '' })
const avatarText = computed(() => (form.displayName || 'N').slice(0, 1))
const orgLabel = computed(() => [profile.value?.deptName, profile.value?.postName].filter(Boolean).join(' / ') || '--')

watch(
  profile,
  (value) => {
    if (!value) {
      return
    }
    form.displayName = value.displayName
    form.email = value.email ?? ''
    form.phone = value.phone ?? ''
    form.avatar = value.avatar ?? ''
  },
  { immediate: true },
)

async function loadSessions() {
  sessions.value = await authApi.sessions()
}

async function uploadAvatar(options: UploadRequestOptions) {
  const uploaded = await fileApi.upload(options.file as File, 'avatar')
  form.avatar = uploaded.url
  await saveProfile()
}

async function saveProfile() {
  saving.value = true
  try {
    const next = await authApi.updateProfile(form)
    session.applyProfile(next)
    ElMessage.success('资料已更新')
  } finally {
    saving.value = false
  }
}

async function changePassword() {
  if (pwd.newPassword !== pwd.confirm) {
    ElMessage.warning('两次输入的新密码不一致')
    return
  }
  changing.value = true
  try {
    await authApi.changePassword({ oldPassword: pwd.oldPassword, newPassword: pwd.newPassword })
    ElMessage.success('密码已更新，请重新登录')
    await session.logout()
    permission.reset(router)
    tabs.reset()
    await router.push('/login')
  } finally {
    changing.value = false
  }
}

async function kickMine(id: number) {
  await ElMessageBox.confirm('下线该设备？', '结束会话', { type: 'warning' })
  await authApi.kickSession(id)
  ElMessage.success('已下线')
  await loadSessions()
}

onMounted(() => {
  loadSessions().catch(() => {
    sessions.value = []
  })
})
</script>

<style scoped>
.split-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
.avatar-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.hint {
  margin: 6px 0 0;
  color: var(--color-text-muted);
  font-size: 12px;
}
.perm-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  max-height: 220px;
  overflow: auto;
}
@media (max-width: 900px) {
  .split-grid {
    grid-template-columns: 1fr;
  }
}
</style>
