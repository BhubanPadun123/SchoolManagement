import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl, api_service_path } from "./utils";

export const uploadContentAction = createApi({
    reducerPath: "uploadContent",
    baseQuery: fetchBaseQuery({
        baseUrl: `${baseUrl}/${api_service_path.upload_content}`,
        timeout: 10000,
    }),
    tagTypes: ["contentUpload"],
    endpoints: (builder) => ({
        uploadImage: builder.mutation({
            query: ({ file }) => {
                const formData = new FormData();
                formData.append("file", file);

                return {
                    url: "/upload_image",
                    method: "POST",
                    body: formData,
                }
            },
            invalidatesTags: ["contentUpload"],
        })
    })
})

export const {
    useUploadImageMutation
} = uploadContentAction