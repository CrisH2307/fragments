// src/routes/api/put.js

const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');

module.exports = async (req, res) => {
  const id = req.params.id;
  const ownerId = req.user;
  const type = req.get('Content-Type');
  const body = req.body;

  logger.info({ id, ownerId, type }, `Calling PUT ${req.originalUrl}`);

  try {
    const fragment = await Fragment.byId(ownerId, id);

    logger.debug({ fragment }, 'Fragment was found');

    if (fragment.type === type) {
      await fragment.setData(body);
      await fragment.save();

      logger.debug({ fragment }, `The fragment has been updated successfully`);

      const successResponse = createSuccessResponse({ fragment });
      return res.status(200).json(successResponse);
    } else {
      const errorResponse = createErrorResponse(
        415,
        'Unsupported Media Type: Fragment type cannot be changed after creation'
      );
      logger.warn({ errorResponse }, 'Failed to update the fragment');

      return res.status(415).json(errorResponse);
    }
  } catch (err) {
    const errorResponse = createErrorResponse(404, err.message);
    logger.warn({ errorResponse }, 'Failed to update the fragment');
    return res.status(404).json(errorResponse);
  }
};
