// Drakest #161925
// Dark #23395B
// Medium #406E8E
// Light #8EA8C3
// Lightest #CBF7ED

import {
  SubmitHandler,
  useForm,
  useFieldArray,
  Controller,
} from "react-hook-form"
import Joi, { string } from "joi"
import { joiResolver } from "@hookform/resolvers/joi"
import { useCallback, useEffect, useRef, useState } from "react"
import { serialize } from "object-to-formdata"
import axios from "axios"
import { ToastContainer, toast, Flip } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { NavLink, useNavigate } from "react-router-dom"
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
  location: Joi.array()
    .items(
      Joi.object().keys({
        city: Joi.string().required(),
        state: Joi.string().required(),
      })
    )
    .min(1),
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
  location: { city: string; state: string }[]
}

//* REACT FUNCTION COMPONENT //////////////////////////////////////////////////////////

function FormLib() {
  const [fileUrl, setFileUrl] = useState<any>() //* FILE URL TO PREVIEW
  const [imgError, setImgError] = useState<any>(false) //*image error for validation
  const [locError, setLocError] = useState<any>([])
  const [index1, setIndex1] = useState<any>([])

  const imageRef = useRef<any>(null)
  const previewRef = useRef<any>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const {
    control,
    setError,
    getValues,
    reset,
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      productid: "",
      productname: "",
      category: "",
      info: "",
      price: "",
      stock: "",
      image: "",
      location: [{ city: "", state: "" }],
    },
    resolver: joiResolver(schema),
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: "location",
  })

  const locationDelete = useCallback(() => {
    append({ city: "", state: "" })
  }, [])

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
        shouldTouch: true,
      })
      setValue("location", location.state.location, {
        shouldTouch: true,
        shouldValidate: true,
      })
      previewRef.current.src = `http://localhost:3000/${location.state.image}`
    }
  }, [])

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
    //@ts-ignore

    //@ts-ignore
    const formData = data

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
          // setTimeout(() => navigate("/"), 2000)
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
        .catch((error) => {
          toast.error(error as string, {
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
      toast.error(`${error}`, {
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

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    setLocError(errors.location)
    let isEmpty = false
    const locationarr = data.location.forEach((obj: any) => {
      if (obj.city === "" || obj.state === "") isEmpty = true
    })
    console.log(locationarr)

    console.log(data)
    if (data.location.length > 0 && !isEmpty) {
      sendData(data)
      reset({
        productid: "",
        productname: "",
        category: "",
        info: "",
        price: "",
        stock: "",
        image: "",
        location: [{ city: "", state: "" }],
      })
      imageRef.current.value = ""
      setFileUrl("")
    } else {
      console.log(errors)
    }
  }

  return (
    <div className="flex justify-center my-2">
      <div className="w-1/2 p-10 text-xl text-[#23395B] bg-[#8EA8C3] rounded-xl">
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
            <label className="mb-2" htmlFor="stock">
              Location
            </label>
            <div>
              {fields.map((field, index) => {
                return (
                  <div className="flex flex-row gap-4 my-5" key={field.id}>
                    <input
                      className="w-1/3 p-2 rounded-lg"
                      type="text"
                      id={`city${index}`}
                      placeholder="City"
                      {...register(`location.${index}.city` as const)}
                    />
                    <input
                      className="w-1/3 p-2 rounded-lg"
                      type="text"
                      id={`state${index}`}
                      placeholder="State"
                      {...register(`location.${index}.state` as const)}
                    />

                    {index > 0 && (
                      <button onClick={() => remove(index)}>Remove</button>
                    )}
                  </div>
                )
              })}

              <button
                type="button"
                className="p-1 bg-[#23395B] text-[#CBF7ED] rounded-lg"
                onClick={() => {
                  append({ city: "", state: "" })
                }}
              >
                Add
              </button>
            </div>
            {errors.location
              ? errors.location?.map((obj) => (
                  <span className="text-[20px] text-red-700 ">
                    {`Fields cannot be empty on order ${
                      errors.location?.indexOf(obj) + 1
                    }`}
                  </span>
                ))
              : ""}
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
          <div className="flex justify-center mb-12 gap-14">
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

            <NavLink
              to="/"
              className=" text-center  p-2 bg-[#161925] text-[#CBF7ED] rounded-lg"
            >
              Go Back
            </NavLink>
          </div>
        </form>
      </div>
      <ToastContainer
        toastStyle={{ backgroundColor: "#CBF7ED", color: "#161925" }}
      />
    </div>
  )
}

export default FormLib
