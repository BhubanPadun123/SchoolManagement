import React, { useRef } from "react"
import {
    Box,
    Grid,
    Paper,
    TextField,
    Typography,
    MenuItem,
    Divider,
    Button,
    useMediaQuery,
    useTheme,
    FormControl,
    FormControlLabel,
    Select,
    InputLabel,
    Modal
} from "@mui/material"
import { makeStyles } from "@mui/styles"
import {
    Female,
    Male,
    Person,
    PersonAddAlt,
    CalendarMonthOutlined,
    EngineeringOutlined,
    PhoneInTalkOutlined,
    AddLocationOutlined,
    Check,
    Email
} from "@mui/icons-material"
import { Others } from "@rsuite/icons"
import {
    Loader
} from "../components/index"
import {
    useLazyGetInstitutionMetadataQuery,
    useLazyGetUserInstitutionQuery,
    useLazyGetAllFeeQuery,
} from "../Redux/actions/setting.action"
import {
    useLazyGetAllAdmissionLinkQuery,
    useRegisterStudentMutation
} from "../Redux/actions/admissionSetup.action"
import {
    useUploadImageMutation
} from "../Redux/actions/upload_content"
import {
    useLazyGetInstitutionClassesQuery
} from "../Redux/actions/classSetup.action"
import {
    useDownloadRegistrationPdfMutation
} from "../Redux/actions/download.action"
import { updateFields, resetForm } from "../Redux/actions/formValue.action"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import _ from "lodash"
import { Message, toaster } from "rsuite"


const useStyles = makeStyles(() => ({
    title: {
        fontFamily: "Lato",
        fontWeight: 500,
        letterSpacing: 2,
        fontSize: "20px",
        color: "#2e0a0aff",
        textAlign: "center",
        padding: "4px"
    },
    menuItem: {
        margin: 0,
        padding: 2,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "10px"
    }
}))


export default function StudentsRegistrationForm() {
    const dispatch = useDispatch()
    const classes = useStyles()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("md"))
    const params = useParams()
    const paramsData = params && params?.data && JSON.parse(params.data)

    const [selectedImage, setImage] = React.useState(null)
    const [selectedDOB, setSelectedDOB] = React.useState(null)
    const [isUploadImage, setIsUploadImage] = React.useState(null)
    const [isUploadDOB, setIsuploadDOB] = React.useState(null)

    const class_ref = _.get(paramsData, "class_id", null)
    const institution_id = _.get(paramsData, "institution_ref", null)
    const link_id = _.get(paramsData, "link_id", null)


    const [getAllLinkAction, getAllLinkState] = useLazyGetAllAdmissionLinkQuery()
    const [getPlatformAction, getPlatformState] = useLazyGetUserInstitutionQuery()
    const [uploadAction, uploadState] = useUploadImageMutation()
    const [getPlatformMetaDataAction, getPlatformMetadataState] = useLazyGetInstitutionMetadataQuery()
    const [registerAction, registerState] = useRegisterStudentMutation()
    const [getClassesAction, getClassesState] = useLazyGetInstitutionClassesQuery()
    const [downloadPdfAction, downloadPdfState] = useDownloadRegistrationPdfMutation()

    const { form } = useSelector((state) => state)


    const downloadStatus = React.useMemo(() => {
        if (downloadPdfState.isSuccess) {
            try {
                const blob = _.get(downloadPdfState, "data", null)
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement("a")
                a.href = url
                a.download = "Registration.pdf"
                document.body.appendChild(a)
                a.click()
                downloadPdfState.reset()
                dispatch(resetForm())
            } catch (error) {
                console.log(error)
                downloadPdfState.reset()
            }
        }
        if(downloadPdfState.isError){
            toaster.push(<Message type="error" >Something went wrong!while download response.</Message>,{placement:"topCenter"})
            downloadPdfState.reset()
        }
    }, [downloadPdfState])
    React.useEffect(() => {
        if (class_ref && institution_id) {
            getAllLinkAction({
                institution_ref: institution_id
            })
            getPlatformAction(institution_id)
            getClassesAction({ institution_ref: institution_id })
        }
        return () => {
            dispatch(resetForm())
        }
    }, [class_ref, institution_id])

    const platformData = React.useMemo(() => {
        if (getPlatformState.isSuccess) {
            let data = _.get(getPlatformState, "currentData.data", null)
            if (!data) return null
            return {
                ...data
            }
        } else {
            return null
        }
    }, [getPlatformState])


    React.useEffect(() => {
        if (uploadState.isSuccess) {
            if (selectedDOB) {
                let selectedFileName = _.get(selectedDOB, "name", null)
                let uploadedFileName = _.get(uploadState, "originalArgs.file.name", {})
                if (selectedFileName && uploadedFileName && selectedFileName === uploadedFileName) {
                    setIsuploadDOB(true)
                    let imgData = _.get(uploadState, "data", null)
                    setSelectedDOB(imgData)
                    const images = _.get(form, "state.images", {})
                    dispatch(updateFields({
                        images: {
                            ...images,
                            dob: imgData
                        }
                    }))
                }
            }
            if (selectedImage) {
                let selectedFileName = _.get(selectedImage, "name", null)
                let uploadedFileName = _.get(uploadState, "originalArgs.file.name", {})
                if (selectedFileName && uploadedFileName && selectedFileName === uploadedFileName) {
                    setIsUploadImage(true)
                    let imgData = _.get(uploadState, "data", null)
                    setImage(imgData)
                    const images = _.get(form, "state.images", {})
                    dispatch(updateFields({
                        images: {
                            ...images,
                            photo: imgData
                        }
                    }))
                }
            }
        }
    }, [uploadState])

    function handleSubmit() {
        let firstname = _.get(form, "state.firstname", null)
        let lastname = _.get(form, "state.lastname", null)
        let district = _.get(form, "state.district", null)
        let dob = _.get(form, "state.dob", null)
        let fatherName = _.get(form, "state.fatherName", null)
        let fatherOccupation = _.get(form, "state.fatherOccupation", null)
        let gender = _.get(form, "state.gender", null)
        let motherName = _.get(form, "state.motherName", null)
        let motherOccupation = _.get(form, "state.motherOccupation", null)
        let pContactNumber = _.get(form, "state.pContactNumber", null)
        let pinCode = _.get(form, "state.pinCode", null)
        let po = _.get(form, "state.po", null)
        let state = _.get(form, "state.state", null)
        let village = _.get(form, "state.village", null)
        let photo = _.get(form, "state.images.photo", null)
        let dobCerfiticate = _.get(form, "state.images.dob", null)
        let email = _.get(form, "state.email", null)
        const data = {
            village,
            state,
            po,
            pinCode,
            pContactNumber,
            motherName,
            motherOccupation,
            gender,
            fatherName,
            fatherOccupation,
            dob,
            firstname,
            lastname,
            district,
            photo: photo ? JSON.stringify(photo) : "",
            dobCerfiticate: dobCerfiticate ? JSON.stringify(dobCerfiticate) : "",
            email
        }
        let isMissing = false
        Object.entries(data).map(([key, val]) => {
            if (!val) {
                toaster.push(<Message>{`${key} field value is missing`}</Message>)
                isMissing = true
            }
        })
        if (isMissing) return
        registerAction({
            firstname: firstname,
            lastname: lastname,
            fathername: fatherName,
            mothername: motherName,
            cnumber: "notProvided",
            pnumber: pContactNumber,
            email: email,
            fatherOccupation: fatherOccupation,
            motherOccupation: motherOccupation,
            age: dob,
            gender: gender,
            lastExamination: "not provide",
            year: "not provide",
            division: "not provide",
            markObtain: "not provide",
            meta_data: {
                user_type: "student",
                user_platform: institution_id,
                photo: photo ? JSON.stringify(photo) : "",
                dobCerfiticate: dobCerfiticate ? JSON.stringify(dobCerfiticate) : ""
            },
            class_ref: class_ref,
            institution_ref: institution_id
        })
    }

    var isRegisterSuccess = React.useMemo(() => {
        if (registerState.isSuccess) {
            const message = _.get(registerState, "data.message", "")
            const info = _.get(registerState, "data.data", null)
            dispatch(updateFields({
                registeredInfo: info,
                showDownload: true
            }))
            toaster.push(<Message type="success" >{message}</Message>, { placement: "topCenter" })
            registerState.reset()
            return true
        }
        if (registerState.isError) {
            dispatch(updateFields({
                registeredInfo: {},
                showDownload: false
            }))
            let errorMessage = _.get(registerState, "error.data.detail")
            toaster.push(<Message type="error" >{errorMessage ? errorMessage : "Error while register,Please try again after sometime!"}</Message>, { placement: "topCenter" })
            registerState.reset()
            return false
        }
        else {
            return false
        }
    }, [registerState])


    if (!platformData) {
        return (
            <Paper sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <Typography>Link Not Found!</Typography>
            </Paper>
        )
    }

    const logo = platformData && JSON.parse(_.get(platformData, "logo", "{}"))

    return (
        <Paper sx={{
            paddingBottom: "40px",
            paddingTop: "40px"
        }}>
            {
                logo && (
                    <div className="col-md-12" style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <img
                            src={logo.url}
                            style={{
                                width: "200px",
                                height: "200px"
                            }}
                        />
                    </div>
                )
            }
            <Typography variant="h4" sx={{
                fontFamily: "Lato",
                textAlign: "center",
                fontWeight: 500,
                letterSpacing: 1.2,
                padding: "8px"
            }} >
                {
                    _.get(platformData, "name", "").toUpperCase()
                }
            </Typography>
            <div className="col-md-12">
                <Typography sx={{
                    textAlign: "center",
                    fontFamily: "Lato",
                    fontWeight: 500,
                    fontSize: "14px",
                    fontStyle: "italic",
                    letterSpacing: 3
                }}>
                    {_.get(platformData, "state", "").toUpperCase()},
                    {_.get(platformData, "district", "").toUpperCase()},
                    {_.get(platformData, "pin", "")},
                    {_.get(platformData, "address", null).toUpperCase()}
                </Typography>
            </div>
            <Divider />
            <div style={{
                display: "flex",
                flexDirection: 'column',
                alignItems: "center",
                justifyContent: "center",
                rowGap: "8px"
            }}>
                <Typography className={classes.title} >
                    Student Details
                </Typography>
                <TextField
                    placeholder="Enter First Name"
                    variant="outlined"
                    focused
                    sx={{
                        width: isMobile ? "100%" : "50%"
                    }}
                    InputProps={{
                        endAdornment: (
                            <Person />
                        )
                    }}
                    onChange={(e) => {
                        let firstname = e.target.value
                        dispatch(updateFields({ firstname: firstname }))
                    }}
                    value={_.get(form, "state.firstname", "")}
                />
                <TextField
                    placeholder="Enter Last Name"
                    variant="outlined"
                    focused
                    sx={{
                        width: isMobile ? "100%" : "50%"
                    }}
                    InputProps={{
                        endAdornment: (
                            <PersonAddAlt />
                        )
                    }}
                    onChange={(e) => {
                        let lastname = e.target.value
                        dispatch(updateFields({ lastname: lastname }))
                    }}
                    value={_.get(form, "state.lastname", "")}
                />
                <TextField
                    placeholder="Enter Email Address"
                    variant="outlined"
                    focused
                    sx={{
                        width: isMobile ? "100%" : "50%"
                    }}
                    InputProps={{
                        endAdornment: (
                            <Email />
                        )
                    }}
                    onChange={(e) => {
                        let email = e.target.value
                        dispatch(updateFields({ email: email }))
                    }}
                    value={_.get(form, "state.email", "")}
                />
                <TextField
                    placeholder="Enter DOB"
                    variant="outlined"
                    focused
                    sx={{
                        width: isMobile ? "100%" : "50%"
                    }}
                    type="date"
                    onChange={(e) => {
                        let dob = e.target.value
                        dispatch(updateFields({ dob: dob }))
                    }}
                    value={_.get(form, "state.dob", "")}
                />
                <FormControl sx={{
                    width: isMobile ? "100%" : "50%"
                }}>
                    <InputLabel>Select Gender</InputLabel>
                    <Select
                        value={_.get(form, "state.gender", "")}
                        label={"Select Gender"}
                        onChange={(e) => {
                            let gender = e.target.value
                            dispatch(updateFields({ gender: gender }))
                        }}
                    >
                        <MenuItem value={"male"} className={classes.menuItem} >
                            <Male />
                            <Typography>
                                Male
                            </Typography>
                        </MenuItem>
                        <MenuItem value={"female"} className={classes.menuItem} >
                            <Female />
                            <Typography>
                                Female
                            </Typography>
                        </MenuItem>
                        <MenuItem value={"other"} className={classes.menuItem} >
                            <Others />
                            <Typography>Others</Typography>
                        </MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div style={{
                display: "flex",
                flexDirection: 'column',
                alignItems: "center",
                justifyContent: "center",
                rowGap: "8px"
            }}>
                <Typography className={classes.title}>
                    Parent Details
                </Typography>
                <TextField
                    placeholder="Enter Father Name"
                    variant="outlined"
                    sx={{
                        width: isMobile ? "100%" : "50%"
                    }}
                    InputProps={{
                        endAdornment: (
                            <Male />
                        )
                    }}
                    onChange={(e) => {
                        let fatherName = e.target.value
                        dispatch(updateFields({ fatherName: fatherName }))
                    }}
                    value={_.get(form, "state.fatherName")}
                />
                <TextField
                    placeholder="Enter Mother Name"
                    variant="outlined"
                    sx={{
                        width: isMobile ? "100%" : "50%"
                    }}
                    InputProps={{
                        endAdornment: (
                            <Female />
                        )
                    }}
                    onChange={(e) => {
                        let motherName = e.target.value
                        dispatch(updateFields({ motherName: motherName }))
                    }}
                    value={_.get(form, "state.motherName", "")}
                />
                <TextField
                    placeholder="Enter Father Occupation"
                    variant="outlined"
                    sx={{
                        width: isMobile ? "100%" : "50%"
                    }}
                    InputProps={{
                        endAdornment: (
                            <EngineeringOutlined />
                        )
                    }}
                    onChange={(e) => {
                        let fatherOccupation = e.target.value
                        dispatch(updateFields({ fatherOccupation: fatherOccupation }))
                    }}
                    value={_.get(form, "state.fatherOccupation")}
                />
                <TextField
                    placeholder="Enter Mother Occupation"
                    variant="outlined"
                    sx={{
                        width: isMobile ? "100%" : "50%"
                    }}
                    InputProps={{
                        endAdornment: (
                            <EngineeringOutlined />
                        )
                    }}
                    onChange={(e) => {
                        let motherOccupation = e.target.value
                        dispatch(updateFields({ motherOccupation: motherOccupation }))
                    }}
                    value={_.get(form, "state.motherOccupation", "")}
                />
                <TextField
                    placeholder="Enter Father or Mother Contact Number"
                    variant="outlined"
                    sx={{
                        width: isMobile ? "100%" : "50%"
                    }}
                    InputProps={{
                        endAdornment: (
                            <PhoneInTalkOutlined />
                        ),
                        startAdornment: (
                            <Typography>
                                +91
                            </Typography>
                        )
                    }}
                    type="number"
                    onChange={(e) => {
                        let pContactNumber = e.target.value
                        dispatch(updateFields({ pContactNumber: pContactNumber }))
                    }}
                    value={_.get(form, "state.pContactNumber", "")}
                />
            </div>
            <div style={{
                display: "flex",
                flexDirection: 'column',
                alignItems: "center",
                justifyContent: "center",
                rowGap: "8px"
            }}>
                <Typography className={classes.title}>
                    Address Details
                </Typography>
                <TextField
                    placeholder="Enter State Name"
                    variant="outlined"
                    sx={{
                        width: isMobile ? "100%" : "50%"
                    }}
                    InputProps={{
                        endAdornment: (
                            <AddLocationOutlined />
                        )
                    }}
                    onChange={(e) => {
                        let state = e.target.value
                        dispatch(updateFields({ state: state }))
                    }}
                    value={_.get(form, "state.state", "")}
                />
                <TextField
                    placeholder="Enter District Name"
                    variant="outlined"
                    sx={{
                        width: isMobile ? "100%" : "50%"
                    }}
                    InputProps={{
                        endAdornment: (
                            <AddLocationOutlined />
                        )
                    }}
                    onChange={(e) => {
                        let district = e.target.value
                        dispatch(updateFields({ district: district }))
                    }}
                    value={_.get(form, "state.district", "")}
                />
                <TextField
                    placeholder="Enter PO"
                    variant="outlined"
                    sx={{
                        width: isMobile ? "100%" : "50%"
                    }}
                    InputProps={{
                        endAdornment: (
                            <AddLocationOutlined />
                        )
                    }}
                    onChange={(e) => {
                        let po = e.target.value
                        dispatch(updateFields({ po: po }))
                    }}
                    value={_.get(form, "state.po", "")}
                />
                <TextField
                    placeholder="Enter PinCode"
                    variant="outlined"
                    sx={{
                        width: isMobile ? "100%" : "50%"
                    }}
                    InputProps={{
                        endAdornment: (
                            <AddLocationOutlined />
                        )
                    }}
                    type="number"
                    onChange={(e) => {
                        let pinCode = e.target.value
                        dispatch(updateFields({ pinCode: pinCode }))
                    }}
                    value={_.get(form, "state.pinCode", "")}
                />
                <TextField
                    placeholder="Enter Village Name"
                    variant="outlined"
                    sx={{
                        width: isMobile ? "100%" : "50%"
                    }}
                    InputProps={{
                        endAdornment: (
                            <AddLocationOutlined />
                        )
                    }}
                    onChange={(e) => {
                        let village = e.target.value
                        dispatch(updateFields({ village: village }))
                    }}
                    value={_.get(form, "state.village", "")}
                />
            </div>
            <div style={{
                display: "flex",
                flexDirection: 'column',
                alignItems: "center",
                justifyContent: "center",
                rowGap: "8px"
            }}>
                <Typography className={classes.title}>Upload Documents</Typography>
                <TextField
                    placeholder="Upload Photo"
                    variant="outlined"
                    focused
                    sx={{
                        width: isMobile ? "100%" : "50%"
                    }}
                    InputProps={{
                        endAdornment: isUploadImage ? (
                            <Check />
                        ) : (
                            <Typography sx={{
                                width: "100%",
                                textAlign: "right"
                            }}>
                                Upload Photo
                            </Typography>
                        )
                    }}
                    type="file"
                    inputProps={{
                        accept: "image/*"
                    }}
                    onChange={(e) => {
                        const file = e.target.files[0]
                        setImage(file)
                        // setSelectedDOB(null)
                        uploadAction({ file })
                    }}
                />
                <TextField
                    placeholder="Upload DOB Certificate"
                    variant="outlined"
                    focused
                    sx={{
                        width: isMobile ? "100%" : "50%"
                    }}
                    InputProps={{
                        endAdornment: isUploadDOB ? (
                            <Check />
                        ) : (
                            <Typography sx={{
                                width: "100%",
                                textAlign: "right"
                            }}>
                                Upload DOB Certificate
                            </Typography>
                        )
                    }}
                    type="file"
                    inputProps={{
                        accept: "application/pdf"
                    }}
                    onChange={(e) => {
                        const file = e.target.files[0]
                        setSelectedDOB(file)
                        // setImage(null)
                        uploadAction({ file })
                    }}
                />
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
            </div>
            <Modal
                open={_.get(form, "state.showDownload", false)}
                onClose={() => {
                    dispatch(updateFields({
                        showDownload: false
                    }))
                }}
                sx={{
                    width: "100%",
                    height: "100%",
                }}
            >
                <div style={{
                    width: "100",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px"
                }}>
                    <Typography variant="h4" sx={{
                        fontFamily: "Lato",
                        fontWeight: "bold",
                        fontStyle: "normal",
                        textAlign: "center",
                        padding: "4px"
                    }}>
                        Download
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => {
                            let formData = _.get(form, "state.registeredInfo", null)
                            console.log(formData, "<-------")
                            if (formData) {
                                let photo = _.get(formData, "meta_data.photo", null) ? JSON.parse(_.get(formData, "meta_data.photo", "{}")).url : ""
                                let dobCerfiticate = _.get(formData, "meta_data.dobCerfiticate", null) ? JSON.parse(_.get(formData, "meta_data.dobCerfiticate", "{}")).url : ""
                                let {
                                    firstname,
                                    lastname,
                                    fathername,
                                    mothername,
                                    cnumber,
                                    pnumber,
                                    email,
                                    fatherOccupation,
                                    motherOccupation,
                                    dob: age,
                                    gender,
                                    lastExamination,
                                    year,
                                    division,
                                    markObtain,
                                    id,
                                } = formData
                                const data = {
                                    firstname,
                                    lastname,
                                    fathername,
                                    mothername,
                                    cnumber,
                                    pnumber,
                                    email,
                                    fatherOccupation,
                                    motherOccupation,
                                    dob: formData.age,
                                    gender,
                                    lastExamination,
                                    year,
                                    division,
                                    markObtain,
                                    id,
                                    photo,
                                    dobCerfiticate
                                }
                                downloadPdfAction(data)
                            }
                        }}
                    >
                        Download
                    </Button>
                </div>
            </Modal>
            {
                (
                    getAllLinkState.isLoading ||
                    getPlatformState.isLoading ||
                    uploadState.isLoading ||
                    registerState.isLoading ||
                    getClassesState.isLoading ||
                    downloadPdfState.isLoading
                ) && (
                    <Loader show={true} />
                )
            }
        </Paper>
    )
}