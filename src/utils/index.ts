import type { TreeNode } from '@/types/TreeNode.ts'
export const updateNodes = (nodes: TreeNode[]) =>
  nodes.map((node) => {
    if (!node.children?.length) {
      return { ...node, expanded: false }
    }
    node.children = updateNodes(node.children)
    const everyChecked = node.children?.every((item) => item.checked)
    const someChecked = node.children?.some((item) => item.checked)
    const anyDeteminate = node.children?.some((item) => item.indeterminate)
    node.checked = everyChecked
    node.indeterminate = !everyChecked && (someChecked || anyDeteminate)

    return node
  })

export const initNodes = (nodes: TreeNode[], parent?: TreeNode) => {
  let newNodes = [...nodes]

  newNodes = newNodes.map((node) => {
    const isCheckParent = parent?.checked

    let newNode: TreeNode = {
      checked: isCheckParent ? true : false,
      expanded: false,
      indeterminate: false,
      ...node
    }
    if (Array.isArray(newNode.children)) {
      newNode.children = initNodes(newNode.children, newNode)
    }
    return newNode
  })

  return updateNodes(newNodes)
}

export function expandNodeWithChildren(node: TreeNode) {
  if (!node) return
  if (node.children) node.children.forEach(expandNodeWithChildren)
  node.expanded = true
}

export function getNodeById(nodes: TreeNode[], id: number | string): TreeNode | undefined {
  for (let index = 0; index < nodes.length; index++) {
    const node = nodes[index]
    if (node.id === id) return node
    if (Array.isArray(node.children)) {
      const currentNode: TreeNode | undefined = getNodeById(node.children, id)
      if (currentNode) return currentNode
    }
  }
}

export function getParentNodeById(nodes: TreeNode[], id: number | string) {
  if (!Array.isArray(nodes)) return

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    if (node.children) {
      const isFound = node.children.find((item) => item.id === id)
      if (isFound) return node
      return getParentNodeById(node.children, id)
    }
  }
}

export function removeNodeById(nodes: TreeNode[], id: number | string) {
  let newNodes = [...nodes]
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    if (node.id === id) {
      newNodes = newNodes.filter((item) => item.id !== id)
    } else if (node.children) {
      node.children = removeNodeById(node.children, id)

      if (!node.children?.length) delete node.children
    }
  }

  return newNodes
}

export const searchNodes = (nodes: TreeNode[], searchText: string) => {
  const getNodes = (result: TreeNode[], node: TreeNode) => {
    const isMatched = node.label.toLowerCase().includes(searchText.toLowerCase())

    if (isMatched) {
      result.push(node)
      return result
    }

    if (Array.isArray(node.children)) {
      const children = node.children?.reduce(getNodes, [])
      if (nodes.length) result.push({ ...node, children })
    }

    return result
  }

  return nodes.reduce(getNodes, [])
}

export const setNodeById = (nodes: TreeNode[], id: number | string, newNode: TreeNode) =>
  nodes.map((node) => {
    if (node.id === id) {
      node = { ...newNode }
    } else if (Array.isArray(node.children)) {
      node.children = setNodeById(node.children, id, newNode)
    }

    return node
  })

export function updateChildNodeStatus(node: TreeNode, checkedStatus?: boolean) {
  const checked = checkedStatus ?? node.checked
  console.log('Update child node status', node,)
  node.checked = checked

  if (node && Array.isArray(node.children)) {
    node.children = node.children.map((item) => {
      const currentNode = {
        ...item,
        checked
      }

      if (item.children) {
        currentNode.children?.forEach((childNode) => updateChildNodeStatus(childNode, checked))
      } else {
        delete currentNode.children
      }

      return currentNode
    })
  }

  return node
}

export const updateNodeById = (nodes: TreeNode[], id: number | string, newNode: TreeNode) =>
  nodes.map((node) => {
    let currentNode = node

    if (currentNode.id === id) {
      currentNode = updateChildNodeStatus({ ...node, ...newNode })
    } else if (node.children && Array.isArray(currentNode.children)) {
      currentNode.children = updateNodeById(node.children, id, newNode)
    }

    return currentNode
  })
