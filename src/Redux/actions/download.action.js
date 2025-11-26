import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl, api_service_path } from "./utils"

export const downloadAction = createApi({
    reducerPath:"downloadApi",
    baseQuery:fetchBaseQuery({
        baseUrl:`${baseUrl}/${api_service_path.download}`
    }),
    tagTypes:["download"],
    endpoints:(builder) => ({
        downloadRegisterStudents:builder.query({
            query:({
                class_ref,
                institution_ref
            }) => ({
                url:`/registered_students/${class_ref}/${institution_ref}`,
                method:"GET"
            })
        }),
        downloadAdmissionRecieved:builder.mutation({
            query:(data)=> ({
                url:`/admission_recieved`,
                method:"POST",
                body:data
            })
        })
    })
})

export const {
    useLazyDownloadRegisterStudentsQuery,
    useDownloadAdmissionRecievedMutation
} = downloadAction