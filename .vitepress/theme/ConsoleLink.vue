<script setup lang="ts">
import { useData } from 'vitepress'

const { lang } = useData()
</script>

<template>
  <a class="console-link" href="/app/dashboard" target="_self">
    {{ lang.startsWith('zh') ? '返回控制台' : 'Back to console' }}
  </a>
</template>

<style scoped>
.console-link {
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  padding: 0 12px;
  color: var(--vp-c-brand-1);
  font-size: 14px;
  font-weight: 600;
}
.console-link:hover {
  color: var(--vp-c-brand-2);
}
</style>
