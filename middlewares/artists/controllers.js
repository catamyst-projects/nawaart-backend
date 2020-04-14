const Artist = require("./model");

const artistsControllers = {
  // GET ALL ARTISTS
  getAll: async (req, res) => {
    const artists = await Artist.find();

    res.status(200).send({
      message: "Get all artists",
      artists,
    });
  },

  addArtist: async (req, res) => {
    try {
      const newArtist = {
        ...req.body,
        slug: req.body.name.split(" ").join("-").toLowerCase(),
      };

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
};

module.exports = artistsControllers;
