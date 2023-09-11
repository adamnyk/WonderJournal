const AWS = require("aws-sdk");
const fs = require("fs");
// Create S3 service object
const s3 = new AWS.S3();

const bucketName = "wonder-journal";

function uploadFile(username, momentId, fileName) {
	const fileData = fs.createReadStream(fileName);
	fileData.on("error", (err) => {
		console.log("File Error", err);
	});

	const uploadParams = {
		Bucket: bucketName,
		Key: `${username}/${momentId}/${fileName}`,
		Body: fileData,
	};

	// S3 ManagedUpload with callbacks are not supported in AWS SDK for JavaScript (v3).
    // Please convert to 'await client.upload(params, options).promise()', and re-run aws-sdk-js-codemod.
    s3.upload(uploadParams, (err, data) => {
		if (err) {
			console.log("Error", err);
		}
		if (data) {
			console.log("Upload Success", data.Location);
			return data.Location;
		}
	});
}

function deleteFile(fileUrl) {
	console.log(AWS.VERSION);

	const filePrefix = "https://wonder-journal.s3.amazonaws.com/";
	const objectKey = fileUrl.replace(filePrefix, "");

	s3.deleteObject(
		{
			Bucket: bucketName,
			Key: objectKey,
		},
		(err, data) => {
			if (err) {
				console.log(err);
			} else {
				console.log("Object deleted successfully");
			}
		}
	);
}

// uploadFile("adamnyk", 1, "screenshot2.png");
deleteFile("https://wonder-journal.s3.amazonaws.com/adamnyk/1/screenshot2.png");

module.exports = { uploadFile };
