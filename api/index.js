const express = require('express');
const router = express.Router();
const controller = require("./controller");

router.get('/top-movies', controller.topMovies);
router.get('/count-raters', controller.countRaters);
router.get('/top-raters', controller.topRaters);
router.get('/v2/top-movies', controller.topMoviesV2);
router.get('/rater-favorite-genre', controller.raterFavoriteGenre);
  module.exports = router;