// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');
// Get our logger instance
const logger = require('./../logger');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    if (!ownerId) {
      throw new Error('Owner id should be entered');
    } else if (!type) {
      throw new Error('Type should be entered');
    }
    if (typeof size !== 'number') {
      throw new Error('size should be a number');
    } else {
      if (size < 0) {
        throw new Error('Size cannot be negative');
      }
    }
    if (!Fragment.isSupportedType(type)) {
      throw new Error('This type is not supported');
    }

    this.id = id || randomUUID();
    this.ownerId = ownerId;
    this.created = created || new Date().toISOString();
    this.updated = updated || new Date().toISOString();
    this.type = type;
    this.size = size;
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    try {
      // Validate ownerId
      if (!ownerId || typeof ownerId !== 'string') {
        throw new Error('Invalid or missing ownerId');
      }

      // Fetch the fragments for the user
      logger.debug(`Fetching fragments for user: ${ownerId} with expand=${expand}`);
      const fragments = await listFragments(ownerId, expand);

      // Log the retrieved fragments for debugging
      logger.debug(`Fragments fetched for user ${ownerId}:`, fragments);

      // Return the retrieved fragments
      return fragments;
    } catch (error) {
      // Log the error and rethrow it
      logger.error(`Error fetching fragments for user ${ownerId}: ${error.message}`);
      throw error; // Rethrow to allow higher-level error handling
    }
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    logger.debug('Fetching fragment by ID:', { ownerId, id });
    try {
      const fragmentData = await readFragment(ownerId, id);
      logger.debug('Fragment data fetched:', fragmentData);
      return new Fragment(fragmentData);
    } catch (error) {
      logger.error('Error fetching fragment by ID:', error);
      throw error;
    }
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise
   */
  static async delete(ownerId, id) {
    try {
      const fragment = await readFragment(ownerId, id);
      if (!fragment) throw new Error('Fragment not found');
      return await deleteFragment(ownerId, id);
    } catch (error) {
      return Promise.reject(new Error(error.message || 'Unable to delete fragment'));
    }
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise
   */
  save() {
    try {
      if (readFragment(this.ownerId, this.id) == undefined) throw 'No fragment found';
      this.updated = new Date().toISOString();
      return writeFragment(this);
    } catch (error) {
      return Promise.reject(new Error(error));
    }
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  getData() {
    logger.debug('Getting data for fragment:', this.id);
    return readFragmentData(this.ownerId, this.id);
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise
   */
  async setData(data) {
    try {
      if (readFragment(this.ownerId, this.id) == undefined) throw 'No fragment found';
      this.updated = new Date().toISOString();
      this.size = Buffer.from(data).length;
      return writeFragmentData(this.ownerId, this.id, data);
    } catch (error) {
      return Promise.reject(new Error(error));
    }
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    return this.type == 'text/plain' || this.type == 'text/plain; charset=utf-8';
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    const supportedTypes = {
      'text/plain': ['text/plain'],
      'text/plain; charset=utf-8': ['text/plain'],
      'text/markdown': ['text/markdown', 'text/html', 'text/plain'],
      'text/html': ['text/html', 'text/plain'],
      'application/json': ['text/plain', 'application/json'],
      'application/json; charset=utf-8': ['text/plain', 'application/json'],
      'image/png': ['image/png', 'image/jpeg', 'image/webp', 'image/gif'],
      'image/jpeg': ['image/png', 'image/jpeg', 'image/webp', 'image/gif'],
      'image/webp': ['image/png', 'image/jpeg', 'image/webp', 'image/gif'],
      'image/gif': ['image/png', 'image/jpeg', 'image/webp', 'image/gif'],
    };

    // Using a for loop to check supported types
    for (const [type, formats] of Object.entries(supportedTypes)) {
      if (this.type === type) {
        return formats; // Return the corresponding formats for the supported type
      }
    }

    logger.warn('Unsupported Content-Type:', this.type);
    return []; // Return an empty array for unsupported types
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    const typeArr = [
      'text/plain',
      'text/plain; charset=utf-8',
      'text/markdown',
      'text/html',
      'application/txt',
      'application/json',
      'application/json; charset=utf-8',
      'image/png',
      'image/jpeg',
      'image/webp',
      'image/gif',
    ];
    const isSupported = typeArr.includes(value);
    if (!isSupported) {
      logger.warn('Unsupported type:', value);
    }
    return isSupported;
  }
  async convertTo(extension) {
    if (extension === '.html' && this.mimeType === 'text/plain') {
      // Convert plain text to HTML by wrapping it in basic HTML tags
      return `<html><body><pre>${this.data}</pre></body></html>`;
    }
    // Add handling for other conversions if necessary
    throw new Error(`Conversion to ${extension} not implemented`);
  }
}

module.exports.Fragment = Fragment;

// PORT 80, NOT USE FAKE S3 use xhuynh-fragments, NO AWS CREDENTION, NODE_ENV production
