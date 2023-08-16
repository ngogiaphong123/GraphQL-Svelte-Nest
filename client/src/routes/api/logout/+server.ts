import type { RequestHandler } from './$types';
import { GraphQLClient, gql } from 'graphql-request';

export const POST: RequestHandler = async ({ cookies }) => {
	const client = new GraphQLClient('http://localhost:8080/graphql', {
		headers: {
			authorization: `Bearer ${cookies.get('accessToken')}`
		}
	});
	const mutation = gql`
		mutation Logout {
			logout {
				accessToken
				refreshToken
			}
		}
	`;
	try {
		await client.request(mutation);
	} catch (error: any) {
		return new Response(JSON.stringify({ message: 'Logout failed' }), {
			status: 500
		});
	}
	cookies.delete('accessToken', {
		path: '/'
	});
	cookies.delete('refreshToken', {
		path: '/'
	});
	return new Response(JSON.stringify({ message: 'Logout success' }), {
		status: 200
	});
};
