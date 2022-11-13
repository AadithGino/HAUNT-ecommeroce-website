
const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'dhajqatgt', 
  api_key: '552558138819617', 
  api_secret: 'IdvwT1Etv-J7Ntmk5af9qNriEF4'
})

exports.uploads = (file, folder) => {
    return new Promise(resolve => {
        cloudinary.uploader.upload(file, (result) => {
            resolve({
                url: result.url,
                id: result.public_id
            })
        }, {
            resource_type: "auto",
            folder: folder
        })
    })
}