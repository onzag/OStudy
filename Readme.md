# OStudy

See this repository result at https://onzag.github.io/OStudy

## Sacrifices.

Considering the timeframe of 6 hour things have to be sacrificed.

1. Unit testing, testing is important indeed, but my code is highly modular and due to that I tend to make few mistakes, users require an application, I believe testing can be done afterwards.
2. Linting, linting only makes code beautiful, but as long as you follow a strong style you don't lose code quality, linting can also be done afterwards.
3. An external database, making connections to an external database will take some time, so instead I'd use sqlite.
4. A beautiful design, I'm not an UI/UX designer, if I attempt to do so, I'll be taking quite a bit of time on trying to create beautiful designs.
5. React.js, reactjs allows you to create a quite nice code structure using redux, it's easy to mantain and to debug, especially with bigger applications, this project goes too fast and it's too small to create a react environment, check the project N26ATM if you want to assure my react skills.
6. Security, there's no way I can implement a token based security system in 6 hours, but in fact, security is not part of the scope of this task.
7. Compatibility, even when I try to load a polyfill, I cannot guarantee that this app will work in old browsers.
8. Documentation, documenting is also one of those nice to have things, but they don't really give any inmediate value to the customer but to the dev team, it can be added afterwards.
