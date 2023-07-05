const path = require('path')
const download = (req, res) => {
    const fileName = req.params.name;  // define uploads folder path
    const directoryPath = path.resolve('./uploads') + '/';
    res.download(directoryPath + fileName, fileName, (err) => {
      if (err) {
        console.log(err)
        res.status(500).send({
          message: "There was an issue in downloading the file. " + err,
        });
      }
    });
  };


module.exports = download