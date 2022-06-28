import { useRef, useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../configs';
import { getDatabase, onValue } from 'firebase/database';
import { uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage'
import { ref as dref } from 'firebase/database'
import styled from 'styled-components';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';
import "./styles.css";




const TodoItemWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top:20px;
`
const IconsWrapper = styled.div`
margin-left: auto;
`
const StyledForm = styled.form`
display:flex;

`

function TodoItem({ storage, itemKey, items, editedItem, setEditedItem, setEditingItem, markItemChecked, deleteItem, listKey }) {
    const inputFile = useRef(null);
    const [uploadProgress, setUploadProgress] = useState(-1);


    const handleSubmit = (e) => {
        e.preventDefault()
        const file = inputFile?.current?.files[0];
        if (!file) return;
        // Initialize Firebase
        const app = initializeApp(firebaseConfig);

        // Get a reference to the database service
        const db = getDatabase(app);
        const accessorsRef = dref(db, `lists/${listKey}/accessors`);
        onValue(accessorsRef, (snapshot) => {
            const data = snapshot.val();
            const storageRef = ref(storage, `images/${itemKey}`);
            const metadata = {
                customMetadata: {
                    ...data
                }
            };
            const uploadTask = uploadBytesResumable(storageRef, file, metadata);


            uploadTask.on('state_changed',
                (snapshot) => {
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    setUploadProgress(progress)
                },
                (error) => {
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log('File available at', downloadURL);
                    });
                    setUploadProgress(100);

                    setTimeout(() => {
                        setUploadProgress(-1); window.location.reload()
                    }, 500)
                }
            );
        }, {
            onlyOnce: true
        });
    }
    useEffect(() => {
        const imageRef = ref(storage, `images/${itemKey}`);
        getDownloadURL(imageRef)
            .then((url) => {
                const img = document.getElementById(`${itemKey}image`)
                img.setAttribute('src', url);
            })
            .catch((error) => {
            });
    }, [])

    return (
        <li style={{ "list-style": "none" }} key={itemKey}>
            {items[itemKey].editing ? <div class="typingIndicatorContainer">
                <div class="typingIndicatorBubble">
                    <div class="typingIndicatorBubbleDot"></div>
                    <div class="typingIndicatorBubbleDot"></div>
                    <div class="typingIndicatorBubbleDot"></div>
                </div>
            </div> : <>
                <TodoItemWrapper >
                    <Form.Check style={{ color: "black" }} checked={items[itemKey].checked} onChange={() => markItemChecked(itemKey, !items[itemKey].checked)} />
                    {items[itemKey].name}
                    <IconsWrapper >
                        <Button variant="light" onClick={() => {
                            if (editedItem != null) {
                                setEditingItem(editedItem, false)
                            }
                            setEditingItem(itemKey, true)
                            setEditedItem(itemKey)
                        }}>edit</Button>
                        <Button variant="light" onClick={() => {
                            deleteItem(itemKey)
                        }}>delete</Button>
                    </IconsWrapper>
                </TodoItemWrapper>
                <StyledForm onSubmit={handleSubmit}>
                    <Form.Group controlId="formFile">
                        <Form.Control type="file" ref={inputFile} />
                    </Form.Group>
                    <Button variant="light" type='submit'>Upload</Button>

                </StyledForm>
                {uploadProgress !== -1 && <ProgressBar now={uploadProgress} />}

                <img id={`${itemKey}image`} style={{ width: "400px", height: "auto" }} />
            </>}
        </li>);
}

export default TodoItem;
