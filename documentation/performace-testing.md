# 📊 Lighthouse Performance Testing Guide

This project uses [Lighthouse CI (LHCI)](https://github.com/GoogleChrome/lighthouse-ci) to automate performance, accessibility, and best practices testing of the website.

---

## 🔧 How to Run the Test Locally

### 1. **Install dependencies:**

```bash
npm install --save-dev @lhci/cli
```
This install the lighthouse ci locally in the node_modules folder of the repository. You could also download this API globally to your system if you want to run it via the terminal. 

For simplicity, the instructions for the rest of this documentation will follow the first code where we locally install the dependency rather than globally.

```bash
npm install -g @lhci/cli
```

### 2. **Build and run the tests**

```bash
npm run build
npx lhci autorun
```

We have to build the project first as the test will be running ```npm run preview``` which basically will run a test on the build folder of the repository. 

As we're working with local dependencies, we have to run this via npx which should be installed for every node js projects. 

Successful running of the test will be shown in the terminal and generated files in a folder called **.lighthouseci**

### 3. **What files are generated**

There should be 4 files generated in the **.lighthouseci** folder: 3 js files and 1 html file. These files are the result of the test that was ran and these are auto generated.

- There should be a json file that has the same name as the html file. These are files to show the result on a website created by lighthouse ci. 

- There should be a file called links.json. By going to the link in this file, you should find clear analysis on the results of the autorun test.

- There should be an assertion-results.json file. This file compare the actual result to the assertion that we made in the config file (which will be explained below).

### 4. **The config file**

This file is called **.lighthouserc.cjs** and it should be in the **project-bitchboy** repository. 

```bash
ci.collect
```
This line tells lighthouse what to use to collect the data for the test results.

| Code               | Description     |
| -------------      | --------------------- |
| startServerCommand | Runs your site preview server before testing. In this case, it starts Vite's preview server.        |
|  url | The link of the website to test on. In our case, its the root page of the local site |
|  numberOfRuns | The number of time we run the test. For simplicity we only run once, but you can easily change this |
|  settings | Specific configuration of the test. For now, we only set the test to create the website in the laptop version |

```bash
ci.assert
```
This line assert the result of some of the test and will give you a warning in the terminal if one of the score is not above the score you determined.

You can easily change the minScore in the corresponding line

```bash
    assertions: {
        'categories:performance': ['error', { minScore: 0.3 }],
        'categories:accessibility': ['error', { minScore: 0.8 }]
    }
```

### 5. **The result**

Each report provides a score (0–100) in key categories:

- Performance: Page speed and optimization

- Accessibility: Screen reader and contrast support

- Best Practices: HTTPS, deprecated APIs, etc.

- SEO: Search engine discoverability

Key explanation for the scoring can be found on the website once you go to the link in the links.json file

## 🔧 Advice on optimizing the product

If you have run the test using Lighthouse, you can probably see that the performance score for this website is quite low. This is mainly due to the usage of quite the amount of dependency that this website has in order to create all the effects. Thus, we did some research and found a few methods you could potentially use to optimize the performance of the website.

### 1. **Lazy Loading**

If you run the project locally or deployed it using any platforms, once you go to the website itself, you can see that it takes a few seconds to fully load (about 6-7 seconds to be precise). This is because the website is fully loading all of its utility before showing the landing page. Therefore, you can simply apply a lazy load strategy to some of the code so that the main page appears earlier.

Here are our recommendations on which files to apply this strategy:

- Lanyard.jsx: This file is responsible for creating the 2 cards that you see on the Team page. As there is a lot of physics applied to these objects, quite the number of utilities were used to create the effects that this page has. Some of the dependencies include: ```@react-three/rapier, three, @react-three/fiber```. Thus, we would recommend starting with this file first.

- InteractivePage.jsx: This page uses a huge amount of components from the model itself to the UI effects created by animejs. Therefore, this is also a potential file to apply lazy loading.

### 2. **Split bundles using Vite’s ```manualChunks``` config**

```bash
 build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber', '@react-three/drei'],
          rapier: ['@react-three/rapier'],
        }
      }
    }
}
```

Add this code to the vite.config.js file.

This will create separate .js files (chunks) for:

- three

- @react-three/fiber and @react-three/drei

- @react-three/rapier

These chunks load only if the lazy-loaded component needs them.