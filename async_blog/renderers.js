/**
* Displays a post and the title of the post
* @property {string} post.id - The id of the post
* @returns {string}
*/
function displayPostTitle(post) {
  return `Post ${post.id}: ${post.title}`;
}

/**
* Displays a list of the most recent posts using the displayPostTitle function and uses a new line to seperate them
* @property {array} posts - an array of posts to render
* @property {number} number - the amount of posts to render from the list.
* @returns {string}
*/
function displayRecentPosts(posts, number) {
  return posts.slice(posts.length - number, posts.length).reverse().map(post => displayPostTitle(post))
  .reduce((curr, prev) => prev + '\n' + curr, ''); // eslint-disable-line
}

/**
* Renders a user's profile info
* For this application we will assume that 5 is the number we always want to display
* @property {string} userInfo.username - the username of the user
* @property {string} userInfo.posts - the posts associated with the user
* @property {string} userInfo.albums - the albums associated with the user
* @property {string} userInfo.todos - the todos associated with the user
* @returns {string}
*/
function renderProfileInfo(userInfo) {
  if (userInfo.errorMessage) {
    return renderErrorMessage(userInfo);
  }
  const { username, posts, albums, todos } = userInfo;
  return `${username} has ${posts.length} posts, ${albums.length} albums, and ${todos.length} todos
${displayRecentPosts(posts, 5)}`;
}

/**
* Gives the user confirmation of which post they are viewing and the number of comments associated with it
* @property {string} renderData.postData - the post the user wants to see
* @property {array} renderData.commentsData - an array of comments that the user wants to see
* @returns {string}
*/
function viewingPostWithComments(renderData) {
  if (renderData.errorMessage) {
    return renderErrorMessage(renderData);
  }
  const { postData, commentsData } = renderData;
  return `Viewing post ${postData.title} which has ${commentsData.length} comments`;
}

/**
* Gives the user confirmation of the comment they just made
* @property {string} comment - the comment that the user made
* @returns {string}
*/
function userCommentFeedback(comment) {
  return `You commented "${comment}"`;
}

/**
* returns an error message each part of the application defines its own errorMessage and status code
* but this function is used to render that message
* @property {string} errorObj.errorMessage - the error message attached to an action
* @property {number} errorObj.status - an http-status code
* @returns {string}
*/
function renderErrorMessage(errObj) {
  return `${errObj.errorMessage} status code: ${errObj.status}`;
}

export default { displayPostTitle, displayRecentPosts, viewingPostWithComments, userCommentFeedback, renderProfileInfo, renderErrorMessage };
