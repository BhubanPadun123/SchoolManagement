import React from "react"
import { useParams } from "react-router-dom"
import { GetCurrentUser } from "../utils/hooks"
import {
    useLazyGetClassStudentsListQuery,
    useLazyGetInstitutionClassesQuery
} from "../Redux/actions/classSetup.action"
import {
    useFeeCollectorMutation,
    useLazyGetMonthlyFeeCollectionQuery
} from "../Redux/actions/feeCollection.action"
import {
    useLazyUseGetAllPlatformsListQuery
} from "../Redux/actions/setting.action"
import {
    Loader
} from "../components/index"
import {
    MonthlyCards,
    ClassSeatLayout
} from "./index"
import {
    Drawer
} from "@mui/material"
import _ from "lodash"

export default function FeeCollector() {
    const param = useParams()
    const class_name = param && _.get(param, "class_name", null)
    const [openDrawer, setOpenDrawer] = React.useState(false)
    const [institution_ref, setInstitutionRef] = React.useState(null)
    const [month, setMonth] = React.useState("")

    const [getAllSchoolAction, getAllSchoolState] = useLazyUseGetAllPlatformsListQuery()
    const [getClassesAction, getClassesState] = useLazyGetInstitutionClassesQuery()
    const [getClassStudentsAction, getClassStudentState] = useLazyGetClassStudentsListQuery()
    const [feeCollectionAction, feeCollectionState] = useFeeCollectorMutation()
    const [getFeeMonthlyCollectionAction, getFeeMonthlyCollectionState] = useLazyGetMonthlyFeeCollectionQuery()

    function fetchPreData() {
        const user = GetCurrentUser()
        if (user) {
            const institution_ref = _.get(user, "meta_data.user_platform", null)
            setInstitutionRef(institution_ref)
            getAllSchoolAction()
            institution_ref && getClassesAction({ institution_ref: institution_ref })
        }
    }
    function fetchFeeCollectionData(month) {
        if (!month) return
        const user = GetCurrentUser()
        if (user) {
            const institution_ref = _.get(user, "meta_data.user_platform", null)
            institution_ref && getFeeMonthlyCollectionAction({ school_id: institution_ref, month: month })
        }
    }
    React.useEffect(() => {
        fetchPreData()
    }, [class_name])

    const currentClass = React.useMemo(() => {
        if (getClassesState.isSuccess) {
            const list = _.get(getClassesState, "currentData.list", [])
            const findClass = Array.isArray(list) && list.length > 0 && list.find((i) => i.class_name === class_name)
            if (findClass) {
                getClassStudentsAction({
                    institution_ref: findClass.institution_ref,
                    class_id: findClass.id
                })
            }
            return findClass
        } else {
            return null
        }
    }, [getClassesState])

    const studentList = React.useMemo(() => {
        if (getClassStudentState.isSuccess && currentClass) {
            const students = _.get(currentClass, "meta_data.students", [])
            const list = _.get(getClassStudentState, "currentData", [])
            const finalList = students && Array.isArray(list) && list.length > 0 && list.map((item, index) => {
                const findStudent = Array.isArray(students) && students.length > 0 && students.find(i => i.email === item.email)
                if (!findStudent) return null
                return {
                    id: item.id,
                    rollNo: findStudent.roll_no,
                    status: "available",
                    student: {
                        name: `${item.firstname} ${item.lastname}`,
                        class: currentClass.class_name,
                        section: "A",
                        phone: "9954882804"
                    }
                }
            }).filter(i => i)
            return finalList
        } else {
            return []
        }
    }, [getClassStudentState])
    const allSchoolList = React.useMemo(() => {
        if (getAllSchoolState.isSuccess) {
            const list = _.get(getAllSchoolState, "currentData.list", [])
            return list
        } else {
            return []
        }
    }, [getAllSchoolState])

    const feeCollectionData = React.useMemo(() => {
        if (getFeeMonthlyCollectionState.isSuccess) {
            const data = _.get(getFeeMonthlyCollectionState, "currentData.data", [])
            return data ? data : null
        } else {
            return null
        }
    }, [getFeeMonthlyCollectionState])
    const paymentUpdatedStatus = React.useMemo(() => {
        if (feeCollectionState.isSuccess && month) {
            fetchFeeCollectionData(month)
            feeCollectionState.reset()
            return true
        }
        if (feeCollectionState.isError) {
            feeCollectionState.reset()
            return false
        }
    }, [feeCollectionState])


    function handleCardClick(e) {
        if (!e) return
        setOpenDrawer(!openDrawer)
        setMonth(e)
        fetchFeeCollectionData(e)
    }
    function updatePayment(studnetInfo) {
        if (!feeCollectionData || !studnetInfo || !currentClass || !month || !allSchoolList || !Array.isArray(allSchoolList) || allSchoolList.length === 0) return
        const findSchool = allSchoolList.find(i => i.id === currentClass.institution_ref)
        let findFeeData = feeCollectionData.month == month
 
        if (!findSchool) return
        if (!findFeeData) {
            let data = {
                school_name: findSchool.name,
                school_ref: currentClass.institution_ref,
                fee_name: "Monthly_Fee",
                month: month,
                fee_collection: {
                    data: [
                        {
                            class_name: currentClass.class_name,
                            ids: [studnetInfo.rollNo]
                        }
                    ]
                }
            }
            feeCollectionAction({
                ...data
            })
        } else {
            const collection = _.get(feeCollectionData, "fee_collection.data", [])
            const ids =
                collection.find(
                    item => item.class_name === currentClass.class_name
                )?.ids || []
            if (!ids || !Array.isArray(ids) || ids.length === 0) {
                let data = {
                    school_name: findSchool.name,
                    school_ref: currentClass.institution_ref,
                    fee_name: "Monthly_Fee",
                    month: month,
                    fee_collection: {
                        data: [
                            {
                                class_name: currentClass.class_name,
                                ids: [studnetInfo.rollNo]
                            }
                        ]
                    }
                }
                feeCollectionAction({
                    ...data
                })
            } else {
                let data = {
                    school_name: findSchool.name,
                    school_ref: currentClass.institution_ref,
                    fee_name: "Monthly_Fee",
                    month: month,
                    fee_collection: {
                        data: [
                            {
                                class_name: currentClass.class_name,
                                ids: Array.isArray(ids) && ids.length > 0 && ids.includes(studnetInfo.rollNo) ? [...ids] : [...ids, studnetInfo.rollNo]
                            }
                        ]
                    }
                }
                feeCollectionAction({
                    ...data
                })
            }
        }
    }


    const updateStatus = paymentUpdatedStatus


    return (
        <div className="col-md-12" >
            <h1 style={{
                fontFamily: "Lato",
                letterSpacing: 1.2,
                fontWeight: "bold",
                textAlign: "center",
                borderBottom: "2px solid red"
            }}>Monthly Fee Collection for class - {class_name} </h1>
            <div className="col-md-12">
                <MonthlyCards
                    onCardClick={handleCardClick}
                />
            </div>
            <Drawer
                open={openDrawer}
                onClose={() => {
                    setOpenDrawer(false)
                }}
                sx={{
                    width: "100%",
                    border: "2px solid red"
                }}
            >
                <ClassSeatLayout
                    onClose={() => {
                        setOpenDrawer(false)
                    }}
                    studentList={studentList ? studentList : []}
                    feeCollectionData={feeCollectionData}
                    updatePayment={updatePayment}
                    currentClass={currentClass}
                />
            </Drawer>
            {
                (
                    getClassesState.isLoading ||
                    getClassStudentState.isLoading ||
                    feeCollectionState.isLoading ||
                    getFeeMonthlyCollectionState.isLoading ||
                    getAllSchoolState.isLoading
                ) && (
                    <Loader show={true} />
                )
            }
        </div>
    )
}