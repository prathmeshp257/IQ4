
require('dotenv').config()

// Live
    const baseUrl = "http://anpr-staging-env.eba-grcbjd8e.eu-west-1.elasticbeanstalk.com";

// Staging
    // const baseUrl = "http://anpr-staging-env.eba-grcbjd8e.eu-west-1.elasticbeanstalk.com"


// Local/ Development/ Testing
    // const baseUrl = "http://localhost:4000";

module.exports = { baseUrl };
