import React, { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaRegCopy } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { useLocation, useNavigate } from 'react-router-dom';
import law from '../assets/law.png';
import Button from '../components/Button';
import Navbar from '../components/Navbar';

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { query } = location.state || {};
  const [results, setResults] = useState('');
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState(query || "");
  const [copied, setCopied] = useState(false);

  // Function to fetch AI results
  const fetchResults = async () => {
    if (search) {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8000/general-search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_query: search }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setResults(data.response || 'No results found');
        get_articles();
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch results');
      } finally {
        setLoading(false);
      }
    }
  };

  // Function to get article links
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

  // Function to handle title click and fetch detailed article data
  const handleTitleClick = async (link) => {
      setLoading(true); // Handle loading state for detailed article fetching
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
    setResults(''); // Clear previous results
    fetchResults(); // Fetch new results
  };

  function stripHTMLTags(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  }

  // Perform initial search if query is available
  useEffect(() => {
    if (query) {
      fetchResults();
    }
  }, [query]);

  if (loading) return <div className='w-screen select-none h-screen flex flex-col justify-center items-center text-black bg-white text-xl'><img src={law} className='h-20 animate-ping border-2 rounded-full border-red-700' /></div>;
  if (error) return <div className='w-screen select-none h-screen flex flex-col justify-center items-center text-black bg-white text-xl'><h2 className='animate-pulse'>{error}</h2></div>;

  return (
    <div className='w-screen font-inter min-h-screen max-h-auto flex flex-col justify-start items-center text-black bg-white'>
      <Navbar />
      <div className='flex justify-center w-screen pb-0 gap-2 mt-4'>
        <input 
          type="text" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className='p-2 h-12 mb-2 xl:w-[1200px] lg:w-[900px] md:w-[650px] sm:w-[550px] w-[320px] text-sm md:text-md rounded-md bg-gray-200 text-black ' 
        />
        <Button 
          width={true} 
          icon={<IoSearch className="text-2xl mt-[3px]" />} 
          onClick={handleSearch}
        />
      </div>
      <div className='flex flex-row justify-start xl:gap-20 md:gap-1 gap-10 xl:w-[1250px] lg:w-[950px] md:w-[700px] sm:w-[600px] w-[380px] text-xs md:text-md'>
        <a href="#"><u>All</u></a>
        <a href="#"><u>Section</u></a>
        <a href="#"><u>Previous cases</u></a>
      </div>
      <div className='text-white bg-red-800 transition-all ease-in-out xl:w-[1250px] lg:w-[950px] md:w-[700px] sm:w-[600px] w-[380px] text-sm md:text-md rounded-md p-3 max-h-auto mt-4 min-h-12'>
        <div dangerouslySetInnerHTML={{ __html: results }} />
        <div className='mt-6 flex flex-row justify-between'>
          <div className='flex flex-row gap-2 items-center'>
            <CopyToClipboard text={stripHTMLTags(results)} onCopy={() => setCopied(true)}>
              <button><FaRegCopy /></button>
            </CopyToClipboard>
            {copied && <span className='text-xs'>Copied!</span>}
          </div>
          <p className='text-sm font-thin'>
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
                className='text-md font-semibold text-red-700 text-left'
              >
                <u>{article.title}</u>
              </button>
              <p className='text-sm text-gray-500'>{article.date}</p>
              <p className='text-sm my-2'>{article.summary}</p>
            </div>
          ))
        ) : (
          <p>Loading Cases...</p>
        )}
      </article>

    </div>
  );
}

export default Results;
