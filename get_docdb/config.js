var config = {}

config.host = process.env.DB_HOST
config.authKey = process.env.AUTH_KEY
config.databaseId = process.env.DATABASE
config.rawReservationCollectionId = process.env.RAW_RESERVATION_COLLECTION
config.AZML_API_KEY = process.env.AZML_API_KEY

module.exports = config;
