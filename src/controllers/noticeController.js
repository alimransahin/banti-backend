const Notice = require("../models/Notice");
const cloudinary = require("../config/cloudinary");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

// Get all notices
const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({
      index: 1,
      publishedDate: -1,
      createdAt: -1,
    });

    res.json({
      success: true,
      data: notices,
    });
  } catch (error) {
    console.error("Get Notices Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single notice
const getNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    res.json({
      success: true,
      data: notice,
    });
  } catch (error) {
    console.error("Get Notice Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create notice
const createNotice = async (req, res) => {
  try {
    const { title, publishedDate, details, index, isActive } = req.body;

    const attachments = [];
    const attachmentPublicIds = [];

    // Upload multiple images
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(
          file.buffer,
          "bantiihs/notices",
        );

        attachments.push(result.url);
        attachmentPublicIds.push(result.publicId);
      }
    }

    const notice = await Notice.create({
      title,
      publishedDate,
      details,
      attachment: attachments,
      attachmentPublicIds,
      index: index || 0,
      isActive:
        isActive === undefined
          ? true
          : isActive === "true" || isActive === true,
    });

    // Generate frontend URL
    notice.href = `/notices/${notice._id}`;

    await notice.save();

    res.status(201).json({
      success: true,
      message: "Notice created successfully",
      data: notice,
    });
  } catch (error) {
    console.error("Create Notice Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create notice",
    });
  }
};

// Update notice
const updateNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    const { title, publishedDate, details, index, isActive } = req.body;

    notice.title = title ?? notice.title;

    notice.publishedDate = publishedDate ?? notice.publishedDate;

    notice.details = details ?? notice.details;

    notice.index = index ?? notice.index;

    if (isActive !== undefined) {
      notice.isActive = isActive === "true" || isActive === true;
    }

    // New attachments
    if (req.files && req.files.length > 0) {
      // Delete old images from Cloudinary
      if (notice.attachmentPublicIds && notice.attachmentPublicIds.length > 0) {
        for (const publicId of notice.attachmentPublicIds) {
          await cloudinary.uploader.destroy(publicId);
        }
      }

      const attachments = [];
      const attachmentPublicIds = [];

      // Upload new images
      for (const file of req.files) {
        const result = await uploadToCloudinary(
          file.buffer,
          "bantiihs/notices",
        );

        attachments.push(result.url);
        attachmentPublicIds.push(result.publicId);
      }

      notice.attachment = attachments;
      notice.attachmentPublicIds = attachmentPublicIds;
    }

    notice.href = `/notices/${notice._id}`;

    await notice.save();

    res.json({
      success: true,
      message: "Notice updated successfully",
      data: notice,
    });
  } catch (error) {
    console.error("Update Notice Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update notice",
    });
  }
};

// Delete notice
const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    // Delete Cloudinary images
    if (notice.attachmentPublicIds && notice.attachmentPublicIds.length > 0) {
      for (const publicId of notice.attachmentPublicIds) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    // Delete MongoDB document
    await Notice.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Notice deleted successfully",
    });
  } catch (error) {
    console.error("Delete Notice Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getNotices,
  getNotice,
  createNotice,
  updateNotice,
  deleteNotice,
};
