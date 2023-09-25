## Samir
 
 [ ] GET MOMENT/momentID
    - API error with middleware
    - req.users does not seem to be sent / transmitted (optional chaining brings up 'unauthorized')
    - why does the result still get returned if there was an error? should not be possible with the middleware
    - works fine in insomnia. Token problem?



 [X] Plan if we get kicked off? Can you do 2 meetings in a row? (missed week of Sept 4 from reschedule)
    [X] If not, get course extension...

[X] Feedback on DB structure. 

[X] REST API - NESTING routes & SEPARATION OF CONCERNS

conventions for nested resources. Requiring middleware authorization. Need additional request to find username if trying to only edit a moment as an admin. Concept of OWNERSHIP. 
    - changing authorization acordingly to use req.body instead of request parameter / in addition
    - can circumvent with 'username' json if on own route
    - now im getting into putting authorization logic in route, not a separation of concerns. need access to response
[stackOverflow](https://stackoverflow.com/questions/20951419/what-are-best-practices-for-rest-nested-resources)

[ ] AWS
    [ ] Bucket is 'publicly available'. Is this OK?
    [ ] Signed / unsigned URLs
    [ ] Using cloudfront? How about just using the returned URL?
    [ ] confusion over useing Async / await for s3 function?
    [ ] AWS functions: error handling in function or in route logic?
    [ ] create AWS class vs helper functions or modules
    [X] am I using v2 or v3?

[x] Beyond Crud?

[ ] do testing during? or after?
[ ] router.use(middleware) does not work - shows unauthorized

[ ] Test AWS functions? / mocking?
[ ] Mocking AWS media uploads for Moment POST / PUT

[ ] SQL - when are pre checks necessary? Join tables? DB should give own errors
[ ] Get all moments - on user model?
    - how to query all of the media for each moment in one large query?
[ ] Cascade / auto delete tag if there are none joined to it

[ ] Naming related helper modules. export as object? vs. using static class methods
