import { type MessageInstance } from 'antd/es/message/interface'

const store: {
  messageApi: MessageInstance
  navigate: any
} = {
  messageApi: null,
  navigate: null
}
export function isObject(item: any): item is object {
  return typeof item === 'object' && item !== null
}
export default store
