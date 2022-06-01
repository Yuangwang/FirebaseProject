
function UsersLists({ uid, setUID }) {

    return (
        <>
            {uid != null ?
                <div>
                    <button>+</button>
                </div> :
                "Please login"
            }
        </>
    );
}

export default UsersLists;
