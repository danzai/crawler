const util = require('./api/util');
const taobao = require('./api/taobao');
const vvic = require('./api/vvic');

const dbConfig = {
    url: 'mongodb+srv://crawler:a123456@$crawler-mjpbb.gcp.mongodb.net?retryWrites=true',
    db: 'test'
},
    imageUrl = 'https://cbu01.alicdn.com/img/ibank/2018/234/349/9386943432_1147378231.400x400.jpg',
    imageFile = util.getNameByUrl(imageUrl);

const save = (collection, imageUrl, searchUrl, products) => {
    util.connect(dbConfig.url, client => {
        const db = client.db(dbConfig.db),
            col = db.collection(collection);

        col.find({
            imageUrl: imageUrl
        }).toArray((error, old) => {
            if (error) {
                console.log(error);
                client.close();
            } else {
                if (old && old.length) {
                    console.log(`update: ${imageUrl}`);

                    old.searchUrl = searchUrl;
                    old.products = products;
                    col.save(old, () => client.close());
                } else {
                    console.log(`insert: ${imageUrl}`);

                    col.insertOne({
                        imageUrl: imageUrl,
                        searchUrl: searchUrl,
                        products: products
                    }, () => client.close());
                }
            }
        });
    });
}

util.download(imageUrl, imageFile, () => {
    taobao.getUrl(imageFile, url => {
        taobao.getList(url, products => {
            console.log(products);
            save('taobao', imageUrl, url, products);
        });
    });

    vvic.getUrl(imageFile, url => {
        vvic.getList(url, products => {
            console.log(products);
            save('vvic', imageUrl, url, products);
        });
    });
});
