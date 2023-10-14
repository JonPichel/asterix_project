<template>
  <div>
    <button @click="counter++">Click!</button>
    <button @click="toggleList">{{ show ? "Hide" : "Show" }}</button>
    <button @click="newPlane">New Plane</button>
    <ul v-if="show">
      <li v-for="(plane, i) in planes" :key="i">
        ID: {{ plane.id }} Height: {{ plane.height }}
      </li>
    </ul>
    <p>Counter: {{ counter }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const counter = ref(48)

const show = ref(true)

const planes = ref([
  {
    id: "XYZ123",
    height: "9000 ft"
  },
  {
    id: "ABC456",
    height: "3000 ft"
  },
])

function click() {
  counter.value++
}

function toggleList() {
  show.value = !show.value
}

function newPlane() {
  planes.value.push({
    id: "NEW123",
    height: "4000"
  })
}
</script>