import { useState, useEffect } from 'react';
const {REACT_APP_USE_PROXY, REACT_APP_AEM_FORM_PATH } = process.env;

const getURL = () =>{
  if(REACT_APP_USE_PROXY === 'true'){
    return `/content/forms/af/${REACT_APP_AEM_FORM_PATH}/jcr:content/guideContainer.model.json`;
  }else {
    return `https://www.aemcomponents.dev/content/core-components-examples/library/adaptive-form/verticaltabs/jcr:content/root/responsivegrid/demo/component/guideContainer.model.json`
  }
}

const useFetch = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(getURL());
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
      }
    };

    fetchData();
  }, []);

  return data
};

export default useFetch;