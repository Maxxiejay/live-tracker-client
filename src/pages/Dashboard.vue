<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p class="text-gray-600 mt-2">Manage your tracking sessions</p>
    </div>
    
    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="card">
        <div class="flex items-center">
          <div class="bg-primary-100 rounded-full p-3 mr-4">
            <Plus class="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">New Session</h3>
            <p class="text-gray-600 text-sm">Create a tracking link</p>
          </div>
        </div>
        <router-link to="/new-session" class="btn btn-primary mt-4 w-full">
          Create Tracking Session
        </router-link>
      </div>
      
      <div class="card">
        <div class="flex items-center">
          <div class="bg-success-100 rounded-full p-3 mr-4">
            <Activity class="h-6 w-6 text-success-600" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Active Sessions</h3>
            <p class="text-gray-600 text-sm">{{ sessionStore.activeSessions.length }} currently running</p>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="flex items-center">
          <div class="bg-purple-100 rounded-full p-3 mr-4">
            <History class="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Total Sessions</h3>
            <p class="text-gray-600 text-sm">{{ sessionStore.sessions.length }} sessions created</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Active Sessions -->
    <div class="mb-8" v-if="sessionStore.activeSessions.length > 0">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold text-gray-900">Active Sessions</h2>
        <span class="status-active">{{ sessionStore.activeSessions.length }} active</span>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SessionCard 
          v-for="session in sessionStore.activeSessions" 
          :key="session.id"
          :session="session"
          @view="viewSession"
          @copy="copySessionLink"
          @end="endSession"
          @delete="deleteSession"
        />
      </div>
    </div>
    
    <!-- Recent Sessions -->
    <div>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold text-gray-900">Recent Sessions</h2>
        <router-link to="/history" class="text-primary-600 hover:text-primary-500 text-sm font-medium">
          View all →
        </router-link>
      </div>
      
      <div v-if="recentSessions.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SessionCard 
          v-for="session in recentSessions" 
          :key="session.id"
          :session="session"
          @view="viewSession"
          @copy="copySessionLink"
          @delete="deleteSession"
        />
      </div>
      
      <div v-else class="card text-center py-12">
        <FileX class="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">No sessions yet</h3>
        <p class="text-gray-600 mb-4">Create your first tracking session to get started.</p>
        <router-link to="/new-session" class="btn btn-primary">
          <Plus class="h-4 w-4 mr-2" />
          Create Session
        </router-link>
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-if="sessionStore.loading" class="flex justify-center py-12">
      <Loader class="h-8 w-8 animate-spin text-primary-600" />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Plus, Activity, History, FileX, Loader 
} from 'lucide-vue-next'
import { useSessionStore } from '@/stores/session'
import SessionCard from '@/components/SessionCard.vue'
import { getSessionViewUrl, copyToClipboard } from '@/utils/helpers'

const router = useRouter()
const sessionStore = useSessionStore()

const recentSessions = computed(() => 
  sessionStore.endedSessions.slice(0, 6)
)

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

const endSession = async (session) => {
  await sessionStore.endSession(session.code)
}

const deleteSession = async (session) => {
  if (confirm('Are you sure you want to delete this session?')) {
    await sessionStore.deleteSession(session.code)
  }
}

onMounted(() => {
  sessionStore.fetchSessions()
})
</script>
