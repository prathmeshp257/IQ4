
require('dotenv').config()

// Live
    const baseUrl = "http://anpr-api.eu-west-1.elasticbeanstalk.com";

// Staging
    // const baseUrl = "https://iq4-api.iq4-staging.tk"


// Local/ Development/ Testing
    // const baseUrl = "http://localhost:4000";

module.exports = { baseUrl };
