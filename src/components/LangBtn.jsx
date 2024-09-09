import React from 'react'

function LangBtn(props) {
  return (
    <button onClick={props.onClick} className={`border-red-700 p-1 border w-32 rounded-md m-3 ${props.on ? "bg-red-800 text-white" : "bg-transparent text-black"}`}>
        {props.name}
    </button>
  )
}

export default LangBtn