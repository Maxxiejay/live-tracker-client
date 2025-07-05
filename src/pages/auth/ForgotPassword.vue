<template>
  <div class="card">
    <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">
      Reset your password
    </h2>
    
    <p class="text-gray-600 text-center mb-6">
      Enter your email address and we'll send you a link to reset your password.
    </p>
    
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
          Email address
        </label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          class="input"
          placeholder="Enter your email"
        />
      </div>
      
      <button 
        type="submit" 
        :disabled="loading"
        class="w-full btn btn-primary btn-lg"
      >
        <Loader v-if="loading" class="animate-spin h-4 w-4 mr-2" />
        Send reset link
      </button>
      
      <div class="text-center text-sm text-gray-600">
        Remember your password?
        <router-link to="/auth/login" class="text-primary-600 hover:text-primary-500 font-medium">
          Back to sign in
        </router-link>
      </div>
    </form>
    
    <Alert v-if="success" type="success" class="mt-4">
      Password reset link sent to your email address.
    </Alert>
    
    <Alert v-if="error" type="error" class="mt-4">
      {{ error }}
    </Alert>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Loader } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import Alert from '@/components/ui/Alert.vue'

const authStore = useAuthStore()

const form = reactive({
  email: ''
})

const loading = ref(false)
const error = ref('')
const success = ref(false)

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  success.value = false
  
  const result = await authStore.forgotPassword(form.email)
  
  if (result.success) {
    success.value = true
  } else {
    error.value = result.error
  }
  
  loading.value = false
}
</script>
