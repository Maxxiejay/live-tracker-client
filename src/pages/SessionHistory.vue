<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Session History</h1>
      <p class="text-gray-600 mt-2">View all your past tracking sessions</p>
    </div>
    
    <!-- Filters -->
    <div class="card mb-8">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by code or notes..."
            class="input"
          />
        </div>
        <div>
          <select v-model="statusFilter" class="input">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="ended">Ended</option>
            <option value="expired">Expired</option>
          </select>
        </div>
        <div>
          <select v-model="sortBy" class="input">
            <option value="createdAt">Sort by Created</option>
            <option value="endedAt">Sort by Ended</option>
            <option value="duration">Sort by Duration</option>
          </select>
        </div>
      </div>
    </div>
    
    <!-- Sessions List -->
    <div v-if="loading" class="flex justify-center py-12">
      <Loader class="h-8 w-8 animate-spin text-primary-600" />
    </div>
    
    <div v-else-if="filteredSessions.length === 0" class="card text-center py-12">
      <FileX class="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">No sessions found</h3>
      <p class="text-gray-600 mb-4">
        {{ sessionStore.sessions.length === 0 ? 'You haven\'t created any tracking sessions yet.' : 'No sessions match your search criteria.' }}
      </p>
      <router-link to="/new-session" class="btn btn-primary">
        <Plus class="h-4 w-4 mr-2" />
        Create Session
      </router-link>
    </div>
    
    <div v-else class="space-y-4">
      <!-- Desktop Table View -->
      <div class="hidden lg:block card overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="session in paginatedSessions" :key="session.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-mono text-sm font-medium text-gray-900">{{ session.code }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 max-w-xs truncate">
                  {{ session.notes || '-' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatDateTime(session.createdAt) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatDuration(session.createdAt, session.endedAt) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(session.status)">{{ session.status }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button 
                  @click="viewSession(session)"
                  class="btn btn-sm btn-primary"
                >
                  <Eye class="h-3 w-3 mr-1" />
                  View
                </button>
                <button 
                  @click="copySessionLink(session)"
                  class="btn btn-sm btn-secondary"
                >
                  <Copy class="h-3 w-3" />
                </button>
                <button 
                  @click="deleteSession(session)"
                  class="btn btn-sm btn-danger"
                >
                  <Trash2 class="h-3 w-3" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Mobile Card View -->
      <div class="lg:hidden space-y-4">
        <SessionCard 
          v-for="session in paginatedSessions" 
          :key="session.id"
          :session="session"
          @view="viewSession"
          @copy="copySessionLink"
          @delete="deleteSession"
        />
      </div>
      
      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredSessions.length) }} of {{ filteredSessions.length }} sessions
        </div>
        <div class="flex space-x-2">
          <button 
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="btn btn-sm btn-secondary"
          >
            <ChevronLeft class="h-4 w-4" />
          </button>
          <span class="flex items-center px-3 py-1 text-sm text-gray-700">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
          <button 
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="btn btn-sm btn-secondary"
          >
            <ChevronRight class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Plus, Loader, FileX, Eye, Copy, Trash2, ChevronLeft, ChevronRight 
} from 'lucide-vue-next'
import { useSessionStore } from '@/stores/session'
import { formatDateTime, formatDuration, copyToClipboard, getSessionViewUrl } from '@/utils/helpers'
import SessionCard from '@/components/SessionCard.vue'

const router = useRouter()
const sessionStore = useSessionStore()

const searchQuery = ref('')
const statusFilter = ref('')
const sortBy = ref('createdAt')
const currentPage = ref(1)
const itemsPerPage = 10

const loading = computed(() => sessionStore.loading)

const filteredSessions = computed(() => {
  let sessions = [...sessionStore.sessions]
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    sessions = sessions.filter(session => 
      session.code.toLowerCase().includes(query) ||
      (session.notes && session.notes.toLowerCase().includes(query))
    )
  }
  
  // Filter by status
  if (statusFilter.value) {
    sessions = sessions.filter(session => session.status === statusFilter.value)
  }
  
  // Sort sessions
  sessions.sort((a, b) => {
    switch (sortBy.value) {
      case 'createdAt':
        return new Date(b.createdAt) - new Date(a.createdAt)
      case 'endedAt':
        if (!a.endedAt && !b.endedAt) return 0
        if (!a.endedAt) return 1
        if (!b.endedAt) return -1
        return new Date(b.endedAt) - new Date(a.endedAt)
      case 'duration':
        const aDuration = a.endedAt ? new Date(a.endedAt) - new Date(a.createdAt) : Date.now() - new Date(a.createdAt)
        const bDuration = b.endedAt ? new Date(b.endedAt) - new Date(b.createdAt) : Date.now() - new Date(b.createdAt)
        return bDuration - aDuration
      default:
        return 0
    }
  })
  
  return sessions
})

const totalPages = computed(() => Math.ceil(filteredSessions.value.length / itemsPerPage))

const paginatedSessions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredSessions.value.slice(start, end)
})

const getStatusClass = (status) => {
  switch (status) {
    case 'active':
      return 'status-active'
    case 'ended':
      return 'status-ended'
    case 'expired':
      return 'status-expired'
    default:
      return 'status-ended'
  }
}

const viewSession = (session) => {
  router.push(`/view/${session.code}`)
}

const copySessionLink = async (session) => {
  const url = getSessionViewUrl(session.code)
  const success = await copyToClipboard(url)
  
  if (success) {
    // Show toast notification
    console.log('Link copied to clipboard')
  }
}

const deleteSession = async (session) => {
  if (confirm(`Are you sure you want to delete session ${session.code}?`)) {
    await sessionStore.deleteSession(session.code)
  }
}

// Reset pagination when filters change
watch([searchQuery, statusFilter, sortBy], () => {
  currentPage.value = 1
})

onMounted(() => {
  sessionStore.fetchSessions()
})
</script>
