const { createErrorResponse } = require('../../response');
const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');

/**
 * Define valid conversions for each fragment type.
 */
const validConversions = {
  'text/plain': ['.txt'],
  'text/markdown': ['.md', '.html', '.txt'],
  'text/html': ['.html', '.txt'],
  'text/csv': ['.csv', '.txt', '.json'],
  'application/json': ['.json', '.yaml', '.yml', '.txt'],
  'application/yaml': ['.yaml', '.txt'],
  'image/png': ['.png', '.jpg', '.webp', '.gif', '.avif'],
  'image/jpeg': ['.png', '.jpg', '.webp', '.gif', '.avif'],
  'image/webp': ['.png', '.jpg', '.webp', '.gif', '.avif'],
  'image/avif': ['.png', '.jpg', '.webp', '.gif', '.avif'],
  'image/gif': ['.png', '.jpg', '.webp', '.gif', '.avif'],
};

/**
 * Get MIME type from extension.
 */
const getMimeTypeFromExtension = (extension) =>
  ({
    '.txt': 'text/plain',
    '.md': 'text/markdown',
    '.html': 'text/html',
    '.csv': 'text/csv',
    '.json': 'application/json',
    '.yaml': 'application/yaml',
    '.yml': 'application/yaml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.avif': 'image/avif',
  })[extension] || 'application/octet-stream'; // Default MIME type

/**
 * Get fragment with the provided fragment ID.
 */
const getId = async (req, res) => {
  const { id } = req.params;
  const extension = id.includes('.') ? id.slice(id.lastIndexOf('.')) : null; // Extract extension

  try {
    const fragmentMetadata = await Fragment.byId(req.user, id);
    const fragment = new Fragment(fragmentMetadata);

    if (extension && validConversions[fragment.mimeType].includes(extension)) {
      const convertedData = await fragment.convertTo(extension); // Assume convertTo is implemented
      return res.status(200).type(getMimeTypeFromExtension(extension)).send(convertedData);
    }

    return res
      .status(200)
      .type(fragment.mimeType)
      .send(await fragment.getData());
  } catch (error) {
    logger.error(`Fragment with ID ${id} not found: ${error}`);
    return res.status(404).json(createErrorResponse(404, `Fragment with ID ${id} not found`));
  }
};

module.exports = getId;
