<template>
  <div :class="alertClasses">
    <div class="flex items-start">
      <div class="flex-shrink-0">
        <CheckCircle v-if="type === 'success'" class="h-5 w-5" />
        <AlertCircle v-else-if="type === 'error'" class="h-5 w-5" />
        <AlertTriangle v-else-if="type === 'warning'" class="h-5 w-5" />
        <Info v-else class="h-5 w-5" />
      </div>
      <div class="ml-3 flex-1">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-vue-next'

const props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  }
})

const alertClasses = computed(() => {
  const baseClasses = 'rounded-lg p-4 border'
  
  const typeClasses = {
    success: 'bg-success-50 border-success-200 text-success-800',
    error: 'bg-danger-50 border-danger-200 text-danger-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  }
  
  return `${baseClasses} ${typeClasses[props.type]}`
})
</script>
