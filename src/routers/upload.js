const express = require("express")
const fileUpload = require("express-fileupload")
const path = require("path");

const router = new express.Router();

router.post('/upload', fileUpload({ createParentPath: true }),
            (req,res) => {
                const files = req.files
                console.log(files)
                
                return res.json({status: 'logged', message: 'logged'})
            })

module.exports = router