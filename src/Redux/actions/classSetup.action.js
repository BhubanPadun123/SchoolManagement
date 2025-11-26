import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl, api_service_path } from "./utils"


export const classRoomAction = createApi({
    reducerPath:"classRoomApi",
    baseQuery:fetchBaseQuery({
        baseUrl:`${baseUrl}/${api_service_path.class_room}`
    }),
    tagTypes:["classroom"],
    endpoints:(builder)=> ({
        createClass:builder.mutation({
            query:({class_name,institution_ref,meta_data})=> ({
                url:'/create',
                method:"POST",
                body:{
                    class_name,
                    institution_ref,
                    meta_data
                }
            })
        }),
        getInstitutionClasses:builder.query({
            query:({institution_ref})=> ({
                url:`/classes/${institution_ref}`,
                method:"GET"
            })
        }),
        editInstitutionClass:builder.mutation({
            query:({class_id,class_name,institution_ref,meta_data})=> ({
                url:`/edit_class/${class_id}`,
                method:"PUT",
                body:{
                    class_name,
                    institution_ref,
                    meta_data
                }
            })
        }),
        deleteInstitutionClass:builder.mutation({
            query:({class_id})=> ({
                url:`/remove_class/${class_id}`,
                method:"DELETE"
            })
        }),
        updateClassMetadata:builder.mutation({
            query:({class_id,meta_data})=> ({
                url:`/update_metadata/${class_id}`,
                method:"PUT",
                body:meta_data
            })
        }),
        getClassStudentsList:builder.query({
            query:({institution_ref,class_id})=> ({
                url:`/students/${institution_ref}/${class_id}`,
                method:"GET"
            })
        })
    })
})

export const {
    useCreateClassMutation,
    useLazyGetInstitutionClassesQuery,
    useDeleteInstitutionClassMutation,
    useEditInstitutionClassMutation,
    useUpdateClassMetadataMutation,
    useLazyGetClassStudentsListQuery
} = classRoomAction