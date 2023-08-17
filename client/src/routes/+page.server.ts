import { gql } from 'graphql-request';
import type { PageServerLoad } from './$types';
import { graphQLClient } from '../lib/graphql/queries';

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
		graphQLClient.setHeader('authorization', `Bearer ${locals.accessToken}`);
		const data: any = await graphQLClient.request(query);
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
