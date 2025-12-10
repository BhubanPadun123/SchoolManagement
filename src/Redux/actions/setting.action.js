import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl, api_service_path } from "./utils";

export const settingAction = createApi({
    reducerPath: "settingApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${baseUrl}/${api_service_path.setting}`,
    }),
    tagTypes: ["Platform"],
    endpoints: (builder) => ({
        createPlatform: builder.mutation({
            query: ({ name, logo, state, district, pin, address }) => ({
                url: `/create`,
                method: "POST",
                body: { 
                    name, 
                    logo, 
                    state, 
                    district, 
                    pin, 
                    address 
                },
            }),
            invalidatesTags: ["platformCreate"]
        }),
        updateInstitutionToUserAccount:builder.mutation({
            query:({email,meta_data})=> ({
                url:"/update_user_platform",
                method:"PUT",
                body:{
                    email,
                    meta_data
                }
            }),
            invalidatesTags:["addInstitutionToUserAccount"]
        }),
        getUserInstitution:builder.query({
            query:(id)=> ({
                url:`/single/${id}`,
                method:"GET"
            }),
            invalidatesTags:["userInstitution"]
        }),
        createInstitutionMetadata:builder.mutation({
            query:({platform_id,meta_data})=>({
                url:"/create_metadata",
                method:"POST",
                body:{
                    platform_id,
                    meta_data
                }
            }),
            invalidatesTags:["institutionMetadata"]
        }),
        updateInstitutionMetadata:builder.mutation({
            query:({platform_id,meta_data})=> ({
                url:"/update_metadata",
                method:"PUT",
                body:{
                    platform_id,
                    meta_data
                }
            }),
            invalidatesTags:["updateInstitutionMetadata"]
        }),
        getInstitutionMetadata:builder.query({
            query:(id)=> ({
                url:`/institution_metadata/${id}`,
                method:"GET"
            })
        }),
        updateInstitution:builder.mutation({
            query:({id,data})=>({
                url:`/edit/${id}`,
                method:"PUT",
                body:{
                    ...data
                }
            })
        }),
        createPlatformRoles:builder.mutation({
            query:({platform_id,designation,meta_data})=> ({
                url:"/create_platform_role",
                method:"POST",
                body:{
                    platform_id,
                    designation,
                    meta_data
                }
            })
        }),
        getPlatformRoles:builder.query({
            query:({platform_id})=> ({
                url:`/platform_roles/${platform_id}`,
                method:"GET"
            })
        }),
        createPlatformUser:builder.mutation({
            query:({firstname,lastname,email,password,meta_data})=> ({
                url:"/create_platform_user",
                method:"POST",
                body:{
                    firstname,
                    lastname,
                    email,
                    password,
                    meta_data
                }
            })
        }),
        getPlatformUserList:builder.query({
            query:({platform_id})=> ({
                url:`/platform_users/${platform_id}`,
                method:"GET"
            })
        }),
        updateUserMetadata:builder.mutation({
            query:({userRef,userInfo})=> ({
                url:`/update_user_metadata/${userRef}`,
                method:"PUT",
                body:userInfo
            })
        }),
        deleteUserFromInstitution:builder.mutation({
            query:({user_ref})=> ({
                url:`/delete_platfrom_user/${user_ref}`,
                method:"DELETE"
            })
        }),
        createPlatformFee:builder.mutation({
            query:({
                fee_name,
                fee_amount
            })=> ({
                url:`/create_platform_fee?fee_name=${fee_name}&fee_amount=${fee_amount}`,
                method:"POST",
                body:{
                    fee_name,
                    fee_amount
                }
            })
        }),
        editPlatformFee:builder.mutation({
            query:({
                fee_ref,
                fee_name,
                fee_amount
            })=> ({
                url:`/edit_fee/${fee_ref}`,
                method:"PUT",
                body:{
                    fee_name,
                    fee_amount
                }
            })
        }),
        deletePlatformFee:builder.mutation({
            query:({
                fee_ref
            })=> ({
                url:`/remove_fee/${fee_ref}`,
                method:"DELETE"
            })
        }),
        getAllFee:builder.query({
            query:()=> ({
                url:"/all_fee",
                method:"GET"
            })
        }),
        useGetAllPlatformsList:builder.query({
            query:()=> ({
                url:"/all",
                method:"GET"
            })
        })
    })
})

export const {
    useCreatePlatformMutation,
    useGetAllPlatformsQuery,
    useUpdateInstitutionToUserAccountMutation,
    useGetUserInstitutionQuery,
    useLazyGetUserInstitutionQuery,
    useCreateInstitutionMetadataMutation,
    useGetInstitutionMetadataQuery,
    useLazyGetInstitutionMetadataQuery,
    useUpdateInstitutionMetadataMutation,
    useUpdateInstitutionMutation,
    useCreatePlatformRolesMutation,
    useLazyGetPlatformRolesQuery,
    useGetPlatformRolesQuery,
    useCreatePlatformUserMutation,
    useLazyGetPlatformUserListQuery,
    useGetPlatformUserListQuery,
    useUpdateUserMetadataMutation,
    useDeleteUserFromInstitutionMutation,

    useCreatePlatformFeeMutation,
    useDeletePlatformFeeMutation,
    useEditPlatformFeeMutation,
    useLazyGetAllFeeQuery,

    useLazyUseGetAllPlatformsListQuery
} = settingAction
