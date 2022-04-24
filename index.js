import fetch from 'node-fetch'
import logs from './logs.js'

export default class TwitterApi{
    
    constructor(bearerToken){
        this._apiBaseUrl = 'https://api.twitter.com/1.1/'
        this._bearerToken = bearerToken
    }

    // get username data from twitter
    async usernameData(username=''){
        // check username it's empty
        if(username==''){ logs.error('username is required') ; return false }
        try{
        // else run code
        const getResp = await this._GET('users/show.json',`?screen_name=${username}`)
        // if error return false 
        if(getResp.hasOwnProperty('error')){ return false }
        return {
            createdAt:new Date(getResp.created_at),twitterId:getResp.id_str,username:getResp.screen_name,name:getResp.name,
            profileImage:String(getResp.profile_image_url_https).replace('_normal','_400x400'),profileImageSmall:getResp.profile_image_url_https,
            followerCount:getResp.followers_count,desc:getResp.description
        }
        }catch(err){ logs.error(err.message) ; return false }
    }

    // get username tweets , it only gets posts by username not retweets
    async usernameTweets(userId='',maxResults=100){
        try{
        // still gotta work on getting next page result
        if(userId==''){ logs.error('userId is required') ; return false }
        const params = `?user_id=${userId}&exclude_replies=true&include_rts=false&count=${maxResults}&trim_user=false`
        const getResp = await this._GET('statuses/user_timeline.json',params)
        // if error return empty array
        if(getResp.hasOwnProperty('error')){ return [] }
        return getResp.map(data=>{return {
            createdAt:new Date(data.created_at),twitterId:data.id_str,username:data.user.screen_name,text:data.text
        } })
        }catch(err){ logs.error(err.message) ; return [] }
    }

    // get user followers list
    async followers(userId='',maxResults=200){
        try{
        // still gotta work on getting next page result
        if(userId===''){ logs.error('userId is required') ; return false }
        const params = `?user_id=${userId}&count=${maxResults}`
        const getResp = await this._GET('followers/list.json',params)
        // if error return empty array
        if(getResp.hasOwnProperty('error')){ return [] }
        return getResp.users.map(data=>{return {
            createdAt:new Date(data.created_at),twitterId:data.id_str,username:data.screen_name,name:data.name,desc:data.description,
            profileImage:data.profile_image_url_https.replace('_normal','_400x400'),profileImageSmall:data.profile_image_url_https
        }})
        }catch(err){ logs.error(err.message) ; return [] }
    }

    // get user followings list
    async followings(userId='',maxResults=200){
        try{
        // still gotta work on getting next page result
        if(userId===''){ logs.error('userId is required') ; return false }
        const params = `?user_id=${userId}&count=${maxResults}`
        const getResp = await this._GET('friends/list.json',params)
        // if error return empty array
        if(getResp.hasOwnProperty('error')){ return [] }
        return getResp.users.map(data=>{return {
            createdAt:new Date(data.created_at),twitterId:data.id_str,username:data.screen_name,name:data.name,desc:data.description,
            profileImage:data.profile_image_url_https.replace('_normal','_400x400'),profileImageSmall:data.profile_image_url_https
        }})
        }catch(err){ logs.error(err.message) ; return [] }
    }

    // search
    async searchTweets(query='',maxResults=100){
        try{
        if(query===''){ logs.error('query is required') ; return false }
        const params = `?count=${maxResults}&result_type=recent&include_rts=false&include_entities=false&q=${query}`
        const getResp = await this._GET('search/tweets.json',params)
        // if error return empty array
        if(getResp.hasOwnProperty('error')){ return [] }
        return getResp.statuses.map(data=>{return {
            createdAt:new Date(data.created_at),text:data.text,twitterId:data.id_str,usernameTwitterId:data.user.id_str,username:data.user.screen_name,name:data.user.name,
            profileImage:data.user.profile_image_url_https.replace('_normal','_400x400'),profileImageSmall:data.user.profile_image_url_https
        }})
        }catch(err){ logs.error(err.message) ; return [] }
    }

    async _GET(url,params){
        const headers={
            'Authorization':'Bearer '+this._bearerToken,
            'User-Agent':`Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36`
        }
        const apiRes = await (await fetch(`${this._apiBaseUrl}${url}${params}`,{headers:headers})).json()
        return apiRes
    }

}