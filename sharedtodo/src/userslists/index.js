import { useEffect, useState, useContext } from 'react';
import { ServerContext } from '../App';
import Card from 'react-bootstrap/Card';
import NewItem from '../common/NewItem'
import ListItem from './ListItem'
import styled from "styled-components"
import { getUsersViewableListsFirebase, addNewListFirebase } from '../firebaseUtils';
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
  // list of lists the current user can see
  // in the form of [{listKey1:{name:name1},{listKey2:{name:name2},...}]
  const [usersLists, setUsersLists] = useState([]);
  const [isloading, setIsloading] = useState(true);


  // Get a reference to the database service
  const { db } = useContext(ServerContext);
  const addNewList = (name) => {
    // handles firebase specific server logic to add a new list
    addNewListFirebase(db, uid, name)
  }

  useEffect(() => {
    // firebase implementation to get users lists, 
    // this auto updates the page when new lists are added as well
    getUsersViewableListsFirebase(db, uid, setUsersLists, setIsloading)
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
                  return <ListItem listKey={listKey} name={usersLists[listKey].name} />
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
