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
    "\n  mutation Register($input: RegisterInput!) {\n    register(input: $input) {\n      user {\n        id\n        email\n        fullName\n      }\n      joinedWorkspaceSlug\n    }\n  }\n": typeof types.RegisterDocument,
    "\n  mutation CancelInvitation($workspaceId: ID!, $invitationId: ID!) {\n    cancelInvitation(workspaceId: $workspaceId, invitationId: $invitationId) {\n      id\n      status\n    }\n  }\n": typeof types.CancelInvitationDocument,
    "\n  mutation UpdateWorkspaceMemberRole($input: UpdateWorkspaceMemberRoleInput!) {\n    updateWorkspaceMemberRole(input: $input) {\n      id\n      role\n      status\n      joinedAt\n      user {\n        id\n        email\n        fullName\n      }\n    }\n  }\n": typeof types.UpdateWorkspaceMemberRoleDocument,
    "\n  mutation RemoveWorkspaceMember($input: RemoveWorkspaceMemberInput!) {\n    removeWorkspaceMember(input: $input) {\n      member {\n        id\n        status\n        role\n        user {\n          id\n          email\n          fullName\n        }\n      }\n      workspace {\n        id\n        membersCount\n      }\n    }\n  }\n": typeof types.RemoveWorkspaceMemberDocument,
    "\n  mutation ResendInvitation($workspaceId: ID!, $invitationId: ID!) {\n    resendInvitation(workspaceId: $workspaceId, invitationId: $invitationId) {\n      id\n      status\n      expiresAt\n    }\n  }\n": typeof types.ResendInvitationDocument,
    "\n  mutation RevokeWorkspaceJoinLink($workspaceId: ID!) {\n    revokeWorkspaceJoinLink(workspaceId: $workspaceId) {\n      id\n      url\n      role\n      expiresAt\n      createdAt\n    }\n  }\n": typeof types.RevokeWorkspaceJoinLinkDocument,
    "\n  query IsWorkspaceSlugAvailable($slug: String!, $workspaceId: ID) {\n    isWorkspaceSlugAvailable(slug: $slug, workspaceId: $workspaceId)\n  }\n": typeof types.IsWorkspaceSlugAvailableDocument,
    "\n  mutation CreateWorkspace($input: CreateWorkspaceInput!) {\n    createWorkspace(input: $input) {\n      id\n      name\n      slug\n      membersCount\n      role\n      createdAt\n    }\n  }\n": typeof types.CreateWorkspaceDocument,
    "\n  mutation UpdateWorkspace($input: UpdateWorkspaceInput!) {\n    updateWorkspace(input: $input) {\n      id\n      name\n      slug\n      membersCount\n      role\n      createdAt\n    }\n  }\n": typeof types.UpdateWorkspaceDocument,
    "\n  query MyWorkspaces {\n    myWorkspaces {\n      id\n      name\n      slug\n      membersCount\n      role\n      createdAt\n    }\n  }\n": typeof types.MyWorkspacesDocument,
    "\n  mutation AcceptWorkspaceInvitation($token: String!) {\n    acceptWorkspaceInvitation(token: $token) {\n      id\n      name\n      slug\n      membersCount\n      role\n      createdAt\n    }\n  }\n": typeof types.AcceptWorkspaceInvitationDocument,
    "\n  query WorkspaceMembers(\n    $workspaceId: ID!\n    $search: String\n    $roles: [WorkspaceRole!]\n    $limit: Int\n    $offset: Int\n  ) {\n    workspaceMembers(\n      workspaceId: $workspaceId\n      search: $search\n      roles: $roles\n      limit: $limit\n      offset: $offset\n    ) {\n      total\n      members {\n        id\n        role\n        status\n        joinedAt\n        user {\n          id\n          email\n          fullName\n        }\n      }\n    }\n  }\n": typeof types.WorkspaceMembersDocument,
    "\n  query WorkspaceMember($workspaceId: ID!, $userId: ID!) {\n    workspaceMember(workspaceId: $workspaceId, userId: $userId) {\n      id\n      role\n      status\n      joinedAt\n      user {\n        id\n        email\n        fullName\n      }\n      projects {\n        id\n        name\n      }\n      assignedTasks {\n        id\n        title\n      }\n    }\n  }\n": typeof types.WorkspaceMemberDocument,
    "\n  mutation InviteWorkspaceMember($input: InviteWorkspaceMemberInput!) {\n    inviteWorkspaceMember(input: $input) {\n      id\n      email\n      role\n      status\n    }\n  }\n": typeof types.InviteWorkspaceMemberDocument,
    "\n  query WorkspaceInvitations($workspaceId: ID!, $statuses: [InvitationStatus!]) {\n    workspaceInvitations(workspaceId: $workspaceId, statuses: $statuses) {\n      id\n      email\n      role\n      status\n      token\n      expiresAt\n      createdAt\n      invitedBy {\n        id\n        email\n        fullName\n      }\n    }\n  }\n": typeof types.WorkspaceInvitationsDocument,
    "\n  query CsrfToken {\n    csrfToken\n  }\n": typeof types.CsrfTokenDocument,
    "\n  query WorkspaceJoinPreview($token: String!) {\n    workspaceJoinPreview(token: $token) {\n      name\n      slug\n      role\n      kind\n      email\n    }\n  }\n": typeof types.WorkspaceJoinPreviewDocument,
    "\n  mutation DeclineWorkspaceInvitation($token: String!) {\n    declineWorkspaceInvitation(token: $token) {\n      id\n      status\n    }\n  }\n": typeof types.DeclineWorkspaceInvitationDocument,
    "\n  query WorkspaceJoinLink($workspaceId: ID!) {\n    workspaceJoinLink(workspaceId: $workspaceId) {\n      id\n      url\n      role\n      expiresAt\n      createdAt\n    }\n  }\n": typeof types.WorkspaceJoinLinkDocument,
};
const documents: Documents = {
    "\n  query Me {\n    me {\n      id\n      email\n      fullName\n    }\n  }\n": types.MeDocument,
    "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      user {\n        id\n        email\n        fullName\n      }\n    }\n  }\n": types.LoginDocument,
    "\n  mutation Register($input: RegisterInput!) {\n    register(input: $input) {\n      user {\n        id\n        email\n        fullName\n      }\n      joinedWorkspaceSlug\n    }\n  }\n": types.RegisterDocument,
    "\n  mutation CancelInvitation($workspaceId: ID!, $invitationId: ID!) {\n    cancelInvitation(workspaceId: $workspaceId, invitationId: $invitationId) {\n      id\n      status\n    }\n  }\n": types.CancelInvitationDocument,
    "\n  mutation UpdateWorkspaceMemberRole($input: UpdateWorkspaceMemberRoleInput!) {\n    updateWorkspaceMemberRole(input: $input) {\n      id\n      role\n      status\n      joinedAt\n      user {\n        id\n        email\n        fullName\n      }\n    }\n  }\n": types.UpdateWorkspaceMemberRoleDocument,
    "\n  mutation RemoveWorkspaceMember($input: RemoveWorkspaceMemberInput!) {\n    removeWorkspaceMember(input: $input) {\n      member {\n        id\n        status\n        role\n        user {\n          id\n          email\n          fullName\n        }\n      }\n      workspace {\n        id\n        membersCount\n      }\n    }\n  }\n": types.RemoveWorkspaceMemberDocument,
    "\n  mutation ResendInvitation($workspaceId: ID!, $invitationId: ID!) {\n    resendInvitation(workspaceId: $workspaceId, invitationId: $invitationId) {\n      id\n      status\n      expiresAt\n    }\n  }\n": types.ResendInvitationDocument,
    "\n  mutation RevokeWorkspaceJoinLink($workspaceId: ID!) {\n    revokeWorkspaceJoinLink(workspaceId: $workspaceId) {\n      id\n      url\n      role\n      expiresAt\n      createdAt\n    }\n  }\n": types.RevokeWorkspaceJoinLinkDocument,
    "\n  query IsWorkspaceSlugAvailable($slug: String!, $workspaceId: ID) {\n    isWorkspaceSlugAvailable(slug: $slug, workspaceId: $workspaceId)\n  }\n": types.IsWorkspaceSlugAvailableDocument,
    "\n  mutation CreateWorkspace($input: CreateWorkspaceInput!) {\n    createWorkspace(input: $input) {\n      id\n      name\n      slug\n      membersCount\n      role\n      createdAt\n    }\n  }\n": types.CreateWorkspaceDocument,
    "\n  mutation UpdateWorkspace($input: UpdateWorkspaceInput!) {\n    updateWorkspace(input: $input) {\n      id\n      name\n      slug\n      membersCount\n      role\n      createdAt\n    }\n  }\n": types.UpdateWorkspaceDocument,
    "\n  query MyWorkspaces {\n    myWorkspaces {\n      id\n      name\n      slug\n      membersCount\n      role\n      createdAt\n    }\n  }\n": types.MyWorkspacesDocument,
    "\n  mutation AcceptWorkspaceInvitation($token: String!) {\n    acceptWorkspaceInvitation(token: $token) {\n      id\n      name\n      slug\n      membersCount\n      role\n      createdAt\n    }\n  }\n": types.AcceptWorkspaceInvitationDocument,
    "\n  query WorkspaceMembers(\n    $workspaceId: ID!\n    $search: String\n    $roles: [WorkspaceRole!]\n    $limit: Int\n    $offset: Int\n  ) {\n    workspaceMembers(\n      workspaceId: $workspaceId\n      search: $search\n      roles: $roles\n      limit: $limit\n      offset: $offset\n    ) {\n      total\n      members {\n        id\n        role\n        status\n        joinedAt\n        user {\n          id\n          email\n          fullName\n        }\n      }\n    }\n  }\n": types.WorkspaceMembersDocument,
    "\n  query WorkspaceMember($workspaceId: ID!, $userId: ID!) {\n    workspaceMember(workspaceId: $workspaceId, userId: $userId) {\n      id\n      role\n      status\n      joinedAt\n      user {\n        id\n        email\n        fullName\n      }\n      projects {\n        id\n        name\n      }\n      assignedTasks {\n        id\n        title\n      }\n    }\n  }\n": types.WorkspaceMemberDocument,
    "\n  mutation InviteWorkspaceMember($input: InviteWorkspaceMemberInput!) {\n    inviteWorkspaceMember(input: $input) {\n      id\n      email\n      role\n      status\n    }\n  }\n": types.InviteWorkspaceMemberDocument,
    "\n  query WorkspaceInvitations($workspaceId: ID!, $statuses: [InvitationStatus!]) {\n    workspaceInvitations(workspaceId: $workspaceId, statuses: $statuses) {\n      id\n      email\n      role\n      status\n      token\n      expiresAt\n      createdAt\n      invitedBy {\n        id\n        email\n        fullName\n      }\n    }\n  }\n": types.WorkspaceInvitationsDocument,
    "\n  query CsrfToken {\n    csrfToken\n  }\n": types.CsrfTokenDocument,
    "\n  query WorkspaceJoinPreview($token: String!) {\n    workspaceJoinPreview(token: $token) {\n      name\n      slug\n      role\n      kind\n      email\n    }\n  }\n": types.WorkspaceJoinPreviewDocument,
    "\n  mutation DeclineWorkspaceInvitation($token: String!) {\n    declineWorkspaceInvitation(token: $token) {\n      id\n      status\n    }\n  }\n": types.DeclineWorkspaceInvitationDocument,
    "\n  query WorkspaceJoinLink($workspaceId: ID!) {\n    workspaceJoinLink(workspaceId: $workspaceId) {\n      id\n      url\n      role\n      expiresAt\n      createdAt\n    }\n  }\n": types.WorkspaceJoinLinkDocument,
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
export function graphql(source: "\n  mutation Register($input: RegisterInput!) {\n    register(input: $input) {\n      user {\n        id\n        email\n        fullName\n      }\n      joinedWorkspaceSlug\n    }\n  }\n"): (typeof documents)["\n  mutation Register($input: RegisterInput!) {\n    register(input: $input) {\n      user {\n        id\n        email\n        fullName\n      }\n      joinedWorkspaceSlug\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CancelInvitation($workspaceId: ID!, $invitationId: ID!) {\n    cancelInvitation(workspaceId: $workspaceId, invitationId: $invitationId) {\n      id\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation CancelInvitation($workspaceId: ID!, $invitationId: ID!) {\n    cancelInvitation(workspaceId: $workspaceId, invitationId: $invitationId) {\n      id\n      status\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateWorkspaceMemberRole($input: UpdateWorkspaceMemberRoleInput!) {\n    updateWorkspaceMemberRole(input: $input) {\n      id\n      role\n      status\n      joinedAt\n      user {\n        id\n        email\n        fullName\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateWorkspaceMemberRole($input: UpdateWorkspaceMemberRoleInput!) {\n    updateWorkspaceMemberRole(input: $input) {\n      id\n      role\n      status\n      joinedAt\n      user {\n        id\n        email\n        fullName\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveWorkspaceMember($input: RemoveWorkspaceMemberInput!) {\n    removeWorkspaceMember(input: $input) {\n      member {\n        id\n        status\n        role\n        user {\n          id\n          email\n          fullName\n        }\n      }\n      workspace {\n        id\n        membersCount\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation RemoveWorkspaceMember($input: RemoveWorkspaceMemberInput!) {\n    removeWorkspaceMember(input: $input) {\n      member {\n        id\n        status\n        role\n        user {\n          id\n          email\n          fullName\n        }\n      }\n      workspace {\n        id\n        membersCount\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ResendInvitation($workspaceId: ID!, $invitationId: ID!) {\n    resendInvitation(workspaceId: $workspaceId, invitationId: $invitationId) {\n      id\n      status\n      expiresAt\n    }\n  }\n"): (typeof documents)["\n  mutation ResendInvitation($workspaceId: ID!, $invitationId: ID!) {\n    resendInvitation(workspaceId: $workspaceId, invitationId: $invitationId) {\n      id\n      status\n      expiresAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RevokeWorkspaceJoinLink($workspaceId: ID!) {\n    revokeWorkspaceJoinLink(workspaceId: $workspaceId) {\n      id\n      url\n      role\n      expiresAt\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  mutation RevokeWorkspaceJoinLink($workspaceId: ID!) {\n    revokeWorkspaceJoinLink(workspaceId: $workspaceId) {\n      id\n      url\n      role\n      expiresAt\n      createdAt\n    }\n  }\n"];
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
export function graphql(source: "\n  query MyWorkspaces {\n    myWorkspaces {\n      id\n      name\n      slug\n      membersCount\n      role\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  query MyWorkspaces {\n    myWorkspaces {\n      id\n      name\n      slug\n      membersCount\n      role\n      createdAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AcceptWorkspaceInvitation($token: String!) {\n    acceptWorkspaceInvitation(token: $token) {\n      id\n      name\n      slug\n      membersCount\n      role\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  mutation AcceptWorkspaceInvitation($token: String!) {\n    acceptWorkspaceInvitation(token: $token) {\n      id\n      name\n      slug\n      membersCount\n      role\n      createdAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query WorkspaceMembers(\n    $workspaceId: ID!\n    $search: String\n    $roles: [WorkspaceRole!]\n    $limit: Int\n    $offset: Int\n  ) {\n    workspaceMembers(\n      workspaceId: $workspaceId\n      search: $search\n      roles: $roles\n      limit: $limit\n      offset: $offset\n    ) {\n      total\n      members {\n        id\n        role\n        status\n        joinedAt\n        user {\n          id\n          email\n          fullName\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query WorkspaceMembers(\n    $workspaceId: ID!\n    $search: String\n    $roles: [WorkspaceRole!]\n    $limit: Int\n    $offset: Int\n  ) {\n    workspaceMembers(\n      workspaceId: $workspaceId\n      search: $search\n      roles: $roles\n      limit: $limit\n      offset: $offset\n    ) {\n      total\n      members {\n        id\n        role\n        status\n        joinedAt\n        user {\n          id\n          email\n          fullName\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query WorkspaceMember($workspaceId: ID!, $userId: ID!) {\n    workspaceMember(workspaceId: $workspaceId, userId: $userId) {\n      id\n      role\n      status\n      joinedAt\n      user {\n        id\n        email\n        fullName\n      }\n      projects {\n        id\n        name\n      }\n      assignedTasks {\n        id\n        title\n      }\n    }\n  }\n"): (typeof documents)["\n  query WorkspaceMember($workspaceId: ID!, $userId: ID!) {\n    workspaceMember(workspaceId: $workspaceId, userId: $userId) {\n      id\n      role\n      status\n      joinedAt\n      user {\n        id\n        email\n        fullName\n      }\n      projects {\n        id\n        name\n      }\n      assignedTasks {\n        id\n        title\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation InviteWorkspaceMember($input: InviteWorkspaceMemberInput!) {\n    inviteWorkspaceMember(input: $input) {\n      id\n      email\n      role\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation InviteWorkspaceMember($input: InviteWorkspaceMemberInput!) {\n    inviteWorkspaceMember(input: $input) {\n      id\n      email\n      role\n      status\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query WorkspaceInvitations($workspaceId: ID!, $statuses: [InvitationStatus!]) {\n    workspaceInvitations(workspaceId: $workspaceId, statuses: $statuses) {\n      id\n      email\n      role\n      status\n      token\n      expiresAt\n      createdAt\n      invitedBy {\n        id\n        email\n        fullName\n      }\n    }\n  }\n"): (typeof documents)["\n  query WorkspaceInvitations($workspaceId: ID!, $statuses: [InvitationStatus!]) {\n    workspaceInvitations(workspaceId: $workspaceId, statuses: $statuses) {\n      id\n      email\n      role\n      status\n      token\n      expiresAt\n      createdAt\n      invitedBy {\n        id\n        email\n        fullName\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CsrfToken {\n    csrfToken\n  }\n"): (typeof documents)["\n  query CsrfToken {\n    csrfToken\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query WorkspaceJoinPreview($token: String!) {\n    workspaceJoinPreview(token: $token) {\n      name\n      slug\n      role\n      kind\n      email\n    }\n  }\n"): (typeof documents)["\n  query WorkspaceJoinPreview($token: String!) {\n    workspaceJoinPreview(token: $token) {\n      name\n      slug\n      role\n      kind\n      email\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeclineWorkspaceInvitation($token: String!) {\n    declineWorkspaceInvitation(token: $token) {\n      id\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation DeclineWorkspaceInvitation($token: String!) {\n    declineWorkspaceInvitation(token: $token) {\n      id\n      status\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query WorkspaceJoinLink($workspaceId: ID!) {\n    workspaceJoinLink(workspaceId: $workspaceId) {\n      id\n      url\n      role\n      expiresAt\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  query WorkspaceJoinLink($workspaceId: ID!) {\n    workspaceJoinLink(workspaceId: $workspaceId) {\n      id\n      url\n      role\n      expiresAt\n      createdAt\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;