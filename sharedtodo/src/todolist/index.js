import { initializeApp } from 'firebase/app';
import { useEffect, useState, useCallback } from 'react';
import { getDatabase, ref, onValue, push, set, remove } from "firebase/database";
import { getStorage, deleteObject, ref as sRef } from "firebase/storage";
import { firebaseConfig } from "../configs"
import TodoItem from './TodoItem';
import EditingItem from './EditingItem'
import NewItem from '../common/NewItem'
import { useLocation } from 'react-router-dom'
import ShareList from './ShareList';
import styled from 'styled-components'
import ListGroup from 'react-bootstrap/ListGroup'


const ListWrapper = styled.div`
  display:flex;
  flex-direction:column;
  margin:10%;
`

const ListTitle = styled.div`
border-bottom: 2px solid rgb(84, 84, 90);
font-size: 36px;
letter-spacing: 1px;
background-color: transparent;
`

function TodoList() {


  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Get a reference to the database service
  const db = getDatabase(app);

  // Get a reference to the storage service
  const storage = getStorage(app);

  const location = useLocation()
  const { listKey, listName } = location.state
  const [items, setItems] = useState([]);
  const [isloading, setIsloading] = useState(true);
  const [editedItem, setEditedItem] = useState()
  const [accessors, setAccessors] = useState();

  const setEditingItem = useCallback((itemKey, editing) => {
    const todoItemCheckedRef = ref(db, `lists/${listKey}/items/${itemKey}/editing`)
    set(todoItemCheckedRef, editing);
  }, [db])
  const editListItemName = (itemKey, name) => {
    const todoItemNameRef = ref(db, `lists/${listKey}/items/${itemKey}/name`)
    set(todoItemNameRef, name);
  }
  const markItemChecked = (itemKey, checked) => {
    const todoItemCheckedRef = ref(db, `lists/${listKey}/items/${itemKey}/checked`)
    set(todoItemCheckedRef, checked);
  }
  const addNewItem = (name) => {
    const todoListRef = ref(db, `lists/${listKey}/items`)
    const newItemRef = push(todoListRef);
    set(newItemRef, { name, checked: false, editing: false });
  }
  const deleteItem = (itemKey) => {
    const currentItemRef = ref(db, `lists/${listKey}/items/${itemKey}`);
    const imageRef = sRef(storage, `images/${itemKey}`);
    remove(currentItemRef);
    // deleteObject(imageRef).then(() => {
    //   // File deleted successfully
    // }).catch((error) => {
    //   // Uh-oh, an error occurred!
    // });

  }
  useEffect(() => {
    const cleanup = () => {
      if (editedItem != null) {
        setEditingItem(editedItem, false)
      }
    }
    window.onpopstate = cleanup;

    window.addEventListener('beforeunload', cleanup);
    return () => {
      window.removeEventListener('beforeunload', cleanup);
    }
  }, [editedItem, setEditingItem])

  useEffect(() => {
    const todolistRef = ref(db, `lists/${listKey}/items`);
    onValue(todolistRef, (snapshot) => {
      const data = snapshot.val();
      if (data == null) {
        setItems([]);
      } else {
        setItems(data)
      }
      setIsloading(false);
    });
    const accessorsRef = ref(db, `lists/${listKey}/accessors`);
    onValue(accessorsRef, (snapshot) => {
      const data = snapshot.val();
      if (data == null) {
        setAccessors([]);
      } else {
        const accountsToEmailRef = ref(db, `accounts_to_email`);
        onValue(accountsToEmailRef, (snapshot) => {
          const accountsToEmail = snapshot.val();

          setAccessors(Object.keys(data).map(key => accountsToEmail[key].replaceAll(",", ".")))
        });
      }
    });
  }, [db])

  return (

    <ListWrapper>
      <ListTitle> {listName} </ListTitle>
      {isloading ?
        <div>loading</div> :
        <>
          <ul className="noBulletList">

            {Object.keys(items).map(
              (itemKey) =>
                itemKey === editedItem ?
                  <EditingItem
                    itemKey={itemKey}
                    items={items}
                    setEditingItem={setEditingItem}
                    setEditedItem={setEditedItem}
                    editListItemName={editListItemName} /> :
                  items[itemKey].editing ? <div class="typingIndicatorContainer">
                    <div class="typingIndicatorBubble">
                      <div class="typingIndicatorBubbleDot"></div>
                      <div class="typingIndicatorBubbleDot"></div>
                      <div class="typingIndicatorBubbleDot"></div>
                    </div>
                  </div> :
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

            )}
          </ul>
          <NewItem
            addNewItem={addNewItem}
            setEditingItem={setEditingItem}
            editedItem={editedItem}
            setEditedItem={setEditedItem} />
          <ShareList items={items} listKey={listKey} listName={listName} />
          <div>Shared with:</div>
          {accessors &&
            <ListGroup>
              {accessors.map(name => <ListGroup.Item>{name}</ListGroup.Item>)}

            </ListGroup>
          }
        </>

      }
    </ListWrapper>
  );
}

export default TodoList;
