import { ApolloClient, InMemoryCache } from '@apollo/client/core';

export const graphQLClient = new ApolloClient({
	uri: 'http://localhost:8080/graphql',
	cache: new InMemoryCache(),
	defaultOptions: {
		query: {
			fetchPolicy: 'no-cache',
			errorPolicy: 'all'
		},
		mutate: {
			errorPolicy: 'all',
			fetchPolicy: 'no-cache'
		}
	}
});
