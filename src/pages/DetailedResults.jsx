import React, { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaRegCopy } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { useLocation, useNavigate } from 'react-router-dom';
import law from '../assets/law.png';
import Button from '../components/Button';
import Navbar from '../components/Navbar';

function DetailedResults() {
    const location = useLocation();
    const navigate = useNavigate();
    const { query, problem } = location.state || {};
    const [results, setResults] = useState('');
    const [loading, setLoading] = useState(false);
    const [links, setLinks] = useState([]);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState(query || "");
    const [detailedSearch, setDetailedSearch] = useState(problem || "");
    const [copied, setCopied] = useState(false);
    const [predictiveAnalysis, setPredictiveAnalysis] = useState('');
    const [displayContent, setDisplayContent] = useState(''); // New state for displaying content
    const [activeLink, setActiveLink] = useState(''); // New state for active link

    function stripHTMLTags(html) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    }

    const fetchResults = async () => {
        if (search && detailedSearch) {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:8000/detailed-search', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_query: search, user_problem: detailedSearch }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                get_articles();
                setResults(data.response || 'No results found');
                setDisplayContent(data.response || 'No results found'); // Set content to display
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch results');
            } finally {
                setLoading(false);
            }
        }
    };

    const get_articles = async () => {
        if (search.trim()) {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:8000/search-kanoon', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_query: search }),
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch articles');
                }

                const data = await response.json();
                setLinks(data);
            } catch (error) {
                console.error('Error fetching articles:', error);
                setError('Failed to fetch articles');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleTitleClick = async (link) => {
        setActiveLink(link); // Set the active link
        setLoading(true);
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
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setResults('');
        fetchResults();
    };

    const handlePredictiveAnalysis = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/precedent-content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_query: search, user_problem: detailedSearch }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch predictive analysis');
            }

            const data = await response.json();
            setPredictiveAnalysis(data.precedent_analysis || 'No predictive analysis available');
            setDisplayContent(data.precedent_analysis || 'No predictive analysis available'); // Set content to display
        } catch (error) {
            console.error('Error fetching predictive analysis:', error);
            setError('Failed to fetch predictive analysis');
        } finally {
            setLoading(false);
        }
    };

    const handleAllClick = () => {
        setDisplayContent(results); // Set content to display when "All" is clicked
    };

    useEffect(() => {
        if (query && problem) {
            fetchResults();
        }
    }, [query, problem]);

    if (loading) {
        return <div className='w-screen h-screen select-none flex flex-col justify-center items-center text-black bg-white text-xl'>
            <img src={law} className='h-20 animate-ping border-2 rounded-full border-red-700' />
        </div>;
    }

    if (error) {
        return <div className='w-screen h-screen select-none flex flex-col justify-center items-center text-black bg-white text-xl'>
            <h2 className='animate-pulse'>{error}</h2>
        </div>;
    }

    return (
        <div className='w-screen font-inter min-h-screen max-h-auto flex flex-col justify-start items-center text-black bg-white'>
            <Navbar />
            <div>
                <textarea
                    rows="5"
                    value={detailedSearch}
                    onChange={(e) => setDetailedSearch(e.target.value)}
                    placeholder='Detailed Search'
                    className='p-2 h-24 bg-gray-200 rounded-md text-black xl:w-[1250px] lg:w-[950px] md:w-[700px] sm:w-[600px] w-[380px] text-sm md:text-md'
                />
            </div>
            <div className='flex justify-center w-screen pb-0 gap-2 mt-4'>
                <input
                    type="text"
                    value={search}
                    placeholder='Query'
                    onChange={(e) => setSearch(e.target.value)}
                    className='p-2 h-12 bg-gray-200 mb-2 xl:w-[1200px] lg:w-[900px] md:w-[650px] sm:w-[550px] w-[320px] text-sm md:text-md rounded-md text-black'
                />
                <Button
                    width={true}
                    icon={<IoSearch className="text-2xl mt-[3px]" />}
                    onClick={handleSearch}
                />
            </div>
            <div className='flex flex-row justify-start xl:gap-20 md:gap-15 gap-10 xl:w-[1250px] lg:w-[950px] md:w-[700px] sm:w-[600px] w-[380px] text-xs md:text-md'>
                <a
                    href="#"
                    onClick={handleAllClick}
                    className={`transition-colors ${displayContent === results ? 'text-red-700' : 'text-black'}`}
                >
                    <u>All</u>
                </a>
                <a href="#" className='text-black'>
                    <u>Section</u>
                </a>
                <a href="#" className='text-black'>
                    <u>Previous cases</u>
                </a>
                <a
                    href="#"
                    onClick={handlePredictiveAnalysis}
                    className={`transition-colors ${displayContent === predictiveAnalysis ? 'text-red-700' : 'text-black'}`}
                >
                    <u>Predictive analysis</u>
                </a>
            </div>
            <div className='text-white bg-red-800 transition-all ease-in-out xl:w-[1250px] lg:w-[950px] md:w-[700px] sm:w-[600px] w-[380px] text-sm md:text-md rounded-md p-3 max-h-auto mt-4 min-h-12'>
                <div dangerouslySetInnerHTML={{ __html: displayContent }} />
                <div className='mt-6 flex flex-row justify-between'>
                    <div className='flex flex-row gap-2 items-center'>
                        <CopyToClipboard text={stripHTMLTags(displayContent)} onCopy={() => setCopied(true)}>
                            <button><FaRegCopy /></button>
                        </CopyToClipboard>

                        {copied && <span className='text-xs'>Copied!</span>}
                    </div>
                    <p className='text-sm font-thin text-right'>
                        Commercial Law Ai
                    </p>
                </div>
            </div>

            <article className='mx-auto xl:w-[1250px] lg:w-[950px] md:w-[700px] sm:w-[600px] w-[380px] text-sm md:text-md mt-4'>
                <p className='text-sm font-medium italic mt-8 text-red-700 '>Related cases</p>
                <div className='w-full h-[2px] bg-red-500 mb-4'></div>
                {links.length > 0 ? (
                links.map((article, index) => (
                    <div key={index} className='mb-8'>
                    <button
                        onClick={() => handleTitleClick(article.link)}
                        className={`text-md font-semibold text-red-700 text-left`}
                    >
                        <u>{article.title}</u>
                    </button>
                    <p className='text-sm text-gray-500'>{article.date}</p>
                    <p className='text-sm my-2'>{article.summary}</p>
                    </div>
                ))
                ) : (
                <p>Loading cases...</p>
                )}
            </article>

        </div>
    );
}

export default DetailedResults;
