const Sauce = require('../models/Sauce')
const fs = require('fs')
const removeUploadedFiles = require('multer/lib/remove-uploaded-files')

/*
 * This function is used to add a sauce in the database
 */
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce)
  delete sauceObject._id
  const sauce = new Sauce({
    ...sauceObject,
    likes: 0,
    dislikes: 0,
    usersDisliked: [],
    usersLiked: [],
    imageUrl: `${req.protocol}://${req.get('host')}/uploads/${
      req.file.filename
    }`,
  })
  sauce
    .save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
    .catch((error) => res.status(400).json({ error }))
}

/*
 * This function is used to retrieve all the sauces from the database
 */
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces)
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      })
    })
}

/*
 * This function is used to retrieve the information of a single sauce
 */
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce)
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      })
    })
}

/*
 * This function is used to update a sauce in the database
 */
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/uploads/${
          req.file.filename
        }`,
      }
    : { ...req.body }

  if (req.file) {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        const filename = sauce.imageUrl.split('/uploads/')[1]
        fs.unlink(`uploads/${filename}`, (error) => {
          if (error) throw error
        })
      })
      .catch((error) => res.status(500).json({ error }))
  }
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
    .catch((error) => res.status(400).json({ error }))
}

/*
 * This function is used to delete a sauce from the database
 */
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split('/uploads/')[1]
      fs.unlink(`uploads/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
          .catch((error) => res.status(400).json({ error }))
      })
    })
    .catch((error) => res.status(500).json({ error }))
}

/*
 * This function is used to add/remove a like/dislike
 */
exports.likeSauce = (req, res, next) => {
  const like = req.body.like

  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // to check whether the user has already rated the sauce or not
      const noRating =
        !sauce.usersLiked.includes(req.body.userId) &&
        !sauce.usersDisliked.includes(req.body.userId)
      // the user who rates is not the one who added the sauce
      if (sauce.userId !== req.body.userId) {
        if (noRating && like === 1) {
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $push: { usersLiked: req.body.userId },
              $inc: { likes: +1 },
            }
          )
            .then(() => res.status(200).json({ message: 'like added !' }))
            .catch((error) => res.status(400).json({ error }))
        } else if (noRating && like === -1) {
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $push: { usersDisliked: req.body.userId },
              $inc: { dislikes: +1 },
            }
          )
            .then(() => res.status(200).json({ message: 'dislike added !' }))
            .catch((error) => res.status(400).json({ error }))
        } else {
          if (sauce.usersLiked.includes(req.body.userId)) {
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $pull: { usersLiked: req.body.userId },
                $inc: { likes: -1 },
              }
            )
              .then(() => res.status(200).json({ message: 'like removed !' }))
              .catch((error) => res.status(400).json({ error }))
          } else {
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $pull: { usersDisliked: req.body.userId },
                $inc: { dislikes: -1 },
              }
            )
              .then(() =>
                res.status(200).json({ message: 'dislike removed !' })
              )
              .catch((error) => res.status(400).json({ error }))
          }
        }
      } else {
        // the user who rates is the one who added the sauce
        console.log('Error : users cannot rate their own sauces')
      }
    })
    .catch((error) => res.status(400).json({ error }))
}
