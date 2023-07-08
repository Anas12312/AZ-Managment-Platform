const uploadFile = require("../middleware/upload");
const upload = async (req, res) => {
  try {
    await uploadFile(req, res);
    if (req.file == undefined) {
      return res.status(400).send({ message: "Upload a file please!" });
    }
    res.status(200).send({
      message: "/file/" + req.id,
    });
  } catch (err) {
    res.status(500).send({
      message: `Unable to upload the file:. ${err}`,
    });
  }
};

module.exports = upload;