import { useState, useContext } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { ServerContext } from "../App";
// import { updateAccessorFirebase } from "../firebaseUtils";
import { updateAccessorAws } from "../awsUtils";

function ShareList({ items, listKey, listName }) {
  const { db, storage } = useContext(ServerContext);
  const [inputEmail, setInputEmail] = useState("");
  const updateAccessors = async (email) => {
    // updateAccessorFirebase(db, storage, email, items, listKey, listName);
    await updateAccessorAws(db, email, listKey, listName);
  };

  return (
    <div style={{ display: "flex", margin: "10px" }}>
      <Form.Group>
        <Form.Control
          placeholder="Share with someone"
          value={inputEmail}
          onChange={(e) => setInputEmail(e.currentTarget.value)}
        />
      </Form.Group>
      <Button
        variant="light"
        onClick={async () => {
          await updateAccessors(inputEmail);
          setInputEmail("");
        }}
      >
        done
      </Button>
    </div>
  );
}

export default ShareList;
