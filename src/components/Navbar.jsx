import React, { useState } from 'react';
import { AiOutlineMenuUnfold } from "react-icons/ai";
import { CiGlobe } from "react-icons/ci";
import { FaUser } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import law from '../assets/law.png';
import Button from './Button';
import LangBtn from './LangBtn';

function Navbar() {
  const [openNav, setOpenNav] = useState(false);
  const [LangMenu, setLangMenu] = useState(false);

  return (
    <div className='mx-auto flex flex-row justify-between p-3 xl:w-[1280px] lg:w-[980px] md:w-[730px] sm:w-[630px] w-[400px] text-sm md:text-md  transition-all ease-in-out'>
      <Button width={true} onClick={() => setOpenNav(!openNav)} icon={<AiOutlineMenuUnfold className='text-2xl' />} />

      <div className='mt-1'>
        <div div className='flex flex-row justify-center items-center'>
            
            <h2 className='text-lg font-extrabold font-inter'>
                FIRM AI
            </h2>
            <img src={law} alt="" className='ml-1 h-7' />
        </div>
        
        <p className="relative text-[7px] -top-1 font-semibold" >
            Research Engine for commercial courts
        </p>
      </div>

      <button onClick={() => setLangMenu(!LangMenu)}>
        <CiGlobe className='text-4xl opacity-80 hover:opacity-50 ease-in transition-all' />
      </button>

      {/* Side Menu */}
      <div className={`z-10 absolute p-4 flex flex-col justify-between bg-white border-r-[1px] border-red-950 h-screen xl:w-[30vw] md:w-[40vw] sm:w-[50vw] w-[60vw] ${openNav ? "left-0" : "-left-[100vw]"} top-0 transition-all ease-in duration-500`}>
        <div className='flex flex-row justify-between'>
          <div className='mt-1'>
              <div div className='flex flex-row justify-center items-center'>
                <h2 className='text-lg font-extrabold font-inter'>
                    FIRM AI
                </h2>
                <img src={law} alt="" className='ml-1 h-7' />
              </div>
              
              <p className="relative text-[7px] -top-1 font-semibold" >
                  Research Engine for commercial courts
              </p>
            </div>
          <Button width={true} onClick={() => setOpenNav(!openNav)} icon={<AiOutlineMenuUnfold className='text-2xl' />} />
        </div>
        <div className='h-full mt-4 font-inter text-sm'>
          <h2>Previous Searches</h2>
          <div className='h-[2px] w-full bg-red-700'></div>
        </div>
        <div className='h-[2px] w-full bg-red-700'></div>
        <div className='flex flex-row justify-between mt-2'>
          <Button width={true} icon={<FaUser className='text-2xl' />} />
          <Button width={true} icon={<IoSettingsOutline className='text-2xl' />} />
        </div>
      </div>

      {/* Language Menu */}
      <div className={`text-black absolute left-0 flex flex-col justify-start items-center bg-white h-[200px] ${LangMenu ? "top-0" : "-top-[750px]"} rounded-b-2xl z-20 w-screen shadow-lg transition-all ease-in duration-500`}>
        <h2 className='font-semibold text-xl mt-6 mb-2'>
          Choose Language
        </h2>
        <div className='flex flex-wrap justify-center'>
          <LangBtn name="Tamil" />
          <LangBtn name="English" on={true} onClick={() => setLangMenu(!LangMenu)} />
          <LangBtn name="Malayalam" />
          <LangBtn name="Telugu" />
          <LangBtn name="Kannada" />
          <LangBtn name="Hindi" />
          <LangBtn name="Nepali" />
        </div>
      </div>
    </div>
  )
}

export default Navbar;
