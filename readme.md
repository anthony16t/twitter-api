# Twitter Api
### Get information from twitter using the bearer token
--- This package is not finished yet ---
Start using the package by importing it.
``` javascript
import TwitterApi from "@anthony16t/twitter-api";
// or using require
const TwitterApi = require('@anthony16t/twitter-api')
```
### Initialize package
``` javascript
const twitterApi = new TwitterApi(bearerToken)
```
### Inside a async function
``` javascript
async function Main(){
    // number of result to get max 100
    const numberOfResult = 10

    // Get user followers list
    await twitterApi.followers('jack',numberOfResult)

    // Get user followings list
    await twitterApi.followings('jack',numberOfResult)

    // Search tweets on twitter
    await twitterApi.searchTweets('$FB',numberOfResult)

    // Get information about a username
    await twitterApi.usernameData('jack')

     // Get list of tweets from username jack
    await twitterApi.usernameTweets('jack',numberOfResult)
}
// run Main function
Main()
```