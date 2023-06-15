import { Amplify, Auth, DataStore, Storage } from "aws-amplify";
import awsconfig from "./aws-exports";
import { User, ListItem, List, UserList } from "./models";

export function setupAws() {
  Amplify.configure(awsconfig);
  Auth.configure(awsconfig);
  DataStore.configure(awsconfig);

  return { auth: Auth, db: DataStore, storage: Storage };
}

export async function getCurrentUserAws(auth, db) {
  const authedUser = await auth.currentUserInfo();
  console.log(JSON.stringify(authedUser, null, 4));
  return await getUserAws(db, authedUser.attributes.email, /* signUp= */ true);
}

async function getUserAws(db, email, signUp = false) {
  const user = await db.query(User, (u) => u.email.eq(email));
  if (user.length === 0 && signUp) {
    return await signUpUserAws(db, email);
  }
  console.log("getUserAws: " + JSON.stringify(user));
  if (user.length !== 1) {
    return undefined;
  }
  return user[0];
}

export async function signUpUserAws(db, email) {
  console.log("signUpUserAws");
  return await db.save(
    new User({
      email: email,
    })
  );
}

export async function getUsersViewableListsAws(db, uid) {
  const userLists = await db.query(UserList, (l) => l.userListUserId.eq(uid));
  const result = {};
  userLists.forEach((l) => (result[l.id] = { name: l.listName }));
  return result;
}

export async function addNewListAws(db, uid, listName) {
  const list = await db.save(
    new List({
      name: listName,
    })
  );
  const userList = await db.save(
    new UserList({
      userListUserId: uid,
      userListListId: list.id,
      listName,
    })
  );
  console.log("Created new userlist: " + JSON.stringify(userList));
  return userList;
}

export async function getCurrentListItemsAws(db, listKey) {
  const listItems = await db.query(ListItem, (li) => li.listID.eq(listKey));
  const result = {};
  listItems.forEach((li) => (result[li.id] = li));
  return result;
}

export async function getCurrentListAccessorsAws(db, listKey) {
  const userLists = await db.query(UserList, (l) =>
    l.userListListId.eq(listKey)
  );
  return Promise.all(userLists.map((ul) => ul.user)).then((users) => {
    return users.map((u) => u.email);
  });
}

export async function addNewListItemAws(db, listKey, name) {
  console.log("adding new item");
  return await db.save(
    new ListItem({
      name: name,
      listID: listKey,
      checked: false,
      editing: false,
    })
  );
}

export async function setListItemStateEditingAws(db, itemKey, editing) {
  const listItem = (await db.query(ListItem, (li) => li.id.eq(itemKey)))[0];
  return await db.save(
    ListItem.copyOf(listItem, (draft) => {
      draft.editing = editing;
      console.log(
        "setListItemStateEditingAws saving: " + JSON.stringify(draft)
      );
    })
  );
}

export async function uploadImageAws(
  storage,
  itemKey,
  file,
  setUploadProgress,
  setDownloadUrl
) {
  await storage.put("images/" + itemKey, file, {
    progressCallback(progress) {
      const uploadProgress = (progress.loaded / progress.total) * 100;
      setUploadProgress(uploadProgress);
      console.log(`Uploaded: ${uploadProgress}`);
      if (uploadProgress === 100) {
        console.log(`Successfully uploaded`);
        setTimeout(() => {
          setUploadProgress(-1);
        }, 500);
      }
    },
  });
}

export async function getImageUrlAws(storage, imageKey) {
  return await storage.get("images/" + imageKey);
}

export async function updateAccessorAws(db, email, listKey, listName) {
  const user = await getUserAws(db, email, /* signUp= */ true);
  if (user === undefined) {
    console.error("missing user: " + email);
    return;
  }
  await db.save(
    new UserList({
      userListUserId: user.id,
      userListListId: listKey,
      listName: listName,
    })
  );
  console.log("saved new accessor");
}
