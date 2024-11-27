const BaseController = require('./base/BaseController');
const { MediaFile, Course } = require('../models');
const { uploadToCDN, deleteFromCDN, getSignedUrl } = require('../services/mediaService');
const { validateMediaFile } = require('../validators/mediaFileValidator');

class MediaFileController extends BaseController {
  constructor() {
    super(MediaFile);
  }

  async createMediaFile(req, res) {
    const transaction = await sequelize.transaction();
    try {
      if (!['teacher', 'admin'].includes(req.user.privilege_id)) {
        return res.status(403).json({ error: 'Insufficient privileges' });
      }

      const validation = validateMediaFile(req.file);
      if (!validation.success) {
        return res.status(400).json({ error: validation.errors });
      }

      const filePath = await uploadToCDN(req.file, {
        maxSize: 100 * 1024 * 1024, // 100MB
        allowedTypes: ['image/jpeg', 'image/png', 'video/mp4', 'application/pdf']
      });

      const mediaFile = await MediaFile.create({
        file_path: filePath,
        file_type: req.file.mimetype,
        course_id: req.body.course_id,
        class_id: req.body.class_id,
        uploaded_by: req.user.id
      }, { transaction });

      await transaction.commit();
      return res.status(201).json(this.formatResponse(mediaFile));
    } catch (error) {
      await transaction.rollback();
      return this.handleError(error, res);
    }
  }

  async getMediaFile(req, res) {
    try {
      const { id } = req.params;
      const mediaFile = await MediaFile.findByPk(id);

      if (!mediaFile) {
        return res.status(404).json({ error: 'Media file not found' });
      }

      const signedUrl = await getSignedUrl(mediaFile.file_path, {
        expiresIn: 3600 // 1 hour
      });

      return res.json(this.formatResponse({ ...mediaFile.toJSON(), signedUrl }));
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  async deleteMediaFile(req, res) {
    const transaction = await sequelize.transaction();
    try {
      const { id } = req.params;
      const mediaFile = await MediaFile.findByPk(id);

      if (!mediaFile) {
        return res.status(404).json({ error: 'Media file not found' });
      }

      await deleteFromCDN(mediaFile.file_path);
      await mediaFile.destroy({ transaction });
      
      await transaction.commit();
      return res.json(this.formatResponse(null, 'Media file deleted successfully'));
    } catch (error) {
      await transaction.rollback();
      return this.handleError(error, res);
    }
  }
}

module.exports = new MediaFileController();