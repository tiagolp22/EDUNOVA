const { MediaFile, Course } = require('../config/db').models;
const { uploadToCDN, getSignedUrl } = require('../services/mediaService');
const redisClient = require('../services/redisClient');

/**
 * Create a new media file - Only accessible by teachers and admins
 */
exports.createMediaFile = async (req, res) => {
    if (req.user.privilege_id !== 'teacher' && req.user.privilege_id !== 'admin') {
        return res.status(403).json({ error: 'Insufficient privileges' });
    }

    const { course_id } = req.body;

    try {
        const filePath = await uploadToCDN(req.file);
        const mediaFile = await MediaFile.create({ file_path: filePath, course_id });

        // Clear media files cache after adding a new file
        await redisClient.del('all_media_files');
        res.status(201).json(mediaFile);
    } catch (error) {
        res.status(500).json({ error: 'Error uploading media file' });
    }
};

/**
 * Retrieve all media files with caching - Accessible by all users
 */
exports.getAllMediaFiles = async (req, res) => {
    const cacheKey = 'all_media_files';

    try {
        const cachedMediaFiles = await redisClient.get(cacheKey);
        if (cachedMediaFiles) return res.json(JSON.parse(cachedMediaFiles));

        const mediaFiles = await MediaFile.findAll();
        await redisClient.set(cacheKey, JSON.stringify(mediaFiles), 'EX', 3600); // Cache for 1 hour
        res.json(mediaFiles);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching media files' });
    }
};

/**
 * Retrieve a specific media file with a signed URL - Accessible by all users
 */
exports.getMediaFileById = async (req, res) => {
    const { id } = req.params;

    try {
        const mediaFile = await MediaFile.findByPk(id);
        if (!mediaFile) return res.status(404).json({ error: 'Media file not found' });

        const signedUrl = await getSignedUrl(mediaFile.file_path);
        res.json({ mediaFile, signedUrl });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching media file' });
    }
};

/**
 * Update a media file - Only accessible by teachers and admins
 */
exports.updateMediaFile = async (req, res) => {
    if (req.user.privilege_id !== 'teacher' && req.user.privilege_id !== 'admin') {
        return res.status(403).json({ error: 'Insufficient privileges' });
    }

    const { id } = req.params;
    const { course_id } = req.body;

    try {
        const mediaFile = await MediaFile.findByPk(id);
        if (!mediaFile) return res.status(404).json({ error: 'Media file not found' });

        mediaFile.course_id = course_id || mediaFile.course_id;
        await mediaFile.save();

        // Clear media files cache after updating a file
        await redisClient.del('all_media_files');
        res.json(mediaFile);
    } catch (error) {
        res.status(500).json({ error: 'Error updating media file' });
    }
};

/**
 * Delete a media file - Only accessible by teachers and admins
 */
exports.deleteMediaFile = async (req, res) => {
    if (req.user.privilege_id !== 'teacher' && req.user.privilege_id !== 'admin') {
        return res.status(403).json({ error: 'Insufficient privileges' });
    }

    const { id } = req.params;

    try {
        const mediaFile = await MediaFile.findByPk(id);
        if (!mediaFile) return res.status(404).json({ error: 'Media file not found' });

        await mediaFile.destroy();

        // Clear media files cache after deleting a file
        await redisClient.del('all_media_files');
        res.json({ message: 'Media file deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting media file' });
    }
};
