import { gql } from '@apollo/client'

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title
    author {
      name
    }
    genres
    published
  }
`

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
    }
  }
`

export const ALL_BOOKS = gql`
  query AllBooks($genre: String) {
    allBooks(genre: $genre) {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`

export const CREATE_BOOK = gql`
  mutation createBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      id
    }
  }
`

export const SET_BIRTHYEAR = gql`
  mutation setBirthyear($name: String!, $year: Int!) {
    editAuthor(name: $name, setBornTo: $year) {
      id
    }
  }
`

export const GET_FAVORITE_GENRE = gql`
  query {
    me {
      favoriteGenre
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!) {
    login(username: $username, password: "secret") {
      value
    }
  }
`

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`
