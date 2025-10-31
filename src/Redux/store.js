import {configureStore} from "@reduxjs/toolkit"
import {setupListeners} from "@reduxjs/toolkit/query"
import {
    userActions
} from "./actions/user.action"
import {
    settingAction
} from "./actions/setting.action"
import {
    classRoomAction
} from "./actions/classSetup.action"
import {
    admissionAction
} from "./actions/admissionSetup.action"
import {
    uploadContentAction
} from "./actions/upload_content"


export const Store = configureStore({
    reducer:{
        [userActions.reducerPath]: userActions.reducer,
        [settingAction.reducerPath] : settingAction.reducer,
        [classRoomAction.reducerPath] : classRoomAction.reducer,
        [admissionAction.reducerPath] : admissionAction.reducer,
        [uploadContentAction.reducerPath] : uploadContentAction.reducer
    },
    middleware:(getDefaultMiddleware)=> 
        getDefaultMiddleware().
        concat(settingAction.middleware).
        concat(userActions.middleware).
        concat(classRoomAction.middleware).
        concat(admissionAction.middleware).
        concat(uploadContentAction.middleware)
})


setupListeners(Store.dispatch)