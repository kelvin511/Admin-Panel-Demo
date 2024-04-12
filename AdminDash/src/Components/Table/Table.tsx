// Drakest #161925
// Dark #23395B
// Medium #406E8E
// Light #8EA8C3
// Lightest #CBF7ED
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import { NavLink } from "react-router-dom"
import axios from "axios"

import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid"
import { Suspense, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Modal from "@mui/material/Modal"
import Box from "@mui/material/Box"
import CircularProgress from "@mui/joy/CircularProgress"

//{ id: 1, col1: "Hello", col2: "World" }

// console.log(formData)

function Table() {
  const [pageState, setPageState] = useState({
    page: 0,
    pageSize: 3,
  })
  const [tabelLoading, setTableLoading] = useState(false)
  const [totalData, setTotalData] = useState(0)
  const [tableData, setTableData] = useState([])
  const [open, setOpen] = useState(false)
  const [row, setRow] = useState<any>()

  const navigate = useNavigate()

  const handleOpen = (row: any) => {
    setOpen(true)
    setRow(row)
  }
  const handleClose = () => {
    setOpen(false)
    setRow("")
  }

  useEffect(() => {
    try {
      ;(async () => {
        const response = await axios.get(
          `http://localhost:3000?page=${pageState.page}&pagesize=${pageState.pageSize}`
        )

        const rowData = response.data.data

        rowData.forEach((obj: any) => {
          if ("_id" in obj) {
            obj.id = obj._id
            delete obj._id
          }
          if ("__v" in obj) {
            delete obj.__v
          }
        })
        setTotalData(response.data.total)
        setTableData(rowData.slice().reverse())
        setTableLoading(false)
      })()
    } catch (error) {
      console.log(error)
    }
  }, [open, pageState])

  const handleEditClick = (row: any) => {
    navigate("/form", { state: row })
    console.log("Edited")
  }

  const handleDeleteClick = (row: any) => {
    axios({
      method: "delete",
      url: `http://localhost:3000/${row.id}`,
    }).then(() => setTableData([]))
    console.log("Deleted")
    setOpen(false)
  }

  const columns: GridColDef[] = [
    { field: "productid", headerName: "Product Id" },
    { field: "productname", headerName: "Product Name", width: 120 },
    { field: "category", headerName: "Category" },
    { field: "info", headerName: "Information" },
    { field: "price", headerName: "Price" },

    {
      field: "stock",
      headerName: "Stock",
    },
    {
      field: "image",
      headerName: "Image",
      display: "flex",

      renderCell: (params) => {
        return (
          <div className="flex items-stretch justify-center ">
            <img
              className="h-16 my-4 text-center "
              src={`http://localhost:3000/${params.value}`}
            />
          </div>
        )
      },
      align: "center",
    },
    {
      display: "flex",
      minWidth: 280,
      field: "location",
      headerName: "Loaction",
      renderCell: (params) => {
        const locationarr = params.row.location

        return (
          <ul key={Math.random() * 23000000}>
            {locationarr.map((obj: any) => {
              return (
                <li key={Math.random() * 1000000000000}>
                  <p>
                    <b>City: </b>
                    {obj.city} <b>State: </b>
                    {obj.state}
                  </p>{" "}
                </li>
              )
            })}
          </ul>
        )
      },
    },
    {
      field: "buttons",
      headerName: "Action",
      display: "flex",
      renderCell: (params) => {
        return (
          <div className="flex flex-row justify-start gap-3">
            <button onClick={() => handleOpen(params.row)}>
              <DeleteIcon />
            </button>
            <button onDoubleClick={() => handleEditClick(params.row)}>
              <EditIcon />
            </button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="mt-8 items-center gap-8 text-[#8EA8C3]">
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="flex flex-col p-6 rounded-xl mt-[32rem] items-center w-1/2 gap-8 text-[#8EA8C3] mx-auto bg-[#23395B]">
          <h1 className="py-8 font-serif text-5xl font-extrabold">
            Arey You sure you want to delete
          </h1>
          <button
            onClick={() => handleDeleteClick(row)}
            className="w-1/4 mb-10 yyy rounded-[12px] bg-[#CBF7ED] text-xl text-[#23395B] flex-2"
          >
            Yes
          </button>
        </Box>
      </Modal>
      <h1 className="font-serif text-5xl font-extrabold text-center hover:text-green-400">
        Admin Panel
      </h1>

      <div className="flex flex-col items-center justify-center mx-auto mt-10 text-center ">
        <NavLink
          className="px-4 py-2 mb-10 yyy rounded-[12px] bg-[#CBF7ED] text-xl text-[#23395B] flex-2"
          to="/form"
        >
          Add
        </NavLink>
        <Suspense
          fallback={
            <CircularProgress color="primary" size="lg" variant="plain" />
          }
        >
          <DataGrid
            paginationMode="server"
            paginationModel={{
              pageSize: pageState.pageSize,
              page: pageState.page,
            }}
            onPaginationModelChange={(model) => {
              setPageState({
                ...pageState,
                page: model.page,
                pageSize: model.pageSize,
              })
              setTableLoading(true)
            }}
            loading={tabelLoading}
            rowCount={totalData}
            disableColumnSelector
            disableMultipleRowSelection
            disableRowSelectionOnClick
            className="bg-[#8EA8C3] p-6  flex justify-center mx-auto !text-[#23395B] "
            rows={tableData as GridRowsProp}
            columns={columns}
            rowHeight={120}
            initialState={{
              pagination: { paginationModel: { pageSize: 3 } },
            }}
            pageSizeOptions={[3, 5, 10]}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default Table
