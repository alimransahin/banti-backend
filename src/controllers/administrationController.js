const Administration = require("../models/Administration");
const cloudinary = require("../config/cloudinary");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

// Get all administrations
const getAdministrations = async (req, res) => {
  try {
    const administrations = await Administration.find().sort({
      createdAt: 1,
    });

    res.json({
      success: true,
      data: administrations,
    });
  } catch (error) {
    console.error("Get Administration Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single administration
const getAdministration = async (req, res) => {
  try {
    const administration = await Administration.findById(req.params.id);

    if (!administration) {
      return res.status(404).json({
        success: false,
        message: "Administration information not found",
      });
    }

    res.json({
      success: true,
      data: administration,
    });
  } catch (error) {
    console.error("Get Administration Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create administration
const createAdministration = async (req, res) => {
  try {
    const { title } = req.body;

    let file = {
      url: "",
      publicId: "",
      name: "",
    };

    // Upload PDF to Cloudinary
    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        "bantiihs/administration",
        "raw",
      );

      file = {
        url: result.url,
        publicId: result.publicId,
        name: req.file.originalname,
      };
    }

    const administration = await Administration.create({
      title,
      file,
    });

    res.status(201).json({
      success: true,
      message: "Administration information created successfully",
      data: administration,
    });
  } catch (error) {
    console.error("Create Administration Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update administration
const updateAdministration = async (req, res) => {
  try {
    const administration = await Administration.findById(req.params.id);

    if (!administration) {
      return res.status(404).json({
        success: false,
        message: "Administration information not found",
      });
    }

    const { title } = req.body;

    administration.title = title ?? administration.title;

    // Upload new PDF
    if (req.file) {
      // Delete old PDF from Cloudinary
      if (administration.file?.publicId) {
        await cloudinary.uploader.destroy(administration.file.publicId, {
          resource_type: "raw",
        });
      }

      // Upload new PDF
      const result = await uploadToCloudinary(
        req.file.buffer,
        "bantiihs/administration",
        "raw",
      );

      administration.file = {
        url: result.url,
        publicId: result.publicId,
        name: req.file.originalname,
      };
    }

    await administration.save();

    res.json({
      success: true,
      message: "Administration information updated successfully",
      data: administration,
    });
  } catch (error) {
    console.error("Update Administration Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete administration
const deleteAdministration = async (req, res) => {
  try {
    const administration = await Administration.findById(req.params.id);

    if (!administration) {
      return res.status(404).json({
        success: false,
        message: "Administration information not found",
      });
    }

    // Delete PDF from Cloudinary
    if (administration.file?.publicId) {
      await cloudinary.uploader.destroy(administration.file.publicId, {
        resource_type: "raw",
      });
    }

    // Delete from MongoDB
    await Administration.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Administration information deleted successfully",
    });
  } catch (error) {
    console.error("Delete Administration Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAdministrations,
  getAdministration,
  createAdministration,
  updateAdministration,
  deleteAdministration,
};
