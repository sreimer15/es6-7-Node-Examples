import readline from 'readline';
import blog from './blog';
import renderers from './renderers';

const { renderProfileInfo, viewingPostWithComments, userCommentFeedback } = renderers;
const { getUserProfileInfo, getPostsWithComments, postComment } = blog;

const rl = readline.createInterface(process.stdin, process.stdout);

function handleFeedback(message, renderer) {
  if (message.errorMessage) {
    console.log(renderer(message));
    rl.close();
    return;
  } else {
    console.log(renderer(message));
    return renderer(message);
  }
}

async function *blogGenerator() {
  const userId = yield 'pass me a user id to find: ';
  const userProfileInfo = await getUserProfileInfo(userId);
  handleFeedback(userProfileInfo, renderProfileInfo);
  const postId = yield 'which post id do you want me to find? ';
  const postsWithComments = await getPostsWithComments(postId);
  handleFeedback(postsWithComments, viewingPostWithComments)
  const comment = yield 'what comment do you want to post? ';
  const name = yield 'what name do you want to post under? ';
  const commentObj = { body: comment, postId, name: name }
  const commentPost = await postComment(commentObj);
  handleFeedback(commentPost.body, userCommentFeedback)
  console.log('thank you for posting!')
}

async function runBlog() {
  // Basically write tests for everything now
  const newBlog = blogGenerator();

  const firstPrompt = await newBlog.next();

  rl.setPrompt(firstPrompt.value);
  rl.prompt();
  rl.on('line', async (line) => {
    const newPrompt = await newBlog.next(line);
    if (newPrompt.done) {
      rl.close();
    }
    rl.setPrompt(newPrompt.value);
    rl.prompt();
  }).on('close', () => {
    console.log('thank you for trying!');
    process.exit(0);
  })
}

runBlog();
