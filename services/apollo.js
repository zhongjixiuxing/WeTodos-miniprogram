const gql = require('wxapp-graphql');
const GraphQL = gql.GraphQL;
const cfg = require('../config');

const publicClient = GraphQL({url: cfg.apollo.public}, true);
const authClient = GraphQL({url: cfg.apollo.auth}, true);

// client.query({
//     query: gql`
//         mutation {
//             register(name: "anxing", password: "anxing") {
//                 id,
//                 name
//             }
//         }
//     `,
// })

// client.mutate({
//     mutation123123: `
//     mutation {
//         register(name: $name, password: "anxing") {
//             id,
//             name
//         }
//     }`,
//     mutation: `
//     mutation register1($name: String!, $password: String!) {
//         register(name: $name, password: $password) {
//           id,
//           name
//         }
//     }
//     `,
//     variables: {
//         name: 'anxing',
//         password: 'anxing123'
//     }
// })
// .then(data => console.log(data))
// .catch(error => console.error(error));

module.exports = {
    publicClient,
    authClient
}
