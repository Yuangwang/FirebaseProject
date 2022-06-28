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
                        Some quick example text to build on the card title and make up the bulk of
                        the card's content.
                    </Card.Text>
                    <Link to={`/todoList`} state={{ listKey, listName: name }}><Button variant="primary"> View List </Button></Link>
                </Card.Body>
            </Card>
        </>)
}

export default ListItem;
