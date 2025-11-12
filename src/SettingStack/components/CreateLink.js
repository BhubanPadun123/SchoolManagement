import React, {
    useEffect,
    useState
} from "react"
import {
    Box,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from "@mui/material"


export default function CreateLink({
    classList = [],
    setTitle,
    title = "",
    setClassRef,
    classRef = "",
    expiryDate = "",
    setExpiryDate
}) {

    const handleChange = (event) => {
        setClassRef(event.target.value)
    }


    return (
        <Box sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            padding: "8px"
        }}>
            <TextField
                placeholder="Admission Link Title"
                label="Admission Link Title"
                variant="outlined"
                value={title}
                onChange={(e) => {
                    setTitle(e.target.value)
                }}
            />
            <FormControl fullWidth>
                <InputLabel>Select Class</InputLabel>
                <Select
                    value={classRef}
                    label={"Select Class"}
                    onChange={handleChange}
                >
                    {
                        Array.isArray(classList) && classList.length > 0 &&
                        classList.map((item, index) => {
                            return (
                                <MenuItem key={index + item.id} value={item.id} >{item.class_name}</MenuItem>
                            )
                        })
                    }
                </Select>
            </FormControl>
            <TextField
                type="date"
                value={expiryDate}
                label="Select Link Expiry Date*"
                variant="outlined"
                onChange={(e) => {
                    setExpiryDate(e.target.value)
                }}
                focused={true}
            />
        </Box>
    )
}