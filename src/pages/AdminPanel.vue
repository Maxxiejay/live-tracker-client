<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Admin Panel</h1>
      <p class="text-gray-600 mt-2">System overview and management</p>
    </div>
    
    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="card">
        <div class="flex items-center">
          <div class="bg-blue-100 rounded-full p-3 mr-4">
            <Users class="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 class="text-2xl font-bold text-gray-900">{{ stats.totalUsers }}</h3>
            <p class="text-gray-600 text-sm">Total Users</p>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="flex items-center">
          <div class="bg-success-100 rounded-full p-3 mr-4">
            <Activity class="h-6 w-6 text-success-600" />
          </div>
          <div>
            <h3 class="text-2xl font-bold text-gray-900">{{ stats.activeSessions }}</h3>
            <p class="text-gray-600 text-sm">Active Sessions</p>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="flex items-center">
          <div class="bg-purple-100 rounded-full p-3 mr-4">
            <MapPin class="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h3 class="text-2xl font-bold text-gray-900">{{ stats.totalSessions }}</h3>
            <p class="text-gray-600 text-sm">Total Sessions</p>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="flex items-center">
          <div class="bg-orange-100 rounded-full p-3 mr-4">
            <AlertTriangle class="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h3 class="text-2xl font-bold text-gray-900">{{ stats.reports }}</h3>
            <p class="text-gray-600 text-sm">Abuse Reports</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- Usage Chart -->
      <div class="card">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Daily Usage</h3>
        <div class="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <p class="text-gray-500">Usage chart would go here</p>
        </div>
      </div>
      
      <!-- Geographic Distribution -->
      <div class="card">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Geographic Distribution</h3>
        <div class="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <p class="text-gray-500">Location heatmap would go here</p>
        </div>
      </div>
    </div>
    
    <!-- Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Recent Sessions -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Recent Sessions</h3>
          <button class="text-primary-600 hover:text-primary-500 text-sm font-medium">
            View All
          </button>
        </div>
        
        <div class="space-y-3">
          <div v-for="session in recentSessions" :key="session.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p class="font-medium text-gray-900">{{ session.code }}</p>
              <p class="text-sm text-gray-600">{{ session.userEmail }}</p>
            </div>
            <div class="text-right">
              <span :class="getStatusClass(session.status)">{{ session.status }}</span>
              <p class="text-xs text-gray-500">{{ getTimeSince(session.createdAt) }}</p>
            </div>
          </div>
          
          <div v-if="recentSessions.length === 0" class="text-center py-8 text-gray-500">
            No recent sessions
          </div>
        </div>
      </div>
      
      <!-- Recent Reports -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Abuse Reports</h3>
          <span class="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {{ abuseReports.length }} pending
          </span>
        </div>
        
        <div class="space-y-3">
          <div v-for="report in abuseReports" :key="report.id" class="flex items-start justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div class="flex-1">
              <p class="font-medium text-gray-900">Session: {{ report.sessionCode }}</p>
              <p class="text-sm text-gray-600 mt-1">{{ report.reason }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ getTimeSince(report.createdAt) }}</p>
            </div>
            <div class="flex space-x-2 ml-4">
              <button 
                @click="resolveReport(report.id)"
                class="btn btn-sm btn-success"
              >
                <Check class="h-3 w-3" />
              </button>
              <button 
                @click="viewReport(report)"
                class="btn btn-sm btn-secondary"
              >
                <Eye class="h-3 w-3" />
              </button>
            </div>
          </div>
          
          <div v-if="abuseReports.length === 0" class="text-center py-8 text-gray-500">
            No pending reports
          </div>
        </div>
      </div>
    </div>
    
    <!-- System Actions -->
    <div class="card mt-8">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">System Actions</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button class="btn btn-secondary justify-center">
          <Database class="h-4 w-4 mr-2" />
          Export Data
        </button>
        <button class="btn btn-secondary justify-center">
          <Settings class="h-4 w-4 mr-2" />
          System Settings
        </button>
        <button class="btn btn-secondary justify-center">
          <FileText class="h-4 w-4 mr-2" />
          Generate Report
        </button>
        <button class="btn btn-danger justify-center">
          <RefreshCw class="h-4 w-4 mr-2" />
          Clear Cache
        </button>
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <Loader class="h-8 w-8 animate-spin text-primary-600" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { 
  Users, Activity, MapPin, AlertTriangle, Check, Eye, Database, 
  Settings, FileText, RefreshCw, Loader 
} from 'lucide-vue-next'
import { getTimeSince } from '@/utils/helpers'
import api from '@/services/api'

const loading = ref(false)

const stats = reactive({
  totalUsers: 0,
  activeSessions: 0,
  totalSessions: 0,
  reports: 0
})

const recentSessions = ref([])
const abuseReports = ref([])

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

const loadAdminData = async () => {
  loading.value = true
  
  try {
    // Load stats
    const statsResponse = await api.get('/admin/stats')
    Object.assign(stats, statsResponse.data)
    
    // Load recent sessions
    const sessionsResponse = await api.get('/admin/sessions/recent')
    recentSessions.value = sessionsResponse.data.sessions
    
    // Load abuse reports
    const reportsResponse = await api.get('/admin/reports')
    abuseReports.value = reportsResponse.data.reports
    
  } catch (error) {
    console.error('Failed to load admin data:', error)
  } finally {
    loading.value = false
  }
}

const resolveReport = async (reportId) => {
  try {
    await api.post(`/admin/reports/${reportId}/resolve`)
    abuseReports.value = abuseReports.value.filter(r => r.id !== reportId)
    stats.reports--
  } catch (error) {
    console.error('Failed to resolve report:', error)
  }
}

const viewReport = (report) => {
  // Open report details modal
  console.log('View report:', report)
}

onMounted(() => {
  loadAdminData()
})
</script>
