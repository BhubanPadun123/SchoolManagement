import React from "react"
import {
    featureList,
    featureMapList
} from "./data"
import { useParams,useNavigate } from "react-router-dom"
import _ from "lodash"
import {
    BackHandOutlined
} from "@mui/icons-material"

const FeatureInfo = () => {
    const params = useParams()
    const navigate = useNavigate()

    const f = _.get(params, 'f', null)
    let findFeature = f && featureList.find(i => i.key === f)
    let findFeatureMap = f && featureMapList.find(i => i.key === f)
    console.log(findFeature)
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center px-6 py-12">
            {/* Header Section */}
            <div className="max-w-4xl w-full text-center mb-12">
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
                    {findFeatureMap && findFeatureMap.title}
                </h1>
                <p className="text-gray-600 text-lg leading-relaxed">
                    {findFeatureMap && findFeatureMap.desc}
                </p>
            </div>

            {/* Main Content */}
            <div className="max-w-5xl w-full space-y-10">
                {
                    findFeature && findFeature.feature.map((item, index) => {
                        return (
                            <section className="space-y-4" key={index}>
                                <h2 className="text-2xl font-semibold text-blue-700">
                                    {item.title}
                                </h2>
                                <p className="text-gray-700 leading-relaxed">
                                    {item.message}
                                </p>
                            </section>
                        )
                    })
                }
            </div>

            {/* CTA Section */}
            <div className="max-w-5xl text-center mt-16">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-10 py-3 rounded-full shadow-md transition" onClick={()=> {
                    navigate("/")
                }}>
                    <BackHandOutlined/> Back
                </button>
            </div>
        </div>
    )
}

export default FeatureInfo
