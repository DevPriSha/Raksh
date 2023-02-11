# route for tweets
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