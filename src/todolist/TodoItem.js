import { useRef, useEffect, useState, useContext } from "react";
import styled from "styled-components";
import Form from "react-bootstrap/Form";
import { ServerContext } from "../App";
import Button from "react-bootstrap/Button";
import ProgressBar from "react-bootstrap/ProgressBar";
import "./styles.css";
import { getImageFirebase, uploadImageFirebase } from "../firebaseUtils";
import { getImageUrlAws, uploadImageAws } from "../awsUtils";

const TodoItemWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
`;
const IconsWrapper = styled.div`
  margin-left: auto;
`;
const StyledForm = styled.form`
  display: flex;
`;

function TodoItem({
  storage,
  itemKey,
  items,
  editedItem,
  setEditedItem,
  setEditingItem,
  markItemChecked,
  deleteItem,
  listKey,
}) {
  const inputFile = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(-1);

  const { db } = useContext(ServerContext);

  const setDownloadUrlFor = (itemKey) => {
    return (url) => {
      const img = document.getElementById(`${itemKey}image`);
      img.setAttribute("src", url);
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const file = inputFile?.current?.files[0];
    if (!file) return;
    uploadImageAws(
      storage,
      itemKey,
      file,
      setUploadProgress,
      setDownloadUrlFor(itemKey)
    );
  };

  useEffect(() => {
    const doTheThing = async () => {
      const url = await getImageUrlAws(storage, itemKey);
      console.log(`imageUrl: ${url}`);
      setDownloadUrlFor(itemKey)(url);
    };
    doTheThing().then(() => {});
  }, []);

  return (
    <li style={{ listStyle: "none" }} key={itemKey}>
      {items[itemKey].editing ? (
        <div class="typingIndicatorContainer">
          <div class="typingIndicatorBubble">
            <div class="typingIndicatorBubbleDot"></div>
            <div class="typingIndicatorBubbleDot"></div>
            <div class="typingIndicatorBubbleDot"></div>
          </div>
        </div>
      ) : (
        <>
          <TodoItemWrapper>
            <Form.Check
              style={{ color: "black" }}
              checked={items[itemKey].checked}
              onChange={() => markItemChecked(itemKey, !items[itemKey].checked)}
            />
            {items[itemKey].name}
            <IconsWrapper>
              <Button
                variant="light"
                onClick={() => {
                  if (editedItem != null) {
                    setEditingItem(editedItem, false);
                  }
                  setEditingItem(itemKey, true);
                  setEditedItem(itemKey);
                }}
              >
                edit
              </Button>
              <Button
                variant="light"
                onClick={() => {
                  deleteItem(itemKey);
                }}
              >
                delete
              </Button>
            </IconsWrapper>
          </TodoItemWrapper>
          <StyledForm onSubmit={handleSubmit}>
            <Form.Group controlId="formFile">
              <Form.Control type="file" ref={inputFile} />
            </Form.Group>
            <Button variant="light" type="submit">
              Upload
            </Button>
          </StyledForm>
          {uploadProgress !== -1 && <ProgressBar now={uploadProgress} />}

          <img
            id={`${itemKey}image`}
            style={{ width: "400px", height: "auto" }}
          />
        </>
      )}
    </li>
  );
}

export default TodoItem;
