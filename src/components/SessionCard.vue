<template>
  <div class="card">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-3">
        <div class="bg-gray-100 rounded-lg p-2">
          <MapPin class="h-5 w-5 text-gray-600" />
        </div>
        <div>
          <h3 class="font-medium text-gray-900">{{ session.code }}</h3>
          <p class="text-sm text-gray-600">{{ formatDateTime(session.createdAt) }}</p>
        </div>
      </div>
      <span :class="statusClass">{{ session.status }}</span>
    </div>
    
    <div v-if="session.notes" class="mb-4">
      <p class="text-sm text-gray-600">{{ session.notes }}</p>
    </div>
    
    <div class="flex items-center justify-between text-sm text-gray-600 mb-4">
      <span>Duration: {{ formatDuration(session.createdAt, session.endedAt) }}</span>
      <span v-if="session.lastUpdate">
        Last update: {{ getTimeSince(session.lastUpdate) }}
      </span>
    </div>
    
    <div class="flex space-x-2">
      <button 
        @click="$emit('view', session)"
        class="btn btn-sm btn-primary flex-1"
      >
        <Eye class="h-4 w-4 mr-1" />
        View
      </button>
      
      <button 
        @click="$emit('copy', session)"
        class="btn btn-sm btn-secondary"
        title="Copy link"
      >
        <Copy class="h-4 w-4" />
      </button>
      
      <button 
        v-if="session.status === 'active'"
        @click="$emit('end', session)"
        class="btn btn-sm btn-danger"
        title="End session"
      >
        <Square class="h-4 w-4" />
      </button>
      
      <button 
        @click="$emit('delete', session)"
        class="btn btn-sm btn-danger"
        title="Delete session"
      >
        <Trash2 class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { MapPin, Eye, Copy, Square, Trash2 } from 'lucide-vue-next'
import { formatDateTime, formatDuration, getTimeSince } from '@/utils/helpers'

const props = defineProps({
  session: {
    type: Object,
    required: true
  }
})

defineEmits(['view', 'copy', 'end', 'delete'])

const statusClass = computed(() => {
  switch (props.session.status) {
    case 'active':
      return 'status-active'
    case 'ended':
      return 'status-ended'
    case 'expired':
      return 'status-expired'
    default:
      return 'status-ended'
  }
})
</script>
