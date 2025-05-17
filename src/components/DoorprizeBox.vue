<script setup lang="ts">
import { useHadiahStore } from '~/stores/hadiah'

const hadiahStore = useHadiahStore()

const api = hadiahStore.apiURL
// const api = 'http://localhost:3000'

async function getHadiah() {
  const hadiah = await fetch(`${api}/hadiah`)
  hadiahStore.hadiahList = await hadiah.json()
}

onMounted(() => {
  getHadiah()
})
</script>

<template>
  <div border="1 solid white" mx-auto mb-8 flex-col items-center justify-center rounded-xl py-6 w="3/4">
    <p font-bold>
      Hadiah Saat Ini:
    </p>
    <div flex items-center justify-between>
      <i
        i-carbon-caret-left inline-block cursor-pointer text-4xl text-white opacity-25
        @click="hadiahStore.move('left')"
      />
      <p text-6xl font-bold>
        {{ hadiahStore.hadiahList[hadiahStore.currentHadiah].nama }}
      </p>
      <i
        i-carbon-caret-right inline-block cursor-pointer text-4xl text-white opacity-25
        @click="hadiahStore.move('right')"
      />
    </div>
  </div>
</template>
