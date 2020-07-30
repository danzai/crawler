const util = require('./api/util');

const dbConfig = {
    url: 'mongodb+srv://crawler:a123456@$crawler-mjpbb.gcp.mongodb.net?retryWrites=true',
    db: 'test'
};

util.connect(dbConfig.url, client => {
    const db = client.db(dbConfig.db),
        col = db.collection('vvic');

    col.find().toArray((error, data) => {
        if (error) {
            console.log(error);
        } else {
            console.log(data);
        }

        client.close();
    });
});
