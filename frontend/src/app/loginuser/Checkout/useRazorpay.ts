import { useState, useEffect } from 'react';

const SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

const useRazorpay = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (window.Razorpay) {
      setIsLoaded(true);
      return;
    }

    if (document.querySelector(`script[src="${SCRIPT_URL}"]`)) {
      const timer = setInterval(() => {
        if (window.Razorpay) {
          setIsLoaded(true);
          clearInterval(timer);
        }
      }, 50);
      return () => clearInterval(timer);
    }

    const script = document.createElement('script');
    script.src = SCRIPT_URL;
    script.async = true;

    const onScriptLoad = () => setIsLoaded(true);
    const onScriptError = () => setError("Could not load the Razorpay script. Please check your internet connection and try again.");
    
    script.addEventListener('load', onScriptLoad);
    script.addEventListener('error', onScriptError);

    document.body.appendChild(script);

    return () => {
      script.removeEventListener('load', onScriptLoad);
      script.removeEventListener('error', onScriptError);
    };
  }, []);

  return { isLoaded, error };
};

export default useRazorpay;