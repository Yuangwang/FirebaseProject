import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'

function EditingItem({ itemKey, items, setEditingItem, setEditedItem, editListItemName }) {
    const [newName, setNewName] = useState(items[itemKey].name)
    return (
        <li style={{ "list-style": "none", "margin": "20px" }} key={itemKey}>
            <>
                <Form.Group style={{ "margin-bottom": "10px" }}>
                    <Form.Control placeholder="Enter new item name" value={newName} onChange={(e) => setNewName(e.currentTarget.value)} />
                </Form.Group>
                <Button variant="light" onClick={() => {
                    setEditingItem(itemKey, false)
                    setEditedItem(null)
                    editListItemName(itemKey, newName)
                }}>done</Button>
            </>
        </li>);
}

export default EditingItem;
