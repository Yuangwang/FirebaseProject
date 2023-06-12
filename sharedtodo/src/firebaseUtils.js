import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { firebaseConfig } from "./configs";
import {
  getDatabase,
  ref,
  set,
  onValue,
  push,
  update,
  remove,
} from "firebase/database";
import {
  getStorage,
  deleteObject,
  updateMetadata,
  getDownloadURL,
  uploadBytesResumable,
  ref as sRef,
} from "firebase/storage";

// sets up firebase auth and db and sets UID
export function setupFirebaseAndUID({ setUID }) {
  const app = initializeApp(firebaseConfig);

  const auth = getAuth(app);
  const db = getDatabase(app);
  const storage = getStorage(app);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUID(user.uid);
      set(ref(db, "accounts/" + user.email.replaceAll(".", ",")), user.uid);
      set(
        ref(db, "accounts_to_email/" + user.uid),
        user.email.replaceAll(".", ",")
      );
    } else {
      setUID(null);
    }
  });
  return { auth, db, storage };
}
export function getUsersViewableListsFirebase(
  db,
  uid,
  setUsersLists,
  setIsloading
) {
  const usersListsRef = ref(db, `users/${uid}/lists`);
  onValue(usersListsRef, (snapshot) => {
    setIsloading(false);
    const data = snapshot.val();
    if (data != null) {
      setUsersLists(data);
    }
  });
}
export function addNewListFirebase(db, uid, name) {
  const newUsersListKey = push(ref(db, `/users/${uid}/lists`)).key;

  const updates = {};
  updates[`/users/${uid}/lists/${newUsersListKey}`] = { name };
  updates[`/lists/${newUsersListKey}`] = { name, accessors: { [uid]: true } };
  return update(ref(db), updates);
}
export function getCurrentListItemsFirebase(
  db,
  listKey,
  setItems,
  setIsloading
) {
  const todolistRef = ref(db, `lists/${listKey}/items`);
  onValue(todolistRef, (snapshot) => {
    const data = snapshot.val();
    if (data == null) {
      setItems([]);
    } else {
      setItems(data);
    }
    setIsloading(false);
  });
}
export function getCurrentListAccessorsFirebase(db, listKey, setAccessors) {
  const accessorsRef = ref(db, `lists/${listKey}/accessors`);
  onValue(accessorsRef, (snapshot) => {
    const data = snapshot.val();
    if (data == null) {
      setAccessors([]);
    } else {
      const accountsToEmailRef = ref(db, `accounts_to_email`);
      onValue(accountsToEmailRef, (snapshot) => {
        const accountsToEmail = snapshot.val();

        setAccessors(
          Object.keys(data).map((key) =>
            accountsToEmail[key].replaceAll(",", ".")
          )
        );
      });
    }
  });
}
export function markItemCheckedFirebase(db, listKey, itemKey, checked) {
  const todoItemCheckedRef = ref(
    db,
    `lists/${listKey}/items/${itemKey}/checked`
  );
  set(todoItemCheckedRef, checked);
}
export function editItemNameFirebase(db, listKey, itemKey, name) {
  const todoItemNameRef = ref(db, `lists/${listKey}/items/${itemKey}/name`);
  set(todoItemNameRef, name);
}
export function setEditingStateFirebase(db, listKey, itemKey, editing) {
  const todoItemCheckedRef = ref(
    db,
    `lists/${listKey}/items/${itemKey}/editing`
  );
  set(todoItemCheckedRef, editing);
}

export function addNewItemFirebase(db, listKey, name) {
  const todoListRef = ref(db, `lists/${listKey}/items`);
  const newItemRef = push(todoListRef);
  set(newItemRef, { name, checked: false, editing: false });
}

export function deleteItemFirebase(db, storage, listKey, itemKey) {
  const currentItemRef = ref(db, `lists/${listKey}/items/${itemKey}`);
  const imageRef = sRef(storage, `images/${itemKey}`);
  remove(currentItemRef);
  deleteObject(imageRef)
    .then(() => {
      // File deleted successfully
    })
    .catch((error) => {
      // Uh-oh, an error occurred!
    });
}

export function updateAccessorFirebase(
  db,
  storage,
  email,
  items,
  listKey,
  listName
) {
  const commaEmail = email.replaceAll(".", ",");
  onValue(
    ref(db, `accounts/${commaEmail}`),
    (snapshot) => {
      const shareToUid = snapshot.val();
      if (shareToUid != null) {
        Object.keys(items).forEach((item) => {
          const pictureRef = sRef(storage, `images/${item}`);
          const newUserAccess = {
            customMetadata: {
              [shareToUid]: true,
            },
          };
          updateMetadata(pictureRef, newUserAccess);
        });

        const updates = {};
        updates[`/users/${shareToUid}/lists/${listKey}`] = { name: listName };
        updates[`/lists/${listKey}/accessors/${shareToUid}`] = true;
        return update(ref(db), updates);
      }
    },
    {
      onlyOnce: true,
    }
  );
}

export function getImageFirebase(storage, itemKey, setDownloadUrl) {
  const imageRef = sRef(storage, `images/${itemKey}`);
  getDownloadURL(imageRef)
    .then((url) => {
      setDownloadUrl(url);
      // const img = document.getElementById(`${itemKey}image`)
      // img.setAttribute('src', url);
    })
    .catch((error) => {});
}

export function uploadImageFirebase(
  db,
  storage,
  listKey,
  itemKey,
  file,
  setUploadProgress,
  setDownloadUrl
) {
  const accessorsRef = ref(db, `lists/${listKey}/accessors`);
  onValue(
    accessorsRef,
    (snapshot) => {
      const data = snapshot.val();
      const storageRef = sRef(storage, `images/${itemKey}`);
      const metadata = {
        customMetadata: {
          ...data,
        },
      };
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setUploadProgress(progress);
        },
        (error) => {},
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setDownloadUrl(downloadURL);
          });
          setUploadProgress(100);

          setTimeout(() => {
            setUploadProgress(-1);
          }, 500);
        }
      );
    },
    {
      onlyOnce: true,
    }
  );
}
