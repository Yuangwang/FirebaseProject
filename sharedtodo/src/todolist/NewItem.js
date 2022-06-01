import { useState } from 'react';

function Newitem({ addNewItem }) {
    const [isAddingNewitem, setIsAddingNewItem] = useState(false);
    const [newItemName, setNewItemName] = useState("")



    return (
        <>
            {isAddingNewitem ?
                <>
                    <input value={newItemName} onChange={(e) => setNewItemName(e.currentTarget.value)} />
                    <button onClick={() => {
                        setIsAddingNewItem(false)
                        setNewItemName("")
                        addNewItem(newItemName)
                    }}>done</button>
                </>
                :
                <button onClick={() => setIsAddingNewItem(true)}>+</button>
            }
        </>
    );
}

export default Newitem;
