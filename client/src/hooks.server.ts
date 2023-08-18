import { gql } from '@apollo/client/core';
import type { Handle, HandleServerError } from '@sveltejs/kit';
import { graphQLClient } from './lib/graphql/apollo';

export const handle: Handle = async ({ event, resolve }) => {
	try {
		event.locals.accessToken = event.cookies.get('accessToken');
		if (!event.locals.accessToken) {
			event.locals.accessToken = undefined;
			event.locals.user = undefined;
			return await resolve(event);
		}
		const query = gql`
			query GetMe {
				getMe {
					user {
						email
						roles
						userId
						username
					}
				}
			}
		`;
		const isTokenValidQuery = gql`
			query CheckValidToken($input: CheckValidTokenInput!) {
				checkValidToken(token: $input) {
					message
					status
				}
			}
		`;
		const { data: isValidAccessToken } = await graphQLClient.query({
			query: isTokenValidQuery,
			variables: {
				input: {
					token: event.locals.accessToken
				}
			}
		});
		if (isValidAccessToken.checkValidToken.status === false) {
			if (isValidAccessToken.checkValidToken.message === 'Access token expired') {
				const { data: IsRefreshTokenValid } = await graphQLClient.query({
					query: gql`
						query CheckValidToken($input: CheckValidTokenInput!) {
							checkValidToken(token: $input) {
								message
								status
							}
						}
					`,
					variables: {
						input: {
							token: event.cookies.get('refreshToken')
						}
					}
				});
				if (IsRefreshTokenValid.checkValidToken.status === false) {
					event.locals.accessToken = undefined;
					event.locals.user = undefined;
					event.cookies.delete('accessToken', {
						path: '/'
					});
					event.cookies.delete('refreshToken', {
						path: '/'
					});
					return await resolve(event);
				}
				const refreshTokenQuery = gql`
					mutation RefreshToken($input: RefreshTokenInput!) {
						refreshToken(refreshToken: $input) {
							accessToken
							refreshToken
						}
					}
				`;
				const { data: newTokens, errors: refreshErrors } = await graphQLClient.mutate({
					mutation: refreshTokenQuery,
					variables: {
						input: {
							refreshToken: event.cookies.get('refreshToken')
						}
					}
				});
				if (refreshErrors) {
					event.locals.accessToken = undefined;
					event.locals.user = undefined;
					event.cookies.delete('accessToken', {
						path: '/'
					});
					event.cookies.delete('refreshToken', {
						path: '/'
					});
					return await resolve(event);
				}
				event.cookies.set('accessToken', newTokens.refreshToken.accessToken, {
					path: '/'
				});
				event.cookies.set('refreshToken', newTokens.refreshToken.refreshToken, {
					path: '/'
				});
				event.locals.accessToken = newTokens.refreshToken.accessToken;
				const { data: user } = await graphQLClient.query({
					query: query,
					context: {
						headers: {
							authorization: `Bearer ${event.locals.accessToken}`
						}
					}
				});
				if (!user.getMe.user) {
					event.cookies.delete('accessToken', {
						path: '/'
					});
					event.cookies.delete('refreshToken', {
						path: '/'
					});
					event.locals.accessToken = undefined;
				}
				event.locals.user = user.getMe.user;
				return await resolve(event);
			} else {
				event.locals.accessToken = undefined;
				event.locals.user = undefined;
				event.cookies.delete('accessToken', {
					path: '/'
				});
				event.cookies.delete('refreshToken', {
					path: '/'
				});
				return await resolve(event);
			}
		}
		if (event.locals.user) return await resolve(event);
		const { data } = await graphQLClient.query({
			query: query,
			context: {
				headers: {
					authorization: `Bearer ${event.locals.accessToken}`
				}
			}
		});
		if (!data.getMe.user) {
			event.cookies.delete('accessToken', {
				path: '/'
			});
			event.cookies.delete('refreshToken', {
				path: '/'
			});
			event.locals.accessToken = undefined;
			event.locals.user = undefined;
			return await resolve(event);
		}
		event.locals.user = data.getMe.user;
		return await resolve(event);
	} catch (error) {
		event.locals.accessToken = undefined;
		event.locals.user = undefined;
		event.cookies.delete('accessToken', {
			path: '/'
		});
		event.cookies.delete('refreshToken', {
			path: '/'
		});
		return await resolve(event);
	}
};

export const handleError: HandleServerError = async ({ event }) => {
	if (event.route.id === null) {
		return {
			code: 404,
			message: 'Page not found'
		};
	}
	return {
		code: 500,
		message: 'Internal server error'
	};
};
