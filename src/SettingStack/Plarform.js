import React, {
    useState,
    useEffect,
    useMemo
} from "react";
import {
    Text,
    Button,
    Input,
    Panel,
    Tabs,
    Uploader,
    useToaster,
} from "rsuite";
import "./platform.css"
import InstitutionMembers from "./components/institutionMember"
import CameraRetroIcon from '@rsuite/icons/legacy/CameraRetro'
import { useNavigate } from "react-router-dom"
import {
    useCreatePlatformMutation
} from "../Redux/actions/setting.action"
import {
    ToastMessage,
    ConfirmationAlert,
    Loader
} from "../components/index"
import {
    useGetUserInstitutionQuery,
    useLazyGetUserInstitutionQuery,
    useUpdateInstitutionToUserAccountMutation,
    useCreateInstitutionMetadataMutation,
    useLazyGetInstitutionMetadataQuery,
    useUpdateInstitutionMetadataMutation,
    useUpdateInstitutionMutation
} from "../Redux/actions/setting.action"
import {
    useUploadImageMutation
} from "../Redux/actions/upload_content"

function PlatformSetup() {
    const toaster = useToaster()
    const navigation = useNavigate()
    const [user, setUser] = useState(null)
    const [state, setState] = React.useState({
        setup_step: "new_institution",
    })
    const [status, setStatus] = useState(null)


    const [alert, setAlert] = React.useState({
        show: false,
        message: "",
        type: "info",
        duration: "",
        alert_type: ""
    })
    const [institution, setInstitution] = React.useState({
        name: "",
        logo: "",
        state: "",
        district: "",
        pin: "",
        address: ""
    })
    const [institutionMetadata, setMetadata] = React.useState({
        institutionCode: "",
        institutionEmail: "",
        institutionContact: "",
        institutionType: "",
        establishmentYear: "",
        board: ""
    })
    const [createPlatform, createState] = useCreatePlatformMutation()
    const [getUserInstitutionAction, getUserInstitution] = useLazyGetUserInstitutionQuery()
    const [updateInstitutionToUserAccountAction, updateUserInstitutionState] = useUpdateInstitutionToUserAccountMutation()
    const [createInstitutionMetadataAction, createInstitutionMetadataState] = useCreateInstitutionMetadataMutation()
    const [getMetadataAction, metaDataState] = useLazyGetInstitutionMetadataQuery()
    const [updateInstitutionAction, updateInstitionState] = useUpdateInstitutionMutation()
    const [updateMetadataAction, updateMetadataState] = useUpdateInstitutionMetadataMutation()
    const [uploadImageAction, uploadImageState] = useUploadImageMutation()



    const metaDataStatus = useMemo(() => {
        if (metaDataState.isSuccess) {
            const meta_data = metaDataState.currentData?.metadata
            if (meta_data) {
                return {
                    ...meta_data,
                    api_data: "true"
                }
            } else {
                return {
                    ...institutionMetadata,
                    api_data: "false"
                }
            }
        }
        if (metaDataState.isError) {
            return {
                ...institutionMetadata,
                api_data: "false"
            }
        }
    }, [metaDataState])
    useEffect(() => {
        if (metaDataStatus) {
            if (metaDataStatus.hasOwnProperty("meta_data")) {
                setMetadata(metaDataStatus.meta_data)
            } else {
                setMetadata(metaDataStatus)
            }
        }
    }, [metaDataStatus])

    const createMetadataStatus = useMemo(() => {
        if (createInstitutionMetadataState.isSuccess) {
            return {
                show: true,
                message: createInstitutionMetadataState.data.message,
                type: "success",
                redirect: null
            }
        }
        if (createInstitutionMetadataState.isError) {
            return {
                show: true,
                message: createInstitutionMetadataState.error.data?.detail,
                type: "error",
                redirect: null
            }
        }
    }, [createInstitutionMetadataState])
    useEffect(() => {
        if (createMetadataStatus) {
            setStatus(createMetadataStatus)
        }
    }, [createMetadataStatus])
    const institutionBasicInfo = useMemo(() => {
        if (getUserInstitution.isSuccess) {
            if (getUserInstitution.currentData?.data) {
                return {
                    ...getUserInstitution.currentData.data,
                    api_data: "true"
                }
            } else {
                return {
                    address: "",
                    district: "",
                    logo: "",
                    name: "",
                    pin: "",
                    state: "",
                    api_data: "false"
                }
            }
        } else {
            return {
                address: "",
                district: "",
                logo: "",
                name: "",
                pin: "",
                state: "",
                api_data: "false"
            }
        }
    }, [getUserInstitution])

    useEffect(() => {
        if (institutionBasicInfo) {
            setInstitution(institutionBasicInfo)
        }
    }, [institutionBasicInfo])

    const addInstitutionToUserAccountState = useMemo(() => {
        if (updateUserInstitutionState.isSuccess) {
            if (updateUserInstitutionState.data?.user) {
                const {
                    meta_data
                } = updateUserInstitutionState.data.user
                if (meta_data && meta_data.hasOwnProperty("user_platform")) {
                    const id = meta_data.user_platform
                    id && getUserInstitutionAction(id)
                    id && getMetadataAction(id)

                    return {
                        show: true,
                        message: updateUserInstitutionState.data?.message,
                        type: "success",
                        redirect: null
                    }
                } else {
                    return {
                        show: true,
                        message: "Platform is created but,cloud not able to update to your account!",
                        type: "info",
                        redirect: null
                    }
                }
            } else {
                return {
                    show: true,
                    message: "Institution being created but not able to add your account!",
                    type: "warning",
                    redirect: null
                }
            }
        }
    }, [updateUserInstitutionState])
    useEffect(() => {
        if (addInstitutionToUserAccountState) {
            setStatus(addInstitutionToUserAccountState)
        }
    }, [addInstitutionToUserAccountState])

    useEffect(() => {
        const fetchUser = async () => {
            const userData = await localStorage.getItem("current_user")
            if (userData) {
                const userInfo = JSON.parse(userData)
                if (userInfo && userInfo.user_data) {
                    setUser(userInfo.user_data)
                    const { meta_data } = userInfo.user_data
                    if (meta_data && meta_data.hasOwnProperty("user_platform")) {
                        const id = meta_data.user_platform
                        id && getUserInstitutionAction(id)
                        id && getMetadataAction(id)
                    }
                }
            } else {
                navigation("/auth/login")
            }
        }
        fetchUser()
    }, [])

    React.useEffect(() => {
        const handleAlert = () => {
            if (createState.isError) {
                setAlert({
                    message: createState.error.message,
                    type: "error",
                    show: true
                })
            }
            if (createState.isSuccess) {
                if (user && createState.data.info) {
                    const updateData = {
                        email: user.email,
                        meta_data: {
                            ...user.meta_data,
                            "user_platform": createState.data.info.id
                        }
                    }
                    updateInstitutionToUserAccountAction(updateData)
                }
                setAlert({
                    message: createState.data.message,
                    type: "success",
                    show: true
                })
            }
        }
        handleAlert()
        return () => {
            createState.reset()
        }
    }, [createState])

    const handleCreatePlatform = () => {
        const data = institution

        const isNullPresent = Object.entries(data).find((item) => !item[1])


        if (isNullPresent) {
            setAlert({
                show: true,
                message: `${isNullPresent[0]} field value is missing`,
                type: "info",
                duration: 1000,
                alert_type: "toast"
            })
        } else {
            createPlatform(data)
        }
    }

    function updateMetadata() {
        const data = institutionMetadata

        const isNullPresent = Object.entries(data).find((item) => !item[1])
        if (isNullPresent) {
            setAlert({
                show: true,
                message: `${isNullPresent[0]} field value is missing`,
                type: "info",
                duration: 1000,
                alert_type: "toast"
            })
        } else {
            if (institutionBasicInfo && institutionBasicInfo.id) {
                const id = institutionBasicInfo.id
                createInstitutionMetadataAction({ platform_id: id, meta_data: data })
            }
        }
    }

    function updateInstition() {
        if (institutionBasicInfo && institutionBasicInfo.id) {
            const id = institutionBasicInfo.id
            const data = {
                ...institution
            }

            const isNullPresent = Object.entries(data).find((item) => !item[1])


            if (isNullPresent) {
                setAlert({
                    show: true,
                    message: `${isNullPresent[0]} field value is missing`,
                    type: "info",
                    duration: 1000,
                    alert_type: "toast"
                })
            } else {
                delete data.id
                delete data.api_data

                updateInstitutionAction({ id: id, data: { ...data } })
            }

        }
    }
    const updateInstitionStatus = useMemo(() => {
        if (updateInstitionState.isSuccess) {
            if (institutionBasicInfo && institutionBasicInfo.id) {
                const id = institutionBasicInfo.id
                id && getUserInstitutionAction(id)
                id && getMetadataAction(id)
            }
            return {
                show: true,
                message: updateInstitionState.data?.message,
                type: "success",
                redirect: null
            }
        }
        if (updateInstitionState.isError) {
            return {
                show: true,
                message: "Error while update,Please try again after sometime! ",
                type: "error",
                redirect: null
            }
        }
    }, [updateInstitionState])
    useEffect(() => {
        if (updateInstitionStatus) {
            setStatus(updateInstitionStatus)
        }
    }, [updateInstitionStatus])

    function updateInstitionMetadata() {
        if (metaDataStatus && metaDataStatus.id) {
            const id = metaDataStatus.id
            const data = {
                ...institutionMetadata
            }
            const isNullPresent = Object.entries(data).find((item) => !item[1])


            if (isNullPresent) {
                setAlert({
                    show: true,
                    message: `${isNullPresent[0]} field value is missing`,
                    type: "info",
                    duration: 1000,
                    alert_type: "toast"
                })
            } else {
                updateMetadataAction({ platform_id: id, meta_data: { ...data } })
            }

        }
    }

    const uploadMetadataStatus = useMemo(() => {
        if (updateMetadataState.isSuccess) {
            if (institutionBasicInfo && institutionBasicInfo.id) {
                const id = institutionBasicInfo.id
                id && getUserInstitutionAction(id)
                id && getMetadataAction(id)
            }
            return {
                show: true,
                message: updateMetadataState.data?.message,
                type: "success",
                redirect: null
            }
        }
        if (updateMetadataState.isError) {
            return {
                show: true,
                message: "Error while update,Please try again after sometime! ",
                type: "error",
                redirect: null
            }
        }
    }, [updateMetadataState])

    useEffect(() => {
        if (uploadMetadataStatus) {
            setStatus(uploadMetadataStatus)
        }
    }, [uploadMetadataStatus])

    const uploadImageStatus = useMemo(() => {
        if (uploadImageState.isSuccess) {
            setInstitution((prevState) => ({ ...prevState, logo: JSON.stringify(uploadImageState.data) }))
            return {
                show: true,
                message: uploadImageState.data.message,
                type: "success"
            }
        }
        if (uploadImageState.isError) {
            return {
                show: true,
                message: "Error while upload the image",
                type: "error"
            }
        }
    }, [uploadImageState])

    useEffect(()=>{
        if(uploadImageStatus){
            setStatus(uploadImageStatus)
        }
    },[uploadImageStatus])

    console.log({
        institution
    })

    return (
        <div className="sub__container">
            <Tabs defaultActiveKey={state.setup_step} appearance="pills" style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
            }} onSelect={(val, e) => {
                e.preventDefault()
                setState((prevState) => ({
                    ...prevState,
                    setup_step: val
                }))
            }} >
                <Tabs.Tab eventKey="new_institution" title="Create New Institution" />
                <Tabs.Tab eventKey="metadata_institution" title="Add Institution Metadata" />
                <Tabs.Tab eventKey="member_institution" title="Add Member" />
            </Tabs>
            {
                state.setup_step === "new_institution" && (
                    <Panel
                        bordered
                        style={{
                            backgroundColor: "#1E1E2F",
                            borderRadius: 12,
                            padding: 30,
                            maxWidth: 500,
                            margin: "auto",
                            boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                        }}
                    >
                        <Text
                            style={{
                                display: "block",
                                textAlign: "center",
                                fontSize: 20,
                                color: "#FFF",
                                fontFamily: "Lato",
                                fontWeight: 600,
                                marginBottom: 4,
                            }}
                        >
                            New Institution Setup
                        </Text>

                        <Text
                            style={{
                                display: "block",
                                textAlign: "center",
                                fontSize: 14,
                                color: "#D1D1D1",
                                marginBottom: 8,
                            }}
                        >
                            Please fill in the following details to complete your institution
                            setup process.
                        </Text>

                        <div className="form__group" style={{ marginBottom: 15 }}>
                            <Text style={{ color: "#FFF", fontSize: 14 }}>Upload Institute Logo</Text>
                            {
                                institution.logo ? (
                                    <img
                                        style={{
                                            height: "140px",
                                            width: "140px",
                                            borderRadius:"8px"
                                        }}
                                        src={JSON.parse(institution.logo).url}
                                    />
                                ) : (
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0]
                                            uploadImageAction({ file })
                                        }}
                                    />
                                )
                            }
                        </div>

                        <div className="form__group" style={{ marginBottom: 15 }}>
                            <Text style={{ color: "#FFF", fontSize: 14 }}>Institution Name</Text>
                            <Input
                                placeholder="Enter institution name"
                                value={institution.name}
                                onChange={(e) => {
                                    setInstitution((prevState) => ({ ...prevState, name: e.toLowerCase() }))
                                }}
                            />
                        </div>

                        <div className="form__group" style={{ marginBottom: 15 }}>
                            <Text style={{ color: "#FFF", fontSize: 14 }}>State Name</Text>
                            <Input
                                placeholder="Enter State Name"
                                value={institution.state}
                                onChange={(e) => {
                                    setInstitution((prevState) => ({ ...prevState, state: e.toLowerCase() }))
                                }}
                            />
                        </div>

                        <div className="form__group" style={{ marginBottom: 15 }}>
                            <Text style={{ color: "#FFF", fontSize: 14 }}>District Name</Text>
                            <Input
                                placeholder="Enter District Name"
                                value={institution.district}
                                onChange={(e) => {
                                    setInstitution((prevState) => ({ ...prevState, district: e.toLowerCase() }))
                                }}
                            />
                        </div>
                        <div className="form__group" style={{ marginBottom: 15 }}>
                            <Text style={{ color: "#FFF", fontSize: 14 }}>PIN Code</Text>
                            <Input
                                placeholder="Enter PIN Code"
                                value={institution.pin}
                                onChange={(e) => {
                                    setInstitution((prevState) => ({ ...prevState, pin: e.toLowerCase() }))
                                }}
                            />
                        </div>

                        <div className="form__group" style={{ marginBottom: 25 }}>
                            <Text style={{ color: "#FFF", fontSize: 14 }}>
                                Institution Address
                            </Text>
                            <Input
                                as="textarea"
                                rows={3}
                                placeholder="Enter institution address"
                                value={institution.address}
                                onChange={(e) => {
                                    setInstitution((prevState) => ({ ...prevState, address: e.toLowerCase() }))
                                }}
                            />
                        </div>

                        <Button
                            appearance="primary"
                            block
                            style={{
                                backgroundColor: "#0078FF",
                                border: "none",
                                color: "#FFF",
                                fontWeight: 600,
                                borderRadius: 8,
                            }}
                            onClick={institutionBasicInfo && institutionBasicInfo.hasOwnProperty('api_data') && institutionBasicInfo.api_data === "true" ? updateInstition : handleCreatePlatform}
                        >
                            {institutionBasicInfo && institutionBasicInfo.hasOwnProperty('api_data') && institutionBasicInfo.api_data ==="true" ? "UPDATE" : "SUBMIT"}
                        </Button>
                    </Panel>
                )
            }
            {
                state.setup_step === "metadata_institution" && (
                    <Panel
                        bordered
                        style={{
                            backgroundColor: "#1E1E2F",
                            borderRadius: 12,
                            padding: 30,
                            maxWidth: 500,
                            margin: "auto",
                            boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                        }}
                    >
                        <Text
                            style={{
                                display: "block",
                                textAlign: "center",
                                fontSize: 20,
                                color: "#FFF",
                                fontFamily: "Lato",
                                fontWeight: 600,
                                marginBottom: 4,
                            }}
                        >
                            Setup Institution Metadata
                        </Text>

                        <Text
                            style={{
                                display: "block",
                                textAlign: "center",
                                fontSize: 14,
                                color: "#D1D1D1",
                                marginBottom: 8,
                            }}
                        >
                            Institution Metadata will be contain more information about your institution.
                        </Text>

                        <div className="form__group" style={{ marginBottom: 15 }}>
                            <Text style={{ color: "#FFF", fontSize: 14 }}>Institution Code</Text>
                            <Input
                                placeholder="Enter Institution Code"
                                value={institutionMetadata.institutionCode}
                                onChange={(e) => {
                                    setMetadata((prevState) => ({ ...prevState, institutionCode: e.toLowerCase() }))
                                }}
                            />
                        </div>

                        <div className="form__group" style={{ marginBottom: 15 }}>
                            <Text style={{ color: "#FFF", fontSize: 14 }}>Email Address</Text>
                            <Input
                                placeholder="Enter official email"
                                type="email"
                                value={institutionMetadata.institutionEmail}
                                onChange={(e) => {
                                    setMetadata((prevState) => ({ ...prevState, institutionEmail: e.toLowerCase() }))
                                }}
                            />
                        </div>

                        <div className="form__group" style={{ marginBottom: 15 }}>
                            <Text style={{ color: "#FFF", fontSize: 14 }}>Contact Number</Text>
                            <Input
                                placeholder="Enter contact number"
                                type="tel"
                                value={institutionMetadata.institutionContact}
                                onChange={(e) => {
                                    setMetadata((prevState) => ({ ...prevState, institutionContact: e.toLowerCase() }))
                                }}
                            />
                        </div>
                        <div className="form__group" style={{ marginBottom: 15 }}>
                            <Text style={{ color: "#FFF", fontSize: 14 }}>Institution Type</Text>
                            <Input
                                placeholder="e.g. School, College, University, Training Institute"
                                value={institutionMetadata.institutionType}
                                onChange={(e) => {
                                    setMetadata((prevState) => ({ ...prevState, institutionType: e.toLowerCase() }))
                                }}
                            />
                        </div>
                        <div className="form__group" style={{ marginBottom: 15 }}>
                            <Text style={{ color: "#FFF", fontSize: 14 }}>Year of establishment</Text>
                            <Input
                                placeholder="Year of establishment"
                                type="tel"
                                value={institutionMetadata.establishmentYear}
                                onChange={(e) => {
                                    setMetadata((prevState) => ({ ...prevState, establishmentYear: e.toLowerCase() }))
                                }}
                            />
                        </div>
                        <div className="form__group" style={{ marginBottom: 15 }}>
                            <Text style={{ color: "#FFF", fontSize: 14 }}>Board, University, or Accreditation body</Text>
                            <Input
                                placeholder="Board, University, or Accreditation body"
                                value={institutionMetadata.board}
                                onChange={(e) => {
                                    setMetadata((prevState) => ({ ...prevState, board: e.toLowerCase() }))
                                }}
                            />
                        </div>

                        <Button
                            appearance="primary"
                            block
                            style={{
                                backgroundColor: "#0078FF",
                                border: "none",
                                color: "#FFF",
                                fontWeight: 600,
                                borderRadius: 8,
                            }}
                            onClick={metaDataStatus && metaDataStatus.hasOwnProperty('api_data') && metaDataStatus.api_data === "true" ? updateInstitionMetadata : updateMetadata}
                        >
                            {metaDataStatus && metaDataStatus.hasOwnProperty('api_data') && metaDataStatus.api_data === "true" ? "UPDATE" : "SUBMIT"}
                        </Button>
                    </Panel>
                )
            }
            {
                state.setup_step === "member_institution" && (
                    <InstitutionMembers
                        institutionBasicInfo={institutionBasicInfo}
                        institutionMetadata={institutionMetadata}
                        user={user}
                    />
                )
            }
            {
                alert.show && (
                    <ToastMessage
                        message={alert.message}
                        type={alert.type}
                        show={alert.show}
                        onClose={() => {
                            setAlert({
                                type: null,
                                show: false,
                                message: ""
                            })
                        }}
                    />
                )
            }
            {
                status && (
                    <ToastMessage
                        {...status}
                        onClose={() => {
                            setStatus(null)
                        }}
                    />
                )
            }
            {
                (
                    createState.isLoading ||
                    getUserInstitution.isLoading ||
                    updateUserInstitutionState.isLoading ||
                    createInstitutionMetadataState.isLoading ||
                    metaDataState.isLoading ||
                    updateInstitionState.isLoading ||
                    updateMetadataState.isLoading ||
                    uploadImageState.isLoading
                ) && (
                    <Loader
                        show={true}
                    />
                )
            }
        </div>
    );
}

export default PlatformSetup
