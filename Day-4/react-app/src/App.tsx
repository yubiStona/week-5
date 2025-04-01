import { useState } from "react";
import Alert from "./components/Alert";
import Button from "./components/Button";
import ListGroup from "./components/ListGroup";
function App() {
  const items = ["Dhangadhi", "Kathmandu", "Butwal", "Bhaktapur"];
  const onHandleClick = (items: string) => console.log(items);
  const heading = "cities";
  const [alertVisible, setAlertVisible] = useState(false);
  return (
    <>
      {alertVisible && (
        <Alert onClose={() => setAlertVisible(false)}>
          <h1>hello world</h1>
        </Alert>
      )}

      <ListGroup items={items} heading={heading} onSelectItem={onHandleClick} />
      <Button onClick={() => setAlertVisible(true)} />
    </>
  );
}

export default App;
