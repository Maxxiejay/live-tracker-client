<template>
  <div class="card">
    <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">
      Create your account
    </h2>
    
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
          Full name
        </label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          required
          class="input"
          placeholder="Enter your full name"
        />
      </div>
      
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
      
      <div>
        <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
          Phone number (optional)
        </label>
        <input
          id="phone"
          v-model="form.phone"
          type="tel"
          class="input"
          placeholder="Enter your phone number"
        />
      </div>
      
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <div class="relative">
          <input
            id="password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            required
            class="input pr-10"
            placeholder="Create a password"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <EyeOff v-if="showPassword" class="h-4 w-4 text-gray-400" />
            <Eye v-else class="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>
      
      <div>
        <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
          Confirm password
        </label>
        <div class="relative">
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            required
            class="input pr-10"
            placeholder="Confirm your password"
          />
          <button
            type="button"
            @click="showConfirmPassword = !showConfirmPassword"
            class="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <EyeOff v-if="showConfirmPassword" class="h-4 w-4 text-gray-400" />
            <Eye v-else class="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>
      
      <div class="flex items-center">
        <input 
          id="terms" 
          v-model="form.acceptTerms"
          type="checkbox" 
          required
          class="rounded border-gray-300 text-primary-600 focus:ring-primary-500" 
        />
        <label for="terms" class="ml-2 text-sm text-gray-600">
          I agree to the 
          <a href="#" class="text-primary-600 hover:text-primary-500">Terms of Service</a>
          and 
          <a href="#" class="text-primary-600 hover:text-primary-500">Privacy Policy</a>
        </label>
      </div>
      
      <button 
        type="submit" 
        :disabled="loading || !isFormValid"
        class="w-full btn btn-primary btn-lg"
      >
        <Loader v-if="loading" class="animate-spin h-4 w-4 mr-2" />
        Create account
      </button>
      
      <div class="text-center text-sm text-gray-600">
        Already have an account?
        <router-link to="/auth/login" class="text-primary-600 hover:text-primary-500 font-medium">
          Sign in
        </router-link>
      </div>
    </form>
    
    <Alert v-if="error" type="error" class="mt-4">
      {{ error }}
    </Alert>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Eye, EyeOff, Loader } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import Alert from '@/components/ui/Alert.vue'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const error = ref('')

const isFormValid = computed(() => {
  return form.name && 
         form.email && 
         form.password && 
         form.confirmPassword && 
         form.password === form.confirmPassword &&
         form.acceptTerms
})

const handleSubmit = async () => {
  if (form.password !== form.confirmPassword) {
    error.value = 'Passwords do not match'
    return
  }
  
  loading.value = true
  error.value = ''
  
  const result = await authStore.register({
    name: form.name,
    email: form.email,
    phone: form.phone,
    password: form.password
  })
  
  if (result.success) {
    router.push('/dashboard')
  } else {
    error.value = result.error
  }
  
  loading.value = false
}
</script>
