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


import React from "react";
import { Dimensions } from "react-native";
import { NativeBaseProvider, ScrollView, Box } from "native-base";
import { Themes } from "@aemforms/af-react-native";
import Form from "./src/Form";

const App = () => {
  const { height: heightOfDeviceScreen } = Dimensions.get("window");

  return (
    <NativeBaseProvider theme={Themes.primary}>
      <ScrollView
        contentContainerStyle={{ minHeight: heightOfDeviceScreen }}
        style={{ flex: 1 }}
      >
        <Box h="100%" safeArea bg="white" style={{ paddingHorizontal: 10 }}>
          <Form />
        </Box>
      </ScrollView>
    </NativeBaseProvider>
  );
};

export default App;
