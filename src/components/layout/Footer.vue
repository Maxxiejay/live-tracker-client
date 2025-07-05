<template>
  <footer class="bg-white border-t border-gray-200">
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div class="md:col-span-2">
          <div class="flex items-center space-x-2 mb-4">
            <MapPin class="h-8 w-8 text-primary-600" />
            <span class="text-xl font-bold text-gray-900">LiveTrack</span>
          </div>
          <p class="text-gray-600 mb-4">
            Real-time location tracking made simple and secure. Track anyone, anytime, with consent.
          </p>
          <div class="flex space-x-4">
            <a href="#" class="text-gray-400 hover:text-primary-600">
              <Twitter class="h-5 w-5" />
            </a>
            <a href="#" class="text-gray-400 hover:text-primary-600">
              <Facebook class="h-5 w-5" />
            </a>
            <a href="#" class="text-gray-400 hover:text-primary-600">
              <Instagram class="h-5 w-5" />
            </a>
          </div>
        </div>
        
        <div>
          <h3 class="text-sm font-semibold text-gray-900 mb-4">Product</h3>
          <ul class="space-y-2">
            <li><a href="#" class="text-gray-600 hover:text-primary-600">Features</a></li>
            <li><a href="#" class="text-gray-600 hover:text-primary-600">How it works</a></li>
            <li><a href="#" class="text-gray-600 hover:text-primary-600">Pricing</a></li>
            <li><a href="#" class="text-gray-600 hover:text-primary-600">API</a></li>
          </ul>
        </div>
        
        <div>
          <h3 class="text-sm font-semibold text-gray-900 mb-4">Support</h3>
          <ul class="space-y-2">
            <li><a href="#" class="text-gray-600 hover:text-primary-600">About</a></li>
            <li><a href="#" class="text-gray-600 hover:text-primary-600">Privacy Policy</a></li>
            <li><a href="#" class="text-gray-600 hover:text-primary-600">Terms of Service</a></li>
            <li><a href="#" class="text-gray-600 hover:text-primary-600">Contact</a></li>
          </ul>
        </div>
      </div>
      
      <div class="border-t border-gray-200 pt-8 mt-8">
        <p class="text-gray-600 text-sm text-center">
          © 2025 LiveTrack. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { MapPin, Twitter, Facebook, Instagram } from 'lucide-vue-next'
</script>
