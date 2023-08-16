import { gql } from 'graphql-request';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user && locals.user.roles.includes('admin')) {
		const client = locals.graphql;
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
		const data: any = await client.request(query);
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
