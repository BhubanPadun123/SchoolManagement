import React from "react"
import {
    Typography,
    Paper,
    useTheme,
    useMediaQuery,
    Divider,
    TextField,
    FormControl,
    FormLabel,
    Select,
    MenuItem,
    Button
} from "@mui/material"
import {
    Person2,
    MaleOutlined,
    FemaleOutlined,
    OtherHouses,
    EngineeringOutlined,
    PhoneAndroid,
    LocationCity
} from "@mui/icons-material"
import { useParams } from "react-router-dom"
import {
    useLazyUseGetAllPlatformsListQuery
} from "../Redux/actions/setting.action"
import {
    useLazyGetInstitutionClassesQuery
} from "../Redux/actions/classSetup.action"
import {
    Loader
} from "../components/index"
import {
    updateFields,
    resetForm
} from "../Redux/actions/formValue.action"
import { useSelector, useDispatch } from "react-redux"
import _ from "lodash"


export default function StudentsRegistrationForm() {
    const dispatch = useDispatch()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("md"))
    const { data } = useParams()
    const routeData = data && JSON.parse(data)
    const form = useSelector((state) => state.form.state)

    const [getClassAction, getClassState] = useLazyGetInstitutionClassesQuery()
    const [getPlatformActions, getPlatformState] = useLazyUseGetAllPlatformsListQuery()

    React.useEffect(() => {
        if (routeData) {
            let class_id = _.get(routeData, "class_id", null)
            let institution_ref = _.get(routeData, "institution_ref", null)
            getPlatformActions()
            if (class_id && institution_ref) {
                getClassAction({
                    institution_ref: institution_ref
                })
            }
        }
    }, [data])

    const platformInfo = React.useMemo(() => {
        if (getPlatformState.isSuccess) {
            const list = _.get(getPlatformState, "currentData.list", [])
            let findClass = list && Array.isArray(list) && list.find((item) => item.id === routeData.institution_ref)
            return findClass
        } else {
            return null
        }
    }, [getPlatformState])
    const classInfo = React.useMemo(() => {
        if (getClassState.isSuccess) {
            let list = _.get(getClassState, "currentData.list", [])
            let findClass = list && Array.isArray(list) && list.find((item) => item.id === routeData.class_id)
            return findClass
        } else {
            return null
        }
    }, [getClassState])

    if (!classInfo || !platformInfo) {
        return (
            <Paper sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <Typography sx={{
                    fontFamily: "Lato",
                    fontSize: "20",
                    fontWeight: 500,
                    fontStyle: "normal"
                }}>
                    Data not found!
                </Typography>
            </Paper>
        )
    }

    const logo = platformInfo && _.get(platformInfo, "logo", null) ? JSON.parse(_.get(platformInfo, "logo", "{}")) : null

    return (
        <Paper sx={{
            width: "100%",
            height: "auto",
            padding: "8px"
        }}>
            {
                logo && (
                    <div className="col-md-12" style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <img
                            src={_.get(logo, "url", "")}
                            alt="logo"
                            style={{
                                height: "200px",
                                width: "200px"
                            }}
                        />
                    </div>
                )
            }
            <div className="col-md-12">
                <Typography sx={{
                    textAlign: "center",
                    textTransform: "uppercase",
                    fontFamily: "Lato",
                    fontWeight: "bold",
                    fontStyle: "normal",
                    fontSize: "24px"
                }}>
                    {_.get(platformInfo, "name", "")}
                </Typography>
                <div className="col-md-12">
                    <Typography sx={{
                        textAlign: "center",
                        fontFamily: "Lato",
                        fontWeight: 500,
                        fontStyle: "italic",
                        letterSpacing: 2,
                        textTransform: "uppercase"
                    }}>
                        {_.get(platformInfo, "state", "")},
                        {_.get(platformInfo, "district", "")},
                        {_.get(platformInfo, "pin", "")},
                        {_.get(platformInfo, "address", "")}
                    </Typography>
                </div>
            </div>
            <Divider />
            <div className="col-md-12" style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                rowGap: "10px"
            }}>
                <Typography
                    color="primary"
                    sx={{
                        padding: "4px",
                        fontFamily: "Lato",
                        fontWeight: 500,
                        fontStyle: "normal"
                    }}
                >
                    Student Info
                </Typography>
                <TextField
                    placeholder="Enter First Name"
                    variant="outlined"
                    InputProps={{
                        endAdornment: (
                            <Person2 />
                        )
                    }}
                    sx={{
                        width: isMobile ? "100%" : "400px"
                    }}
                    onChange={(e) => {
                        let firstName = e.target.value
                        dispatch(updateFields({ firstName: firstName }))
                    }}
                    value={_.get(form, "firstName", "")}
                />
                <TextField
                    placeholder="Enter Last Name"
                    variant="outlined"
                    InputProps={{
                        endAdornment: (
                            <Person2 />
                        )
                    }}
                    sx={{
                        width: isMobile ? "100%" : "400px"
                    }}
                    onChange={(e) => {
                        let lastName = e.target.value
                        dispatch(updateFields({ lastName: lastName }))
                    }}
                    value={_.get(form, "lastName", "")}
                />
                <FormControl sx={{
                    width: isMobile ? "100%" : "400px"
                }}>
                    <FormLabel>Select Gender</FormLabel>
                    <Select
                        onChange={(e) => {
                            let gender = e.target.value
                            dispatch(updateFields({ gender: gender }))
                        }}
                        value={_.get(form, "gender", "")}
                    >
                        <MenuItem value={"male"} >Male</MenuItem>
                        <MenuItem value={"female"}>Female</MenuItem>
                        <MenuItem value={"other"} >Other</MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{
                    width: isMobile ? "100%" : "400px"
                }}>
                    <FormLabel>Select DOB</FormLabel>
                    <TextField
                        placeholder="Select DOB"
                        variant="outlined"
                        type="date"
                        onChange={(e)=> {
                            let dob = e.target.value
                            dispatch(updateFields({dob:dob}))
                        }}
                        value={_.get(form,"dob","")}
                    />
                </FormControl>
            </div>
            <div className="col-md-12" style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                rowGap: "10px"
            }}>
                <Typography
                    color="primary"
                    sx={{
                        padding: "4px",
                        fontFamily: "Lato",
                        fontWeight: 500,
                        fontStyle: "normal"
                    }}
                >
                    Parent Info
                </Typography>
                <TextField
                    placeholder="Enter Father Name"
                    variant="outlined"
                    InputProps={{
                        endAdornment: (
                            <Person2 />
                        )
                    }}
                    sx={{
                        width: isMobile ? "100%" : "400px"
                    }}
                    onChange={(e)=>{
                        let fName = e.target.value
                        dispatch(updateFields({fName:fName}))
                    }}
                    value={_.get(form,"fName","")}
                />
                <TextField
                    placeholder="Enter Mother Name"
                    variant="outlined"
                    InputProps={{
                        endAdornment: (
                            <Person2 />
                        )
                    }}
                    sx={{
                        width: isMobile ? "100%" : "400px"
                    }}
                    onChange={(e)=> {
                        let mName = e.target.value
                        dispatch(updateFields({mName:mName}))
                    }}
                    value={_.get(form,"mName","")}
                />
                <TextField
                    placeholder="Enter Mother Occupation"
                    variant="outlined"
                    InputProps={{
                        endAdornment: (
                            <EngineeringOutlined />
                        )
                    }}
                    sx={{
                        width: isMobile ? "100%" : "400px"
                    }}
                    onChange={(e)=> {
                        let mOccupation = e.target.value
                        dispatch(updateFields({mOccupation:mOccupation}))
                    }}
                    value={_.get(form,"mOccupation","")}
                />
                <TextField
                    placeholder="Enter Father Occupation"
                    variant="outlined"
                    InputProps={{
                        endAdornment: (
                            <EngineeringOutlined />
                        )
                    }}
                    sx={{
                        width: isMobile ? "100%" : "400px"
                    }}
                    onChange={(e)=> {
                        let fOccupation = e.target.value
                        dispatch(updateFields({fOccupation:fOccupation}))
                    }}
                    value={_.get(form,"fOccupation","")}
                />
                <TextField
                    placeholder="Enter Father/Mother Contact Number"
                    variant="outlined"
                    InputProps={{
                        endAdornment: (
                            <PhoneAndroid />
                        ),
                        startAdornment: (
                            <Typography>
                                +91-
                            </Typography>
                        )
                    }}
                    sx={{
                        width: isMobile ? "100%" : "400px"
                    }}
                    onChange={(e)=> {
                        let pContact = e.target.value
                        dispatch(updateFields({pContact:pContact}))
                    }}
                    value={_.get(form,"pContact","")}
                />

            </div>
            <div className="col-md-12" style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                rowGap: "10px"
            }}>
                <Typography
                    color="primary"
                    sx={{
                        padding: "4px",
                        fontFamily: "Lato",
                        fontWeight: 500,
                        fontStyle: "normal"
                    }}
                >
                    Address Info
                </Typography>
                <TextField
                    placeholder="Enter State Name"
                    variant="outlined"
                    InputProps={{
                        endAdornment: (
                            <LocationCity />
                        )
                    }}
                    sx={{
                        width: isMobile ? "100%" : "400px"
                    }}
                    onChange={(e) => {
                        let state = e.target.value
                        dispatch(updateFields({state:state}))
                    }}
                    value={_.get(form,"state","")}
                />
                <TextField
                    placeholder="Enter District Name"
                    variant="outlined"
                    InputProps={{
                        endAdornment: (
                            <LocationCity />
                        )
                    }}
                    sx={{
                        width: isMobile ? "100%" : "400px"
                    }}
                    onChange={(e)=> {
                        let district = e.target.value
                        dispatch(updateFields({district:district}))
                    }}
                    value={_.get(form,"district","")}
                />
                <TextField
                    placeholder="Enter PinCode"
                    variant="outlined"
                    InputProps={{
                        endAdornment: (
                            <LocationCity />
                        )
                    }}
                    sx={{
                        width: isMobile ? "100%" : "400px"
                    }}
                    type="number"
                    onChange={(e)=> {
                        let pinCode = e.target.value
                        dispatch(updateFields({pinCode:pinCode}))
                    }}
                    value={_.get(form,"pinCode","")}
                />
                <TextField
                    placeholder="Enter Full Address"
                    variant="outlined"
                    InputProps={{
                        endAdornment: (
                            <LocationCity />
                        )
                    }}
                    sx={{
                        width: isMobile ? "100%" : "400px"
                    }}
                    onChange={(e)=> {
                        let village = e.target.value
                        dispatch(updateFields({village:village}))
                    }}
                    value={_.get(form,"village","")}
                />
            </div>
            <div className="col-md-12" style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                rowGap: "10px"
            }}>
                <Typography
                    color="primary"
                    sx={{
                        padding: "4px",
                        fontFamily: "Lato",
                        fontWeight: 500,
                        fontStyle: "normal"
                    }}
                >
                    Upload Documents
                </Typography>
                <FormControl sx={{
                    width:isMobile ? "100%" : "400px"
                }}>
                    <FormLabel>Select Photo</FormLabel>
                    <TextField 
                       type="file"
                       variant="outlined"
                       placeholder="Select Photo"
                    />
                </FormControl>
                <FormControl sx={{
                    width:isMobile ? "100%" : "400px"
                }}>
                    <FormLabel>Select Aadhar</FormLabel>
                    <TextField 
                       type="file"
                       variant="outlined"
                       placeholder="Select Aadhar Card"
                    />
                </FormControl>
                <Button
                    variant="contained"
                >
                    SUBMIT
                </Button>
            </div>
            {
                (
                    getClassState.isLoading ||
                    getPlatformState.isLoading
                ) && (
                    <Loader show={true} />
                )
            }
        </Paper>
    )
}