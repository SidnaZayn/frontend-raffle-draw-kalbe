<script setup lang="ts">
import { useHadiahStore } from '~/stores/hadiah'

defineOptions({
  name: 'IndexPage',
})
const hadiahStore = useHadiahStore()

const api = hadiahStore.apiURL
// const api = 'http://localhost:3000'

const pemenang = ref(['*', '*', '*', '*', '*', '*', '*', '*', '*', '*'])
const pemenangNew = ref({ id: 0, nik: ['1', '1', '1', '1', '1', '1', '1', '1', '1', '8'] })

type RollingStatus = 'not rolling' | 'on rolling' | 'done rolling'
const onRolling = ref<RollingStatus>('not rolling')

const animationOn = ref(false)

async function getPemenang() {
  const pemenang = await fetch(`${api}/peserta/get-random`)
  const data: any = await pemenang.json()
  return data
}

async function getHadiah() {
  const hadiah = await fetch(`${api}/hadiah`)
  hadiahStore.hadiahList = await hadiah.json()
}

async function nextHadiah() {
  await getHadiah()
  pemenang.value = ['*', '*', '*', '*', '*', '*', '*', '*', '*', '*']
  onRolling.value = 'not rolling'
}

async function updatePemenang() {
  await fetch(`${api}/peserta/update-status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nik: pemenangNew.value.nik,
    }),
  })

  // update pemenang in hadiah
  const hadiahId = hadiahStore.hadiahList[hadiahStore.currentHadiah].id
  await fetch(`${api}/hadiah/update-pemenang/${hadiahId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      pemenangId: pemenangNew.value.id,
    }),
  })
}

function drumRoll() {
  const audio = new Audio('/drum-roll-NEW.mp3')
  audio.play()
}
function cymbal() {
  const audio = new Audio('/cymbal.mp3')
  audio.play()

  animationOn.value = true
  setTimeout(() => {
    animationOn.value = false
  }, 3000)
}

async function go() {
  onRolling.value = 'on rolling'
  pemenangNew.value = await getPemenang()
  drumRoll()

  for (let i = 0; i < pemenang.value.length; i++) {
    const shuffling_interval = setInterval(() => {
      pemenang.value[i] = (Math.floor(Math.random() * 9) + 1).toString()
    }, 75)

    setTimeout(async () => {
      clearInterval(shuffling_interval)
      pemenang.value[i] = pemenangNew.value.nik[i]

      if (i === pemenang.value.length - 1) {
        cymbal()
        onRolling.value = 'done rolling'
      }
    }, 1000 * (i + 1))
  }

  await updatePemenang()
}

useHead({
  title: 'HUT Kalbe 59 - undian doorprize',
})
</script>

<template>
  <div>
    <AnimationAfterDraw v-if="animationOn" />
    <div mb-5 flex items-center justify-center>
      <img src="/Kalbe_Farma.svg.png" alt="logo kalbe" w="20">
    </div>
    <p>
      HUT Kalbe 59 - Undian Doorprize
    </p>

    <div py-4 />

    <DoorprizeBox />

    <div grid grid-cols-10 mx-auto gap-2 w="3/4">
      <div
        v-for="i in pemenang" :key="i" border="1 solid white" flex items-center justify-center rounded-xl
        h="10rem"
      >
        <p text-9xl font-bold>
          {{ i }}
        </p>
      </div>
    </div>

    <div mt-10>
      <button v-if="onRolling === 'not rolling'" m-3 rounded-2xl p-5 text-5xl font-bold btn @click="go">
        Undi Sekarang !
      </button>
      <button v-else-if="onRolling === 'on rolling'" disabled m-3 rounded-2xl p-5 text-5xl font-bold btn>
        Loading...
      </button>
      <button
        v-else-if="onRolling === 'done rolling'" m-3 rounded-2xl bg-yellow-600 p-5 text-5xl font-bold btn
        hover:bg-yellow-700 @click="nextHadiah"
      >
        Next
      </button>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
