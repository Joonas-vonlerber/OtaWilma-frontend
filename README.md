# Otawilma - frontend

### Frontend for the OtaWilma project. Includes all the client side functionality such as theme editor and quality-of-life features for students.

![](/img/frontpage.png) The frontpage of Otawilma
<br>

## Share courses with your friends
#### Let's be real, we all want to share the same courses with our friends. However, the plans have a tendency to change, and it's too often you have to ask your friends to show you their selections
#### With Otawilma's friend-code system, you are able to generate one-time usable 'friend-codes', which allow you to see your friends' latest selections. With no limit to the number of friends you can share the courses with, you and your friend-group will be able to sync your selections without any issues. 
![](/img/tray.png) Course-tray view with some friend's selections visible

## Theme editor
#### Create your own themes and fully customize the look of your Wilma. With easy to use theme-editor, you are able to not only customize **every color**, but are also able to use custom backgrounds, further boosting your creative needs. With 25 theme slots, you aren't running out of space either.
![](/img/2.png) Custom student made theme
![](/img/1.png) Another student made theme

## Easier course selections

#### OtaWilma allows you to filter the courses you want to see in your tray. You can also set a list of teachers to make sure you are only shown courses that are taught by your favorite ones. There is also built-in selection-helper which makes sure you cannot make invalid selections (select overlapping courses, try to join on full courses etc.)
![](/img/filter.jpg) Same tray as [in this example](#share-courses-with-your-friends), but only the subjects I might want to study on my sophomore year are shown.


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Requirements

To compile this, you need the file `config.json` in the project `src` directory. Its default contents are:

```json5
{
    "versionLabel": "LOCAL BUILD",
    "wilmaApi": "https://wilma.otawilma.fi/api",
    "otaWilmaApi": "https://api.otawilma.fi/api",
    "signature": "signature_here" // not security critical; only used for local password storage on frontend.
}
```

## Buiding container

Container for frontend can be generated with:
```bash
docker build . -t otawilma-frontend
```

Running container on port 8080:
```bash
docker run --rm -p 8080:80 otawilma-frontend
```