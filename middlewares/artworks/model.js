const mongoose = require("../../config/mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

// Artwork schema
const ArtworkSchema = Schema(
  {
    artist: {
      type: mongoose.Types.ObjectId,
      ref: "Artist",
      required: [true, "Artist's _id is required"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      min: [2, "Title is too short"],
      max: [100, "Title is too long"],
      unique: true,
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
    },
    dimensions: {
      type: String,
    },
    country: {
      type: String,
      required: [true, "Country is required"],
    },
  },
  {
    timestamps: true,
  }
);

ArtworkSchema.plugin(AutoIncrement, {
  id: "artworks_counter",
  inc_field: "id",
});

ArtworkSchema.plugin(uniqueValidator);

const Artwork = mongoose.model("Artwork", ArtworkSchema);

module.exports = Artwork;
