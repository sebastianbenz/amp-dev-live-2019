const Twitter = require('twitter')
const linkifyHtml = require('linkifyjs/html')

const { writeFile } = require('fs')
const { join } = require('path')
const TWEETS_BACKUP = join(__dirname, '../public/js/tweets.json')

class Tweets {
  constructor() {
    this.client_ = new Twitter({
      consumer_key: 'JbfQLPAfRo1lATe9bVhYa4BVO',
      consumer_secret: 'ZgnwmcG9zLHx7S6aYOQ9HJgFiFytDVl7G4VXsOsUOftMn7jOF2',
      access_token_key: '151394757-X9QNFvy0aZYtvsmBqsBIKWmiuJaHKRkiFkq1zxP8',
      access_token_secret: 'WnzGQRZDl7Lax70PvK2BPJlBF8KwAIYEPUo1TO48ySOwC'
    })
  }

  async search(query, cache = false) {
    if (cache) {
      return require(TWEETS_BACKUP)
    }
    try {
      const response = await this.client_.get('search/tweets', { q: query })
      response.statuses.forEach(
        status => {
          status.timestamp = new Date(status['created_at']).getTime()
          status.user = status.user.screen_name
          status.text = `<strong>${status.user}:</strong> ` + linkifyHtml(status.text)
        }
      )
      response.statuses.timestamp = new Date().getTime()
      writeFile(
        TWEETS_BACKUP,
        JSON.stringify(response.statuses, null, 2),
        'utf-8',
        err => (err ? console.log(err) : '')
      )
      response.statuses.timestamp = new Date().getTime()
      return response.statuses
    } catch (error) {
      console.log(error)
      return require(TWEETS_BACKUP)
    }
  }
}

module.exports = new Tweets()
