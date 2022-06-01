import { initializeApp } from 'firebase/app';
import { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, push, set, remove } from "firebase/database";
import { getStorage, deleteObject, ref as sRef } from "firebase/storage";
import { firebaseConfig } from "../configs"
import TodoItem from './TodoItem';
import EditingItem from './EditingItem'
import NewItem from './NewItem'



function TodoList() {

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Get a reference to the database service
  const db = getDatabase(app);

  // Get a reference to the storage service
  const storage = getStorage(app);


  const [items, setItems] = useState([]);
  const [isloading, setIsloading] = useState(true);
  const [editedItem, setEditedItem] = useState()

  useEffect(() => {
    const cleanup = () => {
      if (editedItem != null) {
        setEditingItem(editedItem, false)
      }
    }

    window.addEventListener('beforeunload', cleanup);
    return () => {
      window.removeEventListener('beforeunload', cleanup);
    }
  }, [editedItem])

  useEffect(() => {
    const todolistRef = ref(db, 'list/');
    onValue(todolistRef, (snapshot) => {
      const data = snapshot.val();
      setItems(data);
      setIsloading(false);
    });
  }, [])

  const setEditingItem = (itemKey, editing) => {
    const todoItemCheckedRef = ref(db, 'list/' + itemKey + '/editing')
    set(todoItemCheckedRef, editing);
  }
  const editListItemName = (itemKey, name) => {
    const todoItemNameRef = ref(db, 'list/' + itemKey + '/name')
    set(todoItemNameRef, name);
  }
  const markItemChecked = (itemKey, checked) => {
    const todoItemCheckedRef = ref(db, 'list/' + itemKey + '/checked')
    set(todoItemCheckedRef, checked);
  }
  const addNewItem = (name) => {
    const todoListRef = ref(db, 'list/')
    const newItemRef = push(todoListRef);
    set(newItemRef, { name, checked: false, editing: false });
  }
  const deleteItem = (itemKey) => {
    const currentItemRef = ref(db, 'list/' + itemKey);
    const imageRef = sRef(storage, `images/${itemKey}`);
    deleteObject(imageRef).then(() => {
      // File deleted successfully
    }).catch((error) => {
      // Uh-oh, an error occurred!
    });

    remove(currentItemRef);
  }

  return (

    <div>
      <header> TODO list</header>
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
                  <TodoItem
                    itemKey={itemKey}
                    items={items}
                    setEditingItem={setEditingItem}
                    editedItem={editedItem}
                    setEditedItem={setEditedItem}
                    markItemChecked={markItemChecked}
                    deleteItem={deleteItem}
                    storage={storage}
                  />

            )}
          </ul>
          <NewItem
            addNewItem={addNewItem}
            setEditingItem={setEditingItem}
            editedItem={editedItem}
            setEditedItem={setEditedItem} />
        </>
      }
    </div>
  );
}

export default TodoList;
