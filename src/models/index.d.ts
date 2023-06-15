import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncItem, AsyncCollection } from "@aws-amplify/datastore";





type EagerUserList = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<UserList, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly listName?: string | null;
  readonly user?: User | null;
  readonly list?: List | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly userListUserId?: string | null;
  readonly userListListId?: string | null;
}

type LazyUserList = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<UserList, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly listName?: string | null;
  readonly user: AsyncItem<User | undefined>;
  readonly list: AsyncItem<List | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly userListUserId?: string | null;
  readonly userListListId?: string | null;
}

export declare type UserList = LazyLoading extends LazyLoadingDisabled ? EagerUserList : LazyUserList

export declare const UserList: (new (init: ModelInit<UserList>) => UserList) & {
  copyOf(source: UserList, mutator: (draft: MutableModel<UserList>) => MutableModel<UserList> | void): UserList;
}

type EagerUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly email?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly email?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser

export declare const User: (new (init: ModelInit<User>) => User) & {
  copyOf(source: User, mutator: (draft: MutableModel<User>) => MutableModel<User> | void): User;
}

type EagerListItem = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ListItem, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly checked?: boolean | null;
  readonly editing?: boolean | null;
  readonly name?: string | null;
  readonly listID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyListItem = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ListItem, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly checked?: boolean | null;
  readonly editing?: boolean | null;
  readonly name?: string | null;
  readonly listID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type ListItem = LazyLoading extends LazyLoadingDisabled ? EagerListItem : LazyListItem

export declare const ListItem: (new (init: ModelInit<ListItem>) => ListItem) & {
  copyOf(source: ListItem, mutator: (draft: MutableModel<ListItem>) => MutableModel<ListItem> | void): ListItem;
}

type EagerList = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<List, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly listItems?: (ListItem | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyList = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<List, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly listItems: AsyncCollection<ListItem>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type List = LazyLoading extends LazyLoadingDisabled ? EagerList : LazyList

export declare const List: (new (init: ModelInit<List>) => List) & {
  copyOf(source: List, mutator: (draft: MutableModel<List>) => MutableModel<List> | void): List;
}