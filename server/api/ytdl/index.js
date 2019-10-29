const router = require('express').Router();
const ytdl = require('ytdl-core');
const { video } = require('../../db/models');
const fs = require('fs');
const path = require('path');
const filter = require('../../util-funcs');

router.post('/', async (req, res, next) => {
  const url = req.body.url;
  const info = await ytdl.getInfo(url);

  const { author, description, title, length_seconds, player_response } = info;
  const fileName = filter.fileName(title);
  const video_thumbnail =
    player_response.videoDetails.thumbnail.thumbnails[2].url;
    console.log(fileName);


  try {
    ytdl(url).pipe(
      fs.createWriteStream(
        path.join(
          __dirname,
          '..',
          '..',
          '..',
          'public',
          'videos',
          `${fileName}.mp4`
        )
      )
    );
  } catch (err) {
    console.log(err);
  }

  video.writeVideo(
    title,
    null,
    fileName,
    length_seconds,
    author.name,
    description,
    video_thumbnail
  );

  res.json({
    video_title: title,
    video_length: length_seconds,
    video_author: author.name,
    video_des: description,
    video_ref: fileName,
    video_thumbnail
  });
});

module.exports = router;
