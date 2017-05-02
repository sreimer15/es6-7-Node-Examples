ASYNC BLOG
=================================

<hr>

## Async Blog

* Explanation

  Creates a sample cli that emulates a blog. Allows the user to get profile information, view posts, and make comments. 
  
  Takes advantage of ES6 syntax, generator functions the fetch api as well as async await to provide the functionality. The process is a generator function that constantly yields a prompt for the user and uses that prompt to create a feedback loop. In order to increase modularity of the code I created two sets of functions. A "blog" file that determines core app functionality and a renderers file that handles displaying information to the user. This seperation of concerns allowed for more modular testing. To handle our variety of fetch requests we create promises that we later resolve together using Promise.all to improve modularity, and readability. This promise style also improves the testing situation.

  I decided against explictly throwing errors and instead throwing error like objects because the limited actions that the user could make would make an explict error a bad user experience, and of not much use. Since I would be coercing the errors into a specific error string anyway I decided to return error like objects if a pre condtion failed.


* Test Suite
  - npm run testAsync runs the test suite for the async blog.
