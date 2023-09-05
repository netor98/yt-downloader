const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const fs = require("fs"); //File system module
const ytdl = require("ytdl-core"); //youtube downloader module

app.listen(3000, () => {
    console.log("Running on port " + 3000);
});

app.use(express.static(`${__dirname}`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.post("/url", (req, res) => {
    downloadVideo(req.body.url, res);
    /*
    res.status(200).json({
        ok: "asdasda",
        nosaleUrl: "ola",
    });
    */
});

/* metainfo: a type of data whose purpose is to provide information concerning
 other data in order to facilitate their management and understanding */

async function downloadVideo(url, res) {
    try {
        console.log(url);
        const videoInfo = await ytdl.getInfo(url); //get the metainfo of the video
        const videoTitle = videoInfo.videoDetails.title; //title of the video

        const videoFormat = ytdl.chooseFormat(videoInfo.formats, {
            quality: "highest",
        }); //we select the quality for the video

        const videoReadableStream = ytdl(url, { format: videoFormat });

        const outputFilePath = `${videoTitle}.mp4`; //Name of the file(title of the video)
        const videoWriteStream = fs.createWriteStream(outputFilePath); //

        videoReadableStream.pipe(videoWriteStream);

        videoWriteStream.on("finish", () => {
            console.log("el ortega se la kome");
            res.sendFile(`${__dirname}/${outputFilePath}`);
        });

        videoWriteStream.on("error", (err) => {
            console.error("Error writing video to file:", err);
        });
    } catch (error) {
        console.error("Error downloading video:", error);
    }
}
