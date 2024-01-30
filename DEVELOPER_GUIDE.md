# Developer guide

This document is intended to provide information about the project structure, best practices and other useful information for contributors.

## Prerequisites

TBA

## Project structure

TBA

## How to run

TBA

## Workflow

Our development process follows the Gitflow workflow to maintain a structured and stable codebase. We utilize three main types of branches:

- `main`-branch: This is a protected branch, which should always be in working condition. You can consider this to be the "production"-branch. After a sprint, we will merge the `dev`-branch into the `main`-branch.
- `dev`-branch: This is the branch we are working on under a sprint. You will branch out of `dev` and do a merge request to merge back into `dev`.
- Feature branches: This is the name of the branches that you are actively working on. When you are branching out of `dev`, you are creating a feature branch.
The name of a feature branch should follow this format `issue-number/short-description-of-task`. Example: `43/implement-searching-functionality`.

During a sprint, you will only need to consider the `dev`-branch and the feature branches. More on branches further down the guide.


## Issues

You will find all issues in the [issue boards](https://gitlab.stud.idi.ntnu.no/tdt4140-2024/produktomraade-3/gruppe-48/flashy/-/boards). We use issues to monitor our progress in a sprint and we have split the issue board into four parts: `Product Backlog`, `Spring Backlog`, `In Progress`, and `Closed`. During a sprint, you only need to consider the last three.

When you are creating a new issue remember to do the following:
- Create a title which briefly explains the issue (example: `Implement filter functionality`)
- [Optional] Provide more information on the issue in the description
- Assign labels
- Assign milestone (sprint iteration)

When moving an issue from the `Sprint Backlog` to `In Progress` remember to:
- Assign it to someone (like yourself)
- [Optional] Update the description with how you plan to solve the issue


## Branching

When you plan to start on a new issue, you need to create a new branch (never make changes directly to `dev` or `main`). The branch name should be the issue number followed by a short description of the issue. For example, if you are working on issue #1, you should create a branch named `1-implementing-new-feature`. This will ensure that the branch is automatically linked to that issue, and add some QOL improvements when creating merge requests.

### Creating a new branch

This is a step by step guide on how to create a new branch. 
This developer guide will show how to do it with the terminal. You can do all these commands directly in VSCode by entering `Ctrl+Shift+P` or `Cmd+Shift+P` and typing what you want to do, like `Create branch`.

1. First you need to be on the `dev`-branch (or the branch you want to branch out from). You can see which branch you are on by running `git branch` and you will be on the branch with the star next to it (or check the bottom left corner in VSCode). If you are on the wrong branch, use `git checkout <name-of-branch>` to change branch.
```
(See which branch you are currently on)
> git branch

(Change branch, fill in <name-of-branch> without the "<>")
> git checkout <name-of-branch>
```

2. Now you can branch out into your own feature branch. Do this by running this command in your terminal. (Ignore the "<>" when typing your branch name). This will create a new branch with the name you specified, and automatically switch to that branch. You can now make changes to the code, and commit them to the branch. 
```
git checkout -b <issue-number/new-branch-name>
```

### Updating a branch with content in `dev`

Before you create a merge request, you should make sure that your branch is up to date with the `dev` branch. This is to ensure that there are no merge conflicts when you create the merge request. \
The code block below assumes you start on your own branch and want to update it with main.

```
(Assuming you are on your own branch)
> git checkout dev
(Now you are on the dev branch)

> git pull
> git checkout <your-branch-name>
(Now you are on your own branch again)

> git merge dev

(There may be merge conflicts here, if so, resolve them (resolving them in VSCode is recommended))

(Now you can push your changes to remote without any merge conflicts)
> git push
```

## Merge requests (or pull requests)

When you are done with your changes, and want to merge your branch into `dev`, you will need to create a Merge Request. This is done by going to the "Merge requests" tab on GitLab, and clicking the "New merge request" button. You will then be presented with a page where you can select the branch you want to merge into (which is `dev`), and the branch you want to merge from. You can then click the "Create merge request" button. You will then be presented with a page where you can write a description of the changes you have made. If this PR closes an issue add this in the description: `Closes #issue-number`, this will automatically close the issue when the merge request is merged. 

A pipeline will start to run on the merge request, which will run tests and check that your project follows the styling format. The pipeline needs to be successful before you are allowed to merge.

Before you are allowed to merge, you will need approval of one other team member. Assign at least one other team member, or notify them in another way that your Merge Request is ready for review. 

When the review is done, you are ready to merge into `dev`. Click the "Merge pull request" button, and then the "Confirm merge" button (pick the default option (not squash merge)). Congratulations, you have now merged into `dev` and contributed to the project 🚀.

## Milestones

We will use milestones to track sprint iterations. For each sprint iteration, we will have new milestone in GitLab.Utilizing milestones allows us to set specific goals, plans and allocate tasks, and monitor the overall advancement of our project.

## Conventions

(This is a suggestion, we can discuss this in the next meeting)
We will follow [Google's TypeScript styling guide](https://google.github.io/styleguide/tsguide.html#naming).

### Linters

In this project, we utilize ESLint as our linter to ensure code quality and consistency. A linter, like ESLint and Checkstyle, performs static code analysis to find syntax errors, coding style violations and other common mistakes. Linters help developers maintain code quality, enforce consistent coding practices, and catch errors early in the development process.

### Formatters

TBA:
Are we going to use Prettier?

### Naming conventions

Which type of style should be used for what is described below:

- `PascalCase`: Classes, interfaces, types, enums and components
- `camelCase`: Variables, parameters, functions, methods and properties
- `CONSTANT_CASE`: Global constant values

### Commenting

There are two types of comments, JSDoc (`/** ... */`) and non-JSDoc ordinary comments (`// ... ` or `/* ... */`).

- Use `/** JSDoc */` comments for documentation, i.e. comments a user of the code should read.
- Use `// line comments` for implementation comments, i.e. comments that only concern the implementation of the code itself.

JSDoc comments are understood by tools (such as editors and documentation generators), while ordinary comments are only for other humans.

### Other best practices

- You should never use "[magic numbers](https://stackoverflow.com/questions/47882/what-is-a-magic-number-and-why-is-it-bad)", instead create a constant variable and reference it instead, this makes the code clearer and easier to read.
- If you find yourself nesting a lot of if-statements, you should consider using the [guard clause](https://codingbeautydev.com/blog/stop-using-nested-ifs/?expand_article=1) pattern (invert the if-statement and return early).
- Single-responsibility principle: A component should only have one responsibility/purpose. If a component has multiple responsibilities, it should be split into multiple component.
- DRY (Don't Repeat Yourself) principle: Reduce repetition in code as much as possible.