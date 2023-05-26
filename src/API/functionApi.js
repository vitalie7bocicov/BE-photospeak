const {Storage} = require('@google-cloud/storage');

const projectId = process.env.PROJECT_ID;
const keyFilename = 'myapi-json.json';

const storage = new Storage({
    projectId,
    keyFilename
});
const bucket = storage.bucket(process.env.BUCKET_NAME);

const uploadPhoto = (req, labels) => {
    try {
        if(req.file !== undefined) {
            const blob = bucket.file(req.file.originalname);
            blob.exists(req.file.originalname).then(r => {
                if(r[0]) {
                    const msg = {message: 'Image already present'};
                    return;
                }

                const blobStream = blob.createWriteStream();

                blobStream.on('finish', () => {
                    const stringLabels = labels.join(',');
                    const username = req.body?.username;

                    const body = {
                        filename: req.file.originalname,
                        username: username,
                        labels: stringLabels
                    }
                    
                    fetch('https://us-central1-edik-317621.cloudfunctions.net/sqlInsertion', {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(body)
                    })
                        .then(r => {
                            return r.json();
                        })
                        .then(r => {
                            const msg = { message: 'Sucesfully updated' };

                            console.log(msg);
                            //res.status(200).json(msg);
                        });
                });
                blobStream.on('error', () => {
                    const msg = {message: 'Could not insert file on storage'};
                });
                blobStream.end(req.file.buffer);
            });
        }
    }
    catch(err) {
        const msg = {message: 'Could not insert file on storage'};
    }
};

module.exports = uploadPhoto;