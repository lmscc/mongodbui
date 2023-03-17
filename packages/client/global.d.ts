type dbMap = Record<string, database>
interface database {
  collections: collection[]
  originSize: number
  sizeOnDisk: string
}
interface collection {
  name: string
  count: number
  storageSize: string
  storageSizeOrigin: number
  totalIndexSize: number
  avgObjSizeOrigin: number
  avgObjSize: string
}
interface doc {
  _id: string
  [key: string]: any
}
