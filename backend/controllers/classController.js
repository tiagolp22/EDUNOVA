const { Class, Course } = require("../models");

const classController = {
  /**
   * Fetch all classes with optional course association
   */
  getClasses: async (req, res) => {
    try {
      const classes = await Class.findAll({
        include: {
          model: Course,
          as: "course",
          attributes: ["id", "title"],
        },
      });
      res.status(200).json(classes);
    } catch (error) {
      console.error("Error fetching classes:", error);
      res.status(500).json({ error: "Failed to fetch classes" });
    }
  },

  /**
   * Create a new class
   */
  createClass: async (req, res) => {
    const { title, subtitle, description, video_path, course_id } = req.body;

    try {
      const newClass = await Class.create({
        title,
        subtitle,
        description,
        video_path,
        course_id,
      });
      res.status(201).json(newClass);
    } catch (error) {
      console.error("Error creating class:", error);
      res.status(500).json({ error: "Failed to create class" });
    }
  },

  /**
   * Update a class
   */
  updateClass: async (req, res) => {
    const { id } = req.params;
    const { title, subtitle, description, video_path } = req.body;

    try {
      const classObj = await Class.findByPk(id);
      if (!classObj) return res.status(404).json({ error: "Class not found" });

      await classObj.update({ title, subtitle, description, video_path });
      res.status(200).json(classObj);
    } catch (error) {
      console.error("Error updating class:", error);
      res.status(500).json({ error: "Failed to update class" });
    }
  },

  /**
   * Delete a class
   */
  deleteClass: async (req, res) => {
    const { id } = req.params;

    try {
      const classObj = await Class.findByPk(id);
      if (!classObj) return res.status(404).json({ error: "Class not found" });

      await classObj.destroy();
      res.status(200).json({ message: "Class deleted successfully" });
    } catch (error) {
      console.error("Error deleting class:", error);
      res.status(500).json({ error: "Failed to delete class" });
    }
  },
};

module.exports = classController;
