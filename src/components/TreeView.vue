<template>
  <div class="tree">
    <ul class="tree-list" :style="{ gap: `${gap}px` }">
      <template v-for="node in filteredData" :key="node.id">
        <tree-row
          v-if="!node.hidden"
          :ref="`tree-row-${node.id}`"
          :node="node"
          :use-checkbox="useCheckbox"
          :use-icon="useIcon"
          :use-row-delete="useRowDelete"
          :show-child-count="showChildCount"
          :size="size"
          :gap="gap"
          :row-hover-background="rowHoverBackground"
          :set-node="setNode"
          :get-node="getNode"
          :update-node="updateNode"
          :expandable="expandable"
          @delete-row="onDeleteRow"
          @node-click="onNodeClick"
          @node-expanded="onNodeExpanded"
          @toggle-checkbox="onToggleCheckbox"
        >
          <template #checkbox="{ node: slotNode, checked, indeterminate }">
            <slot
              name="checkbox"
              :node="slotNode"
              :checked="checked"
              :indeterminate="indeterminate"
              :toggle-checkbox="() => onToggleCheckbox(slotNode)"
            />
          </template>
          <template v-if="useIcon" #iconActive>
            <slot name="iconActive" />
          </template>
          <template v-if="useIcon" #iconInactive>
            <slot name="iconInactive" />
          </template>
          <template v-if="useRowDelete" #deleteIcon>
            <slot name="deleteIcon" />
          </template>
          <template v-if="showChildCount" #childCount="{ count, checkedCount, children }">
            <slot name="childCount" :count="count" :checked-count="checkedCount" :children="children" />
          </template>
        </tree-row>
      </template>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, computed } from 'vue'
import TreeRow from './TreeRow.vue'
import type { TreeNode } from '@/types/TreeNode'
import {
  initNodes,
  searchNodes,
  setNodeById,
  getNodeById,
  updateNodeById,
  updateNodes,
  removeNodeById,
  expandNodeWithChildren
} from '../utils'
interface IProps {
  nodes: TreeNode[]
  props?: TreeNode
  size?: number
  gap?: number
  searchText?: string
  expandRowByDefault?: boolean
  expandAllRowsOnSearch?: boolean
  useCheckbox?: boolean
  useIcon?: boolean
  useRowDelete?: boolean
  showChildCount?: boolean
  rowHoverBackground?: string
  expandable?: boolean
}
const props = withDefaults(defineProps<IProps>(), {
  size: 24,
  gap: 10,
  searchText: '',
  expandRowByDefault: false,
  useCheckbox: true,
  useIcon: true,
  useRowDelete: false,
  showChildCount: false,
  rowHoverBackground: '#e0e0e0',
  expandable: true
})

const emits = defineEmits(['nodeClick', 'nodeExpanded', 'checkboxToggle', 'update:nodes'])
onMounted(() => emits('update:nodes', initNodes(props.nodes)))

const filteredData = computed(() => {
  let newData = props.nodes

  if (props.searchText) {
    newData = searchNodes(props.nodes, props.searchText)

    if (props.expandAllRowsOnSearch) {
      newData.forEach(expandNodeWithChildren)
    }
  }

  return updateNodes(newData)
})

const getNode = (id: number | string) => getNodeById(props.nodes, id)

const setNode = (id: number | string, node: TreeNode) => {
  emits('update:nodes', setNodeById(props.nodes, id, node))
}

const updateNode = (id: number | string, data: TreeNode) => {
  emits('update:nodes', updateNodes(updateNodeById(props.nodes, id, data)))
}

const onToggleCheckbox = (node: TreeNode) => {
  node.checked = !node.checked
  updateNode(node.id, node)
  emits('nodeClick', node)
}

const onNodeClick = (node: TreeNode) => {
  emits('nodeClick', node)
}

const onNodeExpanded = (node: TreeNode, state: boolean) => {
  emits('nodeExpanded', node, state)
}

const onUpdate = () => {
  emits('update:nodes', props.nodes)
}

const onDeleteRow = (node: TreeNode) => {
  removeNodeById(props.nodes, node.id)
  emits('update:nodes', updateNodes(removeNodeById(props.nodes, node.id)))
}
</script>

<style lang="scss" scoped>
.tree {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
    'Open Sans', 'Helvetica Neue', sans-serif;
}

.tree-list {
  margin: 0;
  padding: 0;
  overflow: hidden;

  .tree-row {
    padding-left: 0px !important;
  }
}
</style>
