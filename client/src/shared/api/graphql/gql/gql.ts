// @ts-nocheck
/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query Me {\n    me {\n      id\n      email\n      fullName\n    }\n  }\n": typeof types.MeDocument,
    "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      user {\n        id\n        email\n        fullName\n      }\n    }\n  }\n": typeof types.LoginDocument,
    "\n  mutation Register($input: RegisterInput!) {\n    register(input: $input) {\n      user {\n        id\n        email\n        fullName\n      }\n    }\n  }\n": typeof types.RegisterDocument,
    "\n  query IsWorkspaceSlugAvailable($slug: String!, $workspaceId: ID) {\n    isWorkspaceSlugAvailable(slug: $slug, workspaceId: $workspaceId)\n  }\n": typeof types.IsWorkspaceSlugAvailableDocument,
    "\n  mutation CreateWorkspace($input: CreateWorkspaceInput!) {\n    createWorkspace(input: $input) {\n      id\n      name\n      slug\n      membersCount\n      role\n      createdAt\n    }\n  }\n": typeof types.CreateWorkspaceDocument,
    "\n  mutation UpdateWorkspace($input: UpdateWorkspaceInput!) {\n    updateWorkspace(input: $input) {\n      id\n      name\n      slug\n      membersCount\n      role\n      createdAt\n    }\n  }\n": typeof types.UpdateWorkspaceDocument,
    "\n  mutation InviteWorkspaceMember($input: InviteWorkspaceMemberInput!) {\n    inviteWorkspaceMember(input: $input) {\n      id\n      email\n      status\n    }\n  }\n": typeof types.InviteWorkspaceMemberDocument,
    "\n  query MyWorkspaces {\n    myWorkspaces {\n      id\n      name\n      slug\n      membersCount\n      role\n      createdAt\n    }\n  }\n": typeof types.MyWorkspacesDocument,
    "\n  query CsrfToken {\n    csrfToken\n  }\n": typeof types.CsrfTokenDocument,
};
const documents: Documents = {
    "\n  query Me {\n    me {\n      id\n      email\n      fullName\n    }\n  }\n": types.MeDocument,
    "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      user {\n        id\n        email\n        fullName\n      }\n    }\n  }\n": types.LoginDocument,
    "\n  mutation Register($input: RegisterInput!) {\n    register(input: $input) {\n      user {\n        id\n        email\n        fullName\n      }\n    }\n  }\n": types.RegisterDocument,
    "\n  query IsWorkspaceSlugAvailable($slug: String!, $workspaceId: ID) {\n    isWorkspaceSlugAvailable(slug: $slug, workspaceId: $workspaceId)\n  }\n": types.IsWorkspaceSlugAvailableDocument,
    "\n  mutation CreateWorkspace($input: CreateWorkspaceInput!) {\n    createWorkspace(input: $input) {\n      id\n      name\n      slug\n      membersCount\n      role\n      createdAt\n    }\n  }\n": types.CreateWorkspaceDocument,
    "\n  mutation UpdateWorkspace($input: UpdateWorkspaceInput!) {\n    updateWorkspace(input: $input) {\n      id\n      name\n      slug\n      membersCount\n      role\n      createdAt\n    }\n  }\n": types.UpdateWorkspaceDocument,
    "\n  mutation InviteWorkspaceMember($input: InviteWorkspaceMemberInput!) {\n    inviteWorkspaceMember(input: $input) {\n      id\n      email\n      status\n    }\n  }\n": types.InviteWorkspaceMemberDocument,
    "\n  query MyWorkspaces {\n    myWorkspaces {\n      id\n      name\n      slug\n      membersCount\n      role\n      createdAt\n    }\n  }\n": types.MyWorkspacesDocument,
    "\n  query CsrfToken {\n    csrfToken\n  }\n": types.CsrfTokenDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Me {\n    me {\n      id\n      email\n      fullName\n    }\n  }\n"): (typeof documents)["\n  query Me {\n    me {\n      id\n      email\n      fullName\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      user {\n        id\n        email\n        fullName\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      user {\n        id\n        email\n        fullName\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Register($input: RegisterInput!) {\n    register(input: $input) {\n      user {\n        id\n        email\n        fullName\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation Register($input: RegisterInput!) {\n    register(input: $input) {\n      user {\n        id\n        email\n        fullName\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query IsWorkspaceSlugAvailable($slug: String!, $workspaceId: ID) {\n    isWorkspaceSlugAvailable(slug: $slug, workspaceId: $workspaceId)\n  }\n"): (typeof documents)["\n  query IsWorkspaceSlugAvailable($slug: String!, $workspaceId: ID) {\n    isWorkspaceSlugAvailable(slug: $slug, workspaceId: $workspaceId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateWorkspace($input: CreateWorkspaceInput!) {\n    createWorkspace(input: $input) {\n      id\n      name\n      slug\n      membersCount\n      role\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  mutation CreateWorkspace($input: CreateWorkspaceInput!) {\n    createWorkspace(input: $input) {\n      id\n      name\n      slug\n      membersCount\n      role\n      createdAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateWorkspace($input: UpdateWorkspaceInput!) {\n    updateWorkspace(input: $input) {\n      id\n      name\n      slug\n      membersCount\n      role\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateWorkspace($input: UpdateWorkspaceInput!) {\n    updateWorkspace(input: $input) {\n      id\n      name\n      slug\n      membersCount\n      role\n      createdAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation InviteWorkspaceMember($input: InviteWorkspaceMemberInput!) {\n    inviteWorkspaceMember(input: $input) {\n      id\n      email\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation InviteWorkspaceMember($input: InviteWorkspaceMemberInput!) {\n    inviteWorkspaceMember(input: $input) {\n      id\n      email\n      status\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query MyWorkspaces {\n    myWorkspaces {\n      id\n      name\n      slug\n      membersCount\n      role\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  query MyWorkspaces {\n    myWorkspaces {\n      id\n      name\n      slug\n      membersCount\n      role\n      createdAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CsrfToken {\n    csrfToken\n  }\n"): (typeof documents)["\n  query CsrfToken {\n    csrfToken\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;