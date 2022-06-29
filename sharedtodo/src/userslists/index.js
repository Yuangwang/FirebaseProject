import { initializeApp } from 'firebase/app';
import { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, push, child, remove, update, set } from "firebase/database";
import { firebaseConfig } from "../configs"
import Card from 'react-bootstrap/Card';
import NewItem from '../common/NewItem'
import ListItem from './ListItem'
import styled from "styled-components"
import "./loader.css";


const Wrapper = styled.div`
    display:flex;
    flex-direction:column;
    align-items:center;
    margin-bottom:30px;

`
const CardWrapper = styled.div`
    display:flex;
    flex-direction:row;
    align-items:center;
    margin-left:50px;
    margin-right:50px;
    gap:20px;
    flex-wrap:wrap;

`

function UsersLists({ uid }) {

  const [usersLists, setUsersLists] = useState([]);
  const [isloading, setIsloading] = useState(true);

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Get a reference to the database service
  const db = getDatabase(app);

  const addNewList = (name) => {
    const newUsersListKey = push(ref(db, `/users/${uid}/lists`)).key;

    const updates = {};
    updates[`/users/${uid}/lists/${newUsersListKey}`] = { name };
    updates[`/lists/${newUsersListKey}`] = { name, accessors: { [uid]: true } };
    return update(ref(db), updates);
  }

  useEffect(() => {
    const usersListsRef = ref(db, `users/${uid}/lists`);
    onValue(usersListsRef, (snapshot) => {
      setIsloading(false)
      const data = snapshot.val();
      if (data != null) {
        setUsersLists(data);
      }
    });
  }, [db, uid])



  return (
    <>
      {isloading ? <div className="centerFlex"><div className="lds-ring"><div></div><div></div><div></div><div></div></div></div> :
        <>
          {uid != null ?
            <>
              <Wrapper>
                <h1>Your Lists:</h1>
              </Wrapper>
              <CardWrapper>{Object.keys(usersLists).map(
                (listKey) => {
                  return <ListItem listKey={listKey} name={usersLists[listKey].name} collaborators={usersLists[listKey].accessors} />
                })}
                <div>
                  <Card style={{ height: '8rem', width: '18rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <NewItem addNewItem={addNewList} />
                  </Card>
                </div>
              </CardWrapper>
            </> :
            "Please login"
          }
        </>
      }
    </>
  );
}

export default UsersLists;
