/**
 * MediaFile Model Definition
 * 
 * Handles images, documents, or video metadata associated with courses or classes.
 * 
 * @param {Sequelize} sequelize - The Sequelize instance.
 * @returns {Model} - The MediaFile model.
 */
module.exports = (sequelize) => {
    const { DataTypes } = require('sequelize');

    const MediaFile = sequelize.define('MediaFile', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        file_type: {
            type: DataTypes.STRING(10),
            allowNull: false,
            validate: {
                isIn: [['pdf', 'image', 'video']],
            },
        },
        file_path: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        uploaded_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'media_files',
        timestamps: false,
    });

    MediaFile.associate = (models) => {
        MediaFile.belongsTo(models.Course, {
            foreignKey: 'course_id',
            as: 'course',
        });

        MediaFile.belongsTo(models.Class, {
            foreignKey: 'class_id',
            as: 'class',
        });
    };

    return MediaFile;
};
