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
      fragment.created = new Date().toISOString();
      fragment.updated = fragment.created;
      await fragment.save();
      await fragment.setData(req.body);

      logger.debug('Content-Type:', req.headers['content-type']);
      logger.debug('Size:', Buffer.byteLength(req.body));

      logger.debug('Fragment details:', {
        id: fragment.id,
        ownerId: fragment.ownerId,
        created: fragment.created,
        updated: fragment.updated,
        type: fragment.type,
        size: fragment.size,
      });

      res.setHeader('Location', `${API_URL}/v1/fragments/${fragment.id}`);
      // Set Content-Type exactly as expected in the test
      res.setHeader('Content-Type', 'application/json');

      // Return the correct response structure
      res.status(201).json({
        fragment: {
          id: fragment.id,
          ownerId: fragment.ownerId,
          created: fragment.created,
          updated: fragment.updated,
          type: fragment.type,
          size: fragment.size,
        },
      });
    } catch (err) {
      res.status(500).json(createErrorResponse(500, `Error creating fragment: ${err.message}`));
    }
  } else {
    logger.debug('Received invalid body type:', typeof req.body);
    res.status(415).json(createErrorResponse(415, 'Not a valid type'));
  }
};
