// src/routes/api/delete.js

// Refactor to use response.js functions
// const logger = require('../../logger');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {
  try {
    await Fragment.delete(req.user, req.params.id);
    return res.status(200).json(createSuccessResponse());
  } catch (error) {
    return res.status(404).json(createErrorResponse(error.message));
  }
};
