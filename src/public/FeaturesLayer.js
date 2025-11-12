import React from "react"
import { Outlet,useParams } from "react-router-dom"

export default function FeatureLayer(){
    return(
        <div className="col-md-12">
            <Outlet />
        </div>
    )
}