// *******************************************************************************
//  * Copyright 2024 Adobe
//  *
//  * Licensed under the Apache License, Version 2.0 (the “License”);
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  *     http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an “AS IS” BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  ******************************************************************************

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
