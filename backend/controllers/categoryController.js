// controllers/categoryController.js

const { Category } = require("../models");

/**
 * Fetch all categories.
 */
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "An error occurred while fetching categories." });
  }
};

/**
 * Create a new category.
 */
exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "An error occurred while creating the category." });
  }
};

/**
 * Delete a category by ID.
 */
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findByPk(id);
    if (!category) return res.status(404).json({ error: "Category not found." });

    await category.destroy();
    res.status(200).json({ message: "Category deleted successfully." });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "An error occurred while deleting the category." });
  }
};
