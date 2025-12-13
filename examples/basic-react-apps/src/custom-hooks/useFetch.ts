// *******************************************************************************
//  * Copyright 2024 Adobe
//  *
//  * Licensed under the Apache License, Version 2.0 (the "License");
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  *     http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  ******************************************************************************

import { useState, useEffect } from "react";
const {
  REACT_APP_AEM_HOST,
  REACT_APP_AEM_AUTH_USER,
  REACT_APP_AEM_AUTH_PASS,
  REACT_APP_AEM_AUTH_TOKEN,
  REACT_APP_AEM_FORM_PATH,
} = process.env;

const getURL = () => {
  return `${REACT_APP_AEM_HOST}${REACT_APP_AEM_FORM_PATH}/jcr:content/guideContainer.model.json`;
};

const getAEMBasicAuth = () => {
  if (REACT_APP_AEM_AUTH_TOKEN) {
    return REACT_APP_AEM_AUTH_TOKEN;
  }
  const credentialsString =
    REACT_APP_AEM_AUTH_USER + ":" + REACT_APP_AEM_AUTH_PASS;
  // use browser-safe base64
  // btoa expects Latin1; for safety, escape unicode
  const toBase64 = (str: string) =>
    typeof btoa !== "undefined" ? btoa(unescape(encodeURIComponent(str))) : "";
  return "Basic " + toBase64(credentialsString);
};

const useFetch = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(getURL(), {
          method: "GET",
          headers: {
            Authorization: getAEMBasicAuth(),
            "Content-Type": "application/json",
          },
        });
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
