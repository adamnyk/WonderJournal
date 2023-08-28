const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const fs = require("fs");
const s3Client = new S3Client({});

const bucketName = "wonder-journal";
const fileName = "screenshot2.png";
const fileData = fs.readFileSync(fileName);

s3Client.send(
	new PutObjectCommand({
		Bucket: bucketName,
		Body: fileData,
		Key: fileName,
	})
),
	(err, data) => {
		if (err) {
			console.error(err);
		} else {
			console.log(`File uploaded successfully. ${data.Location}`);
		}
	};
