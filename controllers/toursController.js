const fs = require("fs")

const tours = JSON.parse(
  fs.readFileSync(
    `${__dirname}/../dev-data/data/tours-simple.json`
  )
)

const checkId = (req, res, next, val) => {
  const tour = tours.find(
    (el) => el.id === val * 1
  )

  if (!tour) {
    return res.status(400).json({
      status: "failed",
      message: `data with ${val} this not found`,
    })
  }
  next()
}

const checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: "failed",
      message: `name or price are required`,
    })
  }
  next()
}

const getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    requestTime: req.requestTime,
    data: {
      tours,
    },
  })
}

const getTourById = (req, res) => {
  const id = req.params.id * 1
  const tour = tours.find((el) => el.id === id)

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  })
}

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1
  const newData = Object.assign(
    { id: newId },
    req.body
  )

  tours.push(newData)
  fs.writeFile(
    `${__dirname}/dev-data/data//tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          tour: newData,
        },
      })
    }
  )
}

const editTour = (req, res) => {
  const id = req.params.id * 1
  const tourIndex = tours.findIndex(
    (el) => el.id === id
  )

  tours[tourIndex] = {
    ...tours[tourIndex],
    ...req.body,
  }

  fs.writeFile(
    `${__dirname}/dev-data/data//tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(200).json({
        status: "success",
        message: `tour with this id ${id} edited`,
        data: {
          tour: tours[tourIndex],
        },
      })
    }
  )
}

const removeTour = (req, res) => {
  const id = req.params.id * 1
  const tourIndex = tours.findIndex(
    (el) => el.id === id
  )

  tours.splice(tourIndex, 1)

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(200).json({
        status: "success",
        message: "delete data success",
        data: null,
      })
    }
  )
}

module.exports = {
  getAllTours,
  getTourById,
  editTour,
  removeTour,
  createTour,
  checkId,
  checkBody,
}
