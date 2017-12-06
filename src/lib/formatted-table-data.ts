export type RawData = string[][]

export interface ColumnalData {
  [key: string]: string[]
}

export interface KeyValueData {
  [key: string]: string
}

export default class FormattedTableData {
  constructor(private _data: RawData) { }
  
  get raw() { return this._data }

  get hash(): ColumnalData {
    const [
      headers,
      ...body
    ] = this._data
    const result = {}
    headers.map((header, i) => {
      result[header] = body.map(row => row[i])
    })  
    return result
  }

  get rowHash(): KeyValueData {
    const result = {}
    this._data.map(row => {
      const [ key, value ] = row 
      result[key] = value
    })  
    return result
  }
}
