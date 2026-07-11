<script setup lang="ts">
import { ref } from 'vue'
import { Bell, ChevronDown, User } from 'lucide-vue-next'
import SimkopdesSidebar from './SimkopdesSidebar.vue'

const activeMenuId = ref('kompak-app')

function onMenuSelect(id: string) {
  activeMenuId.value = id
}
</script>

<template>
  <div class="simkopdes-shell">
    <SimkopdesSidebar
      class="hidden md:flex"
      :active-id="activeMenuId"
      @select="onMenuSelect"
    />

    <div class="simkopdes-shell__main">
      <header class="simkopdes-shell__topbar hidden md:flex">
        <div class="simkopdes-shell__topbar-spacer" />
        <div class="simkopdes-shell__topbar-actions">
          <span class="simkopdes-shell__verify">Verifikasi Email Anda</span>
          <button type="button" class="simkopdes-shell__icon-btn" title="Notifikasi">
            <Bell :size="18" :stroke-width="1.5" />
          </button>
          <button type="button" class="simkopdes-shell__user-btn">
            <span class="simkopdes-shell__user-avatar">
              <User :size="16" :stroke-width="1.5" />
            </span>
            <span class="simkopdes-shell__user-name">Manajer Uxdy</span>
            <ChevronDown :size="16" :stroke-width="1.5" />
          </button>
        </div>
      </header>

      <div class="simkopdes-shell__content">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.simkopdes-shell {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background: #f4f6f8;
}

.simkopdes-shell__main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.simkopdes-shell__topbar {
  height: 52px;
  flex-shrink: 0;
  align-items: center;
  justify-content: flex-end;
  padding: 0 24px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
}

.simkopdes-shell__topbar-spacer {
  flex: 1;
}

.simkopdes-shell__topbar-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.simkopdes-shell__verify {
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 600;
  color: #dc2626;
}

.simkopdes-shell__icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  border-radius: 6px;
}

.simkopdes-shell__icon-btn:hover {
  background: #f3f4f6;
}

.simkopdes-shell__user-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px 4px 4px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 8px;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

.simkopdes-shell__user-btn:hover {
  background: #f3f4f6;
}

.simkopdes-shell__user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.simkopdes-shell__user-name {
  white-space: nowrap;
}

.simkopdes-shell__content {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
