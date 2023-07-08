const express = require('express')
const upload = require('../utils/upload')
const download = require('../utils/download')
const AWS = require('aws-sdk')
const multer = require('multer')
const { readFileSync } = require('fs')

const router = new express.Router()

router.post('/upload', async (req, res) => {
    try {

        const img = await fetch('https://post.healthline.com/wp-content/uploads/2020/09/tomatoes-1200x628-facebook-1200x628.jpg')
        
        const image = Buffer.from(await img.arrayBuffer());

        const aws = new AWS.S3({
            accessKeyId: 'zizo.zoom.z0@gmail.com',
            secretAccessKey: '6gKgndZyybeFqUVv5m4zgmWrA110BKThIY62T2JQJ5sGZuTJ',
            endpoint:'s3.sirv.com'
        })

        const res = await aws.upload({
            Bucket: 'nopheate',
            Key: 'aaa',
            Body: image
        }).promise();

        console.log(res);

        res.send()

    } catch (e) {
        console.log(e);
        res.send('a7a')
    }
})

router.get('/file/:name', download)
module.exports = router