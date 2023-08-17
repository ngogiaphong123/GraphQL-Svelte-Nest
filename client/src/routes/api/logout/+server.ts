import { gql } from '@apollo/client/core';
import { graphQLClient } from '../../../lib/graphql/queries';
import type { RequestHandler } from './$types';

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
		await graphQLClient.mutate({
			mutation,
			context: {
				headers: {
					authorization: `Bearer ${cookies.get('accessToken')}`
				}
			}
		});
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
