const cloudinary = require('cloudinary').v2;

const {
	CLOUDINARY_API_KEY,
	CLOUDINARY_API_SECRET,
	CLOUDINARY_URL,
	CLOUDINARY_NAME
} = process.env;

cloudinary.config({
	cloud_name: CLOUDINARY_NAME,
	api_key: CLOUDINARY_API_KEY,
	api_secret: CLOUDINARY_API_SECRET
});

const uploadImage = ({ picture, folder, callBack }) => {
	return new Promise((resolve, reject) => {
		cloudinary.uploader.upload(picture.path, { folder }, (error, result) => {
			if (error) reject(error);
			else resolve(result);
		});
	});
};

const deleteImage = ({ picture_id }) => {
	return new Promise((resolve, reject) => {
		cloudinary.uploader.destroy(picture_id, (error, result) => {
			if (error) reject(error);
			else resolve(result);
		});
	});
};

module.exports = {
	deleteImage,
	uploadImage
};
