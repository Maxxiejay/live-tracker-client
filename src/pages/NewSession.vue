<template>
  <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Create New Tracking Session</h1>
      <p class="text-gray-600 mt-2">Generate a tracking link to share with the person you want to track</p>
    </div>
    
    <div class="card">
      <form @submit.prevent="createSession" class="space-y-6">
        <div>
          <label for="notes" class="block text-sm font-medium text-gray-700 mb-2">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            v-model="form.notes"
            rows="3"
            class="input"
            placeholder="e.g., Bike delivery to Ikeja, Meeting with client, etc."
          ></textarea>
          <p class="text-xs text-gray-500 mt-1">Add a description to help you identify this tracking session</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Session Settings
          </label>
          <div class="space-y-3">
            <label class="flex items-center">
              <input 
                v-model="form.autoExpire" 
                type="checkbox" 
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span class="ml-2 text-sm text-gray-700">Auto-expire session</span>
            </label>
            
            <div v-if="form.autoExpire" class="ml-6">
              <label for="duration" class="block text-sm font-medium text-gray-700 mb-1">
                Duration (hours)
              </label>
              <select id="duration" v-model="form.duration" class="input w-32">
                <option value="1">1 hour</option>
                <option value="2">2 hours</option>
                <option value="4">4 hours</option>
                <option value="8">8 hours</option>
                <option value="12">12 hours</option>
                <option value="24">24 hours</option>
              </select>
            </div>
          </div>
        </div>
        
        <button 
          type="submit" 
          :disabled="loading"
          class="w-full btn btn-primary btn-lg"
        >
          <Loader v-if="loading" class="animate-spin h-4 w-4 mr-2" />
          <Plus v-else class="h-4 w-4 mr-2" />
          Generate Tracking Session
        </button>
      </form>
      
      <Alert v-if="error" type="error" class="mt-4">
        {{ error }}
      </Alert>
    </div>
    
    <!-- Success Modal -->
    <Modal v-model="showSuccessModal" title="Tracking Session Created!" size="lg">
      <div class="space-y-6">
        <div class="text-center">
          <div class="bg-success-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <CheckCircle class="h-8 w-8 text-success-600" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Session ready!</h3>
          <p class="text-gray-600">Share the tracking code or link with the person you want to track.</p>
        </div>
        
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="text-center mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Tracking Code</label>
            <div class="text-3xl font-bold text-primary-600 tracking-wider">
              {{ createdSession?.code }}
            </div>
          </div>
          
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Share Link (for rider)</label>
              <div class="flex">
                <input 
                  :value="shareUrl" 
                  readonly 
                  class="input flex-1 bg-gray-100 text-sm"
                />
                <button 
                  @click="copyShareUrl"
                  class="btn btn-secondary ml-2"
                >
                  <Copy class="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">View Link (for tracking)</label>
              <div class="flex">
                <input 
                  :value="viewUrl" 
                  readonly 
                  class="input flex-1 bg-gray-100 text-sm"
                />
                <button 
                  @click="copyViewUrl"
                  class="btn btn-secondary ml-2"
                >
                  <Copy class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="qrCodeUrl" class="text-center">
          <label class="block text-sm font-medium text-gray-700 mb-2">QR Code</label>
          <img :src="qrCodeUrl" alt="QR Code" class="mx-auto border rounded-lg" />
          <p class="text-xs text-gray-500 mt-1">Scan to open share link</p>
        </div>
        
        <div class="flex space-x-3">
          <button 
            @click="openViewer"
            class="btn btn-primary flex-1"
          >
            <Eye class="h-4 w-4 mr-2" />
            Open Viewer
          </button>
          <button 
            @click="createAnother"
            class="btn btn-secondary flex-1"
          >
            <Plus class="h-4 w-4 mr-2" />
            Create Another
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import QRCode from 'qrcode'
import { 
  Plus, Loader, CheckCircle, Copy, Eye 
} from 'lucide-vue-next'
import { useSessionStore } from '@/stores/session'
import { getSessionShareUrl, getSessionViewUrl, copyToClipboard } from '@/utils/helpers'
import Modal from '@/components/ui/Modal.vue'
import Alert from '@/components/ui/Alert.vue'

const router = useRouter()
const sessionStore = useSessionStore()

const form = reactive({
  notes: '',
  autoExpire: true,
  duration: 4
})

const loading = ref(false)
const error = ref('')
const showSuccessModal = ref(false)
const createdSession = ref(null)
const qrCodeUrl = ref('')

const shareUrl = computed(() => 
  createdSession.value ? getSessionShareUrl(createdSession.value.code) : ''
)

const viewUrl = computed(() => 
  createdSession.value ? getSessionViewUrl(createdSession.value.code) : ''
)

const createSession = async () => {
  loading.value = true
  error.value = ''
  
  const sessionData = {
    notes: form.notes,
    autoExpire: form.autoExpire,
    duration: form.autoExpire ? form.duration : null
  }
  
  const result = await sessionStore.createSession(sessionData)
  
  if (result.success) {
    createdSession.value = result.session
    await generateQRCode()
    showSuccessModal.value = true
  } else {
    error.value = result.error
  }
  
  loading.value = false
}

const generateQRCode = async () => {
  try {
    qrCodeUrl.value = await QRCode.toDataURL(shareUrl.value, {
      width: 200,
      margin: 2
    })
  } catch (error) {
    console.error('Failed to generate QR code:', error)
  }
}

const copyShareUrl = async () => {
  const success = await copyToClipboard(shareUrl.value)
  if (success) {
    // Show toast notification
    console.log('Share link copied to clipboard')
  }
}

const copyViewUrl = async () => {
  const success = await copyToClipboard(viewUrl.value)
  if (success) {
    // Show toast notification
    console.log('View link copied to clipboard')
  }
}

const openViewer = () => {
  router.push(`/view/${createdSession.value.code}`)
  showSuccessModal.value = false
}

const createAnother = () => {
  showSuccessModal.value = false
  createdSession.value = null
  qrCodeUrl.value = ''
  form.notes = ''
  form.autoExpire = true
  form.duration = 4
}
</script>
