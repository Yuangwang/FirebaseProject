import { useState, useRef, useEffect } from 'react';
import { uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage'

function TodoItem({ storage, itemKey, items, editedItem, setEditedItem, setEditingItem, markItemChecked, deleteItem }) {
    const inputFile = useRef(null)
    const handleSubmit = (e) => {
        e.preventDefault()
        const file = inputFile?.current?.files[0];
        if (!file) return;
        const storageRef = ref(storage, `images/${itemKey}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                    case 'storage/unauthorized':
                        // User doesn't have permission to access the object
                        break;
                    case 'storage/canceled':
                        // User canceled the upload
                        break;

                    // ...

                    case 'storage/unknown':
                        // Unknown error occurred, inspect error.serverResponse
                        break;
                }
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                });
            }
        );
    }
    useEffect(() => {
        const imageRef = ref(storage, `images/${itemKey}`);
        getDownloadURL(imageRef)
            .then((url) => {
                const img = document.getElementById(`${itemKey}image`)
                img.setAttribute('src', url);
            })
            .catch((error) => {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                    case 'storage/object-not-found':
                        // File doesn't exist
                        break;
                    case 'storage/unauthorized':
                        // User doesn't have permission to access the object
                        break;
                    case 'storage/canceled':
                        // User canceled the upload
                        break;

                    // ...

                    case 'storage/unknown':
                        // Unknown error occurred, inspect the server response
                        break;
                }
            });
    }, [])

    return (
        <li key={itemKey}>
            {items[itemKey].editing ? "being edited..." : <>
                <input type="checkbox" checked={items[itemKey].checked} onChange={() => markItemChecked(itemKey, !items[itemKey].checked)} />
                {items[itemKey].name}
                <button onClick={() => {
                    if (editedItem != null) {
                        setEditingItem(editedItem, false)
                    }
                    setEditingItem(itemKey, true)
                    setEditedItem(itemKey)
                }}>edit</button>
                <button onClick={() => {
                    deleteItem(itemKey)
                }}>delete</button>
                <form onSubmit={handleSubmit}>
                    <input type='file' id='file' ref={inputFile} />
                    <button type='submit'>Upload</button>
                </form>
                <img id={`${itemKey}image`} />
            </>}
        </li>);
}

export default TodoItem;
