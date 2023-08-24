# Mobile Painter App

**This app was created using Expo. The link to the snack is attached.

The Painter App allows user to create original drawings with a limited set of tools akin to a limited, mobile version of a Microsoft Paint. There are five tools the artist has to their disposal: brush, rectangle, ellipse, line, and eraser. In addition to these tools, there is a "brush size" slider that operates the stroke width for the brush as well as the thickness of the rectangles and circles. There is also a color wheel, which is imported from React Native Wheel Color picker which allows the user to pick any color they choose. There is also a "Rounded Borders" slider that changes the border radius for the rectangle tool, allowing the artist to create rounded borders on their app. There is also a switch for filling the shape in order to create full shapes for the rectangle and ellipses. There is also an undo button in the top right that lets the user rewind from their previous mistakes. On the top left, there is a "Save and Exit" button and a "Save" button. These buttons update the Async Storage array that holds the users saved projects. This way, the artist can create multiple projects and save them all on the same device. I am displaying the artists' projects via a Flatlist, similar to how I did it for the Weather App. The tools provided to the user are simple, but functional and essential.

LIMITATION #1: I could have used lists and loops more effectively in certain parts of the app to simplify the code. Most notably, the toolbar at the bottom row is displayed via seperate TouchableOpacities, instead of a FlatList item. I started the app without the FlatList, and by now I have individualized each item so much to the point where it would be exhausting and time-consuming to change everything into a FlatList afterwards. However, I acknowledge that my code could be more efficient.

LIMITATION #2: I feel that my aesthetic and design of the app is somewhat basic compared to my previous apps. My original idea for the main Project screen was for the little boxes next to the project title to display a preview of the drawing that the user has created in that file. However, I could not figure out how to do this properly. The main drawback of my app's aesthetic, however, is the color scheme. Almost all my other apps use a darker color scheme utilizing darker shades because I generally believe that those colors can create a sleeker, more minimalist look. However, I can justify not utilizing these color schemes for this app because it is a painter app, so the white screen and lighter colors are better for the artist. 

LIMITATION #3: When the artist uses the rectangle tool and are initially clicking and dragging to create the shape, the initial spot that the user presses on is missing a corner when the user is holding down their touch. This is a minute issue, however, because the missing corner fills itself in when the user releases their touch. 

LIMITATION #4: When the artist uses the ellipse tool and are initially clicking an dragging to create the shape, the preview is that of a rectangle. The reason for this is because I do not know how to create a Path component with a path that looks like an ellipse. However, when the user releases their touch, the shape becomes an accurate representation of an ellipse.

LIMITATION #5: If the user a rectangle, circle, or line in such a way where it underlaps the top buttons (save, exit, and undo), these buttons are no longer going to be able to be pressed. */

When you're ready to see everything that Expo provides (or if you want to use your own editor) you can **Download** your project and use it with [expo-cli](https://docs.expo.io/get-started/installation).

All projects created in Snack are publicly available, so you can easily share the link to this project via link, or embed it on a web page with the `<>` button.

If you're having problems, you can tweet to us [@expo](https://twitter.com/expo) or ask in our [forums](https://forums.expo.io/c/snack).

Snack is Open Source. You can find the code on the [GitHub repo](https://github.com/expo/snack).
