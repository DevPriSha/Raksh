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

    dataset_count = requests.get("https://earthquake.usgs.gov/fdsnws/event/1/count?format=text&starttime=1900-01-01&endtime={}&latitude=20.5937&longitude=78.9629&maxradiuskm=1900".format(time.strftime("%Y-%m-%d")))
    dataset_count = int(dataset_count.text)

    if dataset_count < 20000:
        dataset = requests.get("https://earthquake.usgs.gov/fdsnws/event/1/query?format=csv&starttime=1900-01-01&endtime={}&latitude=20.5937&longitude=78.9629&maxradiuskm=1900&limit=20000".format(time.strftime("%Y-%m-%d"))).text
    else:
        dataset = requests.get("https://earthquake.usgs.gov/fdsnws/event/1/query?format=csv&starttime=1900-01-01&endtime={}&latitude=20.5937&longitude=78.9629&maxradiuskm=1900&limit=20000".format(time.strftime("%Y-%m-%d"))).text
        dataset_count -= 20000
        i = 0
        while dataset_count > 0:
            i += 1
            dataset += requests.get("https://earthquake.usgs.gov/fdsnws/event/1/query?format=csv&starttime=1900-01-01&endtime={}&latitude=20.5937&longitude=78.9629&maxradiuskm=1900&limit=20000&offset={}".format(time.strftime("%Y-%m-%d"), 20000*i)).text
            dataset_count -= 20000

    #load data to pandas dataframe
    df = pd.read_csv(dataset)
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
    filename = 'model.sav'
    pickle.dump(forest_model, open(filename, 'wb'))

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

# route for tweets
@app.route('/tweets', methods=['GET'])
def tweets():

    # Authenticate to Twitter
    auth = tweepy.OAuthHandler("consumer_key", "consumer_secret")
    auth.set_access_token("access_token", "access_token_secret")

    # Create API object
    api = tweepy.API(auth)

    # Define the disaster keyword
    disaster_keyword = "disaster"

    # Fetch tweets containing the disaster keyword
    public_tweets = api.search(disaster_keyword)

    # Iterate over the tweets and print the text
    for tweet in public_tweets:
        print(tweet.text)


if __name__ == '__main__':
    app.run(debug=True)

