<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-3">
            <MapPin class="h-6 w-6 text-primary-600" />
            <div>
              <h1 class="text-lg font-semibold text-gray-900">Live Tracking</h1>
              <p class="text-sm text-gray-600">Code: {{ code }}</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-3">
            <div v-if="session?.lastUpdate" class="text-sm text-gray-600">
              Last update: {{ getTimeSince(session.lastUpdate) }}
            </div>
            <span v-if="session" :class="statusClass">
              {{ session.status }}
            </span>
            <button 
              @click="shareSession"
              class="btn btn-sm btn-secondary"
              title="Share this tracking session"
            >
              <Share2 class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-96">
      <div class="text-center">
        <Loader class="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
        <p class="text-gray-600">Loading tracking session...</p>
      </div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="max-w-md mx-auto px-4 py-16">
      <div class="text-center">
        <AlertTriangle class="h-12 w-12 text-orange-500 mx-auto mb-4" />
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Session Not Found</h2>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <router-link to="/" class="btn btn-primary">
          <ArrowLeft class="h-4 w-4 mr-2" />
          Go Home
        </router-link>
      </div>
    </div>
    
    <!-- Main Content -->
    <div v-else-if="session" class="flex flex-col lg:flex-row h-screen-minus-header">
      <!-- Map -->
      <div class="flex-1 relative">
        <div ref="mapContainer" class="w-full h-full"></div>
        
        <!-- Map Controls -->
        <div class="absolute top-4 right-4 space-y-2">
          <button 
            @click="centerOnLocation"
            :disabled="!currentLocation"
            class="btn btn-sm bg-white shadow-lg"
            title="Center on tracked location"
          >
            <Navigation class="h-4 w-4" />
          </button>
          <button 
            @click="centerOnUserLocation"
            :disabled="!userLocation"
            class="btn btn-sm bg-white shadow-lg"
            title="Center on your location"
          >
            <MapPin class="h-4 w-4 text-green-600" />
          </button>
          <button 
            @click="toggleFullscreen"
            class="btn btn-sm bg-white shadow-lg"
            title="Toggle fullscreen"
          >
            <Maximize class="h-4 w-4" />
          </button>
        </div>
        
        <!-- Status Overlay -->
        <div v-if="session?.status !== 'active'" class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div class="bg-white rounded-lg p-6 text-center max-w-sm mx-4">
            <Clock class="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Session Ended</h3>
            <p class="text-gray-600">This tracking session is no longer active.</p>
          </div>
        </div>
      </div>
      
      <!-- Sidebar -->
      <div class="w-full lg:w-80 bg-white border-l border-gray-200 overflow-y-auto">
        <div class="p-6">
          <!-- Session Info -->
          <div class="mb-6">
          <!-- Session Info -->
          <div class="mb-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Session Details</h2>
            <div class="space-y-3 text-sm"> session.notes }}</p>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Started:</span>
                <span class="text-gray-900">{{ formatDateTime(session.createdAt) }}</span>
              </div>
              <div v-if="session.expiresAt" class="flex justify-between">
                <span class="text-gray-600">Expires:</span>
                <span class="text-gray-900">{{ formatDateTime(session.expiresAt) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Duration:</span>
                <span class="text-gray-900">{{ formatDuration(session.createdAt, session.endedAt) }}</span>
              </div>
            </div>
          </div>
          
          <!-- Current Location -->
          <div v-if="currentLocation" class="mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Current Location</h3>
            <div class="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Latitude:</span>
                <span class="font-mono text-gray-900">{{ currentLocation.lat.toFixed(6) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Longitude:</span>
                <span class="font-mono text-gray-900">{{ currentLocation.lng.toFixed(6) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Accuracy:</span>
                <span class="text-gray-900">±{{ Math.round(currentLocation.accuracy) }}m</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Last Update:</span>
                <span class="text-gray-900">{{ lastUpdateTime }}</span>
              </div>
            </div>
          </div>
          
          <!-- Connection Status -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Connection</h3>
            <div class="flex items-center space-x-2">
              <div :class="connectionStatusClass"></div>
              <span class="text-sm text-gray-600">{{ connectionStatus }}</span>
            </div>
          </div>
          
          <!-- User Location -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Your Location</h3>
            <div class="space-y-3">
              <button 
                @click="toggleUserLocationSharing"
                :class="[
                  'btn w-full',
                  isWatchingUserLocation ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500' : 'btn-secondary'
                ]"
              >
                <Navigation class="h-4 w-4 mr-2" />
                {{ isWatchingUserLocation ? 'Stop Sharing Location' : 'Share Your Location' }}
              </button>
              
              <div v-if="userLocation" class="bg-blue-50 rounded-lg p-3 text-sm">
                <p class="font-medium text-blue-900 mb-2">Your current location:</p>
                <div class="space-y-1 text-blue-700">
                  <div class="flex justify-between">
                    <span>Latitude:</span>
                    <span class="font-mono">{{ userLocation.lat.toFixed(6) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Longitude:</span>
                    <span class="font-mono">{{ userLocation.lng.toFixed(6) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Accuracy:</span>
                    <span>±{{ Math.round(userLocation.accuracy) }}m</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="space-y-3">
            <button 
              @click="copyTrackingUrl"
              class="btn btn-primary w-full"
            >
              <Copy class="h-4 w-4 mr-2" />
              Copy Tracking Link
            </button>
            <button 
              @click="downloadLocationData"
              :disabled="!locationHistory.length"
              class="btn btn-secondary w-full"
            >
              <Download class="h-4 w-4 mr-2" />
              Download Data
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Share Modal -->
    <Modal v-model="showShareModal" title="Share Tracking Session">
      <div class="space-y-4">
        <p class="text-gray-600">Share this tracking session with others:</p>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tracking URL</label>
          <div class="flex">
            <input 
              :value="trackingUrl" 
              readonly 
              class="input flex-1 bg-gray-100"
            />
            <button 
              @click="copyTrackingUrl"
              class="btn btn-secondary ml-2"
            >
              <Copy class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { 
  MapPin, Share2, Loader, AlertTriangle, ArrowLeft, Navigation, 
  Maximize, Clock, Copy, Download 
} from 'lucide-vue-next'
import { useSessionStore } from '@/stores/session'
import { createMap, createMarker, createInfoWindow, initGoogleMaps, watchLocation } from '@/services/maps'
import { formatDateTime, formatDuration, getTimeSince, copyToClipboard } from '@/utils/helpers'
import Modal from '@/components/ui/Modal.vue'

const route = useRoute()
const sessionStore = useSessionStore()

const code = route.params.code
const session = ref(null)
const loading = ref(false)
const error = ref('')
const currentLocation = ref(null)
const userLocation = ref(null) // User's own location if they enable sharing
const locationHistory = ref([])
const map = ref(null)
const marker = ref(null)
const userMarker = ref(null) // Marker for user's location
const pathPolyline = ref(null)
const mapContainer = ref(null)
const showShareModal = ref(false)
const isConnected = ref(true)
const updateInterval = ref(null)
const watchId = ref(null) // For watching user's location
const isWatchingUserLocation = ref(false)

const statusClass = computed(() => {
  if (!session.value) return ''
  
  switch (session.value.status) {
    case 'active':
      return 'px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full'
    case 'ended':
      return 'px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full'
    case 'expired':
      return 'px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full'
    default:
      return 'px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full'
  }
})

const connectionStatusClass = computed(() => {
  return isConnected.value 
    ? 'w-3 h-3 bg-success-500 rounded-full animate-pulse'
    : 'w-3 h-3 bg-danger-500 rounded-full'
})

const connectionStatus = computed(() => {
  return isConnected.value ? 'Connected' : 'Disconnected'
})

const lastUpdateTime = computed(() => {
  if (!currentLocation.value?.timestamp) return 'Never'
  return new Date(currentLocation.value.timestamp).toLocaleTimeString()
})

const trackingUrl = computed(() => {
  return `${window.location.origin}/view/${code}`
})

const loadSession = async () => {
  loading.value = true
  error.value = ''
  
  const result = await sessionStore.getPublicSession(code)
  
  if (result.success) {
    session.value = result.session
    
    // Start polling for updates if session is active
    if (session.value.status === 'active') {
      startLocationUpdates()
      // Initialize map with default location if no location data yet
      initializeMapIfNeeded()
    }
  } else {
    error.value = result.error
  }
  
  loading.value = false
}

const initializeMapIfNeeded = async () => {
  // Initialize map with default location if we don't have location data yet
  if (!map.value && mapContainer.value && !currentLocation.value) {
    map.value = await createMap(mapContainer.value, {
      center: { lat: 6.5244, lng: 3.3792 }, // Lagos, Nigeria (default)
      zoom: 13
    })
  }
}

const startLocationUpdates = () => {
  // Poll for location updates every 3 seconds
  updateInterval.value = setInterval(async () => {
    try {
      const result = await sessionStore.getLatestLocation(code)
      
      if (result.success && result.location) {
        const newLocation = result.location
        
        if (!currentLocation.value || 
            newLocation.latitude !== currentLocation.value.lat || 
            newLocation.longitude !== currentLocation.value.lng) {
          
          // Ensure lat/lng are numbers
          const lat = parseFloat(newLocation.latitude)
          const lng = parseFloat(newLocation.longitude)
          
          if (isNaN(lat) || isNaN(lng)) {
            console.error('Invalid coordinates:', { lat, lng, original: newLocation })
            return
          }
          
          currentLocation.value = {
            lat: lat,
            lng: lng,
            accuracy: newLocation.accuracy || 0,
            timestamp: Date.now()
          }
          locationHistory.value.push({
            ...currentLocation.value,
            timestamp: Date.now()
          })
          
          updateMap(currentLocation.value)
        }
        
        isConnected.value = true
      } else {
        console.log('No location data available:', result.error)
        
        isConnected.value = true
      } else {
        // Don't treat this as a connection error if there's just no location yet
        isConnected.value = true
      }
  }, 3000)
}

const updateMap = async (location) => {
  try {
    // Validate location data
    if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
      console.error('Invalid location data for map:', location)
const updateMap = async (location) => {
  try {
    // Validate location data
    if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
      console.error('Invalid location data for map:', location)
      return
    }
    
    if (isNaN(location.lat) || isNaN(location.lng)) {
      console.error('Invalid coordinates (NaN):', location)
      return
    }
    
    if (!map.value && mapContainer.value) {
    
    if (map.value) {
      const newCenter = { lat: location.lat, lng: location.lng }
      
      if (marker.value) {
        marker.value.setPosition(newCenter)
      } else {
        marker.value = await createMarker(map.value, newCenter, {
          title: 'Current Location',
          icon: {
            url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iOCIgZmlsbD0iIzM5ODRmNiIvPgo8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI0IiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K',
            scaledSize: new google.maps.Size(24, 24),
            anchor: new google.maps.Point(12, 12)
          }
        })
        
        // Add info window
        const infoWindow = await createInfoWindow(`
          <div class="p-2">
            <h3 class="font-semibold">Live Location</h3>
            <p class="text-sm text-gray-600">Accuracy: ±${Math.round(location.accuracy)}m</p>
          </div>
        `)
        
        marker.value.addListener('click', () => {
          infoWindow.open(map.value, marker.value)
        })
      }
      
      // Update path if we have multiple locations
      if (locationHistory.value.length > 1) {
        updatePath()
      }
    }
  } catch (err) {
    console.error('Map error:', err)
  }
}

const updatePath = async () => {
  const google = await initGoogleMaps()
  
  if (pathPolyline.value) {
    pathPolyline.value.setMap(null)
  }
  
  const path = locationHistory.value.map(loc => ({ lat: loc.lat, lng: loc.lng }))
  
  pathPolyline.value = new google.maps.Polyline({
    path,
    geodesic: true,
    strokeColor: '#3b82f6',
    strokeOpacity: 0.8,
    strokeWeight: 3,
    map: map.value
  })
}

const centerOnLocation = () => {
  if (map.value && currentLocation.value) {
    map.value.setCenter({ lat: currentLocation.value.lat, lng: currentLocation.value.lng })
    map.value.setZoom(16)
  }
}

const centerOnUserLocation = () => {
  if (map.value && userLocation.value) {
    map.value.setCenter({ lat: userLocation.value.lat, lng: userLocation.value.lng })
    map.value.setZoom(16)
  }
}

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    mapContainer.value.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

const shareSession = () => {
  showShareModal.value = true
}

const copyTrackingUrl = async () => {
  const success = await copyToClipboard(trackingUrl.value)
  if (success) {
    showShareModal.value = false
    // Show toast notification
    console.log('Tracking URL copied to clipboard')
  }
}

const downloadLocationData = () => {
  if (!locationHistory.value.length) return
  
  const data = {
    session: {
      code: session.value.code,
      notes: session.value.notes,
      createdAt: session.value.createdAt,
      endedAt: session.value.endedAt
    },
    locations: locationHistory.value
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `tracking-${code}-${Date.now()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const toggleUserLocationSharing = () => {
  if (isWatchingUserLocation.value) {
    stopWatchingUserLocation()
  } else {
    startWatchingUserLocation()
  }
}

const startWatchingUserLocation = () => {
  if (!navigator.geolocation) {
    console.error('Geolocation not supported')
    return
  }

  isWatchingUserLocation.value = true
  
  watchId.value = watchLocation(
    (location) => {
      userLocation.value = location
      updateUserLocationOnMap(location)
    },
    (error) => {
      console.error('User location error:', error)
      isWatchingUserLocation.value = false
      
      // You could show a toast notification here
      alert(`Location error: ${error.message}`)
    },
    {
      maxAccuracy: 50, // More lenient for viewers since it's just for reference
      minDistance: 20, // Larger minimum distance for viewers
      throttleInterval: 8000 // Less frequent updates for viewers (8 seconds)
    }
  )
}

const stopWatchingUserLocation = () => {
  if (watchId.value) {
    navigator.geolocation.clearWatch(watchId.value)
    watchId.value = null
  }
  
  isWatchingUserLocation.value = false
  userLocation.value = null
  
  // Remove user marker from map
  if (userMarker.value) {
    userMarker.value.setMap(null)
    userMarker.value = null
  }
}

const updateUserLocationOnMap = async (location) => {
  try {
    if (!map.value) return
    
    const userPosition = { lat: location.lat, lng: location.lng }
    
    if (userMarker.value) {
      userMarker.value.setPosition(userPosition)
    } else {
      userMarker.value = await createMarker(map.value, userPosition, {
        title: 'Your Location',
        icon: {
          url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iOCIgZmlsbD0iIzEwYjk4MSIvPgo8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI0IiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K',
          scaledSize: new google.maps.Size(24, 24),
          anchor: new google.maps.Point(12, 12)
        }
      })
      
      // Add info window for user location
      const userInfoWindow = await createInfoWindow(`
        <div class="p-2">
          <h3 class="font-semibold text-green-700">Your Location</h3>
          <p class="text-sm text-gray-600">Accuracy: ±${Math.round(location.accuracy)}m</p>
          ${location.speed ? `<p class="text-sm text-gray-600">Speed: ${Math.round(location.speed * 3.6)} km/h</p>` : ''}
        </div>
      `)
      
      userMarker.value.addListener('click', () => {
        userInfoWindow.open(map.value, userMarker.value)
      })
    }
  } catch (err) {
    console.error('User location map error:', err)
  }
}

onMounted(() => {
  loadSession()
})

onUnmounted(() => {
  if (updateInterval.value) {
    clearInterval(updateInterval.value)
  }
  
  // Stop watching user location
  stopWatchingUserLocation()
})
</script>

<style scoped>
.h-screen-minus-header {
  height: calc(100vh - 4rem);
}
</style>
