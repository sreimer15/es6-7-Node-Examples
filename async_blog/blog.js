import fetch from 'node-fetch';
import querystring from 'querystring';
import _ from 'lodash';

const apiURL = 'https://jsonplaceholder.typicode.com';

/**
* General purpose promise generator that takes a url and queues up a get request to that url to .then or await on
* @property {string} url - the api url to get our various resources
* @returns {Promise}
*/
function getResourcePromise(url) {
  const resourcePromise = new Promise(
    (resolve, reject) => {
      fetch(url)
        .then(res => res.json())
        .then((data) => {
          resolve(data);
        })
        .catch(e => reject(e));
    }
  );
  return resourcePromise;
}

/**
* promise generator that takes a url and a body and creates a promise with the result of a post request
* @property {string} url - the api url to get our various resources
* @property {object} body - the body to send with the post request
* @returns {Promise}
*/
function postResourcePromise(url, body) {
  const formData = querystring.stringify(body);
  const contentLength = formData.length;
  const resourcePromise = new Promise(
    (resolve, reject) => {
      fetch(url, { method: 'post',
        body: formData,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': contentLength }
    })
        .then(res => res.json())
        .then((data) => {
          resolve(data);
        })
        .catch(e => reject(e));
    }
  );
  return resourcePromise;
}

/**
* Helper function to help us get resources related to a user get uses getResourcePromise
* @property {number} userId - the userId of the user whose items you want to find
* @property {string} itemName - the name of the resource you want to get
* @returns {Promise}
*/
function getItemsByUserPromise(userId, itemName) {
  const itemPromise = getResourcePromise(`${apiURL}/${itemName}?userId=${userId}`);
  return itemPromise;
}

/**
* Aggregation function that gets the user's profile info
* @property {number} userId - the userId of the user whose items you want to find
* @returns {Object}
*/
async function getUserProfileInfo(userId) {
  const [userData, posts, albums, todos] = await Promise.all([
    getResourcePromise(`${apiURL}/users/${userId}`),
    getItemsByUserPromise(userId, 'posts'),
    getItemsByUserPromise(userId, 'albums'),
    getItemsByUserPromise(userId, 'todos')
  ]);
  if (!userData.username) {
    return { errorMessage: `User with id ${userId} was not found`, status: 404 };
  }
  return { username: userData.username, posts, albums, todos };
}

/**
* Gets us a post and its associated comment data by id
* @property {number} postId - the id of the post that you want to explore
* @returns {Object}
*/
async function getPostsWithComments(postId) {
  const [postData, commentsData] = await Promise.all([
    getResourcePromise(`${apiURL}/posts/${postId}`),
    getResourcePromise(`${apiURL}/comments?postId=${postId}`)
  ]);
  if (_.isEmpty(postData)) {
    return { errorMessage: `Post ${postId} was not found`, status: 404 };
  }
  return { postData, commentsData };
}

/**
* Posts a comment to the blog
* @property {number} postBody.postId - the id of the post you want to comment on
* @property {string} postBody.body - the body of the comment you want to post
* @property {string} postBody.name - the name that you want to post under
* @returns {Object}
*/
async function postComment(postBody) {
  const expectedProperties = ['body', 'name', 'postId'];
  // Micro optimization so we don't have to sort this array
  if (!_.isEqual(Object.keys(postBody).sort(), expectedProperties)) {
    return { errorMessage: 'Your Post Body does not contain all the necessary information', status: 400 };
  }
  // if the comment is empty
  if (!postBody.body.length) {
    return { errorMessage: 'Please enter a comment', status: 400 };
  }
  const commentResponse = await postResourcePromise(`${apiURL}/comments`, postBody);
  return { ...commentResponse };
}


export default { getUserProfileInfo, getItemsByUserPromise, getPostsWithComments, postComment };
