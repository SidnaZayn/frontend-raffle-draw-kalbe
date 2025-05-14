import { acceptHMRUpdate, defineStore } from 'pinia'

export const useHadiahStore = defineStore('user', () => {
  const hadiahList = ref([{ nama: 'Hadiah 1', id: 1 }])
  const currentHadiah = ref(0)

  function move(direction: 'left' | 'right') {
    if (direction === 'left') {
      if (currentHadiah.value === 0) {
        currentHadiah.value = 0
      }
      else {
        currentHadiah.value = currentHadiah.value - 1
      }
    }
    else {
      if (currentHadiah.value === hadiahList.value.length - 1) {
        currentHadiah.value = hadiahList.value.length - 1
      }
      else {
        currentHadiah.value = currentHadiah.value + 1
      }
    }
  }

  return {
    currentHadiah,
    hadiahList,
    move,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useHadiahStore as any, import.meta.hot))
