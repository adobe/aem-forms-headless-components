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

import { mappings } from "@aemforms/af-react-vanilla-components";

export default {
  ...mappings,
  'forms-components-examples/components/demo/component': mappings.panel,
  'forms-components-examples/components/form/verticaltabs': mappings["core/fd/components/form/verticaltabs/v1/verticaltabs"],
  'forms-components-examples/components/form/panelcontainer': mappings.panel
}