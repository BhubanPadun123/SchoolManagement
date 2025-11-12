import React,{
    useEffect,
    useMemo,
    useCallback
} from "react"

import { Outlet,useNavigate } from "react-router-dom"


function PublicRootLayer(){
    return(
        <div className="col-md-12">
            <h1>jroewre</h1>
            <div className='outlet__root'>
                <Outlet/>
            </div>
        </div>
    )
}

export default PublicRootLayer