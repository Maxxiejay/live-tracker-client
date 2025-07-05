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

export const watchLocation = (callback, errorCallback) => {
  if (!navigator.geolocation) {
    errorCallback(new Error('Geolocation is not supported by this browser'))
    return null
  }

  return navigator.geolocation.watchPosition(
    (position) => {
      callback({
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
      timeout: 10000,
      maximumAge: 5000 // Reduced for more frequent updates
    }
  )
}
