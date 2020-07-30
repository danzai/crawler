const puppeteer = require('puppeteer');

let cookieString = '__wpkreporterwid_=60a601df-9da6-4be1-ae93-6203f378f1a6; cna=OaFkF5HrWVoCATspdbsG+C2q; cookie2=1c9f2cc386310c586ea1986ad38bfcbb; t=501c30b8a89cacf9e7df37e5fc94e0b2; _tb_token_=f3b37dea5ede6; cookie1=UUwXMh6YG9PNMZYJ2UKFyr7ZzYf2FgeGhln26D31D0E%3D; cookie17=W8rpNQd3cblN; sg=936; csg=013f5443; lid=a410430209; unb=831332593; uc4=id4=0%40WenjajYzbRHPi%2FdV2irlBYGcO9I%3D&nk4=0%40AM6%2F%2FmWQeexWTdR1dkD77EVwyW%2Ba; __cn_logon__=true; __cn_logon_id__=a410430209; ali_apache_track=c_mid=b2b-831332593a5bf0|c_lid=a410430209|c_ms=1; ali_apache_tracktmp=c_w_signed=Y; _nk_=a410430209; last_mid=b2b-831332593a5bf0; _csrf_token=1594259894778; _is_show_loginId_change_block_=b2b-831332593a5bf0_false; _show_force_unbind_div_=b2b-831332593a5bf0_false; _show_sys_unbind_div_=b2b-831332593a5bf0_false; _show_user_unbind_div_=b2b-831332593a5bf0_false; __rn_alert__=false; alicnweb=touch_tb_at%3D1594259763780%7Cshow_inter_tips%3Dfalse; isg=BMXFOEGGNkJJDhKdxGKy0v2G1Af_gnkUeYmhIMcqbfwLXu3QjNMU5TB8bIKoHpHM; l=eBPao6v7OOuDFuFyBO5ahurza77T5IRfcsPzaNbMiInca6ChNFOVxNQqayEWldtjgtfvbe-yZPH3jdE28ba3Wx9AWMz7Del3PO9FI';

const addCookies = async (page, url) => {
    const cookies = cookieString.split(';').map(pair => {
        pair = pair.trim();
        return {
            url: url,
            name: pair.slice(0, pair.indexOf('=')),
            value: pair.slice(pair.indexOf('=') + 1)
        }
    });

    await Promise.all(cookies.map(pair => {
        return page.setCookie(pair)
    }))
};

const api = {
    /**
     * 获取搜索地址
     * @param imageFile
     * @param callback
     */
    getUrl(imageFile, callback) {
        (async () => {
            const start = new Date().getTime();

            const browser = await puppeteer.launch({
                timeout: 15000,
                headless: true
            });
            const page = await browser.newPage();

            await addCookies(page, 'https://www.1688.com');
            console.log('Set cookie');

            await page.goto('https://www.1688.com');
            console.log('Goto: https://www.1688.com');

            await page.waitFor(1000);

            await addCookies(page, 'https://s.1688.com');
            console.log('Set cookie');

            const input = await page.$('#img-search-upload-box > div > input[type="file"]');
            await input.uploadFile(imageFile);
            console.log(`Set file: ${imageFile}`);

            await page.evaluate(() => document.querySelector('#img-search-btn')
                .addEventListener('click', e => e.preventDefault()));
            await page.click('#img-search-btn');
            console.log('Click upload');

            await page.waitFor(4000);

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

            await addCookies(page, 'https://s.1688.com');
            console.log('Set cookie');

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
                        name: one.querySelector('div > div.desc-container > div:nth-child(1) > a > div').innerHTML,
                        url: one.querySelector('div > div.desc-container > div:nth-child(1) > a').href,
                        price: one.querySelector('div > div.desc-container > div.price-container > div.price').innerHTML
                    });
                });

                return arr;
            }, '#sm-offer-list > div.card-container');

            await browser.close();

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
