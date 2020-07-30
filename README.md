# crawler-test

## 1、整体介绍
* 基于NodeJS开发的爬虫工具


## 2、crawl-comment
### 2.1、简介
* 抓取B站视频弹幕，用于后续的自然语言分析

### 2.2、技术
* ibili：解析弹幕

### 2.3、运行
* 进入项目目录
```bash
cd crawl-comment
```
* 修改【**comment.js**】文件中的视频地址：**url**
* 执行脚本
```bash
node comment.js
```


## 3、search-image
### 3.1、简介
* 根据服装图片，进行淘宝、搜款网的商品比价
* 原理：调用淘宝、搜款网图片搜索接口后，抓取商品信息

### 3.2、技术
* puppeteer：基于Chrome的爬虫框架

### 3.3、运行
* 进入项目目录
```bash
cd search-image
```
* 修改【**searchByImage.js**】文件中的图片地址：**imageUrl**
* 执行脚本
```bash
node searchByImage.js
```
