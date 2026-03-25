const fs = require('fs');
const path = require('path');

function getUserFolder(name) {
  const parts = name.toLowerCase().split(' ').slice(0, 2);
  return parts.join('-');
}

function findMediaFiles(userName) {
  const basePath = `/home/rafael/clone/${getUserFolder(userName)}`;

  if (!fs.existsSync(basePath)) {
    throw new Error('folder_not_found');
  }

  const files = fs.readdirSync(basePath);

  let video = null;
  let audio = null;

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();

    if (!video && (ext === '.mp4' || ext === '.mov')) {
      video = path.join(basePath, file);
    }

    if (!audio && (ext === '.mp3' || ext === '.m4a')) {
      audio = path.join(basePath, file);
    }
  }

  return { video, audio };
}

module.exports = { findMediaFiles };