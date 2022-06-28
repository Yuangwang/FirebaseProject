import { useState } from 'react';
import { firebaseConfig } from "../configs"
import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref, update } from "firebase/database"
import { getStorage, ref as sRef, updateMetadata } from "firebase/storage";
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'


function ShareList({ items, listKey, listName }) {
    const [inputEmail, setInputEmail] = useState("")
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const storage = getStorage(app);
    const updateAccessors = (email) => {
        const commaEmail = email.replaceAll(".", ",")
        onValue(ref(db, `accounts/${commaEmail}`), (snapshot) => {
            const shareToUid = snapshot.val();
            if (shareToUid != null) {

                Object.keys(items).forEach((item) => {
                    const pictureRef = sRef(storage, `images/${item}`);
                    const newUserAccess = {
                        customMetadata: {
                            [shareToUid]: true
                        }
                    };
                    updateMetadata(pictureRef, newUserAccess);
                })



                const updates = {};
                updates[`/users/${shareToUid}/lists/${listKey}`] = { name: listName };
                updates[`/lists/${listKey}/accessors/${shareToUid}`] = true;
                return update(ref(db), updates);

            }
        }, {
            onlyOnce: true
        });
    }

    return (
        <div style={{ "display": "flex", "margin": "10px" }}>
            <Form.Group>
                <Form.Control placeholder="Share with someone" value={inputEmail} onChange={(e) => setInputEmail(e.currentTarget.value)} />
            </Form.Group>
            <Button variant="light" onClick={() => {
                updateAccessors(inputEmail)
                setInputEmail("")
            }}>done</Button>
        </div>);
}

export default ShareList;
