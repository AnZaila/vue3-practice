<template>
  <el-descriptions :title="props.title">
    <el-descriptions-item v-for="user in userData" :key="user.id" :label="user.label">{{
      user.value
    }}</el-descriptions-item>
  </el-descriptions>
</template>
<script setup lang="ts">

const props = withDefaults(
  defineProps<{
    title: string
    userData: Record<string,string | number>[]
  }>(),
  {
    title: '详细信息',
  },
)
</script>

<style scoped></style>
