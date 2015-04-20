devkit-application-template
===========================

Initial file structure for Gameclosure Devkit applications.

Includes an empty folder structure that matches the devkit defaults
and a minimal Application.js file with a "Hello, world!" text view.


You can specify a different initial template for new devkit applications
by adding the `--git-template` paramater to `devkit init` and passing in
a path to a git repository.

~~~
devkit init newproject --git-template https://github.com/gameclosure/devkit-application-template
~~~

### Development recomendation

#### - Create the new project
by running `git clone https://github.com/gameclosure/template-scene`
For the rest of this guide, it will be assumed that you have `cd`ed into the fresh clone

#### - Run `devkit install`
This will clone all the required modules into the `modules` folder.  Unfortunately they will likely not be at the correct checkouts.

#### - Fix the checkout
by running `cd modules/devkit-scene && git checkout master`

#### - Register the project
by running `devkit register`. You should now be ready to develop all the cool things you want.

#### - Optional: Developing a devkit-scene dependency
devkit installs modules into the `modules` folder, and treats them as a git repository.  However, devkit module dependencies are handled by npm, which does not preserve their git-ness.

It is recommended that you have a local copy somewhere else, and link in dependency-dependencies.  For example, if you wanted to develop devkit-entities, you would run the following commands:

    cd ~/workspace
    cd template-scene/modules/devkit-scene/ && rm -rf node_modules/devkit-entities
    git clone https://github.com/gameclosure/devkit-entities
    cd devkit-entities && npm install && npm link
    cd template-scene/modules/devkit-scene/ && npm link devkit-entities

#### - Optional: Developing a devkit-scene exmaple
The easiest way to do this is with a symlink.  For example, if you wanted to develop the Swarm example, you would run the following commands:
  
    cd src
    rm Application.js
    ln -s ../modules/devkit-scene/examples/Swarm.js Application.js

