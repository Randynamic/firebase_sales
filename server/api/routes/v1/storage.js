const express = require("express");
const api_routes = express.Router();
const { Storage } = require("@google-cloud/storage");
const utils = require("../../utils");
const fs = require("fs");
const multer = require("multer");
const upload = multer();

const storage = new Storage({
  projectId: process.env.PROJECT_ID,
  keyFilename: utils.dir("./config/key.txt")
});

const getType = type => {
  return type === "application/x-www-form-urlencoded;charset=UTF-8" ? "directory" : type;
};

const unlinkFile = path => {
  setTimeout(() => fs.unlinkSync(path), 10000);
};

api_routes.get(
  "/",
  utils.wrap(async (req, res) =>
    res.json({
      ok: true,
      scopes: [...storage.authClient.scopes]
    })
  )
);

api_routes.get(
  "/getFiles/:prefix?/:bucketName?",
  utils.wrap(async (req, res) => {
    let bucketName = req.params.bucketName || process.env.DEFAULT_BUCKET;
    const prefix = req.params.prefix || "";
    const bucket = storage.bucket(bucketName);
    const [files] = await bucket.getFiles({ prefix });
    const filesToResponse = [];
    files.forEach(file => {
      const { metadata, name } = file;
      filesToResponse.push({
        id: metadata.id,
        type: getType(metadata.contentType),
        size: metadata.size,
        metadata: {
          bucket: metadata.bucket,
          dates: {
            updated: metadata.updated,
            createdAt: metadata.timeCreated
          }
        },
        name
      });
    });
    return res.json({
      ok: true,
      data: { objects: filesToResponse }
    });
  })
);

api_routes.get(
  "/getFile/:id/:download?",
  utils.wrap(async (req, res) => {
    const bucketName = process.env.DEFAULT_BUCKET;
    let fileName = req.params.id;
    const bucket = storage.bucket(bucketName);
    const file = await bucket.file(fileName);
    await file.getMetadata();
    const path = utils.dir(`./tmp/${file.name.split("/").pop()}`);

    if (req.params.download === "download") {
      if (fs.existsSync(path)) {
        return res.sendFile(path);
      }
      await file.download({ destination: path });
      unlinkFile(path);
      return res.sendFile(path);
    }
    res.json({ ...file });
  })
);

api_routes.post(
  "/upload",
  upload.fields([
    {
      name: "imageFile",
      maxCount: 3
    }
  ]),
  utils.wrap(async (req, res) => {
    const bucketName = process.env.DEFAULT_BUCKET;
    const bucket = storage.bucket(bucketName);
    let metaData = { ...req.body };
    const uploadedFiles = req.files.imageFile;
    let errors = [];
    let apiResponses = [];
    let path = req.body.path;
    const lastCharPath = path.split("").pop();
    let currentPosition = 0;
    const finalizeRequest = (files, errors, responses, res) => {
      if (currentPosition === uploadedFiles.length - 1) {
        if (errors.length > 0) {
          return res.status(500).json({ errors });
        }
        return res.json({ responses, errors });
      }
      currentPosition++;
    };

    if (lastCharPath === "/") {
      path = path.substr(0, path.length - 1);
    }

    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(404).json({ error: "no files" });
    }

    uploadedFiles.map((uploadedFile, index) => {
      const file = bucket.file(`${path}/${uploadedFile.originalname}`);
      const content = uploadedFile.buffer.toString("utf-8");
      file
        .save(content)
        .then(async err => {
          if (err.length > 0) return res.json(err);
          await file
            .setMetadata({
              contentType: uploadedFile.mimetype,
              metadata: {
                ...metaData,
                owner: "USER_UID"
              }
            })
            .then((response, metaDataError) => {
              if (metaDataError && response.length === 0) {
                return errors.push({ file: index, type: "metaDataError", ...metaDataError });
              }
              apiResponses.push(response[0]);
              return finalizeRequest(uploadedFiles, errors, apiResponses, res);
            })
            .catch(metaDataError => {
              errors.push({ file: index, type: "metaDataError", ...metaDataError });
              finalizeRequest(uploadedFiles, errors, apiResponses, res);
            });
        })
        .catch(saveError => {
          errors.push({ file: index, type: "saveError", ...saveError });
          finalizeRequest(uploadedFiles, errors, apiResponses, res);
        });
    });
  })
);

api_routes.delete(
  "/getFile/:id",
  utils.wrap(async (req, res) => {
    const bucketName = process.env.DEFAULT_BUCKET;
    let fileName = req.params.id;
    const bucket = storage.bucket(bucketName);
    const file = await bucket.file(fileName);

    if (file) {
      return file.delete().then(data => {
        res.status(410).json({ ...data[0] });
      });
    }
    res.status(404).json({ fileName, file });
  })
);

module.exports = api_routes;
