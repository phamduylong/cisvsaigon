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
 * @property {Number} startAge
 * @property {Number} endAge
 * @property {boolean} finished
 * @property {string} registrationLink
 * @property {string} shortDescription
 * @property {string} title
 * @property {string} created
 * @property {string} updated
 */
export {};
