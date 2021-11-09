const multer = require('multer');
const sharp = require('sharp');
const ExpressError = require("../expressError");
const catchAsync = require('./catchAsync');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new ExpressError('Not an image! Please upload only images.', 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadImages = upload.fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 3 }
]);



exports.resizeImages = modelName =>
    catchAsync(async (req, res, next) => {
        if (req.files === undefined) return next();
        if (!req.files.imageCover || !req.files.images) return next();

        // 1) Main image
        req.body.imageCover = `${modelName}-${req.params.id}-${Date.now()}-cover.jpeg`;
        await sharp(req.files.imageCover[0].buffer)
            .resize(700)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`public/images/${modelName}s/${req.body.imageCover}`);

        // 2) Other Images
        req.body.images = [];

        await Promise.all(
            req.files.images.map(async (file, i) => {
                const filename = `${modelName}-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

                await sharp(file.buffer)
                    .resize(2000, 1333)
                    .toFormat('jpeg')
                    .jpeg({ quality: 90 })
                    .toFile(`public/images/${modelName}s/${filename}`);

                req.body.images.push(filename);
            })
        );

        next();
    });