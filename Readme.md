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

## Known limitations

Due to the sacrifices, (which were huge) that were required to perform in order to be able to complete this activity in time the following are true.

1. Because of the way that setting avaliability works (it's one big chunk of data) and the fact that the data is not realtime, loading and then changing the avaliability will cause the avaliability
to be set to whatever the user changed, for example, if you are a teacher and open a slot, then a student checks the teacher week, then the teacher closes the slot, then the student takes the slot
it will appear as active, as the last action that was performed from the point of view of either student or teacher.
2. The interface is completely cluttered.
3. The application is not scalable, it doesn't cluster, nor takes data loads properly.
4. The server side is open to DDoS attacks if put directly on a VM (no cloudflare or some other protection mechanism).

## Solutions

1. The client side has to be rewritten using a proper paradigm, reactjs, rxjs, angular, htmlelements... etc... to make it client side scalable.
2. The server side database has to take a complete advantage of the SQL properties and use the calendar as a model.
3. The server side has to be data protected, and avoid unwanted changes.
4. The server side should have a token based security mechanism.
5. The server side should be clustered, standard clusters with a nginx layer or docker/kubernetes.
6. an API client should be written for the specific programming language (JavaScript) that makes an easier comsumption rather than doing the fetch calls directly.
