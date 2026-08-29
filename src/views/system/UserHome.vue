<template>
  <div class="user-home">
    <section class="toolbar">
      <div>
        <h2>用户管理</h2>
        <p>管理平台账号、状态和角色分配。</p>
      </div>
      <div class="toolbar-actions">
        <el-input v-model="keyword" placeholder="搜索姓名 / 邮箱" clearable class="search-input" />
        <el-button type="primary">新增用户</el-button>
      </div>
    </section>

    <section class="stats">
      <article v-for="item in stats" :key="item.label" class="stat-card">
        <span>{{ item.label }}</span>
        <strong>{{ item.value }}</strong>
      </article>
    </section>

    <el-card shadow="never" class="table-card">
      <el-table :data="filteredUsers" style="width: 100%">
        <el-table-column prop="name" label="姓名" min-width="120" />
        <el-table-column prop="email" label="邮箱" min-width="210" />
        <el-table-column prop="role" label="角色" width="130" />
        <el-table-column prop="status" label="状态" width="110">
          <template #default="{ row }">
            <el-tag :type="row.status === '启用' ? 'success' : 'info'" effect="light">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastLogin" label="最近登录" min-width="150" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default>
            <el-button link type="primary">编辑</el-button>
            <el-button link type="danger">停用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const keyword = ref('')

const stats = [
  { label: '总用户数', value: '128' },
  { label: '启用账号', value: '121' },
  { label: '待审核', value: '7' },
]

const users = [
  { name: '林知远', email: 'lin@northstar.cn', role: '超级管理员', status: '启用', lastLogin: '2026-08-29 09:24' },
  { name: '周明', email: 'zhou@northstar.cn', role: '运营经理', status: '启用', lastLogin: '2026-08-28 18:12' },
  { name: '宋雨', email: 'song@northstar.cn', role: '内容审核', status: '冻结', lastLogin: '2026-08-25 10:01' },
  { name: '陈果', email: 'chen@northstar.cn', role: '普通成员', status: '启用', lastLogin: '2026-08-29 08:33' },
]

const filteredUsers = computed(() => {
  const value = keyword.value.trim().toLowerCase()
  if (!value) {
    return users
  }

  return users.filter((item) => {
    return [item.name, item.email, item.role].some((field) => field.toLowerCase().includes(value))
  })
})
</script>

<style scoped lang="scss">
.user-home {
  display: grid;
  gap: 18px;
}

.toolbar {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;

  h2 {
    margin: 0;
    color: var(--color-text-strong);
    font-size: 28px;
  }

  p {
    margin: 8px 0 0;
    color: var(--color-text-muted);
  }
}

.toolbar-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-input {
  width: min(320px, 54vw);
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.stat-card {
  padding: 20px;
  border: 1px solid var(--color-border);
  border-radius: 18px;
  background: var(--color-surface);
  box-shadow: 0 12px 28px rgba(17, 24, 39, 0.04);

  span {
    color: var(--color-text-muted);
    font-size: 12px;
  }

  strong {
    display: block;
    margin-top: 8px;
    color: var(--color-text-strong);
    font-size: 30px;
  }
}

.table-card {
  border: 1px solid var(--color-border);
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(17, 24, 39, 0.04);
}

@media (max-width: 900px) {
  .toolbar,
  .toolbar-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .stats {
    grid-template-columns: 1fr;
  }

  .search-input {
    width: 100%;
  }
}
</style>
