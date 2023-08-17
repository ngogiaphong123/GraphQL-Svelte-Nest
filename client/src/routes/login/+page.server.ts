import type { Actions } from '@sveltejs/kit';
import { gql } from 'graphql-request';
import { graphQLClient } from '../../lib/graphql/queries';

export const actions: Actions = {
	login: async ({ request, cookies }) => {
		const data = await request.formData();
		const mutation = gql`
			mutation Login($input: LoginInput!) {
				login(LoginInput: $input) {
					accessToken
					refreshToken
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
			const result: any = await graphQLClient.request(mutation, {
				input: {
					email: data.get('email'),
					password: data.get('password')
				}
			});
			cookies.set('accessToken', result.login.accessToken, {
				path: '/'
			});
			cookies.set('refreshToken', result.login.refreshToken, {
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
