import "./App.css";
import { ConditionBuilder } from "./ConditionalRow";
import { MultiStepForm } from "./MultiStepForm";

function App() {
  return (
    <section id="next-steps">
      <ConditionBuilder />
      <hr />
      <MultiStepForm />
    </section>
  );
}

export default App;
