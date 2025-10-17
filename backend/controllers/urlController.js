import url from "../models/url.js";
import shortid from "shortid";
import redisClient from "../config/redisClient.js";

export const shorternUrl = async (req, res) => {
  try {
    const { longUrl } = req.body;
    const cachedCode = await redisClient.get(longUrl);
    if (cachedCode) {
      const fullUrl = `${process.env.BASE_URL}/${cachedCode}`;
      return res.json({ shortUrl: fullUrl, cached: true });
    }
    let urlEntry = await url.findOne({ longUrl });
    if (!urlEntry) {
      const generatedCode = shortid.generate();
      urlEntry = await url.create({
        longUrl,
        shortUrl: generatedCode,
      });
    }
    await redisClient.set(longUrl, urlEntry.shortUrl, { EX: 3600 });
    await redisClient.set(urlEntry.shortUrl, longUrl, { EX: 3600 });

    const fullShortUrl = `${process.env.BASE_URL}/${urlEntry.shortUrl}`;
    return res.json({ shortUrl: fullShortUrl, cached: false });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong." });
  }
};

export const redirectUrl = async (req, res) => {
  try {
    const { code } = req.params;
    const cachedLongUrl = await redisClient.get(code);
    if (cachedLongUrl) return res.redirect(cachedLongUrl);
    const urlEntry = await url.findOne({ shortUrl: code });
    if (!urlEntry) return res.status(404).json({ message: "URL not found" });
    await redisClient.set(code, urlEntry.longUrl, { EX: 3600 });
    await redisClient.set(urlEntry.longUrl, code, { EX: 3600 });
    urlEntry.clicks++;
    await urlEntry.save();
    res.redirect(urlEntry.longUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
};