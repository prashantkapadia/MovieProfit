CREATE TABLE movie_search_project (
	index INT,
  	id INT PRIMARY KEY,
  	title TEXT,
  	year INT,
	age TEXT,
	imdb FLOAT,
	rotten_tomatoes INT,
	netflix BOOLEAN,
	hulu BOOLEAN,
	prime_video BOOLEAN,
	directors TEXT,
	genres TEXT,
	language TEXT,
	runtime FLOAT
		
);

SELECT * FROM movie_search_project;

-- Deleted movies that only disny+ had
DELETE FROM movie_search_project
WHERE (netflix = false AND hulu = false AND prime_video = false);