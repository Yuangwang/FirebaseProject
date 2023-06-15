// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { UserList, User, ListItem, List } = initSchema(schema);

export {
  UserList,
  User,
  ListItem,
  List
};