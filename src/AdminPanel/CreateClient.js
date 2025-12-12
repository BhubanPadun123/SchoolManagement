import React from "react"
import {
    Box,
    Paper,
    TextField,
    Typography,
    MenuItem,
    Button,
} from "@mui/material"
import {
    Loader
} from "../components/index"
import { Message, toaster } from "rsuite"
import {
    useCreatePlatformMutation,
    useLazyUseGetAllPlatformsListQuery
} from "../Redux/actions/setting.action"
import {
    useUserRegisterMutation
} from "../Redux/actions/user.action"
import {resetForm,updateFields} from "../Redux/actions/formValue.action"
import { useDispatch,useSelector } from "react-redux"
import _ from "lodash"

export default function CreateClient() {
    const dispatch = useDispatch()

    const [getAllPlatformAction,getAllPlatformState] = useLazyUseGetAllPlatformsListQuery()
    const [createPlatformAction,createPlatformState] = useCreatePlatformMutation()
    const [createUserAction,createUserState] = useUserRegisterMutation()

    const form = useSelector((state)=> state.form.state)

    React.useEffect(()=>{
        getAllPlatformAction()
    },[])
    const platformList = React.useMemo(()=> {
        if(getAllPlatformState.isSuccess){
            const list = _.get(getAllPlatformState,"currentData.list",[])
            return list
        }else{
            return []
        }
    },[getAllPlatformState])
    React.useMemo(()=> {
        if(createPlatformState.isSuccess && createUserState.isSuccess){
            let message = _.get(createPlatformState,"data.message","Platform Created success!")
            toaster.push(<Message type="success">{message}</Message>,{placement:"topCenter"})
            dispatch(resetForm())
            getAllPlatformAction()
            createPlatformState.reset()
            createUserState.reset()
        }
        if(createPlatformState.isError || createUserState.isError){
            toaster.push(<Message type="error">Error while create platform</Message>,{placement:"topCenter"})
            createPlatformState.reset()
            createUserState.reset()
        }
    },[createPlatformState,createUserState])
    console.log(createUserState,createPlatformState,"<----------")
    return (
        <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
            <Paper
                elevation={5}
                sx={{
                    p: 4,
                    width: "100%",
                    maxWidth: 600,
                    borderRadius: 4,
                }}
            >
                <Typography
                    variant="h4"
                    textAlign="center"
                    sx={{ mb: 4, fontWeight: 600 }}
                >
                    Onboard New Client
                </Typography>
                <TextField
                    fullWidth
                    label="School / College Name"
                    placeholder="Enter Name"
                    sx={{ mb: 3 }}
                    onChange={(e)=> {
                        let name = e.target.value
                        let platform = _.get(form,"platform",{})
                        dispatch(updateFields({
                            platform:{
                                ...platform,
                                name:name
                            }
                        }))
                    }}
                    value={_.get(form,"platform.name","")}
                />

                {/* Contact Person */}
                <TextField
                    fullWidth
                    label="Enter State Name"
                    placeholder="Enter State Name"
                    sx={{ mb: 3 }}
                    onChange={(e)=> {
                        let state = e.target.value
                        let platform = _.get(form,"platform",{})
                        dispatch(updateFields({
                            platform:{
                                ...platform,
                                state:state
                            }
                        }))
                    }}
                    value={_.get(form,"platform.state","")}
                />
                <TextField
                    fullWidth
                    label="Enter District Name"
                    placeholder="Enter District Name"
                    sx={{ mb: 3 }}
                    onChange={(e)=> {
                        let district = e.target.value
                        const platform = _.get(form,"platform",{})
                        dispatch(updateFields({
                            platform:{
                                ...platform,
                                district:district
                            }
                        }))
                    }}
                    value={_.get(form,"platform.district","")}
                />
                <TextField
                    fullWidth
                    label="Enter PinCode"
                    placeholder="Enter PinCode"
                    sx={{ mb: 3 }}
                    type="number"
                    onChange={(e)=> {
                        let pinCode = e.target.value
                        const platform = _.get(form,"platform",{})
                        dispatch(updateFields({
                            platform:{
                                ...platform,
                                pinCode:pinCode
                            }
                        }))
                    }}
                    value={_.get(form,"platform.pinCode","")}
                />
                <TextField
                    fullWidth
                    label="Enter Full Address"
                    placeholder="Enter Full Address"
                    sx={{ mb: 3 }}
                    onChange={(e)=> {
                        let address = e.target.value
                        const platform = _.get(form,"platform",{})
                        dispatch(updateFields({
                            platform:{
                                ...platform,
                                address:address
                            }
                        }))
                    }}
                    value={_.get(form,"platform.address","")}
                    multiline
                />

                <Typography
                    variant="h6"
                    sx={{ mt: 4, mb: 2, fontWeight: 600 }}
                >
                    Admit User Details
                </Typography>

                {/* Admit User Name */}
                <TextField
                    fullWidth
                    label="Enter First Name"
                    placeholder="Enter First Name"
                    sx={{ mb: 3 }}
                    onChange={(e)=> {
                        let firstname = e.target.value
                        const user = _.get(form,"user",{})
                        dispatch(updateFields({
                            user:{
                                ...user,
                                firstname:firstname
                            }
                        }))
                    }}
                    value={_.get(form,"user.firstname","")}
                />
                <TextField
                    fullWidth
                    label="Enter Last Name"
                    placeholder="Enter Last Name"
                    sx={{ mb: 3 }}
                    onChange={(e)=> {
                        let lastname = e.target.value
                        const user = _.get(form,"user",{})
                        dispatch(updateFields({
                            user:{
                                ...user,
                                lastname:lastname
                            }
                        }))
                    }}
                    value={_.get(form,"user.lastname","")}
                />
                <TextField
                    fullWidth
                    label="Enter Email Address"
                    placeholder="Enter Email Address"
                    sx={{ mb: 3 }}
                    type="email"
                    onChange={(e)=> {
                        let email = e.target.value
                        const user = _.get(form,"user","")
                        dispatch(updateFields({
                            user:{
                                ...user,
                                email:email
                            }
                        }))
                    }}
                    value={_.get(form,"user.email","")}
                />
                <TextField
                    fullWidth
                    label="Enter Password"
                    placeholder="Enter Password"
                    sx={{ mb: 3 }}
                    onChange={(e)=> {
                        let password = e.target.value
                        const user = _.get(form,"user",{})
                        dispatch(updateFields({
                            user:{
                                ...user,
                                password:password
                            }
                        }))
                    }}
                    value={_.get(form,"user.password","")}
                />

                {/* Button */}
                <Box textAlign="center">
                    <Button
                        variant="contained"
                        size="large"
                        sx={{
                            px: 5,
                            py: 1.2,
                            borderRadius: 3,
                            textTransform: "none",
                            fontSize: "16px",
                        }}
                        onClick={()=> {
                            const platform = _.get(form,"platform",null)
                            const user = _.get(form,"user",null)
                            if(!platform || !user) {
                                toaster.push(<Message type="info" >Please fill all fields details</Message>,{placement:"topCenter"})
                                return
                            }
                            const address = _.get(platform,"address",null)
                            const district = _.get(platform,"district",null)
                            const name = _.get(platform,"name",null)
                            const pinCode = _.get(platform,"pinCode",null)
                            const state = _.get(platform,"state",null)

                            const email = _.get(user,"email",null)
                            const firstname = _.get(user,"firstname",null)
                            const lastname = _.get(user,"lastname",null)
                            const password = _.get(user,"password",null)

                            if(
                                !address ||
                                !district ||
                                !name ||
                                !pinCode ||
                                !state ||
                                !email ||
                                !firstname ||
                                !password
                            ){
                                toaster.push(<Message type="info" >Please fill all fields details</Message>,{placement:"topCenter"})
                                return
                            }
                            let checkPltform = Array.isArray(platformList) && platformList.length > 0 && platformList.find((item)=> item.name.toLowerCase() === name.toLowerCase())
                            if(checkPltform){
                                toaster.push(<Message type="info" >School Or College Name Already Exist!</Message>,{placement:"topCenter"})
                                return
                            }
                            createPlatformAction({
                                name,
                                logo:"null",
                                state,
                                district,
                                pin:pinCode,
                                address
                            })
                            createUserAction({
                                firstname,
                                lastname: lastname ? lastname : "",
                                email,
                                password,
                                meta_data:{
                                    user_type:"admit"
                                }
                            })
                        }}
                    >
                        Add Client
                    </Button>
                </Box>
            </Paper>
            {
                (
                    getAllPlatformState.isLoading ||
                    createPlatformState.isLoading ||
                    createUserState.isLoading
                ) && (
                    <Loader show={true} />
                )
            }
        </Box>
    )
}
