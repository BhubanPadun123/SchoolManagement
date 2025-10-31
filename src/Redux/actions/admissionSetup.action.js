import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl, api_service_path } from "./utils"

export const admissionAction = createApi({
    reducerPath: "admissionApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${baseUrl}/${api_service_path.admission}`
    }),
    tagTypes: ["admission"],
    endpoints: (builder) => ({
        createAdmissionLink: builder.mutation({
            query: ({
                title,
                expired,
                institution_ref,
                class_ref
            }) => ({
                url: "/create_admission_link",
                method: "POST",
                body: {
                    title,
                    expired,
                    institution_ref,
                    class_ref
                }
            })
        }),
        getAllAdmissionLink: builder.query({
            query: ({ institution_ref }) => ({
                url: `/get_all_link/${institution_ref}`,
                method: "GET"
            })
        }),
        deleteAdmissionLink: builder.mutation({
            query: ({ link_id }) => ({
                url: `/remove_link/${link_id}`,
                method: "DELETE"
            })
        }),
        editAdmissionLink: builder.mutation({
            query: ({
                link_id,
                title,
                expired,
                institution_ref,
                class_ref
            }) => ({
                url: `/update_link/${link_id}`,
                method: "PUT",
                body: {
                    title,
                    expired,
                    institution_ref,
                    class_ref
                }
            })
        }),
        registerStudent: builder.mutation({
            query: ({
                firstname,
                lastname,
                fathername,
                mothername,
                cnumber,
                pnumber,
                email,
                fatherOccupation,
                motherOccupation,
                age,
                gender,
                lastExamination,
                year,
                division,
                markObtain,
                meta_data,
                class_ref,
                institution_ref
            }) => ({
                url: "/register",
                method: "POST",
                body: {
                    firstname,
                    lastname,
                    fathername,
                    mothername,
                    cnumber,
                    pnumber,
                    email,
                    fatherOccupation,
                    motherOccupation,
                    age,
                    gender,
                    lastExamination,
                    year,
                    division,
                    markObtain,
                    meta_data,
                    class_ref,
                    institution_ref
                }
            })
        }),
        getAllinstitutionRegisteredStudents:builder.query({
            query:({institution_ref,class_ref})=> ({
                url:`/all_all_registered_students/${institution_ref}/${class_ref}`,
                method:"GET"
            })
        }),
        updateRegistrationStatus:builder.mutation({
            query:({registration_ref,meta_data})=> ({
                url:`/update_registration_status/${registration_ref}`,
                method:"PUT",
                body:meta_data
            })
        })
    })
})

export const {
    useCreateAdmissionLinkMutation,
    useLazyGetAllAdmissionLinkQuery,
    useDeleteAdmissionLinkMutation,
    useEditAdmissionLinkMutation,
    useRegisterStudentMutation,
    useGetAllinstitutionRegisteredStudentsQuery,
    useLazyGetAllinstitutionRegisteredStudentsQuery,
    useUpdateRegistrationStatusMutation
} = admissionAction