import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl, api_service_path } from "./utils"
import { data } from "autoprefixer";

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
                body:data,
                responseHandler:(response)=> response.blob()
            })
        }),
        downloadAdmissionDocument:builder.mutation({
            query:(data)=> ({
                url:"/admission_fee_receipt",
                method:"POST",
                body:data,
                responseHandler:(response)=> response.blob()
            })
        }),
        downloadAdmitCard:builder.mutation({
            query:(data)=> ({
                url:"/admit",
                method:"POST",
                body:data,
                responseHandler:(response)=> response.blob()
            })
        }),
        downloadRegistrationPdf:builder.mutation({
            query:(data)=> ({
                url:"/registration_response",
                method:"POST",
                body:data,
                responseHandler:(response) => response.blob()
            })
        })
    })
})

export const {
    useLazyDownloadRegisterStudentsQuery,
    useDownloadAdmissionRecievedMutation,
    useDownloadAdmissionDocumentMutation,
    useDownloadAdmitCardMutation,
    useDownloadRegistrationPdfMutation
} = downloadAction