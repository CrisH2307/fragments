// src/routes/api/put.js

const { createSuccessResponse, createErrorResponse } = require('../../response');
// const express = require('express');
const { Fragment } = require('../../model/fragment');
// const contentType = require('content-type');
const API_URL = 'http://localhost:8080';

// const logger = require('../../logger');

module.exports = async (req, res) => {
  let fragment;
  try {
    fragment = new Fragment(await Fragment.byId(req.user, req.params.id));
    // frag = await fragment.getData();
    // res.setHeader('Content-Type', fragment.type);
  } catch (error) {
    return res.status(404).json(createErrorResponse('Fragment not found'));
  }

  if (!Buffer.isBuffer(req.body)) {
    res.status(415).json(createErrorResponse(415, 'Type error'));
  } else {
    try {
      // frag = new Fragment({ ownerId: req.user, type: req.get('Content-Type') });
      await fragment.save();
      await fragment.setData(req.body);
      res.set('Location', API_URL + '/v1/fragments/' + fragment.id);
      res.set('Content-Type', fragment.type);

      res.status(201).json(
        createSuccessResponse({
          fragment: fragment,
        })
      );
    } catch (error) {
      res.status(400).json(createErrorResponse(400, error));
    }
  }
};
