import React from 'react'

function Button(props) {
  return (
    <button onClick={props.onClick} className={`gap-1 bg-gradient-to-tl from-red-950 to-red-700  text-white w-12 ${props.width === true ? "w-12 text-xl" : "xl:w-[1150px] lg:w-[850px] md:w-[600px] sm:w-[500px] w-[270px] text-md"} h-12 flex justify-center items-center rounded-md hover:opacity-80 transition-all ease-in-out`}>
        {props.text}{props.icon}
    </button>
  )
}

export default Button