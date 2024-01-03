const { Pool } = require('pg');
const dotenv = require('dotenv');
const fs = require('fs');
const csvParser = require('csv-parser');
dotenv.config();
const pool = new Pool(
    {
        user: process.env.USER,
        host: process.env.HOST,
        database: process.env.DATABASE,
        password: process.env.PASSWORD,
        port: process.env.DB_PORT,
        ssl: true
    });
  pool.on('connect', () => {
        console.log('Connected to PostgreSQL database');
  });
const getMovieList = async(criteria, rows) => {
    let sanitizedCriteria = criteria.trim().toLowerCase();
    let rawQuery;
    let mainCol;
    if (sanitizedCriteria === "duration") {
        mainCol = "minutes";
        rawQuery = `SELECT title, minutes FROM movies 
                    order by ${mainCol} desc limit ${rows}`;
    }else if(sanitizedCriteria === "year"){
        mainCol = "year";
        rawQuery = `SELECT title, year FROM movies 
                    order by ${mainCol} desc limit ${rows}`;
    }else if(sanitizedCriteria === "average-rating"){
        mainCol = "movie_id";
        rawQuery = `select min(title) as title, ${mainCol},
                    trunc(avg(rating), 2) as avg_rating
                    from ratings rt
                    inner join movies mv on mv.id=rt.movie_id
                    group by ${mainCol}
                     having count(movie_id) >= 5
                    order by avg_rating desc`;
    }else if(sanitizedCriteria === "rating-count"){
        mainCol = "movie_id";
        rawQuery = `select  min(title) as title, ${mainCol},
                    count(movie_id) as num_ratings
                    from ratings rt
                    inner join movies mv on mv.id=rt.movie_id
                    group by ${mainCol}
                    order by num_ratings desc`;
    }
    const moviesList = await pool.query(rawQuery);
    if(["average-rating", "rating-count"].includes(sanitizedCriteria))
      return moviesList.rows.slice(0, 5);
    return moviesList.rows;
}
exports.topMovies = async (req, res, next) => {
    const rows = 5
    const { criteria } = req.query;
    if (!criteria) {
        return res.status(400).json("criteria not found")
    }
    
    let moviesList = await getMovieList(criteria, rows);
    return res.status(200).json(moviesList);
}

exports.countRaters = async (req, res, next) => {
    let rawQuery = `SELECT COUNT(DISTINCT rater_id) as unique_raters 
                    FROM ratings;`
    const ratersList = await pool.query(rawQuery);
    return res.status(200).json(ratersList.rows);
}

exports.topRaters = async(req, res, next) =>{
    const { criteria } = req.query;
    if (!criteria) {
        return res.status(400).json("criteria not found")
    }
    const rows = 5;
    let sanitizedCriteria = criteria.trim().toLowerCase();
    let rawQuery;
    if(sanitizedCriteria === "top-rating"){
        rawQuery =   `select rater_id, count(distinct movie_id) as num_of_movies_rated
                        from ratings
                        group by rater_id
                        order by num_of_movies_rated desc limit ${rows}`;
    }else if(sanitizedCriteria === "average-rating"){
     rawQuery =  `select rater_id, trunc(avg(rating::numeric),2) as avg_rating
                  from ratings
                  group by rater_id
                  having count(rating) >= 5
                  order by avg_rating desc `;
    }
    const ratersList = await pool.query(rawQuery);
    if(sanitizedCriteria === "average-rating"){
        return res.status(200).json(ratersList.rows.slice(0,5));
    }
    return res.status(200).json(ratersList.rows);
}

exports.topMoviesV2 = async(req, res, next) => {
    const { criteria, entity } = req.query;
    if (!criteria) {
        return res.status(400).json("criteria not found");
    }
    if(!entity){
        return res.status(400).json("entity not found");
    }
    const rows = 5;
    let rawQuery;
    if(["director", "year"].includes(criteria)){
        rawQuery = `select min(title) as title, trunc(avg(rating),2) as avg_rating, count(rating) as num_ratings
        from movies
        join ratings on movies.id = ratings.movie_id
        where ${criteria} = '${entity}'
        group by movies.id
        having count(rating) >= 5
        order by avg_rating desc limit ${rows};`
    }else if(["genre", "country"].includes(criteria)){
        rawQuery = ` SELECT min(title) as title, trunc(avg(rating), 2) as avg_rating, COUNT(rating) as num_ratings
        FROM movies mv
        JOIN ratings rt ON mv.id = rt.movie_id
        WHERE ${criteria} like '%${entity}%'
        GROUP BY mv.id
        HAVING COUNT(rating) >= 5
        ORDER BY avg_rating DESC
        LIMIT ${rows};`
    }
    const topMoviesList = await pool.query(rawQuery);
    return res.status(200).json(topMoviesList.rows);
    
}

exports.raterFavoriteGenre = async (req, res, next) => {
    const {rater_id} = req.query;
    if(!rater_id){
        return res.status(400).json("rater id not found");
    }
    const rawQuery = `select min(rt.rater_id) as rater_id, genre, count(rating) as num_ratings
                        from movies mv
                        join ratings rt on mv.id = rt.movie_id
                        where rt.rater_id = ${rater_id}
                        group by genre
                        order by num_ratings desc
                        limit 1`;
    const topGenreRaterWise = await pool.query(rawQuery);
    return res.status(200).json(topGenreRaterWise.rows);
}

exports.raterAverageGenre = async (req, res, next) => {
    const {rater_id} = req.query;
    if(!rater_id){
        return res.status(400).json("rater id not found");
    }
    const rawQuery = `select genre, trunc(avg(rating), 2) as avg_rating, count(rating) as num_ratings
                        from movies mv
                        join ratings rt on mv.id = rt.movie_id
                        where rt.rater_id = ${rater_id}
                        group by genre
                        having count(rating) >= 5
                        order by avg_rating desc
                        limit 1;`
    const averageGenreList = await pool.query(rawQuery);
    return res.status(200).json(averageGenreList.rows);
}

exports.secondHighestActionMovies = async(req, res, next) => {
    const { genre, duration, avg_rating} = req.query;
    if(!genre || !duration || !avg_rating){
        return res.status(200).json("genre, duration , avg_rating necessary in query params");
    }
    const rawQuery = ` select min(mt.year) as year , count(mt.id) as num_movies 
                       from 
                       (select mv.id, min(title) as title, 
                       min(year) as year, avg(rating) avg_rating 
                       from movies mv 
                       inner join ratings rt on mv.id= rt.movie_id 
                       where genre like '%${genre}%' and minutes < ${duration}
                        group by mv.id having avg(rating)>=${avg_rating}) 
                        as mt
                        group by mt.year
                        order by num_movies desc
                        limit 1 offset 1
                       `;

    const secondHighestActionList = await pool.query(rawQuery);
    return res.status(200).json(secondHighestActionList.rows);
}

exports.highRated = async(req, res, next) => {
    const {lower_limit_rating} = req.query;
    const rawQuery = `select min(mv.title) as title,
                        count(rt.rating) as num_high_ratings
                        from movies mv
                        inner join ratings rt on mv.id = rt.movie_id
                        where rt.rating >= ${lower_limit_rating}
                        group by mv.id
                        having count(rt.rating) >= 5
                        order by num_high_ratings desc`;
    const moviesAboveLimitRating = await pool.query(rawQuery);
    return res.status(200).json({ num_movies_above_7: moviesAboveLimitRating.rows.length});
}

exports.importData = async (req, res, next) => {
    const {table_id} = req.params;
    const csvFilePath = table_id == 2? 
                        "C:/Users/deves/Downloads/movies_csv/movies_csv/ratings.csv": 
                        "C:/Users/deves/Downloads/movies_csv/movies_csv/movies.csv" ;
    const tableName = table_id == 2?'ratings': 'movies';
    const createTableQuery =table_id == 2? 
                            `create table ratings (rater_id integer, movie_id integer, 
                            rating integer, time integer)`
                            :`create table movies ( id integer, title varchar(255), year integer,
                             country varchar(255), genre varchar(255), director varchar(255),
                              minutes integer, poster varchar(255))`
    await pool.query(createTableQuery);
    const stream = fs.createReadStream(csvFilePath).pipe(csvParser({ objectMode: 100 }));

    let insertDone = await new Promise((resolve, reject) => {
        stream.on('data', (row) => {
            const columns = Object.keys(row);
            const values = Object.values(row);
            if (Object.keys(row).length === 0) {
                resolve(1)
            }
            // Generate the SQL query
            const queryText = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values.map((_, index) => `$${index + 1}`).join(', ')})`;
            console.log("//////", queryText)
            pool.query(queryText, values)// Insert data into PostgreSQL table
                .then(() => console.log(`Inserted row`))
                .catch((error) => console.error(error));
        });
    })

    return res.status(200).json("data will be inserted in a seconds");
}