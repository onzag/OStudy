# OStudy

See this repository result at https://onzag.github.io/OStudy

## Sacrifices.

Considering the timeframe of 6 hour several things have to be sacrificed.

1. Unit testing, testing is important indeed, but my code is highly modular and due to that I tend to make few mistakes, users require an application, I believe testing can be done afterwards.
2. Linting, linting only makes code beautiful, but as long as you follow a strong style you don't lose code quality, linting can also be done afterwards.
3. An external database, making connections to an external database will take some time, so instead I'd use sqlite.
4. A beautiful design, I'm not an UI/UX designer, if I attempt to do so, I'll be taking quite a bit of time on trying to create beautiful designs.
5. React.js, reactjs allows you to create a quite nice code structure using redux, it's easy to mantain and to debug, especially with bigger applications, this project goes too fast and it's too small to create a react environment, check the project N26ATM if you want to assure my react skills.
6. Security, there's no way I can implement a token based security system in 6 hours, but in fact, security is not part of the scope of this task.
7. Compatibility, even when I try to load a polyfill, I cannot guarantee that this app will work in old browsers.
8. Documentation, documenting is also one of those nice to have things, but they don't really give any inmediate value to the customer but to the dev team, it can be added afterwards.
9. Server side clustering, includes docker or kubernetes usage, it takes time to setup.
10. Complete database modeling, due to the limited time, I'll take some modeling shortcuts.
11. Realtimeness, there's no way to implement a realtime connection with the limited time to show how slots are taken by other students.
12. Data security, no data checkups are being done to avoid bad altering of data so it can happen, the feedback should also be given by realtimeness,
eg, a non-updated student can take a slot that was previously taken by another student, this is a limitation.
13. Endpoint security, endpoints should be secured for usage by their intended users, this can be done using JWT, but there's not enough time to implement these.
14. Endpoint parameter security, endpoints should be argument secured, and avoid to run and throw a 400 error when bad parameters are given.
