const Twitter = require('twitter')
const linkifyHtml = require('linkifyjs/html')

class Tweets {
  constructor() {
    this.client_ = new Twitter({
      consumer_key: 'JbfQLPAfRo1lATe9bVhYa4BVO',
      consumer_secret: 'ZgnwmcG9zLHx7S6aYOQ9HJgFiFytDVl7G4VXsOsUOftMn7jOF2',
      access_token_key: '151394757-X9QNFvy0aZYtvsmBqsBIKWmiuJaHKRkiFkq1zxP8',
      access_token_secret: 'WnzGQRZDl7Lax70PvK2BPJlBF8KwAIYEPUo1TO48ySOwC'
    })
  }

  async search(query) {
    const response = await this.client_.get('search/tweets', { q: query })
    response.statuses.forEach(
      status => (status.text = linkifyHtml(status.text))
    )
    response.statuses.timestamp = new Date().getTime()
    return response.statuses
  }
}

module.exports = new Tweets()
