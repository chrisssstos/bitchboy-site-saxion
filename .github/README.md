# GITHUB WORKFLOW

This folder main purpose is to create an automatic CI (Continuous Integration) pipeline or workflow for you whenever you want to put a new function in the ```main``` branch.

This workflow is based on our GitLab pipeline which is already working correctly, as the client wanted the repository on GitHub.

## Explanation

There are 3 stages to the workflow:

- The first stage installs all the dependencies needed
- The second stage runs the test we have written for each page of the website 
- The third stage builds the project

**Note**:

CD (Continuous Deployment) is not implemented as the client will be deploying the website on Netlify on their own. Netlify provides a lot of support when it comes to CD. Thus, this workflow is only for CI.

In the case that the Client wants to implement CD, consult [continuous-deployment.md](../documentation/continuous-deployment.md).