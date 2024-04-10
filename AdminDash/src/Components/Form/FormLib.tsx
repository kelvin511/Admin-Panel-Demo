// Drakest #161925
// Dark #23395B
// Medium #406E8E
// Light #8EA8C3
// Lightest #CBF7ED

import { SubmitHandler, useForm } from "react-hook-form"
import Joi from "joi"
import { joiResolver } from "@hookform/resolvers/joi"
import { useEffect, useRef, useState } from "react"
import { serialize } from "object-to-formdata"
import axios from "axios"
import { ToastContainer, toast, Flip } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { NavLink } from "react-router-dom"
import { useLocation } from "react-router-dom"

//* JOI SCHEMA ///////////////////////////////////////////////////////////////
const schema = Joi.object({
  productid: Joi.number().required(),
  productname: Joi.string().required(),

  category: Joi.string().required(),
  info: Joi.string().required(),
  price: Joi.number().required(),
  image: Joi.any().required(),
  stock: Joi.number().required(),
})

//* TYPE OF FORM INPUTS ///////////////////////////////////////////////////////////////

type FormFields = {
  productid: number | string
  productname: string
  category: string
  image: File | string
  info: string
  price: number | string
  stock: number | string
}

//* REACT FUNCTION COMPONENT //////////////////////////////////////////////////////////

function FormLib() {
  const [fileUrl, setFileUrl] = useState<any>() //* FILE URL TO PREVIEW
  const [imgError, setImgError] = useState<any>(false) //*image error for validation

  const imageRef = useRef<any>(null)
  const previewRef = useRef<any>(null)
  const location = useLocation()

  useEffect(() => {
    if (location.state !== null && location) {
      setValue("productname", location.state.productname, {
        shouldValidate: true,
      })
      setValue("productid", location.state.productid, {
        shouldValidate: true,
      })
      setValue("category", location.state.category, {
        shouldValidate: true,
      })
      setValue("image", location.state.image, {
        shouldValidate: true,
      })
      setValue("info", location.state.info, {
        shouldValidate: true,
      })
      setValue("price", location.state.price, {
        shouldValidate: true,
      })
      setValue("stock", location.state.stock, {
        shouldValidate: true,
      })
      previewRef.current.src = `http://localhost:3000/${location.state.image}`
    }
  }, [])

  const {
    setError,
    reset,
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: joiResolver(schema),
  })

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return
    }

    const image = e.target.files[0]

    if (!image.name.match(/\.(jpg|jpeg|png|gif)$/)) {
      setImgError(true)

      imageRef.current.value = ""
      setFileUrl("")
    } else {
      setValue("image", image)
      setImgError(false)
    }
    setError("image", {
      type: "manual",
      message: "",
    })

    e.preventDefault()

    setFileUrl(URL.createObjectURL(image))
  }
  const sendData = async (data: FormFields) => {
    const formData = serialize(data)
    console.log(formData)

    try {
      await axios({
        method: location.state === null ? "post" : "patch",
        url:
          location.state === null
            ? "http://localhost:3000"
            : `http://localhost:3000/${location.state.id}`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then(function (response) {
          toast.success(`${response.data.message}`, {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            theme: "colored",
            transition: Flip,
          })
        })
        .catch(function (response) {
          toast.error("Failed to submit data. Please try again later.", {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            theme: "colored",
            transition: Flip,
          })
        })
    } catch (error) {
      console.error("Error:", error)
      toast.error("Failed to submit data. Please try again later.", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        theme: "colored",
        transition: Flip,
      })
    }
  }

  const updateData = () => {}

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    sendData(data)
    reset({
      productid: "",
      productname: "",
      category: "",
      info: "",
      price: "",
      stock: "",
      image: "",
    })
    imageRef.current.value = ""
    setFileUrl("")
  }

  return (
    <div className="flex justify-center my-2">
      <div className="w-1/2 p-10 text-xl text-[#23395B] bg-[#8EA8C3] rounded-xl">
        <div className="flex justify-center mb-12">
          <NavLink
            to="/"
            className=" text-center  p-2 bg-[#161925] text-[#CBF7ED] rounded-lg"
          >
            View Table
          </NavLink>
        </div>
        <form
          encType="multipart/form-data"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center gap-4"
          // onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col w-1/2">
            <label className="mb-2" htmlFor="productid">
              Product ID
            </label>

            <input
              id="productid"
              autoComplete="off"
              className="w-full p-2 rounded-lg"
              {...register("productid")}
              type="number"
              placeholder="Product Id"
            />
            {errors.productid && (
              <span className="text-[20px] text-red-700 ">
                {errors.productid.message?.replace(/"/g, "")}
              </span>
            )}
          </div>
          <div className="flex flex-col w-1/2">
            <label className="mb-2" htmlFor="productname">
              Productname
            </label>
            <input
              id="productname"
              autoComplete="off"
              className="w-full p-2 rounded-lg"
              {...register("productname")}
              type="text"
              placeholder="Product Name"
            />
            {errors.productname && (
              <span className="text-[20px] text-red-700 ">
                {errors.productname.message?.replace(/"/g, "")}
              </span>
            )}
          </div>
          <div className="flex flex-col w-1/2">
            <label className="mb-2" htmlFor="category">
              Category
            </label>
            <input
              id="category"
              autoComplete="off"
              className="w-full p-2 rounded-lg"
              {...register("category")}
              type="text"
              placeholder="category"
            />
            {errors.category && (
              <span className="text-[20px] text-red-700 ">
                {errors.category.message?.replace(/"/g, "")}
              </span>
            )}
          </div>
          <div className="flex flex-col w-1/2">
            <label className="mb-2" htmlFor="info">
              Information
            </label>
            <input
              id="info"
              autoComplete="off"
              className="w-full p-2 rounded-lg"
              {...register("info")}
              type="text"
              placeholder="Information"
            />
            {errors.info && (
              <span className="text-[20px] text-red-700 ">
                {errors.info.message?.replace(/"/g, "")}
              </span>
            )}
          </div>
          <div className="flex flex-col w-1/2">
            <label className="mb-2" htmlFor="price">
              Price
            </label>
            <input
              id="price"
              autoComplete="off"
              className="w-full p-2 rounded-lg"
              {...register("price")}
              type="number"
              placeholder="Price"
            />
            {errors.price && (
              <span className="text-[20px] text-red-700 ">
                {errors.price.message?.replace(/"/g, "")}
              </span>
            )}
          </div>

          <div className="flex flex-col w-1/2">
            <label className="mb-2" htmlFor="stock">
              Stock
            </label>
            <input
              id="stock"
              autoComplete="off"
              className="w-full p-2 rounded-lg"
              {...register("stock")}
              type="number"
              placeholder="Stock"
            />
            {errors.stock && (
              <span className="text-[20px] text-red-700 ">
                {errors.stock.message?.replace(/"/g, "")}
              </span>
            )}
          </div>
          <div className="flex flex-col w-1/2">
            <label className="mb-2" htmlFor="file">
              Image
            </label>
            <input
              {...register}
              id="image"
              name="image"
              autoComplete="off"
              className="w-full p-2 rounded-lg"
              ref={imageRef}
              onChange={onChangeFile}
              type="file"
            />
            {imgError && (
              <span className="text-[20px] text-red-700 ">
                Please select valid image
              </span>
            )}
            {errors.image && (
              <span className="text-[20px] text-red-700 ">
                {errors.image?.message?.replace(/"/g, "")}
              </span>
            )}

            {<img ref={previewRef} src={fileUrl} />}
          </div>
          {location.state === null ? (
            <button
              // disabled={isSubmitting}
              className="p-2 bg-[#161925] text-[#CBF7ED] rounded-lg"
              type="submit"
            >
              {isSubmitting ? "Saving..." : "Submit"}
            </button>
          ) : (
            <button
              // disabled={isSubmitting}
              className="p-2 bg-[#161925] text-[#CBF7ED] rounded-lg"
              type="submit"
            >
              {isSubmitting ? "Saving..." : "Update"}
            </button>
          )}
          {errors.root && (
            <span className="text-[20px] text-red-700 ">
              {errors.root.message}
            </span>
          )}
        </form>
      </div>
      <ToastContainer
        toastStyle={{ backgroundColor: "#CBF7ED", color: "#161925" }}
      />
    </div>
  )
}

export default FormLib
