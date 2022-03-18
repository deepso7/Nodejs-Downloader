import express from "express";
import helmet from "helmet";
import archiver from "archiver";

import client from "./utils/WebTorrent";

const app = express();

app.use(helmet());
app.use(express.json());

app.get("/torrent", (req, res) => {
  const magnetURI = req.query.magnetURI;
  // if (!magnetURI && typeof magnetURI === "string")
  //   return res.status(400).json({ error: "Missing magnetURI" });

  const archive = archiver.create("zip");
  archive.pipe(res);

  client.add(magnetURI as string, (torrent) => {
    torrent.files.forEach((file) => {
      const reader = file.createReadStream();

      console.log("Appendiing file");
      archive.append(reader as any, { name: file.name });

      reader.on("error", (err) => {
        console.log(`${file.name} errored`, { err });
      });
    });
  });

  archive.finalize();

  archive.on("error", (err) => {
    console.log("zipping", { err });
  });
  archive.on("close", () => {
    console.log("Zipping closed");
    res.status(200).json({ message: "Zipped" });
  });
});

export default app;
