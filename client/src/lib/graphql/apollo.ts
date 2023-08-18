import { split, HttpLink, InMemoryCache, ApolloClient } from '@apollo/client/core';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';

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

export function createApolloClient() {
	const httpLink = new HttpLink({
		uri: 'http://localhost:8080/graphql'
	});

	const wsLink = new WebSocketLink({
		uri: 'ws://localhost:8080/graphql',
		options: {
			reconnect: true
		}
	});
	const link = split(
		({ query }) => {
			const definition = getMainDefinition(query);
			return (
				definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
			);
		},
		wsLink,
		httpLink
	);

	const cache = new InMemoryCache();

	const client = new ApolloClient({
		link,
		cache
	});

	return client;
}
