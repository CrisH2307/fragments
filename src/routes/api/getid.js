// src/routes/api/get.js

const { Fragment } = require('../../model/fragment');
const { createErrorResponse } = require('../../response');
const logger = require('../../logger');
const md = require('markdown-it')();
const { htmlToText } = require('html-to-text');
const sharp = require('sharp');

// Get fragment data by Id
const getId = async (req, res) => {
  const ownerId = req.user;
  const [id, extension] = req.params.id.split('.');

  logger.info({ id, ownerId, extension }, `Incoming GET request for fragment: ${req.originalUrl}`);

  try {
    // Log request body, params, and headers for better traceability
    logger.debug({ params: req.params, query: req.query, headers: req.headers }, 'Request details');

    const fragment = await Fragment.byId(ownerId, id);
    logger.debug({ fragment }, 'Fragment fetched successfully');

    const data = await fragment.getData();
    logger.debug('Fragment data retrieved');

    // if extension is provided, convert the data
    if (extension) {
      const extensionType = getExtensionContentType(extension);

      if (!extensionType) {
        const message = `Unsupported extension: ${extension}`;
        const errorResponse = createErrorResponse(415, message);
        logger.error({ errorResponse }, message);
        return res.status(415).json(errorResponse);
      }

      logger.info(
        { from: fragment.mimeType, to: extensionType },
        'Attempting conversion of fragment'
      );

      if (fragment.formats.includes(extensionType)) {
        logger.info('Supported conversion format found');
        const convertedData = await convertData(data, fragment.mimeType, extension);
        res.setHeader('Content-Type', extensionType);
        res.status(200).send(convertedData);
      } else {
        const message = `Fragment cannot be returned as ${extension}`;
        const errorResponse = createErrorResponse(415, message);
        logger.error({ errorResponse }, 'Invalid conversion attempt');
        res.status(415).json(errorResponse);
      }
    } else {
      // if no extension, return raw data
      res.setHeader('Content-Type', fragment.type);
      res.status(200).send(data);
    }
  } catch (err) {
    const errorResponse = createErrorResponse(404, err.message);
    logger.warn({ errorResponse, stack: err.stack }, 'Error retrieving fragment');
    res.status(404).json(errorResponse);
  }
};

// get extension respective content-type
const getExtensionContentType = (extension) => {
  switch (extension) {
    case 'txt':
      return 'text/plain';
    case 'md':
      return 'text/markdown';
    case 'html':
      return 'text/html';
    case 'json':
      return 'application/json';
    case 'png':
      return 'image/png';
    case 'jpg':
      return 'image/jpeg';
    case 'webp':
      return 'image/webp';
    case 'gif':
      return 'image/gif';
    default:
      return null;
  }
};

// convert data
const convertData = async (data, from, to) => {
  let convertedData = data;

  switch (from) {
    case 'text/markdown':
      if (to == 'txt') {
        convertedData = md.render(data.toString());
        convertedData = htmlToText(convertedData.toString(), { wordwrap: 150 });
      }
      if (to == 'html') {
        convertedData = md.render(data.toString());
      }
      break;

    case 'text/html':
      if (to == 'txt') {
        convertedData = htmlToText(data.toString(), { wordwrap: 130 });
      }
      break;

    case 'application/json':
      if (to == 'txt') {
        convertedData = JSON.parse(data.toString());
      }
      break;

    case 'image/png':
      if (to == 'jpg') {
        convertedData = await sharp(data).jpeg().toBuffer();
      }
      if (to == 'webp') {
        convertedData = await sharp(data).webp().toBuffer();
      }
      if (to == 'gif') {
        convertedData = await sharp(data).gif().toBuffer();
      }
      break;

    case 'image/jpeg':
      if (to == 'png') {
        convertedData = await sharp(data).png().toBuffer();
      }
      if (to == 'webp') {
        convertedData = await sharp(data).webp().toBuffer();
      }
      if (to == 'gif') {
        convertedData = await sharp(data).gif().toBuffer();
      }
      break;

    case 'image/webp':
      if (to == 'png') {
        convertedData = await sharp(data).png().toBuffer();
      }
      if (to == 'jpg') {
        convertedData = await sharp(data).jpeg().toBuffer();
      }
      if (to == 'gif') {
        convertedData = await sharp(data).gif().toBuffer();
      }
      break;

    case 'image/gif':
      if (to == 'png') {
        convertedData = await sharp(data).png().toBuffer();
      }
      if (to == 'jpg') {
        convertedData = await sharp(data).jpeg().toBuffer();
      }
      if (to == 'webp') {
        convertedData = await sharp(data).webp().toBuffer();
      }
      break;
  }

  logger.debug(`Fragment data was successfully converted from ${from} to ${to}`);
  return Promise.resolve(convertedData);
};

module.exports = getId;
