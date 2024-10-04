const { createErrorResponse } = require('../../response');
const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');

/**
 * Get fragment with the provided fragment ID
 */
const getId = async (req, res) => {
  const { id } = req.params;

  try {
    const fragmentMetadata = await Fragment.byId(req.user, id);
    const fragment = new Fragment(fragmentMetadata);
    res
      .status(200)
      .type(fragment.mimeType)
      .send(await fragment.getData());
  } catch (error) {
    logger.error(`Fragment with ID ${id} not found: ${error}`);
    res.status(404).json(createErrorResponse(404, `Fragment with ID ${id} not found`));
  }
};

module.exports = getId;
