import { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Dialog, Transition } from '@headlessui/react';

const UrlScraper = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [markdown, setMarkdown] = useState(''); 
  const [showError, setShowError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await axios.get(`/api/scrape?url=${encodeURIComponent(url)}`);
      const articleText = response.data.data;
      console.log('Markdown:', articleText); 
      setMarkdown(articleText);
    } catch (error) {
      setShowError(true);
    }
  
    setLoading(false);
  };
  

  return (
    <div className="prose container mx-auto flex flex-col items-center justify-center">
      <form onSubmit={handleSubmit} className="flex items-center justify-center">
        <label htmlFor="url" className="sr-only">
          URL
        </label>
        <div className="relative rounded-md shadow-sm">
          <input
            type="text"
            name="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="block w-full pr-10 sm:text-sm border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10"
            placeholder="Enter URL"
          />
        </div>
        <button
          type="submit"
          className="ml-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {loading ? (
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            'Submit'
          )}
        </button>
      </form>
      <ReactMarkdown className="prose prose-lg mt-6 max-w-3xl mx-auto">{markdown}</ReactMarkdown>


      
      




      <Transition show={showError}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setShowError(false)}
        >
          <div className="...">
            <Dialog.Title className="...">Error</Dialog.Title>
            <Dialog.Description className="...">
              Data was unable to be fetched.
            </Dialog.Description>
            <button
              type="button"
              className="..."
              onClick={() => setShowError(false)}
            >
              Close
            </button>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default UrlScraper;