import { expect } from 'chai';
import renderers from '../renderers';
import helpers from './helpers';

const { renderProfileInfo, displayRecentPosts, displayPostTitle, userCommentFeedback, viewingPostWithComments, renderErrorMessage } = renderers;
describe('## Render Functionality', () => {
  const { posts, albums, todos, comments } = helpers;
  const profileInfo = {
    username: 'Test Person',
    posts,
    albums,
    todos,
    comments
  };
  const [, postsLength, albumsLength, todosLength, commentsLength] = Object.keys(profileInfo).map(key => profileInfo[key].length);
  describe('## Blog displays basic profile information on request', () => {
    it('displayPostTitle should display the post title with the correct format', async() => {
      const randomPost = posts[Math.floor(Math.random() * posts.length)];
      expect(displayPostTitle(randomPost)).to.eql(`Post ${randomPost.id}: ${randomPost.title}`);
    });
    it('displayRecentPosts should display recent posts in the correct format', async () => {
      const numberOfPosts = 3;
      expect(displayRecentPosts(posts, numberOfPosts)).to.be.a('string');
    });
    it('should display the right username and counts for a user profile', async () => {
      // eslint-disable-next-line
      expect(renderProfileInfo(profileInfo)).to.eql(`${profileInfo.username} has ${postsLength} posts, ${albumsLength} albums, and ${todosLength} todos
${displayRecentPosts(posts, 5)}`);
    });
  });
  describe('## Blog should let you view posts and comments', () => {
    it('user comment feedback should show the user the comment they made', async () => {
      const exampleComment = 'You are amazing';
      expect(userCommentFeedback(exampleComment)).to.eql(`You commented "${exampleComment}"`);
    });
    it('should allow you to view posts with a comment', async () => {
      expect(viewingPostWithComments({ postData: posts, commentsData: comments }))
        .to.eql(`Viewing post ${posts.title} which has ${commentsLength} comments`);
    });
  });
  describe('## Blog should display relevant error messages', () => {
    const constantErrorObj = { errorMessage: 'this is an example', status: 404 };
    it('should render the correct error string given the right error object', async () => {
      expect(renderErrorMessage(constantErrorObj)).to.eql(`${constantErrorObj.errorMessage} status code: ${constantErrorObj.status}`);
    });
  });
});

