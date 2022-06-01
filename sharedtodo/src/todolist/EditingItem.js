import { useState } from 'react';

function EditingItem({ itemKey, items, setEditingItem, setEditedItem, editListItemName }) {
    const [newName, setNewName] = useState(items[itemKey].name)
    return (
        <li key={itemKey}>
            <>
                <input value={newName} onChange={(e) => setNewName(e.currentTarget.value)} />
                <button onClick={() => {
                    setEditingItem(itemKey, false)
                    setEditedItem(null)
                    editListItemName(itemKey, newName)
                }}>done</button>
            </>
        </li>);
}

export default EditingItem;
