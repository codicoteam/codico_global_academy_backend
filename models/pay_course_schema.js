const mongoose = require('mongoose');

const PayCourseSchema = new mongoose.Schema(
  {
    pollUrl: {
      type: String,
      required: true
    },
    isPaid: {
      type: Boolean,
      default: false
    },
    customerName: {
      type: String,
      required: true
    },
    customerEmail: {
      type: String,
      required: true
    },
    customerPhoneNumber: {
      type: String,
      required: true
    },
    showPayment: {
      type: Boolean,
      default: false
    },
    category: {
      type: String,
      required: true
    },
    courseImage: {
      type: String,
      required: true
    },
    currency: {
      type: String,
      required: true,
      default: "USD"
    },
    description: {
      type: String,
      required: true
    },
    duration: {
      type: String,
      required: true
    },
    level: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('PayCourse', PayCourseSchema);
