<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@/components/ui'
import { AlertCircle, CheckCircle2, X } from 'lucide-vue-next'

const props = defineProps<{
  open: boolean
  variant: 'success' | 'error'
  title: string
  message: string
}>()

const emit = defineEmits<{ close: [] }>()

const isSuccess = computed(() => props.variant === 'success')

const iconColor = computed(() =>
  isSuccess.value ? 'var(--kompak-verified)' : 'var(--kompak-danger)',
)

const iconBg = computed(() =>
  isSuccess.value ? 'var(--kompak-verified-bg)' : 'var(--kompak-danger-bg)',
)
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      :style="{
        position: 'fixed',
        inset: 0,
        zIndex: 1001,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-lg)',
        background: 'rgba(15, 89, 94, 0.45)',
        backdropFilter: 'blur(4px)',
      }"
      @click.self="emit('close')"
    >
      <div
        role="dialog"
        aria-modal="true"
        :style="{
          width: '100%',
          maxWidth: '400px',
          background: 'var(--kompak-surface-white)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-elevated)',
          border: '1px solid var(--kompak-border)',
          fontFamily: 'var(--font-body)',
        }"
      >
        <div
          :style="{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            padding: 'var(--space-xl)',
            borderBottom: '1px solid var(--kompak-border)',
          }"
        >
          <div :style="{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)' }">
            <div
              :style="{
                width: 40,
                height: 40,
                borderRadius: 'var(--radius-md)',
                background: iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }"
            >
              <CheckCircle2 v-if="isSuccess" :size="22" :color="iconColor" />
              <AlertCircle v-else :size="22" :color="iconColor" />
            </div>
            <div>
              <div :style="{ fontSize: '16px', fontWeight: 700, color: 'var(--kompak-text-dark)' }">
                {{ title }}
              </div>
              <div :style="{ fontSize: '13px', color: 'var(--kompak-text-muted)', marginTop: 6, lineHeight: 1.5 }">
                {{ message }}
              </div>
            </div>
          </div>
          <button
            type="button"
            aria-label="Tutup"
            :style="{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              color: 'var(--kompak-text-muted)',
              flexShrink: 0,
            }"
            @click="emit('close')"
          >
            <X :size="20" />
          </button>
        </div>

        <div :style="{ padding: 'var(--space-xl)', paddingTop: 'var(--space-lg)' }">
          <Button
            variant="primary"
            :style="{ width: '100%', background: isSuccess ? 'var(--kompak-accent)' : 'var(--kompak-primary)' }"
            @click="emit('close')"
          >
            Tutup
          </Button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
