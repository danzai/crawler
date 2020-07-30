const request = require('request');
const ibili = require("ibili");

const api = {
    getCid: (bvid, callback) => {
        const url = `https://api.bilibili.com/x/player/pagelist?bvid=${bvid}`;
        console.log(`Get cid: ${url}`);

        request(url, (error, response, body) => callback(JSON.parse(body).data[0].cid));
    },
    getCommentByCid: (cid, callback) => {
        const url = `https://api.bilibili.com/x/v1/dm/list.so?oid=${cid}`;
        console.log(`Get comment: ${url}`);

        request({
            url,
            headers: {
                'content-type': 'text/xml;charset=GBK',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:70.0) Gecko/20100101 Firefox/70.0',
                'Accept': '*/*',
                'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2',
                'Origin': 'https://www.bilibili.com',
                'Connection': 'keep-alive'
            }
        }, (error, response, body) => callback(body));
    },
    getCommentByUrl: (url, callback) => {
        ibili.loadbarrage(url).then(data => callback(data));
    }
};

module.exports = api;
