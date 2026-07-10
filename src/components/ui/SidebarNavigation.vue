<script setup lang="ts">
defineProps<{ className?: string }>()
</script>

<template>
  <aside
    :class="className"
    style="
      width: 60px;
      height: 100vh;
      background: var(--kompak-surface-white);
      border-right: 1px solid var(--kompak-border);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 12px 0;
      flex-shrink: 0;
    "
  >
    <div
      style="
        width: 32px;
        height: 32px;
        border-radius: 8px;
        background: var(--kompak-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 16px;
        flex-shrink: 0;
      "
    >
      <span style="color: #fff; font-size: 14px; font-weight: 700; font-family: var(--font-body)">K</span>
    </div>
    <div style="display: flex; flex-direction: column; align-items: center; gap: 4px; flex: 1">
      <slot />
    </div>
    <div
      v-if="$slots.footer"
      style="display: flex; flex-direction: column; align-items: center; gap: 8px; margin-top: 8px"
    >
      <slot name="footer" />
    </div>
  </aside>
</template>
