
from flask import Flask, render_template, jsonify, request
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
import numpy as np
import pandas as pd
import pickle

# create engine
connection_string = "admin1:12345@localhost:5432/movie_search_project"
engine = create_engine(f'postgresql://{connection_string}')
connection = engine.connect()

# Creat new endpoint for pretty json file
Base = automap_base()
Base.prepare(engine, reflect = True)
Streaming = Base.classes.movie_search_project
session = Session(engine)
app = Flask(__name__)

model = pickle.load(open('static/model/model.sav', 'rb'))
scaler = pickle.load(open('static/model/scaler.sav', 'rb'))

@app.route("/")
def Homepage():
    return render_template("index.html")
@app.route("/search")
def SearchPage():
    return render_template("search.html")
@app.route("/backhome")
def ReturnHome():
    return render_template("index.html")
@app.route("/tab-ml")
def ImdbHome():
    return render_template("tab-ml-viz.html")    

# Creat new rout for score
@app.route("/movies_score")
def movies_score():
    movies = pd.read_sql("select age, runtime, title, imdb, rotten_tomatoes,((imdb+(rotten_tomatoes/10))/2) as score from movie_search_project order by score desc", connection)
    return movies.to_json()
# Creat new rout for genres
@app.route("/movies_genre")
def movies_genere():
    movies = pd.read_sql("select genres, count(genres) as count from movie_search_project group by genres", connection)
    return movies.to_json()

@app.route('/predict',methods=['POST'])
def predict():
    '''
    For rendering results on HTML GUI
    '''
    # int_features = [int(x) for x in request.form.values()]
    # final_features = [np.array(int_features)]
    # prediction = model.predict(final_features)
    features = []
    features.append(int(request.form["duration"]))
    features.append(float(request.form["ave_vote"]))
    features.append(int(request.form["votes"]))

    features.append(float(request.form["critic_reviews"]))
    if request.form["movie"]== "Action": 
        features.append(1)
    else:
        features.append(0)
    
    if request.form["movie"]== "Adventure": 
        features.append(1)
    else:
        features.append(0)
    if request.form["movie"]== "Animation": 
        features.append(1)
    else:
        features.append(0)
    if request.form["movie"]== "Biography": 
        features.append(1)
    else:
        features.append(0)
    if request.form["movie"]== "Comedy": 
        features.append(1)
    else:
        features.append(0)
    if request.form["movie"]== "Crime": 
        features.append(1)
    else:
        features.append(0)
    if request.form["movie"]== "Drama": 
        features.append(1)
    else:
        features.append(0)
    if request.form["movie"]== "Family": 
        features.append(1)
    else:
        features.append(0)

    if request.form["movie"]== "Fantasy": 
        features.append(1)
    else:
        features.append(0)

    if request.form["movie"]== "Horror": 
        features.append(1)
    else:
        features.append(0)
    if request.form["movie"]== "Music": 
        features.append(1)
    else:
        features.append(0)
    if request.form["movie"]== "Musical": 
        features.append(1)
    else:
        features.append(0)

    if request.form["movie"]== "Mystery": 
        features.append(1)
    else:
        features.append(0)
    if request.form["movie"]== "Romance": 
        features.append(1)
    else:
        features.append(0)
    if request.form["movie"]== "Sci-Fi": 
        features.append(1)
    else:
        features.append(0)
    if request.form["movie"]== "Sport": 
        features.append(1)
    else:
        features.append(0)
    if request.form["movie"]== "Thriller": 
        features.append(1)
    else:
        features.append(0)
    if request.form["movie"]== "Western": 
        features.append(1)
    else:
        features.append(0)

    print(features)

    features =[features]
    features_scaled = scaler.transform(features)
    predictions = model.predict(features_scaled)
    print(predictions)


    output = round(predictions[0][0], 2)
    
    return render_template('tab-ml-viz.html', prediction_text='Movie profit should be $ {}'.format(output))

@app.route("/movies")
def movies():
    # movies = pd.read_sql("select * from movie_search_project order by rotten_tomatoes desc", connection)
    movies = pd.read_sql("select * from movie_search_project", connection)
    return movies.to_json()

@app.route("/movies2")
def movies2():
    results = session.query(Streaming.title, Streaming.genres, Streaming.age, Streaming.imdb, Streaming.netflix, Streaming.hulu,\
            Streaming.prime_video, Streaming.runtime, Streaming.year, Streaming.directors, Streaming.rotten_tomatoes).all()
    moviesDB = []
    for title, genre, age, imdb, netflix, prime, hulu, runtime, year, directors, rotten in results:
            all_movies_dict = {}
            all_movies_dict["title"] = title
            all_movies_dict["genres"] = genre
            all_movies_dict["age"] = age
            all_movies_dict["imdb"] = imdb
            all_movies_dict["netflix"] = netflix
            all_movies_dict["hulu"] = hulu
            all_movies_dict["prime_video"] = prime
            all_movies_dict["runtime"] = runtime
            all_movies_dict["year"] = year
            all_movies_dict["directors"] = directors
            all_movies_dict["rotten_tomatoes"] = rotten
            moviesDB.append(all_movies_dict)
    return jsonify(moviesDB)

if __name__ == '__main__':
 app.run()
