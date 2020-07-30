const fs = require("fs");
const request = require("request");
const MongoClient = require('mongodb').MongoClient;

const api = {
    /**
     * 获取文件名
     * @param url
     */
    getNameByUrl(url) {
        return url.substring(url.lastIndexOf('/') + 1);
    },
    /**
     * 下载
     * @param url
     * @param filePath
     * @param callback
     */
    download(url, filePath, callback) {
        const stream = fs.createWriteStream(filePath);
        request(url).pipe(stream).on("close", () => {
            console.log(`download finish: url = ${url}, file = ${filePath}`);
            callback();
        });
    },
    /**
     * 连接DB
     * @param uri
     * @param callback
     */
    connect(uri, callback) {
        MongoClient.connect(uri, (err, client) => {
            if (err) {
                console.log(err);
            } else {
                callback(client);
            }
        });
    }
};

module.exports = api;
