export type dbMap = Record<string, database>
export interface database {
  collections: collection[]
  originSize: number
  sizeOnDisk: string
}
export interface collection {
  name: string
  count: number
  storageSize: string
  storageSizeOrigin: number
  totalIndexSize: number
  avgObjSizeOrigin: number
  avgObjSize: string
}

// export interface doc {
//   _id: string
//   [key: string]: any
// }

export interface sidebarTreeItemType {
  dbName: string
  key: [string] // [dbName]
  cols: Array<{
    colName: string
    key: [string, string] // [dbName,colName]
  }>
}
