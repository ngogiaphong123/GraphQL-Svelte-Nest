import type { Actions } from '@sveltejs/kit';
import { GraphQLClient, gql } from 'graphql-request';
import { graphQLClient } from '../../lib/graphql/queries';

export const actions: Actions = {
	register: async ({ request, cookies }) => {
		const data = await request.formData();
		const mutation = gql`
			mutation Register($input: RegisterInput!) {
				register(RegisterInput: $input) {
					accessToken
					refreshToken
					user {
						userId
						username
						roles
						email
					}
				}
			}
		`;
		try {
			const result: any = await graphQLClient.request(mutation, {
				input: {
					email: data.get('email'),
					password: data.get('password'),
					username: data.get('username')
				}
			});
			cookies.set('accessToken', result.register.accessToken, {
				path: '/'
			});
			cookies.set('refreshToken', result.register.refreshToken, {
				path: '/'
			});
			return {
				isSuccessful: true
			};
		} catch (error: any) {
			return {
				isSuccessful: false,
				errors: error.response.errors
			};
		}
	}
};
