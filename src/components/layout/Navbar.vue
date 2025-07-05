<template>
  <nav class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <router-link to="/" class="flex items-center space-x-2">
            <MapPin class="h-8 w-8 text-primary-600" />
            <span class="text-xl font-bold text-gray-900">LiveTrack</span>
          </router-link>
        </div>
        
        <div class="hidden md:flex items-center space-x-4">
          <template v-if="authStore.isAuthenticated">
            <router-link 
              to="/dashboard" 
              class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Dashboard
            </router-link>
            <router-link 
              to="/new-session" 
              class="btn btn-primary btn-sm"
            >
              <Plus class="h-4 w-4 mr-1" />
              New Session
            </router-link>
            <Menu as="div" class="relative">
              <MenuButton class="flex items-center space-x-2 text-gray-700 hover:text-primary-600">
                <User class="h-5 w-5" />
                <span class="text-sm font-medium">{{ authStore.user?.name }}</span>
                <ChevronDown class="h-4 w-4" />
              </MenuButton>
              <MenuItems class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div class="py-1">
                  <MenuItem v-slot="{ active }">
                    <router-link 
                      to="/history" 
                      :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']"
                    >
                      Session History
                    </router-link>
                  </MenuItem>
                  <MenuItem v-if="authStore.isAdmin" v-slot="{ active }">
                    <router-link 
                      to="/admin" 
                      :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']"
                    >
                      Admin Panel
                    </router-link>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <button 
                      @click="logout"
                      :class="[active ? 'bg-gray-100' : '', 'block w-full text-left px-4 py-2 text-sm text-gray-700']"
                    >
                      Logout
                    </button>
                  </MenuItem>
                </div>
              </MenuItems>
            </Menu>
          </template>
          <template v-else>
            <router-link 
              to="/auth/login" 
              class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Login
            </router-link>
            <router-link 
              to="/auth/register" 
              class="btn btn-primary btn-sm"
            >
              Get Started
            </router-link>
          </template>
        </div>
        
        <!-- Mobile menu button -->
        <div class="md:hidden flex items-center">
          <button 
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="text-gray-700 hover:text-primary-600 focus:outline-none"
          >
            <MenuIcon class="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
    
    <!-- Mobile menu -->
    <div v-show="mobileMenuOpen" class="md:hidden bg-white border-t border-gray-200">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <template v-if="authStore.isAuthenticated">
          <router-link 
            to="/dashboard" 
            class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600"
            @click="mobileMenuOpen = false"
          >
            Dashboard
          </router-link>
          <router-link 
            to="/new-session" 
            class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600"
            @click="mobileMenuOpen = false"
          >
            New Session
          </router-link>
          <router-link 
            to="/history" 
            class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600"
            @click="mobileMenuOpen = false"
          >
            Session History
          </router-link>
          <button 
            @click="logout"
            class="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600"
          >
            Logout
          </button>
        </template>
        <template v-else>
          <router-link 
            to="/auth/login" 
            class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600"
            @click="mobileMenuOpen = false"
          >
            Login
          </router-link>
          <router-link 
            to="/auth/register" 
            class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600"
            @click="mobileMenuOpen = false"
          >
            Get Started
          </router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { MapPin, Plus, User, ChevronDown, Menu as MenuIcon } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const mobileMenuOpen = ref(false)

const logout = () => {
  authStore.logout()
  router.push('/')
  mobileMenuOpen.value = false
}
</script>
