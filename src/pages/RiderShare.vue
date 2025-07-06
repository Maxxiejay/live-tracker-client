<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-md mx-auto px-4 py-8">
      <div class="text-center mb-8">
        <div class="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <MapPin class="h-8 w-8 text-primary-600" />
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Share Your Location</h1>
        <p class="text-gray-600">Tracking Code: <span class="font-mono font-semibold">{{ code }}</span></p>
      </div>
      
      <!-- Session Info -->
      <div v-if="session" class="card mb-6">
        <h3 class="font-semibold text-gray-900 mb-2">Session Details</h3>
        <div class="space-y-2 text-sm text-gray-600">
          <p v-if="session.notes"><strong>Notes:</strong> {{ session.notes }}</p>
          <p><strong>Created:</strong> {{ formatDateTime(session.createdAt) }}</p>
          <p v-if="session.expiresAt"><strong>Expires:</strong> {{ formatDateTime(session.expiresAt) }}</p>
        </div>
      </div>
      
      <!-- Privacy Notice -->
      <div class="card mb-6 bg-blue-50 border-blue-200">
        <div class="flex items-start">
          <Shield class="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
          <div class="text-sm text-blue-800">
            <p class="font-medium mb-1">Your privacy is protected</p>
            <p>Only people with this tracking code can see your location. You can stop sharing anytime.</p>
          </div>
        </div>
      </div>
      
      <!-- Location Sharing Controls -->
      <div class="space-y-4">
        <div v-if="!isSharing && !hasPermission" class="card text-center">
          <MapPin class="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Ready to start sharing?</h3>
          <p class="text-gray-600 mb-4">Your browser will ask for location permission to start tracking.</p>
          <button 
            @click="startSharing"
            :disabled="loading"
            class="btn btn-primary btn-lg w-full"
          >
            <Loader v-if="loading" class="animate-spin h-4 w-4 mr-2" />
            <Play v-else class="h-5 w-5 mr-2" />
            Start Sharing Location
          </button>
        </div>
        
        <div v-else-if="isSharing" class="card">
          <div class="text-center mb-4">
            <div class="bg-success-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <div class="w-3 h-3 bg-success-600 rounded-full animate-pulse"></div>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">Sharing Location</h3>
            <p class="text-sm text-gray-600">Your location is being shared live</p>
          </div>
          
          <div v-if="currentLocation" class="bg-gray-50 rounded-lg p-4 mb-4">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600">Current Location:</span>
              <span class="text-gray-900 font-mono">
                {{ currentLocation.lat.toFixed(6) }}, {{ currentLocation.lng.toFixed(6) }}
              </span>
            </div>
            <div class="flex items-center justify-between text-sm mt-1">
              <span class="text-gray-600">Accuracy:</span>
              <span class="text-gray-900">±{{ Math.round(currentLocation.accuracy) }}m</span>
            </div>
            <div class="flex items-center justify-between text-sm mt-1">
              <span class="text-gray-600">Last Update:</span>
              <span class="text-gray-900">{{ lastUpdateTime }}</span>
            </div>
          </div>
          
          <button 
            @click="stopSharing"
            class="btn btn-danger w-full"
          >
            <Square class="h-4 w-4 mr-2" />
            Stop Sharing
          </button>
        </div>
        
        <div v-else-if="permissionDenied" class="card text-center">
          <AlertTriangle class="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Location Access Denied</h3>
          <p class="text-gray-600 mb-4">
            Please enable location access in your browser settings to share your location.
          </p>
          <button 
            @click="startSharing"
            class="btn btn-primary w-full"
          >
            <RotateCcw class="h-4 w-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
      
      <!-- Map Preview -->
      <div v-if="currentLocation" class="mt-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-3">Your Location</h3>
        <div class="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
          <div ref="mapContainer" class="w-full h-full rounded-lg"></div>
        </div>
      </div>
      
      <!-- Error Messages -->
      <Alert v-if="error" type="error" class="mt-4">
        {{ error }}
      </Alert>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { 
  MapPin, Shield, Play, Square, Loader, AlertTriangle, RotateCcw 
} from 'lucide-vue-next'
import { useSessionStore } from '@/stores/session'
import { createMap, createMarker, watchLocation } from '@/services/maps'
import { formatDateTime, debounce } from '@/utils/helpers'
import Alert from '@/components/ui/Alert.vue'

const route = useRoute()
const sessionStore = useSessionStore()

const code = route.params.code
const session = ref(null)
const loading = ref(false)
const error = ref('')
const isSharing = ref(false)
const hasPermission = ref(false)
const permissionDenied = ref(false)
const currentLocation = ref(null)
const map = ref(null)
const marker = ref(null)
const mapContainer = ref(null)
const locationWatchId = ref(null)

const lastUpdateTime = computed(() => {
  if (!currentLocation.value?.timestamp) return 'Never'
  return new Date(currentLocation.value.timestamp).toLocaleTimeString()
})

const loadSession = async () => {
  loading.value = true
  error.value = ''
  
  const result = await sessionStore.getPublicSession(code)
  
  if (result.success) {
    session.value = result.session
    
    if (session.value.status !== 'active') {
      error.value = 'This tracking session has ended.'
    }
  } else {
    error.value = result.error
  }
  
  loading.value = false
}

const startSharing = async () => {
  loading.value = true
  error.value = ''
  permissionDenied.value = false
  
  try {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported by this browser')
    }
    
    // Start watching location with jitter reduction
    locationWatchId.value = watchLocation(
      (position) => {
        currentLocation.value = position
        isSharing.value = true
        hasPermission.value = true
        loading.value = false
        
        // Update server with new location
        updateLocationOnServer(position)
        
        // Update map
        updateMap(position)
      },
      (error) => {
        console.error('Location error:', error)
        loading.value = false
        
        if (error.code === error.PERMISSION_DENIED) {
          permissionDenied.value = true
          isSharing.value = false
        } else {
          error.value = `Location error: ${error.message}`
        }
      },
      {
        maxAccuracy: 500, // Very lenient - accept readings up to 500m accuracy
        minDistance: 25, // Slightly larger minimum distance for poor GPS
        throttleInterval: 5000 // Update every 5 seconds
      }
    )
  } catch (err) {
    loading.value = false
    error.value = err.message
  }
}

const stopSharing = () => {
  if (locationWatchId.value) {
    navigator.geolocation.clearWatch(locationWatchId.value)
    locationWatchId.value = null
  }
  
  isSharing.value = false
  currentLocation.value = null
  
  // End session on server
  sessionStore.endSession(code)
}

const updateLocationOnServer = debounce(async (position) => {
  await sessionStore.updateSessionLocation(code, {
    lat: position.lat,
    lng: position.lng,
    accuracy: position.accuracy,
    timestamp: position.timestamp
  })
}, 3000) // Increased from 2s to 3s since we're already filtering at watchLocation level

const updateMap = async (position) => {
  try {
    if (!map.value && mapContainer.value) {
      map.value = await createMap(mapContainer.value, {
        center: { lat: position.lat, lng: position.lng },
        zoom: 16
      })
    }
    
    if (map.value) {
      const newCenter = { lat: position.lat, lng: position.lng }
      map.value.setCenter(newCenter)
      
      if (marker.value) {
        marker.value.setPosition(newCenter)
      } else {
        marker.value = await createMarker(map.value, newCenter, {
          title: 'Your Location'
        })
      }
    }
  } catch (err) {
    console.error('Map error:', err)
  }
}

onMounted(() => {
  loadSession()
})

onUnmounted(() => {
  if (locationWatchId.value) {
    navigator.geolocation.clearWatch(locationWatchId.value)
  }
})
</script>
