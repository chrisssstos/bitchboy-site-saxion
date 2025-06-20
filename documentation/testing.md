# 📊 Testing Guide

For this part of the testing, we use vitest - the testing library of the vite framework (that we use for this project) to create the tests.

---

## 🔧 How to Run the Test Locally

### 1. **Install dependencies:**

This should already be installed once you do ```npm install``` in the project-bitchboy repository.

### 2. **Run the test**

In the project-bitchboy repository, run this command:

```bash
npx vitest
```

This should automatically search for files with the .test.jsx extensions in the whole repository and run them. Upon running the test, it should clearly show you which tests pass/fail and thus you can improve them.

### 3. **Our test**

Currently, we have created a test file for each of the pages that we have, so 5 tests in total. You can find these tests in the ```test``` folder. Each of the test in these test files have clear naming, indicating what each of them are testing. In addition, we have added a few comments to help you better understand what the tests are doing.

### 4. **Adding your own test**

Writing your own test should not be too hard, please follow this guideline for more information: https://vitest.dev/guide/

A few tips:
- Add this comment line to the top of your tests ```/* eslint-env vitest */```
- Name your test clearly
- Mock is one of the best functions of Vitest as it helps a lot with testing with heavy objects, you can see we use ```vi.mock``` quite often in our tests as most of the component are quite heavy

Limitations:

For now we have not found a way to create an automate test that could successfully test the functions of the model on the Interactive page. Currently, we are just testing whether the model is rendered correctly. 