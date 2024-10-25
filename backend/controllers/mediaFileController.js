// controllers/mediaFileController.js
const { MediaFile, Course, Class } = require('../config/db').models;

// Create a new media file
exports.createMediaFile = async (req, res) => {
    const { file_type, file_path, course_id, class_id } = req.body;

    try {
        if (course_id) {
            const course = await Course.findByPk(course_id);
            if (!course) {
                return res.status(404).json({ error: 'Course not found' });
            }
        }

        if (class_id) {
            const classObj = await Class.findByPk(class_id);
            if (!classObj) {
                return res.status(404).json({ error: 'Class not found' });
            }
        }

        const mediaFile = await MediaFile.create({
            file_type,
            file_path,
            course_id,
            class_id
        });

        res.status(201).json(mediaFile);
    } catch (error) {
        res.status(400).json({ error: 'Error creating media file' });
    }
};

// Get all media files
exports.getAllMediaFiles = async (req, res) => {
    try {
        const mediaFiles = await MediaFile.findAll({
            include: [
                { model: Course, as: 'course', attributes: ['id', 'title'] },
                { model: Class, as: 'class', attributes: ['id', 'title'] }
            ]
        });
        res.json(mediaFiles);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching media files' });
    }
};

// Get a media file by ID
exports.getMediaFileById = async (req, res) => {
    const { id } = req.params;

    try {
        const mediaFile = await MediaFile.findByPk(id, {
            include: [
                { model: Course, as: 'course', attributes: ['id', 'title'] },
                { model: Class, as: 'class', attributes: ['id', 'title'] }
            ]
        });

        if (!mediaFile) {
            return res.status(404).json({ error: 'Media file not found' });
        }

        res.json(mediaFile);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching media file' });
    }
};

// Update a media file
exports.updateMediaFile = async (req, res) => {
    const { id } = req.params;
    const { file_type, file_path, course_id, class_id } = req.body;

    try {
        const mediaFile = await MediaFile.findByPk(id);
        if (!mediaFile) {
            return res.status(404).json({ error: 'Media file not found' });
        }

        if (course_id) {
            const course = await Course.findByPk(course_id);
            if (!course) {
                return res.status(404).json({ error: 'Course not found' });
            }
            mediaFile.course_id = course_id;
        }

        if (class_id) {
            const classObj = await Class.findByPk(class_id);
            if (!classObj) {
                return res.status(404).json({ error: 'Class not found' });
            }
            mediaFile.class_id = class_id;
        }

        mediaFile.file_type = file_type || mediaFile.file_type;
        mediaFile.file_path = file_path || mediaFile.file_path;

        await mediaFile.save();

        res.json(mediaFile);
    } catch (error) {
        res.status(400).json({ error: 'Error updating media file' });
    }
};

// Delete a media file
exports.deleteMediaFile = async (req, res) => {
    const { id } = req.params;

    try {
        const mediaFile = await MediaFile.findByPk(id);
        if (!mediaFile) {
            return res.status(404).json({ error: 'Media file not found' });
        }

        await mediaFile.destroy();
        res.json({ message: 'Media file deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting media file' });
    }
};
