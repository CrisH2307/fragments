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
} = require('./data/memory/index');

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
    logger.debug('Fetching fragments for user:', ownerId);
    const fragments = await listFragments(ownerId, expand);
    logger.debug('Fragments fetched:', fragments);
    return fragments;
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
  static delete(ownerId, id) {
    logger.debug('Deleting fragment:', { ownerId, id });
    return deleteFragment(ownerId, id);
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise
   */
  save() {
    logger.debug('Saving fragment:', this);
    this.updated = new Date().toISOString();
    return writeFragment(this);
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
    if (!data) {
      logger.error('No Buffer provided for fragment data');
      throw new Error('No Buffer');
    }
    logger.debug('Setting data for fragment:', this.id);
    await this.save();
    this.size = Buffer.byteLength(data);
    return writeFragmentData(this.ownerId, this.id, data);
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
    if (this.type == 'text/plain' || this.type == 'text/plain; charset=utf-8') {
      return ['text/plain'];
    } else if (this.type == 'text/markdown') {
      return ['text/markdown', 'text/html', 'text/plain'];
    } else if (this.type == 'text/html') {
      return ['text/html', 'text/plain'];
    } else if (this.type == 'application/json' || this.type == 'application/json; charset=utf-8') {
      return ['text/plain', 'application/json'];
    } else if (
      this.type == 'image/png' ||
      this.type == 'image/jpeg' ||
      this.type == 'image/webp' ||
      this.type == 'image/gif'
    ) {
      return ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
    }
    return [];

    // for (const supportedType of this.type) {
    //   if (this.type.startsWith(supportedType)) {
    //     return [];
    //   }
    // }
    //Todo; LATER
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
}

module.exports.Fragment = Fragment;
