const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const fs = require("fs");
const s3Client = new S3Client({});

const BASE_URL = "https://wonder-journal.s3.us-west-2.amazonaws.com";
const bucketName = "wonder-journal";

async function uploadFile(username, momentId, fileName) {
	const awsFilePath = `${BASE_URL}/${username}/${momentId}/${fileName}`;
	const fileData = fs.readFileSync(fileName);
	fileData.on("error", function (err) {
		console.log("File Error", err);
	});

	const uploadParams = {
		Bucket: bucketName,
		Key: `${username}/${momentId}/${fileName}`,
		Body: fileData,
	};
	const command = new PutObjectCommand(uploadParams);
	await s3Client.send(command, (err, data) => {
		if (err) {
			console.error(err);
		} else {
			console.log(`File uploaded successfully. ${awsFilePath}`);
			return awsFilePath
		}
	});
}

module.exports = { createFolder };
