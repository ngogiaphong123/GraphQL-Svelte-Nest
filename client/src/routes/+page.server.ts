import { gql } from '@apollo/client/core';
import type { PageServerLoad } from './$types';
import { graphQLClient } from '../lib/graphql/apollo';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user && locals.user.roles.includes('admin')) {
		const query = gql`
			query FindAll {
				findAll {
					users {
						email
						roles
						userId
						username
					}
				}
			}
		`;
		const { data } = await graphQLClient.query({
			query: query,
			context: {
				headers: {
					authorization: `Bearer ${locals.accessToken}`
				}
			}
		});
		return {
			props: {
				users: data.findAll.users
			}
		};
	}
	return {
		props: {
			users: null
		}
	};
};
