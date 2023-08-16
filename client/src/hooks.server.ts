import type { Handle, HandleServerError } from '@sveltejs/kit';
import { GraphQLClient, gql } from 'graphql-request';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.accessToken = event.cookies.get('accessToken');
	if (!event.locals.accessToken) {
		event.locals.accessToken = undefined;
		event.locals.user = undefined;
		return await resolve(event);
	}
	const client = new GraphQLClient('http://localhost:8080/graphql', {
		headers: {
			authorization: `Bearer ${event.locals.accessToken}`
		}
	});
	event.locals.graphql = client;
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
		const data: any = await client.request(query);
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
