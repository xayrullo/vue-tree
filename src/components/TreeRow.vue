<template>
  <li
    class="tree-row"
    :style="{
      gap: `${gap}px`,
      paddingLeft: `${size}px`,
      '--row-hover-background': rowHoverBackground
    }"
  >
    <div class="tree-row-item" @click.stop="handleClick(node)">
      <div v-if="useIcon" class="tree-row-item-icon-wrapper">
        <template v-if="childCount">
          <template v-if="!node.expanded">
            <slot name="iconActive">
              <icon-arrow-right />
            </slot>
          </template>
          <template v-else>
            <slot name="iconInactive">
              <icon-arrow-down />
            </slot>
          </template>
        </template>
      </div>
      <slot
        :id="node.id"
        name="checkbox"
        :node="node"
        :checked="node.checked"
        :indeterminate="node.indeterminate"
      >
        <input
          v-if="useCheckbox"
          v-model="node.checked"
          type="checkbox"
          :checked="node.checked"
          :indeterminate="node.indeterminate"
          @click.stop="onToggleCheckbox(node)"
        />
      </slot>
      <span class="tree-row-txt">
        {{ node.label }}
      </span>
      <template v-if="childCount">
        <slot
          name="childCount"
          :count="childCount"
          :checkedCount="checkedChildCount"
          :children="node.children"
        >
          <span class="child-count">
            {{ childCount }}
          </span>
        </slot>
      </template>
      <template v-if="!node.undeletable && useRowDelete">
        <div class="delete-icon" @click.stop="removedRow(node)">
          <slot name="deleteIcon">
            <icon-delete/>
          </slot>
        </div>
      </template>
    </div>
    <ul v-if="node.expanded" class="tree-list" :style="{ gap: `${gap}px` }">
      <template v-for="child in node.children" :key="child.id">
        <tree-row
          v-if="!child.hidden"
          :ref="`tree-row-${child.id}`"
          :node="child"
          :use-checkbox="useCheckbox"
          :use-icon="useIcon"
          :use-row-delete="useRowDelete"
          :show-child-count="showChildCount"
          :gap="gap"
          :expand-row-by-default="expandRowByDefault"
          :size="size"
          :row-hover-background="rowHoverBackground"
          :set-node="setNode"
          :get-node="getNode"
          :update-node="updateNode"
          :expandable="expandable"
          @delete-row="removedRow"
          @node-click="(item) => handleClick(item, true)"
          @toggle-checkbox="onToggleCheckbox"
          @node-expanded="onNodeExpanded"
        >
          <template #childCount="{ count, checkedCount, children }">
            <slot name="childCount" :count="count" :checked-count="checkedCount" :childs="children" />
          </template>
          <template #iconActive>
            <slot name="iconActive">
              <icon-arrow-right/>
            </slot>
          </template>
          <template #iconInactive>
            <slot name="iconInactive">
              <icon-arrow-down />
            </slot>
          </template>
          <template #deleteIcon>
            <slot name="deleteIcon">
              <icon-delete/>
            </slot>
          </template>
          <template #checkbox="{ node: slotNode, checked, indeterminate }">
            <slot
              :id="slotNode.id"
              name="checkbox"
              :node="slotNode"
              :checked="checked"
              :indeterminate="indeterminate"
            />
          </template>
        </tree-row>
      </template>
    </ul>
  </li>
</template>

<script lang="ts" setup>
import { computed, nextTick } from 'vue'
import IconArrowRight from '@/components/icons/IconArrowRight.vue'
import IconArrowDown from './icons/IconArrowDown.vue'
import IconDelete from './icons/IconDelete.vue'
import type { TreeNode } from '@/types/TreeNode'

interface IProps {
  node: TreeNode
  size: number
  gap: number
  getNode: Function
  setNode: Function
  updateNode: Function
  expandRowByDefault?: boolean
  useCheckbox?: boolean
  useIcon?: boolean
  useRowDelete?: boolean
  showChildCount?: boolean
  rowHoverBackground?: string
  expandable?: boolean
}
const props = withDefaults(defineProps<IProps>(), {
  expandRowByDefault: false,
  useCheckbox: true,
  useIcon: true,
  useRowDelete: false,
  showChildCount: false,
  rowHoverBackground: '#e0e0e0',
  expandable: true
})

const emits = defineEmits(['nodeClick', 'toggleCheckbox', 'nodeExpanded', 'deleteRow'])
const childCount = computed(() => props.node.children?.length)
const checkedChildCount = computed(() => props.node.children?.filter((item) => item.checked).length)

const toggleExpanded = (node: TreeNode) => {
  props.node.expanded = props.node.children ? !props.node.expanded : false
  nextTick(() => {
    emits('nodeExpanded', node, props.node.expanded)
  })
}

const handleClick = (node: TreeNode, passExpand?: boolean) => {
  if (!passExpand && props.expandable && childCount.value) {
    toggleExpanded(node)
  }

  emits('nodeClick', { ...node })
}

const onNodeExpanded = (node: TreeNode, state: boolean) => {
  emits('nodeExpanded', node, state)
}

const onToggleCheckbox = (node: TreeNode) => {
  emits('toggleCheckbox', node)
}

const removedRow = (node: TreeNode) => {
  emits('deleteRow', node)
}
</script>

<style lang="scss">
.tree-list,
.tree-row {
  @apply grid m-0 p-0
}

.tree-row {
  transform-style: preserve-3d;

  &-item {
    @apply flex items-center relative px-1 py-3;

    &:hover:before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      background-color: var(--row-hover-background);
      transform: translate3d(0, 0, -0.1px);
      width: 200vw;
      margin-left: calc(100% - 100vw);
      z-index: -1;
    }

    .child-count {
      color: gray;
      margin-left: 6px;
    }

    .delete-icon {
      color: red;
      opacity: 0;
      display: flex;
      align-items: center;
      width: 16px;
      height: 16px;
    }

    &-icon-wrapper {
      width: 15px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  }

  &-item:hover {
    .delete-icon {
      opacity: 1;
    }
  }

  &-txt {
    user-select: none;
  }
}
</style>
