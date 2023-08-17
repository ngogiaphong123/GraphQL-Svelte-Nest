import { graphQLClient } from '../../../lib/graphql/queries';
import type { RequestHandler } from './$types';
import { gql } from 'graphql-request';

export const POST: RequestHandler = async ({ cookies }) => {
	const mutation = gql`
		mutation Logout {
			logout {
				accessToken
				refreshToken
			}
		}
	`;
	try {
		graphQLClient.setHeader('authorization', `Bearer ${cookies.get('accessToken')}`);
		await graphQLClient.request(mutation);
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
