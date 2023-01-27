const urlModel = require("../model/urlModel")
const shortid = require('shortid');
const axios = require("axios")
const isValid = require("../validator/validation")
const redis = require("redis")
const { promisify } = require("util")

const redisClient = redis.createClient(
    11768,
    "redis-11768.c264.ap-south-1-1.ec2.cloud.redislabs.com",
    { no_ready_check: true }
);
redisClient.auth("TPkFHDwHnkiJb7sZx8iDpbGRKqRB8d29", function (err) {
    if (err) throw err;
});

redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
});

const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);
const SETEX_ASYNC = promisify(redisClient.SETEX).bind(redisClient);

const urlCreate = async function (req, res) {
    try {
        let data = req.body;
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "No data in body" });
        if (Object.keys(data).length > 1) return res.status(400).send({ status: false, message: "Only one data can send from body" })
        if (Object.keys(data) != "longUrl") return res.status(400).send({ status: false, message: "longUrl is required" });

        data.longUrl = data.longUrl.trim()
        if (Object.values(data.longUrl) == "") return res.status(400).send({ status: false, message: "No values provided" })

        let cachedLongUrlData = await GET_ASYNC(`${data.longUrl}`)
        if (cachedLongUrlData) return res.status(200).send(JSON.parse(cachedLongUrlData))

        let validUrl = false;
        await axios(data.longUrl)
          .then((res) => {
            if (res.status == 201 || res.status == 200) validUrl = true;
          })
          .catch((err) => {});
        if (validUrl === false || !isValid.isValidLink(data.longUrl)) return res.status(400).send({ status: false, message: "Please provide valid longUrl" })
       
        let presentInDataBase = await urlModel.findOne({ longUrl: data.longUrl }).select({ _id: 0, __v: 0 });
        if (presentInDataBase !== null) {
            await SETEX_ASYNC(`${data.longUrl}`, 86400, JSON.stringify(presentInDataBase))  // before implementing these redis code the document we created for putting that document into cache we are using this line
            return res.status(200).send({ message: "shortUrl is Already Generated", data: presentInDataBase });
        }
        let baseUrl = "http://localhost:3000/";
        let urlCode = shortid.generate();
        urlCode = urlCode.toLowerCase();
        var shortUrl = baseUrl.concat(urlCode);

        let newData = { urlCode: urlCode, longUrl: data.longUrl, shortUrl: shortUrl };
        await urlModel.create(newData);
        await SETEX_ASYNC(`${data.longUrl}`, 86400, JSON.stringify(newData))
        res.status(201).send({ data: newData });
    }
    catch (error) { res.status(500).send({ error: error.message }); }
}

const urlGet = async function (req, res) {
    try {
        let data = req.params.urlCode;
        if (!shortid.isValid(data)) return res.status(400).send({ status: false, msg: "Not valid urlCode" })
        let cachedLongUrlData = await GET_ASYNC(`${data}`)
        if (cachedLongUrlData) {
            let value = cachedLongUrlData.replace(/"/g, '');
            return res.status(302).redirect(value)
        }
        let ans = await urlModel.findOne({ urlCode: data });
        if (ans === null) return res.status(404).send({ status: false, msg: "not found with given data" })
        await SETEX_ASYNC(`${data}`, 86400, JSON.stringify(ans.longUrl))
        res.status(302).redirect(ans.longUrl)
    }
    catch (err) { res.status(500).send({ status: false, err: err.message }) }
}

module.exports = { urlCreate, urlGet }; 