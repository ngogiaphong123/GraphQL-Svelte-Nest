import { gql } from '@apollo/client/core';
import type { Handle, HandleServerError } from '@sveltejs/kit';
import { graphQLClient } from './lib/graphql/queries';

export const handle: Handle = async ({ event, resolve }) => {
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
	try {
		const { data } = await graphQLClient.query({
			query: query,
			context: {
				headers: {
					authorization: `Bearer ${event.locals.accessToken}`
				}
			}
		});
		event.locals.user = data.getMe.user;
		if (!event.locals.user) {
			event.locals.accessToken = undefined;
			event.locals.user = undefined;
		}
		return await resolve(event);
	} catch (error: any) {
		event.locals.accessToken = undefined;
		event.locals.user = undefined;
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
