const urlModel = require("../model/urlModel")
const shortid = require('shortid');
const isValid = require("../validator/validation")


const urlCreate = async function (req, res) {

    try {
        let data = req.body;
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "No data in body" });
        if (!data.longUrl) return res.status(400).send({ status: false, message: "longUrl is required" });
        let dummyUrl = data.longUrl;
        dummyUrl = data.longUrl = dummyUrl.trim()
        if (!isValid.isValidLink(data.longUrl)) return res.status(400).send({ status: false, message: "longUrl is not valid" });
        let presentInDataBase = await urlModel.findOne({ longUrl: data.longUrl });
        console.log(presentInDataBase)
        if (presentInDataBase != null) return res.status(200).send({ msg: "shortUrl is Already Generated", data: presentInDataBase });
        let baseUrl = "https://localhost:3000/";
        let urlCode = shortid.generate();
        var shortUrl = baseUrl.concat(urlCode);
        let newData = {
            longUrl: data.longUrl,
            shortUrl: shortUrl,
            urlCode: urlCode
        };
        let finalData = await urlModel.create(newData);
        res.status(201).send({ data: finalData });

        req.urlCode=urlCode;
        console.log(req.urlCode)
    }
    
    catch (error) { res.status(500).send({ error: error.message }); }
}

const urlGet = async function (req, res) {
    try {
        console.log(req.urlCode)

        let data = req.params.urlCode;
        if (data.length !== 9) return res.status(400).send({ status: false, msg: "Not valid" })
        let ans = await urlModel.findOne({ urlCode: data });
        if (ans === null) return res.status(404).send({ status: false, msg: "not found with given data" })
        res.status(302).send(`found.Redirecting to ${ans.longUrl}`)
    }
    catch (err) { res.status(500).send({ status: false, err: err.message }) }
}






module.exports.urlCreate = urlCreate;
module.exports.urlGet = urlGet;