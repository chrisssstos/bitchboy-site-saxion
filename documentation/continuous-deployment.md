# Continuous Deployment (CD)
As mentioned in the [README.md](../.github/README.md) in the .github directory, the Client uses Netlify which makes continuous deployment unnecessary as simply inserting the repo into Netlify has it automate continuous deployment.

However, in the chance that the client wants to add continuous deployment for any future reasons, this document serves as a guide on how to implement it in GitLab and GitHub.

## GitLab

```yml
stages:
  - install
  - test
  - build
  - deploy
```

Add **- deploy** to the stages.

```yml
deploy:
  stage: deploy
  script:
    - echo "Deploying to Netlify"
    - npm install -g netlify-cli
    - netlify deploy --auth=$NETLIFY_AUTH_TOKEN --site=$NETLIFY_SITE_ID --prod --dir=project-bitchboy/dist
  needs:
    - build
  only:
    - main
```

Add this to the very bottom of the [.gitlab-ci.yml](../.gitlab-ci.yml).

**NETLIFY_AUTH_TOKEN** is found at this [link](https://app.netlify.com/user/applications#personal-access-tokens).

**NETLIFY_SITE_ID** is found from Netlify dashboard → Site settings → Site information.

In GitLab, go to Settings → CI/CD → Variables and add the variables with their corresponding names and values.

## GitHub

```yml
deploy:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3

      - name: Download build artifact
        uses: actions/download-artifact@v4
        with:
          name: build-dist
          path: project-bitchboy/dist

      - name: Install Netlify CLI
        run: npm install -g netlify-cli

      - name: Deploy to Netlify
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
        run: netlify deploy --auth=$NETLIFY_AUTH_TOKEN --site=$NETLIFY_SITE_ID --prod --dir=project-bitchboy/dist
```
Add this to the very bottom of [node-ci.yml](../.github/workflows/node-ci.yml) within the **jobs** bracket.

Add **NETLIFY_AUTH_TOKEN** and **NETLIFY_SITE_ID** in GitHub repo → Settings → Secrets and variables → Actions → New repository secret.

