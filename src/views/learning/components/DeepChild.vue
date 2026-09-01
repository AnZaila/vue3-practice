<template>
  <div class="deep-child">
    <p>Hello, I am a deep child component.</p>
    <p>themeColor: {{ themeColor }}</p>
    <el-button type="primary" @click="changeThemeColor('red')">click me to change themeColor</el-button>
  </div>
</template>
<script setup lang="ts">
import { inject } from 'vue'
// 情况五：provide / inject （祖孙组件通信）
const themeColor = inject('themeColor', 'defaultColor') // 第二个参数是默认值
const changeThemeColor = inject('changeThemeColor', (color: string) => {
  console.log('changeThemeColor is not provided, color:', color) // 第二个参数也是默认值，当祖组件没写函数时才会执行，写了就不会执行默认函数
})
</script>

<style scoped></style>
