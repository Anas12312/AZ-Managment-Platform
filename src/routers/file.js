const express = require('express')
const upload = require('../utils/upload')
const download = require('../utils/download')

const router = new express.Router()

router.post('/upload', upload)
router.get('/file/:name', download)
module.exports = router