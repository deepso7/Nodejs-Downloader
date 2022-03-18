import WebTorrent from "webtorrent";
import fs from "fs";

const client = new WebTorrent();

const magnetURI =
  "magnet:?xt=urn:btih:22f14379f00a51d0adf32db2569caf0d154e9bcd&dn=The.Adam.Project.2022.1080p.NF.WEBRip.DDP5.1.Atmos.x264-TEPES&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2880&tr=udp%3A%2F%2F9.rarbg.to%3A2790&tr=udp%3A%2F%2Ftracker.tallpenguin.org%3A15760&tr=udp%3A%2F%2Ftracker.thinelephant.org%3A12780";

client.add(magnetURI, (torrent) => {
  console.log("Client is downloading:", { torrent });

  torrent.files.forEach((file) => {
    console.log("File:", { file });

    const reader = file.createReadStream();
    reader.pipe(fs.createWriteStream(file.name));

    reader.on("end", () => {
      console.log("File has been read");
    });

    reader.on("error", (err) => {
      console.log("Error reading file", { err });

      client.destroy(() => {
        console.log("Client destroyed");
      });
    });
  });
});
