export type TreeNode = {
  label: string
  id: number | string
  checked?: boolean
  expanded?: boolean
  children?: TreeNode[]
  hidden?: boolean
  undeletable?: boolean
}
