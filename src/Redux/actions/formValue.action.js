import { createSlice } from "@reduxjs/toolkit"

const formSlice = createSlice({
    name:"form",
    initialState:{
        state:{}
    },
    reducers:{
        updateFields:(state,action)=>{
            state.state = {
                ...state.state,
                ...action.payload
            }
        },
        resetForm:(state)=> {
            state.state = {}
        }
    }
})

export const {
    updateFields,
    resetForm
} = formSlice.actions
export default formSlice