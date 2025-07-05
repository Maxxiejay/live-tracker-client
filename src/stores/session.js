import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useSessionStore = defineStore('session', () => {
  const sessions = ref([])
  const currentSession = ref(null)
  const loading = ref(false)
  
  const activeSessions = computed(() => 
    sessions.value.filter(session => session.status === 'active')
  )
  
  const endedSessions = computed(() => 
    sessions.value.filter(session => session.status !== 'active')
  )
  
  const fetchSessions = async () => {
    loading.value = true
    try {
      const response = await api.get('/sessions')
      sessions.value = response.data.sessions
    } catch (error) {
      console.error('Failed to fetch sessions:', error)
    } finally {
      loading.value = false
    }
  }
  
  const createSession = async (sessionData) => {
    try {
      const response = await api.post('/sessions', sessionData)
      const newSession = response.data.session
      sessions.value.unshift(newSession)
      return { success: true, session: newSession }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to create session' 
      }
    }
  }
  
  const getSession = async (code) => {
    try {
      const response = await api.get(`/public/${code}`)
      currentSession.value = response.data.session
      return { success: true, session: response.data.session }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Session not found' 
      }
    }
  }
  
  const updateSessionLocation = async (code, location) => {
    try {
      await api.post(`/location/${code}`, {
        latitude: location.lat,
        longitude: location.lng,
        accuracy: location.accuracy
      })
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to update location' 
      }
    }
  }
  
  const endSession = async (code) => {
    try {
      await api.patch(`/sessions/${code}/end`)
      const sessionIndex = sessions.value.findIndex(s => s.code === code)
      if (sessionIndex !== -1) {
        sessions.value[sessionIndex].status = 'ended'
        sessions.value[sessionIndex].endedAt = new Date().toISOString()
      }
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to end session' 
      }
    }
  }
  
  const deleteSession = async (code) => {
    try {
      await api.delete(`/sessions/${code}`)
      sessions.value = sessions.value.filter(s => s.code !== code)
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to delete session' 
      }
    }
  }
  
  // Public endpoints for viewing sessions
  const getPublicSession = async (code) => {
    try {
      const response = await api.get(`/public/${code}`)
      return { success: true, session: response.data.session }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Session not found' 
      }
    }
  }
  
  const getPublicLocation = async (code) => {
    try {
      const response = await api.get(`/public/${code}/view`)
      return { success: true, location: response.data }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Location not available' 
      }
    }
  }
  
  const getLocationHistory = async (code) => {
    try {
      const response = await api.get(`/location/${code}/all`)
      return { success: true, locations: response.data }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to get location history' 
      }
    }
  }
  
  const getLatestLocation = async (code) => {
    try {
      const response = await api.get(`/location/${code}/latest`)
      return { success: true, location: response.data.location }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'No location data available' 
      }
    }
  }
  
  return {
    sessions,
    currentSession,
    loading,
    activeSessions,
    endedSessions,
    fetchSessions,
    createSession,
    getSession,
    updateSessionLocation,
    endSession,
    deleteSession,
    getPublicSession,
    getPublicLocation,
    getLocationHistory,
    getLatestLocation
  }
})
