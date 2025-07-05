<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <div class="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <FileX class="h-12 w-12 text-gray-400" />
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p class="text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist or the tracking code is invalid.
        </p>
        
        <div class="space-y-4">
          <router-link to="/" class="btn btn-primary btn-lg w-full">
            <Home class="h-5 w-5 mr-2" />
            Go Home
          </router-link>
          
          <button 
            @click="showViewCodeModal = true"
            class="btn btn-secondary btn-lg w-full"
          >
            <Search class="h-5 w-5 mr-2" />
            Try Another Code
          </button>
          
          <div class="text-center">
            <p class="text-sm text-gray-600">
              Need help? 
              <a href="#" class="text-primary-600 hover:text-primary-500 font-medium">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
    
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
import { FileX, Home, Search } from 'lucide-vue-next'
import Modal from '@/components/ui/Modal.vue'

const router = useRouter()

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
