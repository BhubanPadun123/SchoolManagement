import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseUrl,api_service_path } from './utils'

export const userActions = createApi({
    reducerPath:"userApi",
    baseQuery: fetchBaseQuery({
        baseUrl:`${baseUrl}/${api_service_path.auth}`
    }),
    endpoints:(builder)=> ({
        userRegister:builder.mutation({
            query:({firstname,lastname,email,password,meta_data}) => ({
                url:`/create`,
                method:"POST",
                body:{
                    firstname,
                    lastname,
                    email,
                    password,
                    meta_data
                }
            }),
            invalidatesTags:["createUser"]
        }),
        userLogin:builder.mutation({
            query:({email,password})=> ({
                url:`/login?email=${email}&password=${password}`,
                method:"POST",
                body:{
                    email,
                    password
                }
            }),
            invalidatesTags:["loginUser"]
        }),
        getUserPrivileges:builder.query({
            query:({designation,platform_id})=> ({
                url:`${api_service_path.user}/privilages/${designation}/${platform_id}`,
                method:"GET"
            })
        }),
        checkUserPlatform:builder.query({
            query:({user_email})=> ({
                url:`/check_user_platform/${user_email}`,
                method:"GET"
            })
        }),
        resetPassword:builder.mutation({
            query:({email,new_password})=> ({
                url:`/reset_password?email=${email}&new_password=${new_password}`,
                method:"PUT",
                body:{
                    email,
                    new_password
                }
            })
        })
    })
})

export const {
    usePrefetch,
    useUserRegisterMutation,
    useUserLoginMutation,
    useLazyGetUserPrivilegesQuery,
    useLazyCheckUserPlatformQuery,
    useResetPasswordMutation
} = userActions