import { useState, useEffect } from "react";
const { REACT_APP_AEM_HOST, REACT_APP_AEM_FORM_PATH } = process.env;

const getURL = () => {
  let url = `${REACT_APP_AEM_HOST}${REACT_APP_AEM_FORM_PATH}`;
  if (REACT_APP_AEM_FORM_PATH?.includes("jcr:content")) {
    return `${url}/guideContainer.model.json`;
  }
  return `${url}/jcr:content/guideContainer.model.json`;
};

const useFetch = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(getURL());
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
      }
    };

    fetchData();
  }, []);

  return data;
};

export default useFetch;
