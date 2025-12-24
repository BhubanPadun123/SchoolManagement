import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl, api_service_path } from "./utils"

export const feeCollectionAction = createApi({
    reducerPath:"feeCollection",
    baseQuery:fetchBaseQuery({
        baseUrl:`${baseUrl}/${api_service_path.feeCollection}`
    }),
    tagTypes:["fee"],
    endpoints:(builder)=> ({
        feeCollector:builder.mutation({
            query:({
                school_name,
                school_ref,
                fee_name,
                month,
                fee_collection
            })=> ({
                url:"/create",
                method:"POST",
                body:{
                    school_name,
                    school_ref,
                    fee_name,
                    month,
                    fee_collection
                }
            })
        }),
        getMonthlyFeeCollection:builder.query({
            query:({
                school_id,
                month
            })=> ({
                url:`/get/${school_id}/${month}`,
                method:"GET"
            })
        })
    })
})

export const {
    useFeeCollectorMutation,
    useLazyGetMonthlyFeeCollectionQuery
} = feeCollectionAction