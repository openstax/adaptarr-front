/**
 * Create a promise which rejects after a specified time.
 *
 * @param {number} t - time in milliseconds after which to reject
 */
export default function timeout(t: number): Promise<TimeoutError> {
    return new Promise((resolve, reject) => {
        window.setTimeout(() => reject(new TimeoutError()), t)
    })
}

export class TimeoutError extends Error {
    constructor() {
        super("Timed out")
    }
}
