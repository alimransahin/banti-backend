const Committee = require("../models/Committee");
const cloudinary = require("../config/cloudinary");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

const designationOrder = [
  "সভাপতি",
  "শিক্ষক প্রতিনিধি",
  "সংরক্ষিত মহিলা শিক্ষক প্রতিনিধি",
  "অভিভাবক সদস্য",
  "সংরক্ষিত মহিলা অভিভাবক সদস্য",
  "দাতা সদস্য",
  "কো-অপ্ট সদস্য",
  "সদস্য সচিব",
];

// Get all committees
const getCommittees = async (req, res) => {
  try {
    const committees = await Committee.aggregate([
      {
        $addFields: {
          designationOrder: {
            $indexOfArray: [designationOrder, "$designation"],
          },
        },
      },
      {
        $sort: {
          designationOrder: 1,
          createdAt: -1,
        },
      },
      {
        $project: {
          designationOrder: 0,
        },
      },
    ]);

    res.json({
      success: true,
      data: committees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Get single committee
const getCommittee = async (req, res) => {
  try {
    const committee = await Committee.findById(req.params.id);

    if (!committee) {
      return res.status(404).json({
        success: false,
        message: "Committee not found",
      });
    }

    res.json({
      success: true,
      data: committee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create committee
const createCommittee = async (req, res) => {
  try {
    const { name, designation, phone, email, index } = req.body;

    let photo = "";
    let photoPublicId = "";

    // Upload photo to Cloudinary
    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        "bantiihs/committees",
      );

      photo = result.url;
      photoPublicId = result.publicId;
    }

    const committee = await Committee.create({
      name,
      designation,
      phone,
      email,
      index,
      photo,
      photoPublicId,
    });

    res.status(201).json({
      success: true,
      message: "Committee created successfully",
      data: committee,
    });
  } catch (error) {
    console.error("Create Committee Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update committee
const updateCommittee = async (req, res) => {
  try {
    const committee = await Committee.findById(req.params.id);

    if (!committee) {
      return res.status(404).json({
        success: false,
        message: "Committee not found",
      });
    }

    const { name, designation, phone, email, index } = req.body;

    // Update text fields
    committee.name = name ?? committee.name;
    committee.designation = designation ?? committee.designation;
    committee.phone = phone ?? committee.phone;
    committee.email = email ?? committee.email;
    committee.index = index ?? committee.index;

    // If new photo uploaded
    if (req.file) {
      // Delete old Cloudinary photo
      if (committee.photoPublicId) {
        await cloudinary.uploader.destroy(committee.photoPublicId);
      }

      // Upload new photo
      const result = await uploadToCloudinary(
        req.file.buffer,
        "bantiihs/committees",
      );

      committee.photo = result.url;
      committee.photoPublicId = result.publicId;
    }

    await committee.save();

    res.json({
      success: true,
      message: "Committee updated successfully",
      data: committee,
    });
  } catch (error) {
    console.error("Update Committee Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete committee
const deleteCommittee = async (req, res) => {
  try {
    const committee = await Committee.findById(req.params.id);

    if (!committee) {
      return res.status(404).json({
        success: false,
        message: "Committee not found",
      });
    }

    // Delete photo from Cloudinary
    if (committee.photoPublicId) {
      await cloudinary.uploader.destroy(committee.photoPublicId);
    }

    // Delete committee from MongoDB
    await Committee.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Committee deleted successfully",
    });
  } catch (error) {
    console.error("Delete Committee Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getCommittees,
  getCommittee,
  createCommittee,
  updateCommittee,
  deleteCommittee,
};
