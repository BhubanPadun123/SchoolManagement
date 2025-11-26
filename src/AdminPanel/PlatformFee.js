import React from "react"
import { 
    Add,
    Edit,
    DeleteOutline,
    UpdateOutlined
} from "@mui/icons-material"
import {
    Typography,
    Box,
    useTheme,
    useMediaQuery,
    TextField,
    Button,
    Tooltip,
    IconButton
} from "@mui/material"
import {Loader,ConfirmationAlert,CTable} from "../components/index"
import {
    Message,
    toaster
} from "rsuite"
import {
    useCreatePlatformFeeMutation,
    useEditPlatformFeeMutation,
    useDeletePlatformFeeMutation,
    useLazyGetAllFeeQuery
} from "../Redux/actions/setting.action"
import _ from "lodash"

export default function PlatformFee() {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("md"))
    const [fee_name,setFeeName] = React.useState("")
    const [fee_amount,setFeeAmount] = React.useState("")

    const [getPlatformFeeAction,getPlatformFeeState] = useLazyGetAllFeeQuery()
    const [deletePlatformFeeAction,deletePlatformFeeState] = useDeletePlatformFeeMutation()
    const [editPlatformFeeAction,editPlatformFeeState] = useEditPlatformFeeMutation()
    const [createPlatformFeeAction,createPlatformFeeState] = useCreatePlatformFeeMutation()

    React.useEffect(()=> {
        getPlatformFeeAction()
    },[])

    console.log({getPlatformFeeState})

    function handleCreateFee(){
        if(!fee_amount || !fee_name){
            toaster.push(<Message type="info" >Please fill fee name and fee amount!</Message>,{placement:"topCenter"})
            return
        }
        createPlatformFeeAction({
            fee_name:fee_name,
            fee_amount:fee_amount
        })
    }
    const createPlatformFeeStatus = React.useMemo(()=> {
        if(createPlatformFeeState.isSuccess){
            getPlatformFeeAction()
            const message = _.get(createPlatformFeeState,"data.message","")
            toaster.push(<Message type="success" >{message}</Message>,{placement:"topCenter"})
            createPlatformFeeState.reset()
        }
        if(createPlatformFeeState.isError){
            toaster.push(<Message type="error" >Error while create the fee!</Message>,{placement:"topCenter"})
            createPlatformFeeState.reset()
        }
    },[createPlatformFeeState])
    const feeList = React.useMemo(()=> {
        if(getPlatformFeeState.isSuccess){
            const list = _.get(getPlatformFeeState,"currentData.list",[])
            let list_data = list && Array.isArray(list) && list.length > 0 && list.map((item,index)=> {
                return {
                    "SL_No":index+1,
                    "Fee_Name":item.fee_name,
                    "Fee_Amount":item.fee_amount
                }
            })
            return list_data
        }else{
            return []
        }
    },[getPlatformFeeState])

    const createStatus = createPlatformFeeStatus

    return (
        <div className="col-md-12" >
            <Box sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingTop: "10px",
                paddingBottom: "10px",
                flexDirection: "column"
            }}>
                <Typography variant={isMobile ? "body1" : "h4"} sx={{
                    fontFamily: "Lato",
                    fontWeight: 400,
                    color: "#FFFF",
                    fontStyle: "normal"
                }} >
                    Create New Platform Fee
                </Typography>
                <TextField
                    variant="outlined"
                    placeholder="Enter Fee Name"
                    label={"Enter Fee Name"}
                    sx={{
                        backgroundColor: "#FFFF",
                        borderRadius: "4px",
                        width:isMobile ? "90%" : "400px",
                        margin:"8px"
                    }}
                    value={fee_name}
                    onChange={(e)=>{
                        setFeeName(e.target.value)
                    }}
                />
                <TextField
                    variant="outlined"
                    placeholder="Enter Fee Name"
                    label={"Enter Fee Name"}
                    sx={{
                        backgroundColor: "#FFFF",
                        borderRadius: "4px",
                        width:isMobile ? "90%" : "400px",
                        margin:"8px"
                    }}
                    value={fee_amount}
                    onChange={(e)=> {
                        setFeeAmount(e.target.value)
                    }}
                    type="number"
                />
                <Button
                   startIcon={<Add/>}
                   variant="contained"
                   onClick={handleCreateFee}
                >
                    Add
                </Button>
                <div style={{
                    height:"14px"
                }} />
                <CTable 
                   header={["SL_No","Fee_Name","Fee_Amount"]}
                   rows={feeList}
                   renderActions={
                    <div>
                        <Tooltip title={"Edit Fee"} arrow placement="bottom" >
                            <IconButton>
                                <Edit />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={"Delete Fee"} arrow placement="bottom" >
                            <IconButton>
                                <DeleteOutline/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={"Update Fee"} arrow placement="bottom" >
                            <IconButton>
                                <UpdateOutlined/>
                            </IconButton>
                        </Tooltip>
                    </div>
                   }
                />
            </Box>
            {
                (
                    createPlatformFeeState.isLoading ||
                    deletePlatformFeeState.isLoading ||
                    editPlatformFeeState.isLoading ||
                    getPlatformFeeState.isLoading
                ) && (
                    <Loader/>
                )
            }
        </div>  
    )
}