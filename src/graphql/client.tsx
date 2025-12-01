import { useMemo } from 'react';

import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client';

export const WithApolloClient: React.FC<React.PropsWithChildren<object>> = (props) => {
  const client = useMemo(() => {
    const subgraphUrl = import.meta.env.VITE_PUBLIC_SUBGRAPH_URL || '';
    const subgraphApiKey = import.meta.env.VITE_PUBLIC_SUBGRAPH_API_KEY || '';

    const apolloLink = new HttpLink({
      uri: subgraphUrl,
      headers: { Authorization: `Bearer ${subgraphApiKey}` },
    });

    return new ApolloClient({
      cache: new InMemoryCache(),
      link: apolloLink,
    });
  }, []);

  return <ApolloProvider client={client}>{props.children}</ApolloProvider>;
};
