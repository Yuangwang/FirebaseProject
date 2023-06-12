import { useEffect, useState, useCallback, useContext } from "react";
import TodoItem from "./TodoItem";
import EditingItem from "./EditingItem";
import NewItem from "../common/NewItem";
import { useLocation } from "react-router-dom";
import ShareList from "./ShareList";
import styled from "styled-components";
import { ServerContext } from "../App";
import {
  getCurrentListItemsFirebase,
  getCurrentListAccessorsFirebase,
  markItemCheckedFirebase,
  editItemNameFirebase,
  setEditingStateFirebase,
  addNewItemFirebase,
  deleteItemFirebase,
} from "../firebaseUtils";
import ListGroup from "react-bootstrap/ListGroup";

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10%;
`;

const ListTitle = styled.div`
  border-bottom: 2px solid rgb(84, 84, 90);
  font-size: 36px;
  letter-spacing: 1px;
  background-color: transparent;
`;

function TodoList() {
  const { db, storage } = useContext(ServerContext);

  const location = useLocation();
  const { listKey, listName } = location.state;
  const [items, setItems] = useState([]);
  const [isloading, setIsloading] = useState(true);
  const [editedItem, setEditedItem] = useState();
  const [accessors, setAccessors] = useState();

  const setEditingItem = useCallback(
    (itemKey, editing) => {
      setEditingStateFirebase(db, listKey, itemKey, editing);
    },
    [db, listKey]
  );
  const editListItemName = (itemKey, name) => {
    editItemNameFirebase(db, listKey, itemKey, name);
  };
  const markItemChecked = (itemKey, checked) => {
    markItemCheckedFirebase(db, listKey, itemKey, checked);
  };
  const addNewItem = (name) => {
    addNewItemFirebase(db, listKey, name);
  };
  const deleteItem = (itemKey) => {
    deleteItemFirebase(db, storage, listKey, itemKey);
  };
  useEffect(() => {
    const cleanup = () => {
      if (editedItem != null) {
        setEditingItem(editedItem, false);
      }
    };
    window.onpopstate = cleanup;

    window.addEventListener("beforeunload", cleanup);
    return () => {
      window.removeEventListener("beforeunload", cleanup);
    };
  }, [editedItem, setEditingItem]);

  useEffect(() => {
    getCurrentListItemsFirebase(db, listKey, setItems, setIsloading);
    getCurrentListAccessorsFirebase(db, listKey, setAccessors);
  }, [db, listKey]);

  return (
    <ListWrapper>
      <ListTitle> {listName} </ListTitle>
      {isloading ? (
        <div>loading</div>
      ) : (
        <>
          <ul className="noBulletList">
            {Object.keys(items).map((itemKey) =>
              itemKey === editedItem ? (
                <EditingItem
                  itemKey={itemKey}
                  items={items}
                  setEditingItem={setEditingItem}
                  setEditedItem={setEditedItem}
                  editListItemName={editListItemName}
                />
              ) : items[itemKey].editing ? (
                <div class="typingIndicatorContainer">
                  <div class="typingIndicatorBubble">
                    <div class="typingIndicatorBubbleDot"></div>
                    <div class="typingIndicatorBubbleDot"></div>
                    <div class="typingIndicatorBubbleDot"></div>
                  </div>
                </div>
              ) : (
                <TodoItem
                  itemKey={itemKey}
                  items={items}
                  setEditingItem={setEditingItem}
                  editedItem={editedItem}
                  setEditedItem={setEditedItem}
                  markItemChecked={markItemChecked}
                  deleteItem={deleteItem}
                  storage={storage}
                  listKey={listKey}
                />
              )
            )}
          </ul>
          <NewItem addNewItem={addNewItem} />
          <ShareList items={items} listKey={listKey} listName={listName} />
          <div>Shared with:</div>
          {accessors && (
            <ListGroup>
              {accessors.map((name) => (
                <ListGroup.Item>{name}</ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </>
      )}
    </ListWrapper>
  );
}

export default TodoList;
