import type { Actions } from '@sveltejs/kit';
import { GraphQLClient, gql } from 'graphql-request';

export const actions: Actions = {
	register: async ({ request, cookies }) => {
		const data = await request.formData();
		const client = new GraphQLClient('http://localhost:8080/graphql');
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
			const result: any = await client.request(mutation, {
				input: {
					email: data.get('email'),
					password: data.get('password'),
					username: data.get('username')
				}
			});
            console.log(result);
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
