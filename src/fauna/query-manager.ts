import faunadb from "faunadb";

import { registerWithUser, login, logout } from "./queries/auth";
import {
  createFweet,
  getFweets,
  getFweetsByTag,
  getFweetsByAuthor,
  likeFweet,
  refweet,
  comment,
} from "./queries/fweets";
import { searchPeopleAndTags } from "./queries/search";
import { follow } from "./queries/followers";

/**
 * The default token to use if none is provided.
 */
const BOOTSTRAP_TOKEN = process.env.REACT_APP_LOCAL___BOOTSTRAP_FAUNADB_KEY;

/** 
 * Initialize the client to contact FaunaDB. 
 *
 * The client is initially started with the a 'BOOTSTRAP' token. This token has
 * only two permissions, call the 'login' and 'register' User Defined Function
 * (UDF) If the login function succeeds, it will return a new token with
 * elevated permission. The client will then be replaced with a client that uses
 * the secret that was returned by Login.
 */
class QueryManager {
  /**
   * The token to use - either one manually provided, or the default public key.
   */
  token: string;
  /**
   * The current FaunaDB Client we're using for this instance.
   */
  client: faunadb.Client;
  /**
   * Create a new QueryManager.
   * 
   * @param token The token to load.
   */
  constructor(token?: string) {
    // A client is just a wrapper, it does not create a persistent connection
    // FaunaDB behaves like an API and will include the token on each request.
    this.token = token || BOOTSTRAP_TOKEN;
    this.client = new faunadb.Client({ secret: this.token });
  }

  login(email: string, password: string) {
    return login(this.client, email, password).then((res) => {
      if (res) {
        this.client = new faunadb.Client({ secret: res.secret });
      }
      return res;
    });
  }

  register(email: string, password: string, name: string, alias: string) {
    // randomly choose an icon
    const icon = "person" + (Math.round(Math.random() * 22) + 1);
    return registerWithUser(
      this.client,
      email,
      password,
      name,
      alias,
      icon
    ).then((res) => {
      if (res) {
        this.client = new faunadb.Client({ secret: res.secret.secret });
      }
      return res;
    });
  }

  logout() {
    return logout(this.client).then((res) => {
      this.client = new faunadb.Client({
        secret: this.token,
      });
      return res;
    });
  }

  getFweets() {
    return getFweets(this.client);
  }

  getFweetsByTag(tagName) {
    return getFweetsByTag(this.client, tagName);
  }

  getFweetsByAuthor(user) {
    return getFweetsByAuthor(this.client, user);
  }

  createFweet(message, asset) {
    return createFweet(this.client, message, asset);
  }

  searchPeopleAndTags(keyword) {
    return searchPeopleAndTags(this.client, keyword);
  }

  likeFweet(fweetRef) {
    return likeFweet(this.client, fweetRef);
  }

  refweet(fweetRef, message) {
    return refweet(this.client, fweetRef, message);
  }

  comment(fweetRef, message) {
    return comment(this.client, fweetRef, message);
  }

  follow(authorRef) {
    return follow(this.client, authorRef);
  }
}
const faunaQueries = new QueryManager();
export { faunaQueries, QueryManager };
