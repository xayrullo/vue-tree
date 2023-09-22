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
        id: 3,
        label: 'White',
        children: [
          {
            id: 4,
            label: 'White-Gray'
          },
          {
            id: 5,
            label: 'White-Red'
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
const selectedItems = ref<TreeNode>()
</script>

<template>
  <div>
    <TreeView
      :nodes="nodes"
      v-model="selectedItems"
      caption-field="name"
      children-field="fileList"
    />
  </div>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
