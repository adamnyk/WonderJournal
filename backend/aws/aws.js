const {
	PutObjectCommand,
	ListObjectsV2Command,
	DeleteObjectCommand,
	DeleteObjectsCommand,
	S3Client,
} = require("@aws-sdk/client-s3");
const fs = require("fs");
const s3Client = new S3Client({});

const BASE_URL = "https://wonder-journal.s3.us-west-2.amazonaws.com";
const bucketName = "wonder-journal";


/**
 * 
 *
 */
async function uploadObject(username, momentId, fileName) {
	const awsUrl = `${BASE_URL}/${username}/${momentId}/${fileName}`;
	const fileData = fs.createReadStream(fileName);
	fileData.on("error", function (err) {
		console.log("File Error", err);
	});

	const params = {
		Bucket: bucketName,
		Key: `${username}/${momentId}/${fileName}`,
		Body: fileData,
	};
	const command = new PutObjectCommand(params);
	await s3Client.send(command, (err, data) => {
		if (err) {
			console.error(err);
		} else {
			console.log(`File uploaded successfully. ${awsUrl}`);
			return awsUrl
		}
	});
}

async function deleteObject(username, momentId, fileName) {
	const key = `${username}/${momentId}/${fileName}`;

	const params = {
		Bucket: bucketName,
		Key: key,
	};
	const command = new DeleteObjectCommand(params);
	s3Client.send(command, (err, data) => {
		if (err) {
			console.error(err);
		} else {
			console.log(data);
			console.log(`Sucessfully deleted ${key}`);
		}
	});
}

async function deleteFolder(username, momentId) {
	const prefix = `${username}/` + (momentId ? `${momentId}/` : "");
	const params = {
		Bucket: bucketName,
		Prefix: prefix,
	};
	const command = new ListObjectsV2Command(params);
	s3Client.send(command, (err, data) => {
		if (err) throw new Error(err);
		if (data.Contents.length == 0) return deleteObject(username, momentId);
		else {
			if (data.IsTruncated) deleteFolder(username, momentId);
			const objects = data.Contents.map((obj) => ({ Key: obj.Key }));
			const deleteParams = {
				Bucket: bucketName,
				Delete: { Objects: objects },
			};

			const deleteCommand = new DeleteObjectsCommand(deleteParams);
			s3Client.send(deleteCommand, (err, data) => {
				if (err) console.error(err);
				else console.log(`Successfully deleted ${prefix}`);
			});
		}
	});
}

module.exports = { uploadObject, deleteObject, deleteFolder };
