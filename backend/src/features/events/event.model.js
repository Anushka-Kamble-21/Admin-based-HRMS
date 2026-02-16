import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      default: null
    },

    eventDate: {
      type: Date,
      required: true
    },

    createdBy: {
      type: String,
      default: "Admin"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
