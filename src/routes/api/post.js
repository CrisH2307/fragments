const { createSuccessResponse, createErrorResponse } = require('../../../src/response');
const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
require('dotenv').config();
const API_URL = process.env.API_URL || 'http://localhost:8080';

module.exports = async (req, res) => {
  if (Buffer.isBuffer(req.body)) {
    try {
      const fragment = new Fragment({
        ownerId: req.user,
        type: req.headers['content-type'],
        size: Buffer.byteLength(req.body),
      });
      await fragment.save();
      await fragment.setData(req.body);

      // Log fragment for debugging purposes
      console.log('Fragment created:', fragment);

      res.setHeader('Location', `${API_URL}/v1/fragments/${fragment.id}`);
      const successResponse = createSuccessResponse(fragment);
      res.status(201).json(successResponse);
    } catch (err) {
      res
        .status(500)
        .json(createErrorResponse(500, 'error catched while creating fragment from post'), err);
    }
  } else {
    logger.debug('Received invalid body type:', typeof req.body);
    res.status(415).json(createErrorResponse(415, 'Not a valid type'));
  }
};
