import { Request, Response } from "express"
import env from "dotenv"

import connectDB from "./util/db"
import cors from "cors"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import fs from "node:fs"

env.config()

const express = require("express")
const app = express()
const multer = require("multer")

const storage = multer.diskStorage({
  destination: function (
    req: any,
    file: any,
    cb: (arg0: null, arg1: string) => void
  ) {
    cb(null, "../Photos/")
  },
  filename: function (
    req: any,
    file: { originalname: any },
    cb: (arg0: null, arg1: any) => void
  ) {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage: storage })
const PORT = process.env.PORT || 3000
const dataSchema = new mongoose.Schema({
  productid: Number,
  productname: String,
  category: String,
  info: String,
  price: Number,
  stock: Number,
  image: String,
})

const items = mongoose.model("items", dataSchema)

app.use(express.static("../Photos"))
app.use(express.json())

app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.get("/", async (req: Request, res: Response) => {
  const data = await items.find()
  res.status(200).json(data)
  // console.log(data)
})
app.post("/", upload.single("image"), (req: Request | any, res: Response) => {
  const { productid, productname, category, info, price, stock } = req.body

  const image = req.file

  try {
    items
      .create({
        productid: productid,
        productname: productname,
        category: category,
        info: info,
        price: price,
        stock: stock,
        image: image.originalname,
      })
      .then(() => {
        res.status(201).json({ message: "Data Stored" })
      })
  } catch (err) {
    res.status(500).json({ message: "Server Error" })
  }
})

app.patch(
  "/:id",
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      const id = req.params.id
      const { productid, productname, category, info, price, stock } = req.body
      const doc: any = await items.findById(id)
      doc.productid = productid
      doc.productname = productname
      doc.category = category
      doc.info = info
      doc.price = price
      doc.stock = stock

      //@ts-ignore
      if (req.file) {
        //@ts-ignore
        const image = req.file
        if (image.originalname !== doc.image) {
          doc.image = image.originalname
        }
      }
      doc.save()

      res.status(200).json({ message: "Data Updated" })
    } catch (error) {
      console.log(error)

      res.status(500).json({ message: "Internal Error " })
    }
  }
)

app.delete("/:id", async (req: Request, res: Response) => {
  const id = req.params.id
  try {
    await items.findByIdAndDelete(id).then((data: any) => {
      const imgname = data?.image
      fs.unlinkSync(`../Photos/${imgname}`)

      res.status(204).json({ message: "Data Deleted" })
    })
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" })
    console.log(error)
  }
})
connectDB().then(
  app.listen(PORT, () => {
    console.log("Server Started")
  })
)
