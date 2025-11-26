import React from "react"
import {
    Typography,
    Box,
    IconButton,
    Tooltip,
    useTheme,
    useMediaQuery,
    Checkbox,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    Button
} from "@mui/material"
import {
    Close
} from "@mui/icons-material"
import _ from "lodash"


export default function ManageFee(props) {
    const {
        onClose,
        classes = [],
        selectedStudent,
        onSubmit,
        currentStudent
    } = props
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const [updatedFee, setUpdatedFee] = React.useState([])
    const [includesFee, setIncludesFee] = React.useState([])
    

    const fees = _.get(currentStudent,"meta_data.feePayment",null)



    let findFee = React.useMemo(() => {
        if (Array.isArray(classes) && classes.length > 0 && selectedStudent) {
            let findClass = classes.find(i => i.class_name === selectedStudent.Class)
            let feeData = findClass && _.get(findClass, "meta_data.feeStructure", [])
            return feeData
        } else {
            return null
        }
    }, [selectedStudent, classes])


    return (
        <div className="col-md-12" style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <Box sx={{
                width: isMobile ? "90%" : "400px",
                background: "#FFFF",
                border: "2px solid gray",
                borderRadius: "8px",
                padding: "8px"
            }}>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    backgroundColor: "#380808ff",
                    alignItems: "center"
                }}>
                    <Typography style={{
                        fontSize: "18px",
                        color: "#FFFF",
                        fontFamily: "Lato",
                        fontWeight: 400,
                        fontStyle: "normal",
                        flex: 1,
                        padding: "4px"
                    }}>
                        Update Admission Fee Collection
                    </Typography>
                    <Tooltip title={"Close"} placement="bottom" arrow >
                        <IconButton onClick={onClose} >
                            <Close style={{
                                color: "#FFFF"
                            }} />
                        </IconButton>
                    </Tooltip>
                </div>
                <div style={{
                    height: "300px",
                    overflow: "scroll",
                    width: "100%"
                }}>
                    <List>
                        {
                            Array.isArray(findFee) && findFee.length > 0 && findFee.map((item, index) => {
                                let isAlradyPay = Array.isArray(fees) && fees.length > 0 && fees.find(i => i.feeName === item.feeName)
                                if(isAlradyPay) return null
                                return (
                                    <ListItem
                                        key={index}
                                        disablePadding
                                        divider
                                    >
                                        <ListItemButton onClick={() => {
                                            let isExist = updatedFee.find(i => i.feeName === item.feeName)
                                            let ifIncludes = includesFee.find(i => i === item.feeName)
                                            if (ifIncludes) {
                                                let removedList = includesFee.filter(i => i !== item.feeName)
                                                setIncludesFee(removedList)
                                            } else {
                                                setIncludesFee([...includesFee, item.feeName])
                                            }
                                            if (isExist) {
                                                let list = updatedFee.filter(i => i.feeName !== item.feeName)
                                                setUpdatedFee(list)
                                            } else {
                                                setUpdatedFee([...updatedFee, item])
                                            }
                                        }}>
                                            <ListItemIcon>
                                                <Checkbox checked={includesFee.includes(item.feeName)} />
                                            </ListItemIcon>
                                            <ListItemText>
                                                {item.feeName}
                                            </ListItemText>
                                            <ListItemText>
                                                Rs- {item.feeAmount} only
                                            </ListItemText>
                                        </ListItemButton>
                                    </ListItem>
                                )
                            })
                        }
                    </List>
                </div>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: 'center',
                    gap: "4px",
                    padding: "8px"
                }}>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => {
                            onSubmit(updatedFee)
                        }}
                    >
                        Submit
                    </Button>
                    <Button
                        variant="text"
                        onClick={() => {
                            setUpdatedFee([])
                            setIncludesFee([])
                            onClose()
                        }}
                    >
                        Cancel
                    </Button>
                </div>
            </Box>
        </div>
    )
}