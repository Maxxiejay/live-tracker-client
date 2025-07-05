<template>
  <div class="card">
    <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">
      Sign in to your account
    </h2>
    
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
            placeholder="Enter your password"
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
      
      <div class="flex items-center justify-between">
        <label class="flex items-center">
          <input type="checkbox" class="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
          <span class="ml-2 text-sm text-gray-600">Remember me</span>
        </label>
        <router-link 
          to="/auth/forgot-password" 
          class="text-sm text-primary-600 hover:text-primary-500"
        >
          Forgot password?
        </router-link>
      </div>
      
      <button 
        type="submit" 
        :disabled="loading"
        class="w-full btn btn-primary btn-lg"
      >
        <Loader v-if="loading" class="animate-spin h-4 w-4 mr-2" />
        Sign in
      </button>
      
      <div class="text-center text-sm text-gray-600">
        Don't have an account?
        <router-link to="/auth/register" class="text-primary-600 hover:text-primary-500 font-medium">
          Sign up
        </router-link>
      </div>
    </form>
    
    <Alert v-if="error" type="error" class="mt-4">
      {{ error }}
    </Alert>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Eye, EyeOff, Loader } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import Alert from '@/components/ui/Alert.vue'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: ''
})

const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  
  const result = await authStore.login(form)
  
  if (result.success) {
    router.push('/dashboard')
  } else {
    error.value = result.error
  }
  
  loading.value = false
}
</script>
