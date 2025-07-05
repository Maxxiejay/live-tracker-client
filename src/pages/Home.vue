<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold mb-6">
            Track Anyone. Anytime. <span class="text-primary-200">With Consent.</span>
          </h1>
          <p class="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Real-time location sharing made simple and secure. Create temporary tracking sessions 
            for deliveries, rides, or keeping track of loved ones.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link 
              v-if="!authStore.isAuthenticated"
              to="/auth/register" 
              class="btn btn-lg bg-white text-primary-600 hover:bg-gray-100"
            >
              <UserPlus class="h-5 w-5 mr-2" />
              Get Started Free
            </router-link>
            <router-link 
              v-else
              to="/new-session" 
              class="btn btn-lg bg-white text-primary-600 hover:bg-gray-100"
            >
              <Plus class="h-5 w-5 mr-2" />
              Create Tracking
            </router-link>
            <button 
              @click="showViewCodeModal = true"
              class="btn btn-lg border-2 border-white text-white hover:bg-white hover:text-primary-600"
            >
              <Search class="h-5 w-5 mr-2" />
              View a Code
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Get started in just three simple steps
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <Link class="h-8 w-8 text-primary-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">1. Create tracking link</h3>
            <p class="text-gray-600">
              Generate a unique tracking code and share link with the person you want to track.
            </p>
          </div>
          
          <div class="text-center">
            <div class="bg-success-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <MapPin class="h-8 w-8 text-success-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">2. Rider accepts & shares location</h3>
            <p class="text-gray-600">
              The rider opens the link and grants permission to share their live location.
            </p>
          </div>
          
          <div class="text-center">
            <div class="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <Eye class="h-8 w-8 text-purple-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">3. You and others track live on map</h3>
            <p class="text-gray-600">
              Watch real-time location updates on an interactive map accessible to anyone with the code.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose LiveTrack?
          </h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="card text-center">
            <Smartphone class="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 class="text-lg font-semibold text-gray-900 mb-2">No App Required</h3>
            <p class="text-gray-600 text-sm">
              Works directly in the browser. No downloads or installations needed.
            </p>
          </div>
          
          <div class="card text-center">
            <Clock class="h-12 w-12 text-success-600 mx-auto mb-4" />
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Temporary Sessions</h3>
            <p class="text-gray-600 text-sm">
              Sessions automatically expire or can be stopped anytime for privacy.
            </p>
          </div>
          
          <div class="card text-center">
            <Map class="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Real-time Updates</h3>
            <p class="text-gray-600 text-sm">
              See live location updates with accurate positioning and tracking history.
            </p>
          </div>
          
          <div class="card text-center">
            <Shield class="h-12 w-12 text-orange-600 mx-auto mb-4" />
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Privacy First</h3>
            <p class="text-gray-600 text-sm">
              Consent-based tracking with full control over who can see your location.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-primary-600">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Start Tracking?
        </h2>
        <p class="text-xl text-primary-100 mb-8">
          Create your first tracking session in under a minute.
        </p>
        <router-link 
          v-if="!authStore.isAuthenticated"
          to="/auth/register" 
          class="btn btn-lg bg-white text-primary-600 hover:bg-gray-100"
        >
          <UserPlus class="h-5 w-5 mr-2" />
          Get Started Free
        </router-link>
        <router-link 
          v-else
          to="/new-session" 
          class="btn btn-lg bg-white text-primary-600 hover:bg-gray-100"
        >
          <Plus class="h-5 w-5 mr-2" />
          Create Tracking Session
        </router-link>
      </div>
    </section>

    <!-- View Code Modal -->
    <Modal v-model="showViewCodeModal" title="View Tracking Session">
      <form @submit.prevent="viewCode" class="space-y-4">
        <div>
          <label for="code" class="block text-sm font-medium text-gray-700 mb-2">
            Enter Tracking Code
          </label>
          <input
            id="code"
            v-model="viewCodeForm.code"
            type="text"
            placeholder="e.g., ABC123XY"
            class="input"
            required
          />
        </div>
        <div class="flex justify-end space-x-3">
          <button 
            type="button" 
            @click="showViewCodeModal = false"
            class="btn btn-secondary"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            :disabled="!viewCodeForm.code.trim()"
            class="btn btn-primary"
          >
            <Search class="h-4 w-4 mr-2" />
            View Session
          </button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { 
  UserPlus, Plus, Search, Link, MapPin, Eye, 
  Smartphone, Clock, Map, Shield 
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import Modal from '@/components/ui/Modal.vue'

const router = useRouter()
const authStore = useAuthStore()

const showViewCodeModal = ref(false)
const viewCodeForm = reactive({
  code: ''
})

const viewCode = () => {
  if (viewCodeForm.code.trim()) {
    router.push(`/view/${viewCodeForm.code.trim().toUpperCase()}`)
    showViewCodeModal.value = false
    viewCodeForm.code = ''
  }
}
</script>
