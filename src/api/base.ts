export default class ApiBase<Data extends {}> {
  constructor(data: Data) {
    for (const [key, value] of Object.entries(data)) {
      this[key] = value
    }
  }
}
