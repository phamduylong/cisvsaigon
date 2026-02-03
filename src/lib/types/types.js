/**
 * Represents an image record with metadata.
 *
 * @typedef {Object} ImageRecord
 * @property {string} id
 * @property {string} collectionId
 * @property {string} collectionName
 * @property {string} content
 * @property {string} caption
 * @property {string} created
 * @property {string} updated
 */

/** * Represents user record
 *
 * @typedef {Object} UserRecord
 * @property {string} collectionId
 * @property {string} collectionName
 * @property {string} created
 * @property {string} email
 * @property {boolean} emailVisibility
 * @property {string} id
 * @property {string} updated
 * @property {string} username
 * @property {boolean} verified
 * @property {string} avatar
 * @property {string} displayName
 */

/**
 * Represents a blog post record with metadata.
 *
 * @typedef {Object} BlogPostRecord
 * @property {string} id
 * @property {string} collectionId
 * @property {string} collectionName
 * @property {string} content
 * @property {string} title
 * @property {string} created
 * @property {string} updated
 * @property {UserRecord} expand
 */

/**
 * Represents a blog post record with metadata.
 *
 * @typedef {Object} EventRecord
 * @property {string} id
 * @property {string} collectionId
 * @property {string} collectionName
 * @property {Number} minAge
 * @property {Number} maxAge
 * @property {string} registrationLink
 * @property {string} shortDescription
 * @property {string} title
 * @property {string} created
 * @property {string} updated
 */

/**
 * @typedef {Object} PocketBaseClientError
 * @property {string} url
 * @property {number} status
 * @property {{
 *   code: number,
 *   message: string,
 *   data: Record<string, {
 *     code: string,
 *     message: string
 *   }>
 * }} response
 * @property {boolean} isAbort
 * @property {{
 *   url: string,
 *   status: number,
 *   data: {
 *     code: number,
 *     message: string,
 *     data: Record<string, {
 *       code: string,
 *       message: string
 *     }>
 *   }
 * }} originalError
 * @property {{
 *   url: string,
 *   status: number,
 *   data: {
 *     code: number,
 *     message: string,
 *     data: Record<string, {
 *       code: string,
 *       message: string
 *     }>
 *   }
 * }} cause
 */

export {};
