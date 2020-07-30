const puppeteer = require('puppeteer');

const api = {
    /**
     * 获取搜索地址
     * @param imageFile
     * @param callback
     */
    getUrl(imageFile, callback) {
        console.log(`Get vvic search url: ${imageFile}`);

        (async () => {
            const start = new Date().getTime();

            const browser = await puppeteer.launch({
                timeout: 15000,
                headless: true
            });
            const page = await browser.newPage();

            await page.goto('https://www.vvic.com/gz');
            console.log('Goto https://www.vvic.com/gz');

            const input = await page.$('#up-content > div > input[type="file"]');
            await input.uploadFile(imageFile);
            console.log(`Set file: ${imageFile}`);

            await page.waitFor(3000);

            const url = page.url();

            await browser.close();

            console.log(`上传总耗时：${((new Date().getTime() - start) / 1000).toFixed(2)}s`);

            console.log(`Get info: url = ${url}`);

            callback(url);
        })();
    },
    /**
     * 获取列表信息
     * @param searchUrl
     * @param callback
     */
    getList(searchUrl, callback) {
        (async () => {
            const start = new Date().getTime();

            const browser = await puppeteer.launch({
                timeout: 15000,
                headless: true
            });
            const page = await browser.newPage();

            await page.goto(searchUrl);
            console.log(`Goto: ${searchUrl}`);

            let preScrollHeight = 0,
                scrollHeight = -1;
            while (preScrollHeight !== scrollHeight) {
                preScrollHeight = await page.evaluate(() => {
                    const height = document.body.scrollHeight;
                    window.scrollTo(0, height);
                    return height;
                });

                await page.waitFor(1300);

                scrollHeight = await page.evaluate(async () => {
                    return document.body.scrollHeight;
                });

                preScrollHeight = preScrollHeight > scrollHeight ? scrollHeight : preScrollHeight;
            }
            console.log('Scroll to bottom');

            const products = await page.evaluate(sel => {
                const arr = [];

                document.querySelectorAll(sel).forEach(one => {
                    arr.push({
                        name: one.querySelector('div.desc > div.title > a').innerHTML,
                        url: one.querySelector('div.desc > div.title > a').href,
                        price: one.querySelector('div.desc > div.info > div.fl.price').innerHTML
                            .replace('<span class="yuan">¥</span>', '').replace(/\n|\s/g, '')
                    });
                });

                return arr;
            }, '#sameListOrigin > li > div.item');

            browser.close();

            console.log(`抓取总耗时：${((new Date().getTime() - start) / 1000).toFixed(2)}s`);

            callback(products.sort((a, b) => {
                const x = parseFloat(a.price),
                    y = parseFloat(b.price);

                if (x < y) {
                    return -1;
                } else if (x > y) {
                    return 1;
                } else {
                    return 0;
                }
            }));
        })();
    }
};

module.exports = api;
