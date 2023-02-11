from flask import request, jsonify, Flask
import pickle
import time
import requests
import pandas as pd
import tweepy

app = Flask(__name__)

@app.route('/train', methods=['GET'])
def predict():
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
    df = df.dropna()

    #train model
    from sklearn.linear_model import LinearRegression


# route for predict

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

