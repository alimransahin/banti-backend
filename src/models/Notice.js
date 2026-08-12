const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    details: {
      type: String,
      required: true,
      trim: true,
    },

    attachment: {
      type: [String],
      default: [],
    },

    attachmentPublicIds: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const Notice = mongoose.model("Notice", noticeSchema);

module.exports = Notice;
