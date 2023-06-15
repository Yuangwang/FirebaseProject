import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
function Newitem({ addNewItem }) {
  const [isAddingNewitem, setIsAddingNewItem] = useState(false);
  const [newItemName, setNewItemName] = useState("");

  return (
    <>
      {isAddingNewitem ? (
        <>
          <Form.Group style={{ "marginBottom": "10px" }}>
            <Form.Control
              placeholder="Enter new item name"
              value={newItemName}
              onChange={(e) => setNewItemName(e.currentTarget.value)}
            />
          </Form.Group>
          <div style={{ display: "flex", gap: "10px" }}>
            <Button
              variant="light"
              onClick={async () => {
                setIsAddingNewItem(false);
                setNewItemName("");
                await addNewItem(newItemName);
              }}
            >
              Done
            </Button>
            <Button
              variant="light"
              onClick={() => {
                setIsAddingNewItem(false);
                setNewItemName("");
              }}
            >
              Cancel
            </Button>
          </div>
        </>
      ) : (
        <Button variant="light" onClick={() => setIsAddingNewItem(true)}>
          Add new item
        </Button>
      )}
    </>
  );
}

export default Newitem;
