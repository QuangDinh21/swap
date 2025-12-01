const { visit } = require('graphql');

/**
 * @typedef {Object} GroupedOperations
 * @property {string[]} queries - List of query operation names.
 * @property {string[]} mutations - List of mutation operation names.
 * @property {string[]} subscriptions - List of subscription operation names.
 */

/**
 * A GraphQL Codegen plugin to extract and group operation names by their type.
 *
 * @param {import('graphql').GraphQLSchema} schema - The GraphQL schema object.
 * @param {Array<{ document: import('graphql').DocumentNode }>} documents - The list of GraphQL documents.
 * @returns {string} - The generated JavaScript code that exports grouped operation names.
 */
function plugin(schema, documents) {
  /** @type {GroupedOperations} */
  const groupedOperations = {
    queries: [],
    mutations: [],
    subscriptions: [],
  };

  documents.forEach((doc) => {
    visit(doc.document, {
      OperationDefinition(node) {
        if (node.name) {
          if (node.operation === 'query') {
            groupedOperations.queries.push(node.name.value);
          } else if (node.operation === 'mutation') {
            groupedOperations.mutations.push(node.name.value);
          } else if (node.operation === 'subscription') {
            groupedOperations.subscriptions.push(node.name.value);
          }
        }
      },
    });
  });

  return `
export const queries = ${JSON.stringify(groupedOperations.queries, null, 2)};
export const mutations = ${JSON.stringify(groupedOperations.mutations, null, 2)};
export const subscriptions = ${JSON.stringify(groupedOperations.subscriptions, null, 2)};
  `;
}

module.exports = {
  plugin,
};
