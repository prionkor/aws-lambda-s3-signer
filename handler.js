"use strict";

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { REGION, BUCKET, EXPIRES = 300 } = process.env;

const clientParams = {
  region: REGION,
};

module.exports.createSignedUrl = async (event) => {
  // const pathParams = event.pathParameters;
  const body = JSON.parse(event.body);
  const client = new S3Client(clientParams);
  const Key = body.key || null;

  if (!Key) {
    throw new Error("Key not defined!");
  }

  const getObjectParams = {
    Bucket: BUCKET,
    Key,
  };
  const command = new GetObjectCommand(getObjectParams);
  const url = await getSignedUrl(client, command, { expiresIn: EXPIRES });
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        url,
      },
      null,
      2
    ),
  };
};
