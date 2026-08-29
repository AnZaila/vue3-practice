<template>
  <div class="role-home">
    <section class="header">
      <div>
        <h2>角色权限</h2>
        <p>配置每种角色可访问的模块与操作范围。</p>
      </div>
      <el-button type="primary">新建角色</el-button>
    </section>

    <section class="role-grid">
      <el-card v-for="role in roles" :key="role.name" shadow="never" class="role-card">
        <div class="role-top">
          <strong>{{ role.name }}</strong>
          <el-tag :type="role.type" effect="light">{{ role.scope }}</el-tag>
        </div>
        <p>{{ role.desc }}</p>
        <div class="chips">
          <el-tag v-for="perm in role.permissions" :key="perm" size="small" effect="plain">
            {{ perm }}
          </el-tag>
        </div>
      </el-card>
    </section>
  </div>
</template>

<script setup lang="ts">
const roles = [
  {
    name: '超级管理员',
    scope: '全局',
    type: 'danger',
    desc: '拥有所有模块的查看与编辑权限。',
    permissions: ['用户管理', '角色管理', '审批中心'],
  },
  {
    name: '运营经理',
    scope: '运营域',
    type: 'warning',
    desc: '负责内容审核、流程审批与日报查看。',
    permissions: ['工单处理', '数据报表', '内容审核'],
  },
  {
    name: '普通成员',
    scope: '基础',
    type: 'success',
    desc: '仅能访问个人任务和基础查询功能。',
    permissions: ['个人中心', '任务列表'],
  },
]
</script>

<style scoped lang="scss">
.role-home {
  display: grid;
  gap: 18px;
}

.header {
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

.role-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.role-card {
  border: 1px solid var(--color-border);
  border-radius: 18px;
  box-shadow: 0 12px 28px rgba(17, 24, 39, 0.04);
}

.role-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  strong {
    color: var(--color-text-strong);
    font-size: 18px;
  }
}

.role-card p {
  margin: 14px 0;
  color: var(--color-text-muted);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

@media (max-width: 900px) {
  .header {
    align-items: stretch;
    flex-direction: column;
  }

  .role-grid {
    grid-template-columns: 1fr;
  }
}
</style>
