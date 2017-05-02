import { expect } from 'chai';
import _ from 'lodash';
import blog from '../blog';

const { getItemsByUserPromise, getUserProfileInfo, getPostsWithComments, postComment } = blog;

describe('## Blog Functionality', () => {
  const exampleUserId = 1;
  describe('## Blog displays basic profile information on request', () => {
    const fetchableItems = ['posts', 'albums', 'todos'];
    fetchableItems.forEach((item) => {
      it(`should get you a users ${item}`, async () => {
        const items = await getItemsByUserPromise(exampleUserId, item);
        expect(items).to.be.an('array');
        expect(_.every(items), { userId: 1 }).to.equal(true);
      });
    });
    it('should retrieve all relevant user information', async () => {
      const userObject = await getUserProfileInfo(exampleUserId);
      const expectedProperties = [
        { property: 'username', expectedType: 'string' },
        { property: 'posts', expectedType: 'array' },
        { property: 'todos', expectedType: 'array' },
        { property: 'albums', expectedType: 'array' }
      ];
      expectedProperties.forEach((property) => {
        expect(userObject).to.have.property(property.property);
        expect(userObject[property.property]).to.be.an(property.expectedType);
      });
    });
    it('should return a not found status if user is not found', async () => {
      const notFoundId = 9999999;
      const userObject = await getUserProfileInfo(notFoundId);
      expect(userObject).to.have.property('status');
      expect(userObject).to.have.property('errorMessage');
      expect(userObject.status).to.be.eql(404);
    });
  });
  describe('## Blog allows you to get a specific posts information', () => {
    it('lets you view a post displaying the count of comments associated with it', async() => {
      const postsCommentsObject = await getPostsWithComments(exampleUserId);
      const expectedProperties = [
        { property: 'postData', expectedType: 'object' },
        { property: 'commentsData', expectedType: 'array' },
      ];
      expectedProperties.forEach((property) => {
        expect(postsCommentsObject).to.have.property(property.property);
        expect(postsCommentsObject[property.property]).to.be.an(property.expectedType);
      });
    });
    it('should return a not found status if post is not found', async () => {
      const notFoundId = 9999999;
      const postsCommentsObject = await getPostsWithComments(notFoundId);
      expect(postsCommentsObject).to.have.property('status');
      expect(postsCommentsObject).to.have.property('errorMessage');
      expect(postsCommentsObject.status).to.be.eql(404);
    });
  });
  describe('## You can comment on posts', () => {
    const testComment = { body: 'example comment', name: 'test name', postId: 2 };
    it('allows you to comment on a post', async () => {
      const commentResult = await postComment(testComment);
      expect(commentResult).to.have.property('name');
      expect(commentResult).to.have.property('body');
      expect(commentResult).to.have.property('postId');
      Object.keys(testComment).forEach((propName) => {
        expect(testComment[propName]).to.eql(commentResult[propName]);
      });
    });
    it('returns an error mesasge if your comment is missing a required prop', async () => {
      const requiredProps = ['body', 'name', 'postId'];
      requiredProps.forEach(async (propName) => {
        const badComment = _.omit(testComment, propName);
        const commentResult = await postComment(badComment);
        expect(commentResult).to.have.property('status');
        expect(commentResult).to.have.property('errorMessage');
        expect(commentResult.status).to.be.eql(400);
      });
    });
    it('returns an error message if comment is empty', async () => {
      const badComment = Object.assign(testComment, { body: '' });
      const commentResult = await postComment(badComment);
      expect(commentResult).to.have.property('status');
      expect(commentResult).to.have.property('errorMessage');
      expect(commentResult.status).to.be.eql(400);
    });
  });
});
