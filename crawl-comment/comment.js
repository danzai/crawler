const bilibili = require('./api/bilibili');

const url = 'https://www.bilibili.com/video/BV1e5411Y7cA?from=search&seid=4634694734800623388';

bilibili.getCommentByUrl(url, data => {
    console.log(data);
});
