export default class PersistanceError extends Error {
  constructor() {
    super("There was a problem with establishing connection to PersistDB.")

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, PersistanceError.prototype)
  }
}
