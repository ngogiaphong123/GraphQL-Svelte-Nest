import { gql } from '@apollo/client/core';
import type { Actions } from '@sveltejs/kit';
import { graphQLClient } from '../../lib/graphql/queries';

export const actions: Actions = {
	login: async ({ request, cookies }) => {
		const inputData = await request.formData();
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
			const { data }: any = await graphQLClient.mutate({
				mutation,
				variables: {
					input: {
						email: inputData.get('email'),
						password: inputData.get('password')
					}
				}
			});
			cookies.set('accessToken', data.login.accessToken, {
				path: '/'
			});
			cookies.set('refreshToken', data.login.refreshToken, {
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
