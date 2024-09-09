import React, { useEffect, useState } from 'react';
import { IoSearch } from "react-icons/io5";
import { MdOutlineSwapHorizontalCircle } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import law from '../assets/law.png';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import '../style.css';

function Home() {
    const [swap, setSwap] = useState(true);
    const [query, setQuery] = useState('');
    const [problem, setProblem] = useState(''); // state for user_problem
    const navigate = useNavigate();

    const [articles, setArticles] = useState([]); // State to store articles
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [showMore, setShowMore] = useState(false); // State to track "Show More" toggle

    const handleSearch = () => {
        if (swap) {
            // General search
            navigate('/results', { state: { query } });
        } else {
            // Detailed search
            navigate('/detailed-results', { state: { query, problem } });
        }
    };

    // Fetch articles on component load
    const fetchArticles = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/trending-news'); // Replace with your actual API URL
            if (!response.ok) {
                throw new Error('Failed to fetch articles');
            }
            const data = await response.json();
            setArticles(data); // Assuming the API returns an array of articles
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to load articles');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    if (loading) {
        return (
            <div className='w-screen h-screen select-none flex flex-col justify-center items-center text-black bg-white text-xl'>
                <img src={law} className='h-20 animate-ping border-2 rounded-full border-red-700' />
            </div>
        );
    }

    if (error) {
        return (
            <div className='w-screen h-screen select-none flex flex-col justify-center items-center text-black bg-white text-xl'>
                <h2 className='animate-pulse'>{error}</h2>
            </div>
        );
    }

    // Function to handle "Show More"
    const handleShowMore = () => {
        setShowMore(true);
    };

    // Function to handle title click and fetch detailed article data
    const handleTitleClick = async (link) => {
        try {
            const response = await fetch('http://localhost:8000/article-details', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: link })
            });
    
            if (!response.ok) {
                throw new Error('Failed to fetch article details');
            }
    
            const data = await response.json();
            navigate('/article-details', { state: { articleData: data } });
        } catch (error) {
            console.error('Error fetching article details:', error);
        }
    };

    // Articles to display (first 5 or all depending on showMore state)
    const articlesToDisplay = showMore ? articles : articles.slice(0, 2); // Show first 5 or all if showMore is true

    return (
        <div className='w-screen font-inter h-screen text-black bg-white overflow-x-hidden'>
            <Navbar />
            <main className='h-[65vh] w-screen flex flex-col justify-end items-center'>
                <div className='flex flex-row items-center'>
                    <h2 className='md:text-5xl text-4xl font-extrabold font-inter'>
                        FIRM AI
                    </h2>
                    <img src={law} alt="" className='ml-1 h-20' />
                </div>
                <p className="relative -top-2 font-semibold">
                    Research Engine for commercial courts
                </p>
                <div className='flex flex-col w-screen'>
                    <p className='mt-6 mb-[4px] font-semibold transition-all ease-in-out mx-auto xl:w-[1200px] lg:w-[900px] md:w-[650px] sm:w-[550px] w-[320px] text-sm md:text-md'>
                        {swap ? 'General search' : 'Detailed Search'}
                    </p>
                    {swap ? (
                        <input 
                            type="text" 
                            value={query} 
                            onChange={(e) => setQuery(e.target.value)} 
                            className='p-2 h-12 mb-2 bg-gray-200 border-none rounded-md text-black max-h-20 mx-auto xl:w-[1200px] lg:w-[900px] md:w-[650px] sm:w-[550px] w-[320px] text-sm md:text-md transition-all ease-in-out' 
                            placeholder='Search'
                        />
                    ) : (
                        <>
                            <textarea 
                                value={problem} 
                                onChange={(e) => setProblem(e.target.value)} 
                                rows="5" 
                                className='p-2 mb-2 rounded-md bg-gray-200 border-none text-black mx-auto xl:w-[1200px] lg:w-[900px] md:w-[650px] sm:w-[550px] w-[320px] text-sm md:text-md transition-all ease-in-out' 
                                placeholder='Describe your problem'
                            />
                            <input 
                                type="text" 
                                value={query} 
                                onChange={(e) => setQuery(e.target.value)} 
                                className='p-2 h-12 mb-2 rounded-md bg-gray-200 border-none text-black mx-auto xl:w-[1200px] lg:w-[900px] md:w-[650px] sm:w-[550px] w-[320px] text-sm md:text-md transition-all ease-in-out' 
                                placeholder='Enter your query'
                            />
                        </>
                    )}
                    <div className='flex flex-row justify-center gap-1 w-screen'>
                        <Button onClick={() => setSwap(!swap)} width={true} icon={<MdOutlineSwapHorizontalCircle className='text-3xl' />} />
                        <Button 
                            width={false} 
                            onClick={handleSearch} 
                            icon={<IoSearch className="text-2xl mt-[3px]" />} 
                            text="Search"
                        />
                    </div>
                </div>
            </main>
            <article className='mx-auto xl:w-[1200px] lg:w-[900px] md:w-[650px] sm:w-[550px] w-[320px] text-sm md:text-md mt-4'>
                <p className='text-sm font-medium italic mt-8 text-red-700 text-center '>Supreme Court Latest News</p>
                <div className='w-full h-[2px] bg-red-500 mb-4'></div>
                {articlesToDisplay.length > 0 ? (
                    articlesToDisplay.map((article, index) => (
                        <div key={index} className='mb-8'>
                            <button 
                                onClick={() => handleTitleClick(article.link)} 
                                className='text-md font-semibold text-red-700 text-left'
                            >
                                <u>{article.title}</u>
                            </button>
                            <p className='text-sm text-gray-500'>{article.date}</p>
                            <p className='text-sm my-2'>{article.summary}</p>
                        </div>
                    ))
                ) : (
                    <p>No articles available</p>
                )}
                {/* Show More Button */}
                {!showMore && articles.length > 5 && (
                    <button 
                        className='text-red-800 text-md underline text-center w-full'
                        onClick={handleShowMore}
                    >
                        Show More
                    </button>
                )}
            </article>
        </div>
    );
}

export default Home;
