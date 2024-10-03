import { useState, useEffect } from "react";

const useFetch = () => {
  const [data, setData] = useState(null);
  let url = "";
  if (process.env.NEXT_PUBLIC_FETCH_FROM_AEM === "true") {
    url = `/content/forms/af/${process.env.NEXT_PUBLIC_AEM_FORM_PATH}/jcr:content/guideContainer.model.json`;
  } else {
    url = `${process.env.NEXT_PUBLIC_AEM_HOST}content/core-components-examples/library/adaptive-form/${process.env.NEXT_PUBLIC_AEM_FORM_PATH}/jcr:content/root/responsivegrid/demo/component/guideContainer.model.json`;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
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
