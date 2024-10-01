
import { mappings } from "@aemforms/af-react-vanilla-components";

const customMappings: any = {
  ...mappings,
  'forms-components-examples/components/demo/component': mappings.panel,
  'forms-components-examples/components/form/verticaltabs': mappings["core/fd/components/form/verticaltabs/v1/verticaltabs"],
  'forms-components-examples/components/form/panelcontainer': mappings.panel

};

export default customMappings;