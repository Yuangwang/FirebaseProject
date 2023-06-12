// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { User, ListItem, List, UserList } = initSchema(schema);

export {
  User,
  ListItem,
  List,
  UserList
};