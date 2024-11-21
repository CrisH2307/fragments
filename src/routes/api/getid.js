// Imports
const { createErrorResponse } = require('./../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const markdownit = require('markdown-it');
const md = markdownit();

// Conversion Configurations
function isValidConversion(contentType, extension) {
  const validConversions = {
    'text/plain': ['.txt', '.html'],
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
  return validConversions[contentType]?.includes(`.${extension}`);
}

// Convert the fragment data to the extension type
function convertFragmentData(data, contentType, extension) {
  console.debug(`Attempting to convert data: contentType=${contentType}, extension=${extension}`);

  if (extension === 'txt') {
    if (contentType === 'text/plain') {
      return data;
    }
  } else if (extension === 'html') {
    if (contentType === 'text/plain') {
      console.debug('Converting text/plain to HTML');
      return `<html><body>${data.toString()}</body></html>`;
    } else if (contentType === 'text/markdown') {
      console.debug('Converting text/markdown to HTML');
      return md.render(data.toString());
    }
  }
  return null;
}

const getMimeTypeFromExtension = (extension) => {
  const contentTypes = {
    txt: 'text/plain',
    md: 'text/markdown',
    html: ['text/html', 'text/plain'],
    csv: 'text/csv',
    json: 'application/json',
    yaml: 'application/yaml',
    yml: 'application/yaml',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
    gif: 'image/gif',
    avif: 'image/avif',
  };
  return contentTypes[extension] || 'application/octet-stream';
};

// Main Function: Handles the GET request for a specific fragment by ID with optional conversion
const getId = async (req, res) => {
  try {
    const ownerId = req.user;
    const { id } = req.params;
    const parts = id.split('.');
    const cleanId = parts[0];
    const extension = parts.length > 1 ? parts.pop() : null;

    // Get the fragment by id
    const fragment = await Fragment.byId(ownerId, cleanId);

    // Get the actual data of the fragment
    const fragmentData = await fragment.getData();
    const contentType = fragment.type;

    if (extension != null) {
      if (!isValidConversion(contentType, extension)) {
        logger.error(
          { contentType, extension },
          'Conversion is not supported due to the unsupported/unknown extension type'
        );
        return res
          .status(415)
          .json(
            createErrorResponse(
              415,
              `A ${contentType} type fragment cannot be returned as a ${extension}`
            )
          );
      }

      const convertedData = await convertFragmentData(fragmentData, contentType, extension);
      logger.info(
        { id, contentType, extension },
        'Successfully convert fragment data to the extension type'
      );
      res.setHeader('Content-Type', getMimeTypeFromExtension(extension));
      return res.status(200).send(convertedData);
    }

    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }

    logger.info({ id }, 'No extension provided, returning fragment data');
    return res.status(200).send(fragmentData);
  } catch (error) {
    logger.error(`Fragment with ID ${req.params.id} not found: ${error}`);
    return res
      .status(404)
      .json(createErrorResponse(404, `Fragment with ID ${req.params.id} not found`));
  }
};

module.exports = getId;
