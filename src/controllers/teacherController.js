const Teacher = require("../models/Teacher");
const cloudinary = require("../config/cloudinary");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

// Get all teachers
const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().sort({
      index: 1,
      createdAt: -1,
    });

    res.json({
      success: true,
      data: teachers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single teacher
const getTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    res.json({
      success: true,
      data: teacher,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create teacher
const createTeacher = async (req, res) => {
  try {
    const {
      name,
      designation,
      subject,
      phone,
      email,
      qualification,
      joiningDate,
      index,
      isActive,
    } = req.body;

    let photo = "";
    let photoPublicId = "";

    // Upload photo to Cloudinary
    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        "bantiihs/teachers",
      );

      photo = result.url;
      photoPublicId = result.publicId;
    }

    const teacher = await Teacher.create({
      name,
      designation,
      subject,
      phone,
      email,
      qualification,
      joiningDate,
      index,
      isActive,
      photo,
      photoPublicId,
    });

    res.status(201).json({
      success: true,
      message: "Teacher created successfully",
      data: teacher,
    });
  } catch (error) {
    console.error("Create Teacher Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update teacher
const updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    const {
      name,
      designation,
      subject,
      phone,
      email,
      qualification,
      joiningDate,
      index,
      isActive,
    } = req.body;

    // Update text fields
    teacher.name = name ?? teacher.name;
    teacher.designation = designation ?? teacher.designation;
    teacher.subject = subject ?? teacher.subject;
    teacher.phone = phone ?? teacher.phone;
    teacher.email = email ?? teacher.email;
    teacher.qualification = qualification ?? teacher.qualification;
    teacher.joiningDate = joiningDate ?? teacher.joiningDate;
    teacher.index = index ?? teacher.index;
    teacher.isActive = isActive ?? teacher.isActive;

    // If new photo uploaded
    if (req.file) {
      // Delete old Cloudinary photo
      if (teacher.photoPublicId) {
        await cloudinary.uploader.destroy(teacher.photoPublicId);
      }

      // Upload new photo
      const result = await uploadToCloudinary(
        req.file.buffer,
        "bantiihs/teachers",
      );

      teacher.photo = result.url;
      teacher.photoPublicId = result.publicId;
    }

    await teacher.save();

    res.json({
      success: true,
      message: "Teacher updated successfully",
      data: teacher,
    });
  } catch (error) {
    console.error("Update Teacher Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete teacher
const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    // Delete photo from Cloudinary
    if (teacher.photoPublicId) {
      await cloudinary.uploader.destroy(teacher.photoPublicId);
    }

    // Delete teacher from MongoDB
    await Teacher.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Teacher deleted successfully",
    });
  } catch (error) {
    console.error("Delete Teacher Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};
