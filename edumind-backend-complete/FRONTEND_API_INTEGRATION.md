# Frontend/backend integration

The existing frontend ZIP already works with:
- POST /api/auth/login
- POST /api/auth/register
- GET /api/auth/me
- POST /api/tutor/chat
- GET /api/tutor/conversations
- GET /api/tutor/conversations/:id/messages
- POST /api/quizzes/generate
- GET /api/documents

This backend additionally provides:

## Dashboard
GET /api/dashboard

## Profile
PATCH /api/auth/me
Body:
{"name":"Student","grade":"B.Tech CSE","subjects":["DSA"],"learningGoals":["Build projects"]}

## Documents
POST /api/documents/upload
multipart/form-data:
file=<PDF>
title=<optional>
subject=<optional>

## Quiz
GET /api/quizzes
GET /api/quizzes/:id
POST /api/quizzes/:id/submit
Body:
{"answers":[0,2,1,3,0]}

## Study planner
GET /api/study
POST /api/study
PATCH /api/study/:id
DELETE /api/study/:id

## Courses
GET /api/courses
POST /api/courses/:id/enroll
PATCH /api/courses/:id/progress

## Progress
GET /api/progress/summary

## Career
GET /api/career/paths
POST /api/career/recommend
