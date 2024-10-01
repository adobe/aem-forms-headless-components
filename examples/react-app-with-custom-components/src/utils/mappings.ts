import { mappings } from "@aemforms/af-react-vanilla-components";
import Slider from "../components/slider";

export default {
  ...mappings,
  'custom:slider': Slider,
  'forms-components-examples/components/demo/component': mappings.panel,
  'forms-components-examples/components/form/verticaltabs': mappings["core/fd/components/form/verticaltabs/v1/verticaltabs"],
  'forms-components-examples/components/form/panelcontainer': mappings.panel
}