Require Define
=================================

<hr>

## Require Define

* Test Suite
  - npm run testAsync runs the test suite for the async blog.

* Explanation

  Creating an example of require and define by using es6 classes and the singleton pattern. This way we do not have to rely on a global
  shared function space and still allowing the importing of the require and define functions. By using closures we can create generator
  functions that have access to the singleton. Meaning when we use the functions defined in the class they will both share the same function name space.
