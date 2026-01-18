import { useEffect } from "react"
import { Axios } from "./lib/api"
// import { useNavigate } from "react-router-dom"


export default function App(){
  
  useEffect(()=>{
    Axios.get("/profile")
      .then(data=>{
        console.log(data)
      })
      .catch(err=>{
        
        console.log("error")
      })
  },[])

  return <h1>Hello world</h1>
}