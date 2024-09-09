// src/components/ArticleDetails.jsx
import React from 'react';
import { FaFileDownload } from "react-icons/fa";
import { useLocation } from 'react-router-dom';
import { usePDF } from 'react-to-pdf';

const ArticleDetails = () => {
    const location = useLocation();
    // const [title, setTitle] = useState("Case_Document");
    const { articleData } = location.state || { articleData: [] };
    const { toPDF, targetRef } = usePDF({filename: "Case_document.pdf" });


    return (
        <div className='h-screen font-inter text-black bg-white overflow-x-hidden'>
            <header className='p-4 flex flex-row justify-end w-screen text-red-700 select-none'>
                <button onClick={() => toPDF()} className='flex flex-row items-center border-b-[1px] mr-4 relative hover:border-red-700'><FaFileDownload /> Download as PDF</button>
            </header>
            
            <main className='p-4 t'ref={targetRef} >
                {articleData.length > 0 ? (
                    articleData.map((item, index) => (
                        <div key={index} className='mb-4' >
                            {
                                item.class_names == "title" ? 
                                <>
                                    <p className='text-2xl font-bold font-inter underline text-red-700 mb-3'>{item.content}</p> 
                                    <div className='w-full h-[2px] bg-red-700 mt-1 mb-1'></div>
                                </>: 
                                item.class_names == "Precedent" ? 
                                <div className='bg-blue-100 p-4 rounded-md'>
                                    <p className=''>{item.content}</p>
                                    <br />
                                    <div className='text-right w-full font-semibold opacity-60'>Precedent Analysis</div>
                                </div>:
                                item.class_names == "Issue" ? 
                                <div className='bg-red-100 p-4 rounded-md'>
                                    <p className=''>{item.content}</p>
                                    <br />
                                    <div className='text-right w-full font-semibold opacity-60'>Issues</div>
                                </div> : 
                                item.class_names == "Facts" ? 
                                <div className='bg-yellow-100 p-4 rounded-md'>
                                    <p className=''>{item.content}</p>
                                    <br />
                                    <div className='text-right w-full font-semibold opacity-60'>Facts</div>
                                </div> : 
                                item.class_names == "PetArg" ?
                                <div className='bg-purple-100 p-4 rounded-md'>
                                    <p className=''>{item.content}</p>
                                    <br />
                                    <div className='text-right w-full font-semibold opacity-60'>Pet Arg</div>
                                </div> :
                                item.class_names == "RespArg" ?
                                <div className='bg-green-100 p-4 rounded-md'>
                                    <p className=''>{item.content}</p>
                                    <br />
                                    <div className='text-right w-full font-semibold opacity-60'>Resp Arg</div>
                                </div> :
                                item.class_names == "Section" ?
                                <div className='bg-orange-100 p-4 rounded-md'>
                                    <p className=''>{item.content}</p>
                                    <br />
                                    <div className='text-right w-full font-semibold opacity-60'>Section</div>
                                </div> :
                                item.class_names == "CDiscource" ?
                                <div className='bg-gray-100 p-4 rounded-md'>
                                    <p className=''>{item.content}</p>
                                    <br />
                                    <div className='text-right w-full font-semibold opacity-60'>CDiscource</div>
                                </div> :
                                item.class_names == "Conclusion" ?
                                <div className='bg-pink-100 p-4 rounded-md'>
                                    <p className=''>{item.content}</p>
                                    <br />
                                    <div className='text-right w-full font-semibold opacity-60'>CDiscource</div>
                                </div> :
                                <div className='bg-zinc-500 p-4 rounded-md text-white'>
                                    <p className=''>{item.content}</p>
                                </div>
                            }
                            {/* <h2 className='text-xl font-semibold text-red-500'>{item.class_names || 'No class'}</h2> */}
                            
                        </div>
                    ))
                ) : (
                    <p>No data available</p>
                )}
            </main>
        </div>
    );
};

export default ArticleDetails;
