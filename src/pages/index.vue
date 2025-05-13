<script setup lang="ts">
defineOptions({
  name: 'IndexPage',
})
const pemenang = ref(['*', '*', '*', '*', '*', '*', '*', '*', '*', '*'])
const pemenangNew = ref(['1', '1', '1', '1', '1', '1', '1', '1', '1', '8'])

async function getPemenang() {
  const pemenang = await fetch('http://localhost:3000/peserta/get-random')
  const data: string = await pemenang.json()
  return data.split('')
}

async function updatePemenang() {
  await fetch('http://localhost:3000/peserta/update-status', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nik: pemenangNew.value.join(''),
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
}

async function go() {
  pemenangNew.value = await getPemenang()
  drumRoll()
  for (let i = 0; i < pemenang.value.length; i++) {
    const shuffling_interval = setInterval(() => {
      pemenang.value[i] = (Math.floor(Math.random() * 9) + 1).toString()
    }, 75)

    setTimeout(() => {
      clearInterval(shuffling_interval)
      pemenang.value[i] = pemenangNew.value[i]

      if (i === pemenang.value.length - 1) {
        cymbal()
      }
    }, 1000 * (i + 1))
  }

  await updatePemenang()
}

const { t } = useI18n()
useHead({
  title: () => t('button.home'),
})
</script>

<template>
  <div>
    <div text-4xl>
      <div i-carbon-campsite inline-block />
    </div>
    <p>
      <a rel="noreferrer" href="https://github.com/antfu/vitesse" target="_blank">
        Kalbe Undian Doorprize
      </a>
    </p>
    <p>
      <em text-sm opacity-75>{{ t('intro.desc') }}</em>
    </p>

    <div py-4 />
    <div grid grid-cols-10 mx-auto gap-2 w="3/4">
      <div
        v-for="i in pemenang" :key="i" border="1 solid gray-800" flex items-center justify-center rounded-xl
        h="10rem"
      >
        <p text-9xl font-bold>
          {{ i }}
        </p>
      </div>
    </div>

    <div mt-10>
      <button m-3 rounded-2xl p-5 text-5xl font-bold btn @click="go">
        Undi Sekarang !
      </button>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
