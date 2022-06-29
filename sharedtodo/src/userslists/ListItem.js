import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
function ListItem({ listKey, name }) {


    return (
        <>
            <Card style={{ height: '12rem', width: '18rem' }}>
                <Card.Body>
                    <Card.Title>{name}</Card.Title>
                    <Card.Text>
                    </Card.Text>
                    <Link to={`/todoList`} state={{ listKey, listName: name }}><Button variant="primary"> View List </Button></Link>
                </Card.Body>
            </Card>
        </>)
}

export default ListItem;
