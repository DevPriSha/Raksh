from flask import request, jsonify, Flask
import pickle
import time
import requests
import pandas as pd
import datetime
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error
# import tweepy

app = Flask(__name__)

# run this route at 00:00 everyday on server end
@app.route('/train', methods=['GET'])
def train():
    # predict next earthquake location and time using the pickled model
    # return the prediction as a json object
    # get data from earthquake api
    # predict earthquake location and time
    # return prediction as json object

    try:
        dataset_count = requests.get("https://earthquake.usgs.gov/fdsnws/event/1/count?format=text&starttime=1900-01-01&endtime={}&latitude=20.5937&longitude=78.9629&maxradiuskm=1900".format(time.strftime("%Y-%m-%d")))
        if dataset_count.status_code != 200:
            raise Exception
        dataset_count = int(dataset_count.text)
        print(dataset_count)

        if dataset_count < 15000:
            response = requests.get("https://earthquake.usgs.gov/fdsnws/event/1/query?format=csv&starttime=1900-01-01&endtime={}&latitude=20.5937&longitude=78.9629&maxradiuskm=1900&limit=15000".format(time.strftime("%Y-%m-%d")))
            if response.status_code != 200:
                raise Exception
            dataset = response.text
            
        else:
            response = requests.get("https://earthquake.usgs.gov/fdsnws/event/1/query?format=csv&starttime=1900-01-01&endtime={}&latitude=20.5937&longitude=78.9629&maxradiuskm=1900&limit=15000".format(time.strftime("%Y-%m-%d")))
            if response.status_code != 200:
                raise Exception
            dataset = response.text
            dataset_count -= 15000
            i = 0
            while dataset_count > 0:
                i += 1
                response = requests.get("https://earthquake.usgs.gov/fdsnws/event/1/query?format=csv&starttime=1900-01-01&endtime={}&latitude=20.5937&longitude=78.9629&maxradiuskm=1900&limit=15000&offset={}".format(time.strftime("%Y-%m-%d"), 15000*i))
                if response.status_code != 200:
                    raise Exception
                dataset += response.text
                dataset_count -= 15000
    except:
        dataset = "finaldatasetearthquake.csv"

    #load data to pandas dataframe
    try:
        df = pd.read_csv(dataset)
    except:
        return jsonify({'status': 'error', 'code' : 'csv error'})
    df['time'] = df['time'].apply(lambda x: datetime.datetime.strptime(x, "%Y-%m-%dT%H:%M:%S.%fZ"))
    df['time'] = df['time'].apply(lambda x: x.timestamp())

    df = df[['time', 'latitude', 'longitude', 'depth', 'mag']]

    df = df.fillna(0)

    X = df[['time', 'latitude', 'longitude']]
    y = df[['mag', 'depth']]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    forest_model = RandomForestRegressor(random_state=32)
    forest_model.fit(X_train, y_train)

    # save the model to disk
    try:
        filename = 'model.sav'
        pickle.dump(forest_model, open(filename, 'wb'))
    except:
        return jsonify({'status': 'error', 'code' : 'model saving error'})

    return jsonify({'status': 'success'})




# route for predict
#need user lat and long
@app.route('/predict', methods=['GET', 'POST'])
def predict():
    lat = request.args.get('lat')
    long = request.args.get('long')
    # load the model from disk
    loaded_model = pickle.load(open('model.sav', 'rb'))
    result = 0
    test_time = time.time()
    while result < 5.4:
        result = loaded_model.predict([[test_time, lat, long]])[0][0]
        test_time+=3600
    
    return jsonify({"next_earthquake": test_time, "lat": lat, "long": long, "mag": result})

# # route for tweets
# @app.route('/tweets', methods=['GET'])
# def tweets():

#     # Authenticate to Twitter
#     auth = tweepy.OAuthHandler("consumer_key", "consumer_secret")
#     auth.set_access_token("access_token", "access_token_secret")

#     # Create API object
#     api = tweepy.API(auth)

#     # Define the disaster keyword
#     disaster_keyword = "disaster"

#     # Fetch tweets containing the disaster keyword
#     public_tweets = api.search(disaster_keyword)

#     # Iterate over the tweets and print the text
#     for tweet in public_tweets:
#         print(tweet.text)


if __name__ == '__main__':
    app.run(debug=True)

