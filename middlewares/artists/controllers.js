const Artist = require("./model");
const Artwork = require("../artworks/model");
const artistsSeed = require("./seed.json");

const artistsControllers = {
  seed: async (req, res) => {
    try {
      await Artist.deleteMany();

      artistsSeed.forEach(async (artist) => {
        try {
          const newArtist = {
            ...artist,
            photoUrl: process.env.API_URL + artist.photoUrl,
            slug: artist.name.split(" ").join("-").toLowerCase(),
          };
          await Artist.create(newArtist);
        } catch (error) {
          res.status(201).send({
            message: "Seed artists process failed",
          });
        }
      });

      res.status(201).send({
        message: "Seed artists completed",
      });
    } catch (error) {
      res.status(500).send({
        message: "Seed artists failed",
      });
    }
  },

  getAll: async (req, res) => {
    const artists = await Artist.find();

    res.status(200).send({
      message: "Get all artists",
      artists,
    });
  },

  add: async (req, res) => {
    try {
      const newArtist = {
        slug: req.body.name.split(" ").join("-").toLowerCase(),
        name: req.body.name,
        photoUrl: `${process.env.API_URL}/uploads/${req.file.filename}`,
        biography: {
          about: req.body.about,
          exhibitions: JSON.parse(req.body.exhibitions),
        },
      };

      console.log(newArtist);

      const artist = await Artist.create(newArtist);

      res.status(200).send({
        message: "Add artist",
        artist,
      });
    } catch (error) {
      res.status(400).send({
        error,
      });
    }
  },

  deleteAll: async (req, res) => {
    try {
      await Artist.deleteMany();
      res.status(200).send({
        message: "Deleted all artists",
      });
    } catch (error) {
      res.status(400).send({
        error,
      });
    }
  },

  getOneBySlug: async (req, res) => {
    try {
      const slug = req.params.slug;

      const artist = await Artist.findOne({ slug }).populate({
        path: "artworks",
        select: "title slug imageUrl -_id",
      });
      if (!artist) throw new Error("No artist found");

      res.status(200).send({
        artist,
      });
    } catch (error) {
      res.status(400).send({
        error,
      });
    }
  },

  deleteOneBySlug: async (req, res) => {
    try {
      const slug = req.params.slug;

      const artist = await Artist.findOne({ slug });

      const resultDeleteArtworks = await Artwork.deleteMany({
        _id: {
          $in: artist.artworks,
        },
      });

      const resultDeleteArtist = await Artist.deleteOne({ slug });
      res.status(200).send({
        resultDeleteArtist,
        resultDeleteArtworks,
      });
    } catch (error) {
      res.status(400).send({
        error,
      });
    }
  },
};

module.exports = artistsControllers;
