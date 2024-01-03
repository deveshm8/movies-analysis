const express = require('express');
const router = express.Router();
const controller = require("./controller");

router.get('/top-movies', controller.topMovies);
router.get('/count-raters', controller.countRaters);
router.get('/top-raters', controller.topRaters);
router.get('/v2/top-movies', controller.topMoviesV2);
router.get('/rater-favorite-genre', controller.raterFavoriteGenre);
router.get('/rater-average-genre', controller.raterAverageGenre);
router.get('/second-highest-action-movies', controller.secondHighestActionMovies)
router.get('/high-rated', controller.highRated);
router.post('/import-table/:table_id', controller.importData);
  module.exports = router;