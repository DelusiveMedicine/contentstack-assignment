const contentstack = require("contentstack")

const Stack = contentstack.Stack({
  api_key: process.env.REACT_APP_APIKEY,
  delivery_token: process.env.REACT_APP_DELIVERY_TOKEN,
  environment: process.env.REACT_APP_ENVIRONMENT,
})

if (process.env.REACT_APP_CUSTOM_HOST) {
  Stack.setHost(process.env.REACT_APP_CUSTOM_HOST)
}


const { ApolloClient, InMemoryCache, HttpLink, from, gql } =  require('@apollo/client');

const GRAPHQL_ENDPOINT =
  `https://graphql.contentstack.com/stacks/${process.env.REACT_APP_APIKEY}?environment=${process.env.REACT_APP_ENVIRONMENT}`;

const cache = new InMemoryCache();
const link = new HttpLink({
  uri: GRAPHQL_ENDPOINT,
  headers: {
    access_token: process.env.REACT_APP_DELIVERY_TOKEN,
  },
});
const client = new ApolloClient({
  link: from([link]),
  cache,
});

function getAllBooks(skipCount = 0) {
  return client
  .query({
    query: gql`query {
      all_book_page(limit: 5, skip: ${skipCount}, order_by: created_at_ASC) {
        total
        items {
          book_data {
            amazon_link {
              href
            }
            book_author
            book_description
            book_pages
            book_title
            book_coverConnection {
              edges {
                node {
                  url
                }
              }
            }
          }
          url
          system {
            uid
          }
        }
      }
    }
    `
  })
}

// function getBook(contentTypeUid) {
//   return client
//   .query({
//     query: gql`query {
//       book_page(uid: "${contentTypeUid}") {
//         book_data {
//           amazon_link {
//             href
//           }
//           book_author
//           book_coverConnection {
//             edges {
//               node {
//                 url
//               }
//             }
//           }
//           book_description
//           book_pages
//           book_title
//         }
//       }
//     }`
//   })
// }

function getEntryByUrl(contentTypeUid, entryUrl, referenceFieldPath) {
  return new Promise((resolve, reject) => {
    const blogQuery = Stack.ContentType(contentTypeUid).Query()
    if (referenceFieldPath) blogQuery.includeReference(referenceFieldPath)
    blogQuery.includeOwner().toJSON()
    const data = blogQuery.where("url", `${entryUrl}`).find()
    data.then(
      (result) => {
        resolve(result[0])
      },
      (error) => {
        reject(error)
      }
    )
  })
}



export default {
  // /**
  //  *
  //  * fetches all the entries from specific content-type
  //  * @param {* content-type uid} contentTypeUid
  //  * @param {* reference field name} referenceFieldPath
  //  *
  //  */
  // getEntry(contentTypeUid, skipCount = 0) {
  //   return new Promise((resolve, reject) => {
  //     const query = Stack.ContentType(contentTypeUid).Query()
  //     // if (referenceFieldPath) query.includeReference(referenceFieldPath)
  //     query
  //       .toJSON()
  //       .includeCount()
  //       .ascending('created_at')
  //       .skip(skipCount)
  //       .limit(5)
  //       .find()
  //       .then(
  //         (result) => {
  //           resolve(result)
  //         },
  //         (error) => {
  //           reject(error)
  //         }
  //       )
  //   })
  // },

  // /**
  //  *fetches specific entry from a content-type
  //  *
  //  * @param {* content-type uid} contentTypeUid
  //  * @param {* url for entry to be fetched} entryUrl
  //  * @param {* reference field name} referenceFieldPath
  //  * @returns
  //  */

  getAllBooks,
  getEntryByUrl,
  client
}
