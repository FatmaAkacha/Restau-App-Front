<template>
  <footer class="bg-gray-900 text-white py-8 px-4 mt-16">
    <div class="max-w-6xl mx-auto">
      <div class="flex flex-col md:flex-row items-center justify-between gap-4">
        <!-- Left: Restaurant Info -->
        <div class="text-sm" style="color:#AAA">
          <p class="font-semibold" style="color:#FFF">Good Naan</p>
          <p>22 Rue de la Défense Passive, 14000 Caen</p>
        </div>


        <!-- Right: Copyright -->
        <div class="text-sm text-center md:text-right" style="color:#AAA">
          <p>&copy; 2026 Good Naan. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Footer component - no logic needed
</script>

<style scoped>
footer a {
  text-decoration: none;
}

footer a:hover {
  text-decoration: underline;
}
</style>
