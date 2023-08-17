import { gql } from '@apollo/client/core';
import type { Actions } from '@sveltejs/kit';
import { graphQLClient } from '../../lib/graphql/queries';

export const actions: Actions = {
	register: async ({ request, cookies }) => {
		const inputData = await request.formData();
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
		const { data, errors } = await graphQLClient.mutate({
			mutation,
			variables: {
				input: {
					email: inputData.get('email'),
					password: inputData.get('password'),
					username: inputData.get('username')
				}
			}
		});
		if (!errors) {
			cookies.set('accessToken', data.register.accessToken, {
				path: '/'
			});
			cookies.set('refreshToken', data.register.refreshToken, {
				path: '/'
			});
			return {
				isSuccessful: true
			};
		}
		return {
			isSuccessful: false,
			errors: errors
		};
	}
};
