 Assigment has been done using javascript
 for each subtask, an api has been created.
 You need request data using the APIs via postman


 Steps to run this application:
    1. make sure nodejs is intalled in your system
    2. in terminal run command "npm install" 
    3. create an .env in the root folder
    4. add variable from .env.sample file (Note: all variables in .env.sample file are genuine, since    its an assignment so I have not provided dummy values)
    5. in terminal run command "npm run startd" to run the application on 3071 port
    6. open postman and call below APIs to get data required
 

 Top 5 Movie Titles: Sort and print the top 5 movie titles based on the following criteria:
    ● Duration -> http://localhost:3071/movies-info/top-movies?criteria=duration
    ● Year of Release -> http://localhost:3071/movies-info/top-movies?criteria=year
    ● Average rating (consider movies with minimum 5 ratings) -> http://localhost:3071/movies-info/top-movies?criteria=average-rating
    ● Number of ratings given -> http://localhost:3071/movies-info/top-movies?criteria=rating-count


 Number of Unique Raters: Determine and print the count of unique rater IDs.
        ->http://localhost:3071/movies-info/count-raters

 
 Top 5 Rater IDs: Sort and print the top 5 rater IDs based on:
    ● Most movies rated -> http://localhost:3071/movies-info/top-raters?criteria=top-rating
    ● Highest Average rating given (consider raters with min 5 ratings) -> http://localhost:3071/movies-info/top-raters?criteria=average-rating

 Top Rated Movie: Find and print the top-rated movies by:
    ● Director 'Michael Bay' -> http://localhost:3071/movies-info/v2/top-movies?criteria=director&entity=Michael Bay
    ● 'Comedy' -> http://localhost:3071/movies-info/v2/top-movies?criteria=genre&entity=Comedy
    ● In the year 2013 -> http://localhost:3071/movies-info/v2/top-movies?criteria=year&entity=2013
    ● In India (consider movies with a minimum of 5 ratings) -> http://localhost:3071/movies-info/v2/top-movies?criteria=country&entity=India


 Favorite Movie Genre of Rater ID 1040: Determine and print the favorite movie genre
 for the rater with ID 1040 (defined as the genre of the movie the rater has rated most often).
    ->http://localhost:3071/movies-info/rater-favorite-genre?rater_id=1040


 Highest Average Rating for a Movie Genre by Rater ID 1040: Find and print the
 highest average rating for a movie genre given by the rater with ID 1040 (consider genres with a
 minimum of 5 ratings). -> http://localhost:3071/movies-info/rater-average-genre?rater_id=1040


 Year with Second-Highest Number of Action Movies: Identify and print the year with
 the second-highest number of action movies from the USA that received an average rating of
 6.5 or higher and had a runtime of less than 120 minutes. 
      -> http://localhost:3071/movies-info/second-highest-action-movies?genre=Action&duration=120&avg_rating=6.5


Count of Movies with High Ratings: Count and print the number of movies that have
received at least five reviews with a rating of 7 or higher.
   -> http://localhost:3071/movies-info/high-rated?lower_limit_rating=7