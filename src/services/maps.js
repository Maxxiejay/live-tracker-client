import { Loader } from '@googlemaps/js-api-loader'

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'

let loader = null
let googleMaps = null

export const initGoogleMaps = async () => {
  if (googleMaps) return googleMaps

  if (!loader) {
    loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places', 'geometry']
    })
  }

  try {
    googleMaps = await loader.load()
    return googleMaps
  } catch (error) {
    console.error('Error loading Google Maps:', error)
    throw error
  }
}

export const createMap = async (container, options = {}) => {
  const google = await initGoogleMaps()
  
  const defaultOptions = {
    zoom: 13,
    center: { lat: 6.5244, lng: 3.3792 }, // Lagos, Nigeria
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    ...options
  }

  return new google.maps.Map(container, defaultOptions)
}

export const createMarker = async (map, position, options = {}) => {
  const google = await initGoogleMaps()
  
  const defaultOptions = {
    position,
    map,
    ...options
  }

  return new google.maps.Marker(defaultOptions)
}

export const createInfoWindow = async (content, options = {}) => {
  const google = await initGoogleMaps()
  
  const defaultOptions = {
    content,
    ...options
  }

  return new google.maps.InfoWindow(defaultOptions)
}

export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          altitudeAccuracy: position.coords.altitudeAccuracy,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: position.timestamp
        })
      },
      (error) => {
        let errorMessage = 'Location error occurred'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out'
            break
          default:
            errorMessage = error.message || 'Unknown location error'
        }
        
        reject({
          code: error.code,
          message: errorMessage,
          originalError: error
        })
      },
      {
        enableHighAccuracy: true,
        timeout: 15000, // Longer timeout for initial position
        maximumAge: 60000
      }
    )
  })
}

export const watchLocation = (callback, errorCallback, options = {}) => {
  if (!navigator.geolocation) {
    errorCallback(new Error('Geolocation is not supported by this browser'))
    return null
  }

  let lastPosition = null
  let lastUpdateTime = 0
  
  // Configuration for jitter reduction
  const config = {
    maxAccuracy: 30, // Only accept readings with accuracy <= 30m
    minDistance: 15, // Ignore movements < 15m 
    throttleInterval: 5000, // Throttle updates to 5 seconds
    ...options
  }

  return navigator.geolocation.watchPosition(
    (position) => {
      const now = Date.now()
      const coords = position.coords
      
      // Filter 1: Check accuracy - only use good readings
      if (coords.accuracy > config.maxAccuracy) {
        console.log(`Ignoring inaccurate reading: ${coords.accuracy}m > ${config.maxAccuracy}m`)
        return
      }
      
      // Filter 2: Throttle updates - limit frequency
      if (now - lastUpdateTime < config.throttleInterval) {
        console.log(`Throttling update: ${now - lastUpdateTime}ms < ${config.throttleInterval}ms`)
        return
      }
      
      const newLocation = {
        lat: coords.latitude,
        lng: coords.longitude,
        accuracy: coords.accuracy,
        altitude: coords.altitude,
        altitudeAccuracy: coords.altitudeAccuracy,
        heading: coords.heading,
        speed: coords.speed,
        timestamp: position.timestamp
      }
      
      // Filter 3: Check distance - ignore small movements to prevent jitter
      if (lastPosition) {
        const distance = calculateDistance(
          lastPosition.lat, lastPosition.lng,
          newLocation.lat, newLocation.lng
        )
        
        if (distance < config.minDistance) {
          console.log(`Ignoring small movement: ${distance.toFixed(1)}m < ${config.minDistance}m`)
          return
        }
      }
      
      // Update last position and time
      lastPosition = newLocation
      lastUpdateTime = now
      
      callback(newLocation)
    }, 
    (error) => {
      // Enhanced error handling
      let errorMessage = 'Location error occurred'
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location access denied by user'
          break
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information unavailable'
          break
        case error.TIMEOUT:
          errorMessage = 'Location request timed out'
          break
        default:
          errorMessage = error.message || 'Unknown location error'
      }
      
      errorCallback({
        code: error.code,
        message: errorMessage,
        originalError: error
      })
    },
    {
      enableHighAccuracy: true,
      timeout: 15000, // Longer timeout for better accuracy
      maximumAge: 2000 // Shorter cache for more current readings
    }
  )
}

// Helper function to calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371e3 // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180
  const φ2 = lat2 * Math.PI / 180
  const Δφ = (lat2 - lat1) * Math.PI / 180
  const Δλ = (lng2 - lng1) * Math.PI / 180

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

  return R * c // Distance in meters
}
