<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import TreeView from './components/TreeView.vue'
import type { TreeNode } from '@/types/TreeNode'

const nodes = ref<TreeNode[]>([
  {
    id: 1,
    label: 'Colors',
    children: [
      {
        id: 2,
        label: 'Red'
      },
      {
        id: 32,
        label: 'Red'
      },
      {
        id: 3,
        label: 'White',
        children: [
          {
            id: 4,
            label: 'White-Gray'
          },
          {
            id: 5,
            label: 'White-Red',
            children: [
              {
                id: 20,
                label: 'lorem'
              },
              {
                id: 21,
                label: 'ipsum'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 6,
    label: 'People'
  }
])

function onUpdated(updatedNode: TreeNode[]) {
  console.log('Updated Node', updatedNode)
}
</script>

<template>
  <div>
    <TreeView
      v-model:nodes="nodes"
      :use-checkbox="true"
      :use-row-delete="true"
      @update:nodes="onUpdated"
    />
  </div>
</template>

<style scoped></style>
